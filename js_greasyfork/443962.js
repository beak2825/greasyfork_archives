// ==UserScript==
// @name         Xteng点击插件
// @namespace    https://www.XXXXX.cn/
// @version      1.3.1
// @description  Xteng毫秒点击插件
// @author       Tony Liu
// @match        https://market.m.taobao.com/app/pm/m-bid/order/index.html?*
// @match        https://market.m.taobao.com/app/pm/m-bid/detail/index.html?*
// @match        https://h5.m.taobao.com/app/paimai/www/order/index.html?itemId=*
// @grant        none
// @grant        none
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/443962/Xteng%E7%82%B9%E5%87%BB%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/443962/Xteng%E7%82%B9%E5%87%BB%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
 
(function() {
    if(location.pathname == '/app/pm/m-bid/detail/index.html'){
setTimeout(function(){
        var getQueryString = function(name) {
            let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            let r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return decodeURIComponent(r[2]);
            };
            return null;
        }
        ,itemId = getQueryString('ItemId')
        ,url = 'https://market.m.taobao.com/app/pm/m-bid/order/index.html?itemId='+itemId+'&spm=a2129.11905957.order.1&pmid=8066793351_1649069911431&pmtk=20140647.0.0.0.share_item_detail.0.1&path=share_item_detail%2C22675942%2Cpaimai2021%2C26813340%2C11905957'
        ,r = confirm("打开直链？");
        if(r){
            window.location.href = url;
        }
 
}, 1000 * 5)
 
    }
    if(location.pathname == '/app/pm/m-bid/order/index.html' || location.pathname == '/app/paimai/www/order/index.html'){
        setTimeout(function(){
            var style = '<style>body{position:fixed;top:0;}.ctm-console{width:240px;height:40px;line-height:40px;background:#000;color:#fff;font-size:14px;text-align:center;font-family:simsun;overflow:hidden;margin-bottom:5px;}.ctm-begin{width:40px;height:30px;background:#fb594d;line-height:30px;text-align:center;font-size:12px;border:1px solid #da0f00;box-sizing:border-box;font-family:simsun;color:#fff;cursor:pointer;float:right;}.ctm-stop{width:40px;height:30px;background:#000;line-height:30px;text-align:center;font-size:12px;border:1px solid #000;box-sizing:border-box;font-family:simsun;color:#fff;cursor:pointer;float:right;}.ctm-getid{width:65px;height:30px;background:#dedede;z-index:22222222;line-height:30px;text-align:center;font-size:12px;border:1px solid #d0d0d0;box-sizing:border-box;font-family:simsun;cursor:pointer;float:left;}.ctm-copyright{width:240px;text-align:center;font-size:12px;color:#FFEB3B;font-family:simsun;}.ctm-item{overflow:hidden;width:240px;margin-bottom:5px;}.ctm-wrap{width:240px;padding:15px 10px;background:#3F51B5;position:fixed;box-shadow:0px 0px 20px rgba(0,0,0,0.15);z-index: 9999999;}textarea#tonynote {width: 100%;font-size: 10px;background: #000000;color: #4CAF50;height:180px;}div#countdown {font-size: 12px;margin: 2px 10px 3px 22px;width: 60px;height: 20px;float: left;text-align: center;border: 1px solid #000;border-radius: 6px;background:#000;color:#009688;padding-top:3px;}</style>'
            ,box = '<div class="ctm-wrap"><div class="ctm-console" id="dateId">拍卖工具</div><div class="ctm-item"><button class="ctm-stop" id="myStop" onclick="javascript:stop();">Stop</button><button class="ctm-begin" id="myStart"  onclick="javascript:main();">start</button><div class="ctm-getid" id="getMyid" onclick="javascript:work();">Test</div><div class="ctm-countdown" id="countdown">1</div></div><div class="ctm-item"><textarea id="tonynote" disabled></textarea><div class="ctm-copyright" id="ctm-copyright">POWERED BY Xteng</div></div></div></div>';
            $('body').before(style+box);
            var date = new Date()
            ,year = date.getFullYear()
            ,month = date.getMonth()
            ,day = date.getDate()
            ,min = date.getMinutes()
            ,hour = min < 20 ? date.getHours() : date.getHours() + 1
            ,deadline = new Date(year, month, day, hour, 0).getTime()
            ,timeout
            ,jian = 0
            ,panic = null
            ,before = 135 //提前ms
            ,workTime = 320 //持续ms
            ,pick = 2; //捡漏s
            work = function(){
                document.getElementById('tonynote').value += "\n发>>>";
                document.getElementsByClassName("submit-btn")[0].click()
            };
            stop = function(){
                clearTimeout(timeout);
                clearInterval(panic);
            };
            main = function(){
                jian = 1;
                document.getElementById('tonynote').value = '开工@@@';
                const fn = () => {
                    timeout = setTimeout(function () {
                        var diffms = deadline - Date.now();
                        if(diffms < 0-pick * 1000){
                            panic=setInterval( function Jian(){
                                document.getElementById('tonynote').value += "\n" + (jian++) + "捡...";
                                work()
                                return Jian;
                            }(), 730);
                            clearTimeout(timeout);
                        }else{
                            document.getElementById('countdown').innerText = diffms/1000 + 's';
                            fn();
                        }
                        if(diffms > before-workTime && diffms < before){
                            work();
                        }
                    }, 32); //间隔ms
                };
                fn();
            };
        },1000 * 5);
    }
 
 
})();