// ==UserScript==
// @name        aone-helper
// @description a aone helper
// @namespace   github.com/taotao7
// @require     http://libs.baidu.com/jquery/1.8.3/jquery.min.js
// @require     https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/layer.js
// @resource    0 http://cdn.bootcdn.net/ajax/libs/layer/3.1.1/theme/default/layer.css
// @match       *aone.alibaba-inc.com/*
// @match       *team.aone.alibaba-inc.com/*
// @match       *code.alibaba-inc.com/*
// @match       *my.aone.alibaba-inc.com/*
// @match       *ati.alibaba-inc.com/*
// @version     0.0.4
// @author      taotao7
// @license     MIT
// @grant       GM_log
// @grant       GM_listValues
// @grant       GM_getValue
// @grant       Gm_setValue
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/449347/aone-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/449347/aone-helper.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2020 cvzi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/* globals React, ReactDOM */
(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var dayjs_min = {exports: {}};

	(function (module, exports) {
	  !function (t, e) {
	    module.exports = e() ;
	  }(commonjsGlobal, function () {

	    var t = 1e3,
	        e = 6e4,
	        n = 36e5,
	        r = "millisecond",
	        i = "second",
	        s = "minute",
	        u = "hour",
	        a = "day",
	        o = "week",
	        f = "month",
	        h = "quarter",
	        c = "year",
	        d = "date",
	        $ = "Invalid Date",
	        l = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,
	        y = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,
	        M = {
	      name: "en",
	      weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
	      months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_")
	    },
	        m = function (t, e, n) {
	      var r = String(t);
	      return !r || r.length >= e ? t : "" + Array(e + 1 - r.length).join(n) + t;
	    },
	        g = {
	      s: m,
	      z: function (t) {
	        var e = -t.utcOffset(),
	            n = Math.abs(e),
	            r = Math.floor(n / 60),
	            i = n % 60;
	        return (e <= 0 ? "+" : "-") + m(r, 2, "0") + ":" + m(i, 2, "0");
	      },
	      m: function t(e, n) {
	        if (e.date() < n.date()) return -t(n, e);
	        var r = 12 * (n.year() - e.year()) + (n.month() - e.month()),
	            i = e.clone().add(r, f),
	            s = n - i < 0,
	            u = e.clone().add(r + (s ? -1 : 1), f);
	        return +(-(r + (n - i) / (s ? i - u : u - i)) || 0);
	      },
	      a: function (t) {
	        return t < 0 ? Math.ceil(t) || 0 : Math.floor(t);
	      },
	      p: function (t) {
	        return {
	          M: f,
	          y: c,
	          w: o,
	          d: a,
	          D: d,
	          h: u,
	          m: s,
	          s: i,
	          ms: r,
	          Q: h
	        }[t] || String(t || "").toLowerCase().replace(/s$/, "");
	      },
	      u: function (t) {
	        return void 0 === t;
	      }
	    },
	        v = "en",
	        D = {};

	    D[v] = M;

	    var p = function (t) {
	      return t instanceof _;
	    },
	        S = function t(e, n, r) {
	      var i;
	      if (!e) return v;

	      if ("string" == typeof e) {
	        var s = e.toLowerCase();
	        D[s] && (i = s), n && (D[s] = n, i = s);
	        var u = e.split("-");
	        if (!i && u.length > 1) return t(u[0]);
	      } else {
	        var a = e.name;
	        D[a] = e, i = a;
	      }

	      return !r && i && (v = i), i || !r && v;
	    },
	        w = function (t, e) {
	      if (p(t)) return t.clone();
	      var n = "object" == typeof e ? e : {};
	      return n.date = t, n.args = arguments, new _(n);
	    },
	        O = g;

	    O.l = S, O.i = p, O.w = function (t, e) {
	      return w(t, {
	        locale: e.$L,
	        utc: e.$u,
	        x: e.$x,
	        $offset: e.$offset
	      });
	    };

	    var _ = function () {
	      function M(t) {
	        this.$L = S(t.locale, null, !0), this.parse(t);
	      }

	      var m = M.prototype;
	      return m.parse = function (t) {
	        this.$d = function (t) {
	          var e = t.date,
	              n = t.utc;
	          if (null === e) return new Date(NaN);
	          if (O.u(e)) return new Date();
	          if (e instanceof Date) return new Date(e);

	          if ("string" == typeof e && !/Z$/i.test(e)) {
	            var r = e.match(l);

	            if (r) {
	              var i = r[2] - 1 || 0,
	                  s = (r[7] || "0").substring(0, 3);
	              return n ? new Date(Date.UTC(r[1], i, r[3] || 1, r[4] || 0, r[5] || 0, r[6] || 0, s)) : new Date(r[1], i, r[3] || 1, r[4] || 0, r[5] || 0, r[6] || 0, s);
	            }
	          }

	          return new Date(e);
	        }(t), this.$x = t.x || {}, this.init();
	      }, m.init = function () {
	        var t = this.$d;
	        this.$y = t.getFullYear(), this.$M = t.getMonth(), this.$D = t.getDate(), this.$W = t.getDay(), this.$H = t.getHours(), this.$m = t.getMinutes(), this.$s = t.getSeconds(), this.$ms = t.getMilliseconds();
	      }, m.$utils = function () {
	        return O;
	      }, m.isValid = function () {
	        return !(this.$d.toString() === $);
	      }, m.isSame = function (t, e) {
	        var n = w(t);
	        return this.startOf(e) <= n && n <= this.endOf(e);
	      }, m.isAfter = function (t, e) {
	        return w(t) < this.startOf(e);
	      }, m.isBefore = function (t, e) {
	        return this.endOf(e) < w(t);
	      }, m.$g = function (t, e, n) {
	        return O.u(t) ? this[e] : this.set(n, t);
	      }, m.unix = function () {
	        return Math.floor(this.valueOf() / 1e3);
	      }, m.valueOf = function () {
	        return this.$d.getTime();
	      }, m.startOf = function (t, e) {
	        var n = this,
	            r = !!O.u(e) || e,
	            h = O.p(t),
	            $ = function (t, e) {
	          var i = O.w(n.$u ? Date.UTC(n.$y, e, t) : new Date(n.$y, e, t), n);
	          return r ? i : i.endOf(a);
	        },
	            l = function (t, e) {
	          return O.w(n.toDate()[t].apply(n.toDate("s"), (r ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e)), n);
	        },
	            y = this.$W,
	            M = this.$M,
	            m = this.$D,
	            g = "set" + (this.$u ? "UTC" : "");

	        switch (h) {
	          case c:
	            return r ? $(1, 0) : $(31, 11);

	          case f:
	            return r ? $(1, M) : $(0, M + 1);

	          case o:
	            var v = this.$locale().weekStart || 0,
	                D = (y < v ? y + 7 : y) - v;
	            return $(r ? m - D : m + (6 - D), M);

	          case a:
	          case d:
	            return l(g + "Hours", 0);

	          case u:
	            return l(g + "Minutes", 1);

	          case s:
	            return l(g + "Seconds", 2);

	          case i:
	            return l(g + "Milliseconds", 3);

	          default:
	            return this.clone();
	        }
	      }, m.endOf = function (t) {
	        return this.startOf(t, !1);
	      }, m.$set = function (t, e) {
	        var n,
	            o = O.p(t),
	            h = "set" + (this.$u ? "UTC" : ""),
	            $ = (n = {}, n[a] = h + "Date", n[d] = h + "Date", n[f] = h + "Month", n[c] = h + "FullYear", n[u] = h + "Hours", n[s] = h + "Minutes", n[i] = h + "Seconds", n[r] = h + "Milliseconds", n)[o],
	            l = o === a ? this.$D + (e - this.$W) : e;

	        if (o === f || o === c) {
	          var y = this.clone().set(d, 1);
	          y.$d[$](l), y.init(), this.$d = y.set(d, Math.min(this.$D, y.daysInMonth())).$d;
	        } else $ && this.$d[$](l);

	        return this.init(), this;
	      }, m.set = function (t, e) {
	        return this.clone().$set(t, e);
	      }, m.get = function (t) {
	        return this[O.p(t)]();
	      }, m.add = function (r, h) {
	        var d,
	            $ = this;
	        r = Number(r);

	        var l = O.p(h),
	            y = function (t) {
	          var e = w($);
	          return O.w(e.date(e.date() + Math.round(t * r)), $);
	        };

	        if (l === f) return this.set(f, this.$M + r);
	        if (l === c) return this.set(c, this.$y + r);
	        if (l === a) return y(1);
	        if (l === o) return y(7);
	        var M = (d = {}, d[s] = e, d[u] = n, d[i] = t, d)[l] || 1,
	            m = this.$d.getTime() + r * M;
	        return O.w(m, this);
	      }, m.subtract = function (t, e) {
	        return this.add(-1 * t, e);
	      }, m.format = function (t) {
	        var e = this,
	            n = this.$locale();
	        if (!this.isValid()) return n.invalidDate || $;

	        var r = t || "YYYY-MM-DDTHH:mm:ssZ",
	            i = O.z(this),
	            s = this.$H,
	            u = this.$m,
	            a = this.$M,
	            o = n.weekdays,
	            f = n.months,
	            h = function (t, n, i, s) {
	          return t && (t[n] || t(e, r)) || i[n].slice(0, s);
	        },
	            c = function (t) {
	          return O.s(s % 12 || 12, t, "0");
	        },
	            d = n.meridiem || function (t, e, n) {
	          var r = t < 12 ? "AM" : "PM";
	          return n ? r.toLowerCase() : r;
	        },
	            l = {
	          YY: String(this.$y).slice(-2),
	          YYYY: this.$y,
	          M: a + 1,
	          MM: O.s(a + 1, 2, "0"),
	          MMM: h(n.monthsShort, a, f, 3),
	          MMMM: h(f, a),
	          D: this.$D,
	          DD: O.s(this.$D, 2, "0"),
	          d: String(this.$W),
	          dd: h(n.weekdaysMin, this.$W, o, 2),
	          ddd: h(n.weekdaysShort, this.$W, o, 3),
	          dddd: o[this.$W],
	          H: String(s),
	          HH: O.s(s, 2, "0"),
	          h: c(1),
	          hh: c(2),
	          a: d(s, u, !0),
	          A: d(s, u, !1),
	          m: String(u),
	          mm: O.s(u, 2, "0"),
	          s: String(this.$s),
	          ss: O.s(this.$s, 2, "0"),
	          SSS: O.s(this.$ms, 3, "0"),
	          Z: i
	        };

	        return r.replace(y, function (t, e) {
	          return e || l[t] || i.replace(":", "");
	        });
	      }, m.utcOffset = function () {
	        return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
	      }, m.diff = function (r, d, $) {
	        var l,
	            y = O.p(d),
	            M = w(r),
	            m = (M.utcOffset() - this.utcOffset()) * e,
	            g = this - M,
	            v = O.m(this, M);
	        return v = (l = {}, l[c] = v / 12, l[f] = v, l[h] = v / 3, l[o] = (g - m) / 6048e5, l[a] = (g - m) / 864e5, l[u] = g / n, l[s] = g / e, l[i] = g / t, l)[y] || g, $ ? v : O.a(v);
	      }, m.daysInMonth = function () {
	        return this.endOf(f).$D;
	      }, m.$locale = function () {
	        return D[this.$L];
	      }, m.locale = function (t, e) {
	        if (!t) return this.$L;
	        var n = this.clone(),
	            r = S(t, e, !0);
	        return r && (n.$L = r), n;
	      }, m.clone = function () {
	        return O.w(this.$d, this);
	      }, m.toDate = function () {
	        return new Date(this.valueOf());
	      }, m.toJSON = function () {
	        return this.isValid() ? this.toISOString() : null;
	      }, m.toISOString = function () {
	        return this.$d.toISOString();
	      }, m.toString = function () {
	        return this.$d.toUTCString();
	      }, M;
	    }(),
	        T = _.prototype;

	    return w.prototype = T, [["$ms", r], ["$s", i], ["$m", s], ["$H", u], ["$W", a], ["$M", f], ["$y", c], ["$D", d]].forEach(function (t) {
	      T[t[1]] = function (e) {
	        return this.$g(e, t[0], t[1]);
	      };
	    }), w.extend = function (t, e) {
	      return t.$i || (t(e, _, w), t.$i = !0), w;
	    }, w.locale = S, w.isDayjs = p, w.unix = function (t) {
	      return w(1e3 * t);
	    }, w.en = D[v], w.Ls = D, w.p = {}, w;
	  });
	})(dayjs_min);

	var dayjs = dayjs_min.exports;

	const init = () => {
	  // @ts-ignore
	  GM_addStyle(GM_getResourceText("0")); // @ts-ignore

	  GM_addStyle(".site-dir{display:none;}.site-dir li{line-height:26px;overflow:visible;list-style-type:disc;}.site-dir li a{display:block;text-decoration:none}.site-dir li a:active{color:#01AAED;}.site-dir li a.layui-this{color:#01AAED;}body .layui-layer-dir{box-shadow:none;border:1px solid #d2d2d2;}body .layui-layer-dir .layui-layer-content{padding:10px;}.site-dir a em{padding-left:5px;font-size:12px;color:#c2c2c2;font-style:normal;}"); // @ts-ignore

	  GM_addStyle(".layui-layer-ico16,.layui-layer-loading.layui-layer-loading2{width:32px;height:32px;background:url(https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/theme/default/loading-2.gif)no-repeat;}.layui-layer-ico{background: url(https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/theme/default/icon.png) no-repeat;}"); // // @ts-ignore
	  // unsafeWindow.layer = window.layer; // 把layer设置到原始window对象中
	  // // @ts-ignore
	  // unsafeWindow.csrfToken = window.csrfToken;
	  // // @ts-ignore
	  // unsafeWindow.profileUserInfo = window.profileUserInfo;
	}; // 获取用户信息

	const getUserInfo = () => {
	  // @ts-ignore
	  return window.localStorage.getItem("aoneHelper");
	}; // 获取当前窗口相对路径

	const getUrlRelativePath = () => {
	  const url = document.location.toString();
	  const arrUrl = url.split("//");
	  const start = arrUrl[1].indexOf("/");
	  let relUrl = arrUrl[1].substring(start); //stop省略，截取从start开始到结尾的所有字符

	  if (relUrl.indexOf("?") != -1) {
	    relUrl = relUrl.split("?")[0];
	  }

	  return relUrl;
	}; // 根据需求返回需求名称和Aone名称

	const getReqName = reqList => {
	  // 上周天12点
	  const lastWeek = dayjs().add(-1, "week").day(6).valueOf();
	  const nameList = [];

	  if (reqList.length > 0) {
	    reqList.forEach(i => {
	      //大于上周天12点的
	      if (i.gmtModified > lastWeek) {
	        nameList.push(`${i.subject} -- aone id: ${i.identifier}`);
	      }
	    });
	  }

	  return nameList;
	};

	// 封装请求
	const request = (url, options) => {
	  return new Promise((resolve, resject) => {
	    $.ajax({
	      type: options?.method || "GET",
	      url,
	      contentType: options?.contentType || null,
	      beforeSend: request => {
	        // 默认一定要带的
	        request.setRequestHeader("bx-v", "2.2.2"); // @ts-ignore
	        // request.setRequestHeader("x-csrf-token", csrfToken);
	        // 如果添加了options且带headers

	        if (options?.headers) {
	          Object.keys(options.headers).forEach(i => {
	            request.setRequestHeader(i, options.headers[i]);
	          });
	        }
	      },
	      dataType: options?.dataType || null,
	      data: options?.data || null,
	      success: res => {
	        resolve(res);
	      },
	      error: e => {
	        resject(e);
	      }
	    });
	  });
	};

	const getCurrentRequirements = async () => {
	  const id = getUserInfo();
	  return await request("https://aone.alibaba-inc.com/v2/api/workitem/adapter/workitem/list?_input_charset=utf-8", {
	    method: "POST",
	    contentType: "application/json",
	    headers: {
	      accept: "application/json, text/plain, */*"
	    },
	    dataType: "json",
	    data: JSON.stringify({
	      spaceType: "User",
	      spaceIdentifier: id,
	      category: "",
	      toPage: 1,
	      pageSize: 500,
	      conditions: `{"conditionGroups":[[{"fieldIdentifier":"assignedTo","operator":"CONTAINS","value":["${id}"],"toValue":null,"className":"user","format":"list"}]]}`,
	      searchType: "LIST",
	      groupCondition: '{"fieldIdentifier":"category","className":"category","format":"list","value":["Req"],"operator":"EQUALS"}',
	      scope: "personal"
	    })
	  });
	}; // 上月代码页面统计

	const getLastMonthCodeStat = async () => {
	  let addLine = 0;
	  let delLine = 0; // @ts-ignore

	  const lastMonthStart = dayjs().startOf("month").subtract(1, "month").format("YYYY-MM-DD");
	  const lastMonthEnd = dayjs().endOf("month").subtract(1, "month").format("YYYY-MM-DD"); // .format("YYYY-MM");

	  console.log("123--->", lastMonthStart);
	  console.log("123--->", lastMonthEnd);
	  const commitList = await request( // @ts-ignore
	  `https://ati-app.alibaba-inc.com/open/personal/activities?startDate=${lastMonthStart}+00:00:00&endDate=${lastMonthEnd}+00:00:00&empId=${getUserInfo()}`);

	  if (commitList?.data?.crAuthor?.repo_summary_list) {
	    commitList.data.crAuthor.repo_summary_list.forEach(i => {
	      i?.review_list.forEach(j => {
	        addLine += j.add_line_count;
	        delLine += j.del_line_count;
	      });
	    });
	  }

	  console.log("123", addLine);
	  return {
	    addLine,
	    delLine
	  };
	}; // 本月代码页面统计

	const getCurrentMonthCodeStat = async () => {
	  let addLine = 0;
	  let delLine = 0; // @ts-ignore

	  const monthStart = dayjs().startOf("month").format("YYYY-MM-DD");
	  const monthEnd = dayjs().endOf("month").format("YYYY-MM-DD");
	  const commitList = await request( // @ts-ignore
	  `https://ati-app.alibaba-inc.com/open/personal/activities?startDate=${monthStart}+00:00:00&endDate=${monthEnd}+00:00:00&empId=${getUserInfo()}`);

	  if (commitList?.data?.crAuthor?.repo_summary_list) {
	    commitList.data.crAuthor.repo_summary_list.forEach(i => {
	      i?.review_list.forEach(j => {
	        addLine += j.add_line_count;
	        delLine += j.del_line_count;
	      });
	    });
	  }

	  return {
	    addLine,
	    delLine
	  };
	}; // 代码页面统计
	// export const getCodeStat = async () => {
	//   const currentMonthStart = dayjs().startOf("month").format("YYYYMMDD");
	//   const currentMonthEnd = dayjs().endOf("month").format("YYYYMMDD");
	//   // 获取token
	//   const token = await request(
	//     "https://code.alibaba-inc.com/api/v3/internal/exchange",
	//     {
	//       code: true,
	//     }
	//   );
	//   // 储存隐私token
	//   window.localStorage.setItem("privateToken", token.privateToken);
	//   const commitList = await request(
	//     `https://code.aone.alibaba-inc.com/api/v3/projects/393249/reports/total_commit?_input_charset=utf-8&start_date=${currentMonthStart}&end_date=${currentMonthEnd}&private_token=${token.privateToken}`,
	//     {
	//       code: true,
	//       headers: {
	//         Accept: "application/json, text/javascript",
	//         "Content-Type": "application/x-www-form-urlencoded",
	//         Host: "code.aone.alibaba-inc.com",
	//         Referer: "https://code.aone.alibaba-inc.com",
	//         "Sec-Fetch-Mode": "cors",
	//         "Sec-Fetch-Site": "same-origin",
	//         Cookie: document.cookie,
	//       },
	//     }
	//   );
	//   console.log("123", commitList);
	// };

	const content = `
    <ul  style="display:block;margin-left:30px" class="site-dir layui-layer-wrap">
      <li>
        <a id="week">周工作填报</a>
      </li>
      <li>
        <a id="month">月代码量</a>
      </li>
    </ul>
    `; // 显示本周工作 aone /v2

	const controlPanel = async () => {
	  try {
	    const requirementsList = await getCurrentRequirements();
	    const id = getUserInfo();
	    const nameList = getReqName(requirementsList?.result); // @ts-ignore

	    layer.open({
	      type: 1,
	      title: "操作面板",
	      // @ts-ignore
	      maxHeight: $(window).height() - 300,
	      closeBtn: 0,
	      content,
	      shade: 0,
	      anim: 2,
	      offset: "r"
	    });
	    $("#week").on("click", () => {
	      // @ts-ignore
	      layer.open({
	        title: "本周需求",
	        area: "400px",
	        content: `
      <ul style="display:block;margin-left:30px" class="site-dir layui-layer-wrap">
        ${nameList.map(i => `<li>${i}</li>`)}
      </ul>
      `,
	        shade: 0,
	        anim: 2,
	        btn: ["复制"],
	        yes: (index, _) => {
	          // 复制到剪切板
	          navigator.clipboard.writeText(nameList.toString()).then(() => {
	            window.open(`https://team.aone.alibaba-inc.com/inventory/${id}`); // @ts-ignore

	            layer.close(index);
	          });
	        }
	      });
	    });
	    $("#month").on("click", () => {
	      window.open("https://ati.alibaba-inc.com/person");
	    });
	  } catch (e) {
	    console.log("123---->", e);
	  }
	}; // 代码页面 aone code page

	const codeStat = async () => {
	  try {
	    const lastStat = await getLastMonthCodeStat();
	    const currentStat = await getCurrentMonthCodeStat();
	    const currentMonth = dayjs().format("MM");
	    const lastMonth = dayjs().add(-1, "month").format("MM"); // @ts-ignore

	    layer.open({
	      title: `${lastMonth}--${currentMonth}月commit情况`,
	      content: `<div>
      <h3>${currentMonth} 月</h3>
      <div>添加行: ${currentStat.addLine}<div>
      <div>删除行: ${currentStat.delLine}<div>

      <h3>${lastMonth} 月</h3>
      <div>添加行: ${lastStat.addLine}<div>
      <div>删除行: ${lastStat.delLine}<div>
    <div>`,
	      shade: 0,
	      anim: 2
	    });
	  } catch (e) {
	    console.log("123---->", e);
	  }
	};

	const check = () => {
	  // 检测是否输入了id
	  if (!window.localStorage.getItem("aoneHelper")) {
	    layer.prompt({
	      type: 1,
	      title: "输入你的ID例如WBxxxxxx",
	      value: "输入后会保存在localstorage"
	    }, (v, i) => {
	      window.localStorage.setItem("aoneHelper", v);
	      layer.close(i);
	      location.reload();
	    });
	    return;
	  }
	}; // 初始化tampermonkey变量


	init(); //执行

	(async function () {
	  // aone 首页
	  if (getUrlRelativePath() === "/v2") {
	    check();
	    await controlPanel();
	  } // aone 代码页


	  if (getUrlRelativePath().includes("/person")) {
	    check();
	    await codeStat();
	  } // layer.open({
	  //   title: "hello",
	  //   type: 1,
	  // });

	})();

})();
//# sourceMappingURL=bundle.user.js.map
