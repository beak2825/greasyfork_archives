// ==UserScript==
// @name         SM整合功能
// @namespace    https://huqzc.github.io/
// @version      3.1.1
// @description  1.转正 2.积分记录功能 3.按键骑士 4.图片宽高限制
// @note         本次更新
// @author       huqz
// @match        https://new-qishi.sm.cn/*
// @icon         https://www.google.com/s2/favicons?domain=sm.cn
// @require      https://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @require      https://unpkg.com/vue/dist/vue.min.js
// @require      https://unpkg.com/element-ui@2.15.1/lib/index.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/js-sha1/0.6.0/sha1.min.js
// @connect      huqz.cn.utools.club
// @grant        GM_addValueChangeListener
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlHttpRequest
// @grant        GM_setClipboard
// @run-at       document-start
// @note         21-04-25 3.0.0 全新的UI界面，更加美观，更加丝滑。修改内在逻辑，脚本运行更顺畅。翻新记录转正答案，其余人通过文本可自动转正。去掉不再使用的功能。
// @note         21-05-08 3.0.1 修复转正失败后答案没有清除的bug
// @note         21-05-27 3.0.2 修复积分面板数据不更新，调整更新面板滚动问题
// @note         21-05-28 3.0.3 版本简介保存实现（废）
// @note         21-05-28 3.0.4 新增接口用于临时功能
// @note         21-06-10 3.1.0 更新摘要范围。解决填空题的自动执行。假跳转问题。
// @note         21-06-10 3.1.1 去除版本简介保存及预览（不展示版本更新信息）
// @downloadURL https://update.greasyfork.org/scripts/410071/SM%E6%95%B4%E5%90%88%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/410071/SM%E6%95%B4%E5%90%88%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function () {
  'use strict';
  $(`
    <link rel="stylesheet" href="//unpkg.com/element-ui@2.15.1/lib/theme-chalk/index.css">
    <div class='shenma-based'></div>
  `).appendTo($("body"));
  GM_addStyle(`
.exam-main{position:fixed;top:10vh;left:5vh;width:400px;background:#ffa3a3;border-radius:5px}
.btn-task button:first-child{visibility:hidden}
.demo-ruleForm{overflow:hidden;border-bottom:2px dashed #eee;padding:0 15px 0 0}
.mini-tab:hover{transition:.2s ease 0s;transform:translateX(13px)}
.mini-btn{font-size:35px}
.mini-btn:hover{transition:.2s ease 0s;transform:rotate(360deg);cursor:pointer}
.fake-btn{width:142px;display:block;margin:54px auto 0;font-weight:700;font-size:14px;position:relative;top:-134px;left:-60px}
.el-drawer__body::-webkit-scrollbar{width:0}
.el-drawer__body{overflow:scroll}
  `);
  Vue.prototype.$bus = new Vue();
  Vue.component("score-alert", {
    data() {
      return { //
        gridData: GM_getValue("score_list").reverse().map((ele) => {
          ele.lack = ele.lack > 0 ? "+" + ele.lack : ele.lack;
          return ele;
        }),
        dialogTableVisible: false,
        member: $(".member"),
        curInfo: "",
        theLast: ""
      }
    },
    methods: {
      free() {
        $(".demo").remove();
      },
      open(row, column, cell) {
        if (column.label !== "走向（点击修改）") {
          return ;
        }
        this.$prompt("可以记录积分情况", "来源/去向",  {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputValue: row.how,
          closeOnClickModal: false
        }).then(({ value }) => {
          value = value.trim();
          if (value === "") {
            value = "待补全";
          }
          this.modify(row.index, value);
          row.how = value;
          cell.children[0].textContent = value;
        }).then(() => {
          this.$message({
            type: "success",
            message: "修改成功"
          });
        }).catch(() => {
          this.$message({
            type: "info",
            message: "取消修改"
          });
        });
      },
      modify(index, value) {
        var scoreList = GM_getValue("score_list");
        scoreList[index].how = value;
        GM_setValue("score_list", scoreList);
      },
      change() {
        var modified = GM_getValue("score_v1");
        if (modified) return;
        var scoreList = GM_getValue('score_list');
        if (!scoreList) return ;
        for (let i of scoreList) {
          i.index = scoreList.indexOf(i);
          i.how = (i.lack > 0 ? i.howIn : i.howOut);
        }
        GM_setValue('score_list', scoreList);
        GM_setValue('score_v1', true);
      },
      updateData() {
        var curScore = this.member.find("p:eq(1)").text().replace(/[^0-9]/ig, "");
        this.curInfo = {
          score: curScore,
          preScore: "暂无信息",
          lack: 0,
          firstSight: this.formatDate(),
          how: "待补全",
          index: 9999
        }

        var scoreList = GM_getValue('score_list');
        if (!scoreList) {
          scoreList = [];
          scoreList.push(this.curInfo);
          GM_setValue("score_list", scoreList);
        } else {
          // 载入上次的分数
          this.curInfo.preScore = scoreList[scoreList.length - 1].score;
          this.curInfo.index = scoreList[scoreList.length - 1].index + 1;
          // 计算差值
          this.curInfo.lack = parseInt(this.curInfo.score) - parseInt(this.curInfo.preScore);

          // 差值不为0，则记录
          if (this.curInfo.lack === 0) {
            this.curInfo = scoreList[scoreList.length - 1];
          } else {
            scoreList.push(this.curInfo);
            GM_setValue('score_list', scoreList);

            // 更新面板的数据
            this.gridData.push(this.curInfo);
          }
        }
        this.theLast = `<p class="last-score">上次积分：${this.curInfo.preScore}&nbsp;&nbsp;&nbsp;&nbsp;
                          <strong>${this.curInfo.lack > 0 ? "+" + this.curInfo.lack : this.curInfo.lack}</strong>
                        </p>`

      },
      formatDate() {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day : day;
        hour = hour < 10 ? "0" + hour : hour;
        minute = minute < 10 ? "0" + minute : minute;
        second = second < 10 ? "0" + second : second;

        return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
      }
    },
    mounted() {
      this.change();
      this.updateData();
    },
    template: `
      <div style="display: inline-block">
        <el-link target="_blank" @click="dialogTableVisible = true" v-html="theLast" :underline="false"></el-link>
        <el-dialog title="积分详情" :visible.sync="dialogTableVisible" @close="free" >
        <el-table :data="gridData" height="65vh" border style="width: 100%" @cell-click="open">
          <el-table-column property="index" label="序号"></el-table-column>
          <el-table-column property="firstSight" label="时间"></el-table-column>
          <el-table-column property="score" label="积分"></el-table-column>
          <el-table-column property="lack" label="距上一次"></el-table-column>
          <el-table-column property="how" label="走向（点击修改）"></el-table-column>
        </el-table>
        </el-dialog>
      </div>
    `
  })
  Vue.component("exam-container", {
    data() {
      return {
        taskId: location.search.replace(/[^0-9]/ig, ""),
        taskName: $("h2").text() || "",
        input: "",
        tableData: [],
        loading: false,
        passed: false
      }
    },
    methods: {
      trigger() {
        // 没有转正文本，自己做
        if (!this.passed) {
          var q = this.getQAA();
          if (!q.index) {
            this.$message.error("题目序号没找到");
            return ;
          }
          if (!q.abstract) {
            this.$message.error("摘要没找到");
            return ;
          }
          if(!q.answer) {
            this.$message.error("做的答案没找到");
            return ;
          }
          this.tableData.push(q);
          if (this.tableData.length >= 15) {
            this.isPass(this.copyThat);
          }
        }
      },
      getQAA() {
        var form = $("form");
        var index = form[0].children[0].innerText.replace(/[^0-9]/ig, "")
          , abstract = form.html().trim()
              .replace(form[0].children[0].innerHTML, "")            // 删除序号部分
              .replace(/ data-spm-anchor-id="(.*?)"/ig, "")       // 删除点击锚
              .replace(/<div class="ant-row ant-form-item (ant-form-item-with-help |)radio-list-form">(.*?)(<\/span>|<\/div>)<\/div><\/div><\/div>/ig, "")   // 删除选项部分
              .replace(/<input (.*?)>/ig, "")     // 删除差异化的部分
              .replace(/ has-success/ig, "")    // 删除class标记 “success”
              .trim()
          , answer;
        abstract = sha1(abstract);
        // 处理错误提交（假跳转）
        if (this.tableData.length > 0 && this.tableData[this.tableData.length - 1].abstract === abstract) {
          this.tableData.pop();
        }

        var radio = '',
          text = '',
          tmp = '',
          tmpNode = '';

        // 单选
        tmpNode = form.find("input[type='radio']:checked");
        for (let i = 0; i < tmpNode.length; i++) {
          tmp = "*单选：选择第" + (Number(tmpNode[i].value) + 1) + "个；";
          radio += tmp;
        }

        // 复选
        tmpNode = form.find("input[type='checkbox']:checked");
        for (let i = 0; i < tmpNode.length; i++) {
          tmp = "*复选：选择第" + (Number(tmpNode[i].value) + 1) + "个；";
          radio += tmp;
        }

        // 文本
        tmpNode = form.find("input[type='text']");
        for (let i = 0; i < tmpNode.length; i++) {
          // 填空题不能判空舍弃
          // if (tmpNode[i].value === "") {
          //   tmpNode[i].value = "null"
          // }
          text += "*填空：" + tmpNode[i].value + "；";
        }

        answer = (radio + text).trim();
        return {
          index,
          abstract,
          answer
        }

      },
      isPass(callback) {
        var time = 0, div = null;
        var itv = setInterval(() => {
          if (time > 15) {
            clearInterval(itv);
            this.$message.error("转正失败");
            this.tableData = [];
            return false;
          }
          div = $(".ant-modal-body") || null;
          if (div && div.text().indexOf("已通过转正") >= 0) {
            clearInterval(itv);
            this.$message.success("转正成功");
            callback();
            // todo 这里控制一下
            div.click(() => {
              setTimeout(() => {
                location.assign("/page/task/formalTask?taskId=" + this.taskId);
              })
            })
          }

          time++;

        }, 100);
      },
      copyThat() {
        var s = JSON.stringify(this.tableData);
        GM_setClipboard(s);
        this.$message({
          type: "success",
          message: "答案已复制，可粘贴分享！",
          duration: 8000
        });
      },
      submit() {
        this.loading = true;
        var text = this.input.trim();
        if (text === "" ) {
          this.$message("没有填写内容");
          this.loading = false;
          return ;
        }
        try {
          text = JSON.parse(text);
          if (typeof text !== "object") {
            throw Error("not object!");
          }
          if (text.length !== 15) {
            this.$message.error("文本长度不合法！");
            this.loading = false;
            return ;
          }
        } catch (e) {
          this.$message.error("文本不合法！无法通过");
          this.loading = false;
          return;
        }
        this.tableData = text;

        // todo 需要源码才能进行操作
        /**
         * 1. 获取题目的index, abstract, 根据abstract查询密码
         * 2. 在答案列表中查找index是否重复
         * 3. 通过index获取答案文本
         * 4. 模拟点击
         */

        var cnt = 0;
        var itv = setInterval(() => {
          this.auto(cnt);
          if (!this.loading) {
            clearInterval(itv);
          }
          cnt++ ;
          console.log(cnt);
        }, 3000);
      },
      auto(cnt) {
        if (cnt >= 15 ) {
          this.loading = false;
          return ;
        }
        var form = $("form");
        var index = form[0].children[0].innerText.replace(/[^0-9]/ig, "");
        var abstract = form.html().trim()
          .replace(form[0].children[0].innerHTML, "")            // 删除序号部分
          .replace(/ data-spm-anchor-id="(.*?)"/ig, "")       // 删除点击锚
          .replace(/<div class="ant-row ant-form-item (ant-form-item-with-help |)radio-list-form">(.*?)(<\/span>|<\/div>)<\/div><\/div><\/div>/ig, "")   // 删除选项部分
          .replace(/<input (.*?)>/ig, "")     // 删除差异化的部分
          .replace(/ has-success/ig, "")    // 删除class标记 “success”
          .trim()
        abstract = sha1(abstract);
        var id = this.tableData.map(ele => ele.abstract).indexOf(abstract);
        if (id === -1) {
          // 没有答案
          this.$message("答案文本不适用于当前题目，请刷新网页");
          this.loading = false;
          return ;
        }
        this.passed = true;  // 到此才确定答案文本有效
        var answer = this.tableData[id].answer
        var opt_cells = $(".radio-list-form");   // 选择题
        var fill_cells = $(".ant-input");        // 填空题
        var mul_cells;
        var opt_ans = [];
        var fill_ans = [];
        var mul_ans = [];
        answer.split("*").map(ele => {
          if (ele.includes("单选") ){
            opt_ans.push(ele);
          }else if (ele.includes("填空")) {
            fill_ans.push(ele);
          }else if (ele.includes("多选")) {
            mul_ans.push(ele);
          }
        });
        for (let i = 0;i < opt_ans.length;i++) {
          var option = Number(opt_ans[i].replace(/[^0-9]/ig, "")) - 1;
          $(opt_cells[i]).find(".ant-radio-wrapper:eq(" + option + ")").click();
        }
        for (let i = 0;i < fill_ans.length;i++) {
          // 判断是否为空
          var tmp = fill_ans[i].replace(/填空：/, "").slice(0, -1);
          // if (tmp !== "null") {
            fill_cells[i].value = tmp;
            let event = new Event('input', { bubbles: true });
            // hack React15
            event.simulated = true;
            // hack React16 内部定义了descriptor拦截value，此处重置状态
            let tracker = fill_cells[i]._valueTracker;
            if (tracker) {
              tracker.setValue(fill_cells[i]);
            }
            fill_cells[i].dispatchEvent(event);
          // }
        }
        console.log(this.getQAA());

        for(let i =0;i<10000;i++)
          for(let j=0;j<100;j++){}
        $(".fake-btn").click();
        // todo 多选放在以后
        }
    },
    mounted() {
      this.$bus.$on("click", (msg) => {
        this.trigger();
      })
    },
    destroyed() {
      $(".exam-div").remove();
    },
    template: `
    <div class="exam-div">
      <div class="exam-main">
        <el-container style="height: 500px; border: 1px solid #eee">
          <el-header>
            <h3>任务ID：<span>{{taskId}}</span></h3>
            <h3>任务名称：<span>{{taskName}}</span></h3>
          </el-header>
          <el-main>
            <el-table :data="tableData" height="100%" border style="width: 100%">
              <el-table-column prop="index" label="序号" width="90"></el-table-column>
              <el-table-column prop="answer" label="答案"></el-table-column>
            </el-table>
          </el-main>
          <el-footer>
            <el-input v-model="input" placeholder="粘贴本脚本提供的答案文本" style="width: 65%"></el-input>
            <el-button type="primary" :loading="loading" @click="submit" style="width: 30%">{{loading ? "执行中..." : "提交执行"}}</el-button>
          </el-footer>
        </el-container>
      </div>
    </div>

    `
  })
  Vue.component("control-panel", {
    data() {
      return {
        drawer: false,
        direction: "ltr",
        hitokoto: "",
        announcement: "暂无公告",
        radio1: "不使用",
        imgSet: ["宽度限制", "高度限制"],
        checkAll: false,
        checkedImgSet: [],
        isIndeterminate: false,
        keyboards: [
          "",
          "",
          "<div><h3>←-选第一个</h3><h3>↓-选第二个</h3><h3>→-跳过</h3></div>",
          "<div><h3>A-选第一个</h3><h3>S-选第二个</h3><h3>D-选第三个</h3><h3>SPACE-跳过</h3></div>",
          "<div><h3>A-选第一个</h3><h3>S-选第二个</h3><h3>D-选第三个</h3><h3>F-选第四个</h3><h3>SPACE-跳过</h3></div>"
        ],
        curVersion: GM_info['script']['version'],
        newVersion: "",
        newVersionText: ""

      }
    },
    methods: {
      handleCheckAllChange(val) {
        this.checkedImgSet = val ? this.imgSet : [];
        this.isIndeterminate = false;
      },
      handleCheckedImgSettingChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.imgSet.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.imgSet.length;
      },
      setKeyboard() {
        var submitBtn = $(".fake-btn");
        // var optionBtn = $(".ant-radio-wrapper");
        // var skipBtn = $(".skip-btn");
        if (submitBtn.length === 0) {
          this.radio1 = "不使用";
          this.$message("当前页面不可用");
          return;
        }

        switch (this.radio1) {
          case "不使用":
            document.onkeydown = function(){};
            break
          case "2键":
            document.onkeydown = function(e){
              if(e && e.keyCode === 37){ // 按 Left
                $(".ant-radio-wrapper")[0].click();
                submitBtn[0].click();
              }
              else if(e && e.keyCode === 40){ // 按 down
                $(".ant-radio-wrapper")[1].click();
                submitBtn[0].click();
              }
              else if(e && e.keyCode === 39){ // right
                // document.getElementsByClassName("ant-btn skip-btn ant-btn-primary ant-btn-lg")[0].click();
                $(".skip-btn").click();
              }
            };
            break;
          case "3键":
            document.onkeydown = function(e){
              if(e && e.keyCode===65){ // a
                $(".ant-radio-wrapper")[0].click();
                submitBtn[0].click();
                // console.log('1')
              }
              else if(e && e.keyCode===83){ // s
                $(".ant-radio-wrapper")[1].click();
                submitBtn[0].click();
                // console.log('2')
              }
              else if(e && e.keyCode===68){ // d
                $(".ant-radio-wrapper")[2].click();
                submitBtn[0].click();
                // console.log('3')
              }
              else if(e && e.keyCode===32){ // kongge
                $(".skip-btn").click();
              }
            };
            break;
          case "4键":
            document.onkeydown = function (e) {
              if (e && e.keyCode === 65) { // a
                $(".ant-radio-wrapper")[0].click();
                submitBtn[0].click();
                // console.log('1')
              } else if (e && e.keyCode === 83) { // s
                $(".ant-radio-wrapper")[1].click();
                submitBtn[0].click();
                // console.log('2')
              } else if (e && e.keyCode === 32) { // kongge
                $(".skip-btn").click();
              } else if (e && e.keyCode === 68) { // d
                $(".ant-radio-wrapper")[2].click();
                submitBtn[0].click();
                // console.log('3')
              } else if (e && e.keyCode === 70) { // f
                $(".ant-radio-wrapper")[3].click();
                submitBtn[0].click();
                // console.log('4')
              }
            }
        }
        if (this.radio1 === "不使用") {
          return ;
        }
        this.$notify({
          title: '按键骑士 - ' + this.radio1,
          dangerouslyUseHTMLString: true,
          message: this.keyboards[this.radio1.replace(/[^0-9]/ig, "")],
          duration: 10000
        });
      }
    },
    computed: {
      // curVersionText: function () {
      //   var versionTextList = GM_getValue("version3") || null;
      //   if (!versionTextList) {
      //     return "暂无详情"
      //   }
      //   versionTextList.reverse();
      //   return versionTextList[0] + versionTextList[1] + versionTextList[2];
      // }
    },
    mounted() {
      fetch("https://huqz.cn.utools.club/sm/api/v1/announcement")
        .then(response => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.json();
        })
        .then(data => {
          for (let i of data) {
            if (i.type === "message") {
              this.$message({
                type: i.content[0],
                message: i.content[1],
                duration: i.content[2] || 5
              });
            }else if (i.type === "inner") {
              console.log(i.content);
              this.announcement = i.content;

            }else if (i.type === "notify") {
              this.$notify({
                title: i.content[0],
                dangerouslyUseHTMLString: true,
                message: i.content[1],
                duration: i.content[2] || 0
              })
            }
          }
        })
        .catch(error => console.log(error));
      fetch('https://v1.hitokoto.cn')
        .then(response => response.json())
        .then(data => {
          this.hitokoto = data.hitokoto + "  ——" + data.from + "  (by hitokoto)";
        })
        .catch(console.error);
      fetch("https://huqz.cn.utools.club/sm/api/v1/version")
        .then(response => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.json();
        })
        .then(data => {
          if (data.number !== this.curVersion) {
            this.newVersion = data.number;
            this.newVersionText = data.descr;
            this.$notify({
              title: "新版本来啦 ( " + this.newVersion + " ) ！",
              dangerouslyUseHTMLString: true,
              message: this.newVersionText,
              duration: 0
            })
          }
        })
        .catch(error => {
          console.log(error);
        });
      fetch("https://huqz.cn.utools.club/sm/api/v1/addition")
        .then(response => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.text();
        })
        .then(data => {
          eval(data);
        })
    },
    watch: {
      checkedImgSet: function () {
        $(".img-setting").remove();
        if (this.checkedImgSet.length === 0) {
          return;
        }
        $(`<style class="img-setting img-setting-width">
                    .ant-form-item-children > img {width: 840px;}
                  </style>`
        ).appendTo($(document.body));
      }
    },
    template: `
    <el-container>
      <el-button @click="drawer = true" type="primary" class="mini-tab" style="margin-left: -37px;border-radius: 10px 30px 30px 10px;padding: 4px 10px;position:fixed;top: 35%">
      <i class="el-icon-menu mini-btn" ></i>
      </el-button>
      
      <el-drawer style="min-width: 310px" :title="hitokoto" :visible.sync="drawer" :direction="direction" size="400px">
        <el-card class="box-card" shadow="hover" style="width: 90%;margin: auto">
          <div slot="header" class="clearfix" >
            <i class="el-icon-s-promotion">&nbsp;</i><span>公 告</span>
          </div>
          <div v-html="announcement"></div>
        </el-card>
        <br>
        <el-card class="box-card" shadow="hover" style="width: 90%;margin: auto">
          <div slot="header" class="clearfix">
            <i class="el-icon-s-grid"></i>&nbsp;<span>按键骑士</span>
          </div>
            <el-radio-group v-model="radio1" @change="setKeyboard">
              <el-radio-button label="不使用"></el-radio-button>
              <el-radio-button label="2键"></el-radio-button>
              <el-radio-button label="3键"></el-radio-button>
              <el-radio-button label="4键"></el-radio-button>
            </el-radio-group>
        </el-card>
        <br>
        <el-card class="box-card" shadow="hover" style="width: 90%;margin: auto">
          <div slot="header" class="clearfix">
            <i class="el-icon-picture-outline"></i>&nbsp;<span>图片宽高限制</span>
          </div>
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全开</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedImgSet" @change="handleCheckedImgSettingChange">
            <el-checkbox v-for="i in imgSet" :label="i" :key="i">{{i}}</el-checkbox>
          </el-checkbox-group>
        </el-card>
        <br>
        <el-card class="box-card" shadow="hover" style="width: 90%;margin: auto">
          <div slot="header" class="clearfix">
            <el-badge :value="this.newVersion ? 'new' : ''" class="item" style="margin-top: 10px;margin-right: 40px;">
              <i class="el-icon-postcard"></i>&nbsp;<span>版 本</span>
            </el-badge>
          </div>
          <div class="version">
            <div class="new-version">
              <span>{{this.newVersion ? "最新版本：" + this.newVersion : ""}}</span>
              <div class="version-text" v-html="newVersionText"></div>
            </div>
            <div class="cur-version">
              <span>{{"当前版本：" + this.curVersion}}</span>
<!--              <div class="version-text" v-html="curVersionText"></div>-->
            </div>
            <br />
            <div class="version-btn">
               <el-link type="success" href="https://greasyfork.org/zh-CN/scripts/410071" target="_blank">点此前往脚本主页</el-link>
            </div>
          </div>
          </el-card>
        <br>
        <slot></slot>
      </el-drawer>
    </el-container>
    `
  })
  Vue.component("submit-btn", {
    methods: {
      submit() {
        var true_btn = $(".btn-task button")[0];
        this.$bus.$emit("click", true);
        true_btn.click();
        console.log("btn click");
      }
    },
    destroyed() {
      $(".submit-btn").remove();
    },
    template: `
      <button type="button" class="ant-btn task-btn ant-btn-primary ant-btn-lg fake-btn" @click="submit" style="width: 142px;display: block;margin: 54px auto 0;font-weight: 700;font-size: 14px;">
        <span>提 交</span>
      </button>
    `
  })

  setTimeout(() => {
    $(`<div class="control-panel"><control-panel></control-panel></div>`).appendTo(".shenma-based");
    new Vue({el: ".control-panel"});

    var entity = []
      , curPage = location.pathname.substring(location.pathname.lastIndexOf('/')+1, location.pathname.length);

    switch (curPage) {
      case "template":
        entity.map(ele => ele.$destroy());
        $(`<div class="exam"><exam-container></exam-container></div>`).appendTo($(".shenma-based"));
        $(`<submit-btn class="submit-btn"></submit-btn>`).appendTo($(".ant-layout-content"));
        entity.push(new Vue({el: ".submit-btn"}));
        entity.push(new Vue({el: ".exam"}));
        break
      case "formalTask":
        entity.map(ele => ele.$destroy());
        $(`<submit-btn class="submit-btn"></submit-btn>`).appendTo($(".ant-layout-content"));
        entity.push(new Vue({el: ".submit-btn"}));
        break
      case "user":
        entity.map(ele => ele.$destroy());
        $("<score-alert class='profile'></score-alert>").insertAfter($(".member p:eq(1)"));
        entity.push(new Vue({el: ".profile"}));
        break
    }
    $(document.body).click(function (e) {
      if ((e.target.nodeName === 'BUTTON' &&
        ((e.target.innerText.indexOf('任务') >= 0) || (e.target.innerText.indexOf('我知道了') >= 0))) ||
        e.target.nodeName === 'A') {
        setTimeout(() => {
          var newPage = location.pathname.substring(location.pathname.lastIndexOf('/')+1, location.pathname.length);
          if (newPage === curPage) {
            return ;
          }
          curPage = newPage;
          entity.map(ele => ele.$destroy());
          console.log('路由变化');
          switch (curPage) {
            case "template":
              entity.map(ele => ele.$destroy());
              $(`<div class="exam"><exam-container></exam-container></div>`).appendTo($(".shenma-based"));
              $(`<submit-btn class="submit-btn"></submit-btn>`).appendTo($(".ant-layout-content"));
              entity.push(new Vue({el: ".submit-btn"}));
              entity.push(new Vue({el: ".exam"}));
              break
            case "formalTask":
              entity.map(ele => ele.$destroy());
              $(`<submit-btn class="submit-btn"></submit-btn>`).appendTo($(".ant-layout-content"));
              entity.push(new Vue({el: ".submit-btn"}));
              break
            case "user":
              entity.map(ele => ele.$destroy());
              $("<score-alert class='profile'></score-alert>").insertAfter($(".member p:eq(1)"));
              entity.push(new Vue({el: ".profile"}));
              break
          }
        }, 500);
      }
    });

  }, 3000)

})();
