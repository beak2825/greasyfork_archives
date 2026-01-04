// ==UserScript==
// @name        HWM [виджет]
// @include     /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/home\.php/
// @description Виджет для главной страницы ГВД
// @version     3.2.1
// @namespace   https://greasyfork.org/users/422769
// @grant       GM.xmlHttpRequest
// @grant       unsafeWindow
// @grant       GM_log
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/422769/HWM%20%5B%D0%B2%D0%B8%D0%B4%D0%B6%D0%B5%D1%82%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/422769/HWM%20%5B%D0%B2%D0%B8%D0%B4%D0%B6%D0%B5%D1%82%5D.meta.js
// ==/UserScript==
(function(window, undefined) {
    GM_addStyle(`

.news-head {
  text-decoration:none;
  align-self: center;
  border-radius: 1.5rem;
  padding: 0.25rem .75rem;
}

.active {
  background: #eae8dd;
}

.active:hover {
  background: #eae8dd80;
}

.news-head__title {
  display: inline;
  font-size: 14px;
  font-weight: normal;
  cursor: pointer;
}

.news-head__switch {
  cursor: pointer;
  align-self: center;
  color: #5D413A40;
  margin-left:10px;
}

.news-head__settings {
  cursor: pointer;
  align-self: center;
  color: #5D413A40;
  margin-left:10px;
  width: 1.5%;
}

.mrgn-l{
  margin-left: 5px;
}

.flex {
  display: flex;
}

.div-style {
  margin: 0 auto 10px;
  padding: 15px 25px 20px;
  overflow: hidden;
  width: 942px;
  border-radius: 5px;
  border: 0 #adadad solid;
  background: url(../i/inv_im/corner_lt2.png) no-repeat top left, url(../i/inv_im/corner_rt2.png) no-repeat top right, url(../i/inv_im/corner_lb2.png) no-repeat bottom left, url(../i/inv_im/corner_rb2.png) no-repeat bottom right #f5f3ea;
  background-size: 14px;
  box-shadow: inset 0 0 0 1px #b19673, 0 2px 5px rgb(0 0 0 / 25%);
}

.res-style {
  display: none;
  justify-content: space-around;
  height: 40px;
  background-color: #eae8dd;
  border-radius: 5px;
  border: 0 #adadad solid;
  margin-top: 10px;
}

.modal {
  width: 100%;
  height: 100%;
  z-index: 1000;
  position: fixed;
  top:0;
  left:0;
  background: #00000050;
  display: none;
  align-items: center;
}

.modal-block {
  display: flex;
  width: 400px;
  height: 300px;
  z-index: 1200;
  margin: 0 auto;
  position: relative;
  border-radius: 5px;
  border: 0 #adadad solid;
  background: url(../i/inv_im/corner_lt2.png) no-repeat top left, url(../i/inv_im/corner_rt2.png) no-repeat top right, url(../i/inv_im/corner_lb2.png) no-repeat bottom left, url(../i/inv_im/corner_rb2.png) no-repeat bottom right #f5f3ea;
  background-size: 14px;
  box-shadow: inset 0 0 0 1px #b19673, 0 2px 5px rgb(0 0 0 / 25%);
  padding: 15px;
  align-items: flex-start;
  flex-direction: column;
  overflow: scroll;
}

.modal-block__head {
  display: flex;
  align-items: center;
}

.modal-block__text {
  margin-top: 20px;
  color: #6e6e6e;
}

.modal-block__btn {
  padding: 5px 15px;
  white-space: nowrap;
  position: relative;
  text-align: center;
  color: #592C08;
  background: url(../i/shop_images/art_btn_bg_gold.png) #DAB761;
  background-size: 100% 100%;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border: 0 solid;
  border-radius: 5px;
  box-shadow: inset 0 0 0 1px #fce6b0, inset 0 0 0 2px #a78750, 0 0 0 1px rgb(0 0 0 / 13%);
  cursor: pointer;
  margin-left: 150px;
}

.modal-block__setting {
  display: flex;
  flex-wrap: wrap;
}

.modal-block__checkbox {
  display: flex;
  align-items: center;
  margin: 0 8px 8px 5px;
  padding: 0;
}

.clan-block {
  flex-direction: column;
}

.clan-style {
  display: inline-flex;
  background-color:#adadad40;
  padding: 3px 7px;
  margin-left: 7px;
  border: 0;
  border-radius: 4px;
  color: #592C08;
}

.res-style__elem {
  align-self: center;
  display: flex;
}

.text-title {
  text-align:left;
  padding-top: 6px;
}

@media screen and (min-width: 320px) and (max-width: 600px) {
  .div-style {
    width: auto;
  }

  .news-head__title {
    font-size: 10px;
  }

  .res-style {
    flex-wrap: wrap;
    height: auto;
    padding: 5px;
  }
  .res-style__elem {
    margin: 0 10px 10px 0;
    font-size: 12px;
  }
  .text-title {
    font-size: 12px;
  }
  .news-head__settings {
    width: 10%;
  }
  .modal-block {
    width: auto;
    height: 400px;
  }
}

`);
    let top = GM_getValue("top", true);
    let last = GM_getValue("last", "0|1");
    let last_ar = last.split('|');
    let firstClan;
    let idForum;
    let idRow;
    let idClan;
    let requestDaily = false;

    function localForumId() {
        if (localStorage.forumId == undefined || localStorage.forumId == 'NaN') {
            localStorage.forumId = 2;
            localStorage.forumRow = 6;
        }
        idForum = Number(localStorage.forumId);
        idRow = Number(localStorage.forumRow);
    }

    function localClanId() {
        if (localStorage.clanId !== undefined) {
            idClan = Number(localStorage.clanId);
        }
    }
    localForumId();
    localClanId();
    let els = getI("/html/body/center/div[2]");
    if (els.snapshotLength == 0) {
        els = getI("/html/body/div[5]/div/div");
    }
    let divOuter = document.createElement('div');
    let divInner = document.createElement('div');
    let divResusr = document.createElement('div');
    if (els.snapshotLength == 1) {
        let el = els.snapshotItem(0);
        let divOuter = document.createElement('div');
        divOuter.innerHTML += `<div class="flex">
                                  <div id="widget" class="flex">
                                       <div id="prevDaily" class="news-head active" opened="1">
                                           <span>📰</span>
                                           <h2 id="prevDaily_t" class="news-head__title" title="Новости HWM Daily">Новости HWM Daily</h2>
                                       </div>
                                       <h2 id="prevForum" class="news-head news-head__title mrgn-l" opened="0" title="Последние темы форума">Последние темы форума</h2>
                                       <h2 id="prevClan" class="news-head news-head__title mrgn-l" opened="0" title="Клановая рассылка">Клановая рассылка</h2>
                                  </div>
                                  <span id="switcher" opened="1" class="news-head__switch"></span>
                                  <span id="hwm_settings" class="news-head__settings" title="Настройки"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="cog" class="svg-inline--fa fa-cog fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"></path></svg></span>
                               </div>
                               <div class="modal" id="modal">
                                  <div class="modal-block">
                                      <div class="modal-block__head">
                                        <h3 class="modal-block__title">Настройки виджета</h3>
                                        <button id="modal-close" class="modal-block__btn">Закрыть</button>
                                      </div>
                                      <form>
                                        <p class="modal-block__text">Выбор форума</p>
                                        <div class="modal-block__setting">
                                          <div class="modal-block__checkbox"><input type="radio" id="forum1" name="forum" value="oif"><label for="forum1">ОиФ</label></div>
                                          <div class="modal-block__checkbox"><input type="radio" id="forum2" name="forum" value="vip"><label for="forum2">ВиП</label></div>
                                          <div class="modal-block__checkbox"><input type="radio" id="forum3" name="forum" value="trnmt"><label for="forum3">Турниры</label></div>
                                          <div class="modal-block__checkbox"><input type="radio" id="forum4" name="forum" value="iip"><label for="forum4">ИиП</label></div>
                                          <div class="modal-block__checkbox"><input type="radio" id="forum5" name="forum" value="bip"><label for="forum5">БиП</label></div>
                                          <div class="modal-block__checkbox"><input type="radio" id="forum6" name="forum" value="fvt"><label for="forum6">ФВТ</label></div>
                                          <div class="modal-block__checkbox"><input type="radio" id="forum7" name="forum" value="meeting"><label for="forum7">Встречи</label></div>
                                          <div class="modal-block__checkbox"><input type="radio" id="forum8" name="forum" value="oa"><label for="forum8">Обычные артефакты</label></div>
                                          <div class="modal-block__checkbox"><input type="radio" id="forum9" name="forum" value="rent"><label for="forum9">Аренда</label></div>
                                          <div class="modal-block__checkbox"><input type="radio" id="forum10" name="forum" value="ukio"><label for="forum10">УКиО</label></div>
                                          <div class="modal-block__checkbox"><input type="radio" id="forum11" name="forum" value="elemnts"><label for="forum11">ПЭСиП</label></div>
                                          <div class="modal-block__checkbox"><input type="radio" id="forum12" name="forum" value="pz-battle"><label for="forum12">ПЗ(Бои)</label></div>
                                          <div class="modal-block__checkbox"><input type="radio" id="forum13" name="forum" value="pz-finance"><label for="forum13">ПЗ(Финансы)</label></div>
                                          <div class="modal-block__checkbox"><input type="radio" id="forum14" name="forum" value="oitpf"><label for="forum14">ТП</label></div>
                                          <div class="modal-block__checkbox"><input type="radio" id="forum15" name="forum" value="ois"><label for="forum15">ОиС</label></div>
                                        </div>
                                      </form>
                                      <form>
                                        <p class="modal-block__text">Выбор клана</p>
                                        <div class="modal-block__setting clans-block">
                                        </div>
                                      </form>
                                  </div>
                               </div>`;
        divResusr.className = "res-style";
        divResusr.innerHTML = getwheelimg();
        divOuter.className = "div-style";
        divOuter.appendChild(divInner);
        divOuter.appendChild(divResusr);
        setTimeout(function() {
            divResusr.style.display = 'flex';
        }, 1200);
        if (top) el.before(divOuter, el.firstChild);
        else el.append(divOuter);
        let prevForum = document.getElementById('prevForum');
        let prevDaily = document.getElementById('prevDaily');
        let prevClan = document.getElementById('prevClan');
        let switcher = document.getElementById('switcher');
        let hwmSettings = document.getElementById('hwm_settings');
        let closeSettings = document.getElementById('modal-close');
        switcher.addEventListener("click", function(event) {
            let d = 1 - Number(switcher.getAttribute("opened"));
            GM_setValue("hwmdsw", d);
            flick(d);
        }, false);
        GM_getValue("hwmdsw", 1);
        switcher.innerHTML = '<img src="https://dcdn3.heroeswm.ru/i/inv_im/btn_expand.svg" style="-webkit-transform: rotate(90deg);transform: rotate(90deg);">';
        hwmSettings.addEventListener("click", function(event) {
            modal.style.display = 'flex';
            document.querySelector("html").style.overflowY = 'hidden';
        }, false);
        closeSettings.addEventListener("click", function(event) {
            modal.style.display = 'none';
            document.querySelector("html").style.overflowY = 'overlay';
            document.querySelector("#switch_forum").remove();
            document.querySelector("#switch_clan").remove();
            checkedForum();
            checkedClans();
            doForum(idForum, idRow);
            doClan(idClan);
            if (Number(switcher.getAttribute("opened")) !== 0) {
                if (prevForum.getAttribute("opened") == 1) {
                    // doForum(idForum, idRow);
                    setTimeout(function() {
                        document.querySelector("#switch_forum").style.display = 'block';
                    }, 800);
                }
                if (prevClan.getAttribute("opened") == 1) {
                    // doClan(idClan);
                    setTimeout(function() {
                        document.querySelector("#switch_clan").style.display = 'block';
                    }, 800);
                }
            }
        }, false);
        prevDaily.addEventListener("click", function(event) {
            prevD();
        }, false);
        prevForum.addEventListener("click", function(event) {
            prevF();
        }, false);
        prevClan.addEventListener("click", function(event) {
            prevC();
        }, false);
    }
    doDaily();
    doForum(idForum, idRow);
    doClan(idClan);
    doResurs();
    disabledBtn();

    function parseClans() {
        return new Promise(((resolve, reject) => {
            const URl = `https://www.heroeswm.ru/pl_clans.php`
            doGet(URl, doc => {
                const clans = doc.querySelectorAll("td > li");
                if (clans !== null) {
                    let clan = '';
                    for (var i = 0; i < clans.length; i++) {
                        let clanInfo = doc.querySelector(`td > li:nth-child(${i+2})`).childNodes;
                        let clanId = clanInfo[0].data.replace(/[^+\d]/g, '');
                        let clanName = clanInfo[1].outerText;
                        clan += `<div class="modal-block__checkbox"><input type="radio" id="clan${i+1}" name="clan" value="${clanId}"><label for="clan${i+1}">#${clanId} ${clanName}</label></div>`;
                    }
                    document.querySelector(".clans-block").innerHTML = clan;
                    firstClan = doc.querySelector(`td > li:nth-child(2)`).childNodes[0].data.replace(/[^+\d]/g, '');
                }
                resolve()
            })
        }))
    }
    parseClans();

    function checkedClans() {
        let id;
        let clans = document.querySelectorAll("#modal > div > form:nth-child(3) > div > div > label");
        for (let i = 0; i < clans.length; i++) {
            id = document.querySelector(`#clan${i+1}`);
            let value = Number(id.value);
            if (id.checked == true) {
                idClan = value;
            } else {
                idClan = idClan;
            }
        }
    }

    function checkedForum() {
        let id;
        for (let i = 0; i < 15; i++) {
            id = document.querySelector(`#forum${i+1}`);
            if (id.checked == true) {
                switch (i + 1) {
                    case 1:
                        idForum = 2;
                        idRow = 4;
                        break
                    case 2:
                        idForum = 10;
                        idRow = 8;
                        break
                    case 3:
                        idForum = 24;
                        idRow = 4;
                        break
                    case 4:
                        idForum = 3;
                        idRow = 5;
                        break
                    case 5:
                        idForum = 12;
                        idRow = 3;
                        break
                    case 6:
                        idForum = 11;
                        idRow = 4;
                        break
                    case 7:
                        idForum = 27;
                        idRow = 3;
                        break
                    case 8:
                        idForum = 14;
                        idRow = 4;
                        break
                    case 9:
                        idForum = 21;
                        idRow = 3;
                        break
                    case 10:
                        idForum = 22;
                        idRow = 3;
                        break
                    case 11:
                        idForum = 23;
                        idRow = 4;
                        break
                    case 12:
                        idForum = 25;
                        idRow = 4;
                        break
                    case 13:
                        idForum = 13;
                        idRow = 5;
                        break
                    case 14:
                        idForum = 7;
                        idRow = 5;
                        break
                    case 15:
                        idForum = 8;
                        idRow = 4;
                        break
                }
            } else {
                idForum = idForum;
                idRow = idRow;
            }
        }
    }

    function getI(xpath, elem) {
        return document.evaluate(xpath, (!elem ? document : elem), null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    }

    function disabledBtn() {
        if (requestDaily == false) {
            prevDaily.style.pointerEvents = "none";
            prevDaily.style.opacity = "0.4";
            prevForum.style.pointerEvents = "none";
            prevForum.style.opacity = "0.4";
            prevClan.style.pointerEvents = "none";
            prevClan.style.opacity = "0.4";
        }
        if (requestDaily == true) {
            prevDaily.style.pointerEvents = "auto";
            prevDaily.style.opacity = "1";
            prevForum.style.pointerEvents = "auto";
            prevForum.style.opacity = "1";
            prevClan.style.pointerEvents = "auto";
            prevClan.style.opacity = "1";
        }
    }

    function flick(opened) {
        if (opened != 1) {
            switcher.innerHTML = '<img src="https://dcdn3.heroeswm.ru/i/inv_im/btn_expand.svg" style="-webkit-transform: rotate(270deg);transform: rotate(270deg);">';
            document.querySelector("#switch_daily").style.display = 'none';
            document.querySelector("#switch_forum").style.display = 'none';
            document.querySelector("#switch_clan").style.display = 'none';
            divResusr.style.display = "none";
            switcher.setAttribute("opened", "0");
        } else {
            if (Number(prevDaily.getAttribute("opened")) != 0) {
                document.querySelector("#switch_daily").style.display = 'block';
            } else if (Number(prevForum.getAttribute("opened")) != 0) {
                document.querySelector("#switch_forum").style.display = 'block';
            } else if (Number(prevClan.getAttribute("opened")) != 0) {
                document.querySelector("#switch_clan").style.display = 'block';
            }
            switcher.innerHTML = '<img src="https://dcdn3.heroeswm.ru/i/inv_im/btn_expand.svg" style="-webkit-transform: rotate(90deg);transform: rotate(90deg);">';
            divResusr.innerHTML = getwheelimg();
            doResurs();
            setTimeout(function() {
                divResusr.style.display = 'flex';
            }, 1200);
            switcher.setAttribute("opened", "1");
        }
    }

    function prevD() {
        if (Number(prevDaily.getAttribute("opened")) != 0) {
            window.open("https://daily.heroeswm.ru/", "_blank");
        } else {
            if (Number(switcher.getAttribute("opened")) != 1) {
                prevDaily.disabled = true;
            } else {
                prevForum.style.background = "#eae8dd00";
                prevClan.style.background = "#eae8dd00";
                prevDaily.style.background = "#eae8dd";
                document.querySelector("#switch_daily").style.display = 'block';
                document.querySelector("#switch_forum").style.display = 'none';
                document.querySelector("#switch_clan").style.display = 'none';
                prevClan.setAttribute("opened", "0");
                prevForum.setAttribute("opened", "0");
                prevDaily.setAttribute("opened", "1");
            }
        }
    }

    function prevF() {
        if (Number(prevForum.getAttribute("opened")) != 0) {
            window.open(`https://www.heroeswm.ru/forum_thread.php?id=${idForum}`, "_blank");
        } else {
            if (Number(switcher.getAttribute("opened")) != 1) {
                prevForum.disabled = true;
            } else {
                prevDaily.style.background = "#eae8dd00";
                prevClan.style.background = "#eae8dd00";
                prevForum.style.background = "#eae8dd";
                document.querySelector("#switch_daily").style.display = 'none';
                document.querySelector("#switch_forum").style.display = 'block';
                document.querySelector("#switch_clan").style.display = 'none';
                prevClan.setAttribute("opened", "0");
                prevDaily.setAttribute("opened", "0");
                prevForum.setAttribute("opened", "1");
            }
        }
    }

    function prevC() {
        if (Number(prevClan.getAttribute("opened")) != 0) {
            window.open(`https://www.heroeswm.ru/sms_clans.php?clan_id=${idClan}`, "_blank");
        } else {
            if (Number(switcher.getAttribute("opened")) != 1) {
                prevClan.disabled = true;
            } else {
                prevDaily.style.background = "#eae8dd00";
                prevClan.style.background = "#eae8dd";
                prevForum.style.background = "#eae8dd00";
                if (localStorage.clanId !== NaN) {
                    document.querySelector("#switch_daily").style.display = 'none';
                    document.querySelector("#switch_forum").style.display = 'none';
                    document.querySelector("#switch_clan").style.display = 'block';
                } else {
                    document.querySelector("#switch_daily").style.display = 'none';
                    document.querySelector("#switch_forum").style.display = 'none';
                    document.querySelector("#switch_clan").style.display = 'block';
                }
                prevClan.setAttribute("opened", "1");
                prevDaily.setAttribute("opened", "0");
                prevForum.setAttribute("opened", "0");
            }
        }
    }

    function doGet(url, callback) {
        GM.xmlHttpRequest({
            method: "GET",
            url: url,
            overrideMimeType: "text/xml; charset=windows-1251",
            headers: {
                'User-agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; ru; rv:1.8.1)',
                'Accept': 'text/xml,text/html',
                'Content-Type': 'text/plain; charset=windows-1251'
            },
            synchronous: false,
            onload: function(res) {
                callback(new DOMParser().parseFromString(res.responseText, "text/html"))
            }
        });
    }
    async function doResurs() {
        return new Promise(((resolve, reject) => {
            var rURl = "https://www.heroeswm.ru/auction.php?cat=elements&sort=0&art_type="
            var r = ["abrasive", "snake_poison", "tiger_tusk", "ice_crystal", "moon_stone", "fire_crystal", "meteorit", "witch_flower", "wind_flower", "fern_flower", "badgrib"];
            var arr = [];
            var arrImg = [];
            var arrDif = [];
            var arrTest = [];
            var arrTitle = [];
            var ese = [];
            for (var i = 0; i < r.length; i++) {
                doGet(rURl + r[i], doc => {
                    var price = doc.querySelector("td:nth-child(3) > table > tbody > tr > td:nth-child(1)").innerHTML.replace(/<\/?[^>]+(>|$)/g, '').replace(/[^\d]/g, '');
                    arr.push(price);
                    var imgR = doc.querySelector("tr:nth-child(3) > td:nth-child(1) > table > tbody > tr > td:nth-child(1) > img");
                    arrImg.push(imgR.getAttribute('src'));
                    arrTitle.push(imgR.getAttribute('title'));
                    arrTest.push(imgR.getAttribute('src').replace(/[^a-zа-яё\w]/gi, '').replace(/httpsdcdnheroeswmruign_res|pngv1/ig, ''));
                    var difR = doc.querySelector("tr:nth-child(4) > td:nth-child(3) > table > tbody > tr > td:nth-child(1)").innerHTML.replace(/<\/?[^>]+(>|$)/g, '').replace(/[^\d]/g, '');
                    arrDif.push(difR);
                    ese.push(difR - price);
                    arr = Array.prototype.slice.call(arr);
                    ese = Array.prototype.slice.call(ese);
                    arrTest = Array.prototype.slice.call(arrTest);
                    arrImg = Array.prototype.slice.call(arrImg);
                    var res = "";
                    for (var j = 0; j < arr.length; j++) {
                        res += `
                         <div class = 'res-style__elem'><div style = 'align-self: center;'>
                              <a class = 'hover-link' href='https://www.heroeswm.ru/auction_new_lot.php?${arrTest[j] + Math.round(arr[j]*0.99)}' target='_blank'>
                                   <img src='${arrImg[j]}' width='20' heigth='20' border='0'></a></div><a class = 'hover-link' target = '_. blank' style = 'text-decoration:none;align-self: center;margin-left: 5px;' href='${rURl + arrTest[j]}' title='${ese[j]}'>
                                   ${arr[j]}
                              </a>
                              <div style = '${ese[j] >= 400 ? 'display: inline-flex;background-color: #f33800;padding: 5px;margin-left: 5px;border: 0;border-radius: 4px;color: #fff;' : 'display: none;'}'>
                                   <span title = '' style='font-size:8px;font-weight: bold;'>${ese[j]}</span>
                              </div>
                         </div>`;
                    }
                    divResusr.innerHTML = res;
                    resolve()
                })
            }
        }))
    }

    function doClan(id) {
        return new Promise(((resolve, reject) => {
            localStorage.clanId = id;
            const cURl = `https://www.heroeswm.ru/sms_clans.php?clan_id=${id}`
            doGet(cURl, doc => {
                let v = (doc.querySelector("body > center > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > center > b > font") !== null) ? 1 : 0;
                var u = [doc.querySelector(`tr:nth-child(${3+v}) > td:nth-child(3) > a`),
                    doc.querySelector(`tr:nth-child(${4+v}) > td:nth-child(3) > a`),
                    doc.querySelector(`tr:nth-child(${5+v}) > td:nth-child(3) > a`),
                    doc.querySelector(`tr:nth-child(${6+v}) > td:nth-child(3) > a`),
                    doc.querySelector(`tr:nth-child(${7+v}) > td:nth-child(3) > a`)
                ];
                var d = [doc.querySelector(`tr:nth-child(${3+v}) > td:nth-child(2)`),
                    doc.querySelector(`tr:nth-child(${4+v}) > td:nth-child(2)`),
                    doc.querySelector(`tr:nth-child(${5+v}) > td:nth-child(2)`),
                    doc.querySelector(`tr:nth-child(${6+v}) > td:nth-child(2)`),
                    doc.querySelector(`tr:nth-child(${7+v}) > td:nth-child(2)`)
                ];
                var clan = "";
                for (var i = 0; i < u.length; i++) {
                    if (u[i] !== null) {
                        clan += "<div class = 'text-title'><a class = 'hover-link' style = 'text-decoration:none" + (((Date.now() - Date.parse(d[i].innerHTML.replace(/<\/?[^>]+(>|$)/g, ''))) / (1000 * 60 * 60) - 4).toFixed(0) <= 1 ? ';font-weight: bold; color:red' : '') + "' target='_blank' href='" + u[i] + "' title='" + u[i].innerHTML.replace(/<\/?[^>]+(>|$)/g, '') + (((Date.now() - Date.parse(d[i].innerHTML.replace(/<\/?[^>]+(>|$)/g, ''))) / (1000 * 60 * 60) - 4).toFixed(0) <= 6 ? "'>📣 " : "'>• ") + u[i].innerHTML.replace(/<\/?[^>]+(>|$)/g, '') + "</a><div class = 'clan-style'><span title = 'комментариев' style = 'font-size:9px'>" + d[i].innerHTML.replace(/<\/?[^>]+(>|$)/g, '') + "</span></div></div>";
                    }
                    if (u.indexOf(null) == 0) {
                        clan = "<div>Новостей нет</div>";
                    }
                }
                divInner.innerHTML += `<div id='switch_clan' style='display: none;'>${clan}</div>`;
                resolve()
            })
        }))
    }

    function doForum(id, x) {
        return new Promise(((resolve, reject) => {
            localStorage.forumId = id;
            localStorage.forumRow = x;
            const fURl = `https://www.heroeswm.ru/forum_thread.php?id=${id}`
            doGet(fURl, doc => {
                var u = [doc.querySelector(`tr:nth-child(${x}) > td:nth-child(1) > a`),
                    doc.querySelector(`tr:nth-child(${x+1}) > td:nth-child(1) > a`),
                    doc.querySelector(`tr:nth-child(${x+2}) > td:nth-child(1) > a`),
                    doc.querySelector(`tr:nth-child(${x+3}) > td:nth-child(1) > a`),
                    doc.querySelector(`tr:nth-child(${x+4}) > td:nth-child(1) > a`)
                ];
                var d = [doc.querySelector(`tr:nth-child(${x}) > td:nth-child(3)`),
                    doc.querySelector(`tr:nth-child(${x+1}) > td:nth-child(3)`),
                    doc.querySelector(`tr:nth-child(${x+2}) > td:nth-child(3)`),
                    doc.querySelector(`tr:nth-child(${x+3}) > td:nth-child(3)`),
                    doc.querySelector(`tr:nth-child(${x+4}) > td:nth-child(3)`)
                ];
                var forum = "";
                for (var i = 0; i < u.length; i++) {
                    forum += "<div class = 'text-title'><a class = 'hover-link' style = 'text-decoration:none; " + (d[i].innerHTML.replace(/<\/?[^>]+(>|$)/g, '') <= 10 ? 'font-weight: bold; color:#ff4d00' : '') + "' target='_blank' href='" + u[i] + "' title='" + u[i].innerHTML.replace(/<\/?[^>]+(>|$)/g, '') + (d[i].innerHTML.replace(/<\/?[^>]+(>|$)/g, '') <= 20 ? "'>🔥 " : "'>• ") + u[i].innerHTML.replace(/<\/?[^>]+(>|$)/g, '') + "</a><div style = 'display: inline-flex;background-color: #adadad40;padding: 3px 7px;margin-left: 7px;border: 0;border-radius: 4px;color: #592C08;'><span title = 'комментариев' style = 'font-size:9px'>" + d[i].innerHTML.replace(/<\/?[^>]+(>|$)/g, '') + "</span></div></div>";
                }
                divInner.innerHTML += `<div id='switch_forum' style='display: none;'>${forum}</div>`;
                resolve()
            })
        }))
    }

    function checkColor(id, x) {
        let color = '';
        if (id == 1) {
            if (x <= 50) {
                color = 'font-weight: bold; color:red';
            }
        }
        return color;
    }
    async function doDaily() {
        return new Promise(((resolve, reject) => {
            const URl = `https://daily.heroeswm.ru/`
            doGet(URl, doc => {
                let news = "";
                for (let i = 0; i < 5; i++) {
                    let arr = doc.querySelector(`#tb-main-c > div:nth-child(${i+7})`).childNodes;
                    let title = arr[2].innerHTML.replace(/<\/?[^>]+(>|$)/g, '');
                    let view = arr[1].innerHTML.match(/просмотров" class="info_views">(.*)<\/span>/)[1];
                    view = Number(view);
                    let link = arr[2].innerHTML.match(/(https?:\/\/[^ ]*">)/g);
                    link = link[0].replace('">', '');
                    let comments = arr[1].innerHTML.match(/&nbsp;<span class="info_views">(.*)<\/span>/)[1];
                    news += `
                         <div class='text-title'>
                              <a class='hover-link' style='text-decoration:none; ${checkColor(1,view)}'; target='_blank' href='${link}' title='${title}'>${(view <= 100 ? '⚡' : '•')} ${title}</a>
                              <div style="display: inline-flex;background-color: #adadad40;padding: 3px 7px;margin-left: 7px;border: 0;border-radius: 4px;color: #592C08;">
                                   <span title="комментарии" style="font-size:9px">${comments}</span>
                              </div>
                         </div>`;
                }
                divInner.innerHTML += `<div id='switch_daily' style='display: block;'>${news}</div>`;
                requestDaily = true;
                disabledBtn();
                resolve()
            })
        }))
    }

    function getwheelimg() {
        return '<img border="0" align="absmiddle" height="11" src="https://dcdn.heroeswm.ru/css/loading.gif">';
    }
})(window);