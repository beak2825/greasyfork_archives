// ==UserScript==
// @name         Download Links Helper - 下载链接助手
// @namespace    shangandeyu
// @version      1.0.1
// @description  批量复制页面下载链接到剪贴板，支持自定义规则
// @author       shangandeyu
// @license      GPL-3.0
// @run-at       document-end
// @include      *
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        GM_listValues
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/398745/Download%20Links%20Helper%20-%20%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/398745/Download%20Links%20Helper%20-%20%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('head').append(`<style>.dlh-navbar {
  overflow: hidden;
  background-color: #333;
}

.dlh-navbar a {
  float: left;
  font-size: 16px;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  cursor: pointer;
}

.dlh-dropdown {
  float: left;
  overflow: hidden;
}

.dlh-dropdown .dropbtn {
  font-size: 16px;
  border: none;
  outline: none;
  color: white;
  padding: 14px 16px;
  background-color: inherit;
  font-family: inherit;
  margin: 0;
}

.down-arr {
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  border: solid white;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 2px;
margin-left:5px;
}

.dlh-navbar a:hover, .dlh-dropdown:hover .dropbtn {
  background-color: red;
}

.dlh-dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dlh-dropdown-content a {
  float: none;
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
}

.dlh-dropdown-content a:hover {
  background-color: #ddd;
}

.dlh-dropdown:hover .dlh-dropdown-content {
  display: block;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  border: 1px solid #ddd;
}

th, td {
  text-align: left;
  padding: 8px;
}

tr:nth-child(even){background-color: #f2f2f2}

.dlh-button {
  background-color: #ddd;
  border: none;
  color: black;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 16px;
}

.dlh-button:hover {
  background-color: #f1f1f1;
}

.dlh-form-inline {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
}

.dlh-form-inline input {
  vertical-align: middle;
  margin: 5px 10px 5px 0;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
}

.dlh-form-inline button {
  padding: 10px 20px;
  background-color: dodgerblue;
  border: 1px solid #ddd;
  color: white;
  cursor: pointer;
}

.dlh-form-inline button:hover {
  background-color: royalblue;
}

@media (max-width: 800px) {
  .dlh-form-inline input {
    margin: 10px 0;
  }

  .dlh-form-inline {
    flex-direction: column;
    align-items: stretch;
  }
}

/* The Modal (background) */
.dlh-modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

/* Modal Content */
.dlh-modal-content {
  position: relative;
  background-color: #fefefe;
  margin: auto;
  padding: 0;
  border: 1px solid #888;
  width: 80%;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
  -webkit-animation-name: animatetop;
  -webkit-animation-duration: 0.4s;
  animation-name: animatetop;
  animation-duration: 0.4s
}

/* Add Animation */
@-webkit-keyframes animatetop {
  from {top:-300px; opacity:0}
  to {top:0; opacity:1}
}

@keyframes animatetop {
  from {top:-300px; opacity:0}
  to {top:0; opacity:1}
}

/* The Close Button */
.dlh-close {
  color: white;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.dlh-close:hover,
.dlh-close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

.dlh-modal-header {
  padding: 2px 16px;
  background-color: #5cb85c;
  color: white;
}

.dlh-modal-body {padding: 2px 16px;}

.dlh-modal-footer {
  padding: 2px 16px;
  background-color: #5cb85c;
  color: white;
}</style>`);

    $('body').prepend(`<!-- The Modal -->
<div id="myModal" class="dlh-modal">
  <!-- Modal content -->
  <div class="dlh-modal-content">
    <div class="dlh-modal-header">
      <span class="dlh-close">&times;</span>
      <h2>Download Links Helper - 下载链接助手</h2>
    </div>
    <div class="dlh-modal-body">
      <div class="dlh-navbar">
<div id="linkTag" class="dlh-dropdown">
    <button class="dropbtn">
    </button>
    <div id="linkTypeSelect" class="dlh-dropdown-content">
    </div>
  </div>
  <a id="ruleTag" onclick="ruleTab()">规则配置</a>
</div>
<div id="dlh_div">
    </div>
</div>
    <div class="dlh-modal-footer">

    </div>
  </div>
</div>`);

    let modal = document.getElementById("myModal");

    let span = document.getElementsByClassName("dlh-close")[0];

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if(event.target == modal) {
            modal.style.display = "none";
        }
    }
    let clhBtn = function() {
        modal.style.zIndex = [...document.all].reduce((r, e) => Math.max(r, +window.getComputedStyle(e).zIndex || 0), 0) + 1;
        modal.style.display = 'block';
    }
    GM_registerMenuCommand("复制下载链接", clhBtn);
    initLinkTab();
})();

unsafeWindow.newRule = function() {
    let len = $('div[name="dlh_rule_div"]').length;
    if(len > 0) {
        $('#rule_div_' + (len - 1)).after(`<div id="rule_div_` + len + `" name="dlh_rule_div" class="dlh-form-inline">
  <input type="text" id="rule_name_` + len + `" placeholder="名称" />
  <input type="text" id="rule_ex_` + len + `" placeholder="正则表达式" />
  <button type="submit" onclick="saveRule(null, ` + len + `)">保存</button>
  <button type="submit" onclick="delRule(null, ` + len + `)">删除</button>
</div>`);
    } else {
        $(`<div id="rule_div_0" name="dlh_rule_div" class="dlh-form-inline">
  <input type="text" id="rule_name_0" placeholder="名称" />
  <input type="text" id="rule_ex_0" placeholder="正则表达式" />
  <button type="submit" onclick="saveRule(null, 0)">保存</button>
  <button type="submit" onclick="delRule(null, 0)">删除</button>
</div>`).insertBefore($('#dlh_div').children(':first'));
    }
}

unsafeWindow.delRule = function(id, i) {
    if(id != null) {
        GM_deleteValue(id);
    }
    $('#rule_div_' + i).remove();
    unsafeWindow.ruleTab();
    initLinkTab();
}

unsafeWindow.saveRule = function(id, i) {
    let str = '{"ruleName":"' + $('#rule_name_' + i).val() + '","ruleEx":"' + escape($('#rule_ex_' + i).val()) + '"}';
    if(id == null) {
        GM_setValue(getUUID(), JSON.parse(str));
    } else {
        GM_setValue(id, JSON.parse(str));
    }
    unsafeWindow.ruleTab();
    initLinkTab();
}

unsafeWindow.ruleTab = function() {
    let emptyRuleHtml = `<div id="rule_div_0" name="dlh_rule_div" class="dlh-form-inline">
  <input type="text" id="rule_name_0" placeholder="名称" />
  <input type="text" id="rule_ex_0" placeholder="正则表达式" />
  <button type="submit" onclick="saveRule(null, 0)">保存</button>
  <button type="submit" onclick="delRule(null, 0)">删除</button>
</div>`;
    let ids = GM_listValues();
    let html = '';
    if(ids == null || ids.length == 0) {
        html = emptyRuleHtml;
    } else {
        for(let i = 0; i < ids.length; i++) {
            html += `<div id="rule_div_` + i + `" name="dlh_rule_div" class="dlh-form-inline">
  <input type="text" id="rule_name_` + i + `" placeholder="名称" value="` + GM_getValue(ids[i]).ruleName + `" />
  <input type="text" id="rule_ex_` + i + `" placeholder="正则表达式" value="` + unescape(GM_getValue(ids[i]).ruleEx) + `" />
  <button type="submit" onclick="saveRule('` + ids[i] + `',` + i + `)">保存</button>
  <button type="submit" onclick="delRule('` + ids[i] + `',` + i + `)">删除</button>
</div>`;
        }
    }
    html += '<button class="dlh-button" onclick="newRule()">新建</button>';
    $('#dlh_div').html(html);
    $('#linkTypeSelect').css('z-index', $('#rule_name_0').css('z-index') + 1)
};

unsafeWindow.copyLinks = function() {
    let links = '';
    $.each($('input[name="dlh_sub"]:checkbox:checked'), function() {
        links += $(this).val() + '\n';
    });
    GM_setClipboard(links, 'text');
    alert('已复制到剪贴板，去粘贴吧!');
};

unsafeWindow.showLinks = function(ruleEx) {
    ruleEx = eval(ruleEx);
    let html = '';
    html += `<div style="overflow-x:auto;max-height:350px">
  <table>
    <tr>
    <th><input id="dlh_all" type="checkbox"></th>
      <th>编号</th>
      <th>标题</th>
      <th>链接</th>
    </tr>`;
    let index = 1;
    let trs = '';
    $('a').each(function() {
        if(ruleEx.test($(this).attr('href'))) {
            trs += '<tr><td><input name="dlh_sub" type="checkbox" value="' + $(this).attr('href') + '"></td><td>' + (index++) + '</td><td>' + $(this).text() + '</td><td>' + $(this).attr('href') + '</td></tr>';
        }
    });
    $('img').each(function() {
        if(ruleEx.test($(this).attr('src'))) {
            trs += '<tr><td><input name="dlh_sub" type="checkbox" value="' + $(this).attr('src') + '"></td><td>' + (index++) + '</td><td>' + $(this).text() + '</td><td>' + $(this).attr('src') + '</td></tr>';
        }
    });
    if(trs == '') {
        trs = '<tr><td colspan="5">无</td></tr>';
    }
    html += trs + `</table></div>
<button class="dlh-button" onclick="copyLinks()">复制</button>`;
    $('#dlh_div').html(html);
    $("#dlh_all").on('click', function() {
        $("input[name='dlh_sub']").prop("checked", this.checked);
    });
    $("input[name='dlh_sub']").on('click', function() {
        var $subs = $("input[name='dlh_sub']");
        $("#dlh_all").prop("checked", $subs.length == $subs.filter(":checked").length ? true : false);
    });
}

function initLinkTab() {
    let obj = $('#linkTag');
    let html = '';
    let ids = GM_listValues();
    if(ids == null || ids.length == 0) {
        obj.children().first().html('请设置规则<i class="down-arr"></i>');
    } else {
        obj.children().first().html('请选择规则<i class="down-arr"></i>');
        for(let i = 0; i < ids.length; i++) {
            html += '<a onclick="showLinks(\'' + unescape(GM_getValue(ids[i]).ruleEx) + '\')">' + GM_getValue(ids[i]).ruleName + '</a>';
        }
        $('#linkTypeSelect').html(html);
        //         return unescape(GM_getValue(ids[0]).ruleEx);
    }
}

function getUUID() {
    let s = [];
    let hexDigits = '0123456789abcdef';
    for(let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-';
    let uuid = s.join('');
    return uuid;
}