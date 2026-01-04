
// ==UserScript==
// @name         刷单号脚本
// @namespace  自动刷单
// @version      0.0.1
// @description  刷单号脚本测试
// @author       Wind_DSA
// @match        https://trade.m.jd.com/*
// @match        https://item.m.jd.com/*
// @match        https://mpay.m.jd.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlasinfo.com.cn
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/495225/%E5%88%B7%E5%8D%95%E5%8F%B7%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/495225/%E5%88%B7%E5%8D%95%E5%8F%B7%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
Window.onload = function () {
  console.log(11231232);
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://api.m.jd.com/client.action?t=1715931542924&loginType=2&loginWQBiz=golden-trade&appid=m_core&client=Win32&clientVersion=&build=&osVersion=iOS&screen=375*667&networkType=4g&partner=&forcebot=&d_brand=iPhone&d_model=iPhone&lang=zh-CN&scope=&sdkVersion=&openudid=&uuid=17125526692631624279989&x-api-eid-token=jdd03LO3ODEGCEE4K23HQ2HPV6ZQQP3BOCVS32PAPYU2QOXGV2D32BVEGDI7FNK3FAIKWPP77M3A4PRNMSRMPNXMCP4BPBAAAAAMPQWLQ4QQAAAAADXO7ILYWZJSWRYX&functionId=order_list_m&body=%7B%22appType%22%3A3%2C%22bizType%22%3A%222%22%2C%22deviceUUId%22%3A%22%22%2C%22platform%22%3A3%2C%22sceneval%22%3A%222%22%2C%22source%22%3A%22m_inner_myJd.orderFloor_orderlist%22%2C%22systemBaseInfo%22%3A%22%7B%5C%22pixelRatio%5C%22%3A2%2C%5C%22screenWidth%5C%22%3A375%2C%5C%22screenHeight%5C%22%3A667%2C%5C%22windowWidth%5C%22%3A375%2C%5C%22windowHeight%5C%22%3A667%2C%5C%22statusBarHeight%5C%22%3Anull%2C%5C%22safeArea%5C%22%3A%7B%5C%22bottom%5C%22%3A0%2C%5C%22height%5C%22%3A0%2C%5C%22left%5C%22%3A0%2C%5C%22right%5C%22%3A0%2C%5C%22top%5C%22%3A0%2C%5C%22width%5C%22%3A0%7D%2C%5C%22bluetoothEnabled%5C%22%3Afalse%2C%5C%22locationEnabled%5C%22%3Afalse%2C%5C%22wifiEnabled%5C%22%3Afalse%2C%5C%22deviceOrientation%5C%22%3A%5C%22portrait%5C%22%2C%5C%22benchmarkLevel%5C%22%3A-1%2C%5C%22brand%5C%22%3A%5C%22iPhone%5C%22%2C%5C%22model%5C%22%3A%5C%22iPhone%5C%22%2C%5C%22system%5C%22%3A%5C%22iOS%5C%22%2C%5C%22platform%5C%22%3A%5C%22Win32%5C%22%2C%5C%22SDKVersion%5C%22%3A%5C%22%5C%22%2C%5C%22enableDebug%5C%22%3Afalse%2C%5C%22language%5C%22%3A%5C%22zh-CN%5C%22%2C%5C%22version%5C%22%3A%5C%22%5C%22%2C%5C%22theme%5C%22%3A%5C%22light%5C%22%2C%5C%22fontSizeSetting%5C%22%3Anull%2C%5C%22albumAuthorized%5C%22%3Afalse%2C%5C%22cameraAuthorized%5C%22%3Afalse%2C%5C%22locationAuthorized%5C%22%3Afalse%2C%5C%22microphoneAuthorized%5C%22%3Afalse%2C%5C%22notificationAuthorized%5C%22%3Afalse%2C%5C%22notificationAlertAuthorized%5C%22%3Afalse%2C%5C%22notificationBadgeAuthorized%5C%22%3Afalse%2C%5C%22notificationSoundAuthorized%5C%22%3Afalse%2C%5C%22phoneCalendarAuthorized%5C%22%3Afalse%2C%5C%22locationReducedAccuracy%5C%22%3Afalse%2C%5C%22environment%5C%22%3A%5C%22%5C%22%7D%22%2C%22orderListTag%22%3A1%2C%22curTab%22%3A%22waitPay%22%2C%22keyword%22%3A%22%22%2C%22page%22%3A1%2C%22pageSize%22%3A10%2C%22tenantCode%22%3A%22jgm%22%2C%22bizModelCode%22%3A%222%22%2C%22bizModeClientType%22%3A%22M%22%2C%22bizModeFramework%22%3A%22Taro%22%2C%22externalLoginType%22%3A1%2C%22token%22%3A%223852b12f8c4d869b7ed3e2b3c68c9436%22%2C%22appId%22%3A%22m91d27dbf599dff74%22%7D&h5st=20240517161316524%3Baaa3aztgpmzizz04%3B44550%3Btk03w82c11bc918nTP7ATdV0gWCKiO5MZIThHGFhg_JHQ-3VEo3gWyJmHx1kBPsxMGxOgInxFDixejxcPAN2ELyf-WBb%3B978416cdeb44b2cce198e9a427ab5907fca72ad00edfb0f981d8198713662fcc%3B4.2%3B1715933596524%3B19b8793aa1a5eded15af3184736e1b667736a6adae452e88d0007c36fbce9cf371705c70a32b7453357d28f0c60e6ac8ce6fb5f990e9fb8e157dab7eb97300ab398fdac083ad249971399c7d85803cbd443f8f8f3e808f6e7058a2aa35d4697ba0389f9c23bcfe54ba84b023af993aab2f0a814a1abdcfe10d0c5716f27677c02a010b514a23f47747bc14e39ce36876abe7eb1c2da4db559c93700538a5079788970541c6ecb5dd1bf0d1211339063bf6a5f46898af778951ec0a74eda07ec2cafea545c4aa207c7d5a3874ab8d45833d4d44aed552b4435dd79f145a8e8d77f22ffd29b721e5b13fbc513dfbfd689926c44c5837caaf84a3f42bf2167d889395f3e08c3a4f66fc5d02e38b9b4eddf66356c9f62acaa81462f47d9460bcbcf5fcb1de47ac7b452a02098170de5291edb68f158f6eeedc8d5699910c82a8463478e4d65bb6474ca12f704dbd2f86f3d3",
    headers: {
      Host: "api.m.jd.com",
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1",
      Accept: "*/*",
      "Accept-Language":
        "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
      "Accept-Encoding": "gzip, deflate, br",
      Referer: " https://trade.m.jd.com/",
      Origin: "https://trade.m.jd.com",
      Connection: " keep-alive",
      Cookie:
        "__jda=76161171.1468190211.1715931348.1715931348.1715931349.1; unpl=JF8EALBnNSttXhtRUBhXHkJCSlkHW15fHEcAO2ZSBA5YGwNVGlETFhZ7XlVdWBRKEx9vYRRUWVNJUA4eCisSEXteXVdZDEsWC2tXVgQFDQ8VXURJQlZAFDNVCV9dSRZRZjJWBFtdT1xWSAYYRRMfDlAKDlhCR1FpMjVkXlh7VAQrAh4VGUtVVV1dCHsWM2hXNWRfXk9TAx0yGiIRex8AAlsBSRQDbSoFUVpRS1wEGAIbIhF7Xg; __jdb=76161171.16.1468190211|1.1715931349; __jdc=76161171; __jdv=76161171|baidu-pinzhuan|t_288551095_baidupinzhuan|cpc|0f3d30c8dba7459bb52f2eb5eba8ac7d_0_7a4d2d4ac05b42ffa2e0fab1afa0b957|1715931416256; __jdu=1468190211; 3AB9D23F7A4B3CSS=jdd03RC7FJ6TOSAPDIKFT2UFJBOAOANRFHMRVS53A7FH4GZUJNFJ23MVP6QF3BPH2D2S4L42VGEZADHTB7ENNNWURX5SSTIAAAAMPQV6GEOYAAAAADPHUQY3W5XDRPAX; 3AB9D23F7A4B3C9B=RC7FJ6TOSAPDIKFT2UFJBOAOANRFHMRVS53A7FH4GZUJNFJ23MVP6QF3BPH2D2S4L42VGEZADHTB7ENNNWURX5SSTI; areaId=1; ipLoc-djd=1-2806-0-0; PCSYCityID=CN_110000_110100_0; shshshfpa=b9ac2256-3ab8-892d-215c-d58fade587a9-1715931351; shshshfpx=b9ac2256-3ab8-892d-215c-d58fade587a9-1715931351; shshshfpb=BApXcr_F1hupAWoxGyP9nmZOVvPgWIzZzBlfSFH5o9xJ1OutSc4LptinKMUPdNeY; wxa_level=1; retina=1; cid=9; wqmnx1=MDEyNjM4MnRhLmVsLmMyMTEzQ2NvZXkxJm1tZW90ODlvLm5pU2lPcHQxTEdlNGIxcjFzZjQyRUgmUg%3D%3D; jxsid=17159314167923373218; appCode=ms0ca95114; webp=1; mba_muid=1468190211; mba_sid=17159314169419900091532476816.15; visitkey=6823827840459938099; autoOpenApp_downCloseDate_jd_homePage=1715931463215_1; yodaId=%C2%A3477db4152e676a91f0a8b46b9fce199d%C2%A3; jcap_dvzw_fp=ENnhC3AqErMEkga9ckI6uDnl_k4hVeQbWTL0KDZRhjJsIzPxz0h_PupxOT52J3fwGdluxLHMeA4Soddp0YbiwQ==; TrackerID=__1QAvi_E3VX6qosRU_CUIEKp1NJXqNcuFsNMzFpTwx3OxBI2m9a1G_RutQo4Iw53U4KHXyZ7JsCwbKHHKJdlIklnyHdoQJP468iJMlSVFKzK7s8a23TnFUxSjia6nts; pt_key=AAJmRwlGADCPizs7Ty-oCThWL8wx7VPdguiCXQrNwpYQAmJj8X0mPpiYVqNpeWOu0ckqM2gLR3E; pt_pin=Wind_DSA; pt_token=equunfpx; pwdt_id=Wind_DSA; sfstoken=tk01m8c321bd0a8sM3gxeDN4M2J3KBaXLNibiW/s0iJQPqD2ODW2GvtlgQNYnm8XZUCtbkBJb7xQvUqWYVBE+IgozhP/; whwswswws=; _gia_d=1; cd_eid=jdd03RC7FJ6TOSAPDIKFT2UFJBOAOANRFHMRVS53A7FH4GZUJNFJ23MVP6QF3BPH2D2S4L42VGEZADHTB7ENNNWURX5SSTIAAAAMPQV6GEOYAAAAADPHUQY3W5XDRPAX; __wga=1715931542742.1715931472151.1715931472151.1715931472151.6.1; PPRD_P=UUID.1468190211; jxsid_s_t=1715931542773; jxsid_s_u=https%3A//trade.m.jd.com/order/orderlist_jdm.shtml; sc_width=390",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "no-cors",
      "Sec-Fetch-Site": "same-site",
      TE: "trailers",
      Pragma: "no-cache",
      "Cache-Control": " no-cache",
    },
    responseType: "json",
    onload: function (xhr) {
      console.log(xhr, "--------------------------");
    },
    onerror: function () {},
  });

  // 获取页面URL
  var url = document.location.href;
  if (url.includes("mpay.m.jd.com/")) {
    location.href = "https://u.jd.com/UiOlEYz";
    return;
  }
  // 获取 "支付定金" 元素
  const paymentDepositSpan = document.querySelector("#rightBtn");
  if (paymentDepositSpan) {
    // 模拟点击元素
    paymentDepositSpan.click();
  }
  // 获取所有标签名为 '在线支付元素' 的元素
  const taroButtonCoreElements = document.querySelector(".button_button_F8xFK");

  console.log(taroButtonCoreElements);
  if (taroButtonCoreElements) {
    // 模拟点击元素
    taroButtonCoreElements.click();
    setTimeout(() => {
      // 获取所有标签名为 '同意并下单' 的元素
      const txbxd = document.querySelector(".modal_confirm_RxZfU");

      if (txbxd) {
        // 模拟点击元素
        txbxd.click();
      }
    }, 200);
  }
};