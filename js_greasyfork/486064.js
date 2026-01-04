// ==UserScript==
// @name         wht头文件替换
// @namespace    https://github.com/Lim-Watt
// @version      0.0.14
// @description  在粘贴代码时替换掉自定义的头文件
// @author       Lim Watt
// @match        https://www.luogu.com.cn/*
// @match        https://www.luogu.com/*
// @match        *://*.codeforces.com/*
// @match        *://atcoder.jp/*
// @match        *://10.37.2.111/*
// @match        *://*.codeforc.es/*
// @match        *://loj.ac/*
// @connect      greasyfork.org
// @connect      *
// @icon         https://cdn.luogu.com.cn/upload/usericon/3.png
// @grant        GM.setClipboard
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486064/wht%E5%A4%B4%E6%96%87%E4%BB%B6%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/486064/wht%E5%A4%B4%E6%96%87%E4%BB%B6%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
GM_addStyle(`
/*更新检查*/
div#update_panel {
    z-index: 200;
    position: fixed;
    top: 50%;
    left: 50%;
    width: 240px;
    transform: translate(-50%, -50%);
    box-shadow: 0px 0px 4px 0px #0000004d;
    padding: 10px 20px 20px 20px;
    color: #444242;
    background-color: #f5f5f5;
    border: 1px solid #848484;
    border-radius: 8px;
}
div#update_panel #updating {
    cursor: pointer;
	padding: 3px;
	background-color: #1aa06d;
	color: #ffffff;
	font-size: 14px;
	line-height: 1.5rem;
	font-weight: 500;
	justify-content: center;
	width: 45%;
	border-radius: 0.375rem;
	border: none;
	box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
div#update_panel #updating a {
    text-decoration: none;
    color: white;
    display: flex;
    position: inherit;
    top: 0;
    left: 0;
    width: 100%;
    height: 22px;
    font-size: 14px;
    justify-content: center;
    align-items: center;
}
div#update_panel #reloadee {
    cursor: pointer;
	padding: 3px;
	background-color: #bbb;
	color: #ffffff;
	font-size: 14px;
	line-height: 1.5rem;
	font-weight: 500;
	justify-content: center;
	width: 45%;
	border-radius: 0.375rem;
	border: none;
	box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
`);
const darkenPageStyle = `body::before { content: ""; display: block; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.4); z-index: 200; }`;

/*/
 * 更新检查
/*/
function checkScriptVersion() {
    function compareVersions(version1 = "0", version2 = "0") {
        const v1Array = String(version1).split(".");
        const v2Array = String(version2).split(".");
        const minLength = Math.min(v1Array.length, v2Array.length);
        let result = 0;
        for (let i = 0; i < minLength; i++) {
            const curV1 = Number(v1Array[i]);
            const curV2 = Number(v2Array[i]);
            if (curV1 > curV2) {
                result = 1;
                break;
            } else if (curV1 < curV2) {
                result = -1;
                break;
            }
        }
        if (result === 0 && v1Array.length !== v2Array.length) {
            const v1IsBigger = v1Array.length > v2Array.length;
            const maxLenArray = v1IsBigger ? v1Array : v2Array;
            for (let i = minLength; i < maxLenArray.length; i++) {
                const curVersion = Number(maxLenArray[i]);
                if (curVersion > 0) {
                    v1IsBigger ? result = 1 : result = -1;
                    break;
                }
            }
        }
        return result;
    }

    GM_xmlhttpRequest({
        method: "GET",
        url: "https://greasyfork.org/zh-CN/scripts/486064.json",
        timeout: 10 * 1e3,
        onload: function (response) {
            const scriptData = JSON.parse(response.responseText);

            if (
                compareVersions(scriptData.version, GM_info.script.version) === 1
            ) {
                const styleElement = GM_addStyle(darkenPageStyle);
                document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeend',`
                    <div id='update_panel'>
                        <h3>${GM_info.script.name} 有新版本！</h3>
                        <hr>
                        <span class ='tip'>版本信息：${GM_info.script.version} → ${scriptData.version}</span>
                        <p>已经更新？请刷新以同步。</p>
                        <button id='updating'><a href="${scriptData.url}">更新</a></button> <button id='reloadee'>刷新</button>
                    </div>
                `);
                document.getElementById("reloadee").onclick = function(){
                    history.go(0);
                }
            }
        }
    });

};
    const clipboardObj = navigator.clipboard;
    var text;

const reg1 = `#include "Geo"`;
const tog1 = `namespace G_normal {
    const double eps = 1e-6;
    
    inline int dcmp(double a, double b) {
        if (fabs(a - b) < eps) return 0;
        else if (a < b) return -1;
        else return 1;
    }
    
    struct point {
        double x, y;
        inline point (double X = 0, double Y = 0) : x(X), y(Y) {}
    };
    
    inline point operator + (point a, point b) {return point(a.x + b.x, a.y + b.y);}
    inline point operator - (point a, point b) {return point(a.x - b.x, a.y - b.y);}
    inline point operator * (point a, double b) {return point(a.x * b, a.y * b);}
    inline point operator / (point a, double b) {return point(a.x / b, a.y / b);}
    inline double operator * (point a, point b) {return a.x * b.x + a.y * b.y;}
    inline double cross(point a, point b) {return a.x * b.y - a.y * b.x;}
    inline double dis(point a, point b) {return sqrt((a - b) * (a - b));}
    
    struct line {
        point s, t;
        double a, le;
        inline line () {}
        inline line (point S, point T) : s(S), t(T) {}
        inline bool operator < (const line &x) const {
            return a < x.a;
        }
    };
    
    inline double at(point a) {return atan2(a.y, a.x);}
    inline double at(line a) {return at(a.t - a.s);}
    inline double ta(line a) {return at(a.s - a.t);}
    inline point turn(point a) {return point(-a.y, a.x);}
    inline line turn(line a) {return line(a.s, a.s + turn(a.t - a.s));}
    inline point intersection(line a, line b) {double s1 = cross(b.s - a.s, a.t - a.s), s2 = cross(a.t - a.s, b.t - a.s);return b.s + (b.t - b.s) * s1 / (s1 + s2);}
    
    inline double dpl(point a, line b) {
        line c = turn(b);
        c.t = c.t - c.s + a;
        c.s = a;
        point d = intersection(b, c);
        return (a - d) * (a - d);
    }
    
    inline point circle(point a, point b, point c) {
        line l1, l2;
        l1.s = point((a.x + b.x) / 2, (a.y + b.y) / 2), l2.s = point((b.x + c.x) / 2, (b.y + c.y) / 2);
        l1.t = l1.s + point(-(b.y - a.y), b.x - a.x), l2.t = l2.s + point(-(c.y - b.y), c.x - b.x);
        return intersection(l1, l2);
    }
}

using namespace G_normal;

namespace G_algorithm {
    point op;
    inline bool cmp(const point &a, const point &b) {
        double s = cross(a - op, b - op);
        if (dcmp(s, 0) == 0) return dis(op, a) < dis(op, b);
        return dcmp(s, 0) == 1;
    }
    
    inline void convex_hull(int &n, point *po, int &t, point *s) {
        for (int i = 1; i <= n; ++ i)
            if (po[i].y < po[1].y || (po[i].y == po[1].y && po[i].x < po[1].x)) swap(po[i], po[1]);
        op = po[1];
        sort(po + 2, po + n + 1, cmp);
        s[t = 1] = po[1];
        for (int i = 2; i <= n; ++ i) {
            while (t > 1 && dcmp(cross(s[t] - s[t - 1], po[i] - s[t]), 0) == -1) -- t;
            s[ ++ t] = po[i];
        }
        return;
    }
    
    inline double Rotate_the_jam(int &t, point *s) {
        s[t + 1] = s[1];
        if (t < 3) return dis(s[1], s[2]);
        double ans = 0;
        int pos;
        for (int i = 3; i <= t; ++ i)
            if (dcmp(cross(s[2] - s[i], s[2] - s[1]), cross(s[2] - s[pos], s[2] - s[1])) == 1) pos = i;
        //ans = max(dis(s[1], s[pos]), dis(s[2], s[pos]));
        ans = dpl(s[pos], line(s[1], s[2]));
        for (int i = 2; i <= t; ++ i) {
            while (dcmp(cross(s[i + 1] - s[pos], s[i + 1] - s[i]), cross(s[i + 1] - s[pos + 1], s[i + 1] - s[i])) == -1) {
                ++ pos;
                if (pos > t) pos = 1;
            }
            ans = max(ans, dpl(s[pos], line(s[i], s[i + 1])));
            //ans = max(ans, max(dis(s[i], s[pos]), dis(s[i + 1], s[pos])));
        }
        return ans;
    }
    
    inline double Half_plane(int n, line *l) {
        line s[n + 10];
        int t, ll, rr;
        for (int i = 1; i <= n; ++ i) l[i].a = at(l[i]);
        sort(l + 1, l + n + 1);
        s[t = 1] = l[1];
        for (int i = 2 ; i <= n; ++ i) {
            while (t && dcmp(s[t].a - l[i].a, 0) == 0 && dcmp(cross(s[t].t - s[t].s, l[i].s - s[t].s), 0) == 1) -- t;
            while (t > 1 && dcmp(cross(l[i].t - l[i].s, intersection(s[t], s[t - 1]) - l[i].s), 0) == -1) -- t;
            if (dcmp(s[t].a - l[i].a, 0) != 0) s[ ++ t] = l[i];
        }
        ll = 1, rr = t;
        while (ll < rr) {
            if (dcmp(cross(s[ll].t - s[ll].s, intersection(s[rr], s[rr - 1]) - s[ll].s), 0) == -1) -- rr;
            else if(dcmp(cross(s[rr].t - s[rr].s, intersection(s[ll], s[ll + 1]) - s[rr].s), 0) == -1) ++ ll;
            else break;
        }
        if (rr - ll <= 1) return 0;
        double ans = 0;
        s[rr + 1] = s[ll], s[rr + 2] = s[ll + 1];
        for (int i = ll; i <= rr; ++ i) ans += cross(intersection(s[i], s[i + 1]), intersection(s[i + 1], s[i + 2]));
        return ans / 2.0;
    }
}
`;
const reg2 = `#include "SA"`;
const tog2 = `//SA
#ifndef __w_SA_
#define __w_SA_

template <typename T = unsigned int>
class SuffixArray
{
public:
    using size_type = T;
    using pointer = size_type *;
    using const_pointer = const size_type *;
    
    static_assert(std::is_integral<T>::value);
    
private:
    struct Equal
    {
        template <typename T1, typename T2>
        inline bool operator()(T1 lhs, T2 rhs) const noexcept
        {
            static_assert(std::is_integral<T1>::value && std::is_integral<T2>::value);
            return lhs == rhs;
        }
    };
    
    struct Buffer
    {
        pointer ptr;
        size_type len;
        Buffer() noexcept : ptr(nullptr), len(0) {}
        Buffer(pointer ptr, size_type len) noexcept : ptr(ptr), len(len) {}
        inline pointer alloc(size_type cnt) noexcept
        {
            return ptr + (len -= cnt);
        }
        inline bool operator<(Buffer other) const noexcept
        {
            return len < other.len;
        }
    };
    
    inline static bool is_negative(size_type n) noexcept
    {
        return (typename std::make_signed<size_type>::type)(n) < 0;
    }
    
    template <typename It, typename Eq>
    inline static bool is_equal(It s, size_type x, size_type y, size_type len, Eq eq) noexcept(noexcept(s[0]))
    {
        for (size_type i = 0; i < len; ++i)
            if (!eq(s[x + i], s[y + i]))
                return false;
        return true;
    }
    
    template <typename It>
    inline static void get_sbuk(It s, pointer sbuk, size_type n, size_type m) noexcept(noexcept(s[0]))
    {
        std::fill_n(sbuk, m, 0);
        for (size_type i = 0; i < n; ++i)
            ++sbuk[s[i]];
        std::partial_sum(sbuk, sbuk + m, sbuk);
    }
    
    inline static void lbuk_to_sbuk(const_pointer lbuk, pointer sbuk, size_type n, size_type m) noexcept
    {
        std::copy_n(lbuk + 1, m - 1, sbuk);
        sbuk[m - 1] = n;
    }
    
    inline static void sbuk_to_lbuk(pointer lbuk, const_pointer sbuk, size_type n, size_type m) noexcept
    {
        lbuk[0] = 0;
        std::copy_n(sbuk, m - 1, lbuk + 1);
    }
    
    template <typename It, typename Visitor>
    static void scan_lms_pos(It s, size_type n, Visitor visitor) noexcept(noexcept(s[0]))
    {
        using value_type = typename std::iterator_traits<It>::value_type;
        value_type pre, cur = s[n - 1];
        size_type i = n - 1;
        while (true)
        {
            do
                pre = cur;
            while (!is_negative(--i) && (cur = s[i]) >= pre);
            if (is_negative(i))
                break;
            do
                pre = cur;
            while (!is_negative(--i) && (cur = s[i]) <= pre);
            if (is_negative(i))
                break;
            visitor(i + 1, pre);
        }
    }
    
    template <typename It>
    inline static size_type fill_lms_char(It s, pointer sa, pointer sbuk, size_type n, size_type m) noexcept(noexcept(s[0]))
    {
        using value_type = typename std::iterator_traits<It>::value_type;
        size_type c0 = m - 1, p0 = 0, n0 = 0;
        std::fill_n(sa, n, 0);
        scan_lms_pos(s, n, [&, sa, sbuk](size_type p, value_type c)
        {
            sa[--sbuk[c0]] = p0;
            p0 = p;
            c0 = c;
            ++n0;
        });
        return n0;
    }
    
    template <typename It>
    static void induce_lms_substr(It s, pointer sa, pointer lbuk, pointer sbuk, size_type n, size_type m) noexcept(noexcept(s[0]))
    {
        using value_type = typename std::iterator_traits<It>::value_type;
        const pointer rsa = sa + n;
        lbuk_to_sbuk(lbuk, sbuk, n, m);
        value_type pre = s[n - 1], cur;
        pointer induce_to = sa + lbuk[pre];
        *induce_to++ = s[n - 2] < pre ? ~n + 2 : n - 1;
        for (pointer i = sa; i != rsa; ++i)
        {
            const size_type p = *i - 1;
            if (is_negative(p))
                continue;
            if ((cur = s[p]) != pre)
            {
                lbuk[pre] = induce_to - sa;
                induce_to = sa + lbuk[pre = cur];
            }
            *i = 0;
            *induce_to++ = s[p - 1] < cur ? ~p + 1 : p;
        }
        induce_to = sa + sbuk[pre = 0];
        sbuk_to_lbuk(lbuk, sbuk, n, m);
        for (pointer i = rsa; i-- != sa;)
        {
            const size_type p = ~*i;
            if (is_negative(p))
                continue;
            if ((cur = s[p]) != pre)
            {
                sbuk[pre] = induce_to - sa;
                induce_to = sa + sbuk[pre = cur];
            }
            *i = 0;
            *--induce_to = s[p - 1] > cur ? p : ~p + 1;
        }
    }
    
    template <typename It, typename Eq>
    static size_type rename(It s, pointer sa, pointer s0, const_pointer lbuk, const_pointer sbuk, size_type n, size_type m, size_type n0, size_type d, Eq eq) noexcept(noexcept(s[0]))
    {
        using value_type = typename std::iterator_traits<It>::value_type;
        const pointer rsa0 = sa + n0;
        pointer i0 = sa, j0 = sa;
        if (d > 0)
        {
            const value_type c = d - 1;
            assert(lbuk[c] == 0);
            i0 = sa + lbuk[d];
            for (size_type i = 0; j0 != i0; i += 2, ++j0)
            {
                while (i < n && s[i] != c)
                    ++i;
                *j0 = i;
            }
        }
        if (i0 == j0)
            i0 = j0 = std::find(j0, rsa0, 0);
        for (pointer i = i0, j = j0; j != rsa0; ++i)
        {
            const size_type p = *i;
            if (p == 0)
                continue;
            *i = 0;
            *j++ = p;
        }
        size_type j = n - 1;
        scan_lms_pos(s, n, [sa, n0, &j](size_type p, value_type c)
        {
            sa[n0 + p / 2] = j - p + 1;
            j = p;
        });
        size_type m0 = 0;
        size_type ppos = 0;
        size_type plen = 0;
        for (pointer i = sa; i != rsa0; ++i)
        {
            const size_type p = *i, clen = sa[n0 + p / 2];
            if (clen != plen || !is_equal(s, p, ppos, plen, eq))
                ++m0;
            sa[n0 + p / 2] = m0;
            ppos = p;
            plen = clen;
        }
        if (m0 < n0)
        {
            for (pointer i = sa + n0 + n / 2, j = s0 + n0; j != s0;)
            {
                const size_type p = *--i;
                if (p != 0)
                    *--j = p - 1;
            }
        }
        return m0;
    }
    
    template <typename It, typename Eq>
    static size_type induce_and_rename_lms_substr(It s, pointer sa, pointer s0, pointer lbuk, pointer sbuk, pointer time, size_type n, size_type m, size_type n0, size_type d, Eq eq) noexcept(noexcept(s[0]))
    {
        static constexpr size_type tag = size_type(1) << (std::numeric_limits<size_type>::digits - 2);
        using value_type = typename std::iterator_traits<It>::value_type;
        if (d > 0)
        {
            const pointer l = sa + sbuk[d - 1], r = sa + lbuk[d];
            for (pointer i = l; i != r; ++i)
                *i = ~*i;
        }
        for (size_type i = d; i + 1 < m; ++i)
        {
            const size_type p = sbuk[i];
            if (p != lbuk[i + 1])
                sa[p] = ~sa[p];
        }
        lbuk_to_sbuk(lbuk, sbuk, n, m);
        const pointer rsa = sa + n;
        value_type pre = s[n - 1], cur;
        pointer induce_to = sa + lbuk[pre];
        bool inc = false;
        size_type cnt = 0;
        std::fill_n(time, m, 0);
        
#define INDUCE_ONE(BUK, INDUCIBLE, CUR, TAG, REF) \\
    {                                             \\
        size_type p = *i;                         \\
        if (p == 0)                               \\
            continue;                             \\
        const bool b = is_negative(p);            \\
        if (b)                                    \\
        {                                         \\
            ++cnt;                                \\
            p = ~p;                               \\
        }                                         \\
        if (INDUCIBLE(s, p, cur))                 \\
        {                                         \\
            if (inc)                              \\
            {                                     \\
                inc = false;                      \\
                *i = ~p;                          \\
            }                                     \\
            continue;                             \\
        }                                         \\
        --p;                                      \\
        *i = 0;                                   \\
        inc |= b;                                 \\
        if (CUR(s, p, cur) != pre)                \\
        {                                         \\
            BUK[pre] = induce_to - sa;            \\
            induce_to = sa + BUK[pre = cur];      \\
        }                                         \\
        TAG(s, p, cur);                           \\
        if (time[cur] != cnt)                     \\
        {                                         \\
            time[cur] = cnt;                      \\
            p = ~p;                               \\
        }                                         \\
        REF(induce_to) = p;                       \\
    }
#define REF_FORWARD(ptr) (*ptr++)
#define REF_BACKWARD(ptr) (*--ptr)
#define INDUCE(IS_LML, IS_LMS, CUR_L, CUR_S, TAG_LML, TAG_LMS)      \\
    {                                                               \\
        for (pointer i = sa; i != rsa; ++i)                         \\
        {                                                           \\
            INDUCE_ONE(lbuk, IS_LML, CUR_L, TAG_LML, REF_FORWARD);  \\
        }                                                           \\
        for (pointer i = rsa; i-- != sa;)                           \\
        {                                                           \\
            size_type p = *i;                                       \\
            if (is_negative(p - 1))                                 \\
                continue;                                           \\
            *i = ~p;                                                \\
            while (!is_negative(p = *--i))                          \\
            {                                                       \\
            }                                                       \\
            *i = ~p;                                                \\
        }                                                           \\
        induce_to = sa + sbuk[pre = 0];                             \\
        sbuk_to_lbuk(lbuk, sbuk, n, m);                             \\
        for (pointer i = rsa; i-- != sa;)                           \\
        {                                                           \\
            INDUCE_ONE(sbuk, IS_LMS, CUR_S, TAG_LMS, REF_BACKWARD); \\
        }                                                           \\
    }
        
        if (n < tag)
        {
            *induce_to++ = ~(s[n - 2] < pre ? n + tag - 1 : n - 1);
#define IS_LML(s, p, cur) (tag <= p)
#define IS_LMS(s, p, cur) (p < tag)
#define CUR_L(s, p, cur) (cur = s[p])
#define CUR_S(s, p, cur) (cur = s[p - tag])
#define TAG_LML(s, p, cur)  \\
    {                       \\
        if (s[p - 1] < cur) \\
            p += tag;       \\
    }
#define TAG_LMS(s, p, cur)        \\
    {                             \\
        if (s[p - tag - 1] > cur) \\
            p -= tag;             \\
    }
            INDUCE(IS_LML, IS_LMS, CUR_L, CUR_S, TAG_LML, TAG_LMS);
#undef IS_LML
#undef IS_LMS
#undef CUR_L
#undef CUR_S
#undef TAG_LML
#undef TAG_LMS
        }
        else
        {
            *induce_to++ = ~(n - 1);
#define IS_LML(s, p, cur) ((cur = s[p - 1]) < s[p])
#define IS_LMS(s, p, cur) ((cur = s[p - 1]) > s[p])
#define CUR(s, p, cur) (cur)
#define TAG(s, p, cur) \\
    {                  \\
    }
            INDUCE(IS_LML, IS_LMS, CUR, CUR, TAG, TAG);
#undef IS_LML
#undef IS_LMS
#undef CUR
#undef TAG
        }
        
#undef INDUCE_ONE
#undef REF_FORWARD
#undef REF_BACKWARD
#undef INDUCE
        
        const pointer rsa0 = sa + n0;
        pointer i0 = sa, j0 = sa;
        if (d > 0)
        {
            const value_type c = d - 1;
            assert(lbuk[c] == 0);
            i0 = sa + lbuk[d];
            for (size_type i = 0; j0 != i0; i += 2, ++j0)
            {
                while (i < n && s[i] != c)
                    ++i;
                *j0 = ~i;
            }
        }
        size_type m0 = j0 - sa;
        for (pointer i = i0, j = j0; j != rsa0; ++i)
        {
            const size_type p = *i;
            if (p == 0)
                continue;
            *i = 0;
            *j++ = p;
            m0 += is_negative(p);
        }
        if (m0 == n0)
        {
            for (pointer i = sa; i != rsa0; ++i)
                *i = ~*i;
        }
        else
        {
            size_type rk = m0 + 1;
            for (pointer i = rsa0; i-- != sa;)
            {
                size_type p = *i;
                if (is_negative(p))
                {
                    p = ~p;
                    --rk;
                }
                sa[n0 + p / 2] = rk;
            }
            for (pointer i = sa + n0 + n / 2, j = s0 + n0; j != s0;)
            {
                const size_type p = *--i;
                if (p != 0)
                    *--j = p - 1;
            }
        }
        return m0;
    }
    
    template <typename It>
    inline static void fill_lms_suffix(It s, pointer sa, const_pointer sbuk, size_type n, size_type m, size_type n0) noexcept(noexcept(s[0]))
    {
        using value_type = typename std::iterator_traits<It>::value_type;
        if (n0 == 0)
            return;
        size_type p = sa[n0 - 1];
        value_type pre, cur = s[p];
        size_type i = n0 - 1, j = n;
        do
        {
            const size_type k = sbuk[pre = cur];
            while (j > k)
                sa[--j] = 0;
            do
                sa[--j] = p;
            while (!is_negative(--i) && (cur = s[p = sa[i]]) == pre);
        } while (!is_negative(i));
        while (j > 0)
            sa[--j] = 0;
    }
    
    template <typename It>
    static void induce_suffix(It s, pointer sa, pointer lbuk, pointer sbuk, size_type n, size_type m) noexcept(noexcept(s[0]))
    {
        using value_type = typename std::iterator_traits<It>::value_type;
        const pointer rsa = sa + n;
        value_type pre = s[n - 1], cur;
        pointer induce_to = sa + lbuk[pre];
        *induce_to++ = s[n - 2] < pre ? ~n + 2 : n - 1;
        for (pointer i = sa; i != rsa; ++i)
        {
            const size_type p = *i - 1;
            if (is_negative(p))
                continue;
            if ((cur = s[p]) != pre)
            {
                lbuk[pre] = induce_to - sa;
                induce_to = sa + lbuk[pre = cur];
            }
            *induce_to++ = p > 0 && s[p - 1] < cur ? ~p + 1 : p;
        }
        induce_to = sa + sbuk[pre = 0];
        for (pointer i = rsa; i-- != sa;)
        {
            const size_type p = ~*i;
            if (is_negative(p))
                continue;
            if ((cur = s[p]) != pre)
            {
                sbuk[pre] = induce_to - sa;
                induce_to = sa + sbuk[pre = cur];
            }
            *i = p + 1;
            *--induce_to = p > 0 && s[p - 1] > cur ? p : ~p + 1;
        }
    }
    
    template <typename It, typename Eq>
    static void sais(It s, pointer sa, size_type n, size_type m, size_type r, size_type d, Buffer buf, Eq eq)
    {
        using value_type = typename std::iterator_traits<It>::value_type;
        Buffer memory[3] = {Buffer(sa + n, r), buf};
        std::unique_ptr<size_type[]> guard;
        const bool state = 2 * m <= n;
        const size_type cnt = 2 + state;
        const size_type sum = r / m + buf.len / m;
        if (sum < cnt)
        {
            const size_type len = (cnt - sum) * m;
            guard.reset(new size_type[len]);
            memory[2] = {guard.get(), len};
        }
        Buffer *ptr = memory;
        const auto alloc = [&memory, &ptr, m]
        {
            ptr = std::find_if(ptr, memory + 3, [m](Buffer e){ return m <= e.len; });
            return ptr->alloc(m);
        };
        const pointer lbuk = alloc();
        r = memory[0].len;
        const auto buf0 = *std::max_element(memory, memory + 3);
        const pointer sbuk = alloc(), time = state ? alloc() : nullptr;
        get_sbuk(s, sbuk, n, m);
        sbuk_to_lbuk(lbuk, sbuk, n, m);
        const size_type n0 = fill_lms_char(s, sa, sbuk, n, m);
        if (n0 > 0)
        {
            const size_type r0 = n + r - 2 * n0;
            const pointer sa0 = sa, s0 = sa + n0 + r0;
            size_type m0;
            if (state)
                m0 = induce_and_rename_lms_substr(s, sa, s0, lbuk, sbuk, time, n, m, n0, d, eq);
            else
            {
                induce_lms_substr(s, sa, lbuk, sbuk, n, m);
                m0 = rename(s, sa, s0, lbuk, sbuk, n, m, n0, d, eq);
            }
            if (m0 < n0)
            {
                sais(s0, sa0, n0, m0, r0, 0, buf0, std::equal_to<size_type>{});
                pointer j = sa + n + r;
                scan_lms_pos(s, n, [&j](size_type p, value_type c)
                             { *--j = p; });
                for (size_type i = 0; i < n0; ++i)
                    sa0[i] = s0[sa0[i]];
            }
        }
        lbuk_to_sbuk(lbuk, sbuk, n, m);
        fill_lms_suffix(s, sa, sbuk, n, m, n0);
        induce_suffix(s, sa, lbuk, sbuk, n, m);
    }
    
public:
    template <typename It, typename Eq = Equal>
    static void sort_suffix(It s, pointer sa, size_type n, size_type m, pointer buf = nullptr, size_type buf_len = 0, Eq eq = {})
    {
        if (n == 1)
            sa[0] = 0;
        else if (n > 1)
            sais(s, sa, n, m, 0, 0, Buffer(buf, buf_len), eq);
    }
    
    template <typename It, typename Eq = Equal>
    static void sort_suffix_with_delimiter(It s, pointer sa, size_type n, size_type m, size_type d, pointer buf = nullptr, size_type buf_len = 0, Eq eq = {})
    {
        using value_type = typename std::iterator_traits<It>::value_type;
        if (n == 1)
            sa[0] = 0;
        else if (n > 1)
        {
            const value_type c = d;
            sais(s, sa, n, m, 0, d + 1, Buffer(buf, buf_len), [&eq, c](value_type lhs, value_type rhs)
                 { return eq(lhs, rhs) && !eq(lhs, c); });
        }
    }
    
    inline static void sa_to_isa(const_pointer sa, pointer isa, size_type n) noexcept
    {
        for (size_type i = 0; i < n; ++i)
            isa[sa[i]] = i;
    }
    
    template <typename It, typename Eq = Equal>
    static void get_plcp(It s, const_pointer sa, pointer plcp, size_type n, Eq eq = {}) noexcept(noexcept(s[0]))
    {
        for (size_type j = n, i = 0; i < n; ++i)
        {
            const size_type k = sa[i];
            plcp[k] = j;
            j = k;
        }
        for (size_type l = 0, i = 0; i < n; ++i)
        {
            const size_type j = plcp[i];
            if (j == n)
            {
                plcp[i] = 0;
                continue;
            }
            if (l > 0)
                --l;
            const size_type d = n - std::max(i, j);
            while (l < d && eq(s[i + l], s[j + l]))
                ++l;
            plcp[i] = l;
        }
    }
    
    template <typename It, typename Eq = Equal>
    static void get_plcp_with_delimiter(It s, const_pointer sa, pointer plcp, size_type n, size_type d, Eq eq = {}) noexcept(noexcept(s[0]))
    {
        using value_type = typename std::iterator_traits<It>::value_type;
        const value_type c = d;
        get_plcp(s, sa, plcp, n, [&eq, c](value_type lhs, value_type rhs)
                 { return eq(lhs, rhs) && !eq(lhs, c); });
    }
    
    inline static void plcp_to_lcp(const_pointer sa, const_pointer plcp, pointer lcp, size_type n) noexcept
    {
        for (size_type i = 0; i < n; ++i)
            lcp[i] = plcp[sa[i]];
    }
    
    template <typename It>
    SuffixArray(It s, size_type n, size_type m)
    {
        sa = std::allocator<size_type>{}.allocate(3 * n);
        try
        {
            isa = sa + n;
            lcp = isa + n;
            sort_suffix(s, sa, n, m, isa, 2 * n);
            get_plcp(s, sa, isa, n);
            plcp_to_lcp(sa, isa, lcp, n);
            sa_to_isa(sa, isa, n);
        }
        catch (...)
        {
            std::allocator<size_type>{}.deallocate(sa, 3 * n);
            throw;
        }
    }
    
    template <typename S>
    SuffixArray(const S &s, size_type m) : SuffixArray(s.begin(), s.size(), m) {}
    
    ~SuffixArray() { std::allocator<size_type>{}.deallocate(sa, 3 * (isa - sa)); }
    
    inline const_pointer data() const noexcept { return sa; }
    inline const_pointer rank_data() const noexcept { return isa; }
    inline const_pointer common_prefix_data() const noexcept { return lcp; }
    inline size_type operator[](size_type k) const noexcept { return sa[k]; }
    inline size_type rank(size_type k) const noexcept { return isa[k]; }
    inline size_type common_prefix(size_type k) const noexcept { return lcp[k]; }
    
private:
    pointer sa, isa, lcp;
};

using SA32 = SuffixArray<uint32_t>;
using SA64 = SuffixArray<uint64_t>;

#endif
`;
const reg3 = `#include "poly"`;
const tog3 = `//poly
#ifndef __POLY_H__
#define __POLY_H__

#include "mo"

namespace polyall {
    const int mod = 998244353;
    const int MAXN = 1 << 21;
    typedef mo<mod> mop;
    const mop gen(3);
    const mop I(86583718);
    const mop invI(911660635);
    
    int Len, rev[MAXN];
    mop X[MAXN], Y[MAXN], Iv[MAXN];
    mop ExX[MAXN], ExY[MAXN], Op[MAXN];
    mop LnX[MAXN];
    mop g[23], iv[MAXN];
    mop H[MAXN];
    
    const mop inv2 = (mod + 1) / 2;
    
    class polypre {
        public:
            polypre() {
                for (int i = 1; i <= 21; ++ i)
                    g[i] = gen ^ ((mod - 1) >> i);
                iv[1] = 1;
                for (int i = 2; i < MAXN; ++ i)
                    iv[i] = mod - iv[mod % i] * (mod / i);
            }
    }__polypre_;
    
    inline void calrev() {
        int II = log(Len) / log(2) - 1;
        for (int i = 1; i < Len; ++ i)
            rev[i] = rev[i >> 1] >> 1 | (i & 1) << II;
    }
    
    inline void NTT(mop *F, int typ) {
        for (int i = 1; i < Len; ++ i)
            if (i < rev[i])
                swap((*(F + i)).x, (*(F + *(rev + i))).x);
        for (int i = 2, ii = 1, t = 1; i <= Len; i <<= 1, ii <<= 1, ++ t) {
            mop wn = *(g + t);
            if (typ == -1) wn = ~wn;
            for (int j = 0; j < Len; j += i) {
                mop w = 1;
                for (int k = 0; k < ii; ++ k) {
                    mop tt = *(F + j + k + ii) * w;
                    *(F + j + k + ii) = *(F + j + k) - tt;
                    *(F + j + k) += tt;
                    w *= wn;
                }
            }
        }
        if (typ == -1) {
            mop invn = Len;
            invn = ~invn;
            for (int i = 0; i < Len; ++ i)
                *(F + i) *= invn;
        }
    }
    
    //cheng fa
    inline void Mul(mop *a, mop *b, mop *c, int lenl, int lenr) {
        if((long long)lenl * lenr <= 300) {
            for (int i = 0; i <= lenl + lenr; ++ i) X[i] = 0;
            for (int i = 0; i <= lenl; ++ i)
                for (int j = 0; j <= lenr; ++ j)
                    X[i + j] += a[i] * b[j];
            for (int i = 0; i <= lenl + lenr; ++ i)
                c[i] = X[i];
            return;
        }
        for (Len = 2; Len <= lenl + lenr; Len <<= 1);
        calrev();
        for (int i = 0; i <= lenl; ++ i) X[i] = a[i];
        for (int i = 0; i <= lenr; ++ i) Y[i] = b[i];
        for (int i = lenl + 1; i < Len; ++ i) X[i] = 0;
        for (int i = lenr + 1; i < Len; ++ i) Y[i] = 0;
        NTT(X, 1), NTT(Y, 1);
        for (int i = 0; i < Len; ++ i) X[i] *= Y[i];
        NTT(X, -1);
        for (int i = 0; i <= lenl + lenr; ++ i) c[i] = X[i];
        for (int i = lenl + lenr + 1; i < Len; ++ i) c[i] = 0;
    }
    
    inline void Po2(mop *F, mop *G, int ln) {
        for (Len = 2; Len <= ln + ln; Len <<= 1);
        calrev();
        for (int i = 0; i <= ln; ++ i) X[i] = F[i];
        for (int i = ln + 1; i < Len; ++ i) X[i] = 0;
        NTT(X, 1);
        for (int i = 0; i < Len; ++ i) G[i] = X[i] * X[i];
        NTT(G, -1);
        for (int i = ln + ln + 1; i < Len; ++ i) G[i] = 0;
    }
    
    //qiu ni
    inline void Inv(mop *F, mop *G, int ln) {
        Iv[0] = ~F[0];
        for (int Ln = 2, L = 1; L <= ln; Ln <<= 1, L <<= 1) {
            for (int i = ln + 1; i < Ln; ++ i) F[i] = 0;
            for (int i = 0; i < Ln; ++ i) X[i] = F[i];
            for (int i = 0; i < L; ++ i) Y[i] = Iv[i], Y[i + L] = 0;
            Len = Ln, calrev();
            NTT(X, 1), NTT(Y, 1);
            for (int i = 0; i < Ln; ++ i)
                X[i] *= Y[i];
            NTT(X, -1);
            for (int i = 0; i < L; ++ i)
                X[i] = 0;
            NTT(X, 1);
            for (int i = 0; i < Ln; ++ i)
                X[i] *= Y[i];
            NTT(X, -1);
            for (int i = L; i < Ln; ++ i)
                Iv[i] = -X[i];
        }
        for (int i = 0; i <= ln; ++ i)
            G[i] = Iv[i];
    }
    
    //chu fa
    inline void Div(mop *F, mop *G, mop *Q, mop *R, int lenf, int leng) {
        for (int i = 0; i <= lenf; ++ i)
            ExX[i] = F[lenf - i];
        for (int i = 0; i <= leng; ++ i)
            ExY[i] = G[leng - i];
        for (int i = leng + 1; i <= lenf - leng; ++ i)
            ExY[i] = 0;
        Inv(ExY, ExY, lenf - leng);
        for (int i = lenf - leng + 1; i <= lenf; ++ i)
            ExX[i] = 0;
        for (int i = lenf - leng + 1; i <= leng; ++ i)
            ExY[i] = 0;
        Mul(ExX, ExY, ExY, lenf - leng, lenf - leng);
        for (int i = lenf - leng + 1; i <= (lenf - leng) << 1; ++ i)
            ExY[i] = 0;
        for (int i = 0; i <= (lenf - leng) >> 1; ++ i)
            swap(ExY[i].x, ExY[lenf - leng - i].x);
        Mul(ExY, G, ExX, lenf - leng, leng);
        for (int i = 0; i < leng; ++ i)
            R[i] = F[i] + mod - ExX[i];
        for (int i = 0; i <= lenf - leng; ++ i)
            Q[i] = ExY[i];
    }
    
    //kai fang
    inline void Sqrt(mop *F, mop *G, int ln) {
        Op[0] = int(sqrt(F[0].x));
        for (int Ln = 2; Ln >> 1 <= ln; Ln <<= 1) {
            Mul(Op, Op, ExX, Ln >> 1, Ln >> 1);
            for (int i = 0; i < (Ln >> 1); ++ i)
                ExX[i] = mod - ExX[i + (Ln >> 1)] + F[i + (Ln >> 1)];
            for (int i = Ln >> 1; i < Ln; ++ i)
                Op[i] = ExX[i] = 0;
            Inv(Op, ExY, Ln >> 1);
            Len = Ln;
            calrev();
            NTT(ExX, 1), NTT(ExY, 1);
            for (int i = 0; i < Ln; ++ i)
                ExX[i] *= ExY[i];
            NTT(ExX, -1);
            for (int i = 0; i < (Ln >> 1); ++ i)
                Op[i + (Ln >> 1)] = ExX[i] * inv2;
        }
        for (int i = 0; i <= ln; ++ i)
            G[i] = Op[i];
    }
    
    //qiu dao
    inline void Deriv(mop *F, mop *G, int ln) {
        for (int i = 1; i <= ln; ++ i)
            G[i - 1] = F[i] * i;
        G[ln] = 0;
    }
    
    //ji fen
    inline void Inter(mop *F, mop *G, int ln) {
        for (int i = ln; i >= 1; -- i)
            G[i] = F[i - 1] * iv[i];
        G[0] = 0;
    }
    
    inline void Ln(mop *F, mop *G, int ln) {
        Deriv(F, LnX, ln), Inv(F, G, ln);
        for (Len = 2; Len <= ln << 1; Len <<= 1);
        for (int i = ln + 1; i < Len; ++ i)
            LnX[i] = G[i] = 0;
        calrev();
        NTT(LnX, 1), NTT(G, 1);
        for (int i = 0; i < Len; ++ i)
            G[i] = G[i] * LnX[i];
        NTT(G, -1);
        Inter(G, G, ln);
    }
    
    inline void Exp(mop *F, mop *G, int ln) {
        Op[0] = 1;
        for (int Lx = 2; Lx >> 1 <= ln; Lx <<= 1) {
            for (int i = Lx >> 1; i < Lx; ++ i)
                Op[i] = 0;
            Ln(Op, ExX, Lx);
            for (int i = 0; i < Lx >> 1; ++ i)
                ExX[i] = F[i + (Lx >> 1)] + mod - ExX[i + (Lx >> 1)];
            for (int i = 0; i < Lx >> 1; ++ i)
                ExY[i] = Op[i];
            for (int i = Lx >> 1; i < Lx; ++ i)
                ExX[i] = ExY[i] = 0;
            Len = Lx;
            calrev();
            NTT(ExY, 1), NTT(ExX, 1);
            for (int i = 0; i < Len; ++ i)
                ExX[i] = ExX[i] * ExY[i];
            NTT(ExX, -1);
            for (int i = 0; i < Lx >> 1; ++ i)
                Op[i + (Len >> 1)] = ExX[i];
        }
        for (int i = 0; i <= ln; ++ i)
            G[i] = Op[i];
    }
    
    //mi ci
    inline void Pow(mop *F, mop *G, pair<int, pair<int, int>> k, int ln) {
        int pos = 0;
        for (; pos <= ln; ++ pos) if (F[pos].x) break;
        if ((long long)pos * k.second.second > ln) {
            for (int i = 0; i <= ln; ++ i)
                G[i] = 0;
            return;
        }
        mop q(F[pos].x);
        mop p = ~q;
        for (int i = pos; i <= ln; ++ i) G[i - pos] = F[i] * p;
        ln -= pos;
        Ln(G, G, ln);
        for (int i = 0; i <= ln; ++ i) G[i] *= k.first;
        Exp(G, G, ln);
        ln += pos;
        q ^= k.second.first;
        pos *= k.second.second;
        for (int i = ln; i >= pos; -- i) G[i] = G[i - pos] * q;
        for (int i = 0; i < pos; ++ i) G[i] = 0;
    }
    
    inline void Ima(mop *F, mop *G, int ln) {
        for (int i = 0; i <= ln; ++ i)
            G[i] = F[i] * I;
    }
    
    inline void Sin(mop *F, mop *G, int ln) {
        Ima(F, H, ln);
        for (int i = 0; i <= ln; ++ i) G[i] = -H[i];
        Exp(G, G, ln);
        Exp(H, H, ln);
        for (int i = 0; i <= ln; ++ i) G[i] = (H[i] - G[i]) * inv2 * invI;
    }
    
    inline void Cos(mop *F, mop *G, int ln) {
        Ima(F, H, ln);
        for (int i = 0; i <= ln; ++ i) G[i] = -H[i];
        Exp(G, G, ln);
        Exp(H, H, ln);
        for (int i = 0; i <= ln; ++ i) G[i] = (H[i] + G[i]) * inv2;
    }
    
    inline void Tan(mop *F, mop *G, int ln) {
        Ima(F, H, ln);
        for (int i = 0; i <= ln; ++ i) G[i] = -H[i];
        Exp(G, G, ln);
        Exp(H, H, ln);
        for (int i = 0; i <= ln; ++ i) H[i] += G[i], G[i] = -G[i] * 2;
        Inv(H, H, ln);
        Mul(G, H, G, ln, ln);
        ++ G[0];
        for (int i = 0; i <= ln; ++ i) G[i] *= invI;
    }
    
    inline void Arccos(mop *F, mop *G, int ln) {
        Po2(F, H, ln);
        for (int i = 0; i <= ln; ++ i)
            H[i] = -H[i];
        ++ H[0];
        for (int i = ln + 1; i < Len; ++ i)
            H[i] = 0;
        Sqrt(H, H, ln);
        Inv(H, H, ln);
        Deriv(F, G, ln);
        Mul(G, H, G, ln, ln);
        Inter(G, G, ln);
    }
    
    inline void Arcsin(mop *F, mop *G, int ln) {
        Arccos(F, G, ln);
        for (int i = 0; i <= ln; ++ i)
            G[i] = -G[i];
    }
    
    inline void Arctan(mop *F, mop *G, int ln) {
        Po2(F, H, ln);
        ++ H[0];
        Inv(H, H, ln);
        Deriv(F, G, ln);
        Mul(G, H, G, ln, ln);
        Inter(G, G, ln);
    }
    
    inline void FOT(mop *F, int typ) {
        if (typ == 1)
            for (int i = 2, ii = 1; i <= Len; i <<= 1, ii <<= 1)
                for (int j = 0; j < Len; j += i)
                    for (int k = 0; k < ii; ++ k)
                        F[j + k + ii] += F[j + k];
        else
            for (int i = 2, ii = 1; i <= Len; i <<= 1, ii <<= 1)
                for (int j = 0; j < Len; j += i)
                    for (int k = 0; k < ii; ++ k)
                        F[j + k + ii] -= F[j + k];
    }
    
    inline void FAT(mop *F, int typ) {
        if (typ == 1)
            for (int i = 2, ii = 1; i <= Len; i <<= 1, ii <<= 1)
                for (int j = 0; j < Len; j += i)
                    for (int k = 0; k < ii; ++ k)
                        F[j + k] += F[j + k + ii];
        else
            for (int i = 2, ii = 1; i <= Len; i <<= 1, ii <<= 1)
                for (int j = 0; j < Len; j += i)
                    for (int k = 0; k < ii; ++ k)
                        F[j + k] -= F[j + k + ii];
    }
    
    inline void FXT(mop *F, int typ) {
        if (typ == 1)
            for (int i = 2, ii = 1; i <= Len; i <<= 1, ii <<= 1)
                for (int j = 0; j < Len; j += i)
                    for (int k = 0; k < ii; ++ k)
                        F[j + k] += F[j + k + ii],
                        F[j + k + ii] = F[j + k] - F[j + k + ii] - F[j + k + ii];
        else
            for (int i = 2, ii = 1; i <= Len; i <<= 1, ii <<= 1)
                for (int j = 0; j < Len; j += i)
                    for (int k = 0; k < ii; ++ k)
                        F[j + k] += F[j + k + ii],
                        F[j + k] *= inv2,
                        F[j + k + ii] = F[j + k] - F[j + k + ii];
    }
    
    template<typename _Cmp>
    inline void Muw(mop *a, mop *b, mop *c, int lenl, int lenr, _Cmp FWT) {
        for (Len = 2; Len <= lenl; Len <<= 1);
        for (; Len <= lenr; Len <<= 1);
        for (int i = 0; i <= lenl; ++ i) X[i] = a[i];
        for (int i = 0; i <= lenr; ++ i) Y[i] = b[i];
        for (int i = lenl + 1; i < Len; ++ i) X[i] = 0;
        for (int i = lenr + 1; i < Len; ++ i) Y[i] = 0;
        FWT(X, 1), FWT(Y, 1);
        for (int i = 0; i < Len; ++ i) X[i] *= Y[i];
        FWT(X, -1);
        for (int i = 0; i < Len; ++ i) c[i] = X[i];
        //for (int i = lenl + lenr + 1; i < Len; ++ i) c[i] = 0;
    }
}

#define ply(x) polyall::x
#define usply(...) \\
using ply(mop), ply(MAXN) __VA_OPT__(, EXPAND5(usply_(__VA_ARGS__)))
#define usply_(a,...) ply(a) __VA_OPT__(, _usply_ PARENS (__VA_ARGS__))
#define _usply_() usply_
#define poly(a, ...) \\
mop a[MAXN]  __VA_OPT__(, EXPAND5(poly_(__VA_ARGS__)))
#define poly_(a,...) a[MAXN] __VA_OPT__(, _poly_ PARENS (__VA_ARGS__))
#define _poly_() poly_
#endif
`;
const reg4 = `#include "pre"`;
const tog4 = `#ifndef __wht_pre_
#define __wht_pre_

#include <bits/stdc++.h>

using namespace std;

#ifdef ONLINE_JUDGE
#define __subit_
#undef __filed_
#endif

#include "IO"

#define frer(x) freopen(x, "r", stdin) 
#define frew(x) freopen(x, "w", stdout) 
#ifdef __filed_
#define frei(x) frer(x ".in")
#define freo(x) frew(x ".out")
#define frea(x) frew(x ".ans")
#define fre(x) frei(x), freo(x)
#else
#define frei(x) void()
#define freo(x) void()
#define frea(x) void()
#define fre(x) void()
#endif

#ifdef __subit_
#define erd(...) void()
#define ewr(...) void()
#else
#define erd(...) rd(__VA_ARGS__)
#define ewr(...) wr(__VA_ARGS__)
#endif

int Turn;
#ifndef __moret_
#define rdT() Turn = 1
#else
#define rdT() rd(Turn)
#endif
using IO::rd;
using IO::wr;

#define EXPAND5(...) EXPAND4(EXPAND4(EXPAND4(EXPAND4(__VA_ARGS__))))
#define EXPAND4(...) EXPAND3(EXPAND3(EXPAND3(EXPAND3(__VA_ARGS__))))
#define EXPAND3(...) EXPAND2(EXPAND2(EXPAND2(EXPAND2(__VA_ARGS__))))
#define EXPAND2(...) EXPAND1(EXPAND1(EXPAND1(EXPAND1(__VA_ARGS__))))
#define EXPAND1(...) __VA_ARGS__
#define PARENS ()

#endif
`;
const reg5 = `#include "mo"`;
const tog5 = `//mo
#ifndef __w_mo_
#define __w_mo_

#ifndef __nonem_
template<int M>
#endif
class mo {
public:
    int x;
    
    mo(int X = 0) {
        while (X >= M) X -= M;
        while (X < 0) X += M;
        x = X;
    }
    
    mo(long long X) {
        x = X % M;
        if (x < 0) x += M;
    }
    
    mo(unsigned long long X) {
        x = X % M;
    }
    
    mo(const mo &o) : x(o.x) { }
    
    mo(mo &&o) : x(o.x) { }
    
    mo& operator = (int &&y) {
        return *this = mo(y);
    }
    
    mo& operator = (const int &y) {
        return *this = mo(y);
    }
    
    mo& operator = (mo &&y) {
        x = y.x;
        return *this;
    }
    
    mo& operator = (const mo &y) {
        x = y.x;
        return *this;
    }
    
    mo& operator ++ () {
        ++ x == M && (x = 0, 1);
        return *this;
    }
    
    mo& operator -- () {
        -- x == -1 && (x = M - 1);
        return *this;
    }
    
    mo operator + (int &&y) const {
        return x + y;
    }
    
    mo operator + (const int &y) const {
        return x + y;
    }
    
    mo& operator += (int &&y) {
        ((x += y) >= M) && (x -= M);
        return *this;
    }
    
    mo& operator += (const int &y) {
        ((x += y) >= M) && (x -= M);
        return *this;
    }
    
    mo operator + (mo &&y) const {
        return x + y.x;
    }
    
    mo operator + (const mo &y) const {
        return x + y.x;
    }
    
    mo& operator += (mo &&y) {
        ((x += y.x) >= M) && (x -= M);
        return *this;
    }
    
    mo& operator += (const mo &y) {
        ((x += y.x) >= M) && (x -= M);
        return *this;
    }
    
    friend inline mo operator + (const int &y, mo &&x) {
        return x.x + y;
    }
    
    friend inline mo operator + (const int &y, const mo &x) {
        return x.x + y;
    }
    
    mo operator - (int &&y) const {
        return x - y;
    }
    
    mo operator - (const int &y) const {
        return x - y;
    }
    
    mo& operator -= (int &&y) {
        ((x -= y) < 0) && (x += M);
        return *this;
    }
    
    mo& operator -= (const int &y) {
        ((x -= y) < 0) && (x += M);
        return *this;
    }
    
    mo operator - (mo &&y) const {
        return x - y.x;
    }
    
    mo operator - (const mo &y) const {
        return x - y.x;
    }
    
    mo& operator -= (mo &&y) {
        ((x -= y.x) < 0) && (x += M);
        return *this;
    }
    
    mo& operator -= (const mo &y) {
        ((x -= y.x) < 0) && (x += M);
        return *this;
    }
    
    friend inline mo operator - (const int x, mo &&y) {
        return x - y.x;
    }
    
    friend inline mo operator - (const int x, const mo &y) {
        return x - y.x;
    }
    
    mo operator * (int &&y) const {
        return (long long)x * y;
    }
    
    mo operator * (const int &y) const {
        return (long long)x * y;
    }
    
    mo& operator *= (int &&y) {
        x = (long long)x * y % M;
        return *this;
    }
    
    mo& operator *= (const int &y) {
        x = (long long)x * y % M;
        return *this;
    }
    
    mo operator * (mo &&y) const {
        return (long long)x * y.x;
    }
    
    mo operator * (const mo &y) const {
        return (long long)x * y.x;
    }
    
    mo& operator *= (mo &&y) {
        x = (long long)x * y.x % M;
        return *this;
    }
    
    mo& operator *= (const mo &y) {
        x = (long long)x * y.x % M;
        return *this;
    }
    
    friend inline mo operator * (const int &y, mo &&x) {
        return (long long)x.x * y;
    }
    
    friend inline mo operator * (const int &y, const mo &x) {
        return (long long)x.x * y;
    }
    
    mo operator ^ (int b) const {
        mo a = x;
        mo res = 1;
        for (; b; b >>= 1, a *= a) if (b & 1) res *= a;
        return res;
    }
    
    mo& operator ^= (int b) {
        mo a = x;
        x = 1;
        for (; b; b >>= 1, a *= a) if (b & 1) *this *= a;
        return *this;
    }
    
    mo operator ~ () const {
        return *this ^ (M - 2);
    }
    
    mo operator / (int &&y) const {
        return *this * ~mo(y);
    }
    
    mo operator / (const int &y) const {
        return *this * ~mo(y);
    }
    
    mo& operator /= (int &&y) {
        return *this *= ~mo(y);
    }
    
    mo& operator /= (const int &y) {
        return *this *= ~mo(y);
    }
    
    mo operator / (mo &&y) const {
        return *this * ~y;
    }
    
    mo operator / (const mo &y) const {
        return *this * ~y;
    }
    
    mo& operator /= (mo &&y) {
        return *this *= ~y;
    }
    
    mo& operator /= (const mo &y) {
        return *this *= ~y;
    }
    
    mo operator - () const {
        return -x;
    }
    
    mo& operator + () {
        x != 0 && (x = -x + M);
        return *this;
    }
};

#ifndef __nonem_
typedef mo<998244353> mio;
inline mio operator ""_mio (unsigned long long C) {
    return mio(C);
}
#else
typedef mo mio;
#endif

namespace IO {
#ifndef __nonem_
    template<int M>
    inline void rd(mo<M> &a)
#else
    inline void rd(mo &a)
#endif
    {
        int x;
        rd(x);
        a = x;
    }
    
#ifndef __nonem_
    template<int M>
    inline void wr(mo<M> a)
#else
    inline void wr(mo a)
#endif
    {
        wr(a.x);
    }
}
using IO::rd;
using IO::wr;
#endif
`;
const reg6 = `#include "IO"`;
const tog6 = `#ifndef __w_IO__
#define __w_IO__

namespace IO {
    #ifdef __fasIO_
    const int maxn = 1 << 20;
    char in[maxn + 1], out[maxn], *p1 = in, *p2 = in, *p3 = out;
    #define getchar() (p1 == p2 && (p2 = (p1 = in) + fread(in + 1, 1, maxn, stdin), p1 == p2) ? EOF : *( ++ p1))
    #define flush() (fwrite(out + 1, 1, p3 - out, stdout))
    #define putchar(x) (p3 == out + maxn && (flush() , p3 = out), *( ++ p3) = x)
    class Flush{public: ~Flush(){flush();}}_;
    #endif
    #define isdigit(x) ('0' <= x && x <= '9')
    
    inline void rd(char *x) {
        do *x = getchar();
        while (*x <= 32 || *x == 127);
        while (*x  > 32 && *x != 127)
            * ++ x = getchar();
        *x = 0;
    }
    
    template<typename _Tp>
    inline void rd(_Tp &x) {
        x = 0;
        bool fl(false);
        char ch;
        do ch = getchar(), fl |= ch == '-'; while (!isdigit(ch));
        do x = x * 10 + (ch ^ 48), ch = getchar(); while (isdigit(ch));
        if (fl) x = -x;
    }
    
    template<>
    inline void rd(char &x) {
        do x = getchar();
        while (x <= 32 || x == 127);
    }
    
    template<>
    inline void rd(std::string &x) {
        char c;
        x.clear();
        do c = getchar();
        while (c <= 32 || c == 127);
        while (c  > 32 && c != 127)
            x.push_back(c), c = getchar();
    }
    
    template<typename _Tp>
    inline void wr(_Tp x) {
        x < 0 ? x = -x, putchar('-') : 0;
        static short st[50], top(0);
        do st[ ++ top] = x % 10, x /= 10; while (x);
        while (top) putchar(st[top -- ] | 48);
    }
    
    template<>
    inline void wr(char c) {
        putchar(c);
    }
    
    template<>
    inline void wr(char* s) {
        while (*s)
            putchar(*s ++ );
    }
    
    template<>
    inline void wr(const char* s) {
        while (*s)
            putchar(*s ++ );
    }
    
    template<typename _Tp, typename ...Args>
    void rd(_Tp &&x, Args &&...args) {
        rd(x); rd(args...);
    }
    
    template<typename _Tp, typename ...Args>
    void wr(_Tp x, Args ...args) {
        wr(x); wr(args...);
    }
    
    #undef isdigit
}
//using namespace IO::us;

#endif
`;

/*
const reg1 = `#include "Geo"`;
const tog1 = ``;
const reg2 = `#include "SA"`;
const tog2 = ``;
const reg3 = `#include "poly"`;
const tog3 = ``;
const reg4 = `#include "pre"`;
const tog4 = ``;
const reg5 = `#include "mo"`;
const tog5 = ``;
const reg6 = `#include "IO"`;
const tog6 = ``;
*/
    document.addEventListener('paste', function(e)
    {
        checkScriptVersion();
        text = e.clipboardData.getData('text');
        text = text.replace(reg1, tog1);
		text = text.replace(reg2, tog2);
		text = text.replace(reg3, tog3);
		text = text.replace(reg4, tog4);
		text = text.replace(reg5, tog5);
		text = text.replace(reg6, tog6);
        GM.setClipboard(text, 'text');
    },false);
// 开始
    checkScriptVersion();
})();