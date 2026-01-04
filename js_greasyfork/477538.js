// ==UserScript==
// @name                      FCQ全网自动答题器【刷课】【如果失效请加q群：399697149】
// @namespace                 http://tampermonkey.net
// @version                   4.1.73
// @description               支持【超星学习通/智慧树知到/U校园/【新|旧】职教云|智慧职教/中国大学慕课mooc/雨课堂v2/职教云/优慕课(THEOL 网络教学平台)/welearn/新国开(国家开放大学)/百万扩招/在浙学(浙江省高等学校在线开放课程共享平台)/双卫网继续教育/好大学/国家中小学智慧教育平台/国家智慧教育公共服务平台/爱学教云学院/考试星/优学院/学堂在线/新锦城/江苏开放大学/i学/智慧学习云平台/智多分/师学通/学起plus/正保云课堂/优课在线/ismart/华文慕课/赛事星/优师云/青岛市专业技术人员继续教育/微知库/学堂在线/广开网络教学平台/安徽省高职扩招/睿学(由于此平台含有多个网址，如果发现测试部分不能自动答题,请加群联系)】等平台答题，已配置的进入答题页面自动生效。支持可视化自定义配置答题（内有教程）->实现自动答题和表单填写😃，可上传自己的题库，自己题库搜索填写无需付费🧡，另可使用付费题库（内置），适用范围：无加密无检测平台。---2025/3/17全功能稳定可用（如有疑问或无法自动答题请加群反馈：399697149。）
// @author                    MeteorMo
// @match                     *://*/*
// @run-at                    document-start
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGGmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDEgNzkuYThkNDc1MywgMjAyMy8wMy8yMy0wODo1NjozNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI1LjAgKDIwMjMwODAxLm0uMjI2NSAzYTAwNjIzKSAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMi0wNy0yNFQwMDoyODoxNSswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjMtMDgtMjJUMDE6NTE6MjYrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjMtMDgtMjJUMDE6NTE6MjYrMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjkxY2Y1NWExLTZkZTEtYTk0NS1hMDk5LWY0MmNlNTQ5NGY2YiIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmYyYWZkOThmLTcyMDItMzE0Ni04M2FjLTJmOGY1YTkxZDk2MiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjgxYWIyODgwLWQxYTEtMDA0NC1iZGU3LTk5NDg4YWM0YjA2ZiI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ODFhYjI4ODAtZDFhMS0wMDQ0LWJkZTctOTk0ODhhYzRiMDZmIiBzdEV2dDp3aGVuPSIyMDIyLTA3LTI0VDAwOjI4OjE1KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjUuMCAoMjAyMzA4MDEubS4yMjY1IDNhMDA2MjMpICAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjkxY2Y1NWExLTZkZTEtYTk0NS1hMDk5LWY0MmNlNTQ5NGY2YiIgc3RFdnQ6d2hlbj0iMjAyMy0wOC0yMlQwMTo1MToyNiswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI1LjAgKDIwMjMwODAxLm0uMjI2NSAzYTAwNjIzKSAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PubJeqwAAARCSURBVDjLbVRrbBRlFD1q+kNDiESNihGDRkOiCVEMGB9ETGhMqn+wxsRgNGlNEBP0hxr1h6YGhIaSYMHW0naf3e1jW4sUSiPQatLS+ihgaal90FbazuzM7O5MZx+z232M985udyvy42R3vm/umXPvPfcCbSbgI7hVwC4ADpkQ5N9XCBWELjikOcICnNI5OJRK+l8CWzAb4yO4l4F24mCuWxBuo6ALFGRacBIa/Cbq/dlnhz8Lu3wZTYHX0LF0EyGT8YNbY8LyQtAqska/Rs//4AT9d0kFYifBrVTAkwI6iaODCZszQKtF+A4RmnlljEYmlMwDI9GNXfOJonu9sok6f+Hezu8s0keWDsBFHA4mdEcBl/5YXtXqVI8smrv6lk6ZpolkOoM3f9EO8VlBZe49FlKv70R9hAmpuE7p1/8RspIa0Twzn3hUiKYwriXRLy2vJVVpHL8pE451iYtwkDg4A1uyRaaLH0QTtTlUC+a+P8NVGVJnnzKwfyQKVuq4brx/Z41oWE2qE7Mx9lw9berbRKh8wwdF9KUNbUrftq5Q1Z4B/b2yAf3JK6EkEkTinDbw3JnQU65p427FyGDfb+H7S86pu575Kfj1+lbl9B2s0kZwCR1EKP/IqT3RGRy9pqVQP2mgZsLAYIBSJJT1LZVvPhn0ffx7uKx1Nr6uZyGBPUM63uhbwueXIhijmOLzWo9VBrs8SlaRB9Eomnc1SKp7Jr6D02LiY1PGxi2tykV8J5hHRqNlvrk4WmYMtM3GUXElYpWB3x0KJB9/0CndsEpgl0TAKw9ZcrkWxwRTiKbXC7HMQ9TNOCoXzEtq6mkO/ILU2KZimNFTFhFjXE89sNYuBTku13k/0KR0wpYzLDVjnVeR7/EqCr6dN6snY29xYCiRhpfUXaWarpDdiKQfWeOQpjkDuOSVjl/jUduftwxf8DQcnDd3XtB6ODCSzGAukoaDGnPoahSHCU3XDbzQHarCUaHgSe60K9BJKWtbrYcVT9GoFTX4kx1z8YfZf4PyMnrFZeylRrzco+LTPyLcZTzfHfrM+vhKnI1K5g7sJmMnAJs8kB+77wVz+8+q7y9K76vLEXxIRLORFA6PxVByXkXtRAweUljWr5daPsybW/ZTg8nYHTQuPn0THGLW3FTHD4b03X9Tp7+kRnwyHKHuxneU9mqvl/RquEiKx9QUPhoKb7Vm3ZZT51FL0MaT0kwD7SHY9XLYFyz3v9uvFw+TBym97ZvaAx5r45BXNzQr3ZUj0VfVRAZkozW3s4ATIte+0tqL7QQcJ7Jqgs0gYmkvf/W+FtnYfCp4dkWxRWjNt2jhxe7QyWdPB4dvs1neO0grjMhCtA8JqCOyWiak1L28hbWX0CCPo0bgPZjdJqs3C5+x72r9Ou2BUrIdbSuC71aEHrpwh3mdUQmkYiI5SugjTBAm6ayftnQdWpRSNASARiJw/5fwXxU4oNDCS+vgAAAAAElFTkSuQmCC
// @require      https://lib.baomitu.com/promise-polyfill/8.2.1/polyfill.min.js
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
// @antifeature               payment
// @antifeature               referral-link
// @certification             6889890f21821be17638089f
// @website                   https://soujiaoben.org/#/s?id=502025&host=greasyfork
// @downloadURL https://update.greasyfork.org/scripts/502025/FCQ%E5%85%A8%E7%BD%91%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%99%A8%E3%80%90%E5%88%B7%E8%AF%BE%E3%80%91%E3%80%90%E5%A6%82%E6%9E%9C%E5%A4%B1%E6%95%88%E8%AF%B7%E5%8A%A0q%E7%BE%A4%EF%BC%9A399697149%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/502025/FCQ%E5%85%A8%E7%BD%91%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%99%A8%E3%80%90%E5%88%B7%E8%AF%BE%E3%80%91%E3%80%90%E5%A6%82%E6%9E%9C%E5%A4%B1%E6%95%88%E8%AF%B7%E5%8A%A0q%E7%BE%A4%EF%BC%9A399697149%E3%80%91.meta.js
// ==/UserScript==



const HAS_GM = typeof GM !== "undefined";
const NEW_GM = ((scope, GM) => {
    // Check if running in Tampermonkey and if version supports redirect control
    if (
        GM_info.scriptHandler !== "Tampermonkey" ||
        compareVersions(GM_info.version, "5.3.2") < 0
    )
        return;

    // Backup original functions
    const GM_xmlhttpRequestOrig = GM_xmlhttpRequest;
    const GM_xmlHttpRequestOrig = GM.xmlHttpRequest;

    function compareVersions(v1, v2) {
        const parts1 = v1.split(".").map(Number);
        const parts2 = v2.split(".").map(Number);
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

        const { onload, onloadend, onerror, onabort, ontimeout, ...details } =
              odetails;

        // Set redirect to manual and handle redirects
        const handleRedirects = (initialDetails) => {
            const request = GM_xmlhttpRequestOrig({
                ...initialDetails,
                redirect: "manual",
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
                },
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
            if (typeof abort === "function") {
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

    const gopd = Object.getOwnPropertyDescriptor(GM, "xmlHttpRequest");
    if (gopd && gopd.configurable === false) {
        return {
            __proto__: GM,
            xmlHttpRequest: GM_xmlHttpRequestWrapper,
            xmlHttpRequestOrig: GM_xmlHttpRequestOrig,
        };
    } else {
        GM.xmlHttpRequest = GM_xmlHttpRequestWrapper;
        GM.xmlHttpRequestOrig = GM_xmlHttpRequestOrig;
    }
})(this, HAS_GM ? GM : {});

if (HAS_GM && NEW_GM) GM = NEW_GM;

if (
    typeof GM_xmlhttpRequest == "undefined" ||
    GM_info.scriptHandler == "stay"
) {
    alert(
        "由于兼容性问题，FCQ脚本不支持【油猴子(Greasemonkey)或Stay for Browser】插件使用,请使用【篡改猴/油猴(tampermonkey)】插件或【脚本猫(scriptcat)】插件安装此脚本,edge安装地址:https://microsoftedge.microsoft.com/addons/detail/%E7%AF%A1%E6%94%B9%E7%8C%B4/iikmkjmpaadaobahmlepeloendndfphd 其他浏览器安装教程:https://www.youxiaohou.com/zh-cn/crx.html?spm=1717453534064 如果反复提示此信息,请从插件中删除此脚本"
    );
    return;
}

try {
    new Function();
} catch (e) {
    alert(
        "FCQ脚本：由于兼容性问题，此网站需要配合【Allow CSP: Content-Security-Policy插件】使用，edge安装地址:https://microsoftedge.microsoft.com/addons/detail/allow-csp-contentsecuri/blbbcdoaelobkaloeplifnigplpbkmap,其他浏览器的插件下载地址:https://www.chajianxw.com/developer/51987.html 安装教程：https://www.youxiaohou.com/zh-cn/crx.html?spm=1717453534064 如果不需要脚本在此网站上运行，请关闭脚本"
    );
    return;
}

console.log("运行");
(function () {
    return;
    ("use strict");

    var __defProp = Object.defineProperty;
    var __defNormalProp = (obj, key, value) =>
    key in obj
    ? __defProp(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value,
    })
    : (obj[key] = value);
    var __publicField = (obj, key, value) => {
        __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
        return value;
    };
    /*! Element Plus Icons Vue v2.1.0 */
    var export_helper_default = (sfc, props) => {
        let target = sfc.__vccOpts || sfc;
        for (let [key, val] of props) target[key] = val;
        return target;
    };
    var document_remove_vue_vue_type_script_lang_default = {
        name: "DocumentRemove",
    };
    var _hoisted_189 = {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024",
    },
        _hoisted_289 = /* @__PURE__ */ vue.createElementVNode(
            "path",
            {
                fill: "currentColor",
                d: "M805.504 320 640 154.496V320h165.504zM832 384H576V128H192v768h640V384zM160 64h480l256 256v608a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32zm192 512h320v64H352v-64z",
            },
            null,
            -1
            /* HOISTED */
        ),
        _hoisted_388 = [_hoisted_289];
    function _sfc_render89(_ctx, _cache, $props, $setup, $data, $options) {
        return (
            vue.openBlock(), vue.createElementBlock("svg", _hoisted_189, _hoisted_388)
        );
    }
    var document_remove_default = /* @__PURE__ */ export_helper_default(
        document_remove_vue_vue_type_script_lang_default,
        [
            ["render", _sfc_render89],
            ["__file", "document-remove.vue"],
        ]
    );
    var full_screen_vue_vue_type_script_lang_default = {
        name: "FullScreen",
    };
    var _hoisted_1118 = {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024",
    },
        _hoisted_2118 = /* @__PURE__ */ vue.createElementVNode(
            "path",
            {
                fill: "currentColor",
                d: "m160 96.064 192 .192a32 32 0 0 1 0 64l-192-.192V352a32 32 0 0 1-64 0V96h64v.064zm0 831.872V928H96V672a32 32 0 1 1 64 0v191.936l192-.192a32 32 0 1 1 0 64l-192 .192zM864 96.064V96h64v256a32 32 0 1 1-64 0V160.064l-192 .192a32 32 0 1 1 0-64l192-.192zm0 831.872-192-.192a32 32 0 0 1 0-64l192 .192V672a32 32 0 1 1 64 0v256h-64v-.064z",
            },
            null,
            -1
            /* HOISTED */
        ),
        _hoisted_3117 = [_hoisted_2118];
    function _sfc_render118(_ctx, _cache, $props, $setup, $data, $options) {
        return (
            vue.openBlock(),
            vue.createElementBlock("svg", _hoisted_1118, _hoisted_3117)
        );
    }
    var full_screen_default = /* @__PURE__ */ export_helper_default(
        full_screen_vue_vue_type_script_lang_default,
        [
            ["render", _sfc_render118],
            ["__file", "full-screen.vue"],
        ]
    );
    var minus_vue_vue_type_script_lang_default = {
        name: "Minus",
    };
    var _hoisted_1169 = {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024",
    },
        _hoisted_2169 = /* @__PURE__ */ vue.createElementVNode(
            "path",
            {
                fill: "currentColor",
                d: "M128 544h768a32 32 0 1 0 0-64H128a32 32 0 0 0 0 64z",
            },
            null,
            -1
            /* HOISTED */
        ),
        _hoisted_3168 = [_hoisted_2169];
    function _sfc_render169(_ctx, _cache, $props, $setup, $data, $options) {
        return (
            vue.openBlock(),
            vue.createElementBlock("svg", _hoisted_1169, _hoisted_3168)
        );
    }
    var minus_default = /* @__PURE__ */ export_helper_default(
        minus_vue_vue_type_script_lang_default,
        [
            ["render", _sfc_render169],
            ["__file", "minus.vue"],
        ]
    );
    var position_vue_vue_type_script_lang_default = {
        name: "Position",
    };
    var _hoisted_1203 = {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024",
    },
        _hoisted_2203 = /* @__PURE__ */ vue.createElementVNode(
            "path",
            {
                fill: "currentColor",
                d: "m249.6 417.088 319.744 43.072 39.168 310.272L845.12 178.88 249.6 417.088zm-129.024 47.168a32 32 0 0 1-7.68-61.44l777.792-311.04a32 32 0 0 1 41.6 41.6l-310.336 775.68a32 32 0 0 1-61.44-7.808L512 516.992l-391.424-52.736z",
            },
            null,
            -1
            /* HOISTED */
        ),
        _hoisted_3202 = [_hoisted_2203];
    function _sfc_render203(_ctx, _cache, $props, $setup, $data, $options) {
        return (
            vue.openBlock(),
            vue.createElementBlock("svg", _hoisted_1203, _hoisted_3202)
        );
    }
    var position_default = /* @__PURE__ */ export_helper_default(
        position_vue_vue_type_script_lang_default,
        [
            ["render", _sfc_render203],
            ["__file", "position.vue"],
        ]
    );
    var setting_vue_vue_type_script_lang_default = {
        name: "Setting",
    };
    var _hoisted_1231 = {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024",
    },
        _hoisted_2231 = /* @__PURE__ */ vue.createElementVNode(
            "path",
            {
                fill: "currentColor",
                d: "M600.704 64a32 32 0 0 1 30.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0 1 34.432 15.36L944.32 364.8a32 32 0 0 1-4.032 37.504l-77.12 85.12a357.12 357.12 0 0 1 0 49.024l77.12 85.248a32 32 0 0 1 4.032 37.504l-88.704 153.6a32 32 0 0 1-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 0 1 600.704 960H423.296a32 32 0 0 1-30.464-22.208L357.696 828.48a351.616 351.616 0 0 1-42.56-24.64l-112.32 24.256a32 32 0 0 1-34.432-15.36L79.68 659.2a32 32 0 0 1 4.032-37.504l77.12-85.248a357.12 357.12 0 0 1 0-48.896l-77.12-85.248A32 32 0 0 1 79.68 364.8l88.704-153.6a32 32 0 0 1 34.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 0 1 423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088-24.512 11.968a294.113 294.113 0 0 0-34.816 20.096l-22.656 15.36-116.224-25.088-65.28 113.152 79.68 88.192-1.92 27.136a293.12 293.12 0 0 0 0 40.192l1.92 27.136-79.808 88.192 65.344 113.152 116.224-25.024 22.656 15.296a294.113 294.113 0 0 0 34.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152 24.448-11.904a288.282 288.282 0 0 0 34.752-20.096l22.592-15.296 116.288 25.024 65.28-113.152-79.744-88.192 1.92-27.136a293.12 293.12 0 0 0 0-40.256l-1.92-27.136 79.808-88.128-65.344-113.152-116.288 24.96-22.592-15.232a287.616 287.616 0 0 0-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 1 1 0 384 192 192 0 0 1 0-384zm0 64a128 128 0 1 0 0 256 128 128 0 0 0 0-256z",
            },
            null,
            -1
            /* HOISTED */
        ),
        _hoisted_3230 = [_hoisted_2231];
    function _sfc_render231(_ctx, _cache, $props, $setup, $data, $options) {
        return (
            vue.openBlock(),
            vue.createElementBlock("svg", _hoisted_1231, _hoisted_3230)
        );
    }
    var setting_default = /* @__PURE__ */ export_helper_default(
        setting_vue_vue_type_script_lang_default,
        [
            ["render", _sfc_render231],
            ["__file", "setting.vue"],
        ]
    );
    var view_vue_vue_type_script_lang_default = {
        name: "View",
    };
    var _hoisted_1283 = {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024",
    },
        _hoisted_2283 = /* @__PURE__ */ vue.createElementVNode(
            "path",
            {
                fill: "currentColor",
                d: "M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352zm0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288zm0 64a224 224 0 1 1 0 448 224 224 0 0 1 0-448zm0 64a160.192 160.192 0 0 0-160 160c0 88.192 71.744 160 160 160s160-71.808 160-160-71.744-160-160-160z",
            },
            null,
            -1
            /* HOISTED */
        ),
        _hoisted_3282 = [_hoisted_2283];
    function _sfc_render283(_ctx, _cache, $props, $setup, $data, $options) {
        return (
            vue.openBlock(),
            vue.createElementBlock("svg", _hoisted_1283, _hoisted_3282)
        );
    }
    var view_default = /* @__PURE__ */ export_helper_default(
        view_vue_vue_type_script_lang_default,
        [
            ["render", _sfc_render283],
            ["__file", "view.vue"],
        ]
    );
    var warning_vue_vue_type_script_lang_default = {
        name: "Warning",
    };
    var _hoisted_1288 = {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024",
    },
        _hoisted_2288 = /* @__PURE__ */ vue.createElementVNode(
            "path",
            {
                fill: "currentColor",
                d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 832a384 384 0 0 0 0-768 384 384 0 0 0 0 768zm48-176a48 48 0 1 1-96 0 48 48 0 0 1 96 0zm-48-464a32 32 0 0 1 32 32v288a32 32 0 0 1-64 0V288a32 32 0 0 1 32-32z",
            },
            null,
            -1
            /* HOISTED */
        ),
        _hoisted_3287 = [_hoisted_2288];
    function _sfc_render288(_ctx, _cache, $props, $setup, $data, $options) {
        return (
            vue.openBlock(),
            vue.createElementBlock("svg", _hoisted_1288, _hoisted_3287)
        );
    }
    var warning_default = /* @__PURE__ */ export_helper_default(
        warning_vue_vue_type_script_lang_default,
        [
            ["render", _sfc_render288],
            ["__file", "warning.vue"],
        ]
    );
    var _GM_getResourceText = /* @__PURE__ */ (() =>
                                               typeof GM_getResourceText != "undefined" ? GM_getResourceText : void 0)();
    var _GM_info = /* @__PURE__ */ (() =>
                                    typeof GM_info != "undefined" ? GM_info : void 0)();
    var _GM_xmlhttpRequest = /* @__PURE__ */ (() =>
                                              typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
    var _unsafeWindow = /* @__PURE__ */ (() =>
                                         typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
    const getScriptInfo = () => {
        return {
            name: _GM_info.script.name,
            namespace: _GM_info.script.namespace,
            version: _GM_info.script.version,
            description: _GM_info.script.description,
        };
    };
    const useConfigStore = pinia.defineStore("configStore", {
        state: () => {
            const scriptInfo = getScriptInfo();
            const defaultConfig = {
                version: scriptInfo.version,
                isMinus: false,
                position: {
                    x: "800px",
                    y: "200px",
                },
                menuIndex: "0",
                platformName: "cx",
                platformParams: {
                    cx: {
                        name: "超星网课助手",
                        parts: [
                            {
                                name: "章节设置",
                                params: [
                                    //     {
                                    //     name: '视频速率',
                                    //     value: 1,
                                    //     type: 'number',
                                    // },
                                    {
                                        name: "章节是否自动提交",
                                        value: false,
                                        type: "boolean",
                                    },
                                    {
                                        name: "是否自动下一章节",
                                        value: true,
                                        type: "boolean",
                                    },
                                ],
                            },
                            {
                                name: "考试设置",
                                params: [
                                    {
                                        name: "是否自动切换",
                                        value: true,
                                        type: "boolean",
                                    },
                                ],
                            },
                        ],
                    },
                    zhs: {
                        name: "智慧树网课助手",
                        parts: [
                            {
                                name: "答题设置",
                                params: [
                                    {
                                        name: "是否自动切换",
                                        value: true,
                                        type: "boolean",
                                    },
                                ],
                            },
                        ],
                    },
                    unknown: {
                        name: "未知平台",
                        parts: [
                            {
                                name: "答题设置",
                                params: [
                                    {
                                        name: "是否自动切换",
                                        value: true,
                                        type: "boolean",
                                    },
                                ],
                            },
                        ],
                    },
                },
                // 没答案自动选择
                otherParams: {
                    name: "其他参数",
                    params: [
                        //     {
                        //     name: '没答案随机选择',
                        //     value: true,
                        //     type: 'boolean',
                        // },
                        {
                            name: "切换、答题间隔，单位秒",
                            value: 3,
                            type: "number",
                        },
                        {
                            name: "正确率达到多少自动提交",
                            value: 80,
                            type: "number",
                        },
                    ],
                },
                queryApis: [
                    {
                        name: "海量题库",
                        token: "",
                        url: "http://api.tikuhai.com",
                    },
                    // {
                    //     name: '一之题库',
                    //     token: '',
                    //     url: "http://api.tikuhai.com"
                    // }
                ],
            };
            let globalConfig = defaultConfig;
            const storedConfig = localStorage.getItem("config");
            if (storedConfig) {
                try {
                    const parsedStoredConfig = JSON.parse(storedConfig);
                    if (scriptInfo.version === parsedStoredConfig.version) {
                        globalConfig = parsedStoredConfig;
                    }
                } catch (error) {
                    console.error(error);
                }
            }
            localStorage.setItem("globalConfig", JSON.stringify(globalConfig));
            return globalConfig;
        },
        actions: {},
    });
    const formatDateTime = (dt) => {
        dt.getFullYear();
        dt.getMonth() + 1;
        dt.getDate();
        let hours = dt.getHours();
        let minutes = dt.getMinutes();
        let seconds = dt.getSeconds();
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    };
    const pad = (n) => {
        return n < 10 ? "0" + n : n.toString();
    };
    const getDateTime = () => {
        let now = /* @__PURE__ */ new Date();
        return formatDateTime(now);
    };
    const useLogStore = pinia.defineStore("logStore", {
        state: () => ({
            logList: [],
        }),
        actions: {
            addLog(message, type) {
                const log = {
                    message,
                    time: getDateTime(),
                    type,
                };
                this.logList.push(log);
            },
        },
    });
    const useQuestionStore = pinia.defineStore("questionStore", {
        state: () => ({
            questionList: [],
        }),
        actions: {
            addQuestion(question) {
                this.questionList.push(question);
            },
            clearQuestion() {
                this.questionList = [];
            },
        },
    });
    const _hoisted_1$4 = /* @__PURE__ */ vue.createTextVNode(" ");
    const _sfc_main$7 = /* @__PURE__ */ vue.defineComponent({
        name: "index",
        props: {
            logList: {
                type: Array,
                required: true,
            },
        },
        setup(__props) {
            return (_ctx, _cache) => {
                const _component_el_text = vue.resolveComponent("el-text");
                const _component_el_divider = vue.resolveComponent("el-divider");
                const _component_el_scrollbar = vue.resolveComponent("el-scrollbar");
                return (
                    vue.openBlock(),
                    vue.createElementBlock("div", null, [
                        vue.createVNode(
                            _component_el_scrollbar,
                            {
                                always: "",
                                class: "log",
                                "max-height": "230px",
                            },
                            {
                                default: vue.withCtx(() => [
                                    (vue.openBlock(true),
                                     vue.createElementBlock(
                                        vue.Fragment,
                                        null,
                                        vue.renderList(__props.logList, (item, index) => {
                                            return (
                                                vue.openBlock(),
                                                vue.createElementBlock("div", { key: index }, [
                                                    vue.createVNode(
                                                        _component_el_text,
                                                        {
                                                            size: "small",
                                                            style: { "font-weight": "normal" },
                                                            type: "info",
                                                        },
                                                        {
                                                            default: vue.withCtx(() => [
                                                                vue.createTextVNode(
                                                                    vue.toDisplayString(item.time),
                                                                    1
                                                                ),
                                                            ]),
                                                            _: 2,
                                                        },
                                                        1024
                                                    ),
                                                    vue.createVNode(_component_el_text, null, {
                                                        default: vue.withCtx(() => [_hoisted_1$4]),
                                                        _: 1,
                                                    }),
                                                    vue.createVNode(
                                                        _component_el_text,
                                                        {
                                                            type: item.type ? item.type : "primary",
                                                            size: "small",
                                                            innerHTML: item.message,
                                                        },
                                                        null,
                                                        8,
                                                        ["type", "innerHTML"]
                                                    ),
                                                    vue.createVNode(_component_el_divider, {
                                                        "border-style": "dashed",
                                                        style: { margin: "0" },
                                                    }),
                                                ])
                                            );
                                        }),
                                        128
                                    )),
                                ]),
                                _: 1,
                            }
                        ),
                    ])
                );
            };
        },
    });
    const _export_sfc = (sfc, props) => {
        const target = sfc.__vccOpts || sfc;
        for (const [key, val] of props) {
            target[key] = val;
        }
        return target;
    };
    const ScriptHome = /* @__PURE__ */ _export_sfc(_sfc_main$7, [
        ["__scopeId", "data-v-d41d5897"],
    ]);
    const _hoisted_1$3 = { class: "setting" };
    const _hoisted_2$3 = { style: { "font-size": "13px" } };
    const _hoisted_3$2 = { style: { "font-size": "13px" } };
    const _sfc_main$6 = /* @__PURE__ */ vue.defineComponent({
        name: "index",
        props: {
            globalConfig: {
                type: Object,
                required: true,
            },
        },
        setup(__props) {
            return (_ctx, _cache) => {
                const _component_el_divider = vue.resolveComponent("el-divider");
                const _component_el_checkbox = vue.resolveComponent("el-checkbox");
                const _component_el_input_number =
                      vue.resolveComponent("el-input-number");
                const _component_el_form_item = vue.resolveComponent("el-form-item");
                return (
                    vue.openBlock(),
                    vue.createElementBlock("div", _hoisted_1$3, [
                        (vue.openBlock(true),
                         vue.createElementBlock(
                            vue.Fragment,
                            null,
                            vue.renderList(
                                __props.globalConfig.platformParams[
                                    __props.globalConfig.platformName
                                ].parts,
                                (item, index) => {
                                    return (
                                        vue.openBlock(),
                                        vue.createElementBlock("div", { key: index }, [
                                            vue.createVNode(
                                                _component_el_divider,
                                                { "border-style": "dashed" },
                                                {
                                                    default: vue.withCtx(() => [
                                                        vue.createElementVNode(
                                                            "span",
                                                            _hoisted_2$3,
                                                            vue.toDisplayString(item.name),
                                                            1
                                                        ),
                                                    ]),
                                                    _: 2,
                                                },
                                                1024
                                            ),
                                            (vue.openBlock(true),
                                             vue.createElementBlock(
                                                vue.Fragment,
                                                null,
                                                vue.renderList(item.params, (param, index2) => {
                                                    return (
                                                        vue.openBlock(),
                                                        vue.createElementBlock(
                                                            vue.Fragment,
                                                            null,
                                                            [
                                                                param.type === "boolean"
                                                                ? (vue.openBlock(),
                                                                   vue.createBlock(
                                                                    _component_el_checkbox,
                                                                    {
                                                                        key: index2,
                                                                        modelValue: param.value,
                                                                        "onUpdate:modelValue": ($event) =>
                                                                        (param.value = $event),
                                                                        label: param.name,
                                                                        size: "small",
                                                                    },
                                                                    null,
                                                                    8,
                                                                    [
                                                                        "modelValue",
                                                                        "onUpdate:modelValue",
                                                                        "label",
                                                                    ]
                                                                ))
                                                                : (vue.openBlock(),
                                                                   vue.createBlock(
                                                                    _component_el_form_item,
                                                                    {
                                                                        key: 1,
                                                                        label: param.name,
                                                                        required: "",
                                                                    },
                                                                    {
                                                                        default: vue.withCtx(() => [
                                                                            vue.createVNode(
                                                                                _component_el_input_number,
                                                                                {
                                                                                    modelValue: param.value,
                                                                                    "onUpdate:modelValue": ($event) =>
                                                                                    (param.value = $event),
                                                                                    min: 3e3,
                                                                                    step: 1e3,
                                                                                    "controls-position": "right",
                                                                                    size: "small",
                                                                                },
                                                                                null,
                                                                                8,
                                                                                [
                                                                                    "modelValue",
                                                                                    "onUpdate:modelValue",
                                                                                ]
                                                                            ),
                                                                        ]),
                                                                        _: 2,
                                                                    },
                                                                    1032,
                                                                    ["label"]
                                                                )),
                                                            ],
                                                            64
                                                        )
                                                    );
                                                }),
                                                256
                                            )),
                                        ])
                                    );
                                }
                            ),
                            128
                        )),
                        vue.createElementVNode("div", null, [
                            vue.createVNode(
                                _component_el_divider,
                                { "border-style": "dashed" },
                                {
                                    default: vue.withCtx(() => [
                                        vue.createElementVNode(
                                            "span",
                                            _hoisted_3$2,
                                            vue.toDisplayString(
                                                __props.globalConfig.otherParams.name
                                            ),
                                            1
                                        ),
                                    ]),
                                    _: 1,
                                }
                            ),
                            (vue.openBlock(true),
                             vue.createElementBlock(
                                vue.Fragment,
                                null,
                                vue.renderList(
                                    __props.globalConfig.otherParams.params,
                                    (item, index) => {
                                        return (
                                            vue.openBlock(),
                                            vue.createElementBlock(
                                                vue.Fragment,
                                                { key: index },
                                                [
                                                    item.type === "boolean"
                                                    ? (vue.openBlock(),
                                                       vue.createBlock(
                                                        _component_el_checkbox,
                                                        {
                                                            key: 0,
                                                            modelValue: item.value,
                                                            "onUpdate:modelValue": ($event) =>
                                                            (item.value = $event),
                                                            size: "small",
                                                        },
                                                        null,
                                                        8,
                                                        ["modelValue", "onUpdate:modelValue"]
                                                    ))
                                                    : (vue.openBlock(),
                                                       vue.createBlock(
                                                        _component_el_form_item,
                                                        {
                                                            key: 1,
                                                            style: { "margin-top": "6px" },
                                                            label: item.name,
                                                            required: "",
                                                            size: "small",
                                                        },
                                                        {
                                                            default: vue.withCtx(() => [
                                                                vue.createVNode(
                                                                    _component_el_input_number,
                                                                    {
                                                                        modelValue: item.value,
                                                                        "onUpdate:modelValue": ($event) =>
                                                                        (item.value = $event),
                                                                        min: 3,
                                                                        max: 100,
                                                                        step: 1,
                                                                        size: "small",
                                                                    },
                                                                    null,
                                                                    8,
                                                                    ["modelValue", "onUpdate:modelValue"]
                                                                ),
                                                            ]),
                                                            _: 2,
                                                        },
                                                        1032,
                                                        ["label"]
                                                    )),
                                                ],
                                                64
                                            )
                                        );
                                    }
                                ),
                                128
                            )),
                        ]),
                    ])
                );
            };
        },
    });
    const ScriptSetting = /* @__PURE__ */ _export_sfc(_sfc_main$6, [
        ["__scopeId", "data-v-319ccda2"],
    ]);
    const _hoisted_1$2 = /* @__PURE__ */ vue.createTextVNode("密钥");
    const _hoisted_2$2 = { class: "question_table" };
    const _hoisted_3$1 = ["innerHTML"];
    const _sfc_main$5 = /* @__PURE__ */ vue.defineComponent({
        name: "QuestionTable",
        props: {
            questionList: {
                type: Array,
                required: true,
            },
        },
        setup(__props) {
            const configStore = useConfigStore();
            return (_ctx, _cache) => {
                const _component_el_button = vue.resolveComponent("el-button");
                const _component_el_input = vue.resolveComponent("el-input");
                const _component_el_table_column =
                      vue.resolveComponent("el-table-column");
                const _component_el_table = vue.resolveComponent("el-table");
                const _component_el_empty = vue.resolveComponent("el-empty");
                return (
                    vue.openBlock(),
                    vue.createElementBlock(
                        vue.Fragment,
                        null,
                        [
                            vue.createVNode(
                                _component_el_input,
                                {
                                    style: { "font-size": "12px" },
                                    modelValue: vue.unref(configStore).queryApis[0].token,
                                    "onUpdate:modelValue":
                                    _cache[0] ||
                                    (_cache[0] = ($event) =>
                                     (vue.unref(configStore).queryApis[0].token = $event)),
                                    placeholder: "获取的密钥的密钥填到这里即可，暂不支持密钥获取",
                                },
                                {
                                    prepend: vue.withCtx(() => [
                                        vue.createVNode(
                                            _component_el_button,
                                            { style: { "border-radius": "0" } },
                                            {
                                                default: vue.withCtx(() => [_hoisted_1$2]),
                                                _: 1,
                                            }
                                        ),
                                    ]),
                                    _: 1,
                                },
                                8,
                                ["modelValue"]
                            ),
                            vue.withDirectives(
                                vue.createElementVNode(
                                    "div",
                                    _hoisted_2$2,
                                    [
                                        vue.createVNode(
                                            _component_el_table,
                                            {
                                                stripe: "",
                                                data: __props.questionList,
                                                "max-height": "400",
                                                style: { "font-size": "12px" },
                                            },
                                            {
                                                default: vue.withCtx(() => [
                                                    vue.createVNode(_component_el_table_column, {
                                                        type: "index",
                                                        width: "40",
                                                    }),
                                                    vue.createVNode(_component_el_table_column, {
                                                        prop: "title",
                                                        label: "题目",
                                                        width: "370",
                                                    }),
                                                    vue.createVNode(
                                                        _component_el_table_column,
                                                        {
                                                            style: { "background-color": "red" },
                                                            prop: "answer",
                                                            label: "答案",
                                                            width: "215",
                                                        },
                                                        {
                                                            default: vue.withCtx((scope) => [
                                                                vue.createElementVNode(
                                                                    "div",
                                                                    {
                                                                        innerHTML: scope.row.answer.join(),
                                                                    },
                                                                    null,
                                                                    8,
                                                                    _hoisted_3$1
                                                                ),
                                                            ]),
                                                            _: 1,
                                                        }
                                                    ),
                                                ]),
                                                _: 1,
                                            },
                                            8,
                                            ["data"]
                                        ),
                                    ],
                                    512
                                ),
                                [[vue.vShow, __props.questionList.length]]
                            ),
                            vue.withDirectives(
                                vue.createElementVNode(
                                    "div",
                                    null,
                                    [
                                        vue.createVNode(_component_el_empty, {
                                            description: "该页面无需答题",
                                        }),
                                    ],
                                    512
                                ),
                                [[vue.vShow, !__props.questionList.length]]
                            ),
                        ],
                        64
                    )
                );
            };
        },
    });
    const QuestionTable = /* @__PURE__ */ _export_sfc(_sfc_main$5, [
        ["__scopeId", "data-v-e4d1840f"],
    ]);
    const _sfc_main$4 = {};
    const _hoisted_1$1 = { style: { "font-size": "12px" } };
    const _hoisted_2$1 = /* @__PURE__ */ vue.createTextVNode(" 开源地址：");
    const _hoisted_3 = /* @__PURE__ */ vue.createElementVNode(
        "a",
        null,
        "点击查看",
        -1
    );
    const _hoisted_4 = [_hoisted_2$1, _hoisted_3];
    function _sfc_render(_ctx, _cache) {
        return (
            vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, _hoisted_4)
        );
    }
    const OpenCode = /* @__PURE__ */ _export_sfc(_sfc_main$4, [
        ["render", _sfc_render],
    ]);
    function isFunction(value) {
        return typeof value === "function";
    }
    function hasLift(source) {
        return isFunction(
            source === null || source === void 0 ? void 0 : source.lift
        );
    }
    function operate(init) {
        return function (source) {
            if (hasLift(source)) {
                return source.lift(function (liftedSource) {
                    try {
                        return init(liftedSource, this);
                    } catch (err) {
                        this.error(err);
                    }
                });
            }
            throw new TypeError("Unable to lift unknown Observable type");
        };
    }
    var extendStatics = function (d, b) {
        extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
             function (d2, b2) {
            d2.__proto__ = b2;
        }) ||
            function (d2, b2) {
            for (var p in b2)
                if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError(
                "Class extends value " + String(b) + " is not a constructor or null"
            );
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype =
            b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
            : new P(function (resolve) {
                resolve(value);
            });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = {
            label: 0,
            sent: function () {
                if (t[0] & 1) throw t[1];
                return t[1];
            },
            trys: [],
            ops: [],
        },
            f,
            y,
            t,
            g;
        return (
            (g = { next: verb(0), throw: verb(1), return: verb(2) }),
            typeof Symbol === "function" &&
            (g[Symbol.iterator] = function () {
                return this;
            }),
            g
        );
        function verb(n) {
            return function (v) {
                return step([n, v]);
            };
        }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while ((g && ((g = 0), op[0] && (_ = 0)), _))
                try {
                    if (
                        ((f = 1),
                         y &&
                         (t =
                          op[0] & 2
                          ? y["return"]
                          : op[0]
                          ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                          : y.next) &&
                         !(t = t.call(y, op[1])).done)
                    )
                        return t;
                    if (((y = 0), t)) op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (
                                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                                (op[0] === 6 || op[0] === 2)
                            ) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2]) _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                } catch (e) {
                    op = [6, e];
                    y = 0;
                } finally {
                    f = t = 0;
                }
            if (op[0] & 5) throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator,
            m = s && o[s],
            i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length) o = void 0;
                    return { value: o && o[i++], done: !o };
                },
            };
        throw new TypeError(
            s ? "Object is not iterable." : "Symbol.iterator is not defined."
        );
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o),
            r,
            ar = [],
            e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        } catch (error) {
            e = { error };
        } finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            } finally {
                if (e) throw e.error;
            }
        }
        return ar;
    }
    function __spreadArray(to, from2, pack) {
        if (pack || arguments.length === 2)
            for (var i = 0, l = from2.length, ar; i < l; i++) {
                if (ar || !(i in from2)) {
                    if (!ar) ar = Array.prototype.slice.call(from2, 0, i);
                    ar[i] = from2[i];
                }
            }
        return to.concat(ar || Array.prototype.slice.call(from2));
    }
    function __await(v) {
        return this instanceof __await ? ((this.v = v), this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []),
            i,
            q = [];
        return (
            (i = {}),
            verb("next"),
            verb("throw"),
            verb("return"),
            (i[Symbol.asyncIterator] = function () {
                return this;
            }),
            i
        );
        function verb(n) {
            if (g[n])
                i[n] = function (v) {
                    return new Promise(function (a, b) {
                        q.push([n, v, a, b]) > 1 || resume(n, v);
                    });
                };
        }
        function resume(n, v) {
            try {
                step(g[n](v));
            } catch (e) {
                settle(q[0][3], e);
            }
        }
        function step(r) {
            r.value instanceof __await
                ? Promise.resolve(r.value.v).then(fulfill, reject)
            : settle(q[0][2], r);
        }
        function fulfill(value) {
            resume("next", value);
        }
        function reject(value) {
            resume("throw", value);
        }
        function settle(f, v) {
            if ((f(v), q.shift(), q.length)) resume(q[0][0], q[0][1]);
        }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator],
            i;
        return m
            ? m.call(o)
        : ((o =
            typeof __values === "function" ? __values(o) : o[Symbol.iterator]()),
           (i = {}),
           verb("next"),
           verb("throw"),
           verb("return"),
           (i[Symbol.asyncIterator] = function () {
            return this;
        }),
           i);
        function verb(n) {
            i[n] =
                o[n] &&
                function (v) {
                return new Promise(function (resolve, reject) {
                    (v = o[n](v)), settle(resolve, reject, v.done, v.value);
                });
            };
        }
        function settle(resolve, reject, d, v) {
            Promise.resolve(v).then(function (v2) {
                resolve({ value: v2, done: d });
            }, reject);
        }
    }
    var isArrayLike = function (x) {
        return x && typeof x.length === "number" && typeof x !== "function";
    };
    function isPromise(value) {
        return isFunction(value === null || value === void 0 ? void 0 : value.then);
    }
    function createErrorClass(createImpl) {
        var _super = function (instance) {
            Error.call(instance);
            instance.stack = new Error().stack;
        };
        var ctorFunc = createImpl(_super);
        ctorFunc.prototype = Object.create(Error.prototype);
        ctorFunc.prototype.constructor = ctorFunc;
        return ctorFunc;
    }
    var UnsubscriptionError = createErrorClass(function (_super) {
        return function UnsubscriptionErrorImpl(errors) {
            _super(this);
            this.message = errors
                ? errors.length +
                " errors occurred during unsubscription:\n" +
                errors
                .map(function (err, i) {
                return i + 1 + ") " + err.toString();
            })
                .join("\n  ")
            : "";
            this.name = "UnsubscriptionError";
            this.errors = errors;
        };
    });
    function arrRemove(arr, item) {
        if (arr) {
            var index = arr.indexOf(item);
            0 <= index && arr.splice(index, 1);
        }
    }
    var Subscription = (function () {
        function Subscription2(initialTeardown) {
            this.initialTeardown = initialTeardown;
            this.closed = false;
            this._parentage = null;
            this._finalizers = null;
        }
        Subscription2.prototype.unsubscribe = function () {
            var e_1, _a, e_2, _b;
            var errors;
            if (!this.closed) {
                this.closed = true;
                var _parentage = this._parentage;
                if (_parentage) {
                    this._parentage = null;
                    if (Array.isArray(_parentage)) {
                        try {
                            for (
                                var _parentage_1 = __values(_parentage),
                                _parentage_1_1 = _parentage_1.next();
                                !_parentage_1_1.done;
                                _parentage_1_1 = _parentage_1.next()
                            ) {
                                var parent_1 = _parentage_1_1.value;
                                parent_1.remove(this);
                            }
                        } catch (e_1_1) {
                            e_1 = { error: e_1_1 };
                        } finally {
                            try {
                                if (
                                    _parentage_1_1 &&
                                    !_parentage_1_1.done &&
                                    (_a = _parentage_1.return)
                                )
                                    _a.call(_parentage_1);
                            } finally {
                                if (e_1) throw e_1.error;
                            }
                        }
                    } else {
                        _parentage.remove(this);
                    }
                }
                var initialFinalizer = this.initialTeardown;
                if (isFunction(initialFinalizer)) {
                    try {
                        initialFinalizer();
                    } catch (e) {
                        errors = e instanceof UnsubscriptionError ? e.errors : [e];
                    }
                }
                var _finalizers = this._finalizers;
                if (_finalizers) {
                    this._finalizers = null;
                    try {
                        for (
                            var _finalizers_1 = __values(_finalizers),
                            _finalizers_1_1 = _finalizers_1.next();
                            !_finalizers_1_1.done;
                            _finalizers_1_1 = _finalizers_1.next()
                        ) {
                            var finalizer = _finalizers_1_1.value;
                            try {
                                execFinalizer(finalizer);
                            } catch (err) {
                                errors = errors !== null && errors !== void 0 ? errors : [];
                                if (err instanceof UnsubscriptionError) {
                                    errors = __spreadArray(
                                        __spreadArray([], __read(errors)),
                                        __read(err.errors)
                                    );
                                } else {
                                    errors.push(err);
                                }
                            }
                        }
                    } catch (e_2_1) {
                        e_2 = { error: e_2_1 };
                    } finally {
                        try {
                            if (
                                _finalizers_1_1 &&
                                !_finalizers_1_1.done &&
                                (_b = _finalizers_1.return)
                            )
                                _b.call(_finalizers_1);
                        } finally {
                            if (e_2) throw e_2.error;
                        }
                    }
                }
                if (errors) {
                    throw new UnsubscriptionError(errors);
                }
            }
        };
        Subscription2.prototype.add = function (teardown) {
            var _a;
            if (teardown && teardown !== this) {
                if (this.closed) {
                    execFinalizer(teardown);
                } else {
                    if (teardown instanceof Subscription2) {
                        if (teardown.closed || teardown._hasParent(this)) {
                            return;
                        }
                        teardown._addParent(this);
                    }
                    (this._finalizers =
                     (_a = this._finalizers) !== null && _a !== void 0 ? _a : []).push(
                        teardown
                    );
                }
            }
        };
        Subscription2.prototype._hasParent = function (parent) {
            var _parentage = this._parentage;
            return (
                _parentage === parent ||
                (Array.isArray(_parentage) && _parentage.includes(parent))
            );
        };
        Subscription2.prototype._addParent = function (parent) {
            var _parentage = this._parentage;
            this._parentage = Array.isArray(_parentage)
                ? (_parentage.push(parent), _parentage)
            : _parentage
                ? [_parentage, parent]
            : parent;
        };
        Subscription2.prototype._removeParent = function (parent) {
            var _parentage = this._parentage;
            if (_parentage === parent) {
                this._parentage = null;
            } else if (Array.isArray(_parentage)) {
                arrRemove(_parentage, parent);
            }
        };
        Subscription2.prototype.remove = function (teardown) {
            var _finalizers = this._finalizers;
            _finalizers && arrRemove(_finalizers, teardown);
            if (teardown instanceof Subscription2) {
                teardown._removeParent(this);
            }
        };
        Subscription2.EMPTY = (function () {
            var empty = new Subscription2();
            empty.closed = true;
            return empty;
        })();
        return Subscription2;
    })();
    Subscription.EMPTY;
    function isSubscription(value) {
        return (
            value instanceof Subscription ||
            (value &&
             "closed" in value &&
             isFunction(value.remove) &&
             isFunction(value.add) &&
             isFunction(value.unsubscribe))
        );
    }
    function execFinalizer(finalizer) {
        if (isFunction(finalizer)) {
            finalizer();
        } else {
            finalizer.unsubscribe();
        }
    }
    var config = {
        onUnhandledError: null,
        onStoppedNotification: null,
        Promise: void 0,
        useDeprecatedSynchronousErrorHandling: false,
        useDeprecatedNextContext: false,
    };
    var timeoutProvider = {
        setTimeout: function (handler, timeout) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            return setTimeout.apply(
                void 0,
                __spreadArray([handler, timeout], __read(args))
            );
        },
        clearTimeout: function (handle) {
            return clearTimeout(handle);
        },
        delegate: void 0,
    };
    function reportUnhandledError(err) {
        timeoutProvider.setTimeout(function () {
            {
                throw err;
            }
        });
    }
    function noop() {}
    function errorContext(cb) {
        {
            cb();
        }
    }
    var Subscriber = (function (_super) {
        __extends(Subscriber2, _super);
        function Subscriber2(destination) {
            var _this = _super.call(this) || this;
            _this.isStopped = false;
            if (destination) {
                _this.destination = destination;
                if (isSubscription(destination)) {
                    destination.add(_this);
                }
            } else {
                _this.destination = EMPTY_OBSERVER;
            }
            return _this;
        }
        Subscriber2.create = function (next, error, complete) {
            return new SafeSubscriber(next, error, complete);
        };
        Subscriber2.prototype.next = function (value) {
            if (this.isStopped);
            else {
                this._next(value);
            }
        };
        Subscriber2.prototype.error = function (err) {
            if (this.isStopped);
            else {
                this.isStopped = true;
                this._error(err);
            }
        };
        Subscriber2.prototype.complete = function () {
            if (this.isStopped);
            else {
                this.isStopped = true;
                this._complete();
            }
        };
        Subscriber2.prototype.unsubscribe = function () {
            if (!this.closed) {
                this.isStopped = true;
                _super.prototype.unsubscribe.call(this);
                this.destination = null;
            }
        };
        Subscriber2.prototype._next = function (value) {
            this.destination.next(value);
        };
        Subscriber2.prototype._error = function (err) {
            try {
                this.destination.error(err);
            } finally {
                this.unsubscribe();
            }
        };
        Subscriber2.prototype._complete = function () {
            try {
                this.destination.complete();
            } finally {
                this.unsubscribe();
            }
        };
        return Subscriber2;
    })(Subscription);
    var _bind = Function.prototype.bind;
    function bind(fn, thisArg) {
        return _bind.call(fn, thisArg);
    }
    var ConsumerObserver = (function () {
        function ConsumerObserver2(partialObserver) {
            this.partialObserver = partialObserver;
        }
        ConsumerObserver2.prototype.next = function (value) {
            var partialObserver = this.partialObserver;
            if (partialObserver.next) {
                try {
                    partialObserver.next(value);
                } catch (error) {
                    handleUnhandledError(error);
                }
            }
        };
        ConsumerObserver2.prototype.error = function (err) {
            var partialObserver = this.partialObserver;
            if (partialObserver.error) {
                try {
                    partialObserver.error(err);
                } catch (error) {
                    handleUnhandledError(error);
                }
            } else {
                handleUnhandledError(err);
            }
        };
        ConsumerObserver2.prototype.complete = function () {
            var partialObserver = this.partialObserver;
            if (partialObserver.complete) {
                try {
                    partialObserver.complete();
                } catch (error) {
                    handleUnhandledError(error);
                }
            }
        };
        return ConsumerObserver2;
    })();
    var SafeSubscriber = (function (_super) {
        __extends(SafeSubscriber2, _super);
        function SafeSubscriber2(observerOrNext, error, complete) {
            var _this = _super.call(this) || this;
            var partialObserver;
            if (isFunction(observerOrNext) || !observerOrNext) {
                partialObserver = {
                    next:
                    observerOrNext !== null && observerOrNext !== void 0
                    ? observerOrNext
                    : void 0,
                    error: error !== null && error !== void 0 ? error : void 0,
                    complete:
                    complete !== null && complete !== void 0 ? complete : void 0,
                };
            } else {
                var context_1;
                if (_this && config.useDeprecatedNextContext) {
                    context_1 = Object.create(observerOrNext);
                    context_1.unsubscribe = function () {
                        return _this.unsubscribe();
                    };
                    partialObserver = {
                        next: observerOrNext.next && bind(observerOrNext.next, context_1),
                        error:
                        observerOrNext.error && bind(observerOrNext.error, context_1),
                        complete:
                        observerOrNext.complete &&
                        bind(observerOrNext.complete, context_1),
                    };
                } else {
                    partialObserver = observerOrNext;
                }
            }
            _this.destination = new ConsumerObserver(partialObserver);
            return _this;
        }
        return SafeSubscriber2;
    })(Subscriber);
    function handleUnhandledError(error) {
        {
            reportUnhandledError(error);
        }
    }
    function defaultErrorHandler(err) {
        throw err;
    }
    var EMPTY_OBSERVER = {
        closed: true,
        next: noop,
        error: defaultErrorHandler,
        complete: noop,
    };
    var observable = (function () {
        return (
            (typeof Symbol === "function" && Symbol.observable) || "@@observable"
        );
    })();
    function identity(x) {
        return x;
    }
    function pipeFromArray(fns) {
        if (fns.length === 0) {
            return identity;
        }
        if (fns.length === 1) {
            return fns[0];
        }
        return function piped(input) {
            return fns.reduce(function (prev, fn) {
                return fn(prev);
            }, input);
        };
    }
    var Observable = (function () {
        function Observable2(subscribe) {
            if (subscribe) {
                this._subscribe = subscribe;
            }
        }
        Observable2.prototype.lift = function (operator) {
            var observable2 = new Observable2();
            observable2.source = this;
            observable2.operator = operator;
            return observable2;
        };
        Observable2.prototype.subscribe = function (
        observerOrNext,
         error,
         complete
        ) {
            var _this = this;
            var subscriber = isSubscriber(observerOrNext)
            ? observerOrNext
            : new SafeSubscriber(observerOrNext, error, complete);
            errorContext(function () {
                var _a = _this,
                    operator = _a.operator,
                    source = _a.source;
                subscriber.add(
                    operator
                    ? operator.call(subscriber, source)
                    : source
                    ? _this._subscribe(subscriber)
                    : _this._trySubscribe(subscriber)
                );
            });
            return subscriber;
        };
        Observable2.prototype._trySubscribe = function (sink) {
            try {
                return this._subscribe(sink);
            } catch (err) {
                sink.error(err);
            }
        };
        Observable2.prototype.forEach = function (next, promiseCtor) {
            var _this = this;
            promiseCtor = getPromiseCtor(promiseCtor);
            return new promiseCtor(function (resolve, reject) {
                var subscriber = new SafeSubscriber({
                    next: function (value) {
                        try {
                            next(value);
                        } catch (err) {
                            reject(err);
                            subscriber.unsubscribe();
                        }
                    },
                    error: reject,
                    complete: resolve,
                });
                _this.subscribe(subscriber);
            });
        };
        Observable2.prototype._subscribe = function (subscriber) {
            var _a;
            return (_a = this.source) === null || _a === void 0
                ? void 0
            : _a.subscribe(subscriber);
        };
        Observable2.prototype[observable] = function () {
            return this;
        };
        Observable2.prototype.pipe = function () {
            var operations = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                operations[_i] = arguments[_i];
            }
            return pipeFromArray(operations)(this);
        };
        Observable2.prototype.toPromise = function (promiseCtor) {
            var _this = this;
            promiseCtor = getPromiseCtor(promiseCtor);
            return new promiseCtor(function (resolve, reject) {
                var value;
                _this.subscribe(
                    function (x) {
                        return (value = x);
                    },
                    function (err) {
                        return reject(err);
                    },
                    function () {
                        return resolve(value);
                    }
                );
            });
        };
        Observable2.create = function (subscribe) {
            return new Observable2(subscribe);
        };
        return Observable2;
    })();
    function getPromiseCtor(promiseCtor) {
        var _a;
        return (_a =
                promiseCtor !== null && promiseCtor !== void 0
                ? promiseCtor
                : config.Promise) !== null && _a !== void 0
            ? _a
        : Promise;
    }
    function isObserver(value) {
        return (
            value &&
            isFunction(value.next) &&
            isFunction(value.error) &&
            isFunction(value.complete)
        );
    }
    function isSubscriber(value) {
        return (
            (value && value instanceof Subscriber) ||
            (isObserver(value) && isSubscription(value))
        );
    }
    function isInteropObservable(input) {
        return isFunction(input[observable]);
    }
    function isAsyncIterable(obj) {
        return (
            Symbol.asyncIterator &&
            isFunction(
                obj === null || obj === void 0 ? void 0 : obj[Symbol.asyncIterator]
            )
        );
    }
    function createInvalidObservableTypeError(input) {
        return new TypeError(
            "You provided " +
            (input !== null && typeof input === "object"
             ? "an invalid object"
             : "'" + input + "'") +
            " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable."
        );
    }
    function getSymbolIterator() {
        if (typeof Symbol !== "function" || !Symbol.iterator) {
            return "@@iterator";
        }
        return Symbol.iterator;
    }
    var iterator = getSymbolIterator();
    function isIterable(input) {
        return isFunction(
            input === null || input === void 0 ? void 0 : input[iterator]
        );
    }
    function readableStreamLikeToAsyncGenerator(readableStream) {
        return __asyncGenerator(
            this,
            arguments,
            function readableStreamLikeToAsyncGenerator_1() {
                var reader, _a, value, done;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            reader = readableStream.getReader();
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, , 9, 10]);
                            _b.label = 2;
                        case 2:
                            return [4, __await(reader.read())];
                        case 3:
                            (_a = _b.sent()), (value = _a.value), (done = _a.done);
                            if (!done) return [3, 5];
                            return [4, __await(void 0)];
                        case 4:
                            return [2, _b.sent()];
                        case 5:
                            return [4, __await(value)];
                        case 6:
                            return [4, _b.sent()];
                        case 7:
                            _b.sent();
                            return [3, 2];
                        case 8:
                            return [3, 10];
                        case 9:
                            reader.releaseLock();
                            return [7];
                        case 10:
                            return [2];
                    }
                });
            }
        );
    }
    function isReadableStreamLike(obj) {
        return isFunction(obj === null || obj === void 0 ? void 0 : obj.getReader);
    }
    function innerFrom(input) {
        if (input instanceof Observable) {
            return input;
        }
        if (input != null) {
            if (isInteropObservable(input)) {
                return fromInteropObservable(input);
            }
            if (isArrayLike(input)) {
                return fromArrayLike(input);
            }
            if (isPromise(input)) {
                return fromPromise(input);
            }
            if (isAsyncIterable(input)) {
                return fromAsyncIterable(input);
            }
            if (isIterable(input)) {
                return fromIterable(input);
            }
            if (isReadableStreamLike(input)) {
                return fromReadableStreamLike(input);
            }
        }
        throw createInvalidObservableTypeError(input);
    }
    function fromInteropObservable(obj) {
        return new Observable(function (subscriber) {
            var obs = obj[observable]();
            if (isFunction(obs.subscribe)) {
                return obs.subscribe(subscriber);
            }
            throw new TypeError(
                "Provided object does not correctly implement Symbol.observable"
            );
        });
    }
    function fromArrayLike(array) {
        return new Observable(function (subscriber) {
            for (var i = 0; i < array.length && !subscriber.closed; i++) {
                subscriber.next(array[i]);
            }
            subscriber.complete();
        });
    }
    function fromPromise(promise) {
        return new Observable(function (subscriber) {
            promise
                .then(
                function (value) {
                    if (!subscriber.closed) {
                        subscriber.next(value);
                        subscriber.complete();
                    }
                },
                function (err) {
                    return subscriber.error(err);
                }
            )
                .then(null, reportUnhandledError);
        });
    }
    function fromIterable(iterable) {
        return new Observable(function (subscriber) {
            var e_1, _a;
            try {
                for (
                    var iterable_1 = __values(iterable), iterable_1_1 = iterable_1.next();
                    !iterable_1_1.done;
                    iterable_1_1 = iterable_1.next()
                ) {
                    var value = iterable_1_1.value;
                    subscriber.next(value);
                    if (subscriber.closed) {
                        return;
                    }
                }
            } catch (e_1_1) {
                e_1 = { error: e_1_1 };
            } finally {
                try {
                    if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return))
                        _a.call(iterable_1);
                } finally {
                    if (e_1) throw e_1.error;
                }
            }
            subscriber.complete();
        });
    }
    function fromAsyncIterable(asyncIterable) {
        return new Observable(function (subscriber) {
            process(asyncIterable, subscriber).catch(function (err) {
                return subscriber.error(err);
            });
        });
    }
    function fromReadableStreamLike(readableStream) {
        return fromAsyncIterable(
            readableStreamLikeToAsyncGenerator(readableStream)
        );
    }
    function process(asyncIterable, subscriber) {
        var asyncIterable_1, asyncIterable_1_1;
        var e_2, _a;
        return __awaiter(this, void 0, void 0, function () {
            var value, e_2_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, 6, 11]);
                        asyncIterable_1 = __asyncValues(asyncIterable);
                        _b.label = 1;
                    case 1:
                        return [4, asyncIterable_1.next()];
                    case 2:
                        if (!((asyncIterable_1_1 = _b.sent()), !asyncIterable_1_1.done))
                            return [3, 4];
                        value = asyncIterable_1_1.value;
                        subscriber.next(value);
                        if (subscriber.closed) {
                            return [2];
                        }
                        _b.label = 3;
                    case 3:
                        return [3, 1];
                    case 4:
                        return [3, 11];
                    case 5:
                        e_2_1 = _b.sent();
                        e_2 = { error: e_2_1 };
                        return [3, 11];
                    case 6:
                        _b.trys.push([6, , 9, 10]);
                        if (
                            !(
                                asyncIterable_1_1 &&
                                !asyncIterable_1_1.done &&
                                (_a = asyncIterable_1.return)
                            )
                        )
                            return [3, 8];
                        return [4, _a.call(asyncIterable_1)];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8:
                        return [3, 10];
                    case 9:
                        if (e_2) throw e_2.error;
                        return [7];
                    case 10:
                        return [7];
                    case 11:
                        subscriber.complete();
                        return [2];
                }
            });
        });
    }
    function createOperatorSubscriber(
    destination,
     onNext,
     onComplete,
     onError,
     onFinalize
    ) {
        return new OperatorSubscriber(
            destination,
            onNext,
            onComplete,
            onError,
            onFinalize
        );
    }
    var OperatorSubscriber = (function (_super) {
        __extends(OperatorSubscriber2, _super);
        function OperatorSubscriber2(
        destination,
         onNext,
         onComplete,
         onError,
         onFinalize,
         shouldUnsubscribe
        ) {
            var _this = _super.call(this, destination) || this;
            _this.onFinalize = onFinalize;
            _this.shouldUnsubscribe = shouldUnsubscribe;
            _this._next = onNext
                ? function (value) {
                try {
                    onNext(value);
                } catch (err) {
                    destination.error(err);
                }
            }
            : _super.prototype._next;
            _this._error = onError
                ? function (err) {
                try {
                    onError(err);
                } catch (err2) {
                    destination.error(err2);
                } finally {
                    this.unsubscribe();
                }
            }
            : _super.prototype._error;
            _this._complete = onComplete
                ? function () {
                try {
                    onComplete();
                } catch (err) {
                    destination.error(err);
                } finally {
                    this.unsubscribe();
                }
            }
            : _super.prototype._complete;
            return _this;
        }
        OperatorSubscriber2.prototype.unsubscribe = function () {
            var _a;
            if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
                var closed_1 = this.closed;
                _super.prototype.unsubscribe.call(this);
                !closed_1 &&
                    ((_a = this.onFinalize) === null || _a === void 0
                     ? void 0
                     : _a.call(this));
            }
        };
        return OperatorSubscriber2;
    })(Subscriber);
    function executeSchedule(parentSubscription, scheduler, work, delay, repeat) {
        if (delay === void 0) {
            delay = 0;
        }
        if (repeat === void 0) {
            repeat = false;
        }
        var scheduleSubscription = scheduler.schedule(function () {
            work();
            if (repeat) {
                parentSubscription.add(this.schedule(null, delay));
            } else {
                this.unsubscribe();
            }
        }, delay);
        parentSubscription.add(scheduleSubscription);
        if (!repeat) {
            return scheduleSubscription;
        }
    }
    function map(project, thisArg) {
        return operate(function (source, subscriber) {
            var index = 0;
            source.subscribe(
                createOperatorSubscriber(subscriber, function (value) {
                    subscriber.next(project.call(thisArg, value, index++));
                })
            );
        });
    }
    function mergeInternals(
    source,
     subscriber,
     project,
     concurrent,
     onBeforeNext,
     expand,
     innerSubScheduler,
     additionalFinalizer
    ) {
        var buffer = [];
        var active = 0;
        var index = 0;
        var isComplete = false;
        var checkComplete = function () {
            if (isComplete && !buffer.length && !active) {
                subscriber.complete();
            }
        };
        var outerNext = function (value) {
            return active < concurrent ? doInnerSub(value) : buffer.push(value);
        };
        var doInnerSub = function (value) {
            expand && subscriber.next(value);
            active++;
            var innerComplete = false;
            innerFrom(project(value, index++)).subscribe(
                createOperatorSubscriber(
                    subscriber,
                    function (innerValue) {
                        onBeforeNext === null || onBeforeNext === void 0
                            ? void 0
                        : onBeforeNext(innerValue);
                        if (expand) {
                            outerNext(innerValue);
                        } else {
                            subscriber.next(innerValue);
                        }
                    },
                    function () {
                        innerComplete = true;
                    },
                    void 0,
                    function () {
                        if (innerComplete) {
                            try {
                                active--;
                                var _loop_1 = function () {
                                    var bufferedValue = buffer.shift();
                                    if (innerSubScheduler) {
                                        executeSchedule(subscriber, innerSubScheduler, function () {
                                            return doInnerSub(bufferedValue);
                                        });
                                    } else {
                                        doInnerSub(bufferedValue);
                                    }
                                };
                                while (buffer.length && active < concurrent) {
                                    _loop_1();
                                }
                                checkComplete();
                            } catch (err) {
                                subscriber.error(err);
                            }
                        }
                    }
                )
            );
        };
        source.subscribe(
            createOperatorSubscriber(subscriber, outerNext, function () {
                isComplete = true;
                checkComplete();
            })
        );
        return function () {
            additionalFinalizer === null || additionalFinalizer === void 0
                ? void 0
            : additionalFinalizer();
        };
    }
    function mergeMap(project, resultSelector, concurrent) {
        if (concurrent === void 0) {
            concurrent = Infinity;
        }
        if (isFunction(resultSelector)) {
            return mergeMap(function (a, i) {
                return map(function (b, ii) {
                    return resultSelector(a, b, i, ii);
                })(innerFrom(project(a, i)));
            }, concurrent);
        } else if (typeof resultSelector === "number") {
            concurrent = resultSelector;
        }
        return operate(function (source, subscriber) {
            return mergeInternals(source, subscriber, project, concurrent);
        });
    }
    function mergeAll(concurrent) {
        if (concurrent === void 0) {
            concurrent = Infinity;
        }
        return mergeMap(identity, concurrent);
    }
    function concatAll() {
        return mergeAll(1);
    }
    function concatMap(project, resultSelector) {
        return isFunction(resultSelector)
            ? mergeMap(project, resultSelector, 1)
        : mergeMap(project, 1);
    }
    class IframeUtils {
        static getIframes(element) {
            return Array.from(element.querySelectorAll("iframe"));
        }
        static getAllNestedIframes(element) {
            const iframes = IframeUtils.getIframes(element);
            if (iframes.length === 0) {
                return rxjs.of([]);
            } else {
                return rxjs.from(iframes).pipe(
                    mergeMap(
                        (iframe) =>
                        new rxjs.Observable((subscriber) => {
                            if (
                                iframe.contentDocument &&
                                iframe.contentDocument.readyState === "complete"
                            ) {
                                const iframeDocument = iframe.contentDocument;
                                const nestedIframes = IframeUtils.getAllNestedIframes(
                                    iframeDocument.documentElement
                                );
                                nestedIframes.subscribe((nestedIframes2) => {
                                    subscriber.next([iframe, ...nestedIframes2]);
                                    subscriber.complete();
                                });
                            } else {
                                rxjs
                                    .fromEvent(iframe, "load")
                                    .pipe(
                                    map(() => {
                                        if (iframe.contentDocument) {
                                            return iframe.contentDocument.documentElement;
                                        } else {
                                            return document.createElement("div");
                                        }
                                    }),
                                    map((doc) => IframeUtils.getAllNestedIframes(doc)),
                                    concatAll()
                                )
                                    .subscribe((nestedIframes) => {
                                    subscriber.next([iframe, ...nestedIframes]);
                                    subscriber.complete();
                                });
                            }
                        })
                    ),
                    concatAll(),
                    rxjs.toArray()
                );
            }
        }
    }
    class XMLHttpRequestInterceptor {
        constructor(urlList, callback) {
            __publicField(this, "xhr");
            __publicField(this, "originalOpen");
            __publicField(this, "callback");
            this.xhr = new XMLHttpRequest();
            this.originalOpen = this.xhr.open;
            this.callback = callback;
            this.intercept(urlList);
        }
        intercept(urlList) {
            const self = this;
            XMLHttpRequest.prototype.open = function (
            method,
             url2,
             async,
             user,
             password
            ) {
                if (urlList.some((urlItem) => url2.includes(urlItem))) {
                    self.callback(method, url2);
                }
                return self.originalOpen.apply(this, [
                    method,
                    url2,
                    async,
                    user,
                    password,
                ]);
            };
        }
    }
    var Typr$1 = {};
    var Typr = {};
    Typr.parse = function (buff) {
        var bin = Typr._bin;
        var data = new Uint8Array(buff);
        var tag = bin.readASCII(data, 0, 4);
        if (tag == "ttcf") {
            var offset = 4;
            bin.readUshort(data, offset);
            offset += 2;
            bin.readUshort(data, offset);
            offset += 2;
            var numF = bin.readUint(data, offset);
            offset += 4;
            var fnts = [];
            for (var i = 0; i < numF; i++) {
                var foff = bin.readUint(data, offset);
                offset += 4;
                fnts.push(Typr._readFont(data, foff));
            }
            return fnts;
        } else return [Typr._readFont(data, 0)];
    };
    Typr._readFont = function (data, offset) {
        var bin = Typr._bin;
        var ooff = offset;
        bin.readFixed(data, offset);
        offset += 4;
        var numTables = bin.readUshort(data, offset);
        offset += 2;
        bin.readUshort(data, offset);
        offset += 2;
        bin.readUshort(data, offset);
        offset += 2;
        bin.readUshort(data, offset);
        offset += 2;
        var tags = [
            "cmap",
            "head",
            "hhea",
            "maxp",
            "hmtx",
            "name",
            "OS/2",
            "post",
            //"cvt",
            //"fpgm",
            "loca",
            "glyf",
            "kern",
            //"prep"
            //"gasp"
            "CFF ",
            "GPOS",
            "GSUB",
            "SVG ",
            //"VORG",
        ];
        var obj = { _data: data, _offset: ooff };
        var tabs = {};
        for (var i = 0; i < numTables; i++) {
            var tag = bin.readASCII(data, offset, 4);
            offset += 4;
            bin.readUint(data, offset);
            offset += 4;
            var toffset = bin.readUint(data, offset);
            offset += 4;
            var length = bin.readUint(data, offset);
            offset += 4;
            tabs[tag] = { offset: toffset, length };
        }
        for (var i = 0; i < tags.length; i++) {
            var t = tags[i];
            if (tabs[t])
                obj[t.trim()] = Typr[t.trim()].parse(
                    data,
                    tabs[t].offset,
                    tabs[t].length,
                    obj
                );
        }
        return obj;
    };
    Typr._tabOffset = function (data, tab, foff) {
        var bin = Typr._bin;
        var numTables = bin.readUshort(data, foff + 4);
        var offset = foff + 12;
        for (var i = 0; i < numTables; i++) {
            var tag = bin.readASCII(data, offset, 4);
            offset += 4;
            bin.readUint(data, offset);
            offset += 4;
            var toffset = bin.readUint(data, offset);
            offset += 4;
            bin.readUint(data, offset);
            offset += 4;
            if (tag == tab) return toffset;
        }
        return 0;
    };
    Typr._bin = {
        readFixed: function (data, o) {
            return (
                ((data[o] << 8) | data[o + 1]) +
                ((data[o + 2] << 8) | data[o + 3]) / (256 * 256 + 4)
            );
        },
        readF2dot14: function (data, o) {
            var num = Typr._bin.readShort(data, o);
            return num / 16384;
        },
        readInt: function (buff, p) {
            return Typr._bin._view(buff).getInt32(p);
        },
        readInt8: function (buff, p) {
            return Typr._bin._view(buff).getInt8(p);
        },
        readShort: function (buff, p) {
            return Typr._bin._view(buff).getInt16(p);
        },
        readUshort: function (buff, p) {
            return Typr._bin._view(buff).getUint16(p);
        },
        readUshorts: function (buff, p, len) {
            var arr = [];
            for (var i = 0; i < len; i++)
                arr.push(Typr._bin.readUshort(buff, p + i * 2));
            return arr;
        },
        readUint: function (buff, p) {
            return Typr._bin._view(buff).getUint32(p);
        },
        readUint64: function (buff, p) {
            return (
                Typr._bin.readUint(buff, p) * (4294967295 + 1) +
                Typr._bin.readUint(buff, p + 4)
            );
        },
        readASCII: function (buff, p, l) {
            var s = "";
            for (var i = 0; i < l; i++) s += String.fromCharCode(buff[p + i]);
            return s;
        },
        readUnicode: function (buff, p, l) {
            var s = "";
            for (var i = 0; i < l; i++) {
                var c = (buff[p++] << 8) | buff[p++];
                s += String.fromCharCode(c);
            }
            return s;
        },
        _tdec:
        typeof window !== "undefined" && window["TextDecoder"]
        ? new window["TextDecoder"]()
        : null,
        readUTF8: function (buff, p, l) {
            var tdec = Typr._bin._tdec;
            if (tdec && p == 0 && l == buff.length) return tdec["decode"](buff);
            return Typr._bin.readASCII(buff, p, l);
        },
        readBytes: function (buff, p, l) {
            var arr = [];
            for (var i = 0; i < l; i++) arr.push(buff[p + i]);
            return arr;
        },
        readASCIIArray: function (buff, p, l) {
            var s = [];
            for (var i = 0; i < l; i++) s.push(String.fromCharCode(buff[p + i]));
            return s;
        },
        _view: function (buff) {
            return (
                buff._dataView ||
                (buff._dataView = buff.buffer
                 ? new DataView(buff.buffer, buff.byteOffset, buff.byteLength)
                 : new DataView(new Uint8Array(buff).buffer))
            );
        },
    };
    Typr._lctf = {};
    Typr._lctf.parse = function (data, offset, length, font, subt) {
        var bin = Typr._bin;
        var obj = {};
        var offset0 = offset;
        bin.readFixed(data, offset);
        offset += 4;
        var offScriptList = bin.readUshort(data, offset);
        offset += 2;
        var offFeatureList = bin.readUshort(data, offset);
        offset += 2;
        var offLookupList = bin.readUshort(data, offset);
        offset += 2;
        obj.scriptList = Typr._lctf.readScriptList(data, offset0 + offScriptList);
        obj.featureList = Typr._lctf.readFeatureList(
            data,
            offset0 + offFeatureList
        );
        obj.lookupList = Typr._lctf.readLookupList(
            data,
            offset0 + offLookupList,
            subt
        );
        return obj;
    };
    Typr._lctf.readLookupList = function (data, offset, subt) {
        var bin = Typr._bin;
        var offset0 = offset;
        var obj = [];
        var count = bin.readUshort(data, offset);
        offset += 2;
        for (var i = 0; i < count; i++) {
            var noff = bin.readUshort(data, offset);
            offset += 2;
            var lut = Typr._lctf.readLookupTable(data, offset0 + noff, subt);
            obj.push(lut);
        }
        return obj;
    };
    Typr._lctf.readLookupTable = function (data, offset, subt) {
        var bin = Typr._bin;
        var offset0 = offset;
        var obj = { tabs: [] };
        obj.ltype = bin.readUshort(data, offset);
        offset += 2;
        obj.flag = bin.readUshort(data, offset);
        offset += 2;
        var cnt = bin.readUshort(data, offset);
        offset += 2;
        var ltype = obj.ltype;
        for (var i = 0; i < cnt; i++) {
            var noff = bin.readUshort(data, offset);
            offset += 2;
            var tab = subt(data, ltype, offset0 + noff, obj);
            obj.tabs.push(tab);
        }
        return obj;
    };
    Typr._lctf.numOfOnes = function (n) {
        var num = 0;
        for (var i = 0; i < 32; i++) if (((n >>> i) & 1) != 0) num++;
        return num;
    };
    Typr._lctf.readClassDef = function (data, offset) {
        var bin = Typr._bin;
        var obj = [];
        var format = bin.readUshort(data, offset);
        offset += 2;
        if (format == 1) {
            var startGlyph = bin.readUshort(data, offset);
            offset += 2;
            var glyphCount = bin.readUshort(data, offset);
            offset += 2;
            for (var i = 0; i < glyphCount; i++) {
                obj.push(startGlyph + i);
                obj.push(startGlyph + i);
                obj.push(bin.readUshort(data, offset));
                offset += 2;
            }
        }
        if (format == 2) {
            var count = bin.readUshort(data, offset);
            offset += 2;
            for (var i = 0; i < count; i++) {
                obj.push(bin.readUshort(data, offset));
                offset += 2;
                obj.push(bin.readUshort(data, offset));
                offset += 2;
                obj.push(bin.readUshort(data, offset));
                offset += 2;
            }
        }
        return obj;
    };
    Typr._lctf.getInterval = function (tab, val) {
        for (var i = 0; i < tab.length; i += 3) {
            var start = tab[i],
                end = tab[i + 1];
            tab[i + 2];
            if (start <= val && val <= end) return i;
        }
        return -1;
    };
    Typr._lctf.readCoverage = function (data, offset) {
        var bin = Typr._bin;
        var cvg = {};
        cvg.fmt = bin.readUshort(data, offset);
        offset += 2;
        var count = bin.readUshort(data, offset);
        offset += 2;
        if (cvg.fmt == 1) cvg.tab = bin.readUshorts(data, offset, count);
        if (cvg.fmt == 2) cvg.tab = bin.readUshorts(data, offset, count * 3);
        return cvg;
    };
    Typr._lctf.coverageIndex = function (cvg, val) {
        var tab = cvg.tab;
        if (cvg.fmt == 1) return tab.indexOf(val);
        if (cvg.fmt == 2) {
            var ind = Typr._lctf.getInterval(tab, val);
            if (ind != -1) return tab[ind + 2] + (val - tab[ind]);
        }
        return -1;
    };
    Typr._lctf.readFeatureList = function (data, offset) {
        var bin = Typr._bin;
        var offset0 = offset;
        var obj = [];
        var count = bin.readUshort(data, offset);
        offset += 2;
        for (var i = 0; i < count; i++) {
            var tag = bin.readASCII(data, offset, 4);
            offset += 4;
            var noff = bin.readUshort(data, offset);
            offset += 2;
            var feat = Typr._lctf.readFeatureTable(data, offset0 + noff);
            feat.tag = tag.trim();
            obj.push(feat);
        }
        return obj;
    };
    Typr._lctf.readFeatureTable = function (data, offset) {
        var bin = Typr._bin;
        var offset0 = offset;
        var feat = {};
        var featureParams = bin.readUshort(data, offset);
        offset += 2;
        if (featureParams > 0) {
            feat.featureParams = offset0 + featureParams;
        }
        var lookupCount = bin.readUshort(data, offset);
        offset += 2;
        feat.tab = [];
        for (var i = 0; i < lookupCount; i++)
            feat.tab.push(bin.readUshort(data, offset + 2 * i));
        return feat;
    };
    Typr._lctf.readScriptList = function (data, offset) {
        var bin = Typr._bin;
        var offset0 = offset;
        var obj = {};
        var count = bin.readUshort(data, offset);
        offset += 2;
        for (var i = 0; i < count; i++) {
            var tag = bin.readASCII(data, offset, 4);
            offset += 4;
            var noff = bin.readUshort(data, offset);
            offset += 2;
            obj[tag.trim()] = Typr._lctf.readScriptTable(data, offset0 + noff);
        }
        return obj;
    };
    Typr._lctf.readScriptTable = function (data, offset) {
        var bin = Typr._bin;
        var offset0 = offset;
        var obj = {};
        var defLangSysOff = bin.readUshort(data, offset);
        offset += 2;
        obj["default"] = Typr._lctf.readLangSysTable(data, offset0 + defLangSysOff);
        var langSysCount = bin.readUshort(data, offset);
        offset += 2;
        for (var i = 0; i < langSysCount; i++) {
            var tag = bin.readASCII(data, offset, 4);
            offset += 4;
            var langSysOff = bin.readUshort(data, offset);
            offset += 2;
            obj[tag.trim()] = Typr._lctf.readLangSysTable(data, offset0 + langSysOff);
        }
        return obj;
    };
    Typr._lctf.readLangSysTable = function (data, offset) {
        var bin = Typr._bin;
        var obj = {};
        bin.readUshort(data, offset);
        offset += 2;
        obj.reqFeature = bin.readUshort(data, offset);
        offset += 2;
        var featureCount = bin.readUshort(data, offset);
        offset += 2;
        obj.features = bin.readUshorts(data, offset, featureCount);
        return obj;
    };
    Typr.CFF = {};
    Typr.CFF.parse = function (data, offset, length) {
        var bin = Typr._bin;
        data = new Uint8Array(data.buffer, offset, length);
        offset = 0;
        data[offset];
        offset++;
        data[offset];
        offset++;
        data[offset];
        offset++;
        data[offset];
        offset++;
        var ninds = [];
        offset = Typr.CFF.readIndex(data, offset, ninds);
        var names = [];
        for (var i = 0; i < ninds.length - 1; i++)
            names.push(
                bin.readASCII(data, offset + ninds[i], ninds[i + 1] - ninds[i])
            );
        offset += ninds[ninds.length - 1];
        var tdinds = [];
        offset = Typr.CFF.readIndex(data, offset, tdinds);
        var topDicts = [];
        for (var i = 0; i < tdinds.length - 1; i++)
            topDicts.push(
                Typr.CFF.readDict(data, offset + tdinds[i], offset + tdinds[i + 1])
            );
        offset += tdinds[tdinds.length - 1];
        var topdict = topDicts[0];
        var sinds = [];
        offset = Typr.CFF.readIndex(data, offset, sinds);
        var strings = [];
        for (var i = 0; i < sinds.length - 1; i++)
            strings.push(
                bin.readASCII(data, offset + sinds[i], sinds[i + 1] - sinds[i])
            );
        offset += sinds[sinds.length - 1];
        Typr.CFF.readSubrs(data, offset, topdict);
        if (topdict.CharStrings) {
            offset = topdict.CharStrings;
            var sinds = [];
            offset = Typr.CFF.readIndex(data, offset, sinds);
            var cstr = [];
            for (var i = 0; i < sinds.length - 1; i++)
                cstr.push(
                    bin.readBytes(data, offset + sinds[i], sinds[i + 1] - sinds[i])
                );
            topdict.CharStrings = cstr;
        }
        if (topdict.ROS) {
            offset = topdict.FDArray;
            var fdind = [];
            offset = Typr.CFF.readIndex(data, offset, fdind);
            topdict.FDArray = [];
            for (var i = 0; i < fdind.length - 1; i++) {
                var dict = Typr.CFF.readDict(
                    data,
                    offset + fdind[i],
                    offset + fdind[i + 1]
                );
                Typr.CFF._readFDict(data, dict, strings);
                topdict.FDArray.push(dict);
            }
            offset += fdind[fdind.length - 1];
            offset = topdict.FDSelect;
            topdict.FDSelect = [];
            var fmt = data[offset];
            offset++;
            if (fmt == 3) {
                var rns = bin.readUshort(data, offset);
                offset += 2;
                for (var i = 0; i < rns + 1; i++) {
                    topdict.FDSelect.push(bin.readUshort(data, offset), data[offset + 2]);
                    offset += 3;
                }
            } else throw fmt;
        }
        if (topdict.Encoding)
            topdict.Encoding = Typr.CFF.readEncoding(
                data,
                topdict.Encoding,
                topdict.CharStrings.length
            );
        if (topdict.charset)
            topdict.charset = Typr.CFF.readCharset(
                data,
                topdict.charset,
                topdict.CharStrings.length
            );
        Typr.CFF._readFDict(data, topdict, strings);
        return topdict;
    };
    Typr.CFF._readFDict = function (data, dict, ss) {
        var offset;
        if (dict.Private) {
            offset = dict.Private[1];
            dict.Private = Typr.CFF.readDict(data, offset, offset + dict.Private[0]);
            if (dict.Private.Subrs)
                Typr.CFF.readSubrs(data, offset + dict.Private.Subrs, dict.Private);
        }
        for (var p in dict)
            if (
                [
                    "FamilyName",
                    "FontName",
                    "FullName",
                    "Notice",
                    "version",
                    "Copyright",
                ].indexOf(p) != -1
            )
                dict[p] = ss[dict[p] - 426 + 35];
    };
    Typr.CFF.readSubrs = function (data, offset, obj) {
        var bin = Typr._bin;
        var gsubinds = [];
        offset = Typr.CFF.readIndex(data, offset, gsubinds);
        var bias,
            nSubrs = gsubinds.length;
        if (nSubrs < 1240) bias = 107;
        else if (nSubrs < 33900) bias = 1131;
        else bias = 32768;
        obj.Bias = bias;
        obj.Subrs = [];
        for (var i = 0; i < gsubinds.length - 1; i++)
            obj.Subrs.push(
                bin.readBytes(data, offset + gsubinds[i], gsubinds[i + 1] - gsubinds[i])
            );
    };
    Typr.CFF.tableSE = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
        17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
        36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54,
        55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73,
        74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92,
        93, 94, 95, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 96, 97, 98, 99, 100, 101, 102, 103,
        104, 105, 106, 107, 108, 109, 110, 0, 111, 112, 113, 114, 0, 115, 116, 117,
        118, 119, 120, 121, 122, 0, 123, 0, 124, 125, 126, 127, 128, 129, 130, 131,
        0, 132, 133, 0, 134, 135, 136, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 138, 0, 139, 0, 0, 0, 0, 140, 141, 142, 143, 0, 0, 0, 0, 0, 144, 0,
        0, 0, 145, 0, 0, 146, 147, 148, 149, 0, 0, 0, 0,
    ];
    Typr.CFF.glyphByUnicode = function (cff, code) {
        for (var i = 0; i < cff.charset.length; i++)
            if (cff.charset[i] == code) return i;
        return -1;
    };
    Typr.CFF.glyphBySE = function (cff, charcode) {
        if (charcode < 0 || charcode > 255) return -1;
        return Typr.CFF.glyphByUnicode(cff, Typr.CFF.tableSE[charcode]);
    };
    Typr.CFF.readEncoding = function (data, offset, num) {
        Typr._bin;
        var array = [".notdef"];
        var format = data[offset];
        offset++;
        if (format == 0) {
            var nCodes = data[offset];
            offset++;
            for (var i = 0; i < nCodes; i++) array.push(data[offset + i]);
        } else throw "error: unknown encoding format: " + format;
        return array;
    };
    Typr.CFF.readCharset = function (data, offset, num) {
        var bin = Typr._bin;
        var charset = [".notdef"];
        var format = data[offset];
        offset++;
        if (format == 0) {
            for (var i = 0; i < num; i++) {
                var first = bin.readUshort(data, offset);
                offset += 2;
                charset.push(first);
            }
        } else if (format == 1 || format == 2) {
            while (charset.length < num) {
                var first = bin.readUshort(data, offset);
                offset += 2;
                var nLeft = 0;
                if (format == 1) {
                    nLeft = data[offset];
                    offset++;
                } else {
                    nLeft = bin.readUshort(data, offset);
                    offset += 2;
                }
                for (var i = 0; i <= nLeft; i++) {
                    charset.push(first);
                    first++;
                }
            }
        } else throw "error: format: " + format;
        return charset;
    };
    Typr.CFF.readIndex = function (data, offset, inds) {
        var bin = Typr._bin;
        var count = bin.readUshort(data, offset) + 1;
        offset += 2;
        var offsize = data[offset];
        offset++;
        if (offsize == 1)
            for (var i = 0; i < count; i++) inds.push(data[offset + i]);
        else if (offsize == 2)
            for (var i = 0; i < count; i++)
                inds.push(bin.readUshort(data, offset + i * 2));
        else if (offsize == 3)
            for (var i = 0; i < count; i++)
                inds.push(bin.readUint(data, offset + i * 3 - 1) & 16777215);
        else if (count != 1)
            throw "unsupported offset size: " + offsize + ", count: " + count;
        offset += count * offsize;
        return offset - 1;
    };
    Typr.CFF.getCharString = function (data, offset, o) {
        var bin = Typr._bin;
        var b0 = data[offset],
            b1 = data[offset + 1];
        data[offset + 2];
        data[offset + 3];
        data[offset + 4];
        var vs = 1;
        var op = null,
            val = null;
        if (b0 <= 20) {
            op = b0;
            vs = 1;
        }
        if (b0 == 12) {
            op = b0 * 100 + b1;
            vs = 2;
        }
        if (21 <= b0 && b0 <= 27) {
            op = b0;
            vs = 1;
        }
        if (b0 == 28) {
            val = bin.readShort(data, offset + 1);
            vs = 3;
        }
        if (29 <= b0 && b0 <= 31) {
            op = b0;
            vs = 1;
        }
        if (32 <= b0 && b0 <= 246) {
            val = b0 - 139;
            vs = 1;
        }
        if (247 <= b0 && b0 <= 250) {
            val = (b0 - 247) * 256 + b1 + 108;
            vs = 2;
        }
        if (251 <= b0 && b0 <= 254) {
            val = -(b0 - 251) * 256 - b1 - 108;
            vs = 2;
        }
        if (b0 == 255) {
            val = bin.readInt(data, offset + 1) / 65535;
            vs = 5;
        }
        o.val = val != null ? val : "o" + op;
        o.size = vs;
    };
    Typr.CFF.readCharString = function (data, offset, length) {
        var end = offset + length;
        var bin = Typr._bin;
        var arr = [];
        while (offset < end) {
            var b0 = data[offset],
                b1 = data[offset + 1];
            data[offset + 2];
            data[offset + 3];
            data[offset + 4];
            var vs = 1;
            var op = null,
                val = null;
            if (b0 <= 20) {
                op = b0;
                vs = 1;
            }
            if (b0 == 12) {
                op = b0 * 100 + b1;
                vs = 2;
            }
            if (b0 == 19 || b0 == 20) {
                op = b0;
                vs = 2;
            }
            if (21 <= b0 && b0 <= 27) {
                op = b0;
                vs = 1;
            }
            if (b0 == 28) {
                val = bin.readShort(data, offset + 1);
                vs = 3;
            }
            if (29 <= b0 && b0 <= 31) {
                op = b0;
                vs = 1;
            }
            if (32 <= b0 && b0 <= 246) {
                val = b0 - 139;
                vs = 1;
            }
            if (247 <= b0 && b0 <= 250) {
                val = (b0 - 247) * 256 + b1 + 108;
                vs = 2;
            }
            if (251 <= b0 && b0 <= 254) {
                val = -(b0 - 251) * 256 - b1 - 108;
                vs = 2;
            }
            if (b0 == 255) {
                val = bin.readInt(data, offset + 1) / 65535;
                vs = 5;
            }
            arr.push(val != null ? val : "o" + op);
            offset += vs;
        }
        return arr;
    };
    Typr.CFF.readDict = function (data, offset, end) {
        var bin = Typr._bin;
        var dict = {};
        var carr = [];
        while (offset < end) {
            var b0 = data[offset],
                b1 = data[offset + 1];
            data[offset + 2];
            data[offset + 3];
            data[offset + 4];
            var vs = 1;
            var key = null,
                val = null;
            if (b0 == 28) {
                val = bin.readShort(data, offset + 1);
                vs = 3;
            }
            if (b0 == 29) {
                val = bin.readInt(data, offset + 1);
                vs = 5;
            }
            if (32 <= b0 && b0 <= 246) {
                val = b0 - 139;
                vs = 1;
            }
            if (247 <= b0 && b0 <= 250) {
                val = (b0 - 247) * 256 + b1 + 108;
                vs = 2;
            }
            if (251 <= b0 && b0 <= 254) {
                val = -(b0 - 251) * 256 - b1 - 108;
                vs = 2;
            }
            if (b0 == 255) {
                val = bin.readInt(data, offset + 1) / 65535;
                vs = 5;
                throw "unknown number";
            }
            if (b0 == 30) {
                var nibs = [];
                vs = 1;
                while (true) {
                    var b = data[offset + vs];
                    vs++;
                    var nib0 = b >> 4,
                        nib1 = b & 15;
                    if (nib0 != 15) nibs.push(nib0);
                    if (nib1 != 15) nibs.push(nib1);
                    if (nib1 == 15) break;
                }
                var s = "";
                var chars = [
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    ".",
                    "e",
                    "e-",
                    "reserved",
                    "-",
                    "endOfNumber",
                ];
                for (var i = 0; i < nibs.length; i++) s += chars[nibs[i]];
                val = parseFloat(s);
            }
            if (b0 <= 21) {
                var keys = [
                    "version",
                    "Notice",
                    "FullName",
                    "FamilyName",
                    "Weight",
                    "FontBBox",
                    "BlueValues",
                    "OtherBlues",
                    "FamilyBlues",
                    "FamilyOtherBlues",
                    "StdHW",
                    "StdVW",
                    "escape",
                    "UniqueID",
                    "XUID",
                    "charset",
                    "Encoding",
                    "CharStrings",
                    "Private",
                    "Subrs",
                    "defaultWidthX",
                    "nominalWidthX",
                ];
                key = keys[b0];
                vs = 1;
                if (b0 == 12) {
                    var keys = [
                        "Copyright",
                        "isFixedPitch",
                        "ItalicAngle",
                        "UnderlinePosition",
                        "UnderlineThickness",
                        "PaintType",
                        "CharstringType",
                        "FontMatrix",
                        "StrokeWidth",
                        "BlueScale",
                        "BlueShift",
                        "BlueFuzz",
                        "StemSnapH",
                        "StemSnapV",
                        "ForceBold",
                        0,
                        0,
                        "LanguageGroup",
                        "ExpansionFactor",
                        "initialRandomSeed",
                        "SyntheticBase",
                        "PostScript",
                        "BaseFontName",
                        "BaseFontBlend",
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        "ROS",
                        "CIDFontVersion",
                        "CIDFontRevision",
                        "CIDFontType",
                        "CIDCount",
                        "UIDBase",
                        "FDArray",
                        "FDSelect",
                        "FontName",
                    ];
                    key = keys[b1];
                    vs = 2;
                }
            }
            if (key != null) {
                dict[key] = carr.length == 1 ? carr[0] : carr;
                carr = [];
            } else carr.push(val);
            offset += vs;
        }
        return dict;
    };
    Typr.cmap = {};
    Typr.cmap.parse = function (data, offset, length) {
        data = new Uint8Array(data.buffer, offset, length);
        offset = 0;
        var bin = Typr._bin;
        var obj = {};
        bin.readUshort(data, offset);
        offset += 2;
        var numTables = bin.readUshort(data, offset);
        offset += 2;
        var offs = [];
        obj.tables = [];
        for (var i = 0; i < numTables; i++) {
            var platformID = bin.readUshort(data, offset);
            offset += 2;
            var encodingID = bin.readUshort(data, offset);
            offset += 2;
            var noffset = bin.readUint(data, offset);
            offset += 4;
            var id = "p" + platformID + "e" + encodingID;
            var tind = offs.indexOf(noffset);
            if (tind == -1) {
                tind = obj.tables.length;
                var subt;
                offs.push(noffset);
                var format = bin.readUshort(data, noffset);
                if (format == 0) subt = Typr.cmap.parse0(data, noffset);
                else if (format == 4) subt = Typr.cmap.parse4(data, noffset);
                else if (format == 6) subt = Typr.cmap.parse6(data, noffset);
                else if (format == 12) subt = Typr.cmap.parse12(data, noffset);
                else
                    console.warn(
                        "unknown format: " + format,
                        platformID,
                        encodingID,
                        noffset
                    );
                obj.tables.push(subt);
            }
            if (obj[id] != null) throw "multiple tables for one platform+encoding";
            obj[id] = tind;
        }
        return obj;
    };
    Typr.cmap.parse0 = function (data, offset) {
        var bin = Typr._bin;
        var obj = {};
        obj.format = bin.readUshort(data, offset);
        offset += 2;
        var len = bin.readUshort(data, offset);
        offset += 2;
        bin.readUshort(data, offset);
        offset += 2;
        obj.map = [];
        for (var i = 0; i < len - 6; i++) obj.map.push(data[offset + i]);
        return obj;
    };
    Typr.cmap.parse4 = function (data, offset) {
        var bin = Typr._bin;
        var offset0 = offset;
        var obj = {};
        obj.format = bin.readUshort(data, offset);
        offset += 2;
        var length = bin.readUshort(data, offset);
        offset += 2;
        bin.readUshort(data, offset);
        offset += 2;
        var segCountX2 = bin.readUshort(data, offset);
        offset += 2;
        var segCount = segCountX2 / 2;
        obj.searchRange = bin.readUshort(data, offset);
        offset += 2;
        obj.entrySelector = bin.readUshort(data, offset);
        offset += 2;
        obj.rangeShift = bin.readUshort(data, offset);
        offset += 2;
        obj.endCount = bin.readUshorts(data, offset, segCount);
        offset += segCount * 2;
        offset += 2;
        obj.startCount = bin.readUshorts(data, offset, segCount);
        offset += segCount * 2;
        obj.idDelta = [];
        for (var i = 0; i < segCount; i++) {
            obj.idDelta.push(bin.readShort(data, offset));
            offset += 2;
        }
        obj.idRangeOffset = bin.readUshorts(data, offset, segCount);
        offset += segCount * 2;
        obj.glyphIdArray = [];
        while (offset < offset0 + length) {
            obj.glyphIdArray.push(bin.readUshort(data, offset));
            offset += 2;
        }
        return obj;
    };
    Typr.cmap.parse6 = function (data, offset) {
        var bin = Typr._bin;
        var obj = {};
        obj.format = bin.readUshort(data, offset);
        offset += 2;
        bin.readUshort(data, offset);
        offset += 2;
        bin.readUshort(data, offset);
        offset += 2;
        obj.firstCode = bin.readUshort(data, offset);
        offset += 2;
        var entryCount = bin.readUshort(data, offset);
        offset += 2;
        obj.glyphIdArray = [];
        for (var i = 0; i < entryCount; i++) {
            obj.glyphIdArray.push(bin.readUshort(data, offset));
            offset += 2;
        }
        return obj;
    };
    Typr.cmap.parse12 = function (data, offset) {
        var bin = Typr._bin;
        var obj = {};
        obj.format = bin.readUshort(data, offset);
        offset += 2;
        offset += 2;
        bin.readUint(data, offset);
        offset += 4;
        bin.readUint(data, offset);
        offset += 4;
        var nGroups = bin.readUint(data, offset);
        offset += 4;
        obj.groups = [];
        for (var i = 0; i < nGroups; i++) {
            var off = offset + i * 12;
            var startCharCode = bin.readUint(data, off + 0);
            var endCharCode = bin.readUint(data, off + 4);
            var startGlyphID = bin.readUint(data, off + 8);
            obj.groups.push([startCharCode, endCharCode, startGlyphID]);
        }
        return obj;
    };
    Typr.glyf = {};
    Typr.glyf.parse = function (data, offset, length, font) {
        var obj = [];
        for (var g = 0; g < font.maxp.numGlyphs; g++) obj.push(null);
        return obj;
    };
    Typr.glyf._parseGlyf = function (font, g) {
        var bin = Typr._bin;
        var data = font._data;
        var offset = Typr._tabOffset(data, "glyf", font._offset) + font.loca[g];
        if (font.loca[g] == font.loca[g + 1]) return null;
        var gl = {};
        gl.noc = bin.readShort(data, offset);
        offset += 2;
        gl.xMin = bin.readShort(data, offset);
        offset += 2;
        gl.yMin = bin.readShort(data, offset);
        offset += 2;
        gl.xMax = bin.readShort(data, offset);
        offset += 2;
        gl.yMax = bin.readShort(data, offset);
        offset += 2;
        if (gl.xMin >= gl.xMax || gl.yMin >= gl.yMax) return null;
        if (gl.noc > 0) {
            gl.endPts = [];
            for (var i = 0; i < gl.noc; i++) {
                gl.endPts.push(bin.readUshort(data, offset));
                offset += 2;
            }
            var instructionLength = bin.readUshort(data, offset);
            offset += 2;
            if (data.length - offset < instructionLength) return null;
            gl.instructions = bin.readBytes(data, offset, instructionLength);
            offset += instructionLength;
            var crdnum = gl.endPts[gl.noc - 1] + 1;
            gl.flags = [];
            for (var i = 0; i < crdnum; i++) {
                var flag = data[offset];
                offset++;
                gl.flags.push(flag);
                if ((flag & 8) != 0) {
                    var rep = data[offset];
                    offset++;
                    for (var j = 0; j < rep; j++) {
                        gl.flags.push(flag);
                        i++;
                    }
                }
            }
            gl.xs = [];
            for (var i = 0; i < crdnum; i++) {
                var i8 = (gl.flags[i] & 2) != 0,
                    same = (gl.flags[i] & 16) != 0;
                if (i8) {
                    gl.xs.push(same ? data[offset] : -data[offset]);
                    offset++;
                } else {
                    if (same) gl.xs.push(0);
                    else {
                        gl.xs.push(bin.readShort(data, offset));
                        offset += 2;
                    }
                }
            }
            gl.ys = [];
            for (var i = 0; i < crdnum; i++) {
                var i8 = (gl.flags[i] & 4) != 0,
                    same = (gl.flags[i] & 32) != 0;
                if (i8) {
                    gl.ys.push(same ? data[offset] : -data[offset]);
                    offset++;
                } else {
                    if (same) gl.ys.push(0);
                    else {
                        gl.ys.push(bin.readShort(data, offset));
                        offset += 2;
                    }
                }
            }
            var x = 0,
                y = 0;
            for (var i = 0; i < crdnum; i++) {
                x += gl.xs[i];
                y += gl.ys[i];
                gl.xs[i] = x;
                gl.ys[i] = y;
            }
        } else {
            var ARG_1_AND_2_ARE_WORDS = 1 << 0;
            var ARGS_ARE_XY_VALUES = 1 << 1;
            var WE_HAVE_A_SCALE = 1 << 3;
            var MORE_COMPONENTS = 1 << 5;
            var WE_HAVE_AN_X_AND_Y_SCALE = 1 << 6;
            var WE_HAVE_A_TWO_BY_TWO = 1 << 7;
            var WE_HAVE_INSTRUCTIONS = 1 << 8;
            gl.parts = [];
            var flags;
            do {
                flags = bin.readUshort(data, offset);
                offset += 2;
                var part = {
                    m: { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 },
                    p1: -1,
                    p2: -1,
                };
                gl.parts.push(part);
                part.glyphIndex = bin.readUshort(data, offset);
                offset += 2;
                if (flags & ARG_1_AND_2_ARE_WORDS) {
                    var arg1 = bin.readShort(data, offset);
                    offset += 2;
                    var arg2 = bin.readShort(data, offset);
                    offset += 2;
                } else {
                    var arg1 = bin.readInt8(data, offset);
                    offset++;
                    var arg2 = bin.readInt8(data, offset);
                    offset++;
                }
                if (flags & ARGS_ARE_XY_VALUES) {
                    part.m.tx = arg1;
                    part.m.ty = arg2;
                } else {
                    part.p1 = arg1;
                    part.p2 = arg2;
                }
                if (flags & WE_HAVE_A_SCALE) {
                    part.m.a = part.m.d = bin.readF2dot14(data, offset);
                    offset += 2;
                } else if (flags & WE_HAVE_AN_X_AND_Y_SCALE) {
                    part.m.a = bin.readF2dot14(data, offset);
                    offset += 2;
                    part.m.d = bin.readF2dot14(data, offset);
                    offset += 2;
                } else if (flags & WE_HAVE_A_TWO_BY_TWO) {
                    part.m.a = bin.readF2dot14(data, offset);
                    offset += 2;
                    part.m.b = bin.readF2dot14(data, offset);
                    offset += 2;
                    part.m.c = bin.readF2dot14(data, offset);
                    offset += 2;
                    part.m.d = bin.readF2dot14(data, offset);
                    offset += 2;
                }
            } while (flags & MORE_COMPONENTS);
            if (flags & WE_HAVE_INSTRUCTIONS) {
                var numInstr = bin.readUshort(data, offset);
                offset += 2;
                gl.instr = [];
                for (var i = 0; i < numInstr; i++) {
                    gl.instr.push(data[offset]);
                    offset++;
                }
            }
        }
        return gl;
    };
    Typr.GPOS = {};
    Typr.GPOS.parse = function (data, offset, length, font) {
        return Typr._lctf.parse(data, offset, length, font, Typr.GPOS.subt);
    };
    Typr.GPOS.subt = function (data, ltype, offset, ltable) {
        var bin = Typr._bin,
            offset0 = offset,
            tab = {};
        tab.fmt = bin.readUshort(data, offset);
        offset += 2;
        if (
            ltype == 1 ||
            ltype == 2 ||
            ltype == 3 ||
            ltype == 7 ||
            (ltype == 8 && tab.fmt <= 2)
        ) {
            var covOff = bin.readUshort(data, offset);
            offset += 2;
            tab.coverage = Typr._lctf.readCoverage(data, covOff + offset0);
        }
        if (ltype == 1 && tab.fmt == 1) {
            var valFmt1 = bin.readUshort(data, offset);
            offset += 2;
            var ones1 = Typr._lctf.numOfOnes(valFmt1);
            if (valFmt1 != 0)
                tab.pos = Typr.GPOS.readValueRecord(data, offset, valFmt1);
        } else if (ltype == 2 && tab.fmt >= 1 && tab.fmt <= 2) {
            var valFmt1 = bin.readUshort(data, offset);
            offset += 2;
            var valFmt2 = bin.readUshort(data, offset);
            offset += 2;
            var ones1 = Typr._lctf.numOfOnes(valFmt1);
            var ones2 = Typr._lctf.numOfOnes(valFmt2);
            if (tab.fmt == 1) {
                tab.pairsets = [];
                var psc = bin.readUshort(data, offset);
                offset += 2;
                for (var i = 0; i < psc; i++) {
                    var psoff = offset0 + bin.readUshort(data, offset);
                    offset += 2;
                    var pvc = bin.readUshort(data, psoff);
                    psoff += 2;
                    var arr = [];
                    for (var j = 0; j < pvc; j++) {
                        var gid2 = bin.readUshort(data, psoff);
                        psoff += 2;
                        var value1, value2;
                        if (valFmt1 != 0) {
                            value1 = Typr.GPOS.readValueRecord(data, psoff, valFmt1);
                            psoff += ones1 * 2;
                        }
                        if (valFmt2 != 0) {
                            value2 = Typr.GPOS.readValueRecord(data, psoff, valFmt2);
                            psoff += ones2 * 2;
                        }
                        arr.push({ gid2, val1: value1, val2: value2 });
                    }
                    tab.pairsets.push(arr);
                }
            }
            if (tab.fmt == 2) {
                var classDef1 = bin.readUshort(data, offset);
                offset += 2;
                var classDef2 = bin.readUshort(data, offset);
                offset += 2;
                var class1Count = bin.readUshort(data, offset);
                offset += 2;
                var class2Count = bin.readUshort(data, offset);
                offset += 2;
                tab.classDef1 = Typr._lctf.readClassDef(data, offset0 + classDef1);
                tab.classDef2 = Typr._lctf.readClassDef(data, offset0 + classDef2);
                tab.matrix = [];
                for (var i = 0; i < class1Count; i++) {
                    var row = [];
                    for (var j = 0; j < class2Count; j++) {
                        var value1 = null,
                            value2 = null;
                        if (valFmt1 != 0) {
                            value1 = Typr.GPOS.readValueRecord(data, offset, valFmt1);
                            offset += ones1 * 2;
                        }
                        if (valFmt2 != 0) {
                            value2 = Typr.GPOS.readValueRecord(data, offset, valFmt2);
                            offset += ones2 * 2;
                        }
                        row.push({ val1: value1, val2: value2 });
                    }
                    tab.matrix.push(row);
                }
            }
        } else if (ltype == 9 && tab.fmt == 1) {
            var extType = bin.readUshort(data, offset);
            offset += 2;
            var extOffset = bin.readUint(data, offset);
            offset += 4;
            if (ltable.ltype == 9) {
                ltable.ltype = extType;
            } else if (ltable.ltype != extType) {
                throw "invalid extension substitution";
            }
            return Typr.GPOS.subt(data, ltable.ltype, offset0 + extOffset);
        } else
            console.warn(
                "unsupported GPOS table LookupType",
                ltype,
                "format",
                tab.fmt
            );
        return tab;
    };
    Typr.GPOS.readValueRecord = function (data, offset, valFmt) {
        var bin = Typr._bin;
        var arr = [];
        arr.push(valFmt & 1 ? bin.readShort(data, offset) : 0);
        offset += valFmt & 1 ? 2 : 0;
        arr.push(valFmt & 2 ? bin.readShort(data, offset) : 0);
        offset += valFmt & 2 ? 2 : 0;
        arr.push(valFmt & 4 ? bin.readShort(data, offset) : 0);
        offset += valFmt & 4 ? 2 : 0;
        arr.push(valFmt & 8 ? bin.readShort(data, offset) : 0);
        offset += valFmt & 8 ? 2 : 0;
        return arr;
    };
    Typr.GSUB = {};
    Typr.GSUB.parse = function (data, offset, length, font) {
        return Typr._lctf.parse(data, offset, length, font, Typr.GSUB.subt);
    };
    Typr.GSUB.subt = function (data, ltype, offset, ltable) {
        var bin = Typr._bin,
            offset0 = offset,
            tab = {};
        tab.fmt = bin.readUshort(data, offset);
        offset += 2;
        if (ltype != 1 && ltype != 4 && ltype != 5 && ltype != 6) return null;
        if (
            ltype == 1 ||
            ltype == 4 ||
            (ltype == 5 && tab.fmt <= 2) ||
            (ltype == 6 && tab.fmt <= 2)
        ) {
            var covOff = bin.readUshort(data, offset);
            offset += 2;
            tab.coverage = Typr._lctf.readCoverage(data, offset0 + covOff);
        }
        if (ltype == 1 && tab.fmt >= 1 && tab.fmt <= 2) {
            if (tab.fmt == 1) {
                tab.delta = bin.readShort(data, offset);
                offset += 2;
            } else if (tab.fmt == 2) {
                var cnt = bin.readUshort(data, offset);
                offset += 2;
                tab.newg = bin.readUshorts(data, offset, cnt);
                offset += tab.newg.length * 2;
            }
        } else if (ltype == 4) {
            tab.vals = [];
            var cnt = bin.readUshort(data, offset);
            offset += 2;
            for (var i = 0; i < cnt; i++) {
                var loff = bin.readUshort(data, offset);
                offset += 2;
                tab.vals.push(Typr.GSUB.readLigatureSet(data, offset0 + loff));
            }
        } else if (ltype == 5 && tab.fmt == 2) {
            if (tab.fmt == 2) {
                var cDefOffset = bin.readUshort(data, offset);
                offset += 2;
                tab.cDef = Typr._lctf.readClassDef(data, offset0 + cDefOffset);
                tab.scset = [];
                var subClassSetCount = bin.readUshort(data, offset);
                offset += 2;
                for (var i = 0; i < subClassSetCount; i++) {
                    var scsOff = bin.readUshort(data, offset);
                    offset += 2;
                    tab.scset.push(
                        scsOff == 0
                        ? null
                        : Typr.GSUB.readSubClassSet(data, offset0 + scsOff)
                    );
                }
            }
        } else if (ltype == 6 && tab.fmt == 3) {
            if (tab.fmt == 3) {
                for (var i = 0; i < 3; i++) {
                    var cnt = bin.readUshort(data, offset);
                    offset += 2;
                    var cvgs = [];
                    for (var j = 0; j < cnt; j++)
                        cvgs.push(
                            Typr._lctf.readCoverage(
                                data,
                                offset0 + bin.readUshort(data, offset + j * 2)
                            )
                        );
                    offset += cnt * 2;
                    if (i == 0) tab.backCvg = cvgs;
                    if (i == 1) tab.inptCvg = cvgs;
                    if (i == 2) tab.ahedCvg = cvgs;
                }
                var cnt = bin.readUshort(data, offset);
                offset += 2;
                tab.lookupRec = Typr.GSUB.readSubstLookupRecords(data, offset, cnt);
            }
        } else if (ltype == 7 && tab.fmt == 1) {
            var extType = bin.readUshort(data, offset);
            offset += 2;
            var extOffset = bin.readUint(data, offset);
            offset += 4;
            if (ltable.ltype == 9) {
                ltable.ltype = extType;
            } else if (ltable.ltype != extType) {
                throw "invalid extension substitution";
            }
            return Typr.GSUB.subt(data, ltable.ltype, offset0 + extOffset);
        } else
            console.warn(
                "unsupported GSUB table LookupType",
                ltype,
                "format",
                tab.fmt
            );
        return tab;
    };
    Typr.GSUB.readSubClassSet = function (data, offset) {
        var rUs = Typr._bin.readUshort,
            offset0 = offset,
            lset = [];
        var cnt = rUs(data, offset);
        offset += 2;
        for (var i = 0; i < cnt; i++) {
            var loff = rUs(data, offset);
            offset += 2;
            lset.push(Typr.GSUB.readSubClassRule(data, offset0 + loff));
        }
        return lset;
    };
    Typr.GSUB.readSubClassRule = function (data, offset) {
        var rUs = Typr._bin.readUshort,
            rule = {};
        var gcount = rUs(data, offset);
        offset += 2;
        var scount = rUs(data, offset);
        offset += 2;
        rule.input = [];
        for (var i = 0; i < gcount - 1; i++) {
            rule.input.push(rUs(data, offset));
            offset += 2;
        }
        rule.substLookupRecords = Typr.GSUB.readSubstLookupRecords(
            data,
            offset,
            scount
        );
        return rule;
    };
    Typr.GSUB.readSubstLookupRecords = function (data, offset, cnt) {
        var rUs = Typr._bin.readUshort;
        var out = [];
        for (var i = 0; i < cnt; i++) {
            out.push(rUs(data, offset), rUs(data, offset + 2));
            offset += 4;
        }
        return out;
    };
    Typr.GSUB.readChainSubClassSet = function (data, offset) {
        var bin = Typr._bin,
            offset0 = offset,
            lset = [];
        var cnt = bin.readUshort(data, offset);
        offset += 2;
        for (var i = 0; i < cnt; i++) {
            var loff = bin.readUshort(data, offset);
            offset += 2;
            lset.push(Typr.GSUB.readChainSubClassRule(data, offset0 + loff));
        }
        return lset;
    };
    Typr.GSUB.readChainSubClassRule = function (data, offset) {
        var bin = Typr._bin,
            rule = {};
        var pps = ["backtrack", "input", "lookahead"];
        for (var pi = 0; pi < pps.length; pi++) {
            var cnt = bin.readUshort(data, offset);
            offset += 2;
            if (pi == 1) cnt--;
            rule[pps[pi]] = bin.readUshorts(data, offset, cnt);
            offset += rule[pps[pi]].length * 2;
        }
        var cnt = bin.readUshort(data, offset);
        offset += 2;
        rule.subst = bin.readUshorts(data, offset, cnt * 2);
        offset += rule.subst.length * 2;
        return rule;
    };
    Typr.GSUB.readLigatureSet = function (data, offset) {
        var bin = Typr._bin,
            offset0 = offset,
            lset = [];
        var lcnt = bin.readUshort(data, offset);
        offset += 2;
        for (var j = 0; j < lcnt; j++) {
            var loff = bin.readUshort(data, offset);
            offset += 2;
            lset.push(Typr.GSUB.readLigature(data, offset0 + loff));
        }
        return lset;
    };
    Typr.GSUB.readLigature = function (data, offset) {
        var bin = Typr._bin,
            lig = { chain: [] };
        lig.nglyph = bin.readUshort(data, offset);
        offset += 2;
        var ccnt = bin.readUshort(data, offset);
        offset += 2;
        for (var k = 0; k < ccnt - 1; k++) {
            lig.chain.push(bin.readUshort(data, offset));
            offset += 2;
        }
        return lig;
    };
    Typr.head = {};
    Typr.head.parse = function (data, offset, length) {
        var bin = Typr._bin;
        var obj = {};
        bin.readFixed(data, offset);
        offset += 4;
        obj.fontRevision = bin.readFixed(data, offset);
        offset += 4;
        bin.readUint(data, offset);
        offset += 4;
        bin.readUint(data, offset);
        offset += 4;
        obj.flags = bin.readUshort(data, offset);
        offset += 2;
        obj.unitsPerEm = bin.readUshort(data, offset);
        offset += 2;
        obj.created = bin.readUint64(data, offset);
        offset += 8;
        obj.modified = bin.readUint64(data, offset);
        offset += 8;
        obj.xMin = bin.readShort(data, offset);
        offset += 2;
        obj.yMin = bin.readShort(data, offset);
        offset += 2;
        obj.xMax = bin.readShort(data, offset);
        offset += 2;
        obj.yMax = bin.readShort(data, offset);
        offset += 2;
        obj.macStyle = bin.readUshort(data, offset);
        offset += 2;
        obj.lowestRecPPEM = bin.readUshort(data, offset);
        offset += 2;
        obj.fontDirectionHint = bin.readShort(data, offset);
        offset += 2;
        obj.indexToLocFormat = bin.readShort(data, offset);
        offset += 2;
        obj.glyphDataFormat = bin.readShort(data, offset);
        offset += 2;
        return obj;
    };
    Typr.hhea = {};
    Typr.hhea.parse = function (data, offset, length) {
        var bin = Typr._bin;
        var obj = {};
        bin.readFixed(data, offset);
        offset += 4;
        obj.ascender = bin.readShort(data, offset);
        offset += 2;
        obj.descender = bin.readShort(data, offset);
        offset += 2;
        obj.lineGap = bin.readShort(data, offset);
        offset += 2;
        obj.advanceWidthMax = bin.readUshort(data, offset);
        offset += 2;
        obj.minLeftSideBearing = bin.readShort(data, offset);
        offset += 2;
        obj.minRightSideBearing = bin.readShort(data, offset);
        offset += 2;
        obj.xMaxExtent = bin.readShort(data, offset);
        offset += 2;
        obj.caretSlopeRise = bin.readShort(data, offset);
        offset += 2;
        obj.caretSlopeRun = bin.readShort(data, offset);
        offset += 2;
        obj.caretOffset = bin.readShort(data, offset);
        offset += 2;
        offset += 4 * 2;
        obj.metricDataFormat = bin.readShort(data, offset);
        offset += 2;
        obj.numberOfHMetrics = bin.readUshort(data, offset);
        offset += 2;
        return obj;
    };
    Typr.hmtx = {};
    Typr.hmtx.parse = function (data, offset, length, font) {
        var bin = Typr._bin;
        var obj = {};
        obj.aWidth = [];
        obj.lsBearing = [];
        var aw = 0,
            lsb = 0;
        for (var i = 0; i < font.maxp.numGlyphs; i++) {
            if (i < font.hhea.numberOfHMetrics) {
                aw = bin.readUshort(data, offset);
                offset += 2;
                lsb = bin.readShort(data, offset);
                offset += 2;
            }
            obj.aWidth.push(aw);
            obj.lsBearing.push(lsb);
        }
        return obj;
    };
    Typr.kern = {};
    Typr.kern.parse = function (data, offset, length, font) {
        var bin = Typr._bin;
        var version = bin.readUshort(data, offset);
        offset += 2;
        if (version == 1) return Typr.kern.parseV1(data, offset - 2, length, font);
        var nTables = bin.readUshort(data, offset);
        offset += 2;
        var map2 = { glyph1: [], rval: [] };
        for (var i = 0; i < nTables; i++) {
            offset += 2;
            var length = bin.readUshort(data, offset);
            offset += 2;
            var coverage = bin.readUshort(data, offset);
            offset += 2;
            var format = coverage >>> 8;
            format &= 15;
            if (format == 0) offset = Typr.kern.readFormat0(data, offset, map2);
            else throw "unknown kern table format: " + format;
        }
        return map2;
    };
    Typr.kern.parseV1 = function (data, offset, length, font) {
        var bin = Typr._bin;
        bin.readFixed(data, offset);
        offset += 4;
        var nTables = bin.readUint(data, offset);
        offset += 4;
        var map2 = { glyph1: [], rval: [] };
        for (var i = 0; i < nTables; i++) {
            bin.readUint(data, offset);
            offset += 4;
            var coverage = bin.readUshort(data, offset);
            offset += 2;
            bin.readUshort(data, offset);
            offset += 2;
            var format = coverage >>> 8;
            format &= 15;
            if (format == 0) offset = Typr.kern.readFormat0(data, offset, map2);
            else throw "unknown kern table format: " + format;
        }
        return map2;
    };
    Typr.kern.readFormat0 = function (data, offset, map2) {
        var bin = Typr._bin;
        var pleft = -1;
        var nPairs = bin.readUshort(data, offset);
        offset += 2;
        bin.readUshort(data, offset);
        offset += 2;
        bin.readUshort(data, offset);
        offset += 2;
        bin.readUshort(data, offset);
        offset += 2;
        for (var j = 0; j < nPairs; j++) {
            var left = bin.readUshort(data, offset);
            offset += 2;
            var right = bin.readUshort(data, offset);
            offset += 2;
            var value = bin.readShort(data, offset);
            offset += 2;
            if (left != pleft) {
                map2.glyph1.push(left);
                map2.rval.push({ glyph2: [], vals: [] });
            }
            var rval = map2.rval[map2.rval.length - 1];
            rval.glyph2.push(right);
            rval.vals.push(value);
            pleft = left;
        }
        return offset;
    };
    Typr.loca = {};
    Typr.loca.parse = function (data, offset, length, font) {
        var bin = Typr._bin;
        var obj = [];
        var ver = font.head.indexToLocFormat;
        var len = font.maxp.numGlyphs + 1;
        if (ver == 0)
            for (var i = 0; i < len; i++)
                obj.push(bin.readUshort(data, offset + (i << 1)) << 1);
        if (ver == 1)
            for (var i = 0; i < len; i++)
                obj.push(bin.readUint(data, offset + (i << 2)));
        return obj;
    };
    Typr.maxp = {};
    Typr.maxp.parse = function (data, offset, length) {
        var bin = Typr._bin;
        var obj = {};
        var ver = bin.readUint(data, offset);
        offset += 4;
        obj.numGlyphs = bin.readUshort(data, offset);
        offset += 2;
        if (ver == 65536) {
            obj.maxPoints = bin.readUshort(data, offset);
            offset += 2;
            obj.maxContours = bin.readUshort(data, offset);
            offset += 2;
            obj.maxCompositePoints = bin.readUshort(data, offset);
            offset += 2;
            obj.maxCompositeContours = bin.readUshort(data, offset);
            offset += 2;
            obj.maxZones = bin.readUshort(data, offset);
            offset += 2;
            obj.maxTwilightPoints = bin.readUshort(data, offset);
            offset += 2;
            obj.maxStorage = bin.readUshort(data, offset);
            offset += 2;
            obj.maxFunctionDefs = bin.readUshort(data, offset);
            offset += 2;
            obj.maxInstructionDefs = bin.readUshort(data, offset);
            offset += 2;
            obj.maxStackElements = bin.readUshort(data, offset);
            offset += 2;
            obj.maxSizeOfInstructions = bin.readUshort(data, offset);
            offset += 2;
            obj.maxComponentElements = bin.readUshort(data, offset);
            offset += 2;
            obj.maxComponentDepth = bin.readUshort(data, offset);
            offset += 2;
        }
        return obj;
    };
    Typr.name = {};
    Typr.name.parse = function (data, offset, length) {
        var bin = Typr._bin;
        var obj = {};
        bin.readUshort(data, offset);
        offset += 2;
        var count = bin.readUshort(data, offset);
        offset += 2;
        bin.readUshort(data, offset);
        offset += 2;
        var names = [
            "copyright",
            "fontFamily",
            "fontSubfamily",
            "ID",
            "fullName",
            "version",
            "postScriptName",
            "trademark",
            "manufacturer",
            "designer",
            "description",
            "urlVendor",
            "urlDesigner",
            "licence",
            "licenceURL",
            "---",
            "typoFamilyName",
            "typoSubfamilyName",
            "compatibleFull",
            "sampleText",
            "postScriptCID",
            "wwsFamilyName",
            "wwsSubfamilyName",
            "lightPalette",
            "darkPalette",
        ];
        var offset0 = offset;
        for (var i = 0; i < count; i++) {
            var platformID = bin.readUshort(data, offset);
            offset += 2;
            var encodingID = bin.readUshort(data, offset);
            offset += 2;
            var languageID = bin.readUshort(data, offset);
            offset += 2;
            var nameID = bin.readUshort(data, offset);
            offset += 2;
            var slen = bin.readUshort(data, offset);
            offset += 2;
            var noffset = bin.readUshort(data, offset);
            offset += 2;
            var cname = names[nameID];
            var soff = offset0 + count * 12 + noffset;
            var str;
            if (platformID == 0) str = bin.readUnicode(data, soff, slen / 2);
            else if (platformID == 3 && encodingID == 0)
                str = bin.readUnicode(data, soff, slen / 2);
            else if (encodingID == 0) str = bin.readASCII(data, soff, slen);
            else if (encodingID == 1) str = bin.readUnicode(data, soff, slen / 2);
            else if (encodingID == 3) str = bin.readUnicode(data, soff, slen / 2);
            else if (platformID == 1) {
                str = bin.readASCII(data, soff, slen);
                console.warn(
                    "reading unknown MAC encoding " + encodingID + " as ASCII"
                );
            } else
                throw "unknown encoding " + encodingID + ", platformID: " + platformID;
            var tid = "p" + platformID + "," + languageID.toString(16);
            if (obj[tid] == null) obj[tid] = {};
            obj[tid][cname !== void 0 ? cname : nameID] = str;
            obj[tid]._lang = languageID;
        }
        for (var p in obj)
            if (obj[p].postScriptName != null && obj[p]._lang == 1033) return obj[p];
        for (var p in obj)
            if (obj[p].postScriptName != null && obj[p]._lang == 0) return obj[p];
        for (var p in obj)
            if (obj[p].postScriptName != null && obj[p]._lang == 3084) return obj[p];
        for (var p in obj) if (obj[p].postScriptName != null) return obj[p];
        var tname;
        for (var p in obj) {
            tname = p;
            break;
        }
        console.warn("returning name table with languageID " + obj[tname]._lang);
        return obj[tname];
    };
    Typr["OS/2"] = {};
    Typr["OS/2"].parse = function (data, offset, length) {
        var bin = Typr._bin;
        var ver = bin.readUshort(data, offset);
        offset += 2;
        var obj = {};
        if (ver == 0) Typr["OS/2"].version0(data, offset, obj);
        else if (ver == 1) Typr["OS/2"].version1(data, offset, obj);
        else if (ver == 2 || ver == 3 || ver == 4)
            Typr["OS/2"].version2(data, offset, obj);
        else if (ver == 5) Typr["OS/2"].version5(data, offset, obj);
        else throw "unknown OS/2 table version: " + ver;
        return obj;
    };
    Typr["OS/2"].version0 = function (data, offset, obj) {
        var bin = Typr._bin;
        obj.xAvgCharWidth = bin.readShort(data, offset);
        offset += 2;
        obj.usWeightClass = bin.readUshort(data, offset);
        offset += 2;
        obj.usWidthClass = bin.readUshort(data, offset);
        offset += 2;
        obj.fsType = bin.readUshort(data, offset);
        offset += 2;
        obj.ySubscriptXSize = bin.readShort(data, offset);
        offset += 2;
        obj.ySubscriptYSize = bin.readShort(data, offset);
        offset += 2;
        obj.ySubscriptXOffset = bin.readShort(data, offset);
        offset += 2;
        obj.ySubscriptYOffset = bin.readShort(data, offset);
        offset += 2;
        obj.ySuperscriptXSize = bin.readShort(data, offset);
        offset += 2;
        obj.ySuperscriptYSize = bin.readShort(data, offset);
        offset += 2;
        obj.ySuperscriptXOffset = bin.readShort(data, offset);
        offset += 2;
        obj.ySuperscriptYOffset = bin.readShort(data, offset);
        offset += 2;
        obj.yStrikeoutSize = bin.readShort(data, offset);
        offset += 2;
        obj.yStrikeoutPosition = bin.readShort(data, offset);
        offset += 2;
        obj.sFamilyClass = bin.readShort(data, offset);
        offset += 2;
        obj.panose = bin.readBytes(data, offset, 10);
        offset += 10;
        obj.ulUnicodeRange1 = bin.readUint(data, offset);
        offset += 4;
        obj.ulUnicodeRange2 = bin.readUint(data, offset);
        offset += 4;
        obj.ulUnicodeRange3 = bin.readUint(data, offset);
        offset += 4;
        obj.ulUnicodeRange4 = bin.readUint(data, offset);
        offset += 4;
        obj.achVendID = [
            bin.readInt8(data, offset),
            bin.readInt8(data, offset + 1),
            bin.readInt8(data, offset + 2),
            bin.readInt8(data, offset + 3),
        ];
        offset += 4;
        obj.fsSelection = bin.readUshort(data, offset);
        offset += 2;
        obj.usFirstCharIndex = bin.readUshort(data, offset);
        offset += 2;
        obj.usLastCharIndex = bin.readUshort(data, offset);
        offset += 2;
        obj.sTypoAscender = bin.readShort(data, offset);
        offset += 2;
        obj.sTypoDescender = bin.readShort(data, offset);
        offset += 2;
        obj.sTypoLineGap = bin.readShort(data, offset);
        offset += 2;
        obj.usWinAscent = bin.readUshort(data, offset);
        offset += 2;
        obj.usWinDescent = bin.readUshort(data, offset);
        offset += 2;
        return offset;
    };
    Typr["OS/2"].version1 = function (data, offset, obj) {
        var bin = Typr._bin;
        offset = Typr["OS/2"].version0(data, offset, obj);
        obj.ulCodePageRange1 = bin.readUint(data, offset);
        offset += 4;
        obj.ulCodePageRange2 = bin.readUint(data, offset);
        offset += 4;
        return offset;
    };
    Typr["OS/2"].version2 = function (data, offset, obj) {
        var bin = Typr._bin;
        offset = Typr["OS/2"].version1(data, offset, obj);
        obj.sxHeight = bin.readShort(data, offset);
        offset += 2;
        obj.sCapHeight = bin.readShort(data, offset);
        offset += 2;
        obj.usDefault = bin.readUshort(data, offset);
        offset += 2;
        obj.usBreak = bin.readUshort(data, offset);
        offset += 2;
        obj.usMaxContext = bin.readUshort(data, offset);
        offset += 2;
        return offset;
    };
    Typr["OS/2"].version5 = function (data, offset, obj) {
        var bin = Typr._bin;
        offset = Typr["OS/2"].version2(data, offset, obj);
        obj.usLowerOpticalPointSize = bin.readUshort(data, offset);
        offset += 2;
        obj.usUpperOpticalPointSize = bin.readUshort(data, offset);
        offset += 2;
        return offset;
    };
    Typr.post = {};
    Typr.post.parse = function (data, offset, length) {
        var bin = Typr._bin;
        var obj = {};
        obj.version = bin.readFixed(data, offset);
        offset += 4;
        obj.italicAngle = bin.readFixed(data, offset);
        offset += 4;
        obj.underlinePosition = bin.readShort(data, offset);
        offset += 2;
        obj.underlineThickness = bin.readShort(data, offset);
        offset += 2;
        return obj;
    };
    Typr.SVG = {};
    Typr.SVG.parse = function (data, offset, length) {
        var bin = Typr._bin;
        var obj = { entries: [] };
        var offset0 = offset;
        bin.readUshort(data, offset);
        offset += 2;
        var svgDocIndexOffset = bin.readUint(data, offset);
        offset += 4;
        bin.readUint(data, offset);
        offset += 4;
        offset = svgDocIndexOffset + offset0;
        var numEntries = bin.readUshort(data, offset);
        offset += 2;
        for (var i = 0; i < numEntries; i++) {
            var startGlyphID = bin.readUshort(data, offset);
            offset += 2;
            var endGlyphID = bin.readUshort(data, offset);
            offset += 2;
            var svgDocOffset = bin.readUint(data, offset);
            offset += 4;
            var svgDocLength = bin.readUint(data, offset);
            offset += 4;
            var sbuf = new Uint8Array(
                data.buffer,
                offset0 + svgDocOffset + svgDocIndexOffset,
                svgDocLength
            );
            var svg = bin.readUTF8(sbuf, 0, sbuf.length);
            for (var f = startGlyphID; f <= endGlyphID; f++) {
                obj.entries[f] = svg;
            }
        }
        return obj;
    };
    Typr.SVG.toPath = function (str) {
        var pth = { cmds: [], crds: [] };
        if (str == null) return pth;
        var prsr = new DOMParser();
        var doc = prsr["parseFromString"](str, "image/svg+xml");
        var svg = doc.firstChild;
        while (svg.tagName != "svg") svg = svg.nextSibling;
        var vb = svg.getAttribute("viewBox");
        if (vb) vb = vb.trim().split(" ").map(parseFloat);
        else vb = [0, 0, 1e3, 1e3];
        Typr.SVG._toPath(svg.children, pth);
        for (var i = 0; i < pth.crds.length; i += 2) {
            var x = pth.crds[i],
                y = pth.crds[i + 1];
            x -= vb[0];
            y -= vb[1];
            y = -y;
            pth.crds[i] = x;
            pth.crds[i + 1] = y;
        }
        return pth;
    };
    Typr.SVG._toPath = function (nds, pth, fill) {
        for (var ni = 0; ni < nds.length; ni++) {
            var nd = nds[ni],
                tn = nd.tagName;
            var cfl = nd.getAttribute("fill");
            if (cfl == null) cfl = fill;
            if (tn == "g") Typr.SVG._toPath(nd.children, pth, cfl);
            else if (tn == "path") {
                pth.cmds.push(cfl ? cfl : "#000000");
                var d = nd.getAttribute("d");
                var toks = Typr.SVG._tokens(d);
                Typr.SVG._toksToPath(toks, pth);
                pth.cmds.push("X");
            } else if (tn == "defs");
            else console.warn(tn, nd);
        }
    };
    Typr.SVG._tokens = function (d) {
        var ts = [],
            off = 0,
            rn = false,
            cn = "";
        while (off < d.length) {
            var cc = d.charCodeAt(off),
                ch = d.charAt(off);
            off++;
            var isNum = (48 <= cc && cc <= 57) || ch == "." || ch == "-";
            if (rn) {
                if (ch == "-") {
                    ts.push(parseFloat(cn));
                    cn = ch;
                } else if (isNum) cn += ch;
                else {
                    ts.push(parseFloat(cn));
                    if (ch != "," && ch != " ") ts.push(ch);
                    rn = false;
                }
            } else {
                if (isNum) {
                    cn = ch;
                    rn = true;
                } else if (ch != "," && ch != " ") ts.push(ch);
            }
        }
        if (rn) ts.push(parseFloat(cn));
        return ts;
    };
    Typr.SVG._toksToPath = function (ts, pth) {
        var i = 0,
            x = 0,
            y = 0,
            ox = 0,
            oy = 0;
        var pc = { M: 2, L: 2, H: 1, V: 1, S: 4, C: 6 };
        var cmds = pth.cmds,
            crds = pth.crds;
        while (i < ts.length) {
            var cmd = ts[i];
            i++;
            if (cmd == "z") {
                cmds.push("Z");
                x = ox;
                y = oy;
            } else {
                var cmu = cmd.toUpperCase();
                var ps = pc[cmu],
                    reps = Typr.SVG._reps(ts, i, ps);
                for (var j = 0; j < reps; j++) {
                    var xi = 0,
                        yi = 0;
                    if (cmd != cmu) {
                        xi = x;
                        yi = y;
                    }
                    if (cmu == "M") {
                        x = xi + ts[i++];
                        y = yi + ts[i++];
                        cmds.push("M");
                        crds.push(x, y);
                        ox = x;
                        oy = y;
                    } else if (cmu == "L") {
                        x = xi + ts[i++];
                        y = yi + ts[i++];
                        cmds.push("L");
                        crds.push(x, y);
                    } else if (cmu == "H") {
                        x = xi + ts[i++];
                        cmds.push("L");
                        crds.push(x, y);
                    } else if (cmu == "V") {
                        y = yi + ts[i++];
                        cmds.push("L");
                        crds.push(x, y);
                    } else if (cmu == "C") {
                        var x1 = xi + ts[i++],
                            y1 = yi + ts[i++],
                            x2 = xi + ts[i++],
                            y2 = yi + ts[i++],
                            x3 = xi + ts[i++],
                            y3 = yi + ts[i++];
                        cmds.push("C");
                        crds.push(x1, y1, x2, y2, x3, y3);
                        x = x3;
                        y = y3;
                    } else if (cmu == "S") {
                        var co = Math.max(crds.length - 4, 0);
                        var x1 = x + x - crds[co],
                            y1 = y + y - crds[co + 1];
                        var x2 = xi + ts[i++],
                            y2 = yi + ts[i++],
                            x3 = xi + ts[i++],
                            y3 = yi + ts[i++];
                        cmds.push("C");
                        crds.push(x1, y1, x2, y2, x3, y3);
                        x = x3;
                        y = y3;
                    } else console.warn("Unknown SVG command " + cmd);
                }
            }
        }
    };
    Typr.SVG._reps = function (ts, off, ps) {
        var i = off;
        while (i < ts.length) {
            if (typeof ts[i] == "string") break;
            i += ps;
        }
        return (i - off) / ps;
    };
    if (Typr == null) Typr = {};
    if (Typr.U == null) Typr.U = {};
    Typr.U.codeToGlyph = function (font, code) {
        var cmap = font.cmap;
        var tind = -1;
        if (cmap.p0e4 != null) tind = cmap.p0e4;
        else if (cmap.p3e1 != null) tind = cmap.p3e1;
        else if (cmap.p1e0 != null) tind = cmap.p1e0;
        else if (cmap.p0e3 != null) tind = cmap.p0e3;
        if (tind == -1) throw "no familiar platform and encoding!";
        var tab = cmap.tables[tind];
        if (tab.format == 0) {
            if (code >= tab.map.length) return 0;
            return tab.map[code];
        } else if (tab.format == 4) {
            var sind = -1;
            for (var i = 0; i < tab.endCount.length; i++) {
                if (code <= tab.endCount[i]) {
                    sind = i;
                    break;
                }
            }
            if (sind == -1) return 0;
            if (tab.startCount[sind] > code) return 0;
            var gli = 0;
            if (tab.idRangeOffset[sind] != 0) {
                gli =
                    tab.glyphIdArray[
                    code -
                    tab.startCount[sind] +
                    (tab.idRangeOffset[sind] >> 1) -
                    (tab.idRangeOffset.length - sind)
                ];
            } else {
                gli = code + tab.idDelta[sind];
            }
            return gli & 65535;
        } else if (tab.format == 12) {
            if (code > tab.groups[tab.groups.length - 1][1]) return 0;
            for (var i = 0; i < tab.groups.length; i++) {
                var grp = tab.groups[i];
                if (grp[0] <= code && code <= grp[1]) return grp[2] + (code - grp[0]);
            }
            return 0;
        } else {
            throw "unknown cmap table format " + tab.format;
        }
    };
    Typr.U.glyphToPath = function (font, gid) {
        var path = { cmds: [], crds: [] };
        if (font.SVG && font.SVG.entries[gid]) {
            var p = font.SVG.entries[gid];
            if (p == null) return path;
            if (typeof p == "string") {
                p = Typr.SVG.toPath(p);
                font.SVG.entries[gid] = p;
            }
            return p;
        } else if (font.CFF) {
            var state = {
                x: 0,
                y: 0,
                stack: [],
                nStems: 0,
                haveWidth: false,
                width: font.CFF.Private ? font.CFF.Private.defaultWidthX : 0,
                open: false,
            };
            var cff = font.CFF,
                pdct = font.CFF.Private;
            if (cff.ROS) {
                var gi = 0;
                while (cff.FDSelect[gi + 2] <= gid) gi += 2;
                pdct = cff.FDArray[cff.FDSelect[gi + 1]].Private;
            }
            Typr.U._drawCFF(font.CFF.CharStrings[gid], state, cff, pdct, path);
        } else if (font.glyf) {
            Typr.U._drawGlyf(gid, font, path);
        }
        return path;
    };
    Typr.U._drawGlyf = function (gid, font, path) {
        var gl = font.glyf[gid];
        if (gl == null) gl = font.glyf[gid] = Typr.glyf._parseGlyf(font, gid);
        if (gl != null) {
            if (gl.noc > -1) {
                Typr.U._simpleGlyph(gl, path);
            } else {
                Typr.U._compoGlyph(gl, font, path);
            }
        }
    };
    Typr.U._simpleGlyph = function (gl, p) {
        for (var c = 0; c < gl.noc; c++) {
            var i0 = c == 0 ? 0 : gl.endPts[c - 1] + 1;
            var il = gl.endPts[c];
            for (var i = i0; i <= il; i++) {
                var pr = i == i0 ? il : i - 1;
                var nx = i == il ? i0 : i + 1;
                var onCurve = gl.flags[i] & 1;
                var prOnCurve = gl.flags[pr] & 1;
                var nxOnCurve = gl.flags[nx] & 1;
                var x = gl.xs[i],
                    y = gl.ys[i];
                if (i == i0) {
                    if (onCurve) {
                        if (prOnCurve) {
                            Typr.U.P.moveTo(p, gl.xs[pr], gl.ys[pr]);
                        } else {
                            Typr.U.P.moveTo(p, x, y);
                            continue;
                        }
                    } else {
                        if (prOnCurve) {
                            Typr.U.P.moveTo(p, gl.xs[pr], gl.ys[pr]);
                        } else {
                            Typr.U.P.moveTo(p, (gl.xs[pr] + x) / 2, (gl.ys[pr] + y) / 2);
                        }
                    }
                }
                if (onCurve) {
                    if (prOnCurve) Typr.U.P.lineTo(p, x, y);
                } else {
                    if (nxOnCurve) {
                        Typr.U.P.qcurveTo(p, x, y, gl.xs[nx], gl.ys[nx]);
                    } else {
                        Typr.U.P.qcurveTo(
                            p,
                            x,
                            y,
                            (x + gl.xs[nx]) / 2,
                            (y + gl.ys[nx]) / 2
                        );
                    }
                }
            }
            Typr.U.P.closePath(p);
        }
    };
    Typr.U._compoGlyph = function (gl, font, p) {
        for (var j = 0; j < gl.parts.length; j++) {
            var path = { cmds: [], crds: [] };
            var prt = gl.parts[j];
            Typr.U._drawGlyf(prt.glyphIndex, font, path);
            var m = prt.m;
            for (var i = 0; i < path.crds.length; i += 2) {
                var x = path.crds[i],
                    y = path.crds[i + 1];
                p.crds.push(x * m.a + y * m.b + m.tx);
                p.crds.push(x * m.c + y * m.d + m.ty);
            }
            for (var i = 0; i < path.cmds.length; i++) {
                p.cmds.push(path.cmds[i]);
            }
        }
    };
    Typr.U._getGlyphClass = function (g, cd) {
        var intr = Typr._lctf.getInterval(cd, g);
        return intr == -1 ? 0 : cd[intr + 2];
    };
    Typr.U.getPairAdjustment = function (font, g1, g2) {
        var hasGPOSkern = false;
        if (font.GPOS) {
            var gpos = font["GPOS"];
            var llist = gpos.lookupList,
                flist = gpos.featureList;
            var tused = [];
            for (var i = 0; i < flist.length; i++) {
                var fl = flist[i];
                if (fl.tag != "kern") continue;
                hasGPOSkern = true;
                for (var ti = 0; ti < fl.tab.length; ti++) {
                    if (tused[fl.tab[ti]]) continue;
                    tused[fl.tab[ti]] = true;
                    var tab = llist[fl.tab[ti]];
                    for (var j = 0; j < tab.tabs.length; j++) {
                        if (tab.tabs[j] == null) continue;
                        var ltab = tab.tabs[j],
                            ind;
                        if (ltab.coverage) {
                            ind = Typr._lctf.coverageIndex(ltab.coverage, g1);
                            if (ind == -1) continue;
                        }
                        if (tab.ltype == 1);
                        else if (tab.ltype == 2) {
                            var adj = null;
                            if (ltab.fmt == 1) {
                                var right = ltab.pairsets[ind];
                                for (var i = 0; i < right.length; i++) {
                                    if (right[i].gid2 == g2) adj = right[i];
                                }
                            } else if (ltab.fmt == 2) {
                                var c1 = Typr.U._getGlyphClass(g1, ltab.classDef1);
                                var c2 = Typr.U._getGlyphClass(g2, ltab.classDef2);
                                adj = ltab.matrix[c1][c2];
                            }
                            if (adj) {
                                var offset = 0;
                                if (adj.val1 && adj.val1[2]) offset += adj.val1[2];
                                if (adj.val2 && adj.val2[0]) offset += adj.val2[0];
                                return offset;
                            }
                        }
                    }
                }
            }
        }
        if (font.kern && !hasGPOSkern) {
            var ind1 = font.kern.glyph1.indexOf(g1);
            if (ind1 != -1) {
                var ind2 = font.kern.rval[ind1].glyph2.indexOf(g2);
                if (ind2 != -1) return font.kern.rval[ind1].vals[ind2];
            }
        }
        return 0;
    };
    Typr.U.stringToGlyphs = function (font, str) {
        var gls = [];
        for (var i = 0; i < str.length; i++) {
            var cc = str.codePointAt(i);
            if (cc > 65535) i++;
            gls.push(Typr.U.codeToGlyph(font, cc));
        }
        for (var i = 0; i < str.length; i++) {
            var cc = str.codePointAt(i);
            if (cc == 2367) {
                var t = gls[i - 1];
                gls[i - 1] = gls[i];
                gls[i] = t;
            }
            if (cc > 65535) i++;
        }
        var gsub = font["GSUB"];
        if (gsub == null) return gls;
        var llist = gsub.lookupList,
            flist = gsub.featureList;
        var cligs = [
            "rlig",
            "liga",
            "mset",
            "isol",
            "init",
            "fina",
            "medi",
            "half",
            "pres",
            "blws",
            /* Tibetan fonts like Himalaya.ttf */
        ];
        var tused = [];
        for (var fi = 0; fi < flist.length; fi++) {
            var fl = flist[fi];
            if (cligs.indexOf(fl.tag) == -1) continue;
            for (var ti = 0; ti < fl.tab.length; ti++) {
                if (tused[fl.tab[ti]]) continue;
                tused[fl.tab[ti]] = true;
                var tab = llist[fl.tab[ti]];
                for (var ci = 0; ci < gls.length; ci++) {
                    var feat = Typr.U._getWPfeature(str, ci);
                    if ("isol,init,fina,medi".indexOf(fl.tag) != -1 && fl.tag != feat)
                        continue;
                    Typr.U._applySubs(gls, ci, tab, llist);
                }
            }
        }
        return gls;
    };
    Typr.U._getWPfeature = function (str, ci) {
        var wsep = '\n	" ,.:;!?()  ،';
        var R =
            "آأؤإاةدذرزوٱٲٳٵٶٷڈډڊڋڌڍڎڏڐڑڒړڔڕږڗژڙۀۃۄۅۆۇۈۉۊۋۍۏےۓەۮۯܐܕܖܗܘܙܞܨܪܬܯݍݙݚݛݫݬݱݳݴݸݹࡀࡆࡇࡉࡔࡧࡩࡪࢪࢫࢬࢮࢱࢲࢹૅેૉ૊૎૏ૐ૑૒૝ૡ૤૯஁ஃ஄அஉ஌எஏ஑னப஫஬";
        var L = "ꡲ્૗";
        var slft = ci == 0 || wsep.indexOf(str[ci - 1]) != -1;
        var srgt = ci == str.length - 1 || wsep.indexOf(str[ci + 1]) != -1;
        if (!slft && R.indexOf(str[ci - 1]) != -1) slft = true;
        if (!srgt && R.indexOf(str[ci]) != -1) srgt = true;
        if (!srgt && L.indexOf(str[ci + 1]) != -1) srgt = true;
        if (!slft && L.indexOf(str[ci]) != -1) slft = true;
        var feat = null;
        if (slft) {
            feat = srgt ? "isol" : "init";
        } else {
            feat = srgt ? "fina" : "medi";
        }
        return feat;
    };
    Typr.U._applySubs = function (gls, ci, tab, llist) {
        var rlim = gls.length - ci - 1;
        for (var j = 0; j < tab.tabs.length; j++) {
            if (tab.tabs[j] == null) continue;
            var ltab = tab.tabs[j],
                ind;
            if (ltab.coverage) {
                ind = Typr._lctf.coverageIndex(ltab.coverage, gls[ci]);
                if (ind == -1) continue;
            }
            if (tab.ltype == 1) {
                gls[ci];
                if (ltab.fmt == 1) gls[ci] = gls[ci] + ltab.delta;
                else gls[ci] = ltab.newg[ind];
            } else if (tab.ltype == 4) {
                var vals = ltab.vals[ind];
                for (var k = 0; k < vals.length; k++) {
                    var lig = vals[k],
                        rl = lig.chain.length;
                    if (rl > rlim) continue;
                    var good = true,
                        em1 = 0;
                    for (var l = 0; l < rl; l++) {
                        while (gls[ci + em1 + (1 + l)] == -1) em1++;
                        if (lig.chain[l] != gls[ci + em1 + (1 + l)]) good = false;
                    }
                    if (!good) continue;
                    gls[ci] = lig.nglyph;
                    for (var l = 0; l < rl + em1; l++) gls[ci + l + 1] = -1;
                    break;
                }
            } else if (tab.ltype == 5 && ltab.fmt == 2) {
                var cind = Typr._lctf.getInterval(ltab.cDef, gls[ci]);
                var cls = ltab.cDef[cind + 2],
                    scs = ltab.scset[cls];
                for (var i = 0; i < scs.length; i++) {
                    var sc = scs[i],
                        inp = sc.input;
                    if (inp.length > rlim) continue;
                    var good = true;
                    for (var l = 0; l < inp.length; l++) {
                        var cind2 = Typr._lctf.getInterval(ltab.cDef, gls[ci + 1 + l]);
                        if (cind == -1 && ltab.cDef[cind2 + 2] != inp[l]) {
                            good = false;
                            break;
                        }
                    }
                    if (!good) continue;
                    var lrs = sc.substLookupRecords;
                    for (var k = 0; k < lrs.length; k += 2) {
                        lrs[k];
                        lrs[k + 1];
                    }
                }
            } else if (tab.ltype == 6 && ltab.fmt == 3) {
                if (!Typr.U._glsCovered(gls, ltab.backCvg, ci - ltab.backCvg.length))
                    continue;
                if (!Typr.U._glsCovered(gls, ltab.inptCvg, ci)) continue;
                if (!Typr.U._glsCovered(gls, ltab.ahedCvg, ci + ltab.inptCvg.length))
                    continue;
                var lr = ltab.lookupRec;
                for (var i = 0; i < lr.length; i += 2) {
                    var cind = lr[i],
                        tab2 = llist[lr[i + 1]];
                    Typr.U._applySubs(gls, ci + cind, tab2, llist);
                }
            }
        }
    };
    Typr.U._glsCovered = function (gls, cvgs, ci) {
        for (var i = 0; i < cvgs.length; i++) {
            var ind = Typr._lctf.coverageIndex(cvgs[i], gls[ci + i]);
            if (ind == -1) return false;
        }
        return true;
    };
    Typr.U.glyphsToPath = function (font, gls, clr) {
        var tpath = { cmds: [], crds: [] };
        var x = 0;
        for (var i = 0; i < gls.length; i++) {
            var gid = gls[i];
            if (gid == -1) continue;
            var gid2 = i < gls.length - 1 && gls[i + 1] != -1 ? gls[i + 1] : 0;
            var path = Typr.U.glyphToPath(font, gid);
            for (var j = 0; j < path.crds.length; j += 2) {
                tpath.crds.push(path.crds[j] + x);
                tpath.crds.push(path.crds[j + 1]);
            }
            if (clr) tpath.cmds.push(clr);
            for (var j = 0; j < path.cmds.length; j++) tpath.cmds.push(path.cmds[j]);
            if (clr) tpath.cmds.push("X");
            x += font.hmtx.aWidth[gid];
            if (i < gls.length - 1) x += Typr.U.getPairAdjustment(font, gid, gid2);
        }
        return tpath;
    };
    Typr.U.pathToSVG = function (path, prec) {
        if (prec == null) prec = 5;
        var out = [],
            co = 0,
            lmap = { M: 2, L: 2, Q: 4, C: 6 };
        for (var i = 0; i < path.cmds.length; i++) {
            var cmd = path.cmds[i],
                cn = co + (lmap[cmd] ? lmap[cmd] : 0);
            out.push(cmd);
            while (co < cn) {
                var c = path.crds[co++];
                out.push(parseFloat(c.toFixed(prec)) + (co == cn ? "" : " "));
            }
        }
        return out.join("");
    };
    Typr.U.pathToContext = function (path, ctx) {
        var c = 0,
            crds = path.crds;
        for (var j = 0; j < path.cmds.length; j++) {
            var cmd = path.cmds[j];
            if (cmd == "M") {
                ctx.moveTo(crds[c], crds[c + 1]);
                c += 2;
            } else if (cmd == "L") {
                ctx.lineTo(crds[c], crds[c + 1]);
                c += 2;
            } else if (cmd == "C") {
                ctx.bezierCurveTo(
                    crds[c],
                    crds[c + 1],
                    crds[c + 2],
                    crds[c + 3],
                    crds[c + 4],
                    crds[c + 5]
                );
                c += 6;
            } else if (cmd == "Q") {
                ctx.quadraticCurveTo(crds[c], crds[c + 1], crds[c + 2], crds[c + 3]);
                c += 4;
            } else if (cmd.charAt(0) == "#") {
                ctx.beginPath();
                ctx.fillStyle = cmd;
            } else if (cmd == "Z") {
                ctx.closePath();
            } else if (cmd == "X") {
                ctx.fill();
            }
        }
    };
    Typr.U.P = {};
    Typr.U.P.moveTo = function (p, x, y) {
        p.cmds.push("M");
        p.crds.push(x, y);
    };
    Typr.U.P.lineTo = function (p, x, y) {
        p.cmds.push("L");
        p.crds.push(x, y);
    };
    Typr.U.P.curveTo = function (p, a, b, c, d, e, f) {
        p.cmds.push("C");
        p.crds.push(a, b, c, d, e, f);
    };
    Typr.U.P.qcurveTo = function (p, a, b, c, d) {
        p.cmds.push("Q");
        p.crds.push(a, b, c, d);
    };
    Typr.U.P.closePath = function (p) {
        p.cmds.push("Z");
    };
    Typr.U._drawCFF = function (cmds, state, font, pdct, p) {
        var stack = state.stack;
        var nStems = state.nStems,
            haveWidth = state.haveWidth,
            width = state.width,
            open = state.open;
        var i = 0;
        var x = state.x,
            y = state.y,
            c1x = 0,
            c1y = 0,
            c2x = 0,
            c2y = 0,
            c3x = 0,
            c3y = 0,
            c4x = 0,
            c4y = 0,
            jpx = 0,
            jpy = 0;
        var o = { val: 0, size: 0 };
        while (i < cmds.length) {
            Typr.CFF.getCharString(cmds, i, o);
            var v = o.val;
            i += o.size;
            if (v == "o1" || v == "o18") {
                var hasWidthArg;
                hasWidthArg = stack.length % 2 !== 0;
                if (hasWidthArg && !haveWidth) {
                    width = stack.shift() + pdct.nominalWidthX;
                }
                nStems += stack.length >> 1;
                stack.length = 0;
                haveWidth = true;
            } else if (v == "o3" || v == "o23") {
                var hasWidthArg;
                hasWidthArg = stack.length % 2 !== 0;
                if (hasWidthArg && !haveWidth) {
                    width = stack.shift() + pdct.nominalWidthX;
                }
                nStems += stack.length >> 1;
                stack.length = 0;
                haveWidth = true;
            } else if (v == "o4") {
                if (stack.length > 1 && !haveWidth) {
                    width = stack.shift() + pdct.nominalWidthX;
                    haveWidth = true;
                }
                if (open) Typr.U.P.closePath(p);
                y += stack.pop();
                Typr.U.P.moveTo(p, x, y);
                open = true;
            } else if (v == "o5") {
                while (stack.length > 0) {
                    x += stack.shift();
                    y += stack.shift();
                    Typr.U.P.lineTo(p, x, y);
                }
            } else if (v == "o6" || v == "o7") {
                var count = stack.length;
                var isX = v == "o6";
                for (var j = 0; j < count; j++) {
                    var sval = stack.shift();
                    if (isX) {
                        x += sval;
                    } else {
                        y += sval;
                    }
                    isX = !isX;
                    Typr.U.P.lineTo(p, x, y);
                }
            } else if (v == "o8" || v == "o24") {
                var count = stack.length;
                var index = 0;
                while (index + 6 <= count) {
                    c1x = x + stack.shift();
                    c1y = y + stack.shift();
                    c2x = c1x + stack.shift();
                    c2y = c1y + stack.shift();
                    x = c2x + stack.shift();
                    y = c2y + stack.shift();
                    Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
                    index += 6;
                }
                if (v == "o24") {
                    x += stack.shift();
                    y += stack.shift();
                    Typr.U.P.lineTo(p, x, y);
                }
            } else if (v == "o11") {
                break;
            } else if (v == "o1234" || v == "o1235" || v == "o1236" || v == "o1237") {
                if (v == "o1234") {
                    c1x = x + stack.shift();
                    c1y = y;
                    c2x = c1x + stack.shift();
                    c2y = c1y + stack.shift();
                    jpx = c2x + stack.shift();
                    jpy = c2y;
                    c3x = jpx + stack.shift();
                    c3y = c2y;
                    c4x = c3x + stack.shift();
                    c4y = y;
                    x = c4x + stack.shift();
                    Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
                    Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y);
                }
                if (v == "o1235") {
                    c1x = x + stack.shift();
                    c1y = y + stack.shift();
                    c2x = c1x + stack.shift();
                    c2y = c1y + stack.shift();
                    jpx = c2x + stack.shift();
                    jpy = c2y + stack.shift();
                    c3x = jpx + stack.shift();
                    c3y = jpy + stack.shift();
                    c4x = c3x + stack.shift();
                    c4y = c3y + stack.shift();
                    x = c4x + stack.shift();
                    y = c4y + stack.shift();
                    stack.shift();
                    Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
                    Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y);
                }
                if (v == "o1236") {
                    c1x = x + stack.shift();
                    c1y = y + stack.shift();
                    c2x = c1x + stack.shift();
                    c2y = c1y + stack.shift();
                    jpx = c2x + stack.shift();
                    jpy = c2y;
                    c3x = jpx + stack.shift();
                    c3y = c2y;
                    c4x = c3x + stack.shift();
                    c4y = c3y + stack.shift();
                    x = c4x + stack.shift();
                    Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
                    Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y);
                }
                if (v == "o1237") {
                    c1x = x + stack.shift();
                    c1y = y + stack.shift();
                    c2x = c1x + stack.shift();
                    c2y = c1y + stack.shift();
                    jpx = c2x + stack.shift();
                    jpy = c2y + stack.shift();
                    c3x = jpx + stack.shift();
                    c3y = jpy + stack.shift();
                    c4x = c3x + stack.shift();
                    c4y = c3y + stack.shift();
                    if (Math.abs(c4x - x) > Math.abs(c4y - y)) {
                        x = c4x + stack.shift();
                    } else {
                        y = c4y + stack.shift();
                    }
                    Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
                    Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y);
                }
            } else if (v == "o14") {
                if (stack.length > 0 && !haveWidth) {
                    width = stack.shift() + font.nominalWidthX;
                    haveWidth = true;
                }
                if (stack.length == 4) {
                    var adx = stack.shift();
                    var ady = stack.shift();
                    var bchar = stack.shift();
                    var achar = stack.shift();
                    var bind2 = Typr.CFF.glyphBySE(font, bchar);
                    var aind = Typr.CFF.glyphBySE(font, achar);
                    Typr.U._drawCFF(font.CharStrings[bind2], state, font, pdct, p);
                    state.x = adx;
                    state.y = ady;
                    Typr.U._drawCFF(font.CharStrings[aind], state, font, pdct, p);
                }
                if (open) {
                    Typr.U.P.closePath(p);
                    open = false;
                }
            } else if (v == "o19" || v == "o20") {
                var hasWidthArg;
                hasWidthArg = stack.length % 2 !== 0;
                if (hasWidthArg && !haveWidth) {
                    width = stack.shift() + pdct.nominalWidthX;
                }
                nStems += stack.length >> 1;
                stack.length = 0;
                haveWidth = true;
                i += (nStems + 7) >> 3;
            } else if (v == "o21") {
                if (stack.length > 2 && !haveWidth) {
                    width = stack.shift() + pdct.nominalWidthX;
                    haveWidth = true;
                }
                y += stack.pop();
                x += stack.pop();
                if (open) Typr.U.P.closePath(p);
                Typr.U.P.moveTo(p, x, y);
                open = true;
            } else if (v == "o22") {
                if (stack.length > 1 && !haveWidth) {
                    width = stack.shift() + pdct.nominalWidthX;
                    haveWidth = true;
                }
                x += stack.pop();
                if (open) Typr.U.P.closePath(p);
                Typr.U.P.moveTo(p, x, y);
                open = true;
            } else if (v == "o25") {
                while (stack.length > 6) {
                    x += stack.shift();
                    y += stack.shift();
                    Typr.U.P.lineTo(p, x, y);
                }
                c1x = x + stack.shift();
                c1y = y + stack.shift();
                c2x = c1x + stack.shift();
                c2y = c1y + stack.shift();
                x = c2x + stack.shift();
                y = c2y + stack.shift();
                Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
            } else if (v == "o26") {
                if (stack.length % 2) {
                    x += stack.shift();
                }
                while (stack.length > 0) {
                    c1x = x;
                    c1y = y + stack.shift();
                    c2x = c1x + stack.shift();
                    c2y = c1y + stack.shift();
                    x = c2x;
                    y = c2y + stack.shift();
                    Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
                }
            } else if (v == "o27") {
                if (stack.length % 2) {
                    y += stack.shift();
                }
                while (stack.length > 0) {
                    c1x = x + stack.shift();
                    c1y = y;
                    c2x = c1x + stack.shift();
                    c2y = c1y + stack.shift();
                    x = c2x + stack.shift();
                    y = c2y;
                    Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
                }
            } else if (v == "o10" || v == "o29") {
                var obj = v == "o10" ? pdct : font;
                if (stack.length == 0) {
                    console.warn("error: empty stack");
                } else {
                    var ind = stack.pop();
                    var subr = obj.Subrs[ind + obj.Bias];
                    state.x = x;
                    state.y = y;
                    state.nStems = nStems;
                    state.haveWidth = haveWidth;
                    state.width = width;
                    state.open = open;
                    Typr.U._drawCFF(subr, state, font, pdct, p);
                    x = state.x;
                    y = state.y;
                    nStems = state.nStems;
                    haveWidth = state.haveWidth;
                    width = state.width;
                    open = state.open;
                }
            } else if (v == "o30" || v == "o31") {
                var count,
                    count1 = stack.length;
                var index = 0;
                var alternate = v == "o31";
                count = count1 & ~2;
                index += count1 - count;
                while (index < count) {
                    if (alternate) {
                        c1x = x + stack.shift();
                        c1y = y;
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        y = c2y + stack.shift();
                        if (count - index == 5) {
                            x = c2x + stack.shift();
                            index++;
                        } else {
                            x = c2x;
                        }
                        alternate = false;
                    } else {
                        c1x = x;
                        c1y = y + stack.shift();
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        x = c2x + stack.shift();
                        if (count - index == 5) {
                            y = c2y + stack.shift();
                            index++;
                        } else {
                            y = c2y;
                        }
                        alternate = true;
                    }
                    Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
                    index += 4;
                }
            } else if ((v + "").charAt(0) == "o") {
                console.warn("Unknown operation: " + v, cmds);
                throw v;
            } else stack.push(v);
        }
        state.x = x;
        state.y = y;
        state.nStems = nStems;
        state.haveWidth = haveWidth;
        state.width = width;
        state.open = open;
    };
    Typr$1.Typr = Typr;
    var Font_1 = void 0;
    var Typr_js_1 = Typr$1;
    var friendlyTags = {
        aalt: "Access All Alternates",
        abvf: "Above-base Forms",
        abvm: "Above - base Mark Positioning",
        abvs: "Above - base Substitutions",
        afrc: "Alternative Fractions",
        akhn: "Akhands",
        blwf: "Below - base Forms",
        blwm: "Below - base Mark Positioning",
        blws: "Below - base Substitutions",
        calt: "Contextual Alternates",
        case: "Case - Sensitive Forms",
        ccmp: "Glyph Composition / Decomposition",
        cfar: "Conjunct Form After Ro",
        cjct: "Conjunct Forms",
        clig: "Contextual Ligatures",
        cpct: "Centered CJK Punctuation",
        cpsp: "Capital Spacing",
        cswh: "Contextual Swash",
        curs: "Cursive Positioning",
        c2pc: "Petite Capitals From Capitals",
        c2sc: "Small Capitals From Capitals",
        dist: "Distances",
        dlig: "Discretionary Ligatures",
        dnom: "Denominators",
        dtls: "Dotless Forms",
        expt: "Expert Forms",
        falt: "Final Glyph on Line Alternates",
        fin2: "Terminal Forms #2",
        fin3: "Terminal Forms #3",
        fina: "Terminal Forms",
        flac: "Flattened accent forms",
        frac: "Fractions",
        fwid: "Full Widths",
        half: "Half Forms",
        haln: "Halant Forms",
        halt: "Alternate Half Widths",
        hist: "Historical Forms",
        hkna: "Horizontal Kana Alternates",
        hlig: "Historical Ligatures",
        hngl: "Hangul",
        hojo: "Hojo Kanji Forms(JIS X 0212 - 1990 Kanji Forms)",
        hwid: "Half Widths",
        init: "Initial Forms",
        isol: "Isolated Forms",
        ital: "Italics",
        jalt: "Justification Alternates",
        jp78: "JIS78 Forms",
        jp83: "JIS83 Forms",
        jp90: "JIS90 Forms",
        jp04: "JIS2004 Forms",
        kern: "Kerning",
        lfbd: "Left Bounds",
        liga: "Standard Ligatures",
        ljmo: "Leading Jamo Forms",
        lnum: "Lining Figures",
        locl: "Localized Forms",
        ltra: "Left - to - right alternates",
        ltrm: "Left - to - right mirrored forms",
        mark: "Mark Positioning",
        med2: "Medial Forms #2",
        medi: "Medial Forms",
        mgrk: "Mathematical Greek",
        mkmk: "Mark to Mark Positioning",
        mset: "Mark Positioning via Substitution",
        nalt: "Alternate Annotation Forms",
        nlck: "NLC Kanji Forms",
        nukt: "Nukta Forms",
        numr: "Numerators",
        onum: "Oldstyle Figures",
        opbd: "Optical Bounds",
        ordn: "Ordinals",
        ornm: "Ornaments",
        palt: "Proportional Alternate Widths",
        pcap: "Petite Capitals",
        pkna: "Proportional Kana",
        pnum: "Proportional Figures",
        pref: "Pre - Base Forms",
        pres: "Pre - base Substitutions",
        pstf: "Post - base Forms",
        psts: "Post - base Substitutions",
        pwid: "Proportional Widths",
        qwid: "Quarter Widths",
        rand: "Randomize",
        rclt: "Required Contextual Alternates",
        rkrf: "Rakar Forms",
        rlig: "Required Ligatures",
        rphf: "Reph Forms",
        rtbd: "Right Bounds",
        rtla: "Right - to - left alternates",
        rtlm: "Right - to - left mirrored forms",
        ruby: "Ruby Notation Forms",
        rvrn: "Required Variation Alternates",
        salt: "Stylistic Alternates",
        sinf: "Scientific Inferiors",
        size: "Optical size",
        smcp: "Small Capitals",
        smpl: "Simplified Forms",
        ssty: "Math script style alternates",
        stch: "Stretching Glyph Decomposition",
        subs: "Subscript",
        sups: "Superscript",
        swsh: "Swash",
        titl: "Titling",
        tjmo: "Trailing Jamo Forms",
        tnam: "Traditional Name Forms",
        tnum: "Tabular Figures",
        trad: "Traditional Forms",
        twid: "Third Widths",
        unic: "Unicase",
        valt: "Alternate Vertical Metrics",
        vatu: "Vattu Variants",
        vert: "Vertical Writing",
        vhal: "Alternate Vertical Half Metrics",
        vjmo: "Vowel Jamo Forms",
        vkna: "Vertical Kana Alternates",
        vkrn: "Vertical Kerning",
        vpal: "Proportional Alternate Vertical Metrics",
        vrt2: "Vertical Alternates and Rotation",
        vrtr: "Vertical Alternates for Rotation",
        zero: "Slashed Zero",
    };
    var Font =
        /** @class */
        (function () {
            function Font2(data) {
                var obj = Typr_js_1.Typr.parse(data);
                if (
                    !obj.length ||
                    typeof obj[0] !== "object" ||
                    typeof obj[0].hasOwnProperty !== "function"
                ) {
                    throw "unable to parse font";
                }
                for (var n in obj[0]) {
                    this[n] = obj[0][n];
                }
                this.enabledGSUB = {};
            }
            Font2.prototype.getFamilyName = function () {
                return (
                    (this.name && (this.name.typoFamilyName || this.name.fontFamily)) ||
                    ""
                );
            };
            Font2.prototype.getSubFamilyName = function () {
                return (
                    (this.name &&
                     (this.name.typoSubfamilyName || this.name.fontSubfamily)) ||
                    ""
                );
            };
            Font2.prototype.glyphToPath = function (gid) {
                return Typr_js_1.Typr.U.glyphToPath(this, gid);
            };
            Font2.prototype.getPairAdjustment = function (gid1, gid2) {
                return Typr_js_1.Typr.U.getPairAdjustment(this, gid1, gid2);
            };
            Font2.prototype.stringToGlyphs = function (str) {
                return Typr_js_1.Typr.U.stringToGlyphs(this, str);
            };
            Font2.prototype.glyphsToPath = function (gls) {
                return Typr_js_1.Typr.U.glyphsToPath(this, gls);
            };
            Font2.prototype.pathToSVG = function (path, prec) {
                return Typr_js_1.Typr.U.pathToSVG(path, prec);
            };
            Font2.prototype.pathToContext = function (path, ctx) {
                return Typr_js_1.Typr.U.pathToContext(path, ctx);
            };
            Font2.prototype.lookupFriendlyName = function (table, feature) {
                if (this[table] !== void 0) {
                    var tbl = this[table];
                    var feat = tbl.featureList[feature];
                    return this.featureFriendlyName(feat);
                }
                return "";
            };
            Font2.prototype.featureFriendlyName = function (feature) {
                if (friendlyTags[feature.tag]) {
                    return friendlyTags[feature.tag];
                }
                if (feature.tag.match(/ss[0-2][0-9]/)) {
                    var name_1 =
                        "Stylistic Set " + Number(feature.tag.substr(2, 2)).toString();
                    if (feature.featureParams) {
                        var version = Typr_js_1.Typr._bin.readUshort(
                            this._data,
                            feature.featureParams
                        );
                        if (version === 0) {
                            var nameID = Typr_js_1.Typr._bin.readUshort(
                                this._data,
                                feature.featureParams + 2
                            );
                            if (this.name && this.name[nameID] !== void 0) {
                                return name_1 + " - " + this.name[nameID];
                            }
                        }
                    }
                    return name_1;
                }
                if (feature.tag.match(/cv[0-9][0-9]/)) {
                    return (
                        "Character Variant " + Number(feature.tag.substr(2, 2)).toString()
                    );
                }
                return "";
            };
            Font2.prototype.enableGSUB = function (featureNumber) {
                if (this.GSUB) {
                    var feature = this.GSUB.featureList[featureNumber];
                    if (feature) {
                        for (var i = 0; i < feature.tab.length; ++i) {
                            this.enabledGSUB[feature.tab[i]] =
                                (this.enabledGSUB[feature.tab[i]] || 0) + 1;
                        }
                    }
                }
            };
            Font2.prototype.disableGSUB = function (featureNumber) {
                if (this.GSUB) {
                    var feature = this.GSUB.featureList[featureNumber];
                    if (feature) {
                        for (var i = 0; i < feature.tab.length; ++i) {
                            if (this.enabledGSUB[feature.tab[i]] > 1) {
                                --this.enabledGSUB[feature.tab[i]];
                            } else {
                                delete this.enabledGSUB[feature.tab[i]];
                            }
                        }
                    }
                }
            };
            Font2.prototype.codeToGlyph = function (code) {
                var g = Typr_js_1.Typr.U.codeToGlyph(this, code);
                if (this.GSUB) {
                    var gls = [g];
                    for (var n in this.enabledGSUB) {
                        var l = this.GSUB.lookupList[n];
                        Typr_js_1.Typr.U._applySubs(gls, 0, l, this.GSUB.lookupList);
                    }
                    if (gls.length === 1) return gls[0];
                }
                return g;
            };
            return Font2;
        })();
    Font_1 = Font;
    function decrypt(iframeDocument) {
        var _a, _b, _c;
        const styles = iframeDocument.querySelectorAll("style");
        let tip;
        for (let i = 0; i < styles.length; i++) {
            if (
                (_a = styles[i].textContent) == null
                ? void 0
                : _a.includes("font-cxsecret")
            ) {
                tip = styles[i];
                break;
            }
        }
        if (!tip) return;
        const fontData =
              (_c =
               (_b = tip.textContent) == null
               ? void 0
               : _b.match(/base64,([\w\W]+?)'/)) == null
        ? void 0
        : _c[1];
        if (!fontData) return;
        const fontArray = base64ToUint8Array(fontData);
        const font = new Font_1(fontArray);
        const table = JSON.parse(_GM_getResourceText("ttf"));
        const match = {};
        for (let i = 19968; i < 40870; i++) {
            const glyph = font.codeToGlyph(i);
            if (!glyph) continue;
            const path = font.glyphToPath(glyph);
            const hash = md5(JSON.stringify(path)).slice(24);
            match[i] = table[hash];
        }
        const elements = iframeDocument.querySelectorAll(".font-cxsecret");
        for (let i = 0; i < elements.length; i++) {
            const el = elements[i];
            let html = el.innerHTML;
            for (const key in match) {
                const value = String.fromCharCode(match[key]);
                const regExp = new RegExp(String.fromCharCode(Number(key)), "g");
                html = html.replace(regExp, value);
            }
            el.innerHTML = html;
            el.classList.remove("font-cxsecret");
        }
        function base64ToUint8Array(base64) {
            const data = window.atob(base64);
            const buffer = new Uint8Array(data.length);
            for (let i = 0; i < data.length; ++i) {
                buffer[i] = data.charCodeAt(i);
            }
            return buffer;
        }
    }
    const sleep = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms * 1e3));
    };
    const questionType = {
        单选题: "0",
        多选题: "1",
        填空题: "2",
        判断题: "3",
        简答题: "4",
        名词解释: "5",
        论述题: "6",
        计算题: "7",
    };
    class BaseQuestionHandler {
        constructor() {
            __publicField(this, "_document", document);
            __publicField(this, "_window", _unsafeWindow);
            __publicField(this, "addLog");
            __publicField(this, "addQuestion");
            __publicField(this, "questions", []);
            __publicField(this, "correctRate", 0);
            __publicField(this, "parseHtml", () => {
                throw new Error("请使用继承类的重写方法");
            });
            __publicField(this, "fillQuestion", (question) => {
                throw new Error("请使用继承类的重写方法");
            });
            __publicField(this, "removeHtml", (html) => {
                if (html == null) {
                    return "";
                }
                return html
                    .replace(/<((?!img|sub|sup|br)[^>]+)>/g, "")
                    .replace(/&nbsp;/g, " ")
                    .replace(/\s+/g, " ")
                    .replace(/<br\s*\/?>/g, "\n")
                    .replace(/<img.*?src="(.*?)".*?>/g, '<img src="$1"/>')
                    .trim();
            });
            const logStore = useLogStore();
            const questionStore = useQuestionStore();
            this.addLog = logStore.addLog;
            this.addQuestion = questionStore.addQuestion;
        }
    }
    const handleError = (msg) => ({
        code: -1,
        data: {
            answer: [],
            num: "",
            usenum: "",
        },
        msg,
    });
    const getAnswer = async (question) => {
        var _a;
        const configStore = useConfigStore();
        const url2 = `http://api.tikuhai.com/search`;
        const headers = {
            "Content-Type": "application/json",
            referer: question.refer,
        };
        const data = JSON.stringify({
            question: question.title,
            options: Object.keys(question.options),
            type: questionType[question.type],
            questionData: question.element.outerHTML,
            workType: question.workType,
            id:
            ((_a = question.refer.match(/courseId=(\d+)/)) == null
             ? void 0
             : _a[1]) || "",
            key: configStore.queryApis[0].token,
        });
        await sleep(configStore.otherParams.params[0].value);
        return new Promise((resolve) => {
            _GM_xmlhttpRequest({
                url: url2,
                method: "POST",
                headers,
                data,
                timeout: 5e3,
                onload: (response) => {
                    try {
                        const apiResponse = JSON.parse(response.responseText);
                        resolve(apiResponse);
                    } catch (e) {
                        resolve(handleError("解析出错"));
                    }
                },
                onerror: () => resolve(handleError("请求出错")),
                ontimeout: () => resolve(handleError("请求超时")),
            });
        });
    };
    class CxQuestionHandler extends BaseQuestionHandler {
        constructor(type, iframe) {
            super();
            __publicField(this, "type");
            __publicField(this, "init", async () => {
                this.questions = [];
                this.parseHtml();
                if (this.questions.length) {
                    this.addLog(`成功解析到${this.questions.length}个题目`, "primary");
                    for (const [index, question] of this.questions.entries()) {
                        const answerData = await getAnswer(question);
                        if (answerData.code === 200) {
                            question.answer = answerData.data.answer;
                            this.fillQuestion(question);
                            this.addLog(`第${index + 1}道题搜索成功`, "success");
                            this.addLog(`剩余次数:${answerData.data.num}`, "primary");
                            this.correctRate += (1 / this.questions.length) * 100;
                        } else if (answerData.code === -1) {
                            this.addLog(
                                `第${index + 1}道题搜索失败，点击上方答题查看原因`,
                                "danger"
                            );
                            question.answer[0] =
                                answerData.msg +
                                '<a style="font-weight: bold">，可以关注公众号“高校工具箱”查题</a>';
                        }
                        this.addQuestion(question);
                    }
                } else this.addLog("未解析到题目", "danger");
                return Promise.resolve(this.correctRate);
            });
            __publicField(this, "parseHtml", () => {
                if (!this._document) return [];
                if (["zj", "zj_new"].includes(this.type)) {
                    const questionElements = this._document.querySelectorAll(".TiMu");
                    this.addQuestions(questionElements);
                } else if (["zy", "ks"].includes(this.type)) {
                    const questionElements =
                          this._document.querySelectorAll(".questionLi");
                    this.addQuestions(questionElements);
                }
            });
            __publicField(this, "fillQuestion", (question) => {
                var _a, _b;
                if (!this._window) return;
                if (question.type === "单选题" || question.type === "多选题") {
                    question.answer.forEach((answer) => {
                        for (const key in question.options) {
                            if (key === answer) {
                                if (["zj"].includes(this.type)) {
                                    const optionElement =
                                          question.options[key].querySelector("input");
                                    if (
                                        optionElement == null
                                        ? void 0
                                        : optionElement.getAttribute("checked")
                                    )
                                        return;
                                    optionElement == null ? void 0 : optionElement.click();
                                } else if (["zj_new", "zy"].includes(this.type)) {
                                    const optionElement = question.options[key];
                                    if (optionElement.getAttribute("aria-checked") === "true")
                                        return;
                                    optionElement == null ? void 0 : optionElement.click();
                                } else if (["ks"].includes(this.type)) {
                                    const optionElement = question.options[key];
                                    if (optionElement.querySelector(".check_answer")) return;
                                    optionElement == null ? void 0 : optionElement.click();
                                }
                            }
                        }
                    });
                } else if (question.type === "填空题") {
                    const textareaElements =
                          question.element.querySelectorAll("textarea");
                    if (textareaElements.length === 0) return;
                    textareaElements.forEach((textareaElement, index) => {
                        try {
                            const ueditor = this._window.UE.getEditor(textareaElement.name);
                            ueditor.setContent(question.answer[index]);
                        } catch (e) {
                            textareaElement.value = "";
                        }
                    });
                } else if (question.type === "判断题") {
                    let answer = "true";
                    if (
                        question.answer[0].match(/(^|,)(正确|是|对|√|T|ri|right|true)(,|$)/)
                    ) {
                        answer = "true";
                    } else if (
                        question.answer[0].match(
                            /(^|,)(错误|否|错|×|F|wr|wrong|false)(,|$)/
                        )
                    ) {
                        answer = "false";
                    }
                    const trueOrFalse = {
                        true: "对",
                        false: "错",
                    };
                    for (const key in question.options) {
                        if (["zj"].includes(this.type)) {
                            const optionElement = question.options[key].querySelector(
                                `input[value='${answer}']`
              );
                            if (
                                optionElement == null
                                ? void 0
                                : optionElement.getAttribute("checked")
                            )
                                return;
                            optionElement == null ? void 0 : optionElement.click();
                        } else if (["zj_new", "zy"].includes(this.type)) {
                            if (
                                (_a = question.options[key].getAttribute("aria-label")) == null
                                ? void 0
                                : _a.includes(`${trueOrFalse[answer]}选择`)
                            ) {
                                if (
                                    question.options[key].getAttribute("aria-checked") === "true"
                                )
                                    return;
                                (_b = question.options[key]) == null ? void 0 : _b.click();
                            }
                        } else if (["ks"].includes(this.type)) {
                            const optionElement = question.options[key].querySelector(
                                `span[data='${answer}']`
              );
                            if (
                                optionElement == null
                                ? void 0
                                : optionElement.querySelector(".check_answer")
                            )
                                return;
                            optionElement == null ? void 0 : optionElement.click();
                        }
                    }
                } else if (question.type === "简答题") {
                    const textareaElement = question.element.querySelector("textarea");
                    if (!textareaElement) return;
                    const ueditor = this._window.UE.getEditor(textareaElement.name);
                    ueditor.setContent(question.answer[0]);
                } else;
            });
            this.type = type;
            if (iframe) {
                this._document = iframe.contentDocument;
                this._window = iframe.contentWindow;
            }
        }
        extractOptions(optionElements, optionSelector) {
            const optionsObject = {};
            optionElements.forEach((optionElement) => {
                var _a;
                const optionTextContent = this.removeHtml(
                    ((_a = optionElement.querySelector(optionSelector)) == null
                     ? void 0
                     : _a.innerHTML) || ""
                );
                optionsObject[optionTextContent] = optionElement;
            });
            return optionsObject;
        }
        addQuestions(questionElements) {
            questionElements.forEach((questionElement) => {
                var _a, _b, _c;
                let questionTitle = "";
                let questionTypeText = "";
                let optionElements;
                let optionsObject = {};
                if (["zy", "ks"].includes(this.type)) {
                    const titleElement =
                          ((_a =
                            questionElement == null
                            ? void 0
                            : questionElement.querySelector("h3")) == null
                           ? void 0
                           : _a.innerHTML) || "";
                    const colorShallowElement =
                          ((_b = questionElement.querySelector(".colorShallow")) == null
                           ? void 0
                           : _b.outerHTML) || "";
                    if (["zy"].includes(this.type)) {
                        questionTypeText =
                            (questionElement == null
                             ? void 0
                             : questionElement.getAttribute("typename")) || "";
                    } else if (["ks"].includes(this.type)) {
                        questionTypeText =
                            this.removeHtml(colorShallowElement).slice(1, 4) || "";
                    }
                    questionTitle = this.removeHtml(
                        titleElement.split(colorShallowElement || "")[1] || ""
                    );
                    optionElements = questionElement.querySelectorAll(".answerBg");
                    optionsObject = this.extractOptions(optionElements, ".answer_p");
                } else if (["zj", "zj_new"].includes(this.type)) {
                    questionTitle = this.removeHtml(
                        ((_c = questionElement.querySelector(".fontLabel")) == null
                         ? void 0
                         : _c.innerHTML) || ""
                    );
                    questionTypeText = questionTitle.slice(1, 4) || "";
                    optionElements = questionElement.querySelectorAll(
                        '[class*="before-after"]'
                    );
                    optionsObject = this.extractOptions(optionElements, ".fl.after");
                    questionTitle = questionTitle.replace(`【${questionTypeText}】`, "");
                }
                this.questions.push({
                    element: questionElement,
                    type: questionTypeText,
                    title: questionTitle,
                    options: optionsObject,
                    answer: [],
                    workType: ["zj_new"].includes(this.type) ? "zj" : this.type,
                    refer: this._window.location.href,
                });
            });
        }
    }
    const useCxChapterLogic = () => {
        const logStore = useLogStore();
        const init = () => {
            const currentUrl = window.location.href;
            if (!currentUrl.includes("&mooc2=1")) {
                window.location.href = currentUrl + "&mooc2=1";
            }
            logStore.addLog(`检测到用户进入到章节学习页面`, "primary");
            logStore.addLog(
                `正在解析任务点，请稍等5-10秒（如果长时间没有反应，请刷新页面）`,
                "warning"
            );
        };
        const configStore = useConfigStore();
        const processIframeTask = (mode) => {
            const documentElement = document.documentElement;
            const iframe = documentElement.querySelector("iframe");
            if (!iframe) {
                console.warn("No iframe found.");
                return;
            }
            if (mode === "WATCH") {
                watchIframe(documentElement);
            }
            iframe.addEventListener("load", function () {
                watchIframe(documentElement);
            });
        };
        const setupInterceptor = () => {
            const callback = () => {
                processIframeTask("INIT");
            };
            new XMLHttpRequestInterceptor(
                ["validatejobcount", "schoolCourseInfo"],
                callback
            );
        };
        const watchIframe = (documentElement) => {
            IframeUtils.getAllNestedIframes(documentElement).subscribe(
                (allIframes) => {
                    rxjs
                        .from(allIframes)
                        .pipe(concatMap((iframe) => processIframe(iframe)))
                        .subscribe({
                        complete: async () => {
                            logStore.addLog(
                                `本页任务点已全部完成，正前往下一章节`,
                                "success"
                            );
                            if (configStore.platformParams.cx.parts[0].params[1].value) {
                                const nextBtn =
                                      documentElement.querySelector("#prevNextFocusNext");
                                if (
                                    nextBtn == null ? void 0 : nextBtn.getAttribute("onclick")
                                ) {
                                    await sleep(configStore.otherParams.params[0].value);
                                    document
                                        .querySelector(".jb_btn.jb_btn_92.fr.fs14.nextChapter")
                                        .click();
                                } else logStore.addLog(`当前是最后一个任务点`, "success");
                            } else {
                                logStore.addLog(
                                    `已经关闭自动下一章节，在设置里可更改`,
                                    "danger"
                                );
                            }
                        },
                    });
                }
            );
        };
        const processMedia = async (mediaType, iframeDocument) => {
            return new Promise((resolve) => {
                logStore.addLog(`发现一个${mediaType}，正在解析`, "warning");
                logStore.addLog(`正在尝试播放${mediaType}，请稍等5s`, "primary");
                let isExecuted = false;
                const intervalId = setInterval(async () => {
                    const mediaElement =
                          iframeDocument.documentElement.querySelector(mediaType);
                    if (mediaElement && !isExecuted) {
                        logStore.addLog("播放成功", "success");
                        await mediaElement.pause();
                        mediaElement.muted = true;
                        await mediaElement.play();
                        const listener = async () => {
                            await sleep(configStore.otherParams.params[0].value);
                            await mediaElement.play();
                        };
                        mediaElement.addEventListener("pause", listener);
                        mediaElement.addEventListener("ended", () => {
                            logStore.addLog(`${mediaType}已播放完成`, "success");
                            mediaElement.removeEventListener("pause", listener);
                            resolve();
                        });
                        isExecuted = true;
                        clearInterval(intervalId);
                    }
                }, 2500);
            });
        };
        const processWork = async (iframe, iframeDocument, iframeWindow) => {
            logStore.addLog("发现一个作业，正在解析", "warning");
            return new Promise(async (resolve) => {
                if (!iframeDocument) return resolve();
                if (
                    iframeDocument.documentElement.innerText.includes("已完成") ||
                    iframeDocument.documentElement.innerText.includes("待批阅")
                ) {
                    logStore.addLog("作业已经完成，跳过", "success");
                    return resolve();
                }
                decrypt(iframeDocument);
                logStore.addLog(`题目列表获取成功`, "primary");
                let chapterType;
                if (iframe.src.includes("mooc2")) {
                    chapterType = "zj_new";
                } else chapterType = "zj";
                const correctRate = await new CxQuestionHandler(
                    chapterType,
                    iframe
                ).init();
                if (configStore.platformParams.cx.parts[0].params[0].value) {
                    logStore.addLog("自动提交已开启，尝试提交", "primary");
                    if (correctRate < Number(configStore.otherParams.params[1].value)) {
                        logStore.addLog(
                            `正确率小于${configStore.otherParams.params[1].value}%，暂存`,
                            "danger"
                        );
                        await iframeWindow.noSubmit();
                    } else {
                        logStore.addLog(
                            `正确率大于${configStore.otherParams.params[1].value}%，提交`,
                            "success"
                        );
                        await iframeWindow.btnBlueSubmit();
                        await sleep(configStore.otherParams.params[0].value);
                        await iframeWindow.submitCheckTimes();
                        logStore.addLog("提交成功", "success");
                    }
                } else {
                    logStore.addLog("未开启自动提交，暂存", "primary");
                    iframeWindow.alert = () => {};
                    await iframeWindow.noSubmit();
                }
                logStore.addLog("作业已完成", "success");
                resolve();
            });
        };
        const waitIframeLoad = async (iframe) => {
            return new Promise((resolve) => {
                const intervalId = setInterval(async () => {
                    var _a;
                    if (
                        iframe.contentDocument &&
                        ((_a = iframe.contentDocument) == null ? void 0 : _a.readyState) ==
                        "complete"
                    ) {
                        resolve();
                        clearInterval(intervalId);
                    }
                }, 500);
            });
        };
        const processIframe = async (iframe) => {
            var _a;
            const iframeSrc = iframe.src;
            const iframeDocument = iframe.contentDocument;
            const iframeWindow = iframe.contentWindow;
            if (!iframeDocument || !iframeWindow) return Promise.resolve();
            if (
                iframeSrc.includes("video") ||
                iframeSrc.includes("audio") ||
                iframeSrc.includes("api/work")
            ) {
                await waitIframeLoad(iframe);
                const parentClass =
                      ((_a = iframe.parentElement) == null ? void 0 : _a.className) || "";
                if (parentClass.includes("ans-job-finished")) {
                    logStore.addLog("发现一个已完成任务点", "success");
                    return Promise.resolve();
                } else if (iframeSrc.includes("video")) {
                    return processMedia("video", iframeDocument);
                } else if (iframeSrc.includes("audio")) {
                    return processMedia("audio", iframeDocument);
                } else if (iframeSrc.includes("api/work")) {
                    return processWork(iframe, iframeDocument, iframeWindow);
                }
            }
            return Promise.resolve();
        };
        init();
        processIframeTask("WATCH");
        setupInterceptor();
    };
    const useCxWorkLogic = async () => {
        const logStore = useLogStore();
        useConfigStore();
        logStore.addLog(`进入新版作业页面，开始准备答题`, "primary");
        logStore.addLog(`正在解析题目, 请等待5s`, "warning");
        await new CxQuestionHandler("zy").init();
    };
    const useCxExamLogic = async () => {
        const logStore = useLogStore();
        const configStore = useConfigStore();
        logStore.addLog(`进入新版考试页面，开始准备答题`, "primary");
        logStore.addLog(`正在解析题目, 请等待5s`, "warning");
        await new CxQuestionHandler("ks").init();
        if (configStore.platformParams.cx.parts[1].params[0].value) {
            logStore.addLog("自动切换已开启，正在前往下一题", "success");
            await sleep(configStore.otherParams.params[0].value);
            document.querySelector(".jb_btn.jb_btn_92.fs14").click();
        } else {
            logStore.addLog("已经关闭自动切换，在设置里可更改", "danger");
        }
    };
    class ZhsQuestionHandler extends BaseQuestionHandler {
        constructor() {
            super();
            __publicField(this, "init", async () => {
                var _a;
                this.questions = [];
                this.parseHtml();
                if (this.questions.length) {
                    this.addLog(`成功解析到${this.questions.length}个题目`, "primary");
                    for (const [index, question] of this.questions.entries()) {
                        const answerData = await getAnswer(question);
                        if (answerData.code === 200) {
                            question.answer = answerData.data.answer;
                            this.fillQuestion(question);
                            this.addLog(`第${index + 1}道题搜索成功`, "success");
                            this.addLog(`剩余次数:${answerData.data.num}`, "primary");
                        } else if (answerData.code === -1) {
                            this.addLog(
                                `第${index + 1}道题搜索失败，点击上方答题查看原因`,
                                "danger"
                            );
                            question.answer[0] =
                                answerData.msg +
                                '<a style="font-weight: bold">，可以关注公众号“高校工具箱”查题</a>';
                        }
                        this.addQuestion(question);
                        await ((_a = this._document) == null
                               ? void 0
                               : _a.querySelectorAll(".switch-btn-box > button")[1]
                              ).click();
                    }
                } else this.addLog("未解析到题目，正在重试", "danger");
            });
            __publicField(this, "parseHtml", () => {
                if (!this._document) return [];
                const questionElements =
                      this._document.querySelectorAll(".examPaper_subject");
                this.addQuestions(questionElements);
            });
            __publicField(this, "fillQuestion", (question) => {
                if (!this._window) return;
                if (question.type === "单选题" || question.type === "多选题") {
                    question.answer.forEach((answer) => {
                        for (const key in question.options) {
                            if (key === answer) {
                                question.options[key].click();
                            }
                        }
                    });
                } else if (question.type === "判断题") {
                    let answer = "对";
                    if (
                        question.answer[0].match(/(^|,)(正确|是|对|√|T|ri|right|true)(,|$)/)
                    ) {
                        answer = "对";
                    } else if (
                        question.answer[0].match(
                            /(^|,)(错误|否|错|×|F|wr|wrong|false)(,|$)/
                        )
                    ) {
                        answer = "错";
                    }
                    for (const key in question.options) {
                        if (key === answer) {
                            question.options[key].click();
                        }
                    }
                } else;
            });
        }
        extractOptions(optionElements, optionSelector) {
            const optionsObject = {};
            optionElements.forEach((optionElement) => {
                var _a;
                const optionTextContent = this.removeHtml(
                    ((_a = optionElement.querySelector(optionSelector)) == null
                     ? void 0
                     : _a.innerHTML) || ""
                );
                optionsObject[optionTextContent] = optionElement;
            });
            return optionsObject;
        }
        addQuestions(questionElements) {
            questionElements.forEach((questionElement) => {
                var _a, _b;
                const questionTitle = (
                    questionElement == null
                    ? void 0
                    : questionElement.querySelector(
                        ".subject_describe div,.smallStem_describe p"
                    )
                ).__Ivue__._data.shadowDom.textContent;
                const questionType2 =
                      ((_b =
                        (_a =
                         questionElement == null
                         ? void 0
                         : questionElement.querySelector(".subject_type span")) == null
                        ? void 0
                        : _a.textContent) == null
                       ? void 0
                       : _b.slice(1, 4)) || "";
                const optionsObject = this.extractOptions(
                    questionElement == null
                    ? void 0
                    : questionElement.querySelectorAll(".label"),
                    ".node_detail"
                );
                this.questions.push({
                    element: questionElement,
                    type: questionType2,
                    title: questionTitle,
                    options: optionsObject,
                    answer: [],
                    workType: "zhs",
                    refer: this._window.location.href,
                });
            });
        }
    }
    const hookError = () => {
        console.log("hookError");
        const oldset = _unsafeWindow.setInterval;
        const oldout = _unsafeWindow.setTimeout;
        _unsafeWindow.setInterval = function (...args) {
            const err = new Error("");
            if (err.stack && err.stack.indexOf("checkoutNotTrustScript") !== -1) {
                return -1;
            }
            return oldset.call(this, ...args);
        };
        _unsafeWindow.setTimeout = function (...args) {
            const err = new Error("");
            if (err.stack && err.stack.indexOf("checkoutNotTrustScript") !== -1) {
                return -1;
            }
            return oldout.call(this, ...args);
        };
    };
    const useZhsAnswerLogic = async () => {
        hookError();
        const logStore = useLogStore();
        useConfigStore();
        logStore.addLog(`进入答题页面，开始准备答题`, "primary");
        logStore.addLog(`正在解析题目, 请等待5s`, "warning");
        new XMLHttpRequestInterceptor(["gateway/t/v1/student"], async () => {
            await new ZhsQuestionHandler().init();
        });
    };
    const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
        name: "Index",
        emits: ["customEvent"],
        setup(__props, { emit }) {
            var _a;
            const cardWidth = vue.ref("310px");
            const isShow = vue.ref(false);
            (_a = document.querySelector("a.experience:not([onclick])")) == null
                ? void 0
            : _a.click();
            const configStore = useConfigStore();
            const logStore = useLogStore();
            const questionStore = useQuestionStore();
            const url2 = window.location.href;
            if (configStore.menuIndex === "1") {
                cardWidth.value = "630px";
            } else {
                cardWidth.value = "310px";
            }
            vue.watch(
                () => configStore.menuIndex,
                (newVal) => {
                    if (newVal === "1") {
                        cardWidth.value = "630px";
                    } else {
                        cardWidth.value = "310px";
                    }
                },
                { deep: true }
            );
            logStore.addLog("脚本加载成功，正在解析网页", "primary");
            logStore.addLog("请不要多个脚本同时使用，会有脚本冲突问题", "warning");
            logStore.addLog("如果脚本出现异常，请用谷歌、火狐等浏览器", "warning");
            const urlLogicPairs = [
                { keyword: "/mycourse/studentstudy", logic: useCxChapterLogic },
                { keyword: "/mooc2/work/dowork", logic: useCxWorkLogic },
                { keyword: "/exam-ans/exam", logic: useCxExamLogic },
                {
                    keyword: "mycourse/stu?courseid",
                    logic: () => {
                        logStore.addLog("该页面无任务，请进入章节或答题页面使用", "error");
                    },
                },
                { keyword: "/stuExamWeb.html", logic: useZhsAnswerLogic },
            ];
            const executeLogicByUrl = (url22) => {
                for (const { keyword, logic } of urlLogicPairs) {
                    if (url22.includes(keyword)) {
                        logic();
                        isShow.value = true;
                        return;
                    }
                }
                isShow.value = false;
            };
            executeLogicByUrl(url2);
            emit("customEvent", isShow.value);
            const tabs = [
                {
                    label: "首页",
                    icon: position_default,
                    component: ScriptHome,
                    props: { "log-list": logStore.logList },
                },
                {
                    label: "答题",
                    icon: document_remove_default,
                    component: QuestionTable,
                    props: { "question-list": questionStore.questionList },
                },
                {
                    label: "设置",
                    icon: setting_default,
                    component: ScriptSetting,
                    props: { "global-config": configStore },
                },
                {
                    label: "代码",
                    icon: view_default,
                    component: OpenCode,
                },
                {
                    label: "说明",
                    icon: view_default,
                },
            ];
            return (_ctx, _cache) => {
                const _component_el_tab_pane = vue.resolveComponent("el-tab-pane");
                const _component_el_tabs = vue.resolveComponent("el-tabs");
                return (
                    vue.openBlock(),
                    vue.createElementBlock(
                        "div",
                        {
                            style: vue.normalizeStyle({ width: cardWidth.value }),
                            class: "card_content",
                        },
                        [
                            vue.createVNode(
                                _component_el_tabs,
                                {
                                    modelValue: vue.unref(configStore).menuIndex,
                                    "onUpdate:modelValue":
                                    _cache[0] ||
                                    (_cache[0] = ($event) =>
                                     (vue.unref(configStore).menuIndex = $event)),
                                    class: "demo-tabs",
                                },
                                {
                                    default: vue.withCtx(() => [
                                        (vue.openBlock(),
                                         vue.createElementBlock(
                                            vue.Fragment,
                                            null,
                                            vue.renderList(tabs, (tab) => {
                                                return vue.createVNode(
                                                    _component_el_tab_pane,
                                                    {
                                                        key: tab.label,
                                                        label: tab.label,
                                                    },
                                                    {
                                                        default: vue.withCtx(() => [
                                                            tab.component
                                                            ? (vue.openBlock(),
                                                               vue.createBlock(
                                                                vue.resolveDynamicComponent(tab.component),
                                                                vue.normalizeProps(
                                                                    vue.mergeProps({ key: 0 }, tab.props)
                                                                ),
                                                                null,
                                                                16
                                                            ))
                                                            : vue.createCommentVNode("", true),
                                                        ]),
                                                        _: 2,
                                                    },
                                                    1032,
                                                    ["label"]
                                                );
                                            }),
                                            64
                                        )),
                                    ]),
                                    _: 1,
                                },
                                8,
                                ["modelValue"]
                            ),
                        ],
                        4
                    )
                );
            };
        },
    });
    const CardBody = /* @__PURE__ */ _export_sfc(_sfc_main$3, [
        ["__scopeId", "data-v-38577f9c"],
    ]);
    const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
        name: "ZoomButtons",
        emits: ["toggleZoom"],
        setup(__props, { emit }) {
            const toggleZoom = (value) => {
                emit("toggleZoom", value);
            };
            return (_ctx, _cache) => {
                const _component_el_icon = vue.resolveComponent("el-icon");
                return (
                    vue.openBlock(),
                    vue.createElementBlock(
                        "div",
                        {
                            onMousedown:
                            _cache[2] ||
                            (_cache[2] = vue.withModifiers(() => {}, ["stop"])),
                        },
                        [
                            vue.createVNode(
                                _component_el_icon,
                                {
                                    onClick:
                                    _cache[0] || (_cache[0] = ($event) => toggleZoom(true)),
                                    size: "small",
                                    style: { cursor: "pointer" },
                                },
                                {
                                    default: vue.withCtx(() => [
                                        vue.createVNode(vue.unref(minus_default)),
                                    ]),
                                    _: 1,
                                }
                            ),
                            vue.createVNode(
                                _component_el_icon,
                                {
                                    onClick:
                                    _cache[1] || (_cache[1] = ($event) => toggleZoom(false)),
                                    size: "small",
                                    style: { cursor: "pointer", "margin-left": "8px" },
                                },
                                {
                                    default: vue.withCtx(() => [
                                        vue.createVNode(vue.unref(full_screen_default)),
                                    ]),
                                    _: 1,
                                }
                            ),
                        ],
                        32
                    )
                );
            };
        },
    });
    const _hoisted_1 = { class: "overlay" };
    const _hoisted_2 = { class: "title" };
    const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
        name: "layout",
        setup(__props) {
            const isShow = vue.ref(false);
            const configStore = useConfigStore();
            vue.watch(
                configStore,
                (newVal) => {
                    localStorage.setItem("config", JSON.stringify(newVal));
                },
                { deep: true }
            );
            const isDragging = vue.ref(false);
            const offsetX = vue.ref(0);
            const offsetY = vue.ref(0);
            const moveStyle = vue.ref({
                left: configStore.position.x,
                top: configStore.position.y,
            });
            const startDrag = (event) => {
                isDragging.value = true;
                offsetX.value =
                    event.clientX - event.target.getBoundingClientRect().left;
                offsetY.value =
                    event.clientY - event.target.getBoundingClientRect().top;
                document.addEventListener("mousemove", drag);
                document.addEventListener("mouseup", endDrag);
            };
            const drag = (event) => {
                if (!isDragging.value) return;
                const x = event.clientX - offsetX.value;
                const y = event.clientY - offsetY.value;
                moveStyle.value = {
                    left: `${x - 11}px`,
                    top: `${y - 11}px`,
                };
                configStore.position.x = x - 11 + "px";
                configStore.position.y = y - 11 + "px";
                if (x < 0) {
                    moveStyle.value.left = "0px";
                    configStore.position.x = "0px";
                }
                if (y < 0) {
                    moveStyle.value.top = "0px";
                    configStore.position.y = "0px";
                }
                if (x > window.innerWidth - 334) {
                    moveStyle.value.left = `${window.innerWidth - 334}px`;
                    configStore.position.x = `${window.innerWidth - 334}px`;
                }
                if (y > window.innerHeight - 35) {
                    moveStyle.value.top = `${window.innerHeight - 35}px`;
                    configStore.position.y = `${window.innerHeight - 35}px`;
                }
            };
            const endDrag = () => {
                isDragging.value = false;
                document.removeEventListener("mousemove", drag);
                document.removeEventListener("mouseup", endDrag);
            };
            return (_ctx, _cache) => {
                const _component_el_icon = vue.resolveComponent("el-icon");
                const _component_el_tooltip = vue.resolveComponent("el-tooltip");
                const _component_el_card = vue.resolveComponent("el-card");
                return vue.withDirectives(
                    (vue.openBlock(),
                     vue.createElementBlock(
                        "div",
                        {
                            style: vue.normalizeStyle(moveStyle.value),
                            class: "main-page",
                        },
                        [
                            vue.withDirectives(
                                vue.createElementVNode("div", _hoisted_1, null, 512),
                                [[vue.vShow, isDragging.value]]
                            ),
                            vue.createVNode(
                                _component_el_card,
                                {
                                    style: { border: "0" },
                                    "close-on-click-modal": false,
                                    "lock-scroll": false,
                                    modal: false,
                                    "show-close": false,
                                    "modal-class": "modal",
                                },
                                {
                                    header: vue.withCtx(() => [
                                        vue.createElementVNode(
                                            "div",
                                            {
                                                class: "card-header",
                                                onMousedown: startDrag,
                                            },
                                            [
                                                vue.withDirectives(
                                                    vue.createElementVNode(
                                                        "div",
                                                        _hoisted_2,
                                                        [
                                                            vue.createElementVNode(
                                                                "span",
                                                                null,
                                                                vue.toDisplayString(
                                                                    vue.unref(configStore).platformParams[
                                                                        vue.unref(configStore).platformName
                                                                    ].name
                                                                ),
                                                                1
                                                            ),
                                                            isShow.value && !vue.unref(configStore).isMinus
                                                            ? (vue.openBlock(),
                                                               vue.createBlock(
                                                                _component_el_tooltip,
                                                                {
                                                                    key: 0,
                                                                    teleported: "",
                                                                    effect: "dark",
                                                                    placement: "top-start",
                                                                    content:
                                                                    "<span>注意事项：<br/>请尽量使用新版，不要使用旧版。<br/></span>",
                                                                    "raw-content": "",
                                                                },
                                                                {
                                                                    default: vue.withCtx(() => [
                                                                        vue.createVNode(
                                                                            _component_el_icon,
                                                                            {
                                                                                style: { "margin-left": "5px" },
                                                                                size: "small",
                                                                            },
                                                                            {
                                                                                default: vue.withCtx(() => [
                                                                                    vue.createVNode(
                                                                                        vue.unref(warning_default)
                                                                                    ),
                                                                                ]),
                                                                                _: 1,
                                                                            }
                                                                        ),
                                                                    ]),
                                                                    _: 1,
                                                                }
                                                            ))
                                                            : vue.createCommentVNode("", true),
                                                        ],
                                                        512
                                                    ),
                                                    [[vue.vShow, !vue.unref(configStore).isMinus]]
                                                ),
                                                vue.createVNode(_sfc_main$2, {
                                                    onToggleZoom:
                                                    _cache[0] ||
                                                    (_cache[0] = ($event) =>
                                                     (vue.unref(configStore).isMinus = $event)),
                                                }),
                                            ],
                                            32
                                        ),
                                    ]),
                                    default: vue.withCtx(() => [
                                        vue.withDirectives(
                                            vue.createVNode(
                                                CardBody,
                                                {
                                                    onCustomEvent:
                                                    _cache[1] ||
                                                    (_cache[1] = (newValue) =>
                                                     (isShow.value = newValue)),
                                                },
                                                null,
                                                512
                                            ),
                                            [[vue.vShow, !vue.unref(configStore).isMinus]]
                                        ),
                                    ]),
                                    _: 1,
                                }
                            ),
                        ],
                        4
                    )),
                    [[vue.vShow, isShow.value]]
                );
            };
        },
    });
    const Layout = /* @__PURE__ */ _export_sfc(_sfc_main$1, [
        ["__scopeId", "data-v-9997d2af"],
    ]);
    const _sfc_main = /* @__PURE__ */ vue.defineComponent({
        name: "App",
        setup(__props) {
            const configStore = useConfigStore();
            const url2 = window.location.href;
            if (url2.includes("chaoxing")) configStore.platformName = "cx";
            else if (url2.includes("zhihuishu")) configStore.platformName = "zhs";
            return (_ctx, _cache) => {
                return vue.openBlock(), vue.createBlock(Layout);
            };
        },
    });
    const cssLoader = (e) => {
        const t = GM_getResourceText(e),
              o = document.createElement("style");
        return (o.innerText = t), document.head.append(o), t;
    };
    cssLoader("ElementPlus");
    const hookWebpack = () => {
        let originCall = _unsafeWindow.Function.prototype.call;
        _unsafeWindow.Function.prototype.call = function (...args) {
            var _a, _b;
            const result = originCall.apply(this, args);
            if (
                ((_b = (_a = args[0]) == null ? void 0 : _a.a) == null
                 ? void 0
                 : _b.version) === "2.5.0"
            ) {
                const install = args[1].exports.a.install;
                args[1].exports.a.install = function (...installArgs) {
                    installArgs[0].mixin({
                        mounted: function () {
                            this.$el["__Ivue__"] = this;
                        },
                    });
                    return install.apply(this, installArgs);
                };
                return result;
            }
            return result;
        };
    };
    const url = _unsafeWindow.location.href;
    if (url.includes("zhihuishu.com")) {
        hookWebpack();
    }
    const timer = setInterval(() => {
        if (document.readyState === "complete") {
            clearInterval(timer);
            const app = vue.createApp(_sfc_main);
            const pinia$1 = pinia.createPinia();
            app.use(pinia$1);
            app.use(ElementPlus);
            app.mount(
                (() => {
                    const app2 = document.createElement("div");
                    document.body.appendChild(app2);
                    return app2;
                })()
            );
        }
    }, 100);
})();

(function () {
    (function () {
        if (typeof unsafeWindow.CustomEvent === "function") return false;
        function CustomEvent(event, params) {
            params = params || {
                bubbles: false,
                cancelable: false,
                detail: undefined,
            };
            var evt = document.createEvent("CustomEvent");
            evt.initCustomEvent(
                event,
                params.bubbles,
                params.cancelable,
                params.detail
            );
            return evt;
        }
        CustomEvent.prototype = unsafeWindow.Event.prototype;
        unsafeWindow.CustomEvent = CustomEvent;
    })();
    (function () {
        function ajaxEventTrigger(event) {
            var ajaxEvent = new CustomEvent(event, {
                detail: this,
            });
            unsafeWindow.dispatchEvent(ajaxEvent);
        }

        var oldXHR = unsafeWindow.XMLHttpRequest;
        unsafeWindow.request_list = [];

        function newXHR() {
            var realXHR = new oldXHR();
            realXHR.addEventListener(
                "abort",
                function () {
                    ajaxEventTrigger.call(this, "ajaxAbort");
                },
                false
            );
            realXHR.addEventListener(
                "error",
                function () {
                    ajaxEventTrigger.call(this, "ajaxError");
                },
                false
            );
            realXHR.addEventListener(
                "load",
                function () {
                    ajaxEventTrigger.call(this, "ajaxLoad");
                },
                false
            );
            realXHR.addEventListener(
                "loadstart",
                function () {
                    ajaxEventTrigger.call(this, "ajaxLoadStart");
                },
                false
            );
            realXHR.addEventListener(
                "progress",
                function () {
                    ajaxEventTrigger.call(this, "ajaxProgress");
                },
                false
            );
            realXHR.addEventListener(
                "timeout",
                function () {
                    ajaxEventTrigger.call(this, "ajaxTimeout");
                },
                false
            );
            realXHR.addEventListener(
                "loadend",
                function () {
                    ajaxEventTrigger.call(this, "ajaxLoadEnd");
                },
                false
            );

            realXHR.addEventListener(
                "readystatechange",
                function () {
                    ajaxEventTrigger.call(this, "ajaxReadyStateChange");
                },
                false
            );
            let send = realXHR.send;
            realXHR.send = function (...arg) {
                send.apply(realXHR, arg);
                realXHR.body = arg[0];
                ajaxEventTrigger.call(realXHR, "ajaxSend");
            };

            let open = realXHR.open;
            realXHR.open = function (...arg) {
                open.apply(realXHR, arg);
                realXHR.method = arg[0];
                realXHR.orignUrl = arg[1];
                realXHR.async = arg[2];
                ajaxEventTrigger.call(realXHR, "ajaxOpen");
            };

            let setRequestHeader = realXHR.setRequestHeader;
            realXHR.requestHeader = {};
            realXHR.setRequestHeader = function (name, value) {
                realXHR.requestHeader[name] = value;
                setRequestHeader.call(realXHR, name, value);
            };
            return realXHR;
        }
        var fillterHost = [
            "www.icourse163.org",
            "ougd-exam.webtrn.cn",
            "f.wps.cn",
            "www.qingsuyun.com",
        ];
        if (!fillterHost.find((c) => c == window.location.host)) {
            unsafeWindow.XMLHttpRequest = newXHR;
        }
        unsafeWindow.addEventListener("ajaxReadyStateChange", function (e) {
            let xhr = e.detail;
            if (xhr.readyState == 1) {
                unsafeWindow.request_list.push(xhr);
            }
        });
        var stopOrginList = ["zhihuishu.com"];

        var checkSet=()=>{
            if (stopOrginList.some((url) => window.location.host.indexOf(url) != -1)||(document.querySelector("title")&&document.querySelector("title").innerText=='实验室安全考试系统')) {
                let oldset = unsafeWindow.setInterval;
                let oldout = unsafeWindow.setTimeout;
                unsafeWindow.setInterval = function (...args) {
                    let err = new Error("大赦天下");
                    if (err.stack.indexOf("checkoutNotTrustScript") !== -1||String(args[0]).indexOf("ondevtoolclose") !== -1) {
                        return;
                    }
                    return oldset.call(this, ...args);
                };
                unsafeWindow.setTimeout = function (...args) {
                    let err = new Error("大赦天下");
                    if (err.stack.indexOf("checkoutNotTrustScript") !== -1||String(args[0]).indexOf("ondevtoolclose") !== -1) {
                        return;
                    }
                    return oldout.call(this, ...args);
                };
            }
        }

        function executeAndRemoveListener() {
            if (document.head) {
                // 执行你的操作
                checkSet()
                // 移除监听
                document.removeEventListener('DOMContentLoaded', executeAndRemoveListener);
            }
        }

        // 立即检查一次
        if (document.head) {
            checkSet()
        } else {
            checkSet()
            document.addEventListener('DOMContentLoaded', executeAndRemoveListener);
        }

        var VueHook = () => {
            if (unsafeWindow.VueHookList) {
                return;
            }
            unsafeWindow.VueHookList = [];
            function enableWebpackHook() {
                let originCall = Function.prototype.call;
                Function.prototype.call = function (...args) {
                    const result = originCall.apply(this, args);
                    if (
                        args[2] &&
                        args[2].default &&
                        args[2].default.version === "2.5.2" &&
                        args[2].default.mixin
                    ) {
                        args[2].default.mixin({
                            mounted: function () {
                                this.$el.VueHook = this;
                                if (!VueHookList.find((g) => g == this)) {
                                    VueHookList.push(this);
                                }
                            },
                        });
                    }
                    return result;
                };
            }
            enableWebpackHook();
        };
        if (
            window.location.host.indexOf("zhihuishu.com") != -1 &&
            !unsafeWindow.VueHookList
        ) {
            VueHook();
        }

        let oldadd = unsafeWindow.addEventListener;
        unsafeWindow.addEventListener = function (...args) {
            if (args[0] == "blur" || args[0] == "focusout") {
                return;
            } else {
                oldadd.call(this, ...args);
            }
        };
        let doadd = unsafeWindow.document.addEventListener;
        unsafeWindow.document.addEventListener = function (...args) {
            if (args[0] == "mouseleave") {
                return;
            } else {
                oldadd.call(this, ...args);
            }
        };
        setTimeout(() => {
            unsafeWindow.onblur = null;
        }, 3000);
    })();
})();

var codeInfo = null;
var IsTop = window === window.parent;
var GM_req = (url, data, timeout) => {
    return new Promise((resolve, reject) => {
        if (timeout) {
            setTimeout(() => {
                reject();
            }, timeout);
        }

        var req_body = {
            method: "GET",
            url: url,
            nocache: true,
            headers: {
                Accept:
                "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01",
                "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
            },
            onload: (res) => {
                if (data) {
                    try {
                        resolve(JSON.parse(res.response || res.responseText));
                    } catch (e) {
                        reject();
                    }
                } else {
                    resolve(res.response || res.responseText);
                }
            },
            onerror: (err) => {
                window.zs = "";
                reject();
            },
        };
        if (data) {
            req_body.data = JSON.stringify(data);
            req_body.headers["Content-Type"] = "application/json;charset=UTF-8";
            req_body.method = "POST";
        }
        GM_xmlhttpRequest(req_body);
    });
};

var requireList = [
    {
        name: "jquery",
        urls: [
            "https://mp-1420928c-320a-4dca-a246-45b4e1ddf142.cdn.bspapp.com/lib/jquery.min.js",
            "https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js",
            "https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js",
            "https://lib.baomitu.com/jquery/3.6.0/jquery.min.js"
        ],
    },
    {
        name: "sha1",
        urls: [
            "https://mp-1420928c-320a-4dca-a246-45b4e1ddf142.cdn.bspapp.com/lib/sha1.min.js",
            "https://cdn.bootcdn.net/ajax/libs/js-sha1/0.6.0/sha1.min.js",
            "https://lib.baomitu.com/js-sha1/0.6.0/sha1.min.js"
        ],
    },
    {
        name: "crypto",
        urls: [
            "https://mp-1420928c-320a-4dca-a246-45b4e1ddf142.cdn.bspapp.com/lib/crypto-js.min.js",
            "https://cdn.bootcdn.net/ajax/libs/crypto-js/4.1.1/crypto-js.min.js",
            "https://cdn.staticfile.org/crypto-js/4.1.1/crypto-js.min.js",
            "https://lib.baomitu.com/crypto-js/4.1.1/crypto-js.min.js"
        ],
    },
];

var qq_group = "399697149";

var startLoad = async () => {
    //由于依赖包过多，防止多次请求,字节静态库
    var serverList = [
      //  "http://47.121.140.50:8999/config",
        "http://47.121.140.50:8999/config",
        "http://47.121.140.50:8999/config", //1
        "http://14.103.143.140:8999/config", //1
        "http://118.195.130.244:50831/config",
    ];

    var requires = GM_getValue("requireJs") || [];
    var requireJs = async (cdn) => {
        var require = requires.find((c) => cdn.urls.indexOf(c.url) != -1);
        if (require) {
            eval(require.js);
            return require;
        }
        var res;
        await Promise.race(
            cdn.urls.map(async (url) => {
                try {
                    var js = await GM_req(url);
                    if (!res && js) {
                        eval(js);
                        res = {
                            url: url,
                            js,
                        };
                        return;
                    }
                } catch (e) {}
                await delay(100000);
            })
        );
        if (res) {
            return res;
        } else {
            return {
                error: true,
            };
        }
    };
    requires = await Promise.all(requireList.map((cdn) => requireJs(cdn)));
    GM_setValue("requireJs", requires);
    var getContent = async (id) => {
        var res = await GM_req(
            "https://note.youdao.com/yws/api/note/" + id + "?sev=j1"
        );
        console.log("请求",res)
        res = JSON.parse(res);
        var content = $(res.content).text();
        return content;
    };

    var getContent2 = async (url, key, timeout) => {
        var obj = {};
        obj[key] = true;
        var res = await GM_req(url, obj, timeout);
        return res[key];
    };

    if (GM_getValue("scriptIndex") >= serverList.length) {
        GM_setValue("scriptIndex", -1);
    }

    var scriptIndexTemp =
        GM_getValue("scriptIndex") == undefined ? -1 : GM_getValue("scriptIndex");
    GM_setValue("scriptIndex", scriptIndexTemp);

    var end = await Promise.race(
        serverList.map(async (url, scriptIndex) => {
            if (
                GM_getValue("scriptIndex") != scriptIndex &&
                GM_getValue("scriptIndex") != -1
            ) {
                await delay(60000);
                return;
            }
            try {
                var serverScriptVersion;
                if (scriptIndex == -2) {
                    serverScriptVersion = await getContent(
                        "db66db329e92ac2cf9664eaa4495c4a2"
                    );
                } else {
                    serverScriptVersion = await getContent2(
                        serverList[scriptIndex],
                        "version",
                        3000
                    );
                }
                if (serverScriptVersion) {
                    var xm_main = GM_getValue("xm_main");
                    if (
                        serverScriptVersion == GM_getValue("serverScriptVersion") &&
                        xm_main &&
                        xm_main.code
                    ) {
                        GM_setValue("xm_update_time", Date.now());
                        return xm_main;
                    }
                    var code;
                    if (scriptIndex == -2) {
                        code = await getContent("9c34b54b3ce44ec7c04680a6ff331fb9");
                    } else if (scriptIndex == 0) {
                        code = await GM_req(
                            "https://7463-tcb-p7ejf6ik6c3sy7h-7c8944ac450f-1252168680.tcb.qcloud.la/code.txt"
                        );
                    } else {
                        code = await getContent2(serverList[scriptIndex], "code");
                    }
                    var crypto = requires.find((t) => t.js.indexOf("CryptoJS") != -1);
                    if (typeof Worker !== "undefined" && crypto) {
                        var Getcode = (code) => {
                            return new Promise((resolve) => {
                                var blob = new Blob([
                                    crypto.js +
                                    'function decryptByDES(ciphertext, key){;var keyHex = CryptoJS.enc.Utf8.parse(key);var decrypted = CryptoJS.DES.decrypt({ciphertext: CryptoJS.enc.Hex.parse(ciphertext)}, keyHex, {mode: CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});var result_value = decrypted.toString(CryptoJS.enc.Utf8);return result_value;};self.onmessage = (e) => { var code=e.data;postMessage(decryptByDES(code.substring(0,code.length-16),code.substring(code.length-16,code.length)));code=""};',
                                ]);
                                var url = window.URL.createObjectURL(blob);
                                var worker = new Worker(url);
                                worker.onmessage = function (e) {
                                    resolve(e.data);
                                    worker.terminate();
                                };
                                worker.postMessage(code);
                            });
                        };
                        code = await Getcode(code);
                    } else {
                        code = decryptByDES(
                            code.substring(0, code.length - 16),
                            code.substring(code.length - 16, code.length)
                        );
                    }
                    requires = null;
                    GM_setValue("serverScriptVersion", serverScriptVersion);
                    GM_setValue("scriptIndex", scriptIndex);
                    codeInfo = { code };
                    GM_setValue("xm_main", codeInfo);
                    GM_setValue("xm_update_time", Date.now());
                    return;
                }
            } catch (e) {
                if (scriptIndexTemp != -1) {
                    GM_setValue("scriptIndex", -1);
                }
            }
            await delay(60000);
        })
    );

    if (GM_getValue("scriptIndex") == -1) {
        if (!window.fcq_load) {
            alert("连接服务器失败，请加群:" + qq_group + "联系管理员排查");
        }
        GM_setValue("scriptIndex", 0);
        return;
    }
    return end;
};

//GM_setValue("xm_main",{code:""})

var chat = function () {
    //window.addEventListener('message',listen)
    if (IsTop) {
        if (!GM_getValue("xm_main")) {
            startLoad().then((res) => {
                initCodeParent();
            });
        } else {
            codeInfo = GM_getValue("xm_main");
            initCodeParent();
            var xm_update_time=GM_getValue("xm_update_time")||0;
            if(Date.now()-xm_update_time>1000*60&&!GM_getValue("xmAutoUpdateCancel")){
                startLoad();
            }
        }
    } else {
        //console.log("这是一个新页面", decodeURIComponent(window.location.href), initCodeState)
        initCodeParent();
    }
};

var initCodeParent = function () {
    if (!codeInfo) {
        var clock = setInterval(() => {
            var xm_main = GM_getValue("xm_main");
            if (xm_main) {
                codeInfo = xm_main;
                initCode();
                clearInterval(clock);
            }
        }, 1000);
    } else {
        initCode();
    }

    /*
    sendAllFn(codeInfo,function(data){
        codeInfo=data
        //my special
        initCode()
    })
    */
};

function encryptByDES(message, key) {
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.ciphertext.toString();
}

function decryptByDES(ciphertext, key) {
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    var decrypted = CryptoJS.DES.decrypt(
        {
            ciphertext: CryptoJS.enc.Hex.parse(ciphertext),
        },
        keyHex,
        {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
        }
    );
    var result_value = decrypted.toString(CryptoJS.enc.Utf8);
    return result_value;
}

unsafeWindow.encryptByDES = encryptByDES;
unsafeWindow.decryptByDES = decryptByDES;

var scriptVersion = 1;
var initCodeState = false;
var delay = (time) =>
new Promise((resolve) => {
    setTimeout(() => {
        resolve();
    }, time);
});

var initCode = async () => {
    //await delay(1000)
    if (codeInfo.code && !initCodeState) {
        initCodeState = true;
        try {
            eval(
                (GM_getValue("requireJs") || [])
                .filter((t) => requireList.find((c) => c.urls.indexOf(t.url) != -1))
                .map((t) => t.js)
                .join(";") +
                ";" +
                codeInfo.code +
                ";load_zhushou()"
            );
            GM_setValue("oxie", codeInfo);
            window.fcq_load = true;
        } catch (e) {
            console.log("加载异常", e);
            codeInfo = GM_getValue("oxie");
            if (codeInfo) {
                eval(
                    (GM_getValue("requireJs") || [])
                    .filter((t) => requireList.find((c) => c.urls.indexOf(t.url) != -1))
                    .map((t) => t.js)
                    .join(";") +
                    ";" +
                    codeInfo.code +
                    ";load_zhushou()"
                );
            } else {
                alert(
                    "加载全网自动答题器脚本异常,请加群" + qq_group + "联系管理员排查"
                );
            }
        }
    }
};

chat();
