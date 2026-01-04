// ==UserScript==
// @name         数字游戏自动答题
// @namespace    summer
// @version      0.3.2
// @description  rt
// @author       summer
// @match        https://api.zuiqiangyingyu.cn/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370555/%E6%95%B0%E5%AD%97%E6%B8%B8%E6%88%8F%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/370555/%E6%95%B0%E5%AD%97%E6%B8%B8%E6%88%8F%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==



window.Calcapi = {
  token: '',

  init: function (token) {
    this.token = token;
  },

  start: function(obj) {
    // {success, fail}
    var data = {tk: this.token};
    var url  = '/index.php/api/cheng_fa/wechat/Answer_index_v2';

    ajax_get(url, data, function (ret) {
      if (0 === parseInt(ret.c)) {
        obj.success && obj.success(ret.d);
        return;
      } else {
        obj.fail && obj.fail(ret.m);
      }
    });
  },

  answer: function (obj) {
    // {answer, second, success, fail}
    if (undefined === obj.answer || undefined === obj.second) {
      console.error('param missing');
      return;
    }
    var url  = '/index.php/api/cheng_fa/wechat/Answer_v2';
    var data = {
      tk: this.token,
      answer: obj.answer,
      second: obj.second
    };

    ajax_get(url, data, function (ret) {
      if (0 === parseInt(ret.c)) {
        obj.success && obj.success(ret.d);
        return;
      } else {
        obj.fail && obj.fail(ret.m);
      }
    });
  },

  getChance: function(cb) {
    var data = {tk: this.token};
    var url  = '/index.php/api/cheng_fa/wechat/Index';

    ajax_get(url, data, function (ret) {
      if (0 === parseInt(ret.c)) {
        cb && cb(parseInt(ret.d.chance_left));
      } else {
        push_info('发生错误: ' + ret.m);
      }
    });
  },

  getResult: function(obj) {
    // {success, fail}
    var data = {tk: this.token};
    var url  = '/index.php/api/cheng_fa/wechat/Answer_result';

    ajax_get(url, data, function (ret) {
      if (0 === parseInt(ret.c)) {
        obj.success && obj.success(ret.d);
        return;
      } else {
        obj.fail && obj.fail(ret.m);
      }
    });
  },

  share: function(obj) {
    // {success, fail}
    var data = {tk: this.token, share_ticket: 'undefined'};
    var url  = '/index.php/api/cheng_fa/wechat/Share';

    ajax_get(url, data, function (ret) {
      if (0 === parseInt(ret.c)) {
        obj.success && obj.success(ret.d);
        return;
      } else {
        obj.fail && obj.fail(ret.m);
      }
    });
  }
};




function answer_start() {
  Calcapi.init(document.getElementById('token').value.trim());

  if (document.getElementById('skip-start').checked) {
    answer_start_skip();
    return;
  }
  Calcapi.getChance(function(chance) {
    if (0 === chance) {
      push_info('挑战机会已用完');
      return;
    }
    Calcapi.start({
      success: function(data){
        push_info('答题开始');
        push_info('共' + data.max_num + '题');
        push_info('每题答题时间' + data.second + '秒');
        auto_answer(data);
      },
      fail: function(msg) {
        push_info('发生错误: ' + msg);
      }
    });
  });
}


function answer_start_skip() {
  var last_answer = parseInt(document.getElementById('last-answer').value);
  var mock_data = {
    "id":96,
    "num":41,
    "content":"1*1=" + last_answer,
    "second":1,
    "pass":0
  };
  push_info('跳过答题开头流程');
  push_info('即将开始');
  setTimeout(function(){
    auto_answer(mock_data);
  }, 2000);
}


function auto_answer(data) {
  if (1 === parseInt(data.pass)) {
    answer_end(data);
    return;
  }


  var answer = get_answer(data.content);
  var time_use = Math.ceil(Math.random() * data.second);

  if (false === answer) {
    push_info('未知算式: ' + data.content);
    return;
  }
  document.getElementById('last-answer').value = answer;
  localStorage.setItem('last-answer', answer);

  setTimeout(function(){
    Calcapi.answer({
      answer: answer,
      second: time_use,
      success: function(data) {
        auto_answer(data);
      },
      fail: function() {
        push_info('回答错误, 程序终止');
      }
    });

    push_info(
      '第'+data.num+'题: '
      + data.content
      + '  回答: '
      + (answer ? '正确' : '错误')
    );
  }, time_use*1000);
}


function answer_end(data) {
  var running = !!parseInt(
    document.getElementById('btn-control').getAttribute('data-running')
  );

  push_info('该轮答题结束');
  push_info('当前为第' + data.rank_data_challenge + '回合');
  push_info('已获取金额: ' + data.rank_data_money);
  Calcapi.getResult({
    success: function(data) {
      push_info('本轮获取的金额c: ' + data.earn);
      push_info('已获取金额c: ' + data.money);
      if (running) {
        answer_start();
      }
    },
    fail: function() {
      push_info('结果获取失败');
    }
  });
}


function push_info(info) {
  var dom_info = document.getElementById('info');
  var p = document.createElement('p');
  p.innerText = info;

  dom_info.appendChild(p);
  dom_info.scrollTop = dom_info.scrollHeight;
}


function get_answer(content) {
  var content_arr = content.split('=');
  var left  = content_arr[0];
  var right = content_arr[1];
  var reg_left = /^[0-9xX÷\+\-\*\/]+$/;

  if (!reg_left.test(left)) {
    return false;
  }

  if (eval(left) === parseInt(right)) {
    return 1;
  }

  return 0;
}


function ajax_get(url, data, cb) {
  var xhr = new XMLHttpRequest();
  var param = [];
  for (var i in data) {
    param.push(i + '=' + data[i]);
  }
  if (param.length > 0) {
    url += '?' + param.join('&');
  }
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && 200 === xhr.status) {
      cb && cb(JSON.parse(xhr.responseText));
    }
  }
  xhr.send();
}




var html_body = `
  <style>
    #info {
      width: 320px;
      height: 480px;
      background: #eee;
      margin-top: 16px;
      border: 1px solid #000;
      overflow: scroll;
    }

    #info:before {
      content: '>';
    }

    #info p {
      margin: 2px 4px 2px 8px;
    }
  </style>
  <div class="wrap">
    token: <input type="text" id="token">
    <button id="btn-control" data-running="0">start</button>
    <div style="margin-top: 8px; font-size: 14px;">
      跳过开头
      <input type="checkbox" id="skip-start" value="1">&nbsp;&nbsp;
      最后一次答案
      <select id="last-answer" disabled="disabled">
        <option value="0">错误</option>
        <option value="1">正确</option>
      </select>
    </div>
    <div id="info"></div>
  </div>
`;

var html_head = `
  <meta http-equiv="content-type" content="text/html;charset=utf-8">
  <title>calc</title>
`;

document.body.innerHTML = html_body;
document.head.innerHTML = html_head;

document.getElementById('btn-control').addEventListener('click', function(){
  var running = !!parseInt(
    document.getElementById('btn-control').getAttribute('data-running')
  );

  document.getElementById('token').setAttribute('disabled', 'disabled');
  this.setAttribute('data-running', running ? 0 : 1);

  if (running) {
    this.innerText = 'start';
  } else {
    this.innerText = 'stop';
    answer_start();
  }
});


document.getElementById('skip-start').addEventListener('click', function() {
  var target = document.getElementById('last-answer');
  if (this.checked) {
    target.removeAttribute('disabled');
  } else {
    target.disabled = 'disabled';
  }
});

var last_answer = localStorage.getItem('last-answer');
if (null !== last_answer) {
  document.getElementById('last-answer').value = last_answer;
}
