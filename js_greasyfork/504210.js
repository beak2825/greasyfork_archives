// ==UserScript==
// @name         KLPBBS Beautify
// @namespace    cinder/@klpbbs-beautify
// @version      1.0.1
// @description  Custom your forum!
// @author       Cinder
// @match        https://klpbbs.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGUAAABlCAYAAABUfC3PAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIySURBVHhe7dq/alNhHIfx33tibFNCJRTUgFpU0EkKjhYFwc3BixDvwEHQS3B18RYE3QQHb0BwEtTBTbt0EFr8Q9s0x8nlBTmvpGmenDwfOMuXLOEhJ7w5SQ8fv6mjwe/vX6IeH+TzRB7dvx7nz/bzWRFR5YNmzyhARgFKJd8ph3u7UdfjfJ7IxtW16K9083kiN6/14szgRD7PnaIo8+LB3VNx5dzJfJ473r6AjAJkFCCjABkFyChARgEyClCrDo/3Nvtx4XTZib6/tJRPGK2KklK+/NuN9fV8wmjV7auu23G1KkpbGAXIKEBGATIKkFGAjAJkFKD07Om7xhP9152dGI2P9o8T/+PiYJBPExuuruYTRnr5/HNjlPdbW7E3GuXzsSH/JDIN3r6AjAJkFCCjABkFyChARgEyClDR4fHj9nbsz+jwmFKKjeEwn1utKMrh34fHM9KpFusDXfRuOylFp6pmdi2axXvHc8AoQEYBMgqQUYCMAmQUIKMAGQXIKEBGATIKkFGAjAJkFCCjABkFyChARc/oV3o/IlWNL9MRKYpya/N1LC//ymdNSVGUO7dfRa/3M581JX6nABkFyChARgEyCpBRgIwCZBSg9OHti8bD4+VLn6Lb3c9nTUk6+PakMYqOl7cvIKMAGQXIKEBGATIKkFGAjAJkFCCjABkFyChARgEyCpBRgIwCZBQgowAZBcgoQEYBMgqQUYCMAmQUIKMAGQXIKEBGATIKkFGAjAL0By5PvveMx5urAAAAAElFTkSuQmCC
// @require      https://fastly.jsdelivr.net/gh/sizzlemctwizzle/GM_config@2207c5c1322ebb56e401f03c2e581719f909762a/gm_config.js
// @connect      raw.githubusercontent.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @license      GPLv3.0
// @downloadURL https://update.greasyfork.org/scripts/504210/KLPBBS%20Beautify.user.js
// @updateURL https://update.greasyfork.org/scripts/504210/KLPBBS%20Beautify.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var GM_config = new GM_configStruct();
  GM_config.init({
    id: 'klpbeautify',
    title: '苦力怕论坛美化',
    fields: {
      bglink: {
        label: '背景图片',
        type: 'text',
        default: 'https://s21.ax1x.com/2024/08/17/pACRtIO.png'
      },
      logolink: {
        label: '网页Logo',
        type: 'text',
        default: 'https://s2.loli.net/2024/08/17/1yoM6X8czTOECet.png'
      },
      skipexternal: {
        label: '跳过外部链接提示',
        type: 'checkbox',
        default: true
      },
      removeAutoplay: {
        label: '移除自动播放',
        type: 'checkbox',
        default: true
    },
      autosign: {
          label: '自动签到',
          type: 'checkbox',
          default: true
      },
      hitokoto: {
          label: '随机一言',
          type: 'checkbox',
          default: true
      },
      hitocolor: {
        label: '一言颜色',
        type: 'text',
        default: '#696793'
      },
      hitocreatorcolor: {
        label: '一言作者颜色',
        type: 'text',
        default: '#937C55'
      },
      nemusic: {
          label: '云音乐',
          type: 'checkbox',
          default: true
      },
      nemusiclink: {
          label: '云音乐外链播放器Html',
          type: 'textarea',
          default: '<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=310 height=430 src="//music.163.com/outchain/player?type=4&id=1000729940&auto=0&height=430"></iframe>'
      },
      jpd2cnd: {
          label: '星期转换为中文写法',
          type: 'checkbox',
          default: true
      },
      removecpt: {
          label: '移除顶部我的帖子及最新回复导航栏',
          type: 'checkbox',
          default: true
      },
      removetop: {
          label: '移除顶部导航栏',
          type: 'checkbox',
          default: true
      },
      removead: {
          label: '移除右边栏广告',
          type: 'checkbox',
          default: true
      },
      removebanner: {
          label: '移除顶部数据栏',
          type: 'checkbox',
          default: true
      },
      removetag: {
          label: '移除右侧标签栏',
          type: 'checkbox',
          default: true
      },
      removerank: {
          label: '移除右侧帖子排行',
          type: 'checkbox',
          default: true
      },
      removenewrep: {
          label: '移除右侧最新回复',
          type: 'checkbox',
          default: true
      },
      removepic: {
          label: '移除版头上部图片',
          type: 'checkbox',
          default: true
      },
      headcolor: {
        label: '顶栏颜色',
        type: 'text',
        default: '#9932CC'
      },
      footcolor: {
        label: '底栏颜色',
        type: 'text',
        default: '#9932CC'
      },
      postcolor: {
        label: '投稿按钮颜色',
        type: 'text',
        default: '#9932CC'
      },
      menucolor: {
        label: '导航按钮颜色',
        type: 'text',
        default: '#C71585'
      },
      signcolor: {
        label: '签到按钮颜色',
        type: 'text',
        default: '#DA70D6'
      },
      listitemcolor: {
        label: '列表按钮颜色',
        type: 'text',
        default: '#FFB6C1'
      },
      newpostcolor: {
        label: '版块新帖数量颜色',
        type: 'text',
        default: '#7B68EE'
      },
      newscolor: {
        label: '消息提醒颜色',
        type: 'text',
        default: '#FF00FF'
      },
      fastrepcolor: {
        label: '右侧快速回复颜色',
        type: 'text',
        default: '#F691B3'
      },
      retlistcolor: {
        label: '右侧返回列表颜色',
        type: 'text',
        default: '#DA70D6'
      },
      rettopcolor: {
        label: '右侧回到顶部颜色',
        type: 'text',
        default: '#9932CC'
      },
      coincolor: {
        label: '评分装饰条配色',
        type: 'text',
        default: '#FFD1D1'
      },
    }
  });
  GM_registerMenuCommand('编辑配置', () => GM_config.open());

    function setBackgroundImage(url) {
    document.body.style.backgroundImage = `url(${url})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    }

    let bglink = GM_config.get('bglink');
    let logolink = GM_config.get('logolink');

    //Auto Sign
    if (GM_config.get('autosign')) {
        var signElement = document.getElementById('midaben_sign');
        if (signElement) {
            var links = signElement.getElementsByTagName('a');
            function matchesLink(link) {
                var href = link.href;
                var regex = /format=button/;
                return regex.test(href);
            }
            for (var i = 0; i < links.length; i++) {
                if (matchesLink(links[i])) {
                    links[i].click();
                    showError("自动签到成功");
                    break;
                } else {
                    console.log('Already signed.');
                }
            }
        }
    }

    if (GM_config.get('skipexternal')) {
        const links = document.querySelectorAll('a.text-decoration-none');
        links.forEach(link => {
            link.click();
            showError("自动跳转链接");
        });
    }

    if (GM_config.get('removeAutoplay')) {
        const audioElements = document.querySelectorAll('audio');
        var count = 0;
        audioElements.forEach(audio => {
            if (audio.hasAttribute('autoplay')) {
                audio.removeAttribute('autoplay');
                count++;
            }
        });
        if (count != 0) {
            showError(`移除了 ${count} 个自动播放`);
        }
    }

    function removeElementsById(id) {
        let elements = document.getElementById(id);
        if(elements) {
            elements.parentNode.removeChild(elements);
        }
    }

    if (GM_config.get('removetop')) {
        removeElementsById('toptb');
    }
    if (GM_config.get('removead')) {
        removeElementsById('diy_ad');
    }
    if (GM_config.get('removead')) {
        removeElementsById('cpt');
    }

    const imageUrl = `${bglink}`;
    setBackgroundImage(imageUrl);

    function changeBackgroundColor(selector, color) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.style.backgroundColor = color;
        });
    }

    changeBackgroundColor('.c_nv', `${GM_config.get('headcolor')}`);
    changeBackgroundColor('.sd_post.z', `${GM_config.get('postcolor')}`);
    changeBackgroundColor('.sd_qmenu', `${GM_config.get('menucolor')}`);
    changeBackgroundColor('.midaben_signpanel.JD_sign', `${GM_config.get('signcolor')}`);
    changeBackgroundColor('.cft', `${GM_config.get('footcolor')}`);
    changeBackgroundColor('.child.fa.fa-eject', `${GM_config.get('rettopcolor')}`);
    changeBackgroundColor('.midaben_signpanel JD_sign visted', `${GM_config.get('signcolor')}`);
    changeBackgroundColor('.cpost', `${GM_config.get('postcolor')}`);
    changeBackgroundColor('.child.fa.fa-outdent', `${GM_config.get('retlistcolor')}`);
    changeBackgroundColor('.psth.xs1', `${GM_config.get('coincolor')}`);
    changeBackgroundColor('.child.fa.fa-comment', `${GM_config.get('fastrepcolor')}`);

    let test = document.querySelectorAll('.psth.xs1');
    console.log(test);

    function changeListItemsBackgroundColor(color) {
        var divs = document.getElementsByClassName('hd');
        for (var i = 0; i < divs.length; i++) {
            var lis = divs[i].getElementsByTagName('li');
            if (lis.length > 0) {
                for (var j = 0; j < lis.length; j++) {
                    lis[j].style.backgroundColor = color;
                }
            }
        }
    }
    changeListItemsBackgroundColor(`${GM_config.get('listitemcolor')}`);

    changeBackgroundColor('.shan', `${GM_config.get('newscolor')}`);
    changeBackgroundColor('.ctodayposts', `${GM_config.get('newpostcolor')}`);

    var maxWidth = 66;
    var maxHeight = 66;

    var newImgUrl = `${logolink}`;

    var imgElement = document.querySelector('img[alt="Minecraft(我的世界)苦力怕论坛"]');

    if (imgElement) {
        imgElement.src = newImgUrl;
        imgElement.style.maxWidth = maxWidth + 'px';
        imgElement.style.maxHeight = maxHeight + 'px';
        imgElement.style.display = 'block';
        imgElement.style.margin = 'auto';
    }

    function removeElementsByClass(className) {
        var elements = document.querySelectorAll(className);
        if (elements) {
            for (let i = elements.length - 1; i >= 0; i--) {
                elements[i].parentNode.removeChild(elements[i]);
            }
        }
    }

    function insertBefore(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode);
    }

    if (GM_config.get('removetag')) {
        removeElementsByClass('.sd_mkes.sd_tag');
    }
    if (GM_config.get('removerank')) {
        removeElementsByClass('.sd_mkes.sd_rank');
    }
    if (GM_config.get('removenewrep')) {
        removeElementsByClass('.sd_mkes.sd_reply.last_btm');
    }
    if (GM_config.get('removepic')) {
        removeElementsByClass('.cbanner');
    }

    var targetContainer = document.getElementsByClassName('sdsd')[0];
    var beforeElement = document.getElementById('midaben_sign');
    var clock = document.getElementsByClassName('chart_sd y')[0];

    var clockContainer = document.createElement('div');
    clockContainer.style.width = '300px';

    if (GM_config.get('jpd2cnd')) {//-------------------------------------------星期转换
        clockContainer.style.height = '185px'
        function replaceWeekdayText() {
            var weekDaysJP = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
            var weekDaysCN = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

            for (var i = 0; i < weekDaysJP.length; i++) {
                var weekdayElement = document.querySelector('.cweek strong span');
                if (weekdayElement.innerText === weekDaysJP[i]) {
                    weekdayElement.innerText = weekDaysCN[i];
                    break;
                }
            }
        }
        replaceWeekdayText();
    } else {
        clockContainer.style.height = '200px'
    }

    if (GM_config.get('removebanner')) {
        removeElementsByClass('.chart_tj.z.cl');
        clock.style.margin = '0px';
        clock.style.paddingLeft = '50px';
        clock.style.paddingRight = '50px';
        clock.style.paddingBottom = '20px';
        if (targetContainer && clock) {
            if (clock.parentNode) {
            clock.parentNode.removeChild(clock);
            }
            clockContainer.appendChild(clock);
            insertBefore(clockContainer, beforeElement);
        }
    }

    if (GM_config.get('hitokoto')) {//--------------------------------------------一言
        var hitokoto = document.createElement('div');
        hitokoto.className = 'sd_mk cl';
        hitokoto.style.height = '100px';
        hitokoto.style.marginBottom= '10px'

        fetch('https://v1.hitokoto.cn/')
            .then(response => response.json())
            .then(data => {
            var hitokotoText = data.hitokoto;
            var creator = data.from_who ? `——${data.from_who}` : '';
            var hitokotoSpan = document.createElement('span');
            hitokotoSpan.textContent = `“${hitokotoText}”`;
            hitokotoSpan.style.color = `${GM_config.get('hitocolor')}`;
            var creatorSpan = document.createElement('span');
            creatorSpan.textContent = creator;
            creatorSpan.style.textAlign = 'right';
            creatorSpan.style.position = 'absolute';
            creatorSpan.style.right = '10px';
            creatorSpan.style.bottom = '10px';
            creatorSpan.style.textAlign = 'right';
            creatorSpan.style.color = `${GM_config.get('hitocreatorcolor')}`;

            hitokoto.appendChild(hitokotoSpan);
            hitokoto.appendChild(creatorSpan);
            hitokoto.style.fontSize = '18px';
            hitokoto.style.position = 'relative';

            insertBefore(hitokoto, beforeElement);
        })
    }

    if (GM_config.get('nemusic')) {//------------------------------------------------网易云音乐
        var musichtml = GM_config.get('nemusiclink');
        var music = `<div>${musichtml}</div>`;
        targetContainer.insertAdjacentHTML('beforeend', music);
    }

    var postbutton = document.getElementsByClassName('sd_mk cl')[0];
    postbutton.style.marginBottom = '10px';
})();