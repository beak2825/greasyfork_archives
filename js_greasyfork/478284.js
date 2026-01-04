// ==UserScript==
// @name         messenger_spider_v2
// @namespace    http://tampermonkey.net/
// @version      0.10.231026
// @description  messenger collection Tool
// @author       You
// @match        business.facebook.com/*
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @downloadURL https://update.greasyfork.org/scripts/478284/messenger_spider_v2.user.js
// @updateURL https://update.greasyfork.org/scripts/478284/messenger_spider_v2.meta.js
// ==/UserScript==

let baseUrl = 'https://app.tigercv.cc/v1_0';
let accountId = getCookie('c_user') ? getCookie('c_user') : getCookie('m_page_voice');
let scrolllen = 0

function a0(i, item) {
    try{
        /*
        $(item).click(function(event){
            stopBubble(window.event);
        })
        */
        $(item).off('click').click(b0)
    } catch(err) {console.log('Error:', err); return false}
}

function b0() {
    console.log('a0.click', accountId)

    $('#mt'+accountId).val("GET CV")
    $('#mt'+accountId).css('background-color', '#15A2EE');
    $('#mt'+accountId).css('border', '1px solid #15A2EE');
    $('#mt'+accountId).css('color', '#ffffff');

    setTimeout(function(){
        let sessionUser = $($("div[role='heading']").eq(1)).parent()
        let profilelink = sessionUser.find('a').attr('href')
        console.log('profilelink', profilelink)

        let checkData = {profilelink:profilelink}
        GM_xmlhttpRequest({
            method: "POST",
            url: baseUrl + '/facebook/spider/check',
            data: JSON.stringify(checkData),
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(res) {
                if (res.status == 200) {
                    let resData = JSON.parse(res.response);
                    console.log('resData-b0',  resData)
                    if(resData.data == '1') {
                        $('#mt'+accountId).val("GET CV ✅")
                        $('#mt'+accountId).css('background-color', '#ffffff');
                        $('#mt'+accountId).css('border', '1px solid #8d949e');
                        $('#mt'+accountId).css('color', '#4b4f56');
                    } else if(resData.data == '2') {
                        $('#mt'+accountId).val("GET CV 📪")
                        $('#mt'+accountId).css('background-color', '#ffffff');
                        $('#mt'+accountId).css('border', '1px solid #8d949e');
                        $('#mt'+accountId).css('color', '#4b4f56');
                    }
                }
            }
        })
    }, 1000)
}

(function() {
    console.log('启动[Start]')

    window.onclick = function(event) {
        let loadingList = 1
        $.each($(event.target).parents(), function(i, item){
            if ('BizP13NInboxUinifiedThreadListView' == $(item).attr('data-pagelet')){
                loadingList = 0
            }
        })
        if (loadingList == '1') {
            setTimeout(function(){
                let obj = $("div[data-pagelet='BizP13NInboxUinifiedThreadListView']")
                let objList = obj.find("div[style^='position: absolute; left: 0px;']")
                console.log('b0->objList->len', objList.length, scrolllen)
                if (objList.length != scrolllen) {
                    scrolllen = objList.length
                    console.log('b0->scrolllen', scrolllen)

                    $.each(objList, function(i, item){a0(i, item)});
                }
            }, 500)
        }
    }

    let intervar = setInterval(function(){
        let obj = $("div[data-pagelet='BizP13NInboxUinifiedThreadListView']")
        let objList = obj.find("div[style^='position: absolute; left: 0px;']")
        console.log('objList->len', objList.length)

        if (objList.length >= 1) {
            clearInterval(intervar)
            scrolllen = objList.length
            console.log('scrolllen', scrolllen)

            $.each(objList, function(i, item){a0(i, item)});

            // user script
            $("div[aria-label='Instagram comments']").after('  <input type="button" class="getcv" id="mt'+accountId+'" value="GET CV"  />  ')
            $("a[aria-label='Instagram comments']").after('  <input type="button" class="getcv" id="mt'+accountId+'" value="GET CV"  />  ')
            $("div[aria-label='Instagram 评论']").after('  <input type="button" class="getcv" id="mt'+accountId+'" value="GET CV"  />  ')
            $('#mt'+accountId).css('background-color', '#15A2EE');
            $('#mt'+accountId).css('border', '1px solid #15A2EE');
            $('#mt'+accountId).css('color', '#ffffff');
            $('#mt'+accountId).css('border-radius', '4px');
            $('#mt'+accountId).css('text-shadow', 'none');
            $('#mt'+accountId).css('cursor', 'pointer');

            // user init
            let sessionUser = $($("div[role='heading']").eq(1)).parent()
            let profilelink = sessionUser.find('a').attr('href')
            if (profilelink) {
                let checkData = {profilelink:profilelink}
                GM_xmlhttpRequest({
                    method: "POST",
                    url: baseUrl + '/facebook/spider/check',
                    data: JSON.stringify(checkData),
                    headers: {
                        "Content-Type": "application/json"
                    },
                    onload: function(res) {
                        if (res.status == 200) {
                            let resData = JSON.parse(res.response);
                            console.log('resData-default',  resData)
                            if(resData.data == '1') {
                                $('#mt'+accountId).val("GET CV ✅")
                                $('#mt'+accountId).css('background-color', '#ffffff');
                                $('#mt'+accountId).css('border', '1px solid #8d949e');
                                $('#mt'+accountId).css('color', '#4b4f56');
                            } else if(resData.data == '2') {
                                $('#mt'+accountId).val("GET CV 📪")
                                $('#mt'+accountId).css('background-color', '#ffffff');
                                $('#mt'+accountId).css('border', '1px solid #8d949e');
                                $('#mt'+accountId).css('color', '#4b4f56');
                            }
                        }
                    }
                })
            }

            $('#mt'+accountId).click(function(event){
                stopBubble(window.event);
            })
            $('#mt'+accountId).click(function(event){

                $('#mt'+accountId).val("GET CV ...")
                $('#mt'+accountId).css('background-color', '#ffffff');
                $('#mt'+accountId).css('border', '1px solid #8d949e');
                $('#mt'+accountId).css('color', '#4b4f56');

                let username = '',
                    headingimg = '',
                    profilelink = '',
                    workedat = '',
                    studiedat = '',
                    livesin = '',
                    from = '';

                username = $("div[role='heading']").eq(1).text()
                let headerBox = $($($($("div[role='heading']").eq(1)).parent().eq(0)).parent().eq(0)).parent()
                headingimg = headerBox.find('img').eq(0).attr('src')
                let sessionUser = $($("div[role='heading']").eq(1)).parent()
                profilelink = sessionUser.find('a').attr('href')

                if (typeof(headingimg) == 'undefined') {
                    username = $("div[role='heading']").eq(3).text()
                    let headerBox = $($($($("div[role='heading']").eq(3)).parent().eq(0)).parent().eq(0)).parent()
                    headingimg = headerBox.find('img').eq(0).attr('src')
                    let sessionUser = $($("div[role='heading']").eq(3)).parent()
                    profilelink = sessionUser.find('a').attr('href')
                }

                workedat = $("span:contains('Worked at')").find('a').eq(0).text() || $("span:contains('Works at')").find('a').eq(0).text()
                studiedat = $("span:contains('Studied at')").find('a').eq(0).text() || $("span:contains('Studies at')").find('a').eq(0).text()
                livesin = $("span:contains('Lives in')").find('a').eq(0).text()
                from = $("span:contains('From')").find('a').eq(0).text()

                let listData = {
                    accountId: accountId,
                    username: username,
                    headingimg: headingimg,
                    profilelink: profilelink,
                    worked: workedat,
                    studied: studiedat,
                    lives_in: livesin,
                    from: from
                }
                if(profilelink > '') GM_xmlhttpRequest({
                    method: "POST",
                    url: baseUrl + '/facebook/spider/save',
                    data: JSON.stringify(listData),
                    headers:  {
                        "Content-Type": "application/json"
                    },
                    onload: function(res){
                        let resData = JSON.parse(res.response)
                        console.log('SaveData res ===》', resData, JSON.stringify(listData))

                        if (resData.code == 200) {
                            $('#mt'+accountId).val("GET CV ✅")
                            $('#mt'+accountId).css('background-color', '#15A2EE');
                            $('#mt'+accountId).css('border', '1px solid #15A2EE');
                            $('#mt'+accountId).css('color', '#ffffff');

                            let msgtextObj = $("textarea[type='text']")
                            //msgtextObj.val(resData.data)
							//var e = jQuery.Event("keydown")
                            //e.keyCode = 8
                            //$(this).trigger(e)
                            //msgtextObj.focus()

                            //var $temp = $('<input>');
                            var $temp = $('<textarea>');
                            $('body').append($temp);
                            $temp.val(resData.data).select();
                            document.execCommand('copy');
                            $temp.remove();
                            alert('Replicating Success！');

							//$("div[aria-label='发送']").trigger('click')
							//$("div[aria-label='Send']").trigger('click')
                        } else {
                            console.log('--====--')
                        }

                    }
                });

            })
        }
    }, 1000);
    /*
    console.log($("div[style$='will-change: transform; direction: ltr;'] >div").attr('style'))
    $("div[style$='will-change: transform; direction: ltr;']  >div").scroll(function() {
        console.log('滚动[Scroll]')
        if (loading == '0') {
            //var intervar = setInterval(c0, 500);
        }
    })
    */
    /*
    setTimeout(function(){
        let timer = setInterval(function(){
            let obj = $("div[data-pagelet='BizP13NInboxUinifiedThreadListView']")
            let objList = obj.find("div[style^='position: absolute; left: 0px;']")
            console.log('b0->objList->len', objList.length, scrolllen)
            if (objList.length != scrolllen) {
                scrolllen = objList.length
                console.log('scrolllen', scrolllen)

                $.each(objList, function(i, item){a0(i, item)});
            }
        }, 1000)
    }, 1500)
    */

    /*
    let mainBox = $($($($("textarea[type='text']").eq(0)).parent().eq(0)).parent().eq(0)).parent().eq(0)
    if(mainBox) {
        console.log($(mainBox), 'mainBox')

        $(mainBox).before('  <input type="button" class="getcv" id="mt'+userId+'" value="GET CV"  />  ')
        $('#mt'+userId).css('background-color', '#15A2EE');
        $('#mt'+userId).css('border', '1px solid #15A2EE');
        $('#mt'+userId).css('color', '#ffffff');
        $('#mt'+userId).css('border-radius', '4px');
        $('#mt'+userId).css('text-shadow', 'none');
        $('#mt'+userId).css('cursor', 'pointer');
        $('#mt'+userId).click(function(event){
            stopBubble(window.event);
        })

        setTimeout(function(){
            let sessionUser = $($("div[role='heading']").eq(1)).parent()
            let homepage = sessionUser.find('a').attr('href')

            $('#mt'+userId).click(function(event){
                // 'https://tigercv.cc/92406/'+userId
                $("textarea[type='text']").html(homepage)
            })
        }, 3000 )
    }
    */

    console.log('[messager_spider] GET CV End-------');

})();

    // PUBLIC FUNCTION
    function getCookie(name){
        var arrstr = document.cookie.split("; ");
        for(var i = 0;i < arrstr.length;i ++){
            var temp = arrstr[i].split("=");
            if(temp[0] == name) return unescape(temp[1]);
        }
    }

    function stopBubble(e) {
        //如果提供了事件对象，则这是一个非IE浏览器
        if ( e && e.stopPropagation )
            //因此它支持W3C的stopPropagation()方法
            e.stopPropagation();
        else
            //否则，我们需要使用IE的方式来取消事件冒泡
            window.event.cancelBubble = true;

        //阻止默认浏览器动作(W3C)
        if ( e && e.preventDefault )
            e.preventDefault();
        //IE中阻止函数器默认动作的方式
        else
            window.event.returnValue = false;
    }

    function strFilter(str){
        let pattern = new RegExp("[`~%!@#^=''?~《》！@#￥……&——‘”“'？*()（），,。.、·<>]");
        let rs = "";
        for(let i = 0; i < str.length; i++){
            rs += str.substr(i, 1).replace(pattern, '');
        }
        return rs.replace(/\s*/g,"");
    }

    function encodeUTF8(s) {
        var i, r = [], c, x;
        for (i = 0; i < s.length; i++)
            if ((c = s.charCodeAt(i)) < 0x80) r.push(c);
            else if (c < 0x800) r.push(0xC0 + (c >> 6 & 0x1F), 0x80 + (c & 0x3F));
            else {
                if ((x = c ^ 0xD800) >> 10 == 0) //对四字节UTF-16转换为Unicode
                    c = (x << 10) + (s.charCodeAt(++i) ^ 0xDC00) + 0x10000,
                        r.push(0xF0 + (c >> 18 & 0x7), 0x80 + (c >> 12 & 0x3F));
                else r.push(0xE0 + (c >> 12 & 0xF));
                r.push(0x80 + (c >> 6 & 0x3F), 0x80 + (c & 0x3F));
            };
        return r;
    }

    // 字符串加密成 hex 字符串
    function sha1(s) {
        var data = new Uint8Array(encodeUTF8(s))
        var i, j, t;
        var l = ((data.length + 8) >>> 6 << 4) + 16, s = new Uint8Array(l << 2);
        s.set(new Uint8Array(data.buffer)), s = new Uint32Array(s.buffer);
        for (t = new DataView(s.buffer), i = 0; i < l; i++)s[i] = t.getUint32(i << 2);
        s[data.length >> 2] |= 0x80 << (24 - (data.length & 3) * 8);
        s[l - 1] = data.length << 3;
        var w = [], f = [
                function () { return m[1] & m[2] | ~m[1] & m[3]; },
                function () { return m[1] ^ m[2] ^ m[3]; },
                function () { return m[1] & m[2] | m[1] & m[3] | m[2] & m[3]; },
                function () { return m[1] ^ m[2] ^ m[3]; }
            ], rol = function (n, c) { return n << c | n >>> (32 - c); },
            k = [1518500249, 1859775393, -1894007588, -899497514],
            m = [1732584193, -271733879, null, null, -1009589776];
        m[2] = ~m[0], m[3] = ~m[1];
        for (i = 0; i < s.length; i += 16) {
            var o = m.slice(0);
            for (j = 0; j < 80; j++)
                w[j] = j < 16 ? s[i + j] : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1),
                    t = rol(m[0], 5) + f[j / 20 | 0]() + m[4] + w[j] + k[j / 20 | 0] | 0,
                    m[1] = rol(m[1], 30), m.pop(), m.unshift(t);
            for (j = 0; j < 5; j++)m[j] = m[j] + o[j] | 0;
        };
        t = new DataView(new Uint32Array(m).buffer);
        for (var i = 0; i < 5; i++)m[i] = t.getUint32(i << 2);

        var hex = Array.prototype.map.call(new Uint8Array(new Uint32Array(m).buffer), function (e) {
            return (e < 16 ? "0" : "") + e.toString(16);
        }).join("");
        return hex;
    }