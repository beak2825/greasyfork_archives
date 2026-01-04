// ==UserScript==
// @name        速卖通推荐长尾关键词、商品订单数与评论数
// @namespace   https://greasyfork.org/zh-CN/users/216246
// @version     3.5.6
// @description 速卖通根据核心关键词采集长尾词
// @icon        data:image/png;base64,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
// @author      H.ZH
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.min.js
// @require     https://cdn.bootcdn.net/ajax/libs/limonte-sweetalert2/11.4.8/sweetalert2.all.min.js
// @include     /https://(www|pt)\.aliexpress\.com/w/.*$/
// @include     /https://(www|pt)\.aliexpress\.com/category/.*$/
// @include     /https://(www|pt)\.aliexpress\.com/wholesale.*$/
// @include     /https://(www|pt)\.aliexpress\.com//
// @grant       unsafeWindow
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       GM_xmlhttpRequest
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/441957/%E9%80%9F%E5%8D%96%E9%80%9A%E6%8E%A8%E8%8D%90%E9%95%BF%E5%B0%BE%E5%85%B3%E9%94%AE%E8%AF%8D%E3%80%81%E5%95%86%E5%93%81%E8%AE%A2%E5%8D%95%E6%95%B0%E4%B8%8E%E8%AF%84%E8%AE%BA%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/441957/%E9%80%9F%E5%8D%96%E9%80%9A%E6%8E%A8%E8%8D%90%E9%95%BF%E5%B0%BE%E5%85%B3%E9%94%AE%E8%AF%8D%E3%80%81%E5%95%86%E5%93%81%E8%AE%A2%E5%8D%95%E6%95%B0%E4%B8%8E%E8%AF%84%E8%AE%BA%E6%95%B0.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

; (function () {
  'use strict';
  Date.prototype.format = function (fmt) {
    var o = {
      "M+": this.getMonth() + 1,                 //月份
      "d+": this.getDate(),                    //日
      "h+": this.getHours(),                   //小时
      "m+": this.getMinutes(),                 //分
      "s+": this.getSeconds(),                 //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return fmt;
  }

  let sleep = function (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  },
    FDate = {
      nowDate: (f) => new Date().format(f ? f : "yyyy-MM-dd"),
      nowTime: (f) => new Date().format(f ? f : "yyyy-MM-dd hh:mm:ss"),
      yestoday: (f) => {
        let n = new Date();
        n.setDate(n.getDate() - 1);
        return n.format(f ? f : "yyyy-MM-dd");
      },
      tomorrow: (f) => {
        let n = new Date();
        n.setDate(n.getDate() + 1);
        return n.format(f ? f : "yyyy-MM-dd");
      },
      getDate: function (d, f) {
        return d ? new Date(d).format(f ? f : "yyyy-MM-dd") : this.nowDate();
      },
      diffDay: function (sDate, eDate) {//参数没做格式验证
        sDate = Date.parse(sDate);
        eDate = Date.parse(eDate);
        return Math.abs(Math.ceil((eDate - sDate) / (1 * 24 * 60 * 60 * 1000)));
      },
      compare:function(d1,d2){//d1,d2字符串格式
        return new Date(d1).getTime() - new Date(d2).getTime();
      }
    },
    parseURLParams = function (url) {
      let params = {}
      let regex = /([^?=&]+)=([^?=&]+)/g
      url.replace(regex, function () {
        params[arguments[1]] = arguments[2]
      })
      return params;
    },
    storage = {
      setData: function (key, value) {
        return GM_setValue(key, value);
      },
      getData: function (key, value) {
        return GM_getValue(key, value);
      },
      deleteData: function (key) {
        GM_deleteValue(key);
      },
    },
    randNum = Math.ceil(Math.random() * 100000),
    cookieID = getCookie("cna"),
    _m_h5_tk = getCookie("_m_h5_tk"),
    atoz = [" ", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "for"],
    clzId = `dz${randNum}`,
    keyData = {
      main_keywords: storage.getData("main_keywords", [])//核心关键词
      , min_score: storage.getData("min_score", 4)
      , atoz_keywords: storage.getData("atoz_keywords", [])//atoz词组
      , query_keywords: storage.getData("query_keywords", [])//用于查询的词组(atoz+atoz首次推荐词)
      , query_index: storage.getData("query_index", 0)//查询词组索引
      , result_keywords: storage.getData("result_keywords", {})//查询结果
      , is_finish_query_keywords: storage.getData("is_finish_query_keywords", !0)//是否完成推荐词查询
      , show_all_keywords: storage.getData("show_all_keywords", !0)//是否展示或导出所有采集结果（包括已经标记删除的关键词）
      , title_kw:[
        {id:'kw1',data:storage.getData("title_kw1", [])},
        {id:'kw2',data:storage.getData("title_kw2", [])},
        {id:'kw3',data:storage.getData("title_kw3", [])}
      ]
    }
    , orderData = {
      ord_rev_res: storage.getData("ord_rev_res", [])
      , is_finish_ord_rev: storage.getData("is_finish_ord_rev", !0)
      , ord_rev_minorder: storage.getData("ord_rev_minorder", 5)
      , ord_rev_opts: (function () {
        let options = storage.getData("ord_rev_opts", {});
        return {
          start_page: options.start_page ? options.start_page : 1
          , end_page: options.end_page ? options.end_page : 10
          , cur_page: options.cur_page ? options.cur_page : 1
          , query_index: options.query_index ? options.query_index : 0
          , fetch_url: options.fetch_url ? options.fetch_url : (function () {
            let search = parseURLParams(location.search);
            delete search.page;
            return location.origin + location.pathname + "?" + $.param(search);
          })()
        }
      })()
    }
    , aeBaseUrl = {
      msite: "https://m.aliexpress.com/",
      pcsite: "https://www.aliexpress.com/"
    }
    , isRuning = !1
    , alimid = getCookie("x_alimid")
    , tableConfig=storage.getData("table_config", {});

  let toast = Swal.mixin({
    toast: true,
    position: 'center',
    showConfirmButton: false,
    timer: 3e3,
    timerProgressBar: false
  });

  const message = {
    success: (text) => {
      toast.fire({ title: text, icon: 'success' });
    },
    error: (text) => {
      toast.fire({ title: text, icon: 'error' });
    },
    warning: (text) => {
      toast.fire({ title: text, icon: 'warning' });
    },
    info: (text) => {
      toast.fire({ title: text, icon: 'info' });
    },
    question: (text) => {
      toast.fire({ title: text, icon: 'question' });
    }
  };

  function showDialog(options) {
    return Swal.fire(
      Object.assign({
        html: "",
        footer: "",
        allowOutsideClick: !1,
        showCloseButton: !1,
        showConfirmButton: !0,
        showCancelButton: !0,
      }, options || {}))
  }

  function getCookie(name) {
    let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
      return decodeURIComponent(arr[2]);
    }
    else {
      return null;
    }
  }
  function formVerify(elem) {
    let verify = {
      required: [
        /[\S]+/
        , '必填项不能为空'
      ]
      , number: function (value) {
        if (!value || isNaN(value)) return '只能填写数字'
      }
    },
      stop = !0,
      warning = `${clzId}-input-danger`;
    let verifyElem = elem.find('[verify]');
    $.each(verifyElem, function (idx, item) {
      var that = $(this)
        , vers = that.attr('verify').split('|')
        , value = that.val();
      that.removeClass(warning);
      $.each(vers, function (_, thisVer) {
        var isTrue //是否命中校验
          , errorText = '' //错误提示文本
          , isFn = typeof verify[thisVer] === 'function';
        if (verify[thisVer]) {
          var isTrue = isFn ? errorText = verify[thisVer](value, item) : !verify[thisVer][0].test(value);
          errorText = errorText || verify[thisVer][1];
          if (isTrue) {
            message.info(errorText);
            that.addClass(warning);
            item.focus();
            return stop = false;
          }
        }
      });
      if (!stop) return stop;
    });
    return stop;
  }
  function showError(msg) {
    window.console && console.error && console.error('DZ hint: ' + msg);
  }

  function getOptions(options) {
    options = options || {};
    return {
      mtopRelationRecommend: {
        appId: 18390,
        appKey: "12574478", //pc:24815441  m:12574478
        jsv: "2.5.1",
        v: "1.0",
        api: "mtop.relationrecommend.AliexpressRecommend.recommend",
        type: "jsonp",
        dataType: "jsonp",
        domain: "https://acs.aliexpress.com/",
        data: {
          query: options.keywords ? options.keywords : "",
          userMemberSeq: "",
          language: "en",
          site: "glo",
          shipToCountry: "CN",
          shipToCity: "",
          clientType: "msite",
          cookieId: cookieID,
          statusOfUsingPrivacy: ""
        }
      },
      glosearch: {
        baseurl: "https://www.aliexpress.com/",
        api: "https://www.aliexpress.com/glosearch/api/product",
        data: Object.assign({
          trafficChannel: "main",
          ltype: "wholesale",
          SortType: "default",
          CatId: 0,//也可能有具体值
          origin: "y"
        }, options)
      },
      seoPopular: {
        baseurl: "https://www.aliexpress.com/",
        api: "https://www.aliexpress.com/i/api/product",
        data: Object.assign({
          seoChannel: "popular",
          trafficChannel: "seo",
          d: "y",
          ltype: "p",
          SortType: "default",
          origin: "y",
          CatId: 0//也可能是有具体的CatId
        }, options)
      },
      msiteDetail: {
        baseurl: "https://m.aliexpress.com/",
        api: "https://m.aliexpress.com/fn/fc-detail-msite/index",
      }
    }
  }

  function aeSign(k, t) {//t:pc 或 msite
    /*
  https://acs.aliexpress.com/h5/mtop.relationrecommend.aliexpressrecommend.recommend/1.0/
  jsv: 2.5.1
  appKey: 24815441 //pc:24815441  m:12574478
  t: (new Date).getTime()
  sign: 86aacb738374606def5df44eebf119cb
  api: mtop.relationrecommend.AliexpressRecommend.recommend
  v: 1.0
  type: jsonp
  dataType: jsonp
  callback: mtopjsonp2
  data: {"appId":18390,"params":"{\"query\":\"beads \",\"userMemberSeq\":\"\",\"language\":\"en\",\"site\":\"glo\",\"shipToCountry\":\"CN\",\"shipToCity\":\"\",\"clientType\":\"pc\",\"cookieId\":\"jpVuGvCSbEkCAXuc6KfwoY8d\",\"statusOfUsingPrivacy\":\"\"}"}
  //    {"appId":"18390","params":"{\"query\":\"beads \",\"userMemberSeq\":\"\",\"language\":\"en\",\"site\":\"glo\",\"shipToCountry\":\"CN\",\"shipToCity\":\"\",\"clientType\":\"msite\",\"cookieId\":\"jpVuGvCSbEkCAXuc6KfwoY8d\",\"statusOfUsingPrivacy\":\"\"}"}

  accept: *\/*
  accept-encoding: gzip, deflate, br
  accept-language: zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7
  cookie: ali_apache_id=33.44.155.249.1642571638118.842545.3; cna=jpVuGvCSbEkCAXuc6KfwoY8d; aep_common_f=NLJBRJiejLuGtX5vyuCCwUShZvr3MEFrC1rJn9R7poGpq/y545DISg==; _gcl_au=1.1.2048510220.1643633625; account_v=1; _lang=zh_CN; xman_f=/K3ooZFKrx5HprVep4atNZeE1G5awFy0b/IyWY3A2tM99U5adh4nkycsKSM7JQd7AwjO8ksfKGM9FOFERWL+de+qYEGxLRqykMzpt7OYH87bVpZD+h5+wi/+dZx7NegruU1NBD03vKpW70/oKFjieso0FwciVZXcq90nXIAIEoRU+WvKSV8mgl9Zwr/AH7xTi1Lt98OAJkHeKx7P1DWHkdENvjedwrT3lV4gLAOXAI/rWfYLdegR8op/qmBRo51E+4KPevNdB/M0AHo6uvB7aWsGLfyL8rXaRncFsPH+X0CXANjqjqQwV8A+t5ICNwOngy6mn6hnX5ksyORtrqUwWF8bf3VY/fR5qyYSN5Sl3G5P8Z75bRXAvHnwS7b4bMGlcz+cwWeuu4Gr6wYxFZFDUXQyJMypw3bLCUksg3jqbz4=; aep_history=keywords%5E%0Akeywords%09%0A%0Aproduct_selloffer%5E%0Aproduct_selloffer%0932921839910%091005001596057069%0933050152851%091192034597%0933038096503%091005003809656368%091005002695313252%0932990512932; aep_usuc_f=isfm=y&site=glo&c_tp=USD&x_alimid=243022481&iss=y&s_locale=zh_CN&region=CN&b_locale=en_US; xman_t=yMPlQtTIzR5qpXRGdGe7G5XFdJel1E/YQC/LqMU0Iy/ddv/RZAvYZtiOkP5iz3Bg; ali_apache_track=mt=2|mid=cn1532809194eqyr; intl_locale=en_US; acs_usuc_t=x_csrf=11rolg6ds2fpn&acs_rt=b50092d4b0484a15aa65fd967fb4e2cf; xlly_s=1; _m_h5_tk=a1085f3c5a8ff8a84f8361a9ef77b338_1647005578871; _m_h5_tk_enc=54d36a834c34f33f07bc2c0c38764269; xman_us_f=zero_order=y&x_locale=en_US&x_l=1&last_popup_time=1642571960382&x_user=CN|null|null|cnfm|243022481&no_popup_today=n&x_lid=cn1532809194eqyr&x_c_chg=0&x_as_i=%7B%22cookieCacheEffectTime%22%3A1647004002413%2C%22isCookieCache%22%3A%22Y%22%2C%22ms%22%3A%220%22%7D&acs_rt=1c0e7e62014c423ab37157d4d72187c6; _gid=GA1.2.671645562.1647003696; intl_common_forever=9Ulml+oaI+a2EAKABw4KqK+IlQ4PsZZ13j5Q43KfqZJPCZ5RpCp0CA==; _ga_VED1YSGNC7=GS1.1.1647003684.22.1.1647003717.0; _ga=GA1.1.1179085239.1642572815; tfstk=czwCBvYw5eYQOHfyLksNLBlUIiMPaYKjV6g3A7SC-YBG3seSWsDX3qMh07YJCSn1.; l=eBPmYKmqg8fLZ9wWBO5BPurza77ToIRbzoVzaNbMiInca6L5tFg6fNCnjoUpSdtjgtCvye-Pkdi_7RhyWZUdgvh0UBGhPkr7qxJO.; isg=BAMDdJNTZUGKzSp5gp9nXLyFkseteJe6HGXdtzXg02LZ9CEWvkreCrciboS60O-y
  referer: https://www.aliexpress.com/wholesale?catId=0&initiative_id=SB_20220311050153&SearchText=beads
  sec-fetch-dest: script
  sec-fetch-mode: no-cors
  sec-fetch-site: same-site
  user-agent: Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36
"7622f311fa65484b7ecb77798604ecbe&1647101109016&12574478&{"appId":"18390","params":"{\"query\":\"beads\",\"userMemberSeq\":\"243022481\",\"language\":\"en\",\"site\":\"glo\",\"shipToCountry\":\"CN\",\"shipToCity\":\"\",\"clientType\":\"msite\",\"cookieId\":\"jpVuGvCSbEkCAXuc6KfwoY8d\",\"statusOfUsingPrivacy\":\"\"}"}"
  "5742b89f609d841f4d27b400261ee093"
  **/
    var o = getOptions({ keywords: k }),
      token = _m_h5_tk.substr(0, _m_h5_tk.indexOf("_")),
      d = {
        appId: !t || t == "msite" ? o.mtopRelationRecommend.appId.toString() : o.mtopRelationRecommend.appId
        , params: function () {
          !t || t == "msite" ? o.mtopRelationRecommend.data.clientType = "msite" : o.mtopRelationRecommend.data.clientType = "pc";
          return JSON.stringify(o.mtopRelationRecommend.data);
        }()
      },
      a = !t || t == "msite" ? "12574478" : "24815441",//pc:24815441  m:12574478
      s = (new Date).getTime(),
      u = function (e) {
        function t(e, t) {
          return e << t | e >>> 32 - t
        }
        function n(e, t) {
          var n, r, i, o, a;
          return i = 2147483648 & e,
            o = 2147483648 & t,
            a = (1073741823 & e) + (1073741823 & t),
            (n = 1073741824 & e) & (r = 1073741824 & t) ? 2147483648 ^ a ^ i ^ o : n | r ? 1073741824 & a ? 3221225472 ^ a ^ i ^ o : 1073741824 ^ a ^ i ^ o : a ^ i ^ o
        }
        function r(e, r, i, o, a, s, u) {
          return e = n(e, n(n(function (e, t, n) {
            return e & t | ~e & n
          }(r, i, o), a), u)),
            n(t(e, s), r)
        }
        function i(e, r, i, o, a, s, u) {
          return e = n(e, n(n(function (e, t, n) {
            return e & n | t & ~n
          }(r, i, o), a), u)),
            n(t(e, s), r)
        }
        function o(e, r, i, o, a, s, u) {
          return e = n(e, n(n(function (e, t, n) {
            return e ^ t ^ n
          }(r, i, o), a), u)),
            n(t(e, s), r)
        }
        function a(e, r, i, o, a, s, u) {
          return e = n(e, n(n(function (e, t, n) {
            return t ^ (e | ~n)
          }(r, i, o), a), u)),
            n(t(e, s), r)
        }
        function s(e) {
          var t, n = "",
            r = "";
          for (t = 0; 3 >= t; t++) n += (r = "0" + (e >>> 8 * t & 255).toString(16)).substr(r.length - 2, 2);
          return n
        }
        var u, c, l, p, f, d, h, g, m, v;
        for (v = function (e) {
          for (var t, n = e.length,
            r = n + 8,
            i = 16 * ((r - r % 64) / 64 + 1), o = new Array(i - 1), a = 0, s = 0; n > s;) a = s % 4 * 8,
              o[t = (s - s % 4) / 4] = o[t] | e.charCodeAt(s) << a,
              s++;
          return a = s % 4 * 8,
            o[t = (s - s % 4) / 4] = o[t] | 128 << a,
            o[i - 2] = n << 3,
            o[i - 1] = n >>> 29,
            o
        }(e = function (e) {
          e = e.replace(/\r\n/g, "\n");
          for (var t = "",
            n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            128 > r ? t += String.fromCharCode(r) : r > 127 && 2048 > r ? (t += String.fromCharCode(r >> 6 | 192), t += String.fromCharCode(63 & r | 128)) : (t += String.fromCharCode(r >> 12 | 224), t += String.fromCharCode(r >> 6 & 63 | 128), t += String.fromCharCode(63 & r | 128))
          }
          return t
        }(e)), d = 1732584193, h = 4023233417, g = 2562383102, m = 271733878, u = 0; u < v.length; u += 16) c = d,
          l = h,
          p = g,
          f = m,
          d = r(d, h, g, m, v[u + 0], 7, 3614090360),
          m = r(m, d, h, g, v[u + 1], 12, 3905402710),
          g = r(g, m, d, h, v[u + 2], 17, 606105819),
          h = r(h, g, m, d, v[u + 3], 22, 3250441966),
          d = r(d, h, g, m, v[u + 4], 7, 4118548399),
          m = r(m, d, h, g, v[u + 5], 12, 1200080426),
          g = r(g, m, d, h, v[u + 6], 17, 2821735955),
          h = r(h, g, m, d, v[u + 7], 22, 4249261313),
          d = r(d, h, g, m, v[u + 8], 7, 1770035416),
          m = r(m, d, h, g, v[u + 9], 12, 2336552879),
          g = r(g, m, d, h, v[u + 10], 17, 4294925233),
          h = r(h, g, m, d, v[u + 11], 22, 2304563134),
          d = r(d, h, g, m, v[u + 12], 7, 1804603682),
          m = r(m, d, h, g, v[u + 13], 12, 4254626195),
          g = r(g, m, d, h, v[u + 14], 17, 2792965006),
          d = i(d, h = r(h, g, m, d, v[u + 15], 22, 1236535329), g, m, v[u + 1], 5, 4129170786),
          m = i(m, d, h, g, v[u + 6], 9, 3225465664),
          g = i(g, m, d, h, v[u + 11], 14, 643717713),
          h = i(h, g, m, d, v[u + 0], 20, 3921069994),
          d = i(d, h, g, m, v[u + 5], 5, 3593408605),
          m = i(m, d, h, g, v[u + 10], 9, 38016083),
          g = i(g, m, d, h, v[u + 15], 14, 3634488961),
          h = i(h, g, m, d, v[u + 4], 20, 3889429448),
          d = i(d, h, g, m, v[u + 9], 5, 568446438),
          m = i(m, d, h, g, v[u + 14], 9, 3275163606),
          g = i(g, m, d, h, v[u + 3], 14, 4107603335),
          h = i(h, g, m, d, v[u + 8], 20, 1163531501),
          d = i(d, h, g, m, v[u + 13], 5, 2850285829),
          m = i(m, d, h, g, v[u + 2], 9, 4243563512),
          g = i(g, m, d, h, v[u + 7], 14, 1735328473),
          d = o(d, h = i(h, g, m, d, v[u + 12], 20, 2368359562), g, m, v[u + 5], 4, 4294588738),
          m = o(m, d, h, g, v[u + 8], 11, 2272392833),
          g = o(g, m, d, h, v[u + 11], 16, 1839030562),
          h = o(h, g, m, d, v[u + 14], 23, 4259657740),
          d = o(d, h, g, m, v[u + 1], 4, 2763975236),
          m = o(m, d, h, g, v[u + 4], 11, 1272893353),
          g = o(g, m, d, h, v[u + 7], 16, 4139469664),
          h = o(h, g, m, d, v[u + 10], 23, 3200236656),
          d = o(d, h, g, m, v[u + 13], 4, 681279174),
          m = o(m, d, h, g, v[u + 0], 11, 3936430074),
          g = o(g, m, d, h, v[u + 3], 16, 3572445317),
          h = o(h, g, m, d, v[u + 6], 23, 76029189),
          d = o(d, h, g, m, v[u + 9], 4, 3654602809),
          m = o(m, d, h, g, v[u + 12], 11, 3873151461),
          g = o(g, m, d, h, v[u + 15], 16, 530742520),
          d = a(d, h = o(h, g, m, d, v[u + 2], 23, 3299628645), g, m, v[u + 0], 6, 4096336452),
          m = a(m, d, h, g, v[u + 7], 10, 1126891415),
          g = a(g, m, d, h, v[u + 14], 15, 2878612391),
          h = a(h, g, m, d, v[u + 5], 21, 4237533241),
          d = a(d, h, g, m, v[u + 12], 6, 1700485571),
          m = a(m, d, h, g, v[u + 3], 10, 2399980690),
          g = a(g, m, d, h, v[u + 10], 15, 4293915773),
          h = a(h, g, m, d, v[u + 1], 21, 2240044497),
          d = a(d, h, g, m, v[u + 8], 6, 1873313359),
          m = a(m, d, h, g, v[u + 15], 10, 4264355552),
          g = a(g, m, d, h, v[u + 6], 15, 2734768916),
          h = a(h, g, m, d, v[u + 13], 21, 1309151649),
          d = a(d, h, g, m, v[u + 4], 6, 4149444226),
          m = a(m, d, h, g, v[u + 11], 10, 3174756917),
          g = a(g, m, d, h, v[u + 2], 15, 718787259),
          h = a(h, g, m, d, v[u + 9], 21, 3951481745),
          d = n(d, c),
          h = n(h, l),
          g = n(g, p),
          m = n(m, f);
        return (s(d) + s(h) + s(g) + s(m)).toLowerCase()
      }(token + "&" + s + "&" + a + "&" + JSON.stringify(d))
    return { data: JSON.stringify(d), t: s, sign: u };
  }

  function send(options) {
    let details = options || {};
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest(Object.assign({
        url: details.url,
        method: details.method || "post",
        data: details.data || {},
        responseType: details.type || 'json',
        onload: function (res) {
          resolve(res.response || res.responseText);
        },
        ontimeout: (res) => {
          reject(`接口${details.url}连接超时`);
        },
        onerror: (res) => {
          reject(`接口${details.url}连接时发生错误`);
        }
      }, details.details || {}));
    })
  }
  function addStyle(cssText) {
    GM_addStyle(cssText);
  }

  async function batchGetKeywords(keywordsList, fn) {
    for (; keyData.query_index < keywordsList.length && isRuning; keyData.query_index++) {
      await fn(keywordsList[keyData.query_index])
    }
    return new Promise((reslove, reject) => {
      reslove()
    })
  }
  function getAeMsiteKeywords(kw, fn) {
    let options = getOptions({ keywords: kw })
      , index = keyData.query_index + 1
      , signData = aeSign(kw, "msite")
      , url = options.mtopRelationRecommend.domain + "h5/" + options.mtopRelationRecommend.api + "/" + options.mtopRelationRecommend.v + "/"
      , data = {
        jsv: options.mtopRelationRecommend.jsv
        , appKey: options.mtopRelationRecommend.appKey
        , t: signData.t
        , sign: signData.sign
        , api: options.mtopRelationRecommend.api
        , v: options.mtopRelationRecommend.v
        , type: options.mtopRelationRecommend.type
        , dataType: options.mtopRelationRecommend.dataType
        , callback: "mtopjsonp" + index
        , data: signData.data
      };
    send({
      method: "get",
      url: url + "?" + $.param(data),
      type: "text",
      details: {
        headers: {
          referer: "https://m.aliexpress.com/"
        }
      }
    }).then((e) => {
      if (e.indexOf("mtopjsonp") != -1) {
        e = e.replace("mtopjsonp" + (index) + "(", ""), e = e.replace(/(\)*$)/g, "");
        let d = $.parseJSON(e);
        if (d.data && d.data.mods && d.data.mods.asQueryList && d.data.mods.asQueryList.content) {
          let resKeywords = {};
          $.each(d.data.mods.asQueryList.content, function (idx, item) {
            let kd = {
              rs: item.trace.utLogMap.rank_score.toFixed(2)//rank_score
              , ss: item.trace.utLogMap.static_score.toFixed(2)//static_score
              , rc: ''//搜索结果数量result count
              , oc1: ''//第一页订单数量order count page 1
            };
            keyData.atoz_keywords.indexOf(kw) != -1
              && keyData.query_keywords.indexOf(item.keywords) == -1
              && keyData.query_keywords.push(item.keywords);
            if (keyData.result_keywords[item.keywords] === void 0) {
              keyData.result_keywords[item.keywords] = kd;
              resKeywords[item.keywords] = kd;
            }
          });
          storage.setData("query_keywords", keyData.query_keywords);
          storage.setData("result_keywords", keyData.result_keywords);
          storage.setData("query_index", index);
          fn(resKeywords, index);
        } else {
          showError(d.ret ? d.ret : "无法访问！！");
          fn(!1, index);
        }
      } else {
        showError(e);
        fn(!1, index);
      }
    }, (res) => { showError(res); })
  }

  async function batchGetTrade(itemList, fn) {
    for (var i = 0; i < itemList.length && isRuning; i++) {
      await fn(itemList[i]);
    }
    return new Promise((reslove, reject) => {
      reslove()
    })
  }
  function getAEKeywordsTrade(kw, fn) {
    let initId = "SB_" + (function () {
      let nd = new Date();
      nd.setHours(nd.getHours() - 16);
      return nd.format("yyyyMMddhhmmss");
    }()),
      options = getOptions({
        d: "y",
        SearchText: kw,
        page: 1,
      });
    send({
      method: "get",
      url: options.glosearch.api + "?" + $.param(options.glosearch.data),
      details: {
        headers: {
          accept: "application/json, text/plain, */*",
          referer: `${aeBaseUrl.pcsite}wholesale?${$.param(options.glosearch.data)}`
        }
      }
    }).then((e) => {
      try {
        if (typeof e === "object" && e) {
          let res = {
            resultCount: e.resultCount !== void 0 ? e.resultCount : 0,
            orderCount: 0,
            items: []
          };
          if (e.mods && e.mods.itemList && e.mods.itemList.content) {//e?.mods?.itemList?.content
            $.each(e.mods.itemList.content, function (idx, item) {
              item.trade !== void 0 && item.trade.tradeDesc !== void 0 && (res.orderCount += parseInt(item.trade.tradeDesc.replace(" sold", "")));
              res.items.push({
                id: item.productId,
                trade: item.trade !== void 0 && item.trade.tradeDesc !== void 0 ? parseInt(item.trade.tradeDesc.replace(" sold", "")) : 0,
                lunchTime: item.lunchTime,
                type: item.productType,//AD, Natural
                storeId: item.store ? item.store.storeId : "--",
                storeName: item.store ? item.store.storeName : "--"
              });
            })
          }
          fn(res);
        } else {
          showError("无法获取结果！");
          fn(!1);
        }
      } catch (e) {
        showError(e);
        fn(!1);
      }
    }, (res) => { showError(res); })
  }
  function getListPageData(options) {
    options = options || {};
    return send({
      method: "get",
      url: options.url || "",
      type: "json",
      details: options.details || {}
    })
  }
  /* function getMItemData(options) {//手机端商品详情API，本方法会setTimeout后等待AJAX返回数据再执行
    return new Promise((reslove, reject) => {
      setTimeout(async () => {
        let res = await send({
          method: "get",
          url: `${options.options.api}?` + $.param(Object.assign({ productId: options.productId }, options.params)),
          type: "json",
          details: {
            headers: {
              referer: `${options.options.baseurl}item/${options.productId}.html?` + $.param(options.params)
            }
          }
        });
        reslove(res);
      }, 10)

    });
  }*/
  function getMItemData(options) {//手机端商品详情API
    return new Promise((reslove, reject) => {
      send({
        method: "get",
        url: `${options.options.api}?` + $.param(Object.assign({ productId: options.productId }, options.params)),
        type: "json",
        details: {
          headers: {
            referer: `${options.options.baseurl}item/${options.productId}.html?` + $.param(options.params)
          }
        }
      }).then((res) => {
        reslove(res);
      }, (err) => {
        reject(err);
      });
    });
  }
  async function getItemOrderData(fn) {//商品订单，评价
    let options = getOptions(),
      params = {},
      fetchUrl = new URL(orderData.ord_rev_opts.fetch_url);
    params.data = {};
    params.data.CatId = fetchUrl.searchParams.has("CatId")
      ? fetchUrl.searchParams.get("CatId")
      : (fetchUrl.searchParams.has("catId")
        ? fetchUrl.searchParams.get("catId")
        : 0
      );
    if (fetchUrl.href.indexOf("aliexpress.com/w/") >= 0) {
      //https://www.aliexpress.com/w/wholesale-sunglasses-women-2022.html?spm=a2g0o.home.100000001.1.650c2145Rvm8EH
      //https://www.aliexpress.com/w/wholesale-sunglasses-women-2022.html?spm=a2g0o.search0304.0.0.62b933b4aQKIkd&CatId=205776616
      //https://www.aliexpress.com/i/api/product?seoChannel=popular&trafficChannel=seo&d=y&SearchText=sunglasses+women+2022&ltype=p&SortType=default&page=2&CatId=0&origin=y
      params.api = options.seoPopular.api;
      params.data = Object.assign(options.seoPopular.data, params.data);
      params.data.d = "y";
      params.data.SearchText = fetchUrl.pathname.split("/")[2].replace(".html", "").replace(/-/g, " ");
    } else {
      params.api = options.glosearch.api;
      params.data = Object.assign(options.glosearch.data, params.data);
      if (fetchUrl.href.indexOf("aliexpress.com/category/") >= 0) {
        //https://www.aliexpress.com/category/200003482/dresses.html?spm=a2g0o.home.101.3.36b72145NNPICf
        //https://www.aliexpress.com/glosearch/api/product?trafficChannel=main&catName=dresses&CatId=200003482&ltype=wholesale&SortType=default&page=2&origin=y
        let pathname = fetchUrl.pathname.split("/");
        params.data.CatId = pathname[2];
        params.data.catName = pathname[3].replace(".html", "");
      } else if (fetchUrl.href.indexOf("aliexpress.com/wholesale") >= 0) {
        //https://www.aliexpress.com/wholesale?catId=0&initiative_id=SB_20220608022849&SearchText=sunglasses+women+2018+woman&spm=a2g0o.productlist.1000002.0
        //https://www.aliexpress.com/wholesale?catId=0&initiative_id=SB_20220608022849&SearchText=sunglasses+women+2018+woman&spm=a2g0o.productlist.1000002.0&CatId=205776616
        //https://www.aliexpress.com/glosearch/api/product?trafficChannel=main&d=y&CatId=0&SearchText=sunglasses+women+2018+woman&ltype=wholesale&SortType=default&page=2&origin=y
        params.data.d = "y";
        params.data.SearchText = fetchUrl.searchParams.get("SearchText").replace(/\+/g, " ");
      }
    }
    for (var index = orderData.ord_rev_opts.cur_page; index <= orderData.ord_rev_opts.end_page; index++) {
      params.data.page = index;
      let obj = await getListPageData({
        url: params.api + "?" + $.param(params.data),//先用API获取JSON解析,不行再直接加载fetch_url
        details: {
          headers: {
            referer: orderData.ord_rev_opts.fetch_url + '&page=' + index,
            accept: 'application/json, text/plain, */*'
          }
        }
      });
      orderData.ord_rev_opts.cur_page = index;
      storage.setData("ord_rev_opts", orderData.ord_rev_opts);
      //console.log(content);
      if (obj && obj.mods && obj.mods.itemList && obj.mods.itemList.content) {// obj?.mods?.itemList?.content
        for (var queryIndex = 0; queryIndex < obj.mods.itemList.content.length; queryIndex++) {
          orderData.ord_rev_opts.query_index++;
          let item = obj.mods.itemList.content[queryIndex],
            itemData = {
              id: item.productId,
              oc: item.trade ? Number(item.trade.tradeDesc.replace(" sold", "")) : 0,//orders
              lt: item.lunchTime ? item.lunchTime : "unknow",//lunchTime
              pt: item.productType ? item.productType : "natural",//product type
              ts: item.sellingPoints?(function(){
                let ts=false;
                item.sellingPoints.forEach(function (_item, _index) {
                  if(_item.sellingPointTagId=='8810202851')
                    return ts=true;
                });
                return ts;
              })():false,//topselling

            };
          let paramData = {};
          paramData.params = {};
          paramData.options = options.msiteDetail;
          //paramData.trade = itemData.oc;
          paramData.productId = item.productId;
          //paramData.params.algo_exp_id = item.trace.detailPage.algo_exp_id;
          //paramData.params.algo_pvid = item.trace.detailPage.algo_pvid;
          //paramData.params.pdp_ext_f = item.trace.pdpParams.pdp_ext_f;
          paramData.params.pdp_npi = item.trace.pdpParams.pdp_npi;
          if (itemData.oc <= orderData.ord_rev_minorder) {
            itemData.rc = "--";//reviews
            itemData.wl = "--";
            itemData.fb = "--";
            itemData.pr = "--";
            fn(itemData);
          } else {
            //await getMItemData(paramData).then((res) => {
            getMItemData(paramData).then((res) => {
              if (typeof res === "object" && res.data && res.data.data) {
                res.data.data.reviews_1674 && (itemData.rc = res.data.data.reviews_1674.fields.feedbackInfo.totalValidNum);
                res.data.data.meta_1636 && res.data.data.meta_1636.fields &&
                  (res.data.data.meta_1636.fields.statisticInfo && (
                    itemData.oc = res.data.data.meta_1636.fields.statisticInfo.tradeCount,
                    itemData.wl = res.data.data.meta_1636.fields.statisticInfo.wishListCount,
                    itemData.fb = res.data.data.meta_1636.fields.statisticInfo.feedbackRatings
                  ),
                    res.data.data.meta_1636.fields.priceInfo && (
                      itemData.pr = res.data.data.meta_1636.fields.priceInfo.displayPrice
                    )
                  );

              } else {
                itemData.rc = "NONE";
                itemData.wl = "NONE";
                itemData.fb = "NONE";
                itemData.pr = "NONE";
              }
              fn(itemData);
            });
          }
        };
      }
    }
    return true;
  }
  let tableTitle = {
    "keyRes": [{name:"关键词",style:"style='width:50%'",code:"key"}, {name:"分数",code:"ss"}, {name:"结果数",code:"rc"}, {name:"第一页订单数",code:"oc1"}],
    "keyItems": [],
    "ordRes": [
      {name:'商品链接',code:"id"},
      {name:'类型',code:"pt"},
      {name:'价格',code:"pr"},
      {name:'评价',code:"fb"},
      {name:'收藏',sort:true,code:"wl"},
      {name:'订单数',sort:true,code:"oc"},
      {name:'评价数',sort:true,code:"rc"},
      {name:'订单/评价',sort:true,code:"rt"},
      {name:'上架时间',sort:true,code:"lt"}
    ]
  };
  function getTableHeader(t) {
    return [
      "<thead>",
      function () {
        let doms = [];
        tableTitle[t] && $.each(tableTitle[t],function(index, item){
          doms.push((()=>{
            return [
              `<th data-field="${item.name}"`,
              item.style ? item.style : "",
              `>${item.name}`,
              item.sort
                ?(item.name==(tableConfig.ordRes?tableConfig.ordRes.orderBy:"")
                  ?`<span class="${clzId}-sort"> ↓ </span>`
                 :""
                )
                :"",
              '</th>'
            ].join("");
          })());
        })
        t === "keyRes" && doms.push("<th>商品集</th>");
        return doms.join("");
      }(),
      "</thead>"
    ].join("")
  }

  function escape(html) {
    return String(html || '').replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/'/g, '&#39;').replace(/"/g, '&quot;');
  }
  function filterFileNameStr(fileName) {//不带后缀
    fileName = fileName || "";
    let reg = /^[\u4e00-\u9fa5\(\)_a-zA-Z0-9]+$/, //匹配中英⽂字符⽤于过滤特殊字符
      reg_special = /[^\u4e00-\u9fa5\(\)_a-zA-Z0-9]+/g, //匹配⾮中英⽂的特殊字符,过滤特殊字符
      reg_cn = /[\u4e00-\u9fa5\(\)]+/g, //匹配中⽂字符⽤于过滤中⽂字符
      reg_blank = /\s+/g
    if (reg_blank.test(fileName)) {
      fileName = fileName.replace(reg_blank, '_')
    }
    if (!reg.test(fileName)) {//匹配⾮所有中英⽂字符,
      fileName = fileName.replace(reg_special, '')//有特殊字符,则替换为空
    }
    if (reg_cn.test(fileName)) {//匹配所有中英⽂字符,如果图⽚有中⽂字符,则替换为空
      fileName = fileName.replace(reg_cn, '')//有中⽂字符,则替换为空
    }
    return fileName;
  }
  function exportCSV(data, filename = "data", esc = true) {//data格式[["a","b","c"],["a1","b1","c1"],...]
    let textType = "text/csv",
      alink = document.createElement("a"),
      resData = [];
    alink.href = 'data:' + textType + ';charset=utf-8,\ufeff' + encodeURIComponent(function () {
      data.forEach(function (item, index) {
        let vals = [];
        item.forEach(function (item1, index1) {
          vals.push('"' + (esc ? escape(item1) : item1) + '"');
        })
        resData.push(vals.join(","))
      })
      return resData.join("\r\n");
    }());
    alink.download = filename + "_" + (FDate.nowTime("yyyyMMddhhmm")) + '.csv';
    document.body.appendChild(alink);
    alink.click();
    document.body.removeChild(alink);
  }

  function initKeywords(data) {
    storage.setData("main_keywords", (keyData.main_keywords = data && data.main_keywords ? data.main_keywords : []));
    storage.setData("query_keywords", (keyData.query_keywords = data && data.query_keywords ? data.query_keywords : []));
    storage.setData("atoz_keywords", (keyData.atoz_keywords = data && data.atoz_keywords ? data.atoz_keywords : []));
    storage.setData("query_index", (keyData.query_index = data && data.query_index ? data.query_index : 0));
    storage.setData("is_finish_query_keywords", (keyData.is_finish_query_keywords = data && data.is_finish_query_keywords ? data.is_finish_query_keywords : !1));
    storage.setData("result_keywords", (keyData.result_keywords = data && data.result_keywords ? data.result_keywords : {}));
  }
  function initItemData(data) {
    let options = {
      start_page: data.start_page ? data.start_page : orderData.ord_rev_opts.start_page
      , end_page: data.end_page ? data.end_page : orderData.ord_rev_opts.end_page
      , cur_page: data.cur_page ? data.cur_page : orderData.ord_rev_opts.cur_page
      , query_index: data.query_index >= 0 ? data.query_index : orderData.ord_rev_opts.query_index
      , fetch_url: data.fetch_url ? data.fetch_url : orderData.ord_rev_opts.fetch_url
    }
    storage.setData("ord_rev_minorder", (orderData.ord_rev_minorder = data && data.ord_rev_minorder ? data.ord_rev_minorder : 5));
    storage.setData("ord_rev_opts", (orderData.ord_rev_opts = options));
    storage.setData("ord_rev_res", (orderData.ord_rev_res = data && data.ord_rev_res ? data.ord_rev_res : []));
    storage.setData("ord_rev_index", (orderData.ord_rev_index = data && data.ord_rev_index ? data.ord_rev_index : 0));
    storage.setData("is_finish_ord_rev", (orderData.is_finish_ord_rev = data && data.is_finish_ord_rev ? data.is_finish_ord_rev : !1));
  }

  function main() {
    const url = location.href;
    let itemListDom = "",
      domElem = $(
        [`<div class= "${clzId}-container">`
          , `<div class="${clzId}-shade"></div>`
          , `<div class="${clzId}-wgt-btn"> AE数据抓取</div>`
          , `<div class="${clzId}-panel ${clzId}-main ${clzId}-bg-gray"> `
          , `<div class="${clzId}-panel-title"> 速卖通长尾关键词、商品订单与评价数采集</div>`
          , `<span class="${clzId}-close"></span>`
          , `<div class="${clzId}-tab"> <ul class="${clzId}-tab-title"><li class="${clzId}-this">长尾关键词</li><li>订单与评价数</li><li>标题组合</li></ul>`
          , `<div class="${clzId}-tab-content"> <div class="${clzId}-tab-item ${clzId}-show">`
          , `<div class="${clzId}-content ${clzId}-row ${clzId}-col-space15">`
          , `<div class="${clzId}-col-md6">`
          , `<div class="${clzId}-card"><div class="${clzId}-card-header">核心关键词</div><div class="${clzId}-card-body ${clzId}-keyword-input"><textarea id="${clzId}-keyin" placeholder="多个关键词用Enter换行">`
          , (function () {
              let keywordsText = [];
              $.each(keyData.main_keywords, function (idx, item) {
                $.trim(item) != "" && keywordsText.push(item);
              })
              return keywordsText.join("\n")
             })()
          , '</textarea></div></div></div>'//end col-md6
          , `<div class="${clzId}-col-md6">`
          , `<div class="${clzId}-card"><div class="${clzId}-card-header">采集结果</div><div class="${clzId}-card-body ${clzId}-keyword-result"><table id="${clzId}-res-keywords">`
          , getTableHeader('keyRes')
          , "<tbody>"
          , (function () {
              let keywordsText = [];
              $.each(keyData.result_keywords, function (key, item) {
                let clazz = {
                  r: item.del === !0 ? ` class="${clzId}-text-del"` : "",
                  a: item.del === !0 ? ` class="${clzId}-keywords-action ${clzId}-add"` : ` class="${clzId}-keywords-action ${clzId}-del"`,
                },
                  isShow = keyData.show_all_keywords === !1 && item.del === !0 ? ' style="display:none"' : '',
                  trade = 'trade="' + (item.tr != void 0 ? item.tr : (item.del === !0 ? "2" : "0")) + '"';//trade : 0 未获取 1：已经获取 2：无需获取
                keywordsText.push(`<tr${clazz.r} ${isShow}><td><span class="${clzId}-display-keywords" ${trade} data-keywords="${key}">${key}</span> <span${clazz.a}></span></td><td>${item.ss}</td><td>${item.rc}</td><td>${item.oc1}</td><td><span class="${clzId}-link" data-keywords="${key}">查看</span></td></tr>`);
                /*item.items && item.items.forEach((_item, _idx) => {
                  itemListDom += `<tr kwfilter="${key}"><td>${Object.values(_item).join("</td><td>")}</td></tr>`;
                });*/
              })
              return keywordsText.join("");
            })()
          , '</tbody></table>',
          , `<!-- table id="${clzId}-itemlist" style="display:none"><tbody></tbody></table-->`//<tbody>${itemListDom}</tbody>
          , '</div></div></div>'//end col-md6
          , `<div class="${clzId}-action ${clzId}-row ${clzId}-col-space15">`
          , `<div class="${clzId}-col-md3">`
          , `<button class="${clzId}-btn" id="${clzId}-getkeywords">` + (keyData.is_finish_query_keywords ? "开始采集" : "继续上次采集") + '</button>'
          //,`<button class="${clzId}-btn" id="${clzId}-mtrade-btn">获取核心词热度</button>`
          , `<button class="${clzId}-btn ${clzId}-btn-primary" id="${clzId}-kw-reset">清 空</button>`
          , '</div>'//end col-md4
          , `<div class="${clzId}-col-md9 ${clzId}-res-keywords-action">`
          , `<label class="${clzId}-form-label">关键词分数低于</label>`
          , `<div class="${clzId}-input-inline" style="width:80px"><input type="text" id="${clzId}-min-score" verify="number" placeholder="最低分" class="${clzId}-input" value="${keyData.min_score}"/></div>`
          , `<div class="${clzId}-form-mid">不采集</div>`
          , `<button class="${clzId}-btn" id="${clzId}-trade-btn">获取热度</button>`
          , `<span><input id="${clzId}-show-all" type="checkbox"` + (keyData.show_all_keywords === !0 ? ' checked' : '') + ` /> 展示/导出标记删除关键词</span><button class="${clzId}-btn" id="${clzId}-download-btn" >导出采集结果</button>`
          , `<button class="${clzId}-btn" id="${clzId}-download-items-btn">导出商品集</button>`
          , '</div>'//end col-md8
          , '</div>'//end action
          , '</div></div>'//end ${clzId}-content end ${clzId}-tab-item
          , `<div class="${clzId}-tab-item">`
          , `<div class="${clzId}-content ${clzId}-row ${clzId}-col-space15"><div class="${clzId}-col-md12"><div class="${clzId}-card">`
          , `<div class="${clzId}-card-header">采集结果</div>`
          , `<div class="${clzId}-card-body ${clzId}-ordrev-result"><table id="${clzId}-res-ordrev">`
          , getTableHeader('ordRes')
          , '<tbody>'
          , function () {
            let resText = [];
            $.each(orderData.ord_rev_res, function (key, item) {//item key: lk=link, oc=orders count, rc=reviews count, tr=trade
              //let trade = 'trade="' + (item.tr != void 0 ? item.tr : 0) + '"';//trade : 0 未获取 1：已经获取
              let ratingEle = item.fb && item.fb > 0
                ? `<div class="${clzId}-rating-overlay"><i class="${clzId}-icon-favorites"></i>${item.fb}</div>`
                : "--";
              resText.push(`<tr><td><span><a target="_blank" href="${aeBaseUrl.pcsite}item/${item.id}.html">${aeBaseUrl.pcsite}item/${item.id}.html</a></span><span class="${clzId}-notice">${item.ts?"TopSelling":""}</span></td><td>${item.pt}</td><td>${item.pr}</td><td>${ratingEle}</td><td>${item.wl}</td><td>${item.oc}</td><td>${item.rc}</td><td>${item.rt}</td><td>${item.lt}</td></tr>`);
            })
            return resText.join("");
          }()
          , '</tbody></table></div>'//end${clzId}-ordrev-result
          , '</div></div>'//end ${clzId}-card,end ${clzId}-col-md12
          , `<div class="${clzId}-col-md9 ${clzId}-ordrev-action">`
          , `<label class="${clzId}-form-label">范围页</label>`
          , `<div class="${clzId}-input-inline" style="width:80px"><input type="text" id="${clzId}-ord-startpage" verify="number" placeholder="开始采集的页数" class="${clzId}-input" value="${orderData.ord_rev_opts.start_page}"/></div>`
          , `<div class="${clzId}-form-mid">-</div>`
          , `<div class="${clzId}-input-inline" style="width:80px"><input type="text" id="${clzId}-ord-endpage" verify="number" placeholder="结束采集的页数" class="${clzId}-input" value="${orderData.ord_rev_opts.end_page}"/></div>`
          , `<div class="${clzId}-form-mid">, 跳过订单数少于</div>`
          , `<div class="${clzId}-input-inline" style="width:80px"><input type="text" id="${clzId}-ord-minorder" verify="number" placeholder="最少订单数" class="${clzId}-input" value="${orderData.ord_rev_minorder}"/></div>`
          , `<div class="${clzId}-form-mid">个的商品</div>`
          , `<button class="${clzId}-btn" id="${clzId}-ord-btn" title="采集产品对应订单数的评价数">` + (orderData.is_finish_ord_rev ? "开始采集" : "继续上次采集") + '</button>'
          , `<button class="${clzId}-btn ${clzId}-btn-primary" id="${clzId}-ord-cleanup">清 空</button>`
          , '</div>'//end ${clzId}-col-md12
          , `<div class="${clzId}-col-md3" style="text-align:right"><button class="${clzId}-btn" id="${clzId}-ordres-download-btn">导出采集结果</button></div>`
          , '</div></div>'// end ${clzId}-content, end ${clzId}-tab-item
          , `<div class="${clzId}-tab-item"><div class="${clzId}-content ${clzId}-row ${clzId}-col-space15" id='${clzId}-title-compose'>`//标题组合tab
          , `<div class="${clzId}-col-md9"><input class="${clzId}-title-kw-todo ${clzId}-input" id='${clzId}-title-mk' verify='required' placeholder="3个主关键词，每个关键词之间用英文','号分隔" /></div>`
          , `<div class="${clzId}-col-md2"><input class="${clzId}-title-kw-todo ${clzId}-input" id='${clzId}-title-count' verify='required|number' placeholder="生成标题数量" /></div>`
          , `<div class="${clzId}-col-md1"><button class="${clzId}-btn" id="${clzId}-compose-title-btn">随机生成</button></div>`
          ,(function(){
            let _html='';
            keyData.title_kw.forEach(function(item,idx){
              _html+=`<div class="${clzId}-col-md4"><div class="${clzId}-card"><div class="${clzId}-card-header">(${idx+1}级)流量长尾</div>`
              _html+=`<div class="${clzId}-card-body ${clzId}-title-${item.id}">`
              _html+=`<textarea placeholder="多个关键词用Enter换行" data-kwidx='${item.id}'>`
              _html+=item.data.join("\n")
              _html+='</textarea>'
              _html+='</div>'
              _html+='</div></div>'
            })
            return _html;
          })()
          ,'</div></div>'//, end ${clzId}-content, end ${clzId}-tab-item 标题组合tab结束
          , '</div></div></div></div>'// end ${clzId}-tab-content,end ${clzId}-tab, end ${clzId}-panel,end ${clzId}-container
        ].join("")
      ).appendTo("body")
      , c = (e) => {
        return e instanceof jQuery ? e : domElem.find(e);
      }
      , disabled = (e) => {
        return c(e).attr("disabled", true).addClass(`${clzId}-btn-disabled`);
      }
      , enabled = (e) => {
        return c(e).removeAttr("disabled").removeClass(`${clzId}-btn-disabled`);
      }
      , parseResultKeywordsData = () => {
        let data = [
          function () {
            let titleRow = [];
            return titleRow = tableTitle.keyRes.slice(),
              titleRow.push("rankscore"),
              keyData.show_all_keywords === !0 && titleRow.push("标记删除"),
              titleRow;
          }()
        ];
        $.each(keyData.result_keywords || {}, function (key, item) {
          if (keyData.show_all_keywords === !1 && item.del === !0) return true;
          let row = [key, item.ss, item.rc, item.oc1, item.rs];
          keyData.show_all_keywords === !0 && row.push(item.del === void 0 || item.del === !1 ? "否" : "是");
          data.push(row);
        });
        return data;
      }
      , parseResultOrderData = () => {
        let data = [];
        data.push(tableTitle.ordRes.slice());
        $.each(orderData.ord_rev_res || {}, function (key, item) {
          let row = [
            `${aeBaseUrl.pcsite}item/${item.id}.html`
            , item.oc
            , item.rc
            , item.rt
            , item.date
          ];
          data.push(row);
        });
        return data;
      };
    c(`#${clzId}-title-compose textarea`).on('change',function(){
      let that=$(this),
          idx=that.data('kwidx'),
          values=(()=>that.val().split("\n").filter((item)=>item.trim()!==''))()
      keyData.title_kw.some(function(item){
        return item.id===idx?(item.data=values,true):false
      })
      that.val(values.join("\n"))
      storage.setData(`title_${idx}`,values)
    })
    addStyle(`
      .${clzId}-main{display:none;position:fixed;top:0;bottom:0;left:0;right:0;margin:auto;width:90%;height:685px;z-index:1055;padding:20px;box-sizing: border-box;}
      .${clzId}-shade{z-index: 1054; background-color: rgb(0, 0, 0); opacity: 0.8;display:none;top: 0;left: 0;width: 100%;height: 100%;position: fixed;pointer-events: auto;margin: 0;padding: 0;-webkit-tap-highlight-color: rgba(0,0,0,0);}
      .${clzId}-wgt-btn{z-index: 1053;position: fixed;left: 5px;top: 253px;padding: 9px;border: 1px solid #797979;border-radius: 8px;width: 40px;text-align: center;cursor: pointer;box-sizing: border-box;background: #fff;}
      .${clzId}-container .${clzId}-link {color: #2e9cc3;cursor: pointer;}
      .${clzId}-container a:link {color: #2e9cc3}
      .${clzId}-container a:visited {color: #333!important}
      .${clzId}-container a:active,.${clzId}-container a:hover {color: #58b0cf}
      .${clzId}-container a:active {text-decoration: underline}
      .${clzId}-close{position: absolute;right: 25px;*right: 0;top: 25px;font-size: 0;line-height: initial;display: inline-block;width: 30px;height:30px;background:url("data:image/png;base64,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") no-repeat;background-position: -149px -31px;cursor: pointer;}
      .${clzId}-close:hover{background-position: -180px -31px;}
      .${clzId}-del{width: 16px;height:16px;cursor: pointer;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA1klEQVQ4T+WTPQ7CMAyF7Z6EhQUxND8bC/dg4SaUO3AANgaOwFAhZqddQGLjBpygNTIiUlrSFgk2MiXy85dnO0H4cmEsP03TUZIkyzCGiGci2rf1vwHEbhyqzDt6OggA3JH45rQB8Ela65Vzbi1npdSkKIpLGxhqJNYgG2OYiNBaO2fmDRFNRaS13gHA1TmXeY0H9wFygYnQGJMz8/GfAK/GZVKz7K21s6qq7jKVj5rY94iGACcAODCzdD/6zBFxQUTj6Bi99T4HdV1vy7K8dQKG/kA7/gDVSb0RSRVgRwAAAABJRU5ErkJggg==) no-repeat;display:inline-block;vertical-align: middle;}
      .${clzId}-add{width: 16px;height:16px;cursor: pointer;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA20lEQVQ4T63TMUpDQRDG8V/AgyiIgRQWVmKVK3gBIQcwbTxCbBVscwMj2KUxZdKkFF5lbuABFJSB92JYGF+UbLXM7PffmY+Zjp+zwDGeMdiKb18nuMA7ziPRqbNfGOI+EZbha9yFPgAPeMJsR3Hz7AxXAXjDUSLu1fHXJP8YgOgr67lfC+cJYNx4kFXfBtiYmAEu68Q0e1BWED2HOYc4KESfWGOFjSd7B5SV/rmFErCTiWPcJCa1ASbhQYXuPwepCsASI2TD8tuM3O5lmZofYplO8NKyzqf4aNb5G7gcKhjCEdjjAAAAAElFTkSuQmCC) no-repeat;display:inline-block;vertical-align: middle;}
      .${clzId}-panel-title{font-size:18px;font-weight:600;padding:8px;background: #393D49;color:#fff;}
      .${clzId}-row{padding: 8px 0px;text-overflow: ellipsis;}
      .${clzId}-row:after,.${clzId}-row:before {content: "";display: block;clear: both}
      .${clzId}-text-del{text-decoration: line-through;color: #000;}
      .${clzId}-badge{position: relative;display: inline-block;padding: 0 6px;text-align: center;background-color: #FF5722;color: #fff;border-radius: 2px;}
      .${clzId}-notice{display: inline-block;padding: 0 2px;text-align: center;color: #FF5722!important;font-weight: 600;}
      .${clzId}-col-md1 {width: 8.33333333%}
      .${clzId}-col-md2 {width: 16.66666667%}
      .${clzId}-col-md3 {width: 25%}
      .${clzId}-col-md4 {width: 33.33333333%}
      .${clzId}-col-md5 {width: 41.66666667%}
      .${clzId}-col-md6 {width: 50%}
      .${clzId}-col-md7 {width: 58.33333333%}
      .${clzId}-col-md8 {width: 66.66666667%}
      .${clzId}-col-md9 {width: 75%}
      .${clzId}-col-md10 {width: 83.33333333%}
      .${clzId}-col-md11 {width: 91.66666667%}
      .${clzId}-col-md12 {width: 100%}
      .${clzId}-col-md1,.${clzId}-col-md2,.${clzId}-col-md3,.${clzId}-col-md4,.${clzId}-col-md5,.${clzId}-col-md6,.${clzId}-col-md7,.${clzId}-col-md8,.${clzId}-col-md9,.${clzId}-col-md10,.${clzId}-col-md11,.${clzId}-col-md12{float: left;position: relative;display: block;margin: 0;padding: 0;box-sizing: border-box;}
      .${clzId}-bg-gray {background-color: #FAFAFA!important;color: #666!important;}
      .${clzId}-col-space15{margin: -7.5px;}
      .${clzId}-col-space15>*{padding: 7.5px;}
      .${clzId}-card{border-radius: 2px;background-color: #fff;box-shadow: 1px 3px 5px 0 rgba(0,0,0,.25);}
      .${clzId}-card-header{position: relative;height: 42px;line-height: 42px;padding: 0 15px;border-bottom: 1px solid #f6f6f6;color: #333;border-radius: 2px 2px 0 0;font-size: 14px;}
      .${clzId}-card-body{position: relative;padding: 10px 15px;line-height: 24px;}
      .${clzId}-rating-overlay .${clzId}-icon-favorites{width: 20px;display: inline-block;color:#ff4747}
      .${clzId}-rating-overlay .${clzId}-icon-favorites:before{font-size: 18px;content:"★";text-align: center;box-sizing: border-box;}
      .${clzId}-btn{display: inline-block;height: 38px;line-height: 38px;padding: 0 18px;background-color: #3485FB;color: #fff;white-space: nowrap;text-align: center;font-size: 14px;border: none;border-radius: 2px;cursor: pointer;}
      .${clzId}-btn+.${clzId}-btn{margin-left:10px;}
      .${clzId}-btn:hover {opacity: .8;filter: alpha(opacity=80);}
      .${clzId}-btn-primary {border: 1px solid #C9C9C9;background-color: #fff;color: #555;}
      .${clzId}-btn-normal{background-color: #3485FB}
      .${clzId}-btn-disabled,.${clzId}-btn-disabled:active,.${clzId}-btn-disabled:hover{border: 1px solid #e6e6e6 !important;background-color: #FBFBFB !important;color: #C9C9C9 !important;cursor: not-allowed;opacity: 1;}
      .${clzId}-input,.${clzId}-select,.${clzId}-textarea {height: 38px;line-height: 1.3;line-height: 38px;border-width: 1px;border-style: solid;background-color: #fff;color: rgba(0,0,0,.85);border-radius: 2px}
      .${clzId}-input::-webkit-input-placeholder,.${clzId}-select::-webkit-input-placeholder,.${clzId}-textarea::-webkit-input-placeholder {line-height: 1.3}
      .${clzId}-input,.${clzId}-textarea {display: block;width: 100%;padding-left: 10px;border-color: #eee}
      .${clzId}-input:hover,.${clzId}-textarea:hover {border-color: #d2d2d2!important}
      .${clzId}-input:focus,.${clzId}-textarea:focus {border-color: #d2d2d2!important}
      .${clzId}-input-danger:focus{border-color: #FF5722 !important;}
      .${clzId}-form-label {display: inline-block;padding: 9px;font-weight: 400;line-height: 20px;text-align: right;}
      .${clzId}-form-mid {display: inline-block;padding: 9px 0!important;line-height: 20px;margin-right: 10px;}
      .${clzId}-input-inline {display:inline-block;margin-right: 10px;}
      .${clzId}-tab-title,.${clzId}-tab-title .${clzId}-this:after {border-color: #d5d5d5}
      .${clzId}-tab {margin: 10px 0;text-align: left!important}
      .${clzId}-tab-title {position: relative;left: 0;height: 40px;white-space: nowrap;font-size: 0;border-bottom-width: 1px;border-bottom-style: solid;transition: all .2s;-webkit-transition: all .2s}
      .${clzId}-tab-title li {display: inline-block;*display: inline;*zoom:1;vertical-align: middle;font-size: 14px;transition: all .2s;-webkit-transition: all .2s;position: relative;line-height: 40px;min-width: 65px;padding: 0 15px;text-align: center;cursor: pointer}
      .${clzId}-tab-title .${clzId}-this {color: #000}
      .${clzId}-tab-title .${clzId}-this:after {position: absolute;left: 0;top: 0;content: "";width: 100%;height: 41px;border-width: 1px;border-style: solid;border-bottom-color: #fff;border-radius: 2px 2px 0 0;box-sizing: border-box;pointer-events: none}
      .${clzId}-tab-item {display: none}
      .${clzId}-tab-content {padding: 15px 0}
      .${clzId}-show {display: block!important}
      .${clzId}-keyword-input,.${clzId}-keyword-result,.${clzId}-ordrev-result,.${clzId}-title-kw1,.${clzId}-title-kw2,.${clzId}-title-kw3{height: 436px;}
      .${clzId}-keyword-input textarea,.${clzId}-title-kw1 textarea,.${clzId}-title-kw2 textarea,.${clzId}-title-kw3 textarea{width:100%;outline:0;height:100%;border:0;color:#000;}
      .${clzId}-keyword-result,.${clzId}-ordrev-result{overflow:auto}
      .${clzId}-keyword-result table,.${clzId}-ordrev-result table{width:100%;}
      .${clzId}-keyword-result table th,.${clzId}-keyword-result table td,.${clzId}-ordrev-result table th,.${clzId}-ordrev-result table td{text-align:center;color: #000;padding:3px;}
      .${clzId}-keyword-result table tr>*,.${clzId}-ordrev-result table tr>*{text-align:left!important}
      .${clzId}-res-keywords-action{text-align:right}
      .${clzId}-res-keywords-action span{display:inline-block;margin:0 10px;}
      #${clzId}-res-ordrev th{cursor: pointer}
      `);
    domElem.on("click", `.${clzId}-wgt-btn`, function () {
      c(`.${clzId}-shade,.${clzId}-main`).show();
    }).on("click", `.${clzId}-close`, function () {
      c(`.${clzId}-shade,.${clzId}-main`).hide();
    }).on("click", `#${clzId}-getkeywords`, function () {
      if (isRuning) return !1;
      if ("" == c(`#${clzId}-keyin`).val().trim()) return message.info("请填写关键词"), !1;
      let that = $(this);
      if (keyData.is_finish_query_keywords) {
        let keywordData = {};
        keywordData.main_keywords = c(`#${clzId}-keyin`).val().split("\n");
        keywordData.query_keywords = [];
        for (var i = 0; i < keywordData.main_keywords.length; i++) {
          if ("" == keywordData.main_keywords[i].trim()) {
            keywordData.main_keywords.splice(i, 1);
            continue;
          }
          if (keywordData.query_keywords.indexOf(keywordData.main_keywords[i]) === -1) {
            keywordData.query_keywords.push(keywordData.main_keywords[i]);
            for (var j = 0; j < atoz.length; j++)
              keywordData.query_keywords.push(keywordData.main_keywords[i] + " " + atoz[j].trim())
          }
        }
        keywordData.atoz_keywords = keywordData.query_keywords.slice();
        initKeywords(keywordData);
      }
      disabled(that);
      isRuning = !0;
      batchGetKeywords(keyData.query_keywords, (e) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            getAeMsiteKeywords(e, (t, idx) => {
              idx == 1 && c(`#${clzId}-res-keywords tbody`).empty();
              if (t !== !1) {
                $.each(t, function (_key, _item) {
                  c(`#${clzId}-res-keywords tbody`).append(`<tr><td><span class="${clzId}-display-keywords" trade="0" data-keywords="${_key}">${_key}</span> <span class="${clzId}-keywords-action ${clzId}-del"></span></td><td>${_item.ss}</td><td>${_item.rc}</td><td>${_item.oc1}</td><td><span class="${clzId}-link" data-keywords="${_key}">查看</span></td></tr>`)
                })
                that.html(`采集中(${idx}/${keyData.query_keywords.length})`);
              } else {
                isRuning = !1;
              }
              resolve();
            });
          }, 1e3)
        })
      }).then(() => {
        console.log("推荐词抓取完成...");
        keyData.query_index = 0;
        keyData.is_finish_query_keywords = !0;
        storage.setData("is_finish_query_keywords", !0);
        isRuning = !1;
        enabled(that);
        that.html(`开始采集`);
        message.success("完成！")
      }).catch((err) => {
        isRuning = !1;
        enabled(that);
        that.html(`开始采集`);
        console.log("推荐词抓取失败", err);
      });

    }).on("click", `#${clzId}-trade-btn`, function () {
      if (isRuning) return !1;
      isRuning = !0;
      if (!formVerify($(`.${clzId}-res-keywords-action`)))
        return !1;
      storage.setData("min_score", (keyData.min_score = $(`#${clzId}-min-score`).val()));
      let that = $(this),
        itemList = c("span[trade='0']"),
        idx = 1;
      batchGetTrade(itemList, (e) => {
        return new Promise((resolve, reject) => {
          let item = $(e),
            keywords = item.data("keywords");
          if (keyData.result_keywords[keywords] && Number(keyData.result_keywords[keywords].ss) < keyData.min_score) {
            item.attr("trade", "1");
            item.closest("tr").find("td:eq(2)").html(0);
            item.closest("tr").find("td:eq(3)").html(0);
            keyData.result_keywords[keywords].tr = 1;
            keyData.result_keywords[keywords].rc = 0;
            keyData.result_keywords[keywords].oc1 = 0;
            storage.setData("result_keywords", keyData.result_keywords);
            that.html(`获取中(${idx++}/${itemList.length})`);
            return resolve();
          }
          setTimeout(() => {
            getAEKeywordsTrade(keywords, (res) => {
              if (res === !1) {
                isRuning = !1;
              } else {
                res.resultCount != 0 && item.attr("trade", "1");
                item.closest("tr").find("td:eq(2)").html(res.resultCount == 0 ? "--" : res.resultCount);
                item.closest("tr").find("td:eq(3)").html(res.orderCount == 0 ? "--" : res.orderCount);
                that.html(`获取中(${idx++}/${itemList.length})`);
                keyData.result_keywords[keywords] && (
                  keyData.result_keywords[keywords].tr = (res.resultCount == 0 ? 0 : 1),
                  keyData.result_keywords[keywords].rc = (res.resultCount == 0 ? "--" : res.resultCount),
                  keyData.result_keywords[keywords].oc1 = (res.orderCount == 0 ? "--" : res.orderCount),
                  keyData.result_keywords[keywords].items = res.items
                  /*,$(`#${clzId}-itemlist`).find("tbody").append(
                    (function () {
                      let html = "";
                      res.items.forEach((_item, _idx) => {
                        html += `<tr kwfilter="${keywords}"><td>${Object.values(_item).join("</td><td>")}</td></tr>`;
                      });
                      return html;
                    })()
                  )*/
                );
                storage.setData("result_keywords", keyData.result_keywords);
              }
              resolve();
            });
          }, 500)
        })
      }).then(() => {
        console.log("热度获取完成");
        isRuning = !1;
        that.html("获取热度");
        //alert("热度获取完成！")
        exportCSV(parseResultKeywordsData(), "SEO_KEYWORDS");
      }).catch((err) => {
        isRuning = !1;
        that.html("获取热度");
        console.log("热度获取中断。。", err);
      });
    }).on("click", `#${clzId}-res-keywords span.${clzId}-link`, function () {
      //if (isRuning === !0) return !1;
      let that = $(this),
        kw = that.data("keywords"),
        itemList = kw ? (keyData.result_keywords[kw] && keyData.result_keywords[kw].items ? keyData.result_keywords[kw].items : []) : [],
        itemTitle = ['商品', '订单数', '上架时间', '类型', '店铺ID', '店铺名称'],
        domElem = [];
      itemList.forEach((item, idx) => {
        domElem.push([
          '<tr>'
          , `<td><a target="_blank" href="${aeBaseUrl.pcsite}item/${item.id}.html">${item.id}</a></td>`
          , `<td>${item.trade}</td>`
          , `<td>${item.lunchTime}</td>`
          , `<td>${item.type.toLowerCase() === "ad" ? `<span class="${clzId}-badge">${item.type}</span>` : item.type}</td>`
          , `<td>${item.storeId}</td>`
          , `<td><a target="_blank" href="${aeBaseUrl.pcsite}store/${item.storeId}">${item.storeName}</a></td>`
          , '</tr>'
        ].join(""));
      });
      showDialog({
        html: [
          '<table style="width:100%">'
          , `<thead><th>${itemTitle.join("</th><th>")}</th></thead>`
          , `<tbody>${domElem.join("")}</tbody>`
          , '</table>'
        ].join("")
        , width: "70%"
        , showCloseButton: !0
        , confirmButtonText: "导出本页数据",
        cancelButtonText: "关闭"
      }).then((res) => {
        if (res.value) {
          let data = [itemTitle];
          itemList.forEach((item, idx) => {
            item.id = "'" + item.id;
            item.storeId = "'" + item.storeId;
            data.push(Object.values(item));
          });
          exportCSV(data, filterFileNameStr(kw) + "_itemlist", false);
        }
      })
    }).on("click", `#${clzId}-download-items-btn`, function () {//导出商品集
      if (isRuning === !0) return !1;
      showDialog({
        icon: "info",
        html: "本次操作将只导出已经获取热度的关键词"
      }).then((res) => {
        if (res.value) {
          let data = [['关键词', '商品', '订单数', '上架时间', '类型', '店铺ID', '店铺名称']];
          $.each(keyData.result_keywords, (idx, item) => {
            item.items && item.items.forEach((_item, _idx) => {
              _item = Object.assign({ "kw": idx }, _item);
              _item.id = "'" + _item.id;
              _item.storeId = "'" + _item.storeId;
              data.push(Object.values(_item));
            })
          });
          exportCSV(data, "itemlist", false);
        }
      })
    }).on("click", `#${clzId}-kw-reset`, function () {//重置关键词数据
      if (isRuning === !0) return !1;
      showDialog({
        icon: "info",
        html: "是否要清空词表？"
      }).then((res) => {
        res.isConfirmed && (
          c(`#${clzId}-res-keywords tbody`).empty(),
          c(`#${clzId}-keyin`).empty(),
          enabled(c(`#${clzId}-getkeywords`).html("开始采集")),
          storage.setData("main_keywords", keyData.main_keywords = []),
          storage.setData("result_keywords", keyData.result_keywords = {}),
          storage.setData("query_keywords", keyData.query_keywords = []),
          storage.setData("query_index", keyData.query_index = 0),
          storage.setData("is_finish_query_keywords", keyData.is_finish_query_keywords = !0)
        )
      });

    }).on("click", `.${clzId}-keywords-action`, function () {
      if (isRuning === !0) return !1;
      let that = $(this),
        ftr = that.closest("tr"),
        keywordsDom = that.prev(`.${clzId}-display-keywords`),
        keywordsText = keywordsDom.data("keywords");
      ftr.toggleClass(`${clzId}-text-del`);
      that.hasClass(`${clzId}-del`)
        ? (that.removeClass(`${clzId}-del`).addClass(`${clzId}-add`)
          , keyData.result_keywords[keywordsText]
            ? (keyData.result_keywords[keywordsText].del = !0, keyData.result_keywords[keywordsText].tr = 2, keywordsDom.attr("trade", "2"))
            : ""
          , keyData.show_all_keywords === !1 && ftr.css("display", "none")
        )
        : (that.removeClass(`${clzId}-add`).addClass(`${clzId}-del`)
          , keyData.result_keywords[keywordsText]
            ? (keyData.result_keywords[keywordsText].del = !1
              , (keyData.result_keywords[keywordsText].rc != "" && keyData.result_keywords[keywordsText].oc1 != ""
                ? (keyData.result_keywords[keywordsText].tr = 1, keywordsDom.attr("trade", "1"))
                : (keyData.result_keywords[keywordsText].tr = 0, keywordsDom.attr("trade", "0"))
              )
            )
            : ""
        );
      //console.log(keyData.result_keywords[keyword]);
      storage.setData("result_keywords", keyData.result_keywords);
    }).on("click", `#${clzId}-show-all`, function () {
      if (isRuning === !0) return !1;
      let that = $(this),
        delItems = c(`tr.${clzId}-text-del`);
      that.prop('checked')
        ? (delItems.css("display", ""), storage.setData("show_all_keywords", !0), keyData.show_all_keywords = !0)
        : (delItems.css("display", "none"), storage.setData("show_all_keywords", !1), keyData.show_all_keywords = !1)
    }).on("click", `#${clzId}-download-btn`, function () {//下载关键词采集结果
      if (isRuning === !0) return !1;
      showDialog({
        icon: "info",
        html: "导出的数据为采集结果中可见的关键词，包含已经标记删除的词"
      }).then((res) => {
        res.isConfirmed && exportCSV(parseResultKeywordsData(), "KEYWORDS");
      });
    }).on('click', `.${clzId}-tab-title li`, function () {//tab
      let that = $(this)
        , index = that.parent().children('li').index(that)
        , parents = that.parents(`.${clzId}-tab`).eq(0)
        , item = parents.children(`.${clzId}-tab-content`).children(`.${clzId}-tab-item`)
        , elemA = that.find('a')
        , isJump = elemA.attr('href') !== 'javascript:;' && elemA.attr('target') === '_blank' //是否存在跳转
        , unselect = typeof that.attr('dz-unselect') === 'string'; //是否禁用选中
      //执行切换
      if (!(isJump || unselect)) {
        that.addClass(`${clzId}-this`).siblings().removeClass(`${clzId}-this`);
        item.eq(index).addClass(`${clzId}-show`).siblings().removeClass(`${clzId}-show`);
      }
    }).on("click", `#${clzId}-ord-btn`, function () {//采集商品订单数和评论数
      if (isRuning === !0) return !1;
      if (url.indexOf("aliexpress.com/w/") == -1 && url.indexOf("aliexpress.com/category/") == -1 && url.indexOf("aliexpress.com/wholesale") == -1) {
        message.warning('只能在搜索页或分类页执行采集操作！');
        return !1;
      }
      let that = $(this);
      storage.setData("ord_rev_minorder", (orderData.ord_rev_minorder = Number($(`#${clzId}-ord-minorder`).val())));
      if (orderData.is_finish_ord_rev) {
        let data = {};
        if (!formVerify($(`.${clzId}-ordrev-action`)))
          return !1;
        let startPage = Number($(`#${clzId}-ord-startpage`).val().trim()),
          endPage = Number($(`#${clzId}-ord-endpage`).val().trim());
        data.start_page = startPage;
        data.end_page = endPage;
        if (data.start_page <= 0 || data.start_page > 60) {
          data.start_page = 1;
          $(`#${clzId}-ord-startpage`).val(1);
        }
        if (data.end_page <= 0 || data.end_page > 60) {
          data.end_page = 60;
          $(`#${clzId}-ord-endpage`).val(60);
        }
        data.cur_page = startPage;
        data.query_index = 0;
        data.fetch_url = (function () {
          let search = parseURLParams(location.search);
          delete search.page;
          return location.origin + location.pathname + "?" + $.param(search);
        })();
        data.ord_rev_minorder = Number($(`#${clzId}-ord-minorder`).val());
        initItemData(data);
        $(`#${clzId}-res-ordrev tbody`).empty();
      }
      disabled(that).html("采集中...");
      isRuning = !0;
      getItemOrderData(function (res) {
        //console.log(res)
        res.rt = res.rc == "--" || res.rc == "NONE" || res.rc == 0 ? 0 : Number((res.oc / res.rc).toString().match(/^\d+(?:\.\d{0,2})?/)[0]);
        let ratingEle = res.fb && res.fb > 0
          ? `<div class="${clzId}-rating-overlay"><i class="${clzId}-icon-favorites"></i>${res.fb}</div>`
          : "--";
        $(`#${clzId}-res-ordrev tbody`).append(`
            <tr>
              <td><span><a href="${aeBaseUrl.pcsite}item/${res.id}.html" target="_blank">${aeBaseUrl.pcsite}item/${res.id}.html</a></span><span class="${clzId}-notice">${res.ts?"TopSelling":""}</span></td>
              <td>${res.pt}</td>
              <td>${res.pr}</td>
              <td>${ratingEle}</td>
              <td>${res.wl}</td>
              <td>${res.oc}</td>
              <td>${res.rc}</td>
              <td>${res.rt}</td>
              <td>${res.lt}</td>
            </tr>
          `);
        orderData.ord_rev_res.push(res);
        storage.setData("ord_rev_res", orderData.ord_rev_res);
        storage.setData("ord_rev_opts", orderData.ord_rev_opts);
      }).then((res) => {
        message.success("采集完成！")
        enabled(that).html("开始采集");
        isRuning = !1;
        storage.setData("is_finish_ord_rev", (orderData.is_finish_ord_rev = !0));
      });
    }).on("click", `#${clzId}-ord-cleanup`, function () {
      if (isRuning === !0) return !1;
      showDialog({
        //title: "注意",
        html: "是否清空采集结果？",
        icon: "info"
      }).then((res) => {
        res.isConfirmed && (function () {
          $(`#${clzId}-ord-btn`).html("开始采集");
          $(`#${clzId}-res-ordrev tbody`).html("");
          storage.setData("is_finish_ord_rev", (orderData.is_finish_ord_rev = !0));
          storage.setData("ord_rev_res", (orderData.ord_rev_res = []));
          $(`#${clzId}-res-ordrev`).find(`.${clzId}-sort`).remove()
          tableConfig.ordRes ? tableConfig.ordRes.orderBy='' : '';
          storage.setData("table_config", tableConfig);
        })();
      });
    }).on("click", `#${clzId}-ordres-download-btn`, function () {
      if (isRuning === !0) return !1;
      exportCSV(parseResultOrderData(), "ORDERS_REVIEWS");
    }).on("click", `#${clzId}-res-ordrev th`, function () {//排序
      if (isRuning === !0) return !1;
      let that=$(this),
          tc=tableTitle.ordRes.filter((o)=>that.data("field").trim()==o.name);
      if (orderData.ord_rev_res.length > 2 && tc.length>0 && tc[0].sort) {
        orderData.ord_rev_res = orderData.ord_rev_res.sort((a, b) => tc[0].code=="lt" ? FDate.compare(b[tc[0].code],a[tc[0].code]) : Number(b[tc[0].code]) - Number(a[tc[0].code]));
        that.parent().find(`.${clzId}-sort`).remove();
        that.append(`<span class="${clzId}-sort"> ↓ </span>`);
        storage.setData("ord_rev_res", orderData.ord_rev_res);
        !tableConfig.ordRes && (tableConfig.ordRes={});
        tableConfig.ordRes.orderBy=tc[0].name;
        storage.setData("table_config", tableConfig);
        let resText = [];
        $.each(orderData.ord_rev_res, function (key, item) {//item key: lk=link, oc=orders count, rc=reviews count, tr=trade
          //let trade = 'trade="' + (item.tr != void 0 ? item.tr : 0) + '"';//trade : 0 未获取 1：已经获取
          let ratingEle = item.fb && item.fb > 0
            ? `<div class="${clzId}-rating-overlay"><i class="${clzId}-icon-favorites"></i>${item.fb}</div>`
            : "--";
          resText.push(`<tr><td><span><a target="_blank" href="${aeBaseUrl.pcsite}item/${item.id}.html">${aeBaseUrl.pcsite}item/${item.id}.html</a></span><span class="${clzId}-notice">${item.ts?"TopSelling":""}</span></td><td>${item.pt}</td><td>${item.pr}</td><td>${ratingEle}</td><td>${item.wl}</td><td>${item.oc}</td><td>${item.rc}</td><td>${item.rt}</td><td>${item.lt}</td></tr>`);
        })
        $(`#${clzId}-res-ordrev tbody`).empty().html(resText.join(""));
      }
    }).on('click',`#${clzId}-compose-title-btn`,function(){
      if(!formVerify(c(`#${clzId}-title-compose`))){
        return !1;
      }
      let titleMkVal=c(`#${clzId}-title-mk`).val().trim(),//填写的标题主关键词，用,号分隔
          titleCount=Number(c(`#${clzId}-title-count`).val()),//生成的标题数量
          titleMks=(()=>titleMkVal.split(',').filter((item)=>item.trim()!==''))(),//处理填写的主关键词，去除空元素
          tailKws=JSON.parse(JSON.stringify(keyData.title_kw)),//所有属性词深拷贝给新的变量
          titles=[];
      if(titleCount>20){
        return message.warning('最多支持同时生成20个标题');
      }
      function title128Length(t,keywords){
        let _t=t,_k=keywords
        if(_t.length>=128) return _t;
        let availablekw=keywords.filter((item)=> item.length < 128-_t.length)//筛选出字符数小于剩余字符数的词组，<号是因为还要加一个空格，所以不能等于
        if(availablekw.length==0) return _t;
        _t+=' '+ availablekw.splice(Math.floor(Math.random()*availablekw.length),1)
        if(_t.length<128) return title128Length(_t,availablekw)
        else
        return _t;
      }

      for(let idx=0;idx<titleCount;idx++){
        let titleTodo=[],
            restKws=[] ;//除去已使用后的剩余的长尾词,用于不足128个字符时用
        tailKws.forEach(function(item,index){//长尾词分3段，每段随机一个词并对应一个主词
          titleMks.length>index && titleTodo.push(titleMks[index].trim());//主词数量足够时加入拼接
          titleTodo.push(item.data.splice(Math.floor(Math.random()*item.data.length),1));//随机一个对应长尾词并删除
          restKws=restKws.concat(item.data);
        })
        let title=titleTodo.join(' ');
        if(title.length<128){
          title=title128Length(title,restKws);
        }
        titles.push(title);
      }
      showDialog({
        icon:'success',
        title:`成功组合${titles.length}个标题！`,
        html: (function(){
          return titles.join('<br>')
        })()
        , width: "70%"
        , showCloseButton: !0
        , showConfirmButton:!1
        , cancelButtonText: "关闭"
      }
      ).then((res)=>{})
    });
  }
  sleep(1e3).then(() => {
    main();
  })


})()
