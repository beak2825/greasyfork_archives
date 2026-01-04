// ==UserScript==
// @name        ChatGPT Enhance
// @name:en     ChatGPT Enhance
// @name:zh-CN  ChatGPT 增强
// @name:zh-TW  ChatGPT 增強
// @name:ja     ChatGPT 拡張
// @name:ko     ChatGPT 향상
// @name:de     ChatGPT verbessern
// @name:fr     ChatGPT améliorer
// @name:es     ChatGPT mejorar
// @name:pt     ChatGPT melhorar
// @name:ru     ChatGPT улучшить
// @name:it     ChatGPT migliorare
// @name:tr     ChatGPT geliştirmek
// @name:ar     ChatGPT تحسين
// @name:th     ChatGPT ปรับปรุง
// @name:vi     ChatGPT cải thiện
// @name:id     ChatGPT meningkatkan
// @namespace   Violentmonkey Scripts
// @match       *://chat.openai.com/*
// @match       *://chatgpt.com/*
// @version     XiaoYing_2024.10.12.1
// @grant       GM_info
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @grant       GM_openInTab
// @grant       unsafeWindow
// @run-at      document-start
// @author      github.com @XiaoYingYo
// @require     https://greasyfork.org/scripts/464929-module-jquery-xiaoying/code/module_jquery_XiaoYing.js
// @require     https://greasyfork.org/scripts/464780-global-module/code/global_module.js
// @require     https://greasyfork.org/scripts/465643-ajaxhookerlatest/code/ajaxHookerLatest.js
// @require     https://greasyfork.org/scripts/440334-jquery-like-spa-operation-library/code/jQuery-like%20SPA%20operation%20library.js
// @description 宽度对话框 & 一键清空聊天记录 & 向GPT声明指定语言回复
// @description:en Wide dialog & Clear chat history & Declare specified language reply to GPT
// @description:zh-CN  宽度对话框 & 一键清空聊天记录 & 向GPT声明指定语言回复
// @description:zh-TW 寬度對話框 & 一鍵清空聊天記錄 & 向GPT聲明指定語言回復
// @description:ja 幅広いダイアログ & チャット履歴をクリア & 指定された言語でGPTに宣言する
// @description:ko 넓은 대화 상자 & 채팅 기록 지우기 & 지정된 언어로 GPT에 선언
// @description:de Breites Dialogfeld & Chatverlauf löschen & GPT in angegebener Sprache deklarieren
// @description:fr Boîte de dialogue large & Effacer l'historique du chat & Déclarer la réponse dans la langue spécifiée à GPT
// @description:es Cuadro de diálogo ancho & Borrar el historial del chat & Declarar respuesta en el idioma especificado a GPT
// @description:pt Caixa de diálogo ampla & Limpar o histórico do bate-papo & Declarar resposta no idioma especificado ao GPT
// @description:ru Широкий диалоговое окно & Очистить историю чата & Объявить ответ на указанном языке в GPT
// @description:it Ampia finestra di dialogo & Cancella la cronologia della chat & Dichiarare la risposta nella lingua specificata a GPT
// @description:tr Geniş diyalog & Sohbet geçmişini temizle & GPT'ye belirtilen dilde yanıt bildir
// @description:ar مربع حوار واسع & مسح سجل المحادثة & إعلان الرد باللغة المحددة إلى GPT
// @description:th กล่องโต้ตอบกว้าง & ล้างประวัติการแชท & ประกาศการตอบกลับในภาษาที่ระบุไว้กับ GPT
// @description:vi Hộp thoại rộng & Xóa lịch sử trò chuyện & Khai báo trả lời bằng ngôn ngữ được chỉ định cho GPT
// @description:id Kotak dialog lebar & Hapus riwayat obrolan & Nyatakan balasan dalam bahasa yang ditentukan ke GPT
// @downloadURL https://update.greasyfork.org/scripts/465513/ChatGPT%20Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/465513/ChatGPT%20Enhance.meta.js
// ==/UserScript==

// eslint-disable-next-line no-undef
ajaxHooker.protect();

var globalVariable = new Map();
var browserLanguage = navigator.language;
var ignoreHookStr = '&ignoreHookStr';
var clearButtonSvg = '<svg t="1722633865116" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1793" width="24" height="24"><path d="M901.3 504.8l-76.3-150c-13.4-26.3-40-42.6-69.5-42.6H639c-1.1 0-2-0.9-2-2V120.6c0-31.1-25.3-56.3-56.3-56.3h-90c-31.1 0-56.3 25.3-56.3 56.3v189.6c0 1.1-0.9 2-2 2H315.8c-29.5 0-56.1 16.3-69.5 42.6l-76.3 150c-9.2 18.1-8.4 39.3 2.2 56.6 10.3 16.8 27.9 27 47.4 27.6-4.8 101-38.3 205.9-90.2 279.5-12.5 17.8-14.1 40.8-4.1 60.1 10 19.3 29.7 31.3 51.5 31.3h601.5c35 0 66-23.6 75.2-57.4 15.5-56.5 28.4-107.9 29.4-164.9C884 685 874 636 852.9 589c19-1.1 36.1-11.2 46.2-27.6 10.6-17.3 11.4-38.5 2.2-56.6z m-681.4 25.4l76.3-150c3.8-7.4 11.3-12 19.6-12h116.4c32 0 58-26 58-58V120.6c0-0.1 0.2-0.3 0.3-0.3h90c0.1 0 0.3 0.2 0.3 0.3v189.6c0 32 26 58 58 58h116.4c8.3 0 15.8 4.6 19.6 12l76.3 150c0.2 0.3 0.5 1-0.1 2s-1.3 1-1.7 1H221.7c-0.4 0-1.1 0-1.7-1-0.6-1-0.3-1.7-0.1-2zM827 736.6c-0.9 50.5-12.9 98.3-27.4 151.1-2.6 9.5-11.3 16.2-21.2 16.2H651.8c11.3-22.3 18.5-44 23.1-61.2 7.1-26.7 10.7-53.5 10.6-78-0.1-17.1-15.5-30.1-32.4-27.4-13.6 2.2-23.6 14-23.6 27.8 0.1 42.7-14.1 98.2-42.7 138.8H406.2c15.2-21.7 26.1-43.8 33.6-61.9 10-24.3 17.4-49.7 21.2-72.5 2.8-17-10.4-32.5-27.6-32.5-13.6 0-25.3 9.8-27.6 23.3-2.8 16.6-8.3 37.7-17.7 60.4-10.1 24.6-27.8 58.1-55.6 83.3H176.9c-0.5 0-1.2 0-1.8-1.1-0.6-1.1-0.2-1.6 0.1-2 29.7-42.1 54.8-94.5 72.5-151.4 16.2-52.1 25.7-106.9 28-160.3h514.6C816 635.6 828 684 827 736.6z" fill="#ffffff" p-id="1794"></path></svg>';

(async function () {
    function initSession() {
        return new Promise((resolve) => {
            $.get('/api/auth/session', { headers: { Accept: 'application/json', 'Content-Type': 'application/json' } }).done((res) => {
                globalVariable.set('session', res);
                globalVariable.set('accessToken', res.accessToken);
                resolve();
            });
        });
    }

    function clearAllConversations() {
        return new Promise(async (resolve) => {
            let data = await getAllItems();
            let Tasks = [];
            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                let id = item.id;
                let title = item.title;
                if (title.charAt(0) == '#') {
                    continue;
                }
                Tasks.push(deleteItem(id));
            }
            await Promise.all(Tasks);
            resolve();
            // $.ajax({
            //     type: 'PATCH',
            //     url: '/backend-api/conversations',
            //     headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${globalVariable.get('accessToken')}` },
            //     data: JSON.stringify({ is_visible: false }),
            //     success: (res) => {
            //         resolve(res);
            //     }
            // });
        });
    }

    function initClearButton() {
        return new Promise(async (resolve) => {
            let sureClearButtonSvg = '<svg t="1722633889519" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3987" width="24" height="24"><path d="M675.328 117.717333A425.429333 425.429333 0 0 0 512 85.333333C276.352 85.333333 85.333333 276.352 85.333333 512s191.018667 426.666667 426.666667 426.666667 426.666667-191.018667 426.666667-426.666667c0-56.746667-11.093333-112-32.384-163.328a21.333333 21.333333 0 0 0-39.402667 16.341333A382.762667 382.762667 0 0 1 896 512c0 212.074667-171.925333 384-384 384S128 724.074667 128 512 299.925333 128 512 128c51.114667 0 100.8 9.984 146.986667 29.12a21.333333 21.333333 0 0 0 16.341333-39.402667z m-213.333333 468.608l-105.664-105.642666a21.248 21.248 0 0 0-30.122667 0.042666c-8.32 8.32-8.213333 21.973333-0.064 30.101334l120.810667 120.832a21.248 21.248 0 0 0 30.122666-0.085334l211.157334-211.157333a21.290667 21.290667 0 0 0 0-30.186667 21.397333 21.397333 0 0 0-30.250667 0.106667l-196.010667 195.989333z" fill="#ffffff" p-id="3988"></path></svg>';
            let oneBtn = await getNav();
            oneBtn = oneBtn.find('button').eq(0);
            let newBtn = global_module.cloneAndHide(oneBtn[0]);
            newBtn = $(newBtn).eq(0).attr('status', 0);
            oneBtn.show();
            newBtn.find('svg').remove();
            newBtn.append(clearButtonSvg);
            newBtn.off('click').on('click', async () => {
                let status = newBtn.attr('status');
                newBtn.attr('disabled', 'disabled');
                if (status == 0) {
                    newBtn.attr('status', 1);
                    newBtn.find('svg').remove();
                    newBtn.append(sureClearButtonSvg);
                } else {
                    newBtn.attr('status', 0);
                    newBtn.find('svg').remove();
                    newBtn.append(clearButtonSvg);
                    await clearAllConversations();
                    unsafeWindow.location.href = '/';
                }
                newBtn.removeAttr('disabled');
            });
            globalVariable.set('oneBtn', oneBtn);
            resolve();
        });
    }

    function initIncognitoModeButton() {
        return new Promise(async (resolve) => {
            let oneBtn = globalVariable.get('oneBtn');
            let yesSvg = '<svg t="1723101878912" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1489" width="20" height="20"><path d="M57.138023 960l-4.916377 2.253977c6.984386 3.50514 11.778354 10.731991 11.778354 19.079356v-21.333333h-6.861977z m6.861977-3.146152l90.17909-41.350768c60.799706-38.04572 137.66091-38.940248 199.217434-2.68594l114.954005 33.609563 8.144919 5.429554c0.986336 0.657949 4.247834 2.026814 9.755072 3.492194 6.686602 1.778464 15.168147 3.255614 25.343411 4.327871 10.816736-1.261756 19.773793-2.871908 26.74994-4.728055 5.555494-1.479503 8.671044-2.770685 9.155973-3.093187l8.144919-5.430731 114.935173-33.603678c61.55417-36.256662 138.414198-35.364487 199.21508 2.677701l90.204984 41.356653V512c0-247.423117-200.576883-448-448-448S64 264.576883 64 512v444.853848z m896 3.146152v21.333333c0-8.347366 4.793968-15.574216 11.778354-19.079356l-4.917554-2.253977h-6.8608zM512 0c282.769949 0 512 229.230051 512 512v469.333333c0 23.56377-19.102897 42.666667-42.666667 42.666667h-28.444836l-113.909996-52.224c-42.99623-28.661407-99.00903-28.66023-142.002906 0.005885l-113.972377 33.322372C569.069756 1014.395586 545.402409 1020.692598 512 1024c-32.605572-2.774216-56.27292-9.071228-71.005572-18.892211l-113.993564-33.329435c-42.993876-28.662584-99.007853-28.662584-142.002905 0L71.110326 1024H42.666667C19.102897 1024 0 1004.897103 0 981.333333V512C0 229.230051 229.230051 0 512 0z m-48.70709 373.333922h97.41418c16.914832-49.634575 63.935264-85.333333 119.292469-85.333333h42.000478c69.587274 0 125.99908 56.411807 125.99908 125.99908v4.000662c0 69.587274-56.411807 125.99908-125.99908 125.99908h-42.000478c-55.357205 0-102.377637-35.698759-119.292469-85.333333h-97.41418c-16.914832 49.634575-63.935264 85.333333-119.292469 85.333333h-42.000478c-69.587274 0-125.99908-56.411807-125.99908-125.99908v-4.000662c0-69.587274 56.411807-125.99908 125.99908-125.99908h42.000478c55.357205 0 102.377637 35.698759 119.292469 85.333333z m279.707366 42.666667c11.598271 0 21.000239-9.551448 21.000239-21.333334s-9.401968-21.333333-21.000239-21.333333-21.000239 9.550271-21.000239 21.333333c0 11.781885 9.401968 21.333333 21.000239 21.333334z m-378.000773 0c11.598271 0 21.000239-9.551448 21.00024-21.333334s-9.401968-21.333333-21.00024-21.333333c-11.597094 0-20.999062 9.550271-20.999062 21.333333 0 11.781885 9.401968 21.333333 20.999062 21.333334zM464.001471 640h95.999412c26.50983 0 47.999706 21.489876 47.999706 47.999706v23.999264c0 39.765333-32.234814 72.001324-71.998971 72.001324h-48.000882c-39.764156 0-71.99897-32.235991-71.99897-72.000147v-23.999264c0-26.511007 21.489876-48.000883 47.998528-48.000883z" fill="#ffffff" p-id="1490"></path></svg>';
            let noSvg = '<svg t="1723101932727" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2649" width="24" height="24"><path d="M512.812373 665.6c-85.333333 0-153.6-68.266667-153.6-153.6s68.266667-153.6 153.6-153.6 153.6 68.266667 153.6 153.6-68.266667 153.6-153.6 153.6z m0-221.866667c-38.4 0-68.266667 32-68.266666 68.266667s32 68.266667 68.266666 68.266667 68.266667-32 68.266667-68.266667-29.866667-68.266667-68.266667-68.266667z" p-id="2650" fill="#ffffff"></path><path d="M43.47904 554.666667c-4.266667 0-10.666667 0-14.933333-2.133334-21.333333-8.533333-32-34.133333-23.466667-55.466666 70.4-185.6 302.933333-341.333333 507.733333-341.333334 202.666667 0 435.2 153.6 507.733334 334.933334 8.533333 21.333333-2.133333 46.933333-23.466667 55.466666-21.333333 8.533333-46.933333-2.133333-55.466667-23.466666-59.733333-149.333333-260.266667-281.6-428.8-281.6-168.533333 0-373.333333 136.533333-430.933333 285.866666-4.266667 17.066667-21.333333 27.733333-38.4 27.733334z" p-id="2651" fill="#ffffff"></path><path d="M512.812373 868.266667c-204.8 0-439.466667-155.733333-509.866666-339.2-8.533333-21.333333 2.133333-46.933333 23.466666-55.466667 21.333333-8.533333 46.933333 2.133333 55.466667 23.466667 57.6 149.333333 262.4 285.866667 430.933333 285.866666 168.533333 0 369.066667-132.266667 428.8-281.6 8.533333-21.333333 34.133333-32 55.466667-23.466666 21.333333 8.533333 32 34.133333 23.466667 55.466666-72.533333 181.333333-305.066667 334.933333-507.733334 334.933334z" p-id="2652" fill="#ffffff"></path></svg>';
            oneBtn = oneBtn.eq(0);
            let newBtn = global_module.cloneAndHide(oneBtn[0]);
            newBtn = $(newBtn).eq(0).attr('status', 0);
            oneBtn.show();
            newBtn.find('svg').remove();
            let incognitoMode = GM_getValue('incognitoMode', false);
            let judgeToIncognitoMode = function (i) {
                if (i) {
                    if (global_module.GetUrlParm(null, 'temporary-chat') != 'true') {
                        window.location.href = '/?temporary-chat=true';
                    }
                } else {
                    if (global_module.GetUrlParm(null, 'temporary-chat') == 'true') {
                        window.location.href = '/';
                    }
                }
            };
            if (!incognitoMode) {
                newBtn.append(yesSvg);
            } else {
                newBtn.append(noSvg);
                judgeToIncognitoMode(incognitoMode);
            }
            newBtn.off('click').on('click', async () => {
                if (incognitoMode) {
                    newBtn.attr('status', 1);
                    newBtn.find('svg').remove();
                    newBtn.append(yesSvg);
                } else {
                    newBtn.attr('status', 0);
                    newBtn.find('svg').remove();
                    newBtn.append(noSvg);
                }
                GM_setValue('incognitoMode', !incognitoMode);
                incognitoMode = GM_getValue('incognitoMode', false);
                judgeToIncognitoMode(incognitoMode);
            });
            resolve();
        });
    }
    await initSession();
    await initClearButton();
    await initIncognitoModeButton();
})();

function purify() {
    return new Promise(async (resolve) => {
        let Tasks = [];
        let nav = await getNav();
        Tasks.push(
            (() => {
                return new Promise(async (resolve) => {
                    let upgradeDom = await global_module.waitForElement('span[class*="border-token-border-light"]', null, null, 100, -1, nav);
                    upgradeDom = upgradeDom.eq(upgradeDom.length - 1);
                    upgradeDom.parents('a').eq(0).hide();
                    resolve();
                });
            })()
        );
        Tasks.push(
            (() => {
                return new Promise(async (resolve) => {
                    let presentation = await global_module.waitForElement('div[role="presentation"]', null, null, 100, -1);
                    presentation = presentation.eq(presentation.length - 1);
                    let presentationTip = await global_module.waitForElement('div:contains("ChatGPT "):not([class])', null, null, 100, -1, presentation);
                    presentationTip
                        .eq(presentationTip.length - 1)
                        .parent()
                        .hide();
                    resolve();
                });
            })()
        );
        Tasks.push(
            (() => {
                return new Promise(async (resolve) => {
                    $(await global_module.waitForElement('button[data-state="closed"][id^="radix"]:contains("?")', null, null, 100, -1)).hide();
                    resolve();
                });
            })()
        );
        await Promise.all(Tasks);
        resolve();
    });
}

function getAllItems() {
    return new Promise(async (resolve) => {
        let limit = 30;
        let currentTotal = 0;
        let retItems = [];
        let getItems = function (offset) {
            return new Promise(async (resolve) => {
                $.ajax({
                    type: 'GET',
                    url: '/backend-api/conversations?offset=' + offset + '&limit=' + limit + '&order=updated',
                    headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${globalVariable.get('accessToken')}` },
                    success: (data) => {
                        resolve(data);
                    },
                    error: async () => {
                        resolve(await getAllItems(offset));
                    }
                });
            });
        };
        let data = await getItems(0);
        let total = data.total;
        let items = data.items;
        currentTotal = currentTotal + items.length;
        retItems = retItems.concat(items);
        while (currentTotal < total) {
            data = await getItems(currentTotal);
            total = data.total;
            items = data.items;
            currentTotal = currentTotal + items.length;
            retItems = retItems.concat(items);
        }
        resolve(retItems);
    });
}

function deleteItem(id) {
    let item = globalVariable.get('itemDom')[id];
    if (item && !globalVariable.get('deleteItem_' + id + '_loading_setInterval')) {
        let textDom = item.find('[dir="auto"]').eq(0);
        let oldHtml = textDom.html();
        textDom.text('.');
        globalVariable.set(
            'deleteItem_' + id + '_loading_setInterval',
            setInterval(() => {
                if (globalVariable.get('deleteItem_' + id + '_loading_setInterval_done')) {
                    globalVariable.delete('deleteItem_' + id + '_loading_setInterval_done');
                    textDom.html(oldHtml);
                    clearInterval(globalVariable.get('deleteItem_' + id + '_loading_setInterval'));
                    return;
                }
                textDom.text(textDom.text() + '.');
                if (textDom.text().length > 6) {
                    textDom.text('.');
                }
            }, 500)
        );
    }
    return new Promise(async (resolve) => {
        $.ajax({
            type: 'PATCH',
            url: '/backend-api/conversation/' + id,
            headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${globalVariable.get('accessToken')}` },
            data: JSON.stringify({ is_visible: false }),
            success: () => {
                if (item) {
                    item.hide();
                }
                globalVariable.set('deleteItem_' + id + '_loading_setInterval_done', true);
                resolve(true);
            },
            error: async () => {
                resolve(await deleteItem(id));
            }
        });
    });
}

function getNav() {
    return new Promise(async (resolve) => {
        let nav = await global_module.waitForElement('nav[aria-label]', null, null, 100, -1);
        resolve(nav);
    });
}

function initItemDeleteBtn() {
    return new Promise(async (resolve) => {
        let nav = await getNav();
        let itemDiv = await global_module.waitForElement('div[class*="text-token-text-primary text-sm"]', null, null, 100, -1, nav);
        let liList = await global_module.waitForElement('li', null, null, 100, -1, itemDiv);
        globalVariable.set('itemDom', {});
        let SeeSel = 'button:contains("See ")';
        let seeBtn = $(nav).eq(0).find(SeeSel);
        if (seeBtn.length != 0) {
            let seeBtnText = seeBtn.text().replace('See ', '');
            if (seeBtnText != 'less') {
                global_module.clickElement(seeBtn[0]);
            }
            setTimeout(() => {
                seeBtn = $(nav).eq(0).find(SeeSel);
                seeBtn.hide();
            }, 200);
        }
        for (let i = 0; i < liList.length; i++) {
            let spanBtn = $(liList[i]).find('span[class][data-state="closed"]');
            let that = spanBtn.eq(0);
            let li = that.parents('li');
            let a = li.find('a');
            let href = a.attr('href');
            let id = href.replace('/c/', '');
            globalVariable.get('itemDom')[id] = li;
            if (spanBtn.length != 1) {
                continue;
            }
            let newBtn = global_module.cloneAndHide(that[0], 2);
            newBtn = $(newBtn);
            newBtn.find('svg').remove();
            newBtn.append(clearButtonSvg);
            that.show();
            newBtn.css('cursor', 'pointer');
            newBtn.off('click').on('click', async () => {
                await deleteItem(id);
            });
        }
        resolve();
    });
}

function widescreenDialogue() {
    return new Promise(async (resolve) => {
        if ($('body').find('style[id="widescreenDialogueCss]').length != 0) {
            resolve();
            return;
        }
        let sel = 'div[id="prompt-textarea"]';
        let Btn = await global_module.waitForElement(sel, null, null, 1000, -1);
        Btn = Btn.eq(0);
        let BtnParent = Btn.parents('form').eq(0).parent().eq(0);
        let cssClassName = BtnParent.attr('class').split(' ')[0];
        let styleHtml = '.' + cssClassName + '{width:100%;max-width:100%;}';
        $('body').append('<style id="widescreenDialogueCss">' + styleHtml + '</style>');
        resolve();
    });
}

var HookFun = new Map();
HookFun.set('/backend-api/conversation', function (req, res, Text, period) {
    if (period === 'preload') {
        let additional = 'Please reply me with ';
        let additionals = additional + browserLanguage;
        let body = JSON.parse(req.data);
        let messages = body.messages;
        if (messages instanceof Array) {
            for (let i = 0; i < messages.length; i++) {
                let parts = messages[i].content.parts;
                if (parts instanceof Array) {
                    for (let j = 0; j < parts.length; j++) {
                        if (typeof parts[j] == 'object') {
                            continue;
                        }
                        if (parts[j].indexOf(additional) != -1) {
                            continue;
                        }
                        parts[j] = parts[j] + '\n' + additionals;
                    }
                }
            }
        }
        req.data = JSON.stringify(body);
        return;
    }
    return new Promise(async (resolve) => {
        if (period !== 'done') {
            resolve(null);
            return;
        }
        setTimeout(async () => {
            await widescreenDialogue();
        }, 100);
        resolve(null);
    });
});
HookFun.set('/backend-api/conversations', function (req, res, Text, period) {
    return new Promise(async (resolve) => {
        if (period !== 'done') {
            resolve(null);
            return;
        }
        setTimeout(async () => {
            await initItemDeleteBtn();
            await widescreenDialogue();
            await purify();
            let hookPath = '/backend-api/memories';
            if (HookFun.get(hookPath) != null) {
                return;
            }
            HookFun.set(hookPath, function (req, res, Text, period) {
                return new Promise(async (resolve) => {
                    if (period !== 'done') {
                        resolve(null);
                        return;
                    }
                    setTimeout(async () => {
                        await initItemDeleteBtn();
                    }, 1000);
                    resolve(null);
                });
            });
        }, 1000);
        resolve(null);
    });
});

function handleResponse(request) {
    if (!request) {
        return;
    }
    if (request.url.indexOf(ignoreHookStr) != -1) {
        return;
    }
    let tempUrl = request.url;
    if (tempUrl.indexOf('http') == -1 && tempUrl[0] == '/') {
        tempUrl = location.origin + tempUrl;
    }
    let pathname = new URL(tempUrl).pathname;
    let fun = HookFun.get(pathname);
    if (!fun) {
        return;
    }
    fun(request, null, null, 'preload');
    request.response = (res) => {
        let Type = 0;
        let responseText = res.responseText;
        if (typeof responseText !== 'string') {
            Type = 1;
            responseText = res.text;
        }
        if (typeof responseText !== 'string') {
            Type = 2;
            responseText = JSON.stringify(res.json);
        }
        const oldText = responseText;
        res.responseText = new Promise(async (resolve) => {
            let ret = await fun(request, res, responseText, 'done');
            if (!ret) {
                ret = oldText;
            }
            if (Type === 2) {
                if (typeof ret === 'string') {
                    ret = JSON.parse(ret);
                }
            }
            resolve(ret);
        });
    };
}

// eslint-disable-next-line no-undef
ajaxHooker.hook(handleResponse);

$.onurlchange(function () {
    setTimeout(async () => {
        await widescreenDialogue();
        await purify();
    }, 1000);
});
