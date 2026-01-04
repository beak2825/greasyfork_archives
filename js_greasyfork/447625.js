// ==UserScript==
// @name         收集和显示
// @namespace    http://tampermonkey.net/
// @version      2.9
// @author       You
// @include      *youtube.com*
// @include      *cn.noxinfluencer.com*
// @include      *www.amazon.*
// @include      *www.eachshot.com/esa319/account/generate-jwt-token*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @require      https://unpkg.com/@popperjs/core@2.11.6/dist/umd/popper.min.js
// @require      https://unpkg.com/axios/dist/axios.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @description  收集和显示匹配数据
// @downloadURL https://update.greasyfork.org/scripts/447625/%E6%94%B6%E9%9B%86%E5%92%8C%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/447625/%E6%94%B6%E9%9B%86%E5%92%8C%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var related_data = null,
        social_id = null,
        parseDataId = null,
        getRelatedDataId = null,
        parseNoxinfluencerDataId = null,
        parseAmazonShopDataId = null,
        currentPageUrl = removeURLParameters(window.location.href),
        linkJumpMap = {},
        parse_data = null,
        other_links = [''],
        remarkVal = '',
        reload = false,
        parse_field_name_map = {
            info_url: '链接',
            social_number: '邮箱',
            about_tag_val: '备注',
            link_list: '其他平台',
            location: '位置',
            creator: '上传者',
            unique_id: '社交id',
            platform: '平台',
            subscribers: '订阅者',
            search_text: '搜索文本',
            nickname: '昵称',
            summary: '简介',
            tags: '标签'
        };

    // 创建全屏遮罩+弹窗
    function showLoading() {
        // 遮罩层
        const overlay = document.createElement('div');
        overlay.id = 'custom-overlay';
        Object.assign(overlay.style, {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: '9999',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        });

        // 弹窗
        const modal = document.createElement('div');
        modal.id = 'custom-alert';
        modal.innerHTML = `
            <div style="
                background: #fff;
                padding: 30px;
                border-radius: 12px;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                max-width: 100%;
                animation: fadeIn 0.3s ease;
            ">
                <div style="
                    font-size: 24px;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 10px;
                ">请稍等...</div>
                <div style="
                    font-size: 18px;
                    color: #555;
                ">正在提交数据中</div>
                <div class="spinner" style="
                    margin: 20px auto 0;
                    width: 50px;
                    height: 50px;
                    border: 5px solid #ccc;
                    border-top: 5px solid #3498db;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                "></div>
            </div>
            <style>
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            </style>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        return overlay;
    }

    function hideLoading(overlay) {
        if (overlay) {
            overlay.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => overlay.remove(), 300);
        }
    }

    function removeURLParameters(url) {
        let obj = new URL(url);
        return obj.origin + obj.pathname;
    }

    var requestUrl = 'https://www.eachshot.com/contact/tampermonkey-contact-api/',
        token = GM_getValue('token') || '',
        creator = GM_getValue('creator') || '',
        automaticRequest = GM_getValue('automaticRequest') || 'true';

    const policy = trustedTypes.createPolicy('default', {
        createHTML: (html) => html
    });

    function jumpStore4x() {
        window.location.href = "https://www.eachshot.com/esa319/account/generate-jwt-token/?next=" + window.location.href;
    }

    // 创建并插入模态框
    var modalHTML = policy.createHTML(`
        <div id="exampleModal" class="modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background-color:rgba(0,0,0,0.5); z-index:99999;">
            <div class="modal-dialog" style="position:relative; margin:auto; top:20%; background-color:#fff; width:50%; padding:20px; border-radius:8px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
                <div class="modal-header" style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #ddd; padding-bottom:10px;">
                    <h5 class="modal-title" style="margin:0; font-size:18px; font-weight:bold;">设置</h5>
                    <button type="button" id="closeModal" style="background:none; border:none; font-size:20px; color:#666; cursor:pointer;">&times;</button>
                </div>
                <div class="modal-body" style="padding-top:10px;">
                    <!-- 登录状态 -->
                    <div id="loginStatus" style="text-align:center; padding:10px; margin-bottom:15px; font-size:16px; font-weight:bold; border-radius:6px;">
                    </div>

                    <form>
                        <div class="mb-3">
                            <label for="automaticRequest" class="col-form-label" style="display:block; font-weight:500;">自动获取匹配数据</label>
                            <input type="checkbox" id="automaticRequest" ${automaticRequest === 'true' ? 'checked' : ''} style="margin-top:4px;">
                        </div>
                    </form>
                </div><br />
                <div class="modal-footer" style="display:flex; justify-content:space-between; border-top:1px solid #ddd; padding-top:10px;">
                    <button type="button" id="logoutButton" style="display:none; padding:8px 16px; background-color:#dc3545; color:white; border:none; border-radius:6px; cursor:pointer;">注销</button>
                    <button type="button" id="loginButton" style="display:none; padding:8px 16px; background-color:#28a745; color:white; border:none; border-radius:6px; cursor:pointer;">登录</button>
                    
                    <div style="flex-grow:1;"></div> <!-- 占位，推到右侧 -->
                    <button type="button" id="closeModalFooter" style="margin-right:8px; padding:8px 16px; background-color:#6c757d; color:white; border:none; border-radius:6px; cursor:pointer;">关闭</button>
                    <button type="button" id="saveParamsToLocalStorage" style="padding:8px 16px; background-color:#007bff; color:white; border:none; border-radius:6px; cursor:pointer;">保存</button>
                </div>
            </div>
        </div>
    `);

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 设置登录状态 UI
    function updateLoginStatus() {
        var loginStatus = document.getElementById('loginStatus');
        var logoutButton = document.getElementById('logoutButton');
        var loginButton = document.getElementById('loginButton');

        if (token) {
            loginStatus.innerHTML = `✅ <span style="color:green;">${creator}已登录</span>`;
            loginStatus.style.backgroundColor = '#d4edda'; // 绿色背景
            loginStatus.style.color = '#155724'; // 深绿色字体
            loginStatus.style.border = '1px solid #c3e6cb';

            logoutButton.style.display = 'inline-block';
            loginButton.style.display = 'none';
        } else {
            loginStatus.innerHTML = `❌ <span style="color:red;">未登录</span>`;
            loginStatus.style.backgroundColor = '#f8d7da'; // 红色背景
            loginStatus.style.color = '#721c24'; // 深红色字体
            loginStatus.style.border = '1px solid #f5c6cb';

            logoutButton.style.display = 'none';
            loginButton.style.display = 'inline-block';
        }
    }

    // 监听注销按钮
    document.getElementById('logoutButton').addEventListener('click', function () {
        GM_deleteValue('token');
        token = '';
        updateLoginStatus();
    });

    // 监听登录按钮（这里可以替换为你的登录逻辑）
    document.getElementById('loginButton').addEventListener('click', function () {
        jumpStore4x()
    });
    updateLoginStatus();

    // 监听保存按钮的点击事件
    document.getElementById('saveParamsToLocalStorage').addEventListener('click', function() {
        automaticRequest = document.getElementById('automaticRequest').checked;
        GM_setValue('automaticRequest', String(automaticRequest));
        location.reload();
    });

    // 监听关闭按钮的点击事件
    document.getElementById('closeModal').addEventListener('click', function() {
        document.getElementById('exampleModal').style.display = 'none';
    });

    document.getElementById('closeModalFooter').addEventListener('click', function() {
        document.getElementById('exampleModal').style.display = 'none';
    });

    if(!token && !currentPageUrl.includes('esa319/account/generate-jwt-token')) {
        jumpStore4x()
    }
    function parseSaveToken() {
        clearInterval(parseTokenIntervalId);
        const preElement = document.querySelector('pre');
        const jsonContent = preElement ? preElement.textContent : null;
        if (jsonContent) {
            try {
                const parsedData = JSON.parse(jsonContent);
                const nextUrl = parsedData.next_url;
                const token = parsedData.token;
                const creator = parsedData.creator;
                if(token) {
                    GM_setValue('token', token);
                }
                if(creator) {
                    GM_setValue('creator', creator);
                }
                if(nextUrl) {
                    window.location.href = nextUrl
                }
            } catch (error) {
                console.error('Failed to parse JSON:', error);
            }
        } else {
            console.log('获取token失败')
        }
    }
    var parseTokenIntervalId = null
    function parseSaveTokenInterval() {
        clearInterval(parseTokenIntervalId);
        var parseTokenIntervalId = setInterval(function() {
            parseSaveToken()
        }, 2000)
    }
    // 创建悬浮按钮
    const suspensionButton = document.createElement('button');
    function showSuspensionButton() {
        suspensionButton.textContent = '📊 加载';
        Object.assign(suspensionButton.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '12px 25px',
            backgroundColor: '#4caf50',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: '0 8px 15px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            zIndex: '9999'
        });
    }
    
    suspensionButton.addEventListener('mouseover', () => {
        suspensionButton.style.transform = 'scale(1.1)';
        suspensionButton.style.backgroundColor = '#45a049';
    });
    suspensionButton.addEventListener('mouseout', () => {
        suspensionButton.style.transform = 'scale(1)';
        suspensionButton.style.backgroundColor = '#4caf50';
    });
    document.body.appendChild(suspensionButton);


    // 创建弹出层
    const popperDiv = document.createElement('div');
    Object.assign(popperDiv.style, {
        display: 'none',
        width: '700px',
        padding: '20px',
        maxHeight: '80vh',
        overflowY: 'auto',
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '10px',
        boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
        opacity: '0',
        transform: 'translateY(10px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        zIndex: '10000'
    });

    function clearPopperDiv() {
        while (popperDiv.firstChild) {
            popperDiv.removeChild(popperDiv.firstChild);
        }
    }

    function displayLoading(){
        clearPopperDiv()
        const loadingText = document.createElement('p');
        loadingText.textContent = '📡 关联数据请求中...';
        loadingText.style.textAlign = 'center';
        popperDiv.appendChild(loadingText);

    }

    document.body.appendChild(popperDiv);

    // Popper.js 处理弹窗位置
    const popperInstance = Popper.createPopper(suspensionButton, popperDiv, {
        placement: 'top-end',
        modifiers: [{ name: 'offset', options: { offset: [0, 10] } }]
    });

    // 展开/收起逻辑 + 动画
    suspensionButton.addEventListener('click', function(event) {
        event.stopPropagation();
        event.preventDefault();
        if (popperDiv.style.display === 'block') {
            suspensionButton.textContent = '📊 加载';
            popperDiv.style.opacity = '0';
            popperDiv.style.transform = 'translateY(10px)';
            setTimeout(() => (popperDiv.style.display = 'none'), 300);
        } else {
            suspensionButton.textContent = '📊 收起';
            popperDiv.style.display = 'block';
            setTimeout(() => {
                popperDiv.style.opacity = '1';
                popperDiv.style.transform = 'translateY(0)';
                popperInstance.update();
            }, 10);
            if(currentPageUrl.includes('https://www.youtube.com') && social_id && automaticRequest === 'false') {
                requestRelatedData('youtube')
            }
            if(currentPageUrl.includes('https://www.amazon') && social_id && automaticRequest === 'false') {
                requestRelatedData('')
            }
        }
    });

    function startParseYouTuBeInterval() {
        clearInterval(parseDataId);
        console.log('启动解析YouTube定时器')
        parseDataId = setInterval(function() {
            var aboutEmailDom = document.querySelector('td #email');
            var aboutEmailVal = null;
            if(aboutEmailDom) {
                aboutEmailVal = aboutEmailDom.textContent.replace(/\s+/g, "");
            }
            var descriptionContainers = document.querySelectorAll("#description-container"),
                lastDescriptionContainer = descriptionContainers[descriptionContainers.length - 1];

            var spanElement = lastDescriptionContainer ? lastDescriptionContainer.querySelector("span"): null;
            // 简介
            var summaryContent = spanElement ? spanElement.textContent: null;
            if(summaryContent) {
                var emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
                var matchedEmail = emailPattern.exec(summaryContent);
                if(matchedEmail) {
                    aboutEmailDom = lastDescriptionContainer
                    //尝试从简介匹配提取邮箱
                    aboutEmailVal = matchedEmail[0]
                }
            }
            var uPattern = /^https:\/\/www.youtube.com.*/;
            if(!uPattern.test(currentPageUrl)) return false;
            var abountTagDom = document.querySelector('#collectAbountTag'),
                aboutTagVal = null,
                link_list = [];
            if(abountTagDom) {
                aboutTagVal = abountTagDom.value
            }
            //if(!aboutEmailVal) return false;
            const containers = document.querySelectorAll('#link-list-container');
            const lastContainer = containers[containers.length - 1]; // 获取最后一个容器
            const links = lastContainer ? lastContainer.querySelectorAll('a') : [];

            links.forEach(function(el) {
                // 找到el的父节点的父节点
                var container = el.closest(".ytChannelExternalLinkViewModelContainer");
                var modelTitle = container.querySelector(
                    ".ytChannelExternalLinkViewModelTitle"
                )
                var platform = modelTitle ? modelTitle.textContent.trim(): null
                link_list.push({platform: platform, url: el.textContent.replace(/\s+/g, "") || el.href})
                linkJumpMap[platform] = el.href
            });
            var location = '';
            var icons = document.querySelectorAll('yt-icon[icon="privacy_public"]'),
                locationEl = icons && icons[0] ? icons[icons.length - 1].closest('tr').querySelectorAll('td')[1]: null;
            if(locationEl && locationEl.textContent) {
                location = locationEl.textContent.trim();
            }

            var subscribers = '',
                subscribers_icons = document.querySelectorAll('yt-icon[icon="person_radar"]'),
                subscribersEl = subscribers_icons && subscribers_icons[0] ? subscribers_icons[icons.length - 1].closest('tr').querySelectorAll('td')[1]: null;
            if(subscribersEl && subscribersEl.textContent) {
                subscribers = subscribersEl.textContent.trim();
            }
            var new_parse_data = {
                info_url: currentPageUrl,
                social_number: aboutEmailVal,
                link_list: link_list,
                location: location,
                subscribers: subscribers,
                creator: creator,
                unique_id: social_id,
                platform: 'youtube'
            };
            if(JSON.stringify(new_parse_data) != JSON.stringify(parse_data)) {
                parse_data = JSON.parse(JSON.stringify(new_parse_data))
                revealData("POST_SOCIAL_MEDIA")
            }else{
                parse_data = JSON.parse(JSON.stringify(new_parse_data))
            }
            if(parse_data.social_number) {
                clearInterval(parseDataId);
            }
        }, 2500);
    }

    function resetParams() {
        other_links = ['']
        related_data = null
        parse_data = null
    }

    var headers = {
        'Authorization': 'Bearer ' + token
    }

    function requestRelatedData(platform) {
        const action = "QUERY_SOCIAL_MEDIA";
        const extra_data = {
            unique_id: social_id,
            platform: platform,
            info_url: currentPageUrl
        };
        const params = {
            action: action,
        };
        var postData = Object.assign({}, params, extra_data);
        setTimeout(() => {
            popperDiv.style.opacity = '1';
            popperDiv.style.transform = 'translateY(0)';
            popperInstance.update();
        }, 10);
        displayLoading()
        axios.get(requestUrl, {params: postData, headers: headers})
        .then(response => {
            var response_data = response.data
            console.log(response_data)
            if(response_data.status === 'success') {
                related_data = response_data.result.mediaData
                remarkVal = related_data.remark
            }else{
                if(response_data.error_message === 'ExpiredSignature') {
                    GM_deleteValue('token', '')
                    location.reload();
                }
            }
            revealData("POST_SOCIAL_MEDIA")
        })
        .catch(error => {
            console.log('获取相关数据异常:' + error);

        });
    }

    function startGetYouTuBeRelatedInterval() {
        clearInterval(getRelatedDataId);
        console.log('启动获取关联数据定时器...')
        var getRelatedDataId = setInterval(function() {
            var pageManagerDom = document.getElementById('page-manager')
            if(!pageManagerDom) {
                clearInterval(parseDataId);
                return false
            }
            var metaContainer = pageManagerDom.querySelector(
                "yt-content-metadata-view-model.yt-page-header-view-model__page-header-content-metadata.yt-content-metadata-view-model--inline.yt-content-metadata-view-model--medium-text"
            );

            var new_social_id = Array.from(
                metaContainer.querySelectorAll("span.yt-core-attributed-string--link-inherit-color")
            )
            .map(el => el.textContent.trim())
            .find(text => text.startsWith("@"));
            currentPageUrl = window.location.href
            console.log(new_social_id)
            if (new_social_id && new_social_id.startsWith('@')) {
                new_social_id = new_social_id.slice(1);
            }
            if(!new_social_id) {
                resetParams()
                reload = true
                console.log('结束.' + parseDataId)
                clearInterval(parseDataId);
                revealData()
                return
            }
            if(
                (!social_id && new_social_id) ||
                (social_id && new_social_id && social_id != new_social_id) ||
                (social_id === new_social_id && reload)
            ) {
                if(!social_id && automaticRequest === 'true') {suspensionButton.click()}
                resetParams()
                reload = false
                social_id = new_social_id
                console.log('重置')
                startParseYouTuBeInterval()
                setTimeout(() => {
                    const openSummaryButton = document.querySelector('.yt-truncated-text__absolute-button');
                    if (openSummaryButton) {
                        openSummaryButton.click();
                        console.log('按钮已点击:', new Date().toLocaleTimeString());
                    } else {
                        console.log('未找到按钮:', new Date().toLocaleTimeString());
                    }
                }, 500);
                if(automaticRequest === 'true') {
                    requestRelatedData('youtube')
                }
            }
        }, 2000)
    }

    function submitCollectData(postData) {
        const submitModal = showLoading('正在提交数据...');
        const params = new URLSearchParams();
        for (const key in postData) {
            params.append(key, postData[key]);
        }
        axios.post(requestUrl, params, {headers: headers})
            .then(function(response) {
                console.log(response.data)
                if(response.data.status === 'success') {
                    var response_data = response.data
                    var jump_link = 'https://www.eachshot.com/esa319/contact/socialmediadata/'
                    if(currentPageUrl.includes('youtube.com')) {
                        var mediaData = response_data.result.mediaData || {}
                        var related_id = mediaData.related_id
                        jump_link += related_id ? '?related_id=' + related_id: '?q=' + social_id
                    }else if(currentPageUrl.includes('noxinfluencer.com')) {
                        jump_link += '?source=noxinfluencer'
                    }else if(currentPageUrl.includes('https://www.amazon')) {
                        var related_id = response_data.result.related_id
                        jump_link += related_id ? '?related_id=' + related_id: '?source=amazon_shop'
                    }
                    const collectModal = document.createElement('div');
                    collectModal.innerHTML = `
                        <div style="
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100vw;
                            height: 100vh;
                            background: rgba(0, 0, 0, 0.5); /* 半透明背景 */
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            z-index: 10000;
                        ">
                            <div style="
                                background: white;
                                padding: 30px;
                                border-radius: 10px;
                                text-align: center;
                            ">
                                <p style="font-size: 20px;">数据收集成功！🎉
                                <a href="${jump_link}" target="_blank" style="color: #0000FF;">点击跳转到后台查看</a></p>
                                <button id="collectModalBtn" style="
                                    padding: 10px 20px;
                                    background-color: #007BFF;
                                    color: white;
                                    border: none;
                                    border-radius: 5px;
                                    cursor: pointer;
                                ">确定</button>
                            </div>
                        </div>
                    `;
                    document.body.appendChild(collectModal);
                    document.getElementById('collectModalBtn').addEventListener('click', () => {
                        collectModal.remove();
                    });
                }else{
                    if(response.data.error_message === 'ExpiredSignature') {
                        GM_deleteValue('token', '')
                        location.reload();
                    }
                    alert(response.data.error_message);
                }
                hideLoading(submitModal);
            })
            .catch(function(error) {
                console.error('发送数据失败:', error);
                alert('发送数据失败！');
                hideLoading(submitModal);
            });
    }

    // 数据加载
    function revealData(collectAction) {
        // 清空加载中的提示并插入数据
        clearPopperDiv()

        // 右上角 X 按钮
        const closeButtonTop = document.createElement('button');
        closeButtonTop.textContent = '×';
        Object.assign(closeButtonTop.style, {
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            color: '#666',
            cursor: 'pointer'
        });
        closeButtonTop.addEventListener('click', (event) => {
            popperDiv.style.display = 'none';
            event.stopPropagation();
            event.preventDefault();
        });
        popperDiv.appendChild(closeButtonTop);
        popperDiv.appendChild(document.createElement('br'));

        if(related_data) {
            const relatedDiv = document.createElement('div');
            Object.assign(relatedDiv.style, {
                'background-color': '#daffd7',
            });
            const title = document.createElement('h2');
            title.textContent = '系统匹配数据';
            title.style.textAlign = 'center';
            title.style.color = '#333';
            title.style.marginBottom = '15px';
            relatedDiv.appendChild(title);

            const ul = document.createElement('ul');
            ul.style.listStyle = 'none';
            ul.style.padding = '0';
            ul.style.margin = '0';

            const li = document.createElement('li');
            li.style.padding = '8px';
            li.style.borderBottom = '1px solid #eee';

            const b = document.createElement('b');
            b.textContent = '邮箱:\u2003'

            const email_b_dom = document.createElement('b');
            email_b_dom.textContent = related_data.social_number
            email_b_dom.style.color = 'green';
            li.appendChild(b);
            li.appendChild(email_b_dom);
            ul.appendChild(li);

            if(related_data.link_list) {
                const li = document.createElement('li');
                li.style.padding = '8px';
                li.style.borderBottom = '1px solid #eee';
                const b = document.createElement('b');
                b.textContent = '相关链接:\u2003';
                li.appendChild(b);
                ul.appendChild(li);
                related_data.link_list.forEach(function(item) {
                    var platform = item.platform,
                        url = item.url;
                    if(url) {
                        const li = document.createElement('li');
                        li.style.padding = '8px';
                        li.style.borderBottom = '1px solid #eee';

                        const b = document.createElement('b');
                        b.textContent = '\u2003\u2003' + (platform || url) + ':\u2003';

                        const a = document.createElement('a');
                        a.href = 'https://' + (linkJumpMap[platform] || url)
                        a.target = '_blank'
                        a.textContent = url;

                        li.appendChild(b);
                        li.appendChild(a);
                        ul.appendChild(li);
                    }
                })
            }
            relatedDiv.appendChild(ul);
            popperDiv.appendChild(relatedDiv);
            popperInstance.update();
        }else{
            console.log(related_data)
            const relatedDiv = document.createElement('div');
            Object.assign(relatedDiv.style, {
                'background-color': 'rgb(255 207 207)',
            });
            const title = document.createElement('h2');
            title.textContent = '没有匹配数据';
            title.style.textAlign = 'center';
            title.style.color = '#333';
            title.style.marginBottom = '15px';
            relatedDiv.appendChild(title);
            popperDiv.appendChild(relatedDiv);
        }

        if(parse_data) {
            const br_dom = document.createElement('br');
            popperDiv.appendChild(br_dom);
            popperDiv.appendChild(br_dom);

            const title = document.createElement('h2');
            title.textContent = '当前网站解析的数据';
            title.style.textAlign = 'center';
            title.style.color = '#333';
            title.style.marginBottom = '15px';
            popperDiv.appendChild(title);

            const ul = document.createElement('ul');
            ul.style.listStyle = 'none';
            ul.style.padding = '0';
            ul.style.margin = '0';
            for(var key in parse_data) {
                if(['link_list', 'tags'].indexOf(key) === -1 && parse_data[key]) {
                    const li = document.createElement('li');
                    li.style.padding = '8px';
                    li.style.borderBottom = '1px solid #eee';

                    const b = document.createElement('b');
                    b.textContent = parse_field_name_map[key] + ':\u2003';

                    const span = document.createElement('span');
                    span.textContent = parse_data[key];

                    li.appendChild(b);
                    li.appendChild(span);
                    ul.appendChild(li);
                }
            }
            if(parse_data['tags']) {
                const li = document.createElement('li');
                li.style.padding = '8px';
                li.style.borderBottom = '1px solid #eee';

                const b = document.createElement('b');
                b.textContent = 'tags:\u2003';

                const tag_div = document.createElement('div');
                var tagsText = '';
                for(var key in parse_data['tags']) {
                    const tag_p = document.createElement('p');
                    tag_p.textContent = key + ':\u2003' + parse_data['tags'][key];
                    tag_div.appendChild(tag_p);
                }
                li.appendChild(b);
                li.appendChild(tag_div);
                ul.appendChild(li);

            }

            if(parse_data['link_list']) {
                const li = document.createElement('li');
                li.style.padding = '8px';
                li.style.borderBottom = '1px solid #eee';
                const b = document.createElement('b');
                b.textContent = '其他链接:\u2003';
                li.appendChild(b);
                ul.appendChild(li);
                parse_data['link_list'].forEach(function(item, idx) {
                    if (typeof item === 'object' && item !== null) {
                        var platform = item.platform,
                        url = item.url;
                    }else{
                        var platform = idx + 1,
                        url = item;
                    }
                    const li = document.createElement('li');
                    li.style.padding = '8px';
                    li.style.borderBottom = '1px solid #eee';

                    const b = document.createElement('b');
                    b.textContent = '\u2003\u2003' + (platform || url) + ':\u2003';

                    const a = document.createElement('a');
                    a.href = linkJumpMap[platform] || url
                    a.target = '_blank'
                    a.textContent = url;

                    li.appendChild(b);
                    li.appendChild(a);
                    ul.appendChild(li);
                })
            }
            popperDiv.appendChild(ul);
            const otherLinksContainer = document.createElement('div');
            popperDiv.appendChild(otherLinksContainer);

            function renderOtherLinks() {
                while (otherLinksContainer.firstChild) {
                    otherLinksContainer.removeChild(otherLinksContainer.firstChild);
                }
                other_links.forEach((link, index) => {
                    const linkWrapper = document.createElement('div');
                    linkWrapper.style.display = 'flex';
                    linkWrapper.style.alignItems = 'center';
                    linkWrapper.style.marginBottom = '8px';

                    const linkInput = document.createElement('input');
                    linkInput.type = 'text';
                    linkInput.placeholder = '请输入其他链接';
                    linkInput.style.flex = '1';
                    linkInput.style.padding = '8px';
                    linkInput.style.border = '1px solid #ccc';
                    linkInput.style.borderRadius = '5px';
                    linkInput.value = link

                    linkInput.addEventListener('input', (e) => {
                        other_links[index] = e.target.value;
                    });

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = '删除';
                    deleteButton.style.marginLeft = '10px';
                    deleteButton.style.padding = '8px 16px';
                    deleteButton.style.backgroundColor = '#FF4B5C';
                    deleteButton.style.color = 'white';
                    deleteButton.style.border = 'none';
                    deleteButton.style.borderRadius = '5px';
                    deleteButton.style.cursor = 'pointer';

                    deleteButton.addEventListener('click', () => {
                        other_links.splice(index, 1);
                        renderOtherLinks(); // 重新渲染列表
                    });

                    linkWrapper.appendChild(linkInput);
                    linkWrapper.appendChild(deleteButton);
                    otherLinksContainer.appendChild(linkWrapper);
                });
            }

            // 添加其他链接按钮
            const addLinkButton = document.createElement('button');
            addLinkButton.textContent = '添加一行其他链接';
            addLinkButton.style.marginBottom = '15px';
            addLinkButton.style.padding = '8px 16px';
            addLinkButton.style.backgroundColor = '#007BFF';
            addLinkButton.style.color = 'white';
            addLinkButton.style.border = 'none';
            addLinkButton.style.borderRadius = '5px';
            addLinkButton.style.cursor = 'pointer';

            addLinkButton.addEventListener('click', (event) => {
                event.stopPropagation();
                event.preventDefault();
                other_links.push('');
                renderOtherLinks();
            });
            popperDiv.appendChild(addLinkButton);

            // 初次渲染其他链接
            renderOtherLinks();

            const remarkLabel = document.createElement('label');
            remarkLabel.textContent = '备注:';
            remarkLabel.style.display = 'block';
            remarkLabel.style.margin = '15px 0 5px';
            remarkLabel.style.fontWeight = 'bold';

            const remarkInput = document.createElement('textarea');
            remarkInput.placeholder = '请输入备注...';
            remarkInput.value = remarkVal;
            remarkInput.style.width = '97%';
            remarkInput.style.padding = '10px';
            remarkInput.style.border = '1px solid #ccc';
            remarkInput.style.borderRadius = '5px';
            remarkInput.style.marginBottom = '15px';
            remarkInput.addEventListener('input', (e) => {
                remarkVal = e.target.value;
            });

            popperDiv.appendChild(remarkLabel);
            popperDiv.appendChild(remarkInput);

            const collectButton = document.createElement('button');
            collectButton.textContent = '收集数据';
            collectButton.style.display = 'block';
            collectButton.style.margin = '15px auto';
            collectButton.style.padding = '10px 20px';
            collectButton.style.backgroundColor = '#4caf50';
            collectButton.style.color = 'white';
            collectButton.style.border = 'none';
            collectButton.style.borderRadius = '5px';
            collectButton.style.cursor = 'pointer';

            collectButton.addEventListener('click', function(event) {
                event.stopPropagation();
                event.preventDefault();
                var extra_data = JSON.parse(JSON.stringify(parse_data))
                extra_data.remark = remarkInput.value;
                other_links = other_links.filter(Boolean);
                if(other_links.length > 0) {
                    extra_data.other_links = JSON.stringify(other_links)
                }
                extra_data.link_list = JSON.stringify(extra_data.link_list)
                if(Object.keys(extra_data.tags || {}).length > 0) {
                    extra_data.tags = JSON.stringify(extra_data.tags)
                }
                const action = collectAction;
                const params = {
                    action: action,
                };
                var postData = Object.assign({}, params, extra_data);
                submitCollectData(postData)
            });
            popperDiv.appendChild(collectButton);
            popperInstance.update();
        }

        if(!related_data && !parse_data) {
            const title = document.createElement('h3');
            title.textContent = '未获取及解析到数据';
            title.style.textAlign = 'center';
            title.style.color = '#333';
            title.style.marginBottom = '15px';
            popperDiv.appendChild(title);
        }

        const initialParamsButton = document.createElement('button');
        initialParamsButton.textContent = '设置';
        Object.assign(initialParamsButton.style, {
            float: 'left',
            padding: '8px 16px',
            backgroundColor: '#878787',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
        });
        initialParamsButton.addEventListener('click', () => {
            document.getElementById('exampleModal').style.display = 'block';
        });

        // 右下角 关闭 按钮
        const closeButtonBottom = document.createElement('button');
        closeButtonBottom.textContent = '关闭';
        Object.assign(closeButtonBottom.style, {
            float: 'right',
            padding: '8px 16px',
            backgroundColor: '#dbdbdb',
            color: 'black',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            zIndex: '100000'
        });
        closeButtonBottom.addEventListener('click', (event) => {
            popperDiv.style.display = 'none';
            event.stopPropagation();
            event.preventDefault();
        });

        popperDiv.appendChild(closeButtonBottom);
        popperDiv.appendChild(initialParamsButton);
    }

    var firstClickShowSuspension = true

    //解析聚星tiktok商品关联网红
    function parseNoxinfluencerGoodsRelated() {
        var elements = document.querySelectorAll('.data-title-wrap');
        var isContinue = false
        elements.forEach(function(el) {
            var text = el.textContent || el.innerText;
            if (text.indexOf('关联网红列表') !== -1) {
                isContinue = true
            }
        });
        console.log(isContinue ? '找到关联网红列表': '未找到关联网红列表')
        if(!isContinue) {
            return false
        }

        var link_list = []
        document.querySelectorAll('.data-title-wrap').forEach(function (titleWrap) {
            var p = titleWrap.querySelector('.data-title');
            if (p && p.textContent.indexOf('关联网红列表') !== -1) {
                var dataFlex = titleWrap.parentNode.querySelector('.data-flex');
                if (!dataFlex) return;
        
                var table = dataFlex.querySelector('.el-table__body');
                if (!table) return;
        
                table.querySelectorAll('tr').forEach(function (tr) {
                    var aliasEl = tr.querySelector('.influencer-alias');
                    if (aliasEl && aliasEl.textContent.trim()) {
                        link_list.push('https://www.tiktok.com/' + aliasEl.textContent.trim())
                    }
                });
            }
        });
        if(link_list.length === 0) {
            return false
        }
        var tags = {}

        var el = document.querySelector('.product-title.ellipsis-line-2');
        if (el && el.textContent.trim()) {
            tags['goods_name'] = el.textContent.trim()
        }

        var el = document.querySelector('.shop-title');
        if (el && el.textContent.trim()) {
            tags['shop_name'] = el.textContent.trim()
        }
        console.log(tags)

        parse_data = {
            link_list: link_list,
            tags: tags,
            creator: creator,
        }
        if(firstClickShowSuspension) {
            suspensionButton.click()
            firstClickShowSuspension = false
        }
        revealData("COLLECT_NOXINFLUENCER_SOCIAL_MEDIA")
    }

    function parseNoxinfluencer() {
        parse_data = null
        const keywordItems = document.querySelectorAll('.keywords-item');
        if (!keywordItems) {
            return false;
        }
        const searchText = Array.from(keywordItems)
            .map(item =>
                Array.from(item.childNodes)
                .filter(node => node.nodeType === Node.TEXT_NODE)
                .map(node => node.textContent.trim())
                .filter(text => text.length > 0)
                .join(' ')
            )
            .join(', ');
        console.log('搜索文本:' + searchText)
        if(!searchText) {
            return false
        }

        let titleContainers = document.querySelectorAll('.title-container');
        let socialHrefs = Array.from(titleContainers).map(container => {
            const link = container.querySelector('a.title.ellipsis');
            const alias = container.querySelector('.influencer-alias');
            if (!link || !alias) return null;

            const href = link.getAttribute('href');
            const username = alias.textContent.trim().replace(/^@/, '');

            if (href.includes('/instagram/')) {
                return `https://www.instagram.com/${username}`;
            }
            if (href.includes('/tiktok/')) {
                return `https://www.tiktok.com/@${username}`;
            }
            if (href.includes('/youtube/')) {
                return `https://www.youtube.com/@${username}`;
            }
            return null;
        }).filter(Boolean);

        if(socialHrefs.length > 0) {
            parse_data = {
                link_list: socialHrefs,
                search_text: searchText,
                creator: creator,
            }
            if(firstClickShowSuspension) {
                suspensionButton.click()
                firstClickShowSuspension = false
            }
            revealData("COLLECT_NOXINFLUENCER_SOCIAL_MEDIA")
        }
    }

    function parseNoxinfluencerInterval() {
        clearInterval(parseNoxinfluencerDataId);
        console.log('启动解析聚星数据定时器...')
        var parseNoxinfluencerDataId = setInterval(function() {
            if(currentPageUrl.includes('noxinfluencer.com/tiktok/product/')) {
                parseNoxinfluencerGoodsRelated()
            }else{
                parseNoxinfluencer()
            }
        }, 3000)
    }

    function parseAmazonShop() {
        const nameBdi = document.querySelector("#shop-influencer-profile-name-and-status bdi");
        const descriptionBdi = document.querySelector("#shop-influencer-profile-description-text bdi");
        var nickname = nameBdi ? nameBdi.textContent : null,
            summary = descriptionBdi ? descriptionBdi.textContent : null;
        console.log('nickname:' + nickname)
        if(!nameBdi) {return false}
        if(!social_id && nickname) {
            social_id = nickname
        }
        const multiLinks = document.querySelectorAll('.multi-social-media-group a');
        const multiHrefs = Array.from(multiLinks).map(a => a.href);

        const singleLinks = document.querySelectorAll('.single-social-media-box a');
        const singleHrefs = Array.from(singleLinks).map(a => a.href);
        var hrefs = multiHrefs.concat(singleHrefs)
        parse_data = {
            link_list: hrefs,
            nickname: nickname,
            summary: summary,
            creator: creator,
            info_url: currentPageUrl
        }
        if(firstClickShowSuspension && automaticRequest === 'true') {
            requestRelatedData('')
            suspensionButton.click()
            firstClickShowSuspension = false
        }
        revealData("COLLECT_AMAZON_SHOP_SOCIAL_MEDIA")
    }

    function parseAmazonShopInterval() {
        clearInterval(parseAmazonShopDataId);
        console.log('启动解析Amazon Shop数据定时器...')
        var parseAmazonShopDataId = setInterval(function() {
            parseAmazonShop()
        }, 2000)
    }

    if(currentPageUrl.includes('https://www.youtube.com')) {
        showSuspensionButton()
        startGetYouTuBeRelatedInterval()
    }

    if(currentPageUrl.includes('noxinfluencer.com')) {
        showSuspensionButton()
        parseNoxinfluencerInterval()
    }

    if(
        currentPageUrl.includes('https://www.amazon') && 
        (currentPageUrl.includes('/shop/') || currentPageUrl.includes('/gp/profile/'))
    ) {
        showSuspensionButton()
        parseAmazonShopInterval()
    }
    if(currentPageUrl.includes('esa319/account/generate-jwt-token')) {
        parseSaveTokenInterval()
    }
})();
