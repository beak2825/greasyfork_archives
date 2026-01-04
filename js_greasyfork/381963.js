// ==UserScript==
// @name         rarbg添加豆瓣直连

// @version      0.4.2
// @description  添加豆瓣直连,方便确认译名(可是豆瓣查询有频率限制很麻烦,老电影返回的数据多半还没有中文名,但是豆瓣页面却有,实在是很残疾.)
// @author       You
// @match        https://rarbgprx.org/torrents.php*
// @match        https://rarbg.to/torrents.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @connect      api.douban.com
// @namespace https://greasyfork.org/users/94864
// @downloadURL https://update.greasyfork.org/scripts/381963/rarbg%E6%B7%BB%E5%8A%A0%E8%B1%86%E7%93%A3%E7%9B%B4%E8%BF%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/381963/rarbg%E6%B7%BB%E5%8A%A0%E8%B1%86%E7%93%A3%E7%9B%B4%E8%BF%9E.meta.js
// ==/UserScript==

//每过二十四小时删除一次所有GM_setValue数据
var D=GM_getValue('DelTime',false);
if (D){
    D=new Date(D)
    var D0=D.getTime()/1000
    var TD=new Date(); var TD0=TD.getTime()/1000
    var f=TD0-D0
    if (f>=86400){
        console.log('上次删除日期:'+D.toLocaleString())
        var Lv=GM_listValues()
        console.log('需要删除项:'+Lv.length)
        for (var i = 0; i <Lv.length; i++) {

            if (Lv[i].match(/tt\d{7}/)) {
                GM_deleteValue(Lv[i])
            }
        }
        GM_setValue('DelTime',Date().valueOf())
    }
} else {
    GM_setValue('DelTime',Date().valueOf())
}

function get2(q,dt) {
    //if (!dt.title) {return ;}//console.log('无:'+w)}
    //console.log(dt)
    var c=q.cloneNode(true)
    c.firstChild.src='https://img3.doubanio.com/favicon.ico';
    c.target="_blank";
    c.firstChild.style= 'padding: 0px 5px;width: 12px;'
    c.href=dt.mobile_link;
    if (dt.alt_title) {
        q.parentNode.appendChild(document.createTextNode('||  '+dt.alt_title))
        //var v=
    }
    q.parentNode.insertBefore(c,q);

}

function get(q,w) {

    //q.parentNode.insertBefore(c,q)
    var data = GM_getValue(w, false)
    if (data) {
        get2(q,data)
        //console.log('重复:'+w)
        //
    } else {
    
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://api.douban.com/v2/movie/imdb/' + w + '?apikey=0df993c66c0c636e29ecbb5344252a4a',
            onload: function(response) {
                var data = JSON.parse(response.responseText);
                //console.log(data)
                if (data.code) {
                    console.log(data.msg)
                }else{
                    GM_setValue(w, data)
                    get2(q,data)
                    //console.log('获取:'+w)
                };

            }
        });
    }
    //if (c.title) {q.parentNode.insertBefore(c,q);}
}
var t=document.querySelectorAll('a[href*="imdb"]')
//console.log(l)
for (var i = 0; i <t.length; i++) {

	var d=t[i].attributes[0].value.match(/tt\d{7}/)
    get(t[i],d)

}