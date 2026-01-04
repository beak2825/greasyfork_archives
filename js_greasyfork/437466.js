// ==UserScript==
// @name         百度搜索域名黑名单
// @namespace    https://www.calendarli.com
// @version      0.4
// @description  找个资源全是公众号！！！所以我决定全部拉黑！！
// @author       只为你收集世间云朵
// @license      MIT License
// @match        *://www.baidu.com/s?*
// @icon         https://upyun.calendarli.com/logo.png
// @require      http://cdn.staticfile.org/jquery/2.0.0/jquery.min.js
// @copyright    该脚本完全由 只为你收集世间云朵@greasyfork 原创，谢绝抄袭部分或全部代码！如有借鉴代码，请声明并标注脚本链接。
// @grant        GM_log
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/437466/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%9F%9F%E5%90%8D%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/437466/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%9F%9F%E5%90%8D%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    var str,strArr,H,len,GMARR,MGlen,i,k;
    len=$('.f13.c-gap-top-xsmall.se_st_footer.user-avatar').length
    GMARR=GM_listValues()
    MGlen=GMARR.length

    $('.f13.c-gap-top-xsmall.se_st_footer.user-avatar').append("<div class='LH' style='background: #4e6ef2;padding: 5px 3px;border-radius: 14px;px;margin-left: 16px;color: white;cursor: pointer;'>拉黑</div>")
    $('body').append("<div id='LD_MD'><span>关闭</span></div>")
    GM_addStyle('div#LD_MD {display:none;width: 228px;padding: 10px 5px;margin: auto;background: #747171;position: fixed;top: 11.3%;left: 73%;color: aliceblue;}div#LD_MD li {line-height: 2em;padding-left: 15px;cursor: pointer;transition: all 0.2s;}div#LD_MD li:hover {background: #ff6f6f;color: white;}div#LD_MD span {display: inline-block;float: right;margin-top: 15px;color: #ff9b9b;cursor: pointer;}')
    for(i=0;i<=MGlen-1;i++){
        $('#LD_MD').prepend("<li title='点击移除黑名单' class='LD_MD_LI'>"+GMARR[i]+"</li>")
    }
    $('.LD_MD_LI').on('click',function(){
        GM_deleteValue($(this).text())
        GM_log('==============================')
        GM_log('已移出黑名单：'+$(this).text())
        GM_log(GM_listValues())
        GM_log('==============================')
        $(this).remove()
    })
    $('.LH').on('click',function(){
        str=$(this)[0].parentElement.firstChild.outerText
        if(str.indexOf('/') >= 0 ) {
            //if(str.indexOf('/') >= 0 ) {
                strArr=str.split('/')
                H=strArr[0]
            //}else{
            //    H=str
           // }
        }else{
            H=str
        }
        GM_setValue(H,H)
        GM_log('==============================')
        GM_log('已加入黑名单：'+H)
        GM_log(GM_listValues())
        GM_log('==============================')
        alert("已加入黑名单")
    })
    try {
        GM_registerMenuCommand('打开黑名单列表', function () {
            $("div#LD_MD").show(100)
        });
    } catch (e) {
    }
    $("div#LD_MD span").on('click',function(){
        $("div#LD_MD").hide(100)
    })
    for(k=0;k<=MGlen-1;k++){
        for(i=0;i<=len-1;i++){
            str=$($('.f13.c-gap-top-xsmall.se_st_footer.user-avatar a[style="text-decoration:none;position:relative;"]')[i]).text()
            if(str.indexOf('/') >= 0 ) {
                //if(str.indexOf('/') >= 0 ) {
                    strArr=str.split('/')
                    H=strArr[0]
               // }else{
               //     H=str
               // }
            }else{
                H=str
            }
            if(GMARR[k].indexOf(H)>=0){
                $($('.result.c-container.new-pmd')[i]).remove()
            }
        }
    }
    GM_log('==============================')
    GM_log('当前黑名单列表：'+GM_listValues())
    GM_log('==============================')
})();