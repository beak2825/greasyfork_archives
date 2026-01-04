// ==UserScript==
// @name         bilibili直播自定义皮肤背景
// @namespace    http://tampermonkey.net/
// @version      2.1.5
// @description  自定义bilibili直播的皮肤和背景，仅自己可见！
// @author       HCLonely
// @include      /^https?:\/\/live.bilibili.com\/(blanc\/)?[\d]+/
// @run-at       document-end
// @connect      api.live.bilibili.com
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.0/dist/jquery.min.js
// @homepage     https://blog.hclonely.com/posts/578f9be7/
// @supportURL   https://blog.hclonely.com/posts/578f9be7/
// @downloadURL https://update.greasyfork.org/scripts/387120/bilibili%E7%9B%B4%E6%92%AD%E8%87%AA%E5%AE%9A%E4%B9%89%E7%9A%AE%E8%82%A4%E8%83%8C%E6%99%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/387120/bilibili%E7%9B%B4%E6%92%AD%E8%87%AA%E5%AE%9A%E4%B9%89%E7%9A%AE%E8%82%A4%E8%83%8C%E6%99%AF.meta.js
// ==/UserScript==

(function () {
  'use strict';

  //$('#live-player-ctnr>div').html('test')
  const skinConfig = Object.prototype.toString.call(GM_getValue('skinConfig')) === "[object Object]" ? GM_getValue('skinConfig') : {0: { id: 0, skin_name: '默认' }}
  let selectedSkin = GM_getValue('selectedSkin') || 0
  let customedBgimg = GM_getValue('customedBgimg') || 0
  let selectedSkinConfig = {}
  if (selectedSkin !== 0 && skinConfig[selectedSkin]) {
    selectedSkinConfig = preProcessing(skinConfig[selectedSkin].skin_config)
    generateStyle()
  }
  if (customedBgimg) {
    changeBackgroundImage(customedBgimg)
  }

  const init = setInterval(() => {
    if ($('.icon-left-part').length > 0) {
      clearInterval(init)
      // const iconLocation = ($('.control-panel-icon-row .icon-item').length + 1) * 23
      $('#skin-css').remove()
      $('.icon-left-part').after(`<span id="skin-setting-icon" class="icon-item danmu-block-icon live-skin-main-text skin-custom"><svg t="1626699361302" class="skin-custom icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1333" width="22" height="22"><title class="skin-custom">自定义皮肤</title><path d="M940.672 267.904l-138.304-150.272a89.216 89.216 0 0 0-65.92-29.632h-34.88c-31.36 0-59.52 16.512-77.248 45.376-23.168 36.992-65.6 59.072-113.664 59.072-45.888 0-88.96-22.144-112.896-57.92a84.736 84.736 0 0 0-75.328-46.528h-30.208c-29.568 0-52.992 10.176-69.76 30.208L83.2 268.16l-0.128 0.128A98.24 98.24 0 0 0 56.96 334.976a94.08 94.08 0 0 0 26.304 66.048l80.768 87.68c16.128 17.536 39.424 27.968 62.208 27.968h2.432v347.008c0 39.936 31.232 72.384 69.504 72.384h427.52c38.336 0 69.504-32.448 69.504-72.384V516.672h2.496c23.424 0 45.504-9.984 62.144-28.032l81.088-88c16.768-18.176 26.048-41.984 25.984-66.688a94.08 94.08 0 0 0-26.304-66.048z m-52.672 83.904l-81.024 88.064c-4.416 4.8-8 4.8-9.216 4.8a14.784 14.784 0 0 1-9.216-4.8 36.992 36.992 0 0 0-26.88-11.648 38.464 38.464 0 0 0-38.4 38.592V864H300.8V466.816c0-21.248-17.152-38.464-38.4-38.592a37.056 37.056 0 0 0-26.88 11.712 14.848 14.848 0 0 1-9.216 4.736 14.912 14.912 0 0 1-9.216-4.8L136 351.872l-0.832-0.832c-8.512-8.704-8.128-24.192 0.768-33.92l139.776-150.272 1.152-1.28 1.024-1.28c1.28-1.6 3.968-4.224 14.336-4.224h30.208a12.672 12.672 0 0 1 11.2 7.36 36.928 36.928 0 0 0 2.432 4.416l0.128 0.128A200.32 200.32 0 0 0 408.96 238.848a213.44 213.44 0 0 0 101.632 25.6c35.84 0 70.976-8.576 101.44-24.96a194.432 194.432 0 0 0 73.344-68.096l0.128-0.256c6.848-11.136 13.76-11.136 16-11.136h34.944a17.024 17.024 0 0 1 12.48 6.016l139.008 151.04 0.768 0.768c8.576 8.704 8.256 24.32-0.768 33.984zM398.016 443.008h120c5.312 0 8 2.688 8 8v153.984c0 5.312-2.688 8-8 8H398.016c-5.376 0-8-2.688-8-8V451.008c0-5.312 2.624-8 8-8z" p-id="1334"></path></svg></span>`)

      $('#skin-setting-icon').click(() => {
        if ($('#skin-setting-div').length > 0) {
          $('#skin-setting-div').hide('fast', () => { $('#skin-setting-div').remove() })
        } else {
          let html = ''
          for (const config of Object.values(skinConfig)) {
            if(config.id < 0){
              html = `<li class="item skin-custom" data-id="${config.id}"${config.id === selectedSkin ? ' id="skin-selected"' : ''}>
                <span class="skin-custom cb-icon svg-icon v-middle p-absolute${config.id === selectedSkin ? ' checkbox-selected' : ' checkbox-default'}"></span>
                <input id="skin-${config.id}" type="radio" name="skin" class="skin-custom pointer v-middle">
                <label for="skin-${config.id}" class="skin-custom pointer dp-i-block v-middle" style="max-width: 90%;">${config.id}. ${config.skin_name}</label>
                </li>` + html
            } else {
              html += `<li class="item skin-custom" data-id="${config.id}"${config.id === selectedSkin ? ' id="skin-selected"' : ''}>
                <span class="skin-custom cb-icon svg-icon v-middle p-absolute${config.id === selectedSkin ? ' checkbox-selected' : ' checkbox-default'}"></span>
                <input id="skin-${config.id}" type="radio" name="skin" class="skin-custom pointer v-middle">
                <label for="skin-${config.id}" class="skin-custom pointer dp-i-block v-middle" style="max-width: 90%;">${config.id}. ${config.skin_name}</label>
                </li>`
            }
          }
          $('#control-panel-ctnr-box').append(`
            <div id="skin-setting-div" class="skin-custom border-box dialog-ctnr common-popup-wrap top-center" style="z-index: 999999999;transform-origin: 91px bottom;width: 280px;margin: 0px 0px 0px -140px;left: 50%;max-height: 450px;display:none;">
            <div class="skin-custom arrow p-absolute" style="left: 90px;"></div>
            <h1 class="skin-custom title" style="margin: 10px 0;">背景图</h1>
            <input value="${customedBgimg}" type="text" placeholder="请输入背景图链接，0为默认皮肤" maxlength="2000" class="skin-custom background-custom link-input border-box keyword-input v-middle" style="width: 178px; height: 24px;"><button${customedBgimg ? '' : ' disabled="disabled"'} class="skin-custom change-bgimg bl-button dp-i-block v-middle keyword-submit-btn bl-button--primary bl-button--small"><span class="skin-custom txt">更换</span></button><span class="skin-custom"></span>
            <h1 class="skin-custom title" style="margin: 10px 0;">皮肤</h1>
            <div id="skin-container" class="skin-custom block-effect-ctnr h-100 border-box p-relative"style="overflow-y: auto;max-height: 300px;">
            <form>
            <ul class="skin-custom list">
            ${html}
            </ul></form></div>
            <div style="text-align: center;margin-top: 5px;"><button class="skin-custom custom-skin bl-button dp-i-block v-middle keyword-submit-btn bl-button--primary bl-button--small"><span class="skin-custom txt">自定义</span></button></div></div>
          `)
          $('#skin-setting-div').show('normal')
          const container = $('#skin-container')
          const inner = $('#skin-selected')
          console.log(container, inner)
          container.scrollTop(inner.offset().top - container.offset().top + container.scrollTop())
          $("input.background-custom").bind('input porpertychange', function () {
            if ($(this).val().length > 0) {
              $('button.change-bgimg').removeAttr('disabled')
            } else {
              $('button.change-bgimg').attr('disabled', 'disabled')
            }
          })
          $('button.change-bgimg').click(function () {
            customedBgimg = $("input.background-custom").val()
            if (customedBgimg === '0'){
              customedBgimg = 0
            }else{
              changeBackgroundImage(customedBgimg)
            }
            GM_setValue('customedBgimg', customedBgimg)
          })
          $('#skin-setting-div .item').click(function (e) {
            if (e.target === $(this).find('input')[0]) {
              $('#skin-setting-div .item>span.svg-icon').removeClass('checkbox-selected').addClass('checkbox-default')
              $(this).find('span.svg-icon').removeClass('checkbox-default').addClass('checkbox-selected')
              selectedSkin = parseInt($(this).attr('data-id'))
              if (selectedSkin !== 0) {
                selectedSkinConfig = preProcessing(skinConfig[selectedSkin].skin_config)
                generateStyle()
              }
              GM_setValue('selectedSkin', selectedSkin)
            }
          })
          $('button.custom-skin').click(function () {
            $('#sections-vm').remove()
            let html = ''
            for(const name of Object.keys(selectedSkinConfig)){
              if (name === 'highlightContentHover') continue
              html += `${name}：<input data-name="${name}" value="${selectedSkinConfig[name]}" type="text" placeholder="${name}" maxlength="2000" class="skin-custom skin-config-custom link-input border-box keyword-input v-middle" style="width: 300px; height: 24px;"><button${selectedSkinConfig[name] ? '' : ' disabled="disabled"'} class="skin-custom change-skin bl-button dp-i-block v-middle keyword-submit-btn bl-button--primary bl-button--small" data-name="${name}"><span class="skin-custom txt">预览</span></button><br/>`
            }
            html += `自定义主题名称：<input value="自定义" type="text" placeholder="请输入自定义主题名称" maxlength="2000" class="skin-custom skin-name-custom link-input border-box keyword-input v-middle" style="width: 300px; height: 24px;"><button class="skin-custom save-skin bl-button dp-i-block v-middle keyword-submit-btn bl-button--primary bl-button--small"><span class="skin-custom txt">保存</span></button><br/>`
            $('#live-player-ctnr>div').css('text-align', 'center').html(`<div style="width: fit-content;text-align: right;margin: 10% auto;vertical-align: middle;line-height: 30px;">${html}</div>`)
            $("input.skin-config-custom").focus(function () {
              toggleHighlightElement($(this).attr('data-name'), true)
            })
            $("input.skin-config-custom").blur(function () {
              toggleHighlightElement($(this).attr('data-name'), false)
            })
            $("input.skin-config-custom").bind('input porpertychange', function () {
              if ($(this).val().length > 0) {
                $('button.change-skin').removeAttr('disabled')
              } else {
                $('button.change-skin').attr('disabled', 'disabled')
              }
            })
            $("input.skin-name-custom").bind('input porpertychange', function () {
              if ($(this).val().length > 0) {
                $('button.save-skin').removeAttr('disabled')
              } else {
                $('button.save-skin').attr('disabled', 'disabled')
              }
            })
            $('button.change-skin').click(function(){
              selectedSkinConfig[$(this).attr('data-name')] = $(this).prev().val()
              generateStyle()
            })
            $('button.save-skin').click(function () {
              skinConfig[-1] = {
                "id": -1,
                "skin_name": $('input.skin-name-custom').val(),
                "skin_config": {
                  "headInfoBgPic": $('input[data-name="headInfoBgPic"]').val(),
                  "giftControlBgPic": $('input[data-name="giftControlBgPic"]').val(),
                  "rankListBgPic": $('input[data-name="rankListBgPic"]').val(),
                  "mainText": $('input[data-name="mainText"]').val(),
                  "normalText": $('input[data-name="normalText"]').val(),
                  "highlightContent": $('input[data-name="highlightContent"]').val(),
                  "border": $('input[data-name="border"]').val()
                }
              }
              GM_setValue('skinConfig', skinConfig)
              $('#skin-setting-div .list').prepend(`<li class=".skin-custom item" data-id="-1">
                <span class=".skin-custom cb-icon svg-icon v-middle p-absolute checkbox-default}"></span>
                <input id="skin--1" type="radio" name="skin" class=".skin-custom pointer v-middle">
                <label for="skin--1" class=".skin-custom pointer dp-i-block v-middle">${skinConfig[-1].skin_name}</label>
                </li>`)
              $('#live-player-ctnr>div>div').append('<div id="saved" style="color:green;text-align: center;width: 100%;margin-top: 5px;font-size: 24px;">保存成功！</div>')
              setTimeout(()=>{
                $('#saved').remove()
              }, 3000)
            })
          })
        }
      })

      $(document).on('click', function (e) {
        const skinSettingDiv = $('#skin-setting-div')
        const skinSettingIcon = $('#skin-setting-icon')
        if (!skinSettingDiv.is(e.target) && skinSettingDiv.has(e.target).length === 0 && !skinSettingIcon.is(e.target) && skinSettingIcon.has(e.target).length === 0) {
          skinSettingDiv.hide('fast', () => { skinSettingDiv.remove() })
        }
      })
      updateSkinConfig(Math.max(...Object.keys(skinConfig)) + 1)
    }
  })
  function updateSkinConfig(id) {
    GM_xmlhttpRequest({
      url: `https://api.live.bilibili.com/room/v1/Skin/info?skin_platform=web&skin_version=1&id=${id}`,
      methon: 'get',
      responseType: 'json',
      onload: data => {
        if (data.response.code === 0 && !Array.isArray(data.response.data)) {
          const skinData = data.response.data
          skinData.skin_config = JSON.parse(skinData.skin_config)
          skinConfig[skinData.id] = skinData
          GM_setValue('skinConfig', skinConfig)
          $('#skin-setting-div .list').append(`<li class=".skin-custom item" data-id="${skinData.id}">
      <span class=".skin-custom cb-icon svg-icon v-middle p-absolute checkbox-default}"></span>
      <input id="skin-${skinData.id}" type="radio" name="skin" class=".skin-custom pointer v-middle">
      <label for="skin-${skinData.id}" class=".skin-custom pointer dp-i-block v-middle">${skinData.skin_name}</label>
      </li>`)
          updateSkinConfig(++id)
        }
      }
    })
  }
  function changeBackgroundImage(url) {
    GM_xmlhttpRequest({
      url: url,
      methon: 'get',
      responseType: 'blob',
      onload: data => {
        if(data.status === 200){
          $('[role="img.webp"]').css('background-image', 'url(' + window.URL.createObjectURL(data.response) + ')')
        } else {
          $('[role="img.webp"]').css('background-image', 'url(' + url + ')')
        }
      },
      onerror: () => {
        $('[role="img.webp"]').css('background-image', 'url(' + url + ')')
      }
    })
  }

  function preProcessing(skinConfig) {
    const mainText = skinConfig.mainText.replace(/#([\d\w]{2})(.+)/, function (match, p1, p2) {
      if (/^#/.test(match)){
        return match.length === 9 ? ('#' + p2 + p1) : match
      } else {
        return match
      }
    })
    const normalText = skinConfig.normalText.replace(/#([\d\w]{2})(.+)/, function (match, p1, p2) {
      if (/^#/.test(match)) {
        return match.length === 9 ? ('#' + p2 + p1) : match
      } else {
        return match
      }
    })
    const highlightContent = skinConfig.highlightContent.replace(/#([\d\w]{2})(.+)/, function (match, p1, p2) {
      if (/^#/.test(match)) {
        return match.length === 9 ? ('#' + p2 + p1) : match
      } else {
        return match
      }
    })
    const highlightContentHover = skinConfig.highlightContent.replace(/#([\d\w]{2})(.+)/, function (match, p1, p2) {
      if (/^#/.test(match)) {
        return match.length === 9 ? ('#' + p2 + 'cc') : match
      } else {
        return match
      }
    })
    const border = skinConfig.border.replace(/#([\d\w]{2})(.+)/, function (match, p1, p2) {
      if (/^#/.test(match)) {
        return match.length === 9 ? ('#' + p2 + p1) : match
      } else {
        return match
      }
    })
    return {
      mainText: mainText,
      normalText: normalText,
      highlightContent: highlightContent,
      highlightContentHover: highlightContentHover,
      border: border,
      headInfoBgPic: skinConfig.headInfoBgPic,
      giftControlBgPic: skinConfig.giftControlBgPic,
      rankListBgPic: skinConfig.rankListBgPic
    }
  }
  function toggleHighlightElement(name, show = true) {
    switch (name) {
      case 'mainText':
        $('.live-skin-coloration-area .live-skin-main-text,.live-skin-coloration-area .week-icon').attr('style', show ? 'border: 2px solid red !important;' : '')
        break
      case 'normalText':
        $('.live-skin-coloration-area .live-skin-normal-text,.live-skin-coloration-area .live-skin-normal-a-text').attr('style', show ? 'border: 2px solid red !important;' : '')
        break
      case 'highlightContent':
        $('.live-skin-coloration-area .live-skin-highlight-text,.live-skin-coloration-area .live-skin-highlight-bg,.live-skin-coloration-area .live-skin-highlight-border,.live-skin-coloration-area .live-skin-highlight-button-bg.bl-button--primary:not(:disabled)').attr('style', show ? 'border: 2px solid red !important;' : '')
        break
      case 'border':
        $('.live-skin-coloration-area .live-skin-separate-border,.live-skin-coloration-area .live-skin-separate-area').attr('style', show ? 'border: 2px solid red !important;' : '')
        break
      case 'headInfoBgPic':
        $('#head-info-vm').attr('style', show ? 'border: 2px solid red !important;' : '')
        break
      case 'giftControlBgPic':
        $('#gift-control-vm').attr('style', show ? 'border: 2px solid red !important;' : '')
        break
      case 'rankListBgPic':
        $('#rank-list-vm,#rank-list-ctnr-box,#chat-control-panel-vm').attr('style', show ? 'border: 2px solid red !important;' : '')
        break
      default:
        break
    }
  }
  function generateStyle() {
    const {
      mainText,
      normalText,
      highlightContent,
      highlightContentHover,
      border,
      headInfoBgPic,
      giftControlBgPic,
      rankListBgPic
    } = selectedSkinConfig
    const skinCss = `
    .live-skin-coloration-area .live-skin-main-text {
      color: ${mainText} !important;
      fill: ${mainText} !important;
    }

    .live-skin-coloration-area .live-skin-main-a-text:link,.live-skin-coloration-area .live-skin-main-a-text:visited {
      color: ${mainText} !important;
    }

    .live-skin-coloration-area .week-icon {
      color: ${mainText} !important;
      border-color: ${mainText} !important;
    }

    .live-skin-coloration-area .live-skin-main-a-text:hover,.live-skin-coloration-area .live-skin-main-a-text:active {
      color: ${mainText} !important;
    }

    .live-skin-coloration-area .live-skin-normal-text {
      color: ${normalText} !important;
    }

    .live-skin-coloration-area .live-skin-normal-a-text {
      color: ${normalText} !important;
    }

    .live-skin-coloration-area .live-skin-normal-a-text:link,.live-skin-coloration-area .live-skin-normal-a-text:visited {
      color: ${normalText} !important;
    }

    .live-skin-coloration-area .live-skin-normal-a-text:hover,.live-skin-coloration-area .live-skin-normal-a-text:active {
      color: ${highlightContent} !important;
    }

    .live-skin-coloration-area .live-skin-highlight-text {
      color: ${highlightContent} !important;
    }

    .live-skin-coloration-area .live-skin-highlight-bg {
      background-color: ${highlightContent} !important;
    }

    .live-skin-coloration-area .live-skin-highlight-border {
      border-color: ${highlightContent} !important;
    }

    .live-skin-coloration-area .live-skin-highlight-button-bg.bl-button--primary:not(:disabled) {
      background-color: ${highlightContent};
    }

    .live-skin-coloration-area .live-skin-highlight-button-bg.bl-button--primary:hover:not(:disabled) {
      background-color: ${highlightContentHover};
    }

    .live-skin-coloration-area .live-skin-highlight-button-bg.bl-button--primary:active:not(:disabled) {
      background-color: ${highlightContentHover};
    }

    .live-skin-coloration-area .live-skin-separate-border {
      border-color: ${border} !important;
    }

    .live-skin-coloration-area .live-skin-separate-area {
      background-color: ${border} !important;
    }

    .live-skin-coloration-area .live-skin-separate-area-hover:hover {
      background-color: ${border} !important;
    }

    .live-skin-coloration-area .live-skin-button-text:not(:disabled) {
      color: rgb(201, 204, 208) !important;
      fill: rgb(201, 204, 208) !important;
    }

    #head-info-vm {
      background-image: url("${headInfoBgPic}");
    }

    #gift-control-vm {
      background-image: url("${giftControlBgPic}");
    }

    #rank-list-vm,#rank-list-ctnr-box {
      background-image: url("${rankListBgPic}");
    }

    #chat-control-panel-vm {
      background-image: url("${rankListBgPic}");
    }

    .supportWebp #head-info-vm {
      background-image: url("${headInfoBgPic}@90q.webp");
    }

    .supportWebp #gift-control-vm {
      background-image: url("${giftControlBgPic}@90q.webp");
    }

    .supportWebp #rank-list-vm,.supportWebp #rank-list-ctnr-box {
      background-image: url("${rankListBgPic}@90q.webp");
    }

    .supportWebp #chat-control-panel-vm {
      background-image: url("${rankListBgPic}@90q.webp");
    }

    #head-info-vm,#gift-control-vm {
      border: none !important;
        padding: 1px;
    }

    #aside-area-vm {
      border: none !important;
    }

    #rank-list-vm,#rank-list-ctnr-box {
      background-repeat: no-repeat;
        background-size: 100% auto;
    }

    #chat-control-panel-vm {
      background-repeat: no-repeat;
        background-size: 100% auto;
        background-position: bottom left;
    }
    `
    $('#custom-skin').remove()
    $('head').append(`<style id="custom-skin">${skinCss}</style>`)
  }
  const style = `
  .dialog-ctnr.skin-custom {
    bottom: 100%;
    padding: 16px;
    position: absolute;
    z-index: 699;
  }
  .arrow.skin-custom {
    top: 100%;
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 8px solid #fff;
  }
  .title.skin-custom {
    font-weight: 400;
    font-size: 18px;
    color: #23ade5;
  }
  .link-input.skin-custom {
    padding: 2px 8px;
    line-height: 25px;
    border: 1px solid rgb(201, 204, 208);
    border-radius: 4px;
    background-color: #fff;
    outline: 0;
  }
  .link-input.skin-custom:focus {
    border-color: #23ade5;
  }
  .bl-button--primary.skin-custom:disabled, .bl-button--primary.skin-custom:disabled:hover {
    background-color: #e9eaec;
    color: #b4b4b4;
  }
  .bl-button.skin-custom:disabled {
    cursor: not-allowed;
  }
  button.keyword-submit-btn.skin-custom {
    min-width: 64px;
    margin-left: 4px;
  }
  .bl-button--small.skin-custom {
    min-width: 80px;
    height: 24px;
    font-size: 12px;
  }
  .bl-button--primary.skin-custom {
    background-color: #23ade5;
    color: #fff;
    border-radius: 4px;
  }
  .bl-button.skin-custom {
    position: relative;
    box-sizing: border-box;
    line-height: 1;
    margin: 0;
    padding: 6px 12px;
    border: 0;
    background-color: transparent
    cursor: pointer;
    outline: 0;
    overflow: hidden;
  }
  .bl-button--primary.skin-custom:hover {
    background-color: #39b5e7;
  }

  .block-effect-ctnr.skin-custom {
    margin-top: -4px;
  }
  .block-effect-ctnr li.skin-custom, .block-effect-ctnr ul.skin-custom {
    list-style: none;
  }
  .block-effect-ctnr div.skin-custom, .block-effect-ctnr li.skin-custom, .block-effect-ctnr p.skin-custom, .block-effect-ctnr ul.skin-custom {
    margin: 0;
    padding: 0;
  }
  .block-effect-ctnr .item.skin-custom {
    color: #666;
    padding: 6px;
  }
  .block-effect-ctnr .item .cb-icon.skin-custom {
    font-size: 16px;
  }
  .block-effect-ctnr .item .cb-icon.skin-custom, .block-effect-ctnr .item input.skin-custom {
    width: 16px;
    height: 16px;
    left: 0;
  }
  .block-effect-ctnr .item .cb-icon.skin-custom, .block-effect-ctnr .item input.skin-custom {
    width: 16px;
    height: 16px;
    left: 0;
  }
  .block-effect-ctnr .item input.skin-custom {
    opacity: 0;
  }
  .block-effect-ctnr .item label.skin-custom {
    margin: 0 0 0 2px;
  }
  #skin-setting-icon {
    display: inline-block;
    width: 24px;
    height: 24px;
    margin-left: 4px;
    margin-top: 4px;
    fill: rgb(201, 204, 208) !important;
  }
  `
  GM_addStyle(style)
})();
