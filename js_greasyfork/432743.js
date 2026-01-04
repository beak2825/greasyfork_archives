// ==UserScript==
// @name         b站直播徽章切换增强
// @version      1.2.10
// @description  展示全部徽章，展示更多信息，更方便切换，可以自动切换徽章
// @author       Pronax
// @include      /https:\/\/live\.bilibili\.com\/(blanc\/)?\d+/
// @icon         http://bilibili.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://lib.baomitu.com/vue/2.6.14/vue.min.js
// @require      https://greasyfork.org/scripts/439903-blive-room-info-api/code/blive_room_info_api.js?version=1037039
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/432743/b%E7%AB%99%E7%9B%B4%E6%92%AD%E5%BE%BD%E7%AB%A0%E5%88%87%E6%8D%A2%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/432743/b%E7%AB%99%E7%9B%B4%E6%92%AD%E5%BE%BD%E7%AB%A0%E5%88%87%E6%8D%A2%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

// ! csrf过期后调用原生徽章按钮不会刷新状态
// ! bug: 有一个最近获得的粉丝牌置顶，然后获取了新粉丝牌，且新粉丝牌为当前房间（最新获得被当前房间顶掉）

function main() {
    'use strict';

    // 设置是否支持使用拼音查找粉丝牌/ID
    // 为false时关闭此功能
    let pinyinSwitch = true;



    if (document.querySelector(".medal-section:not(.scripted)")) {
        let controlPanelCtnrBox = document.querySelector(".medal-section:not(.scripted)");
        let template = document.createElement("div");
        template.className = "medal-section scripted";
        template.innerHTML = `<span id="medal-selector" class="dp-i-block medal"><span class="action-item medal get-medal"></span></span>`;
        for (let key in controlPanelCtnrBox.dataset) {
            template.dataset[key] = controlPanelCtnrBox.dataset[key];
        }
        controlPanelCtnrBox.after(template);
        // controlPanelCtnrBox.classList.add("origin"); // 加了没用，这个元素每次聚焦都会消失
        controlPanelCtnrBox.style.display = "none";
    }

    // 活动直播间的CSS调整
    setTimeout(() => {
        let svgIconList = document.querySelectorAll('.svg-icon');
        for (let index = 0; index < svgIconList.length && index < 10; index++) {
            const element = svgIconList[index];
            if (element) {
                let computedStyle = getComputedStyle(element);
                let backgroundImage = computedStyle.getPropertyValue('background-image');
                // 普通页面用base64覆盖了http的，活动页面还是http
                if (backgroundImage && backgroundImage.includes("http")) {
                    GM_addStyle(".des>.svg-icon{background-position:0 -6em !important}.des>.svg-icon.checkbox-selected{background-position:0 -7em !important}");
                }
                break;
            }
        }
    }, 3000);
    // 加载动画
    GM_addStyle(".medal-loading{height:30px;color:#bbb;font-size:13px;display:flex;align-items:center;justify-content:center}.medal-loading>i.icon-link-world{font-size:12px;margin-left:5px;animation:medal-loading-rotate 2s infinite}.medal-loading>i.icon-info{margin-right:5px}@keyframes medal-loading-rotate{from{transform:rotate(45deg)}to{transform:rotate(405deg)}}");
    // body内的条目css
    GM_addStyle(".medal-list-move{transition:transform .5s!important}.medal-wear-body{height:335px;margin-top:5px;padding-right:2px;overflow:auto;scrollbar-width:thin}.medal-wear-body::-webkit-scrollbar{width:6px}.medal-wear-body::-webkit-scrollbar-thumb{background-color:#aaa}.medal-item-content{display:flex;justify-content:space-between}.medal-wear-body .medal-item{padding:5px 5px 3px;background:0;border:1px solid transparent;border-radius:5px;width:calc(100% - 12px);text-align:left;transition:border,background .2s}.medal-wear-body .medal-item:hover{border:1px solid #d7d7d7;background-color:#f5f5f5}.medal-item .face,.medal-item .search-user-avatar{width:auto;height:35px;margin-right:5px;padding:1px;position:relative;transition:filter .3s}.medal-item .face:hover,.medal-item .search-user-avatar:hover{filter:drop-shadow(0px 0 3px #fb7299);cursor:alias}.medal-item .face>img{height:35px;border-radius:50%}.medal-wear-body .medal-item .name{color:#666;position:relative;max-width:calc(100% - 78px);font-size:14px;line-height:18px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.medal-wear-body .medal-item .name:hover{color:#00aeec}.medal-wear-body .medal-item .living-gif{background-image:url(//s1.hdslb.com/bfs/static/blive/live-fansmedal-wall/static/img/icon-online.fd4254c1.gif);background-size:cover;width:16px;height:16px;transform:rotateY(180deg)}.medal-item .wear-icon{background-color:#fb7299;padding:0 2px;color:#fff;height:16px;border:1px solid #fb7299;border-radius:4px;line-height:16px;font-size:14px}.medal-item .room-icon{padding:0 2px;color:#fea249;height:16px;border:1px solid #fea249;border-radius:4px;line-height:16px;font-size:14px}.medal-item .content-icon{padding:0 2px;color:#40bf55;height:16px;border:1px solid #40bf55;border-radius:4px;line-height:16px;font-size:14px}.medal-wear-body .medal-item .text{color:#888;position:relative;line-height:18px;font-size:14px}.medal-wear-body .medal-item .left{color:#2cbce7;line-height:18px;font-size:14px;margin-right:5px}.medal-item-content .medal-content-head{height:18px}.medal-item-content .medal-content-footer{height:18px;padding-top:1px;width:100%}.medal-wear-body .medal-item .progress-level-div{margin-top:3px;width:100%;text-align:center;display:flex;justify-content:space-between;font-size:13px}.medal-wear-body .medal-item .progress-level-div .level-span-left{text-align:right!important}.medal-wear-body .medal-item .progress-level-div .level-span{width:33px;color:#999;padding-top:1px}.medal-wear-body .medal-item .progress-level-div .progress-div{line-height:16px;height:14px;width:70%;background-color:#e2e8ec;border-radius:2px;margin:0 2px;position:relative;overflow:hidden}.medal-wear-body .medal-item .progress-level-div .progress-div-cover{position:absolute;left:0;top:0;overflow:hidden;background-color:#23ade5}.medal-wear-body .medal-item .progress-level-div .progress-div .progress-num-span{color:#23ade5}.medal-wear-body .medal-item .progress-level-div .progress-div-cover .progress-num-span-cover{width:174px;position:relative;z-index:1000;color:#fff}.medal-item.outdated{opacity:.5;filter:grayscale(0.5);}");
    // 面板css
    GM_addStyle(".chat-input-ctnr .medal-section{position:static;display:flex;align-items:center;justify-content:center;flex-shrink:0;padding:0 12px;min-width:70px;height:56px;border-right:1px solid #e9eaec;box-sizing:border-box}.medal-section .action-item.medal.get-medal,.medal-section .action-item.medal.wear-medal{width:41px;height:24px;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFYAAAAyCAMAAADx7dyJAAAA51BMVEUAAACampqZmZmampqZmZmampqampqZmZmdnZ2oqKiamprU1NSZmZmZmZmZmZmvr6+ampqampqamprIyMiZmZmampqampqZmZmZmZmampqenp6cnJyfn5+ampqbm5uampqenp7Q0NDOzs6ampqamprPz8/Ozs6ampqbm5vMzMyZmZmZmZnNzc2bm5ubm5uZmZmampqcnJyampqampqampqampqamprNzc2amprU1NTU1NTU1NSamprV1dXS0tLR0dHT09PU1NTT09PW1tbS0tLMzMzt7e2ZmZnj4+PPz8/V1dXo6OjZ2dk1f/nUAAAARXRSTlMA49Zr8zV1SzkGgKukj4UL+q5iA97uw1mpiSAbDupeQRX6eLPNPBnIT+bm0rI9JsFlLdmWm41G+buqn35xMBHr2r5WRCgCpQL/AAADqUlEQVRYw7TS226qQBiG4Q8cUAg7hbHIRo1Y0epCa2vbA0/Jf/93tBhApYqJK3G9yT+QQJ4ME/D/et2s8qe12rxW6ix/crNyr/n3bIGntZh952K/G6E/s1m+AbDKF3hqi3wFIM9xlariqoGCOx19iEK/i8kUIiG2spKE32lxmhmNXiBy7aKExKplpE75PPo3tkudHnnyKbIgGtO5TkA6vpzEbWOVXlUc9+o0lBnOtEd/cIpVbDAumpNYM8Giw5Q2ltF1AUQ2S3DLupqoT+UloFGxhprbwh7VKs7Vuqj+2hfBGm9lcs0a1JL1+NnaHimC3ZnmnJumVbOTTjNKy4vyOKtTxQIw5cbZhvq5CLyPqkfZgDntrELG4SDJh0NCIfZDYGJMb9mweyqOz7ch4DujitUZc4ix9MIugyDtB8GuYIcyoFMLu6OWdrBJfanYkXfcxsdEvrCMc8fhnBWsz4GfNW7ZbFA1lzmX54OqDLBcwU5IGQ3FIagNVgG2BrCkUOzUZeb9s+1SV5KWjoJLgl1ScMt6+z1j+71EoXhnQsu7bMC3kCRs1/ZvtkP2NRtNJuu0Gg3vNPh0pvdYLXXeBZuxxP3F6gxnlluof1xvXYxc/q6xwfu4x5o0gGCxpE+3yX54F1YaQWR5nsOq6QCGQ1932MigT1QsLErsBttPL6xnoouyYVKOaEweEGotrOKR4Z5YjGgeXFjJr1ldxvojIgWR7/uxVMxbcRNhRx+A7rnXrKs64smZhUVsd2LfaVyysS79YNvPKELUbxQFjGIbvoxr1qS/tdZvS8JQFMfxHy2SFNxqJJUau6ggCdnSxDacf093d/P9v56Gd7Gcyx2ofZ8Jh88D72Ecy8BPFk+XspmyV9I5sFa/NcN0NOzqR+sPk0d+dwBnZBnWg/08PWHdvotjFm6rnbLjPmB2kj9B/764Aczbluw9wja6l3XnTRqoy7mccT81mr2vIyllMZdDoG31Dgg6zTt38gpgIsf2GbZWw1EvhoOOXutrHGojycF3JnR6ETL2fyOq6Pyo6Fiq6LSr5hCt8GzOWgiKPnOFRA3kahCF+bmIxAI6tvoXNyhWPwC2G+C0Dalilesq2hRthiIVFqhMN1SkCvd0sCSK4rzKc+OIaDlAYbYv0tnstRiunhW+jd8K1sksS9VuNrsOcC6fVJypPDdW5KOkFe0zlefuaYWydoriTOW4MakdSvNIaZXrKvJQnilIq1yXhAlGW6E8sPOU2IKXjeL4w19GXEgqF0Zf/gAAAABJRU5ErkJggg==)}.medal-section .action-item.medal{background-size:cover;border:0}.medal-section .action-item{display:inline-block;margin:0 2px;font-size:12px;color:#fff;line-height:14px;text-align:center;border-radius:2px;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.dialog-ctnr.medal{z-index:999;padding:10px 14px 10px 16px;position:absolute}.medal-ctnr{width:268px}.medal-wear-component>.title{font-weight:400;font-size:18px;margin:0;color:#23ade5;line-height:20px}.medal-search{width:160px;margin-left:10px;position:relative;line-height:20px;top:-1px;font-size:14px;font-weight:100;border:0;padding:0;color:var(--Pi4)}.medal-search::placeholder{color:#dcdcdc}.des{cursor:pointer;color:#666;height:20px;display:flex;align-items:center}.des>.svg-icon{width:14px;height:14px;font-size:14px;background-position:0-8em;margin-right:5px}.des>span.pointer{line-height:14px}.des>.svg-icon.checkbox-selected{background-position:0-9em}.qs-icon{width:14px;height:14px;background-size:100%;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAA79JREFUSA29lk1IVFEYhpsZf0AwDDc5RlJBYepK+rHQFhUutaCdiyL8w5JWkijlIjNISBrTUYha2MZAjBZRmEERGa1CSwqysrSVCw2DGNGe93LP5TreOzOL8MC55zvf+37fe/7uuTewJYXS0NBQvLa2Vk0th54fCATCCqM/TzNH/xV1NBqNTsmfqAQSgfX19VUk7YRTRMIp7KfYs9gSkqCEd9KvxC7G/oDdNjAw8Ei4V/EUrKurU5IhkhwmaIDaMzg4+MUrgfERswf7ErWe2Alia4iZNbhpNwiyfEchj1CnIZ1PJmQSmdYWvotoIfU0y/zaYGrXCdpiz/HfQ7AZsZib3NLSkr24uKhZl5Asd3V19XMoFJro7+//5OYhmk4/Aucs9bhb1BG0l/EdxBH2oNGdQDb7WcEgHmDuoC6T6Df97bSr9O9kZ2e3dnd3L2M7hZxR8FPwDpjlDRoUYAj7o2ZmfKZtbGw8gX8cznwwGCwJh8NbGVReVlbWNjg3qU1LS0u3Dd/VXiRu2s5tua0Z2qfxIZ7C+D0bHh4OjY2NvRc7MzOzNBKJ/LUiXQ9mEqF7IS0t7WBfX59WySlgOkwSPaPTa82QUXTiiMaLKWp8fFzvXhEz6/ISE4cyqAd7ekituyincktD/iAjKKFVwh430dgkKZJNO2F88W1OTs43+Ui6Kx5T385dpAskiHoVvklO2owXmVMo/w327bsXLh8nd59aBD05yo2OLo7qNB7ldHSDeBbITwBUfQs52gBjGRkZj/1IcKRRrj3Mp264EfwC4/0cuOv4qhl0d29v79d43PTBNft8LWmYat2NBky1Zf+7GHkr8RFebs3St0hDWs576Mv0ARC7CnSZ2slxbybZmg91nVt7qNlZn5t1SIIOy1gGfIXYWxz79gRUB4IblpZmOIdR4CCpGbXELEFNSUwpbY057aE+npWp6TisI1hvmN0fx5PEkIa0JDiKejH35e4kMW74J523bkciW7mlIS2Lx55MUr0u30R5UsaUWxoKMKe0nRE02Bdt0kRwA0lJNkE5lZvrzXptnEBG8BJA37aT7E3ML2FTU9PeWCz2AnyG6+5YR0eHYjwLYuks4zPAEK9OhUhmhjpFNYD6LUi4tCsrK6XE6TUqW1hYyFUSv2Ln2q/chuPMUA7ziwHhPt2LXjO1R10L/oNRe96dNkcDP4eo9y8GoFU29SfKiDLCzftNNKJqOUj6Vl5jifUOWT/CtLr1fwmn5IEV4LN+hMXB165fCQv1eKzbQw/cculLTeL/8qv/D4FH4W+V11VGAAAAAElFTkSuQmCC);cursor:pointer;position:relative;top:1px}.link-radio-button-ctnr{display:inline-block;cursor:default;vertical-align:middle;font-size:0}.footer-line{position:relative;left:-16px;width:300px;border-top:1px solid #f0f0f0;margin-top:3px}.medal-wear-footer{margin-top:10px;font-size:14px;color:#23ade5;justify-content:space-between}.medal-wear-footer>*{cursor:pointer}.medal-wear-footer a{color:#23ade5}.medal-wear-footer .right-span{float:right}.medal-wear-footer .arrow-box{width:10px;height:10px;font-size:10px;position:relative;top:2px}");
    // 直播中 头像动画
    GM_addStyle(".search-user-avatar.avatar-small .avatar-wrap{transform:scale(.8)}.search-user-avatar .avatar-wrap{width:100%;height:35px}.medal-item .bili-avatar{display:block;position:relative;background-image:url(data:image/gif;base64,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);background-size:cover;border-radius:50%;margin:0;padding:0;width:35px;height:35px}.medal-item .bili-avatar .bili-avatar-img{border:1px solid var(--line_light)}.medal-item .bili-avatar-img-radius{border-radius:50%}.medal-item .bili-avatar-img{border:0;display:block;-o-object-fit:cover;object-fit:cover;image-rendering:-webkit-optimize-contrast}.medal-item .bili-avatar-face{position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);transform:translate(-50%,-50%);width:100%;height:100%}.medal-item .bili-avatar *{margin:0;padding:0}.medal-item .bili-avatar-right-icon{width:27.5%;height:27.5%;position:absolute;z-index:2;right:0;bottom:-1px;background-size:cover;image-rendering:-webkit-optimize-contrast;background-image:url(data:image/png;base64,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)}.search-user-avatar .avatar-wrap.live-ani .a-cycle{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:35px;height:35px;border:1px solid #f69;border-radius:50%;z-index:1;opacity:0;animation:scaleUpCircle 1.5s linear;animation-iteration-count:infinite}.search-user-avatar .avatar-wrap.live-ani .a-cycle-1{animation-delay:0s}.search-user-avatar .avatar-wrap.live-ani .a-cycle-2{animation-delay:.5s}.search-user-avatar .avatar-wrap.live-ani .a-cycle-3{animation-delay:1s}@keyframes scaleUpCircle{0%{transform:translate(-50%,-50%) scale(1);opacity:1}100%{transform:translate(-50%,-50%) scale(1.5);opacity:0}}");
    // 旧的粉丝牌样式
    GM_addStyle(".old-style.fans-medal-item{border:1px solid #fff;border-radius:2px;padding:0;height:16px}.old-style .fans-medal-label{height:100%;border-radius:0;padding:0 3px}.old-style .fans-medal-label .fans-medal-content{transform:none}.old-style .fans-medal-level{width:17px;height:14px;border-radius:0}");
    // 调用原始按钮更新粉丝牌，暂时隐藏弹窗的css
    GM_addStyle(".panel-hide .medal.dialog-ctnr:not(.scripted-panel){display:none}");

    // 公用对象
    let pinyinPro = undefined;
    let my_id = document.cookie.match(/DedeUserID=(\d*); /)[1];
    let originMedalSelectorDebounce = null;
    let pinyin = pinyinSwitch;
    // 默认粉丝牌UID   如果拥有该用户的粉丝牌会在退出直播间时切换到这个粉丝牌
    // 废弃功能，不要用
    let defaultMedalUid = false;

    new Vue({
        el: '#medel_switch_box',
        async created() {
            let json = await this.getFansMedalInfo();
            let assignMedal = true;
            if (this.autoSwitch && json.has_fans_medal) {
                assignMedal = false;
                this.switchBadge(json.my_fans_medal.medal_id);
            }
            this.refreshMedalList(1, assignMedal);
            if (pinyin) {
                fetch("https://unpkg.com/pinyin-pro@3.13.0/dist/index.js")
                    .then(res => res.text(), err => { })
                    .then(js => {
                        if (!js) { console.warn("徽章切换增强-启动拼音组件失败"); return; }
                        try {
                            js = js.replace("pinyinPro", "biliSwitchBoostPinyinPro");
                            eval(js);
                            pinyinPro = window.biliSwitchBoostPinyinPro;
                            Reflect.deleteProperty(window, 'biliSwitchBoostPinyinPro');
                            this.backUpMedalWall.forEach(item => {
                                // 用户名
                                item.anchor_info.nick_pinyin = pinyinPro.pinyin(item.anchor_info.nick_name, { toneType: 'none', nonZh: 'consecutive', v: true }).replaceAll(" ", "").toLowerCase();
                                // 粉丝牌
                                item.medal.medal_pinyin = pinyinPro.pinyin(item.medal.medal_name, { toneType: 'none', nonZh: 'consecutive', v: true }).replaceAll(" ", "").toLowerCase();
                            });
                        } catch (error) {
                            console.warn("徽章切换增强-启动拼音组件错误", error);
                        }
                    });
            }
        },
        mounted: function () {
            document.querySelector("#medal-selector").onclick = () => {
                this.togglePanel();
            };
            // 如果有默认粉丝牌，则退出直播间时换上默认粉丝牌
            if (defaultMedalUid) {
                this.getFansMedalInfo(defaultMedalUid, (json, context) => {
                    if (json.has_fans_medal == false) { return; }
                    let index = this.medalWallIndex.indexOf(json.my_fans_medal.medal_id);
                    window.addEventListener('beforeunload', () => {
                        context.switchBadge(json.my_fans_medal.medal_id, index);
                    });
                });
            }
            window.addEventListener('click', e => {
                if (e.target.closest(".medal") == null && this.panelStatus) {
                    this.panelStatus = false;
                    document.querySelector(".medal-wear-body").scrollTop = 0;
                }
            });
            window.addEventListener('blur', () => { this.isTabBlur = true; });
            window.addEventListener('focus', this.refreshScriptInfo);
            // // 鼠标移动到礼物栏、弹幕输入区域时进行自动切换
            // let initMouseEventDeadLine = Date.now() + 15000;
            // (function initMouseEvent(vueInstance) {
            //     let giftDom = document.querySelector("#gift-control-vm .gift-panel");
            //     let inputDom = document.querySelector("#control-panel-ctnr-box");
            //     if (giftDom && inputDom) {
            //         giftDom.onmouseenter = inputDom.onmouseenter = () => {
            //             // console.log("徽章更换检测1", vueInstance.isTabBlur);
            //             if (vueInstance.isTabBlur) {
            //                 vueInstance.refreshScriptInfo();
            //             }
            //             // console.log("徽章更换检测2", vueInstance.isTabBlur);
            //             let cRoomMedal = vueInstance.fansMedalInfo.my_fans_medal.medal_id;
            //             if (vueInstance.autoSwitch && vueInstance.needSwitch && cRoomMedal != 0) {
            //                 // console.log("徽章触发更换");
            //                 vueInstance.switchBadge(cRoomMedal, vueInstance.medalWallIndex.indexOf(cRoomMedal));
            //                 vueInstance.needSwitch = false;
            //             }
            //         };
            //     } else if (Date.now() < initMouseEventDeadLine) {
            //         requestIdleCallback(() => {
            //             initMouseEvent();
            //         }, { timeout: 3000 });
            //     } else {
            //         console.log("切换模块初始化失败");
            //     }
            // })(this);
            this.$refs.medalList.$el.addEventListener('scroll', () => {
                let medalList = this.$refs.medalList.$el;
                let baseline = medalList.scrollHeight - medalList.offsetHeight;
                // 滚动条到最后10%的时候开始加载下一页
                if (this.pageInfo.isLastPage == false && this.pageInfo.loading == false && medalList.scrollTop > baseline - baseline * .1) {
                    this.pageInfo.loading = true;
                    this.refreshMedalList(this.pageInfo.cPage + 1);
                }
            }, false);
        },
        computed: {
            medalWallIndex: function () {
                let indexList = [];
                this.medalWall.forEach(item => {
                    indexList.push(item.medal.medal_id);
                });
                return indexList;
            },
            backUpMedalWallIndex: function () {
                let indexList = [];
                this.backUpMedalWall.forEach(item => {
                    indexList.push(item.medal.medal_id);
                });
                return indexList;
            }
        },
        data() {
            return {
                name: Date.now().toString(16) + "-" + btoa(location.host),
                fansMedalInfo: {
                    "has_fans_medal": false,
                    "my_fans_medal": {
                        "target_id": 0,
                        "medal_id": 0
                    }
                },
                currentlyWearing: {
                    medal: {
                        medal_id: 0
                    }
                },
                recentAward: {
                    medal: {
                        medal_id: 0
                    }
                },
                autoSwitch: false,
                // b站自己做了自动切换功能，所以我就不做了，这里改一下默认值防止有些人开着然后永远关不了了
                // autoSwitch: GM_getValue(`autoSwitch-${my_id}`, false),
                needSwitch: false,
                panelStatus: false,
                pageInfo: {
                    loading: false,
                    cPage: 1,
                    isLastPage: true
                },
                /* 
                    本来是用于展示的，但是牌子多加载需要翻页的情况显示的全是脏数据 
                    现在仅用于缓存存在的牌子提速自动换牌的速度
                */
                backUpMedalWall: GM_getValue(`medalWall-${my_id}`, []),
                medalWall: [],
                debounce: {},
                search: "",
                label: "",
                isTabBlur: false,   // 标识网页是否失焦
            }
        },
        watch: {
            currentlyWearing: {
                handler(val, oldVal) {
                    // 持久化用于从其他tab取出信息
                    GM_setValue(`currentlyWearing-${my_id}`, val);
                    clearTimeout(originMedalSelectorDebounce);
                    this.refreshMedal();
                    /* 
                        新旧ID相同的情况下也刷新牌子显示，因为牌子的数据可能会有变化
                        但是牌子相同的情况下不需要调用网页刷新
                    */
                    if (oldVal && val.medal.medal_id == oldVal.medal.medal_id) {
                        return;
                    }
                    // 借用原始徽章按钮来刷新当前页面上的徽章缓存
                    // 用于其他原版消息发送时展示最新的牌子（比如发表情弹幕）
                    originMedalSelectorDebounce = setTimeout(() => {
                        let originMedelBtn = document.querySelector(".medal-section:not(.scripted)>span");
                        let medelPanelParent = document.querySelector("#control-panel-ctnr-box");
                        if (!originMedelBtn || !medelPanelParent) {
                            console.log("徽章刷新失败-找不到原版按钮");
                            return;
                        }
                        originMedelBtn.click();
                        medelPanelParent.classList.add("panel-hide");
                        // 检测窗口
                        let deadLine = Date.now() + 1000;
                        let interval = setInterval(() => {
                            if (Date.now() > deadLine) {
                                clearInterval(interval);
                                medelPanelParent.classList.remove("panel-hide");
                                console.log("徽章刷新失败-无法抓取到原版徽章页面");
                            }
                            // 点开后等待页面加载，加载完成后关闭页面
                            let hook = document.querySelector(".medal.dialog-ctnr:not(.scripted-panel) .medal-wear-body>.medal-item");
                            if (hook) {
                                clearInterval(interval);
                                let originMedelBox = document.querySelector(".medal.dialog-ctnr:not(.scripted-panel)");
                                originMedelBox.dispatchEvent(new Event('mouseleave'));
                                // 立刻执行会闪一下，观感很不好
                                setTimeout(() => { medelPanelParent.classList.remove("panel-hide"); }, 500);
                            }
                        }, 100);
                    }, 1000);
                },
                immediate: false
            },
            autoSwitch(val) {
                GM_setValue(`autoSwitch-${my_id}`, val);
                if (val) {
                    let cRoomMedal = this.fansMedalInfo.my_fans_medal.medal_id;
                    if (cRoomMedal != 0) {
                        this.switchBadge(cRoomMedal, this.medalWallIndex.indexOf(cRoomMedal));
                        this.needSwitch = false;
                    }
                }
            },
            search(val) {
                clearTimeout(this.debounce["search"]);
                let vm = this;
                this.debounce["search"] = setTimeout(function () {
                    if (val) {
                        val = val.toLowerCase().trim();
                        vm.medalWall = vm.backUpMedalWall.filter((item) => {
                            if (item.medal.medal_name.toLowerCase().includes(val) || item.anchor_info.nick_name.toLowerCase().includes(val)) {
                                item.score = 2;
                                return true;
                            }
                            if (!pinyinPro) { return false; }
                            if (item.medal.medal_pinyin.includes(val) || item.anchor_info.nick_pinyin.includes(val)) {
                                item.score = 1;
                                return true;
                            }
                            return false;
                        });
                        vm.medalWall.sort(vm.sort);
                        vm.pageInfo.isLastPage = true;
                    } else {
                        vm.medalWall = vm.backUpMedalWall.slice(0, 50);
                        vm.pageInfo.isLastPage = vm.backUpMedalWall.length < 50;
                    }
                }, 200);
            }
        },
        methods: {
            /* 将10进制数字转为16进制字符串，不足6位时自动补充 */
            padToHex(str) {
                return str.toString(16).padStart(6, 0);
            },
            async sleep(ms) {
                return new Promise(r => {
                    setTimeout(() => {
                        r(true);
                    }, ms);
                });
            },
            async getCurrentWear() {    // 获取当前佩戴粉丝牌
                let res = await fetch(`https://api.live.bilibili.com/xlive/app-ucenter/v1/fansMedal/panel?page=1&page_size=1`, { credentials: 'include', });
                let json = await res.json();
                if (json.code == json.message) {
                    for (const item of json.data.special_list) {
                        if (item.superscript == null) {
                            this.currentlyWearing = item;
                            break;
                        }
                    }
                    return;
                }
                warn("获取当前佩戴失败：", json.message);
            },
            async getFansMedalInfo(uid, callback) {  // 用来获取是否拥有指定用户的粉丝牌
                let muid = undefined;
                if (!uid) {
                    muid = uid = await ROOM_INFO_API.getUid();
                }
                let res = await fetch(`https://api.live.bilibili.com/xlive/app-ucenter/v1/fansMedal/fans_medal_info?target_id=${uid}`, { credentials: 'include', });
                let json = await res.json();
                if (json.code == json.message) {
                    // 仅在获取当前房间信息时赋值
                    if (muid == uid) {
                        this.fansMedalInfo = json.data;
                    }
                    if (callback) {
                        // 存在回调的情况下异步执行
                        (async () => {
                            callback(json.data, this);
                        })();
                    }
                    return json.data;
                }
                alert("徽章初始化失败：", json.message);
            },
            async refreshMedalList(page = 1, assignMedal = true) {
                let uid = await ROOM_INFO_API.getUid();
                return new Promise((resolve, reject) => {
                    fetch(`https://api.live.bilibili.com/xlive/app-ucenter/v1/fansMedal/panel?page=${page}&page_size=50&target_id=${uid}`, { credentials: 'include', })
                        .then(res => res.json())
                        .then(json => {
                            if (json.code == json.message) {
                                /* 
                                    刷新当前佩戴的徽章
                                    special_list的内容不会超过3条，所以两次循环无所谓
                                */
                                if (page == 1 && assignMedal) {     // 只有第一页special_list才会有值
                                    // 防止在其他地方取消牌子后插件无反应
                                    this.currentlyWearing = { medal: { medal_id: 0 } };
                                }
                                for (let item of json.data.special_list) {
                                    // 抓取当前佩戴
                                    // 2023年7月26日 item.medal.wearing_status不总是准确的
                                    if (assignMedal && item.medal.wearing_status) {
                                        this.currentlyWearing = item;
                                        continue;
                                    }
                                    // 抓取最近获取
                                    if (item.superscript && item.superscript.type == 2) {
                                        this.recentAward = item;
                                        continue;
                                    }
                                }

                                if (page == 1) {
                                    this.label = Math.floor(Math.random() * 2 ** 32);
                                }
                                // 合并列表并排序
                                let list = [].concat(json.data.list, json.data.special_list);
                                list.forEach((item) => {
                                    // 添加标识
                                    item.label = this.label;
                                    // 解析拼音
                                    if (pinyinPro) {
                                        // 用户名
                                        item.anchor_info.nick_pinyin = pinyinPro.pinyin(item.anchor_info.nick_name, { toneType: 'none', nonZh: 'consecutive', v: true }).replaceAll(" ", "").toLowerCase();
                                        // 粉丝牌
                                        item.medal.medal_pinyin = pinyinPro.pinyin(item.medal.medal_name, { toneType: 'none', nonZh: 'consecutive', v: true }).replaceAll(" ", "").toLowerCase();
                                    }
                                    let index = this.medalWallIndex.indexOf(item.medal.medal_id);
                                    if (index >= 0) {
                                        this.$set(this.medalWall, index, item);
                                    } else {
                                        this.medalWall.push(item);
                                    }
                                    // backUpMedalWall
                                    index = this.backUpMedalWallIndex.indexOf(item.medal.medal_id);
                                    item.superscript = null;    // 防止搜索出现脏数据
                                    if (index >= 0) {
                                        this.$set(this.backUpMedalWall, index, item);
                                    } else {
                                        this.backUpMedalWall.push(item);
                                    }
                                });
                                this.medalWall.sort(this.sort);
                                this.backUpMedalWall.sort(this.sort);
                                // 保存页面数据
                                this.pageInfo.loading = false;
                                this.pageInfo.cPage = +json.data.page_info.current_page;
                                this.pageInfo.isLastPage = page >= json.data.page_info.total_page;
                                // 获取完整列表后替换旧列表
                                if (this.pageInfo.isLastPage) {
                                    this.backUpMedalWall = this.medalWall;
                                }
                                GM_setValue(`medalWall-${my_id}`, this.backUpMedalWall);
                                // 返回是否有下一页
                                resolve(json.data.page_info.has_more && page < json.data.page_info.total_page);
                            } else {
                                reject(false);
                            }
                        })
                        .catch(err => {
                            reject();
                        });
                });
            },
            async switchBadge(badgeId, index) {
                let jct = document.cookie.match(/bili_jct=(\w*); /)[1]
                let params = new URLSearchParams();
                params.set("medal_id", badgeId);
                params.set("csrf_token", jct);
                params.set("csrf", jct);
                fetch("https://api.live.bilibili.com/xlive/web-room/v1/fansMedal/wear", {
                    credentials: 'include',
                    method: 'POST',
                    body: params
                });
                // .then(res => res.json())
                // .then(json => {
                //     if (json.code == 0) {
                //     }
                // });
                if (index >= 0) {
                    this.currentlyWearing = this.medalWall[index];
                } else {
                    let result = this.backUpMedalWall.find(item => {
                        return badgeId == item.medal.medal_id;
                    });
                    if (result) {
                        this.currentlyWearing = result;
                    } else {
                        console.warn("徽章列表内找不到对应的徽章");
                        await this.getCurrentWear();
                    }
                }
                // 佩戴时更新为最新状态
                // todo 现有接口不能更新 头像、直播状态
                // if (this.currentlyWearing.label != this.label) {
                //     this.getFansMedalInfo(this.currentlyWearing.medal.target_id, (data) => {
                //         this.medalWall[index].label = this.label;
                //         this.$set(this.medalWall[index], "medal", data.my_fans_medal);
                //     });
                // }
                // 仅主动切换才保存操作人
                GM_setValue(`operator-${my_id}`, this.name);
            },
            takeOff() {
                this.currentlyWearing = { medal: { medal_id: 0 } };
                let jct = document.cookie.match(/bili_jct=(\w*); /)[1]
                let params = new URLSearchParams();
                params.set("visit_id", '');
                params.set("csrf_token", jct);
                params.set("csrf", jct);
                fetch("https://api.live.bilibili.com/xlive/web-room/v1/fansMedal/take_off", {
                    "method": "POST",
                    "credentials": "include",
                    "body": params,
                });
                // 仅主动切换才保存操作人
                GM_setValue(`operator-${my_id}`, this.name);
            },
            openConfig() {
                // 点击原版
                let originMedelBtn = document.querySelector(".medal-section:not(.scripted)>span");
                if (!originMedelBtn) {
                    console.log("展示设置打开失败-找不到原版按钮");
                    return;
                }
                originMedelBtn.click();
                // 检测窗口
                let deadLine = Date.now() + 1000;
                let interval = setInterval(() => {
                    if (Date.now() > deadLine) {
                        clearInterval(interval);
                        console.log("展示设置打开失败-无法抓取到原版徽章页面");
                    }
                    // 弹出后，点击展示设置
                    let hook = document.querySelector(".medal.dialog-ctnr:not(.scripted-panel) .medal-wear-body>.medal-item");
                    if (hook) {
                        clearInterval(interval);
                        let configBtn = document.querySelector(".medal.dialog-ctnr:not(.scripted-panel) .cancel-wear");
                        if (configBtn) {
                            configBtn.click();
                        } else {
                            console.log("展示设置打开失败-找不到设置按钮");
                        }
                    }
                }, 100);
            },
            openSpace: (uid) => {
                window.open(`//space.bilibili.com/${uid}`);
            },
            openRoom: (rid) => {
                window.open(`//live.bilibili.com/${rid}`);
            },
            togglePanel() {
                clearTimeout(this.debounce["panel"]);
                this.panelStatus = !this.panelStatus;
                if (!this.panelStatus) {
                    this.debounce["panel"] = setTimeout(() => {
                        this.debounce["panel"] = null;
                        // 临时处理，防止第二次打开后未翻页脏数据
                        this.medalWall = this.backUpMedalWall.slice(0, 50);
                        this.search = "";
                    }, 2000);
                } else {
                    if (this.debounce["panel"]) { return; }
                    // 刷新本房间粉丝牌状态
                    if (this.fansMedalInfo.has_fans_medal == false) {
                        this.getFansMedalInfo();
                    }
                    this.$nextTick(() => {
                        // 只能在nexttick里面不然元素处于display:none时无法起作用
                        document.querySelector(".medal-wear-body").scrollTop = 0;
                        this.refreshMedalList();
                    });
                }
            },
            refreshMedal() {
                let selector = document.querySelector("#medal-selector");
                if (this.currentlyWearing.medal.medal_id != 0) {
                    selector.innerHTML = `
                        <div class="v-middle fans-medal-item none-select old-style medal-item-margin"
                            style="border-color:#${this.padToHex(this.currentlyWearing.medal.medal_color_border)}">
                            <div class="fans-medal-label"
                                style="background-image:linear-gradient(45deg,#${this.padToHex(this.currentlyWearing.medal.medal_color_start)},#${this.padToHex(this.currentlyWearing.medal.medal_color_end)})">
                                <span class="fans-medal-content">${this.currentlyWearing.medal.medal_name}</span>
                            </div>
                            <div class="fans-medal-level" style="color:#${this.padToHex(this.currentlyWearing.medal.medal_color_start)}">${this.currentlyWearing.medal.level}</div>
                        </div>
                    `;
                } else {
                    selector.innerHTML = `<span class="action-item medal get-medal"></span>`;
                }
            },
            sort(a, b) {
                // 搜索匹配度
                // if (this.search && (a.score || b.score) && a.score != b.score) {
                //     return a.score > b.score ? -1 : 1;
                // }
                // 当前房间
                if (a.medal.target_id == this.fansMedalInfo.my_fans_medal.target_id) {
                    return -1;
                } else if (b.medal.target_id == this.fansMedalInfo.my_fans_medal.target_id) {
                    return 1;
                }
                // 当前佩戴 
                if (a.medal.medal_id == this.currentlyWearing.medal.medal_id) {
                    return -1;
                } else if (b.medal.medal_id == this.currentlyWearing.medal.medal_id) {
                    return 1;
                }
                // 最近获得、其他特殊情况
                if (a.medal.medal_id == this.recentAward.medal.medal_id) {
                    return -1;
                } else if (b.medal.medal_id == this.recentAward.medal.medal_id) {
                    return 1;
                }
                // 如果不是此次获取的牌子，向后靠
                if (a.label != this.label) {
                    return 1;
                } else if (b.label != this.label) {
                    return -1;
                }
                // 灰色牌子
                if (a.medal.is_lighted == 0) {
                    return 1;
                } else if (b.medal.is_lighted == 0) {
                    return -1;
                }
                // 等级排序
                if (a.medal.level != b.medal.level) {
                    return b.medal.level - a.medal.level;
                }
                // 经验排序
                return b.medal.intimacy - a.medal.intimacy;
            },
            refreshScriptInfo(event) {
                // console.log("插件状态更新", this.isTabBlur);
                this.isTabBlur = false;
                // 获取最新状态
                // this.autoSwitch = GM_getValue(`autoSwitch-${my_id}`, false);
                // 如果当前页面展示的粉丝牌不是实际佩戴的粉丝牌，那么更新显示
                let wearing = GM_getValue(`currentlyWearing-${my_id}`);
                if (wearing && this.currentlyWearing.medal.medal_id != wearing.medal.medal_id) {
                    this.currentlyWearing = wearing;
                }
                if (wearing && this.name != GM_getValue(`operator-${my_id}`) && this.fansMedalInfo.my_fans_medal.medal_id != wearing.medal.medal_id) {
                    this.needSwitch = true;
                } else {
                    this.needSwitch = false;
                }
            }
        },
        template: `
            <div class="border-box dialog-ctnr common-popup-wrap medal a-scale-in scripted-panel" v-show="panelStatus" @mouseleave="togglePanel">
                <div class="medal-ctnr none-select">
                    <div class="medal-wear-component">
                        <h1 class="dp-i-block title">
                            粉丝牌
                        </h1>
                        <a href="http://link.bilibili.com/p/help/index#/audience-fans-medal" target="_blank"
                            class="dp-i-block qs-icon"></a>
                        <input class="medal-search" placeholder="搜索粉丝牌" v-model="search">
                        <div class="dp-i-block des f-right" @click="autoSwitch = !autoSwitch" style="display:none">
                            <span class="cb-icon svg-icon v-middle" :class="{'checkbox-selected':autoSwitch}"></span>
                            <span class="pointer v-middle">自动更换</span>
                        </div>
                        <transition-group name="medal-list" tag="div" class="medal-wear-body" ref="medalList">
                            <div class="medal-item" v-for="(item,index) in medalWall" :class="{ outdated: item.label != label }"
                                :key="item.medal.medal_id" :data-uid="item.medal.target_id" :data-rid="item.room_info.room_id" 
                                :data-uname="item.anchor_info.nick_name.toLowerCase()" :data-mname="item.medal.medal_name.toLowerCase()"
                                @click="currentlyWearing.medal.medal_id == item.medal.medal_id ? takeOff() : switchBadge(item.medal.medal_id,index)">
                                <div class="medal-item-content">
                                    <template v-if="item.room_info.living_status == 1">
                                        <a :href="'//live.bilibili.com/' + item.room_info.room_id" target="blank" @click.stop="" class="search-user-avatar p_relative avatar-small mr_md cs_pointer">
                                            <div class="avatar-wrap p_relative live-ani">
                                                <div class="avatar-inner">
                                                    <div class="bili-avatar" style="width: 35px;height:35px;">
                                                        <img class="bili-avatar-img bili-avatar-face bili-avatar-img-radius"
                                                            :src="item.anchor_info.avatar">
                                                        <span class="bili-avatar-right-icon"
                                                            v-if="item.anchor_info.verify == 0"></span>
                                                    </div>
                                                </div>
                                                <div class="a-cycle a-cycle-1"></div>
                                                <div class="a-cycle a-cycle-2"></div>
                                                <div class="a-cycle a-cycle-3"></div>
                                            </div>
                                        </a>
                                    </template>
                                    <template v-else>
                                        <a :href="'//live.bilibili.com/' + item.room_info.room_id" target="blank" class="face" @click.stop="">
                                            <img :src="item.anchor_info.avatar">
                                            <span class="bili-avatar-right-icon" v-if="item.anchor_info.verify == 0"></span>
                                        </a>
                                    </template>
                                    <div class="dp-i-block v-bottom w-100 p-relative">
                                        <div class="medal-content-head">
                                            <div class="fans-medal-item none-select old-style f-right"
                                                :style="'border-color:#'+(padToHex(item.medal.medal_color_border))">
                                                <div class="fans-medal-label"
                                                    :style="'background-image:linear-gradient(45deg,#'+(padToHex(item.medal.medal_color_start))+',#'+(padToHex(item.medal.medal_color_end))+')'">
                                                    <span class="fans-medal-content">{{item.medal.medal_name}}</span>
                                                </div>
                                                <div class="fans-medal-level"
                                                    :style="'color:#'+(padToHex(item.medal.medal_color_start))">
                                                    {{item.medal.level}}
                                                </div>
                                            </div>
                                            <a :href="'//space.bilibili.com/' + item.medal.target_id" target="blank" @click.stop="" class="name dp-i-block">{{item.anchor_info.nick_name}}</a>
                                        </div>
                                        <div class="medal-content-footer">
                                            <transition enter-active-class="a-scale-in" leave-active-class="a-scale-out"
                                                mode="out-in">
                                                <div class="wear-icon dp-i-block" :key="'wear'"
                                                    v-if="item.medal.medal_id == currentlyWearing.medal.medal_id">
                                                    佩戴中
                                                </div>
                                                <div class="room-icon dp-i-block" :key="'room'"
                                                    v-else-if="item.medal.medal_id == fansMedalInfo.my_fans_medal.medal_id">
                                                    当前房间
                                                </div>
                                                <div class="content-icon dp-i-block" :key="'content'"
                                                    v-else-if="item.medal.medal_id == recentAward.medal.medal_id">
                                                    最近获得
                                                    <!-- {{item.superscript.content}} -->
                                                </div>
                                            </transition>
                                            <span class="text f-right dp-i-block">{{item.medal.today_feed}}/{{item.medal.day_limit}}</span>
                                            <span v-if="false" class="left f-right dp-i-block">{{item.medal.next_intimacy - item.medal.intimacy}}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="progress-level-div">
                                    <span class="dp-i-block level-span">Lv.{{item.medal.level}}</span>
                                    <div class="dp-i-block progress-div">
                                        <span
                                            class="dp-i-block progress-num-span">{{item.medal.intimacy}}/{{item.medal.next_intimacy}}</span>
                                        <div class="dp-i-block progress-div-cover"
                                            :style="'width:'+(item.medal.intimacy / item.medal.next_intimacy * 100) + '%'">
                                            <span class="dp-i-block progress-num-span-cover">
                                                {{item.medal.intimacy}}/{{item.medal.next_intimacy}}
                                            </span>
                                        </div>
                                    </div>
                                    <span class="dp-i-block level-span">Lv.{{item.medal.level + 1}}</span>
                                </div>
                            </div>
                            <div class="medal-loading" key="medal-loading">
                                <template v-if="!pageInfo.isLastPage">
                                    正在加载<i class="v-middle icon-font icon-link-world"></i>
                                </template>
                                <template v-else>
                                    <i class="v-middle icon-font icon-info"></i>没有了
                                </template>
                            </div>
                        </transition-group>
                        <div class="footer-line"></div>
                        <div class="dp-flex medal-wear-footer">
                            <span class="dp-i-block cancel-wear" @click="takeOff">
                                不佩戴勋章
                            </span>
                            <span class="dp-i-block display-config" @click="openConfig">
                                展示设置
                            </span>
                            <a href="https://link.bilibili.com/p/center/index#/user-center/wearing-center/my-medal" target="_blank"
                                class="dp-i-block right-span">
                                装扮中心
                                <span class="dp-i-block icon-font icon-arrow-right arrow-box"></span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `,
    });

}

function spinInit(loadHook, timeout) {
    return new Promise((resolve, reject) => {
        let startTime = Date.now();
        let checkInterval = setInterval(() => {
            if (Date.now() - startTime >= timeout) {
                clearInterval(checkInterval);
                reject("徽章切换增强-无法找到加载点");
            }
            // console.log(`徽章切换增强-正在寻找加载点`);
            let hooked = false;
            for (const prop in loadHook) {
                // console.log(`徽章切换增强-加载点[${prop}]`);
                if (typeof loadHook[prop] === 'function') {
                    hooked = loadHook[prop]();
                    if (hooked) {
                        console.log(`徽章切换增强-加载成功[${prop}]`);
                        clearInterval(checkInterval);
                        resolve();
                        break;
                    }
                }
            }
        }, 300);
    });
}

if (!document.cookie.match(/bili_jct=(\w*); /)) { return; } // 未登录就撤

spinInit({
    ">0.0.1": function () {  // 旧版锚点
        let bottomBox = document.querySelector(".bottom-actions");
        if (bottomBox) {
            // 列表元素
            let tempElement = document.createElement("div");
            tempElement.id = "medel_switch_box";
            bottomBox.after(tempElement);
            // 旧版适用的插件粉丝牌框框CSS
            GM_addStyle(".dialog-ctnr.medal{bottom:100px;left:-1px}");
            return true;
        }
        return false;
    },
    ">1.2.8": function () {  // B站新版前端（SC和点赞独立大按钮）锚点
        let bottomBox = document.querySelector(".icon-left-part-new");
        if (bottomBox) {
            // 列表元素
            let tempElement = document.createElement("div");
            tempElement.id = "medel_switch_box";
            bottomBox.after(tempElement);
            // 原版的按钮CSS调整
            GM_addStyle(".medalAb .close{display:none}.medal-section:not(.scripted){display:none !important;}.chat-input-ctnr-new .medal-section{padding: 5px !important;}.chat-input-focus .medal-section{display:none !important}");
            GM_addStyle(".dialog-ctnr.medal{bottom:-20px;left:-8px}");  // 插件粉丝牌框框CSS
            return true;
        }
        return false;
    }
}, 7000)
    .then((result) => main());