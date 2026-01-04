// ==UserScript==
// @name					快捷搜索
// @name:zh					Popup Search: 快捷搜索
// @author					yuyehk
// @namespace				Lkytal
// @version					5.1.3
// @icon					http://fk.yuyehk.cn:81/uploads/images/ffaf74f0b5ed1ffc420401645c5d6ecf.png
// @homepage				https://lkytal.github.io/
// @homepageURL				https://lkytal.github.io/GM
// @description				Popup search box and translate button (etc) for selected texts
// @description:zh			为选中文字弹出搜索和翻译的快捷按钮
// @license					AGPL
// @include					*
// @exclude					*/test/*.html*
// @exclude					http://acid3.acidtests.org/*
// @exclude					http://www.acfun.tv/*
// @exclude					http://www.sf-express.com/*
// @exclude					http://furk.net/*
// @connect					google.com
// @connect					google.cn
// @grant					GM_xmlhttpRequest
// @grant					GM_addStyle
// @grant					GM_openInTab
// @grant					GM_setClipboard
// @grant					GM_download
// @grant					GM_getValue
// @grant					GM_setValue
// @grant					GM_registerMenuCommand
// @grant					GM_info
// @run-at					document-end
// @inject-into				auto
// @require					https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.5.1.min.js
// @connect					google.com
// @connect					translate.google.cn
// @charset					UTF-8
// @supportURL				https://github.com/lkytal/GM/issues
// @downloadURL https://update.greasyfork.org/scripts/437012/%E5%BF%AB%E6%8D%B7%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/437012/%E5%BF%AB%E6%8D%B7%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

"use strict";
;
var CopyText,
    GetOpt,
    GetTextboxSelection,
    InTextBox,
    OnEngine,
    OpenSet,
    PopupInit,
    PopupLoad,
    ReadOpt,
    SaveOpt,
    SettingWin,
    ShowBar,
    UpdateLog,
    UpdateNotified,
    addAdditionalCSS,
    addCSS,
    ajaxError,
    doHideBar,
    doRequest,
    eventFromTextbox,
    fixPos,
    getLastRange,
    get_selection_offsets,
    hideBar,
    isChrome,
    log,
    needPrefix,
    onCopy,
    onTranslate,
    parseTranslationGoogle,
    popData,
    hasProp = {}.hasOwnProperty;

window.$ = window.jQuery = jQuery.noConflict(true);

popData = {
  count: 0,
  mouseIn: 0,
  bTrans: 0,
  additionalCSSLoaded: 0,
  codeVersion: 8,
  text: "",
  mousedownEvent: null,
  fadeEvent: [],
  icons: {
    baiduIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAASzSURBVFhH7ZZNbBtFFMf//ljbtZ2149hp4zgkKamSNNDykapQKEH5QCKiBYGgIkpVQasegiok1CIOHCpRDkjcQIhbJUo5waUSB8SHBAWJCCRQgJRQmjaNEyd2nMTfG9u7y5v1prbT9doBRb3wk9aembc78595b96M4b4xWcYdxKj+3zH+F7ApAQZD4QMz/RipzOr/lc0JgIzulhTGnozjmX0xWMzF+DUZZdQ7ZbjsMomTaxa3KQGt3gTOjQp4aZjHGyN2HNozo1qAod1hXDydxoXX0ni4I662VmdTAg50SWhpqlfKHMfhyIBbKd/TBowdNqDJ5yC7A8cHY2huUExVqVmAkd50SldhMhU/8dWbYOWAx+6+joDfp7YCu9q98Fmm1Zo+VQWw8VjAsXSVkX2QJEm1ALFEDjkRaPaayedFpyeSAkRzUZAeFQUYyLK3NYFTfT/i2MEbaK5PYnK+DkvRmGIXRRFf/xQlQcBcJFcm7PfpDILLdWpNH9OOfWfPquUyfLyEt0YSGHq0E73dPJyGBXz3lxfB4E1wchzjv87jk/FWJAUOiTUbmvkw7QoRv0yGcPGyGwnBAD9PYmn5hBz5qcKu0DwL2LvDDwo497Kt0EDEE2m8eT6P8Ws8XA5AyNJSZwo25qLtFJu8ZRmrAo8mdx4nBpbQ01GPP69F8N4XfkzOkggNFZouYO7cuaP8ZYfdhgYXkM0DEZpYJivB48hhO5+jwJQRWgGmFjwkyoyB7jk88kAAbt6Bh+5vw+vPZWG3qh1tQDsGaE0WVoo+ZeTyIuJJaiNdvF3CC/sXceFMHh+dEXFyMAKfU1ASlc0CtPuLK8fobHXATu1aaApgPvn2NxNWVlOFBmLiShB/BC3KTI71RXF6pAl+3zY0emw4cagRb4/G4XGSXwjmko3c5meVigKWkhac+pDDZ9+EcP7zJbxzKYDltB2DXTN4caDutlTb2+PD0ceT4EzAjbnCTlnn5mKOXKZWNlDxQsIGYBaO/CvSv4ka+vdm8cpwCoEd7rJ9v04qLeD9T6O4Msfh1adF7GzxIEzb9t1LPvw8BUgaQVjTjYgt+1DXNJ0BTgSavGXZsBRRlDC/uIqPv1rDD1cbYONkpAQgnLAqk9EaSbunEljwHNk/i+NP8WgNNFYcnMFsLX4Pnj0goX93BOG4FQsxq5KsKk1TVwBb5cGeEI4+wVPHXrW1Op0dzTh52IPRg4vKWaGHrgCPExjpN8Lt5tWW2nE6tuH5Pjv2tFPi0EFXwF2NgL+R0t6/xO1yosP1t1rTRldAmrZOnhKQVsTXCmfIqSVtdAVMh2gPzxf2dOlpVyupdAYzmXvVmja6AnLkvg++9OP67BJdSIwUyTKWV9MILiYRiqSQWctDoGclLiht7AlHU8p7TPD3EwLGaf/rUTUPsHtBe0MSve0JuJwmuoDIiKyICIaziGXpSmaqg1WeQ08bh10tNrgsMayJNkzMmHF5qgHRBJ0QOiPUlIhYCJjoYf8yPYo36Ctp/UvVrlzVQctGqvMirRiZqvWu64J1WCd5GpRdv/LUPxNwa3AGlSkJKvasaKYj26jYq0+tRIDWCbZVlI51S0DZjLaY0rFqcsHWAfwDnVStvcSt8MwAAAAASUVORK5CYII=",
    bingIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACeklEQVRYhe2Wy2sTURTGu1fapOZRTKj2kaag1VaTNA9NjHkWLS3diC5q6wNc+A+EIkVw40ZRFBeuirgQF1JfuFBboYiIzb2TmdimCA0YWyupqalBTRo/F4M3KE0mhrR2kQsfDHPvOfOb794zZ6qErlb8T1VVACoAFYANDcD7dKAWFahFBd7TvL4AvE8HobsNqSmK1FuC6WP71gQiP4C3GeGe3fg9Zk54EHI35ub9evBenSi/fm0AhJ5dDCAy4Abn0ILa1CCGGlCrCsLhnRAO7QAxK0CMMlBb3R+QZQUId7ch0u9EYuwBVhs/s1l8fnIX00dtIEY5eF9LeQG+RWfYdeLZKGaHTiLS70TkuAvR4TP48vIpm19+MwFqURZ1ZooGAIAf8+/B2TWgZgVCzm0IuRtFHagH6awF72vBytek6EgmDWpVSTpRNEA2k0awYxN4T1PeZCFXA6hZwWKWxh+CWtXlAYhdHgK3f6ukpdSqxqfb11kcMckLVknhMuxtZ4lmA4MIOeslATiHFrFLARbH2TUFtyE/gF8PYpKzRIuP7oAYZZIAwY7NWJ6cEM/BSgbEIINQigNCVys4uwZz187nPkan/CCdW1Z9I96rAzHIMBsYZOuj505Lula4F/j1CO6tRnz0Fku6MHIF1KIEMclBrSpQqwrEKANn1yJ+b4Stm795EcRUW3oZ/r0V7872IZOI50ryYwzJV2NIvh5HenGB3f8eiyIy4AK1KCUfXhQAK7GD2xHcU42pI2bM3biApRePkQoHkQpPIvH8Pj5cHUa4tx3EUIOQq6GonP8EIEoP3tPEegK1KEXZ6sA5tCV1y439Q1IBqABUANZDvwDe9YuA3jr3dgAAAABJRU5ErkJggg==",
    translateIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAExklEQVRoge2Y+08UVxTH/dNmtYRHwNKHDW1tIWl/sK1QbFoSitXa9i642wWxKIK0ysOCLBSwBSWQslpboD54SGVNbAkB0cqjIIic+5jTH2b2gczM7o7DzpLsyfeHzeydmfM5994z555dEoEdrV22e5AEsNuDJIDdHiQB7PYgCRBpRJoLDtazggbzym9g+fX0je+oDQCfXGDL62iJCRlbhnhcAdLdsPzUGu+D9uVPLH4A+Q00Gp/WNnBhFRfXogLoGRUJB1DZyyUC+05GNbjvThLANEDPmChqYVuVU0UlAqnHoaiZBfVZQO5unigAtQNmckhuDU0UgJ9HxKEmFlShjjLcIBHI9EBhEytsZKWXEmYGojEuMKucSgTc3Szh9kA0dmdGVu69fk8kNMBXHSzDDVkeeLQsh193dzOJwMsVFLQnIGEARqfVSJdfDnm6sIppLpAInOrnejcmCgAiHmpiEoGXSuHvf9VJIF1MIpBSBg83T0uCAvjn5D2lIBH44BxlHPsnhIOARKCyVzf8iQWAgW+wRKDEy1KPg0TgtUq6Yli9xhWgIBLAM4q5NaEqf7cThu5rJx97AAobdVJJwGaX5APnQgBpLuif0AaQA5qal1sGeTRqHuTFFyPX3iYBGMeLwyLdHYq98iOlDB6vGFPHZq3DEeqXmAG4wF//EuErp7iVPViSm37naS4gXREmLVaTEd85Y3QWjQFgbQM7b25yfW857R0XwZQ5syiPTOsmUNNW2Gi0kGIAuOYXjsBScTiBdLEoT2GJAoCI3/v4nlIo8TL/nPWRjgeAkHFhFSnHF2lVzD/BsWl5bFqemJE3oigXzQN8rLWJKccSL3v3DJ1fNTkJ4Y2JlkGjz/aLAmz9EiveK//ur6bzT2JmWFzDlLLQK/JqI0+BeYC3TtNwB8O9N81w4Q81r795Ss1mE7MRnmAeQCLQfoPreW+CQZbx7dNUIpBdQe8+kJXiT+/sZg2Ag8DRdtY7Lr5oYxKBTI/GmP3V1Dcprk6Kq5NidskI5taUWghV93NE/PA8lQhkuOEpbBvAc+qbEAUNRo9r+9NoU37dySQCDidML8iI+MuIytM9alQCWglw/Z5YBzRgMABYWUel5D5Yr27ctQ31BPfReaNVZCXANb9AxHXAombth3qHdQHab6jbtycs3sohzuGEqXndtWclwG9+9d2M42GtPf3KCfrPY21X3q+jEoH0zSv+9pR6tq7q0yXfFgCFQYnfVoa5/55n8M+pju47Sb/t4UG5urlyLs2uoFQHwUqADDfdWx5Slke70M2pog83M1RcjtyWHLirvZWtBIheOVU02Jt4RlFBdRA4cYWf9fE6H6/z8doBXjvAP29V/fv0R+2tbA+AwvBoRUbEK+Nqujzwg0bhsLKOqS6QCOx2wta1ZydAbg1VDgz5gbTbdUt7mX/TqQ6o82kMsAcgt4YuriIizizKWeWQ6YHsCtDruAzdF5keyPRAXi0VW+bABoC8QOwtsXgDBGO/IwHyauiCpd7HG8C4mNsBAMWtFveFgOGrlWb7QibkINBxM0J7NCbvnZcidBe3JQu9d5Ye62DhOtqurcNtrMTLSrzsyObrxzrYkXb2umHstxEgnkoC2K0kgN1KAtitJIDd+h//4oa1H68RnAAAAABJRU5ErkJggg==",
    googleIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFcUlEQVRoge2ZW1AbVRjHQ7HWS7VirU6d6fiiM17qi1Wr40zfbMdxnJiWChQKVOqUTi/TAQFxFHDq9KbY0qvaDpZeoBtCCMRyb4GQAiEphCY03IJkAyQ2JZBsFshtjw+ZrsuJJHR3m4UxZ85T8v2/8//N7tlzznd4PIS/uDv3DsIAXDsIA3DtIAzAtYMwAPtJny6L2dScl6MpLjbIbll0d23GPvto4K61oTuVp7kHWN+QUWKQ4Z4ZMO9GAKJqTPV2zX6On8BLFUkIKvcSBACgHxvL1ZZ81nJw860j+b0Si9MOmR53Yjma4gz1xQz1xY1NuYyGZsX9Bw2Zpmmrz9wRnejx0i3Uf1eWJ1SOdkAMteaup0RfsDA68xTr6tJsLtxn68xA1X/GLC3dIhlphxgQVB7BOUBUefyQw+wzhLmnny+PnyvyOfE2A34PYtjefpxjgBP9UtKNZKQ9cHBcWz4EMOQwQ+9bSAFWSRKnPE7SzcEeJHB8pFAwiJkgho85nMR7b/9GtZLWVRhU8u2dyxDAobsizgDKjK1UK99rrgaVvFWzDwIQonLOAHpsKNXKeX1dUMkSoeD+7GVBOtrBGQD5/fE1pXVgPiqZpYeqKjHIFsoTcBOelZKEoKpraAtVlast4QxANHsOAABSlKeCqi4PN1ElH934hjOAXaqzEMBt62CE8PPAqhpTJyVeH4EEiX+EACvE2yZcDoghuvVYAMmy0mhyEnsI74ab2YzcMwTgIfzM7iIIYGzKuroyea74ZEWBL4wA4EDXBabumQM8JhTUmrr8X6QXJYn+we/Vp1tdDgCAFxDp6uCrXigAeAj/GXFstek2xDAydT9RcYLcML9cuePHHqFv34G5pwTyw+y4ZwWAh/AjhYI0daHViUEYuGdGazPoMZPvoAMAwNzT6xsyWHPPFoCvPyuO/bLj1DVUrrMZx53YhAtDcQuEtEt1lk337AJAPQLhb1cchwBWiOMWDQAP4RcONUAAa6QpiwngynAzBHBpuDHoSreAALL8VgkAwDW0ZXlZzOIAWF2Z7HBP+zNobegb1XsWAQAP4aeqzvkDAAAmXfgnsh8WHMAToq3v13+dojx9RFd21dDcYFZ3TgyRiwDU3IQnWVGwIACiyuNTVefqzGrqGR8A4CW8ky4cxS0obnETHn8GL+FlWllhbv2n3nLMPUV60jtMJ/v/jGv7eW3NvuVlsWTpal1dWq99xJ9hxut6py6NG4BNzXljDyqKAICO8f6NzXkBvpLLy2IuDTf6M7Tf76N/KqDtPklRQH0rDulEkULBfIT7O8+7CS/EQP9cRk+24Wa2y/uv+1MD1x9KHn3rKDQlghbF2ARYWrq5zz5Kjm2ZsdNYmA50XaACILSrQzQ0W1uPUcf+468bNJIsEQo0k8NkkqoxVegArhhm7XCyuovojf2d5gqZ5KqhOXQAXRNDVIDsO5fojU0tVtNOQgcAqmcV0y2t7eg4SSZZG8o7snqzmgpgc+EB7jUC9DMDVb4Mjfc0NN3TA/DfJP+ur33YJFHl28adGADATXjerU8PKcALku2TDy7FyJajLZ7/ahopFCCo3CfMpPsNoA/Ao9SnqE06pnytandQ7SpJonikzSc5qhMzveejrczqLiIAvE92Ex7JqCKh/ZdXpDuhB7KsNPrDhsz8vopJlwMAgHtmvlKeYWSdIQAP4X/actD/4pE6uXV2o2K8Xzk+MIiZnF6373cvIETG1levp7LgniEAD+E/Kdq6W/Wryjo4Fwa1GXHL8b6KN6v3smOdFQCyr5GmxLXlH9aJSgyyxr81nRP6zgl90z0tgsqP6sRJioLXq/cwraQ/UgDOOvcOwgBcOwgDcO0gDMC1g/85wD+li3AIT+EGpwAAAABJRU5ErkJggg==",
    linkIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAACKElEQVRYw+2WO2/TUBhAz+eELVLtZOUHMObRIT+AnaUMTDAgwVDcREJCEZUgAgkYUJxkaTcGJISUoSNj2ZuQoWPZWWJ76MCQ+mNIghznUYe4VKriyb6SfY6/171idW3lGq8013xtBG6WgCCfIDi8EB0amnoIuvvfBBReu0WnHlo6sXr2T0FeAeaVCiha9YotB8A8se+KaMYrtY+8YsuxejaCNBZGbd05EIbnepWGopVxOpxB0akCWD27skhiPQHhvVto1qLwUE38lcj2Ku15NbFOCnwV48Mi+Dg6Fav77LtXah8R6CEGiQqcevmGH4J/BvFn/lLxAVSNtBAkWoT5CTwSaiYSila97fbxiBS8RNfvAl+QM0XzQCYKH+WdjM4pToGd9dpQOFAxam6+4Vtde19E3kTh42p/tKgz/llAEGdQCLXUYnhjFXgsgXn9fBnc6ldN0eAd8PTS7y+bA/PgKnS8QvN+FD5+PAdOgTvLxm+sCKjQcQuzk0zgLAoXxFH0MZAByonshobqx1Ee7fLUGFWe535UhqqYguxOopTt7ZVXhS8VCC5Sv0c33MaYfkdV98MpsvpVU0ZhT/A8kAruAX33PHdkbrkd0ek+DteHaPAibs5XKcKhBPpgsN3qyHE9bW65XyYScXe6dQVmJKyMuyMG/qDY/JYEPO52/Aul7paaB+HFbHevhlAHbl21AMBQ4W1Kg6+BGmkMeRLnvJekwOZYvhG4uQJ/ANn7OVGZK3rWAAAAAElFTkSuQmCC",
    taobaoIcon: "data:image/png;base64,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",
    yahooIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD6klEQVRoge2Y2U8TQRzH/ZOWbbG0VKOIUaGlBUUQwqEcUQwSwCPRRMUHTTTxFhTqgyQkHlF5sZEE1CePRxWNJ8YaZWdv6NLtsYcPqLTb6ZZut4wkO/k+zu8338/Od9uZXUNg+KrWGuQOLADUDiwA1A4sANQOLADUDiwA1A4sANQOLADUDkwGoDxVXG9f/gKl69AAzJ89p5ox6JrtqxuA8lWjAZg7OSDNzmok87yOVwmA9BKq0osGACrgcEafPcsEINwYzt6hxEVVeg0LOEvzAiAwHNjXRp8+zbAFEtveoV9O+6sNp1FmGLJsU74ABIaDYkfsxUv4GiRJlpXrl8uANGJfUbjunnwjtMTgcsen30EXir18ReB2nVoxGDTgf2F0VN9Szn9kZFm5FPoBXUwIBPRDCBzOfwpfvqIqiuZhRx6OM82toNT9bxpRZDMZgMBwqsovcxx8u3t6s3fA7QtjY5pS6edPtqPTgBmDRwlm9x4lFoMgzIdpn19vH0pc0akpTZX4KAjc6405MX4W4o8e02ZAVVVVTXz5ClxuaAm5sSz++nUKsCjOHT8BnTx3ciDycFwYHpk/fYbv62daWimvDzicpgEQGC4Mj0BfhujkZHp2Ka9P+h5KQf32jd5em6n5wq3R9M5s514zAYgiW3RSm4fFEb58NSVyzS0yy6ZATj3RP/ClAyiiCBwlpgJgOHCWJj5+ghDIMte1f3EO19evRKNJRhRhcCjrz0s6QOz58/RpJtwHqEov9LAk8zxV4Zk/e06V5eSnyB88tJy2QuCmdlfPXygIAIHh7N6uZJdLDExKbGSOY5paltlTGAloutH1uwoFQGB4+NogJEjJ7gGgq3O4JGgAZIaFps68KyVuz3RSWowT7a/JqaEGQHw8AZ1m5p2Y2rJNjcehAPzRY7l2E67fSO4wN3Cq4AAEhku/ZqEA9M76XFtpMklVeFYCIPHpMxygti4fACkUyjTNbID37wsBELl7b4UA4tPTUACmviEfAL7/IGqApuacAS5e+hsgiVy/YaUA3sHva1kvzeli2zoit++IExOR+w90ppn9Dnz+AgXg9nebu1ChAGSGgQLwhw7n1qrIxra1UxUe4HITtuLCA+B2asu28PkLUPeqqgojAbpmB+2rXvras7VCJ9kEbv9TqSjxN28LAGArjn/4mJiZkb6HZACUSCSTdZ2RmJnJDqCqYjBoPgBV5TfgWDP0Hm0SQHhwyHwActNm/vCRRXG9fVx3D7evi23vYFpamYZGuraO3rFTT7V1TEOj/hdsqtLLNDVz3QcoT1UBIvTfyAJALQsAtSwA1LIAUMsCQC0LALUsANRa9QC/AVjYN7+D2LKVAAAAAElFTkSuQmCC",
    wikiIcon: "data:image/png;base64,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",
    jdIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAQCSURBVGhD7ZhbSBRRGMfPzM5uu+7qesvdzFZLLTVrM7sQGBSUroF2oSIqgpSKHoUuUPZQkaESdJGKMhCkSJJ6UpCKArvZzUsGaaZppZWKreuue5mZ08YexrRxZncNZxbm97LftzPMnP85/3PmnA97DTQgkMHRb8AS8ALGLJQOLZ4gIHiDBXsCyUJCIwkQGkmA0EgChEYSIDSSAKEJeAF+7Ubh8Pfc6K+1niQhtPNVQqzckzDAwarmqHwSZSxgUbOxBUmKpSvVq9dGrlmmCZNj6IpXCL8bhT+/0fUP7ReKBreub4sMa8w9/Pl5HwXRVe8Ri4XomisDGYlNpsK+HrtPKqbFQjpTyPFMOXMLRdK2YfJHj7P1rbOu9Z/mGlS3apO2x8k4LcVYaFoErDi3sP6AivAk46Fto81138pKzBXv/lKCEyVPUwsWEZP7QzQnMjxIlbY54cZTY8dNzSqmMTR5JON9xRfaCzOJZA7gxNyNCx61Re+PQX8AyrVv06d2B68EsUxiN5h8VvSlx7otKpSDNvPeazYXSiZDRAL+QOhjrpYrmFJbQ1FXwwj3IIhMgHscIjbMPTIPJcDiOP/ERaOEFdEJAECu3pMvQzGANZXmUa4xEKEAgOtNqjgUA2fD4BeOHYkoBQBiljYZhQB8d3RxDYEoBWAzlAb0nXJDf+aax6IUAHBZiBqF7mkwwrWUilMAhM4x32NKZkqzIE4BFNk/hEK3gJlKjn2dKAVQZksXhWKgIuZrAkwAtH+0NKEYgNSQOQoUsuGXAEjTTAcBGYb5dBjkBVKtlc5RlICUzPBQrkb6NwIkybwAKGW+nWb5oH/1l1Yx6ya+c0fQxLPGOPwSQA07BlAIQIRS/R99CMnW0r57zPiuiswzcD/dn3dD59fRNhSD2CSV6r+NALS8+LjtIrN5ww+VRkdxraFu/BFAd951MX1kXBfEelb0HWhp6sjJtHagFMTmGQoXE3yd47sAaB0qu8N4lNixlPcdXkA5W66/X5ZhrmcebNTWFEcE8zfPVwGQbDrbU25GmSJblxU+lfZDymp7dbt9V1pLWoGd6XuQrKmvTUj2ypo8VQl73dX+YJMu3aCYgdHW3qHqs915FWMePdVoPJbIWv8YV5XQ52hPmxSMmWkS2syu3m7Hu9eOmuaJGzV9dsT9irgUNXfrvS2rjBQt/nCiEyUTWF6Y+PiodpLPPG9pkQ1cdvDyvOKdWi+WtSmXVYwHDbWHJ2u974QR+0/HtPctKdvtTev/hu9uFn8YFCerk5+VRIXzLHCcYFhsvCxrY9DxM7oHL1Ot3UuuFOjjeWzDil+VOREgmsrclJEECI0kQGgkAUIjCRAaSYDQSAKEZmw3GqBIFhIWAH4DD9ZjsqVbIzoAAAAASUVORK5CYII=",
    eBayIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD+UlEQVRoge2XX2hbVRzH067isAzUBwfqgzL/zDHoZCqis2wgA4U9iVNB9qJSURHG1idhwhBBVkTUh01EER2CVEHRPVgVhk/Dm6Rt/jRpbZe/Tdo0Jk2afze99+NDb3pzb07S0jU9iPfwewi/3+/8zvdzzsk557pQXP9pk6/AAZCtwAGQrcABkK3AAZCtwAGQrcABkK3AAZCtwAGQrcABkK3AAdj5UZc+R6+YVk/h6W9J66XstaRFXiE+jO/+7gAEBoifNSw0KM7x9OPfT3CAmWdBo7lFh+zJMycsCZUQ7j78D+DZ3R2A6JA5WOoDezT4MIUx9DrtWiWA0mPpUvzTkjB7sstbqAOA/yG0lbbS19v0cbNL6AlLqORG6ZUHkPnMDCWG8e5h9nkBQP4Xs0vuR0to5pkOQ3cfoKSYofHbDGc900Kg4X8QxYX/gOUfUrzaeegd2EL7CQwYtr4TanHBIix+iuJi6Ysml07oyA0A+PYRHSJzieUxypPUIqhp6gvUYlQCFK+y9BXxMwQPE33dAjB5F6n3yI2y9CV/n8Ddx+xzZC5SGKP0FyUPek0AoBUJHLSE8j9vOHdtAsFDFH4HXTCMsGlF83fuB+qLlqia2GydWqy5KMFDWwIID6KV7aXVBPHThI8Reoq5lyn80VFHhJJH4C+PM3+e2NusZhsuve00Zb/dzO5tdfVSnW4ppuE/YElz91GeFA+sJo2bNfuN1Z/Cc4vRvTrX0F8hf0VQRFdbL93NAQQPi2Y0Juicudhm5i4bCbbjMn/F7KsmG0Kr9lN/rWUubfL8aHHNvSSej0rYbqs5MUD6Q6NU6IjFX/jN8HtvNW9lvYrSw/KvlkytzOTdWwW4fkosa/Mt3ThGpx6z+FcL+O7BvYv0SNPUVFF6iL4pRt0KwOxJgaZalIm9nSwxbCav3wNTj9rr6CpaAb1Oxd/wrOK+megblrTlsRsACBwUAGgruG+yZ0bfIvkuyXMkz5H/qWkFLjQAHheU0lUir7HwkemZuHNbAZQeKkHBwHMvWNIm7kCrCNKAhY+NnPAx07lyjdT7xE7j24fiwncv4aOGefq3F8BF+Ch6tWURSsyfZ/ppQoNEXhVDrrV/vmucBy+azvRIJx3bDLC2+s2PsA1b84lUi+DeheJi8RPT2frJ0l2Atb009QjJd8iNUvKizqMV0WvoNbQiaoKVa2QvEz9LcMDyFgJyo6RHml41Or77dh6gDZXt08lQ0PQatb3mgezXG5T17Gb8dtO8e7oH0Mamj5P73rDQk1w/RXkCrYQaJ32h9UN2G61bdXfM5CtwAGQrcABkK3AAZCtwAGQrcABkK3AAZCtwAGQrcABkK3AAZCv4vwP8CyqoTA3RSbNfAAAAAElFTkSuQmCC",
    doubanIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAEOSURBVFhH7ZI/C4FRGMXNNqsMNoPB5BuZZVMymERZfA+DkiKRjyBS/iySKIOMyvBwuLfe9zpEb+9Fvad+y7nnee7pdkOhfES+CjVtQk2bUNMmprE6rMUvYbd5X1Ag+IRPC4y2E/Vw3oVd7I4b1LzyUwVm+6WUepWPwIyW5wLNaZtmXoEZraDA/xf4+if0qv8soOnM+2qNyPq4kXgl9RJktDDLdrqgpoNMI6vW3ZWopWkO4MwpzLKcC2o6iJWTat1duVaB5gDOnMIsy7mgpsF4N1UrRbqLAc0AnGlhhmUeoKZBdVhXa0VO55OEi9GHDDycaWHGzFBMw2+Z9wUF3voDvkJNm1DTJtS0CTWtEZELQLQd2odfLaoAAAAASUVORK5CYII=",
    amazonIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAACXBIWXMAAC4jAAAuIwF4pT92AAAEmUlEQVRo3u2aaUxcVRTHGWqRYmukaWuj0RibWhu3tNKiJNpiQmKMhrSpMWoNNU2qJLVp1FQpNcYvxhA/aOIShqUDlAKlzAAjLcuwlU3ApiWUYlmn7DsUBhiW4eeXQQK8OwwzwBuSd3M/TOadd+//996955x78twId1vX3U0BUAAUAAVAAVAAFICFPXYHWh/0h9EfQutD3M71ABC9mfwgmrWM97C4mfswppJ/guhHXA8gahOV3zExiD3N3E/Zl0Q85DIAibsZuMNyW0cBGm8XAEh6jrEuHGudhSvyHpxbOYN3caaVnJYVoOK8zbXex8AdzAO2bB40oFbJBBDhwXi3tKyuYtL8rMrU7mS9x2i7kCFpj0wAGQHSgtqyiPRYaKz1gRlp+5xjMgH8872UnBkSdknb95QLtsEZmQB0B2i5ztA9LOY5Nd1lQvt7GmmAihC544DanUtPkOpH7ofEPy00q/ldGqDywjpJ5mr+EACEuiRAzDbS/Mj7mPJzVP9K/SVGjIIldN5lAOJ2UhxMsxZT6zJimUsAXH2JhgQsk44EY5kBIjZSFcbMtOPZhJwAkQ/TkmFH/jyA6T6Tw64HUKsWih7toDKUlP1EbVrCC8kGoPcXqq+PI3qLvW5UNoC2HEEuZEDtLmF/909XAoh9XJicpb6+zFRCFoDsI9JqJoelH3+4G20GV4rEZV9JqxluFPgrDyaGpG+p+lkOgJs/SKsZ75W2z/3I1uleBoCKEKGgK3sXHZ29GG4UhwmLk4cyh27L+0Sopyll3jaI9KQ5ZYlI124Q7pzVAkh63pag1kyuv4POl6LPGKy1K6Fw4lTg6LtzoJhlow03rTlA/vHlSZyZojZS4HxHuPb2mgOoVRh19qqfHiP7KOFu1Mctypo60b46Gx+3U/4tnTcY62JmiplpRttpuEzsdkcBIjai9xfWk6O8MKYurX7oX7T75yrYfbfmLvVXc/kZ66WCT8UZa6ijAOUhAGOd3DglXcdUqygIEu7UBw2UniXSc+Fps6cSoOUaFx+dHWcDlgnhI7j9k6MA6W8yNWYdZbCGrEBBJVBF8gsUBFH+DRUhlJwmK5CEZ4VlwyhPUvah3jDvz6xAioLJCODKXuKfJGEXox32lFDtqP/8PxDQXUpGAOGq1SleqNAdQOtjPS1Nz1acdAed28TxT9F7c9477S4l811nos/CrnmMomD6b1vH1/vz11vW36ZW2xPZWUn3oi5GYneWniVmm+O6L27B8D5NyUyPzatPpr9BzW925tvLma/wJFOmRbnMJC0ZFJ2a8ydLitYfovIC7bkSG9fcR/ZRIj0Y7wUYMRK9eUXjQOJuuoqF7sLUijGdqjBKzpB3nJxjGD6g8CTl56j+hft6hurAIgp11MURu4NwN1L2AUyZ0PmuQiBTu1P0Oea+lUwl2g2k+s6bouAEV19ezUis8ebWj0yOOKXbMkFjIqmvyVfY0njz99cM1S4zL5qmo5CSL2znCGtYWlSruPoKlaG0ZgqX1ng37blUhZF9BM1W1/7UQLOV5BdJ80N/GN1BkvYs6UmUjz0UAAVAAVAAFAAFYL32/wDDp7bQ08tZUQAAAABJRU5ErkJggg==",
    youkuIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADwklEQVR4nO2bW0hVQRSGv+QgImE+nEoKQqQkpCBCegifQkIiKoIgfIhIoQi6GBHVW0FPFlISEQjRayFhEl1FJHopIioiiq5EQVfRMK9ZDzO7vc64zzlbBZcd54fhzMxaM7PWf2avNewLzHDMiujLB4qm2pApQi8wlE5YADQD/cCfHC391seCKAKap4GBU1WaA6eDSyAf6EnHTA5iAJgDDOXZjiJmjvNgfC0CyMuimPPwBGgboA1PgLYB2vAEaBugDU+AtgHa8ARoG6ANT4C2AdrwBGgboA1PgLYB2ohDQC8wkkH+KYt8WiMbAfsw986WAF8i5MeBhcB84InoHwV+kOEW9HRDkui7p6VC56gj6wZmC/lZ4AOwg/C5QgJYA3SJcS+AQ8BdZ75hoB5YC7wGTgDrgZuOXoftbwQ+A7XAXjte6rUBG4BraXxLxiGgXuiUOIs0CVkCaAfmEY084JwdV2X7ypy1uoS+XHel0LmMuYMdpdfpzLfI9i+eDAFPHUdabf9vO3GATUC5aK/CELRN9CWAx4S7qthZq92ZL0C5lV8g9ZItBw6IdpszX7Htn5fGtyRkjwHLgGrRPm9/bwGvRP9S4KWtr8Bs7/3AReCw7R8BTmdZLwqjwBmgztbB7IpOUnfDhBAnCzSI+h3gDeLJCrDamafOMWynqN8ndCIu3mGCcTBuHeZyWTDOeSIRh4Aawu09ChwBbgh5A6lOuQ9YCkU9rvPSLjfFVjhzTgpxCMgD9oj2JUJHSjHX63Ihb3PGXxV1GSdcMgZEXe6gBZjMEOAksAX4hYkrUeNHCVOw1EmLdEEwKD8Jg4pEk5DLDLALuIdJjTJVtgKVot1hxw+SGvgaRX0xJvvsdtautPMHqAH6CANmgOo0PsXKArLIiAuGkB4hv07moFRr9WQgTGACbYnj2HPRlmmsmdR/9BSpZ5UiwvQHZvdO6hwgyzPHoYMROg8w21UaWYrZKb8JU+gxxr6EkcCQ9B3zHL/M9m931riOuSySdr33wGbGkl8BXMngz7gJcP+59xl0+4C3wNcMOoPAQ+A2Jqp3R8g/xrArKP2YnfMoy7oTImCY1K22dRyGTdcS6yAU4BImHwdoSKP33yEuATK1VWGOujmBuARsxASZQkzkzRkE7wglMYEjE3oxB4yo88D/iLnAt1inJIucfHfQ3xPUNkAbngBtA7ThCdA2QBueAG0DtOEJ0DZAG54AbQO04QnQNkAbngBtA7ThCbC/vaQ+W8t1DGB8/kfAENCiZs7Uo4WI95dm5Kez/uPpmY6/mlsYlHZ+rzYAAAAASUVORK5CYII=",
    youtubeIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAACXBIWXMAAAsTAAALEwEAmpwYAAADRUlEQVRoge3Z2U8TQRwHcP62pSAmZqkcQZCbUkAK5SxQ5SqSUvDAByOJCRojRuOjJsYjSkTBqPGIxngF3e0e0261BXqwu+yMD0tijHLs7DYDcX/5PTXpzPfTTWd2d3IYmtrXnUM8gQ0gncAGkE5gA0gnsAGkE9gA0glsAOkENsDod5wOtiifqy7m648IzVVihxv0tgKfB/S1g752MNAB/J1/tP753+3ziF3NQmsd76rg6su4qmK2KJ9xOrICiAz2JOcfKMw3LRGHqoKyVlBRNmKS/PVT8uE9saPJGkBi7lL2Em+HUVVpYsQsAPS1IQiJABBCMJPhXeWmAOvv3pBKr9fanVv4AKGlhuDPr5eWTLIlBZiA+OwM2fR6RYZ8mID00gLp8AghlLh+BROgChzGfOnni0jTLASknz3FAjgdUFUx5hO9jWJPq/J92SqAwjI4AK66BG8+0dvI0BRbfCBx7TJULNj1YCaNAxC9bjOAzXWsrWH9w3vTAhguO2QYEBnymQcwNMU4835ePK+lU2YIXH2ZYYAUGrUGQFMMTfGNRzOvX2IDxK4W44DJAC7A/e8xC3Nj0yFtbRVjTNDTahgQOzVuMUBfG2pLU4uPDQN6PcYBp7MC0C+FFApoibgBAM4VODuRLQBNRU50qxGwLwHhCnrt7m2jWzUW4EzQckB0fHBDimKMifcnPmkhgKstTS08wr45F9tdhgFScMgaQGHuj3MhbXUFbzS9cDYy4POYB/BNlWb2r82CMFxRaBjAuyvNANjDefHZGZjJmE2PEJTXt1kVtgSwJQV4t/Wi1y16G+XPH81H10vlwzgAhqZUIGDMl3oyj/cgsVWlXyxhAvbII+XKzTlMQHz2AunwCCEUDfgxAUJbA+nwCMryNk8zOwAYOlde/kIWkJy/v23Cnd7MRQN+gumhoggtNaYADE0lblwlE1/TYtOhHePt6vW6FBzOvH21EZOgLGc7NpRlVeDTSwtgoGM32QwecDgdbMlBrq6Mb64C3cdAvzdyvCs65peCw9JkQJoa27InRn53aFSaGpOCQ9FhH/B3gn4v8HmEtgbeVREup1mDZxz/4RHTHmsbQLptAOm2AaTbBpBuG0C6bQDp3veAX5Y5FwgEHimSAAAAAElFTkSuQmCC",
    tiebaIcon: "data:image/png;base64,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",
    inSiteIcon: 'data:image/png;base64,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',
    settingIcon: "data:image/png;base64,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",
    tipDown: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAXElEQVQYlYXMsQ5AQBREUSoVjQ+f+S0lSi2livJlr4ZEZDcmud3JVJIW2yPQVqXZPmwjaQXqEuJJ0vCLbrgDfRZFxBsH0GTRCybbcxF9HhPQZdEHbkUUEUg6JU0Xm2KvCU6v27kAAAAASUVORK5CYII=",
    BaiKe: "data:image/x-icon;base64,AAABAAEAQEAAAAEAIAAoQgAAFgAAACgAAABAAAAAgAAAAAEAIAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Kv///4/////V////8/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////P////V////j////yoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8G////lf////3////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9////lf///wYAAAAAAAAAAAAAAAD///8G////vf////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+9////BgAAAAAAAAAA////lf///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////5UAAAAA////Kv////3////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9////Kv///4////////////////////////////////////////////////////////////////////////////3y8f/2vLn/8JSP/+2Efv/tg33/74yH//Gcl//0s7D/+M7M//3x8P///////////////////////////////////////////////////////////////////////e/v//jNy//0sq7/8ZuX/+6Lhv/tg33/7YR+//CVkf/2vrz//vT0/////////////////////////////////////////////////////////////////////////////////////4/////V/////////////////////////////////////////////////////////////////Ojn/+2Aev/iOC//4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/5UtD/+t3cf/xn5v/9sC9//ve3P/86+r//vPy//zq6f/63Nv/9r68//GdmP/rdG7/5UhA/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+M7Mv/uhYD//ezr///////////////////////////////////////////////////////////////////////////V////8///////////////////////////////////////////////////////////9bay/+M9NP/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+NAOP/2vrz/////////////////////////////////////////////////////////////////////8///////////////////////////////////////////////////////////9LCs/+IzKv/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4jYt//W6t///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+tzb/+I2Lf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/iOTD/++Tj/////////////////////////////////////////////////////////////////////////////////////////////////////////////////+ljXP/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+I+Nv/sfXf/8qmm//W7uP/1wb7/9cG+//XBvv/1wb7/9cG+//XBvv/sgXz/4TIp/+EyKf/hMin/4TIp/+VNRf/vko3/87Gt//XBvv/1wb7/9cG+//XBvv/1wb7/9cG+//XBvv/xpKD/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+pvaP////////////////////////////////////////////////////////////////////////////////////////////////////////////rb2f/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+p0bv/86+r/////////////////////////////////////////////////8aSg/+EyKf/hMin/4TIp/+yAe//++Pj/////////////////////////////////////////////////+NXT/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin//Obl///////////////////////////////////////////////////////////////////////////////////////////////////////xm5f/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp//Ccl/////////////////////////////////////////////////////////////GkoP/hMin/4TIp/+RKQ//99/f///////////////////////////////////////////////////////jV0//hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp//Kmov//////////////////////////////////////////////////////////////////////////////////////////////////////6WRe/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+ZXUP/++/v///////////////////////76+f/99PT//fT0//329v/////////////////xpKD/4TIp/+EyKf/sgXz///////////////////////309P/98vL//fLy//3y8v/+/v7////////////41dP/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/rcGr//////////////////////////////////////////////////////////////////////////////////////////////////////+ZTS//hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/3ycf/////////////////+dbU/+dcVf/hNCv/4TIp/+EyKf/nX1j/////////////////8aSg/+EyKf/hMin/8J2Z/////////////////+2Ggf/hMin/4TIp/+EyKf/hMin/++bk////////////+NXT/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/6F9Y///////////////////////////////////////////////////////////////////////////////////////////////////////kRDz/4TIp/+EyKf/hMin/4TIp/+EyKf/iPTT//vz8/////////////O/v/+NBOP/hMin/4TIp/+EyKf/hMin/519Y//////////////////GkoP/hMin/4TIp//Ghnf/////////////////lTUX/4TIp/+EyKf/hMin/4TIp//vm5P////////////jV0//hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+ZQSf//////////////////////////////////////////////////////////////////////////////////////////////////////5UtE/+EyKf/hMin/4TIp/+EyKf/hMin/5lZP//////////////////Oyr//hMin/4TIp/+EyKf/hMin/4TIp/+dfWP/////////////////xpKD/4TIp/+EyKf/xoZ3/////////////////5EhA/+EyKf/hMin/4TIp/+EyKf/75uT////////////41dP/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/nV1D//////////////////////////////////////////////////////////////////////////////////////////////////////+twav/hMin/4TIp/+EyKf/hMin/4TIp/+dfV//////////////////ypqL/4TIp/+EyKf/hMin/4TIp/+EyKf/nX1j/////////////////8aSg/+EyKf/hMin/8aGd/////////////////+RIQP/hMin/4TIp/+EyKf/hMin/++bk////////////+NXT/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/7Hx3///////////////////////////////////////////////////////////////////////////////////////////////////////xnpr/4TIp/+EyKf/hMin/4TIp/+EyKf/kSkP/////////////////+dfV/+EyKf/hMin/4TIp/+EyKf/hMin/519Y//////////////////GkoP/hMin/4TIp//Ghnf/////////////////kSED/4TIp/+EyKf/hMin/4TIp//vm5P////////////jV0//hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp//Oqp////////////////////////////////////////////////////////////////////////////////////////////////////////e7t/+I4L//hMin/4TIp/+EyKf/hMin/4TIp//vm5P/////////////////vlJD/4TIp/+EyKf/hMin/4TIp/+dfWP/////////////////xpKD/4TIp/+EyKf/xoZ3/////////////////5EhA/+EyKf/hMin/4TIp/+EyKf/75uT////////////41dP/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+M9NP/+9fX////////////////////////////////////////////////////////////////////////////////////////////////////////////uiYT/4TIp/+EyKf/hMin/4TIp/+EyKf/sgXz///////////////////////nc2v/zsq//8qyo//KsqP/1vrv/////////////////8aSg/+EyKf/hMin/8aGd/////////////////+RIQP/hMin/4TIp/+EyKf/hMin/++bk////////////+NXT/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/wlZH//////////////////////////////////////////////////////////////////////////////////////////////////////////////////vf2/+ZQSf/hMin/4TIp/+EyKf/hMin/4TIp//fJxv////////////////////////////////////////////////////////////GkoP/hMin/4TIp//Ghnf/////////////////kSED/4TIp/+EyKf/hMin/4TIp//vm5P////////////jV0//hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/nWFH///v6///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////63dv/5EI5/+EyKf/hMin/4TIp/+EyKf/jQDj/9Le0///////////////////////////////////////////////////////xpKD/4TIp/+EyKf/xoZ3/////////////////5EhA/+EyKf/hMin/4TIp/+EyKf/75uT////////////41dP/4TIp/+EyKf/hMin/4TIp/+EyKf/kRz7/++Tj//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////nW1f/kQzv/4TIp/+EyKf/hMin/4TIp/+EyKf/qcWv/9sXC//3x8P//////////////////////////////////////8aSg/+EyKf/hMin/8aGd/////////////////+RIQP/hMin/4TIp/+EyKf/hMin/++bk////////////+NXT/+EyKf/hMin/4TIp/+EyKf/lSED/+97c////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////++Tj/+dVTv/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TUs/+E3Lv/hNy7/6GNd//////////////////GkoP/hMin/4TIp/+NCOf/lT0j/5U9I/+VPSP/hNSz/4TIp/+EyKf/hMin/4TIp/+RMRP/lT0j/5U9I/+RJQf/hMin/4TIp/+EyKf/nW1T//Orp///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+9/b/7Hhy/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+dfV//////////////////xpKD/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/tgXz///r6///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////xmpb/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/nX1f/////////////////8aSg/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+I0K//ypKD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////W2s//iNy//4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/519X//////////////////GkoP/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+M6Mf/2v7z/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+MvJ/+M/Nv/hMin/4TIp/+EyKf/hMin/4TIp/+dfV//////////////////xpKD/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+RDOv/509H////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////50tD/4zsz/+EyKf/hMin/4TIp/+EyKf/mWVL/++Pi//vj4v/74+L/75SQ/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+NAOP/62tj/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////++Tj//Syr//zp6P/9LSx//zn5f////////////////////////////jKyP/iOTD/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+M8NP/509H////////////////////////////74+L/9LKv//Ono//1tbH//Ofm///////////////////////////////////////////////////////////////////////////////////////////////////////97u3/63Zw/+IzKv/hMin/4TIp/+EyKf/iMyr/7Hx2//719f//////////////////////9LOw/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/2v7z///////////////////////3x8P/rdW//4TIp/+EyKf/hMin/4TIp/+I0K//sfHf//vPy///////////////////////////////////////////////////////////////////////////////////////97+//5k9H/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/oYVr///z8///////////////////////senT/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/uhYD///////////////////////74+P/nWFH/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+dVTv/+9fX/////////////////////////////////////////////////////////////////////////////////7YR+/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp//KkoP///////////////////////vPz/+VMRP/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/mU0z//vj4///////////////////////wmJP/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/75CL////////////////////////////////////////////////////////////////////////////+dbU/+I0K//hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/nW1P////////////////////////////51dP/4jgv/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/jPDT/+t3b////////////////////////////5k9H/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+I3Lv/7397//////////////////////////////////////////////////////////////////////+2Ae//hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp//zp6P////////////////////////////SvrP/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/9bu4////////////////////////////+97c/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/742H///////////////////////////////////////////////////////////////////////mT0j/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/2wb7/////////////////////////////////9LGt/+I4L//hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/jOzP/9bq2//////////////////////////////////W1sf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+dbVP//////////////////////////////////////////////////////////////////////4zox/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/9r26///////////////////////////////////////51tT/6WNc/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/paGH/+tzb///////////////////////////////////////0sa3/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/kRj7//////////////////////////////////////////////////////////////////////+RDOv/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp//W6tv/////////////////////////////////////////////////51tT/8JSP/+x4c//pZV7/7Hp0//CWkv/629n/////////////////////////////////////////////////862q/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/5k9H///////////////////////////////////////////////////////////////////////oXlf/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/4z83///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////fDwf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+lpY///////////////////////////////////////////////////////////////////////7Hlz/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/iOTD///v6///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+8/P/4jQr/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/uhYD///////////////////////////////////////////////////////////////////////a+u//hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/6mtk/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+hfWP/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/+MrH/////////////////////////////////////////////////////////////////////////v7/5lFJ/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp//nS0P/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3xsT/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/51tU//////////////////////////////////////////////////////////////////////////////////a8uf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+x6dP/////////////////+8/P/8JmU/+dbU//kQjn/5EU9/+puaP/3xsT/////////////////////////////////////////////////9sC9/+prZP/kQzv/5EM6/+heV//xnpr//vb1/////////////////+puaP/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4jQr//fGxP//////////////////////////////////////////////////////////////////////////////////////8qSg/+I0K//hMin/4TIp/+EyKf/hMin/4TIp/+heV//+8/P////////////51NL/5EQ8/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp//CUj///////////////////////////////////////7omD/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+VJQf/629r////////////97+//51dP/+EyKf/hMin/4TIp/+EyKf/hMin/4jcu//Otqv/////////////////////////////////////////////////////////////////////////////////////////////////509H/63Rt/+NAOP/iNi3/5k9I//GdmP//+/r////////////75OP/4z41/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/9r26////////////////////////////9LGt/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/5EM6//3r6/////////////74+P/wl5L/5U1F/+I1LP/kQzr/7Hhz//rY1v//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6mpj/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+hcVf///////////////////////////+ZQSf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/rdnD/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+tva/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/++Pi//////////////////rY1v/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4jQr//zm5f////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////KhnP/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp//Klov/////////////////xmZX/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/zran////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////seXP/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/vkIv/////////////////7YR+/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/7oWA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6mxm/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/7YB6/////////////////+t0bf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+x4c////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+txa//hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+x5c//////////////////qbWf/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/sfXj////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////uiYP/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/wl5L/////////////////7ouG/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/8JWR////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9bi1/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/9bi1//////////////////Otqf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp//fEwf////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////709P/kQjn/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4jQr//vj4v/////////////////62df/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+VJQf//+fn/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8qSg/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+x7df///////////////////////////+pvaP/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/0sKz///////////////////////////////////////////////////////////////////////////////////////////////////////////P////////////////////////////////////////////////////////////////////////////////////////////6+v/mUUn/4TIp/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+I2Lf/74eD////////////////////////////619b/4jMq/+EyKf/hMin/4TIp/+EyKf/hMin/4TIp/+EyKf/nWlP///39//////////////////////////////////////////////////////////////////////////////////////////////////////P////V/////////////////////////////////////////////////////////////////////////////////////////////////Ofl/+ZTS//hMin/4TIp/+EyKf/hMin/4TIp/+I2Lf/1t7T///////////////////////////////////////Otqf/iNCv/4TIp/+EyKf/hMin/4TIp/+EyKf/nWFH//ezr///////////////////////////////////////////////////////////////////////////////////////////////////////////V////j//////////////////////////////////////////////////////////////////////////////////////////////////////+9/f/8Z6a/+dXT//jOjH/5EQ8/+x4c//62tj/////////////////////////////////////////////////+dTS/+t0bv/kQzr/4zox/+dZUv/ypKD///r6////////////////////////////////////////////////////////////////////////////////////////////////////////////////j////yr////9/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f///yoAAAAA////lf///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////5UAAAAAAAAAAP///wb///+9/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////73///8GAAAAAAAAAAAAAAAA////Bv///5X////9/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f///5X///8GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Kv///4/////V////8/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////P////V////j////yoAAAAAAAAAAAAAAAAAAAAA+AAAAAAAAB/gAAAAAAAAB8AAAAAAAAADgAAAAAAAAAGAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAABgAAAAAAAAAHAAAAAAAAAA+AAAAAAAAAH+AAAAAAAAB8=",
    ZhengZhe: "data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAD/oWH//72P//+9j///vY///72P//+9j///vY///72P//+9j///vY///72P//+9j///vY///72P//+9j///oWH//72P///16///9ev///Xr///16///9ev///Xr///16///9ev///Xr///16///9ev///Xr///16///9ev//72P//+9j///9ev///Xr///16///kEb//82q///16///9ev//9W3//+FM///8+j///Xr///16///9ev///Xr//+9j///vY////Xr///16///9ev//4o7///Lpv//9ev///Xr///Vt///hTP///Po///16///9ev///Xr///16///vY///72P///16///9ev///Xr//+KO///y6b///Xr///16///1bf//4Uz///Em///xZ3//8Wd///izP//9ev//72P//+9j///9ev///Xr///16///ijv//8um///16///9ev//9W3//+FM///kkn//5NK//+TSv//zqz///Xr//+9j///vY////Xr///16v//8+j//4o7///Lpv//9ev///Xr///Vt///hTP///Po///16///9ev///Xr///16///vY///72P///16///yaP//7N///+KO///y6b///Hl///16///1bf//4Uz///JpP//y6b//8um///v4v//9ev//72P//+9j///9ev//8eg//+FM///hTP//7aE//+WT///7d7//9W3//+FM///iz7//4w+//+MPv//59X///Xr//+9j///vY////Xr///06v//oGD//4Uz///Dmf//kUf//653///Vt///hTP///Po///16///9ev///Xr///16///vY///72P///16///9ev//93E//+FM///xZz//9Kx//+FM///sn7//4Uz///Qr///07T//9O0///cwf//9ev//72P//+9j///9ev///Xr///16///o2X//5xZ///06v//nlz//4Uz//+IOP//iDj//4g4//+IOP//o2X///Xr//+9j///vY////Xr///16///9ev//9Gx//+FM///4sz//9Gw//+GNf//6Nb///Xr///16///9ev///Xr///16///vY///72P///16///9ev///Xr///y5v//xp7//+zc///z5///r3n//+PN///16///9ev///Xr///16///9ev//72P//+9j///9ev///Xr///16///9ev///Xr///16///9ev///Xr///16///9ev///Xr///16///9ev///Xr//+9j///oWH//72P//+9j///vY///72P//+9j///vY///72P//+9j///vY///72P//+9j///vY///72P//+9j///oWH/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==",
    tipUp: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAZElEQVQYlXXMIQ4CMBBE0UWhwHDw+ddCAhILEgWy4WNo0tAyyZidly1AwNba1CSvJOf6h/oduC/RAN7qfkJ9BC7VM6LhQ1O3E+pN8lAPNeYHHGsV4PkFN3WzREmuwEndLUFVfQC3Xa8Jl+92RAAAAABJRU5ErkJggg==",
    pending: "data:image/png;base64,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",
    pddIcon: "data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCANEBDgDASIAAhEBAxEB/8QAHAABAAICAwEAAAAAAAAAAAAAAAcIBQYCAwQB/8QARxAAAQMDAgIFCAkBBgYCAwEAAAECAwQFEQYHITESE0FykRU0NTZRVHGxCBQWFyIyUlOhYSMzYoGDwSQlQkNEknOCJmOik//EABwBAQABBQEBAAAAAAAAAAAAAAAFAQMEBgcCCP/EAEARAAEDAwEFBQQJAwQCAgMAAAABAgMEBREhBhIxUXETIjIzQRQVNJEWNVNhYmOBodEjNlJCscHwJOFDkiUmcv/aAAwDAQACEQMRAD8AtSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdc9RFTsV0z2sanaqgqiKq4Q7AajfNeWi1sVXTtcqdiKR7et6YMuZRMXh2qhYkqYo+KkvSWKuq9Y41wTgqonNUOt88TPzSNT/Mq3c92LzUSL1Lui34mDn17fJnZdVPT/ADMR1zjTgmSfi2Hq3Jl7kQtzPcqOD+9qGN+KnT5bt3vUfiU+qtWXep/vKqTxPN9oLl7zJ4ltbono0zWbBux3pdS5Xlu3e9R+I8t273qPxKa/aG5e8yeKn37Q3L3l/ipT3p+E9fQP80uT5bt3vUfiPLdu96j8Sm32huXvL/FR9obl7y/xUe9Pwj6B/mlyfLdu96j8R5bt3vUfiU2+0Ny95f4qPtDcveX+Kj3p+EfQP80uT5bt3vUfiPLdu96j8Sm32huXvL/FR9obl7y/xUe9Pwj6B/mlyfLdu96j8R5bt3vUfiU2+0Ny95f4qPtDcveX+Kj3p+EfQP8ANLk+W7d71H4jy3bveo/Ept9obl7y/wAVH2huXvL/ABUe9Pwj6B/mlyfLdu96j8R5bt3vUfiU2+0Ny95f4qPtDcveX+Kj3p+EfQP80uT5bt3vUfiPLdu96j8Sm32huXvL/FR9obl7y/xUe9Pwj6B/mlyfLdu96j8R5bt3vUfiU2+0Ny95f4qPtDcveX+Kj3p+EfQP80uT5bt3vUfiPLdu96j8Sm32huXvL/FR9obl7y/xUe9Pwj6B/mlyfLdu96j8R5bt3vUfiU2+0Ny95f4qPtDcveX+Kj3p+EfQP80uT5bt3vUfiPLdu96j8Sm32huXvL/FR9obl7y/xUe9Pwj6B/mlyfLdu96j8R5bt3vUfiU2+0Ny95f4qPtDcveX+Kj3p+EfQP8ANLk+W7d71H4jy3bveo/Ept9obl7y/wAVH2huXvL/ABUe9Pwj6B/mlyfLdu96j8R5bt3vUfiU2+0Ny95f4qPtDcveX+Kj3p+EfQP80uT5bt3vUfiPLdu96j8Sm32huXvL/FR9obl7y/xUe9Pwj6B/mlyfLdu96j8R5bt3vUfiU2+0Ny95f4qPtDcveX+Kj3p+EfQP80uT5bt3vUfiPLdu96j8Sm32huXvL/FR9obl7y/xUe9Pwj6B/mlyfLdu96j8R5bt3vUfiU2+0Ny95f4qPtDcveX+Kj3p+EfQP80uT5bt3vUfiPLdu96j8Sm32huXvL/FR9obl7y/xUe9Pwj6B/mlyfLdu96j8R5bt3vUfiU2+0Ny95f4qPtDcveX+Kj3p+EfQP8ANLk+W7d71H4jy3bveo/Ept9obl7y/wAVH2huXvL/ABUe9Pwj6B/mlyfLdu96j8R5bt3vUfiU2+0Ny95f4qPtDcveX+Kj3p+EfQP80uT5bt3vUfiPLdu96j8Sm32huXvL/FR9obl7y/xUe9Pwj6B/mlyfLdu96j8R5bt3vUfiU2+0Ny95f4qPtDcveX+Kj3p+EfQP80uT5bt3vUfiPLdu96j8Sm32huXvL/FR9obl7y/xUe9Pwj6B/mlyfLdu96j8R5bt3vUfiU2+0Ny95f4qPtDcveX+Kj3p+EfQP80uT5bt3vUfiPLdu96j8Sm32huXvL/FR9obl7y/xUe9Pwj6B/mlyfLdu96j8R5bt3vUfiU2+0Ny95f4qPtDcveX+Kj3p+EfQP8ANLk+W7d71H4jy3bveo/Ept9obl7y/wAVH2huXvL/ABUe9Pwj6B/mlyfLdu96j8R5bt3vUfiU2+0Ny95f4qPtDcveX+Kj3p+EfQP80uT5bt3vUfiPLdu96j8Sm32huXvD/FT59oLl7zJ4lfeif4j6B/ml0YbhSTJ/Zzsd8FO5k8T/AMr2r8FKZ02rrvTphlVIn+Z7KfX18hdlKl6/FT0l0Z6oY79hJ9dyRC4iKi8lQFV7ZuxeKeRvXO6Tfib3Z96qVUaysjXPtwXmXCF/FcEVVbIXCDVqb3Qm0GpWLXdpurE6M7WuXsVTaYZo5m9KJ7XJ7UMxr2u1aprs9LNTu3ZWqinYAD0WAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcZZGRMV0jka1O1Tw3m7UlppXz1crWNamcKpX7cPdSor5JKa2OVkScMovMx56lkCZcTFpslRc34jTDfVSUdY7kW6ysfHFI18ydmSDtUbl3W7ueyOR0ca8sKaNVVU1XKsk8jnuX2qdJCzVkkq6aIdStezNHQIiqm87mp31NZUVLldNK5yr7VOjABiY5mwo1GphAACp6AAKgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADABTCA76WsqKV6OglcxU9im9aa3OutqVjJXukYnPKkfA9Me+NctUxKmigqm7szEVC2Wj9x7beoo2SStZMqYxntN8je2RqOY5HNXtQovS1M1JKkkEjmOTiiopLu3W6c9FJHS3R6ujVcZUlae4ZXdkOfXnY1Y0Wai1Tl/BY0HhtF1pbrStnpJWvaqZ4Ke4lEVF1Q0B7HMcrXJhUAAKnkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGF1RqClsFukqKmRqKicEzzO/UN4p7LbZaqpejUamUz2lUtwdZ1epblJ/aOSlauGtReCmJV1SQN+82PZ+wvuku87SNOK/8HZrvXNbqKtk6Mjm0+fwtRTS+fFeYBAOc567zlOxU1NFSxpFEmEQAAoZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACcFynMApjIN30Fryt05Wxo+Rz6ZVw5qryLQ6Yv9Lf7fHU0r2qqpxRF5FJzdttdZVGnLmxr5XfVXKiK1V4IZtJWLEu4/gahtHs4yuYs8CYkT9y3QMfZLpT3egjqaZ6Oa5M8FMgTyKiplDkb2OjcrXJhUAAKnkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHXPMyCF0krkaxqZVVOwire3VqWq1LRU78TSpjgvItyyJExXKZtuoX19Q2BnqRrvHrZ96uT6OkkX6vEuOC8yLjlI50kjnvXLnLlVOJrUkjpXK9x3Sgoo6GBsESaIAAeTMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKKmQStsxrd9puDLfWyKtPIuEVV5FmIpGyxtexUVrkyioUTikdDK2SNVRzVyioWh2Y1a28WaOkqH5qIkxxXmStuqf/AInfoc32ysqJ/wCdCn/9fySaACXOdAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHludWyioZp3uREY1VKh7i36S+X+aRzlVrXKiE/b13pbdYHRMf0XvKsyPWSRznLlVXJDXKbKpGh03Yi3I2N1W5NV0Q4gAjDoAABUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2vbi/S2PUED2LhjnIimqHOGR0UzJGrhWrkNcrHI5PQsVMDaiJ0T0yioXlt9QlVRQzNXKPainoI+2cvi3XTzGSOy9iYwSCbPE9HsRyHBK6ldSVD4XeigAFwxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAea4z/AFaill/S3IKtarlREK477Xl9TeVpUcuGcCJkNn3FrFrdS1Mirn8SmsGrzv35XOO82enSmo440T0AAPBJgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC8gCigl/YW9up7p9UV3B/AsiU82yqlpNT070XCdJC3tJL11NHJ+pMk3bXq6PC+hyXbWlSKsSRqeJDuABImmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAw2sJuosFW/8AwKZk1jcZyt0xVY/Sp4kXDFUyqJu/UMavNCot9m6+61D/AGuU8B31vGrlVf1KdBq3FVU+gI0wxEQAAqewAAAAAAAAAAAAAAAAAAAAAAAAAAAACgAMvp/T1ffKjq6OFzk7VwenVOnJbA5jKjhI7sK7rt3exoY61USS9jvd7ka+DcbDoesvdndV0SK9zc8EQ1i5W+pt1Q6GridG9q4wpVWuamVTRSkVXDK90bHIrk4oeUAHkyQACoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB7bVa6u61LYKOJz3r7EKcVwh5c9rEVzlwiHiyDaNSaSqbDRskrEVsjuxTq0tpma/o9tOqq9OxD12b97dxqY3tsHZdtvd3ma4DK36w11kqVirIXN48FVOZijyuUXCmRHI2VqPYuUUAAqewAAAAAAAAAAAAAAAAAAAAAAAAAAAAADJ6bndBeKdzVwvTQuPpaVZrHSudzViFLrc5WV0Lk5o5C4ugpFk03SuX9CEna11chz3buNOzjebEACYOaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1bcn1Xqu6vyNpNW3J9V6rur8i3N4FMy3/ABUfVCn1b53L8TpO6t87l+J0mrod/Z4UAAKnoAAAAAAAAAAAAAAAAAAAAAAAAAZMrYrFXXqqbDSQudleeCiZVcIeJJGxtVz1wiGMjY+V6NjarnL2ISNoTbG4X2Rk1UxYqfOVymMoSZoDamltzI6m5tSSXn0FTKEsU8EVNEkcDGsYnJEJSnt2e9L8jn962yRuYaHVf8v4MHpjS1v09RtjpYm9JE4uxxIF35XN5b2cSzLvyr8Cs+/SYvDfiZFe1Gw4QiNkpnz3PtJFyqopvX0e1zYHNVMplTaNb7fW7UcD3dWkdRjg5ENY+j0n/IFX+qkvF2nY18CI5DAvVXLSXWSSF2FRSnusNDXLTtQ9JInPiReDkTgaiuUVUVMKXkudspLnTuirIWSNVMcUIN3D2mWNZKq0JlOK9Ej6m3qzvR8DcLJtfHU4hq+67n6KQaD1V9BUUEzo6mNzHIuOKHlI77jd2uRyZQAAqegAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgARFVcIiqeqgoaivnbFTRue5eHBMk07d7TrJ0Kq7phOCo1S5FC+ZcMQjLjdqa3M35nfp6kfaN0DctRTsVsasgVeLlTsLG6K0LbtOU7OjG18+OLlQ2W2W2mttO2GkiaxqJjgh7Ccp6NkOvFTlV52lqbkqsau6zl/JAP0hncI0RMIioYjYZ2LovbxMx9IZMNj+KfMw2w3pRfiYLvizbaf+3V6E56q0nb9RUbo6iJqSKnByIVz1ztvcLDNJLCxZKfOUVELXN/KnwOqrpYauJ0dRG17F4KioZ9RSMnTK8TTbPtFU2x26i7zOX8FFntdG5WvRUVOxT4WL3B2ogrEfVWpOhJz6KEDXqy1tnqXQ1cTmqi4zjgQk1O+BcOTQ6ta71TXJm9EuvqnqY0DILJLgAFQAAAAAAAAAAAAAAAAAAAAAAAAd9F53F3kLibeerFJ3EKd0XncXeQuJt56sUncQkbZ43Gg7d+RH1NlABNHMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAavuP6sVPdU2g1fcb1Zqe6pbl8CmZbvio+qFPazzqX4nSd1Z51L3jpNXO/s8KAAFT0AAAAAAAAAAAAAAAAAAABkpnAByijdK9GsaquXkiGRslkrbxUtio4XvVVxlEJ62+2phoWR1N0RHy88F6GnknXupoRF0vdNbWZlXXl6kc6E21rr1KyWqYscGc8ULD6X0nb7BTtbTwt6xE4uwZykpYaSJI4GNY1OHBDuJynpGQppxOUXfaGpuTlRVwzkAAZRABeSlZ9/PS7PiWYXkpWffz0uz4mDcPJU23Yz6wTob39Hr1fX4qS6RD9Hn1fd3lJeLtJ5LSO2k+speoPjmo5MORFT+p9BkkGaPrXb+336nkcyJrJ1TgqIV01foi46fqHo6Jz4c8HIhcM8F1tVJc6d0VVE16KnNUMKoomTapoptFl2nqLcqMf3mcv4KPLlFwqcQTduDtM+J0lVaEynNWoQzX0VRQTuhqo3RvRcYVCElhfCuHodUt10p7jHvwO/T1POAC2SIABUAAAAAAAAAAAAAAAAAAAAAAAAAAAABT1W6gqLjUtgpI3PevsQp9yHlzkamXaIeVMquETiblo7QVy1BO1ercyD9SoSHt9tIq9XV3hOPNGk32y201up2xU0bWI1McEJGmt7n96TRDR71thHT5io+87n6IapozQFusELHOja+dE4qqdpuzWo1MNRET+h9BMMY1iYahzSpq5qp6yTOyoAB7McgT6RH5Y/inzMLsL6Vd8TN/SI/u4+8nzMJsJ6Vd8SGf8AGHUab+3V6KWVTkgCckBMnLgazqvR9u1BTvbPC1JVTg7BswPLmo5MKXoKiSnekkS4VCquudtK6ySPlpmOkhzngnYR3LG+J6skarXJzRS89XSw1cTo52Ne1UxxQiHcTaqKtjkqrUiNl54Iipt6p3ovkdGsm2LZMQ1ui8/5K6AyF4tFZaKl0NZC5iouMqnMx5GcFwpvzHte1HNXKAAFT2AAAAAAAAAAAAAAAAAAAAAd9F53F3kLibeerFJ3EKd0XncXeQuJt56sUncQkbZ43Gg7d+RH1NlABNHMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAatuRw0vVd1fkbSatuT6r1XdX5FuXwKZlv8Aio+qFPqzzqXvHSd1Z51L3jpNXO/s8KAAFT0AAAAAAAAAAAAAAAADI2azVt3qWQ0cTnucuMohTVVwh4e9sbVc9cIhj2o57ka1FVV7EJC0HtrX3+ZktVG6Km5rlMZJK2/2lp6JkdVeWo+XmjF7CXqWnipYWxQMaxjUwiIhJ01vVe9L8jQb3tk2PMNDqv8Al/BgtL6Stun6VkdNC1XonF6pxNiAJdrUamGnOJp5J3q+VcqoAB6LQAAAXkpWffz0uz4lmF5KVn379Ls7xgXHyVNt2M+sE6G9fR59X3fFSXiIfo8+r7vipLxfpPKaR20n1lL1AAMggwAAD45qPaqORFQ0fW23lu1DA5WxNin5o5qcTeQeHxtkTDkMmlq5qR6SQuwqFOdY6KuOnKlySROdCi8HohqvJeJeG8Wiju1K6Csia9ip2oQVuFtJLTrJV2ZqujTirE7CFqKB0fej1Q6bZNr4qnENX3Xc/RSEwd9ZST0czoqiNzHNXC5Q6DAybsio5MoAAVKgAAAAAAAAAAAAAAAAAAAFAB24Q9FFRz1szY6eNz3KuOCEybfbSS1Cx1V5arY149Be0uRQvmXDEI64XSmt8e/O7H3epoGi9EXDUlUxGRuZAq/ieqdhY/RmgbZp6nZ0Ymvnxxc5OOTZbRaaS00rYKOFsbWp2Ie8m6aiZCmV1U5Vetpqi4uVjF3WcufUIiImETCAAzTWAAAAAACBPpEfkj7yGE2E9Ku+Jm/pEfkj7yGE2E9Ku+JCv+MOo039ur0UssnJAE5ICaOXAAAALxAANY1Xo22ahpnsqIWpIqcHonErnrzbq4adqHyQRulps8FRM4LZnTWUsFZA6Kpja+NyYVFQxKikZMnJTYbPtHU2xyJneZyX/goq5Fa7DkwvsUFhdwto4qlJKuyNRr+axohBV3tFZaah8NZE5itXGVQg5qd8C4cmh1a2XmmuTN6F2vqnqY8AFolgACoAAAAAAAAAAAAAAAO+i87i7yFxNvPVik7iFO6LzuLvIXE289WKTuISNs8bjQdu/Ij6mygAmjmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANW3J9V6rur8jaTVtyfVeq7q/Ity+BehmW/4qPqhT6s86l7x0ndWedS946TVzv7PCgABU9AAAAAAAAAAAFFUA5MY6R6NYiqq9iHus1oq7tUtipInPyuFVE5E87f7UwUrI6q5t6T+fRUvQ0751w3gRF0vNNbWb0q68vUjXRO3NffZo3zRujg7VVCxGkNG2/TtMxsMTVlROLlQ2Gio4KOFI6eNrGp7EPQTdPSMhTPFTld42jqbkqtzus5AAGWa6AAAAAAAAAF5KVn379Ls7xZheSlZ9+/S7O8YFx8pTbdjPrBOhvX0efV93xUl4iH6PPq+74qS8X6TymkdtJ9ZS9QADIIMEI7ibk19iv0lLCx3VsXGSbiN90NM2qro5aup6LZscDHqkerO4uFJuwSUzapEqmbyLoeLTm6dHU2h0tW9GzNTkqmnVm71bLeWxUrVWJX4NBj0lc6hZXUjHrAirhU9hu+2Wk6KatRK9USdq5wpGNmqJcN4G8S2q00TZJ1Te+7kTvpm4PuNqhnlaqOc3KmVciORUciKi9inTQ0sdJTsihREaicDvJpqKiYU5jM5rpFcxMIR9rvbmgv8AG+aKNsdRjmiYK76s0dcNP1D2yxOWJF4OwXJMZerLR3eB0dVE12U5qhhVNCyXVuimy2Xaiot6pHL3mf7FIuXBQTRuDtTLTOfU2tqubz6KEPVtHPRTOiqI3Mei4wqELLE+FcOQ6nb7nT3CPfhdn7vU6AAWyQAAKgAAAAAAAAAA+nooKGor52xU0bnvVccEyU+5Dy5yNTK8DzJlVRE5m26T0Rcr9UM6ETmxKvFyoSHt9tQ6RY6q6t4c+ipONqtVLbIGxUsTWoic0QkKe3uf3pNENJvW18VNmKk7zufohqeh9vbfp+Fr3xtknxxVUyb01qNREaiIidiH0EyyNsaYahzOqq5quRZJnZUwGotU2+xeeSI3/M81h1ra71N1VLK1XfE0Hfm0LJQ/W2uXhxwa1sNaXS131lXLhOww3VMiT9ljQ2aCy0b7Wtarl3k/3LFgJwREBnmoAAAAAAECfSI/JH3kMJsJ6Vd8TN/SI/JH3kMJsJ6Vd8SFk+MQ6jTf26vQssnJAE5ICaOXAAAAAAAAAA1bV+jbfqGmc2WJrZVTg5EwbSDy5qPTDi9T1ElM9JIlwqFTtb7c3CxTvfDG6SnTtRDQXtcxyteioqe0vPW0cFbC6Ooja9qpjihDW4m1LKjrKu1tw7n0UIipt6t70XyOk2TbBsuIazReZXwHuu1qq7VUuhq4nMVFxxTmeHJGcFwpvjHte3eauUAAB6AAKgAAAAAAAAA76LzuLvIXE289WKTuIU7ovO4u8hcTbz1YpO4hI2zxuNB278iPqbKACaOYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1bcn1Xqu6vyNpNW3J9V6rur8i3L4F6GZb/io+qFPqzzqXvHSd1Z51L3jpNXO/s8KAAFT0AAAAAAAD22q1Vl0qGw0cLpHL7EKaquEPL3tYm85cIeNrXPcjWoqqvYhv8AoXba5X+Vk1RG6GkVfzLzJE222oZTdXW3hqOfzRi9hM9NTxU0TY4GNYxEwiIhJU1vV3fl+RoV82wbFmCi1X/L+DXdKaMtun6ZjIIWLIicXYNnRMJhOQBMNajEw1Dm89RJUPWSV2VUA4yyMiYrpHI1qcVVSLNydz6WzwSUtseklUqKmUX8p5llbE3ecpfobfPXypFA3Km0611rbtNUrutla6fHBqLkiS3bwVUt7b1y4pnOxjJEt2utXdaqSerlc9z1yuVPAmUXKcCEmr5HuyzRDqVu2RpKeFWzJvOXiv8ABd6yXemu1FHPTytd0kyqIpklVETKqmCm2m9Z3SwuxTzOVidmTaavd+6zUzo25a5UxkzGXKNW97iaxVbEVTZcQqitJm3G1xTabonJFI11QvJEUjzSW8cj7h1d14ROXgq9hDd2utXdZ1lq5XPVexVPBy5czDkr5HP3m8DaKLZGkipuynTecvr/AAXjtNzpbpSsnpJWvY5M8FPaVD0Lruv01VMTrHPp88WqvYWW0jq+36io2SQStSVU4sySlNVtmTHBTQr3s5PbHbze8zn/ACbMvJSs+/fpdnxLLu/KvwKzb8rm7t7x4uHkqZexn1gnQ3z6PPDT6/1VSXiIfo9er6/FSXi7SeS0jdpPrKXqADzXCtgoKZ89S9GMamVVTJVcEI1quXdbxOdZVRUdM+ed6MjYmVVSIql9VrvUasp1clsidhV7HGq7hbiT3+6MtVterKZX9ByovMmbb6zx2mwQNaidJzUVVMLtEqX7jeCcTavYn2SmSpmT+q/wpyTn1MnarJSW+hbTxxNxjC8OZoWs9KzW6q8rWnKKxek5qEonXURNngfE9EVrkwuTIfE1zcEJSXGanm7TOc8c+prmiNRR3mgRrlxOzg5q88mzldNYXWp0Rq3raNypC52XMQmLQ2sKLU9vZJC9qTon4mZ4lqCoRy9m7xISN2s74WJWQpmJ2vQ2kAGUa8fHsa9qteiKi9imga524t9+gfJDG2OpxwVE5qSADxJG2RN1yGVSVs1HIkkLsKU11do65abqXMqYXLFng5Eyaz8S8N3tNJdaV8FZC17XJjihAW4u081C6Srs7VfFz6tOwhamgdH3o9UOnWTa6KrxDVd1/P0X+CGwdtTTzU0ro52OY5FwqKh1GBk3RFRUygABUqAAUAHwO6kpZquZsVPG573LhERCYtvNpJaxY6u8orI+fVqnM9xRPmXDEI+4XOnt8faTux93qR7pHRty1HUtbTwuSHPF6pgsboXbyg0/TsfLG2SpxlVVO02+02qktdKyCjhaxjUxwQ9xN01EyHVdVOV3ramouKrHH3WcvVep8Y1GNw1ERP6H0AzjVgAACN97UzpqVf6Kax9H/wDuXfE2TfCdkem5GuVMqi4NW+j9UxdB7Moj/YRr1T2tDeKVFXZ9+nqToACSNHAAAAAAIF+kSmGRd5DB7CelXfEzn0ivyRd5DB7CelXfEhX/ABiHUab+3V6KWWTkgCckBNHLgfHORqZcqIntVT5I9sbHPeuGomVK/wC7G5lU2umttqf0GN4K9O0szztgbvOJS1Wma6TdlD+q8idai7UNOuJaqJF7yHibqa1ulSNtSxzl9ilOJ7zcJ3q+SqlVV/xKb/tFZKy93hssssnVtXjlTAjuKyPRrWm11OxsNHA6aebgnIl7Wer5rfVQtpl/A5cZN2slS6rt0Mz+bmopD+6TYaKupIEX8SKiEr6VXNkpl/wIZcT3LI5FUgbjSxR0MMjE1XOplwAZRrwCoiphUygABqertD2zUMDutha2XHByIV11zt3ctOyvkZG6WlzwcnEtsdFbRwVkLoqiNr2KmMKhiVFGyZM8FNjs+0lTbVRqrvM5L/wUWVFauHIqL7FBYHcXaVk6SVlmajX81YnaQXdLXV2yodDWQujei44oQc0D4Vw5DqtsvFNcmb0LteXqeIAFolQACoAAAAAAO+i87i7yFxNvPVik7iFO6LzuLvIXE289WKTuISNs8bjQdu/Ij6mygAmjmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANW3ITOmKlP8K/I2k1fcb1Zqe6pbl8CmZb/AIqPqhT2s86l7x0ndWedS946TVzv7PCgABU9AAAA+ta57kaxMqvYhygjWadkac3Lgnrbna+mkp4K6sVr8ojscy5DC+dd1pGXO6wW2PtJl6Ee6J29uF/nY58bo4c8VVCxOkNE27T9MxI4mvmROLlTtNjoKGnoYWxU0bWNRMcEPSTdPRshTPFTlF42kqbk5Wou6zl/IRMJhAAZhrgPLcq6KgpnzTLhrUyeoxuoLa26W6WBVwrmqiFHZxoXIUYr0STh6kFbkbpS1LpKO2O6LUyiqQ1UTyVMzpZ3q57lyqqbPuBpmosN3lR7XdW5yqi4NUNZnke969odzs9JS09O1aVNF9eZ9xg+A+xtV70anauCzlCVUIiquE4qcpYJIsdYxW59pI2ituqu5yw1LsLFlFVCTNX7Yw1tqjSkYjZmt44MllHJI1XYNfq9pKOmnbC53Hj9xWoGx6q0tU6ffioVP6YNcLDkVq7richmZOxHxrlFGMmVsF9rLJWMnpJXN6K8W54KYrJ9RquciJxVTyjsLlOJ6kjZI1WvTKKWj263Egv0TKadcVGMLkjHflP+cMVF5qZ3ZPR0zXeUKhFanNDA774S7sROxSVle99Ll/E0G3U9LT3tWUvDGvU3z6Pa/wDIF+KkvkQ/R7T/AJAuPapLxn0nktNP2k+spepxkekcbnuXCNTKldd5ddS1VU+3UUitjTguFJv1pWrRWGpe383RKc3qd1Tc55HrlVcpi3GZWtRjfUn9i7YyeR1TImd3gdNHUOp6yKfOXNcji3+292bdtM0sqOy5GJkpypLeyms1tVV9QqpP7F68MryMKgmSKTdXgps+1tsdW0m/GneZr+hZU4VEiQwvkdyamVOmCup5oWyMmYrVTPMj/c/XFLa7dLTU8qOmeipwUnJJGxt3lU5VR0MtXMkLG6qQtu/dm3LUMiMVFRi4Nf0fqOr07doqmmkVGo5Ok3PBTEV9S+rq5JnrlzlydCmsvkVZFkQ7lT0McdKlK5MtxguxpW9RX2zwVkKovSanS+JmCF/o+XGV9sWlcqqxFUmg2Snk7SNHHE7xRJQ1j4U4IugABeIwHGRjZGq16I5q80U5ADgRvrrbOhvcb5qRjY5148OBXrVOkrhYKl7J4nKxF/MiFzTFX2xUV5pnRVULXKqc1QwKmhZLq3RTbbLtVUUKpHN3mfuhST4glfc7bptjR9VTOTq144IoRFVyN/rghZI3RO3XnU6GvhrokmhXKDiq4Q2jSejbjqCpY2KJ7Y1Xi5U4G8bZ7bR3ZkdXWORWc8ZJ/s1mo7TTsipIWs6KYyiGZTUDpO8/gavfNrI6NVhp0y/9kNQ0Rtvb7FEyWeNstRjiqpk39jWsajWoiInJEPoJqONsaYahzGrrJqyRZJnZUAA9mKAAADhNI2KNz3qiNamTmRlvFrFtltq0lM/NRKipw7C3LIkbVc4zKCikrp2wRpqpGe9Or0ude6hp3ZjYvFUNW221EtivkTnuVInLheJq1VJJNO+SVVVzlyuTqRVaqKi4VOSmtvnc6TtTttPaoYqP2NE7uNS8lor4rjQx1ELkVrkyewgbY/Wi8LbWyf0blSdnPZ1fSVyI1U5mxU8yTMRyHGrvbX26pdC7h6dDwuu9KlV9XSRqyezJkTXPs/Cla6ta5XO5oau3VlwTVC0SxL1CLjpYKrJueP1DKBKnPs6+FMrkksHlhroH9FvWs6a9mT1F3JGuareJAv0iVyyLvIYTYT0q74ma+kQv4Y+8hhdhPSrviQr/AIw6fTf26vRSyqckATkgJo5cYXWNQtNp+qkTgqMUpndpnVNxqJHrlVepczWFDJcLFUU8P53JwK/Ue01yqKxzp0wxXKRVxikkc1GodB2OrqWjhkdO5EVVI1tdBNcKtkMDFc5y44FpttrFHpvT6TVDUbIrcqqnTovbqgsDUqJ2tdIiZyqHZq+8vq3eTbflcrhej2FaWm9nTffxKXq8++HpS03lpxU0vWNDLqS+JVU2XRROyuCUNE18c9uZTtVOnGmFQ6dK6eS32hzJEzI9vFVNcsnTsOp3wyrhsruCfEvsasbkevqRNTMyuhdTMXy/D9/Mk4Bq5RF9oM01UAAAAAAKmUwpqWsNEW3UNO/rImtmxwcidptoPL2NemHIX6eplpnpJE7CoVH1toC4afqJHNjc+DPBUTJo6oqLhUwqF5bjb6a4QOiqomvaqY4oQduTtdDTRS11AqNanFW8iGqberO9HwOl2Pa5lRiCr0dz5kFg5zsWKV0bubVwcCON646gAFSoAAB30XncXeQuJt56sUncQp3Redxd5C4m3nqxSdxCRtnjcaDt35EfU2UAE0cwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABq+43qzU91TaDV9xvVmp7qluXwKZlu+Kj6oU9rPOpe8dJ3VnnUveOk1c7+zwoAAVPQAAB9jesciObzRcoSrt/ufU2l0dNWuV0HLj2Ee6apI6y7QwyqnRc7BI+rdrKintza23J00VueihegSVMyR+hBXd9DIraWs/1cCfNP6hob3TtkpZmq5U4pkzJTOxahuumK9Oi+RnRXixxP8AoLdChvbI6esckdTyyq8yWpq5svddopzy87KzUWZafvs/dCTQfGPa9qOYqK1eSofTPNSAAANM3H0pFqC1ydFiLOicFwQBa9t7pVXlaaWFzIkdjpY7C2S8TrbBE1/TbG1He1EMSejZM5HKbHa9pam3QuhZqi8PuKvbhaGj0xQsXpdJzuZGiKrXIqc0LA/SFXEUSdnAr9jKkLWMRku606Zs5VS1dE2WZcqpOuxd/nfItPUv/sU9pM1XeKRaaZIZ2Oka3lkpza75V2xqpSu6Kr2oeqn1ZdIZHPSdyq7nlTKgruyYjFTJC3TZNa2pdOxyJ9x79yLtVV99nZO5VY1y4NUp2dZURsX/AKnIh211XJW1Lpply9y5U40XnkHfT5ke92+5XKbdTwpTwJGiYwhL1TtWtTpuOso1V0qtzhDD6E27r6m9sSvgVkTHZ4pzLCaHRHabpUcmU6KGcjgijXLI2tX2ohNpQxu3XnLpdrKyFJadddVwvI81tt8VuoW08LURGtxwK477pi8N+JZp35V+BWjftMXhnxK3BMQ6HnY56vuOXcVRTevo8+r7vipLxEP0efV93xUl4v0nlNIvaT6yl6mK1Nb0uVongxlVbwKjaw0/WWi6TJNC5GK5cLguZI9sbHOeqI1E4qpHWorzpS51i0VcsSyLwVeBYradsqIqrhSQ2Yu01C9zWsV7V449Cq3E9lrpqqoq420bHrJnhgsV93Gkql/WRTtw7jjpGx2HRmnLLIklP0Ff/iXJgNt0irqqYNvqNsqVrF3GOV3JUI6sdn1O21I3rJEy3gika6zs94pax77ikjk9qlu21FE1vRbJEiJ2GKvdqs15iWOrWJUX4GbLQo9uEca1Q7UvgnV74kwvJNSl/FOw76Slnq5WxU8bnvcuERELKVe2mlFeqrK1v/2OmCDRekKlrkVkkmeaqimD7A5PG5EQ2r6WwytxTxuc7lg9uzGmJrNaGy1TVbI/jhSTjH2O50l0oWT0LmrEvLBkCahY1jEa3gctuVTLVVL5Zkw5V4cgAC6YIAOitq4KKB01TI1jGplVVRwKtarlwh3quEyvI1DWWtrfYKd6Oma6dE4NyR9uHu2yJJKSzL+Liiv5kGXS6VdzqHTVcrnucvapGVNwazux6qbxZNkJajE1X3W8vVTadb67rdQyvZ01SHPBDSeOc9oBEPc6Rd5y6nTKalipY0jiTCIbzojX9dYJWRueqwJ2Fi9HazoNQ0zOhI1s2OLclOzI2e81lpqWzUkrmK1eSKZNPWPh0XVCAvWzNPcUV7O6/n/Jd/mCFdvt24qrq6S8KjZOSP5ITJSVUNXC2Wnka9jkyioTkU7Jky1TlVwtdRbpNyduPv8ARTuABdI4AAA6qp6x00r05taqlYNTddeNQ1tRWqqxxO/Ci9hZ+s40k3cX5FYdUVaQ19whan4nOxwI+v4Iim57H+ZIrU1whHlze19U7q+ScOB5VOUuUlfnhxPTbI2SVTUl/KQXiU6smGM6Hp0xVy0d5p5Yco5HJyLWPfWXTS1O+nVWydFMldIprbbKiOV8SqreJJFu3goaKkZA2Fei1MElRvZCite7iaXtHST1zo5aaPKtJWo1q6WxosiK6ZEPDZ6Rtckss1OjJl5OwR+u9dG5MLCuD4zemij4Mgwn9DOWqhyneNVSx3NEdiLCqZumsF4i1X1yyvWl6XIk+NFaxqLzRCFF3sp1kakdO5VVSUdJ3l16oG1CsVqO4pk908kSqqMXJi3mjrmMbJVMRqJoQ99IZfwx/FPmYfYT0q74mX+kN/2/inzMRsJ6Ud8SPd8WbjT/ANur0LKpyQBOSAmjloCIickQwmpdSUWn4UkrXYz2ZNXh3TtczsMgkx7VUtumY1cKupnQWyqqGdpExVTme3XV/fSvbQ0+euk4cDv0hYOoiSqq06UzuPE1q7aosb6+OvqFRXNxhFU2u36tpLjaJqqjTDWN4FlrmOeqqpKzwTwUrY441TPFfvNoy1qYyiGiaus1RVX2lq6b8rXIq4ImuGur5db7LT0U6RMa5UTJ6k1dfrVG51TVRyY7Cw6sjkTGNCRpdnKulcj2vbvKnDqWGpVxTxo9U6XR4naiovJUUqrW7r358jurkajfgZrQ2590mu8UNfIjo3Lgq24xKu6W5tja6ONZVVNNcFkAdNHO2ppo5WcnIincSBqCoqLhQAAUAOMj2xsV71RrU4qqkZa+3QobNHJT0T0kqcKmUXOC3JK2NN5ymZRUE9dIkcDcqbjqbU1DYqV8lRK1HonBMlfNebm1V5dJT0jlbCuUXC8zUrxebrqm4KqrJIr14NQ3/S21Uz7U+tuSdH8OeipEyVEtUqtjTCHRKOz0FjYk1a5FepEEj1e9XO5qpxMnqKljpLrNDH+VrlRDGEbhUXCm9RvR7EcnBQACp7AAAO+i87i7yFxNvPVik7iFO6LzuLvIXE289WKTuISNs8bjQdu/Ij6mygAmjmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANX3H9WKnuqbQatuT6r1XdX5FuXwKZlv8Aio+qFPqzzqXvHSd1Z51L3jpNXO/s8KAAFT0AAAZfSS/8+pe+hcm0MbLZqZr0RzVYmUUptpP09S99PmXLsnoml7iEra+Djm23mjol6mi6720oL3G+amYkc/P8KYK/6g01dNL1yr0ZGo1fwvaXIMTfrDRXqmdFVRNcqphFwZFRQtl7zdFIezbUz0WIp+8z/Ygjb7deeiWOkuq9KPl0l5k9WW90V3p2y0kzXIqckUr9uDtdUW50lTb2K6PnhDTNO6nu2l61Go+RrGr+JimJHVSUy7kyaE/WWKivUftNvciO5FxwR1oPcehvsTYqiRsc+OKKpIcb2yNRzHI5q9qEtHI2RMtU5/WUU1HIsczcKcgAezEIQ+kP/cRFfkLA/SH4wR8fYV+Q12u89Ts+yX1awKADFNmB3UXnkHfT5nSd1F55B30+YU8v8KlytC+rdJ3UNgNf0L6t0ndQ2A2mPwIfP1b8Q/qoXkpWjfv0uz4ll15KVn379Ls7xh3HyVNj2M+sE6G9fR59X3fFSXiIfo8+r7vipLxfpPKaR20n1lL1PPcKf61RywouFcmMlb9cbcXimuU1XS9KRqqq5QswfHsa9qo5qKi+0T07Z0w4t2i9TWt6uiRFReKKUqnr71bJVjkqKiNWryVVO9NYXjCItXIv/wBlLMaw29tl9ge5kTY51Tg5EK6a30VXaaqnJLG5Yc8HYIaoppYNUXKHS7TeqC64arUR/JUQ8P2wvPvcn/soTWF5T/y5P/ZTXj2Wu3z3KqZBTMVz3LjgYqSPXgpPupKZqK5zEx0PbLqC71T/ADuZVXsRymbsmj79qORj1SRWKv5n5JW292qhpoY6m6MRz149FUJdoKCnoYUjpomsansQkoKBz+9KppV02tgpVWKiaiqnr6GA2908/T1kjpZXq56c8m0gEu1qMRGoc4qJ31ErpZOKgLwTidNXVQ0kSyTvRjU7VUh7cTdWKjbJS2t3Sk5dJOw8SzMiTLlMu32uouEnZwt/X0JB1XrK26fpZHzzNWRE4NReOSumutyLjqGV8UT1ips8EavNDULxd6y71LpqyVz3KvapjyDqK182jdEOp2bZent6JJJ3n8+XQ+qqucquXKqFPgMREwbSAAAAAVB9a5WORzVwqceBIGg9ybjp+dkdRI6al5Kjlzgj4FWPdGu8xTFq6OGsjWKduUUudpbVlu1BRslppm9YqcWKvE2JOJSKx3utstUk1FM5ipzRF5k+7e7qU9eyOlubkZNyyvaTNNXtk7r9FOYXrZGakzLTd5nL1QmAHTS1MVVEkkD0e1fYp3EiaYqKi4U4VCdKCRPa1UKw6vpPq+pqtJOSu4ZLQP8AyO+BWLdd0i6x6Ea83KYFfoxFNv2OVVqHs9FQjq8NRtY7ophDxtcrXIreCoZC+RujrMPRc4McQbk1U6zFhWJg2Czubdpo6OZPxLwRTZLjtfdI2tkpY1exyZQ1rQyIupKVF/Uhci3Nb9Rg4J+RDOo6dtQ1d70NP2jvU1olYkCZRfRSld2sVdbKttPUxObI7kmDN2zQF5uDGvjgcjXduCYt0aCnk1PQq6NuVVOwlCyQRxWyBrGNROinYe47e1z3NVdEMSs2umhpYpWMTecQ3orZ9I3x1F0VVVOPRUmu3UUNvpWQU7UaxqY4HpBKQwMhTDUNEuN3qbi7endpy9CAvpDJhI/inzMPsJ6Ud8TNfSI/LH3kMLsJ6Vd8SLf8Yb/T/wBur0LKpyQBOSAmjlpXz6QtTMlbA3pL0MEc27UTYqXqXxNzjngm7fbT0lytzaqBnSdGnHCFa5GOjerXoqORe01+tV0cyrzOxbM9jV21jPVp66+vlqZlVXu6HYmSaNqattTpirp2onSRq8P8iC1JM2ZqqhtzdTxsVY38FLVK/EuvqZ1+pkdRO3f9OvyNIvMs1JeKjq3ujejl5KeKatqZkxLM93xUkndrRlRQVz62CJVjfxXCEXqitXDkVF/qW5WOjcrVMy3VMNZA2WPC6Hzj2mc0ZA+e/U7GJx6SGEa1z3I1qKqr2ITTstoieSqbcauNWsbxTKFYIlkkRGni710dFSvkkX00J4scK09rp43c0ah7j41Ea1GpyRMHyWRkTFdI5GtTtU2dNEOEvcr3KvM5GJv1/obLTOlq5mNVEzjJp2utyqGxxvhp3tknxjgpX6/aguurK9UV0jmqvBiGFUVzYu63VTabNstNW4ln7kf+5umvt1qu5ukpbY5Y4sqnSbzU0zTml7nqavaqtkcjly5zjedv9q5610dTcmq1mc4UnmxWKis1O2Okia1UTiqIYkdNJUrvzLobBWXyissa01vaiu5mqaH25t9ihZJNG2SfGVymTcLy1sdmqWsRERI1wiGQPDe/RNV3FJVsbWNw1DQZayasnSSZ2VyU01Yub7VL/jX5mIMvqz07Vd9fmYg1h3iU7xTeS3ogAAL4AAB30XncXeQuJt56sUncQp3Redxd5C4m3nqxSdxCRtnjcaDt35EfU2UAE0cwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABq25PqvVd1fkbSatuT6r1XdX5FuXwL0My3/FR9UKfVnnUveOk7qzzqXvHSaud/Z4UAAKnoAAAy+k/T1L30+ZcyyeiaXuIUz0l6epe+nzLmWT0TS9xCVtfBxzbbzxRfqe0AEsc7OE0TJmKyVqOavYpGmu9sqO7wyTUbGsn5phCTgW5ImyphyGZRV89DIkkDsKU3vOn7tpauV3RkajV4OQkHb7daWlVlLc16TEwmVJvv2n6K8U746mFqqqc8Fftf7Y1drlkqbcxXx5zhOwipKaWlXfiXKHQKS8UN9j9nrmoj+ZYey3qku1M2Wlla7KZwimSKd6d1ZdNNViNV70Rq8WuLBaD3For9EyOeRrJ+XFcGXT1rZdF0U1287Lz0GZYu8wwW+NlqrrEz6sxXY9hCf2Muv7D/AuLLBDUtRXta9F5HR5MpP2WeB5noGzP3sl217VyW+nSnRmcFQfsZdf2HeA+xl1z/cP8C33kyk/Zb4H3yZSfst8C17rbzJH6dS/ZlQPsZdf2HeB2UujroyqhVYHYRydhbryZSfst8B5MpMovUs8CnutOZRduZFTHZnh0bA+msFNHImHI1M5M2fGNRjUa1MIh9JVqbqIhok0nayOevqoXkpWffz0uz4lmF5KVn389Ls+Jg3HyVNp2M+sE6G9fR59X3fFSXiIfo8+r7vipLxfpPKaR20n1lL1AAMggwYTVdjpr3a5oZ42ud0VwuDNhUymFKOajkwpcildC9JGLhUKWaqsklpvstGrVwrvwk7bOaKgo6BlfUMRZHJlMoerXeg/K99p6qJvBHZcSLZKNKC2wwNTHRaiEbTUfZyq5U09DeL1tGtTQRxxO7zvEe5ERERE4IgB1zzx08TpJntYxOKqq4JM0REVVwh2Gtaq1fb7BTudPK1ZETg3Jou4O6tNQNkpbY5HycuknEgK93ytvFS6Wqlc7K8skdU17Y+6zVTc7JslLV4lqu63l6qbjrvcmuvkz4qZ7o4OSYXmR497pHK6RVcq+04oGornIicVVcELJI6Rd5ynTqSiho40jhbhADZL1pWrttrgrnsd1UiIucGthWq1cKhehmZM3ejXKAA2DTmmqi+xv+qZV7ewIiuXDeImmZC3fkXCGvgyt30/cLU9zauB7ETtVOBiimqLhT0yRsjd5i5QAAHsAH1jFe9rWplVXAUHw5RyPiej43K1ydqKSk7aqpl05FX0+VkcxHdEjS4UNRQVDoamNzHtXHFD1JC+PCuQwaW4U9YrmxOyqaKSBoLcutsszIat6yQZxxUsPpnVNBfaZr6eVnTVPy5KXGZsWoq+zVDJKWZyIi5xngZVNXPi7rtUIG9bLQV+ZIe6/wD3LrrxauO1Cs28MM9Dq1tQkaq3Kqb7oHdaluCR09zcjJOXSU3252G16ha2eRrJUXijk4knLu1cf9NTSKB0uz1Yq1bFwqYKg3iaatqes6tyJj2Hh6iXH5HeBb1NA2f9hngE0BZs56hngYK22RVzk2hm29IxN1GLgrNt/RTy6lpcRuwjkVVwW1WuioaGHrVwqNQx1t0fbKCoSaGFqOTlwMhcLSyrcnSX8KdhnUtO6naqcVU1a+3mG7TMdhUaiEL7m6nSXUdK6CNVYxUVVJQ0nqenr7fCn5XI1Ewcp9E2yd3Slja53tVD0Uul6WkVPq6dFE9hWOOVr1cq8S3V11BPTMgaiorfU2Bj0e1HN5HI66ePqo0bnODsMw1tcZ0IE+kR+SPvIYXYT0q74ma+kT+WP4p8zCbCelXfEhX/ABh1Cm/t1eillk5IAnJATRy46aymjq6d8MzUcxyYVFIV1xtG2pmfPbPwq5c4RCcAWZYGTJhyElbrrUW5+/A7H3ehWK3bQXR1U1Khf7PPHgTTofRFJp6FrkY1ZcczdAW4aOOFctQzbjtJWXBnZyLhPuPFdbbT3OldBUxo5qpjiRrc9oLdUTukiwmVzglcF2SFkniQj6O51VFpA9UIus+0dso52SyojlaucElUVJDRQNhp2IxjUxwO57msarnKiInNVI913uPQWKJ8dPK2SflwXJ43YqdM8DJ7SvvMiRqqvX9jbb7faOzUzpaqVqYTlkgXX26lRXPfTW1VazllDStQ6ouuqK5zUc9yOXCMQ3LQO1tTXyx1NyarWc8KR0lVJUruRJobpR2OissftNeqK7kaVZdO3bVFajlbIqOXi5SwGgtt6Ky08c1UxH1HblDcbHYKKzwNjpomoqJzwZcyqahbF3naqa/edqZq3+lB3WHGKNkTEbG1GtTsQ5AGeamq5B4b36Jqu4p7jxXv0TVdxSi8C5D5jeqFM9W+nanvL8zEGX1b6dqu8vzMQaqviU+gqfym9EAABfAAAO+i87i7yFxNvPVik7iFO6LzuLvIXE289WKTuISNs8bjQdu/Ij6mygAmjmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANW3J9V6rur8jaTVtyfVeq7q/Ity+BehmW/wCKj6oU+rPOpe8dJ3VnnUveOk1c7+zwoAAVPQAABl9JenqXvp8y5lk9E0vcQpnpL09S99PmXMsnoml7iErauDjm23nii/U9oAJY52AAADhNFHNGrJWo5q80U89xuFPQRLJUPRqIeK2ahobg/owStVfieVciLhS82CVW9o1FwnqaLr/a6ju8b57exI5+eEQgK7We7aVuP4myRuYvB6ci5/NDBan0zQ3+kdFVRNVypwdgwqmhbJ3maKbTZtqpqTENT32fuhDG3m7j6ZY6S9qrmcGo/mTva7pSXOmZNSSte1yZTC8StOvNsa6zTvmomOkp+f4U5GA0rrC6aYrGtV7+ravFimNFVyU67kyaE3X7P0d2j9qtrkR3L/vAuEDSNE6+t+oKZiOkayfHFqqbs1yOTLVRUJVkjZE3mqc+qqSWkkWOZuFQ+gA9mMAAAF5KVn379Ls7xZheSlZ9+/TDPiYFx8pTbdjPrBOhvX0efV93xUl4iH6PPq+74qS8X6TymkdtJ9ZS9QADIIMAAAYzzB1zzRwRq+VyNaiZypFm4G6VLa45Ke3uSSbllF5FuWVkSZcpnUNuqK+RI4G5N61Nqi3afo3TVkzconBqLxK67gbnV99lkgopFhpF4fhXmhpl/v8AXXuqdLVzPcir+XPAxJCVFc+but0Q6lZdlYKDEs3ef+yH17nPcrnqrlXiqqfADCwbYFNi0FaHXjUVNAjcs6SdI13mqInNSwuw+lmwUnlGoZh7uWUL1NF20qIRF9uCUFG+TOq6J1Nx13p2Ko0O+ljjRVgjynD2IVMnjdFM+N/BzVwpeiqhbUU8kL0/C9qtUqNunZvJGp6hrG4je5VQzrnDhEehqWxFxVyyUz11XVP+TTew3raa/wDki/xRuROhKqN4miod9BULSVsM7ebHIpGMerHI5De6ymbVQOhd6oXOr7HbL9RsWrpo5Gub2oRnq7ZmlqWrJZ3dVJ2MTghvO2l5S76egfnLmtRFNuNiWKKdqK5OJxdlwrbRO6ON6purw9CneotBXuxuX6xTOe1O1iZNWlhliXEkb2L/AFTBeeopoahqtmja9F9qEC74Wu3UDelBGxkjvYhG1NAkTVc1dDebHta+ulbTzM7y+qEHmzbd2Z151LSw9FVYjkV3A1gsHsFpxsdKtylb+N/LJh0sfbSohsN9r0oKJ8vrwTqpM1DSspaGGmRE6MbUbg0fX23dDqCnkkhjbHU4zlE5kgA2N8bXt3XJocVpa6ell7aJ2HFLtU6WuGnqx8VVE7oIvByJlFNfLn6vsttuVukSvYxMJ+ZSp+saGkobtLFRPR0aL2EDV0nYLlF0Ot7PX/3ozde3Dk48jBNc6NyOYqoqcUVCS9u9zqyxSsp657paXOPxLyIzCmPHI6Jd5ik3W0MFbGsU7coXW05qS336kZNRTtXKflVeJmilOm9R11hqWy0krkRFyrc8CwWg906O7Rsgr3JHPyyq8yapq9suj9FOXXrZOeiVZKfvM/dCVAdcE0c8aPicjmryVDsJA1BUVFwoAAKAAAECfSI/JH3kMJsJ6Vd8TN/SI/JH3k+ZhdhPSrviQr/jDqNN/bq9FLKpyQBOSAmjlwAAAAPj3NY1XOVERO1QD6Y+8XejtNK+eslaxrUzjPE1PWu4dvsMD2xyNkn7ERSvOqdW3TVNcrUe/q3LhrEMKorWRaJqptFm2Ynr1SSXus5m8bh7tzVr30llVY4uXTTgqkd2Wx3bVFwTotkkVy8XuNz0FtbWXWWOe4NWOHnx7SwOndOUNjpWxUsTUVE4rgwmU8tU7flXCGzVV5oLFF7PQtRz+f8AKmm6A2yorLDHNWsSWoxninIkqKNkTEbG1GtTkiHIEtHE2JN1qHPa2unrZFkndlQAC4YYAAAPFe/RNV3FPaeK9+iaruKUXgXIfMb1Qpnq307Vd9fmYgy+rfTtV31+ZiDVXeJT6CpvKb0QAAF8AAA76LzuLvIXE289WKTuIU7ovO4u8hcTbz1YpO4hI2zxuNB278iPqbKACaOYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1bcn1Xqu6vyNpNW3J9V6rur8i3L4F6GZb/io+qFPqzzqXvHSd1Z51L3jpNXO/s8KAAFT0AAAZfSXp6l76fMuZZPRNL3EKZ6S9PUvfT5lzLJ6Jpe4hK2vg45tt54ov1PaACWOdg6K2pjpKZ80zka1qc1O9VwmVI71jcZrvc47PQqqtVfxuaeJH7iZMyipVqZN3giaqvJDF3Ja/UaVUsaO+rtz0cdpqFjp7xSV71ZFKyNjsqqoTrYrZHbrdHTo1FXHE9LqCmVrk6pqdLnwMZaZXYcq6k1HfmwI6FrEVnoYnSl5bcaZI3L/as4KimfI6uVLLpy7pVwZ+rvX8RvVsrYq+lZNE5FRU44L8b1Xuu4oRVdTtbiaLwO/b7juqYIqmJ0czEexeCoqEVa/wBrqW4tfUW9qMk54QloCWFkqYch4objPQSdpC7BTSvt920ncMp1jOivPkhKG3266osdLdF/p0lJY1TpOgv1M5k0Temqc8FfNcbbV1llfPSMc6JOKYIp8EtIu9Hqh0Gmudvv8fYViI2TmWZtlzpblA2Slla9FTPBT2lRNIa3uem6xscj3rGi4VrlLFaO11btQU7ESVrJscUVTOp6xk2i6Karedm6i3Lvs7zOZuIPjVRyIrVyi9p9Mw1oLyUrPv36YZ8SzC8lKz7+emGfEwLj5Km27GfWCdDevo8+r7vipLxEP0efV93xUl4v0nlNI7aT6yl6gA4TSshYr5XI1qdqqZBCImdEOZhNR6loLHTPkqZmI9E/Lk0nX+59HaY5Kehej5+KZQr3qLUdffal8tVM5Wqv5ckfU1zY+63VTb7JspNWqks/dZ+6m8a93RrLtI+noHLHDyyhF80sk8iySuVzl5qpwBDSSPlXeep1CioIKGPs4G4QAA8maFGTtpYuuqGR/qXBO+jNqaOsoYampXpI5EU9xQvmXDCMuV1p7axHzrxIl0XYZ7xeIGJG5Y+lxXBbzT1Ay3WqCCNqIjWpyMZp/R9usuFpomo5O3BsqJhMITdJS9gmvE5ZtHfkur0SNMMQEOb5aUkuNKlZSRK+VnYiExnCaJkzOjK1HN9imRNEkrFYpD22vfb6hs7PQpJNYrjCmZKaRqf1Qxz2uY5WuTCoXRvVgt81FMv1diL0V7CqGsbdJDfqiOCB6tRy4whBVVH2CIqLk6vYtom3VXNVu6qEnbA6hVs626R3PimSfypG29Fc6PUEE8cEjW54qqFsKB7pKSJz0w5UTJJ296uj3V9DSNsaVkVZ2sa+L/c7JnpHE568kTJVjeW+eUr4+FrstjXBYfXNykt9lmWBiue5qomCrs+nLveblNOsD/xuVeKKWri9VRI2mbsZTRse6rmVERNEMJYKF1wutPTtRV6TkyXD0ba47VY6eCNuPwoqkQbW7d1VFcm1dezlxTKE9RtRjGtTkiYK26nWNqvcmpb2xuzKqRsELstTj1ORjL3eaS00r5aqVrcJnCqcNR3B9DQvdC1XSY4YK8avZqW/1b0e2VIc8ETJk1FR2Sd1MqQtms6V796R6NYhy3H3KqbnUvp6B7mQouMp2kWyyPmkdJIqucq5VVNoXQt36KuWF3D+hrlbSTUU7op2q1yEDM6R7t6Q63bYqOnj7GlVNOR5wAWyUPpyhlkgkR8Tla5OSocAMFF10Ulnb7dKotjmU1xcr4uSOUn/AE/qCivVM2SlmY5yp+VFKTmf01qm4WGqZJTTP6Kc254GdT1zou6/VDT71snDW5lp+6/9lLogi/QW59Hd2MgrXoyZeGVJOikZKxHxuRzV5KhNRytlTLVOX1tBPQydnO3CnIAFwwyBPpEfkj7yGF2E9Ku+JmvpDrlkfxT5mF2E9KO+JDP+MOo039ur0UsqnJAE5ICZOXAHxzkaiq5URE7VNJ1nuBbrDE9jZWvnROCIp4e9rEy5TJpaSarekcLcqbTdrpS2yndLVSNYiJnipBe4e6r5VkpbW7Ccukho2rNa3TU1W6ONz+rcuEa0zmhds6u7SsqK5rmxrx4kVLVyVC7kKaHQKCwUlpj9quLkV3I1K22q7apr0VUkf0l4uXiTtt/thS2uNk9cxHy88KbtprS9BY6ZrIIm9JE54NgTgZFPQtj7z9VIa87VS1SLDTd1hwghZBGkcTUa1OSIcwCQNQVVXVQAAUAAAAAAB4r36Jqu4p7TxXv0TVdxSi8C5D5jeqFM9W+narvr8zEGX1b6dqu+vzMQaq7xKfQVN5TeiAAAvgAAHfRedxd5C4m3nqxSdxCndF53F3kLibeerFJ3EJG2eNxoO3fkR9TZQATRzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGrbk+q9V3V+RtJq25PqvVd1fkW5fAvQzLf8VH1Qp9WedS946TurPOpe8dJq539nhQAAqegAADL6T9PUvfT5lzLJ6Jpe4hTPSfp6l76fMuZZPRNL3EJW18HHNtvPFF+p7QDE6ivUNmoZJpV/EiZRCVVUamVOfRxulcjGJlVPHrG8pbKBzGL/bSfhanaeHQtldTxOraxOlUS8cqaHpmqrNYaqdPV5+qxu/C3sJqiYkcbWNTCImCxGvarv+noTVfGttiSlRe87V38HIAGQQRjr7bmXK3ywvTiqLhSKtKX2qsGo5LXWKvUdLDVUmYjHdDSs1U3yhb1Rksf4lVEMaoa7R7eKE9ZZ4nK6kqPC/h9yklwyNlia9i5a5MocyL9r9bMrf8AlVWv/ExfhypKBdjkSRu8hHV9DJQzLFIn/tAdNVTQ1Uaxzsa5q8OKHcC4YaKqLlCIdfbU09wZJU25EZLxXoonMguoguulLkrXpJC9q/5KXSNZ1bo+26ipnNqYWpLjg5EwR9RQo/vR6KblZtq5Kf8AoVnfZ+6EX7ebstXq6S7rjs6aqTZbq+muFO2alla9jvYpVrW+29x0/M+Wma6SBFyit7Dp0Rr65aaqmxTPc6nRcK1THirHwruToSlx2cpblGtVbHJlfT/vAto78qlZ9+lzeGfEm3SmtrbqGmRY5GslVOLVUhLfdv8AzZrkVFTJfrno+DLVIzZSmkprn2czcKiKb19Hpf8AkKp/VSXyH/o/4g0858qo1uV4qpmdebm0FihkhpXJLUqmE6K8i7BI2OBHOUwrxQzVt2ljgblcm3ah1FQWOmdLWTNaqJwbnmV+19unVXWR8FvcrIeWUXmaLqbU9wv9Y+aqld0VXKNzwMHgjaiufL3WaIbtZdk4KJElqO8/9kOyonlqJVkmernLxVVOsAwcG3oiJogABUqAAAco3rHI17VwqLksdshq5K+jSgqZE6bUw3JW8zmjry+yXmGoa5Uai/i4l2mmWGRF9CGvtsbcaV0f+pNU6l1AazpPVtBfaSNYZW9ZhMtybMbI1yOTKHEZ4JKd6xyJhUABruub62wWKeqXmiYQOcjUVylIIXTyJEziuhn5GtkY5mUXPMwK6Stj6l08sDHPVc5wR7tNrma8XGaKtk/Mv4ckxpx5FuORk7d5CQraaptMywquF+4x9PZqGnVFigY1U9iHvaiNRETgh9BdRETgRr5HP1cuTpqqWKqZ0ZmI5P6nRDa6SH+7hYn+R7QMIEkeibqLofGsaxMNRET+h9AKng65oI5kxI1FOlKCmT/tN8D1AphD0j3JoinnWhp1aqdUzC/0K6b6aebQV6VMLERrvYWSVyJzVCPd37TDdNPyP6TenGiqYtZEj4lJ/ZuvdS1zFVdF0UqkgOczOrmez2Lg4GvJwO1prqAAVKgAFAdlPPJTypJC5WuTiiopLO3+61RbVjpbkqyRcukvYRED3HK+Jd5imDXW6nr4+znblC7dhv1DeqVs1HM1+U5ZMqUu0xqu5afqWyUkzugi8WqvAsXoDcuh1BEyGqckVVjjleak1TVzZe67RTll72VnoMyw95n7oaP9IZcpGn9U+Zh9huF0X4mY+kH0XsidG5HIqouUMRsOiNuTnPVETPaYjvizZqf+3V6FlG8WoeW5XCmt1O6aqkaxiJniprGr9d27TtKvSkbJNjg1FK8ay15ddTVTo2Pc2BV4NQzqisZCmOKmpWfZqouK77u6zmv/AAb7uJuwruso7Q7+nTQimjorrqi4ojGySvcvFew2fQ221ffp2TVTXMgzleknMsTpfSdt0/TNbTQt6zHFyoYLIJatd+RcIbXUXS37PR9hSJvSf94mh6A2rgt7Y6m4ojpefRVORLNNTRU0aMhYjWp7Dx116oKFqrUVDGY7FU027brWW3uVM9aqfpUkW9jTtwi4NLnW43iTfVqu/wBiQwQ5U74W1MpDSyZ9qqeOXe6BY16uByO7MlFrYU/1HtuzFzd/8WCblc1OaonxU+lU7nuleq27smbN0IGuReinahMendz7XU0MDamREmxhyqvaeYq2ORVTgXq7Zato42vxvZ5ehJIMVQX+3VrEdDUxrnsyZNj2vTLHIqf0MtFReBrz4nxrh6YOQAKlsAAAHivfomq7intPFe/RNV3FKLwLkPmN6oUz1b6dqu+vzMQZfVvp6q76/MxBqrvEp9BU3lN6IAAC+AAAd9F53F3kLibeerFJ3EKd0XncXeQuJt56sUncQkbZ43Gg7d+RH1NlABNHMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAatuT6r1XdX5G0mrbk+q9V3V+Rbl8C9DMt/xUfVCn1Z51L3jpO6s86l7x0mrnf2eFAACp6AAAMvpP09S99PmXMsnoml7iFM9J+nqXvp8y5lk9E0vcQlbXwcc2288UX6ntIw3UvVDC1sM8n4vYSeqZRUK3b+06QXRqo5VV3YZda9WRKqGu7MUrKmuax64N00dq7T1rpEVHsbIvM2du5Fjd/5LPEqLlfaoyvtUjGXCRqYREN6qNjaWd6yPeuVLfJuLYu2pZ/7HxdxbH2VMf8A7FQsr7VGV9qnr3lLyLH0GpP81Ldu3Hsaf+Sxf/seSp3HsU8TonzN6LkwvEqflfaoyvtUe8peR7bsRRt131J10nJapteK+3PTD1zw+JPacEQppt7WuodT0sqOx+JEUuJQTfWKOKX9TUUzLfLvtU1nbCiWmmj1ymManeACQNNAAAOispIayFY6iNr2r7UIc3E2rjqGSVVraiP5q1CagqIqYXihamhZMmHISNvulRb5N+F36ehS9Eu2lq5V/tI1av8Akp1ai1DU3vofWVyre0tLrPSFrutJLJUMYx+F/EVa1dbYbXdpIad/SYikHU076dMZ7qnVLJd6e7O39zEiHrtesK+22h1DSvVjV7UU16pqJaqVZJ3ue9e1VOr5gxVc5yYVTYo6eKNyvY3CrxAABeAAAAAAAAAAUA8qqA27ba6z0WoadjJXIxy4xkt1b39ZRxPXtailK9MOfFe6Z7Gqqo5OwuTpuZZrRTuXgvRQl7W5VRWnM9uoUR8ciJxMmRPv9V9DTqwIv5lQlggDfqonqaltPE1zkT2IZla7dhU17ZiHtbjHn01Ih0/eKiy1zKmmcqK1c4JcsO803SYytYiNTgqkQwWS4T/3dO9f8jzVlFPRv6NQxWO9ikDFNLCnd4HVq220NxXEyIrv3LoaZvtPfaBtRTrlFTiZghvYCuR1tdArsr7CZDYqeTtI0cpxy70aUVW+FvBOANB3B13FplUbwV69hvr16LHL7EKvb4Vi1F8VvSyjS1WTLFHlvEz9mrdHX1iMlTLUM7BvDXVdzihjYiRvdgnax1Tqy3RTO/M5EVSlFrd0K+F2cYchcDb2ZZtO07lXK9FDGt875VVHqTm19qp6KKN1O3Bsx4rzVpRW6aZVx0Wqp7TSN2bj5P01M7pYVUwSMjtxquNMoYFqKhkSeqkL3/dK7Jcp44XYja7CcTXq7X11rYHxSyKrX8F4mp1MizVD5F/6lVTrNaWeRy8Tt8FopImpuxplDlI5Xvc5eaqcQC2SQABUqAAAAAADvoquaiqGzU73Me1eaKdAKfeUVEcmFM7etS1d3pWQ1bld0e1Tqsd/qbOjvqzsKvaYdTYNGWqnut0ZDVSIxqrxyekV7n6LqYksUEMCo5vdTXB9hgu2qK5M9bKrl7cqTPt/tVFTNjqbm3pP54VDfdIaUtdppI3UrGPdhPxIbWiYTCciZp6FG96TVTmV42rkmRYKRNxifMxsj6Kx0GVRkUTE+BE+t93IqZr4bYqPdxTJvO5lqqrpZJGUjlR2Owqtd7FX0FRI2eF/BeeDzXTyRd1iaF7Za00ddmapdlyLwPbdL1dbwslTLUydFePRya+vWSvwque4y1ot1fVNVkTXJH2qpssNqt9mibPVPa+TtaRO46TvKdBWaKl/psTX0RDU6CzVdY9EbGqfEzjdD16oiojeP9T03PVsCJiggSNydqGIXVt1z+GociFcRN46ltXV0urERvU9VRo2tgXD+jx/qeil0VcHt6Ub0b/9jETanucy/wBpOqn1mqbpGmGVDkQZizwUqsdcrfEmTZKfT9+o3dKCse3o9iONls2uNQ2VzYqpiyxJzdzI4bqq6I7KzuVDLW/WSoqJWRpInbkusma1e6qoYNTbpZmqk7GvJ8su49DU0qOqUWN6JxzwO2fcyyxNVeuaqp2ZIfg1RZK1qQvp2xq7gqoZ2y6DsN2VJY6tMrx6OSQbUyvTDFRTUp7HQQKr6lrmJ8zeId07U9+FVce026w6gpLzH0qZ2TSY9CaaooEbPIxHe0ymnGWKyyqlLVtwvZkyI3Sov9RUwQtZT0D41Wka7PTQ3o8N89E1XcU76Wsp6puYJWvT+inRfPRNV3FMlV0IKJqtlaip6oU01Z6equ+vzMQZfVnp2q76/MxBqzvEp9AU3lN6IAAC+AAAd9F53F3kLibeerFJ3EKd0XncXeQuJt56sUncQkbZ43Gg7d+RH1NlABNHMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAatuT6r1XdX5G0mrbk+q9V3V+Rbl8C9DMt/xUfVCn1Z51L3jpO6s86l7x0mrnf2eFAACp6AAAMvpP09S99PmXMsnoml7iFM9J+nqXvp8y5lk9E0vcQlbXwcc2288UX6nscvRaq+wrLvvWJUXtGovIszKmY3IvsK77pWy3SXhXVU3Rcq+0yK9FdFhCH2Pcxlbvu5EMoMm6JZrGqZ+sr/AOyH1bJZMecO8UITsnc0Ope8I+S/I0rIybr5EsfvDv8A2QeRLH7w7xQr2TuaD3hHyX5GlZGTdfIlk7Kh3ig8i2PH9+7PeKdk7mg94R8l+Rq9lkWK6Uz84w9OJc7Sz+ssFE5FzmNCrENntC1cKQVP4uknNxabSkSQ6foo2rlGxomSTtrVarkU0XbeZkscSpnOVMsACWOdgA+OcjGq5yoiJzVQD6YbUOoaGyUzpaqVqKicG5NQ1/uVQ2KN8FJI2Wo5fhXOCvd+1FdNT3Bek+R/TXgxqmBU1zYu63VTbbLstNXYln7sf+5uuvdz6q5SvgoHq2JeHAiuqlmnlWSdXK5y81Jd292rmrkbU3RisZzRF4GA3bs1NZq2OCmRERFwRk0cr29rIb1bKu308/sFImqcVI+SN6s6fRXo+3BxJv2p0nQak01IlS1Os4oi4NP15t1X2CZ8lPE6Wm9rUyeHUz2sSRNUUzYb5TSVTqRy7r05+poACorVVHJhU4KCwi5JgAAqVAAAAAAMzpW0eWbmymVcZUnOy7PUKRNfU4VVTJBGmK59vvFPKx2MOTJcnTlT9bstJNnKuYiqSFvijkzvJqaHthX1lErFhdhqmrW3bSzUUrZGRJ0m8lN2padlNE2ONMNTgh2gmGRtZ4Uwc4qK2eqXMzld1Bg7ppqhuVR11RGjnf1M4D0rUdopZimfCu9GuFNanslstVHJL1LMNT2FbNaRVV81DIyhp1VnSwmE4FrbnRsr6V0Ll4KY62aYt1CmW07HP9qoYlRTdthqaIbHZ7423700mXPXgRns1pS42edJqpFax3HBNBxYxrG4Y1ET2Ici/DEkTd1CIudwfcZ1nkTCqdNYqpSyK3ngrJrLS12vWo53RxO6HSXC4LQqiKmF5HQ2jp2vVyRM6S9uC3UU6ToiKplWa8OtTnPY3KqVktu0l3kkY969FEXPIsJoy1yWmzRU0q5c1DOo1ETCIiH0pBSMgXLT3ddoKm5tRk2MICP92dOVmobUsFI5UJAHMvyMSRqtUjKOrfRzNnj4oU7uug7xb1VHQPdjtRDXKmhqaVVSeF7Me1C8E1HTzf3sTHfFDUNd6St9bY6l0VNG2VrVVFRpFS2xERVYpv1Btur3tjnZx9UKig9Nyp3UlbLC5MK12DzEWdEaqOTKAAFSoAAAAAAB9aiucjWoqqvJEJG0BtrXX2Zk1XG6Om5/iTGSrGOkXdahiVlbDRxrLM7CEc9FyJlUXHtO2llmglSSBXI5q80JQ3c01R6co4YqZEyuOJ4dpLLS3upfBUtRUXgXFp3JJ2XqYSXeJ9EtYidwy23m6FRb5WU1xcro+WVJ+sl8o7vTNlpZWuynLJAm4e1s1tR1Va2q9nPCGi6d1TddNV7cSSIjFw5jlM2OpkpV3JU0NWrLJRXuNamgdh3IuQ5Ecio5MophLrpi3XLPXQtyv9DVtCblW++xMiqZWxVPLDlxkkRrke1HNVFReSoSjXMmblNUNCngqrbLuPy1yFe91af7KvRltj6MbuaohD89dNVT9Kd6qirxQuBq/SVJqSnVlSn4vaQzqPZuoplc63qr09hFVdJIrssTQ6Ds9tBR9ikdQ7EnNfX9SIatY1cnVocaSF08zWNTmbiu2t++sdX9Vfj29FTcrLtZW01rlqHs/wCJRMo1U4mG2mlcvA2SovVHAzPaIqr95D9dTLSz9B3M85mdS2u40FbItwp5I+OEVUwhhslle6qopKQvSRiORc9Bk+Gf0xZWXmVYkfiVeSZNvo9pLtNL+JuI15Lg9tgkkTLUyYlRc6WmcrZn4X7yMkVUXKLhTJWy+V1uejqed6Y/qTJbNkkf0Vq5XInbhTOrsnaOo6CSSdL25MhlBPxTQhajaq1+B7t79CDK/Vt0rEw+d3iLTJX18v4Kp7VX+pJd32Xmiev1N6ub2Guy7YahpJV+qtcmO1MnlYJ0XLkyX4rtbJGYhe1vU2fRHl62VcaumfLAqk018rptPTvemHLGuSONsLVeqCbqLvC5zE5OchJ17aiWaqRqYTq1JemaqRr/AMnPb7O2SsaiYVcpqnqU21Z6equ+vzMQZfVnp2q76/MxBAL4lOvU3lN6IAAC+AAAd9F53F3kLibeerFJ3EKd0XncXeQuJt56sUncQkbZ43Gg7d+RH1NlABNHMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAatuT6r1XdX5G0mrbk+q9V3V+Rbl8C9DMt/xUfVCn1Z51L3jpO6s86l7x0mrnf2eFAACp6AAAMvpP09S99PmXMsnoml7iFM9J+nqXvp8y5lk9E0vcQlbXwcc2288UX6ntXimCEt7dHz1z/rlFGrlROKIhNpxkjZI3oyNRyexUJGaFJmbqmmWu4yW6oSePXBSJ9ouMblatNMip/RT55OuWP7ibwLlzWC3yv6TqePPwOH2ct3u8f/AKkZ7rX/ACN4TbtiprF+5Tfybcv2JvBR5NuX7E3gpcj7OW33aPwH2ctvu0fgPda/5D6dx/ZfuU38nXJP+xN4KfPJlxVfN5vBS5P2ctvu0fgE05bkVF+rs8B7rX/Ir9O2fZFY9vNE113vUL54nxxMcjlVUwWrt1MlHRQ07eTG4PtLRU9KmIImM+CHoM6mpkp0wnE1K+XyS7SI5yYanBADjI9sbVc9URE9pH+t9xaGyQyRwyNfOnJEUvySNjTLlIykopqyRI4W5U2+83yitNM+Wrma1GpnGeJA24G7U9cr6WzuVkfLpJwU0bUeprpqmuVEdIrHLwaht2gdraq4zR1FxYrIV44XtImSqlqV3IdEOg0diorNH7TcHIruRpun9N3TVNwyjXu6a8XuLA6F2zoLJEyWqjbLUc8uTJt+n9PUNkp2x0sTUVE54MyZdPQti7ztVIC9bUzVqrFB3Wf7nBrGxxdFiIjUTgiFZ9+ExeG/Es2vJSs+/aYu7PiUuPknrYxf/wAh+im8/R5T/kLl/qpLNXSw1cDoqhiPjdwVFIn+j16vr8VJeL1In9FCO2jcqXOVU45IT3D2liqesq7OxGv4qrE4EF3a01lqqHRVUTmqnDOC8C8eZqWsNE2/UNO9HxtbMqcHIhjVNva/vR6KTdk2vlpsQ1febz9UKeIDeda7fXGwTSPbE58CLwVENHVFblHIqKhDOa6Nd16HTKWqiq2JJC7KHwAFDJAAKg5Md0JGuTsXJajZe8rcdPsicuVjTBVVeRNGxd+ioHvinejWr7VMuhfuTdTV9raP2mhVUTKt1QsQqonNQRHq7cdkF6gpKF6ORXYXCkoWeoWqt8Mq83NRSbZM16q1vocqqrZPSRMllTCO4HsNB3V1U7T1szA7Eim/Fe/pCVmamODJbq5FjiVUM3ZyjZWV7I3plCTNr9SOv9q6yV2ZMG8FSdvNbS6al6Kqqxu7CZbJuvQV1VDTuVEfIqIhZpqxjmIjl1JO+bNVMVQ+SBmWcdCUQcIZElia9vJyZOZnmoKmNADF6juTbXa5qhV4taqoQLPvHWxVszegqsRyonEx5qlkKojyXttjqrk1zoE0QscCLts9fu1JUPimTCouEJRLkUrZW7zTDrqGWhlWGZMKADG327QWeidUVLkRqe09qqImVMaON0jkYxMqpkjjKxssbmOTKOTBE9w3gt8TnNiVFx/U1u4byvRVSFi+JjOrIW+pPQbMXGXVGYNP3ksnkzUMkkbMRyKq8EI9Nt1nrKfUqp1zMY5KakQMytdIqs4HXLXHNFSsjqPEiAAHgkAAfWtVzkRqKqr2FFXAPimRtFnrLtO2Klic5VXng27RG3Nwvs0cksbo6dV4qqdhYjSOjLfp6nakUTXS44uwZdPRPm1XRDVrztRT29FZH3n8jQNutp4aRGVd4Yj5OaNchMdLTxUsLYoGIxjUwiIh2pw5AnIoWQphqHK7jdKi4ydpO7P3eiEA/SFThGv9U+ZhthvSi/Ezn0h0/BH8U+ZhdhfSq/Einp/5h0KnX/8AXV6Fknxsmh6EjUc1U4opGevNr6K8RvnoWJHPz4JzJObwah9JaSJsqYchzqir56GTtIHYUple9PXTTFwy5kjFY7g9pI23m7UtIjKS8OV7OCI9eKk3ag05Q3undHVRNVVTGcFfNwdsKu1VElRbmq+DnwQin08tKu/EuUOgUt4ob9GlNXNw/n/BYu0XijutOyWkla5HJnCKZEp5pjVl00vWI1XSdWi4Vqlg9Ebi0F8hYyWRrJ15oqmXT1rJdF0U1u8bLz0H9SLvM5kgYB8Y9r2o5qoqL2ofTONWMPftOW69wrHXU7HqvJVTkRbetmKeWdzqJ3RZ2ITUCzJTxy+JCUorzWUOkL1ROXoQvpzaee0V8dS2Xi1c4yTFRxuipmMf+ZEwdwKxQtiTDTxX3SouDkdOuVQAAukcAAADw3v0TVdxT3Hhvnomq7ilHcFLkPmN6oU01Z6dqu+vzMQZfVnp2q76/MxBqrvEp9BU3lN6IAAC+AAAd9F53F3kLibeerFJ3EKd0XncXeQuJt56sUncQkbZ43Gg7d+RH1NlABNHMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAatuT6r1XdX5G0mrbk+q9V3V+Rbl8C9DMt/xUfVCn1Z51L3jpO6s86l7x0mrnf2eFAACp6AAAMvpP09S99PmXMsnoml7iFM9J+nqXvp8y5lk9E0vcQlbXwcc2288UX6ntABLHOwAAAAAAAfHORjVVyoiJ2qAfTHXm80dpp3S1crWoiZwqmqa43Dt2n4XxslbJUY4Ii5K9an1Zc9T1rmtfIrHLwYhhVFayLRNVNos2zE9eqSS91nM3ncDdaapdJS2tcN5ZQjyz2W66qr2qqSPRy8XLk3DQe2FXdJGVFexWxKucKT/p3TVDZadrKeJqOROeDCjp5apd+VcIbNV3igsUfs9E1FfzNO0FtpR2iFk1WxHzc+PEkqGFkMaMiajWp2IcwS0cTY0w1DntbXz1siyTOyoABcMMLyUrPv36XZ3izC8lKz79+l2d4wLj5Sm27GfWCdDevo8+r7u8pLxEP0efV93eUl4vUnktI7aT6yl6gAGSQZ5q+hp6+B0VVE17FTHFCGNwdpo5VkqrV+FeK9EnAKiOTCplCzNAyZMOQkrddam3P34Xfp6FHLra6q1VLoauNzHIuOKczxFvtZ6Ft+oKd+YmtmxwVEK6600FctPTPd1TnwZ4ORMkHUUb4dU1Q6tZtpaa4ojHLuv5fwaWAuUXCphUBi5NlB6KWsnpVzBIrV/oecAorUcmFPdRVUj7pDNM9XPRycVLfaCq/rdggd/hQprD0utarEyqLyLWbNTyy6biSZqtVE7SQtju+qGjbbwItKx6eikhFW99qpZtTrH2MyhaGd/Vwvf7EVSou69T9Z1XUu7EcplXN2IkQgdh4t6tc/khphltJrjUdB/wDKhiTK6WXGoqD/AOVCFaneQ6lUeU7opdC0ejoO6h6zyWn0dB3EPWbW3gfPkvjXqRvvZcVo9OPa12FeioVXcqucqrzUmv6QN66da2ga78vHBCiGv179+bHI7DsjSrT29qrxdqSJsvXJTahaxVx0l4FqoV6UTV9qFMtBTrT6npHZwnSLjW1/WUMLk7WoZ1sdlipyNU25g3alknND0kZb61f1fS70RcKpJpCf0hK3NubAimVVu3YXEDs5F2txiTkpXteKqqjAQGtoh3EAAqAMhEVyojUVVN70Pt7cL/MySSNzKfPFVTBVjXSLusQxqqrhpGLJM7CGp2m01d1qWw0kTnqvaicidNu9p46dWVd1TpLwXoqSBpHRNu0/A3q4mulxxVUNtRERMImEJmmt7Wd6TVTmd72vkqcw0ndbz9VOiio4KKFsVPG1jETHBDvAJI0hzlcuVAABQgT6RH5Y/inzMLsJ6Vd8TNfSI/JH3kMJsJ6Vd8SFf8YdRpv7dXopZZOSAJyQE0cuB11EEdREsczEc1exUOwAqiqi5QinXu19Jc2PnomIyXnhEIJulnu2lq5XdGRnRXg5C5hgtR6Zob3TPjqIm9JU54I+ooWyd5mim3WfaqWlxDU95hDe3+67oerpbo7KcukpOVputLdKdstJK16KmeClbNe7aVlmlfUULHPizn8JgtLazummqtrHOf0Grxa5THiq5IHbkyaE1XbP0l2j9ptzkReRb8Gi6F3Bt2ooWxulbHUInFHLjJvTVRyIqLlFJVkjZE3mqc/qqSakkWKZuFQAA9mMAAAAAADw3v0TVdxT3Hivfomq7ilF4FyHzG9UKZ6t9O1XfX5mIMvq307Vd9fmYg1V3iU+gqbym9EAABfAAAO+i87i7yFxNvPVik7iFO6LzuLvIXE289WKTuISNs8bjQdu/Ij6mygAmjmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANW3J9V6rur8jaTVtyfVeq7q/Ity+BehmW/4qPqhT6s86l7x0ndWedS946TVzv7PCgABU9AAAGX0n6epe+nzLmWT0TS9xCmek/T1L30+ZcyyeiaXuIStr4OObbeeKL9T2gAljnYAAAB8c5GoquVEQ0vWevbfp+nf/AGjXzY4NRTw97WJlymRTUstU9I4W5VTaLpdKS2QOlrJmsaiZ4qQRuJu0+odJR2dVRnLrEU0bVus7pqmscxjn9Uq4a1pm9DbY1t4kZNWtcyLOVyRUtXJOu5Ch0Gg2fpLSz2q5ORXcv+8TULZa7tqm4ojGySvevFy9hP8AoDa2js8UdRXoklQqZVFTkbnpjS1BYKZrKaFvTRMK7BnzIpqFsfefqpDXraqWr/o0vcZ+6nCGGOFiMiajWp2IcwCQNQVVXVQAAUAAAC8lKz79+l2d4swvJSs+/fpdneMC4+Uptuxn1gnQ3r6PPq+74qS8RD9Hn1fd8VJeL9J5TSO2k+speoABkEGAAADy3G301wp3Q1UTXscmFyh6gFTPE9NcrV3mrhSCNxNo/wCzlrbLxdz6tCDq6iqKGofDUxuY9q4VFQvQqIqYVMoaLrjby3aiie9kbY6lU4ORMEXU29Hd6LRTe7Htg+HENbq3n6p1KlJxVE9pJGgNvGakaj31CRt7TC6u0LctP1L0fG58SLwciHj0xqu4afqmLC9UYi8WqRjESN+JkN5qpZKyl37fImV4KT9ZdoLTb5Gvkf1zk9qEiWy309up0hpmI1iGi6F3Hob3CyKokayfkuVJDjkbIxHMciovahPwJFjMZyG7SXDtOzrVXKc+B5L1J1Vpq3p/0xqpTPVdStVe6mRVzlylwNYzpT6ZuL1XC9S7HgUsqZFlqJHrxVzlUj7o7wtNw2Ci7ssnRDrMnphyM1BQucuESVDGHtsvC70n/wAiEYmiodAmTMbk+5S61lkbJbKdzeXQQ9NRIkUD3uXCNRVMXpL0HTLnP4UPPrm5R23TtXK5yI7o4RMm0b2GbynAlgWSp7JvquP3Kwbr3BLjq2olRcon4TTj03OodVV88r1yrnKp5jWHu33q7md5pIUggZEnoiIe2ySrDdKeRFxhyFx9G1P1qxU785/ChS2N3Qka5OxclsNm6xavSkLnLnHAz7Y7D1aabtzBvU7JeSm/Fbt/q5XXZlPngWPkcjGOcq4REKnbyViVeqZeiuUYqoZdydiLHM13YqHfr97khoQATKrhE4kFnB10Hpt9BU3CobDSROke5cIiIbRo3Qdx1FOzosdHCq8XKhYzRegbZpyBitia+oROLl48TLp6N8+q6Ia3edpaa2orE7z+Sf8AJHu3e0fQbHWXtMP5pGvEmygooKGBsNNG1jGphMIelEwmE5AnIYGQphqHKbldqm5Sb87v09EAALxGAAAAAAECfSI/JH3kMLsJ6Vd8TNfSI/JH3kMJsJ6Vd8SFf8YdRpv7dXoWWTkgCckBNHLgAAAD49yNarl5IaNXazjffG2+ncnSRcKeHvRnEyaaklqVVI04aqbrU08VTGrJmI5q9ioRXuDtXS3SKSptrUjqE49FE5krQKroWK7mqHMpJEyVMOQvUNxqLfJvwOx/sUtrbdd9LXDL2yQyMXgqclJY273cwsVFelwnLrFJb1Ppa33+lfHVRN6aphHYK6a421r7HUPlpGukgzlMJyIl8EtI7ejXKHQKe6W/aGLsKxqNk/7wUtBb7hTXCBstLK17FTKYU9RUXSWurrpqqbFI9zoWrhzVLDaM15b9Q07MSNZNji1VM6nrGTaLopqt42aqLcu+3vM5oboA1UcmUXKAzDWgAAAeK9+iaruKe08V79E1XcUovAuQ+Y3qhTPVvp2q76/MxBl9W+narvr8zEGqu8Sn0FTeU3ogAAL4AAB30XncXeQuJt56sUncQp3Redxd5C4m3nqxSdxCRtnjcaDt35EfU2UAE0cwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABq25PqvVd1fkbSatuT6r1XdX5FuXwL0My3/FR9UKfVnnUveOk7qzzqXvHSaud/Z4UAAKnoAAAy+k/T1L30+ZcyyeiaXuIUz0n6epe+nzLmWT0TS9xCVtfBxzbbzxRfqe0AOVGoqquEQljnYPFdLnTWymdNVSNY1qZ4qa3q/XVusED/7Vr5kTkild9Z65uOpap0cbnpEq4RrVMOorGQ6cVNls2zVRcVR703Wczf8AcDdj89NanZ7MoRXR0d21TcOPWSK9efYbPoTbWuvUjZqxjo4ufEsFpbSNBYqdjYomrIifmwYLIZqtd6TRDaqi52+wRrBSJvSczR9vtrqe3sZUXBiOk54VCWKanipo0ZCxGNT2IdoJaKJsSYahz+vuU9fJ2kzsgA+Pc1iZcqIntUuGAfQYS4aotNA5W1FUxF/op6LVfbfdE/4Odr/8zzvtzjJfWlmaztFYuOeDJgHVUVMVO3pTPaxP6qeiyiKq4Q7QcIpWSsR0bkc1e1DmCipjiF5KVn379Ls7xZheSlZ9+/S7O8YFx8pTbdjPrBOhvX0efV93xUl4iH6PPq+74qS8X6TymkdtJ9ZS9QADIIMAKuOYRc8gAAqonNcBFRe0AAZT2oEVF5LkA8V0tlLcoHRVUTXoqYyqEHbh7VLH1lVa25bzwhPx8e1r2q1yIqL2KWJqdkyYchK2y8VFtfvRLpy9CkEjK6y1mPxwyMX4EqaA3TnppI6a5Oyzl0lJQ1pt5b75C98cbWTKnNEK8aw0VcNP1T1WJzoUXg5EIh8M1G7ebwOjU1xt20MXZTJh/wD3gT7uDqKjrdGTPppmq6Rq8EX+hVZyYe74ntfdaxadKd0zurTh0cnhLFRUe0KjlTgS9ktCWqN0aLnK5Pp7rEiLeKXK4TpoeA5RyOikR7Fw5O0sZ4KTL27zVRC1y6xt9g05D05Wq9I+CIvaQXrvcGt1DK+JjlbT55ZNOq7hVVbUbPK5zU5Jk8hlTVb5U3U0Q1217N09E9Znd56rx5DtyADFNkClidj7zT0WnVZUytajcrxUrse2nulXTRLHDK5rF7EUvQTdg/fIm8WxLnT9gq41J23D3VjgSSltjuk7kqoQNcq6W4Vb553KrnLk8z3OkernKrnKbZo3RNw1BVMxE5sGeLlQSSyVTsFqjoKOyQK7hzVfU1y32+ouE7YqaNz3L7EJo292oWToVV1TDeaNUkbRegLfYYGK6Nr5UTmqG7tajGo1qIiJ2ISVNbkb3pOJpV72wfNmGj0TmeO1WultlO2GliaxETHBD2gEmiImiGiPe56q5y5UHxyo1FVVwiH0jbdbWXkShdDTOTrXcOCniSRI2q5xk0VHJWzJDFxU3qS8UMcnQdUMR3xPZDKyZiOjcjmr2oUtqtT3SepdL9ZkTK55kvbM69nqKlLdXv6WeDVVTChuDZH7qpg2m5bHTUdOs7Hb2OKE7g+Ncjky1cofSRNLAAAIE+kR+SPvIYTYT0q74mb+kR+SPvIYTYT0q74kLJ8Yh1Gm/t1ehZZOSAJyQE0cuAAAOqrar6aRqc1RSsd5q5bHuGssyqjFk4qvsyWhXiQZvzYomtZWQtxLnsMKuaqsRzfQ2rZSoY2pdTycHpgmKw3CK422GaFyKitQyJG+ybqhdNxpUdLlwySQZML99iOUgrlTJS1T4WrlEUHTV0sNXEsc8bXtXsVDuBcMNFVq5Qh3cDauCtbJU25qNk54QhSemu+k7jlOsjVi/BFLmmsat0hQX+le2SJiSKn5sEdUUKP70eim5WfaqSBEgrO8wjXb3ddkvV011dh3LKkz2+vp6+BstNI17VTPBSrmtdurhYpnzUrHPiRcoqdh5dHa+uWnqpjJZHuiauFa5eRYirHwruTISlfs3TXJntVtcmeRbcGpaO1tb9QUzFbI1sypxbk21FRUyhLMe16Zapz+oppaZ6xytwqA8V79E1XcU9p4b36Jqu4pVeB4h8xvVCmmrfTtV31+ZiDL6t9O1XfX5mINVd4lPoKm8pvRAAAXwAADvovO4u8hcTbz1YpO4hTui87i7yFxNvPVik7iEjbPG40HbvyI+psoAJo5gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADVtyfVeq7q/I2k1bcn1Xqu6vyLcvgXoZlv+Kj6oU+rPOpe8dJ3VnnUveOk1c7+zwoAAVPQAABl9J+nqXvp8y5dk9E0vcQpzoxiPv9LlUREemVLOXTWtt0/Y41dM10jWYRqKSdtcjGuc5Tnm2kElTLFFE3Km4V1bBQwOlqZGsY1M8VIT3B3ZRiyUlpdy4K5FI/1ruDc9Szuihe9kKrhEbwyduiNua+/1DJalrmQKuVVe0rLWPmd2cKHi3bN01tj9qubkzy/7xNdghu2qrlhvWSvev+SE3be7Uw0LGVN0aj5OC9FU5G+6T0dbtP0zGQQtWRE4uVOJsycC9T0KM70mqkXeNq5J0WCjTdZ+6nTS0sVLE2OBiNaiY4IdwBImmqquXKgLw5mNvF6orTA6WsnYxETtUhTXe8D3OkpbLjo8leWJqhkKZcpK22zVVyduwt05+hLGqdZWvT0KuqZmOkTkxF4kFav3auFwmfHb3LFDyQjW53Sruc7payZ8jlXPFeR48kNPXvk0boh0u07J0tEiPl77/v4Hvr7vW10ivnneqr/U2jbTUtRa77C18zuqc5EXKmkH2N7o3o9iqjkXKKhiNkVjkcimxVFHFNCsKpoqF5qKrZUULKhqorVbnJXveTWtYt6+q0UysijXHBTxae3Zq6CyLQyplUZ0UUja8XCS518tTKv4nrniSVVWpJGiMXU0uwbMPpKt8lS1FROBMO0+48yVTKG5SdJrlwiqWAikbLG17Fy1yZRSi9FUOpaqOaNVRzVzlC3W112W66ZgfI7L2oiF23VKvTs3ehG7ZWaOnVKuFMIvE3BeSlZ9+/S7O8WYXkpWffv0wz4l24+SpH7GfWCdDevo8+r7vipLxEP0efV93xUl4v0nlNI7aT6yl6gOVGoqquECrhMryIb3a3Ens860dvVOlyVT3NM2Fu84wrdbprjMkMPEzu5OrKiggWG2IrpP6DbbVs1bRuju2WSt7VIFk13XTPV07WvVfagdrerbG5ImoxXJzaRftyb+/nTkdATZVfZfZlamf8vUkjdDcyqo7j9WtMuEavFUNHbutqJE84NRip6691irGx8sjl7EybVQbYX2qj6ToHM4ZTKGKs08zlczJMsttqt8LYp0blOfE5v3V1E7/wAgkTaPcWe5VzqS7zJl35VUiu7bf3u2xuklpnKxO1ENaglqbbVtkYropmL8A2omheivyVntFtuNO5lOjdfVPQvM1zXIitVFRfYfSsOkt1LrS1kMVS5HxKqNXPEsjZq5txt0NS3/ALjUUm4Klk6d05hd7HUWpU7XVF4Ke0x91tFJdKd0VVE1zXJjkZAF9URdFIdj3RrvNXCldtxdpp6V0lZZ29OPmsaIQ5U08tNK6OdjmPauFRUL1uajmq1yIqLzRTQNebb27UED5II2w1OMorUxki6m3IveiN/sm2Lo8Q1uqf5fyVPBseqNI3PT1U9lTC5Y0Xg9E4GufEiXIrVw7Q6PDPHOxHxLlFAAKF0AD4BQF5ndSUk9ZO2KmjdI9y4REQz2lNH3LUFUxkELkjVeL1TgWR0Ht5btOU7XyRNmqVTi5yZwpkU9I+dc8ENevO0VNbG48T+Sf8kb7e7STTOjq7wnRYvFI1QnS02iktcDYqSJrWtT2HvREaiIiYROwE7DTshTDUOU3O9VVyfvTO05egABfIkABVREVV5IAYjVNyS2Weeo6XRc1q4K8ulZqZ1XPcKhPwuXooq9htu+Wr2NhW20r8vXg7CkTaa0zeL0uKJXta5ePFeJD1c6uk3Gpk6Vs5a0p6JamZ24ruCryO6Sit0cro+m1eJnbHQUtratfTzI17eKcTKxbPXF8HTkkXrFTPM1rUOgr/Z4Xud1r4UT/pyY3ZyR95WE6ldSVf8ARZOn3/eTxtVqN98oJOsd0lYqob8VU2k1bJp29JTT8IZF6KovYWkoqqOspmTQuRzHJlFQlaOdJY9eKHPNprW6hq1Vqdx3A7wAZhrZAn0iPyR95DCbCelXfEzf0iPyR95DCbCelXfEhZPjEOo039ur0LLJyQBOSHGXPVuxzwTRy8+OlY1fxPRP8wk0a8nt8Sv+udUXKh1T9WSZzIXOxzweHVt51DZqeGrgle6mkT82V4GE6ta3OnA2mHZaSVGf1ERXpoWP6xn62+JreqrBBfkY2R7Vai5XiVq+8i+KnGdVX4j7yL4nKZfEsOuMTkwqEpBsZXQPSSOREVC1NmoqW2UbIIFYiNTHMyHWM/W3xKifePfc/wB//J9+8i+/vL4lUuUSJhEPEmxFY9yuc9FVS3XWM/W3xORUaLca+rMzEyrx5Z5kr2DVWsKygikhpWOYqc1ZkvR1zJOCKR9bsnU0jUc57dea4JiBFlXrLUFqa2W6UrWw5/EqNwbxpfUFNfqFs9O5M9qGQyZr13fUham1z07O1dhW80XKGUrKSGshdFOxHNdzyhD+4G00NYklTamox/Pop2kzheIlhZKmHILfdKi3yb8Dsfd6FMHpdtJ3HoqskTmKTFt9uxHOkdLdnYfyRyqSFrHRdv1HSuZLE1svY5EwpXXWe3ty07UufCx74EXg5ueBFOimo13matN/grrdtFH2VSm7J/3gWtoqyCthbLTyNe1yZTCnTfFxaaruKVa0PuFctOVDYpnukgzhUdxwWAodXW6/6elfFOxsjmcWqpnQVbJm8lNVuWztRbJmuxvMzxQqzqz07Vd9fmYgzWsGdC/VXHKdNTCkA7xKdgplzC3ogAAL4AAB30XncXeQuJt56sUncQp3Redxd5C4m3nqxSdxCRtnjcaDt35EfU2UAE0cwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABq25PqvVd1fkbSatuT6r1XdX5FuXwL0My3/ABUfVCn1Z51L3jpO6s86l7x0mrnf2eFAACp6AAAO2mqJKaZJIXK1yGWgiumoahsadZJnh2qhiqNWfWY+t/J0uPwLRbXW2wpbIZaVInVCtRV+JepYFmcrc4Qgb7c22yJJtzeX0+41rb3amOFIqq5ty7nhSZaGigooWxU8bWNRMcEO9qI1ERqYQ+k/DAyFMNQ5FcbrUXGTfmd+noADx3evitlvlqp1wyNMqXlXGpHsar3I1vFTvqaiKmjV8z2sanaqkZa63SorS18FG5JJcYTBGG4O5VZdKmWno3qyFFxlFIzmlkmer5XK5y9qqQ9Tcf8ATEdGsuxqYSat+RntS6tuV+ne6pmekarwZnga8ARTnK5cuU6BDCyBqMjTCGX0xb4rncUgmcjUVOBnJdJLT3JaeRfwO/K41GkqH01QyWNyo5q54ErQzy32yRVUCL1sCJlUL8KNcmF4kZcZZoHo9q91dOimqfY2X626Jzsezic6LSnW9bC9cSpy/qbfU/WHWuKta1esbzPNdEqmupq+mjXmnSRC8sLE1wR7a+d/d3k5fqhGFzopKCrfDKioqLg8pJOvbK+e3Q3BseHuRM8CP4KGomejGxuyYskaxuwTVHWNnhR6r1PNwyhY3YSuR1tWDpZx/UgqHT9VI7GMKTVsnZ6mgmV0ir0VMqhRySouCC2qfDLQObvaoTa78q/ArPv16XZ8SzDvyr8Cs+/XpdnxJK4+SppWxn1gnQ3v6PPq+74qS8RD9Hn1fd8VJeL1J5TSO2k+spep11S4p5O6pUrdhyu1HN0lzxLa1Pm8ndUqVux6xzfExLn5aE5sP8U7oaOhltNWea93SKkgRVVy8TEk27DWZrWz3SRmVjThn4EVTxdrIjToV3rvYaV0ycfTqbha7PadFWuN0sTJKzGeKccmuX3c+6UT8tpFZAnJcGTpJ49R6skbUSIkUTvyqpru9N4t7I22+jYzpMTCqhJyP3I1Vi4RDR6OnbPVtjqmdo92qqvBDMaf3Zo7pK2lusTOi7hxQbkaCorpaFulka1FROkqNK/NcrHI5q4VOKKWD2Jv8l1oaq21jum1jcJks08/tH9KX1JK6Wv3OiV9AuEb4k9FQgamhdDcWxSJhzX4Ut/t4qrpqlyv/QhW3cS2NtmtnxsbhrnZTxLI7eerVL3UPdvYrJHNX0MPbGdKiihmbwdqbOACYObgAAGLvtko7zSuhq4muymMqhAGv9q6m3vfU25qvh4rhCyZwmZHJGrZURW9uTHnpmTJ3uJM2q+VNsf/AE1y3kUYqqWallWOeNzHJ7UOknzeW2WKGlfLCsaVHsQgRuOsTPLJr88Swu3c5Ow2q4pcadJkaqdTvoqOetlSOnjc5y+xCXdAbTzVbmVV0RWx8F6KmwbO26wyUkcr1jWp9ik0xMYxiJGiI3swSNJQtciPeuTTNodqZ4nupqdu796/8GOsllo7PTNio4WsRE5ohkwCWRERMIc7kkdI5XPXKqAAVPAAAAMDrW5pa7BUzouHI1cGeIz3xnfDp5UZnCpxLU7tyNVJC1U6VFXHEvBVIT05bqnWGq3PnVXt6fHPsyThUWxdIU0MtFHlqIiORENC2BgYtxlkXHSJ7uNJHWUr45Wo5FTtMCihRY9/1U2zaW5OjrW0y+W1E0MZaNQ01XbEqZHozCZVFOqku9Bfny0rWtkZyXgQtrB11o7w+329r0he7HAlbbbT62q2Mlmysz0yuTIjmdI7cxw4kVXWyCjg9p3tXeFEIb3k0g2x3FK2harY3LngnI3/AGb1ZHPaG01XKiKxMJlTN7x0sU2mZnvROkiLhSu2lquWmbN1L3NxnkYcn/jVGW8FNko2+/LQjJl7zVxkuHT1MVQ3pQvRyf0O0jPZSvnrbVItQ5XKnLJJhKRSdo1HGgXCkWjqHQKucECfSI/JH3k+ZhdhPSrviZr6RP5I+8hhdhPSrviRL/jDotN/bq9FLKpyQKmUVAnJATRy4rjvxbnUl2hqUTCZ6WTadN/VtX7bvo3YdUxMXHtNj3f0y6+WZ0kSZkjQgnQmpp9I3WeGbpJG78LmqQ8v9Cdd7wuOlUGbpamdiv8AViXKGo3SkdQ3CanemFY5U4nlM/rOup7ldH1NPj8a5XBgCMVERVRDfad7nxtc9MLgAAopePXaInTXOmjYmVc9ELl6PpUpdP0kfRRFRiZ4Fedl9Iy3W7traiNUpo+KKvLJNms9XUWm7csTJGrKjcI1FJa3t7Jiyv0yc32umWvqY6Gn1cnEwG9l7paazOp1VrpHJjHaefYiKVLY6R2Uaq54kaUlLdNfX9JJGv8Aq/S7U4YLF6UskVjtkdPGiIqJxLkCunm7X0Qwbo2K121KDOZHar9xmwASRpAPNcKGnr4HRVMbXsVO1D0gKmeJ6a5WrvNXUhDcHahkrZKq1ojV59FEIak8qaenkhVZI0zhS6bkRUVHIip/UjDda22JbdLNP1TahEXGPaRdVRNwsjFwpvVh2mmVyUtS3fRSslTPJUyrJKqq5eZ1HbV9D6zJ1X5M8DqIc6e3GNAACp6AAAO+i87i7yFxNvPVik7iFO6LzuLvIXE289WKTuISNs8bjQdu/Ij6mygAmjmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANW3J9V6rur8jaTVtyfVeq7q/Ity+BehmW/4qPqhT6s86l7x0ndWedS946TVzv7PCgABU9AAAAzunNT19jqWPp5ndFq8smCARVauW8S1LEyZqskTKKWh0DudR3hjIK56RzcsrwJNikZKxHxuRzV5KhRamnkp5UkierHJyVCVNBbrVVrfHT3NyyQcukvElKa4f6ZTnl72NXWah/wDr/BZch7fHV31KhfamIqLMmFUkqwagoL3SsmpJmL0kz0c8TU9y9v2apYkkKo2oROCqZ1RvPiXszVrN2FJXt9uTCJ+ylYorZPUZezkvE9Men6pV/FwQkKHa/UlLN1UPQVEXgqqZJ+2WrHx9HpU6Z/xEK2kf6tU6c+/0zV0mbjqRmyywMfiZ+E7eJ7Es1sXH/Es8SQaXZy7ytX67OzK/pce2i2VdG/M86qnxLiUki/6DFl2hovWo+RGU9ntTGZbUNVTP6d1HQaftc1Oz+06ZI1Ls/SNeiyvVW+wy0G1VoY5FcxHfFC82kmauWoiEbU7RW+RnZyvc5CIE13A2ifTthXC8uB9j1q/6qkX1VVTs/CTlHtzYGIn/AAka4/wnsboeyNRESjj4f4S6lJP6uMB20VrTwxKpAlRqmtrKPqXUL3RdnA8dK64Pa58Fufx7eiWTj0vao2dFtLHj4Hrgs9DAzosp2InwPXsT1XvOLP0qpo0VIof3Kvw2fUlVP0oqOVqKvsJz2yttbR0afXmK1/8AVDd4qWGJMMjaifA7URGpwREL8FIkTt7OSLum0bq+LskjRqB35V+BWjfr0uz4lmF5KVn389MM+J4uHkqZGxn1gnQ3r6PPq+74qS8RD9Hn1fd8VJeL1J5TSO2k+spep11Xm8nwKlbr+sc/xLaVXCnk+ClSt1/WOb4mJc/LQnNh/indDSCfNhroya11NuynWOTBAhtO3monaevsNQq/2arhUIulk7KRFU32+0K1tG+NvHinVDM6xmr9L6nqXQuc1HqaRdLhNcalZp3K5y+0shq3TNDry0sq7fIxZ1bngvHJCl329vdBUOj+rueiLwVEL1TBI1e7q1SPst1pZY0SXDZUTC50XQ04nL6O1slZNWVsidGNG5RV7TVNLbW3e5VMa1MaxRZy7PDgSpqO62zQGlVoKR7VqXN6PBeOT3SQqxe2k0RDG2guTKqP3fSLvPfpp6IRTurXsrtdq5ioqNVGlhdvPVul7iFRn1bq27pUTKrnPfn+S3O3a501S9xC/QP35XO5kVtbT+zUEEP+Ohs4AJc5wADV9X6ytunaVz55mrJjg1Fyp5c5GJlyl6CnkqHpHEmVU2CtrIKKF0tTI1jETOVUhzcLdWKBslLa3I53JXIpHWttxbhqGd8VO97IHLhEReZ1aK0DcdRVLZJWPbFnKq7tIqatfKvZwIdAtuzNPQM9quTuHoa7X1VyvcrpZVke1VyYrqXrN1WPxZxgtBV6Jt9i0vLiNqytZxXBXVmPtMiY4dZjH+ZhVFO6LG8uqmz2m8RVzX9g3DW8D5QVtysc7ZGOkjRFyTZt7utHUJHS3RyNdwRHKpsEeiLdfdMxr1TUmczguCDtY6GuenKtz2RvdCi5RzU5GRuTUnfbqhErU26/71PMm7IhbWjqoayBstO9HscmUVFO8qpoXcivsE7Iat75KdOCovYWJ0rq226hpWSU0zUeqcWqvEkqerZOmmimkXjZ6ptrlcqbzOaGxAAyjXwAAAaXuraluWmZ+gmXsTghuh11MLaiB8UiZa5MKeHt32q0yaSoWmmbMnouSsG0d7bZNRuhqvwI53R4ln6eZlRC2SNUcxyZ4Fa929HTWO5rcqL8Marnge3QG7PkynZS3RXOYnBF5kZTT+zOWGQ3u9WtbzE24UWqqmqE+T2mjnmSWSFqvTtVD3Ma1jUa1ERqGiwbnWOWnSXrkThnCrxNQ1dvJRsppYLUirKqY6RnOqYWJnJq0NjuNS9I9xdOfBD5vvqeOOlS3U8iOe7g5EU1vaTRq3amdLUNVGL2mk2WlrtZ6kZ1vTf0n5cvPCFq9K2SKx2uKniRMoiZVDAgatVKsruCG13SZtgoG0ULv6i6qcNLafgsNO6KBMIpnQCWa1GphDns0z5nrJIuVUgX6RP5IvihhNhfSrviZv6RP5Iu8hg9hfSq/EhnfGHTab+3V6KWWTkgPjfyp8DGXO+UVtdirlRn9VUmVVETKnMWRukXdYmVMlIxskbmPTLVTCoVd3vsLbZqF1RC3EUnsLBprGyryrIv/ZDQ9zaW16rpWfVqqLrU/wASGFWtbNHhq6m07MyzW+sR0jVRq6LoVrPuSRU20len4K6nT4vQ+ptfVe/0n/8AohDezyp6HTffNF6vI5OcHRWZqP8Ay54khfdhUov4q+lx/SRD02zbqOGvjdW1kKwovHDkHs8qrqh5deqPdVUfkyNk18622Jtss1OqzqmMtQ7bBoe86ouCVd5dIkbl6WHG/wBnt+j7OjHpJA6Rqc1VDaaPVVme5sNLMxV5YaqEoynR2Eldw9DRKq7OhV7qCBUV3FypqerTmnqOx0jIqaNqKic8GaOEUjZY0e3kpzJJqI1MIaPNK+V6vkXKqAAVLYOueaOCNXyvRrU5qpidR6joLDSPmrJmtVE/LniV519ujWXmV8Nve6On5cFxkxqiqZAmvEnLRYKm5u7iYbzJK1/ujS2uOSntz0kl5dJOJX+/6jr7zUPfUTOVHLyyYiaWSZ6vlcrnLzVTgQc1TJMuvA6tarFTW1mGJl3MIACwTYABUAAAHfRedxd5C4m3nqxSdxCndF53F3kLibeerFJ3EJG2eNxoO3fkR9TZQATRzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGrbk+q9V3V+RtJq25PqvVd1fkW5fAvQzLf8VH1Qp9WedS946TurPOpe8dJq539nhQAAqegAAAAAAMAFMAzmmtT3CwVLZKSZyNReLc8yw2gt0KG8wsgrXpFU8E4rzKunZBNJBIj4Xq1yccopkQVUkHDVCCu1gprm3vph3NC9MUjJmI+NyOavahzK07d7pVVukZS3J6vh5Iq9hYGx32ivFO2Slla5VTOMk5BUsmTTicpu1jqbY/EiZbzMqADIIUAAAAAAAAAAAALyUrPv56XZ8SzC8lKz79+l2d4wLj5Km27GfWCdDevo8+r7vipLxEP0efV93xUl4v0nlNI7aT6yl6nxyI5qovJUwV03p0jW+U3VlNEro19iFjDoq6SGrjVk8bXtX2oVqIEnZuqWbPdX2uo7ZqZT1QpEtsq0XHUvz8FCWys5pA/wUuK7SVocqqtKzj/AEOTdKWlvKmZ4Eb7rX/I3b6dxfZqVf0vqS/6ce1adsrok/6cKSlat1KiWFPrtuy9PahKC6XtK/8Ais8Dj9lbV7szwMiOlmiTDX6ERW3+3Vq70tPrzIg1Durc1idHb6JzMpjLUIovMt3vVU6orWyvcvHii8C2yaVtKc6Vi/5H1dLWnspWJ/keZaKSXxPL1DtNQUHkQYXn6lTNOabr7hc4WMgdjpJlcFuNK0C26yU0DvzNYmTsorFb6N/Sgp2Nd7cGT4InsQv0tIlPlc6kTf8AaF123Wo3DUB0VtZBRwulqJGsaiZ4qYDVWrqCw0znyytWRE/LkrxrjcWvvtQ+Kle5kCrjCFairZCnNS3Z9nam5O3sbrOZIu4e7cVG19JZ8PkXh007CEppbrqe4Kr1kmkcvLsM1pDQ1y1FVNdIx7Yl5uXtLC6N0DbrDCxyxtfMnaqEekc1YuX6NNykrLbs3H2cCb0hH+3O06IjKu8N4/mRik2W+gp6CBsVNG1jUTHBD0tajURGphE7D6SsMDIUw1Dn9yu1RcZN+Z2nL0MBrj1dqe6pUhvrKn/yf7luNb+r1T3VKjt9Zf8AU/3I25eJpu2xPw8pbnRXq/Td1DJXK3U1xp3Q1UTXtcmOKGM0R6vU3dQzxKRpliZNBqnOZUvc1cLlSBNwtpeislXZ0znirEQielqbtpa4orHSQvY7Kp2KXSciORUcmUXsNG1xoCgv1O97I2sn7FMCooEVd+LRTb7PtYrUSnr03mrpn+TWdvt2aa4sZS3XEUycOkvaS1S1MVVE2SB6OaqZ4KVG1Voq56dqVe1j+ravB6IZbQ+5VwskzIat7nwouML2FuGudGu5MZVz2Wgq2e02xePoWpBrWldXUF+pmvilakip+XJsqceRKtcj0y00GeCSnescqYVAAD0WTUdy7Sl009O3o5c1q4K+WHTVBNHVJXO6EsblREUtdNE2aJ0b0y1yYUgjd7S81Aj6q3MVGO4r0SOrYUX+pjODdNl7kqItErt3eXRSMqqxQpO5Ip/7PPtMtBpu3T0L+jKjp8cDSXVdS1ytV7soSDtDZqy63xkkrXrToqZVSLi3ZHo1EN+rlkpoFmfJhG69SQNibB9RbNLPH+PKojlQmY8lut8FBEjIGI34HrNggiSJiNQ49da9a+pdOvqAAXSOIF+kT+WL4oYPYX0qvxM39Ij8kfeQwuwnpV3xIZ/xh1Gm/t1eillG/lT4Gsas0hTahYqTSKxfahtCckBLuaj0w45pBUSU70kiXCoQLd9mqhkquoquRWmEftdqGCTEEz1b7cllRhPYhiOoIlXJscW11exMOVHdUK0rtrqZec0niPuz1Iv/AHpPEsthPYh86KexCnu+Pmpc+mNZ/i35Favuz1Kn/ek8R92up1XCzSY+JZbCexBhPYPd8XNR9Maz/FvyK7Um0F1mVq1NVIn+ZvelNroLRIyaWoc96ccKScD2yjiYuUQwqraavqW7iuwn3IcIIkhiaxvJDmDDah1FQ2SmdJUzNRUTlkylVGplSDjjfM/dYmVUy8sjImK6RyNanaqkba83PoLJDJDRvSaqwqYRSM9f7qVdxc+mtr1ZFyVU7SKp5pKiRZJnuc5VzlVIqpuP+mI6BZdjc4mrv/r/ACZfU2pa/UFY6aslcrVXg3PBDCYAIpVVy5dxOixRMhYjI0wiAAFC4AAVAAAAAAB30XncXeQuJt56sUncQp3Redxd5C4m3nqxSdxCRtnjcaDt35EfU2UAE0cwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABq25PqvVd1fkbSatuT6r1XdX5FuXwL0My3/FR9UKfVnnUveOk7qzzqXvHSaud/Z4UAAKnoAAAAAAAAAAAAfA2TS2rbhYKljoZXLGi8WqprYCKrVy3RSzNBHOxWSJlFLU6G3LoL1HHDUvSObGOK4JFjkZKxHxuRzV5KhRelqZaWVJIHqxyLnKKSzt/uvPbnR010VXw8ukpK01wz3ZTnd72OVuZqLX7v4LIgxljvdFeaVs1FM16KmcZ4mTJVFRUyhz+SN0blY9MKgABU8AAAAAABeSlZ9+/S7O8WYXkpWffv0uzvGBcfKU23Yz6wTob19Hn1fd8VJeIh+jz6vu+KkvF6k8ppHbSfWUvUAAySDAAAAAAABrWqtYW3T1O99TM1ZETg1FPLnI1MuUvQQSVD0jiblVM9WVUNJC6SokaxqJnKqRFuBurBRtkprY7pScsoRvrncmvv07oqZzo4M4RGrzMZpPRNz1FVNe6N3VuXKuUipq10i7kKG/2zZeCiZ7VcncPQxtVW3bU9flVlkVy8k4ohKu3m1SuVlTdG8OeFJD0bt/QWOBivja+bHFVQ3hjWsajWoiIh7p6DC78uqmJd9rN5vs9Am63meS2W2mt1O2KmiaxrUxwQ9gBJomNENHc9z13nLlQACp5MDrj1dqe6pUdvrL/qf7luNcertT3VKjt9Zf9T/ch7l4mnSdiPh5S3GiPV6m7qGeMDoj1epu6hniVj8CHP634h/VQAD2Yx4LtaqW6U7oqqJrkcmMqhB+v9qFj6yptbeHFcIT+fHta9qtciKi9hYmp2TJhyErbLxU21+9EunL0KXUVfdNMXHCOkjVi8UXKITnt5ujT17WU1yf0ZeWVNg1vt3QX2J742IyZU5ohXvVOkLppmsc7oP6tF/C9pFK2ajXKatN+ZPbdpItyTuyFvqaoiqYkkge17V7UU7SrWhNza6yzshrHOkhzhekvIsNpnVVuv1MySlmb01Ti3JJU9WyZNOJpV32fqba7Lky3mhnzyXOgguNK+CoYjmuTHE9YMlUzopBtcrFRzVwpFtZtLbpqtZEREaq5wbvpnTtHYaRIaWNEXtXBmwW2QRsXeampnVN1q6liRyvVUAALpHgAAECfSI/JH3kMLsJ6Vd8TNfSI/JH3k+ZhNhPSrviQz/jDqNN/bq9FLLJyQBOSAmTlwAAAAAAAAAOE0rIWK+V6NanNVUx19vlFZaR09bM1iInLPEr5uDunU3OWSntrlZBnGU7THnqWQprxJq02Opub/6aYb6qSRrzc6itDHwUT0fPyyi5K/am1TcL9UOfUSu6C/8ATkwdRPJUSrJM9XOXmqnWQc9S+dddEOrWmwU1tam4mXc1GPaADHwToABUAAAAAAAAAAAAHfRedxd5C4m3nqxSdxCndF53F3kLibeerFJ3EJG2eNxoO3fkR9TZQATRzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGrbk+q9V3V+RtJq25PqvVd1fkW5fAvQzLf8VH1Qp9WedS946TurPOpe8dJq539nhQAAqegAAAAAAAAAAAAAAAACmAbBpjVlz09Utko53IxF4tVeCoWJ0BuZQX+GOGqckNSiYXpLzUqsdtLUTUszZIHuY9FyitXBkQVT4F01Qgbvs/TXNuXJh/NP+S9THNe1HNVFRe1D6V2273XlpOro7s7pR8kcpPFnvNHdadstLM1yKnJFJ2CoZMmWnJ7pZam2v3ZU05+hkQAXyIAAAC8lKz79+l2d4swvJSs+/fpdnxMC4+Uptuxn1gnQ3r6PPq+74qS8RD9Hn1fd8VJeL9J5TSO2k+speoABkEGAAADqqaiKmidJM9GtRMqqmD1Nqu32Knc+omZ00Tg3JXzXm5tde5H09G5WQZxw4Kpiz1bIU14k9adn6m5ORWphnNTf9w92IaFJKS0r0puKdNF5EG11wumpK5VldJNK9eSGR0vo+5ajqWuax/QcvFyliNCbd2/T8LZZYmyVCpx6SZI1GTVrsu0Q3eSotuzUW5Em9J+/wD6I3272mmqXR1l3ToM4L0FQni1WqltlO2GliaxrUxwQ9rWtY1GtREROxD6SsFOyFMNNAul5qbk/elXT0T0AAL5EgAAAAAGB1x6u1PdUqO31l/1P9y3GuPV2p7qlR2+sv8Aqf7kPcvE06TsR8PKW40R6vU3dQzxgdEer1N3UM8SsfgQ5/W/EP6qAAezGAAABj7vZ6O607oqyFr2r/QyAKKiLop6Y90bt5i4UrvuLtNNSukrLQnSj4qrEQjK2XW6aar0WF74pGrxapdR7WvarXIiovYpHevNtqC+xSTU8aR1GMphMEZUUGu/Dopvln2tRW+zXBN5vDP8mH2+3XprlHHS3RUjn5dJV5ks088dRE2SF6PYvFFQpzqPSlz07Vu6bHojV4PabPoHc2ussjKascskGcceODzBXOYu5MXrrsrFUs9ptq5z6fwWjBr+mtVW++07X08zOmqcW5NgJRrkcmUNAmhkgerJEwqAAHotAAAECfSI/JH3kMJsJ6Vd8TN/SI/JH3k+ZhdhPSrviQr/AIw6jTf26vQsqnJAE5ICaOXAAAAAxV8v1DZqZ0tXMxuE5KpRVREyp7jjfK5GMTKqZR72sarnqiInapHGvtzaCwwyQ0jkmqcYToryUjjcLdeor1kpbU7oRcuknMiOoqJamVZJ3ue9eKq5ckVU3DHdi+Z0CybHK7E1dw/x/kzWp9WXPUNS6SsncrFXg1F7DAAEUqq5cuXKnRYoY4WIyNMInIAAF0AAAAAAAAAAAAAAAAAA76LzuLvIXE289WKTuIU7ovO4u8hcTbz1YpO4hI2zxuNB278iPqbKACaOYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1bcn1Xqu6vyNpNW3ITOmKlP8K/Ity+BTMt/wAVH1Qp9WedS946TurPOpe8dJq539nhQAAqegAAAAAAAAAAAAAAAAAAAAB2m0aT1lcLBUsWOVywovFuTVwGq5q5apZngjqGLHKmUUthoncWgvcLI5pEZMqclN/Y9r2o5iorV5KhRejq56OZstPI5jkXPBSX9v8Admekeymuy9OPgiOVSWprhnuynOb1sc5mZqLVOX8FigY6y3mju9Kyejla5HJyyZElEVFTKGgvjdG5WvTCoF5KVn379Ls7xZh3BqlZ9+1/5uz4mDcfJU2rYz6wTob19Hn1fd8VJeIh+j1hNPuRPapLxepPKaR20n1lL1ABrmqNW2+w07nVEremicG5L7nI1MqREMEk70jiTKqZ2qqYqWNZJ3oxqdqqRRuDulTW9r6a3u6cnLKEa663LrrzLJDSPcyHOEwvM13TGlblqWrRWMerXLxcpFT17nruQodAteykVKz2m4rhE9P5PPcrpdNTVv43SSdJeDSQ9AbWz1j46i4tVrOeFJH0PtvRWaFktSxHzJx4oZ286qoLG5Iei3h2IIaJE/qTqLhtI+X/AMS1t05oZax2Sks9M2Klia3CYyiGUI++823/AKP5Pn3m0Haz+SQSeJqYRTUZLTcJXK97FVVJCBHv3m2/9CeJ9+823/o/kr7RHzPHuWt+zUkEEe/ebb/0fyffvMoP0fyPaI+Y9y1v2akggj1dzrcicWfyZzTmrqO9ydCHCKVbMxy4RS3La6uFqvexURDZgAXSPMDrj1dqe6pUdnrL/qf7luNcertT3VKjt9ZP9T/ch7l4mnSdifh5S3GifV6m7qGeMDoj1epu6hlrhVx0VJJPKuGsTJKR6MTJoNW1XVL0TjlTruVyprdF06qRrE/qpqVw3HtFMqo2Zq/5kHbna3qrtcpYIJXJC1ccFI8dLI78z3L/AJkZNclR26xDe7ZsUySJJKl2q+hbah3Gs9RjpTImf6mz228UVxbmlma/4KUibLI38r3J/mZ/TmrblZKhr4Z3K1F4pk8x3NUXvoXqzYaNWKtO/X7y5wIt0NujRXOKOKvekcvtUkinuFLUMR8U8bkX/ESscrJEy1TQay3VFE9WTNVD1A6vrEP7rPE7Gua5MtVF+ClwwlRU4mLvlio7vA6Oqia5VTGVQgbcLa6aic+ptzFdHzwhY44TRMmYrJGo5q9imPPTMmTvExar3U21+Y1y3kUxs94uWmq9Fa6SPorxaT5oHdGjurWU9c5I5sInE9WvNtaK7wvlpI0ZNz4IV+1Dpm6aarFV7JGtauUehF4mol01ab4jrbtLFh3dk/f/ANlyIJ4540fE9HNXtRTsKwaE3QrbVNHT1zlfAnDK9hYLTepqC+0zJKaVvSVOKZJOCqZMmnE0e7WCptjsvTLeaGdABkkEQJ9Ij8kfeT5mF2E9Ku+JmfpDr+GP4p8zDbCr/wA1d8SGf8YdRpv7dXopZVOSAJyQEycuBxkkZExXSORrU5qpj71eaO0Ur56uVrUanLJAW4W61RXvkpbU5WRcukimPPUshTLiYtVkqbm/EaYb6r6Ej663KobLE+GmkR8/LgpXnVGrK+/1TnzyvSNV4NyYKpqJaqV0k73PcvNVU6iDnqpJ+OiHV7Rs/TWxqK1Mu5qAAY6JgngACoAAAAAAAAAAAAAAAAAAAAAO+i87i7yFxNvPVik7iFO6LzuLvIXE289WKTuISNs8bjQdu/Ij6mygAmjmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANX3G9WanuqbQavuN6s1PdUty+BTMt3xUfVCntZ51L3jpO6s86l7x0mrnf2eFAACp6AAAAAAAAAAAAAAAAAAAAAAAAA7eABTGQbPpTWNx0/UtdBM5Y0Xi3JYvQu4tuv9OyOeVsVTjGHLzKmndR1U1FO2Wnkcx7Vyiopk09W+BccUNevGztNc25VN1/NC9HSRzFVqoqKnNCs2/Cqt4b8TL7d7sSQKyju7lc3GEevE1/eS40t0rI6ilejkVc8zOqqhk8GWmrWCzVNsue7MmmNF9CRPo8+gnfFSXJ5o4I3SSvRrE4qqkF7R6lt+n9MSPqZER6ZXGTVtf7oVl4kfBb3ujg5KqcMnuOqZDC3PExa2w1NzukqsTDc8VJI3C3SpbZFJT22RJJuWWryICul2uWoq5Vkc+Rz14NQ9GnNNXLUla1sTHuRy8XqnAsJoTbKhssUc1WxslRz4pkxcTVrsro0nVfbdmYt1vek/cjfQG1NTcHsqbo1Y4uCo1SfbHYqOz0rIaWJreimM4MnHG2JiMjajWpwREORKQUzIU7qamhXW+VNzd/UXDfRD478q/ArtuTWOp7/Mi8UwpYpeSlbN11Ty/Pn2FquXDCS2RajqtyLyI8nvL0mf0c8zr8sSe1TFyp/au+JxIHecvqdbSnjxwMr5Yk9qjyvJ/UxQGV5j2ePkZZLxIntPvlmTHaYgFd5eZX2ePkZSS7yObhMkq7QVT5qlFzjCkLEv7LrmoTGeZfpHL2qIpC3+JraJ6ohY+LKxNzzwcjhD/dN+BzNjOJrxMDrf1eqe6pUdvrL/AKn+5bjW/q9U91So7fWX/U/3Ie5eJp0jYn4eUtxon1epu6hg93K99HpqZI89JUwZzRPq9Td1DVd3LnBR25yVDOk32GfIuIf0NTo49+6ImM94q1M90krnvyqquTrwpujL7ZkVVdRoq905/aCyY8yb/wChr3Zt/wAjsPtUqadkppGD7hfYpu3l+yL/AOE3/wBAt/snuaf5NHZN/wAh7XL9kppkT5YnI6NXNX2oZij1NdqRMR1MuPZlTNeX7L7p/wDyfPL1l91//g9I1G8HFuSVZNHwqp4W6zvTXZSok8TadObr3W3vY2oVXszxyYTy7ZV/8X/+ThJe7M7CfVURe6XGyOZqjzDmpIKhu5JTafoWf0dqKHUNtZUR8HKnFDYCMdnK6mqaD/hWdFuOWMEnE/A9XsRVORXWmbTVT42phEBir5YqK8Uz4qmJq9JMZwZUFxURUwpgxyPicj2LhUK17hbVVFsc+ptbVfFzVqdhoFnvdz07Woscj2KxeLVUuhNEyaNzJGo5q8FRSMNf7X0l4jfPQMbHPzwiYIuegVF34dFN/tG1jJW+zXFMovr/ACdegN0qS6RRwXF7Y5uCZVeZKUE0c8aSRPRzV4oqFMr9p256drFbLG9nRXg9Dctvt0KuzytguD3SQcsquTzBXq1dyY9XbZOOdntNuXKLrj+DYPpC5RY/ihiNh8+VFx7Tlu/qGj1DQxzUrkymOBj9n7xSWepfPVPREQtOentW9nQlIYJW2JYVau9wwWiVzWR9J6oiInNSPtdbk2+xQvippGy1HLDV5KRxuHutNV9KltLlY3krkIfqqmarmdLPI571XKqql+puCJ3YiIsmxzn4mrdE/wAf5Ng1XrG46gqHOnlcjFX8qKaz2gESqq5cu4nRoYI4GJHEmEQAAF4AAAAAAAAAAAAAAAAAAAAAAAAAAA76LzuLvIXE289WKTuIU7ovO4u8hcTbz1YpO4hI2zxuNB278iPqbKACaOYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1fcb1Zqe6ptBq+43qzU91S3L4FMy3fFR9UKe1nnUveOk7qzzqXvHSaud/Z4UAAKnoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+tVWrlq4U+vke9PxuVficQp5VCmD00rKmfEMHTci/9KEm6C2vqrlJHPXNVkXPihre212orbd2LcGI5ir2lp9PXS33CkY6gfH0cflaSFDTRy95y/oaZtPeaugTs4GYRf8AUcNO6dobHTNipYmoqJxXBmgCca1GphDlUsr5nK+RcqoABUtheSlbN1/T06/0/wByya8lK17r+n5/gYNf5ZtmyHxbuhE0uOsdj2nA5S8JXfE4kCh2BOAABUqAAUAUl7ZeSNJ06TkTKkRNRXORqc1Jq0Jp2Kmsba1ahrJVTOMmRSIqyZT0ILaB7EpVY9cb2iE/RzxJE38bcY9p2skY/wDI5F+BDtDdZ5KlIHVOG5xnJttBcH0E8bXS9Y15OsnRxyiotDovXKmZ1v6vVPdUqO3hqX/U/wBy2msX9Zpmoena0qWnrL/qf7kdcvE03DYnSnmLcaJ46fpu6hHe/D2pblRcZJC0e9ItNwPdwRG5IL3pv7bpdEo6dekjV44MmqejafCkJYaZ812VzeDVVVIjwuM4XBybG9yZa1VQ3iz2ilqaTqpsNkxzPdabbR01R1FQ1FRy4yQyQKp0yS5MblETVCN8LnGFyfVY5ObVN+1Hp+no7lDJCqLE5UUy9zsFC62RyRo3pKhX2Z2p5W7RIjFx4iKkY5VwiKFY5FwqKShbNOUaUbppMKddJYKCrle9eiiNHsylPe8Wui6EZuYrU4oqDoOx0lauPab1W2enqaxsEKIjWrzPderTQ09sSGHCyonYU9nXVT2tzZlqY1U3/YGRrqFW9qJyJoK0bM39tovS0tSvRa9cJksrG9skbXsXLXJlCcoXo6JE5HK9q6Z8Ne568HaocgAZhrIAABhNR6cob5Sviqomq5U4OwV615tjV2qWSaiYr4eaIiFoDDajuluoaN63B0atxyUxammjlbl2hsFkvVXQyIyLvIvoUuqY54F6qZHNx2KdbXvZ+VyobXuLcqK4XqR1vYjY0VeRqRrzmo1yoinZaaR0sTXvbhV9AuVXKrlQAUMgAAqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADvovO4u8hcTbz1YpO4hTui87i7yFxNvPVik7iEjbPG40HbvyI+psoAJo5gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADV9xvVmp7qm0Gr7j+rNT3VLcvgUzLd8VH1Qp7WedS946TurPOpe8dJq539nhQAAqegAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAByXKczZ9J6wr7BUMdFM9Y0Xi1VNYARVauWqWZoI52KyVMopbHQu4lvvsDI55Wx1GOPSXBvzXNe1HNVFRe1CjFFWT0UyS08jmORc5QmTbvdp9O6OjvC5j4Ij14ktTXBHd2T5nN73sc6PM1FqnL+CwgPFarpSXSnbNRyte1yZ4Ke0lEXOqGhPY5i7rkwp8d+VfgV33MtdXV3+VY4ndFUxnBYk8FZaaWrXpSRtV3twWZ4e2bukrZ7n7umWXGclQZNJXFZHYjXGTiukrl+3/Bbb7O0X7aeA+ztF+23wMD3YnM25NuFT/SVKTSFzVOEa+By+xt0/bXwLA7pNisNi+sUkbUemewg1uvq7GFYhizQRQu3XKT9tutZcoe2hamPvMcukLmn/AG/4Pi6SuSf9tfAnja6SK/0XWVLGq4377PUP7bfAvx29sjd5FImr2ulpJVhkZqhU6n0lcWSte+Nei3jyPtyvlfQyfVo5XNY3h0clq7jYqNtun6MbUVGKucFS9bMRl+qGpyRylmqp/ZmpurxJGyXlLzI5JG+E6GagrkkRySuRc+0l/RFxnr20zqhyuXKcyCU5ohNe3H91TfFDxRuVX6qZd/hjbT7yN1Jg1Vw0pN3P9ipzUzqVP/k/3LY6r9VZu5/sVOT1l/1P9zJuPiaQGxnkzFrLJ+HRjcft/wCxWLUtR1WoquR7F4PXmWn0cxsum4GuTKK3BGu8OlaCkts1ZExEkdxzgv1cTnxo5voRuztwipq6SGRPGuCFEu8yyI6nR2U7EE91rJHtd0HI5CS9mtIUt2hfPVxo5M8MoSq7bqzKuepb4GHFSSys3kU2Kv2koqKoWFzMqhWOrvVbUxsa5jlVvJVO1L9XfVkiVj1RCyybcWb9pvgffu5s37TfAu+wTf5GF9Lrfw7NStDb9Xtp1i6t+FOqC810LXIjX8Szn3dWf9pvgfPu5s3bE3wHsE3+RT6XW/GOzUrHBdqyJ7ntjerl7Tit4qGyK6oRyKvJFLQM27s7VRepbw/oRhvZo+ktVLFU0caNTtwhblpJY2K5V4GbQbSUVbUJA1mFd6kb2CpWa/UsjGLnppyQt9ZFV1ppVXn1aEObOaToK+2x1kzEWRq5TKE2wxthibGzg1qYQzaCJzG7y+pq+19wiqZkhYmrNFOYAJA00Hx72xtVz3I1qc1U8F5u9HaKZ09ZK1jUTOFUgTcPdmWtdJSWhejFy6acDHnqWQplykvarLU3N+Ik7vqvoSRrncm32OGSKnkSSoxjgvIrxqnWFwv1S90srkjVeDUU16qqZqqVZJ3ue9e1VOog56p8666IdXtGz1NbG5amXc1C8VyvMAGOT4ABUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHfRedxd5C4m3nqxSdxCndF53F3kLibeerFJ3EJG2eNxoO3fkR9TZQATRzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGrbk+q9V3V+RtJq25PqvVd1fkW5fAvQzLf8AFR9UKfVnnUveOk7qzzqXvHSaud/Z4UAAKnoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADkuUAKKmQbVo/W1z05UMWGZzoEX8TFXmWK0RuLbtRRNa97YqjtaqlSz0UVZUUUzZaaRzHoueCmTT1b4NOKGu3jZymuTVdjdfzT/kvO1yOaitVFRfYfSvu3+7D4erprs7LeXSUnK0XekutO2Wkla5FTkik5DUMmTLVOVXOzVNtfuyt05+hkDTde64p9Jtj65ivc/khuRrOrtIUWpUZ9cTPR5HuXf3V3OJjW9aZJ2rVoqs9cECbjbkO1LSfV4onMj/qReWnTaOxoifgXxPv3R2L9tfEiJKGeVd56pk6JRbUWqhi7GBqo0hrbrXz9MorZI1kYTzobXcGqE/s4+gpi12jseODFNj0vo+g095m3Bl00M8So1y6EDe7jaa5rpY2r2i+pnLquLbUqv6FKf61pZ5L9UOZG5ydJeKIW9vUb5bZOyL8ytVEI4orbQwU8zbhTI6dc4VUK1sPbYaWtmLilvR8mN5VxoVtbQ1PSb/ZOVc+wmPb6GWFlMkzFbxTmbDa6GgbVuWopU6GeHA2WGggrKiJaKLoMaqdhjU9LuLvIpsF2vyVDOzVmE5mY1Uv/wCKSr/g/wBipzfWX/U/3LZ6vj6vS8zV5o0qY31l/wBT/cpcvE08bF+TMpbjRHq9Td1DV95aaaqsnVwsc5VXsNo0T6v03dQzFVSxVTOjMxHJ/Uktzfi3eaGktqvZK9ZsZw5TSNobWtv09H1jOi9U4m+nXBDHBGjImo1qdiHYXI2bjUbyMStqVqp3TL6qAAezFAAABpO7Vq8p6WnRjelI1OBuxwniZNGrJGo5q9iniRm+1Wr6mTR1C0s7Zm/6VyRtsnTzUtldFM1WqirzJMOikpIaRvRgYjU/oeW8XijtVO6Wqla1ETOFU8xtSJiNVeBerZ3XCqdKxurl4GQc5GtVXKiIntNB17uNQadgeyJ7ZajHBqL2kd6/3Ykm6ymtTsNXh0kUhqurJ66d0tTI57lXPFSPqbgje7FxNwsmxzpMTVuicv5M7qzWVz1JUOdVTOSLPBiLyNaAIlyueu87U6RDBHAxI4m4ROQAALwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB30XncXeQuJt56sUncQp3Redxd5C4m3nqxSdxCRtnjcaDt35EfU2UAE0cwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABq25PqvVd1fkbSatuT6r1XdX5FuXwL0My3/FR9UKfVnnUveOk7qzzqXvHSaud/Z4UAAKnoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAclynBTcNGa4r9PVDcSOfD2oqmngq1ysXeauCxUU0VSxY5UyiludF6/t9/gY10rWTdqKpu7VRyIrVyi9pRm33Cot87ZaWRzHIueCkz7e7uPicykva9Ji4RHr2EtTXBHd2TRTm162OfDmai1Tl6/oT+DyW640txp2zUkrZGOTPBT1kmi51Q0RzVYu65MKAAVPIPFPbKaZ/SfGir8D2goqZPTXuZq1cGPW0Uap/dN8DvpqKGm/umIh6QEaiHpZXuTCqYHXHq7U91So7fWX/U/wBy3GuPV2p7qlR2+sv+p/uRFy8TTouxHw8pbjRPq9Td1DPGB0R6vU3dQzxKx+BDn9b8Q/qoAB7MYAAAAAAHx7kY1XOVEROaqeG8XaktNK6eslaxrUzhVIH3C3blq1fS2dehHyVydpYnqGQplykta7LU3J+7EmnqvoSTrfcOgscD2RSNknxhERSvGrdaXC/VD1fK5Il7MmuVlZPWTOkqJHPc5crlTzkJPVvmXHBDq1o2cpra3ON5/MLxXK8VABimwgAFQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAd9F53F3kLibeerFJ3EKd0XncXeQuJt56sUncQkbZ43Gg7d+RH1NlABNHMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAavuP6sVPdU2g1fcb1Zqe6pbl8CmZbvio+qFPazzqXvHSd1Z51L3jpNXO/s8KAAFT0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABxRcoAUVMg27Ruublpyqascznw54tVc8Cxmi9wbZqGCNFlbHUKnFiqVFPTQV1RQVDZqWRzHtXOUUyaerfAuOKGuXjZumuSbyJuv5p/wAl50VFTKLlAQLt1uwuI6O7u48umpN9tuNNcIGy00rXtVOxSdhnZMmWqcpudoqba/cmbpz9D1gAvEWAAAYHW/q7Vd1So7PWT/U/3Lca39XaruqVHb6y/wCp/uQ9y8TTpOxHw8pbjRHq9Td1DPGC0T6vU3dQzpKx+BDn9Z8Q/qoAB7MYAHiulzpbbA6WqlaxETPFSirjiemMc9d1qZU9qqiJlVwhpGtdwLbp+nka2VslQicGovIjrcLdpXdZSWhVReSuQhSvrqi4VDpqqRz3uXPEjKm4I3ux6qb3ZNjnzYmrdG8vVTYNYazuOo6t7ppXJCq8GouDVuOcqARDlV67zl1OlQU8dOxI4m4RAAAXgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADvovO4u8hcTbz1YpO4hTui87i7yFxNvPVik7iEjbPG40HbvyI+psoAJo5gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADVtyOGl6nur8jaTVtyfVeq7q/ItzeBTMt/xUfVCn1Z53L8TpO6t87l+J0mrod/Z4UAAKnoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+oqtVFauFQ3XRmv7jYZmNdK58KLxRVNJBVrnMXeapj1NLFVMWOZuULfaM13b9QQNRJGsmxxRVNyRUVMouUKOWu5VVtqGy0srmORexSbNv92srHS3ZeHLpKpL01wR3dk0U5retj5IMzUereXqTuDyWy40tygbNSStkYqZ4Kesk0XPA0ZzXMXdcmFMDrf1dqe6pUZPWT/U/3Lc639XaruqVHb6yf6n+5D3LxNOj7E/DyluNE8NPU3dQzxgtFcdPU3dQzpKx+FDn9Z57+qg+OcjWqrlRETtU8d1udLbKd01XK2NqJnipBu4W7DpFkpbS7DeXSRS3NUMhTLlMy2WepuT92FunP0JH1rr+32CF7GyNfPjgiKV31hrq46gmejpHMhVfyoprNxr6m4TulqpXPcvtU8pCVFW+bTgh1Wz7N01tajlTefz/AICqqrlVyoAMXBsYABUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHfRedxd5C4m3nqxSdxCndF53F3kLibeerFJ3EJG2eNxoO3fkR9TZQATRzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGrbkeq9V3V+RtJq25HDTFT3VLcvgUzLd8VH1Qp9W+dy/FTpO+t87l7x0Grod/Z4UAAKnoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH1FVq5aqop8BTBQ3PRuvbjp+oZ/aOfAi8WqpYzRuvLbqGnZ0ZWxzqnFqr2lQD12y4VNtqWT0srmPaueC8zKp6x8K4XVDW7zs1TXJFe1N1/P8AkuNrf8WnalW8U6KlSGJ/+TIn/wCz/ck+2bqpV2F1FcsdPo4z7SLPrcSag+sp/d9PpF2tmZMrXNMDZq2VFuZNFM3p95b3RuGaepukuERqczFay17bNPUz8ytknxwa1SI7puq+CysoqBMO6OOl7CJ7jcKm41DpqqVz3OXPFTImuCMajY+JE2/ZB9RO6as0bnhzNo1nru4ahqX5kc2DPBqL2GnKqquVVVX+p8BFOc567zjoVPTRUzEjhbhEAAKGQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAd9F55F3kLibeerFJ3EKd0KZrIkTn0kLi7fIqaZpc/oQkbZ43Gg7d+RH1NkABNHMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa/rqD6xpyqan6VNgPFeYFqLbPEiZVzVQ8vTLVQv0z+zma/kqFJ7tEsNxnYvY5TyGwa6pfqmoaliphekpr5qyphyod/p39pE16eqAAAvgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAMAYAAwAACoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPfYo+tu1O1OP4kLjaOiWKwUrVTH4UKnbfUy1WpKaNEz+JC4Vrh6ihhjX/pbglbW3Rzjm+3c2scX6nqABLHOgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFRFTC8gACqm9VtfS6lll6OGPVVI6LIb9WRKi2JWRs/E3nhCt65RVRew1yrjWOVfvO3bNViVdAxfVNAADHJ8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQfURXKiJ2lF4AkzY+1uqtQMqMKrWLktHyIl2Hsv1S0LVSMw53BMoS0bBQx7kSfecY2rrEqa9yJwboAAZhrIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABitT25lys1TA9qOVWLj4lOdT26S2XeeGVnRw5cIXbXjzIH340g5U8q0rOCcX4QjbjBvs309DddjLolNULTSLo/h1IHA5cF5ghUOsAAFQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADM6Stcl2vMEEbVciuTJhsKqoiJxUsBsRpF0MKXSqZhXcWIqF2nhWaRGkTeri230jpXceCdSXtO2+O22qngjbjDEz8TJAGyoiImEOFyPWRyvdxUAAqeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeK8W+K52+WlnajmPTHE9oKKmUwp6Y9WORzeKFOtxNMT6cvk0bmKkDnZapqmS4W4mk6fUtqexzE69iKrXYKn6hs9RZLlJS1LFarVXCqnNDXqymWB2U4Kdm2bvjblAjHr/Ubx+/7zGgAxTZQACoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABl9MWKqv9yjpqWNXIq/iX2IURFVcJxLckjYmK964RDN7aaVl1HeokVi/V2Lly44FtLXQxW6iipoGo1jExhDX9A6Wp9N2mOJjE65U/E7HabUbBR0yQs14qca2kvS3OowzwN4fyAAZhrYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI+3M0HTaioXywsRtU1MoqEgg8SRtkbuuMqjrJaOVJoVwqFIL3Z6uzVj6esic1zVxnHMxxb7XmiKLUlI9VY1tQicHIhWzV+irhp+oekkTnRIvByIQFTSOgXKaodfsm0cFyYjXLuv5fwaoAuUXC8wYqLk2QAAqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgAyOKrhOZtmjtFV+oaliMic2JV4uwGor13WFioqI6ZiySrhEMTp2w1d9ro6ekjVVcuFXHItFtvoin0zb2K9rXVLkyrsHp0Noqi01SN6DEdOqcXKht5OUdGkSbzuJyjaLaV9wVYINI/8AcAAkDUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY682eju1M6Gria9FTGVQyIKKiLop7ZI6NyOYuFQr/rfaF8ayVFr4pz6KEQ3Wx19rkVlXA5uO3Bd5URUwqZQwd70xbbuxUqYGZ9uCOntzX6s0U3W17ZzwYjqk3k5+pStcpzBYPVOzkU6q+2uRikdXjbC80GVaxZET2IRslJNHxTJvNHtFQVaJuvwvJTQQZWfT10gcqSUcqY/oeKShqY1w+F7fihjrlOKEu2aN/hcinnB2LDL+h3gfOpl/Q7wKZPe8nM4A59TL+h3gOpl/Q7wGRvJzOAOfUy/od4DqZf0O8BkbyczgDn1Mv6HeA6mX9DvAZG8nM4A59TL+h3gOpl/Q7wGRvJzOAOfUy/od4DqZf0O8BkbyczgDn1Mv6HeA6mX9DvAZG8nM4A59TL+h3gOpl/Q7wGRvJzOAOfUy/od4DqZf0O8BkbyczgDn1Mv6HeA6mX9DvAZG8nM4A59TL+h3gOpl/Q7wGRvJzOAOfUy/od4DqZf0O8BkbyczgDn1Mv6HeA6mX9DvAZG8nM4A59TL+h3gOpl/Q7wGRvJzOAOfUy/od4DqZf0O8BkbyczgDn1Mv6HeA6mX9DvAZG8nM4A59TL+h3gOpl/Q7wGRvJzOAOfUy/od4DqZf0O8BkbyczgDn1Mv6HeA6mX9DvAZG8nM4A59TL+h3gOpl/Q7wGRvJzOAOfUy/od4DqZf0O8BkbyczgDn1Mv6HeA6mX9DvAZG8nM4A59TL+h3gOpl/Q7wGRvJzOAOfUy/od4DqZf0O8BkbyczgDn1Mv6HeA6mX9DvAZG8nM4A59TL+h3gOpl/Q7wGRvJzOAOfUy/od4DqZf0O8BkbyczgDn1Mv6HeA6mX9DvAZG8nM4A59TL+h3gOpl/Q7wGRvJzOAOfUy/od4DqZf0O8BkbyczgDn1Mv6HeA6mX9DvAZG8nM4A59TL+h3gOpl/Q7wGRvJzOAOfUy/od4H3qJcZ6DvAZG8nM6wdiQSr/wBDvA7GUVTJ+SF7vggyFe1OKnnGTKwaeuk6okdHKuf8JtNo2vvNw6Kq1Y0X2oXGxyP8KGJPcKaBMyPRP1NBTK8smUtViuF0kaylp3uyvPBOWltnYadGvuKo9xKFl01brTG1tPAxFTtwZkVue7V+hq1x20poEVtOm8v7EOaG2ic5Y6i6pw59FUJts9oo7VTtipIWsRE5ohkERETCJhAS0NOyFMNQ57crzVXF2ZnacvQAAvkUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADhJFHJ+djXfFDmAVRccDwzWmhmz1lNGufahhq/RNoq8q6nY1V9jTZweVY1eKF+OrniXLHqn6mk/dxZf2/wCB93Fl/b/g3YHjsI+Rk+9q37VfmaT93Fl/b/gfdxZf2/4N2BTsI+Q97Vv2q/M0n7uLL+3/AAPu4sv7f8G7AdhHyHvat+1X5mk/dxZf2/4H3cWX9v8Ag3YDsI+Q97Vv2q/M0n7uLL+3/A+7iy/t/wAG7AdhHyHvat+1X5mk/dxZf2/4H3cWX9v+DdgOwj5D3tW/ar8zSfu4sv7f8D7uLL+3/BuwHYR8h72rftV+ZpP3cWX9v+B93Fl/b/g3YDsI+Q97Vv2q/M0n7uLL+3/A+7iy/t/wbsB2EfIe9q37VfmaT93Fl/b/AIH3cWX9v+DdgOwj5D3tW/ar8zSfu4sv7f8AA+7iy/t/wbsB2EfIe9q37VfmaT93Fl/b/gfdxZf2/wCDdgOwj5D3tW/ar8zSfu4sv7f8D7uLL+3/AAbsB2EfIe9q37VfmaT93Fl/b/gfdxZf2/4N2A7CPkPe1b9qvzNJ+7iy/t/wPu4sv7f8G7AdhHyHvat+1X5mk/dxZf2/4H3cWX9v+DdgOwj5D3tW/ar8zSfu4sv7f8D7uLL+3/BuwHYR8h72rftV+ZpP3cWX9v8AgfdxZf2/4N2A7CPkPe1b9qvzNJ+7iy/t/wAD7uLL+3/BuwHYR8h72rftV+ZpP3cWX9v+B93Fl/b/AIN2A7CPkPe1b9qvzNJ+7iy/t/wPu4sv7f8ABuwHYR8h72rftV+ZpP3cWX9v+B93Fl/b/g3YDsI+Q97Vv2q/M0n7uLL+3/A+7iy/t/wbsB2EfIe9q37VfmaT93Fl/b/gfdxZf2/4N2A7CPkPe1b9qvzNJ+7iy/t/wPu4sv7f8G7AdhHyHvat+1X5mk/dxZf2/wCB93Fl/b/g3YDsI+Q97Vv2q/M0n7uLL+3/AAPu4sv7f8G7AdhHyHvat+1X5mk/dxZf2/4H3cWX9v8Ag3YDsI+Q97Vv2q/M0n7uLL+3/A+7iy/t/wAG7AdhHyHvat+1X5mk/dxZf2/4H3cWX9v+DdgOwj5D3tW/ar8zSfu4sv7f8D7uLL+3/BuwHYR8h72rftV+ZpP3cWX9v+B93Fl/b/g3YDsI+Q97Vv2q/M0n7uLL+3/A+7iy/t/wbsCvYR/4j3tWfar8zSV23sy8408DI0Wi7PStRG0zHY7VabKAkMacEPD7nVvTDpF+Z4IrRQRY6umjTHsQ9kcUcafgaifA5guIiJwMR0j3eJcgAFTwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/Z",
    copyIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAA3NCSVQICAjb4U/gAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAD/klEQVR4Xu2bS2gUWRSG/6puK+lokEBQGIniA4RZKW5UGJAwqxGEIOpKREXwgQ6ICgPqMCqzUHDhwgFlEFEQCaj4Ahe+UHChIrhSweBrRnwQR2M6bXV31dS5ObdTKe1K3e6K3Z1bH5zcqtOdTp3//vcRqtqwt3S58KAfBh0o4H+/+JAaU0kNJrdDBwrQH5RRD1Dxqtci6q6nIqpFVQQhQCW9X8+oiDDWalfGHEv29xOcoMvVmThAddloRKhGGUEXlPYBcfNlXifc+T/zWQw4RZhXz8B68oATlUMFy44fNQFym/6E2TED7kA/Z6rANGE0ZYQIOH4Q1uP7/EL1jKoARvtk9G/s4kzlmFNnouWPvwZPYhahoSbB4sO7nqMGgFVbYc+ex9nKkL3eWAK86sHAgR3DRJChitocYBjI/bQEaG3jxMgYcxfCaG5B/vYVzgzH/dgL++IpoFDgTHnkELAvn4bd/TfMabOQ2b4fRsabFyQVDgvt9wGRHFBo/wHOtoN8Fh+FB3eQO7x3RBcEHSBy7AKJcEMFLogmwKQOOFsPIH/9IvLeRVSLtXQ10vM7xXEUEb4lAEEiSEpDQlEEpSFAa7rz/k3V4ea8Scyj2PMI6bkL0LxxF5BOi1wYRmY8TG9plYH+vlJ8OeY51HGUVwglBwR7oFKaVv2KcYsWI/vbGljL1wkRwpxgTpmGln1H+SwCtFfYswFW7hMnypP8M8RtbSjkRa9T7w8bCjIY598XsM+dQP7GpRHDefHUqyqFrJuCnbP5E8pT2yGwfaWYE6hYKl4OBUmUFSKItWwtrF9WIPv7BiHGhIkTYDVb/OrX1McQ8Ir0O0FG1MkxjM8fP4c6QYs5IEyE+hHA5wIZcbmAIBF633jb74AQtRHAHZx2MnuPYPzhs0NxqBupH+eUgiARmlZuFsdxEHRDTQQo3LsN59kTuO9ew6WNkT/eejkO52WPECs1fTb/Zjz4RajJKqACOYOEye5ez5lwgqtAGLRCaDEJloOcoLUARCIAt9qSCMCttiQCcKstiQDcaksiALfakgjArbYkAnCrLYkA3GpLIgC32pIIwG19k0oPey4gLOgZAhW0d0BD3BdQ7VUiu3MdnH+e81l5GkIAFIso3LvFmZFx/+uFff5k6RZcGGPuzpAKpI+2c4Ao3tBUAFk8WX9wCHzrmwQ+5BCgZ3rcfPmnLUYDmgDpJifd7IwDf/FEpDkA6XEYWL4ZRls7J74j3hXnb15G/toFTsRLsg+I5AAPx3HQ96EPxUKRM40D2V5iyOfkPehQeweI7w1GwTRNtLa1etvyFGcag9Jyx+GHahe5sSiCtD1Zng5lSKQWYgiEihBQrSRCqj5F8BdejqF6gf8BYV09k0RLz2IAAAAASUVORK5CYII="
  },
  optionList: [{
    id: "AutoCopy_st",
    text: "自动复制选中文字 / Auto copy selections",
    defaultValue: 0
  }, {
    id: "Fade_st",
    text: "超时自动隐藏 / Hide after timeout",
    defaultValue: 1
  }, {
    id: "Click_st",
    text: "点击页面不隐藏 / Don't Hide on click",
    defaultValue: 0
  }, {
    id: "Tab_st",
    text: "新标签页打开 / Open in new tabs",
    defaultValue: 1
  }, {
    id: "Focus_st",
    text: "前台标签页打开 / Force foreground tabs",
    defaultValue: 1
  }, {
    id: "Iframe_st",
    text: "在Iframe中显示/ Activate in iframes",
    defaultValue: 1
  }, {
    id: "Dis_st",
    text: "显示于文字上方 / Display above selection",
    defaultValue: 1
  }, {
    id: "Ctrl_st",
    text: "仅按下Ctrl时显示 / Only when ctrl pressed",
    defaultValue: 0
  }, {
    id: "Textbox_st",
    text: "不在文本框内显示 / Ignore selections in textboxes",
    defaultValue: 0
  }, {
    id: "userEngine_st",
    text: "自定义引擎 / Enable Customize",
    defaultValue: 0
  }],
  userEngines: [],
  defaultEngines: [{
    id: "UserEngine",
    title: "Example of User Engine",
    description: "自定义引擎示例 / Example of user engine",
    src: "http://lkytal.qiniudn.com/ic.ico",
    href: "https://www.google.com/search?newwindow=1&safe=off&q=${text}"
  }, {
    id: "UserEngine2",
    title: "Example Engine use dataURL",
    description: "DataURL引擎示例 / Example Engine use dataURL",
    src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAA0SURBVDhPY/z//z8DKYAJShMNSNYAdRIjIyOEjwdAVNLNScgA7jysAUh7J41IDbROrQwMAOdoEhG0gLSFAAAAAElFTkSuQmCC",
    href: "https://www.google.com/search?q=${text}%20site:${domain}"
  }]
};

popData.engines = [{
  id: "Trans_st",
  title: "Translate",
  description: "翻译文本 / Translate selection",
  defaultState: 0,
  src: popData.icons.translateIcon,
  action: function () {
    return onTranslate();
  }
}, {
  id: "Copy_st",
  title: "Copy",
  description: "复制文本 / Copy selection",
  defaultState: 0,
  src: popData.icons.copyIcon,
  action: function () {
    return onCopy();
  }
}, {
  id: "Setting_st",
  title: "Open Setting",
  description: "Popup search 选项 / Open Setting",
  defaultState: 0,
  src: popData.icons.settingIcon,
  action: function () {
    return OpenSet();
  }
}, {
  id: "Open_st",
  title: "Open As Url",
  description: "选中文本视作链接打开 / Open selection as url",
  defaultState: 0,
  src: popData.icons.linkIcon,
  href: '${rawText}'
}, {
  id: "Site_st",
  title: "Search Current Website",
  description: "在当前网站内搜索 / Search in current website",
  defaultState: 0,
  src: popData.icons.inSiteIcon,
  href: 'https://www.google.com/search?newwindow=1&safe=off&q=${text}%20site:${domain}'
}, {
  id: "amazon_st",
  title: "Search with Amazon",
  description: "搜索亚马逊/ Search with Amazon",
  defaultState: 0,
  src: popData.icons.amazonIcon,
  href: 'https://www.amazon.com/s?k=${text}'
}, {
  id: "Bing_st",
  title: "Search with Bing",
  description: "必应搜索 / Search with Bing",
  defaultState: 0,
  src: popData.icons.bingIcon,
  href: 'https://bing.com/search?q=${text}&form=MOZSBR'
}, {
  id: "Baidu_st",
  title: "Search with Baidu",
  description: "百度搜索 / Search with Baidu",
  defaultState: 1,
  src: popData.icons.baiduIcon,
  href: 'https://www.baidu.com/s?wd=${text}&ie=utf-8'
}, {
  id: "Baidu_baike",
  title: "Search with Baidu_baike",
  description: "百度百科搜索 / Search with BaiduBaike",
  defaultState: 1,
  src: popData.icons.BaiKe,
  href: 'https://baike.baidu.com/search/none?word=${text}'
}, {
  id: "ZhengZhe",
  title: "Search with ZhengZhe",
  description: "正则在线搜索 / Search with ZhengZhe",
  defaultState: 1,
  src: popData.icons.ZhengZhe,
  href: 'https://www.yourbin.com/search?key=${text}'
}, {
  id: "Yahoo_st",
  title: "Search with Yahoo",
  description: "雅虎搜索 / Search with Yahoo",
  defaultState: 0,
  src: popData.icons.yahooIcon,
  href: 'https://search.yahoo.com/search;?p=${text}&ei=UTF-8'
}, {
  id: "Taobao_st",
  title: "淘宝搜索",
  description: "搜索淘宝 / Search with Taobao",
  defaultState: 0,
  src: popData.icons.taobaoIcon,
  href: 'https://s.taobao.com/search?q=${text}'
}, {
  id: "jd_st",
  title: "京东搜索",
  description: "搜索京东 / Search with JD",
  defaultState: 0,
  src: popData.icons.jdIcon,
  href: 'https://search.jd.com/Search?keyword=${text}&enc=utf-8'
}, {
  id: "pdd_st",
  title: "购买假货",
  description: "搜索拼多多 / Search with pdd",
  defaultState: 0,
  src: popData.icons.pddIcon,
  href: 'https://mobile.yangkeduo.com/search_result.html?search_key=${text}'
}, {
  id: "Tieba_st",
  title: "Search in Tieba",
  description: "搜索贴吧 / Search with Tieba",
  defaultState: 0,
  src: popData.icons.tiebaIcon,
  href: 'http://tieba.baidu.com/f/search/res?ie=utf-8&qw=${text}'
}, {
  id: "youtube_st",
  title: "Search with Youtube",
  description: "搜索Youtube / Search with Youtube",
  defaultState: 0,
  src: popData.icons.youtubeIcon,
  href: 'https://www.youtube.com/results?search_query=${text}'
}, {
  id: "youku_st",
  title: "Search with Youku",
  description: "搜索优酷 / Search with Youku",
  defaultState: 0,
  src: popData.icons.youkuIcon,
  href: 'http://www.soku.com/search_video/q_${text}'
}, {
  id: "eBay_st",
  title: "Search with eBay",
  description: "搜索eBay / Search with eBay",
  defaultState: 0,
  src: popData.icons.eBayIcon,
  href: 'http://www.ebay.com/sch/i.html?_nkw=${text}&_sacat=0'
}, {
  id: "douban_st",
  title: "Search with Douban",
  description: "搜索豆瓣电影 / Search with Douban Movie",
  defaultState: 0,
  src: popData.icons.doubanIcon,
  href: 'https://movie.douban.com/subject_search?search_text=${text}'
}, {
  id: "Google_st",
  title: "Search with Google",
  description: "谷歌搜索 / Search with Google",
  defaultState: 0,
  src: popData.icons.googleIcon,
  href: 'https://www.google.com/search?newwindow=1&safe=off&q=${text}'
}, {
  id: "Wiki_st",
  title: "Search with Wiki",
  description: "搜索维基百科 / Search with Wikipedia",
  defaultState: 0,
  src: popData.icons.wikiIcon,
  href: 'https://wikipedia.org/w/index.php?search=${text}'
}];

log = function (msg) {
  popData.count += 1;
  return console.log(`Popup Msg ${popData.count} : ${msg}`);
};

isChrome = function () {
  return navigator.userAgent.indexOf("Chrome") > -1;
};

fixPos = function (sel, e) {
  var eventLeft, eventTop, fix, m_left, offsetLeft, offsetTop, offsets;
  offsets = get_selection_offsets(sel, e);
  offsetTop = offsets[0];
  offsetLeft = offsets[1];
  if (e != null) {
    eventTop = e.pageY;
    eventLeft = e.pageX;
    if (Math.abs(offsetTop - eventTop) > 50) {
      //log offsetTop + " : " + offsetLeft + " <==> " + eventTop + " : " + eventLeft
      offsetTop = eventTop - 8;
    }
    if (Math.abs(offsetLeft - eventLeft) > 50) {
      //translate
      offsetLeft = eventLeft + 10;
    }
  } else {
    $('#showUpBody').css('margin-left', '60px');
  }
  if (GetOpt('Dis_st')) {
    //UpSide
    offsetTop = offsetTop - 2 - $('#ShowUpBox').height();
    if (offsetTop - document.documentElement.scrollTop < 40) {
      offsetTop = document.documentElement.scrollTop + 40;
    }
  } else {
    offsetTop += 1.1 * offsets[2];
  }
  m_left = $('#ShowUpBox').width();
  fix = 0;
  if (offsetLeft - m_left < 4) {
    fix = 4 - offsetLeft + m_left;
  }
  $('#ShowUpBox').css("top", offsetTop + "px").css("left", offsetLeft - m_left + fix + "px");
  return $('#popupTip').css('margin-left', m_left - 20 - fix);
};

OnEngine = function (e) {
  var link;
  link = $(this).data('link');
  if (link.indexOf('javascript:') === 0) {
    eval(link.slice('javascript:'.length));
    return false;
  }
  if (isChrome()) {
    //log "chrome"
    GM_openInTab(link, {
      active: GetOpt("Focus_st") === 1
    });
  } else {
    GM_openInTab(link, !GetOpt("Focus_st"));
  }
  hideBar(100);
  return false;
};

PopupInit = function () {
  var $DivBox, $icon, EngineList, engine, j, k, l, len, len1, len2, ref, ref1, ref2;
  $('#ShowUpBox').remove();
  EngineList = "";
  ref = popData.engines;
  for (j = 0, len = ref.length; j < len; j++) {
    engine = ref[j];
    EngineList += `<a id='${engine.id}Icon' class='engine'><img title='${engine.title}' src='${engine.src}' /></a>`;
  }
  if (GetOpt("userEngine_st")) {
    ref1 = popData.userEngines;
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      engine = ref1[k];
      EngineList += `<a id='${engine.id}Icon' class='userEngine'><img title='${engine.title}' src='${engine.src}' /></a>`;
    }
  }
  $('body').append(`<span id=\"ShowUpBox\"> <span id=\"showUpBody\"> <span id=\"popupWrapper\"> ${EngineList} </span> <span id=\"transPanel\" /> </span> </span>`);
  $DivBox = $('#ShowUpBox');
  $DivBox.hide();
  $DivBox.on("click dblclick mousedown mouseup contextmenu", function (event) {
    return event.stopPropagation();
  });
  $('#transPanel').on("mouseup contextmenu", function (event) {
    return event.stopPropagation();
  });
  $DivBox.hover(function () {
    $(this).fadeTo(150, 1);
    return popData.mouseIn = 1;
  }, function () {
    if (popData.bTrans === 0 && $(this).is(":visible") && $(this).attr("opacity") === 1) {
      $(this).fadeTo(300, 0.7);
      clearTimeout(popData.timer);
      popData.timer = setTimeout(TimeOutHide, 6000);
    }
    return popData.mouseIn = 0;
  });
  $('#showUpBody').on("mouseup", function (event) {
    if (event.which === 3) {
      CopyText();
      hideBar(100);
      return false;
    } else if (event.which === 2) {
      GM_openInTab(document.defaultView.getSelection().toString());
      return false;
    }
  });
  $('#showUpBody').on("contextmenu", function (event) {
    return false;
  });
  ref2 = popData.engines;
  for (l = 0, len2 = ref2.length; l < len2; l++) {
    engine = ref2[l];
    $icon = $("#" + engine.id + "Icon");
    if (!GetOpt(engine.id)) {
      $icon.hide();
    }
  }
  $DivBox.find('.userEngine').on('click', OnEngine); // handle user engine!
  if (GetOpt('Tab_st')) {
    $DivBox.find('a').attr('target', '_blank');
  } else {
    $DivBox.find('a').attr('target', '_self');
  }
  if (GetOpt('Dis_st')) {
    popData.tip = popData.tipUp;
    return $DivBox.append('<span id="popupTip" class="tipUp"></span>');
  } else {
    popData.tip = popData.tipDown;
    return $DivBox.prepend('<span id="popupTip" class="tipDown"></span>');
  }
};

ajaxError = function (res) {
  return $('#transPanel').empty().append(`<p>Translate Error:<br /> ${res.statusText} </p>`).show();
};

onCopy = function () {
  CopyText(popData.rawText);
  return hideBar();
};

onTranslate = function () {
  popData.bTrans = 1;
  $("#transPanel").empty().append(`<div style='padding:10px;'><img src='${popData.icons.pending}' /></div>`).show();
  $('#popupWrapper').hide();
  fixPos(document.defaultView.getSelection());
  return doRequest(0, 2000);
};

doRequest = function (i, wait) {
  var ErrHandle, lang;
  ErrHandle = function () {
    return doRequest(i + 1, wait + 2000);
  };
  if (i >= 2) {
    ErrHandle = ajaxError;
  }
  lang = navigator.language || navigator.userLanguage || "zh-CN";
  return GM_xmlhttpRequest({
    method: 'POST',
    url: 'https://translate.google.cn/translate_a/single',
    data: `client=gtx&dj=1&q=${popData.text}&sl=auto&tl=${lang}&hl=${lang}&ie=UTF-8&oe=UTF-8&source=icon&dt=t&dt=bd`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    timeout: wait,
    onload: parseTranslationGoogle,
    onerror: ErrHandle,
    ontimeout: ErrHandle
  });
};

parseTranslationGoogle = function (responseDetails) {
  var PickMeaning, RLine, RTxt, Result, j, len, line, ref, sentence;
  if (!popData.bTrans) {
    return;
  }
  try {
    RTxt = JSON.parse(responseDetails.responseText);
  } catch (error) {
    return ajaxError(responseDetails);
  }
  RLine = function () {
    var j, len, ref, results;
    ref = RTxt.sentences;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      sentence = ref[j];
      results.push(sentence.trans);
    }
    return results;
  }().toString();
  PickMeaning = function (list) {
    var i, item, j, len, results;
    results = [];
    for (i = j = 0, len = list.length; j < len; i = ++j) {
      item = list[i];
      if (item.score > 0.005 || i < 3) {
        results.push(item.word);
      }
    }
    return results;
  };
  if (RTxt.dict != null) {
    ref = RTxt.dict;
    for (j = 0, len = ref.length; j < len; j++) {
      line = ref[j];
      RLine += "<br>" + `${line.pos} : ${PickMeaning(line.entry)}`;
    }
  }
  Result = `<div id=\"tranRst\" style=\"font-size:13px;overflow:auto;padding:5px 12px;\"> <div style=\"line-height:200%;font-size:13px;\"> ${RLine} </div> </div>`;
  $('#transPanel').empty().append(Result).show();
  fixPos(document.defaultView.getSelection());
};

doHideBar = function () {
  return $('#ShowUpBox').fadeOut(150);
};

hideBar = function (time = 0) {
  return popData.fadeEvent.push(setTimeout(doHideBar, time));
};

$(document).on("mousedown", function (event) {
  return popData.mousedownEvent = event;
});

// PopupInit() if popData.bTrans == 1
// hideBar()
$(document).on("mouseup", function (event) {
  if (popData.bTrans === 1) {
    PopupInit();
  }
  if (!GetOpt('Click_st')) {
    hideBar();
  }
  if (event.which !== 1) {
    return;
  }
  if (GetOpt('Ctrl_st') && !event.ctrlKey) {
    return;
  }
  return ShowBar(event);
});

eventFromTextbox = function (eventList) {
  var event, j, len;
  for (j = 0, len = eventList.length; j < len; j++) {
    event = eventList[j];
    if (event != null) {
      if ($(event.target).is('textarea, input, *[contenteditable="true"]')) {
        //console.log $(event.target)
        return true;
      }
    }
  }
  return false;
};

InTextBox = function (selection) {
  var area, j, len, ref;
  if (isChrome()) {
    return false;
  }
  ref = $('textarea, input, *[contenteditable="true"]', document);
  for (j = 0, len = ref.length; j < len; j++) {
    area = ref[j];
    if (selection.containsNode(area, true)) {
      return true;
    }
  }
  return false;
};

GetTextboxSelection = function () {
  var textbox;
  textbox = document.activeElement;
  if (textbox.selectionEnd - textbox.selectionStart > 0) {
    return textbox.value.substring(textbox.selectionStart, textbox.selectionEnd);
  }
  return "";
};

ShowBar = function (event) {
  var do_timeout_hide, e, engine, j, k, l, len, len1, len2, paraList, ref, ref1, ref2, sel, setHref;
  hideBar();
  sel = document.defaultView.getSelection();
  if (InTextBox(sel) || eventFromTextbox([event, popData.mousedownEvent])) {
    if (GetOpt("Textbox_st")) {
      return;
    }
    popData.rawText = GetTextboxSelection();
  } else {
    popData.rawText = sel.toString();
    if (GetOpt("AutoCopy_st")) {
      //only for none text area
      CopyText(popData.rawText);
    }
  }
  popData.text = encodeURIComponent(popData.rawText.trim());
  if (popData.rawText === '') {
    return;
  }
  ref = popData.fadeEvent;
  // we have hide event for every mousedown
  for (j = 0, len = ref.length; j < len; j++) {
    e = ref[j];
    clearTimeout(e);
  }
  $('#transPanel').empty().hide();
  paraList = {
    "\\${rawText}": popData.rawText,
    "\\${text}": popData.text,
    "\\${domain}": document.domain,
    "\\${url}": location.href
  };
  setHref = function (engine) {
    var $engine, href, para, value;
    $engine = $("#" + engine.id + "Icon");
    if (engine.href != null) {
      //log engine.id + " : " + engine.href
      href = engine.href;
      for (para in paraList) {
        if (!hasProp.call(paraList, para)) continue;
        value = paraList[para];
        href = href.replace(RegExp(`${para}`, "g"), value);
      }
      $engine.data('link', href);
      $engine.off('click');
      return $engine.on('click', OnEngine);
    } else if (engine.action != null) {
      $engine.off('click');
      return $engine.on('click', engine.action);
    } else {
      return console.log('empty engine', engine);
    }
  };
  ref1 = popData.engines;
  for (k = 0, len1 = ref1.length; k < len1; k++) {
    engine = ref1[k];
    setHref(engine);
  }
  ref2 = popData.userEngines;
  for (l = 0, len2 = ref2.length; l < len2; l++) {
    engine = ref2[l];
    setHref(engine);
  }
  if (needPrefix(popData.rawText)) {
    $('#Open_stIcon').data('link', `http://${popData.rawText.trim()}`);
  }
  popData.mouseIn = 0;
  popData.bTrans = 0;
  do_timeout_hide = function () {
    if (popData.mouseIn === 0 && !popData.bTrans) {
      return $('#ShowUpBox').fadeOut(250);
    }
  };
  if (GetOpt("Fade_st")) {
    popData.fadeEvent.push(setTimeout(do_timeout_hide, 5000));
  }
  fixPos(sel, event);
  return $('#ShowUpBox').css('opacity', 0.9).fadeIn(200);
};

needPrefix = function (url) {
  var j, len, prefix, urlPrefixes;
  url = url.trim();
  urlPrefixes = ['http://', 'https://', 'ftp://', 'file://', 'thunder://', 'ed2k://', 'chrome://'];
  for (j = 0, len = urlPrefixes.length; j < len; j++) {
    prefix = urlPrefixes[j];
    if (url.indexOf(prefix) === 0) {
      return 0;
    }
  }
  return 1;
};

CopyText = function (selText) {
  if (selText == null) {
    selText = document.defaultView.getSelection().toString();
  }
  if ((typeof GM_info !== "undefined" && GM_info !== null ? GM_info.scriptHandler : void 0) === "Violentmonkey") {
    return document.execCommand('copy');
  }
  try {
    return GM_setClipboard(selText, "text");
  } catch (error) {
    return document.execCommand('copy');
  }
};

GetOpt = function (id) {
  var ref;
  return GM_getValue(id, (ref = popData.optionList.find(function (item) {
    return item.id === id;
  })) != null ? ref.defaultValue : void 0);
};

SaveOpt = function (id) {
  return GM_setValue(id, $("#" + id + " > input").prop("checked") + 0);
};

ReadOpt = function (id) {
  return $("#" + id + " > input").prop("checked", GetOpt(id));
};

OpenSet = function () {
  if ($('#popup_setting_bg').length === 0) {
    SettingWin();
  }
  return $('#popup_setting_bg').fadeIn(400);
};

SettingWin = function () {
  var chsJSON, engJSON, engine, engineOptionList, generateEngineOption, generateOption, item, j, len, option, optionList, ref;
  addAdditionalCSS();
  $('#popup_setting_bg').remove();
  generateOption = function (option) {
    return `<span id='${option.id}' class='setting_item'> <img src=${popData.icons.settingIcon} /> <span class='text'>${option.text}</span> <input class='tgl tgl-flat' id='${option.id}_checkbox' type='checkbox'> <label class='tgl-btn' for='${option.id}_checkbox'></label> </span>`;
  };
  optionList = function () {
    var j, len, ref, results;
    ref = popData.optionList;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      option = ref[j];
      results.push(generateOption(option));
    }
    return results;
  }().join(' ');
  generateEngineOption = function (engine) {
    return `<span id='${engine.id}' class='setting_item'> <img src=${engine.src} /> <span class='text'>${engine.description}</span> <input class='tgl tgl-flat' id='${engine.id}_checkbox' type='checkbox'> <label class='tgl-btn' for='${engine.id}_checkbox'></label> </span>`;
  };
  engineOptionList = function () {
    var j, len, ref, results;
    ref = popData.engines;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      engine = ref[j];
      results.push(generateEngineOption(engine));
    }
    return results;
  }().join(' ');
  engJSON = `[
    {
        id: "UserEngine",
        title: "Example Engine",
        description: "Example of user-defined engine",
        src: "http://lkytal.qiniudn.com/ic.ico",
        href: "https://www.google.com/search?q=\${text}"
    }
]`;
  chsJSON = `[
    {
        id: "UserEngine",
        title: "Example Engine",
        description: "自定义引擎示例",
        src: "http://lkytal.qiniudn.com/ic.ico",
        href: "https://www.google.com/search?q=\${text}"
    }
]`;
  $("body").append(`<div id='popup_setting_bg'> <div id='popup_setting_win'> <div id='popup_title'>PopUp Search Setting</div> <div id='popup_content'> <div id='tabs_box'> <div id='popup_tab1' class='popup_tab popup_selected'>选项 / General</div> <div id='popup_tab2' class='popup_tab'>搜索引擎 / Engines</div> <div id='popup_tab3' class='popup_tab'>自定义 / Customize</div> <div id='popup_tab4' class='popup_tab'>关于 / About</div> </div> <div id='page_box'> <div id='option_box'> <div id='popup_tab1Page'> ${optionList} </div> <div id='popup_tab2Page'> ${engineOptionList} </div> <div id='popup_tab3Page'> <div id='editTitle'> <div><b>请阅读帮助! / Read help FRIST !</b></div> <span id='popHelp'><u>Help</u></span> <span id='popReset'><u>Reset</u></span> </div> <textarea id='popup_engines'></textarea> </div> <div id='popup_tab4Page'> <h3>Authored by Lkytal</h3> <p> You can redistribute it under <a href='http://creativecommons.org/licenses/by-nc-sa/4.0/'> Creative Commons Attribution-NonCommercial-ShareAlike Licence </a> </p> <p class='contact-line'> Source Code at<br> Git OSChina <a class='tab-text' href='https://git.oschina.net/coldfire/GM'> https://git.oschina.net/coldfire/GM </a> <br /> Github <a class='tab-text' href='https://github.com/lkytal/GM'> https://github.com/lkytal/GM </a> </p> <p> Contact:<br> Github <a class='tab-text' href='https://github.com/lkytal'> https://github.com/lkytal/ </a> <br> Greasy fork <a class='tab-text' href='https://greasyfork.org/en/users/152-lkytal'> https://greasyfork.org/en/users/152-lkytal </a> </p> </div> </div> <div id='btnArea'> <div id='popup_save' class='setting_btn'>Save</div> <div id='popup_close' class='setting_btn'>Close</div> </div> </div> </div> </div> <div id='popup_help_bg'> <div id='popup_help_win'> <div id='popup_help_content'> <div id='helpLang'> <span id='engHead' class='popup_head_selected'>English</span> <span id='chsHead'>中文</span> </div> <div id='help_box'> <div id='engContent'> The content of custom engine should be in standard JSON format, in forms of following: <pre> ${engJSON} </pre> The 'id' should be unique for every entry and must NOT contain any space character, the 'title' and the 'description' can be any text you like, the 'src' indicates the icon of every item, should be the URL to an image or be a <a href='http://dataurl.net/#about'>DataURL</a>. The 'href' is the link to be open upon click, you may have noticed the '\${text}' variable, which will be replaced by selected text. Available variables are listed below: <ul> <li>\${text} : will be replaced by the selected text (Url encoded, should use this by default)</li> <li>\${rawText} : will be replaced by the original selected text</li> <li>\${domain} : will be replaced by the domain of current URL</li> <li>\${url} : will be replaced by the current web page's URL</li> </ul> Note: You can't modify built-in engines directly, however, you can disable them and add your own. </div> <div id='chsContent'> 自定义引擎内容应当是合法的JSON格式, 如下 <pre> ${chsJSON} </pre> 每一项的 id 必须各不相同且不能含有空格, title 和 description 可以随意填写, src 是该项的图标, 可以是指向图标的 url 或者是一个 <a href='http://dataurl.net/#about'>DataURL</a>. href 是引擎的 url 链接, 其中可以包含诸如 \${text} 这样的变量, 变量的大小写必须正确, 可用的变量有: <ul> <li>\${text} : 代表选中文字, 经过 url encoding, 一般应当使用此项</li> <li>\${rawText} : 代表未经 encoding 的原始选中文字</li> <li>\${domain} : 代表当前页面的域名</li> <li>\${url} : 代表当前页面的 url 地址</li> </ul> 注意: 内置引擎无法直接修改, 你可以禁用它们然后添加你自定义的引擎 </div> </div> <div id='help_btnArea'> <div id='popup_help_close' class='setting_btn'>Close</div> </div> </div> </div> </div> </div>`);
  $("#popup_setting_bg, #popup_help_bg").hide();
  $("#tabs_box > .popup_tab").on("click", function (e) {
    $("#tabs_box > .popup_tab").removeClass("popup_selected");
    $(this).addClass("popup_selected");
    $("#option_box > div").hide();
    return $("#" + $(this).attr("id") + "Page").show();
  });
  $("#option_box > div").hide();
  $("#tabs_box > .popup_tab.popup_selected").click();
  $("#chsContent").hide();
  $("#engHead").on('click', function (event) {
    $("#engHead").addClass("popup_head_selected");
    $("#chsHead").removeClass("popup_head_selected");
    $("#engContent").show();
    return $("#chsContent").hide();
  });
  $("#chsHead").on('click', function (event) {
    $("#engHead").removeClass("popup_head_selected");
    $("#chsHead").addClass("popup_head_selected");
    $("#engContent").hide();
    return $("#chsContent").show();
  });
  ref = $("#popup_setting_win .setting_item");
  for (j = 0, len = ref.length; j < len; j++) {
    item = ref[j];
    if (item != null) {
      ReadOpt(item.id);
    }
  }
  $("#popup_engines").val(GM_getValue("engineString", popData.defaultEngineString));
  $("#popReset").click(function () {
    if (confirm("Reset?")) {
      return $("#popup_engines").val(popData.defaultEngineString);
    }
  });
  $("#popHelp").click(function () {
    return $("#popup_help_bg").fadeIn();
  });
  if (!GetOpt("userEngine_st")) {
    $("#popup_engines").val(`Disabled, please enable custom engines in setting,
then save and re-open this setting page\n
已禁用, 请在设置启用自定义引擎, 保存并重新打开此界面`);
    $("#popup_engines").attr('disabled', true);
  }
  $("#popup_save").click(function () {
    var k, len1, ref1, userEngineString;
    ref1 = $("#popup_setting_win .setting_item");
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      item = ref1[k];
      if (item != null) {
        SaveOpt(item.id);
      }
    }
    if (GetOpt("userEngine_st")) {
      userEngineString = $("#popup_engines").val();
      if (userEngineString !== "") {
        try {
          popData.userEngines = JSON.parse(userEngineString);
          GM_setValue("engineString", userEngineString);
        } catch (error) {
          alert("自定义引擎错误!请检查\nEngine config Error!");
          log(userEngineString);
        }
      }
    }
    return $("#popup_setting_bg").fadeOut(300, function () {
      $("#popup_setting_bg").remove(); //force rebuild setting window
      return PopupInit(); //rebuild toolbar
    });
  });
  $("#popup_close, #popup_setting_bg").click(function () {
    return $("#popup_setting_bg").fadeOut(300, function () {
      return $("#popup_setting_bg").remove();
    });
  });
  $("#popup_help_bg, #popup_help_close").on("click", function (e) {
    return $("#popup_help_bg").fadeOut();
  });
  return $('#popup_setting_win, #popup_help_win, #popup_help_bg').click(function (e) {
    return e.stopPropagation();
  });
};

UpdateLog = function () {
  addAdditionalCSS();
  $("body").append("<div id='popup_update_bg'> <div id='popup_update_win'> <div id='update_header'> Popup Search Updated (ver 4.3.0) </div> <div id='popup_update_content'> <div id='update_texts'> <p> <h3>此版本引入的重要改变:</h3> <p> 增加了复制按钮 </p> <p> 自定义引擎功能开放, 点击 'Open setting' 可以打开设置并启用该功能. 在自定义前请点击 'Help' 按钮以阅读帮助文档. </p> <p> 注意: 启用自定义引擎后, 重新打开设置窗口才会生效. </p> </p> <p> <h3>What's new in this version:</h3> <p> Provide 'Copy' button </p> <p> You can customize your own engines now. Click 'Open setting' to check it out. Remember to read 'HELP' before modify. </p> <p> Note: After you enabled customization, reopen setting window to take effect. </p> </p> </div> <div id='update_btnArea'> <div id='popup_update_open' class='setting_btn'>Open Setting</div> <div id='popup_update_close' class='setting_btn'>Close</div> </div> </div> </div> </div>");
  $('#popup_update_open').on('click', function (event) {
    UpdateNotified();
    $("#popup_update_bg").hide();
    OpenSet();
  });
  return $('#popup_update_close').on('click', function (event) {
    UpdateNotified();
    $("#popup_update_bg").hide();
  });
};

UpdateNotified = function () {
  return GM_setValue("UpdateAlert", popData.codeVersion);
};

PopupLoad = function () {
  var engine, j, k, len, len1, option, popupMenu, ref, ref1, setDefault, userEngineString;
  if (window.self !== window.top || window.frameElement) {
    if (!GM_getValue("Iframe_st", 0)) {
      return;
    }
  }
  addCSS();
  if (GM_getValue("UpdateAlert", 0) < popData.codeVersion) {
    setDefault = function (key, defaultValue) {
      return GM_setValue(key, GM_getValue(key, defaultValue));
    };
    ref = popData.optionList;
    for (j = 0, len = ref.length; j < len; j++) {
      option = ref[j];
      setDefault(option.id, option.defaultValue);
    }
    ref1 = popData.engines;
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      engine = ref1[k];
      setDefault(engine.id, engine.defaultState);
    }
    UpdateLog();
  }
  popData.defaultEngineString = JSON.stringify(popData.defaultEngines, null, 4);
  if (GetOpt("userEngine_st")) {
    userEngineString = GM_getValue("engineString", popData.defaultEngineString);
    try {
      popData.userEngines = JSON.parse(userEngineString);
    } catch (error) {
      //alert "User Engine Syntax Error"
      console.error(userEngineString);
    }
  }
  PopupInit();
  GM_registerMenuCommand("Popup Search Setting / 设置", OpenSet, 'p');
  if (GM_getValue("PopupMenu", 0)) {
    popupMenu = document.body.appendChild(document.createElement("menu"));
    popupMenu.outerHTML = '<menu id="userscript-popup" type="context"><menuitem id="PopupSet" label="Popup Search设置"></menuitem></menu>';
    document.querySelector("#PopupSet").addEventListener("click", OpenSet, false);
    return $(document).on("contextmenu", function () {
      return document.body.setAttribute("contextmenu", "userscript-popup");
    });
  }
};

setTimeout(PopupLoad, 100);

addCSS = function () {
  return GM_addStyle(`#ShowUpBox { width: auto; height: auto; position: absolute; z-index: 10240; color: black; display: inline-block; line-height: 0; vertical-align: baseline; box-sizing: content-box; font-size: 16px; } #showUpBody { min-width: 20px; max-width: 750px; min-height: 20px; max-height: 500px; display: block; border: solid 2px rgb(144,144,144); border-radius: 1px; background: rgba(252, 252, 252, 1); } #popupWrapper { margin: 3px 2px 3.8px 2px; display:block; line-height: 0; font-size:0; } #transPanel { line-height: normal; width: auto; font-size: 16px; overflow: auto; display: none; } #popupWrapper > a { margin: 0px 2px; } #popupWrapper img { margin: 0px; height: 24px; width: 24px; border-radius: 0px; padding: 0px; display: inline-block; transition-duration: 0.1s; -moz-transition-duration: 0.1s; -webkit-transition-duration: 0.1s; } #popupWrapper img:hover { margin: -1px -1px; height: 26px; width: 26px; } #popupTip { display: inline-block; clear: both; height: 9px; width: 9px; } .tipUp { background: url(${popData.icons.tipUp}) 0px 0px no-repeat transparent; margin-top: -2px; margin-bottom: 0px; } .tipDown { background: url(${popData.icons.tipDown}) 0px 0px no-repeat transparent; margin-top: 0px; margin-bottom: -2px; } #ShowUpBox a { text-decoration: none; display: inline-block; }`);
};

addAdditionalCSS = function () {
  if (popData.additionalCSSLoaded === 1) {
    return;
  }
  popData.additionalCSSLoaded = 1;
  return GM_addStyle("#popup_setting_bg { width: 100%; height: 100%; background: rgba(0, 0, 0, 0.2); position: fixed; left: 0px; top: 0px; z-index:102400; font-family: \"Hiragino Sans GB\", \"Microsoft Yahei\", Arial, sans-serif; display: -webkit-flex; display: flex; justify-content: center; align-items: center; } #popup_setting_win { font-size: 16px; width: 760px; height: 90%; box-shadow: 0 0 10px #222; box-sizing: content-box !important; background: rgba(255, 255, 255, 0.98); overflow: hidden; display: -webkit-flex; display: -moz-flex; display: flex; flex-direction: column; } #popup_title { font-size: 22px; font-weight: bold; text-align: center; padding: 12px; background: #16A085; color: white; flex-shrink: 0; } #popup_content { flex-grow: 1; flex-shrink: 1; height: calc(100% - 70px); padding: 0px; display: -webkit-flex; display: -moz-flex; display: flex; justify-content: space-between; align-items: stretch; } #tabs_box { display: -webkit-flex; display: -moz-flex; display: flex; flex-direction: column; flex-basis: 25%; flex-shrink: 0; background: #EEE; } .popup_tab { width: 100%; background: #EEE; padding: 15px; font-weight: bold; text-align: center; box-sizing: border-box; cursor: pointer; user-select: none; -moz-user-select: none; -webkit-user-select: none; } .popup_tab:hover { background: #ccc; } .popup_selected { border-right: none; background: #FFF; } .popup_selected:hover { background: #FFF; } #page_box { padding: 20px 30px; flex-grow: 1; flex-shrink: 1; max-height: 100%; display: -webkit-flex; display: -moz-flex; display: flex; flex-direction: column; } #option_box { display: -webkit-flex; display: -moz-flex; display: flex; flex-direction: column; align-items: stretch; flex-grow: 1; flex-shrink: 1; overflow-y: auto; } #option_box > div { scroll-behavior: smooth; flex-grow: 1; display: -webkit-flex; display: -moz-flex; display: flex; flex-direction: column; align-items: stretch; } #popup_engines { flex-grow: 1; border: solid 2px #ddd; text-overflow: clip; white-space: pre; overflow-x: auto; overflow-y: auto; word-wrap: break-word; resize: none; } #editTitle { padding: 0px 0px 15px 0px; display: -webkit-flex; display: -moz-flex; display: flex; justify-content: space-between; } #editTitle div { flex-grow: 1; } #editTitle span { margin-left: 20px; color : #1ABC9C; cursor: pointer; } #btnArea { display: -webkit-flex; display: -moz-flex; display: flex; justify-content: flex-end; margin-top: 20px; flex-shrink: 0; } .setting_btn { display: inline-block; font-size: 16px; text-align: center; mix-width: 50px; padding: 4px 10px 4px 10px; border-radius: 2px; margin: 0px 0px 0px 20px; background: #1ABC9C; color: #fff; cursor: pointer; user-select: none; -moz-user-select: none; -webkit-user-select: none; } .setting_btn:hover { text-shadow: 0px 0px 2px #FFF; } .setting_item { min-height: 24px; font-size: 14px; margin: 5px 0px 10px 0px; display: -webkit-flex; display: -moz-flex; display: flex; align-items: center; } .setting_item > img { width: 24px; height: auto; margin-right: 7px; } .setting_item .text{ flex-grow: 1; font-size: 14px; } #popup_help_bg { all: unset; width: 100%; height: 100%; position: fixed; top: 0; left: 0; background: transparent; display: -webkit-flex; display: flex; justify-content: center; align-items: center; z-index: 10240000; } #popup_help_win { font-size: 16px; all: unset; width: 650px; height: 80%; box-shadow: 0 0 10px #222; box-sizing: content-box !important; background: rgba(255, 255, 255, 0.98); padding: 20px; display: -webkit-flex; display: flex; flex-direction: column; align-items: stretch; /*overflow: hidden;*/ } #popup_help_content { max-height: 100%; flex-grow: 1; display: -webkit-flex; display: flex; flex-direction: column; align-items: stretch; } #helpLang { flex-grow: 0; flex-shrink: 0; display: -webkit-flex; display: flex; border-bottom: solid 1px #ccc; } #helpLang span { padding: 8px 30px; margin-bottom: -1px; cursor: pointer; user-select: none; -moz-user-select: none; -webkit-user-select: none; } #helpLang span.popup_head_selected { border-top: solid 1px #ccc; border-left: solid 1px #ccc; border-right: solid 1px #ccc; border-bottom: solid 3px #FFF; } #help_box { overflow-y: auto; flex-grow: 1; flex-shrink: 1; margin-top: 15px; } #help_box > div { word-wrap: break-word; } #help_btnArea { flex-grow: 0; flex-shrink: 0; display: -webkit-flex; display: flex; justify-content: flex-end; margin-top: 20px; } #popup_update_bg { all: unset; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.2); position: fixed; left: 0px; top: 0px; z-index: 1024000; font-family: \"Hiragino Sans GB\", \"Microsoft Yahei\", Arial, sans-serif; display: -webkit-flex; display: flex; justify-content: center; align-items: center; } #popup_update_win { all: unset; width: 50%; height: 80%; box-shadow:0 0 10px #222; box-sizing: content-box !important; background: rgba(255, 255, 255, 0.98); overflow: hidden; font-size: 16px; display: -webkit-flex; display: -moz-flex; display: flex; flex-direction: column; } #update_header { font-size: 24px; font-weight: bold; text-align: center; padding: 15px; background: #16A085; color: white; flex-shrink: 0; height: 40px; } #popup_update_content { flex-grow: 1; flex-shrink: 1; height: calc(100% - 70px); overflow: auto; padding: 15px; display: -webkit-flex; display: -moz-flex; display: flex; flex-direction: column; justify-content: space-between; align-items: stretch; } #update_texts{ flex-grow: 1; flex-shrink: 1; } #update_btnArea { flex-grow: 0; flex-shrink: 0; display: -webkit-flex; display: flex; justify-content: flex-end; margin-top: 20px; } .hidden { display: none; } .tgl { display: none; } .tgl, .tgl:after, .tgl:before, .tgl *, .tgl *:after, .tgl *:before, .tgl+.tgl-btn { -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; } .tgl::-moz-selection, .tgl:after::-moz-selection, .tgl:before::-moz-selection, .tgl *::-moz-selection, .tgl *:after::-moz-selection, .tgl *:before::-moz-selection, .tgl+.tgl-btn::-moz-selection { background: none; } .tgl::selection, .tgl:after::selection, .tgl:before::selection, .tgl *::selection, .tgl *:after::selection, .tgl *:before::selection, .tgl+.tgl-btn::selection { background: none; } .tgl+.tgl-btn { outline: 0; display: inline-block; width: 4em; height: 2em; position: relative; cursor: pointer; } .tgl+.tgl-btn:after, .tgl+.tgl-btn:before { position: relative; display: inline-block; content: \"\"; width: 50%; height: 100%; } .tgl+.tgl-btn:after { left: 0; } .tgl+.tgl-btn:before { display: none; } .tgl:checked+.tgl-btn:after { left: 50%; } .tgl-flat+.tgl-btn { padding: 2px; -webkit-transition: all .2s ease; transition: all .2s ease; background: #fff; border: 3px solid #f2f2f2; border-radius: 0.5em; } .tgl-flat+.tgl-btn:after { -webkit-transition: all .2s ease; transition: all .2s ease; background: #f2f2f2; content: \"\"; border-radius: 0.25em; } .tgl-flat:checked+.tgl-btn { border: 3px solid #1ABC9C; } .tgl-flat:checked+.tgl-btn:after { left: 50%; background: #1ABC9C; }");
};

getLastRange = function (selection) {
  var j, rangeNum, ref;
  for (rangeNum = j = ref = selection.rangeCount - 1; ref <= 0 ? j <= 0 : j >= 0; rangeNum = ref <= 0 ? ++j : --j) {
    if (!selection.getRangeAt(rangeNum).collapsed) {
      return selection.getRangeAt(rangeNum);
    }
  }
  return selection.getRangeAt(selection.rangeCount - 1);
};

get_selection_offsets = function (selection, e) {
  var $test_span, Rect, lastRange, newRange;
  try {
    $test_span = $('<span style="display:inline;">x</span>');
    // "x" because it must have a height
    lastRange = getLastRange(selection);
    newRange = document.createRange();
    newRange.setStart(lastRange.endContainer, lastRange.endOffset);
    newRange.insertNode($test_span[0]);
    Rect = $test_span[0].getBoundingClientRect();
    $test_span.remove();
    return [Rect.top + window.scrollY, Rect.left + window.scrollX, 0, 0];
  } catch (error) {
    return [e.pageY, e.pageX, 0, 0];
  }
};