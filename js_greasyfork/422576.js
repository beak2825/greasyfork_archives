// ==UserScript==
// @name:zh-CN      Udemy 字幕下载 v3
// @name         Udemy Subtitle Downloader v3
// @version      3
// @description:zh-CN  下载字幕为 .vtt 文件, 也可以下载一整门课程的字幕（多个文件），也可以下载视频（.mp4）
// @description  Download Udemy Subtitle as .vtt file
// @author       Zheng Cheng
// @match        https://www.udemy.com/course/*
// @run-at       document-end
// @grant        unsafeWindow
// @namespace    https://greasyfork.org/users/5711
// @downloadURL https://update.greasyfork.org/scripts/422576/Udemy%20Subtitle%20Downloader%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/422576/Udemy%20Subtitle%20Downloader%20v3.meta.js
// ==/UserScript==

// 写于2021-3-2
// [优点]
// 1. 使用门槛比 udemy-dl 低 （不需要用命令行）
// 2. 方便，点击就下载

// [备注]
// 本脚本依赖于 Udemy 的 API，如果哪天 Udemy 进行了改动，那么本程序不能用了是很正常的，修复一下即可。
// 作者邮箱 guokrfans@gmail.com
// 测试/开发环境: 
// macOS Big Sur 11.2.1
// Chrome 版本 88.0.4324.192（正式版本） (x86_64)
// Tampermonkey v4.11
// 不保证其他浏览器可用

// [实现原理]
// 数据从 API 拿, 发请求时带上一个 token 就行，放到请求头里，这个 token 去 Cookie 里面拿 access_token 就行。
// 这是基本概念，具体作法参考下方的代码即可。

(function () {
  'use strict';

  // 全局变量
  var div = document.createElement('div'); // 所有元素都放这里面
  var button1 = document.createElement('button'); // 下载本集的字幕(1个 .vtt 文件)
  var button2 = document.createElement('button'); // 下载整门课程的字幕 (多个 .vtt 文件)
  var button3 = document.createElement('button'); // 下载本集视频
  var title_element = null; // 页面左上角的标题

  // 用法 await sleep(1000) 毫秒
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 在某节点后面插入新节点
  function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  // copy from: https://gist.github.com/danallison/3ec9d5314788b337b682
  // Example downloadString(srt, "text/plain", filename);
  function downloadString(text, fileType, fileName) {
    var blob = new Blob([text], {
      type: fileType
    });
    var a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
    }, 11500);
  }

  // 获得参数
  function get_args() {
    var ud_app_loader = document.querySelector('.ud-app-loader')
    var args = ud_app_loader.dataset.moduleArgs
    var json = JSON.parse(args)
    return json
  }

  // 获得课程 id
  function get_args_course_id() {
    var json = get_args()
    return json.courseId
  }

  // 获得这一节的 id
  function get_args_lecture_id() {
    var json = get_args()
    return json.initialCurriculumItemId
  }

  // 返回 Cookie 里指定名字的值
  // https://stackoverflow.com/questions/5639346/what-is-the-shortest-function-for-reading-a-cookie-by-name-in-javascript
  function getCookie(name) {
    return (document.cookie.match('(?:^|;)\\s*' + name.trim() + '\\s*=\\s*([^;]*?)\\s*(?:;|$)') || [])[1];
  }

  // 单个视频的数据 URL
  // 可以传参数也可以不传，不传就当做取当前视频的
  function get_lecture_data_url(param_course_id = null, param_lecture_id = null) {
    // var course_id = '3681012'
    // var lecture_id = '23665120'
    // var example_url = `https://www.udemy.com/api-2.0/users/me/subscribed-courses/3681012/lectures/23665120/?fields[lecture]=asset,description,download_url,is_free,last_watched_second&fields[asset]=asset_type,length,media_license_token,media_sources,captions,thumbnail_sprite,slides,slide_urls,download_urls`
    var course_id = param_course_id || get_args_course_id()
    var lecture_id = param_lecture_id || get_args_lecture_id()
    var url = `https://www.udemy.com/api-2.0/users/me/subscribed-courses/${course_id}/lectures/${lecture_id}/?fields[lecture]=asset,description,download_url,is_free,last_watched_second&fields[asset]=asset_type,length,media_license_token,media_sources,captions,thumbnail_sprite,slides,slide_urls,download_urls`
    return url
  }


  // 一整门课的数据 URL
  function get_course_data_url() {
    var course_id = get_args_course_id()
    // var example_url = "https://www.udemy.com/api-2.0/courses/3681012/subscriber-curriculum-items/?page_size=1400&fields[lecture]=title,object_index,is_published,sort_order,created,asset,supplementary_assets,is_free&fields[quiz]=title,object_index,is_published,sort_order,type&fields[practice]=title,object_index,is_published,sort_order&fields[chapter]=title,object_index,is_published,sort_order&fields[asset]=title,filename,asset_type,status,time_estimation,is_external&caching_intent=True"
    var url = `https://www.udemy.com/api-2.0/courses/${course_id}/subscriber-curriculum-items/?page_size=1400&fields[lecture]=title,object_index,is_published,sort_order,created,asset,supplementary_assets,is_free&fields[quiz]=title,object_index,is_published,sort_order,type&fields[practice]=title,object_index,is_published,sort_order&fields[chapter]=title,object_index,is_published,sort_order&fields[asset]=title,filename,asset_type,status,time_estimation,is_external&caching_intent=True`
    return url
  }

  // 获得一节的数据
  function get_lecture_data(course_id = null, lecture_id = null) {
    return new Promise((resolve, reject) => {
      var access_token = getCookie("access_token")
      var bearer_token = `Bearer ${access_token}`
      fetch(get_lecture_data_url(course_id, lecture_id), {
          headers: {
            'x-udemy-authorization': bearer_token,
            'authorization': bearer_token,
          }
        })
        .then(response => response.json())
        .then(data => {
          resolve(data);
        }).catch(e => {
          reject(e);
        })
    })
  }

  // 获得一整门课的数据
  function get_course_data() {
    return new Promise((resolve, reject) => {
      var access_token = getCookie("access_token")
      var bearer_token = `Bearer ${access_token}`
      fetch(get_course_data_url(), {
          headers: {
            'x-udemy-authorization': bearer_token,
            'authorization': bearer_token,
          }
        })
        .then(response => response.json())
        .then(data => {
          // console.log(data);
          // var captions_array = data.asset.captions;
          // console.log(cations_array);
          resolve(data);
        }).catch(e => {
          reject(e);
        })
    })
  }

  // 转换成安全的文件名
  function safe_filename(string) {
    var s = string
    s = s.replace(':', '-')
    s = s.replace('\'', ' ')
    return s
  }

  // 输入 id
  // 返回那节课的标题
  // await get_lecture_title_by_id(id)
  async function get_lecture_title_by_id(id) {
    var data = await get_course_data()
    var array = data.results;
    for (let i = 0; i < array.length; i++) {
      const r = array[i];
      if (r._class == 'lecture' && r.id == id) {
        var name = `${r.object_index}. ${r.title}`
        return name;
      }
    }
  }

  // 下载当前这一节视频的字幕
  // 如何调用: await parse_lecture_data();
  // 会下载得到一个 .vtt 字幕
  async function parse_lecture_data(course_id = null, lecture_id = null) {
    var data = await get_lecture_data(course_id, lecture_id) // 获得当前这一节的数据
    var lecture_id = data.id; // 获得这一节的 id
    var lecture_title = await get_lecture_title_by_id(lecture_id) // 根据 id 找到标题

    // 遍历数组
    var array = data.asset.captions
    for (let i = 0; i < array.length; i++) {
      const caption = array[i];
      var url = caption.url // vtt 字幕的 URL
      // var locale_id = caption.locale_id // locale_id: "en_US"
      // var label = caption.video_label
      // var filename = `${label}_${safe_filename(lecture_title)}.vtt` // 构造文件名
      var filename = `${safe_filename(lecture_title)}.vtt` // 构造文件名
      save_vtt(url, filename); // 直接保存
    }
  }

  // 保存 vtt
  // 参数: url 是 vtt 文件的 url，访问 url 应该得到文件内容
  // filename 是要保存的文件名
  function save_vtt(url, filename) {
    fetch(url, {})
      .then(response => response.text())
      .then(data => {
        downloadString(data, "text/plain", filename);
      }).catch(e => {
        console.log(e);
      })
  }

  // 把 UI 元素放到页面上
  async function inject_our_script() {
    title_element = document.querySelector('a[data-purpose="course-header-title"]')

    var button1_css = `
      font-size: 14px;
      padding: 1px 12px;
      border-radius: 4px;
      border: none;
      color: black;
    `;

    var button2_css = `
      font-size: 14px;
      padding: 1px 12px;
      border-radius: 4px;
      border: none;
      color: black;
      margin-left: 8px;
    `;

    var div_css = `
      margin-bottom: 10px;
    `;

    button1.setAttribute('style', button1_css);
    button1.textContent = "下载本集字幕"
    button1.addEventListener('click', download_lecture_subtitle);

    button2.setAttribute('style', button2_css);
    var num = await get_course_lecture_number()
    button2.textContent = `下载整门课程的字幕(${num}个文件)`
    button2.addEventListener('click', download_course_subtitle);

    button3.setAttribute('style', button2_css);
    button3.textContent = "下载本集视频"
    button3.addEventListener('click', download_lecture_video);

    div.setAttribute('style', div_css);
    div.appendChild(button1);
    div.appendChild(button2);
    div.appendChild(button3);

    insertAfter(div, title_element);
  }

  // 下载本集字幕
  async function download_lecture_subtitle() {
    await parse_lecture_data();
  }

  // 下载课程全部字幕
  async function download_course_subtitle() {
    var course_id = get_args_course_id();
    var data = await get_course_data()
    var array = data.results;
    for (let i = 0; i < array.length; i++) {
      const result = array[i];
      if (result._class == 'lecture') {
        var lecture_id = result.id;
        await parse_lecture_data(course_id, lecture_id)
        await sleep(800);
      }
    }
  }

  // 下载本集视频
  async function download_lecture_video() {
    button3.textContent = "下载本集视频 (开始下载)"
    var data = await get_lecture_data() // 获得当前这一节的数据
    var lecture_id = data.id; // 获得这一节的 id
    var lecture_title = await get_lecture_title_by_id(lecture_id) // 根据 id 找到标题

    var r = data.asset.media_sources[0]
    // var example = {
    //   "type": "video/mp4",
    //   "src": "https://mp4-a.udemycdn.com/2020-12-04_12-48-10-150cfde997c5ba9f05e5e7d86c813db3/1/WebHD_720p.mp4?lKL6M-V-HXBl9MVKyHqfbP9nVBBFDd6lLLXl7USDCVB63OhpUk722Vt6EW1NlopbdZmF9J_9YZCTOhMrhxj26O1uGmgUqUL4F8e79BxKUeKCnxjTKPo3vA6eRzNAINw4k174S8MaD7ND9b37F_TOs4mxC9BLcUyPTxrSMhDLbjQuWl_P",
    //   "label": "720"
    // }

    var url = r.src // "https://mp4-a.udemycdn.com/2020-12-04_12-48-10-150cfde997c5ba9f05e5e7d86c813db3/1/WebHD_720p.mp4?XquxJGAXiyTc17qxb6iyah_9GXvjHC43UK98UHC3LUkZk7q9yPPll-BJ-5RKz--T9ucjtKOES68m_rZ6vzDZkyEROWwuaoHGFsr3DDuN0AWwk3RpjEo-JNfp98iIaEd_0Vfk0te375rNGtvtCnXibgcZmxDOx4tI5jqFKkl5hVDnwVE7"
    var resolution = r.label // 720 or 1080
    var filename = `${safe_filename(lecture_title)}_${resolution}p.mp4` // 构造文件名
    var type = r.type

    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        downloadString(blob, type, filename);
        button3.textContent = "下载本集视频 (下载完成)"
      });
  }

  // 返回一个整数，代表有多少个视频
  async function get_course_lecture_number() {
    var data = await get_course_data()
    var array = data.results;
    var num = 0
    for (let i = 0; i < array.length; i++) {
      const r = array[i];
      if (r._class == 'lecture') {
        num += 1;
      }
    }
    return num
  }

  // 主入口
  async function main() {
    inject_our_script()
  }

  // 延迟执行，保险一点
  setTimeout(main, 2500);
})();