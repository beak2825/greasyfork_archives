// ==UserScript==
// @name     One_Key_MOOC_HOMEWORK
// @version  1.0.04
// @match        *://www.icourse163.org/learn/*
// @match        *://www.icourse163.org/spoc/learn/*
// @author  caigoul & Caiji-bai
// @grant MIT
// @description f*ck mooc homework and AutoRate Course
// @namespace https://greasyfork.org/users/301293
// @downloadURL https://update.greasyfork.org/scripts/391133/One_Key_MOOC_HOMEWORK.user.js
// @updateURL https://update.greasyfork.org/scripts/391133/One_Key_MOOC_HOMEWORK.meta.js
// ==/UserScript==

console.log(
  `

  ██████  ██░ ██  ▒█████   █     █░ ███▄ ▄███▓▓█████
▒██    ▒ ▓██░ ██▒▒██▒  ██▒▓█░ █ ░█░▓██▒▀█▀ ██▒▓█   ▀
░ ▓██▄   ▒██▀▀██░▒██░  ██▒▒█░ █ ░█ ▓██    ▓██░▒███
  ▒   ██▒░▓█ ░██ ▒██   ██░░█░ █ ░█ ▒██    ▒██ ▒▓█  ▄
▒██████▒▒░▓█▒░██▓░ ████▓▒░░░██▒██▓ ▒██▒   ░██▒░▒████▒
▒ ▒▓▒ ▒ ░ ▒ ░░▒░▒░ ▒░▒░▒░ ░ ▓░▒ ▒  ░ ▒░   ░  ░░░ ▒░ ░
░ ░▒  ░ ░ ▒ ░▒░ ░  ░ ▒ ▒░   ▒ ░ ░  ░  ░      ░ ░ ░  ░
░  ░  ░   ░  ░░ ░░ ░ ░ ▒    ░   ░  ░      ░      ░
      ░   ░  ░  ░    ░ ░      ░           ░      ░  ░

▄▄▄█████▓ ██░ ██ ▓█████ ▄▄▄       ███▄    █   ██████  █     █░▓█████  ██▀███
▓  ██▒ ▓▒▓██░ ██▒▓█   ▀▒████▄     ██ ▀█   █ ▒██    ▒ ▓█░ █ ░█░▓█   ▀ ▓██ ▒ ██▒
▒ ▓██░ ▒░▒██▀▀██░▒███  ▒██  ▀█▄  ▓██  ▀█ ██▒░ ▓██▄   ▒█░ █ ░█ ▒███   ▓██ ░▄█ ▒
░ ▓██▓ ░ ░▓█ ░██ ▒▓█  ▄░██▄▄▄▄██ ▓██▒  ▐▌██▒  ▒   ██▒░█░ █ ░█ ▒▓█  ▄ ▒██▀▀█▄
  ▒██▒ ░ ░▓█▒░██▓░▒████▒▓█   ▓██▒▒██░   ▓██░▒██████▒▒░░██▒██▓ ░▒████▒░██▓ ▒██▒
  ▒ ░░    ▒ ░░▒░▒░░ ▒░ ░▒▒   ▓▒█░░ ▒░   ▒ ▒ ▒ ▒▓▒ ▒ ░░ ▓░▒ ▒  ░░ ▒░ ░░ ▒▓ ░▒▓░
    ░     ▒ ░▒░ ░ ░ ░  ░ ▒   ▒▒ ░░ ░░   ░ ▒░░ ░▒  ░ ░  ▒ ░ ░   ░ ░  ░  ░▒ ░ ▒░
  ░       ░  ░░ ░   ░    ░   ▒      ░   ░ ░ ░  ░  ░    ░   ░     ░     ░░   ░
          ░  ░  ░   ░  ░     ░  ░         ░       ░      ░       ░  ░   ░


┌─┐  ┌─┐┬┌┬┐┌─┐┬  ┌─┐   ╦┌─┐┬  ┬┌─┐┌─┐┌─┐┬─┐┬┌─┐┌┬┐  ┌┬┐┌─┐┌┬┐┌─┐
├─┤  └─┐││││├─┘│  ├┤    ║├─┤└┐┌┘├─┤└─┐│  ├┬┘│├─┘ │    ││├┤ ││││ │
┴ ┴  └─┘┴┴ ┴┴  ┴─┘└─┘  ╚╝┴ ┴ └┘ ┴ ┴└─┘└─┘┴└─┴┴   ┴   ─┴┘└─┘┴ ┴└─┘
_________________________________________________________________
              author: caigoul & Caiji-bai
                      HAVE FUN!
  `
);

(function() {
  function F_ck_One_HomeWork() {
    var s = document.getElementsByClassName("s");
    for (var i = 0; i < s.length; i++) {
      let choice = s[i].children[s[i].children.length - 1].control;
      choice.checked = true;
    }

    var cs = document.getElementsByClassName("j-textarea inputtxt");
    for (let i = 1; i < cs.length; i++) cs[i].value = "Good Job";

    // window.setTimeout(() => {
    document
      .getElementsByClassName("u-btn u-btn-default f-fl j-submitbtn")[0]
      .click();
    //   window.setTimeout(() => {
    document.getElementsByClassName("j-gotonext")[0].click();
    //   }, 1024);
    // }, 1024);
  }

  // 批改作业.jpg
  if (window.location.hash.indexOf("#/learn/hw?id=") != -1) {
    var button = document.createElement("button");
    button.innerHTML = "F*CK ONE HOMEWORK";
    button.className = "u-btn u-btn-default f-fl";
    button.style.position = "fixed";
    button.style.top = "200px";
    button.style.left = "0px";
    button.style.zIndex = "50";
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(button);
    button.onclick = function() {
      let count = 6;
      get_aid();
      var start = window.setInterval(() => {
        F_ck_One_HomeWork();
        count--;
        if (count == 0) window.clearInterval(start);
      }, 2000);
    };
  }

  // show_me_the_answer
  body = document.getElementsByTagName("body")[0];
  var button2 = document.createElement("button");
  button2.innerHTML = "SHOW_ME_THE_ANSWER";
  button2.className = "u-btn u-btn-default f-fl";
  button2.style.position = "fixed";
  button2.style.top = "250px";
  button2.style.left = "0px";
  button2.style.zIndex = "50";
  body.appendChild(button2);
  button2.onclick = function() {
    parse_answer(answers => {
      create_Window(answers);
      if (location.hash.indexOf("learn/hw?id=") != -1) {
        show_answer_in_homework(answers);
      }
      if (location.hash.indexOf("learn/quiz?id=") != -1) {
        show_answer_in_quiz(answers);
      }
      if (location.hash.indexOf("learn/examObject?eid=") != -1) {
        show_answer_in_quiz(answers);
      }
      if (location.hash.indexOf("learn/examSubjective?eid=") != -1) {
        show_answer_in_homework(answers);
      }
    });
  };

  var get_aid = function(callback = alert) {
    var id;
    var method;
    var isEid = false;
    if ((id = window.location.href.match(/hw\?id=(.*)/))) {
      id = id[1];
      method = "getHomeworkInfo";
    } else if ((id = window.location.href.match(/quiz\?id=(.*)/))) {
      id = id[1];
      method = "getQuizInfo";
    } else if ((id = window.location.href.match(/eid=(.*)\&id=(.*)/))) {
      id = id[2];
      method = "getQuizInfo";
      isEid = true;
    }
    let msg = `callCount=1
scriptSessionId=\$\{scriptSessionId\}190
c0-scriptName=MocQuizBean
c0-methodName=${method}
c0-id=0
c0-param0=string:${id}
c0-param1=null:null
c0-param2=boolean:false
batchId=1553856368973`;
    let request = new XMLHttpRequest();
    request.open(
      "POST",
      "https://www.icourse163.org/dwr/call/plaincall/MocQuizBean.getHomeworkInfo.dwr"
    );
    request.setRequestHeader("Content-Type", "text/plain");
    request.onreadystatechange = function() {
      if (request.readyState === 4) {
        let aid = request.responseText.match(/aid:(.*?),/);
        if (!aid) {
          method = method == "getQuizInfo" ? "getHomeworkInfo" : "getQuizInfo";
          msg = `callCount=1
scriptSessionId=\$\{scriptSessionId\}190
c0-scriptName=MocQuizBean
c0-methodName=${method}
c0-id=0
c0-param0=string:${id}
c0-param1=null:null
c0-param2=boolean:false
batchId=1553856368973`;
          request.open(
            "POST",
            "https://www.icourse163.org/dwr/call/plaincall/MocQuizBean.getHomeworkInfo.dwr"
          );
          request.send(msg);
        } else {
          callback(aid[1], id, isEid);
        }
      }
    };
    request.send(msg);
  };

  var get_answer = function(callback = alert) {
    get_aid((aid, id, isEid) => {
      let url = isEid
        ? "https://www.icourse163.org/dwr/call/plaincall/MocQuizBean.getQuizPaperDto.dwr"
        : "https://www.icourse163.org/dwr/call/plaincall/MocQuizBean.getHomeworkPaperDto.dwr";
      let msg = `callCount=1
scriptSessionId=\$\{scriptSessionId\}190
c0-scriptName=MocQuizBean
c0-methodName=getHomeworkPaperDto
c0-id=0
c0-param0=number:${id}
c0-param1=number:${aid}
c0-param2=boolean:true
c0-param3=number:
c0-param4=number:
batchId=${aid}`;
      let request = new XMLHttpRequest();
      request.open("POST", url);
      request.setRequestHeader("Content-Type", "text/plain");
      request.onreadystatechange = function() {
        if (request.readyState === 4) {
          callback(request.responseText);
        }
      };
      request.send(msg);
    });
  };

  var parse_answer = function(callback) {
    get_answer(function(answer) {
      let answers = answer
        .match(
          /(?:title="(.*?)";)|(?:answer=(true|false);s.*?content="(.*?)";)|(?:maxScore=.*?;s.*?msg="(.*?)";)|(?:stdAnswer="(.*?)";)/gm
        )
        .join("\n");
      while (answers.indexOf('\\"') !== -1)
        answers = answers.replace('\\"', "");
      answers = unescape(answers.replace(/\\u/g, "%u"));
      callback(answers);
    });
  };

  var show_answer_in_homework = function(answers) {
    var answersarr = [];
    var titles = [];
    answers.split('title="').forEach(item => {
      const msg = item.split(/maxScore=\d*;s\d*.msg="/);
      //     console.log(msg);
      titles.push(msg.shift());
      answersarr.push(msg);
    });
    titles.shift();
    answersarr.shift();
    var questions = document.getElementsByClassName(
      "f-richEditorText j-richTxt f-fl"
    );
    for (let i = 0; i < questions.length; i++) {
      var answer = answersarr[i].join();
      answer = answer.replace(/";/g, "");
      questions[i].innerHTML = titles[i].replace(/";/g, "");
      questions[i].innerHTML += "<hr>";
      questions[i].innerHTML +=
        "<h1 style=\"color:red;font-family:'楷体'\">答案:</h1>";
      questions[i].innerHTML += answer;
      questions[i].innerHTML += "<hr>";
    }
  };

  var show_answer_in_quiz = function(answers) {
    var tmp = answers.split('title="');
    var answersarr = [];
    var questions = document.getElementsByClassName(
      "f-richEditorText j-richTxt"
    );
    tmp.shift();
    for (let i = 0; i < tmp.length; i++) {
      var match_answers = tmp[i].match(/answer=true;s\d+\.content="(.*?)"/g);
      if (match_answers) {
        answersarr[i] = ''
        match_answers.forEach(item => {
            var answer = item.match(/answer=true;s\d+\.content="(.*?)"/)
            answersarr[i] += answer[1];
        })
      }
      match_answers = tmp[i].match(/stdAnswer="(.*?)"/);
      if (match_answers) {
        answersarr[i + 1] = match_answers[1].replace(/##%_YZPRLFH_%##/g, '或');
      }
    }
    for (let i = 0; i < questions.length; i++) {
      questions[i].innerHTML += "<hr>";
      questions[i].innerHTML +=
        "<h1 style=\"color:red;font-family:'楷体'\">答案:</h1>";
      questions[i].innerHTML += answersarr[i];
      questions[i].innerHTML += "<hr>";
    }
  };

  // 显示答案.jpg
  var create_Window = function(answers) {
    var id = document.getElementById("windows");
    if (id) {
      return;
    }
    var win = document.createElement("div");
    var button3 = document.createElement("button");
    win.setAttribute("id", "windows");
    win.style.background = "#fff";
    win.style.width = "max-content";
    win.style.maxWidth = "800px";
    win.style.height = "700px";
    win.style.position = "fixed";
    win.style.right = "30px";
    win.style.top = "200px";
    win.style.boxShadow = "0px 0px 10px #848484";
    win.style.padding = "40px 40px";
    win.style.overflow = "auto";
    win.style.zIndex = "100";
    win.innerHTML = answers;
    document.getElementsByTagName("body")[0].appendChild(win);
    win.appendChild(button3);
    button3.innerHTML = "close ";
    button3.className = "u-btn u-btn-default f-fl";
    button3.style.position = "fixed";
    button3.style.top = "300px";
    button3.style.left = "0px";
    button3.style.zIndex = "50";
    button3.onclick = function() {
      body.removeChild(win);
    };
    _drag(win);
  };

  var _drag = function(el) {
    var x = 0;
    var y = 0;
    var l = 0;
    var t = 0;
    var isDown = false;
    //鼠标按下事件
    el.onmousedown = function(e) {
      //获取x坐标和y坐标
      x = e.clientX;
      y = e.clientY;

      //获取左部和顶部的偏移量
      l = el.offsetLeft;
      t = el.offsetTop;
      //开关打开
      isDown = true;
      //设置样式
      el.style.cursor = "move";
    };
    //鼠标移动
    window.onmousemove = function(e) {
      if (isDown == false) {
        return;
      }
      //获取x和y
      var nx = e.clientX;
      var ny = e.clientY;
      //计算移动后的左偏移量和顶部的偏移量
      var nl = nx - (x - l);
      var nt = ny - (y - t);

      el.style.left = nl + "px";
      el.style.top = nt + "px";
    };
    //鼠标抬起事件
    el.onmouseup = function() {
      //开关关闭
      isDown = false;
      el.style.cursor = "default";
    };
  };
})();
