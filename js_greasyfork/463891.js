// ==UserScript==
// @name         V2 all
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  【竞品】新增图片移到命中内容栏；命中外链超显示；家族报警; 挂机报警
// @author       丁振兴
// @match        https://live-media-monitor.wemomo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wemomo.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463891/V2%20all.user.js
// @updateURL https://update.greasyfork.org/scripts/463891/V2%20all.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const font_size='18px'

    //图片移到命中内容栏
    function fd(e) {
    var t = document.getElementById("root-position-img");
    if (!t) {
        var n = document.createElement("div");
        n.id = "root-position-img";
        var a = `\n      <div\n        id="position-img"\n        style="position: fixed;\n        width: 500px;\n        z-Index:99999;\n        box-sizing: border-box;\n       \n        overflow: hidden;\n        left: 100px; top: 100px;\n        "\n      >\n        <img \n        style="\n        height: 100%;\n        width: 100%;" \n        src="${e.target.src}"\n        alt="" />\n      </div>\n    `;
        n.innerHTML = a,
        document.body.appendChild(n)
    }
}

function oml() {
    if (document.getElementById("root-position-img")) {
        document.getElementById("root-position-img").remove()
    }
}
function jingpin() {
    document.querySelectorAll('[style="display: inline;"]').forEach(function(item, index) {
        item.style.fontSize = font_size
    })
   // document.querySelectorAll('[style^="max-width: 500px;"]').forEach(function(item, index) {
   //     item.style.fontSize = font_size
    //})
    document.querySelectorAll('tr td:nth-child(3)').forEach(function(item, index) {
        item.style.fontSize = font_size
    })
    //     if (document.location.href.indexOf('competingGoodsAudit') > -1) {
    document.querySelectorAll('tr th:nth-child(2)').forEach(function(item) {
        item.style.display = "none"
    })
    document.querySelectorAll('tr td:nth-child(2)').forEach(function(item) {
        item.style.display = "none"
    })
    document.querySelectorAll('tr th:nth-child(6)').forEach(function(item) {
        item.style.display = "none"
    })
    document.querySelectorAll('tr td:nth-child(6)').forEach(function(item) {
        item.style.display = "none"
    })

    var jp = document.getElementsByClassName("q-tr")

    for (let j = 0; j < jp.length; j++) {
        var kaibo = ""

        if (jp[j].cells[1].textContent.substring(jp[j].cells[1].textContent.indexOf('注册时间')).match(/否/g) && jp[j].cells[1].textContent.substring(jp[j].cells[1].textContent.indexOf('注册时间')).match(/否/g).length == 2) {
            kaibo += '没'
        } else {
            kaibo += ''
        }
        var caizhu = jp[j].cells[1].textContent.split('\n')[5].replace('天', '').split('等级：')[2].split('注册时间： ')
        if (Number(caizhu[0]) == 0 && Number(caizhu[1]) < 101 && jp[j].cells[1].textContent.split('\n')[7].trim() == '否') {
            kaibo += "  小白号"
        } else {
            kaibo += "  非小白号"
        }
         if (Number(caizhu[0]) >= 20){
              kaibo += "  高价值"
         }
                 if(eval(jp[j].cells[1].textContent.split('\n')[12].split('：')[1])>0){
              kaibo +='|   封禁: '+jp[j].cells[1].textContent.split('\n')[12].split('：')[1]
         }
                  if(eval(jp[j].cells[1].textContent.split('\n')[13].split('：')[1])>0){
              kaibo +='   竞品: '+jp[j].cells[1].textContent.split('\n')[13].split('：')[1]
         }

        //     if (Number(jp[j].cells[1].textContent.split('\n')[5].split('等级：')[jp[j].cells[1].textContent.split('\n')[5].split('等级：').length - 2].replace('', '')) == 0 && Number(jp[j].cells[1].textContent.split('\n')[5].split('等级：')[jp[j].cells[1].textContent.split('\n')[5].split('等级：').length - 1].split('注册时间：')[0]) == 0 && Number(jp[j].cells[1].textContent.split('\n')[5].split('等级：')[jp[j].cells[1].textContent.split('\n')[5].split('等级：').length - 1].split('注册时间：')[1].replace('天', '')) <= 100) {
        //         kaibo += "  小白号"
        //     } else {
        //         kaibo += "  非小白号"
        //     }
        //     if (Number(jp[j].cells[1].textContent.split('\n')[5].split('等级：')[jp[j].cells[1].textContent.split('\n')[5].split('等级：').length - 2].replace('', '')) >= 20) {
        //         kaibo += "  高价值"
        //     }

        var mmid = jp[j].cells[1].textContent.split('\n')[4].trim()

        var idlink = '<a href="https://moirai.immomo.com/admin/q1w2e3/userinfo/' + mmid + '"  target="_blank">' + mmid + '</a>'+"<button style='margin-left: 10px;' onclick='".concat('navigator.clipboard.writeText("',mmid,'")'+"'"+'>复制ID</button>')


        jp[j].cells[2].innerHTML = jp[j].cells[1].textContent.split('\n')[5].split('：')[1].replace('等级', '') + "  " + idlink + '<br>' + kaibo + '<br>' + jp[j].cells[2].innerHTML
        var dx = -2
        var media = jp[j].cells[4 + dx].querySelectorAll('a')
        var expression = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=*]*)/g
        var regex = new RegExp(expression);
        var sp = jp[j].cells[4 + dx].textContent.match(regex)
        if (sp) {
            var lik = ''
            for (let i = 0; i < sp.length; i++) {
                //         var duan = jp[j].cells[4 + dx].textContent.split(sp[i])
                //         jp[j].cells[4 + dx].innerHTML = duan[0] + '<cite><a href=' + sp[i] + ' target=_black>' + sp[i] + '</a></cite>' + duan[1]
                if(sp[i].indexOf('http')>-1)
                   {      lik += '<cite><a href=' + sp[i] + ' target=_black style="max-width: 500px; white-space: initial;">' + sp[i] + '</a></cite><br>' }
                else{
                 lik += '<cite><a href=' +'https://'+ sp[i] + ' target=_black style="max-width: 500px; white-space: initial;">' + sp[i] + '</a></cite><br>'
                }


            }
            jp[j].cells[4 + dx].innerHTML += lik
        }

        if (jp[j].cells[4].textContent == '') {
           const clone=jp[j].cells[3].querySelector('a').cloneNode(true)
                 clone.textContent=clone.href
            jp[j].cells[4 + dx].append(clone)
        }

    }
document.querySelectorAll('.q-tr').forEach(function copy_img(item) {
    if (item.cells[4].textContent == '' && item.cells[3].querySelectorAll('img').length > 0) {
        item.cells[3].querySelectorAll('img').forEach(function have_img(img) {
            const clone = img.cloneNode(true)
            clone.onmouseover = fd
            clone.onmouseleave = oml
            item.cells[2].append(clone)
        })

    }
      if (item.cells[4].textContent == '竞品-ocr转' ) {
        item.cells[2].querySelectorAll('img').forEach(function ocr(img) {

            img.onmouseover = fd
            img.onmouseleave = oml

        })

    }
})







}

function jingpin_sx() {
    if (document.querySelectorAll('tr th:nth-child(6)').length>0) {
        if (document.querySelectorAll('tr th:nth-child(6)')[0].style.display != 'none') {
            jingpin()
        }

    }
    if (document.querySelectorAll('tr').length == 0) {
        setTimeout("window.location.reload()", 50)
    }
}
function liaoliaosx() {
    if (window.location.href.indexOf('LIVE_SPAM_STRATEGY') > -1) {
        if (document.querySelectorAll('.q-checkbox__inner')[0].getAttribute('class').indexOf('falsy') > -1) {
            document.querySelectorAll('.q-checkbox__inner')[0].click()
        }
     //           if (document.querySelectorAll('.q-checkbox__inner')[1].getAttribute('class').indexOf('falsy') > -1) {
     //       document.querySelectorAll('.q-checkbox__inner')[1].click()
    //    }
        if (document.querySelectorAll('tr').length == 1) {
            var timer1 = setTimeout("document.querySelectorAll('.q-checkbox__inner')[2].click()", 0)
        } else {
            if (window.Notification && Notification.permission !== "denied") {
                Notification.requestPermission(function(status) {
                    var n = new Notification('来量提醒',{
                        body: 'spam 聊聊进量了！',
                        title: '聊聊来量了',
                        icon: 'https://s.momocdn.com/s1/u/ihjbiceee/momolog.png'
                    });
                    n.onshow = function() {

                        setTimeout(function clno() {
                            n.close()
                        }, 2000);
                    }
                });
            }

        }
    }
}

function 家族提醒() {
    if (window.location.href.indexOf('channel_id=108') > -1) {
        document.querySelectorAll('.q-btn__content').forEach(function add_tj(item) {
            if (item.textContent.indexOf('提交') > -1) {
                item.id='tijiao'
            }
        })
        if (document.querySelectorAll('#conlist').length==0) {
            window.location.reload()

        } else {
            if (window.Notification && Notification.permission !== "denied") {
                Notification.requestPermission(function(status) {
                    var n = new Notification('来量提醒',{
                        body: '家族来量了',
                        title: '家族来量了',
                        icon: 'https://s.momocdn.com/s1/u/ihjbiceee/momolog.png'
                    });
                    n.onshow = function() {

                        setTimeout(function clno() {
                            n.close()
                        }, 3000);
                    }
                });
            }

        }
    }
}
setInterval(家族提醒, 4000)

function 挂机提醒() {
    if (window.location.href.indexOf('hangUpRecord') > -1) {
        if (document.querySelectorAll('tr td').length==0) {
            window.location.reload()

        } else {
            if (window.Notification && Notification.permission !== "denied") {
                Notification.requestPermission(function(status) {
                    var n = new Notification('挂机提醒',{
                        body: '挂机提醒',
                        title: '挂机提醒',
                        icon: 'https://s.momocdn.com/s1/u/ihjbiceee/momolog.png'
                    });
                    n.onshow = function() {

                        setTimeout(function clno() {
                            n.close()
                        }, 3000);
                    }
                });
            }

        }
    }
}
setInterval(挂机提醒, 5000)


function abnormalNewAnchor() {

    // V2 非本人 批量

    var myhead = document.querySelector('.q-table__bottom')
    //document.querySelector('.q-form')
    var button1 = document.createElement("button");
    button1.id = 'fbrbohui'
    button1.innerHTML = '批量异常';
    // button1.onclick = zuoButton
    button1.style.marginRight = '250px'
    button1.style.height = '50px'
    button1.style.position = 'absolute'
    button1.style.right = '0px'
    button1.style.zIndex = 3
    button1.style.backgroundColor = 'red'
    if (myhead) {
        myhead.appendChild(button1);
    }

    var button2 = document.createElement("button");
    button2.id = 'fbrpass'
    button2.innerHTML = '批量无异常';
    //  button2.onclick = youButton
    button2.style.marginRight = '150px'
    button2.style.height = '50px'
    button2.style.position = 'absolute'
    button2.style.right = '0px'
    button2.style.zIndex = 3
    if (myhead) {
        myhead.appendChild(button2);

    }

    document.querySelectorAll('.expand-info').forEach(function (item) {
        item.style.padding = 0
    })

            function zuoButton() {
            document.querySelectorAll('tr td button:nth-child(1)').forEach(function (item) {
                setTimeout(item.click(), 1000)

            })
        }
        function youButton() {
            document.querySelectorAll('tr td button:nth-child(2)').forEach(function (item) {
                setTimeout(item.click(), 1000)

            })
        }

function bili() {
        var timg = document.querySelectorAll('div.expand-info div:nth-child(1) div.con-img:nth-child(1) img')
        for (let i = 0; i < timg.length; i++) {
            document.querySelectorAll('div.expand-info div:nth-child(1) div.con-img:nth-child(1)')[i].style.width = 180 * timg[i].naturalWidth / timg[i].naturalHeight + 'px'
        }



        if(document.querySelector('#fbrbohui')==null){
                var myhead = document.querySelector('.q-table__bottom')
    //document.querySelector('.q-form')
    var button1 = document.createElement("button");
    button1.id = 'fbrbohui'
    button1.innerHTML = '批量异常';
    // button1.onclick = zuoButton
    button1.style.marginRight = '250px'
    button1.style.height = '50px'
    button1.style.position = 'absolute'
    button1.style.right = '0px'
    button1.style.zIndex = 3
    button1.style.backgroundColor = 'red'
    if (myhead) {
        myhead.appendChild(button1);
    }

    var button2 = document.createElement("button");
    button2.id = 'fbrpass'
    button2.innerHTML = '批量无异常';
    //  button2.onclick = youButton
    button2.style.marginRight = '150px'
    button2.style.height = '50px'
    button2.style.position = 'absolute'
    button2.style.right = '0px'
    button2.style.zIndex = 3
    if (myhead) {
        myhead.appendChild(button2);

    }

        if(document.querySelectorAll('tbody tr')[0].cells.length>2){
for (let i = 0; i < document.querySelectorAll('tbody tr').length; i += 2) {
    for (let j = 0; j < 7; j++) {
        document.querySelectorAll('tbody tr')[i].cells[j].style.display = 'none'
    }
    document.querySelectorAll('tbody tr')[i + 1].append(document.querySelectorAll('tbody tr')[i])

}}
    }
        if(document.querySelector('#fbrbohui')){
        document.querySelector('#fbrbohui').onclick = zuoButton
        document.querySelector('#fbrpass').onclick = youButton
           }
    }

    //V2 非本人 实名认证正常比例显示

    setInterval(bili, 800)
}


function guanzhu(){
//舞蹈全隐加id双bt
document.querySelectorAll('tr').forEach(function(item, index) {
    if (index > 0) {
        item.querySelector('td:nth-child(6) div:nth-child(1)').append(item.querySelector('td div div:nth-child(2)'))
    }
    for (let h = 0; h < 5; h++) {
        item.children[h].style.display = "none"
    }
})
document.querySelector('.q-table__bottom').style.marginRight = '200px'

function dt(t) {
    setTimeout(t.click(), Math.random() * 1000)
}

function tt() {
    document.querySelectorAll('.q-btn.q-btn-item.non-selectable.no-outline.q-btn--standard.q-btn--rectangle.bg-blue-7.text-white.q-btn--actionable.q-focusable.q-hoverable.q-btn--wrap').forEach(function (item) {
        setTimeout(item.click(), 1000)
        //    setTimeout(item.click(),Math.random()*1000)
    })
}
var mydiv = document.querySelector('.q-table__bottom')
var gzweigui = document.createElement("button");
gzweigui.innerHTML = '批量无异常';
gzweigui.onclick = tt
gzweigui.style.marginLeft = '50px'
gzweigui.style.height = '50px'
gzweigui.style.position = 'absolute'
gzweigui.style.right = '0px'
if (mydiv) {
    mydiv.appendChild(gzweigui);
}
var myhead = document.querySelector('.q-form')
var gzwwg = document.createElement("button");
gzwwg.id='gzwwg'
gzwwg.innerHTML = '批量无异常';
gzwwg.onclick = tt
gzwwg.style.marginLeft = '50px'
gzwwg.style.height = '50px'
gzwwg.style.position = 'absolute'
gzwwg.style.right = '0px'
gzwwg.style.zIndex = 3
if (myhead) {
    myhead.appendChild(gzwwg);
}

document.querySelectorAll('.mask').forEach(function(item) {
    item.style.display = "none"
})

document.querySelectorAll('video').forEach(function (vv) {
    vv.playbackRate = 3
})
let i = 0
function up(){
document.querySelectorAll('[preload]').forEach(function (video) {
    video.currentTime = isFinite(video.duration - 0.5 * (i % 3)) ? video.duration - 0.5 * (i % 3) : 0;
    i = i + 1;
})
}

setInterval(up,1000)
}



window.onload = function() {
var btn_head = document.createElement("button");
btn_head.textContent = '显隐选择器'
    if(document.querySelector('header div div.q-chip')){
document.querySelector('header div div.q-chip').appendChild(btn_head)}

document.querySelector('.text-h6')?document.querySelector('.text-h6').style.display='none':''
btn_head.onclick = function show_or_not() {
    if (document.querySelector('form').style.display == '') {
        document.querySelector('form').style.display = 'none'
    } else {
        document.querySelector('form').style.display = ''
    }
}
    if(document.querySelector('.q-table__bottom')){
document.querySelector('.q-table__bottom').style.margin = 'auto'}


    if (document.location.href.indexOf('competingGoodsAudit') > -1) {
        setInterval(jingpin_sx, 800)
    }
      if (window.location.href.indexOf('LIVE_SPAM_STRATEGY') > -1) {
          setInterval(liaoliaosx,5000)
      }
    if (window.location.href.indexOf('abnormalNewAnchor') > -1) {
        abnormalNewAnchor()
     // setInterval(bili,500)
    }
        if (window.location.href.indexOf('perfectMoment') > -1) {
        guanzhu()
    }


}
document.addEventListener('keydown', function(e) {
    console.log(e.keyCode)
    var k = e.keyCode || e.which
    switch (k) {
    case 107:
        if (document.location.href.indexOf('#/spam') > -1) {
            document.querySelectorAll('.q-btn__content.text-center.col.items-center.q-anchor--skip.justify-center.row')[document.querySelectorAll('.q-btn__content.text-center.col.items-center.q-anchor--skip.justify-center.row').length - 1].click()
        } else {
       //     if(bt2){
        //    bt2.click()}
            if (document.querySelector('#fbrpass')) {
                document.querySelector('#fbrpass').click()
            }
                        if (document.querySelector('#gzwwg')) {
                document.querySelector('#gzwwg').click()
            }
                        if (document.querySelector('#tijiao')) {
                document.querySelector('#tijiao').click()
            }
        }
        break;
    }
})
//end keydown


    // Your code here...
})();