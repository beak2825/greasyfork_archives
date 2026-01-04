// ==UserScript==
// @name         【洛谷】Luogu-BenBen-Limit-decadence
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  限制发犇数量，防止颓废
// @author       Trotyl
// @match        https://www.luogu.com.cn
// @match        https://www.luogu.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407852/%E3%80%90%E6%B4%9B%E8%B0%B7%E3%80%91Luogu-BenBen-Limit-decadence.user.js
// @updateURL https://update.greasyfork.org/scripts/407852/%E3%80%90%E6%B4%9B%E8%B0%B7%E3%80%91Luogu-BenBen-Limit-decadence.meta.js
// ==/UserScript==

(function() {
    $('document').ready(function(){setTimeout(function () {
    var benbencnt, limitcnt, benbenhide, benbenallcnt;
    benbencnt = localStorage.LG_benbencnt;
    limitcnt = localStorage.LG_limitcnt;
    benbenhide = localStorage.LG_benbenhide;
    benbenallcnt = localStorage.LG_benbenallcnt;
    console.log(benbencnt, limitcnt); //用于调试
    $sidebar = $('#app-old .lg-index-content .lg-right.am-u-lg-3');
    $firstele = $($sidebar.children()[0]);
    $finder = $(`
      <div class="lg-article" id="search-user-form">
        <h3>BenBen-Limit-decadence</h3>
        <small><a href="https://greasyfork.org/zh-CN/scripts/407852">项目地址</a></small>&nbsp;&nbsp;&nbsp;<small><a href="https://www.luogu.com.cn/paste/b0yjle93">FAQ</a></small>
        <script>
          function do_limitcnt_save() {
            localStorage.LG_limitcnt = $('[name=limitcnt-up]')[0].value;
            localStorage.LG_benbencnt = 0;
            console.log("发犇限制已启动");
            location.href = "/";
          }
          function do_limitcnt_clear() {
            localStorage.LG_limitcnt = undefined;
            localStorage.LG_benbencnt = 0;
            localStorage.LG_benbenhide = 0;
            location.href = "/";
          }
        </script>
        <br>
        <form id="limit-cnt">
          <input type="text" class="am-form-field" name="limitcnt-up" placeholder="犇犇条数上限" autocomplete="off" />
        </form>
        <button class="am-btn am-btn-sm am-btn-primary" id="delete-user-button" onclick="do_limitcnt_clear()" style="margin-top:16px">清空</button>
        <button class="am-btn am-btn-sm am-btn-primary lg-right" id="search-user-button" onclick="do_limitcnt_save()" style="margin-top:16px;">确定</button>
      </div>
    `);
    $finder.insertAfter($firstele);
    benbencnt = localStorage.LG_benbencnt;
    limitcnt = localStorage.LG_limitcnt;
    benbenhide = localStorage.LG_benbenhide;
    benbenallcnt = localStorage.LG_benbenallcnt;
    $("#feed-submit").click(function(){
        if ((feedMode=="my" || feedMode == "watching")&&$('#feed-content').val())
        {
            localStorage.LG_benbencnt++;
            localStorage.LG_benbenallcnt++;
            setTimeout(function(){
                console.log("犇犇条数：", localStorage.LG_benbencnt); //输出调试
                console.log("犇犇总量：", localStorage.LG_benbenallcnt);
            },1000);
            if (localStorage.LG_benbencnt > localStorage.LG_limitcnt) {
                console.log("不要再水啦啊啊！");
                localStorage.LG_benbenhide = 1;
                location.href = "/";
            }
        }
    });
    $("#check_benben").click(function(){
        if (feedMode=="my" || feedMode == "watching")
        {
             localStorage.LG_benbencnt++;
            localStorage.LG_benbenallcnt++;
             setTimeout(function(){
                 console.log("犇犇条数：", localStorage.LG_benbencnt); //输出调试
                 console.log("犇犇总量：", localStorage.LG_benbenallcnt);
            },1000);
            if (localStorage.LG_benbencnt > localStorage.LG_limitcnt) {
                console.log("不要再水啦啊啊！");
                localStorage.LG_benbenhide = 1;
                location.href = "/";
            }
        }
    });
    console.log(localStorage.LG_benbenhide);
    var hidden_benben_css="";
    hidden_benben_css += [".lg-index-benben>div+div+div {display: none!important}.lg-index-benben>div+div+div+ul  {display: none!important} div.feed+.spinner {display: none}div.feed+.load-more,#feed-more{display: none!important}"
        ].join("\n");//隐藏犇犇的css
    if (localStorage.LG_benbenhide == 1) {
        console.log("您已到达犇犇上线，已自动隐藏犇犇");
        if (typeof GM_addStyle != "undefined") {
	        GM_addStyle(hidden_benben_css);
        } else if (typeof PRO_addStyle != "undefined") {
	        PRO_addStyle(hidden_benben_css);
        } else if (typeof addStyle != "undefined") {
	        addStyle(hidden_benben_css);
        } else {
        	var node_benben = document.createElement("style");
        	node_benben.type = "text/css";
        	node_benben.appendChild(document.createTextNode(hidden_benben_css));
        	var heads_benben = document.getElementsByTagName("head");
        	if (heads_benben.length > 0) {
        		heads_benben[0].appendChild(node_benben);
        	} else {
        		document.documentElement.appendChild(node_benben);
        	}
        }
    }
  },500)});
})();