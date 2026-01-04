// ==UserScript==
// @name        刷课辅助
// @namespace
// @match     *://course.sceouc.cn/CourseStudy.ashx*
// @grant       none
// @version     0.3
// @author      -
// @description 2021/4/10下午4:02:51
// @run-at document-start
// @namespace
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/424967/%E5%88%B7%E8%AF%BE%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/424967/%E5%88%B7%E8%AF%BE%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

const hackAddEvent = () => {
  const _addEvent = window.addEventListener;
  const myHackEvent = (ename, evt, opt) => {
    const blackList = ['blur', 'keydown']; // 拦截的事件名称列表
    if (typeof opt !== 'object' || typeof opt !== 'boolean') {
      // 第三个参数如果不传就给个默认
      opt = {
        capture: false,
        once: false,
        passive: false
      };
    }
    if (typeof evt !== 'function') {
      return;
    }
    if (blackList.includes(ename)) {
      // 拦截事件
      console.log(`已拦截${ename}事件`);
      return;
    }
    _addEvent(ename, evt, opt); // 调用原方法
  };
  window.addEventListener = myHackEvent;
};

hackAddEvent();

document.onkeydown = null;

// 加载vue文件
const loadVue = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = '//lib.baomitu.com/vue/3.2.31/vue.global.prod.min.js';
    script.onload = () => {
      resolve();
    };
    document.head.appendChild(script);
  });
};

const renderEl = pageData => {
  const template = `
  <div id="c_video_ctrl">
    设置
    <div class="wrapper">
      <p>
        <strong>课程信息</strong>
        <div class="-wrapper-box">
          <span>{{courseInfo.name}}</span><br>
          <span>共{{courseInfo.total}}节，当前第{{courseInfo.current}}节</span>
        </div>
      </p>
      <p>
        <strong>视频信息</strong>
        <div class="-wrapper-box" style="display: flex; align-items: center; justify-content: center;">
          <span>
            <input class="input-box" type="number" min="10" :max="videoInfo.duration" step="10" v-model="videoInfo.myTime" /> / {{videoInfo.duration}}
          </span>
          <button type="button" v-if="videoInfo.duration" @click="startTask">刷课</button>
        </div>
        <div class="-wrapper-box" style="padding-top: 15px;">
          <span>{{msg}}</span>
        </div>
      </p>
    </div>
  </div>
  `;
  const vueRoot = document.createElement('div'); // 创建根节点
  vueRoot.id = '__vue-root';
  document.body.appendChild(vueRoot);

  const app = Vue.createApp({
    el: '#c_video_ctrl',
    template: template,
    data() {
      return {
        courseInfo: {}, // 课程信息
        videoInfo: {}, // 视频信息
        msg: ''
      };
    },
    methods: {
      getCourseInfo() {
        const { course, courseList } = this.pageData.courseInfo;
        if (!course) {
          return;
        }
        // 正则匹配《》中的内容
        const reg = /《(.*)》/;
        const result = reg.exec(course.innerText);
        // 正则匹配query参数中的couid
        const queryReg = /id=(\d+)/;
        const courseId = queryReg.exec(course.href)[1];

        let currentIndex = 0;
        const courses = Array.from(courseList).map((item, index) => {
          const { className } = item;
          if (className.includes('current')) currentIndex = index;
          const { href, innerText } = item.children[0];
          const id = item.attributes.olid.value;
          return {
            name: innerText,
            url: href,
            id
          };
        });

        this.courseInfo = {
          name: result[1],
          url: course.href,
          id: courseId,
          current: currentIndex + 1,
          total: courses.length,
          courses
        };
        console.log(this.courseInfo, 'this.courseInfo');
      },
      getVideoInfo() {
        if (typeof CKobject === 'undefined') return;
        const totalTime = CKobject._K_('totalTime');
        if (!totalTime)
          return (this.msg = '未获取到时长信息，请确认是否在视频页面');
        const duration = +totalTime.innerHTML;
        this.videoInfo = {
          duration,
          myTime: duration // 默认设置为最大时间
        };
      },
      startTask() {
        if (!this.videoInfo.myTime) return (this.msg = '请输入刷课时间');
        // debugger;
        if (
          this.videoInfo.myTime > this.videoInfo.duration ||
          this.videoInfo.myTime < 10
        )
          return (this.msg = '请输入正确的刷课时间，不能小于10');

        this.msg = '';
        this.sendData()
          .then(() => {
            this.msg = '刷课成功';
          })
          .catch(() => {
            this.msg = '刷课失败';
          });
      },
      sendData() {
        return new Promise((resolve, reject) => {
          const couid = this.courseInfo.id;
          const olid = this.courseInfo.courses[this.courseInfo.current - 1].id;
          const studyTime = this.videoInfo.myTime;
          fetch(
            `/Ajax/StudentStudy.ashx?couid=${couid}&olid=${olid}&studyTime=${studyTime}&playTime=${
              studyTime * 1000
            }&totalTime=${this.videoInfo.duration * 1000}`
          )
            .then(res => {
              resolve(res);
            })
            .catch(err => {
              reject(err);
            });
        });
      },
      init() {
        this.getCourseInfo();
        this.getVideoInfo();
      }
    },
    mounted() {
      this.init();
    }
  });
  app.config.globalProperties.pageData = pageData;
  app.mount(vueRoot);
};

const renderStyle = function () {
  const styles = `
  #c_video_ctrl {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    position: fixed;
    right: 50px;
    top: 20px;
    z-index: 999;
    text-align: center;
    line-height: 50px;
    font-size: 18px;
    color: #ff8864;
    border: 2px solid #ff8864;
  }
  #c_video_ctrl .wrapper {
    width: 400px;
    height: auto;
    border-radius: 10px;
    position: absolute;
    right: -2px;
    top: -2px;
    z-index: 1000;
    background: #eee;
    display: none;
    color: #000;
    padding-bottom: 30px;
  }
  #c_video_ctrl:hover .wrapper {
    display: block;
  }
  #c_video_ctrl .wrapper p {
    display: flex;
    height: max-content;
    padding: 10px 15px;
    margin: 0;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  #c_video_ctrl .wrapper p strong {
    width: 100%;
    font-size: 18px;
  }
  #c_video_ctrl .wrapper p span {
    font-size: 16px;
    cursor: pointer;
    padding: 0 10px;
    color: #333;
  }
  #c_video_ctrl .wrapper p span:hover {
    color: #ff8864;
  }
  .-wrapper-box {
    line-height: 1.5em;
    width: 100%;
  }
  .input-box{
    min-width: 60px;
    outline: 0;
    font-size: unset;
  }
  button {
    font-size: unset;
    background: blue;
    color: #fff;
    padding: 0 10px;
    height: 100%;
    border-radius: 6px;
    cursor: pointer;
  }
  `;
  const style = document.createElement('style');
  style.innerHTML = styles;
  document.head.appendChild(style);
};

const collectData = _ => {
  const pageData = {}; // 存储页面数据

  return new Promise((resolve, reject) => {
    const courseList = document.querySelectorAll('.olitem'); // 课程列表
    if (!courseList.length) {
      reject();
    }

    const course = document.querySelector('.courseBox > a'); // 课程基本信息
    pageData.courseInfo = {
      course,
      courseList
    };
    resolve(pageData);
  });
};

const myLoad = () => {
  console.log(location.href);
  collectData()
    .then(pageData => {
      loadVue().then(() => {
        renderStyle();
        renderEl(pageData);
      });
    })
    .catch(() => {
      console.log('没有在当前页面上找到课程列表');
    });
};

window.addEventListener('load', myLoad);
