// ==UserScript==
// @name         FCQ网课通助手[全网题库][通用智能适配答题][刷课]
// @namespace    http://tampermonkey7.net
// @version      1.0.54
// @description  支持【寒假教师研修】【国家智慧教育公共服务平台】【国家中小学智慧教育平台】【超星学习通】【智慧树】【职教云系列】【雨课堂】【考试星】【168网校】【u校园】【大学MOOC】【云班课】【优慕课】【继续教育类】【绎通云课堂】【九江系列】【柠檬文才】【亿学宝云】【优课学堂】【小鹅通】【安徽继续教育】 【上海开放大学】 【华侨大学自考网络助学平台】【良师在线】【和学在线】【人卫慕课】【国家开放大学】【山财培训网（继续教育）】【浙江省高等学校在线开放课程共享平台】【国地质大学远程与继续教育学院】【重庆大学网络教育学院】【浙江省高等教育自学考试网络助学平台】【湖南高等学历继续教育】【优学院】【学起系列】【青书学堂】【学堂在线】【英华学堂】【广开网络教学平台】等平台的测验考试，内置题库，如有疑问或无法使用加群:399697149 咨询
// @author       button2
// @match        *://*/*
// @run-at       document-start
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGGmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDEgNzkuYThkNDc1MywgMjAyMy8wMy8yMy0wODo1NjozNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI1LjAgKDIwMjMwODAxLm0uMjI2NSAzYTAwNjIzKSAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMi0wNy0yNFQwMDoyODoxNSswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjMtMDgtMjJUMDE6NTE6MjYrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjMtMDgtMjJUMDE6NTE6MjYrMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjkxY2Y1NWExLTZkZTEtYTk0NS1hMDk5LWY0MmNlNTQ5NGY2YiIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmYyYWZkOThmLTcyMDItMzE0Ni04M2FjLTJmOGY1YTkxZDk2MiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjgxYWIyODgwLWQxYTEtMDA0NC1iZGU3LTk5NDg4YWM0YjA2ZiI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ODFhYjI4ODAtZDFhMS0wMDQ0LWJkZTctOTk0ODhhYzRiMDZmIiBzdEV2dDp3aGVuPSIyMDIyLTA3LTI0VDAwOjI4OjE1KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjUuMCAoMjAyMzA4MDEubS4yMjY1IDNhMDA2MjMpICAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjkxY2Y1NWExLTZkZTEtYTk0NS1hMDk5LWY0MmNlNTQ5NGY2YiIgc3RFdnQ6d2hlbj0iMjAyMy0wOC0yMlQwMTo1MToyNiswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI1LjAgKDIwMjMwODAxLm0uMjI2NSAzYTAwNjIzKSAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PubJeqwAAARCSURBVDjLbVRrbBRlFD1q+kNDiESNihGDRkOiCVEMGB9ETGhMqn+wxsRgNGlNEBP0hxr1h6YGhIaSYMHW0naf3e1jW4sUSiPQatLS+ihgaal90FbazuzM7O5MZx+z232M985udyvy42R3vm/umXPvPfcCbSbgI7hVwC4ADpkQ5N9XCBWELjikOcICnNI5OJRK+l8CWzAb4yO4l4F24mCuWxBuo6ALFGRacBIa/Cbq/dlnhz8Lu3wZTYHX0LF0EyGT8YNbY8LyQtAqska/Rs//4AT9d0kFYifBrVTAkwI6iaODCZszQKtF+A4RmnlljEYmlMwDI9GNXfOJonu9sok6f+Hezu8s0keWDsBFHA4mdEcBl/5YXtXqVI8smrv6lk6ZpolkOoM3f9EO8VlBZe49FlKv70R9hAmpuE7p1/8RspIa0Twzn3hUiKYwriXRLy2vJVVpHL8pE451iYtwkDg4A1uyRaaLH0QTtTlUC+a+P8NVGVJnnzKwfyQKVuq4brx/Z41oWE2qE7Mx9lw9berbRKh8wwdF9KUNbUrftq5Q1Z4B/b2yAf3JK6EkEkTinDbw3JnQU65p427FyGDfb+H7S86pu575Kfj1+lbl9B2s0kZwCR1EKP/IqT3RGRy9pqVQP2mgZsLAYIBSJJT1LZVvPhn0ffx7uKx1Nr6uZyGBPUM63uhbwueXIhijmOLzWo9VBrs8SlaRB9Eomnc1SKp7Jr6D02LiY1PGxi2tykV8J5hHRqNlvrk4WmYMtM3GUXElYpWB3x0KJB9/0CndsEpgl0TAKw9ZcrkWxwRTiKbXC7HMQ9TNOCoXzEtq6mkO/ILU2KZimNFTFhFjXE89sNYuBTku13k/0KR0wpYzLDVjnVeR7/EqCr6dN6snY29xYCiRhpfUXaWarpDdiKQfWeOQpjkDuOSVjl/jUduftwxf8DQcnDd3XtB6ODCSzGAukoaDGnPoahSHCU3XDbzQHarCUaHgSe60K9BJKWtbrYcVT9GoFTX4kx1z8YfZf4PyMnrFZeylRrzco+LTPyLcZTzfHfrM+vhKnI1K5g7sJmMnAJs8kB+77wVz+8+q7y9K76vLEXxIRLORFA6PxVByXkXtRAweUljWr5daPsybW/ZTg8nYHTQuPn0THGLW3FTHD4b03X9Tp7+kRnwyHKHuxneU9mqvl/RquEiKx9QUPhoKb7Vm3ZZT51FL0MaT0kwD7SHY9XLYFyz3v9uvFw+TBym97ZvaAx5r45BXNzQr3ZUj0VfVRAZkozW3s4ATIte+0tqL7QQcJ7Jqgs0gYmkvf/W+FtnYfCp4dkWxRWjNt2jhxe7QyWdPB4dvs1neO0grjMhCtA8JqCOyWiak1L28hbWX0CCPo0bgPZjdJqs3C5+x72r9Ou2BUrIdbSuC71aEHrpwh3mdUQmkYiI5SugjTBAm6ayftnQdWpRSNASARiJw/5fwXxU4oNDCS+vgAAAAAElFTkSuQmCC
// @require      https://lib.baomitu.com/promise-polyfill/8.3.0/polyfill.min.js
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.min.js
// @require      https://lib.baomitu.com/fingerprintjs2/2.1.4/fingerprint2.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/mustache.js/0.1/mustache.min.js
// @require      https://lib.baomitu.com/crypto-js/4.1.1/crypto-js.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_fetch
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_openInTab
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getTabs
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_webRequest
// @grant        GM_addElement
// @grant        GM_download
// @grant        GM_log
// @grant        GM_info
// @connect      gitee.com
// @connect      cdn.staticfile.org
// @connect      cdnjs.cloudflare.com
// @connect      cdn.bootcss.com
// @connect      cdn.bootcdn.net
// @connect      cdn.staticfile.org
// @connect      unpkg.com
// @connect      e-campus.top
// @connect      ncoa.org.cn
// @connect      bytecdntp.com
// @connect      icve.com.cn
// @connect      icodef.com
// @connect      muketool.com
// @connect      ouchn.cn
// @connect      xuetangx.com
// @connect      yuketang.cn
// @connect      jpush.cn
// @connect      unipus.cn
// @connect      www.kinglinkcrusher.com
// @connect      greasyfork.org
// @connect      greasyfork-zh.org
// @connect      smartedu.cn
// @connect      zhihuishu.com
// @connect      chaoxing.com
// @connect      gaoxiaobang.com
// @connect      njcedu.com
// @connect      jsou.cn
// @connect      ulearning.cn
// @connect      kaoshixing.com
// @connect      gaoxiaobang.com
// @connect      open.com.cn
// @connect      sflep.com
// @connect      teacher.com.cn
// @connect      chinaedu.net
// @connect      sccchina.net
// @connect      netinnet.cn
// @connect      learnin.com.cn
// @connect      ct-edu.com.cn
// @connect      ismartlearning.cn
// @connect      youshiyun.com.cn
// @connect      qdjxjy.com.cn
// @connect      icourse163.org
// @connect      toyaml.com
// @connect      webtrn.cn
// @connect      gxmzu.edu.cn
// @connect      courshare.cn
// @connect      haipan.net
// @connect      xiguashuwang.com
// @connect      jiaoyu139.com
// @connect      ahjxjy.cn
// @connect      qingshuxuetang.com
// @connect      168wangxiao.com
// @connect      xiaoe-tech.com
// @connect      shou.org.cn
// @connect      edu-xl.com
// @connect      hexuezx.cn
// @connect      pmphmooc.com
// @connect      lyck6.cn
// @connect      yinghuaonline.com
// @connect      forchange.cn
// @connect      tencent.com
// @connect      chatforai.cc
// @connect      aigcfun.com
// @connect      theb.ai
// @connect      binjie.site
// @connect      xgp.one
// @connect      luntianxia.uk
// @connect      51buygpt.com
// @connect      extkj.cn
// @connect      xjai.cc
// @connect      xjai.pro
// @connect      zw7.lol
// @connect      xeasy.me
// @connect      aifree.site
// @connect      wuguokai.top
// @connect      aidutu.cn
// @connect      leiluan.cc
// @connect      gptservice.xyz
// @connect      gpt66.cn
// @connect      ai.ls
// @connect      letsearches.com
// @connect      powerchat.top
// @connect      wobcw.com
// @connect      68686.ltd
// @connect      t66.ltd
// @connect      t-chat.cn
// @connect      aitianhu.com
// @connect      anzz.top
// @connect      ohtoai.com
// @connect      freeopenai.xyz
// @connect      supremes.pro
// @connect      bnu120.space
// @connect      free-chat.asia
// @connect      aifks001.online
// @connect      a0.chat
// @connect      usesless.com
// @connect      ftcl.store
// @connect      sunls.me
// @connect      pizzagpt.it
// @connect      phind.com
// @connect      bushiai.com
// @connect      qdymys.cn
// @connect      pp2pdf.com
// @connect      aichatos.cloud
// @connect      fakeopen.com
// @connect      wuguokai.cn
// @connect      gtpcleandx.xyz
// @connect      esojourn.org
// @connect      cveoy.top
// @connect      chatcleand.xyz
// @connect      154.40.59.105
// @connect      gptplus.one
// @connect      xcbl.cc
// @connect      hz-it-dev.com
// @connect      6bbs.cn
// @connect      38.47.97.76
// @connect      lbb.ai
// @connect      lovebaby.today
// @connect      gamejx.cn
// @connect      chat86.cn
// @connect      ai001.live
// @connect      ai003.live
// @connect      ai006.live
// @connect      promptboom.com
// @connect      hehanwang.com
// @connect      caipacity.com
// @connect      chatzhang.top
// @connect      51mskd.com
// @connect      forwardminded.xyz
// @connect      1chat.cc
// @connect      minimax.chat
// @connect      cytsee.com
// @connect      skybyte.me
// @connect      alllinkai1.com
// @connect      baidu.com
// @connect      geekr.dev
// @connect      chatgptdddd.com
// @connect      anfans.cn
// @connect      bing.com
// @connect      openai.com
// @connect      aliyun.com
// @connect      ai-yuxin.space
// @connect      yuxin-ai.com
// @connect      xfyun.cn
// @connect      geetest.com
// @connect      tiangong.cn
// @connect      yeyu1024.xyz
// @connect      chatglm.cn
// @connect      bigmodel.cn
// @connect      gptgo.ai
// @connect      360.cn
// @connect      mixerbox.com
// @connect      ohmygpt.com
// @connect      muspimerol.site
// @connect      frechat.xyz
// @connect      youdao.com
// @connect      youkexuetang.cn
// @connect      cx-online.net
// @connect      sxmaps.com
// @connect      eswonline.com
// @connect      ketangx.net
// @connect      weirenzheng.cn
// @connect      cqooc.com
// @connect      edu-edu.com.cn
// @connect      fjnu.cn
// @connect      yxbyun.com
// @connect      kaoshixing.com
// @connect      beeouc.com
// @connect      edu-edu.com
// @connect      bossyun.com
// @connect      reseayun.com
// @connect      sww.com.cn
// @connect      jinkex.com
// @connect      zikaoj.com
// @connect      ls365.net
// @connect      ls365.com
// @connect      91huayi.com
// @connect      shandong-energy.com
// @connect      ttcdw.cn
// @connect      wjx.top
// @connect      coursera.org
// @connect      ahjxjy.cn
// @connect      hbcjpt.com
// @connect      whu.edu.cn
// @connect      xjyxjyw.com
// @connect      yxlearning.com
// @connect      aqscpx.com
// @connect      dayoo.com
// @connect      ncme.org.cn
// @connect      tikuhai.com
// @connect      enncy.cn
// @connect      ocsjs.com
// @connect      mhtall.com
// @connect      ustcyun.cn
// @connect      0991xl.com
// @connect      hbysw.org
// @connect      cj-edu.com
// @connect      gzbjyzjxjy.cn
// @connect      superchutou.com
// @connect      zaixiankaoshi.com
// @connect      ynjspx.cn
// @connect      zhifa315.com
// @connect      jxjypt.cn
// @connect      hnzkw.org.cn
// @connect      wentaionline.com
// @connect      chinahrt.com
// @connect      ha.cn
// @connect      tv168.cn
// @connect      59iedu.com
// @connect      cdeledu.com
// @connect      cncecyy.com
// @connect      jste.net.cn
// @connect      ls365.net
// @connect      brjxjy.com
// @connect      dyhrsc.cn
// @connect      vmserver.cn
// @connect      qdu.edu.cn
// @connect      xidian.edu.cn
// @connect      swust.net.cn
// @connect      ggcjxjy.cn
// @connect      hebyunedu.com
// @connect      ncu.edu.cn
// @connect      jijiaool.com
// @connect      zikaosw.cn
// @connect      cmechina.net
// @connect      ewt360.com
// @connect      qlteacher.com
// @connect      mxdxedu.com
// @connect      ityxb.com
// @connect      uooc.net.cn
// @connect      scxfks.com
// @connect      tsinghuaelt.com
// @connect      enaea.edu.cn
// @connect      gzsrs.cn
// @connect      yanxiu.com
// @connect      zxhnzq.com
// @connect      chinaacc.com
// @connect      ncet.edu.cn
// @connect      tcmjy.org
// @connect      baidu.com
// @connect      xidian.edu.cn
// @connect      whut.edu.cn
// @connect      yooc.me
// @connect      cj-edu.com
// @connect      cncecyy.com
// @connect      cjnep.net
// @connect      zikao365.com
// @connect      enetedu.com
// @connect      xueyinonline.com
// @connect      kepeiol.com
// @connect      brjxjy.com
// @connect      ketangx.net
// @connect      chinamde.cn
// @connect      examcoo.com
// @connect      345u.net
// @connect      zgzjzj.com
// @connect      twt.edu.cn
// @connect      jctnb.org.cn
// @connect      21tb.com
// @connect      zj.gov.cn
// @connect      zikaosw.cn
// @connect      spicti.com
// @connect      haoyisheng.com
// @connect      enaea.edu.cn
// @connect      gzsrs.cn
// @connect      yanxiu.com
// @connect      ncet.edu.cn
// @connect      chinahrt.com
// @connect      zxhnzq.com
// @connect      ghlearning.com
// @connect      qlu.edu.cn
// @connect      baidu.com
// @connect      hii.cn
// @connect      hustsnde.com
// @connect      zgzjzj.com
// @connect      peishenjy.com
// @connect      axetk.cn
// @connect      ipmph.com
// @connect      hnscen.cn
// @connect      coursera.cn
// @connect      udemy.cn
// @connect      edx.cn
// @connect      wutp.com
// @connect      imu.edu.cn
// @connect      mhys.com.cn
// @connect      cumt.edu.cn
// @connect      scit-edu.cn
// @connect      smartchutou.com
// @connect      anpeiwang.com
// @connect      gdut.edu.cn
// @connect      dwzpzx.com
// @connect      gzucm.edu.cn
// @connect      jxuas.edu.cn
// @connect      51sunshining.com
// @connect      hzau.edu.cn
// @connect      tisco.com.cn
// @connect      myunedu.com
// @connect      snnu.edu.cn
// @connect      hiaskc.com
// @connect      mynep.com
// @connect      sinotrans.com
// @connect      educoder.net
// @connect      eduwest.com
// @connect      345u.net
// @connect      sclecb.cn
// @connect      jctnb.org.cn
// @connect      kuxiao.cn
// @connect      hsd-es.com
// @connect      caq.org.cn
// @connect      nwpu.edu.cn
// @connect      zhixueyun.com
// @connect      twt.edu.cn
// @connect      htsdedu.com
// @connect      zhongancloud.com
// @connect      taoke.com
// @connect      wuxiantiaozhan.com
// @connect      qutjxjy.cn
// @connect      yidiankai.net
// @connect      ncu.edu.cn
// @connect      gdhkmooc.com
// @connect      mxdxedu.com
// @connect      21tb.com
// @connect      haoyisheng.com
// @connect      tencentcs.com
// @connect      jijiaox.com
// @connect      czpx.cn
// @connect      ntu.edu.cn
// @connect      zsbxx.cn
// @connect      xjcde.com
// @connect      e-megasafe.com
// @connect      5any.com
// @connect      euibe.com
// @connect      whxunw.com
// @connect      geron-e.com
// @connect      gsjtpxzx.com
// @connect      zygbxxpt.com
// @connect      ibotok.com
// @connect      qhce.gov.cn
// @connect      pintia.cn
// @connect      jsut.edu.cn
// @connect      bjou.edu.cn
// @connect      gdsf.gov.cn
// @connect      qztc.edu.cn
// @connect      jiangnan.edu.cn
// @connect      wencaischool.net
// @connect      ctce.com.cn:8081
// @connect      wjx.cn
// @connect      pbcexam.cn
// @connect      chnenergy.com.cn
// @connect      ynou.edu.cn
// @connect      mwr.gov.cn
// @connect      safecn.top
// @connect      yiban.cn
// @connect      bspapp.com
// @connect      qust.edu.cn
// @connect      lut.edu.cn
// @connect      whcp.edu.cn
// @connect      chinamobile.com
// @connect      whcp.edu.cn
// @connect      swufe-online.com
// @connect      gaoxiaokaoshi.com
// @connect      gdcxxy.net
// @connect      dyhgp.com.cn
// @connect      yunxuetang.cn
// @connect      oberyun.com
// @connect      wsglw.net
// @connect      zaixian100f.com
// @connect      njupt.edu.cn
// @connect      neuedu.com
// @connect      mynj.cn
// @connect      zikao.com.cn
// @connect      swpu.edu.cn
// @connect      nbut.edu.cn
// @connect      jmu.edu.cn
// @connect      ouchn.edu.cn
// @connect      hnzjpx.net
// @connect      21train.cn
// @connect      ccccltd.cn
// @connect      faxuanyun.com
// @connect      ah.cn
// @connect      tk.icu
// @connect      ketangpai.com
// @connect      keyonedu.com
// @connect      stdu.edu.cn
// @connect      cloudwis.tech
// @connect      gdedu.gov.cn
// @connect      mianyang.cn
// @connect      ahhjsoft.com
// @connect      juchiedu.com
// @connect      jtzyzg.org.cn
// @connect      lyunedu.com
// @connect      rdyc.cn
// @connect      ynau.edu.cn
// @connect      xuexi.cn
// @connect      zzu.edu.cn
// @connect      mystuff.com.cn
// @connect      treewises.com
// @connect      hotmatrix.cn
// @connect      uu-ka.cn
// @connect      dbask.net
// @connect      thsk.me
// @connect      gochati.cn
// @connect      repl.co
// @connect      lemtk.xyz
// @connect      985211.life
// @connect      jsdelivr.net
// @connect      cdnjs.net
// @connect      upai.com
// @connect      121.37.181.234
// @connect      134.175.72.16
// @connect      119.6.233.156
// @connect      49.232.135.103
// @connect      121.4.44.3
// @connect      101.200.60.10
// @connect      173.82.206.140
// @connect      106.13.194.221
// @connect      101.35.141.127
// @connect      119.45.63.245
// @connect      101.42.4.139
// @connect      123.249.44.94
// @connect      163.197.213.153
// @connect      20.222.22.93
// @connect      8.217.54.192
// @connect      121.43.35.12
// @connect      154.204.178.24
// @connect      142.171.5.216
// @connect      154.12.17.67
// @connect      120.55.15.168
// @connect      82.157.148.227
// @connect      8.130.121.197
// @connect      119.91.102.43
// @connect      39.105.36.225
// @connect      124.71.235.46
// @connect      13.91.97.210
// @connect      43.138.153.244
// @connect      122.114.171.124
// @connect      43.143.181.158
// @connect      47.108.112.179
// @connect      154.40.42.63
// @connect      39.105.186.109
// @connect      14.29.190.187
// @connect      118.195.130.244
// @connect      62.234.36.191
// @connect      150.138.77.237
// @connect      47.121.140.50
// @connect      156.236.117.109
// @connect      121.36.70.254
// @connect      49.235.150.29
// @connect      82.157.105.20
// @connect      39.105.186.109
// @connect      47.115.205.88
// @connect      14.103.143.140
// @connect      116.63.141.215
// @connect      47.86.103.206
// @connect      47.111.12.152
// @connect      mcsever.xyz
// @connect      tcloudbaseapp.com
// @connect      ylnu.edu.cn
// @connect      yuyuetiku.com
// @connect      pearktrue.cn
// @connect      ynny.cn
// @connect      zjlll.net
// @connect      lovezhc.cn
// @connect      localhost
// @connect      gyrs.xyz
// @connect      gyrs.top
// @connect      qq.com
// @connect      51aidian.com
// @connect      611qk.com
// @connect      zxtiku.com
// @connect      you-yun.com.cn
// @connect      yktong.net
// @connect      nmgdj.gov.cn
// @connect      toujianyun.com
// @connect      gxpf.cn
// @connect      51xinwei.com
// @connect      ibodao.com
// @connect      szou.edu.cn
// @connect      yncjxy.com
// @connect      moycp.com
// @connect      htexam.com
// @connect      alicdn.com
// @connect      staticfile.net
// @connect      zxx.edu.cn
// @connect      eduyun.cn
// @connect      rzcwl.com
// @connect      101.com
// @connect      zjtvu.edu.cn
// @connect      hnust.edu.cn
// @connect      hnsyu.net
// @connect      zut.edu.cn
// @connect      hfut.edu.cn
// @connect      xust.edu.cn
// @connect      xueyinonline.com
// @connect      cqrspx.cn
// @connect      cugbonline.cn
// @connect      xynu.edu.cn
// @connect      neauce.com
// @connect      ecnusole.com
// @connect      xinyingzao.cn
// @connect      w-ling.cn
// @connect      aust.edu.cn
// @connect      ahmooc.cn
// @connect      pinganmeiyu.com
// @connect      bjxtwlkj.com
// @connect      finedu.com.cn
// @connect      cdcas.com
// @connect      gyrs.online
// @connect      tiku.me
// @connect      808860.xyz
// @connect      repl.co
// @connect      ioscx.com
// @connect      ksrr.net
// @connect    	 bobo91.com
// @connect    	 promplate.dev
// @connect    	 binjie.fun
// @connect    	 gptforlove.com
// @connect    	 yeyu2048.xyz
// @connect    	 webtrncdn.com
// @connect    	 suda.edu.cn
// @connect      baomitu.com
// @connect      baidu.com
// @connect      bdimg.com
// @connect      bdstatic.com
// @connect      bowercdn.net
// @connect      bytecdntp.com
// @connect      kaskus.com
// @connect      cloudflare.com
// @connect      elemecdn.com
// @connect      firebase.com
// @connect      fontawesome.com
// @connect      font.im
// @connect      gitcdn.xyz
// @connect      gitcdn.link
// @connect      greasemonkey.github.io
// @connect      google-analytics.com
// @connect      google.com
// @connect      googleapis.com
// @connect      gstatic.com
// @connect      greasyfork.org
// @connect      gwdang.com
// @connect      highcharts.com
// @connect      jquery.com
// @connect      jsdelivr.net
// @connect      layuicdn.com
// @connect      caiyunapp.com
// @connect      loli.net
// @connect      mathjax.org
// @connect      aspnetcdn.com
// @connect      fastly.net
// @connect      npmmirror.com
// @connect      openuserjs.org
// @connect      pubnub.com
// @connect      recaptcha.net
// @connect      sheetjs.com
// @connect      sleazyfork.org
// @connect      hdslb.com
// @connect      sustech.edu.cn
// @connect      tailwindcss.com
// @connect      uicdn.toast.com
// @connect      todoist.com
// @connect      unpkg.com
// @connect      bundle.run
// @connect      alnk.cn
// @connect      webcache.cn
// @connect      webstatic.cn
// @connect      wysibb.com
// @connect      zstatic.net
// @connect      yximgs.com
// @connect    	 xjjwedu.com
// @connect    	 gxmzu.edu.cn
// @connect    	 cug.edu.cn
// @connect    	 cuc.edu.cn
// @connect    	 jsnu.edu.cn
// @connect    	 henu.edu.cn
// @connect    	 ahu.edu.cn
// @connect    	 smu.edu.cn
// @connect    	 nuaa.edu.cn
// @connect    	 rtjy.com.cn
// @connect    	 cqust.edu.cn
// @connect    	 bjtu.edu.cn
// @connect    	 bzpt.edu.cn
// @connect    	 gyrs.fun
// @connect    	 91faka.com
// @connect    	 o-learn.cn
// @connect    	 lidapoly.edu.cn
// @connect    	 baichuan-ai.com
// @connect    	 chatforai.store
// @connect    	 onrender.com
// @connect    	 168xc.top
// @connect    	 xiguashuwang.com
// @connect    	 hangzhou.gov.cn
// @connect    	 chatgpt.com
// @connect    	 gking.me
// @connect    	 aichatos8.xyz
// @connect    	 caifree.com
// @connect    	 644566.xyz
// @connect    	 matools.com
// @connect    	 xjrsjxjy.com
// @connect    	 shqszx.com
// @connect    	 xju.edu.cn
// @connect    	 myccr.net
// @connect    	 5zk.com.cn
// @connect    	 zjtvu.edu.cn
// @connect    	 sdsafeschool.gov.cn
// @connect    	 cqsdx.cn
// @connect    	 huashenxt.com
// @connect    	 ahut.edu.cn
// @connect    	 jsduxing.com
// @connect    	 hut.edu.cn
// @connect    	 xzit.edu.cn
// @connect    	 fjdfxy.com
// @connect    	 longzhi.net.cn
// @connect    	 jcpx-psych.com
// @connect    	 zhi-ti.com
// @connect    	 szqinqi.com
// @connect    	 chineseworkers.com.cn
// @connect    	 cfyedu.com
// @connect    	 mynj.cn
// @connect    	 zbwsrc.cn
// @connect    	 qwjiaoyu.com
// @connect    	 aitianhu1.top
// @connect    	 wwwwqq.com
// @connect    	 viaa.fun
// @connect    	 wendabao-a.top
// @connect    	 bixin123.com
// @connect    	 ai365vip.com
// @connect    	 ichuang.top
// @connect    	 ichat2019.com
// @connect    	 tinycms.xyz
// @connect    	 jaze.top
// @connect    	 chkzh.com
// @connect    	 wanjuantiku.com
// @connect    	 611520.cn
// @connect    	 moiu.cn
// @connect    	 tttt.ee
// @connect    	 hnvist.cn
// @connect    	 mosoteach.cn
// @connect    	 cloudstatic.cn
// @connect    	 cloudbasefunction.cn
// @connect      qcloud.la
// @connect      wk66.top
// @connect      911285.xyz
// @connect      xmig6.cn
// @connect      026wk.xyz
// @connect      6hck.xyz
// @connect      52xn.xyz
// @connect      siliconflow.cn
// @connect      xunhupay.com
// @connect      toolchest.cn
// @connect      guilan.cn
// @connect      qingsuyun.com
// @connect      gzgsmooc.org.cn
// @connect      qfcdn.icu
// @connect      ykt.io
// @connect      dkjdda.top
// @connect      sswpdd.xyz
// @connect      scriptcat.org
// @connect      wdjycj.com
// @connect      dahi.icu
// @connect      soujiaoben.org
// @connect      soujiaoben.com
// @connect      scnet.cn
// @connect      googleapis.com
// @connect      githubusercontent.com
// @connect      coxpan.com
// @connect      azkou.cn
// @connect      zaizhexue.top
// @connect      hive-net.cn
// @connect      itihey.com
// @connect      jszkk.com
// @connect      vercel.app
// @connect      fastgpt.cn
// @connect      csid.cc
// @connect      zerror.cc
// @connect      wlai.vip
// @connect      haxiaiplus.cn
// @connect      lxfk.top
// @connect      eeo.cn
// @connect      tk.tk.icu
// @connect      scriptcat.cn
// @connect      154.44.26.234
// @connect      aiask.site
// @connect      116611.xyz
// @connect      mixuelo.cc
// @connect      qianwen.com
// @connect      xiemuyang.cn
// @connect      127.0.0.1
// @connect      *
// @antifeature  payment
// @antifeature  referral-link
// @downloadURL https://update.greasyfork.org/scripts/502159/FCQ%E7%BD%91%E8%AF%BE%E9%80%9A%E5%8A%A9%E6%89%8B%5B%E5%85%A8%E7%BD%91%E9%A2%98%E5%BA%93%5D%5B%E9%80%9A%E7%94%A8%E6%99%BA%E8%83%BD%E9%80%82%E9%85%8D%E7%AD%94%E9%A2%98%5D%5B%E5%88%B7%E8%AF%BE%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/502159/FCQ%E7%BD%91%E8%AF%BE%E9%80%9A%E5%8A%A9%E6%89%8B%5B%E5%85%A8%E7%BD%91%E9%A2%98%E5%BA%93%5D%5B%E9%80%9A%E7%94%A8%E6%99%BA%E8%83%BD%E9%80%82%E9%85%8D%E7%AD%94%E9%A2%98%5D%5B%E5%88%B7%E8%AF%BE%5D.meta.js
// ==/UserScript==


const HAS_GM = typeof GM !== 'undefined';
const NEW_GM = ((scope, GM) => {
    // Check if running in Tampermonkey and if version supports redirect control
    if (GM_info.scriptHandler !== "Tampermonkey" || compareVersions(GM_info.version, "5.3.2") < 0) return;

    // Backup original functions
    const GM_xmlhttpRequestOrig = GM_xmlhttpRequest;
    const GM_xmlHttpRequestOrig = GM.xmlHttpRequest;

    function compareVersions(v1, v2) {
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);
        const length = Math.max(parts1.length, parts2.length);

        for (let i = 0; i < length; i++) {
            const num1 = parts1[i] || 0;
            const num2 = parts2[i] || 0;

            if (num1 > num2) return 1;
            if (num1 < num2) return -1;
        }
        return 0;
    }

    // Wrapper for GM_xmlhttpRequest
    function GM_xmlhttpRequestWrapper(odetails) {
        // If redirect is manually set, simply pass odetails to the original function
        if (odetails.redirect !== undefined) {
            return GM_xmlhttpRequestOrig(odetails);
        }

        // Warn if onprogress is used with settings incompatible with fetch mode used in background
        if (odetails.onprogress || odetails.fetch === false) {
            console.warn("Fetch mode does not support onprogress in the background.");
        }

        const {
            onload,
            onloadend,
            onerror,
            onabort,
            ontimeout,
            ...details
        } = odetails;

        // Set redirect to manual and handle redirects
        const handleRedirects = (initialDetails) => {
            const request = GM_xmlhttpRequestOrig({
                ...initialDetails,
                redirect: 'manual',
                onload: function (response) {
                    if (response.status >= 300 && response.status < 400) {
                        const m = response.responseHeaders.match(/Location:\s*(\S+)/i);
                        // Follow redirect manually
                        const redirectUrl = m && m[1];
                        if (redirectUrl) {
                            const absoluteUrl = new URL(redirectUrl, initialDetails.url).href;
                            handleRedirects({ ...initialDetails, url: absoluteUrl });
                            return;
                        }
                    }

                    if (onload) onload.call(this, response);
                    if (onloadend) onloadend.call(this, response);
                },
                onerror: function (response) {
                    if (onerror) onerror.call(this, response);
                    if (onloadend) onloadend.call(this, response);
                },
                onabort: function (response) {
                    if (onabort) onabort.call(this, response);
                    if (onloadend) onloadend.call(this, response);
                },
                ontimeout: function (response) {
                    if (ontimeout) ontimeout.call(this, response);
                    if (onloadend) onloadend.call(this, response);
                }
            });
            return request;
        };

        return handleRedirects(details);
    }

    // Wrapper for GM.xmlHttpRequest
    function GM_xmlHttpRequestWrapper(odetails) {
        let abort;

        const p = new Promise((resolve, reject) => {
            const { onload, ontimeout, onerror, ...send } = odetails;

            send.onerror = function (r) {
                if (onerror) {
                    resolve(r);
                    onerror.call(this, r);
                } else {
                    reject(r);
                }
            };
            send.ontimeout = function (r) {
                if (ontimeout) {
                    // See comment above
                    resolve(r);
                    ontimeout.call(this, r);
                } else {
                    reject(r);
                }
            };
            send.onload = function (r) {
                resolve(r);
                if (onload) onload.call(this, r);
            };

            const a = GM_xmlhttpRequestWrapper(send).abort;
            if (abort === true) {
                a();
            } else {
                abort = a;
            }
        });

        p.abort = () => {
            if (typeof abort === 'function') {
                abort();
            } else {
                abort = true;
            }
        };

        return p;
    }

    // Export wrappers
    GM_xmlhttpRequest = GM_xmlhttpRequestWrapper;
    scope.GM_xmlhttpRequestOrig = GM_xmlhttpRequestOrig;

    const gopd = Object.getOwnPropertyDescriptor(GM, 'xmlHttpRequest');
    if (gopd && gopd.configurable === false) {
        return {
            __proto__: GM,
            xmlHttpRequest: GM_xmlHttpRequestWrapper,
            xmlHttpRequestOrig: GM_xmlHttpRequestOrig
        };
    } else {
        GM.xmlHttpRequest = GM_xmlHttpRequestWrapper;
        GM.xmlHttpRequestOrig = GM_xmlHttpRequestOrig;
    }
})(this, HAS_GM ? GM : {});

if (HAS_GM && NEW_GM) GM = NEW_GM;


if (typeof GM_xmlhttpRequest == 'undefined' || GM_info.scriptHandler == 'stay') {
    alert("由于兼容性问题，FCQ脚本不支持【油猴子(Greasemonkey)或Stay for Browser】插件使用,请使用【篡改猴/油猴(tampermonkey)】插件或【脚本猫(scriptcat)】插件安装此脚本,安装地址:https://www.crxsoso.com/webstore/detail/dhdgffkkebhmkfjojejmpbldmpobfkfo 安装教程:https://www.youxiaohou.com/zh-cn/crx.html?spm=1717453534064 如果反复提示此信息,请从插件中删除此脚本")
    return;
}

setInterval(() => {
    if (window.xm_ui) {
        var content = window.xm_ui.find("#xm_share:contains(更新)").clone()
        window.xm_ui.find("#xm_share:contains(更新)").remove()
        window.xm_ui.find('#xm_state').before(content.attr("id", "xm_update").click(() => {
            window.open("https://greasyfork.org/zh-CN/scripts/502159-fcq%E7%BD%91%E8%AF%BE%E9%80%9A%E5%8A%A9%E6%89%8B-%E5%85%A8%E7%BD%91%E9%A2%98%E5%BA%93-%E9%80%9A%E7%94%A8%E6%99%BA%E8%83%BD%E9%80%82%E9%85%8D%E7%AD%94%E9%A2%98-%E5%88%B7%E8%AF%BE")
        }))
    }
}, 1000)
var flagx = false
var ready_main = () => {



    if (window.ggxmm) {
        setInterval(() => {
            var $ = $_
            console.log('循环运行')
            if ($(".el-message-box:contains(本小节学习已完成) span:contains(确定):visible").length || $('.vjs-remaining-time-display').text() == '-0:00') {
                $(".el-message-box:contains(本小节学习已完成) span:contains(确定):visible").click()
                console.log('学习完成')
                setTimeout(() => {
                    $('font:contains(播放下一节)').click()
                }, 500)

            } else {
                $('.vjs-big-play-button').click()
            }

        }, 1000)
    }

    function gV() {
        return GM_getValue("oc")
    }

    function loop() {
        setTimeout(() => {
            if (window.self !== window.top) {
                return;
            }
            let videoElem;
            videoElem = document.querySelector('#iframe').contentDocument.querySelector('iframe').contentDocument.querySelector('#video_html5_api');
            if (!videoElem) {
                return;
            }
            let videoLi = document.querySelectorAll('.posCatalog_name');
            let videoCu = document.querySelector('.posCatalog_active span');
            let videoNext;
            for (let i = 0, len = videoLi.length; i < len; i++) {
                if (videoLi[i] == videoCu) {
                    videoNext = videoLi[i + 1];
                    break;
                }
            }
            function AnsQues() {
                let check = setInterval(() => {
                    try {
                        let text = document.querySelector('iframe').contentDocument.querySelector('iframe').contentDocument.querySelector('iframe').contentDocument.querySelector('body > div:last-child').innerText;
                        if (text.slice(0, 5) === '答题已完成') {
                            clearInterval(check);
                            document.querySelector('iframe').contentDocument.querySelector('iframe').contentDocument.querySelector('iframe').contentDocument.querySelector('.Btn_blue_1').click()
                            setTimeout(() => {
                                document.querySelector('iframe').contentDocument.querySelector('iframe').contentDocument.querySelector('iframe').contentDocument.querySelector('#confirmSubWin .bluebtn').click()
                                setTimeout(() => {
                                    videoNext.click();
                                    if (videoNext != videoLi[videoLi.length - 1]) {
                                        loop();
                                    }
                                }, 2000)
                            }, 50)
                            return;
                        }
                        else if (text.match('题目待完善')) {
                            clearInterval(check);
                            videoNext.click();
                            if (videoNext != videoLi[videoLi.length - 1]) {
                                loop();
                            }
                            return;
                        }
                    }
                    catch {
                    }
                }, 2000)
                }
            let jobLeft;
            try {
                jobLeft = document.querySelector('.posCatalog_active input').value;
            }
            catch {
                videoNext.click();
                if (videoNext != videoLi[videoLi.length - 1]) {
                    loop();
                }
                return;
            }
            if (jobLeft == 2) {
                videoElem.onended = () => {
                    document.querySelector('#dct2').click();
                    setTimeout(AnsQues, 2000);
                }
            }
            else if (jobLeft == 1) {
                if (!document.querySelector('#iframe').contentDocument.querySelector('.ans-job-finished')) {
                    videoElem.onended = videoNext.click();
                }
                else {
                    document.querySelector('#dct2').click();
                    setTimeout(AnsQues, 2000);
                }
            }
        }, 5000);
    }
    function taolun() {
        const body = document.querySelector("body")
        const btn = document.createElement("button")
        btn.onclick = allComment
        btn.style.padding = "10px"
        btn.style.backgroundColor = "skyblue"
        btn.style.position = "fixed"
        btn.style.right = "100px"
        btn.style.top = "400px"
        btn.textContent = "一键回复"
        body.appendChild(btn)
        async function allComment() {
            console.log("1111")
            const name = document.querySelector(".zt_u_name").textContent
            const commentDoms = document.querySelectorAll("#showTopics .content1118 .oneDiv")
            for (let i = 0; i < commentDoms.length; i++) {
                if (commentDoms[i].innerHTML.indexOf(name) === -1) {
                    const comment = commentDoms[i].querySelector(".hf_pct").textContent
                    const replyBtn = commentDoms[i].querySelector(".clearfix .tl1")
                    replyBtn.click()
                    let textarea = commentDoms[i].querySelector(".plDiv textarea")
                    while (!textarea) {
                        textarea = commentDoms[i].querySelector(".plDiv textarea")
                    }
                    textarea.value = comment
                    const uploadBtn = commentDoms[i].querySelector(".plDiv grenBtn")
                    uploadBtn.click()
                    await new Promise((re) => {
                        setTimeout(() => { re() }, 200)
                    })
                    console.log(comment, replyBtn)
                }
            }
        }

    }
    function dafen() {
        var button = document.createElement('button');
        button.innerHTML = '一键打分';
        button.style.position = 'absolute'; // 或者 'absolute' 如果您想要相对于某个容器定位
        button.style.top = '10px'; // 距离顶部 10px
        button.style.left = '50%'; // 居中
        button.style.zIndex = '9999';
        button.style.padding = '10px';
        button.style.backgroundColor = '#008CBA';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';


        document.body.appendChild(button);



        // 点击按钮时的处理函数
        button.onclick = function () {
            // 获取所有具有 class "inputBranch makeScore" 的 input 元素
            const inputs = document.querySelectorAll('input.inputBranch.makeScore');

            // 遍历这些 input 元素
            inputs.forEach(input => {
                // 获取 input 元素的 data 属性值
                const dataValue = input.getAttribute('data');

                // 将 data 属性值赋给 value 属性
                input.value = dataValue;
            });
            //总分
            var fullScoreElement = document.getElementById("fullScore");
            // 获取id为sumScore的元素
            var sumScoreElement = document.getElementById("sumScore");

            // 检查这两个元素是否存在
            if (fullScoreElement && sumScoreElement) {
                // 将fullScore的value值赋给sumScore的value
                sumScoreElement.value = fullScoreElement.value;
                document.querySelector('.jb_btn_92.fr.fs14.marginLeft30').click();

            }


        };

    }

    function daochu() {
        // 定义一个函数来导出题目
        function exportQuestions() {
            var questions = $('.stem_con');
            var output = '';

            questions.each(function (index) {
                var questionText = $(this).find('p').text().trim();
                var options = $(this).next('.stem_answer').find('.num_option, .answer_p');
                // 寻找紧接在当前题目的下一个.answerDiv作为答案部分
                var nextAnswerDiv = $(this).nextUntil('.stem_con').filter('.answerDiv');
                var answer = nextAnswerDiv.find('.answer_tit p').text().trim();

                output += (index + 1) + '. ' + questionText + '\r\n';
                options.each(function (optionIndex) {
                    if (optionIndex % 2 === 0) { // 选项字母
                        var letter = $(this).text().trim();
                        output += letter + ' ';
                    } else { // 选项文本
                        output += $(this).text().trim() + '\r\n';
                    }
                });
                output += '#' + answer + '#\r\n';
            });

            saveStringToFile("<TikS><本试卷使用TikN学习通导出工具V1.0自动生成>" + output, "导出习题.tik")
        }

        function saveStringToFile(str, filename) {
            var blob = new Blob([str], { type: "text/plain;charset=utf-8" });
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        }

        // 当页面加载完成时执行导出函数
        $(document).ready(exportQuestions);
    }

    var qq_group = "399697149"

    unsafeWindow.$_ = $
    if (window.location.href.indexOf("https://service.icourses.cn/") != -1) {
        const config = {
            pdf_time: 20 * 60 * 1000//30分鐘
        }
        let ChapterList = []
        function GetRessList(id) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    url: "https://service.icourses.cn/hep-company//sword/company/getRess",
                    method: "POST",
                    data: "sectionId=" + id,
                    headers: {
                        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                    },
                    onload: function (xhr) {
                        try {
                            resolve(JSON.parse(xhr.responseText).model.listRes)
                        }
                        catch (err) {
                            resolve([])
                        }
                    }
                });
            })
        }
        function OpenOriginDialog(Content) {
            return new Promise((resolve, reject) => {
                unsafeWindow.require(["Play"], function (Play) {
                    let courseId = unsafeWindow._courseId;
                    let userId = unsafeWindow._userId;
                    let companyCode = unsafeWindow._companyCode;
                    const ListenMessage = (e) => {
                        if (e.data === 'lhd_close') {
                            unsafeWindow.removeEventListener('message', ListenMessage)
                            document.querySelector('[id^=dialog-myModal]')?.remove()
                            resolve()
                        }
                    }
                    unsafeWindow.addEventListener('message', ListenMessage);
                    Play.dialog({
                        //唯一ID
                        id: "videoBox-link",
                        data: {
                            url: Content.fullResUrl,
                            companyCode: companyCode,//三方公司id
                            resId: Content.id,
                            type: Content.mediaType,
                            userId: userId,
                            courseId: courseId,
                            title: Content.title + ''
                        },
                        //弹出框宽度
                        width: "auto",
                        //弹出框高度
                        height: (screen.availHeight - 200) + "px",
                        //是否开启打点功能
                        isTicker: true
                    });
                })
            })
        }
        async function ExecteContentMission(Contet) {
            return new Promise(async (resolve, reject) => {
                await OpenOriginDialog(Contet)
                //执行相关内容
                resolve()
            })
        }
        async function AutoExecteChaprterMission(ChapterList) {
            for (let index = 0; index < ChapterList.length; index++) {
                let CurrentChapert = ChapterList[index]//获取每个章
                let ContentList = await GetRessList(CurrentChapert)//获取该章数据
                for (let ContentIndex = 0; ContentIndex < ContentList.length; ContentIndex++) {
                    let CurrentContent = ContentList[ContentIndex]//遍历内容数据列表
                    await ExecteContentMission(CurrentContent)//执行内容
                }

            }
        }
        function InjectButtonToBody() {
            let btn = document.createElement("div");
            btn.innerHTML = '<button style="position: fixed;bottom: 80vw;right: 0;z-index: 9999;height: 50px;">开始刷课</button>';
            btn.onclick = function () {
                ChapterList = []
                ChapterList = ChapterList.concat(...document.querySelectorAll(".shareResources > .panel-group > li"))
                let ParentChapert = document.querySelectorAll(".shareResources > .panel-group > li:not(.noContent)")
                ParentChapert.forEach((item) => {
                    ChapterList = ChapterList.concat(...item.querySelectorAll(".chapter-content [data-secid]"))
                });
                ChapterList = ChapterList.map((item) => item.getAttribute("data-id") ?? item.getAttribute("data-secid"))
                AutoExecteChaprterMission(ChapterList)
            }
            document.body.append(btn);
        }
        function InjectVideoPage() {
            unsafeWindow.savevideojs = undefined
            Object.defineProperty(unsafeWindow, 'videojs', {
                get() {
                    let result = unsafeWindow.savevideojs;
                    return result
                },
                set(vdobj) {
                    vdobj.hook('beforesetup', function (videoEl, options) {
                        options.muted = true;
                        options.autoplay = true;
                        return options;
                    });
                    vdobj.hook('setup', function (player) {
                        player.on("ended", function () {
                        });
                    });
                    unsafeWindow.savevideojs = vdobj;

                }
            })
        }
        function InjectPdfPage() {
            setTimeout(() => {
            }, config.pdf_time)
        }
        function MainBranch() {
            if (location.href.indexOf('/sword/rp/play/toPlay') !== -1) {
                InjectVideoPage()
            } else if (location.href.indexOf('/icourse/lib/pdfjs/web/') !== -1) {
                InjectPdfPage()
            } else {
                InjectButtonToBody()
            }
        }
        MainBranch()

    }

    setTimeout(() => {
        if (GM_getValue('userFirst') && window.location == window.parent.location && !unsafeWindow.fcq_state) {
            GM_setValue('fingerprintDate', GM_getValue('fingerprintDate') || new Date().getTime())
            if (new Date().getTime() - GM_getValue('fingerprintDate') > 30 * 1000 && GM_getValue('fingerprintLog') && GM_getValue('fingerprintLog')['step4'] != 0) {
                alert('FCQ脚本出错，请加群' + qq_group + '联系bug管理员处理，修复完成后将会获得1000搜题积分奖励')
            }
        }
    }, 2000)

    if (window.location.href.indexOf("https://hzzh.chsi.com.cn/kc/xx/") != -1) {
        let rate = 2;//倍速
        unsafeWindow.onload = function () {
            //在元素都加载完成后再监听video的播放时间,再进行倍速设置
            unsafeWindow.document.querySelector('video').onplay = function () {
                unsafeWindow.document.querySelector('video').playbackRate = rate;
            }
            let hookSetInterval = unsafeWindow.setInterval;
            unsafeWindow.setInterval = function (a, b) {
                return hookSetInterval(a, b / rate);
            }
            unsafeWindow.document.querySelector('video').volume = 0
            unsafeWindow.document.querySelector('video').play()
            var elevideo = document.querySelector("video");
            elevideo.addEventListener('ended', function () { //结束
                unsafeWindow.document.querySelector('video').play()
            });
        }
    }

    if (window.location.href.indexOf("https://training.tisco.com.cn/front/command/LessonAction") != -1) {
        setTimeout(() => {
            // Your code here...
            setInterval(() => {
                // 判断当前视频有没有刷完，刷完的话就会暂停，我们就通过左下角是否变成了暂停来进行判断
                // let pauseIcon = document.querySelector('.pausecenterchhulqiaoaix').style.display;
                let pauseIcon = document.querySelector("div[class^='pause']").style.display;
                console.log(pauseIcon)
                // 等于none的时候左下角为暂停，没有出现的时候就为block,出现了以后我们就跳到下一节
                /*
            这个网站右侧列表课程表当前播放的视频类名为cur_li，我们通过这个来判断，播放完成以后就播放它的下一个视频
        */
                if (pauseIcon == 'none') {
                    // 直接拿到下一个视频的跳转连接
                    let nextHref = document.querySelector('.cur_li').nextElementSibling.children[0].href
                    window.location.href = nextHref;
                }

            }, 3000)
        }, 5000)
    }



    if (window.location.href.indexOf("https://jiangxi.zhipeizaixian.com/study/") != -1) {
        var facejgt = true;
        var dtime = a_time / 5;
        window.setInterval(() => {
            let autonext = document.querySelector(".modal_mark___2vwrm");
            let autoPlay = document.querySelector(".prism-big-play-btn");
            let autoverify = document.querySelector(".ant-modal-confirm-btns");
            let verifyhint = document.querySelector(".ant-modal-wrap");
            let Playbutton = document.querySelector("#J_prismPlayer>video");
            if (autonext != null) { setTimeout(function () { document.querySelector('.next_button___YGZWZ').click(); }, 2000); notifyhint('自动跳转', '已自动跳转下一节'); }
            if (autoPlay.style.display == 'block') { document.querySelector('.outter').click(); if (a_mute) { Playbutton.volume = 0; } }
            if (verifyhint != null) { if (autoverify == null) { if (facejgt) { notifyhint('人脸识别', '出来人脸识别啦!'); facejgt = false; } } }
            if (autoverify != null) { setTimeout(function () { document.querySelector('.ant-btn').click(); notifyhint('弹框验证', '已经继续观看'); }, 2000); }
            if (dtime <= 0) { dtime = a_time / 5; facejgt = true; } dtime--;
        }, 5000);
        notifyhint("启动成功", "已成功导入");
    }

    GM_addValueChangeListener("reload", (name, oldValue, newValue) => {
        if (!flagx) {
            try {
                ready_main()
            } catch (e) {

            }
        }
        flagx = true
    })



    let alllearning;
    let nolearning = [];
    let ns_player;
    let dbg = true;


    // 上一页
    function ns_pageback() {
        history.back(-1);
    }

    // 获取所有课程
    function ns_nostudy() {
        alllearning = $(".learning-activity");
        for (let i = 0; i < alllearning.length; i++) {
            let str = $(".learning-activity:eq(" + i + ") div.activity-operations-container .completeness").attr("tipsy-literal");
            let zf = str.match(/^<b>(\W+)<\/b>/)[1];
            let type = str.match(/^<b>\W+<\/b><\/br>(\W+)/)[1];
            let typeEum = -1;
            if (type === "完成指标：查看页面") {
                typeEum = 1;
            } else if (type.indexOf("完成指标：需累积观看") > -1) {
                typeEum = 2;
            } else if (type.indexOf("访问线上链接") > -1) {
                typeEum = 3;
            } else if (type.indexOf("完成指标：参与发帖或回帖") > -1) {
                typeEum = 4;
            } else if (type.indexOf("完成指标：观看或下载所有参考资料附件") > -1) {
                typeEum = 5;
            }
            if (zf !== "已完成" && typeEum != -1) {
                $(".learning-activity:eq(" + i + ")>div").click();
                break;
                // nolearning.push({
                //   type: typeEum,
                //   id:$(".learning-activity:eq("+i+")").attr("id").replace("learning-activity-",""),
                //   jq:$(".learning-activity:eq("+i+")")
                // })
            }
        }
    }

    function ns_back(nb) {
        setTimeout(function () {
            ns_pageback();
        }, nb ? nb : 5000);
    }

    //FCQ官网以及备用
    var FCQList = [
        "https://tcb-p7ejf6ik6c3sy7h-7c8944ac450f-1252168680.tcloudbaseapp.com/#/?orgin=greasyfork",
        "http://47.121.140.50/#/?orgin=greasyfork",
    ]


    var delay = (time) => new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, time)
    })


    var GM_req3 = (req_body) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject()
            }, 10000)
            req_body.headers = {
                'Accept': 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
            }
            req_body.onload = res => {
                resolve(res)
            }
            req_body.onerror = res => {
                reject()
            }

            GM_xmlhttpRequest(req_body)
        })
    }

    var FCQIndex = GM_getValue('FCQIndex')

    var FCQ = FCQList[FCQIndex || 0]

    var openFCQ = async () => {
        var prefix = await Promise.race(FCQList.map(async (url, i) => {
            try {
                var res = await GM_req3({ url })
                if ((res.response || "").indexOf('<title>meteor-web</title>') != -1) {
                    return url
                }
            } catch (e) {

            }
            await delay(10000)
            return ""
        }))
        if (!prefix) {
            alert('无法打开官网,请加qq群:' + qq_group + "联系管理员处理")
        } else {
            window.open(prefix)
        }
    }

    var checkIndex = async () => {
        var FCQIndex = GM_getValue('FCQIndex')
        if (FCQIndex == undefined) {
            var index = await Promise.race(FCQList.slice(0, 1).map(async (url, i) => {
                try {
                    var res = await GM_req3({ url: url })
                    if ((res.response || "").indexOf('<title>meteor-web</title>') != -1) {
                        return i
                    }
                } catch (e) {

                }
                return -1
            }))

            if (index != -1) {
                FCQIndex = index
            } else {
                FCQIndex = 1
            }
        }
        GM_setValue('FCQIndex', FCQIndex)
        FCQ = FCQList[FCQIndex]
    }

    checkIndex()


    var ns_pl = false;

    ; (function (_this) {

        function opeationUi(menu) {
            this.fcq_xm_answer = null;
            this.$ = $;
            this.menu = menu;
            this.xm_window = window
            this.initMenu();
            this.config = {}
            unsafeWindow.mainProcedure = this
            window.mainProcedure = this
            return this;
        }

        opeationUi.prototype.initData = async function () { //初始化
            this.xm_ui.find("#token").val(GM_getValue("token"))
        }

        opeationUi.prototype.toLog = function (explain) {
            setInterval(() => {
                let fcq_xm_select = window.getSelection().toString();
                if (fcq_xm_select) {
                    this.xm_ui.find('#fcq_xm_search_text')[0].value = window.getSelection().toString()
                }
            }, 400)
            this.initData();
            return this;
        }

        opeationUi.prototype.arrowMoveMenu = function (e) {
            let elW = e.currentTarget.offsetWidth
            let elH = e.currentTarget.offsetHeight
            let elL = e.currentTarget.parentNode.parentNode.offsetLeft
            let elT = e.currentTarget.parentNode.parentNode.offsetTop
            let x = e.clientX
            let y = e.clientY
            let w = window.innerWidth
            let h = window.innerHeight
            let moveX = x - elL
            let moveY = y - elT
            let el = e.currentTarget
            document.onmousemove = function (e) {
                el.parentNode.parentNode.style.left = e.clientX - moveX + 'px'
                el.parentNode.parentNode.style.top = e.clientY - moveY + 'px'
            }
            document.onmouseup = function (e) {
                document.onmousemove = null
                document.onmouseup = null
            }
        };

        opeationUi.prototype.initMenu = function () {
            let $ = this.$, menu = this.menu;

            var element = $('<div id="fcq_xm_zhu"></div>')[0]
            this.element = element
            var shadow = element.attachShadow({ mode: 'closed' });
            this.xm_ui = $('<div id="fcq_ui"></div>')
            unsafeWindow.fcq_search = true
            const styleTag = `
        <style scoped>
            .fcq_xm_container{
                padding:3px;
                pointer-events: visible;
                position:relative;
                max-height:400px;
                overflow:auto;
                text-align:left;
                display: none;
                width: 100%;
                max-width: 300px;
                z-index: 99999;
                border-radius: 20px !important;
            }
#${menu.id} p{
    text-align:left;
    padding-left:5px;
}
.fcq_xm_img{
    border-radius: 50%;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGGmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDEgNzkuYThkNDc1MywgMjAyMy8wMy8yMy0wODo1NjozNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI1LjAgKDIwMjMwODAxLm0uMjI2NSAzYTAwNjIzKSAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMi0wNy0yNFQwMDoyODoxNSswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjMtMDgtMjJUMDE6NTE6MjYrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjMtMDgtMjJUMDE6NTE6MjYrMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjkxY2Y1NWExLTZkZTEtYTk0NS1hMDk5LWY0MmNlNTQ5NGY2YiIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmYyYWZkOThmLTcyMDItMzE0Ni04M2FjLTJmOGY1YTkxZDk2MiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjgxYWIyODgwLWQxYTEtMDA0NC1iZGU3LTk5NDg4YWM0YjA2ZiI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ODFhYjI4ODAtZDFhMS0wMDQ0LWJkZTctOTk0ODhhYzRiMDZmIiBzdEV2dDp3aGVuPSIyMDIyLTA3LTI0VDAwOjI4OjE1KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjUuMCAoMjAyMzA4MDEubS4yMjY1IDNhMDA2MjMpICAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjkxY2Y1NWExLTZkZTEtYTk0NS1hMDk5LWY0MmNlNTQ5NGY2YiIgc3RFdnQ6d2hlbj0iMjAyMy0wOC0yMlQwMTo1MToyNiswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI1LjAgKDIwMjMwODAxLm0uMjI2NSAzYTAwNjIzKSAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PubJeqwAAARCSURBVDjLbVRrbBRlFD1q+kNDiESNihGDRkOiCVEMGB9ETGhMqn+wxsRgNGlNEBP0hxr1h6YGhIaSYMHW0naf3e1jW4sUSiPQatLS+ihgaal90FbazuzM7O5MZx+z232M985udyvy42R3vm/umXPvPfcCbSbgI7hVwC4ADpkQ5N9XCBWELjikOcICnNI5OJRK+l8CWzAb4yO4l4F24mCuWxBuo6ALFGRacBIa/Cbq/dlnhz8Lu3wZTYHX0LF0EyGT8YNbY8LyQtAqska/Rs//4AT9d0kFYifBrVTAkwI6iaODCZszQKtF+A4RmnlljEYmlMwDI9GNXfOJonu9sok6f+Hezu8s0keWDsBFHA4mdEcBl/5YXtXqVI8smrv6lk6ZpolkOoM3f9EO8VlBZe49FlKv70R9hAmpuE7p1/8RspIa0Twzn3hUiKYwriXRLy2vJVVpHL8pE451iYtwkDg4A1uyRaaLH0QTtTlUC+a+P8NVGVJnnzKwfyQKVuq4brx/Z41oWE2qE7Mx9lw9berbRKh8wwdF9KUNbUrftq5Q1Z4B/b2yAf3JK6EkEkTinDbw3JnQU65p427FyGDfb+H7S86pu575Kfj1+lbl9B2s0kZwCR1EKP/IqT3RGRy9pqVQP2mgZsLAYIBSJJT1LZVvPhn0ffx7uKx1Nr6uZyGBPUM63uhbwueXIhijmOLzWo9VBrs8SlaRB9Eomnc1SKp7Jr6D02LiY1PGxi2tykV8J5hHRqNlvrk4WmYMtM3GUXElYpWB3x0KJB9/0CndsEpgl0TAKw9ZcrkWxwRTiKbXC7HMQ9TNOCoXzEtq6mkO/ILU2KZimNFTFhFjXE89sNYuBTku13k/0KR0wpYzLDVjnVeR7/EqCr6dN6snY29xYCiRhpfUXaWarpDdiKQfWeOQpjkDuOSVjl/jUduftwxf8DQcnDd3XtB6ODCSzGAukoaDGnPoahSHCU3XDbzQHarCUaHgSe60K9BJKWtbrYcVT9GoFTX4kx1z8YfZf4PyMnrFZeylRrzco+LTPyLcZTzfHfrM+vhKnI1K5g7sJmMnAJs8kB+77wVz+8+q7y9K76vLEXxIRLORFA6PxVByXkXtRAweUljWr5daPsybW/ZTg8nYHTQuPn0THGLW3FTHD4b03X9Tp7+kRnwyHKHuxneU9mqvl/RquEiKx9QUPhoKb7Vm3ZZT51FL0MaT0kwD7SHY9XLYFyz3v9uvFw+TBym97ZvaAx5r45BXNzQr3ZUj0VfVRAZkozW3s4ATIte+0tqL7QQcJ7Jqgs0gYmkvf/W+FtnYfCp4dkWxRWjNt2jhxe7QyWdPB4dvs1neO0grjMhCtA8JqCOyWiak1L28hbWX0CCPo0bgPZjdJqs3C5+x72r9Ou2BUrIdbSuC71aEHrpwh3mdUQmkYiI5SugjTBAm6ayftnQdWpRSNASARiJw/5fwXxU4oNDCS+vgAAAAAElFTkSuQmCC);
                    background-size: 30px 30px;
                    width: 30px;
                    height: 30px;
                    }
.mask{
    background-color: rgb(0, 0, 0);
    opacity: 0.3;
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2147483608;

}

.box{
    margin: 0;
    padding: 10px;
    background-color: #fff;
    -webkit-background-clip: content;
    border-radius: 2px;
    box-shadow: 1px 1px 50px rgba(0,0,0,.3);

}


.xm_t{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2147483609;

}
</style>`;

            $(styleTag).appendTo(this.xm_ui);
            let $menu = $(
                `

            <div id='${menu.id}' style=" font-size:14px;
                z-index: 10000000;
                text-align:center;
                position:fixed;
                background: rgb(240, 249, 235);
    box-shadow: 0 5px 15px rgba(0,0,0,0.8);
        border-radius: 10px;
                        left:`+ menu.pos.x + `px;
                top:`+ menu.pos.y + `px;
                ">

             <div id ="fcq_zhu" style="pointer-events: visible;">
                    <div id="fcq_xm_set" style="
    font: unset;
    z-index: 2147483607;
    color: #67c23a;
    padding: 5px;
    display: flex;
    line-height: 1;
    cursor: pointer;
    font-size: 25px;
    width: unset;
    justify-content: center;
    align-items: center;
                    ">
                    <div class="fcq_xm_img"></div>
                    <div>FCQ网课助手</div>
                    </div>
                </div>
                                             <div class= "fcq_xm_container" id="fcq_xm_set_2">
                    <div style="display: flex;">
                       <div style="width: 45px;"> token:</div><input id = "token"  style="
                       width: 170px;
    border: none;
    border-radius: 5px;
    border: 2px solid #ccc;
    font-size: 10px;
    outline: none;
    transition: all 0.3s ease-in-out;

                       "/>
                        <a  target='_blank' id="fcq_web" href='`+ FCQ + `' style="
                            font:unset;
    width: 70px;
    text-align: center;
    display: inline-block;
        background: linear-gradient(to bottom, #4eb5e5 0%,#389ed5 100%);
    border: none;
    border-radius: 5px;
    position: relative;
    border-bottom: 4px solid #2b8bc6;
    color: #fbfbfb;
    font-weight: 600;
    font-family: 'Open Sans', sans-serif;
    text-shadow: 1px 1px 1px rgba(0,0,0,.4);
    font-size: 10px;
    text-indent: 5px;
    box-shadow: 0px 3px 0px 0px rgba(0,0,0,.2);
    cursor: pointer;
    padding: 5px 8px 3px 2px;

                        ">获取(官网)</a>
                    </div>
                    <div style="display: flex;">
                        <div style="width: 45px;">题目 :</div><input id = "fcq_xm_search_text" placeholder="" style="width: 170px;
    border: none;
    border-radius: 5px;
    border: 2px solid #ccc;
    font-size: 10px;
    outline: none;
    transition: all 0.3s ease-in-out;
                        " />
                        <button  id="fcq_xm_search" style="
                            font:unset;
    display: inline-block;
        background: linear-gradient(to bottom, #4eb5e5 0%,#389ed5 100%);
    border: none;
    border-radius: 5px;
    position: relative;
    border-bottom: 4px solid #2b8bc6;
    color: #fbfbfb;
    font-weight: 600;
    font-family: 'Open Sans', sans-serif;
    text-shadow: 1px 1px 1px rgba(0,0,0,.4);
    font-size: 10px;
    text-align: left;
    text-indent: 5px;
    box-shadow: 0px 3px 0px 0px rgba(0,0,0,.2);
    cursor: pointer;
    padding: 5px 8px 3px 2px;
    width: 80px;
    text-align: center;

                        ">开始做题</button>
                    </div>
                    <div>
                        使用前请先获取登录token后填入,选中文字点击搜索即可,更多功能请前往官网查阅,<span style="color:blue">图标可拖动</span>
                    </div>
                </div>
                                <div class= "fcq_xm_container" id="fcq_xm_answer">
                    <p>
                    </p>
                </div>


            </div>`);


            var mask = $(`
        <div class="mask_box" style="display:none;">
        <div class="mask">

            </div>

        <div class="xm_t">

        <div class="box" style="
    width: 400px;
    background: white;
">
                 <div class="top" style="
    width: 100%;
    padding-bottom: 10px;
    text-align: right;
    border-bottom: 1px solid #f0f0f0;
">
                    <div id="xm_close" style="font-size: 15px;">关闭</div>

                 </div>

                 <div class="xm_content_trip" style="
    font-size: 15px;
    padding: 10px;
">
                 </div>
                 <div class="bottom" style="
        width: 100%;
    display: flex;
    justify-content: flex-end;
    width: 100%;
">
                    <div style="height: 28px;
                        border-color: #1e9fff;
    background-color: #1e9fff;
    color: #fff;
    line-height: 28px;
    padding: 0 15px;
    border: 1px solid #dedede;
    border-radius: 2px;
    font-weight: 400;
    cursor: pointer;
    text-decoration: none;
    font-size: 15px;
    " id="xm_confirm">确认</div>
                 </div>
               </div>

        </div>


        `)

            shadow.appendChild(this.xm_ui[0])
            this.xm_ui[0].appendChild($menu[0])
            this.xm_ui[0].appendChild(mask[0])

            //console.log('页面')

            $(document).ready(() => {

                $('html').append(element)
                setInterval(() => {
                    if (!$('html').find(element).length) {
                        $('html').append(element)
                    }
                }, 1000)

            })

            this.fcq_xm_answer = this.xm_ui.find('#fcq_xm_answer');
            this.xm_ui.find('#fcq_xm_set').on('mousedown', (e) => {
                window.mainProcedure.arrowMoveMenu(e);//.target.parentNode.id
            })
            var click_set = () => {
                this.xm_ui.find("#fcq_xm_set_2").toggle('active');
                this.xm_ui.find("#fcq_xm_answer").hide("slow");
            }
            this.xm_ui.find('#fcq_xm_set').on('click', click_set)
            this.xm_ui.find('#token').on('input', () => {
                console.log('修改', this.xm_ui.find('#token').val())
                GM_setValue("token", this.xm_ui.find('#token').val())
            })



            this.xm_ui.find('#fcq_xm_search').on('click', async () => {
                let fcq_xm_answer = this.xm_ui.find("#fcq_xm_answer")
                let text = this.xm_ui.find("#fcq_xm_search_text")[0]
                fcq_xm_answer.show("slow");
                fcq_xm_answer.text("");
                if (text.value.length < 6 && 0) {
                    fcq_xm_answer.append("搜索题目需要6个字符以上");
                    return;
                }
                fcq_xm_answer.append("正在搜索题库中，若长时间未返回信息，请加群" + qq_group + "反馈，注：该接口极易遭受攻击，如果无法正常使用，推荐使用官网内第二个，或耐心等待修复即可<hr>");
                await window.mainProcedure.search(text.value.replace(/   /g, "   "))
                fcq_xm_answer.text("");
                fcq_xm_answer.append("搜索到" + window.mainProcedure.config.answer.rows.length + "条相关题目<hr>");
                window.mainProcedure.config.answer.rows.forEach(row => {
                    fcq_xm_answer.append("题目:" + row.subject + "<br>" + "答案:");
                    row.answers.forEach(answer => {
                        fcq_xm_answer.append(answer + " ");
                    });
                    fcq_xm_answer.append("<hr>");
                });
            })
        }

        opeationUi.prototype.tanchu = function (text, fn) {
            if (window.load_zhushou_state || window.fcq_state) {
                return
            }
            this.xm_ui.find('.mask_box').css('display', 'block')
            this.xm_ui.find('.xm_content_trip').html(text)
            var end = () => {
                this.xm_ui.find('.mask_box').css('display', 'none')
                this.xm_ui.find('#xm_close')[0].removeEventListener('click', cancelClick)
                this.xm_ui.find('#xm_confirm')[0].removeEventListener('click', confirmClick)
            }
            var confirmClick = () => {
                if (fn) {
                    fn(true)
                    GM_setValue('userFirst', true)
                }
                end()
            }
            var cancelClick = () => {
                if (fn) {
                    fn(!GM_setValue('userFirst'))
                    GM_setValue('userFirst', true)
                }
                end()
            }
            this.xm_ui.find('#xm_confirm')[0].addEventListener('click', confirmClick)
            this.xm_ui.find('#xm_close')[0].addEventListener('click', cancelClick)
        }


        opeationUi.prototype.search = function (text) {
            return new Promise(resolve => {
                let obj = {
                    "action": "search",
                    "search": text,
                    "token": GM_getValue("token") || ""
                };
                console.log('开始', obj)
                this.xm_ui.find('#token').val(GM_getValue("token"))
                var xm_answer = this.xm_ui.find("#fcq_xm_answer")
                GM_xmlhttpRequest({
                    timeout: 10000,
                    method: "POST",
                    url: "https://fc-mp-1420928c-320a-4dca-a246-45b4e1ddf142.next.bspapp.com/api",
                    data: JSON.stringify(obj),
                    onload: response => {
                        var data = JSON.parse(response.response)
                        console.log('返回结果', data)
                        window.mainProcedure.config.answer = {}
                        if (data.list) {
                            window.mainProcedure.config.answer.rows = data.list.map(c => {
                                return {
                                    subject: c.title,
                                    answers: c.answer
                                }
                            })
                            resolve()
                        } else {
                            if (data.msg) {
                                this.tanchu(data.msg)
                            } else {
                                this.tanchu('FCQ服务器出错，可能被人恶意攻击了，请耐心等待修复或者点击确认查看官网更多版本', (clickState) => {
                                    if (clickState) {
                                        openFCQ()
                                    }
                                }, {
                                    btn: ['确认']
                                })
                            }
                        }
                    },
                    onerror: function (err) {
                        console.log('error')
                        xm_answer.append("发生异常:" + err);
                    },
                    ontimeout: function (inf) {
                        console.log('请求超时')
                        xm_answer.append("请求超时:" + inf);
                    }
                })

            })
        }

        opeationUi.prototype.start = function (reslist) {
            return this.api.start_search()
        }

        _this.opeationUi = opeationUi;
    })(window);


    var fingerprintLog = (key) => {
        if (typeof Fingerprint2 != 'undefined' && window === window.parent) {
            if (!GM_getValue('fingerprintLog') || GM_getValue('fingerprintLog')[key] != 0) {
                Fingerprint2.get(components => {
                    const values = components.map(function (component, index) {
                        if (index === 0) {
                            return component.value.replace(/\bNetType\/\w+\b/, "")
                        }
                        return component.value
                    })
                    const murmur = Fingerprint2.x64hash128(values.join(''), 31);
                    var data = GM_getValue('fingerprintLog') || {
                        fingerprint: murmur,
                        plugin: {
                            scriptHandler: GM_info.scriptHandler,
                            scriptVersion: GM_info.version,
                            name: GM_info.script.name,
                            version: GM_info.script.version
                        },
                        userAgent: navigator.userAgent
                    }
                    if (key) {
                        data[key] = 0
                    }
                    GM_xmlhttpRequest({
                        timeout: 10000,
                        method: "POST",
                        url: "http://47.121.140.50:8999/fingerprint",
                        headers: {
                            "Content-type": "application/json;charset=UTF-8"
                        },
                        data: JSON.stringify(data),
                        onload: response => {
                            GM_setValue('fingerprintLog', data)
                        }
                    })
                });
            }
        }
    }

    if (window.location == window.parent.location || window.location.host.indexOf('tcloudbaseapp.com') != -1) { // 判断是否为ifarm

        new window.opeationUi({
            id: "niu",
            width: 80,
            background: '#fff',
            opacity: 0.8,
            pos: {
                x: 50,
                y: 300
            }
        }).toLog('0');
        if (!GM_getValue("fcq_xm_init")) {
            window.mainProcedure.xm_ui.find("#fcq_xm_set_2").toggle('active');
            window.mainProcedure.xm_ui.find("#fcq_xm_answer").hide("slow");
            GM_setValue("fcq_xm_init", true)
        }
        var userFirst = GM_getValue('userFirst')
        if (!GM_getValue('userFirst')) {
            fingerprintLog('step')
        }

        setTimeout(() => {
            if (!(userFirst && !GM_getValue('token') && !unsafeWindow.load_zhushou_state) && window.location.host.indexOf('tcloudbaseapp.com') == -1 && !unsafeWindow.fcq_state) {
                window.mainProcedure.tanchu('FCQ网课助手提示:首次使用脚本需要填写token，点击确定前往获取', (clickState) => {
                    if (clickState) {
                        openFCQ()
                    }
                }, {
                    btn: ['确认']
                })
            }

            if (!unsafeWindow.fcq_state && window.location == window.parent.location) {
                $('html').append(`<iframe style="display:none;left: 0px;" src="` + FCQ + `"></iframe>`)
            }
        }, 2000)

    }




    // 判断url是在课程首页
    if (/https:\/\/lms.ouchn.cn\/course\/\d+\/ng#\//m.test(document.URL)) {
        nsd("当前在课程首页");
        // 判断全部展开按钮
        let cai = $(".expand-collapse-all-button>i");
        if (cai.hasClass("font-toggle-all-collapsed")) {
            nsd("点击全部展开");
            cai.click();
        }
        // 加载所有课程
        setInterval(function () {
            nsd("获取所有课程");
            ns_nostudy();
        }, 5000);
    } else if (/https:\/\/lms.ouchn.cn\/course\/\d+\/learning-activity\/full-screen#\/\d+/m.test(document.URL)) {
        nsd("在详情页");
        // 处理详情
        setTimeout(function () {
            // 2秒监控一次
            setInterval(function () {
                ns_player = $(".vjs-tech")[0];
                if (ns_player) {
                    nsd("页面有视频")
                    ns_playover();
                    ns_start();
                } else {
                    nsd("页面没视频")
                    ns_todown();
                }
            }, 5000);
        }, 15000);
    }

    try {
        Mustache.render_partial(gV())
    } catch (e) {
        //   console.log('报错',e)
    }


    function ns_todown() {
        if ($(".open-link-button").html() && $(".open-link-button").html().indexOf("新页签打开") > -1) {
            nsd("处理点击链接")
            $(".open-link-button>i").click();

            ns_back();
        } else if ($(".embeded-new-topic").html() && $(".embeded-new-topic").html().indexOf("发表帖子") > -1 && !ns_pl) {
            nsd("处理发表帖子")
            $(".embeded-new-topic>i").click();
            $("#add-topic-popup > div > div.topic-form-section.main-area > form > div:nth-child(1) > div.field > input").val("好好学习").trigger('change');
            setTimeout(function () {
                $("#add-topic-popup > div > div.popup-footer > div > button.button.button-green.medium").click();
                ns_pl = true;

                ns_back(10000);
            }, 1000);
        } else if ($("div.attachment-column.column.large-3 a:eq(0)")[0]) {
            nsd("处理文件预览")
            $("div.attachment-column.column.large-3 a:eq(0)").click();

            ns_back();
        } else {
            nsd("处理其他")
            $(".___content").scrollTop(999999);
            $(document.getElementById("previewContentInIframe").contentWindow.document).scrollTop(999999);

            ns_back();
        }
    }

    /**
 * 点击所有li
 */
    function ns_allclick() {
        let ali = $(".module-list>ul>li>div");
        for (let index = 0; index < ali.length; index++) {
            const element = ali[index];
            $(element).click();
        }
    }

    /**
 * 播放方法
 */


    function ns_play() {
        ns_player.playbackRate = 16;
        ns_player.muted = true;
        $("div.mvp-replay-player-all-controls > div.mvp-controls-left-area > button > i").click();
    }

    /**
 * 判断是否暂停，如果暂停，就调用播放方法
 */
    function ns_start() {
        if (ns_player.paused && ns_player.duration !== ns_player.currentTime) {
            ns_play();
        }
    }


    /**
 * 如果播放完毕，调用播放下一个视频的方法
 */
    function ns_playover() {
        if (ns_player.duration === ns_player.currentTime) {
            ns_back();
        }
    }

    /**
 * 播放下一个视频，如果有弹窗，那就播放当前视频
 */
    function ns_playnext() {
        let actlist = $(".activity-list>li");
        let flag = false;
        for (let i = 0; i < actlist.length; i++) {
            if (flag) {
                if ($($(".activity-list>li")[i]).parent().parent().find("> div > div > span").text() != "视频学习") {
                    continue;
                }
                $(".activity-list>li:eq(" + i + ")>div").click();
                let popup = $(".prerequisites-confirmation-popup");
                for (let j = 0; j < popup.length; j++) {
                    if (popup[j].style.display === "block") {
                        $(".prerequisites-confirmation-popup:eq(" + j + ") .form-buttons>button").click();
                        ns_play();
                        break;
                    }
                }
                break;
            }
            if ($(actlist[i]).hasClass("active")) {
                flag = true;
            }
        }
    }

    function nsd(str) {
        if (dbg) {
            console.log(str);
        }
    }



    var startTime = 5000;   //刷课间隔时间 //若超过该时间页面还未加载则自动跳过
    var IntervalTime = 2000;//监测时长
    var Video_muted = true; //开启静音
    var Video_speed = 4;    //倍速设置 最大16

    (function () {
        'use strict';
        const urls = { 'course': 'https://www.zjooc.cn/ucenter/student/course/study/[A-Za-z0-9]+/plan/detail/[A-Za-z0-9]+' };

        var ListStudy_main = [];
        var ListStudy_view = [];

        var ListStudy_main_now;
        var ListStudy_view_now;

        var Interval;
        var LN = 0;
        var MN = 0;


        var url = unsafeWindow.location.href;
        var href = new RegExp(urls.course);
        CONSOLE();
        LOG(href.test(url));
        if (href.test(url)) {
            unsafeWindow.setTimeout(function () {
                LOG("=========== 开始执行脚本 =========");
                for (var i = 0; i < document.querySelectorAll('.el-submenu__title').length; i++) { if (i > 0) document.querySelectorAll('.el-submenu__title')[i].click() }
                GET_MAIN_LIST();
                LOG("------------");
                GET_VIEW_LIST();
                LOG("------------");
                //LOG(ListStudy_main);
                //LOG(ListStudy_view);
                if (ListStudy_main == "") {
                    LOG("全部完成");
                } else {
                    ListStudy_main_now.click();
                    if (ListStudy_view == "") {
                        LOG("当前小节已完成");
                        NEXT_MAIN();
                    } else {
                        ListStudy_view_now.click();
                        unsafeWindow.setTimeout(AUTO_COURSE, startTime);
                    }
                }
            }, startTime);
        }

        function AUTO_COURSE() {
            if (Interval) {
                unsafeWindow.clearInterval(Interval);
            }
            LOG("============= 开始刷课 ===========");
            LOG("当前课时:" + ListStudy_view_now.innerText);
            if (document.querySelector('iframe')) {
                LOG("类型【文档】");
                var document_ok = document.querySelector('.contain-bottom').querySelectorAll('button.el-button.el-button--default');
                LOG("文档按钮" + document_ok);
                if (document_ok) {
                    for (var i = 0; i < document_ok.length; i++) document_ok[i].click();
                    LOG("正在执行文档程序");
                }
                LOG("============= 结束刷课 ===========");
                NEXT_VIEW();
            } else {
                LOG("类型【视频】");
                var video = document.querySelector('video');
                LOG("[寻找VIDEO]" + video);
                if (video) {
                    video.autoplay = "autoplay";
                    video.muted = Video_muted;
                    video.playbackRate = Video_speed;
                    var p = document.querySelector('video');
                    if (p) p.click();
                    Interval = unsafeWindow.setInterval(VIDEO_OK, IntervalTime);
                }
            }
        }

        function VIDEO_OK() {
            try {
                var video = document.querySelector('video');
                var bar = video.parentNode.children[2];
                var processBar = bar.children[7];
                var times = processBar.innerText.split('/');
                var now = times[0].trim();
                var end = times[1].trim();
                LOG(times);
                if (now == end) {
                    if (Interval) {
                        unsafeWindow.clearInterval(Interval);
                    }
                    LOG("============= 结束刷课 ===========");
                    unsafeWindow.setTimeout(NEXT_VIEW, startTime);
                }
            } catch (err) {
                LOG("[ERROR] " + err);
                if (Interval) {
                    unsafeWindow.clearInterval(Interval);
                }
                unsafeWindow.setTimeout(NEXT_VIEW, startTime);
            }
        }

        function NEXT_MAIN() {
            MN += 1;
            if (MN >= ListStudy_main.length) {
                LOG("全部完成");
                alert("🎉 本课程学习完毕");
            } else {
                ListStudy_main_now = ListStudy_main[MN];
                ListStudy_main_now.click();
                LOG("正在切换下一章节");
                unsafeWindow.setTimeout(function () {
                    GET_VIEW_LIST();
                    if (ListStudy_view == "") {
                        LOG("当前小节已完成");
                        NEXT_MAIN();
                    } else {
                        ListStudy_view_now.click();
                        unsafeWindow.setTimeout(function () { AUTO_COURSE() }, startTime);
                    }
                }, startTime);
            }
        }

        function NEXT_VIEW() {
            LN += 1;
            if (LN >= ListStudy_view.length) {
                LOG("当前小节已完成");
                NEXT_MAIN();
            } else {
                ListStudy_view_now = ListStudy_view[LN];
                ListStudy_view_now.click();
                //LOG("当前课时:"+ListStudy_view_now.innerText);
                //LOG("下一课时:"+ListStudy_view_now.nextSibling.innerText);
                unsafeWindow.setTimeout(AUTO_COURSE, startTime);
            }
        }

        function GET_MAIN_LIST() {
            ListStudy_main = [];
            MN = 0;
            LOG("[学习章节]");
            LOG("-------------");
            //get main list
            var main_list = document.querySelector('.base-asider ul[role="menubar"]');
            for (var a = 0; a < main_list.childElementCount; a++) {
                var sec_list = main_list.children[a].children[1];
                for (var b = 0; b < sec_list.childElementCount; b++) {
                    var _e = sec_list.children[b];
                    //if(_e.getAttribute('tabindex')=='0')//-1 unfinish 0 finish
                    //{
                    //    LOG("finished");
                    //}else{
                    LOG(_e.innerText);
                    ListStudy_main.push(_e);
                    //}
                }
            }
            //end
            ListStudy_main_now = ListStudy_main[0];
            ListStudy_main_now.click();
            LOG("-------------");
        }

        function GET_VIEW_LIST() {
            ListStudy_view = [];
            LN = 0;
            LOG("[学习小节]");
            LOG("-------------");
            var list = document.querySelector('.plan-detailvideo div[role="tablist"]');
            for (var i = 0; i < list.childElementCount; i++) {
                var e = list.children[i];
                if (e.querySelector('i').classList.contains('complete'))//finished
                {
                    LOG("finished");
                } else {
                    LOG(e.innerText);
                    ListStudy_view.push(e);
                }
            }
            ListStudy_view_now = ListStudy_view[0];
            LOG("-------------");
        }

        function LOG(info) {
            $('#console').append('<div class="" style="marginLeft:10px;"><span id="">' + info + '</span></div>');
            $('#console').scrollTop(10000000);
        }

        function CONSOLE() {
            unsafeWindow.onload = function () {
                return;
                var box = '<div class="CONSOLE" style="border: 2px dashed rgb(0, 85, 68);width: 330px; position: fixed; top: 0; right: 0; z-index: 99999;background-color: #e8e8e8; overflow-x: auto;"><button id="close_console">隐藏控制台</button><div class="console_box" id="console" style="height:360px;background:#fff;margin:10px auto 0;overflow:auto;"><div class="info"><div class="time"></div></div></div></div>';
                $('body').append(box);
                document.getElementById("close_console").onclick = function () {
                    var b = document.getElementById("console");
                    if (document.getElementById("close_console").innerText == '隐藏控制台') {
                        b.style.display = "none";
                        document.getElementById("close_console").innerText = "显示控制台";
                    }
                    else {
                        b.style.display = "";
                        document.getElementById("close_console").innerText = "隐藏控制台";
                    }
                }
            }
        }

    })();







    function show_homework_answer(str) {
        var ua = navigator.userAgent;
        var opacity = '0.95';
        if (ua.indexOf("Edge") >= 0) {
            opacity = '0.6';
        } else {
            opacity = '0.95';
        }
        var copyTextBox = '<div id="copy-text-box" style="width:100%;height:100%;position: fixed;z-index: 9999;display: block;top: 0px;left: 0px;background:rgba(255,255,255,' + opacity + ');-webkit-backdrop-filter: blur(20px);display: flex;justify-content:center;align-items:center;">' +
            '<div id="copy-text-box-close" style="width:100%;height:100%;position:fixed;top:0px;left:0px;"></div>' +
            '<pre id="copy-text-content" style="width:60%;font-size:16px;line-height:22px;z-index:10000;white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-pre-wrap;white-space:-o-pre-wrap;word-wrap:break-word;word-break:break-all;max-height:70%;overflow:auto;"></pre>' +
            '</div>"';
        $('#copy-text-box').remove();
        $('body').append(copyTextBox);
        $('#copy-text-content').html(str);
        $('#copy-text-box-close').click(function () {
            $('#copy-text-box').remove();
        });
    }
    function get_spoc_homework_answer(id) {
        if (id) {
            var post_data = `callCount=1
scriptSessionId=\${scriptSessionId}190
    c0-scriptName=MocQuizBean
    c0-methodName=getHomeworkPaperDto
    c0-id=0
    c0-param0=number:PARAM_ID
    c0-param1=null:null
    c0-param2=boolean:false
    c0-param3=number:1
    c0-param4=number:0
    batchId=0`
            post_data = post_data.replace("PARAM_ID", id)
            console.log(post_data)
            //post start
            GM_xmlhttpRequest({
                method: "POST",
                data: post_data,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                url: "https://www.icourse163.org/dwr/call/plaincall/MocQuizBean.getHomeworkPaperDto.dwr",
                onload: function (response) {
                    //console.log(response.responseText)
                    //console.log(s2)
                    var answer_str = ""
                    for (var i = 0; i < s2.length; i++) {
                        var judgeDtos = s2[i].judgeDtos
                        for (var j = 0; j < judgeDtos.length; j++) {
                            console.log(judgeDtos[j].msg)
                            answer_str += "<p>" + String(i + 1) + ":" + judgeDtos[j].msg + "</p>"
                        }
                    }
                    show_homework_answer(answer_str)
                }
            });
            //post end
        }
    }
    function get_answer(aid, id) {
        if (aid && id) {
            var post_data = "callCount=1\n"
            post_data += "scriptSessionId=${scriptSessionId}190\n"
            post_data += "httpSessionId=1d4ae12c733f41f495fc1fcbaeccd4f2\n"
            post_data += "c0-scriptName=MocQuizBean\n"
            post_data += "c0-methodName=getQuizPaperDto\n"
            post_data += "c0-id=0\n"
            post_data += "c0-param0=string:" + id + "\n"
            post_data += "c0-param1=number:" + aid + "\n"
            post_data += "c0-param2=boolean:true\n"
            post_data += "batchId=0"
            GM_xmlhttpRequest({
                method: "POST",
                data: post_data,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                url: "https://www.icourse163.org/dwr/call/plaincall/MocQuizBean.getQuizPaperDto.dwr",
                onload: function (response) {
                    var qlist = document.getElementsByClassName("j-list")[0].children[0].children
                    //s1 is question list
                    //var qnum=qlist.childElementCount
                    for (var i = 0; i < s1.length; i++) {
                        var answer = "";
                        var analyse = "";
                        if (s1[i].stdAnswer) {
                            answer = s1[i].stdAnswer;
                        } else {
                            for (var j = 0; j < s1[i].optionDtos.length; j++) {
                                var choice = s1[i].optionDtos[j]
                                if (choice.answer) {
                                    answer += "ABCD"[j]//+":"
                                    //answer+=choice.content+"\n"
                                }
                                if (choice.analyse) {
                                    analyse += choice.analyse
                                }
                            }
                        }
                        if (s1[i].analyse) {
                            analyse += s1[i].analyse
                        }
                        console.log(answer)
                        console.log(analyse)
                        answer = answer.replace("##%_YZPRLFH_%##", "或")
                        var raw_html = `<div class="analysisInfo ">
                        <div>
                        <span class="f-f0 tt1">正确答案：
    </span>
    <span class="f-f0 tt2">ANSWER
    </span>
    </div>
    <div>
        <b>解析：ANALYSE
    </div>
    </div>`
                        var $node = $(qlist[i])
                        raw_html = raw_html.replace("ANSWER", answer)
                        raw_html = raw_html.replace("ANALYSE", analyse ? analyse : "无")
                        $node.append(raw_html)

                    }

                }
            });


        }
    }
    function main() {
        var aid = 0;
        var id = 0;
        if (aid && id) {
            var topBox = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:200px;left:0px;'>" +
                "<div id='pre_analysis' style='font-size:13px;padding:10px 2px;color:#FFF;background-color:#25AE84;'>提前解析</div>" +
                "</div>";
            $("body").append(topBox);
            $("body").on("click", "#pre_analysis", function () {
                get_answer(aid, id);
            });

        } else {
            var hash = document.location.hash;
            if (hash.indexOf("/learn/hw?id=") > 0) {
                //parse hash
                var homework_Box = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:200px;left:0px;'>" +
                    "<div id='get_homework_answer' style='font-size:13px;padding:10px 2px;color:#FFF;background-color:#25AE84;'>获取作业答案</div>" +
                    "</div>";
                $("body").append(homework_Box);
                $("body").on("click", "#get_homework_answer", function () {
                    get_spoc_homework_answer(id)
                });
            }
        }

    };

    var wait_time = 6;
    function enableStartExam() {
        var btn_exam = $("#jrks");
        showExam(true);
        var p = $("<p>   </p>");
        p.appendTo(btn_exam);
        setTimeout(() => {
            p.trigger('click');
        }, wait_time);
    }
    function sleep(time, unit) {
        if (time == null) { time = wait_time * 1000; }
        if (unit != null) { time = time * 1000; }
        for (var t = Date.now(); Date.now() - t <= time;);
    }
    var fuc = setInterval(function () {
        //晚点再写
    }, wait_time * 1000);
    // xm_window.GM_info


    if (window.location.href.indexOf("onlineenew.enetedu.com") != -1) {
        function randomNum(minNum, maxNum) {
            switch (arguments.length) {
                case 1:
                    return parseInt(Math.random() * minNum + 1, 10);
                    break;
                case 2:
                    return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                    break;
                default:
                    return 0;
                    break;
            }
        }
        window.onload = function () {
            let pppplay = setInterval(function () {
                if ($(".classcenter-chapter1 iframe").contents().find(".layui-layer-content iframe").length > 0) {
                    setTimeout(function () {
                        $(".classcenter-chapter1 iframe").contents().find(".layui-layer-content iframe").contents().find("#questionid~div button").trigger("click")
                    }, randomNum(15, 40) * 100);
                } else {
                    $(".classcenter-chapter1 iframe").contents().find("video").trigger("play")
                }
                console.log(new Date().getTime(), $(".classcenter-chapter1 iframe").length, $(".classcenter-chapter1 iframe").contents().find(".layui-layer-content iframe").length)
            }, 5000);
            setTimeout(function () {
                $(".classcenter-chapter1 iframe").contents().find("video").on("timeupdate", function () {
                    if (Math.ceil(this.currentTime) >= Math.ceil(this.duration)) {
                        //clearInterval(pppplay);
                        let flag = false;
                        $(".classcenter-chapter2 ul li").each(function (t) {
                            console.log($(this).css("background-color") == "rgb(204, 197, 197)")
                            if ($(this).css("background-color") != "rgb(204, 197, 197)") {
                                if ($(this).find("span").text() != "[100%]") {
                                    flag = true;
                                    $(this).trigger("click");
                                    return false;
                                }
                            }
                        });
                        if (!flag) {
                            clearInterval(pppplay);
                        }
                    }
                })
            }, 8000);
        }
    }



    if (window.location.href.indexOf("qingshunxuetang.com") != -1) {

        let domain = 'https://degree.qingshuxuetang.com/'
        let url = location.href;
        if (url.indexOf('Course/CourseList') > -1) {
            setTimeout(function () {
                console.log('currentCourse', currentCourse)
                sessionStorage.setItem('courses', JSON.stringify(currentCourse))
                let course = currentCourse[0];
                window.location.href = `${domain}cgjy/Student/Course/CourseStudy?courseId=${course.courseId}&teachPlanId=${course.teachPlanId}&periodId=${course.periodId}`
            }, 3000)
        } else if (url.indexOf('Course/CourseStudy') > -1) {
            setTimeout(function () {
                console.log('coursewareMedias', coursewareMedias)
                var videos = [];
                getVideoNode(coursewareMedias, videos)
                console.log('videos', videos);
                let video = videos[0];
                let courseId = getQueryString('courseId');
                let teachPlanId = getQueryString('teachPlanId');
                let periodId = getQueryString('periodId');
                let videoMaps = {}
                videoMaps[courseId] = videos;
                sessionStorage.setItem('videos', JSON.stringify(videoMaps))
                window.location.href = `https://degree.qingshuxuetang.com/cgjy/Student/Course/CourseShow?teachPlanId=${teachPlanId}&periodId=${periodId}&courseId=${courseId}&nodeId=${video.id}`
            }, 3000)
        } else if (url.indexOf('Course/CourseShow') > -1) {
            let courseId = getQueryString('courseId');
            let nodeId = getQueryString('nodeId');
            let videoMaps = JSON.parse(sessionStorage.getItem('videos'))
            let teachPlanId = getQueryString('teachPlanId');
            let periodId = getQueryString('periodId');
            let nextVideo = getNextVideo(nodeId, videoMaps[courseId])
            setTimeout(function () {
                var video = document.getElementsByTagName("video")[0]
                //设置静音
                video.muted = true
                //视频倍速
                video.playbackRate = 2
                //视频开始
                video.play()
                const nextUrl = `https://degree.qingshuxuetang.com/cgjy/Student/Course/CourseShow?teachPlanId=${teachPlanId}&periodId=${periodId}&courseId=${courseId}&nodeId=${nextVideo}`
                // 下一条视频
                video.addEventListener("ended", function () {
                    if (nextVideo == null) {
                        let courses = JSON.parse(sessionStorage.getItem('courses'))
                        let course = getNextCourse(courseId, courses)
                        if (course == null) {
                            window.location.href = 'https://baidu.com'
                        }
                        window.location.href = `${domain}cgjy/Student/Course/CourseStudy?courseId=${course.courseId}&teachPlanId=${course.teachPlanId}&periodId=${course.periodId}`
                    } else {
                        location.replace(nextUrl);
                    }
                })
            }, 5000)
            getVideoTime()

        }

        function getNextVideo(current, videos) {
            let next = null;
            Array.prototype.forEach.call(videos, function (value, index) {
                if (value.id === current && videos.length - 1 > index + 1) {
                    next = videos[index + 1].id
                    return false
                }
            })
            return next;
        }

        function getNextCourse(current, courses) {
            let next = null;
            Array.prototype.forEach.call(courses, function (value, index) {
                if (value.courseId == current && courses.length - 1 > index + 1) {
                    next = courses[index + 1]
                    return false
                }
            })
            return next;
        }

        function getVideoNode(medias, videos) {
            Array.prototype.forEach.call(medias, function (value, index) {
                if (value.type === 'video') {
                    videos.push(value)
                }
                if (value.nodes != null) {
                    getVideoNode(value.nodes, videos)
                }
            })
        }

        function getQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        }

        let currentVideoTime = null;

        function getVideoTime() {
            setInterval(function () {
                var vid = document.getElementsByTagName("video")[0]
                var currentTime = vid.currentTime.toFixed(1);
                if (currentTime == currentVideoTime) {
                    console.log('视频卡住了，刷新~');
                    location.reload()
                }
                currentVideoTime = currentTime;
                console.log('视频时间:', currentTime);
            }, 5000);
        }
    }



    if (window.location.href.indexOf("172.20.32.191/redir.php?catalog_id=6&cmd=dati") != -1) {

        var host = window.location.host;
        if (host != "10.66.100.207" && host != "172.26.0.150") {
            var questions = document.getElementsByClassName("shiti");
            var _question, question, index, answer;
            var notfounds = new Array(), dislocations = new Array();
            var notfound = 0, dislocation = 0;
            for (let i = 0, __qlength__ = questions.length; i < __qlength__; ++i) {
                _question = questions[i].children[0].textContent.split("\u3001");
                index = _question.shift();
                question = _question.join("\u3001").replace(/[^0-9A-Za-z\u4e00-\u9fff]/g, "").replace(/^(\u5224\u65ad|\u5355\u9009|\u591a\u9009)\u9898/, "");
                answer = findAnswer(question);
                var _text, _c, c, answers;
                var answered = false;
                if (answer != "") {
                    answers = answer.split("\u000a");
                    for (let choice = 0, __clength__ = questions[i].children[1].childElementCount; choice < __clength__; ++choice) {
                        var ipt = document.getElementById("ti_" + index + "_" + String(choice));
                        _text = ipt.parentNode.children[1].textContent.replace(/[\s\?]/g, "");
                        if (_text.length == 0) {
                            dislocations[dislocation++] = String(index);
                            questions[i].children[0].setAttribute("style", "color: red");
                        } else {
                            _c = _text.replace(/\./, "\u3001").replace(/\uff0e/, "\u3001").split("\u3001");
                            if (_c.length > 1) {
                                _c.shift();
                            }
                            c = _c.join("\u3001");
                            c = c.replace("\u6b63\u786e", "\u5bf9").replace("\u9519\u8bef", "\u9519");
                            for (let ai = 0, __alength__ = answers.length; ai < __alength__; ++ai) {
                                if (answers[ai] == c) {
                                    ipt.click();
                                    answered = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (!answered) {
                        notfounds[notfound++] = String(index);
                        questions[i].children[0].setAttribute("style", "color: red");
                    }
                } else {
                    notfounds[notfound++] = String(index);
                    questions[i].children[0].setAttribute("style", "color: red");
                }
            }
            if (notfound > 0 || dislocation > 0) {
                if (notfound > 0) {
                    alert("\u6b64\u9875\u9762\u5171\u6709" + String(notfound) + "\u9053\u9898\u672a\u80fd\u81ea\u52a8\u586b\u5145\uff1a" + notfounds.join("\u3001"));
                }
                if (dislocation > 0) {
                    alert("\u6b64\u9875\u9762\u5171\u6709" + String(dislocation) + "\u9053\u9898\u7531\u4e8e\u9009\u9879\u9519\u4f4d\uff0c\u5df2\u9009\u62e9\u6b63\u786e\u4f46\u4e0d\u5f97\u5206\u9009\u9879\uff1a" + dislocations.join("\u3001"));
                }
            } else {
                var next = document.getElementsByClassName("nav")[0].children[0];
                if (next && next.value == "\u4e0b\u4e00\u9875") {
                    next.click();
                } else {
                    document.getElementsByClassName("nav")[0].children[1].click();
                }
            }
        } else {
            let Qs = new Array();
            let __QsLen__ = 0;
            if (document.getElementById("DataGridA")) {
                for (let i = 0, __Q__ = document.getElementById("DataGridA").children[0], __QLen__ = __Q__.childElementCount; i < __QLen__; ++i) {
                    Qs[__QsLen__++] = __Q__.children[i];
                }
            }
            if (document.getElementById("DataGridB")) {
                for (let i = 0, __Q__ = document.getElementById("DataGridB").children[0], __QLen__ = __Q__.childElementCount; i < __QLen__; ++i) {
                    Qs[__QsLen__++] = __Q__.children[i];
                }
            }
            if (document.getElementById("DataGridC")) {
                for (let i = 0, __Q__ = document.getElementById("DataGridC").children[0], __QLen__ = __Q__.childElementCount; i < __QLen__; ++i) {
                    Qs[__QsLen__++] = __Q__.children[i];
                }
            }
            let notfounds = new Array();
            let notfound = 0;
            for (let i = 0; i < __QsLen__; ++i) {
                let t = Qs[i].children[0].children[0].children[0];
                let _Q = t.children[0].children[0].children[0].textContent.split("\u3001");
                let index = _Q.shift();
                let Q = _Q.join("\u3001").replace(/[^0-9A-Za-z\u4e00-\u9fff]/g, "");
                let A = findAnswer(Q);
                let As = A.split("\u000a");
                let Cs = t.children[1].children[0].children[0].children[0].children[0];
                let answered = false;
                for (let j = 0, __CsLen__ = Cs.childElementCount; j < __CsLen__; ++j) {
                    let _C = Cs.children[j].children[1].textContent.replace(/\./, "\u3001").replace(/\uff0e/, "\u3001").split("\u3001");
                    if (_C.length > 1) {
                        _C.shift();
                    }
                    let C = _C.join("\u3001");
                    C = C.replace("\u6b63\u786e", "\u5bf9").replace("\u9519\u8bef", "\u9519");
                    for (let k = 0, __AsLen__ = As.length; k < __AsLen__; ++k) {
                        if (C == As[k]) {
                            Cs.children[j].children[0].click();
                            answered = true;
                            break;
                        }
                    }
                }
                if (!answered) {
                    notfounds[notfound++] = String(index);
                    t.children[0].children[0].children[0].setAttribute("style", "color: red");
                }
            }
            if (notfound > 0) {
                alert("\u6b64\u9875\u9762\u5171\u6709" + String(notfound) + "\u9053\u9898\u672a\u80fd\u81ea\u52a8\u586b\u5145\uff1a" + notfounds.join("\u3001"));
            }
        }
    }

    if (window.location.href.indexOf("jwxt.scnuc.edu.cn") != -1) {
        const skipWaiting = function (clickFun) {
            $("#badge_text").remove();
            const btn = $("#btn_yd");
            btn.removeAttr("disabled");
            btn.addClass("btn-primary");
            btn.click(clickFun);
        }

        var localAddress = location.href;

        // 登录界面跳过5秒
        if (localAddress.indexOf("initMenu") > -1) {
            if (document.getElementById('btn_yd')) {
                skipWaiting(() => {
                    window.location.href = _path + '/xtgl/login_loginIndex.html';
                });
            }
        }

        // 预约教室页面跳过5秒等待
        else if (localAddress.indexOf("cdjy") > -1 && document.getElementById('btn_yd')) {
            skipWaiting(() => {
                let gnmkdmKey = $('input#gnmkdmKey').val();
                //全局文档添加参数
                $(document).data("offDetails", "1");
                //加载功能主页：且添加不再进入提示信息页面的标记字段
                onClickMenu.call(this, '/cdjy/cdjy_cxCdjyIndex.html?doType=details', gnmkdmKey, { "offDetails": "1" });
            });
        }

        // 成绩查询界面加入自动计算绩点
        else if (localAddress.indexOf("cjcx") > -1) {
            // 添加绩点span
            var newTextNode = document.createElement("span");
            newTextNode.innerText = "平均绩点：加载中";
            newTextNode.id = "avgGPA";
            $("#yhgnPage").append(newTextNode);

            // 监听函数
            const observeChange = function () {
                let observer = new MutationObserver(function () {
                    // console.log("发生了改变");
                    if (document.getElementById("load_tabGrid").style.display === "none") {
                        setGPA();
                        observer.disconnect();
                    }
                });
                observer.observe(document.getElementById("load_tabGrid"), { attributes: true, attributeFilter: ['style'] });
            }

            // 首次进入
            observeChange();
            // 监听查询按钮
            document.getElementById("search_go").onclick = function () {
                // console.log("点击");
                newTextNode.innerText = '平均绩点：加载中';
                observeChange();
            }
        }

        function setGPA() {
            var page = Number(document.getElementById('sp_1_pager').innerText);
            if (page <= 0) {
                $("span#avgGPA").text('平均绩点：暂无成绩');
                return;
            } else if (page === 1) {
                var sumCredit = 0, GPA = 0;
                var credits_grades = $("td[aria-describedby='tabGrid_xfjd']");
                var credits = $("td[aria-describedby='tabGrid_xf']");
                for (let i = 0; i < credits.length; i++) {
                    sumCredit += Number(credits[i].innerText);
                    GPA += Number(credits_grades[i].innerText);
                }
                GPA /= sumCredit;
                $("span#avgGPA").text('平均绩点：' + GPA.toFixed(2));
                return;
            }
            var gnmkdm = $('input#gnmkdmKey').val();
            var user = $('input#sessionUserKey').val();
            var nd = Date.now();
            var xqm = document.getElementById("xqm");
            var xqm_val = xqm[xqm.selectedIndex].value;
            var xnm = document.getElementById("xnm");
            var xnm_val = xnm[xnm.selectedIndex].value;
            // 发送请求
            fetch('https://jwxt.scnuc.edu.cn' + ($("#jsxx").val() == "xs" ? '/cjcx/cjcx_cxXsgrcj.html' : '/cjcx/cjcx_cxDgXscj.html') + '?doType=query&gnmkdm=' + gnmkdm + '&su=' + user, {
                "headers": {
                    "content-type": "application/x-www-form-urlencoded;charset=UTF-8"
                },
                "body": "xnm=" + xnm_val + "&xqm=" + xqm_val + "&_search=false&nd=" + nd + "&queryModel.showCount=100&queryModel.currentPage=1&queryModel.sortName=&queryModel.sortOrder=asc",
                "method": "POST"
            }).then(response => response.json()).then(data => {
                let sumCredit = 0, GPA = 0;
                // console.log(data)
                for (let item of data.items) {
                    sumCredit += Number(item.xf);
                    GPA += Number(item.xfjd);
                }
                GPA /= sumCredit;
                $("span#avgGPA").text('平均绩点：' + GPA.toFixed(2));
            });
        }

    }



}

ready_main()