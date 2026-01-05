// ==UserScript==
// @name         One Secret Script in NGA
// @namespace    https://greasyfork.org/zh-CN/scripts/29106-one-secret-script-in-nga
// @version      1.2.1
// @require      http://cdn.bootcss.com/jquery/1.10.2/jquery.min.js
// @description  一个脚本，有一些特殊的用处
// @author       Lyragosa
// @include      /^(http|https)://(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn)/(|nuke\.php\?func=ucp)/
// @license      MIT License
// @grant    unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/29106/One%20Secret%20Script%20in%20NGA.user.js
// @updateURL https://update.greasyfork.org/scripts/29106/One%20Secret%20Script%20in%20NGA.meta.js
// ==/UserScript==

var jQ = jQuery.noConflict();

/**/
function get_qs(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = location.search.substr(1).match(reg);
    if (r !== null) return unescape(r[2]); return null;
}

function stamp2time(stamp) {
    var unixTimestamp = new Date(stamp * 1000);
    return unixTimestamp.toLocaleString();
}

function ipdec2dot (ip) {
if(typeof ip =='string' && ip.indexOf('.')!=-1)
	return ip;
    ip = parseInt(ip);
return [ip >>> 24, ip >>> 16 & 0xFF, ip >>> 8 & 0xFF, ip & 0xFF].join('.');
}

function toint(a) {
    var n = parseInt(n,10);
    if(!n)n=0;
    return n;
}

var global_page = -10;

function ld_rg(id,page) {
    
    var getroll = {
        type:"POST",
        url:"/nuke.php?__lib=nuke&__act=check_reg_log",
        data:{
            uid:id,
            opt:2,
            page:page,
            raw:11
        },
        beforeSend: function(){
            // __AJAX_LOADING_IMG
        },
        success:function(e) {
            if (e.time) {
                jQ("#debug").append(e.time + " | 第"+ global_page +"页抓取success <br>");
                var mot = e.data[1];
                var fin = "";
                for (var i in mot) {
                    for (var j in mot[i]) {
                        if (j==8||j==9||j==10) {
                            mot[i][j] = stamp2time(mot[i][j]);
                        }
                        else if (j==1) {
                            mot[i][j] = ipdec2dot(mot[i][j]);
                        }
                        fin += mot[i][j]+",";
                    }
                    fin += "\n";
                }
                jQ("#output").append(fin);
                global_page++;
                if (global_page <= 10) {
                    ld_rg(id,global_page);
                }
            }
            else {
                alert('error');
            }
        },
        error:function() {
            alert('error');
        },
        complete:function() {
            //nothing
        }
    };
    jQ.ajax(getroll);
}

(function(){
    
    function so() {
        jQ('#commonuiwindow').find('table').find("input[type='checkbox']").each(function(){
            jQ(this).prop('checked',true);
        });
    }

    jQ("#ucp_block").on("click","a",function(){
        var blabla = jQ(this).html();
        if (blabla == "[∓5天 相近]" || blabla == "[当天]" || blabla == "[∓3天]" || blabla == "[∓5天]") {
            setTimeout(function(){
                if (jQ("#xxxxx1").length < 1) {
                    jQ('#commonuiwindow').find('.div2').prepend("<p><a href='javascript:;' id='xxxxx1' >[全选]</a></p>");
                }
            },100);
            setTimeout(function(){
                jQ('#xxxxx1').on("click",function(){
                    so();
                });
            },200);
        }
        else {
            jQ('#xxxxx1').remove();
        }
    });
    jQ("body").on('keydown',function(e){
         if(e && e.keyCode==113) {
             so();
         }
    });
    


    //OUTPUT REG LOG


    if (location.href.indexOf('/nuke.php?func=reglog_dump')>0) {
        var uid = get_qs('id');
        if (uid) {
            ld_rg(uid,global_page);
            jQ("body").append("<h2 id='page_title'><a href='http://bbs.ngacn.cc'>BBS.NGACN.CC</a> &nbsp; 注册记录 Dump</h2> 将 [UID:"+uid+"] 附近共10500条注册记录进行Dump <BR> ");
            jQ("body").append("操作步骤: <br>1. 在nuke群发表情“求求二哥了.gif”<Br>2. 等待约30秒~1分钟 <br>"+
                              "3. 将下述文本框里内容复制，另存为扩展名为 .csv 的文件（需使用ANSI编码，可直接用Windows记事本保存），之后双击使用 Excel 打开 <BR> 4. 内容可能会缺损，如果发现内容缺损，请用力刷新本页 <BR> <textarea id='output' rows=10 cols=50></textarea> <BR> <div id='debug'></div>");
            var fin = "UID,IP,激活,用户名,邮箱,,威望,发帖数,注册时间,前次访问,最近访问,注册时UA,注册时地区,\n";
            jQ("#output").html(fin);
        }
        else {
             jQ("body").append("<h2 id='page_title'><a href='http://bbs.ngacn.cc'>BBS.NGACN.CC</a> &nbsp; 注册记录 Dump</h2> 参数错误 ");
        }
    }
    
    if (location.href.indexOf('/nuke.php?func=ucp')>0) {
             setTimeout(function(){
                     var uid = get_qs('uid');
                     //alert(uid);
                    jQ("ul.actions li").eq(3).append(" <a href='/nuke.php?func=reglog_dump&id="+uid+"' target='_blank'>[注册记录 Dump]</a>");
            },400);
  
    }


})();