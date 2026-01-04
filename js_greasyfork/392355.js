// ==UserScript==
// @name         adhoc2_user
// @namespace    http://webui.adhoc2.ops.ctripcorp.com
// @description  adhoc2_account_change
// @version      0.0.3
// @author       rtsun
// @match        http://webui.adhoc2.ops.ctripcorp.com/*
// @match        https://webui.adhoc2.ops.ctripcorp.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/392355/adhoc2_user.user.js
// @updateURL https://update.greasyfork.org/scripts/392355/adhoc2_user.meta.js
// ==/UserScript==



var changed = 0; // script need to be edited with

window.addEventListener('beforescriptexecute', function(e) {

    ///for external script:
  
	src = e.target.src;
	if (src.search(/static\/js\/main\..+\.chunk\.js/) != -1) {
    changed++;
		e.preventDefault();
		e.stopPropagation();
		append(NewScript1);
    appendjsfile();
	};

    ///for inline script:
       // if(e.target===document.getElementsByTagName("script")[0]){
       //     changed++;
       //     e.stopPropagation();
       //     e.preventDefault();
       //     //todo
       // }
        //tips: you could also run a regex search for the e.target.innerHTML
        //if the position of the inline script is not fixed.


    ///when done, remove the listener:
	if(changed == 2) window.removeEventListener(e.type, arguments.callee, true);

}, true);




////// append with new block function:
function append(s) {	 
      document.head.appendChild(document.createElement('script'))
             .innerHTML = s.toString().replace(/^function.*{|}$/g, '');
}

////////////////////////////////////////////////
function NewScript1(){
    /* insert new block here, like:  */

  

alert('account changed');
(window.webpackJsonp = window.webpackJsonp || []).push([
    [0], { 160: function(e, t, a) {}, 303: function(e, t, a) { e.exports = a.p + "static/media/logo.6bc5a3c2.svg" }, 332: function(e, t, a) { e.exports = a.p + "static/media/eye.f5d75e40.svg" }, 333: function(e, t, a) { e.exports = a.p + "static/media/download2.1e75fc61.svg" }, 334: function(e, t, a) { e.exports = a.p + "static/media/copy.5d95cac1.svg" }, 335: function(e, t, a) { e.exports = a.p + "static/media/copyHead.c58b123c.svg" }, 343: function(e, t, a) { e.exports = a.p + "static/media/drag2.f331f066.svg" }, 376: function(e, t, a) { e.exports = a(606) }, 381: function(e, t, a) {}, 606: function(e, t, a) { "use strict";
            a.r(t); var n = a(0),
                r = a.n(n),
                c = a(24),
                o = a.n(c),
                l = (a(381), a(172)),
                i = a(103),
                s = a(687),
                u = a(607),
                d = a(654),
                f = a(3),
                b = Object(u.a)(function(e) { return Object(s.a)({ root: {} }) }),
                p = function(e) { var t = b(e),
                        a = e.className,
                        n = e.children,
                        c = Object(f.a)(t.root, a); return r.a.createElement("div", { className: c }, n) },
                m = a(653),
                E = function(e) { var t = Object(n.useCallback)(function(e) { return r.a.createElement(l.b, e) }, []); return r.a.createElement(m.a, Object.assign({ component: t }, e)) },
                g = a(303),
                O = a.n(g),
                h = Object(u.a)(function(e) { return Object(s.a)({ root: { display: "flex", verticalAlign: "middle", color: "white" }, logo: { height: "36px" }, title: { whiteSpace: "nowrap", display: "flex", alignItems: "center", fontSize: "16px", fontWeight: 600, color: "#333333" } }) }),
                v = function(e) { var t = h(e),
                        a = e.className,
                        n = Object(f.a)(t.root, a); return r.a.createElement(E, { underline: "none", to: "/", target: "_blank" }, r.a.createElement("div", { className: n }, r.a.createElement("img", { className: t.logo, src: O.a, alt: "" }))) },
                x = a(2),
                S = a(6),
                j = a(615),
                y = a(657),
                C = a(40),
                T = a.n(C),
                _ = a(16),
                k = a(309),
                I = a.n(k),
                N = a(608),
                A = a(656),
                w = a(609),
                R = a(658),
                L = a(195),
                D = a(14),
                G = a(310),
                F = a.n(G),
                P = function() {}; var U = function(e, t) { var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "_",
                        n = Object.prototype.toString.call(t).match(/\[object (.*)\]/); if ("string" === typeof t) return "".concat(e).concat(a).concat(t); if (!n) return !1; if (n[1] && "object" === n[1].toLocaleLowerCase()) { var r = {}; for (var c in t) r[c] = "".concat(e).concat(a).concat(t[c]); return r } },
                B = { GET_ROLE_BIND_HOST: "GET_ROLE_BIND_HOST", GET_ROLE_BIND_HOST_SUCCESS: "GET_ROLE_BIND_HOST_SUCCESS", GET_ROLE_BIND_HOST_FAILD: "GET_ROLE_BIND_HOST_FAILD", GET_NAME: "GET_NAME", GET_NAME_SUCCESS: "GET_NAME_SUCCESS", GET_NAME_FAILD: "GET_NAME_FAILD", GET_AVATAR: "GET_AVATAR", GET_AVATAR_SUCCESS: "GET_AVATAR_SUCCESS", GET_AVATAR_FAILD: "GET_AVATAR_FAILD", GET_JURISDICTION: "GET_JURISDICTION", GET_AVATAR_JURISDICTION: "GET_AVATAR_JURISDICTION", GET_ENGINE_ROLE: "GET_ENGINE_ROLE", GET_ENGINE_ROLE_SUCCESS: "GET_ENGINE_ROLE_SUCCESS", GET_ENGINE_ROLE_FAILD: "GET_ENGINE_ROLE_FAILD", CHANGE_ENGINE: "CHANGE_ENGINE", CHANGE_ROLE: "CHANGE_ROLE", CHANGE_ACCOUNT_TYPE: "CHANGE_ACCOUNT_TYPE", GET_PERSON_RIGHT: "GET_PERSON_RIGHT", GET_PERSON_RIGHT_SUCCESS: "GET_PERSON_RIGHT_SUCCESS", GET_PERSON_RIGHT_FAILD: "GET_PERSON_RIGHT_FAILD", GET_PERSON_ENGINE_SUCCESS: "GET_PERSON_ENGINE_SUCCESS", GET_HIVE_ACCOUNT: "GET_HIVE_ACCOUNT", GET_HIVE_ACCOUNT_SUCCESS: "GET_HIVE_ACCOUNT_SUCCESS", GET_HIVE_ACCOUNT_FAILD: "GET_HIVE_ACCOUNT_FAILD", GET_APPLY_URL: "GET_APPLY_URL", GET_APPLY_URL_SUCCESS: "GET_APPLY_URL_SUCCESS", GET_APPLY_URL_FAILD: "GET_APPLY_URL_FAILD", LOGOUT: "LOGOUT" };
            B = U("USER", B, "/"); var H = { GET_HISTORY: "GET_HISTORY", GET_HISTORY_SUCCESS: "GET_HISTORY_SUCCESS", GET_HISTORY_FAILD: "GET_HISTORY_FAILD", SORT_LIST: "SORT_LIST", CHANGE_KEYWORD: "CHANGE_KEYWORD", GET_LOG: "GET_LOG", GET_LOG_SUCCESS: "GET_LOG_SUCCESS", GET_LOG_FAILD: "GET_LOG_FAILD", CHANGE_LOADING: "CHANGE_LOADING" };
            H = U("HISTORY", H, "/"); var q = { SUBMIT: "SUBMIT", SUBMIT_SUCCESS: "SUBMIT_SUCCESS", SUBMIT_FAILD: "SUBMIT_FAILD", RESULT: "RESULT", RESULT_SUCCESS: "RESULT_SUCCESS", RESULT_FAILD: "CHECK_FAILD", ADD_QUERY: "ADD_QUERY", CHANGE_TAB: "CHANGE_TAB", CHANGE_TASK_TAB: "CHANGE_TASK_TAB", CHANGE_QUERY: "CHANGE_QUERY", FORMAT_QUERY: "FORMAT_QUERY", FORMAT_QUERY_SUCCESS: "FORMAT_QUERY_SUCCESS", FORMAT_QUERY_FAILD: "FORMAT_QUERY_FAILD", EXECUTE_QUERY: "EXECUTE_QUERY", EXECUTE_QUERY_SUCCESS: "EXECUTE_QUERY_SUCCESS", EXECUTE_QUERY_FAILD: "EXECUTE_QUERY_FAILD", FAVORITE_QUERY: "FAVORITE_QUERY", FAVORITE_QUERY_SUCCESS: "FAVORITE_QUERY_SUCCESS", FAVORITE_QUERY_FAILD: "FAVORITE_QUERY_FAILD", DELETE_QUERY: "DELETE_QUERY", UPDATE_QUERY: "UPDATE_QUERY", UPDATE_QUERY_SUCCESS: "UPDATE_QUERY_SUCCESS", UPDATE_QUERY_FAILD: "UPDATE_QUERY_FAILD", SAVE_QUERY: "SAVE_QUERY", SAVE_QUERY_SUCCESS: "SAVE_QUERY_SUCCESS", SAVE_QUERY_FAILD: "SAVE_QUERY_FAILD", GET_EXECUTE_RESULT_SUCCESS: "GET_EXECUTE_RESULT_SUCCESS", GET_EXECUTE_RESULT_FAILED: "GET_EXECUTE_RESULT_FAILED", STOP_QUERY: "STOP_QUERY", STOP_QUERY_SUCCESS: "STOP_QUERY_SUCCESS", STOP_QUERY_FAILD: "STOP_QUERY_FAILD", CLEAR_TASK_TAB: "CLEAR_TASK_TAB", STOP_ALL_QUERY: "STOP_ALL_QUERY", STOP_ALL_QUERY_SUCCESS: "STOP_ALL_QUERY__SUCCESS", STOP_ALL_QUERY_FAILD: "STOP_ALL_QUERY_FAILD", SWITCH_DETAIL: "SWITCH_DETAIL", CHANGE_RESULT_KEYWORD: "CHANGE_RESULT_KEYWORD", APPEND_SQL: "APPEND_SQL", GET_ONE_FILE: "GET_ONE_FILE", GET_ONE_FILE_SUCCESS: "GET_ONE_FILE__SUCCESS", GET_ONE_FILE_FAILD: "GET_ONE_FILE_FAILD", CHANGE_SELECTED_SQl: "CHANGE_SELECTED_SQl", SORT_LIST_RESULT: "SORT_LIST_RESULT", STORE_ISCHECKED: "STORE_ISCHECKED", RESET_ISCHECKED: "RESET_ISCHECKED", SET_CURSOR: "SET_CURSOR", INSERT_SQL: "INSERT_SQL", CHANGE_ISSAVED: "CHANGE_ISSAVED", CHANGE_COLUMNNAMES: "CHANGE_COLUMNNAMES", CHANGE_PAGE: "CHANGE_PAGE", CHANGE_ROWS_PER_PAGE: "CHANGE_ROWS_PER_PAGE", RENAME_QUERY: "RENAME_QUERY" };
            q = U("MAIN", q, "/"); var M = { CHANGE_DATA_SOURCE: "GET_DATASOURCE", GET_DATA_BASES: "GET_DATA_BASES", GET_DATA_BASES_SUCCESS: "GET_DATA_BASES_SUCCESS", GET_DATA_BASES_FAILD: "GET_DATA_BASES_FAILD", GET_TABLES: "GET_TABLES", GET_TABLES_SUCCESS: "GET_TABLES_SUCCESS", GET_TABLES_FAILD: "GET_TABLES_FAILD", GET_FAVORITE_TABLES: "GET_FAVORITE_TABLES", GET_FAVORITE_TABLES_SUCCESS: "GET_FAVORITE_TABLES_SUCCESS", GET_FAVORITE_TABLES_FAILD: "GET_FAVORITE_TABLES_FAILD", GET_FAVORITE_DATA_BASES: "GET_FAVORITE_DATA_BASES", GET_FAVORITE_DATA_BASES_SUCCESS: "GET_FAVORITE_DATA_BASES_SUCCESS", GET_FAVORITE_DATA_BASES_FAILD: "GET_FAVORITE_DATA_BASES_FAILD", GET_COLUMNS: "GET_COLUMNS", GET_COLUMNS_SUCCESS: "GET_COLUMNS_SUCCESS", GET_COLUMNS_FAILD: "GET_COLUMNS_FAILD", CHANGE_ELEMENT_DATA: "CHANGE_ELEMENT_DATA", CHANGE_SELECTED_TREE_NODE: "CHANGE_SELECTED_TREE_NODE", GET_SAVE_SQLS: "GET_SAVE_SQLS", GET_SAVE_SQLS_SUCCESS: "GET_SAVE_SQLS_SUCCESS", GET_SAVE_SQLS_FAILD: "GET_SAVE_SQLS_FAILD", DELETE_SAVE_SQLS: "DELETE_SAVE_SQLS", MOVE_SAVE_SQLS: "MOVE_SAVE_SQLS", DELETE_SAVE_SQLS_SUCCESS: "DELETE_SAVE_SQLS_SUCCESS", DELETE_SAVE_SQLS_FAILD: "DELETE_SAVE_SQLS_FAILD", RENAME_SAVE_SQL: "RENAME_SAVE_SQL", RENAME_SAVE_SQL_SUCCESS: "RENAME_SAVE_SQL_SUCCESS", RENAME_SAVE_SQL_FAILD: "RENAME_SAVE_SQL_FAILD", NEW_SAVE_FOLDER: "NEW_SAVE_FOLDER", NEW_SAVE_FOLDER_SUCCESS: "NEW_SAVE_FOLDER_SUCCESS", NEW_SAVE_FOLDER_FAILD: "NEW_SAVE_FOLDER_FAILD", CHANGE_RELATE_SHOW: "CHANGE_RELATE_SHOW", GET_COLLEAGUES: "GET_COLLEAGUES", GET_COLLEAGUES_SUCCESS: "GET_COLLEAGUES_SUCCESS", GET_COLLEAGUES_FAILD: "GET_COLLEAGUES_FAILD", CHANGE_PARTITION_TAB: "CHANGE_PARTITION_TAB", GET_PARTITION: "GET_PARTITION", GET_PARTITION_SUCCESS: "GET_PARTITION_SUCCESS", GET_PARTITION_FAILD: "GET_PARTITION_FAILD", GET_PREVIEW: "GET_PREVIEW", GET_PREVIEW_SUCCESS: "GET_PREVIEW_SUCCESS", GET_PREVIEW_FAILD: "GET_PREVIEW_FAILD", CHANGE_DATA_TAB: "CHANGE_DATA_TAB", SET_ELEMENT_LOADING: "SET_ELEMENT_LOADING", SET_TABLE_SAVA_LOADING: "SET_TABLE_SAVA_LOADING", ADD_TABLE_INFO: "ADD_TABLE_INFO", DELET_TABLE_INFO: "DELET_TABLE_INFO", CHANGE_TABLE_INFO_TAB: "CHANGE_TABLE_INFO_TAB", CLOSE_ALL_TABLE_INFO_TAB: "CLOSE_ALL_TABLE_INFO_TAB", SORT_PARTITION_LIST: "SORT_PARTITION_LIST", SORT_PREVIEW_LIST: "SORT_PREVIEW_LIST", MINIMIZE_INFO: "MINIMIZE_INFO", EXPAND_INFO: "EXPAND_INFO", TOGGLE_INFO: "TOGGLE_INFO", CHANGE_PARTITION_KEY: "CHANGE_PARTITION_KEY", CHANGE_PREVIEW_KEY: "CHANGE_PREVIEW_KEY" };
            M = U("DATA", M, "/"); var Q = function() { return { type: B.GET_ROLE_BIND_HOST } },
                V = function() { return { type: B.GET_AVATAR } },
                z = function() { return { type: B.GET_ENGINE_ROLE } },
                Y = function(e) { return { type: B.CHANGE_ENGINE, v: e } },
                W = function(e) { return { type: B.CHANGE_ROLE, v: e } },
                K = function(e) { return { type: B.CHANGE_ACCOUNT_TYPE, v: e } },
                X = function(e) { return { type: B.GET_PERSON_RIGHT, flag: e } },
                J = function() { return { type: B.GET_NAME } },
                $ = function(e, t) { return { type: B.GET_HIVE_ACCOUNT, source: e, engine: t } },
                Z = function() { return { type: B.GET_APPLY_URL } },
                ee = function() { return { type: B.GET_JURISDICTION } },
                te = function(e) { return { type: H.GET_HISTORY, day: e } },
                ae = function(e, t) { return { type: H.SORT_LIST, order: e, orderBy: t } },
                ne = function(e) { return { type: H.CHANGE_KEYWORD, value: e } },
                re = function(e) { return { type: H.GET_LOG, value: e } },
                ce = function(e) { return { type: H.CHANGE_LOADING, v: e } },
                oe = function(e) { return { type: M.CHANGE_DATA_SOURCE, v: e } },
                le = function(e) { return { type: M.GET_DATA_BASES, datasource: e } },
                ie = function(e) { return { type: M.CHANGE_SELECTED_TREE_NODE, data: e } },
                se = function(e) { return { type: M.GET_FAVORITE_DATA_BASES, datasource: e } },
                ue = function() { return { type: M.GET_SAVE_SQLS } },
                de = function(e, t) { return { type: M.DELETE_SAVE_SQLS, id: e, dragFlag: t } },
                fe = function(e) { return { type: M.RENAME_SAVE_SQL, data: e } },
                be = function(e) { return { type: M.NEW_SAVE_FOLDER, data: e } },
                pe = function() { return { type: M.CHANGE_RELATE_SHOW } },
                me = function() { return { type: M.GET_COLLEAGUES } },
                Ee = function(e) { return { type: M.GET_PARTITION, data: e } },
                ge = function(e) { return { type: M.GET_PREVIEW, data: e } },
                Oe = function(e) { return { type: M.CHANGE_DATA_TAB, v: e } },
                he = function(e) { return { type: M.SET_ELEMENT_LOADING, v: e } },
                ve = function(e) { return { type: M.SET_TABLE_SAVA_LOADING, v: e } },
                xe = function(e) { return { type: M.ADD_TABLE_INFO, data: e } },
                Se = function(e) { return { type: M.DELET_TABLE_INFO, index: e } },
                je = function(e) { return { type: M.CHANGE_TABLE_INFO_TAB, index: e } },
                ye = function(e) { return { type: M.CLOSE_ALL_TABLE_INFO_TAB, index: e } },
                Ce = function(e, t) { return { type: M.SORT_PARTITION_LIST, order: e, orderBy: t } },
                Te = function(e, t) { return { type: M.SORT_PREVIEW_LIST, order: e, orderBy: t } },
                _e = function() { return { type: M.TOGGLE_INFO } },
                ke = function(e) { return { type: M.CHANGE_PARTITION_KEY, v: e } },
                Ie = function(e) { return { type: M.CHANGE_PREVIEW_KEY, v: e } },
                Ne = function(e) { return { type: M.CHANGE_PARTITION_TAB, activeTab: e } },
                Ae = function(e, t, a, n) { return { type: M.MOVE_SAVE_SQLS, sourceId: e, targetParentId: t, flieType: a, action: n } },
                we = function() { return { type: q.ADD_QUERY } },
                Re = function(e) { return { type: q.CHANGE_TAB, v: e } },
                Le = function(e, t) { return { type: q.CHANGE_QUERY, v: e, flag: t } },
                De = function(e, t, a) { return { type: q.FORMAT_QUERY, v: e, range: t, lines: a } },
                Ge = function(e, t, a, n) { return { type: q.EXECUTE_QUERY, v: e, tabId: t, uuid: a, executeTime: n } },
                Fe = function(e) { return { type: q.DELETE_QUERY, deleteIndex: e } },
                Pe = function(e) { return { type: q.SAVE_QUERY, data: e } },
                Ue = function(e) { return { type: q.STOP_QUERY, v: e } },
                Be = function(e) { return { type: q.CHANGE_TASK_TAB, v: e } },
                He = function(e) { return { type: q.CLEAR_TASK_TAB, index: e } },
                qe = function(e) { return { type: q.STOP_ALL_QUERY, data: e } },
                Me = function(e) { return { type: q.SWITCH_DETAIL, v: e } },
                Qe = function(e) { return { type: q.CHANGE_RESULT_KEYWORD, v: e } },
                Ve = function(e) { return { type: q.APPEND_SQL, data: e } },
                ze = function(e) { return { type: q.GET_ONE_FILE, v: e } },
                Ye = function(e) { return { type: q.CHANGE_SELECTED_SQl, v: e } },
                We = function(e, t) { return { type: q.SORT_LIST_RESULT, order: e, orderBy: t } },
                Ke = function(e) { return { type: q.STORE_ISCHECKED, index: e } },
                Xe = function(e) { return { type: q.RESET_ISCHECKED, isChecked: e } },
                Je = function(e, t) { return { type: q.SET_CURSOR, position: e, cursor: t } },
                $e = function(e) { return { type: q.INSERT_SQL, data: e } },
                Ze = function(e) { return { type: q.CHANGE_ISSAVED, data: e } },
                et = function(e) { return { type: q.CHANGE_COLUMNNAMES, v: e } },
                tt = function(e) { return { type: q.CHANGE_PAGE, page: e } },
                at = function(e) { return { type: q.CHANGE_ROWS_PER_PAGE, rowsPage: e } },
                nt = function(e, t, a) { return { type: q.RENAME_QUERY, name: e, index: t, renameType: a } },
                rt = a(308),
                ct = a.n(rt),
                ot = a(655),
                lt = a(81),
                it = a.n(lt),
                st = function(e) { for (var t = e + "=", a = document.cookie.split(";"), n = 0; n < a.length; n++) { var r = a[n].trim(); if (0 === r.indexOf(t)) return r.substring(t.length, r.length) } return "" };

            function ut(e) { document.cookie = e + "=;  expires=Thu, 01 Jan 1970 00:00:01 GMT;" } var dt = Object(u.a)(function(e) { return Object(s.a)({ root: {}, button: { boxSizing: "content-box", color: "#fff", padding: "0px 8px 0px 8px", fontSize: "14px", height: "100%", borderRadius: "0", "&:hover": { borderBottom: "".concat(e.color.main, " 2px solid"), backgroundColor: "#rgba(255,255,255,0.2)" } }, a: { color: "#666666" }, itemIcon: { color: e.color.main } }) }),
                ft = T()(Object(D.b)(function(e) { var t = e.user; return { roleBindHost: t.roleBindHost, avatar: t.avatar, name: t.name, applyUrl: t.applyUrl } }, function(e) { var t = J,
                        a = Z; return Object(x.a)({}, Object(_.b)({ getAvatar: function() { return V() }, getRoleBindHost: function() { return Q() }, getJurisdiction: function() { return ee() }, getUserName: t, getApplyUrl: a }, e)) }))(function(e) { var t = e.roleBindHost,
                        a = e.getAvatar,
                        c = void 0 === a ? P : a,
                        o = e.getUserName,
                        l = void 0 === o ? P : o,
                        i = e.getRoleBindHost,
                        s = void 0 === i ? P : i,
                        u = e.getJurisdiction,
                        f = void 0 === u ? P : u,
                        b = e.avatar,
                        p = e.name,
                        m = e.getApplyUrl,
                        E = e.applyUrl,
                        g = Object(n.useState)(null),
                        O = Object(S.a)(g, 2),
                        h = O[0],
                        v = O[1],
                        x = Object(n.useCallback)(function(e) { v(null) }, []),
                        C = Object(n.useCallback)(function(e) { v(e.currentTarget) }, []),
                        T = Object(n.useCallback)(function(e, t) { v(null), window.open(t) }, []),
                        _ = Object(n.useCallback)(function(e) { v(null), ut("publicEngine"), ut("personEngine"), window.location.href = "logout" }, []);
                    Object(n.useEffect)(function() { f(), c(), l(), m() }, [c, l, m, f]), Object(n.useEffect)(function() { s() }, [s]); var k = dt(e); return r.a.createElement(d.a, { item: !0, style: { height: "100%" } }, r.a.createElement(N.a, { type: "button", onClick: C, className: k.button, "aria-haspopup": "true" }, r.a.createElement(ot.a, { src: b })), r.a.createElement(A.a, { className: k.button, "aria-haspopup": "true", onClick: C }, p, r.a.createElement(it.a, null)), r.a.createElement(w.a, { open: Boolean(h), anchorEl: h, onClose: x, anchorOrigin: { vertical: "bottom", horizontal: "left" } }, r.a.createElement(j.a, null, r.a.createElement(y.a, { onClick: function(e) { return T(e, E) } }, r.a.createElement(R.a, { className: k.itemIcon }, r.a.createElement(ct.a, null)), r.a.createElement(L.a, { className: k.a, variant: "inherit" }, "\u4e2a\u4eba\u6743\u9650\u7533\u8bf7")), r.a.createElement(y.a, { onClick: function(e) { return T(e, "".concat(t, "/orbs-ui/bind/apply.html")) } }, r.a.createElement(R.a, { className: k.itemIcon }, r.a.createElement(I.a, null)), r.a.createElement(L.a, { className: k.a, variant: "inherit" }, "\u7ed1\u5b9a\u8d26\u53f7")), r.a.createElement(y.a, { onClick: _ }, r.a.createElement(R.a, { className: k.itemIcon }, r.a.createElement(F.a, null)), r.a.createElement(L.a, { className: k.a, variant: "inherit" }, "\u767b\u51fa"))))) }),
                bt = a(312),
                pt = a.n(bt),
                mt = a(313),
                Et = a.n(mt),
                gt = a(314),
                Ot = a.n(gt),
                ht = a(240),
                vt = a.n(ht),
                xt = a(311),
                St = a.n(xt),
                jt = Object(u.a)(function(e) { return Object(s.a)({ root: {}, button: { color: "#fff", borderRadius: "0px", fontSize: "14px", fontFamily: '"Helvetica","Roboto", "Arial", sans-serif', padding: "0px 16px 0px 8px", height: "100%", borderBottom: "rgba(0,0,0,0) 2px solid", "&:hover": { borderBottom: "".concat(e.color.main, " 2px solid"), backgroundColor: "rgba(255,255,255,0.2)" } }, a: { textDecoration: "none", color: "#666666" }, link: { color: "white" }, itemIcon: { color: e.color.main }, icon: { marginRight: "8px" }, itemGrid: { height: "100%", marginRight: "8px" } }) }),
                yt = T()(Object(D.b)(null, function(e) { var t = pe; return Object(x.a)({}, Object(_.b)({ relateChange: t }, e)) }))(function(e) { var t = e.relateChange,
                        a = Object(n.useState)(null),
                        c = Object(S.a)(a, 2),
                        o = c[0],
                        l = c[1],
                        i = Object(n.useCallback)(function(e) { l(null) }, []),
                        s = Object(n.useCallback)(function(e) { l(e.currentTarget) }, []),
                        u = Object(n.useCallback)(function(e) { t() }, [t]),
                        b = Object(n.useCallback)(function(e) { l(null), window.open(e) }, []),
                        p = Object(n.useCallback)(function(e) { window.open("#/history") }, []),
                        m = jt(e),
                        E = e.className,
                        g = Object(f.a)(m.root, E); return r.a.createElement(d.a, { className: g, container: !0, justify: "flex-end", alignItems: "center", style: { height: "100%" } }, r.a.createElement(d.a, { item: !0, className: m.itemGrid }, r.a.createElement(A.a, { className: m.button, onClick: u }, r.a.createElement(St.a, { className: m.icon }), "\u76f8\u5173\u94fe\u63a5")), r.a.createElement(d.a, { item: !0, className: m.itemGrid }, r.a.createElement(A.a, { className: m.button, onClick: p }, r.a.createElement(pt.a, { className: m.icon }), "\u5386\u53f2\u8bb0\u5f55")), r.a.createElement(d.a, { item: !0, className: m.itemGrid }, r.a.createElement(A.a, { className: m.button, onClick: s }, r.a.createElement(vt.a, { className: m.icon }), "Help"), r.a.createElement(w.a, { open: Boolean(o), anchorEl: o, onClose: i, anchorOrigin: { vertical: "bottom", horizontal: "left" } }, r.a.createElement(j.a, null, r.a.createElement(y.a, { onClick: function(e) { return b("http://conf.ctripcorp.com/pages/viewpage.action?pageId=149339225") } }, r.a.createElement(R.a, { className: m.itemIcon }, r.a.createElement(Et.a, null)), r.a.createElement(L.a, { variant: "inherit" }, "Adhoc-FAQ")), r.a.createElement(y.a, { onClick: function(e) { return b("http://conf.ctripcorp.com/pages/viewpage.action?pageId=152208437") } }, r.a.createElement(R.a, { className: m.itemIcon }, r.a.createElement(Ot.a, null)), r.a.createElement(L.a, { variant: "inherit" }, "\u9519\u8bef\u5206\u7c7b\u67e5\u8be2")), r.a.createElement(y.a, { onClick: function(e) { return b("http://conf.ctripcorp.com/pages/viewpage.action?pageId=190747106") } }, r.a.createElement(R.a, { className: m.itemIcon }, r.a.createElement(vt.a, null)), r.a.createElement(L.a, { variant: "inherit" }, "\u4f7f\u7528\u624b\u518c"))))), r.a.createElement(d.a, { item: !0, style: { height: "100%" } }, r.a.createElement(ft, null))) }),
                Ct = Object(u.a)(function(e) { return Object(s.a)({ root: { width: "0", border: "1px solid white", height: "16px" } }) }),
                Tt = function(e) { var t = Ct(e),
                        a = e.className,
                        n = Object(f.a)(t.root, a); return r.a.createElement("div", { className: n }) },
                _t = a(51),
                kt = a(77),
                It = a(9),
                Nt = a(76),
                At = a(17),
                wt = a(21),
                Rt = a(65),
                Lt = a(94),
                Dt = a.n(Lt);
            Dt.a.defaults.baseURL = "", Dt.a.defaults.withCredentials = !0, Dt.a.defaults.timeout = 1e5, Dt.a.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8", Dt.a.interceptors.request.use(function(e) { return e }, function(e) { return Promise.reject(e) }), Dt.a.interceptors.response.use(function(e) { return e }, function(e) { if (e.response) e.response.status;
                else e.request || console.log(e.message); return Promise.reject(e) }); var Gt, Ft = function() {
                    function e(t) { Object(_t.a)(this, e), this.config = void 0, this.config = t } return Object(Rt.a)(e, [{ key: "send", value: function(t) { var a = Object.assign({}, t); return Dt()(a).catch(function(e) { throw e }).then(function(t) { return e.check(t) }) } }, { key: "sendGet", value: function() { var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : { method: "GET" }; return e.method = "GET", this.send(e) } }, { key: "sendPost", value: function() { var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : { method: "POST" }; return e.method = "POST", this.send(e) } }, { key: "sendPut", value: function() { var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : { method: "PUT" }; return e.method = "PUT", this.send(e) } }, { key: "sendDelete", value: function() { var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : { method: "DELETE" }; return e.method = "DELETE", this.send(e) } }, { key: "get", value: function(e) { var t = { method: "GET", url: this.config.url, params: e }; return this.send(t) } }, { key: "save", value: function(e) { var t = { method: "POST", url: this.config.url, data: e }; return this.send(t) } }, { key: "saveOrUpdate", value: function(e) { return e.id ? this.update(e) : this.save(e) } }, { key: "update", value: function(e) { var t = { method: "PUT", url: this.config.url, data: e }; return this.send(t) } }, { key: "query", value: function(e) { var t = { method: "GET", url: this.config.url, params: e }; return this.send(t) } }, { key: "del", value: function(e) { var t = this.config.url,
                                a = { method: "DELETE", url: "".concat(t, "/").concat(e) }; return this.send(a) } }], [{ key: "check", value: function(e) { var t = e.data; if (!t) return Promise.reject("\u7cfb\u7edf\u5f02\u5e38"); var a = t = t || {},
                                n = a.retMessage,
                                r = a.retCode,
                                c = Number(r); return c && 201 !== c ? Promise.reject(n) : e } }]), e }(),
                Pt = "",
                Ut = new(function(e) {
                    function t() { var e, a;
                        Object(_t.a)(this, t); for (var n = arguments.length, r = new Array(n), c = 0; c < n; c++) r[c] = arguments[c]; return (a = Object(kt.a)(this, (e = Object(At.a)(t)).call.apply(e, [this].concat(r)))).getDataBases = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendGet", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/table/showDatabases/").concat(e) }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.getFavoriteDatabases = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendGet", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/table/showSaveDatabases/").concat(e) }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.getTables = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendGet", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/table/showTables/").concat(e.datasource, "/").concat(e.database) }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.getFavoriteTables = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendGet", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/table/showSaveTables/").concat(e.datasource, "/").concat(e.database) }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.getColumns = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendGet", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/table/showColumns/").concat(e.datasource, "/").concat(e.database, "/").concat(e.table) }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.search = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendGet", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/table/search/").concat(e.datasource, "?like=").concat(e.keyword) }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.searchSaved = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendGet", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/table/searchSaved/").concat(e.datasource, "?like=").concat(e.keyword) }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.favoritetables = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendPost", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/table/saveonetable"), data: e }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.cancelFavoritetables = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendPost", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/table/deleteSavetable"), data: e }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.uploadFiles = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendPost", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/file/uploadfile"), data: e }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.getSaveFiles = function() { return Object(wt.a)(Object(At.a)(t.prototype), "sendGet", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/file/getallfile") }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.deleteSql = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendGet", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/file/deleteonefile/").concat(e) }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.renameSql = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendPost", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/file/renameonefile"), data: e }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.newSaveFolder = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendPost", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/file/newSaveFolder"), data: e }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.getColleagues = function() { return Object(wt.a)(Object(At.a)(t.prototype), "sendGet", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/file/getColleagues") }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.saveQuery = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendPost", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/file/sharefile "), data: e }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.getPartition = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendGet", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/hive/partitionList/").concat(e.source, "/").concat(e.db, "/").concat(e.table) }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.getPreview = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendGet", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/hive/previewData/").concat(e.source, "/").concat(e.db, "/").concat(e.table) }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.shareSql = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendPost", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/file/sharefile"), data: e }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.getRmLink = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendGet", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/rmlink/").concat(e) }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.moveOneFile = function(e, n) { var r = { sourceId: e, targetParentId: n }; return Object(wt.a)(Object(At.a)(t.prototype), "sendPost", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/file/moveonefile"), data: r }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.moveOneDir = function(e, n) { var r = { sourceParentId: e, targetParentId: n }; return Object(wt.a)(Object(At.a)(t.prototype), "sendPost", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/file/moveonedir"), data: r }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a } return Object(Nt.a)(t, e), t }(Ft))({}),
                Bt = "engine",
                Ht = "personal",
                qt = ["hive", "mysql", "sqlserver"],
                Mt = { FAILED: "FAILED", FINISHED: "FINISHED", READY: "READY", RUNNING: "RUNNING", STOPPED: "STOPPED", TIMEOUT: "TIMEOUT" },
                Qt = new Map([
                    ["FAILED", "\u5931\u8d25"],
                    ["FINISHED", "\u6210\u529f"],
                    ["READY", "\u5df2\u63d0\u4ea4"],
                    ["RUNNING", "\u8fd0\u884c\u4e2d"],
                    ["STOPPED", "\u505c\u6b62"],
                    ["TIMEOUT", "\u8d85\u65f6"]
                ]),
                Vt = 2,
                zt = 3,
                Yt = 4,
                Wt = { FILE: "F", FOLDER: "D" },
                Kt = "favorite",
                Xt = "newfolder",
                Jt = "delete",
                $t = "rename",
                Zt = "SHARE",
                ea = "show_info";! function(e) { e.PRESTO = "PRESTO", e.HIVE = "HIVE", e.SPARK2 = "SPARK2", e.SPARK = "SPARK", e.ROUTER = "ROUTER", e.MYSQL = "MYSQL", e.SQLSERVER = "SQLSERVER" }(Gt || (Gt = {})); var ta = { HIVE: "hive", MYSQL: "mysql", SQLSERVER: "sqlserver" },
                aa = 0,
                na = 1,
                ra = new(function() {
                    function e() { Object(_t.a)(this, e), this.queue = [] } return Object(Rt.a)(e, [{ key: "add", value: function(e) { return this.queue.push(e), this } }, { key: "remove", value: function(e) { var t = this.queue.findIndex(function(t) { return t === e }); return t > -1 && this.queue.splice(t, 1), this } }, { key: "poll", value: function() { return this.queue.length ? this.queue.shift() : null } }, { key: "contains", value: function(e) { return this.queue.includes(e) } }, { key: "isEmpty", value: function() { return 0 === this.queue.length } }]), e }()),
                ca = new(a(678).a),
                oa = new(function() {
                    function e() { Object(_t.a)(this, e) } return Object(Rt.a)(e, [{ key: "add", value: function(e) { ra.add(e) } }, { key: "notify", value: function(e) { this.add(e), ca.next() } }]), e }()),
                la = Object(u.a)(function(e) { return Object(s.a)({ root: { height: "30px", display: "flex", alignItems: "center", background: e.color.main, color: "white" }, logoContainer: { height: "100%", display: "flex", alignItems: "center", background: e.color.dark, paddingLeft: "20px", paddingRight: "20px" }, a: { textDecoration: "none", color: "white" }, friend: { display: "flex", justifyContent: "center", alignItems: "center" }, content: { display: "flex", justifyContent: "center", alignItems: "center" }, item: { padding: "0 30px" }, hadoop: { cursor: "pointer" } }) }),
                ia = function(e) { var t = la(e),
                        a = e.accountType,
                        c = e.role,
                        o = e.personAccount,
                        l = Object(n.useCallback)(function(e) { var t = c;
                            a !== Ht || (t = o) ? a !== Bt || t ? Ut.getRmLink(t).then(function(e) { e.success && window.open(e.data) }) : oa.notify({ variant: "warning", content: "\u5728\u7ec4\u8d26\u53f7\u4e2d\uff0c\u60a8\u6ca1\u6709\u8d26\u53f7\u4fe1\u606f\uff0c\u65e0\u6cd5\u83b7\u53d6hadoop\u94fe\u63a5!" }) : oa.notify({ variant: "warning", content: "\u5728\u4e2a\u4eba\u8d26\u53f7\u4e2d\uff0c\u60a8\u6ca1\u6709\u8d26\u53f7\u4fe1\u606f\uff0c\u65e0\u6cd5\u83b7\u53d6hadoop\u94fe\u63a5\uff0c\u60a8\u53ef\u4ee5\u901a\u8fc7\u5148\u8f6c\u6362\u6267\u884c\u5f15\u64ce\u83b7\u53d6hive\u8d26\u53f7!" }) }, [a, c, o]); return r.a.createElement(d.a, { className: t.root, container: !0, alignItems: "center" }, r.a.createElement(d.a, { item: !0, xs: !0, className: t.friend }, r.a.createElement(L.a, { variant: "inherit" }, " ", "\u76f8\u5173\u94fe\u63a5:"), r.a.createElement("div", { className: t.content }, r.a.createElement("div", { className: t.item }, r.a.createElement(L.a, { variant: "inherit", className: t.hadoop, onClick: l }, "Hadoop tracker")), r.a.createElement(Tt, null), r.a.createElement("div", { className: t.item }, r.a.createElement(L.a, { variant: "inherit" }, r.a.createElement("a", { className: t.a, href: "http://nova/", target: "_blank", rel: "noopener noreferrer" }, "ARTNova\u62a5\u8868\u7cfb\u7edf"))), r.a.createElement(Tt, null), r.a.createElement("div", { className: t.item }, r.a.createElement(L.a, { variant: "inherit" }, r.a.createElement("a", { className: t.a, href: "http://dataquality.ops.ctripcorp.com/", target: "_blank", rel: "noopener noreferrer" }, "\u6570\u636e\u8d28\u91cf\u7ba1\u7406"))), r.a.createElement(Tt, null), r.a.createElement("div", { className: t.item }, r.a.createElement(L.a, { variant: "inherit" }, r.a.createElement("a", { className: t.a, href: "http://dpp.ops.ctripcorp.com/", target: "_blank", rel: "noopener noreferrer" }, "Dp-Portal-Plus"))), r.a.createElement(Tt, null), r.a.createElement("div", { className: t.item }, r.a.createElement(L.a, { variant: "inherit" }, r.a.createElement("a", { className: t.a, href: "http://zeus.bi.ctripcorp.com/zeus-web/#!/home", target: "_blank", rel: "noopener noreferrer" }, "Zeus\u8c03\u5ea6\u7cfb\u7edf")))))) },
                sa = Object(u.a)(function(e) { return Object(s.a)({ root: { height: e.spacing(6), paddingLeft: "30px", backgroundColor: e.color.main }, logoContainer: { display: "flex", alignItems: "center", paddingLeft: "20px", paddingRight: "20px" } }) }),
                ua = T()(Object(D.b)(function(e) { var t = e.data.showAllRelate,
                        a = e.user; return { showAllRelate: t, accountType: a.accountType, role: a.role, personAccount: a.personAccount } }, null))(function(e) { var t = e.showAllRelate,
                        a = e.accountType,
                        n = e.role,
                        c = e.personAccount,
                        o = sa(e); return r.a.createElement(p, null, r.a.createElement(d.a, { className: o.root, container: !0, alignItems: "center" }, r.a.createElement(d.a, { item: !0, className: o.logoContainer }, r.a.createElement(v, null)), r.a.createElement(d.a, { item: !0, xs: !0, style: { height: "100%" } }, r.a.createElement(yt, null))), t ? r.a.createElement(ia, { accountType: a, role: n, personAccount: c }) : null) }),
                da = a(659),
                fa = a(357),
                ba = {},
                pa = { overrides: {}, typography: { fontFamily: ['"PingFangSC-Medium"', '"Helvetica"', '"Roboto"', '"Arial"', "sans-serif", "Tahoma", "STXihei", '"\u534e\u6587\u7ec6\u9ed1"', '"Microsoft YaHei"', '"\u5fae\u8f6f\u96c5\u9ed1"'].join(",") }, minWidth: 1080, border: { baseBorder: "1px solid #DEDEDE" }, clearfix: { content: "' '", display: "block", clear: "both" }, textOverflow: { whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }, color: { main: "#00B3A4", dark: "#2B8583", tint: "#f2f9f8", secondary: "#d7efed", orange: "#FF9979", yellow: "#FFB000", red: "#FF6C64", customGray: "#F8F9F9", lightGray1: "#f2f2f2", lightGray2: "#E6E6E6", lightGray3: "#DEDEDE", midGray: "#CCCCCC", midGray2: "#E6E6E6", darkGray: "#666666", darkGray2: "#333333", blue: "#62C1ED" }, palette: { primary: { main: "#00B3A4" } } },
                ma = r.a.createContext({}),
                Ea = r.a.useState,
                ga = r.a.useMemo,
                Oa = function(e) { var t = e.children,
                        a = Ea("default"),
                        n = Object(S.a)(a, 2),
                        c = n[0],
                        o = n[1],
                        l = ga(function() { return { default: ba } }, []),
                        i = ga(function() { return Object(fa.a)(Object(x.a)({}, l[c], pa)) }, [c, l]),
                        s = ga(function() { return { theme: c, setTheme: o } }, [c, o]); return r.a.createElement(ma.Provider, { value: s }, r.a.createElement(da.a, { theme: i }, t)) },
                ha = a(677),
                va = Object(u.a)(function(e) { return Object(s.a)({ root: {} }) }),
                xa = function(e) { var t = va(e),
                        a = e.className,
                        n = e.children,
                        c = Object(f.a)(t.root, a); return r.a.createElement(d.a, { className: c, item: !0, xs: !0 }, n) },
                Sa = Object(u.a)(function(e) { return Object(s.a)({ root: { background: "white" } }) }),
                ja = function(e) { var t = Sa(e),
                        a = e.className,
                        n = e.children,
                        c = Object(f.a)(t.root, a); return r.a.createElement(d.a, { className: c, item: !0 }, n) },
                ya = Object(u.a)(function(e) { return Object(s.a)({ root: { background: "white" } }) }),
                Ca = function(e) { var t = e.className,
                        a = e.children,
                        n = ya(e),
                        c = Object(f.a)(n.root, t); return r.a.createElement(d.a, { className: c, item: !0, xs: !0 }, a) },
                Ta = a(660),
                _a = a(681),
                ka = a(30),
                Ia = Object(u.a)(function(e) { return Object(s.a)({ root: { marginBottom: "16px" }, heading: {}, tab: { minWidth: 0, flex: 1 }, formControl: {} }) }),
                Na = Object(ka.a)(Object(D.b)(function(e) { var t = e.data; return { datasource: t.datasource, elementData: t.elementData, favoriteTreeData: t.favoriteTreeData, query_tab: t.query_tab } }, function(e) { var t = le,
                        a = se,
                        n = he,
                        r = ve; return Object(x.a)({ changeDatasource: function(t) { e(oe(t)), e(le(t)), e(se(t)), e(he(!0)), e(ve(!0)) } }, Object(_.b)({ getDatabases: t, setElementLoading: n, setTableSaveLoading: r, getFavoriteDatabases: a }, e)) }))(function(e) { var t = e.datasource,
                        a = e.changeDatasource,
                        c = e.getDatabases,
                        o = e.getFavoriteDatabases,
                        l = e.setElementLoading,
                        i = e.setTableSaveLoading,
                        s = Ia(e),
                        u = Object(n.useCallback)(function(e) { a(e.target.value) }, [a]); return Object(n.useEffect)(function() { c(qt[0]), o(qt[0]), l(!0), i(!0) }, [c, o, l, i]), r.a.createElement("div", { className: s.root }, r.a.createElement(Ta.a, { className: s.formControl, fullWidth: !0 }, r.a.createElement(_a.a, { value: t, onChange: u }, qt && qt.map(function(e) { return r.a.createElement(y.a, { key: e, value: e }, e) })))) }),
                Aa = a(680),
                wa = a(667),
                Ra = (a(423), a(32)),
                La = a.n(Ra),
                Da = (a(206), a(69)),
                Ga = (a(207), a(208), a(209), a(210), a(149), a(211), a(89)),
                Fa = a.n(Ga),
                Pa = a(44),
                Ua = a(12),
                Ba = a(41),
                Ha = a.n(Ba),
                qa = a(90),
                Ma = a.n(qa),
                Qa = a(7),
                Va = a(362),
                za = a(612),
                Ya = a(611),
                Wa = a(663),
                Ka = a(60),
                Xa = function(e) { var t = e.classes,
                        a = e.className,
                        r = e.isDisabled,
                        c = e.children,
                        o = Object(Ka.a)(e, ["classes", "className", "isDisabled", "children"]),
                        l = Ha()(t.root, Object(Pa.a)({}, t.disabled, r), a); return n.createElement("div", Object.assign({ className: l }, o), c) };
            Xa.defaultProps = {}; var Ja = Object(Qa.a)(function(e) { return { root: { backgroundColor: "#ffffff" }, disabled: { backgroundColor: "#f2f2f2" } } })(Xa),
                $a = (0, n.forwardRef)(function(e, t) { var a = e.classes,
                        r = e.className,
                        c = e.children,
                        o = Object(Ka.a)(e, ["classes", "className", "children"]),
                        l = Ha()(a.root, r); return n.createElement("div", Object.assign({ className: l, ref: t }, o), c) });
            $a.defaultProps = {}; var Za = Object(Qa.a)(function(e) { return { root: { display: "flex", alignItems: "center", border: "1px solid #dedede", borderRadius: 4, overflow: "hidden", cursor: "pointer" } } })($a),
                en = function(e) { var t = e.classes,
                        a = e.className,
                        r = e.children,
                        c = e.isDisabled,
                        o = Object(Ka.a)(e, ["classes", "className", "children", "isDisabled"]),
                        l = Ha()(t.root, Object(Pa.a)({}, t.disabled, c), a); return n.createElement("div", Object.assign({ className: l }, o), r) };
            en.defaultProps = {}; var tn = Object(Qa.a)(function(e) { return Object(s.a)({ root: { textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }, disabled: { color: "#888888" } }) })(en),
                an = function(e) { var t = e.classes,
                        a = e.className,
                        r = e.children,
                        c = Object(Ka.a)(e, ["classes", "className", "children"]),
                        o = Ha()(t.root, a); return n.createElement("div", Object.assign({ className: o }, c), r) };
            an.defaultProps = {}; var nn = Object(Qa.a)(function(e) { return { root: { display: "flex", flex: 1, width: 0, lineHeight: "1.1875em", padding: "6px 4px 7px 4px", alignItems: "center" } } })(an),
                rn = a(137),
                cn = a.n(rn),
                on = (0, n.forwardRef)(function(e, t) { var a, r = e.classes,
                        c = e.className,
                        o = e.show,
                        l = e.isDisabled,
                        i = Object(Ka.a)(e, ["classes", "className", "show", "isDisabled"]),
                        s = Ha()(r.root, c),
                        u = Ha()(r.autoSizeInput, (a = {}, Object(Pa.a)(a, r.show, o), Object(Pa.a)(a, r.disabled, l), a)); return n.createElement("div", { className: s, ref: t }, n.createElement(cn.a, Object.assign({ className: u, inputClassName: r.input }, i))) });
            on.defaultProps = {}; var ln = Object(Qa.a)(function(e) { return { root: { maxWidth: "100%", overflow: "hidden" }, autoSizeInput: { width: 1, maxWidth: "100%", opacity: 0, verticalAlign: "top" }, show: { opacity: 1, width: "auto" }, input: { maxWidth: "100%", padding: 0, fontSize: "inherit", fontFamily: "inherit", color: "inherit", background: 0, border: "none", outline: "none", lineHeight: "inherit", "&:focus": { outline: "none" } }, disabled: { color: "#f2f2f2" } } })(on),
                sn = function(e) { var t = e.classes,
                        a = e.message,
                        r = e.className,
                        c = Ha()(t.root, r); return n.createElement("div", { className: c }, a) };
            sn.defaultProps = { message: "No options" }; var un = Object(Qa.a)(function(e) { return Object(s.a)({ root: { padding: 4, textAlign: "center" } }) })(sn),
                dn = function(e) { var t = e.classes,
                        a = e.className,
                        r = e.children,
                        c = Object(Ka.a)(e, ["classes", "className", "children"]),
                        o = Ha()(t.root, a); return n.createElement("div", Object.assign({ className: o }, c), r) };
            dn.defaultProps = {}; var fn = Object(Qa.a)(function(e) { return Object(s.a)({ root: { opacity: .6 } }) })(dn),
                bn = a(662),
                pn = function(e) { return n.createElement(bn.a, { size: 16 }) };
            pn.defaultProps = {}; var mn = Object(Qa.a)(function(e) { return { root: {}, img: { width: 24, height: 24, verticalAlign: "middle" } } })(pn),
                En = function(e) { var t = e.classes,
                        a = e.children; return n.createElement("div", { className: t.root }, a) };
            En.defaultProps = {}; var gn = Object(Qa.a)(function(e) { return { root: { alignItems: "center", alignSelf: "stretch", display: "flex", flexShrink: 0 } } })(En),
                On = a(356);

            function hn(e) { return "function" === typeof e }

            function vn(e) { if (hn(e)) { for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++) a[n - 1] = arguments[n]; return e.apply(void 0, a) } } document.documentElement.contains;

            function xn(e, t) { e.current ? e.current = Object(x.a)({}, e.current, t) : e.current = Object(x.a)({}, t) }

            function Sn(e, t) { return e.current ? e.current[t] : null }

            function jn(e, t) {! function(e) { return [document.documentElement, document.body, window].indexOf(e) > -1 }(e) ? e.scrollTop = t: window.scrollTo(0, t) } n.useState, n.useCallback; var yn = n.useMemo,
                Cn = n.useReducer; var Tn = function(e, t) { return !e };
            a(503); var _n = n.useState,
                kn = n.useCallback,
                In = n.useRef,
                Nn = n.useEffect,
                An = n.useMemo,
                wn = c.findDOMNode,
                Rn = function(e) { var t, a = function() { var e = Cn(Tn, !0),
                                t = Object(S.a)(e, 2)[1]; return yn(function() { return function() { t(null) } }, [t]) }(),
                        r = e.classes,
                        c = e.isDisabled,
                        o = e.autoWidth,
                        l = e.isSearchable,
                        i = e.isLoading,
                        s = e.isClearable,
                        u = e.options,
                        d = e.value,
                        f = e.inputValue,
                        b = e.open,
                        p = e.name,
                        m = e.delimiter,
                        E = e.multiple,
                        g = e.maxHeight,
                        O = e.placeholder,
                        h = e.renderValue,
                        v = e.getOptionLabel,
                        j = e.getOptionValue,
                        y = e.onOpen,
                        C = e.onChange,
                        T = e.onInputChange,
                        _ = e.onFilter,
                        k = e.onClose,
                        I = e.listProps,
                        N = e.listItemProps,
                        A = e.PopperProps,
                        w = e.onClear,
                        R = In(null),
                        L = In(null),
                        D = (t = L, function(e) { t.current = e }),
                        G = In(null),
                        F = In(null),
                        P = In(null),
                        U = In(null),
                        B = In(null),
                        H = _n({ isFocused: !1, selectValue: [], anchorEl: null, menuMinWidth: null, menuMaxHeight: "auto", popperKey: 0 }),
                        q = Object(S.a)(H, 2),
                        M = q[0],
                        Q = q[1],
                        V = _n(!1),
                        z = Object(S.a)(V, 2),
                        Y = z[0],
                        W = z[1],
                        K = M.isFocused,
                        X = M.anchorEl,
                        J = M.selectValue,
                        $ = M.menuMinWidth,
                        Z = M.menuMaxHeight,
                        ee = M.popperKey,
                        te = _n(null),
                        ae = Object(S.a)(te, 2),
                        ne = ae[0],
                        re = ae[1],
                        ce = _n(u),
                        oe = Object(S.a)(ce, 2),
                        le = oe[0],
                        ie = oe[1],
                        se = (J = function(e) { return Array.isArray(e) ? e.filter(Boolean) : "object" === typeof e && null !== e ? [e] : [] }(d)).length > 0,
                        ue = kn(function(e) { return v(e) }, [v]),
                        de = kn(function(e, t) { if ("function" === typeof _) return _(e, t); var a = ue(e); return "string" !== typeof a || a.toLowerCase().indexOf(t.toLowerCase()) > -1 }, [ue, _]),
                        fe = An(function() { var e = le; return Sn(P, "inputValueChange") && f && (e = le.filter(function(e) { return de(e, f) })), e }, [le, f, de]),
                        be = kn(function(e) { e && Q(function(t) { return Object(x.a)({}, t, e) }) }, []),
                        pe = kn(function() { var e = R.current.getBoundingClientRect().width;
                            e === $ || o || be({ menuMinWidth: e }) }, [o, $, be]),
                        me = kn(function() { var e, t = R.current.getBoundingClientRect(),
                                a = t.top,
                                n = t.bottom,
                                r = window.innerHeight - n;
                            e = r > g || a > g && g > r ? g : Math.max(a, r), e -= 5, b && e !== Z && be({ menuMaxHeight: e }) }, [b, Z, g, be]),
                        Ee = kn(function() { L.current && (L.current.focus(), function(e) { var t = e.value.length; if (document.selection) { var a = e.createTextRange();
                                    a.moveStart(" character ", t), a.collapse(), a.select() } else "number" === typeof e.selectionStart && "number" === typeof e.selectionEnd && (e.selectionStart = e.selectionEnd = t) }(L.current)) }, []);
                    Nn(function() { Sn(P, "didMount") || (xn(P, { didMount: !0 }), be({ anchorEl: R.current })), (K && c && !Sn(U, "isDisabled") || K && b && !Sn(U, "open")) && Ee(); var e = wn(G.current),
                            t = wn(B.current);
                        e && t && Sn(P, "scrollToFocusedOptionOnUpdate") && function(e, t) { var a = e.getBoundingClientRect(),
                                n = t.getBoundingClientRect(),
                                r = t.offsetHeight / 3;
                            n.bottom + r > a.bottom ? jn(e, Math.min(t.offsetTop + t.clientHeight - e.offsetHeight + r, e.scrollHeight)) : n.top - r < a.top && jn(e, Math.max(t.offsetTop - r, 0)) }(e, t), xn(P, { scrollToFocusedOptionOnUpdate: !1 }), R.current && (pe(), me()), xn(U, { open: b, isDisabled: c }), ie(u) }, [u, c, K, b, be, me, pe, Ee]); var ge = kn(function() { vn(y) }, [y]),
                        Oe = kn(function() { var e = 0; if (!E && se) { var t = fe.indexOf(J[0]);
                                t > -1 && (e = t) } xn(P, { focusedOption: fe[e] }), ge(), R.current && setTimeout(function() { xn(P, { scrollToFocusedOptionOnUpdate: !0 }), a() }) }, [fe, E, J, ge, a, se]),
                        he = kn(function(e) { b && e.stopPropagation() }, [b]),
                        ve = kn(function() { be({ isFocused: !0 }), Sn(P, "openAfterFocus") && Oe(), xn(P, { openAfterFocus: !1 }), re(f) }, [Oe, be, f, re]),
                        xe = kn(function() { L.current && L.current.blur() }, []),
                        Se = kn(function() { xn(P, { inputValueChange: !1 }), l || E || xe(), vn(k) }, [l, E, xe, k]),
                        je = kn(function() { Se(), be({ isFocused: !1 }) }, [Se, be]),
                        ye = kn(function(e) { c || (K ? b ? Se() : Oe() : (xn(P, { openAfterFocus: !0 }), Ee()), "INPUT" !== e.target.tagName && e.preventDefault()) }, [b, c, K, Ee, Se, Oe]),
                        Ce = kn(function(e) { vn(T, e), re(e) }, [T]),
                        Te = kn(function() { vn(w) }, [w]),
                        _e = kn(function(e, t) { vn(C, e, t) }, [C]),
                        ke = kn(function(e) { e && "mousedown" === e.type && 0 !== e.button || (e.stopPropagation(), _e(E ? [] : null), Te(), re(""), ie([])) }, [Te, _e, E]),
                        Ie = kn(function(e, t) { xe(), Se(), _e(e, { option: t }) }, [_e, xe, Se]),
                        Ne = kn(function(e) { return j(e) }, [j]),
                        Ae = kn(function(e, t) { if (t.indexOf(e) > -1) return !0; var a = Ne(e); return t.some(function(e) { var t = Ne(e); return void 0 !== t && t === a }) }, [Ne]),
                        we = kn(function(e) { return function() { E ? Ae(e, J) ? Ie(J.filter(function(t) { return t !== e }), e) : Ie([].concat(Object(Ua.a)(J), [e]), e) : Ie(e) } }, [J, E, Ae, Ie]),
                        Re = kn(function(e) { xn(P, { inputValueChange: !0, focusedOption: {} }); var t = e.currentTarget.value;
                            Ce(t), b || Oe() }, [b, Ce, Oe]),
                        Le = kn(function(e) { if (fe.length) { var t = 0,
                                    a = Sn(P, "focusedOption"),
                                    n = fe.indexOf(a);
                                a || (n = -1), "up" === e ? (t = n > 0 ? n - 1 : fe.length - 1, re(fe[t].name)) : "down" === e && (t = (n + 1) % fe.length, re(fe[t].name)), xn(P, { focusedOption: fe[t], scrollToFocusedOptionOnUpdate: !0 }) } }, [fe]),
                        De = kn(function(e) { if (!c) { var t = Sn(P, "focusedOption"); switch (e.key) {
                                    case "Enter":
                                        if (b) { if (!t || ne !== t.title) return;
                                            we(t)() } break;
                                    case "ArrowUp":
                                        b && (Le("up"), W(!0), a()); break;
                                    case "ArrowDown":
                                        b && (Le("down"), W(!0), a()); break;
                                    default:
                                        return } e.preventDefault() } }, [c, b, Le, a, we, ne]),
                        Ge = kn(function(e) { return function() { var t = Sn(P, "focusedOption");
                                c || Y || e === t || xn(P, { focusedOption: e }) } }, [c, Y]),
                        Fe = kn(function(e) { 0 === e.button && (e.stopPropagation(), e.preventDefault()) }, []),
                        Pe = kn(function(e) { Y && W(!1) }, [Y]),
                        Ue = An(function() { return { minWidth: $, maxWidth: o ? "100%" : $, maxHeight: "".concat(Z, "px") } }, [$, o, Z]); return n.createElement(Ja, { className: r.root, isDisabled: c, onKeyDown: De }, n.createElement(Za, { innerRef: R, onMouseDown: ye }, n.createElement(nn, null, function() { if (!se || !E && K) return null; var e = function() { var e, t = "",
                                a = [],
                                n = !1; if (hn(h) ? e = h(E ? J : J[0]) : n = !0, n) { if (E) return void le.forEach(function(e) { if (Ae(e, J)) { var t = ue(e);
                                        a.push(t) } });
                                le.some(function(e) { if (Ae(e, J)) { var a = ue(e); return t = a, !0 } return !1 }), e = E ? a.join(", ") : t } return e }(); return n.createElement(tn, { isDisabled: c }, e || n.createElement("span", { dangerouslySetInnerHTML: { __html: "&#8203;" } })) }(), n.createElement(ln, { autoCapitalize: "none", autoComplete: "off", autoCorrect: "off", spellCheck: "false", type: "text", show: K, readOnly: !l, isDisabled: c, value: ne, inputRef: D, onChange: Re, onFocus: ve, onBlur: je, onMouseDown: he }), se && !K || f && K ? null : n.createElement(fn, { className: r.placeholder }, O)), n.createElement(gn, null, c || !se || K || i || !s ? null : n.createElement(Ma.a, { className: r.clearIcon, onMouseDown: ke }), c || !i ? null : n.createElement(mn, null), function() { var e = Ha()(r.keyboardArrowDownIcon, Object(Pa.a)({}, r.disabledKeyboardArrowDownIcon, c)); return n.createElement(it.a, { className: e }) }())), function() { var e, t = fe.indexOf(Sn(P, "focusedOption")),
                            a = 30 * fe.length;
                        a = a > 300 ? 300 : 0 === a ? 30 : a; try { e = R.current.getBoundingClientRect().width } catch (c) { e = 500 } return n.createElement(za.a, Object.assign({}, A, { key: ee, ref: F, className: r.popper, open: b, anchorEl: X, placement: "bottom-start" }), n.createElement(Va.a, { square: !0, className: r.paper }, n.createElement(On.a, Object.assign({}, I, { innerRef: G, className: r.list, style: Ue, onMouseDown: Fe, onMouseMove: Pe, width: e, height: a, overscanRowCount: 10, rowCount: fe.length, rowHeight: 30, tabIndex: null, scrollToIndex: t, rowRenderer: function(e) { var t = e.index,
                                    a = (e.isScrolling, e.isVisible, e.key),
                                    c = (e.parent, e.style); return function(e, t, a, c) { var o, l, i = Sn(P, "focusedOption"),
                                        s = i === e ? B : void 0;
                                    l = Y ? i === e : !!se && Ae(e, J); var u = Ha()(r.listItem, (o = {}, Object(Pa.a)(o, r.isOptionSelected, l), Object(Pa.a)(o, r.listItemHover, !Y), o)); return n.createElement(Wa.a, { key: a, title: ue(e), placement: "bottom-end", classes: { popper: r.popper, tooltip: r.noMaxWidth } }, n.createElement(Ya.a, Object.assign({}, N, { disableGutters: !0, className: u, innerRef: s, onMouseDown: we(e), onMouseMove: Ge(e), onMouseOver: Ge(e), style: c }), n.createElement("div", { className: r.listItemText }, ue(e)))) }(fe[t], 0, a, c) }, noRowsRenderer: function() { return n.createElement(un, { className: r.noOptionsMessage }) } })))) }(), function() { if (p && !c) { if (E) { if (m) { var e = J.map(function(e) { return Ne(e) }).join(m); return n.createElement("input", { name: p, type: "hidden", value: e }) } return n.createElement("div", null, J.map(function(e, t) { return n.createElement("input", { key: "i-".concat(t), name: p, type: "hidden", value: Ne(e) }) })) } var t = J[0] ? Ne(J[0]) : ""; return n.createElement("input", { name: p, type: "hidden", value: t }) } }()) };
            Rn.defaultProps = { options: [], isLoading: !1, isSearchable: !1, isClearable: !1, isDisabled: !1, autoWidth: !1, multiple: !1, maxHeight: 350, delimiter: ",", placeholder: "", getOptionLabel: function(e) { return e.title }, getOptionValue: function(e) { return e.value } }; var Ln = Object(Qa.a)(function(e) { return Object(s.a)({ root: {}, clearIcon: { marginLeft: 4, fontSize: 14, cursor: "pointer" }, keyboardArrowDownIcon: { marginLeft: 4 }, disabledKeyboardArrowDownIcon: { color: "#888888" }, paper: {}, placeholder: {}, noOptionsMessage: {}, list: { overflowY: "auto" }, listItem: { padding: "5px 10px" }, listItemHover: { "&:hover": { backgroundColor: e.palette.primary.main, color: "white" } }, isOptionSelected: { backgroundColor: e.palette.primary.main, color: "white" }, listItemText: { flex: 1, textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }, popper: { zIndex: 1600 }, noMaxWidth: { maxWidth: "none" } }) })(Rn),
                Dn = n.useState,
                Gn = n.useCallback,
                Fn = n.forwardRef,
                Pn = function(e) { var t = Fn(function(t, a) { var r = t.defaultInputValue,
                            c = t.inputValue,
                            o = t.defaultOpen,
                            l = t.open,
                            i = t.defaultValue,
                            s = t.value,
                            u = Gn(function(e, t) { return function(e) { return void 0 === e }(e) ? t : e }, []),
                            d = Dn(u(s, i)),
                            f = Object(S.a)(d, 2),
                            b = f[0],
                            p = f[1],
                            m = Dn(u(c, r)),
                            E = Object(S.a)(m, 2),
                            g = E[0],
                            O = E[1],
                            h = Dn(u(l, o)),
                            v = Object(S.a)(h, 2),
                            x = v[0],
                            j = v[1],
                            y = Gn(function(e) { if (hn(t[e])) { for (var a = arguments.length, n = new Array(a > 1 ? a - 1 : 0), r = 1; r < a; r++) n[r - 1] = arguments[r]; return t[e].apply(t, n) } }, [t]),
                            C = Gn(function(e) { y("onChange", e), p(e) }, [y]),
                            T = Gn(function(e) { y("onInputChange", e), O(e) }, [y]),
                            _ = Gn(function() { y("onOpen", !0), j(!0) }, [y]),
                            k = Gn(function() { y("onClose", !1), j(!1) }, [y]); return n.createElement(e, Object.assign({}, t, { innerRef: a, open: u(l, x), value: u(s, b), inputValue: u(c, g), onChange: C, onInputChange: T, onOpen: _, onClose: k })) }); return t.defaultProps = { defaultInputValue: "", defaultOpen: !1, defaultValue: null }, t }(Ln),
                Un = a(140),
                Bn = a.n(Un),
                Hn = a(323),
                qn = a.n(Hn),
                Mn = Object(u.a)(function(e) { return Object(s.a)({ root: { width: "100%", padding: "8px", background: e.palette.primary.main, fontSize: "14px" } }) }),
                Qn = function(e) { var t = e.onSelectOne,
                        a = e.list,
                        c = e.onSearch,
                        o = e.onClear,
                        l = e.isLoading,
                        i = Object(n.useState)(null),
                        s = Object(S.a)(i, 2),
                        u = s[0],
                        d = s[1],
                        f = Object(n.useState)(""),
                        b = Object(S.a)(f, 2),
                        p = b[0],
                        m = b[1],
                        E = Mn(e),
                        g = Object(n.useCallback)(function(e) { d(e), m(qn()(e, "title", "").trim()), t(e ? e.title : "") }, [t, m]),
                        O = Object(n.useCallback)(Bn()(function(e) { m(e), c(e) }, 1e3), [c, m]),
                        h = Object(n.useCallback)(function(e) { o() }, [o]); return r.a.createElement("div", { className: E.root }, r.a.createElement(Pn, { style: { width: "100%", padding: "8px 8px 0 8px", background: "transparent", height: "36px" }, placeholder: "\u8f93\u5165\u5173\u952e\u5b57\u540e\u81ea\u52a8\u641c\u7d22", value: u, onChange: g, onClear: h, inputValue: p, onInputChange: O, options: a, isClearable: !0, isSearchable: !0, isLoading: l })) },
                Vn = Object(u.a)(function(e) { return Object(s.a)({ root: { display: "flex", flex: 1, alignItems: "center", justifyContent: "center" } }) }),
                zn = function(e) { var t = e.className,
                        a = Vn(e),
                        n = Object(f.a)(a.root, t); return r.a.createElement("div", { className: n }, r.a.createElement(bn.a, null)) },
                Yn = (a(160), Object(u.a)(function(e) { return Object(s.a)({ root: { flex: 1, display: "flex", flexDirection: "column", padding: "8px", overflow: "hidden" }, heading: {}, treeOuter: { flex: 1, marginTop: "8px", overflow: "auto", display: "flex", "&>div:nth-child(1)": { display: "flex" } }, tree: { flex: 1 }, hide: { display: "none" }, rightMenu: { zIndex: 1301, boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)", border: "none!important", paddingTop: "8px", paddingBottom: "8px", width: "100px" }, cmLi: { "&>div.ui-menu-item-wrapper": { paddingLeft: "16px", paddingRight: "16px", paddingTop: "4px", paddingBottom: "4px", textAlign: "left", border: "none" }, "&>div.ui-state-active": { background: "rgba(0, 0, 0, 0.08)", border: "none", color: "#666", paddingLeft: "16px", paddingRight: "16px", paddingTop: "4px", paddingBottom: "4px", margin: 0 } } }) })),
                Wn = Object(ka.a)(Object(D.b)(function(e) { var t = e.data,
                        a = t.elementData; return { datasource: t.datasource, elementData: a, elementLoading: t.elementLoading } }, function(e) { var t = ie,
                        a = se,
                        n = Ve,
                        r = $e; return Object(x.a)({ getPartition: function(t, a, n) { e(xe({ db: a, table: n })), e(Ee({ source: t, db: a, table: n })), e(ge({ source: t, db: a, table: n })) } }, Object(_.b)({ appendSql: n, changeSelectedTreeNode: t, getFavoriteDatabases: a, insertSql: r }, e)) }))(function(e) { var t = e.elementData,
                        a = e.datasource,
                        c = e.className,
                        o = e.getFavoriteDatabases,
                        l = void 0 === o ? P : o,
                        i = e.getPartition,
                        s = void 0 === i ? P : i,
                        u = e.elementLoading,
                        d = e.insertSql,
                        b = Yn(e),
                        p = Object(n.useState)([]),
                        m = Object(S.a)(p, 2),
                        E = m[0],
                        g = m[1],
                        O = Object(f.a)(b.root, c),
                        h = Object(n.useState)(!1),
                        v = Object(S.a)(h, 2),
                        x = v[0],
                        j = v[1],
                        y = Object(n.useState)(null),
                        C = Object(S.a)(y, 2),
                        T = C[0],
                        _ = C[1],
                        k = Object(n.useCallback)(function(e, t) { return t.node.type === zt ? (d("".concat(t.node.data.database, ".").concat(t.node.data.table)), !1) : t.node.type === Yt ? (d(t.node.data.column), !1) : (d(t.node.data.name), !1) }, [d]),
                        I = Object(n.useCallback)(function() { La()("#elementTree").contextmenu({ delegate: ".fancytree-title", autoFocus: !0, addClass: b.rightMenu, menu: [{ title: "\u6536\u85cf", cmd: Kt, addClass: b.cmLi }, { title: "\u8868\u4fe1\u606f", cmd: ea, addClass: b.cmLi }], beforeOpen: function(e, t) { var a = La.a.ui.fancytree.getNode(t.target); if (a.type !== zt) return !1;
                                    a.setActive() }, select: function(e, t) { e.stopPropagation(); var n = La.a.ui.fancytree.getNode(t.target); switch (t.cmd) {
                                        case Kt:
                                            var r = { datasource: a, database: n.data.database, table: n.data.table };
                                            Ut.favoritetables(r).then(function(e) { e.success && (oa.notify({ variant: "success", content: "\u6536\u85cf\u6210\u529f\uff01" }), l(a)) }); break;
                                        case ea:
                                            s(a, n.data.database, n.data.table) } } }, function() {}) }, [b.cmLi, b.rightMenu, s, l, a]);
                    Object(n.useEffect)(function() { if (t.length) { var e = Object(Da.createTree)("#elementTree", { extensions: ["edit", "filter"], source: t, tabindex: "", titlesTabbable: !0, toggleEffect: !1, checkbox: !1, autoScroll: !0, escapeTitles: !0, tooltip: !0, strings: { loading: "\u8f7d\u5165\u4e2d...", loadError: "\u8f7d\u5165\u6811\u6570\u636e\u51fa\u9519!", moreData: "More...", noData: "\u6ca1\u6709\u6570\u636e." }, icon: function(e, t) { var a = t.node; return a.type === Vt ? "database.svg" : a.type === zt ? "table.svg" : "column.svg" }, imagePath: "treeIcons/", lazyLoad: function(e, t) { if (t.node.type === Vt) { var a = { datasource: t.node.data.datasource, database: t.node.data.database };
                                        t.result = Ut.getTables(a).then(function(e) { if (e.success) { var t = e.data; return t.forEach(function(e) { e.key = e.table, e.title = e.table, e.lazy = !0, e.folder = !0 }), t } }) || [] } if (t.node.type === zt) { var n = { datasource: t.node.data.datasource, database: t.node.data.database, table: t.node.data.table };
                                        t.result = Ut.getColumns(n).then(function(e) { var t = e.data; return t.forEach(function(e) { e.key = e.name, e.title = e.name, e.lazy = !1, e.folder = !1 }), t }) || [] } }, dblclick: k });
                            _(e), I() } }, [t, a, k, T, I]); var N = Object(n.useCallback)(function(e) { if (e) { j(!0); var n = { datasource: a, keyword: e };
                                Ut.search(n).then(function(e) { if (e.success) { var t = e.data;
                                        t.forEach(function(e) { e.key = e.name, e.title = e.name, e.lazy = !0, e.folder = !0 }), g(t), j(!1) } }) } else T && T.reload(t) }, [T, a, t, j]),
                        A = Object(n.useCallback)(function() { T && T.reload(t) }, [T, t]),
                        w = Object(n.useCallback)(function(e) { if (e) { var t = { datasource: a, keyword: e };
                                T && T.reload(Ut.search(t).then(function(e) { var t = e.data; return t.forEach(function(e) { e.key = e.name, e.title = e.type === Vt ? e.database : e.table, e.lazy = !0, e.folder = !0 }), t })).done(function(e) { e.length }) } }, [T, a]); return r.a.createElement("div", { className: O }, r.a.createElement(Qn, { list: E, onSearch: N, onSelectOne: w, onClear: A, isLoading: x }), u ? r.a.createElement(zn, null) : r.a.createElement(Fa.a, { autoHide: !0, className: t.length ? b.treeOuter : b.hide }, r.a.createElement("div", { id: "elementTree", style: { flex: 1 } }))) }),
                Kn = Object(u.a)(function(e) { return Object(s.a)({ ok: { boxShadow: "none", color: e.color.darkGray, border: "1px solid ".concat(e.color.midGray), "&:hover": { color: e.color.darkGray, border: "1px solid ".concat(e.color.midGray) } } }) }),
                Xn = function(e) { var t = e.children,
                        a = Kn(e); return r.a.createElement(A.a, Object.assign({}, e, { className: a.ok }), t) },
                Jn = Object(u.a)(function(e) { return Object(s.a)({ ok: { boxShadow: "none", color: "#FFF", backgroundColor: e.color.main, "&:hover": { color: "#fff", backgroundColor: e.color.main } }, disabled: { background: e.color.secondary } }) }),
                $n = function(e) { var t = e.children,
                        a = Jn(e); return r.a.createElement(A.a, Object.assign({}, e, { className: a.ok, classes: { disabled: a.disabled } }), t) },
                Zn = a(664),
                er = Object(u.a)(function(e) { return Object(s.a)({ title: { borderTop: "4px solid ".concat(e.color.main) } }) }),
                tr = function(e) { var t = e.children,
                        a = er(e); return r.a.createElement(Zn.a, Object.assign({}, e, { className: a.title }), t) },
                ar = a(665),
                nr = a(666),
                rr = a(685),
                cr = Object(u.a)(function(e) { return Object(s.a)({ paper: { minWidth: 400, maxHeight: 600, tabindex: 1, overflow: "visible" }, log: { padding: "8px 4px" } }) }),
                or = function(e) { var t = e.title,
                        a = e.open,
                        c = e.content,
                        o = e.actions,
                        l = e.onClose,
                        i = e.className,
                        s = e.onEnter,
                        u = e.dialogDisableBackdropClick,
                        d = cr(e),
                        f = Object(n.useCallback)(function(e) { e.target === e.currentTarget && 13 === e.keyCode && (s && s(), console.log(1)) }, [s]); return r.a.createElement(rr.a, { open: a, classes: { paper: d.paper }, onClose: l, PaperProps: { tabIndex: 1, onKeyDown: f }, disableEnforceFocus: !0, disableBackdropClick: u }, r.a.createElement(tr, { id: "confirmation-dialog-title" }, t), r.a.createElement(ar.a, { className: i && i.DialogContent }, c), r.a.createElement(nr.a, null, o)) },
                lr = function(e) { var t = e.open,
                        a = e.onOk,
                        n = e.onCancel; return r.a.createElement(or, { title: "\u53d6\u6d88\u6536\u85cf\u786e\u8ba4", open: t, content: r.a.createElement("p", null, "\u662f\u5426\u786e\u5b9a\u53d6\u6d88\u8be5\u6536\u85cf\uff1f"), actions: r.a.createElement(r.a.Fragment, null, r.a.createElement($n, { onClick: a, autoFocus: !0 }, "\u786e\u5b9a"), r.a.createElement(Xn, { onClick: n }, "\u53d6\u6d88")), onClose: n }) },
                ir = Object(u.a)(function(e) { return Object(s.a)({ root: { flex: 1, display: "flex", flexDirection: "column", padding: "8px", overflow: "hidden" }, heading: {}, treeOuter: { flex: 1, marginTop: "8px", overflow: "auto", display: "flex", "&>div:nth-child(1)": { display: "flex" } }, hide: { display: "none" }, rightMenu: { zIndex: 1301, boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)", border: "none!important", paddingTop: "8px", paddingBottom: "8px", width: "100px" }, cmLi: { "&>div.ui-menu-item-wrapper": { paddingLeft: "16px", paddingRight: "16px", paddingTop: "4px", paddingBottom: "4px", textAlign: "left", border: "none" }, "&>div.ui-state-active": { background: "rgba(0, 0, 0, 0.08)", border: "none", color: "#666", paddingLeft: "16px", paddingRight: "16px", paddingTop: "4px", paddingBottom: "4px", margin: 0 } } }) }),
                sr = Object(ka.a)(Object(D.b)(function(e) { var t = e.data; return { datasource: t.datasource, favoriteTreeData: t.favoriteTreeData, tableSaveLoading: t.tableSaveLoading } }, function(e) { var t = se,
                        a = Ve,
                        n = $e; return Object(x.a)({ getPartition: function(t, a, n) { e(xe({ db: a, table: n })), e(Ee({ source: t, db: a, table: n })), e(ge({ source: t, db: a, table: n })) } }, Object(_.b)({ appendSql: a, getFavoriteDatabases: t, insertSql: n }, e)) }))(function(e) { var t = e.className,
                        a = e.getFavoriteDatabases,
                        c = void 0 === a ? P : a,
                        o = e.tableSaveLoading,
                        l = e.getPartition,
                        i = e.insertSql,
                        s = ir(e),
                        u = e.datasource,
                        d = e.favoriteTreeData,
                        b = Object(n.useState)(""),
                        p = Object(S.a)(b, 1)[0],
                        m = Object(n.useState)([]),
                        E = Object(S.a)(m, 2),
                        g = E[0],
                        O = E[1],
                        h = Object(n.useState)(null),
                        v = Object(S.a)(h, 2),
                        x = v[0],
                        j = v[1],
                        y = Object(n.useState)(!1),
                        C = Object(S.a)(y, 2),
                        T = C[0],
                        _ = C[1],
                        k = Object(n.useState)(!1),
                        I = Object(S.a)(k, 2),
                        N = I[0],
                        A = I[1],
                        w = Object(n.useState)(),
                        R = Object(S.a)(w, 2),
                        L = R[0],
                        D = R[1],
                        G = Object(f.a)(s.root, t),
                        F = Object(n.useCallback)(function(e, t) { return t.node.type === zt ? (i("".concat(t.node.data.database, ".").concat(t.node.data.table)), !1) : t.node.type === Yt ? (i(t.node.data.column), !1) : (i(t.node.data.name), !1) }, [i]),
                        U = Object(n.useCallback)(function() { La()("#tableFavorites").contextmenu({ delegate: ".fancytree-title", addClass: s.rightMenu, menu: [{ title: "\u53d6\u6d88\u6536\u85cf", cmd: Kt, addClass: s.cmLi }, { title: "\u8868\u4fe1\u606f", cmd: ea, addClass: s.cmLi }], beforeOpen: function(e, t) { var a = La.a.ui.fancytree.getNode(t.target); if (a.type !== zt) return !1;
                                    a.setActive() }, select: function(e, t) { e.stopPropagation(); var a = La.a.ui.fancytree.getNode(t.target); switch (t.cmd) {
                                        case Kt:
                                            var n = { datasource: u, database: a.data.database, table: a.data.table };
                                            A(!0), D(n); break;
                                        case ea:
                                            l(u, a.data.database, a.data.table) } } }, function() {}) }, [s.cmLi, u, s.rightMenu, l]);
                    Object(n.useEffect)(function() { if (x) x.reload(d);
                        else { var e = Object(Da.createTree)("#tableFavorites", { extensions: ["edit", "filter"], source: d, tabindex: "", titlesTabbable: !0, toggleEffect: !1, checkbox: !1, autoScroll: !0, escapeTitles: !0, tooltip: !0, strings: { loading: "\u8f7d\u5165\u4e2d...", loadError: "\u8f7d\u5165\u6811\u6570\u636e\u51fa\u9519!", moreData: "More...", noData: "\u6ca1\u6709\u6570\u636e." }, icon: function(e, t) { var a = t.node; return a.type === Vt ? "database.svg" : a.type === zt ? "table.svg" : "column.svg" }, imagePath: "treeIcons/", lazyLoad: function(e, t) { if (t.node.type === Vt) { var a = { datasource: t.node.data.datasource, database: t.node.data.database };
                                        t.result = Ut.getFavoriteTables(a).then(function(e) { if (e.success) { var t = e.data; return t.forEach(function(e) { e.key = e.table, e.title = e.table, e.lazy = !0, e.folder = !0 }), t } }) || [] } if (t.node.type === zt) { var n = { datasource: t.node.data.datasource, database: t.node.data.database, table: t.node.data.table };
                                        t.result = Ut.getColumns(n).then(function(e) { if (e.success) { var t = e.data; return t.forEach(function(e) { e.key = e.name, e.title = e.name, e.lazy = !1, e.folder = !1 }), t } }) || [] } }, dblclick: F });
                            U(), j(e) } }, [d, x, u, F, p, U]); var B = Object(n.useCallback)(function(e) { if (e) { var t = { datasource: u, keyword: e };
                                x && x.reload(Ut.searchSaved(t).then(function(e) { var t = e.data; return t.forEach(function(e) { e.key = e.name, e.title = e.type === Vt ? e.database : e.table, e.lazy = !0, e.folder = !0 }), t })).done(function(e) { e.length }) } }, [x, u]),
                        H = Object(n.useCallback)(function() { x && x.reload(d) }, [x, d]),
                        q = Object(n.useCallback)(function(e) { if (e) { _(!0); var t = { datasource: u, keyword: e };
                                Ut.searchSaved(t).then(function(e) { if (e.success) { var t = e.data;
                                        t.forEach(function(e) { e.key = e.name, e.title = e.name, e.lazy = !0, e.folder = !0 }), O(t), _(!1) } }) } else x && x.reload(d) }, [x, u, d, _]),
                        M = Object(n.useCallback)(function() { Ut.cancelFavoritetables(L).then(function(e) { e.success && (oa.notify({ variant: "success", content: "\u53d6\u6d88\u6210\u529f\uff01" }), c(u)) }), A(!1) }, [L, u, c]),
                        Q = Object(n.useCallback)(function() { A(!1) }, []); return r.a.createElement("div", { className: G }, r.a.createElement(Qn, { list: g, onSearch: q, onSelectOne: B, onClear: H, isLoading: T }), r.a.createElement(Fa.a, { autoHide: !0, className: o ? s.hide : s.treeOuter }, r.a.createElement("div", { id: "tableFavorites", style: { flex: 1 } })), r.a.createElement(zn, { className: o ? "" : s.hide }), r.a.createElement(lr, { open: N, onOk: M, onCancel: Q })) }),
                ur = Object(u.a)(function(e) { return Object(s.a)({ root: { flex: 1, marginTop: "0px", display: "flex", flexDirection: "column", overflow: "hidden" }, heading: {}, tab: { minWidth: 0, flex: 1, background: "white", maxWidth: "unset", fontSize: "14px" }, hide: { display: "none" }, meta: { flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", border: "1px solid ".concat(e.color.midGray) } }) }),
                dr = Object(ka.a)(Object(D.b)(function(e) { return { query_tab: e.data.query_tab } }, function(e) { var t = Oe; return Object(x.a)({}, Object(_.b)({ changeQueryTab: t }, e)) }))(function(e) { var t = ur(e),
                        a = e.query_tab,
                        c = e.changeQueryTab,
                        o = Object(n.useCallback)(function(e, t) { c(t) }, [c]); return r.a.createElement("div", { className: t.root }, r.a.createElement(Aa.a, { value: a, onChange: o, indicatorColor: "primary", textColor: "primary" }, r.a.createElement(wa.a, { label: "\u6240\u6709\u7684\u8868", classes: { root: t.tab } }), r.a.createElement(wa.a, { label: "\u6536\u85cf\u7684\u8868", classes: { root: t.tab } })), r.a.createElement("div", { className: a === na ? t.hide : t.meta }, r.a.createElement(Wn, null)), r.a.createElement("div", { className: a === aa ? t.hide : t.meta }, r.a.createElement(sr, null))) }),
                fr = a(242),
                br = a.n(fr),
                pr = a(616),
                mr = a(324),
                Er = a.n(mr),
                gr = a(325),
                Or = a.n(gr),
                hr = Object(u.a)(function(e) { return Object(s.a)({ input: { marginLeft: 8, flex: 1 }, iconButton: { padding: 0 }, root: { padding: "2px 4px", display: "flex", alignItems: "center", border: "1px solid #cccccc", borderRadius: "4px" }, icon: {} }) }),
                vr = function(e) { var t = e.searchKeyword,
                        a = e.changeKeyword,
                        c = e.className,
                        o = hr(e),
                        l = Object(f.a)(o.root, c),
                        i = Object(n.useCallback)(function(e) { a(e.target.value) }, [a]),
                        s = Object(n.useCallback)(function(e) { a("") }, [a]),
                        u = Object(n.useCallback)(function(e) { e.stopPropagation() }, []); return r.a.createElement("div", { className: l }, r.a.createElement(N.a, { className: o.iconButton, "aria-label": "Menu" }, r.a.createElement(Er.a, { className: o.icon })), r.a.createElement(pr.a, { className: o.input, value: t, placeholder: "\u4ece\u7ed3\u679c\u4e2d\u641c\u7d22...", onChange: i, onKeyDown: u }), r.a.createElement(N.a, { className: o.iconButton, "aria-label": "Search", onClick: s }, r.a.createElement(Or.a, { className: o.icon }))) },
                xr = T()(Object(D.b)(null, function(e) { return Object(x.a)({}, Object(_.b)({}, e)) }))(vr),
                Sr = a(42),
                jr = a.n(Sr);

            function yr(e) { return function e(t, a) { var n = []; var r; for (var c = 0; c < t.length; c++)
                        if (t[c].parentId === a) { var o = t[c];
                            (r = e(t, t[c].id)).length > 0 && (o.children = r), n.push(o) } return n }(jr()(e), "#") } a(581); var Cr = function(e) { var t = e.deleteText,
                    a = e.onOk,
                    n = e.onCancel,
                    c = e.open; return r.a.createElement(or, { title: "\u5220\u9664\u786e\u8ba4", open: c, content: r.a.createElement("p", null, t), actions: r.a.createElement(r.a.Fragment, null, r.a.createElement($n, { onClick: a, autoFocus: !0 }, "\u786e\u5b9a"), r.a.createElement(Xn, { onClick: n }, "\u53d6\u6d88")), onClose: n }) };

            function Tr(e, t) { if (o = ":", t.slice(0, o.length) === o) { for (var a = t.substr(1).split(" "), n = !1, r = 0; r < a.length; r++) { var c = a[r]; if (!_r(c) && ("branch" === (n = Rr(e, c)) || n)) break } return n } var o; if (t.indexOf(" ") >= 0) { for (var l = t.split(" "), i = !1, s = 0; s < l.length; s++) { var u = l[s]; if (!_r(u) && ("branch" === (i = Ir(e, u)) || i)) break } return i } return Ir(e, t) }

            function _r(e) { return "string" == typeof e && !e.trim() || "undefined" == typeof e || null === e } var kr = "<mark>$&</mark>";

            function Ir(e, t) { if (e.data.id === t) return e.titleWithHighlight = wr(e.title).replace(new RegExp("(" + t + ")", "g"), kr), !0; var a = void 0; try { a = new RegExp(t, "ig") } catch (r) { a = new RegExp(t.replace(/[-[\]\/{}()*+?.\\^$|]/g, "\\$&"), "ig") } var n = a.test(e.title); return n && (e.titleWithHighlight = wr(e.title).replace(a, kr)), n && e.isFolder() ? "branch" : n } var Nr = /[&<>"'\/]/g,
                Ar = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "/": "&#x2F;" };

            function wr(e) { return ("" + e).replace(Nr, function(e) { return Ar[e] }) }

            function Rr(e, t) { if (e.data.id === t) return e.titleWithHighlight = wr(e.title).replace(new RegExp("(" + t + ")", "g"), kr), !0 } var Lr = a(194),
                Dr = a(327),
                Gr = a.n(Dr),
                Fr = Object(u.a)(function(e) { return Object(s.a)({ paper: { maxHeight: 600, borderTop: "".concat(e.color.main, " 2px solid") }, log: { padding: "8px 4px" }, formControl: { margin: e.spacing(1), minWidth: 300, maxWidth: 600, flexDirection: "row" }, select: { width: "400px", marginLeft: "10px", display: "flex", flexDirection: "column" }, DialogContent: { height: 380 } }) }),
                Pr = T()(Object(D.b)(function(e) { return { colleagues: e.data.colleagues } }, function(e) { return Object(x.a)({}, Object(_.b)({}, e)) }))(function(e) { var t = e.onCancel,
                        a = e.onOk,
                        c = e.colleagues,
                        o = e.open,
                        l = Fr(e),
                        i = Object(n.useState)(-1),
                        s = Object(S.a)(i, 2),
                        u = s[0],
                        d = s[1],
                        f = Object(n.useState)(""),
                        b = Object(S.a)(f, 1)[0],
                        p = Object(n.useRef)(),
                        m = Object(n.useCallback)(function() {-1 !== u && (a(u), d(-1)) }, [a, u]),
                        E = Object(n.useCallback)(function(e) { d(-1), t() }, [t]),
                        g = Object(n.useCallback)(function(e) { d(e.value) }, [d]),
                        O = Object(n.useCallback)(function(e) { p.current.state.menuIsOpen || 13 === e.keyCode && m() }, [m]),
                        h = Object(n.useMemo)(function() { return c.filter(function(e) { return r.a.createElement("span", { onMouseDown: function(e) { e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation() } }, e.fullName.indexOf(b.toLowerCase()) > -1) }).map(function(e) { return { value: e.id, label: e.fullName } }) }, [b, c]); return r.a.createElement(or, { className: l, title: "\u5206\u4eab", open: o, content: r.a.createElement(r.a.Fragment, null, r.a.createElement(Ta.a, { required: !0, className: l.formControl }, r.a.createElement("span", { style: { marginRight: "10px", alignSelf: "center", fontSize: "14px" } }, "\u540c\u4e8b"), r.a.createElement("span", { style: { alignSelf: "center", fontSize: "14px" } }, ":"), r.a.createElement(Lr.a, { onMouseDown: function(e) { e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation() }, options: h, onChange: g, theme: function(e) { return Object(x.a)({}, e, { colors: Object(x.a)({}, e.colors, { primary: "#00B3A4" }) }) }, className: l.select, placeholder: "\u8bf7\u8f93\u5165...", onKeyDown: O, ref: p }))), actions: r.a.createElement(r.a.Fragment, null, r.a.createElement(Xn, { onClick: E }, "\u53d6\u6d88"), r.a.createElement($n, { onClick: m, disabled: -1 === u, autoFocus: !0 }, r.a.createElement(Gr.a, null), "\u5206\u4eab")), onClose: t, onEnter: m }) }),
                Ur = a(328),
                Br = a.n(Ur),
                Hr = Object(u.a)(function(e) { return Object(s.a)({ root: { flex: 1, display: "flex", flexDirection: "column", padding: "8px", overflow: "hidden" }, heading: {}, treeOuter: { flex: 1, marginTop: "8px", overflow: "auto", display: "flex", "&>div:nth-child(1)": { display: "flex" } }, searchStyle: { width: "100%", padding: "8px 8px 0 8px", background: "transparent" }, nodeSelect: { color: "red" }, rightMenu: { zIndex: 1301, boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)", border: "none!important", paddingTop: "8px", paddingBottom: "8px", width: "100px" }, cmLi: { "&>div.ui-menu-item-wrapper": { paddingLeft: "16px", paddingRight: "16px", paddingTop: "4px", paddingBottom: "4px", textAlign: "left", border: "none" }, "&>div.ui-state-active": { background: "rgba(0, 0, 0, 0.08)", border: "none", color: "#666", paddingLeft: "16px", paddingRight: "16px", paddingTop: "4px", paddingBottom: "4px", margin: 0 } }, updateButton: { position: "absolute", top: "45px", right: "0px", zIndex: 2 } }) }),
                qr = Object(ka.a)(Object(D.b)(function(e) { var t = e.data; return { sqlSaveData: t.sqlSaveData, newFolderId: t.newFolderId } }, function(e) { var t = ue,
                        a = de,
                        n = fe,
                        r = be,
                        c = me,
                        o = Ae,
                        l = ze; return Object(x.a)({}, Object(_.b)({ getSaveFiles: t, getOneFile: l, deleteSaveSql: a, renameSqlSave: n, newSaveFolder: r, getColleagues: c, moveSaveFile: o }, e)) }))(function(e) { var t = e.className,
                        a = e.getSaveFiles,
                        c = void 0 === a ? P : a,
                        o = e.getOneFile,
                        l = void 0 === o ? P : o,
                        i = e.deleteSaveSql,
                        s = void 0 === i ? P : i,
                        u = e.renameSqlSave,
                        d = void 0 === u ? P : u,
                        b = e.newSaveFolder,
                        p = void 0 === b ? P : b,
                        m = e.getColleagues,
                        E = void 0 === m ? P : m,
                        g = e.sqlSaveData,
                        O = e.newFolderId,
                        h = e.moveSaveFile,
                        v = Hr(e),
                        j = Object(n.useState)({ searchKeyword: "", deleteOpen: !1, shareOpen: !1, deleteText: "", contextMenuNode: null, elementTree: null, contextMenuName: "", contextMenuId: null, needExpandNode: null, needUpdata: !1 }),
                        y = Object(S.a)(j, 2),
                        C = y[0],
                        T = y[1],
                        _ = Object(f.a)(v.root, t),
                        k = Object(n.useCallback)(function(e, t) { t.node.type !== Wt.FILE || l(t.node.data.id) }, [l]),
                        I = Object(n.useCallback)(function() { La()("#SqlSaveData").contextmenu({ delegate: ".fancytree-title", addClass: v.rightMenu, menu: [{ title: "\u5220\u9664", cmd: Jt, addClass: v.cmLi }, { title: "\u91cd\u547d\u540d", cmd: $t, addClass: v.cmLi }, { title: "\u5206\u4eab", cmd: Zt, addClass: v.cmLi, disabled: function(e, t) { return La.a.ui.fancytree.getNode(t.target).type === Wt.FOLDER } }, { title: "\u65b0\u5efa\u6587\u4ef6\u5939", cmd: Xt, addClass: v.cmLi, disabled: function(e, t) { return La.a.ui.fancytree.getNode(t.target).type === Wt.FILE } }], beforeOpen: function(e, t) { var a = La.a.ui.fancytree.getNode(t.target);
                                    a.type, Wt.FILE, T(function(e) { return Object(x.a)({}, e, { contextMenuNode: a }) }), a.setActive() }, select: function(e, t) { e.stopPropagation(); var a = La.a.ui.fancytree.getNode(t.target),
                                        n = t.cmd,
                                        r = a.data.id; switch (n) {
                                        case Jt:
                                            var c = a.parent; if (a.type === Wt.FILE) return void T(function(e) { return Object(x.a)({}, e, { deleteOpen: !0, deleteText: "\u60a8\u786e\u8ba4\u5220\u9664\u8be5sql\u6587\u4ef6\u5417", needExpandNode: c }) }); if (a.type === Wt.FOLDER) return void T(function(e) { return Object(x.a)({}, e, { deleteOpen: !0, deleteText: "\u60a8\u786e\u8ba4\u5220\u9664\u8be5\u6587\u4ef6\u5939\u5417\uff1f\u5176\u5305\u542b\u7684\u6587\u4ef6\u548c\u6587\u4ef6\u5939\u4f1a\u4e00\u5e76\u5220\u9664", needExpandNode: c }) }); break;
                                        case $t:
                                            if (-1 === r) return void oa.notify({ variant: "warning", content: "\u5bf9\u4e0d\u8d77\uff0c\u8bf7\u4e0d\u8981\u91cd\u547d\u540d\u6839\u6587\u4ef6\u5939\uff01" });
                                            setTimeout(function() { a.editStart(), a.li.childNodes[0].childNodes[2].childNodes[0].select() }, 800); break;
                                        case Xt:
                                            a.editCreateNode("child", "\u65b0\u5efa\u6587\u4ef6\u5939"); var o = { parentId: r, type: Wt.FOLDER, name: "\u65b0\u5efa\u6587\u4ef6\u5939", content: "", isEffective: "T" };
                                            p(o), T(function(e) { return Object(x.a)({}, e, { needExpandNode: a }) }); break;
                                        case Zt:
                                            T(function(e) { return Object(x.a)({}, e, { shareOpen: !0 }) }), E() } } }, function() {}) }, [p, v.rightMenu, v.cmLi, E]);
                    Object(n.useEffect)(function() {!g.length && c() }, [g, c]); var A = Object(n.useMemo)(function() { return yr(g) }, [g]);
                    Object(n.useEffect)(function() { if (!C.elementTree) { var e = Object(Da.createTree)("#SqlSaveData", { extensions: ["edit", "filter", "dnd5"], source: A, dnd5: { preventVoidMoves: !0, preventRecursion: !0, autoExpandMS: 400, dragStart: function(e, t) { return !0 }, dragEnter: function(e, t) { return !0 }, dragDrop: function(e, t) { if ("over" === t.hitMode || e.parent.data.id) return new Promise(function(a, n) { var r = { resolve: function() { t.otherNode.moveTo(e, t.hitMode) }, reject: n };
                                            h(t.otherNodeData.data.id, "over" === t.hitMode ? e.data.id : e.parent.data.id, t.otherNode.type, r) });
                                        oa.notify({ variant: "error", content: "\u6211\u7684\u6536\u85cf\u4e3a\u6839\u76ee\u5f55\uff01" }) } }, edit: { adjustWidthOfs: 200, beforeEdit: function(e, t) { if (-1 === t.node.data.id) return !1 }, edit: function(e, t) {}, beforeClose: function(e, t) { console.log(t) }, save: function(e, t) { setTimeout(function() { if (t.orgTitle !== t.node.title) { var e = { id: t.node.data.id, org_name: t.orgTitle, new_name: t.node.title };
                                                T(function(e) { return Object(x.a)({}, e, { needExpandNode: t.node }) }), d(e) } }, 500) }, close: function(e, t) { console.log("close"), t.save && La()(t.node.span).addClass("pending") } }, quicksearch: !0, filter: { autoApply: !0, autoExpand: !0, counter: !1, fuzzy: !1, hideExpandedCounter: !0, hideExpanders: !1, highlight: !0, leavesOnly: !1, nodata: !0, mode: "hide" }, tabindex: "", titlesTabbable: !0, toggleEffect: !1, checkbox: !1, autoScroll: !0, escapeTitles: !0, tooltip: !0, strings: { loading: "\u8f7d\u5165\u4e2d...", loadError: "\u8f7d\u5165\u6811\u6570\u636e\u51fa\u9519!", moreData: "More...", noData: "\u6ca1\u6709\u6570\u636e" }, icon: function(e, t) { var a = t.node; return a.type === Wt.FOLDER ? "folder-close.svg" : a.type === Wt.FILE ? "sql.svg" : "unknow.svg" }, imagePath: "treeIcons/", click: k }); return T(function(t) { return Object(x.a)({}, t, { elementTree: e }) }), void I() } C.needExpandNode ? C.elementTree.reload(A).done(function() { C.elementTree.visit(function(e) { if (e.data.id === C.needExpandNode.data.id) return C.elementTree.rootNode.visit(function(e) { e.setExpanded(!0) }), e.setExpanded(!0), O ? C.elementTree.visit(function(e) { e.data.id !== O || e.setActive() }) : e.setActive(!0), !1 }) }) : C.needUpdata ? C.elementTree.reload(A).done(function() { C.elementTree.rootNode.visit(function(e) { e.setExpanded(!0) }) }) : C.elementTree.reload(A) }, [A, k, c, O, d, C.elementTree, C.needExpandNode, I, C.needUpdata, h]); var w = Object(n.useCallback)(function(e) { T(function(t) { return Object(x.a)({}, t, { searchKeyword: e }) }), e ? C.elementTree.filterBranches(function(t) { return Tr(t, e) }) : C.elementTree.clearFilter() }, [C.elementTree, T]),
                        R = Object(n.useCallback)(function() { T(function(e) { return Object(x.a)({}, e, { deleteOpen: !1 }) }), s(C.contextMenuNode.data.id) }, [C.contextMenuNode, s]),
                        L = Object(n.useCallback)(function() { T(function(e) { return Object(x.a)({}, e, { deleteOpen: !1 }) }) }, []),
                        D = Object(n.useCallback)(function(e) { T(function(e) { return Object(x.a)({}, e, { shareOpen: !1 }) }); var t = { userId: e, id: C.contextMenuNode.data.id };
                            Ut.shareSql(t).then(function(e) { e.success && oa.notify({ variant: "success", content: "\u5206\u4eab\u6210\u529f" }) }) }, [C.contextMenuNode]),
                        G = Object(n.useCallback)(function() { T(function(e) { return Object(x.a)({}, e, { shareOpen: !1 }) }) }, []),
                        F = Object(n.useCallback)(function() { T(function(e) { return Object(x.a)({}, e, { needUpdata: !0 }) }), c() }, [c]); return r.a.createElement("div", { className: _, style: { position: "relative" } }, r.a.createElement(xr, { searchKeyword: C.searchKeyword, changeKeyword: w }), r.a.createElement(Wa.a, { title: "\u70b9\u51fb\u5237\u65b0", className: v.updateButton }, r.a.createElement(N.a, { color: "primary", onClick: F }, r.a.createElement(Br.a, null))), r.a.createElement(Fa.a, { autoHide: !0, className: v.treeOuter }, r.a.createElement("div", { id: "SqlSaveData", style: { flex: 1 } })), r.a.createElement(Cr, { deleteText: C.deleteText, onOk: R, onCancel: L, open: C.deleteOpen }), r.a.createElement(Pr, { onOk: D, onCancel: G, open: C.shareOpen })) }),
                Mr = Object(u.a)(function(e) { return Object(s.a)({ root: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", paddingLeft: "8px" }, heading: {}, summary: { background: e.color.main, color: "white" }, expandIcon: { color: "white" }, query: { padding: "8px", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }, expansion: { overflow: "hidden", display: "flex", flexDirection: "column" }, tab: { minWidth: 0, flex: 1, background: e.color.secondary, maxWidth: "unset" }, selected: { color: "white!important", background: e.color.main }, hide: { display: "none" }, queryOuter: { display: "flex", flex: 1, flexDirection: "column" }, queryButton: { color: "#333333", width: "100%", height: "46px", fontSize: "16px", backgroundColor: "#F2F2F2", display: "flex", justifyContent: "space-between", borderLeft: "".concat(e.color.main, " 6px solid"), boxShadow: "none", borderRadius: 0, fontWeight: "bold" }, one: { width: "14px", height: "14px", color: "#fff", backgroundColor: e.color.main, fontSize: "12px", borderRadius: "7px", display: "flex", justifyContent: "center", marginRight: "5px", alignSelf: "center" }, dataSource: { fontSize: "14px", display: "flex", color: "#333333", marginBottom: "10px" }, expand: { padding: "12px 4px 4px 4px", display: "flex", flexDirection: "column", flex: 1 }, expands: { padding: "12px 4px 4px 4px", display: "flex", flexDirection: "column" }, paddingTop: { paddingTop: "4px" } }) }),
                Qr = function(e) { var t = e.className,
                        a = e.resizableWidth,
                        c = Object(n.useState)(!0),
                        o = Object(S.a)(c, 2),
                        l = o[0],
                        i = o[1],
                        s = Object(n.useState)(!1),
                        u = Object(S.a)(s, 2),
                        d = u[0],
                        b = u[1],
                        p = Mr(e),
                        m = Object(f.a)(p.root, t),
                        E = Object(n.useCallback)(function(e, t) { t && !e && b(!1), i(!e) }, []),
                        g = Object(n.useCallback)(function(e, t) { e && !t && i(!1), b(!t) }, []); return r.a.createElement("div", { className: "".concat(m) }, r.a.createElement("div", { className: l ? p.expand : p.expands, style: { borderBottom: "solid #F2F2F2 1px" } }, r.a.createElement(A.a, { variant: "contained", className: p.queryButton, onClick: function(e) { return E(l, d) } }, "\u67e5\u8be2", l ? r.a.createElement(br.a, null) : r.a.createElement(it.a, null)), r.a.createElement("div", { className: l ? p.queryOuter : p.hide }, r.a.createElement(xa, { className: p.query }, r.a.createElement("div", { className: p.dataSource }, r.a.createElement("div", { className: p.one }, "1"), "\u9009\u62e9\u6570\u636e\u6e90"), r.a.createElement(Na, null), r.a.createElement("div", { className: p.dataSource }, r.a.createElement("div", { className: p.one }, "2"), "\u6570\u636e\u6e90\u5217\u8868"), r.a.createElement(dr, { resizableWidth: a })))), r.a.createElement("div", { className: "".concat(d ? p.expand : p.expands, " ").concat(p.paddingTop) }, r.a.createElement(A.a, { variant: "contained", className: p.queryButton, onClick: function(e) { return g(l, d) } }, "\u6536\u85cf\u5939", d ? r.a.createElement(br.a, null) : r.a.createElement(it.a, null)), r.a.createElement("div", { className: d ? p.queryOuter : p.hide }, r.a.createElement(xa, { className: p.query }, r.a.createElement(qr, null))))) },
                Vr = a(350),
                zr = a.n(Vr),
                Yr = a(351),
                Wr = a.n(Yr),
                Kr = a(181),
                Xr = Object(u.a)(function(e) { return Object(s.a)({ root: { border: e.border.baseBorder, borderRadius: "3px" }, select: { paddingLeft: "16px", userSelect: "auto" } }) }),
                Jr = function(e) { var t = Xr(e); return r.a.createElement(_a.a, Object.assign({}, e, { disableUnderline: !0, classes: Object(x.a)({}, t, { root: t.root, select: t.select }) })) },
                $r = a(683),
                Zr = a(686),
                ec = a(668),
                tc = a(121),
                ac = a.n(tc),
                nc = Object(u.a)(function(e) { return Object(s.a)({ root: { paddingLeft: "18px", paddingTop: "4px" }, formControl: { marginRight: e.spacing(2), minWidth: 120 }, formControlGroup: { width: "113px", height: "40px" }, formControlEngin: { width: "147px", height: "40px" }, form: { display: "flex", flexWrap: "wrap" }, group: { flexDirection: "row", alignItems: "center", paddingLeft: "16px" }, engine: { display: "flex" }, account: { display: "flex", justifyContent: "left", alignItems: "center" }, execute: { display: "flex", alignItems: "center" }, help: { color: e.color.yellow } }) }),
                rc = Object(ka.a)(Object(D.b)(function(e) { var t = e.user; return { engines: t.engines, engine: t.engine, engineRoleMap: t.engineRoleMap, role: t.role, accountType: t.accountType, personEngines: t.personEngines, personEngine: t.personEngine, jurisdiction: t.jurisdiction } }, function(e) { var t = Y,
                        a = W,
                        n = $; return Object(x.a)({ changeType: function(t) { e(t !== Ht ? K(t) : X(!0)) } }, Object(_.b)({ getEngineRole: function() { return z() }, getJurisdiction: function() { return ee() }, getPersonRight: function(e) { return X(e) }, changeEngine: t, changeRole: a, getHiveAccount: n }, e)) }))(function(e) { var t = e.getEngineRole,
                        a = void 0 === t ? P : t,
                        c = e.getHiveAccount,
                        o = void 0 === c ? P : c,
                        l = e.engines,
                        i = e.engine,
                        s = e.engineRoleMap,
                        u = e.role,
                        f = e.changeEngine,
                        b = void 0 === f ? P : f,
                        p = e.changeRole,
                        m = void 0 === p ? P : p,
                        E = e.accountType,
                        g = e.changeType,
                        O = void 0 === g ? P : g,
                        h = e.getPersonRight,
                        v = void 0 === h ? P : h,
                        x = e.personEngines,
                        S = e.personEngine,
                        j = e.jurisdiction,
                        C = nc(e),
                        T = Object(n.useCallback)(function(e) { var t = e.target.value; if (E === Bt) document.cookie = "publicEngine=".concat(t), b(t);
                            else { var a = ta.HIVE;
                                t === Gt.MYSQL && (a = ta.MYSQL), t === Gt.SQLSERVER && (a = ta.SQLSERVER), o(a, t) } }, [E, b, o]),
                        _ = Object(n.useCallback)(function(e) { var t = e.target.value;
                            m(t) }, [m]),
                        k = Object(n.useCallback)(function(e) { var t = e.target.value;
                            O(t) }, [O]);
                    Object(n.useEffect)(function() { a(), "all" === j && E === Ht ? v(!0) : "only_personal" === j && v(!0) }, [a, v, j, E]); var I = Object(Ua.a)(l),
                        A = i;
                    E === Ht && (I = Object(Ua.a)(x), A = S); var w = function() { return r.a.createElement(ec.a, { value: Ht, control: r.a.createElement($r.a, { color: "primary" }), label: "\u4e2a\u4eba\u8d26\u53f7" }) },
                        R = function() { return s[i] && 0 !== s[i].length ? r.a.createElement(r.a.Fragment, null, r.a.createElement(ec.a, { value: Bt, control: r.a.createElement($r.a, { color: "primary" }), label: "\u7ec4\u8d26\u53f7" }), r.a.createElement(Ta.a, { className: C.formControl, disabled: E === Ht }, r.a.createElement(Jr, { value: u, onChange: _, className: C.formControlGroup }, s[i].map(function(e) { return r.a.createElement(y.a, { key: e, value: e }, e) })))) : null }; return r.a.createElement(d.a, { className: C.root, container: !0 }, r.a.createElement(d.a, { item: !0, className: C.engine }, r.a.createElement(d.a, { container: !0, alignItems: "center" }, r.a.createElement(d.a, { item: !0, className: C.execute }, r.a.createElement(L.a, { variant: "inherit", style: { fontSize: "14px" } }, "\u6267\u884c\u5f15\u64ce"), r.a.createElement(Wa.a, { title: "\u53ef\u6267\u884c\u9009\u4e2d\u7684\u4e00\u6761\u6216\u8005\u591a\u6761SQL" }, r.a.createElement(N.a, null, r.a.createElement(ac.a, { className: C.help }))), r.a.createElement(Ta.a, { className: C.formControl }, r.a.createElement(Jr, { value: A, onChange: T, className: C.formControlEngin }, I && I.map(function(e) { return r.a.createElement(y.a, { key: e, value: e }, e) })))))), r.a.createElement(d.a, { item: !0, xs: !0, className: C.account }, r.a.createElement(Zr.a, { classes: { root: C.group }, value: E, onChange: k }, "only_personal" === j ? w() : "only_hive" === j ? R() : r.a.createElement(r.a.Fragment, null, R(), w()), A === Gt.ROUTER && r.a.createElement(L.a, { variant: "inherit" }, "ROUTER\u81ea\u52a8\u9009\u62e9SQL\u6267\u884c\u5f15\u64ce(PRESTO/SPARK/HIVE)")))) }),
                cc = new(function(e) {
                    function t() { var e, a;
                        Object(_t.a)(this, t); for (var n = arguments.length, r = new Array(n), c = 0; c < n; c++) r[c] = arguments[c]; return (a = Object(kt.a)(this, (e = Object(At.a)(t)).call.apply(e, [this].concat(r)))).formatQuery = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendPost", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/query/formatsql"), data: e }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.executeQuery = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendPost", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/query/submit"), data: e }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.getResult = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendGet", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/query/result/").concat(e) }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.updateOneFile = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendPost", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/file/updateonefile"), data: e }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.saveQuery = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendPost", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/file/saveonefile"), data: e }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.stopQuery = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendGet", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/query/stop/").concat(e) }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.getOneFile = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendGet", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/file/getonefile/").concat(e) }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.stopAllQuery = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendPost", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/query/stopall/"), data: e }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.downloadQuery = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendGet", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt).concat(e) }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.checkdownloadperm = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendGet", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt).concat(e) }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.applayDownload = function(e, n) { return Object(wt.a)(Object(At.a)(t.prototype), "sendPost", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt).concat(n), data: e }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.getUuid = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendPost", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/query/uuid"), data: e }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a } return Object(Nt.a)(t, e), t }(Ft))({}),
                oc = a(329),
                lc = a.n(oc),
                ic = a(316),
                sc = a(679),
                uc = Object(ka.a)(Object(D.b)(function(e) { return {} }, function(e) { var t = nt; return Object(x.a)({}, Object(_.b)({ renameQuery: t }, e)) }))(function(e) { var t = e.className,
                        a = e.type,
                        c = e.renameQuery,
                        o = e.index,
                        l = r.a.createRef(),
                        i = Object(n.useState)(""),
                        s = Object(S.a)(i, 2),
                        u = s[0],
                        f = s[1],
                        b = r.a.useState(null),
                        p = Object(S.a)(b, 2),
                        m = p[0],
                        E = p[1];
                    Object(n.useEffect)(function() { Boolean(m) && l.current.focus() }, [m, l]); var g = Object(n.useCallback)(function(e) { e.stopPropagation(), E(null) }, []),
                        O = Object(n.useCallback)(function(e) { E(null), e.stopPropagation(), c(u, o, a) }, [o, a, u, c]),
                        h = Object(n.useCallback)(function(e) { f(e.target.value) }, []),
                        v = Object(n.useCallback)(function(e) { var t = e.keyCode || e.which || e.charCode;
                            13 === t && O(e), 27 === t && g(e) }, [O, g]); return r.a.createElement(r.a.Fragment, null, r.a.createElement(lc.a, { className: t, onClick: function(e) { return function(e) { e.stopPropagation(), E(e.currentTarget) }(e) } }), r.a.createElement(ic.a, { id: "long-menu", anchorEl: m, keepMounted: !0, autoFocus: !1, open: Boolean(m), onClose: g, PaperProps: { style: { maxHeight: 300, width: 200, padding: "4px" } }, onKeyDown: v }, r.a.createElement(sc.a, { id: "outlined-basic", label: "\u91cd\u547d\u540d\u4e3a\uff1a", margin: "normal", variant: "outlined", value: u, onChange: h, autoFocus: !0, inputRef: l }), r.a.createElement(d.a, { container: !0, direction: "row", justify: "space-around", alignItems: "center" }, r.a.createElement($n, { onClick: O }, "\u786e\u5b9a"), r.a.createElement(Xn, { onClick: g }, "\u53d6\u6d88")))) }),
                dc = a(330),
                fc = a.n(dc),
                bc = a(186),
                pc = a.n(bc),
                mc = a(187),
                Ec = a.n(mc),
                gc = a(185),
                Oc = a.n(gc),
                hc = a(184),
                vc = a.n(hc),
                xc = a(188),
                Sc = a.n(xc),
                jc = Object(u.a)(function(e) { return Object(s.a)({ root: {} }) }),
                yc = function(e) { var t = jc(e),
                        a = e.status,
                        c = e.className,
                        o = Object(f.a)(t.root, c),
                        l = ac.a,
                        i = ""; switch (a) {
                        case Mt.READY:
                            l = fc.a, i = Qt.get(Mt.READY); break;
                        case Mt.RUNNING:
                            l = vc.a, i = Qt.get(Mt.RUNNING); break;
                        case Mt.STOPPED:
                            l = Oc.a, i = Qt.get(Mt.STOPPED); break;
                        case Mt.FINISHED:
                            l = pc.a, i = Qt.get(Mt.STOPPED); break;
                        case Mt.TIMEOUT:
                            l = Ec.a, i = Qt.get(Mt.STOPPED); break;
                        case Mt.FAILED:
                            l = Sc.a, i = Qt.get(Mt.STOPPED) } var s = Object(n.forwardRef)(function(e, t) { return r.a.createElement(l, { className: o, innerRef: t }) }); return r.a.createElement(Wa.a, { title: i }, r.a.createElement(s, null)) },
                Cc = (T()(Object(D.b)(function(e) { return {} }, function(e) { return Object(x.a)({}, Object(_.b)({}, e)) }))(yc), a(331)),
                Tc = a.n(Cc),
                _c = function(e) { var t = e.isRunning,
                        a = e.message,
                        c = e.onOk,
                        o = e.onCancel,
                        l = e.open,
                        i = Object(n.useCallback)(function(e) { c() }, [c]),
                        s = Object(n.useCallback)(function(e) { o() }, [o]); return r.a.createElement(or, { title: "\u5173\u95ed\u786e\u8ba4", open: l, content: r.a.createElement(r.a.Fragment, null, r.a.createElement("p", null, "\u662f\u5426\u786e\u5b9a\u5173\u95ed".concat(a, "\uff1f")), 2 === t ? r.a.createElement("p", { style: { color: "#FF6159" } }, "\u6ce8\u610f\uff1a\u6b63\u5728\u67e5\u8be2\u7684\u4efb\u52a1\u5c06\u4e0d\u4f1a\u7ee7\u7eed\u6267\u884c\uff01") : t ? r.a.createElement("p", { style: { color: "#FF6159" } }, "\u6709\u6b63\u5728\u67e5\u8be2\u7684\u4efb\u52a1\uff0c\u5173\u95ed\u5c06\u4e0d\u4f1a\u7ee7\u7eed\u6267\u884c\uff01") : r.a.createElement("p", null, "\u786e\u8ba4\u5173\u95ed\u5386\u53f2\u6267\u884c\u4efb\u52a1")), actions: r.a.createElement(r.a.Fragment, null, r.a.createElement($n, { onClick: i, autoFocus: !0 }, "\u786e\u5b9a"), r.a.createElement(Xn, { onClick: s }, "\u53d6\u6d88")), onClose: o }) },
                kc = a(13),
                Ic = a.n(kc),
                Nc = a(8),
                Ac = new(function(e) {
                    function t() { var e, a;
                        Object(_t.a)(this, t); for (var n = arguments.length, r = new Array(n), c = 0; c < n; c++) r[c] = arguments[c]; return (a = Object(kt.a)(this, (e = Object(At.a)(t)).call.apply(e, [this].concat(r)))).getRoleBindHost = function() { return Object(wt.a)(Object(At.a)(t.prototype), "sendGet", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/currentUser/role_bind_host") }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.getAvatar = function() { return Object(wt.a)(Object(At.a)(t.prototype), "sendGet", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/currentUser/avatar") }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.getJurisdiction = function() { return Object(wt.a)(Object(At.a)(t.prototype), "sendGet", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/enginerole/userRule") }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.getUserName = function() { return Object(wt.a)(Object(At.a)(t.prototype), "sendGet", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/currentUser/employeeCnName") }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.getRoleEngine = function() { return Object(wt.a)(Object(At.a)(t.prototype), "sendGet", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/enginerole") }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.getDefault = function() { return Object(wt.a)(Object(At.a)(t.prototype), "sendGet", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/enginerole/default") }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.hasPersonRight = function() { return Object(wt.a)(Object(At.a)(t.prototype), "sendGet", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/enginerole/hasPersonPerm") }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.getPersonalEngine = function() { return Object(wt.a)(Object(At.a)(t.prototype), "sendGet", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/enginerole/getpersonalallengine") }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.logout = function() { return Object(wt.a)(Object(At.a)(t.prototype), "sendGet", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/logout") }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.getHiveAccount = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendGet", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/enginerole/hiveaccount/").concat(e) }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.getApplyUrl = function() { return Object(wt.a)(Object(At.a)(t.prototype), "sendGet", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/currentUser/ops_security_url") }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a } return Object(Nt.a)(t, e), t }(Ft))({}),
                wc = Ic.a.mark(Hc),
                Rc = Ic.a.mark(qc),
                Lc = Ic.a.mark(Mc),
                Dc = Ic.a.mark(Qc),
                Gc = Ic.a.mark(Vc),
                Fc = Ic.a.mark(zc),
                Pc = Ic.a.mark(Yc),
                Uc = Ic.a.mark(Wc),
                Bc = Ic.a.mark(Kc);

            function Hc() { var e; return Ic.a.wrap(function(t) { for (;;) switch (t.prev = t.next) {
                        case 0:
                            return t.prev = 0, t.next = 3, Object(Nc.a)(Ac.getAvatar);
                        case 3:
                            if (!(e = t.sent).success) { t.next = 7; break } return t.next = 7, Object(Nc.b)({ type: B.GET_AVATAR_SUCCESS, avatar: e.data.url });
                        case 7:
                            t.next = 12; break;
                        case 9:
                            t.prev = 9, t.t0 = t.catch(0), console.log(t.t0);
                        case 12:
                        case "end":
                            return t.stop() } }, wc, null, [
                    [0, 9]
                ]) }

            function qc() { var e; return Ic.a.wrap(function(t) { for (;;) switch (t.prev = t.next) {
                        case 0:
                            return t.prev = 0, t.next = 3, Object(Nc.a)(Ac.getJurisdiction);
                        case 3:
                            if (!(e = t.sent).success) { t.next = 7; break } return t.next = 7, Object(Nc.b)({ type: B.GET_AVATAR_JURISDICTION, jurisdiction: e.data });
                        case 7:
                            t.next = 12; break;
                        case 9:
                            t.prev = 9, t.t0 = t.catch(0), console.log(t.t0);
                        case 12:
                        case "end":
                            return t.stop() } }, Rc, null, [
                    [0, 9]
                ]) }

            function Mc() { var e; return Ic.a.wrap(function(t) { for (;;) switch (t.prev = t.next) {
                        case 0:
                            return t.prev = 0, t.next = 3, Object(Nc.a)(Ac.getUserName);
                        case 3:
                            if (!(e = t.sent).success) { t.next = 7; break } return t.next = 7, Object(Nc.b)({ type: B.GET_NAME_SUCCESS, name: e.data });
                        case 7:
                            t.next = 12; break;
                        case 9:
                            t.prev = 9, t.t0 = t.catch(0), console.log(t.t0);
                        case 12:
                        case "end":
                            return t.stop() } }, Lc, null, [
                    [0, 9]
                ]) }

            function Qc() { var e; return Ic.a.wrap(function(t) { for (;;) switch (t.prev = t.next) {
                        case 0:
                            return t.prev = 0, t.next = 3, Object(Nc.a)(Ac.getApplyUrl);
                        case 3:
                            if (!(e = t.sent).success) { t.next = 7; break } return t.next = 7, Object(Nc.b)({ type: B.GET_APPLY_URL_SUCCESS, url: e.data });
                        case 7:
                            t.next = 12; break;
                        case 9:
                            t.prev = 9, t.t0 = t.catch(0), console.log(t.t0);
                        case 12:
                        case "end":
                            return t.stop() } }, Dc, null, [
                    [0, 9]
                ]) }

            function Vc() { var e, t; return Ic.a.wrap(function(a) { for (;;) switch (a.prev = a.next) {
                        case 0:
                            return a.prev = 0, a.next = 3, Object(Nc.a)(Ac.getRoleBindHost);
                        case 3:
                            if (!(e = a.sent).success) { a.next = 8; break } return t = e.data, a.next = 8, Object(Nc.b)({ type: B.GET_ROLE_BIND_HOST_SUCCESS, host: t });
                        case 8:
                            a.next = 13; break;
                        case 10:
                            a.prev = 10, a.t0 = a.catch(0), console.log(a.t0);
                        case 13:
                        case "end":
                            return a.stop() } }, Gc, null, [
                    [0, 10]
                ]) }

            function zc(e) { var t; return Ic.a.wrap(function(a) { for (;;) switch (a.prev = a.next) {
                        case 0:
                            return a.prev = 0, a.next = 3, Object(Nc.a)(Ac.getHiveAccount, e.source);
                        case 3:
                            if (!(t = a.sent).success) { a.next = 10; break } return document.cookie = "personEngine=".concat(e.engine), a.next = 8, Object(Nc.b)({ type: B.GET_HIVE_ACCOUNT_SUCCESS, personAccount: t.data, engine: e.engine });
                        case 8:
                            a.next = 11; break;
                        case 10:
                            oa.notify({ variant: "warning", content: "\u60a8\u6ca1\u6709\u5f53\u524d\u5f15\u64ce--".concat(e.engine, "\u7684\u53ef\u8bbf\u95ee\u8d44\u6e90\uff0c\u8bf7\u5728\u901a\u5929\u5854\u7533\u8bf7\u8868\u3001\u5e93\u6216\u8005\u7ec4\u7684\u8bbf\u95ee\u6743\u9650\uff01") });
                        case 11:
                            a.next = 16; break;
                        case 13:
                            a.prev = 13, a.t0 = a.catch(0), console.log(a.t0);
                        case 16:
                        case "end":
                            return a.stop() } }, Fc, null, [
                    [0, 13]
                ]) }

            function Yc(e) { var t, a, n, r; return Ic.a.wrap(function(c) { for (;;) switch (c.prev = c.next) {
                        case 0:
                            return c.prev = 0, c.next = 3, Object(Nc.a)(Ac.hasPersonRight);
                        case 3:
                            if (!c.sent.success) { c.next = 30; break } if (!e.flag) { c.next = 8; break } return c.next = 8, Object(Nc.b)({ type: B.GET_PERSON_RIGHT_SUCCESS });
                        case 8:
                            return c.next = 10, Object(Nc.a)(Ac.getPersonalEngine);
                        case 10:
                            if (!(t = c.sent).success) { c.next = 28; break } return c.next = 14, Object(Nc.b)({ type: B.GET_PERSON_ENGINE_SUCCESS, personEngines: t.data || [] });
                        case 14:
                            if (!t.data.length || !st("personEngine")) { c.next = 28; break } return a = st("personEngine"), n = ta.HIVE, a === Gt.MYSQL && (n = ta.MYSQL), a === Gt.SQLSERVER && (n = ta.SQLSERVER), c.next = 21, Object(Nc.a)(Ac.getHiveAccount, n);
                        case 21:
                            if (!(r = c.sent).success) { c.next = 27; break } return c.next = 25, Object(Nc.b)({ type: B.GET_HIVE_ACCOUNT_SUCCESS, personAccount: r.data, engine: a });
                        case 25:
                            c.next = 28; break;
                        case 27:
                            oa.notify({ variant: "warning", content: "\u60a8\u6ca1\u6709\u5f53\u524d\u5f15\u64ce--".concat(a, "\u7684\u53ef\u8bbf\u95ee\u8d44\u6e90\uff0c\u8bf7\u5728\u901a\u5929\u5854\u7533\u8bf7\u8868\u3001\u5e93\u6216\u8005\u7ec4\u7684\u8bbf\u95ee\u6743\u9650\uff01") });
                        case 28:
                            c.next = 31; break;
                        case 30:
                            oa.notify({ variant: "warning", content: "\u60a8\u6ca1\u6709\u4e2a\u4eba\u6743\u9650 ! \u8bf7\u5148\u5728\u901a\u5929\u5854\u7cfb\u7edf\u7533\u8bf7\u8bbf\u95ee\u6743\u9650" });
                        case 31:
                            c.next = 36; break;
                        case 33:
                            c.prev = 33, c.t0 = c.catch(0), console.log(c.t0);
                        case 36:
                        case "end":
                            return c.stop() } }, Pc, null, [
                    [0, 33]
                ]) }

            function Wc() { var e, t, a, n, r, c; return Ic.a.wrap(function(o) { for (;;) switch (o.prev = o.next) {
                        case 0:
                            return o.prev = 0, o.next = 3, Object(Nc.a)(Ac.getRoleEngine);
                        case 3:
                            if (!(e = o.sent).success) { o.next = 45; break } return (t = e.data || []).sort(function(e, t) { return e.engine === Gt.SPARK2 ? -1 : e.engine === Gt.HIVE ? -1 : 0 }), o.next = 9, Object(Nc.b)({ type: B.GET_ENGINE_ROLE_SUCCESS, data: t });
                        case 9:
                            return o.next = 11, Object(Nc.c)();
                        case 11:
                            if ("only_personal" === o.sent.user.jurisdiction || t.length) { o.next = 45; break } return oa.notify({ variant: "warning", content: "\u60a8\u6ca1\u6709\u6267\u884c\u5f15\u64ce\u6743\u9650 ! \u8bf7\u70b9\u51fb\u53f3\u4e0a\u89d2\u7ed1\u5b9a\u5e10\u53f7" }), o.next = 16, Object(Nc.a)(Ac.hasPersonRight);
                        case 16:
                            if (!o.sent.success) { o.next = 42; break } return o.next = 20, Object(Nc.b)({ type: B.GET_PERSON_RIGHT_SUCCESS });
                        case 20:
                            return o.next = 22, Object(Nc.a)(Ac.getPersonalEngine);
                        case 22:
                            if (!(a = o.sent).success) { o.next = 40; break } return o.next = 26, Object(Nc.b)({ type: B.GET_PERSON_ENGINE_SUCCESS, personEngines: a.data || [] });
                        case 26:
                            if (!a.data.length || !st("personEngine")) { o.next = 40; break } return n = st("personEngine"), r = ta.HIVE, n === Gt.MYSQL && (r = ta.MYSQL), n === Gt.SQLSERVER && (r = ta.SQLSERVER), o.next = 33, Object(Nc.a)(Ac.getHiveAccount, r);
                        case 33:
                            if (!(c = o.sent).success) { o.next = 39; break } return o.next = 37, Object(Nc.b)({ type: B.GET_HIVE_ACCOUNT_SUCCESS, personAccount: c.data, engine: n });
                        case 37:
                            o.next = 40; break;
                        case 39:
                            oa.notify({ variant: "warning", content: "\u60a8\u6ca1\u6709\u5f53\u524d\u5f15\u64ce--".concat(n, "\u7684\u53ef\u8bbf\u95ee\u8d44\u6e90\uff0c\u8bf7\u5728\u901a\u5929\u5854\u7533\u8bf7\u8868\u3001\u5e93\u6216\u8005\u7ec4\u7684\u8bbf\u95ee\u6743\u9650\uff01") });
                        case 40:
                            o.next = 45; break;
                        case 42:
                            return o.next = 44, Object(Nc.b)({ type: B.GET_PERSON_RIGHT_FAILD });
                        case 44:
                            oa.notify({ variant: "warning", content: "\u60a8\u6ca1\u6709\u4efb\u4f55\u6743\u9650 ! \u8bf7\u5148\u7533\u8bf7\u8d26\u53f7" });
                        case 45:
                            o.next = 50; break;
                        case 47:
                            o.prev = 47, o.t0 = o.catch(0), console.log(o.t0);
                        case 50:
                        case "end":
                            return o.stop() } }, Uc, null, [
                    [0, 47]
                ]) }

            function Kc() { return Ic.a.wrap(function(e) { for (;;) switch (e.prev = e.next) {
                        case 0:
                            return e.next = 2, Object(Nc.e)(B.GET_AVATAR, Hc);
                        case 2:
                            return e.next = 4, Object(Nc.e)(B.GET_NAME, Mc);
                        case 4:
                            return e.next = 6, Object(Nc.e)(B.GET_ROLE_BIND_HOST, Vc);
                        case 6:
                            return e.next = 8, Object(Nc.e)(B.GET_ENGINE_ROLE, Wc);
                        case 8:
                            return e.next = 10, Object(Nc.e)(B.GET_PERSON_RIGHT, Yc);
                        case 10:
                            return e.next = 12, Object(Nc.e)(B.GET_HIVE_ACCOUNT, zc);
                        case 12:
                            return e.next = 14, Object(Nc.e)(B.GET_APPLY_URL, Qc);
                        case 14:
                            return e.next = 16, Object(Nc.e)(B.GET_JURISDICTION, qc);
                        case 16:
                        case "end":
                            return e.stop() } }, Bc) } var Xc = new(function(e) {
                    function t() { var e, a;
                        Object(_t.a)(this, t); for (var n = arguments.length, r = new Array(n), c = 0; c < n; c++) r[c] = arguments[c]; return (a = Object(kt.a)(this, (e = Object(At.a)(t)).call.apply(e, [this].concat(r)))).getHistory = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendGet", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/query/history/").concat(e) }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a.getLogs = function(e) { return Object(wt.a)(Object(At.a)(t.prototype), "sendGet", Object(It.a)(a)).call(Object(It.a)(a), { url: "".concat(Pt, "/rest/query/historylog/").concat(e) }).then(function(e) { return e.data }, function(e) { return e }).catch(function(e) { return console.log(e) }) }, a } return Object(Nt.a)(t, e), t }(Ft))({}),
                Jc = Ic.a.mark(to),
                $c = Ic.a.mark(ao),
                Zc = Ic.a.mark(no);

            function eo(e) { switch (e) {
                    case Mt.READY:
                        return "\u5df2\u63d0\u4ea4";
                    case Mt.RUNNING:
                        return "\u8fd0\u884c\u4e2d";
                    case Mt.STOPPED:
                        return "\u505c\u6b62";
                    case Mt.FINISHED:
                        return "\u6210\u529f";
                    case Mt.TIMEOUT:
                        return "\u8d85\u65f6";
                    case Mt.FAILED:
                        return "\u5931\u8d25";
                    default:
                        return e } }

            function to(e) { var t, a, n; return Ic.a.wrap(function(r) { for (;;) switch (r.prev = r.next) {
                        case 0:
                            return r.prev = 0, r.next = 3, Object(Nc.a)(Xc.getHistory, e.day);
                        case 3:
                            if (!(t = r.sent).success) { r.next = 9; break } return a = Object(Ua.a)(t.data), n = a.map(function(e) { return e.statusDesc = eo(e.queryStatus), e }), r.next = 9, Object(Nc.b)({ type: H.GET_HISTORY_SUCCESS, list: n, value: e.day });
                        case 9:
                            r.next = 14; break;
                        case 11:
                            r.prev = 11, r.t0 = r.catch(0), console.log(r.t0);
                        case 14:
                        case "end":
                            return r.stop() } }, Jc, null, [
                    [0, 11]
                ]) }

            function ao(e) { var t, a; return Ic.a.wrap(function(n) { for (;;) switch (n.prev = n.next) {
                        case 0:
                            return n.prev = 0, n.next = 3, Object(Nc.a)(Xc.getLogs, e.value);
                        case 3:
                            if (!(t = n.sent).success) { n.next = 8; break } return a = Object(Ua.a)(t.data), n.next = 8, Object(Nc.b)({ type: H.GET_LOG_SUCCESS, logs: a });
                        case 8:
                            n.next = 13; break;
                        case 10:
                            n.prev = 10, n.t0 = n.catch(0), console.log(n.t0);
                        case 13:
                        case "end":
                            return n.stop() } }, $c, null, [
                    [0, 10]
                ]) }

            function no() { return Ic.a.wrap(function(e) { for (;;) switch (e.prev = e.next) {
                        case 0:
                            return e.next = 2, Object(Nc.e)(H.GET_HISTORY, to);
                        case 2:
                            return e.next = 4, Object(Nc.e)(H.GET_LOG, ao);
                        case 4:
                        case "end":
                            return e.stop() } }, Zc) } var ro = Ic.a.mark(Oo),
                co = Ic.a.mark(ho),
                oo = Ic.a.mark(vo),
                lo = Ic.a.mark(xo),
                io = Ic.a.mark(So),
                so = Ic.a.mark(jo),
                uo = Ic.a.mark(yo),
                fo = Ic.a.mark(Co),
                bo = Ic.a.mark(To),
                po = Ic.a.mark(_o),
                mo = Ic.a.mark(ko),
                Eo = Ic.a.mark(Io),
                go = Ic.a.mark(No);

            function Oo(e) { var t, a, n; return Ic.a.wrap(function(r) { for (;;) switch (r.prev = r.next) {
                        case 0:
                            return t = e.datasource, r.prev = 1, r.next = 4, Object(Nc.a)(Ut.getDataBases, t);
                        case 4:
                            if (!(a = r.sent).success) { r.next = 11; break } return n = a.data || [], r.next = 9, Object(Nc.b)({ type: M.GET_DATA_BASES_SUCCESS, list: Object(Ua.a)(n) });
                        case 9:
                            r.next = 13; break;
                        case 11:
                            return r.next = 13, Object(Nc.b)({ type: M.GET_DATA_BASES_FAILD });
                        case 13:
                            r.next = 18; break;
                        case 15:
                            r.prev = 15, r.t0 = r.catch(1), console.log(r.t0);
                        case 18:
                        case "end":
                            return r.stop() } }, ro, null, [
                    [1, 15]
                ]) }

            function ho(e) { var t, a, n; return Ic.a.wrap(function(r) { for (;;) switch (r.prev = r.next) {
                        case 0:
                            return t = e.datasource, r.prev = 1, r.next = 4, Object(Nc.a)(Ut.getFavoriteDatabases, t);
                        case 4:
                            if (!(a = r.sent).success) { r.next = 11; break } return n = a.data || [], r.next = 9, Object(Nc.b)({ type: M.GET_FAVORITE_DATA_BASES_SUCCESS, list: n });
                        case 9:
                            r.next = 13; break;
                        case 11:
                            return r.next = 13, Object(Nc.b)({ type: M.GET_FAVORITE_DATA_BASES_FAILD });
                        case 13:
                            r.next = 18; break;
                        case 15:
                            r.prev = 15, r.t0 = r.catch(1), console.log(r.t0);
                        case 18:
                        case "end":
                            return r.stop() } }, co, null, [
                    [1, 15]
                ]) }

            function vo(e) { var t, a, n; return Ic.a.wrap(function(r) { for (;;) switch (r.prev = r.next) {
                        case 0:
                            return t = e.datasource, r.prev = 1, r.next = 4, Object(Nc.a)(Ut.getFavoriteTables, t);
                        case 4:
                            if (!(a = r.sent).success) { r.next = 9; break } return n = a.data || [], r.next = 9, Object(Nc.b)({ type: M.GET_FAVORITE_TABLES_SUCCESS, list: Object(Ua.a)(n) });
                        case 9:
                            r.next = 14; break;
                        case 11:
                            r.prev = 11, r.t0 = r.catch(1), console.log(r.t0);
                        case 14:
                        case "end":
                            return r.stop() } }, oo, null, [
                    [1, 11]
                ]) }

            function xo(e) { var t; return Ic.a.wrap(function(a) { for (;;) switch (a.prev = a.next) {
                        case 0:
                            return a.prev = 0, a.next = 3, Object(Nc.a)(e.flieType === Wt.FILE ? Ut.moveOneFile : Ut.moveOneDir, e.sourceId, e.targetParentId);
                        case 3:
                            (t = a.sent).success ? (oa.notify({ variant: "success", content: "\u79fb\u52a8\u6587\u4ef6\u6210\u529f\uff01" }), e.action.resolve()) : oa.notify({ variant: "error", content: "".concat(t.msg, "\uff01") }), a.next = 10; break;
                        case 7:
                            a.prev = 7, a.t0 = a.catch(0), console.log(a.t0);
                        case 10:
                        case "end":
                            return a.stop() } }, lo, null, [
                    [0, 7]
                ]) }

            function So(e) { return Ic.a.wrap(function(e) { for (;;) switch (e.prev = e.next) {
                        case 0:
                            return e.next = 2, jo(null);
                        case 2:
                        case "end":
                            return e.stop() } }, io) }

            function jo(e) { var t, a; return Ic.a.wrap(function(n) { for (;;) switch (n.prev = n.next) {
                        case 0:
                            return n.prev = 0, n.next = 3, Object(Nc.a)(Ut.getSaveFiles);
                        case 3:
                            if (!(t = n.sent).success) { n.next = 8; break } return a = t.data || [], n.next = 8, Object(Nc.b)({ type: M.GET_SAVE_SQLS_SUCCESS, list: a, newFolderId: e });
                        case 8:
                            n.next = 13; break;
                        case 10:
                            n.prev = 10, n.t0 = n.catch(0), console.log(n.t0);
                        case 13:
                        case "end":
                            return n.stop() } }, so, null, [
                    [0, 10]
                ]) }

            function yo(e) { return Ic.a.wrap(function(t) { for (;;) switch (t.prev = t.next) {
                        case 0:
                            return t.prev = 0, t.next = 3, Object(Nc.a)(Ut.deleteSql, e.id);
                        case 3:
                            if (!t.sent.success) { t.next = 8; break } return oa.notify({ variant: "success", content: "\u5220\u9664\u6210\u529f\uff01" }), t.next = 8, jo(null);
                        case 8:
                            t.next = 13; break;
                        case 10:
                            t.prev = 10, t.t0 = t.catch(0), console.log(t.t0);
                        case 13:
                        case "end":
                            return t.stop() } }, uo, null, [
                    [0, 10]
                ]) }

            function Co(e) { return Ic.a.wrap(function(t) { for (;;) switch (t.prev = t.next) {
                        case 0:
                            return t.prev = 0, t.next = 3, Object(Nc.a)(Ut.renameSql, e.data);
                        case 3:
                            if (!t.sent.success) { t.next = 10; break } return oa.notify({ variant: "success", content: "\u64cd\u4f5c\u6210\u529f\uff01" }), t.next = 8, Object(Nc.b)({ type: M.RENAME_SAVE_SQL_SUCCESS, id: e.data.id, name: e.data.new_name });
                        case 8:
                            return t.next = 10, jo(null);
                        case 10:
                            t.next = 15; break;
                        case 12:
                            t.prev = 12, t.t0 = t.catch(0), console.log(t.t0);
                        case 15:
                        case "end":
                            return t.stop() } }, fo, null, [
                    [0, 12]
                ]) }

            function To(e) { var t; return Ic.a.wrap(function(a) { for (;;) switch (a.prev = a.next) {
                        case 0:
                            return a.prev = 0, a.next = 3, Object(Nc.a)(cc.saveQuery, e.data);
                        case 3:
                            if (!(t = a.sent).success) { a.next = 7; break } return a.next = 7, jo(t.data);
                        case 7:
                            a.next = 12; break;
                        case 9:
                            a.prev = 9, a.t0 = a.catch(0), console.log(a.t0);
                        case 12:
                        case "end":
                            return a.stop() } }, bo, null, [
                    [0, 9]
                ]) }

            function _o(e) { var t; return Ic.a.wrap(function(e) { for (;;) switch (e.prev = e.next) {
                        case 0:
                            return e.prev = 0, e.next = 3, Object(Nc.a)(Ut.getColleagues);
                        case 3:
                            if (!(t = e.sent).success) { e.next = 7; break } return e.next = 7, Object(Nc.b)({ type: M.GET_COLLEAGUES_SUCCESS, colleagues: t.data });
                        case 7:
                            e.next = 12; break;
                        case 9:
                            e.prev = 9, e.t0 = e.catch(0), console.log(e.t0);
                        case 12:
                        case "end":
                            return e.stop() } }, po, null, [
                    [0, 9]
                ]) }

            function ko(e) { var t; return Ic.a.wrap(function(a) { for (;;) switch (a.prev = a.next) {
                        case 0:
                            return a.prev = 0, a.next = 3, Object(Nc.a)(Ut.getPartition, e.data);
                        case 3:
                            if (!(t = a.sent).success) { a.next = 9; break } return a.next = 7, Object(Nc.b)({ type: M.GET_PARTITION_SUCCESS, list: t.data || [], db: e.data.db, table: e.data.table, success: t.success });
                        case 7:
                            a.next = 11; break;
                        case 9:
                            return a.next = 11, Object(Nc.b)({ type: M.GET_PARTITION_FAILD, list: [], db: e.data.db, table: e.data.table, message: t.msg, success: t.success });
                        case 11:
                            a.next = 16; break;
                        case 13:
                            a.prev = 13, a.t0 = a.catch(0), console.log(a.t0);
                        case 16:
                        case "end":
                            return a.stop() } }, mo, null, [
                    [0, 13]
                ]) }

            function Io(e) { var t; return Ic.a.wrap(function(a) { for (;;) switch (a.prev = a.next) {
                        case 0:
                            return a.prev = 0, a.next = 3, Object(Nc.a)(Ut.getPreview, e.data);
                        case 3:
                            if (!(t = a.sent).success) { a.next = 9; break } return a.next = 7, Object(Nc.b)({ type: M.GET_PREVIEW_SUCCESS, columnNames: t.data.header || [], records: t.data.records || [], db: e.data.db, table: e.data.table, success: t.success });
                        case 7:
                            a.next = 11; break;
                        case 9:
                            return a.next = 11, Object(Nc.b)({ type: M.GET_PREVIEW_FAILD, columnNames: [], records: [], db: e.data.db, table: e.data.table, message: t.msg, success: t.success });
                        case 11:
                            a.next = 16; break;
                        case 13:
                            a.prev = 13, a.t0 = a.catch(0), console.log(a.t0);
                        case 16:
                        case "end":
                            return a.stop() } }, Eo, null, [
                    [0, 13]
                ]) }

            function No() { return Ic.a.wrap(function(e) { for (;;) switch (e.prev = e.next) {
                        case 0:
                            return e.next = 2, Object(Nc.e)(M.GET_DATA_BASES, Oo);
                        case 2:
                            return e.next = 4, Object(Nc.e)(M.GET_FAVORITE_DATA_BASES, ho);
                        case 4:
                            return e.next = 6, Object(Nc.e)(M.GET_FAVORITE_TABLES, vo);
                        case 6:
                            return e.next = 8, Object(Nc.e)(M.GET_SAVE_SQLS, So);
                        case 8:
                            return e.next = 10, Object(Nc.e)(M.DELETE_SAVE_SQLS, yo);
                        case 10:
                            return e.next = 12, Object(Nc.e)(M.RENAME_SAVE_SQL, Co);
                        case 12:
                            return e.next = 14, Object(Nc.e)(M.NEW_SAVE_FOLDER, To);
                        case 14:
                            return e.next = 16, Object(Nc.e)(M.GET_COLLEAGUES, _o);
                        case 16:
                            return e.next = 18, Object(Nc.e)(M.GET_PARTITION, ko);
                        case 18:
                            return e.next = 20, Object(Nc.e)(M.GET_PREVIEW, Io);
                        case 20:
                            return e.next = 22, Object(Nc.e)(M.MOVE_SAVE_SQLS, xo);
                        case 22:
                        case "end":
                            return e.stop() } }, go) } var Ao = Ic.a.mark(Bo),
                wo = Ic.a.mark(Ho),
                Ro = Ic.a.mark(Mo),
                Lo = Ic.a.mark(Qo),
                Do = Ic.a.mark(Vo),
                Go = Ic.a.mark(zo),
                Fo = Ic.a.mark(Yo),
                Po = Ic.a.mark(Wo),
                Uo = Ic.a.mark(Ko);

            function Bo(e) { var t; return Ic.a.wrap(function(a) { for (;;) switch (a.prev = a.next) {
                        case 0:
                            return a.prev = 0, a.next = 3, Object(Nc.a)(cc.formatQuery, e.v);
                        case 3:
                            if (!(t = a.sent).success) { a.next = 7; break } return a.next = 7, Object(Nc.b)({ type: q.FORMAT_QUERY_SUCCESS, format: t.data, range: e.range, lines: e.lines });
                        case 7:
                            a.next = 12; break;
                        case 9:
                            a.prev = 9, a.t0 = a.catch(0), console.log(a.t0);
                        case 12:
                        case "end":
                            return a.stop() } }, Ao, null, [
                    [0, 9]
                ]) }

            function Ho(e) { var t, a; return Ic.a.wrap(function(n) { for (;;) switch (n.prev = n.next) {
                        case 0:
                            return n.prev = 0, n.next = 3, Object(Nc.a)(cc.executeQuery, e.v);
                        case 3:
                            if (!(t = n.sent).success) { n.next = 11; break } return n.next = 7, Object(Nc.b)({ type: q.EXECUTE_QUERY_SUCCESS, id: t.data.id, tabId: e.tabId, sql: t.data.sql ? t.data.sql : e.v.hql, uuid: e.uuid, engine: e.v.execMode, role: "service_products", isPersonal: false });
                        case 7:
                            return n.next = 9, Mo(t.data.id, e.v.execMode, e.v, e.tabId, e.executeTime);
                        case 9:
                            n.next = 12; break;
                        case 11:
                            oa.notify({ variant: "error", content: "sql \u67e5\u8be2\u63d0\u4ea4\u5931\u8d25\uff01" });
                        case 12:
                            n.next = 21; break;
                        case 14:
                            if (n.prev = 14, n.t0 = n.catch(0), a = new Date, !(Math.floor((a.getTime() - e.executeTime.getTime()) / 6e4) < 2)) { n.next = 21; break } return n.next = 21, Ho(e);
                        case 21:
                        case "end":
                            return n.stop() } }, wo, null, [
                    [0, 14]
                ]) } var qo = function(e) { return new Promise(function(t) { setTimeout(t, e) }) };

            function Mo(e, t, a, n, r) { var c, o, l, i, s, u, d, f, b, p, m, E, g, O, h, v; return Ic.a.wrap(function(S) { for (;;) switch (S.prev = S.next) {
                        case 0:
                            return S.prev = 0, S.next = 3, Object(Nc.a)(cc.getResult, e);
                        case 3:
                            if (!(c = S.sent).success) { S.next = 55; break } o = c.data, l = o.currentStatus, i = o.queryLog, s = o.data || [], u = o.resultFilePath, d = o.columnNames || [], f = o.downloadPermission, b = a.isPersonal, p = new Date, m = p.getTime() - r.getTime(), S.t0 = l, S.next = S.t0 === Mt.READY ? 18 : S.t0 === Mt.RUNNING ? 23 : S.t0 === Mt.STOPPED ? 37 : S.t0 === Mt.FINISHED ? 40 : S.t0 === Mt.TIMEOUT ? 44 : S.t0 === Mt.FAILED ? 45 : 52; break;
                        case 18:
                            return S.next = 20, Object(Nc.a)(qo, 500);
                        case 20:
                            return S.next = 22, Mo(e, t, a, n, r);
                        case 22:
                            return S.abrupt("break", 53);
                        case 23:
                            return E = !1, S.next = 26, Object(Nc.b)({ type: q.GET_EXECUTE_RESULT_SUCCESS, log: i, status: l, id: e, tabId: n, filePath: u, isPersonal: b, elapseTime: m });
                        case 26:
                            return S.next = 28, Object(Nc.a)(qo, 3e3);
                        case 28:
                            return S.next = 30, Object(Nc.c)();
                        case 30:
                            if (g = S.sent, g.main.querys.forEach(function(t, a) { t.tasks.forEach(function(t, a) { e === t.id && (E = t.status === Mt.RUNNING || t.status === Mt.READY) }) }), !E) { S.next = 36; break } return S.next = 36, Mo(e, t, a, n, r);
                        case 36:
                            return S.abrupt("break", 53);
                        case 37:
                            return S.next = 39, Object(Nc.b)({ type: q.GET_EXECUTE_RESULT_SUCCESS, log: i, status: l, id: e, tabId: n, isPersonal: b, elapseTime: m });
                        case 39:
                            return S.abrupt("break", 53);
                        case 40:
                            return oa.notify({ variant: "success", content: "taskID-".concat(e, "-sql \u6267\u884c\u6210\u529f\uff01\n            \u7528\u65f6\uff1a").concat(m, " \u6beb\u79d2\n            ") }), S.next = 43, Object(Nc.b)({ type: q.GET_EXECUTE_RESULT_SUCCESS, log: i, status: l, tableData: s, filePath: u, columnNames: d, downloadPerm: f, id: e, tabId: n, isPersonal: b, elapseTime: m });
                        case 43:
                        case 44:
                            return S.abrupt("break", 53);
                        case 45:
                            return j = i, O = "SPARK2" === t && -1 !== j.indexOf("Job aborted due to stage failure: Task creation failed: task total count is too large in one stage"), h = "sql \u6267\u884c\u5931\u8d25\uff01", O && ((v = Object(x.a)({}, a)).execMode = "HIVE", Qo(v, t, n), h += "<br/>\u63d0\u4ea4\u7684SQL\u8fc7\u5927<br/>\u5df2\u81ea\u52a8\u5207\u6362\u5230HIVE\u6267\u884c\uff01"), oa.notify({ variant: "error", content: h }), S.next = 51, Object(Nc.b)({ type: q.GET_EXECUTE_RESULT_SUCCESS, log: i, status: l, tabId: n, id: e, isPersonal: b, elapseTime: m });
                        case 51:
                        case 52:
                            return S.abrupt("break", 53);
                        case 53:
                            S.next = 58; break;
                        case 55:
                            return S.next = 57, Object(Nc.b)({ type: q.GET_EXECUTE_RESULT_FAILED, id: e, tabId: n });
                        case 57:
                            oa.notify({ variant: "error", content: "\u6267\u884c\u51fa\u9519\uff01" });
                        case 58:
                            S.next = 63; break;
                        case 60:
                            S.prev = 60, S.t1 = S.catch(0), console.log(S.t1);
                        case 63:
                        case "end":
                            return S.stop() }
                    var j }, Ro, null, [
                    [0, 60]
                ]) }

            function Qo(e, t, a) { var n, r; return Ic.a.wrap(function(c) { for (;;) switch (c.prev = c.next) {
                        case 0:
                            return c.prev = 0, c.next = 3, Object(Nc.a)(cc.executeQuery, e);
                        case 3:
                            if (n = c.sent, r = new Date, !n.success) { c.next = 10; break } return c.next = 8, Object(Nc.b)({ type: q.EXECUTE_QUERY_SUCCESS, id: n.data.id });
                        case 8:
                            return c.next = 10, Mo(n.data.id, t, e, a, r);
                        case 10:
                            c.next = 15; break;
                        case 12:
                            c.prev = 12, c.t0 = c.catch(0), console.log(c.t0);
                        case 15:
                        case "end":
                            return c.stop() } }, Lo, null, [
                    [0, 12]
                ]) }

            function Vo(e) { var t, a, n; return Ic.a.wrap(function(r) { for (;;) switch (r.prev = r.next) {
                        case 0:
                            return r.prev = 0, r.next = 3, Object(Nc.a)(cc.saveQuery, e.data);
                        case 3:
                            if (!(t = r.sent).success) { r.next = 21; break } return r.next = 7, Object(Nc.b)({ type: q.SAVE_QUERY_SUCCESS, id: t.data, name: e.data.name });
                        case 7:
                            return oa.notify({ variant: "success", content: "\u6536\u85cf\u6210\u529f!" }), r.prev = 8, r.next = 11, Object(Nc.a)(Ut.getSaveFiles);
                        case 11:
                            if (!(a = r.sent).success) { r.next = 16; break } return n = a.data || [], r.next = 16, Object(Nc.b)({ type: M.GET_SAVE_SQLS_SUCCESS, list: n });
                        case 16:
                            r.next = 21; break;
                        case 18:
                            r.prev = 18, r.t0 = r.catch(8), console.log(r.t0);
                        case 21:
                            r.next = 26; break;
                        case 23:
                            r.prev = 23, r.t1 = r.catch(0), console.log(r.t1);
                        case 26:
                        case "end":
                            return r.stop() } }, Do, null, [
                    [0, 23],
                    [8, 18]
                ]) }

            function zo(e) { return Ic.a.wrap(function(t) { for (;;) switch (t.prev = t.next) {
                        case 0:
                            return t.prev = 0, t.next = 3, Object(Nc.a)(cc.stopQuery, e.v);
                        case 3:
                            if (!t.sent.success) { t.next = 8; break } return oa.notify({ variant: "success", content: "\u505c\u6b62\u67e5\u8be2\u6210\u529f\uff01" }), t.next = 8, Object(Nc.b)({ type: q.STOP_QUERY_SUCCESS, queryId: e.v });
                        case 8:
                            t.next = 13; break;
                        case 10:
                            t.prev = 10, t.t0 = t.catch(0), console.log(t.t0);
                        case 13:
                        case "end":
                            return t.stop() } }, Go, null, [
                    [0, 10]
                ]) }

            function Yo(e) { return Ic.a.wrap(function(t) { for (;;) switch (t.prev = t.next) {
                        case 0:
                            return t.prev = 0, t.next = 3, Object(Nc.a)(cc.stopAllQuery, e.data);
                        case 3:
                            t.sent.success && oa.notify({ variant: "success", content: "\u505c\u6b62\u6240\u6709\u67e5\u8be2\u6210\u529f\uff01" }), t.next = 10; break;
                        case 7:
                            t.prev = 7, t.t0 = t.catch(0), console.log(t.t0);
                        case 10:
                        case "end":
                            return t.stop() } }, Fo, null, [
                    [0, 7]
                ]) }

            function Wo(e) { var t, a; return Ic.a.wrap(function(n) { for (;;) switch (n.prev = n.next) {
                        case 0:
                            return n.prev = 0, n.next = 3, Object(Nc.a)(cc.getOneFile, e.v);
                        case 3:
                            if (!(t = n.sent).success) { n.next = 8; break } return a = t.data, n.next = 8, Object(Nc.b)({ type: q.GET_ONE_FILE_SUCCESS, sql: a.content, fileId: a.id, name: a.name, userId: a.userId });
                        case 8:
                            n.next = 13; break;
                        case 10:
                            n.prev = 10, n.t0 = n.catch(0), console.log(n.t0);
                        case 13:
                        case "end":
                            return n.stop() } }, Po, null, [
                    [0, 10]
                ]) }

            function Ko() { return Ic.a.wrap(function(e) { for (;;) switch (e.prev = e.next) {
                        case 0:
                            return e.next = 2, Object(Nc.e)(q.FORMAT_QUERY, Bo);
                        case 2:
                            return e.next = 4, Object(Nc.d)(q.EXECUTE_QUERY, Ho);
                        case 4:
                            return e.next = 6, Object(Nc.e)(q.SAVE_QUERY, Vo);
                        case 6:
                            return e.next = 8, Object(Nc.e)(q.STOP_QUERY, zo);
                        case 8:
                            return e.next = 10, Object(Nc.d)(q.STOP_ALL_QUERY, Yo);
                        case 10:
                            return e.next = 12, Object(Nc.d)(q.GET_ONE_FILE, Wo);
                        case 12:
                        case "end":
                            return e.stop() } }, Uo) } var Xo, Jo = { userSagas: Kc, historySagas: no, dataSagas: No, mainSagas: Ko },
                $o = { name: "", avatar: "", roleBindHost: "", engines: [], engine: "", engineRoleMap: {}, role: "", accountType: st("accountType") ? st("accountType") : "", personEngines: [], personEngine: "", personAccount: "", applyUrl: "", jurisdiction: "all" };

            function Zo(e, t) { return e.filter(function(e) { return e.queryId && e.queryId.indexOf(t.toLowerCase()) >= 0 || e.addTime && e.addTime.toLowerCase().indexOf(t.toLowerCase()) >= 0 || e.querySql && e.querySql.toLowerCase().indexOf(t.toLowerCase()) >= 0 || e.queryEngine && e.queryEngine.toLowerCase().indexOf(t.toLowerCase()) >= 0 || e.statusDesc && e.statusDesc.toLowerCase().indexOf(t.toLowerCase()) >= 0 || e.execTime && e.execTime.toLowerCase().indexOf(t.toLowerCase()) >= 0 }) }

            function el(e, t, a) { var n; return e === Xo.ASC && (n = 1), n = n ? 1 : -1,
                    function(e, r) { var c = a ? a(e) : e[t],
                            o = a ? a(r) : r[t],
                            l = Number(c) ? Number(c) : c,
                            i = Number(o) ? Number(o) : o; return "number" === typeof l && "number" === typeof i ? l > i ? n : -1 * n : "number" === typeof l && "number" !== typeof i ? n : "number" !== typeof l && "number" === typeof i ? -1 * n : l < i ? -1 * n : l > i ? n : 0 } }! function(e) { e.ASC = "asc", e.DESC = "desc", e.NORMAL = "" }(Xo || (Xo = {})); var tl = { filterList: [], list: [], order: "desc", orderBy: "addTime", searchKeyword: "", currentLog: [], loading: !1, value: 7 }; var al = { datasource: "hive", elementData: [], favoriteTreeData: [], sqlSaveData: [], idMap: {}, renderType: "init", newFolderId: null, showAllRelate: !1, colleagues: [], query_tab: 1, elementLoading: !1, tableSaveLoading: !1, tableInfos: {}, infoTab: -1, needScroll: {} }; var nl = { querys: [{ rename: "", sqlSelected: "", tabId: 1, sql: "", saveSql: "", name: "\u67e5\u8be2-1", fileId: -1, userId: "", queryId: -1, status: Mt.READY, tasks: [], activeTask: 0, position: [0], needCursor: !1, cursor: [{ row: 0, column: 0 }], isSaved: !1 }], activeIndex: 0, tabId: 1, order: "desc", orderBy: "platfrom" }; var rl = Object(_.c)({ user: function() { var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : $o,
                            t = arguments.length > 1 ? arguments[1] : void 0; switch (t.type) {
                            case B.GET_ROLE_BIND_HOST_SUCCESS:
                                return Object(x.a)({}, e, { roleBindHost: t.host });
                            case B.GET_ENGINE_ROLE_SUCCESS:
                                var a = t.data,
                                    n = [],
                                    r = {},
                                    c = "",
                                    o = ""; return a.forEach(function(e) { n.push(e.engine), r[e.engine] = e.role }), c = st("publicEngine") && n.indexOf(st("publicEngine")) > -1 ? st("publicEngine") : n[0], o || (o = r[c] && r[c][0] ? r[c][0] : ""), Object(x.a)({}, e, { engines: n, engine: c, engineRoleMap: r, role: o });
                            case B.CHANGE_ENGINE:
                                return e.accountType === Bt ? Object(x.a)({}, e, { engine: t.v }) : Object(x.a)({}, e, { personEngine: t.v });
                            case B.CHANGE_ROLE:
                                return Object(x.a)({}, e, { role: t.v });
                            case B.CHANGE_ACCOUNT_TYPE:
                                return t.v === Bt && (document.cookie = "accountType=".concat(t.v)), Object(x.a)({}, e, { accountType: t.v });
                            case B.GET_PERSON_RIGHT_SUCCESS:
                                return document.cookie = "accountType=".concat(Ht), Object(x.a)({}, e, { accountType: Ht });
                            case B.GET_HIVE_ACCOUNT_SUCCESS:
                                return Object(x.a)({}, e, { personEngine: t.engine, personAccount: t.personAccount });
                            case B.GET_PERSON_ENGINE_SUCCESS:
                                var l = t.personEngines,
                                    i = []; return l.forEach(function(e) { i.push(e.engine) }), Object(x.a)({}, e, { personEngines: i, personEngine: st("personEngine") ? st("personEngine") : "" });
                            case B.GET_PERSON_RIGHT_FAILD:
                                return Object(x.a)({}, e, { accountType: Bt });
                            case B.GET_AVATAR_SUCCESS:
                                return Object(x.a)({}, e, { avatar: t.avatar });
                            case B.GET_AVATAR_JURISDICTION:
                                var s = e.accountType; return s === Ht && "only_hive" === t.jurisdiction || !s && ("only_hive" === t.jurisdiction || "all" === t.jurisdiction) ? Object(x.a)({}, e, { jurisdiction: t.jurisdiction, accountType: Bt }) : Object(x.a)({}, e, { jurisdiction: t.jurisdiction });
                            case B.GET_NAME_SUCCESS:
                                return Object(x.a)({}, e, { name: t.name });
                            case B.GET_APPLY_URL_SUCCESS:
                                return Object(x.a)({}, e, { applyUrl: t.url });
                            default:
                                return e } }, history: function() { var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : tl,
                            t = arguments.length > 1 ? arguments[1] : void 0; switch (t.type) {
                            case H.GET_HISTORY_SUCCESS:
                                var a = e.searchKeyword,
                                    n = e.order,
                                    r = e.orderBy,
                                    c = Zo(Object(Ua.a)(t.list).sort(el(n, r)), a); return Object(x.a)({}, e, { list: Object(Ua.a)(t.list), filterList: c, loading: !1, value: t.value });
                            case H.SORT_LIST:
                                var o = t.order,
                                    l = t.orderBy,
                                    i = e.filterList,
                                    s = Object(Ua.a)(i).sort(el(o, l)); return Object(x.a)({}, e, { order: o, orderBy: l, filterList: s });
                            case H.CHANGE_LOADING:
                                return Object(x.a)({}, e, { loading: t.v, value: "", filterList: [] });
                            case H.CHANGE_KEYWORD:
                                var u = e.order,
                                    d = e.orderBy,
                                    f = e.list,
                                    b = t.value,
                                    p = Zo(Object(Ua.a)(f).sort(el(u, d)), b); return Object(x.a)({}, e, { filterList: p, searchKeyword: b });
                            case H.GET_LOG_SUCCESS:
                                return Object(x.a)({}, e, { currentLog: t.logs });
                            default:
                                return e } }, data: function() { var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : al,
                            t = arguments.length > 1 ? arguments[1] : void 0; switch (t.type) {
                            case M.CHANGE_DATA_SOURCE:
                                return Object(x.a)({}, e, { datasource: t.v });
                            case M.GET_DATA_BASES_SUCCESS:
                                var a = t.list,
                                    n = jr()(a);
                                a.length > 500 && (n = a.slice(0, 499)); var r = n.map(function(e) { return Object(x.a)({}, e, { key: e.database, title: e.database, lazy: !0, folder: !0 }) }); return Object(x.a)({}, e, { elementLoading: !1, elementData: r });
                            case M.GET_DATA_BASES_FAILD:
                                return Object(x.a)({}, e, { elementLoading: !1, elementData: [] });
                            case M.GET_FAVORITE_DATA_BASES_SUCCESS:
                                var c = t.list,
                                    o = jr()(c);
                                c.length > 500 && (o = c.slice(0, 499)); var l = o.map(function(e) { return Object(x.a)({}, e, { key: e.database, title: e.database, lazy: !0, folder: !0 }) }); return Object(x.a)({}, e, { tableSaveLoading: !1, favoriteTreeData: l });
                            case M.GET_FAVORITE_DATA_BASES_FAILD:
                                return Object(x.a)({}, e, { elementLoading: !1, favoriteTreeData: [] });
                            case M.GET_SAVE_SQLS_SUCCESS:
                                var i = jr()(t.list);
                                i = [].concat(Object(Ua.a)(i), [{ name: "\u6211\u7684\u6536\u85cf", id: -1, type: "D", parentId: "#" }]); var s = {}; return i.forEach(function(e) { e.folder = e.type === Wt.FOLDER, e.title = e.name, e.key = e.id, e.lazy = !1, s[e.id] = e }), i.forEach(function(e) {! function(e, t) {! function a(n) { var r = n.parentId,
                                                c = t[r];
                                            r && (e.parents || (e.parents = []), c && a(c), e.parents.push(r)) }(e) }(e, s) }), Object(x.a)({}, e, { idMap: s, sqlSaveData: i, newFolderId: t.newFolderId });
                            case M.CHANGE_RELATE_SHOW:
                                var u = e.showAllRelate; return Object(x.a)({}, e, { showAllRelate: !u });
                            case M.GET_COLLEAGUES_SUCCESS:
                                return Object(x.a)({}, e, { colleagues: t.colleagues });
                            case M.CHANGE_DATA_TAB:
                                return Object(x.a)({}, e, { query_tab: t.v });
                            case M.SET_ELEMENT_LOADING:
                                return Object(x.a)({}, e, { elementLoading: t.v });
                            case M.SET_TABLE_SAVA_LOADING:
                                return Object(x.a)({}, e, { tableSaveLoading: t.v });
                            case M.ADD_TABLE_INFO:
                                var d = e.tableInfos,
                                    f = jr()(d);
                                f["".concat(t.data.db, ".").concat(t.data.table)] = { name: t.data.table, expand: !0, currentTab: 0, partition: { search: "", originList: [], list: [], order: "asc", orderBy: "createTime" }, preview: { search: "", columns: [], records: [], originRecords: [], order: "asc", orderBy: "" } }; var b = Object.keys(f).indexOf("".concat(t.data.db, ".").concat(t.data.table)); return Object(x.a)({}, e, { infoTab: b, tableInfos: f });
                            case M.CHANGE_PARTITION_TAB:
                                var p = e.tableInfos,
                                    m = e.infoTab,
                                    E = jr()(p); return E[Object.keys(p)[m]].currentTab = t.activeTab, Object(x.a)({}, e, { tableInfos: E });
                            case M.GET_PARTITION_SUCCESS:
                                var g = t.list,
                                    O = t.db,
                                    h = t.table,
                                    v = t.success,
                                    S = e.tableInfos,
                                    j = jr()(S); return j["".concat(O, ".").concat(h)].partition.list = g, j["".concat(O, ".").concat(h)].partition.originList = g, j["".concat(O, ".").concat(h)].partition.success = v, Object(x.a)({}, e, { tableInfos: j, needScroll: j });
                            case M.GET_PARTITION_FAILD:
                                var y = t.list,
                                    C = t.db,
                                    T = t.table,
                                    _ = t.message,
                                    k = t.success,
                                    I = e.tableInfos,
                                    N = jr()(I); return N["".concat(C, ".").concat(T)].partition.list = y, N["".concat(C, ".").concat(T)].partition.originList = y, N["".concat(C, ".").concat(T)].partition.message = _, N["".concat(C, ".").concat(T)].partition.success = k, Object(x.a)({}, e, { tableInfos: N, needScroll: N });
                            case M.GET_PREVIEW_SUCCESS:
                                var A = t.columnNames,
                                    w = t.records,
                                    R = t.db,
                                    L = t.table,
                                    D = t.success,
                                    G = e.tableInfos,
                                    F = jr()(G),
                                    P = []; return A.forEach(function(e) { P.push({ id: e, label: e, needSort: !0 }) }), F["".concat(R, ".").concat(L)].preview.headers = A, F["".concat(R, ".").concat(L)].preview.columns = P, F["".concat(R, ".").concat(L)].preview.records = w, F["".concat(R, ".").concat(L)].preview.originRecords = w, F["".concat(R, ".").concat(L)].preview.orderBy = [A][0], F["".concat(R, ".").concat(L)].preview.success = D, Object(x.a)({}, e, { tableInfos: F });
                            case M.GET_PREVIEW_FAILD:
                                var U = t.columnNames,
                                    B = t.records,
                                    H = t.db,
                                    q = t.table,
                                    Q = t.message,
                                    V = t.success,
                                    z = e.tableInfos,
                                    Y = jr()(z),
                                    W = []; return U.forEach(function(e) { W.push({ id: e, label: e, needSort: !0 }) }), Y["".concat(H, ".").concat(q)].preview.headers = U, Y["".concat(H, ".").concat(q)].preview.columns = W, Y["".concat(H, ".").concat(q)].preview.records = B, Y["".concat(H, ".").concat(q)].preview.originRecords = B, Y["".concat(H, ".").concat(q)].preview.orderBy = [U][0], Y["".concat(H, ".").concat(q)].preview.message = Q, Y["".concat(H, ".").concat(q)].preview.success = V, console.log(Y), Object(x.a)({}, e, { tableInfos: Y });
                            case M.DELET_TABLE_INFO:
                                var K = e.tableInfos,
                                    X = e.infoTab,
                                    J = jr()(K);
                                delete J[Object.keys(J)[t.index]]; var $ = X; return t.index <= X && ($ = 0 === X ? 0 : X - 1), Object(x.a)({}, e, { tableInfos: J, infoTab: $ });
                            case M.CHANGE_TABLE_INFO_TAB:
                                return Object(x.a)({}, e, { infoTab: t.index });
                            case M.CLOSE_ALL_TABLE_INFO_TAB:
                                return Object(x.a)({}, e, { tableInfos: {}, infoTab: -1 });
                            case M.SORT_PARTITION_LIST:
                                var Z = t.order,
                                    ee = t.orderBy,
                                    te = e.tableInfos,
                                    ae = e.infoTab,
                                    ne = jr()(te),
                                    re = Object.keys(ne),
                                    ce = ne[re[ae]].partition.list.sort(el(Z, ee)); return ne[re[ae]].partition.list = ce, ne[re[ae]].partition.order = Z, ne[re[ae]].partition.orderBy = ee, Object(x.a)({}, e, { tableInfos: ne });
                            case M.SORT_PREVIEW_LIST:
                                var oe = t.order,
                                    le = t.orderBy,
                                    ie = e.tableInfos,
                                    se = e.infoTab,
                                    ue = jr()(ie),
                                    de = Object.keys(ue),
                                    fe = ue[de[se]].preview,
                                    be = fe.records,
                                    pe = fe.headers,
                                    me = be.sort(el(oe, le, function(e) { return e[pe.indexOf(le)] })); return ue[de[se]].preview.records = me, ue[de[se]].preview.order = oe, ue[de[se]].preview.orderBy = le, Object(x.a)({}, e, { tableInfos: ue });
                            case M.MINIMIZE_INFO:
                                var Ee = e.tableInfos,
                                    ge = e.infoTab,
                                    Oe = jr()(Ee); return Oe[Object.keys(Oe)[ge]].expand = !1, Object(x.a)({}, e, { tableInfos: Oe });
                            case M.TOGGLE_INFO:
                                var he = e.tableInfos,
                                    ve = e.infoTab,
                                    xe = jr()(he),
                                    Se = Object.keys(xe); return xe[Se[ve]].expand = !xe[Se[ve]].expand, Object(x.a)({}, e, { tableInfos: xe });
                            case M.CHANGE_PARTITION_KEY:
                                var je = t.v,
                                    ye = e.tableInfos,
                                    Ce = e.infoTab,
                                    Te = jr()(ye),
                                    _e = Object.keys(Te),
                                    ke = Te[_e[Ce]].partition,
                                    Ie = ke.originList,
                                    Ne = ke.order,
                                    Ae = ke.orderBy,
                                    we = function(e, t) { return e.filter(function(e) { return e.name && e.name.indexOf(t.toLowerCase()) >= 0 || e.path && e.path.toLowerCase().indexOf(t.toLowerCase()) >= 0 || e.size && e.size.toLowerCase().indexOf(t.toLowerCase()) >= 0 || e.createTime && e.createTime.toLowerCase().indexOf(t.toLowerCase()) >= 0 }) }(Ie.sort(el(Ne, Ae)), je); return Te[_e[Ce]].partition.list = we, Te[_e[Ce]].partition.search = je, Object(x.a)({}, e, { tableInfos: Te });
                            case M.CHANGE_PREVIEW_KEY:
                                var Re = t.v,
                                    Le = e.tableInfos,
                                    De = e.infoTab,
                                    Ge = jr()(Le),
                                    Fe = Object.keys(Ge),
                                    Pe = Ge[Fe[De]].preview,
                                    Ue = Pe.originRecords,
                                    Be = Pe.order,
                                    He = Pe.orderBy,
                                    qe = Pe.headers,
                                    Me = function(e, t) { return e.filter(function(e) { for (var a = !1, n = e.length, r = 0; r < n; r++)
                                                if (e[r] && e[r].indexOf(t.toLowerCase()) >= 0) { a = !0; break } return a }) }(Ue.sort(el(Be, He, function(e) { return e[qe.indexOf(He)] })), Re); return Ge[Fe[De]].preview.records = Me, Ge[Fe[De]].preview.search = Re, Object(x.a)({}, e, { tableInfos: Ge });
                            default:
                                return e } }, main: function() { var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : nl,
                            t = arguments.length > 1 ? arguments[1] : void 0; switch (t.type) {
                            case q.ADD_QUERY:
                                var a = e.querys,
                                    n = e.tabId,
                                    r = Object(Ua.a)(a); return r.push({ sqlSelected: "", sql: "", saveSql: "", fileId: -1, queryId: -1, userId: "", status: Mt.READY, name: "\u67e5\u8be2-".concat(n + 1), tasks: [], activeTask: 0, tabId: n + 1, position: [0], needCursor: !1, cursor: [{ row: 0, column: 0 }], isSaved: !1, rename: "" }), Object(x.a)({}, e, { querys: r, activeIndex: a.length, tabId: n + 1 });
                            case q.CHANGE_TAB:
                                return Object(x.a)({}, e, { activeIndex: t.v });
                            case q.CHANGE_TASK_TAB:
                                var c = e.querys,
                                    o = e.activeIndex,
                                    l = Object(Ua.a)(c); return l[o] = Object(x.a)({}, l[o], { activeTask: t.v }), Object(x.a)({}, e, { querys: l });
                            case q.CHANGE_QUERY:
                                var i = e.querys,
                                    s = e.activeIndex,
                                    u = Object(Ua.a)(i); return u[s] = Object(x.a)({}, u[s], { sql: t.v, needCursor: !1 }), t.flag && t.v !== i[s].saveSql ? u[s] = Object(x.a)({}, u[s], { isSaved: !0 }) : t.flag && (u[s] = Object(x.a)({}, u[s], { isSaved: !1 })), Object(x.a)({}, e, { querys: u });
                            case q.CHANGE_SELECTED_SQl:
                                var d = e.querys,
                                    f = e.activeIndex,
                                    b = Object(Ua.a)(d); return b[f] = Object(x.a)({}, b[f], { sqlSelected: t.v }), Object(x.a)({}, e, { querys: b });
                            case M.RENAME_SAVE_SQL_SUCCESS:
                                for (var p = e.querys, m = Object(Ua.a)(p), E = t.id, g = t.name, O = 0; O < m.length; O++)
                                    if (m[O].fileId === E) { m[O] = Object(x.a)({}, m[O], { name: g }); break } return Object(x.a)({}, e, { querys: m });
                            case q.FORMAT_QUERY_SUCCESS:
                                var h = e.querys,
                                    v = e.activeIndex,
                                    S = Object(Ua.a)(h),
                                    j = ""; if (t.range.start.row === t.range.end.row && t.range.start.column === t.range.end.column) return S[v] = Object(x.a)({}, S[v], { sql: t.format }), Object(x.a)({}, e, { querys: S }); for (var y = 0; y < t.lines.length; y++) t.range.start.row === y && (j = "".concat(j).concat(0 === y ? "" : "\n").concat(t.lines[y].substring(0, t.range.start.column)).concat(t.format)), t.range.start.row > y && (j = "".concat(j).concat(0 === y ? "" : "\n").concat(t.lines[y])), t.range.end.row === y && (j = "".concat(j).concat(t.lines[y].substring(t.range.end.column))), t.range.end.row < y && (j = "".concat(j).concat(0 === y ? "" : "\n").concat(t.lines[y])); return S[v] = Object(x.a)({}, S[v], { sql: j }), Object(x.a)({}, e, { querys: S });
                            case q.DELETE_QUERY:
                                var C = e.querys,
                                    T = e.activeIndex,
                                    _ = Object(Ua.a)(C);
                                _.splice(t.deleteIndex, 1); var k = T; return t.deleteIndex <= T && (k = 0 === T ? 0 : T - 1), Object(x.a)({}, e, { querys: _, activeIndex: k });
                            case q.CLEAR_TASK_TAB:
                                var I = e.querys,
                                    N = e.activeIndex,
                                    A = Object(Ua.a)(I),
                                    w = Object(Ua.a)(A[N].tasks);
                                w.splice(t.index, 1); var R = A[N].activeTask,
                                    L = R; return t.index <= R && (L = 0 === R ? 0 : R - 1), A[N] = Object(x.a)({}, A[N], { tasks: w, activeTask: L }), Object(x.a)({}, e, { querys: A });
                            case q.SAVE_QUERY_SUCCESS:
                                var D = e.querys,
                                    G = e.activeIndex,
                                    F = Object(Ua.a)(D); return F[G] = Object(x.a)({}, F[G], { name: t.name, fileId: t.id }), Object(x.a)({}, e, { querys: F });
                            case q.EXECUTE_QUERY_SUCCESS:
                                for (var P = e.querys, U = Object(Ua.a)(P), B = U.length, H = t.tabId, Q = new Date, V = 0; V < B; V++)
                                    if (H === U[V].tabId) { var z = Object(Ua.a)(U[V].tasks);
                                        z[z.length] = { rename: "", id: t.id, uuid: t.uuid, log: "", status: Mt.READY, name: "\u4efb\u52a1ID - ".concat(t.id), enterLogs: [], result: {}, showLogTab: 1, sql: t.sql, engine: t.engine, isPersonal: t.isPersonal, role: t.role, startTime: Q, downloadPermission: !0, executeValue: 0 }, U[V].queryId = t.id, U[V].tasks = z, U[V].activeTask = U[V].tasks.length - 1; break } return Object(x.a)({}, e, { querys: U });
                            case q.GET_EXECUTE_RESULT_SUCCESS:
                                for (var Y = e.querys, W = t.tabId, K = Y.length, X = Object(Ua.a)(Y), J = -1, $ = -1, Z = 0; Z < K; Z++)
                                    if (W === Y[Z].tabId) { J = Z; for (var ee = Y[Z].tasks.length, te = 0; te < ee; te++)
                                            if (t.id === Y[Z].tasks[te].id) { $ = te; break } break } if (-1 === J || -1 === $) return Object(x.a)({}, e); var ae = Object(Ua.a)(X[J].tasks),
                                    ne = Object(x.a)({}, ae[$], { status: t.status }),
                                    re = Object(x.a)({}, ne.result); if (ne.result = re, t.log.length) { for (var ce = Object(Ua.a)(ne.enterLogs), oe = 0, le = 0; le < t.log.length; le++) "\n" === t.log[le] && (ce.push(t.log.substring(oe, le)), oe = le + 1);
                                    ne.enterLogs = ce } if (ne.result.isPersonal = t.isPersonal, ne.result.elapseTime = function(e) { var t = parseFloat(e) / 1e3; return t = null !== t && "" !== t ? t > 60 && t < 3600 ? parseInt((t / 60).toString()) + "\u5206\u949f" + parseInt((60 * (parseFloat((t / 60).toString()) - parseInt((t / 60).toString()))).toString()) + "\u79d2" : t >= 3600 && t < 86400 ? parseInt((t / 3600).toString()) + "\u5c0f\u65f6" + parseInt((60 * (parseFloat((t / 3600).toString()) - parseInt((t / 3600).toString()))).toString()) + "\u5206\u949f" + parseInt((60 * (parseFloat((60 * (parseFloat((t / 3600).toString()) - parseInt((t / 3600).toString()))).toString()) - parseInt((60 * (parseFloat((t / 3600).toString()) - parseInt((t / 3600).toString()))).toString()))).toString()) + "\u79d2" : parseInt(t) + "\u79d2" : "0 \u65f6 0 \u52060 \u79d2" }(t.elapseTime), ne.executeValue = Y[J].tasks[$].executeValue + 1, ne.executeValue >= 100 && (ne.executeValue = 99), t.status === Mt.FINISHED) { ne.executeValue = 100; var ie = t.tableData || [];
                                    ie.length > 1e3 && (ie = ie.slice(0, 1e3)); var se = t.columnNames || [],
                                        ue = new Array(se.length);
                                    se.forEach(function(e, t) { ue[t] = { id: e, label: e, needSort: !0, oldIndex: t } }), ne.showLogTab = 0; var de = { tableData: ie, tableDataFilter: ie, ischecked: ue.map(function() { return !0 }), needactive: !1, orderBy: "", searchKeyword: "", searchKeywordColumn: "", columnNames: ue, columnNamesFilter: ue, downloadPermission: t.downloadPerm, filePath: t.filePath, page: 0, rowsPerPage: 10 };
                                    Object.assign(ne.result, de) } return ae[$] = ne, X[J] = Object(x.a)({}, X[J], { tasks: ae, status: t.status }), Object(x.a)({}, e, { querys: X });
                            case q.CHANGE_PAGE:
                                var fe = e.querys,
                                    be = e.activeIndex,
                                    pe = fe[be].activeTask,
                                    me = Object(Ua.a)(fe),
                                    Ee = Object(Ua.a)(me[be].tasks),
                                    ge = Ee[pe],
                                    Oe = ge.result; return Oe = Object(x.a)({}, Oe, { page: t.page }), ge = Object(x.a)({}, ge, { result: Oe }), Ee[pe] = ge, me[be] = Object(x.a)({}, me[be], { tasks: Ee }), Object(x.a)({}, e, { querys: me });
                            case q.CHANGE_ROWS_PER_PAGE:
                                var he = e.querys,
                                    ve = e.activeIndex,
                                    xe = he[ve].activeTask,
                                    Se = Object(Ua.a)(he),
                                    je = Object(Ua.a)(Se[ve].tasks),
                                    ye = je[xe],
                                    Ce = ye.result; return t.rowsPage * (Se[ve].tasks[xe].result.page + 1) - t.rowsPage >= Se[ve].tasks[xe].result.tableDataFilter.length && (Ce = Object(x.a)({}, Ce, { page: Math.ceil(Se[ve].tasks[xe].result.tableDataFilter.length / t.rowsPage) - 1 })), Ce = Object(x.a)({}, Ce, { rowsPerPage: t.rowsPage }), ye = Object(x.a)({}, ye, { result: Ce }), je[xe] = ye, Se[ve] = Object(x.a)({}, Se[ve], { tasks: je }), Object(x.a)({}, e, { querys: Se });
                            case q.STORE_ISCHECKED:
                                var Te = e.querys,
                                    _e = e.activeIndex,
                                    ke = t.index,
                                    Ie = Te[_e].activeTask,
                                    Ne = Object(Ua.a)(Te),
                                    Ae = Object(Ua.a)(Ne[_e].tasks),
                                    we = Ae[Ie],
                                    Re = we.result,
                                    Le = we.result.ischecked; return Le[ke] = !Le[ke], Re = Object(x.a)({}, Re, { ischecked: Le }), we = Object(x.a)({}, we, { result: Re }), Ae[Ie] = we, Ne[_e] = Object(x.a)({}, Ne[_e], { tasks: Ae }), Object(x.a)({}, e, { querys: Ne });
                            case q.RESET_ISCHECKED:
                                for (var De = e.querys, Ge = e.activeIndex, Fe = De[Ge].activeTask, Pe = Object(Ua.a)(De), Ue = Object(Ua.a)(Pe[Ge].tasks), Be = Ue[Fe], He = Be.result, qe = Be.result.columnNames ? Be.result.columnNames.length : 0, Me = [], Qe = 0; Qe < qe; Qe++) Me.push(t.isChecked); return He = Object(x.a)({}, He, { ischecked: Me }), Be = Object(x.a)({}, Be, { result: He }), Ue[Fe] = Be, Pe[Ge] = Object(x.a)({}, Pe[Ge], { tasks: Ue }), Object(x.a)({}, e, { querys: Pe });
                            case q.SWITCH_DETAIL:
                                var Ve = e.querys,
                                    ze = e.activeIndex,
                                    Ye = Object(Ua.a)(Ve),
                                    We = Object(Ua.a)(Ye[ze].tasks),
                                    Ke = Ye[ze].activeTask,
                                    Xe = We[Ke]; return Xe = Object(x.a)({}, Xe, { showLogTab: t.v }), We[Ke] = Xe, Ye[ze] = Object(x.a)({}, Ye[ze], { tasks: We }), Object(x.a)({}, e, { querys: Ye });
                            case q.CHANGE_RESULT_KEYWORD:
                                var Je = e.querys,
                                    $e = e.activeIndex,
                                    Ze = t.v,
                                    et = Object(Ua.a)(Je),
                                    tt = et[$e].activeTask,
                                    at = Object(Ua.a)(et[$e].tasks),
                                    nt = at[tt],
                                    rt = nt.result,
                                    ct = nt.result.tableData,
                                    ot = [];
                                ct.forEach(function(e) { for (var t = 0; t < e.length; t++)
                                        if (e[t] && e[t].toLowerCase().indexOf(Ze.toLowerCase()) >= 0) return void ot.push(e) }); var lt = ot.filter(function(e) { return e }); return Ze || (lt = Object(Ua.a)(et[$e].tasks[tt].result.tableData)), rt = Object(x.a)({}, rt, { tableDataFilter: lt, searchKeyword: Ze }), nt = Object(x.a)({}, nt, { result: rt }), at[tt] = nt, et[$e] = Object(x.a)({}, et[$e], { tasks: at }), Object(x.a)({}, e, { querys: et });
                            case q.RENAME_QUERY:
                                var it = e.querys,
                                    st = e.activeIndex,
                                    ut = Object(Ua.a)(it); if ("query" === t.renameType) ut[t.index] = Object(x.a)({}, ut[t.index], { rename: t.name });
                                else if ("task" === t.renameType) { var dt = Object(Ua.a)(ut[st].tasks);
                                    dt[t.index] = Object(x.a)({}, dt[t.index], { rename: t.name }), ut[st] = Object(x.a)({}, ut[st], { tasks: dt }) } return Object(x.a)({}, e, { querys: ut });
                            case q.CHANGE_COLUMNNAMES:
                                var ft = e.querys,
                                    bt = e.activeIndex,
                                    pt = Object(Ua.a)(ft),
                                    mt = ft[bt].activeTask,
                                    Et = Object(Ua.a)(pt[bt].tasks),
                                    gt = Et[mt],
                                    Ot = gt.result,
                                    ht = ft[bt].tasks[mt].result.columnNames;
                                Ot = Object(x.a)({}, Ot, { searchKeywordColumn: t.v }); var vt = ht.filter(function(e) { return e.label.toLowerCase().indexOf(t.v.toLowerCase()) >= 0 }); return Ot = Object(x.a)({}, Ot, { columnNamesFilter: vt }), gt = Object(x.a)({}, gt, { result: Ot }), Et[mt] = gt, pt[bt] = Object(x.a)({}, pt[bt], { tasks: Et }), Object(x.a)({}, e, { querys: pt });
                            case q.GET_ONE_FILE_SUCCESS:
                                var xt = e.querys,
                                    St = e.tabId,
                                    jt = Object(Ua.a)(xt); return jt.push({ sqlSelected: "", sql: t.sql, saveSql: t.sql, fileId: t.fileId, queryId: -1, userId: t.userId, status: Mt.READY, name: t.name, tasks: [], activeTask: 0, tabId: St + 1, position: [0], needCursor: !1, cursor: [{ row: 0, column: 0 }], isSaved: !1, rename: "" }), Object(x.a)({}, e, { querys: jt, activeIndex: jt.length - 1, tabId: St + 1 });
                            case q.STOP_QUERY_SUCCESS:
                                var yt = e.querys,
                                    Ct = Object(Ua.a)(yt),
                                    Tt = -1,
                                    _t = -1; if (Ct.forEach(function(e, a) { e.tasks.forEach(function(e, n) { e.id === t.queryId && (Tt = a, _t = n) }) }), -1 === Tt || -1 === _t) return Object(x.a)({}, e); var kt = Object(Ua.a)(yt[Tt].tasks); return kt[_t] = Object(x.a)({}, kt[_t], { status: Mt.STOPPED }), Ct[Tt] = Object(x.a)({}, Ct[Tt], { tasks: kt, status: Mt.STOPPED }), Object(x.a)({}, e, { querys: Ct });
                            case q.CHANGE_ISSAVED:
                                var It = e.querys,
                                    Nt = e.activeIndex,
                                    At = Object(Ua.a)(It); return At[Nt] = Object(x.a)({}, At[Nt], { isSaved: t.data }), t.data || (At[Nt] = Object(x.a)({}, At[Nt], { saveSql: It[Nt].sql })), Object(x.a)({}, e, { querys: At });
                            case q.SORT_LIST_RESULT:
                                var wt = t.order,
                                    Rt = t.orderBy,
                                    Lt = e.querys,
                                    Dt = e.activeIndex,
                                    Gt = Object(Ua.a)(Lt),
                                    Ft = Lt[Dt].activeTask,
                                    Pt = Object(Ua.a)(Gt[Dt].tasks),
                                    Ut = Pt[Ft],
                                    Bt = Ut.result,
                                    Ht = Bt.tableDataFilter || [],
                                    qt = Bt.columnNames,
                                    Qt = Object(Ua.a)(Ht),
                                    Vt = [];
                                qt.forEach(function(e) { Vt.push(e.id) }); var zt = Qt.sort(el(wt, Vt.indexOf(Rt))); return Bt = Object(x.a)({}, Bt, { tableDataFilter: zt, needactive: !0, orderBy: Rt, order: wt }), Ut = Object(x.a)({}, Ut, { result: Bt }), Pt[Ft] = Ut, Gt[Dt] = Object(x.a)({}, Gt[Dt], { tasks: Pt }), Object(x.a)({}, e, { order: wt, orderBy: Rt, querys: Gt });
                            case q.SET_CURSOR:
                                var Yt = e.querys,
                                    Wt = e.activeIndex,
                                    Kt = Object(Ua.a)(Yt); return Kt[Wt] = Object(x.a)({}, Kt[Wt], { position: t.position, cursor: t.cursor, needCursor: !1 }), Object(x.a)({}, e, { querys: Kt });
                            case q.INSERT_SQL:
                                var Xt = e.querys,
                                    Jt = e.activeIndex,
                                    $t = Object(Ua.a)(Xt); if ($t[Jt].cursor.length) { var Zt = "",
                                        ea = "";
                                    $t[Jt].position.forEach(function(e, a, n) { 0 === a ? Zt = "".concat($t[Jt].sql.substring(0, e), " ").concat(t.data) : ea += "".concat($t[Jt].sql.substring(e, n[a - 1]), " ").concat(t.data) }); var ta = $t[Jt].sql.substring($t[Jt].position[$t[Jt].position.length - 1], $t[Jt].sql.length);
                                    $t[Jt] = Object(x.a)({}, $t[Jt], { sql: "".concat(Zt).concat(ea).concat(ta), needCursor: !0 }), $t[Jt].cursor.forEach(function(e, a) { e.column = e.column + "".concat(t.data).length }) } else $t[Jt] = Object(x.a)({}, $t[Jt], { sql: $t[Jt].sql + t.data }); return Object(x.a)({}, e, { querys: $t });
                            case q.APPEND_SQL:
                                var aa = e.querys,
                                    na = e.activeIndex,
                                    ra = Object(Ua.a)(aa); return ra[na] = Object(x.a)({}, ra[na], { sql: t.data + "\n" + ra[na].sql, needCursor: !1 }), Object(x.a)({}, e, { querys: ra });
                            default:
                                return e } } }),
                cl = a(359),
                ol = Object(cl.a)(),
                ll = Object(_.e)(rl, Object(_.a)(ol)),
                il = ol.run; for (var sl in Jo) il(Jo[sl]); var ul = ll,
                dl = function(e) { var t = e.message,
                        a = e.onOk,
                        n = e.onCancel,
                        c = e.onDeny,
                        o = e.open; return r.a.createElement(or, { title: "\u5173\u95ed\u4fdd\u5b58\u786e\u8ba4", open: o, content: r.a.createElement("p", null, "\u662f\u5426\u786e\u5b9a\u5173\u95ed\u5e76\u4fdd\u5b58".concat(t, "\uff1f")), actions: r.a.createElement(r.a.Fragment, null, r.a.createElement($n, { onClick: a, autoFocus: !0 }, "\u662f"), r.a.createElement(Xn, { onClick: c }, "\u5426"), r.a.createElement(Xn, { onClick: n }, "\u53d6\u6d88")), onClose: n }) },
                fl = a(47),
                bl = a(52),
                pl = a.n(bl),
                ml = Object(u.a)(function(e) { return Object(s.a)({ root: { flex: 1, paddingTop: "8px", flexDirection: "column", width: "100%" }, tabsRoot: { minHeight: "32px" }, tabsIndicator: { display: "none" }, tabRoot: { alignSelf: "flex-start", height: "33px", fontSize: "14px", color: "#333", padding: "0 25px", position: "relative", textTransform: "initial", minWidth: 45, maxWidth: 150, minHeight: "33px", "&:hover": { backgroundColor: "#fff", color: e.color.darkGray2, opacity: 1, borderBottom: "2px solid ".concat(e.palette.primary.main), borderLeft: e.border.baseBorder }, "&$tabSelected": { backgroundColor: "#fff", color: e.color.darkGray2, borderBottom: "2px solid ".concat(e.palette.primary.main), borderLeft: e.border.baseBorder }, borderRight: e.border.baseBorder, boxSizing: "content-box" }, tabSelected: {}, tabLabelContainer: { padding: 0 }, tabLabel: { "& i": { position: "absolute", right: "4px", fontSize: "12px" } }, tabInner: Object(x.a)({ minHeight: "16px", height: "16px", lineHeight: "16px", display: "flex", alignItems: "center", width: "100%" }, e.textOverflow), scrollButtons: { flex: "0 0 32px" }, scroller: { marginBottom: "0 !important", overflowX: "auto" }, tabsNav: { display: "flex", position: "relative", borderBottom: e.border.baseBorder, borderTop: e.border.baseBorder, flexWrap: "nowrap", backgroundColor: e.color.lightGray1, height: "37px", paddingLeft: e.spacing(2) }, addTab: { alignSelf: "center", width: "32px", height: "32px", float: "right", minWidth: "32px", minHeight: "0", padding: 0, borderRadius: "4px", color: e.color.darkGray2, "&:hover": { color: e.color.darkGray2 } }, statusIcon: { fontSize: "18px", marginRight: "5px", position: "absolute", left: "4px" }, failedIcon: { fontSize: "18px", color: e.color.red, marginRight: "5px", position: "absolute", left: "4px" }, finishedIcon: { fontSize: "18px", color: e.color.main, marginRight: "5px", position: "absolute", left: "4px" }, readyIcon: { fontSize: "28px", color: "#cabfbf !important", marginRight: "5px", position: "absolute", left: "2px" }, icon: { position: "absolute", top: "4px", right: "4px", fontSize: "14px" }, renameIcon: { position: "absolute", top: "16px", right: "4px", fontSize: "14px" }, SqlTable: { padding: "0 ".concat(e.spacing(2), "px") } }) }),
                El = function(e) { return e.map(function(e) { return { rename: e.rename, name: e.name, status: e.status, isSaved: e.isSaved, fileId: e.fileId, tasksLength: e.tasks.length, sql: e.sql, userId: e.userId } }) },
                gl = Object(fl.a)(function(e) { return e }, pl.a),
                Ol = Object(ka.a)(Object(D.b)(function(e) { var t = e.main,
                        a = t.activeIndex,
                        n = t.querys; return { activeIndex: a, querysTopBar: gl(El(n)) } }, function(e) { var t = we,
                        a = Re,
                        n = Fe,
                        r = qe; return Object(x.a)({ deleteQuery: function(e) {
                            function t(t) { return e.apply(this, arguments) } return t.toString = function() { return e.toString() }, t }(function(t) { var a = ul.getState().main.querys[t].tasks;
                            e(n(t)); var c = [];
                            a.forEach(function(e) { e.status !== Mt.READY && e.status !== Mt.RUNNING || c.push(e.id) }), c.length && e(r(c)) }) }, Object(_.b)({ addQuery: t, changeTab: a }, e)) }))(function(e) { var t = e.activeIndex,
                        a = e.addQuery,
                        c = void 0 === a ? P : a,
                        o = e.changeTab,
                        l = void 0 === o ? P : o,
                        i = e.deleteQuery,
                        s = void 0 === i ? P : i,
                        u = e.querysTopBar,
                        f = ml(e),
                        b = Object(n.useState)(!1),
                        p = Object(S.a)(b, 2),
                        m = p[0],
                        E = p[1],
                        g = Object(n.useState)(-1),
                        O = Object(S.a)(g, 2),
                        h = O[0],
                        v = O[1],
                        x = Object(n.useState)(""),
                        j = Object(S.a)(x, 2),
                        y = j[0],
                        C = j[1],
                        T = Object(n.useState)(!1),
                        _ = Object(S.a)(T, 2),
                        k = _[0],
                        I = _[1],
                        N = Object(n.useState)(!!u[t] && u[t].isSaved),
                        w = Object(S.a)(N, 2),
                        R = w[0],
                        L = w[1],
                        D = Object(n.useCallback)(function(e, t) { l(t) }, [l]),
                        G = Object(n.useCallback)(function(e) { c() }, [c]),
                        F = Object(n.useCallback)(function(e, a, n) { return I(u[a].status === Mt.RUNNING), (u[a].tasksLength || u[a].isSaved || -1 === u[t].fileId) && (-1 !== u[a].fileId || u[a].sql.length || u[a].tasksLength) ? (L(u[a].isSaved), e.stopPropagation(), C(n), E(!0), void v(a)) : (e.stopPropagation(), void s(a)) }, [u, t, s]),
                        U = Object(n.useCallback)(function(e) { var a = e.altKey,
                                n = e.keyCode || e.which || e.charCode;
                            a && 87 === n && F(e, t, u[t].name) }, [t, u, F]);
                    Object(n.useEffect)(function() { return document.addEventListener("keydown", U),
                            function() { document.removeEventListener("keydown", U) } }, [u, t, U]); var B = Object(n.useCallback)(function(e) { E(!1), s(e) }, [s]),
                        H = Object(n.useCallback)(function(e, t) { E(!1) }, []),
                        q = Object(n.useCallback)(function() { var e = u[h].sql,
                                t = u[h].userId,
                                a = u[h].fileId; if (e.trim()) { var n = { content: e, id: a, userId: t };
                                cc.updateOneFile(n).then(function(e) { e.success && (oa.notify({ variant: "success", content: "\u4fdd\u5b58\u6210\u529f!" }), s(h), E(!1)) }) } else oa.notify({ variant: "warning", content: "\u8bf7\u5148\u8f93\u5165SQL!" }) }, [u, s, h]),
                        M = Object(n.useCallback)(function() { E(!1), s(h) }, [s, h]); return r.a.createElement("div", { className: f.root }, r.a.createElement(d.a, { container: !0, className: f.tabsNav }, r.a.createElement(Aa.a, { onChange: D, value: t, variant: "scrollable", textColor: "primary", classes: { root: f.tabsRoot, indicator: f.tabsIndicator, scrollButtons: f.scrollButtons, scroller: f.scroller } }, u.map(function(e, t) { return r.a.createElement(Wa.a, { title: e.rename.length ? e.rename : e.name, placement: "top", key: t }, r.a.createElement(wa.a, { classes: { root: f.tabRoot, selected: f.tabSelected }, label: r.a.createElement("div", { className: f.tabInner }, r.a.createElement(yc, { status: e.status, className: e.status === Mt.READY ? f.readyIcon : e.status === Mt.FAILED ? f.failedIcon : e.status === Mt.FINISHED ? f.finishedIcon : f.statusIcon, flag: "query" }), e.rename.length ? e.rename : e.name, r.a.createElement(Ma.a, { onClick: function(a) { return F(a, t, e.rename.length ? e.rename : e.name) }, className: f.icon }), r.a.createElement(uc, { className: f.renameIcon, type: "query", index: t })) })) })), r.a.createElement(A.a, { color: "primary", onClick: G, className: f.addTab }, r.a.createElement(Tc.a, null))), r.a.createElement(_c, { onOk: function() { return B(h) }, onCancel: H, open: !R && m, message: "".concat(y), isRunning: k }), r.a.createElement(dl, { open: R && m, message: "".concat(y), onOk: q, onDeny: M, onCancel: H })) }),
                hl = a(191),
                vl = a.n(hl),
                xl = a(669),
                Sl = Object(u.a)(function(e) { return Object(s.a)({ root: { flex: 1, flexWrap: "nowrap" }, titleDiv: { padding: "16px 8px 8px 8px" }, title: { fontSize: "16px", marginRight: "16px" }, log: { padding: "8px", flex: 1 }, logBtn: { color: e.color.main, cursor: "pointer" }, pre: { display: "block", padding: "9.5px", margin: "0 0 10px", fontSize: "13px", lineHeight: "1.42", color: "#333333", wordBreak: "break-all", wordWrap: "break-word", background: "#f5f5f5", border: "1px solid #cccccc", borderRadius: "4px", whiteSpace: "pre-wrap", fontFamily: '"Monaco", "Menlo", "Consolas", "Courier New", "monospace"' }, engine: { display: "flex", padding: "4px 0" }, role: { marginLeft: "24px" }, info: { color: e.color.main, paddingBottom: "8px", marginBottom: "4px" }, time: { display: "inline-block", marginLeft: "20px", paddingLeft: "8px", borderLeft: "1px solid ".concat(e.color.midGray) }, Pres: { margin: 0, lineHeight: "1.42", wordBreak: "break-all", wordWrap: "break-word", padding: 0, whiteSpace: "pre-wrap", fontFamily: '"Monaco", "Menlo", "Consolas", "Courier New", "monospace"' }, preColor: { color: "red" }, clickExpand: { float: "right", color: "#666", cursor: "pointer", fontWeight: "bold" } }) }),
                jl = function(e, t) { var a = e[t],
                        n = a.activeTask,
                        r = a.tasks[n]; return { enterLogs: r.enterLogs, sql: r.sql, engine: r.engine, role: r.role, isPersonal: r.isPersonal, status: r.status, elapseTime: r.result.elapseTime, id: r.id } },
                yl = Object(fl.a)(function(e) { return e }, pl.a),
                Cl = Object(ka.a)(Object(D.b)(function(e) { var t = e.main,
                        a = t.activeIndex,
                        n = t.querys; return { querysTask: yl(jl(n, a)) } }))(function(e) { var t = e.querysTask,
                        a = Sl(e),
                        c = t.enterLogs,
                        o = t.sql,
                        l = t.engine,
                        i = t.role,
                        s = t.isPersonal,
                        u = t.status,
                        f = t.elapseTime,
                        b = Object(n.useState)(!1),
                        p = Object(S.a)(b, 2),
                        m = p[0],
                        E = p[1],
                        g = ["error", "failed", "FileNotFoundException", "NullPointException", "No such file or directory", "command not found", "Permission denied", "\u65e0\u8bbf\u95ee\u6743\u9650"];
                    Object(n.useEffect)(function() { E(!1) }, [t.id]); var O = Object(n.useCallback)(function(e) { for (var t = 0; t < g.length; t++) { var a = g[t].toLowerCase(); if (e.toLowerCase().match(a)) return !0 } return !1 }, [g]),
                        h = Object(n.useCallback)(function() { E(!m) }, [m]); return r.a.createElement(d.a, { container: !0, direction: "column", className: a.root }, r.a.createElement(d.a, { item: !0, className: a.titleDiv }, u !== Mt.RUNNING ? r.a.createElement("span", { className: a.time }, "\u8017\u65f6\uff1a", f) : null), r.a.createElement(d.a, { item: !0, className: a.log }, r.a.createElement("div", { className: a.info }, r.a.createElement(L.a, null, "\u67e5\u8be2\u4fe1\u606f"), r.a.createElement(xl.a, null)), r.a.createElement("div", { className: a.engine }, r.a.createElement(L.a, null, "\u6267\u884c\u5f15\u64ce\uff1a".concat(l)), s ? r.a.createElement(L.a, { className: a.role }, "\u4e2a\u4eba\u8d26\u53f7:".concat(i)) : r.a.createElement(L.a, { className: a.role }, "\u7ec4\u5e10\u53f7:".concat(i)), r.a.createElement(L.a, { className: a.role }, "\u4efb\u52a1ID\uff1a".concat(t.id))), r.a.createElement("pre", { className: a.pre }, m || o.indexOf("\n") < 0 ? o : "".concat(o.substring(0, o.indexOf("\n")), "..."), r.a.createElement("span", { onClick: h, className: a.clickExpand }, o.indexOf("\n") > 0 && (m ? "\u70b9\u51fb\u7701\u7565" : "\u70b9\u51fb\u67e5\u770b\u5168\u90e8"))), r.a.createElement("div", { className: a.info }, r.a.createElement(L.a, null, "\u67e5\u8be2\u65e5\u5fd7"), r.a.createElement(xl.a, null)), r.a.createElement("div", { className: a.pre }, c && c.map(function(e, t) { return r.a.createElement(r.a.Fragment, { key: t }, r.a.createElement("pre", { className: Ha()(a.Pres, Object(Pa.a)({}, a.preColor, O(e))) }, e)) })))) }),
                Tl = a(673),
                _l = a(674),
                kl = a(670),
                Il = a(671),
                Nl = a(672),
                Al = a(688),
                wl = Object(u.a)(function(e) { return Object(s.a)({ tableSortLabel: { userSelect: "auto" }, tableCell: { color: "#333" } }) }),
                Rl = function(e, t) { var a = e[t],
                        n = a.activeTask,
                        r = a.tasks[n].result; return { needactive: r.needactive, order: r.order, orderBy: r.orderBy } },
                Ll = Object(fl.a)(function(e) { return e }, pl.a),
                Dl = Object(ka.a)(Object(D.b)(function(e) { var t = e.main,
                        a = t.activeIndex,
                        n = t.querys,
                        r = n[a].activeTask; return { resultActive: n[a].tasks[r] ? Ll(Rl(n, a)) : null } }))(function(e) { var t = wl(e),
                        a = e.order,
                        c = e.orderBy,
                        o = e.columnData,
                        l = e.onRequestSort,
                        i = e.onSelected,
                        s = e.resultActive,
                        u = e.resultFlag,
                        d = !s || s.needactive,
                        f = s ? s.orderBy : "",
                        b = s ? s.order : "desc",
                        p = Object(n.useCallback)(function(e, t, a) { a && (i && i(), l(e, t)) }, [l, i]); return r.a.createElement(kl.a, null, r.a.createElement(Il.a, null, o.map(function(e) { return r.a.createElement(Nl.a, { style: e.style, key: e.oldIndex, padding: e.disablePadding ? "none" : "default", sortDirection: c === e.id && a, classes: { head: t.tableCell } }, r.a.createElement(Al.a, { classes: { root: t.tableSortLabel }, direction: u ? b : a, onClick: function(t) { return p(t, e.id, e.needSort) }, active: d && (u ? f : c) === e.id }, e.label)) }))) }),
                Gl = a(684),
                Fl = a(682),
                Pl = a(336),
                Ul = a.n(Pl),
                Bl = function(e) { var t = e.onOK,
                        a = e.onCancel,
                        c = e.msg,
                        o = e.open,
                        l = r.a.createRef(),
                        i = Object(n.useCallback)(function() { t(l.current.value) }, [t, l]),
                        s = Object(n.useCallback)(function(e) { 13 === e.keyCode && i() }, [i]); return r.a.createElement(or, { title: "\u4e0b\u8f7d\u5ba1\u6279\u7533\u8bf7", open: o, content: r.a.createElement(r.a.Fragment, null, r.a.createElement("form", { autoComplete: "off" }, r.a.createElement(sc.a, { required: !0, id: "standard-required", inputProps: { ref: l }, defaultValue: "\u9700\u8981\u4e0b\u8f7d\uff0c\u9ebb\u70e6\u5ba1\u6279", margin: "normal", variant: "outlined", helperText: r.a.createElement("span", { style: { fontSize: "14px" } }, c), onKeyDown: s }))), actions: r.a.createElement(r.a.Fragment, null, r.a.createElement(Xn, { onClick: i, autoFocus: !0 }, "\u786e\u5b9a"), r.a.createElement(Xn, { onClick: a }, "\u53d6\u6d88")), onClose: a, onEnter: i }) }; var Hl = function(e) { var t = document.createElement("textarea");
                    t.innerHTML = e, document.body.appendChild(t), t.select(), document.execCommand("copy"), document.body.removeChild(t) },
                ql = a(244),
                Ml = a.n(ql),
                Ql = a(246),
                Vl = a.n(Ql),
                zl = a(245),
                Yl = a.n(zl),
                Wl = a(243),
                Kl = a.n(Wl),
                Xl = a(119),
                Jl = Object(u.a)(function(e) { return { root: { flexShrink: 0, color: e.palette.text.secondary, marginLeft: e.spacing(2.5) } } }); var $l = function(e) { var t = Jl(),
                        a = Object(Xl.a)(),
                        n = e.count,
                        c = e.page,
                        o = e.rowsPerPage,
                        l = e.onChangePage; return r.a.createElement("div", { className: t.root }, r.a.createElement(N.a, { onClick: function(e) { l(e, 0) }, disabled: 0 === c, "aria-label": "first page" }, "rtl" === a.direction ? r.a.createElement(Kl.a, null) : r.a.createElement(Ml.a, null)), r.a.createElement(N.a, { onClick: function(e) { l(e, c - 1) }, disabled: 0 === c, "aria-label": "previous page" }, "rtl" === a.direction ? r.a.createElement(Yl.a, null) : r.a.createElement(Vl.a, null)), r.a.createElement(N.a, { onClick: function(e) { l(e, c + 1) }, disabled: c >= Math.ceil(n / o) - 1, "aria-label": "next page" }, "rtl" === a.direction ? r.a.createElement(Vl.a, null) : r.a.createElement(Yl.a, null)), r.a.createElement(N.a, { onClick: function(e) { l(e, Math.max(0, Math.ceil(n / o) - 1)) }, disabled: c >= Math.ceil(n / o) - 1, "aria-label": "last page" }, "rtl" === a.direction ? r.a.createElement(Ml.a, null) : r.a.createElement(Kl.a, null))) },
                Zl = Object(u.a)(function(e) { return Object(s.a)({ caption: { fontSize: "14px" }, input: { fontSize: "14px" }, table: { "& thead th": { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: "14px", padding: "8px 24px 8px 16px", fontWeight: 600 }, "& tbody td": { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: "14px", padding: "0px 24px 0px 16px" } }, tablerow: { backgroundColor: "#E6E6E6", color: e.color.darkGray2, fontSize: "13px", lineHeight: "17px", height: "34px" }, tablerowodd: { backgroundColor: "#F9F9F9", color: e.color.darkGray2, fontSize: "13px", lineHeight: "17px", height: "34px" }, cellBody: { color: "#333" } }) }),
                ei = function(e) { var t = Zl(e),
                        a = e.rowToColumnDate,
                        c = e.searchKeyWords,
                        o = Object(n.useState)(0),
                        l = Object(S.a)(o, 2),
                        i = l[0],
                        s = l[1],
                        u = Object(n.useState)(10),
                        d = Object(S.a)(u, 2),
                        f = d[0],
                        b = d[1],
                        p = Object(n.useState)(a),
                        m = Object(S.a)(p, 2),
                        E = m[0],
                        g = m[1],
                        O = Object(n.useState)("desc"),
                        h = Object(S.a)(O, 2),
                        v = h[0],
                        x = h[1],
                        j = Object(n.useState)(""),
                        y = Object(S.a)(j, 2),
                        C = y[0],
                        T = y[1],
                        _ = Object(n.useCallback)(function(e, t) { s(t) }, []),
                        k = Object(n.useCallback)(function(e) { b(e.target.value), e.target.value * (i + 1) - e.target.value + 1 > a.length && s(Math.ceil(a.length / e.target.value) - 1) }, [i, a.length]),
                        I = Object(n.useCallback)(function() { var e = []; return c.length ? (E.forEach(function(t) { for (var a = 0; a < t.length; a++)
                                    if (t[a] && t[a].toLowerCase().indexOf(c.toLowerCase()) >= 0) return void e.push(t) }), e) : e = E }, [E, c]),
                        N = [{ id: "1", label: "\u5b57\u6bb5\u540d\u79f0", needSort: !0, oldIndex: 0 }, { id: "2", label: "\u5b57\u6bb5\u503c", needSort: !0, oldIndex: 1 }],
                        A = Object(n.useCallback)(function(e, t) { console.log(t, v); var n = Xo.DESC;
                            v === Xo.DESC && (n = Xo.ASC); var r = [];
                            N.forEach(function(e) { r.push(e.id) }); var c = a.sort(el(n, r.indexOf(t)));
                            g(c), x(n), T(t) }, [v, N, a]); return r.a.createElement(r.a.Fragment, null, r.a.createElement(Tl.a, { className: t.table }, r.a.createElement(Dl, { order: v, orderBy: C, columnData: N, onRequestSort: A }), r.a.createElement(_l.a, null, I().slice(i * f, i * f + f).map(function(e, a) { return r.a.createElement(r.a.Fragment, { key: a }, r.a.createElement(Il.a, { classes: a % 2 ? { root: t.tablerow } : { root: t.tablerowodd } }, e && e.map(function(e, a) { return r.a.createElement(Nl.a, { key: a, classes: { body: t.cellBody } }, e) }))) }))), r.a.createElement(Gl.a, { classes: { caption: t.caption, input: t.input }, component: "div", rowsPerPageOptions: [10, 25, 50, 100], count: a.length, rowsPerPage: f, page: i, onChangePage: _, onChangeRowsPerPage: k, ActionsComponent: $l, labelDisplayedRows: function(e) { var t = e.from,
                                a = e.to,
                                n = e.count; return "\u7b2c ".concat(i + 1, " \u9875 ").concat(t, "-").concat(a, " of ").concat(n) } })) },
                ti = a(332),
                ai = a.n(ti),
                ni = a(333),
                ri = a.n(ni),
                ci = a(334),
                oi = a.n(ci),
                li = a(335),
                ii = a.n(li),
                si = Object(u.a)(function(e) { return Object(s.a)({ root: { flex: 1, outline: "none" }, tableWrap: { marginTop: "8px", overflow: "auto", display: "flex", flex: "1", flexDirection: "column", borderBottom: e.border.baseBorder }, wrapId: { wordBreak: "break-all" }, downloadBtn: { color: "white", marginRight: "16px" }, resetBtn: { width: "100%" }, resetBtnMargin: { marginRight: "5px" }, table: { "& thead th": { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: "14px", padding: "8px 24px 8px 16px", fontWeight: 600 }, "& tbody td": { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: "14px", padding: "0px 24px 0px 16px" } }, searchBtn: { width: "100%", height: "73px", backgroundColor: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", marginTop: "10px" }, noresult: { display: "flex", alignItems: "center", justifyContent: "center", height: "100px", color: "red", fontSize: "16px" }, MenuItem: { display: "flex", justifyContent: "space-between" }, fromLabel: { width: "100%" }, button: { width: "70px", height: "24px", minWidth: "0", minHeight: "0", borderRadius: "4px", color: "#fff", padding: "0px", "&:hover": { backgroundColor: e.color.main }, backgroundColor: e.color.main }, copyBtnC: { width: "70px", height: "24px", minWidth: "0", minHeight: "0", color: "#fff", padding: "0px", backgroundColor: e.color.main, borderRadius: "4px 0  0 4px", "&:hover": { backgroundColor: e.color.main } }, copyBtnH: { width: "70px", height: "24px", minWidth: "0", minHeight: "0", color: "#fff", padding: "0px", backgroundColor: e.color.main, borderRadius: "0 4px  4px 0", "&:hover": { backgroundColor: e.color.main } }, icons: { marginRight: "4px", fontSize: "18px" }, searchArea: { width: "400px" }, searchAreaColumn: { margin: "0 20px" }, tablerow: { backgroundColor: "#E6E6E6", color: e.color.darkGray2, fontSize: "13px", lineHeight: "17px", height: "34px" }, tablerowodd: { backgroundColor: "#F9F9F9", color: e.color.darkGray2, fontSize: "13px", lineHeight: "17px", height: "34px" }, info: { color: e.color.red, marginRight: "8px" }, tablerowSelect: { fontSize: "13px", lineHeight: "17px", height: "34px", backgroundColor: "".concat(e.color.main, " !important"), color: "#fff" }, cellBody: { color: "#333" }, copyHead: { width: "86px", height: "30px", boder: "none", background: "none", boxShadow: "none", border: "none", margin: "0 16px 0 0", padding: 0 }, caption: { fontSize: "14px" }, input: { fontSize: "14px" }, menu: { height: "873px" }, search: { flex: 1, padding: "0 18px", borderRight: e.border.baseBorder, height: "100%", display: "flex", alignItems: "center" }, hideColumn: { padding: "0 18px", borderRight: e.border.baseBorder, height: "100%", display: "flex", alignItems: "center", flexDirection: "column", color: e.color.darkGray, fontSize: "12px" }, download: { padding: "0 18px", borderRight: e.border.baseBorder, height: "100%", display: "flex", alignItems: "center", color: e.color.darkGray, fontSize: "12px", flexDirection: "column" }, copy: { padding: "0 18px", height: "100%", display: "flex", alignItems: "center", color: e.color.darkGray, fontSize: "12px" }, disabledButton: { backgroundColor: "#e0d9d9 !important", color: "#929292 !important" } }) }),
                ui = Object(ka.a)(Object(D.b)(function(e) { var t = e.main,
                        a = t.activeIndex,
                        n = t.querys,
                        r = t.order,
                        c = t.orderBy,
                        o = n[a].activeTask; return { order: r, orderBy: c, resultActive: n[a].tasks[o].result, activeTask: o } }, function(e) { var t = re,
                        a = Qe,
                        n = We,
                        r = Ke,
                        c = Xe,
                        o = et,
                        l = tt,
                        i = at; return Object(x.a)({}, Object(_.b)({ getList: function(e) { return te(e) }, sortListResult: n, getLog: t, changeKeyword: a, storeIsChecked: r, resetIsChecked: c, chengeColumnNames: o, changePage: l, changeRowsPerPage: i }, e)) }))(function(e) { var t = e.resultActive,
                        a = e.order,
                        c = e.orderBy,
                        o = e.sortListResult,
                        l = e.changeKeyword,
                        i = void 0 === l ? P : l,
                        s = e.storeIsChecked,
                        u = e.resetIsChecked,
                        f = e.chengeColumnNames,
                        b = e.changePage,
                        p = e.changeRowsPerPage,
                        m = e.activeTask,
                        E = Object(n.useState)(""),
                        g = Object(S.a)(E, 2),
                        O = g[0],
                        h = g[1],
                        v = Object(n.useState)(!1),
                        x = Object(S.a)(v, 2),
                        j = x[0],
                        C = x[1],
                        T = si(e),
                        _ = r.a.useState(null),
                        k = Object(S.a)(_, 2),
                        I = k[0],
                        w = k[1],
                        R = r.a.useState([]),
                        L = Object(S.a)(R, 2),
                        D = L[0],
                        G = L[1],
                        F = t.searchKeyword,
                        U = t.searchKeywordColumn,
                        B = Object(n.useState)(""),
                        H = Object(S.a)(B, 2),
                        q = H[0],
                        M = H[1],
                        Q = Object(n.useState)(!1),
                        V = Object(S.a)(Q, 2),
                        z = V[0],
                        Y = V[1],
                        W = Object(n.useState)([]),
                        K = Object(S.a)(W, 2),
                        X = K[0],
                        J = K[1],
                        $ = t.columnNames || [],
                        Z = t.columnNamesFilter || [],
                        ee = t.ischecked,
                        te = t.tableDataFilter || [],
                        ae = t.page || 0,
                        ne = t.rowsPerPage || 10,
                        re = Object(n.useState)(!1),
                        ce = Object(S.a)(re, 2),
                        oe = ce[0],
                        le = ce[1],
                        ie = function(e) { return -1 !== D.indexOf(e) },
                        se = Object(n.useCallback)(function() { G([]) }, []);
                    Object(n.useEffect)(function() { G([]), Y(!1) }, [m]), Object(n.useEffect)(function() { La()("#result_div").attr("tabindex", 1).on("keydown", function(e) { var t = window.getSelection(); if (67 === e.keyCode && e.ctrlKey && D && !t.toString()) { var a = "";
                                D.forEach(function(e, t) { a += "".concat(te[e].toString().replace(/,/g, "\t"), "\n") }), Hl(a.substring(0, a.length - 1)) } }) }, [D, te]); var ue = Object(n.useCallback)(function(e, t) { s(t) }, [s]); var de = Object(n.useCallback)(function(e, t) { b(t) }, [b]),
                        fe = Object(n.useCallback)(function(e) { p(e.target.value) }, [p]),
                        be = Object(n.useCallback)(function(e, t) { var n = Xo.DESC;
                            a === Xo.DESC && (n = Xo.ASC), o(n, t) }, [a, o]),
                        pe = Object(n.useCallback)(function(e) { var a = t.filePath.replace("download", "apply");
                            C(!1), cc.applayDownload(e, a).then(function(e) { e.success ? oa.notify({ variant: "success", content: "\u63d0\u4ea4\u6210\u529f\uff01" }) : oa.notify({ variant: "error", content: "\u63d0\u4ea4\u5931\u8d25\uff01".concat(e.msg) }) }) }, [t]),
                        me = Object(n.useCallback)(function(e, t) { C(!1) }, []),
                        Ee = Object(n.useCallback)(function(e) { var a = t.filePath; if (a) { var n = a.lastIndexOf("/"),
                                    r = a.substr(n + 1, a.length - 1),
                                    c = a.replace("download", "check/permission");
                                cc.checkdownloadperm(c).then(function(e) { if (e.response && 404 === e.response.status) oa.notify({ variant: "error", content: "\u8bf7\u6c42\u5931\u8d25\uff01" });
                                    else if (!1 !== e.success)
                                        if (e.success) { if (!e.data[0]) return C(!0), void M(e.msg); if (e.data[1]) { var t = document.createElement("a");
                                                t.setAttribute("href", a), t.setAttribute("target", "_blank"), t.setAttribute("id", r), document.getElementById(r) || document.body.appendChild(t), t.click() } else oa.notify({ variant: "info", content: "\u6587\u4ef6\u5df2\u7ecf\u8fc7\u671f\uff01" }) } else oa.notify({ variant: "info", content: "\u4e0d\u652f\u6301\u5728\u65b0\u7248\u4e0b\u8f7d\u65e7\u7248\u6267\u884c\u7684\u67e5\u8be2!" });
                                    else oa.notify({ variant: "info", content: e.msg }) }) } }, [t]); var ge = Object(n.useCallback)(function() { if (ee.filter(function(e) { return e }).length) { var e = "";
                                $.forEach(function(t, a, n) {!1 !== ee[a] && (e += t.label + "\t") }), Hl(e.substring(0, e.length - 1)), oa.notify({ variant: "success", content: "\u590d\u5236\u6210\u529f" }) } else oa.notify({ variant: "warning", content: "\u65e0\u53ef\u590d\u5236\u5185\u5bb9\uff01" }) }, [$, ee]),
                        Oe = Object(n.useCallback)(function() { if (ee.filter(function(e) { return e }).length) { var e = "",
                                    t = "";
                                $.forEach(function(e, a, n) {!1 !== ee[a] && (t += e.label + "\t") }), te.map(function(e, t) { return e.filter(function(e, t) { return ee[t] }) }).forEach(function(t, a) { e += "".concat(t.toString().replace(/,/g, "\t"), "\n") }); var a = t.substring(0, t.length - 1) + "\n" + e;
                                h(a), a.length > 5e4 ? le(!0) : (Hl(a), oa.notify({ variant: "success", content: "\u590d\u5236\u6210\u529f" })) } else oa.notify({ variant: "warning", content: "\u65e0\u53ef\u590d\u5236\u5185\u5bb9\uff01" }) }, [$, te, ee]),
                        he = Object(n.useCallback)(function() { le(!1) }, []),
                        ve = Object(n.useCallback)(function() { Hl(O), oa.notify({ variant: "success", content: "\u590d\u5236\u6210\u529f" }), le(!1) }, [O]),
                        xe = Object(n.useCallback)(function(e) { for (var t = e, a = 0; a < 32; a++) { var n = new RegExp(String.fromCharCode(a), "g");
                                t = t.replace(n, "") } return t }, []),
                        Se = Object(n.useCallback)(function() { if (D.length)
                                if (z) Y(!1);
                                else { var e = $.map(function(e, t) { return [e.label, te[D[0]][t]] }).filter(function(e, t) { return ee[t] });
                                    J(e), i(""), Y(!0) } }, [D, te, ee, $, z, i]); return r.a.createElement(d.a, { item: !0, className: T.root, id: "result_div" }, r.a.createElement("div", { className: T.searchBtn }, r.a.createElement("div", { className: T.search }, r.a.createElement(vr, { searchKeyword: F, changeKeyword: i, className: T.searchArea })), r.a.createElement("div", { className: T.hideColumn }, r.a.createElement(N.a, { onClick: function(e) { return Se() }, color: "secondary", className: T.button, disabled: 1 !== D.length, classes: { disabled: T.disabledButton } }, r.a.createElement(Ul.a, null)), r.a.createElement("p", null, " ", z ? "\u8fd4\u56de\u7ed3\u679c" : "\u884c\u8f6c\u5217")), r.a.createElement("div", { className: T.hideColumn }, r.a.createElement(N.a, { onClick: function(e) { return function(e, t) { w(e.currentTarget) }(e) }, color: "secondary", className: T.button, disabled: z, classes: { disabled: T.disabledButton } }, r.a.createElement("img", { src: ai.a, alt: "" })), r.a.createElement("p", null, " \u663e\u793a/\u9690\u85cf\u5217\u8868")), r.a.createElement(ic.a, { id: "simple-menu", anchorEl: I, keepMounted: !0, open: Boolean(I), onClose: function() { w(null) }, classes: { paper: T.menu } }, r.a.createElement(y.a, null, r.a.createElement(A.a, { variant: "contained", color: "default", className: "".concat(T.resetBtn, " ").concat(T.resetBtnMargin), onClick: function() { return u(!0) } }, "\u91cd\u7f6e"), r.a.createElement(A.a, { variant: "contained", color: "default", className: T.resetBtn, onClick: function() { return u(!1) } }, "\u4e0d\u663e\u793a\u6240\u6709\u5217")), r.a.createElement(vr, { searchKeyword: U, changeKeyword: f, className: T.searchAreaColumn }), Z && Z.map(function(e, t) { return r.a.createElement(y.a, { key: t, className: T.MenuItem, onClick: function(e) {} }, e.label, r.a.createElement(Fl.a, { checked: !ee || ee[e.oldIndex], onChange: function(t) { return ue(t, e.oldIndex) }, value: t, color: "primary", inputProps: { "aria-label": "secondary checkbox" } })) })), r.a.createElement("div", { className: T.download }, r.a.createElement(N.a, { color: "primary", className: T.button, onClick: Ee, disabled: z, classes: { disabled: T.disabledButton } }, r.a.createElement("img", { src: ri.a, alt: "" })), r.a.createElement("p", null, "\u4e0b\u8f7d\u7ed3\u679c")), r.a.createElement("div", { className: T.copy }, r.a.createElement("div", { style: { height: "100%", marginRight: "2px", textAlign: "center" } }, r.a.createElement(N.a, { color: "primary", className: T.copyBtnC, onClick: Oe, disabled: z, classes: { disabled: T.disabledButton } }, r.a.createElement("img", { src: oi.a, alt: "" })), r.a.createElement("p", null, "\u590d\u5236\u5185\u5bb9")), r.a.createElement("div", { style: { height: "100%", textAlign: "center" } }, r.a.createElement(N.a, { color: "primary", className: T.copyBtnH, onClick: ge, disabled: z, classes: { disabled: T.disabledButton } }, r.a.createElement("img", { src: ii.a, alt: "" })), r.a.createElement("p", null, " \u590d\u5236\u8868\u5934")))), r.a.createElement("div", { className: T.tableWrap }, z ? r.a.createElement(ei, { rowToColumnDate: X, searchKeyWords: F }) : $.length ? r.a.createElement(Tl.a, { className: T.table }, r.a.createElement(Dl, { order: a, orderBy: c, columnData: $.filter(function(e, t, a) { return !1 !== ee[t] }) || $, onRequestSort: be, onSelected: se, resultFlag: !0 }), r.a.createElement(_l.a, null, te && te.slice(ae * ne, ae * ne + ne).map(function(e, t) { return r.a.createElement(r.a.Fragment, { key: t }, r.a.createElement(Il.a, { classes: ie(t) ? { selected: T.tablerowSelect } : t % 2 ? { root: T.tablerow } : { root: T.tablerowodd }, onClick: function(e) { return function(e, t) { var a = D.indexOf(t); if (e.ctrlKey) { var n = []; - 1 === a ? n = n.concat(D, t) : 0 === a ? n = n.concat(D.slice(1)) : a === D.length - 1 ? n = n.concat(D.slice(0, -1)) : a > 0 && (n = n.concat(D.slice(0, a), D.slice(a + 1))), G(n) } else if (-1 === a) G([t]);
                                    else if (1 === D.length) G([]);
                                    else { var r = []; - 1 === a ? r = r.concat(D, t) : 0 === a ? r = r.concat(D.slice(1)) : a === D.length - 1 ? r = r.concat(D.slice(0, -1)) : a > 0 && (r = r.concat(D.slice(0, a), D.slice(a + 1))), G(r) } }(e, t) }, selected: ie(t) }, e && e.map(function(e, t) { return "undefined" === typeof ee || !0 === ee[t] ? r.a.createElement(Nl.a, { classes: { body: T.cellBody }, key: t }, xe(e)) : null }))) }))) : r.a.createElement("div", { className: T.noresult }, "\u65e0\u7ed3\u679c")), z ? null : r.a.createElement(Gl.a, { classes: { caption: T.caption, input: T.input }, component: "div", rowsPerPageOptions: [10, 25, 50, 100], count: te.length, rowsPerPage: ne, page: ae, onChangePage: de, onChangeRowsPerPage: fe, ActionsComponent: $l, labelDisplayedRows: function(e) { var t = e.from,
                                a = e.to,
                                n = e.count; return "\u7b2c ".concat(ae + 1, " \u9875 ").concat(t, "-").concat(a, " of ").concat(n) } }), r.a.createElement(Bl, { onOK: pe, onCancel: me, open: j, msg: q }), r.a.createElement(or, { title: "\u590d\u5236\u786e\u8ba4", open: oe, content: r.a.createElement(r.a.Fragment, null, r.a.createElement("p", null, "\u590d\u5236\u5185\u5bb9\u8fc7\u5927\uff0c\u7ee7\u7eed\u590d\u5236\u53ef\u80fd\u4f1a\u9020\u6210\u6d4f\u89c8\u5668\u5361\u987f\uff0c\u662f\u5426\u7ee7\u7eed\uff1f")), actions: r.a.createElement(r.a.Fragment, null, r.a.createElement($n, { onClick: ve, autoFocus: !0 }, "\u786e\u5b9a"), r.a.createElement(Xn, { onClick: he }, "\u53d6\u6d88")), onClose: he, onEnter: ve })) }),
                di = ui,
                fi = a(675),
                bi = a(122),
                pi = a.n(bi),
                mi = Object(u.a)(function(e) { return Object(s.a)({ root: { display: "flex", flexDirection: "column" }, stopBtn: { color: "white", marginRight: "8px", boxShadow: "none", backgroundColor: e.color.red, "&:hover": { color: "white", backgroundColor: e.color.red } }, progress: { flex: 1, padding: "16px 8px 8px 8px" }, pauseIcon: { fontSize: "14px" }, addition: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: "8px" }, info: { color: e.color.main } }) }),
                Ei = function(e, t) { var a = e[t],
                        n = a.activeTask,
                        r = a.tasks[n]; return { executeValue: r.executeValue, elapseTime: r.result.elapseTime, id: r.id } },
                gi = Object(fl.a)(function(e) { return e }, pl.a),
                Oi = Object(ka.a)(Object(D.b)(function(e) { var t = e.main,
                        a = t.activeIndex,
                        n = t.querys; return { querysTask: gi(Ei(n, a)) } }, function(e) { return Object(x.a)({ stopQuery: function(t) { e(Ue(t)) } }, Object(_.b)({}, e)) }))(function(e) { var t = e.querysTask,
                        a = e.stopQuery,
                        c = void 0 === a ? P : a,
                        o = mi(e),
                        l = t.executeValue,
                        i = t.elapseTime,
                        s = Object(n.useCallback)(function(e) { var a = t.id;
                            c(a) }, [t, c]); return r.a.createElement("div", { className: o.root }, r.a.createElement("div", { className: o.progress }, r.a.createElement(fi.a, { variant: "determinate", value: l })), r.a.createElement("div", { className: o.addition }, r.a.createElement("div", { className: o.info }, "\u6b63\u5728\u6267\u884c\uff0c\u5df2\u6267\u884c".concat(i || "0\u79d2", " | \u8fdb\u5ea6").concat(l, "%")), r.a.createElement(A.a, { variant: "contained", className: o.stopBtn, onClick: s }, r.a.createElement(pi.a, { className: o.pauseIcon }), "\u505c\u6b62"))) }),
                hi = a(190),
                vi = a.n(hi),
                xi = a(337),
                Si = a.n(xi),
                ji = Object(u.a)(function(e) { return Object(s.a)({ root: { flex: 1, display: "flex", flexDirection: "column", padding: "16px", border: e.border.baseBorder }, result: { flexWrap: "nowrap", flex: 1, border: e.border.baseBorder }, top: { padding: "16px 8px 8px 8px" }, title: { fontSize: "16px", marginRight: "16px" }, logBtn: { color: e.color.main, cursor: "pointer" }, time: { display: "inline-block", marginLeft: "20px", paddingLeft: "8px", borderLeft: "1px solid ".concat(e.color.midGray), color: e.color.main }, tabsRoot: { flex: 1, display: "flex", minHeight: 39 }, tabRoot: { minWidth: 60, fontWeight: 600, minHeight: 24, alignSelf: "flex-end", backgroundColor: "#F9F9F9", color: e.color.darkGray, position: "relative", textTransform: "initial", "&$tabSelected": { backgroundColor: "#fff", color: e.color.darkGray2, borderTop: "".concat(e.palette.primary.main, " 3px solid") }, border: e.border.baseBorder, borderBottom: "none", boxSizing: "content-box" }, tabSelected: {}, tabsIndicator: { display: "none" }, info: { color: e.color.red, marginRight: "16px", float: "right" }, icons: { verticalAlign: "middle" }, iconColor: { verticalAlign: "middle", color: e.color.main } }) }),
                yi = function(e, t) { var a = e[t],
                        n = a.activeTask,
                        r = a.tasks[n]; return { showLogTab: r.showLogTab, status: r.status, elapseTime: r.result.elapseTime } },
                Ci = Object(fl.a)(function(e) { return e }, pl.a),
                Ti = Object(ka.a)(Object(D.b)(function(e) { var t = e.main,
                        a = t.activeIndex,
                        n = t.querys; return { querysTask: Ci(yi(n, a)) } }, function(e) { var t = Me; return Object(x.a)({}, Object(_.b)({ switchDetail: t }, e)) }))(function(e) { var t = e.querysTask,
                        a = e.switchDetail,
                        c = void 0 === a ? P : a,
                        o = t.status,
                        l = ji(e),
                        i = t.showLogTab,
                        s = t.elapseTime,
                        u = Object(n.useCallback)(function(e, t) { c(t) }, [c]); return r.a.createElement("div", { className: l.root }, o === Mt.RUNNING || o === Mt.READY ? r.a.createElement(Oi, null) : null, r.a.createElement(Aa.a, { textColor: "primary", indicatorColor: "primary", value: i, onChange: u, classes: { root: l.tabsRoot, indicator: l.tabsIndicator } }, r.a.createElement(wa.a, { label: r.a.createElement("span", null, r.a.createElement(vi.a, { className: i ? l.icons : l.iconColor }), "\u7ed3\u679c"), classes: { root: l.tabRoot, selected: l.tabSelected } }), r.a.createElement(wa.a, { label: r.a.createElement("span", null, r.a.createElement(Si.a, { className: i ? l.iconColor : l.icons }), "\u65e5\u5fd7"), classes: { root: l.tabRoot, selected: l.tabSelected } })), r.a.createElement(d.a, { container: !0, direction: "column", className: l.result }, i ? r.a.createElement(Cl, null) : r.a.createElement(d.a, { item: !0, className: l.top }, r.a.createElement("span", { className: l.time }, "\u8017\u65f6\uff1a", s), r.a.createElement("span", { className: l.info }, "\u754c\u9762\u6700\u591a\u663e\u793a1000\u884c"), r.a.createElement(di, null)))) }),
                _i = Object(u.a)(function(e) { return Object(s.a)({ deleteAllTab: { float: "right", padding: "0 6px", minHeight: 0, minWidth: 0, background: "#F1F1F1", borderRadius: "4px", marginRight: "4px", width: "29px", height: "29px" }, hidden: { display: "none" }, search: { margin: "0 4px" } }) }),
                ki = function(e, t) { var a = e[t]; return a ? a.tasks.map(function(e) { return { rename: e.rename, name: e.name, hidden: !1 } }) : [] },
                Ii = Object(fl.a)(function(e) { return e }, pl.a),
                Ni = Object(ka.a)(Object(D.b)(function(e) { var t = e.main,
                        a = t.activeIndex,
                        n = t.querys; return { querysTask: Ii(ki(n, a)) } }, function(e) { var t = Be; return Object(x.a)({}, Object(_.b)({ changeTaskTab: t }, e)) }))(function(e) { var t = e.querysTask,
                        a = e.changeTaskTab,
                        c = _i(e),
                        o = Object(n.useState)(""),
                        l = Object(S.a)(o, 2),
                        i = l[0],
                        s = l[1],
                        u = r.a.useState(null),
                        d = Object(S.a)(u, 2),
                        f = d[0],
                        b = d[1],
                        p = Object(n.useState)([]),
                        m = Object(S.a)(p, 2),
                        E = m[0],
                        g = m[1]; var O = Object(n.useCallback)(function() { s(""), b(null), g([]) }, []),
                        h = Object(n.useCallback)(function(e) { return function() { a(e), b(null) } }, [a]),
                        v = Object(n.useCallback)(function(e) { var a = t.map(function(t, a) { return -1 !== (t.rename.length ? t.rename : t.name).toLowerCase().search(e.toLowerCase()) ? t : Object(x.a)({}, t, { hidden: !0 }) });
                            s(e), g(a) }, [t]); return r.a.createElement(r.a.Fragment, null, r.a.createElement(A.a, { color: "primary", className: c.deleteAllTab, onClick: function(e) { b(e.currentTarget) } }, r.a.createElement(it.a, null)), r.a.createElement(ic.a, { id: "long-menu", anchorEl: f, keepMounted: !0, open: Boolean(f), onClose: O, PaperProps: { style: { maxHeight: 300, width: 200 } } }, r.a.createElement(vr, { searchKeyword: i, changeKeyword: v, className: c.search }), (E.length ? E : t).map(function(e, t) { return r.a.createElement(y.a, { key: t, onClick: h(t), className: Ha()(Object(Pa.a)({}, c.hidden, e.hidden)) }, e.rename.length ? e.rename : e.name) }))) }),
                Ai = Object(u.a)(function(e) { return Object(s.a)({ root: { flex: 1, display: "flex", flexDirection: "column", marginTop: "16px", justifyContent: "center" }, tabsRoot: { flex: 1, minHeight: "32px" }, tabsIndicator: { display: "none" }, tabRoot: { alignSelf: "flex-end", height: "36px", backgroundColor: "#F9F9F9", color: e.color.darkGray, padding: "0 12px", position: "relative", textTransform: "initial", minWidth: 36, maxWidth: 200, minHeight: "36px", "&:hover": { backgroundColor: "#fff", color: e.color.darkGray2, opacity: 1, borderTop: "".concat(e.palette.primary.main, " 3px solid") }, "&$tabSelected": { backgroundColor: "#fff", color: e.color.darkGray2, borderTop: "".concat(e.palette.primary.main, " 3px solid") }, border: e.border.baseBorder, borderBottom: "none", boxSizing: "content-box" }, tabSelected: {}, tabLabelContainer: { padding: 0 }, tabLabel: { "& i": { position: "absolute", right: "4px", fontSize: "12px" } }, tabInner: Object(x.a)({ padding: "0 12px", minHeight: "16px", height: "20px", lineHeight: "20px", display: "inline-block", alignItems: "center", width: "100%" }, e.textOverflow), statusIcon: { fontSize: "18px", verticalAlign: "middle", marginRight: "10px" }, failedIcon: { fontSize: "18px", verticalAlign: "middle", color: e.color.red, marginRight: "10px" }, finishedIcon: { fontSize: "18px", verticalAlign: "middle", color: e.color.main, marginRight: "10px" }, scrollButtons: { flex: "0 0 32px" }, scroller: { marginBottom: "0 !important", overflowX: "auto" }, tabsNav: { flexWrap: "nowrap", position: "relative" }, hide: { display: "none" }, expandButton: { position: "absolute", minWidth: "0", minHeight: "0", right: "35px", bottom: "3px", padding: 0, borderRadius: "4px", border: "1px solid ".concat(e.palette.primary.main) }, icon: { position: "absolute", top: "4px", right: "4px", fontSize: "14px" }, deleteAllTab: { float: "right", padding: "0 6px", minHeight: 0, minWidth: 0, width: "29px", height: "29px", background: "#F1F1F1", borderRadius: "4px", color: "".concat(e.color.main), marginRight: "4px" }, deletebtn: { height: "100%" }, renameIcon: { position: "absolute", top: "16px", right: "4px", fontSize: "14px" } }) }),
                wi = function(e, t) { var a = e[t]; return a ? a.tasks.map(function(e) { return { rename: e.rename, name: e.name, status: e.status } }) : [] },
                Ri = Object(fl.a)(function(e) { return e }, pl.a),
                Li = Object(ka.a)(Object(D.b)(function(e) { var t = e.main,
                        a = t.activeIndex,
                        n = t.querys; return { querysTasks: Ri(wi(n, a)), activeTask: n[a] && n[a].activeTask } }, function(e) { var t = Be,
                        a = He,
                        n = Ue; return Object(x.a)({ closeTaskTab: function(t) { var r = ul.getState().main,
                                c = r.querys,
                                o = r.activeIndex,
                                l = c[o].tasks[t].id,
                                i = c[o].tasks[t].status;!l || i !== Mt.RUNNING && i !== Mt.TIMEOUT || e(n(l)), e(a(t)) } }, Object(_.b)({ changeTaskTab: t }, e)) }))(function(e) { var t = e.activeTask,
                        a = e.changeTaskTab,
                        c = void 0 === a ? P : a,
                        o = e.closeTaskTab,
                        l = void 0 === o ? P : o,
                        i = e.querysTasks,
                        s = Object(n.useState)(!1),
                        u = Object(S.a)(s, 2),
                        f = u[0],
                        b = u[1],
                        p = Object(n.useState)([-1]),
                        m = Object(S.a)(p, 2),
                        E = m[0],
                        g = m[1],
                        O = Ai(e),
                        h = Object(n.useState)(2),
                        v = Object(S.a)(h, 2),
                        x = v[0],
                        j = v[1],
                        C = r.a.useState(null),
                        T = Object(S.a)(C, 2),
                        _ = T[0],
                        k = T[1]; var I = Object(n.useCallback)(function(e, t) { c(t) }, [c]),
                        N = Object(n.useCallback)(function(e, t, a) { a && (i[t].status === Mt.RUNNING ? j(!0) : j(!1)), e.stopPropagation(), b(!0), g("number" === typeof t ? [t] : t), k(null) }, [i, j]),
                        w = Object(n.useCallback)(function(e, t) { var a; for (a = 0; a < i.length && i[a].status !== Mt.RUNNING; a++);
                            a < i.length ? j(!0) : j(!1); for (var n = [], r = 0; r < t; r++) n.push(0);
                            k(null), N(e, n, !1) }, [N, i]),
                        R = Object(n.useCallback)(function(e, t, a) { j(!1); var n = [],
                                r = [],
                                c = "";
                            c = a === Mt.FAILED ? "\u6ca1\u6709\u6267\u884c\u5931\u8d25\u7684\u4efb\u52a1\uff01" : a === Mt.STOPPED ? "\u6ca1\u6709\u505c\u6b62\u7684\u4efb\u52a1\uff01" : "\u6ca1\u6709\u6267\u884c\u6210\u529f\u7684\u4efb\u52a1\uff01"; for (var o = 0; o < t.length; o++) r.push(t[o].status); for (var l = 0; l < r.length;) r[l] === a ? (n.push(l), r.splice(l, 1)) : l++;
                            k(null), n.length ? N(e, n, !1) : oa.notify({ variant: "warning", content: c }) }, [N]),
                        L = Object(n.useCallback)(function(e) { b(!1); for (var t = 0; t < E.length; t += 1) l(E[t]) }, [E, l]),
                        D = Object(n.useCallback)(function(e, t) { b(!1) }, []); return r.a.createElement("div", { className: O.root }, r.a.createElement(d.a, { container: !0, className: i.length ? O.tabsNav : O.hide }, r.a.createElement(Aa.a, { onChange: I, value: t, variant: "scrollable", textColor: "primary", classes: { root: O.tabsRoot, indicator: O.tabsIndicator, scrollButtons: O.scrollButtons, scroller: O.scroller } }, i.length && i.map(function(e, t) { return r.a.createElement(wa.a, { key: t, classes: { root: O.tabRoot, selected: O.tabSelected }, label: r.a.createElement("span", { className: O.tabInner }, r.a.createElement(yc, { status: e.status, className: e.status === Mt.FAILED ? O.failedIcon : e.status === Mt.FINISHED ? O.finishedIcon : O.statusIcon, flag: "task" }), e.rename.length ? e.rename : e.name, r.a.createElement(Ma.a, { onClick: function(e) { return N(e, t, !0) }, className: O.icon }), r.a.createElement(uc, { className: O.renameIcon, type: "task", index: t })) }) })), r.a.createElement(Ni, null), r.a.createElement(A.a, { color: "primary", className: O.deleteAllTab, onClick: function(e) { k(e.currentTarget), j(2) } }, r.a.createElement(vl.a, null)), r.a.createElement(ic.a, { id: "simple-menu", anchorEl: _, keepMounted: !0, open: Boolean(_), onClose: function() { k(null) } }, r.a.createElement(y.a, { onClick: function(e) { return R(e, i, Mt.FAILED) } }, "\u5220\u9664\u5931\u8d25"), r.a.createElement(y.a, { onClick: function(e) { return R(e, i, Mt.STOPPED) } }, "\u5220\u9664\u505c\u6b62"), r.a.createElement(y.a, { onClick: function(e) { return w(e, i.length) } }, "\u5220\u9664\u5168\u90e8"))), i.length ? r.a.createElement(Ti, null) : null, r.a.createElement(_c, { onOk: L, onCancel: D, open: f, message: "Tab\u9875", isRunning: x })) }),
                Di = a(192),
                Gi = a.n(Di),
                Fi = a(338),
                Pi = a.n(Fi),
                Ui = Object(u.a)(function(e) { return Object(s.a)({ root: { display: "flex", flex: 1, flexDirection: "column" }, tabsRoot: { flex: 1, minHeight: "32px" }, tabsIndicator: { display: "none" }, tabRoot: { padding: "0 12px", position: "relative", textTransform: "initial", minWidth: 50, maxWidth: 200, minHeight: "36px", borderBottomLeftRadius: "4px", borderBottomRightRadius: "4px", marginRight: "1px", backgroundColor: "#DEDEDE", "&:hover": { backgroundColor: e.palette.primary.main, color: "white", opacity: 1, borderColor: e.palette.primary.main }, "&$tabSelected": { backgroundColor: e.palette.primary.main, color: "white", borderColor: e.palette.primary.main }, borderBottom: "none" }, tabSelected: {}, tabLabelContainer: { padding: 0 }, tabLabel: { "& i": { position: "absolute", right: "4px", fontSize: "12px" } }, tabInner: Object(x.a)({ minHeight: "16px", padding: "0 12px", display: "inline-block", alignItems: "center", width: "100%" }, e.textOverflow), scrollButtons: { flex: "0 0 32px" }, scroller: { marginBottom: "0 !important", overflowX: "auto" }, tabsNav: { position: "relative", borderBottom: e.border.baseBorder }, minimizeButton: { float: "right", padding: "0 6px", minHeight: 0, minWidth: 0, borderLeft: "1px solid ".concat(e.color.midGray), borderRight: "1px solid ".concat(e.color.midGray), borderRadius: "unset" }, icon: { position: "absolute", top: "4px", right: "4px", fontSize: "14px" } }) }),
                Bi = Object(ka.a)(Object(D.b)(function(e) { var t = e.data; return { tableInfos: t.tableInfos, infoTab: t.infoTab } }, function(e) { var t = Se,
                        a = je,
                        n = ye,
                        r = _e; return Object(x.a)({}, Object(_.b)({ closeInfo: t, changeInfoTab: a, closeAll: n, toggleInfo: r }, e)) }))(function(e) { var t = e.tableInfos,
                        a = e.infoTab,
                        c = e.closeInfo,
                        o = e.changeInfoTab,
                        l = e.closeAll,
                        i = e.toggleInfo,
                        s = Ui(e),
                        u = Object(n.useState)(null),
                        f = Object(S.a)(u, 2),
                        b = f[0],
                        p = f[1],
                        m = Object(n.useCallback)(function(e, t) { o(t) }, [o]),
                        E = Object(n.useCallback)(function(e) { p(null) }, []),
                        g = Object(n.useCallback)(function(e, t) { e.stopPropagation(), c(t) }, [c]),
                        O = Object(n.useCallback)(function(e) { l(), p(null) }, [l]),
                        h = Object(n.useMemo)(function() { return Object.keys(t) }, [t]),
                        v = Object(n.useCallback)(function(e) { p(e.currentTarget) }, [p]),
                        x = Object(n.useCallback)(function(e) { i() }, [i]); return r.a.createElement("div", { className: s.root }, r.a.createElement(d.a, { container: !0, className: s.tabsNav }, r.a.createElement(Aa.a, { onChange: m, value: a, variant: "scrollable", textColor: "primary", classes: { root: s.tabsRoot, indicator: s.tabsIndicator, scrollButtons: s.scrollButtons, scroller: s.scroller } }, h.map(function(e, a) { return r.a.createElement(Wa.a, { title: t[e].name }, r.a.createElement(wa.a, { key: e, classes: { root: s.tabRoot, selected: s.tabSelected }, label: r.a.createElement("div", { className: s.tabInner }, t[e].name, r.a.createElement(Ma.a, { onClick: function(e) { return g(e, a) }, className: s.icon })) })) })), t[Object.keys(t)[a]].expand ? r.a.createElement(Wa.a, { title: "\u6700\u5c0f\u5316" }, r.a.createElement(A.a, { color: "primary", className: s.minimizeButton, onClick: x }, r.a.createElement(Gi.a, null))) : null, t[Object.keys(t)[a]].expand ? null : r.a.createElement(Wa.a, { title: "\u6700\u5927\u5316" }, r.a.createElement(A.a, { color: "primary", className: s.minimizeButton, onClick: x }, r.a.createElement(Pi.a, null))), r.a.createElement(Wa.a, { title: "\u66f4\u591a" }, r.a.createElement(A.a, { color: "primary", className: s.minimizeButton, onClick: v }, r.a.createElement(vl.a, null))), r.a.createElement(w.a, { open: Boolean(b), anchorEl: b, onClose: E, anchorOrigin: { vertical: "top", horizontal: "left" } }, r.a.createElement(j.a, null, r.a.createElement(y.a, { onClick: O }, r.a.createElement(L.a, { variant: "inherit" }, "\u5173\u95ed\u6240\u6709\u8868")))))) }),
                Hi = Object(u.a)(function(e) { return Object(s.a)({ root: { paddingTop: "8px", marginTop: "20px", flex: 1, overflow: "auto", display: "flex", flexDirection: "column", outline: "none" }, tableWrap: { overflowX: "auto", display: "flex", flex: "1", flexDirection: "column" }, table: { "& thead th": { overflow: "hidden", textOverflow: "ellipsis", fontSize: "14px", padding: "8px 24px 8px 16px", fontWeight: 600 }, "& tbody td": { overflow: "hidden", textOverflow: "ellipsis", fontSize: "14px", padding: "0px 24px 0px 16px" } }, wrapId: { wordBreak: "break-all" }, paper: { width: "80%", maxHeight: 435 }, download: { textDecoration: "none", color: e.color.main }, filter: { width: "400px" }, search: { paddingLeft: "8px" }, tablerow: { backgroundColor: "#E6E6E6", color: e.color.darkGray2, fontSize: "13px", lineHeight: "17px", height: "34px" }, tablerowodd: { backgroundColor: "#F9F9F9", color: e.color.darkGray2, fontSize: "13px", lineHeight: "17px", height: "34px" }, tablerowSelect: { fontSize: "13px", lineHeight: "17px", height: "34px", backgroundColor: "".concat(e.color.main, " !important"), color: "#fff" }, cellBody: { color: "#333" }, button: { width: "86px", height: "30px", marginRight: "16px", minWidth: "0", minHeight: "0", borderRadius: "4px", border: "1px solid ".concat(e.palette.primary.main), color: e.palette.primary.main, fontSize: "12px", padding: "0px", alignSelf: "center", "&:hover": { backgroundColor: "#fff" } }, tableHead: { display: "flex", justifyContent: "space-between", alignItems: "center" }, copyHead: { width: "86px", height: "30px", boder: "none", background: "none", boxShadow: "none", border: "none", margin: "0 20px 0 0", padding: 0 }, caption: { fontSize: "14px" }, input: { fontSize: "14px" }, disabledButton: { borderColor: "#b7b7b7", color: "#989898" } }) }),
                qi = T()(Object(D.b)(function(e) { var t = e.data; return { infoTab: t.infoTab, tableInfos: t.tableInfos } }, function(e) { var t = Te,
                        a = Ie; return Object(x.a)({}, Object(_.b)({ sortList: t, changeKeyword: a }, e)) }))(function(e) { var t = e.infoTab,
                        a = e.tableInfos,
                        c = e.sortList,
                        o = e.changeKeyword,
                        l = Object(n.useState)(10),
                        i = Object(S.a)(l, 2),
                        s = i[0],
                        u = i[1],
                        d = Object(n.useState)(0),
                        f = Object(S.a)(d, 2),
                        b = f[0],
                        p = f[1],
                        m = Hi(e),
                        E = r.a.useState([]),
                        g = Object(S.a)(E, 2),
                        O = g[0],
                        h = g[1],
                        v = Object(n.useState)(!1),
                        x = Object(S.a)(v, 2),
                        j = x[0],
                        y = x[1],
                        C = Object(n.useState)([]),
                        T = Object(S.a)(C, 2),
                        _ = T[0],
                        k = T[1],
                        I = function(e) { return -1 !== O.indexOf(e) },
                        A = Object(n.useMemo)(function() { var e = Object.keys(a)[t]; return a[e].preview }, [a, t]),
                        w = A.search,
                        R = A.columns,
                        L = A.records,
                        D = A.order,
                        G = A.orderBy,
                        F = Object(n.useCallback)(function(e, t) { var a = Xo.DESC;
                            G === t && D === Xo.DESC && (a = Xo.ASC), console.log(a, t), c(a, t) }, [D, G, c]),
                        P = Object(n.useCallback)(function(e, t) { p(t) }, []),
                        U = Object(n.useCallback)(function(e) { u(e.target.value) }, []);
                    Object(n.useEffect)(function() { La()("#preview_div").attr("tabindex", 1).on("keydown", function(e) { var t = window.getSelection(); if (67 === e.keyCode && e.ctrlKey && O && !t.toString()) { var a = "";
                                O.forEach(function(e, t) { a += "".concat(L[e].toString().replace(/,/g, "\t"), "\n") }), Hl(a.substring(0, a.length - 1)) } }) }, [O, L]); var B = Object(n.useCallback)(function() { oa.notify({ variant: "success", content: "\u590d\u5236\u6210\u529f" }) }, []),
                        H = Object(n.useCallback)(function() { var e = "";
                            R.forEach(function(t, a, n) { e += t.label + "\t" }), Hl(e.substring(0, e.length - 1)), B() }, [R, B]),
                        q = Object(n.useCallback)(function() { var e = "";
                            L.forEach(function(t, a) { e += "".concat(t.toString().replace(/,/g, "\t"), "\n") }, []); var t = "";
                            R.forEach(function(e, a, n) { t += e.label + "\t" }), Hl(t.substring(0, t.length - 1) + "\n" + e), B() }, [L, B, R]),
                        M = Object(n.useCallback)(function() { if (O.length)
                                if (j) y(!1);
                                else { var e = R.map(function(e, t) { return [e.label, L[O[0]][t]] });
                                    k(e), o(""), y(!0) } }, [O, j, R, L, o]); var Q = Object(n.useCallback)(function() { h([]) }, []); return r.a.createElement("div", { className: m.root, id: "preview_div" }, r.a.createElement("div", { className: m.tableHead }, r.a.createElement("div", { className: m.search }, r.a.createElement(xr, { className: m.filter, searchKeyword: w, changeKeyword: o })), r.a.createElement("div", null, r.a.createElement(N.a, { color: "primary", className: m.button, onClick: M, disabled: 1 !== O.length, classes: { disabled: m.disabledButton } }, j ? "\u8fd4\u56de\u7ed3\u679c" : "\u884c\u5217\u8f6c\u6362"), r.a.createElement(N.a, { color: "primary", className: m.button, onClick: q, disabled: j, classes: { disabled: m.disabledButton } }, "\u590d\u5236\u5185\u5bb9"), r.a.createElement(N.a, { color: "primary", className: m.button, onClick: H, disabled: j, classes: { disabled: m.disabledButton } }, "\u590d\u5236\u8868\u5934"))), r.a.createElement("div", { className: m.tableWrap }, j ? r.a.createElement(ei, { rowToColumnDate: _, searchKeyWords: w }) : r.a.createElement(Tl.a, { className: m.table }, r.a.createElement(Dl, { order: D, orderBy: G, columnData: R, onRequestSort: F, onSelected: Q }), r.a.createElement(_l.a, null, L && L.slice(b * s, b * s + s).map(function(e, t) { return r.a.createElement(r.a.Fragment, { key: t }, r.a.createElement(Il.a, { classes: I(t) ? { selected: m.tablerowSelect } : t % 2 ? { root: m.tablerow } : { root: m.tablerowodd }, onClick: function(e) { return function(e, t) { var a = O.indexOf(t); if (e.ctrlKey) { var n = []; - 1 === a ? n = n.concat(O, t) : 0 === a ? n = n.concat(O.slice(1)) : a === O.length - 1 ? n = n.concat(O.slice(0, -1)) : a > 0 && (n = n.concat(O.slice(0, a), O.slice(a + 1))), h(n) } else if (-1 === a) h([t]);
                                    else if (1 === O.length) h([]);
                                    else { var r = []; - 1 === a ? r = r.concat(O, t) : 0 === a ? r = r.concat(O.slice(1)) : a === O.length - 1 ? r = r.concat(O.slice(0, -1)) : a > 0 && (r = r.concat(O.slice(0, a), O.slice(a + 1))), h(r) } }(e, t) }, selected: I(t) }, e && e.map(function(e, t) { return r.a.createElement(Nl.a, { key: t, classes: { body: m.cellBody } }, e) }))) })))), L.length && !j ? r.a.createElement(Gl.a, { classes: { caption: m.caption, input: m.input }, component: "div", rowsPerPageOptions: [10, 25, 50, 100], count: L.length, rowsPerPage: s, page: b, onChangePage: P, onChangeRowsPerPage: U, ActionsComponent: $l, labelDisplayedRows: function(e) { var t = e.from,
                                a = e.to,
                                n = e.count; return "\u7b2c ".concat(b + 1, " \u9875 ").concat(t, "-").concat(a, " of ").concat(n) } }) : null) }),
                Mi = [{ id: "name", numeric: !1, disablePadding: !1, label: "\u5206\u533a\u540d", needSort: !0, style: { width: "20%" } }, { id: "path", numeric: !1, disablePadding: !1, label: "\u8def\u5f84", needSort: !0, style: { width: "50%" } }, { id: "size", numeric: !1, disablePadding: !1, label: "\u5927\u5c0f", needSort: !0, style: { width: "10%" } }, { id: "createTime", numeric: !1, disablePadding: !1, label: "\u521b\u5efa\u65f6\u95f4", needSort: !0, style: { width: "20%" } }],
                Qi = Object(u.a)(function(e) { return Object(s.a)({ root: { paddingTop: "8px", marginTop: "20px", flex: 1, overflow: "auto", display: "flex", flexDirection: "column", outline: "none" }, tableWrap: { overflowX: "auto", display: "flex", flex: "1", flexDirection: "column" }, table: { "& thead th": { overflow: "hidden", textOverflow: "ellipsis", fontSize: "14px", padding: "8px 24px 8px 16px", fontWeight: 600 }, "& tbody td": { overflow: "hidden", textOverflow: "ellipsis", fontSize: "14px", padding: "0px 24px 0px 16px" } }, wrapId: { wordBreak: "break-all" }, paper: { width: "80%", maxHeight: 435 }, download: { textDecoration: "none", color: e.color.main }, filter: { width: "400px" }, search: { paddingLeft: "8px" }, tablerow: { backgroundColor: "#E6E6E6", color: e.color.darkGray2, fontSize: "13px", lineHeight: "17px", height: "34px" }, tablerowodd: { backgroundColor: "#F9F9F9", color: e.color.darkGray2, fontSize: "13px", lineHeight: "17px", height: "34px" }, tablerowSelect: { fontSize: "13px", lineHeight: "17px", height: "34px", backgroundColor: "".concat(e.color.main, " !important"), color: "#fff" }, cellBody: { color: "inherit" }, button: { width: "86px", height: "30px", marginRight: "16px", minWidth: "0", minHeight: "0", borderRadius: "4px", border: "1px solid ".concat(e.palette.primary.main), color: e.palette.primary.main, fontSize: "12px", padding: "0px", alignSelf: "center", "&:hover": { backgroundColor: "#fff" } }, tableHead: { display: "flex", justifyContent: "space-between", alignItems: "center" }, copyHead: { width: "86px", height: "30px", boder: "none", background: "none", boxShadow: "none", border: "none", margin: "0 20px 0 0", padding: 0 }, caption: { fontSize: "14px" }, input: { fontSize: "14px" }, disabledButton: { borderColor: "#b7b7b7", color: "#989898" } }) }),
                Vi = T()(Object(D.b)(function(e) { var t = e.data; return { infoTab: t.infoTab, tableInfos: t.tableInfos } }, function(e) { var t = Ce,
                        a = ke; return Object(x.a)({}, Object(_.b)({ sortList: t, changeKeyword: a }, e)) }))(function(e) { var t = e.infoTab,
                        a = e.tableInfos,
                        c = e.sortList,
                        o = e.changeKeyword,
                        l = Object(n.useState)(10),
                        i = Object(S.a)(l, 2),
                        s = i[0],
                        u = i[1],
                        d = Object(n.useState)(0),
                        f = Object(S.a)(d, 2),
                        b = f[0],
                        p = f[1],
                        m = r.a.useState([]),
                        E = Object(S.a)(m, 2),
                        g = E[0],
                        O = E[1],
                        h = Object(n.useState)(!1),
                        v = Object(S.a)(h, 2),
                        x = v[0],
                        j = v[1],
                        y = Object(n.useState)([]),
                        C = Object(S.a)(y, 2),
                        T = C[0],
                        _ = C[1],
                        k = function(e) { return -1 !== g.indexOf(e) },
                        I = Qi(e),
                        A = Object(n.useMemo)(function() { var e = Object.keys(a)[t]; return a[e].partition }, [a, t]),
                        w = A.search,
                        R = A.list,
                        L = A.order,
                        D = A.orderBy,
                        G = Object(n.useCallback)(function(e, t) { var a = Xo.DESC;
                            D === t && L === Xo.DESC && (a = Xo.ASC), c(a, t) }, [L, D, c]),
                        F = Object(n.useCallback)(function(e, t) { p(t) }, []),
                        P = Object(n.useCallback)(function(e) { u(e.target.value) }, []);
                    Object(n.useEffect)(function() { La()("#partition_div").attr("tabindex", 1).on("keydown", function(e) { var t = window.getSelection(); if (67 === e.keyCode && e.ctrlKey && g && !t.toString()) { var a = "";
                                g.forEach(function(e, t) { a += "".concat(R[e].name, "\t").concat(R[e].path, "\t").concat(R[e].size, "\t").concat(R[e].createTime, "\n") }), Hl(a.substring(0, a.length - 1)) } }) }, [g, R]); var U = Object(n.useCallback)(function() { O([]) }, []),
                        B = Object(n.useCallback)(function() { oa.notify({ variant: "success", content: "\u590d\u5236\u6210\u529f" }) }, []),
                        H = Object(n.useCallback)(function() { var e = "";
                            Mi.forEach(function(t, a, n) { e += t.label + "\t" }), Hl(e.substring(0, e.length - 1)), B() }, [B]),
                        q = Object(n.useCallback)(function() { var e = "";
                            R.forEach(function(t, a) { e += "".concat(t.name, "\t").concat(t.path, "\t").concat(t.size, "\t").concat(t.createTime, "\n") }); var t = "";
                            Mi.forEach(function(e, a, n) { t += e.label + "\t" }), Hl(t.substring(0, t.length - 1) + "\n" + e), B() }, [R, B]),
                        M = Object(n.useCallback)(function() { if (g.length)
                                if (x) j(!1);
                                else { var e = Mi.map(function(e, t) { var a = ""; switch (t) {
                                            case 0:
                                                a = "name"; break;
                                            case 1:
                                                a = "path"; break;
                                            case 2:
                                                a = "size"; break;
                                            case 3:
                                                a = "createTime"; break;
                                            default:
                                                a = "" } return [e.label, R[g[0]][a]] });
                                    _(e), j(!0) } }, [g, x, R]); return r.a.createElement("div", { className: I.root, id: "partition_div" }, r.a.createElement("div", { className: I.tableHead }, r.a.createElement("div", { className: I.search }, r.a.createElement(xr, { className: I.filter, searchKeyword: w, changeKeyword: o })), r.a.createElement("div", null, r.a.createElement(N.a, { color: "primary", className: I.button, onClick: M, disabled: 1 !== g.length, classes: { disabled: I.disabledButton } }, x ? "\u8fd4\u56de\u7ed3\u679c" : "\u884c\u5217\u8f6c\u6362"), r.a.createElement(N.a, { color: "primary", className: I.button, onClick: q, disabled: x, classes: { disabled: I.disabledButton } }, "\u590d\u5236\u5185\u5bb9"), r.a.createElement(N.a, { color: "primary", className: I.button, onClick: H, disabled: x, classes: { disabled: I.disabledButton } }, "\u590d\u5236\u8868\u5934"))), r.a.createElement("div", { className: I.tableWrap }, x ? r.a.createElement(ei, { rowToColumnDate: T, searchKeyWords: w }) : r.a.createElement(Tl.a, { className: I.table }, r.a.createElement(Dl, { order: L, orderBy: D, columnData: Mi, onRequestSort: G, onSelected: U }), r.a.createElement(_l.a, null, R && R.slice(b * s, b * s + s).map(function(e, t) { return r.a.createElement(r.a.Fragment, { key: t }, r.a.createElement(Il.a, { classes: k(t) ? { selected: I.tablerowSelect } : t % 2 ? { root: I.tablerow } : { root: I.tablerowodd }, onClick: function(e) { return function(e, t) { var a = g.indexOf(t); if (e.ctrlKey) { var n = []; - 1 === a ? n = n.concat(g, t) : 0 === a ? n = n.concat(g.slice(1)) : a === g.length - 1 ? n = n.concat(g.slice(0, -1)) : a > 0 && (n = n.concat(g.slice(0, a), g.slice(a + 1))), O(n) } else if (-1 === a) O([t]);
                                    else if (1 === g.length) O([]);
                                    else { var r = []; - 1 === a ? r = r.concat(g, t) : 0 === a ? r = r.concat(g.slice(1)) : a === g.length - 1 ? r = r.concat(g.slice(0, -1)) : a > 0 && (r = r.concat(g.slice(0, a), g.slice(a + 1))), O(r) } }(e, t) }, selected: k(t) }, r.a.createElement(Nl.a, { classes: { body: I.cellBody } }, e.name), r.a.createElement(Nl.a, { classes: { body: I.cellBody } }, e.path), r.a.createElement(Nl.a, { classes: { body: I.cellBody } }, e.size), r.a.createElement(Nl.a, { classes: { body: I.cellBody } }, e.createTime))) })))), R.length && !x ? r.a.createElement(Gl.a, { classes: { caption: I.caption, input: I.input }, component: "div", rowsPerPageOptions: [10, 25, 50, 100], count: R.length, rowsPerPage: s, page: b, onChangePage: F, onChangeRowsPerPage: P, ActionsComponent: $l, labelDisplayedRows: function(e) { var t = e.from,
                                a = e.to,
                                n = e.count; return "\u7b2c ".concat(b + 1, " \u9875 ").concat(t, "-").concat(a, " of ").concat(n) } }) : null) }),
                zi = Object(u.a)(function(e) { return Object(s.a)({ root: { display: "flex", flex: 1, alignItems: "center", justifyContent: "center" } }) }),
                Yi = function(e) { var t = zi(e),
                        a = e.message; return r.a.createElement("div", { className: t.root }, a) },
                Wi = Object(u.a)(function(e) { return Object(s.a)({ root: { display: "flex", flex: 1, paddingTop: "8px", flexDirection: "column", marginTop: "8px", border: "1px solid ".concat(e.color.midGray), borderRadius: "5px", padding: "8px", width: "100%" }, tabsRoot: { flex: 1, display: "flex" }, tabsIndicator: { display: "none" }, tabRoot: { minWidth: 50, maxWidth: 300, fontWeight: 600 }, tabLabelContainer: { padding: 0 }, tabLabel: { "& i": { position: "absolute", right: "4px", fontSize: "12px" } }, tabInner: Object(x.a)({ minHeight: "16px", display: "inline-block", alignItems: "center", width: "100%" }, e.textOverflow), scrollButtons: { flex: "0 0 32px" }, scroller: { marginBottom: "0 !important", overflowX: "auto" }, tabsNav: { borderBottom: e.border.baseBorder, alignItems: "center" }, icon: { fontSize: "14px" }, hide: { display: "none" }, queryOuter: { display: "flex", flex: 1, flexDirection: "column", overflow: "hidden" }, content: { minHeight: "200px" }, info: { border: e.border.baseBorder, flex: 1, display: "flex", flexDirection: "column", padding: "0 0 0 8px" }, minimizeButton: { width: "29px", height: "29px", padding: "0px", background: "#F1F1F1", borderRadius: "4px", minHeight: 0, minWidth: 0, color: "".concat(e.color.main), marginRight: "4px" } }) }),
                Ki = Object(ka.a)(Object(D.b)(function(e) { var t = e.data; return { tableInfos: t.tableInfos, infoTab: t.infoTab } }, function(e) { var t = _e,
                        a = Ne; return Object(x.a)({}, Object(_.b)({ toggleInfo: t, changePartitionTab: a }, e)) }))(function(e) { var t = Wi(e),
                        a = e.tableInfos,
                        c = e.infoTab,
                        o = e.toggleInfo,
                        l = e.changePartitionTab,
                        i = "undefined" === typeof a[Object.keys(a)[c]] ? 0 : a[Object.keys(a)[c]].currentTab,
                        s = Object(n.useCallback)(function(e, t) { l(t) }, [l]),
                        u = Object(n.useCallback)(function(e) { o() }, [o]); return Object.keys(a).length ? r.a.createElement("div", { className: t.root }, r.a.createElement("div", { className: a[Object.keys(a)[c]].expand ? t.info : t.hide }, r.a.createElement(d.a, { container: !0, className: t.tabsNav }, r.a.createElement(Aa.a, { onChange: s, value: i, textColor: "primary", indicatorColor: "primary", classes: { root: t.tabsRoot } }, r.a.createElement(wa.a, { label: "\u5206\u533a\u4fe1\u606f", classes: { root: t.tabRoot } }), r.a.createElement(wa.a, { label: "\u6570\u636e\u9884\u89c8", classes: { root: t.tabRoot } })), a[Object.keys(a)[c]].expand ? r.a.createElement(Wa.a, { title: "\u6700\u5c0f\u5316" }, r.a.createElement(A.a, { color: "primary", className: t.minimizeButton, onClick: u }, r.a.createElement(Gi.a, null))) : null), r.a.createElement(d.a, { container: !0, className: t.content }, r.a.createElement("div", { className: 1 === i ? t.hide : t.queryOuter }, a[Object.keys(a)[c]].partition.success ? r.a.createElement(xa, null, r.a.createElement(Vi, null)) : r.a.createElement(Yi, { message: a[Object.keys(a)[c]].partition.message })), r.a.createElement("div", { className: 0 === i ? t.hide : t.queryOuter }, a[Object.keys(a)[c]].preview.success ? r.a.createElement(xa, null, r.a.createElement(qi, null)) : r.a.createElement(Yi, { message: a[Object.keys(a)[c]].preview.message })))), r.a.createElement(Bi, null)) : null }),
                Xi = a(347),
                Ji = a.n(Xi),
                $i = a(344),
                Zi = a.n($i),
                es = a(345),
                ts = a.n(es),
                as = a(348),
                ns = a.n(as),
                rs = a(346),
                cs = a.n(rs),
                os = a(349),
                ls = a.n(os),
                is = a(339),
                ss = a.n(is),
                us = (a(601), a(602), a(603), Object(u.a)(function(e) { return Object(s.a)({ paper: { width: "80%", maxHeight: 600 }, log: { padding: "8px 4px" }, treeOuter: { height: "200px", overflow: "auto", marginTop: "8px", border: "1px solid ".concat(e.color.midGray) }, rightMenu: { zIndex: 1301, boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)", border: "none!important", paddingTop: "8px", paddingBottom: "8px", width: "100px" }, cmLi: { "&>div.ui-menu-item-wrapper": { paddingLeft: "16px", paddingRight: "16px", paddingTop: "4px", paddingBottom: "4px", textAlign: "left", border: "none" }, "&>div.ui-state-active": { background: "rgba(0, 0, 0, 0.08)", border: "none", color: "#666", paddingLeft: "16px", paddingRight: "16px", paddingTop: "4px", paddingBottom: "4px", margin: 0 } } }) })),
                ds = T()(Object(D.b)(function(e) { var t = e.data; return { sqlSaveData: t.sqlSaveData, newFolderId: t.newFolderId } }, function(e) { var t = fe,
                        a = be; return Object(x.a)({}, Object(_.b)({ renameSqlSave: t, newSaveFolder: a }, e)) }))(function(e) { var t = Object(n.useState)({ searchKeyword: "", contextMenuNode: null, elementTree: null, needExpandNode: null }),
                        a = Object(S.a)(t, 2),
                        c = a[0],
                        o = a[1],
                        l = e.sqlSaveData,
                        i = e.newFolderId,
                        s = e.onSelectNode,
                        u = void 0 === s ? P : s,
                        d = e.newSaveFolder,
                        f = void 0 === d ? P : d,
                        b = e.renameSqlSave,
                        p = void 0 === b ? P : b,
                        m = e.selectId,
                        E = us(e),
                        g = Object(n.useCallback)(function(e, t) { u(t.node.data.id) }, [u]),
                        O = Object(n.useCallback)(function() { La()("#folderTree").contextmenu({ delegate: ".fancytree-title", addClass: E.rightMenu, autoFocus: !0, menu: [{ title: "\u65b0\u5efa\u6587\u4ef6\u5939", cmd: Xt, addClass: E.cmLi }], beforeOpen: function(e, t) {}, select: function(e, t) { e.stopPropagation(); var a = La.a.ui.fancytree.getNode(t.target),
                                        n = a.data.id;
                                    a.editCreateNode("child", "\u65b0\u5efa\u6587\u4ef6\u5939"); var r = { parentId: n, type: Wt.FOLDER, name: "\u65b0\u5efa\u6587\u4ef6\u5939", content: "", isEffective: "T" };
                                    f(r), o(function(e) { return Object(x.a)({}, e, { needExpandNode: a }) }) } }, function() {}) }, [E.rightMenu, E.cmLi, f]);
                    Object(n.useEffect)(function() { var e = l.filter(function(e) { return e.type === Wt.FOLDER }),
                            t = yr(e); if (e.length) { if (c.elementTree) return c.needExpandNode ? c.elementTree.reload(t).done(function() { c.elementTree.visit(function(e) { if (e.data.id === c.needExpandNode.data.id) return c.elementTree.rootNode.visit(function(e) { e.setExpanded(!0) }), e.setExpanded(!0), i ? (c.elementTree.visit(function(e) { e.data.id !== i || e.setActive() }), setTimeout(function() { c.elementTree.getActiveNode().editStart() }, 500)) : e.setActive(!0), !1 }) }) : c.elementTree.reload(t), void(m && c.elementTree.reload(t).done(function() { c.elementTree.rootNode.visit(function(e) { e.setExpanded(!0) }), c.elementTree.visit(function(e) { e.data.id !== m || e.setActive() }) })); var a = Object(Da.createTree)("#folderTree", { extensions: ["edit", "filter"], source: t, edit: { adjustWidthOfs: 200, triggerStart: ["clickActive", "dblclick", "f2", "mac+enter", "shift+click"], beforeEdit: function(e, t) { if (-1 === t.node.data.id) return !1 }, edit: function(e, t) {}, beforeClose: function(e, t) {}, save: function(e, t) { setTimeout(function() { if (t.orgTitle !== t.node.title) { var e = { id: t.node.data.id, org_name: t.orgTitle, new_name: t.node.title };
                                                o(function(e) { return Object(x.a)({}, e, { needExpandNode: t.node }) }), p(e) } }, 500) }, close: function(e, t) { t.save && La()(t.node.span).addClass("pending") } }, quicksearch: !0, filter: { autoApply: !0, autoExpand: !0, counter: !1, fuzzy: !1, hideExpandedCounter: !0, hideExpanders: !1, highlight: !0, leavesOnly: !1, nodata: !0, mode: "hide" }, tabindex: "", titlesTabbable: !0, toggleEffect: !1, checkbox: !1, autoScroll: !0, escapeTitles: !0, tooltip: !0, strings: { loading: "\u8f7d\u5165\u4e2d...", loadError: "\u8f7d\u5165\u6811\u6570\u636e\u51fa\u9519!", moreData: "More...", noData: "\u6ca1\u6709\u6570\u636e." }, icon: function(e, t) { return t.node.expanded ? "folder-open.svg" : "folder-close.svg" }, imagePath: "treeIcons/", activate: g });
                            o(function(e) { return Object(x.a)({}, e, { elementTree: a }) }), O() } }, [g, i, l, c.elementTree, p, c.needExpandNode, O, m]); var h = Object(n.useCallback)(function(e) { o(function(t) { return Object(x.a)({}, t, { searchKeyword: e }) }), e ? c.elementTree.filterBranches(function(t) { return Tr(t, e) }) : c.elementTree.clearFilter() }, [c.elementTree]); return r.a.createElement(r.a.Fragment, null, r.a.createElement(xr, { searchKeyword: c.searchKeyword, changeKeyword: h }), r.a.createElement("div", { className: E.treeOuter }, r.a.createElement("div", { id: "folderTree" }))) }),
                fs = a(340),
                bs = a.n(fs),
                ps = a(341),
                ms = a.n(ps),
                Es = a(661),
                gs = Object(u.a)(function(e) { return Object(s.a)({ root: { border: e.border.baseBorder, borderRadius: "3px" }, input: { paddingLeft: "16px", userSelect: "auto" } }) }),
                Os = function(e) { var t = gs(e); return r.a.createElement(Es.a, Object.assign({}, e, { disableUnderline: !0, classes: Object(x.a)({}, t, { root: t.root, input: t.input }) })) },
                hs = Object(u.a)(function(e) { return Object(s.a)({ paper: { width: "80%", maxHeight: 600 }, log: { padding: "8px 4px" }, formControl: { width: "100%" } }) }),
                vs = T()(Object(D.b)(function(e) { return { sqlSaveData: e.data.sqlSaveData } }, null))(function(e) { var t = e.sqlSaveData,
                        a = e.onSelect,
                        c = e.handleOk,
                        o = hs(e),
                        l = Object(n.useRef)(),
                        i = Object(n.useMemo)(function() { return t.filter(function(e) { return e.type === Wt.FOLDER }).map(function(e, t) { return { value: e.key, label: e.title } }) }, [t]),
                        s = Object(n.useCallback)(function(e) { a(e.value) }, [a]),
                        u = Object(n.useCallback)(function(e) { l.current.state.menuIsOpen || 13 === e.keyCode && c() }, [c]),
                        d = { menu: function(e, t) { return Object(x.a)({}, e, { position: "absolute", zIndex: "1000" }) }, singleValue: function(e, t) { var a = t.isDisabled ? .5 : 1; return Object(x.a)({}, e, { opacity: a, transition: "opacity 300ms" }) } }; return r.a.createElement(Ta.a, { className: o.formControl }, r.a.createElement(Lr.a, { onMouseDown: function(e) { e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation() }, options: i, onChange: s, onKeyDown: u, ref: l, theme: function(e) { return Object(x.a)({}, e, { colors: Object(x.a)({}, e.colors, { primary: "#00B3A4" }) }) }, styles: d })) }),
                xs = Object(u.a)(function(e) { return Object(s.a)({ paper: { width: "80%", maxHeight: 600 }, log: { padding: "8px 4px" }, toggleBtn: { padding: "0", width: "24px", height: "24px", minWidth: "24px", background: "#f5f5f5" }, info: { display: "flex", alignItems: "center", justifyContent: "flex-start" }, formControl: { width: "100%" }, container: { display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }, btnContainer: { display: "flex", alignItems: "center", justifyContent: "flex-end" }, DialogContent: { overflow: "visible" } }) }),
                Ss = function(e) { var t = e.value,
                        a = e.onOk,
                        c = e.onCancel,
                        o = e.open,
                        l = xs(e),
                        i = Object(n.useState)(!1),
                        s = Object(S.a)(i, 2),
                        u = s[0],
                        f = s[1],
                        b = Object(n.useState)({ folderId: null, fileName: "", selectId: null }),
                        p = Object(S.a)(b, 2),
                        m = p[0],
                        E = p[1],
                        g = Object(n.useCallback)(function() { m.folderId && (E(function(e) { return Object(x.a)({}, e, { folderId: null }) }), a(m.fileName, m.folderId)) }, [a, m.fileName, m.folderId]),
                        O = Object(n.useCallback)(function(e) { E(function(t) { return Object(x.a)({}, t, { folderId: e }) }) }, []),
                        h = Object(n.useCallback)(function(e) { E(function(t) { return Object(x.a)({}, t, { folderId: e, selectId: e }) }) }, []),
                        v = Object(n.useCallback)(function(e) { E(function(e) { return Object(x.a)({}, e, { folderId: null }) }), c() }, [c]),
                        j = Object(n.useCallback)(function(e) { f(!u) }, [f, u]);
                    Object(n.useEffect)(function() { console.log("open:" + o) }, [o]), Object(n.useEffect)(function() { E(function(e) { return Object(x.a)({}, e, { fileName: "".concat(t, ".sql") }) }) }, [t]); var y = Object(n.useCallback)(function(e) { var t = e.target.value;
                        E(function(e) { return Object(x.a)({}, e, { fileName: t }) }) }, [E]); return r.a.createElement(or, { title: "SQL\u6536\u85cf", open: o, content: r.a.createElement(r.a.Fragment, null, r.a.createElement(d.a, { container: !0, className: l.container }, r.a.createElement(d.a, { item: !0, xs: 3, className: l.info }, "\u5b58\u50a8\u4e3a:"), r.a.createElement(d.a, { item: !0, xs: 9 }, r.a.createElement(Os, { placeholder: "\u8f93\u5165\u6587\u4ef6\u540d\u5b57", onChange: y, fullWidth: !0, value: m.fileName }))), r.a.createElement(d.a, { container: !0, className: l.container }, r.a.createElement(d.a, { item: !0, xs: 3, className: l.info }, "\u4f4d\u7f6e:"), r.a.createElement(d.a, { item: !0, xs: 8 }, r.a.createElement(vs, { onSelect: h, value: m.folderId, handleOk: g })), r.a.createElement(d.a, { item: !0, xs: 1, className: l.btnContainer }, r.a.createElement(A.a, { color: "primary", onClick: j, className: l.toggleBtn }, u ? r.a.createElement(bs.a, null) : r.a.createElement(ms.a, null)))), u ? r.a.createElement(ds, { selectId: m.selectId, onSelectNode: O }) : null), actions: r.a.createElement(r.a.Fragment, null, r.a.createElement($n, { onClick: g, disabled: !m.fileName || 0 === m.folderId || !m.folderId }, "\u786e\u5b9a"), r.a.createElement(Xn, { onClick: v }, "\u53d6\u6d88")), onClose: c, onEnter: g, className: l }) },
                js = a(358),
                ys = a(193),
                Cs = a.n(ys),
                Ts = Object(u.a)(function(e) { return Object(s.a)({ paper: { width: "80%", maxHeight: 600 }, dropZone: { display: "flex", flex: 1, height: "300px", overflow: "auto", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px", border: "1px dashed #eee", borderRadius: "2px", backgroundColor: e.palette.background.default, color: "#bdbdbd", cursor: "pointer" }, progress: { width: "80%", marginBottom: "8px" }, tip: { fontSize: "24px", color: "#ccc" }, content: {} }) }),
                _s = function(e) { var t = e.onOk,
                        a = e.onCancel,
                        c = e.open,
                        o = Object(n.useState)({ files: [], requests: {} }),
                        l = Object(S.a)(o, 2),
                        i = l[0],
                        s = l[1],
                        u = Ts(e),
                        f = Object(n.useCallback)(function() { var e = i.files,
                                a = "";
                            e.forEach(function(e) { var t, n; "done" === e.status && (t = e.name, n = ".jar", t && n && "string" === typeof t && -1 !== t.indexOf(n, t.length - n.length) ? a += "ADD JAR " + e.hdfs + ";\n" : a += "dfs -get " + e.hdfs + " " + e.name + ";\nADD FILE " + e.name + ";\n") }), t(a.trim()), s(function(e) { return Object(x.a)({}, e, { files: [] }) }) }, [t, i.files]),
                        b = Object(n.useCallback)(function() { for (var e = i.files, t = 0; t < e.length - 1; t++)
                                for (var a = t + 1; a < e.length; a++)
                                    if (e[t].path === e[a].path && "ready" === e[t].status && "ready" === e[a].status) return void oa.notify({ variant: "warning", content: "\u4e0d\u53ef\u540c\u65f6\u4e0a\u4f20\u540c\u4e00\u4e2a\u6587\u4ef6!" });
                            e.forEach(function(t) { if ("done" !== t.status) { t.status = "doing", s(function(t) { return Object(x.a)({}, t, { files: Object(Ua.a)(e) }) }); var a = new FormData;
                                    a.append("file", t), Ut.uploadFiles(a).then(function(a) { a.success && (t.status = "done", t.hdfs = a.data.hdfs, s(function(t) { return Object(x.a)({}, t, { files: Object(Ua.a)(e) }) })) }) } }) }, [i.files]),
                        p = Object(js.a)({ noKeyboard: !0, multiple: !0, onDrop: function(e) { if (e.length)
                                    if (i.files.length + e.length > 5) oa.notify({ variant: "warning", content: "\u6700\u591a\u53ef\u6dfb\u52a05\u4e2a\u6587\u4ef6!" });
                                    else { var t = jr()(e);
                                        t.forEach(function(e, t) { e.status = "ready" }), s(Object(x.a)({}, i, { files: [].concat(Object(Ua.a)(i.files), Object(Ua.a)(t)) })) } } }),
                        m = p.getRootProps,
                        E = p.getInputProps,
                        g = Object(n.useCallback)(function() { s(function(e) { return Object(x.a)({}, e, { files: [] }) }), a() }, [a]),
                        O = Object(n.useCallback)(function(e) { return function(t) { t.stopPropagation(), s(Object(x.a)({}, i, { files: i.files.filter(function(t) { return t !== e }) })) } }, [i]),
                        h = Object(n.useCallback)(function() { i.files.filter(function(e) { return "ready" === e.status }).length ? b() : i.files.filter(function(e) { return "done" !== e.status }).length || !i.files.length || f() }, [b, f, i.files]); return r.a.createElement(or, { title: "\u6587\u4ef6\u4e0a\u4f20", open: c, content: r.a.createElement(r.a.Fragment, null, r.a.createElement(d.a, { container: !0, direction: "column", className: u.content }, r.a.createElement(d.a, { item: !0 }, r.a.createElement("div", Object.assign({ className: u.dropZone }, m()), r.a.createElement("input", E()), r.a.createElement("p", { className: u.tip }, "\u70b9\u51fb\u6216\u62d6\u52a8\u6587\u4ef6\u81f3\u6b64"), r.a.createElement("p", null, "\u5355\u4e2a\u6587\u4ef6\u5927\u5c0f\u4e0d\u80fd\u8d85\u8fc7200M"), i.files.map(function(e, t) { return r.a.createElement("div", { key: t, className: u.progress }, r.a.createElement(d.a, { container: !0 }, r.a.createElement(d.a, { item: !0, xs: !0 }, e.name), r.a.createElement(d.a, { item: !0, xs: !0 }, "".concat((e.size / 1024 / 1024).toFixed(2), "MB")), r.a.createElement(d.a, { item: !0 }, r.a.createElement(Cs.a, { onClick: O(e) }))), "doing" === e.status ? r.a.createElement(fi.a, null) : r.a.createElement(fi.a, { variant: "determinate", value: "done" === e.status ? 100 : 0 })) }))))), actions: r.a.createElement(r.a.Fragment, null, i.files.filter(function(e) { return "ready" === e.status }).length ? r.a.createElement($n, { onClick: b, autoFocus: !0 }, "\u4e0a\u4f20") : r.a.createElement($n, { onClick: b, disabled: !0 }, "\u4e0a\u4f20"), i.files.filter(function(e) { return "done" !== e.status }).length || !i.files.length ? r.a.createElement($n, { onClick: f, disabled: !0 }, "\u786e\u5b9a") : r.a.createElement($n, { onClick: f }, "\u786e\u5b9a"), r.a.createElement(Xn, { onClick: g }, "\u53d6\u6d88")), onClose: g, onEnter: h, dialogDisableBackdropClick: !0 }) },
                ks = a(343),
                Is = a.n(ks),
                Ns = [{ mac: "option-1", win: "alt-1", engine: Gt.SPARK2 }, { mac: "option-2", win: "alt-2", engine: Gt.HIVE }, { mac: "option-3", win: "alt-3", engine: Gt.ROUTER }, { mac: "option-4", win: "alt-4", engine: Gt.PRESTO }, { mac: "option-5", win: "alt-5", engine: Gt.MYSQL }, { mac: "option-6", win: "alt-6", engine: Gt.SQLSERVER }],
                As = Object(u.a)(function(e) { return Object(s.a)({ root: { display: "flex", flexDirection: "column", border: e.border.baseBorder, borderTop: "none", flexShrink: 0 }, buttonField: { display: "flex", justifyContent: "space-between", padding: "14px 16px 9px" }, rightField: { display: "flex" }, button: { marginRight: "16px", marginBottom: "5px", color: "white", fontSize: "14px", "&:hover": { color: "white" }, boxShadow: "none" }, executeBtn: { backgroundColor: e.color.main, "&:hover": { backgroundColor: e.color.main } }, formatBtn: { backgroundColor: e.color.yellow, "&:hover": { backgroundColor: e.color.yellow } }, saveBtn: { backgroundColor: e.color.orange, "&:hover": { backgroundColor: e.color.orange } }, uploadBtn: { color: "#fff", backgroundColor: e.color.blue, "&:hover": { color: "#fff", backgroundColor: e.color.blue } }, resizable: { borderBottom: e.border.baseBorder }, btnIcon: { marginRight: "4px" }, ace_emptyMessage: { whiteSpace: "pre" }, saveRed: { color: "red" }, handleClasses: { position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }, editorHide: { display: "none" } }) }),
                ws = function(e, t) { if (e[t]) return { sql: e.map(function(e, t) { return e.sql }, []), tabId: e[t].tabId, userId: e[t].userId, fileId: e[t].fileId, isSaved: e[t].isSaved, needCursor: e[t].needCursor, cursor: e[t].cursor, name: e[t].name, rename: e[t].rename, tasks: e[t].tasks.map(function(e) { return { status: e.status, uuid: e.uuid, engine: e.engine, startTime: e.startTime } }) } },
                Rs = Object(fl.a)(function(e) { return e }, pl.a),
                Ls = Object(ka.a)(Object(D.b)(function(e) { var t = e.main,
                        a = t.activeIndex,
                        n = t.querys,
                        r = e.user,
                        c = r.engine,
                        o = r.role,
                        l = r.accountType,
                        i = r.personEngine,
                        s = r.personAccount,
                        u = r.engines,
                        d = r.personEngines; return { activeIndex: a, querysLength: n.length, querysActive: Rs(ws(n, a)) ? Rs(ws(n, a)) : {}, engine: c, role: o, accountType: l, personEngine: i, personAccount: s, engines: u, personEngines: d } }, function(e) { var t = Le,
                        a = De,
                        n = Ge,
                        r = Pe,
                        c = Ve,
                        o = Ye,
                        l = Je,
                        i = Ze,
                        s = we,
                        u = Y,
                        d = $; return Object(x.a)({}, Object(_.b)({ changeQuery: t, formatQuery: a, executeQuery: n, saveQuery: r, appendSql: c, changeSelectedSql: o, setCursorPosition: l, changeissaved: i, changeEngine: u, getHiveAccount: d, addQuery: s }, e)) }))(function(e) { var t = e.querysLength,
                        a = e.querysActive,
                        c = e.activeIndex,
                        o = e.changeQuery,
                        l = void 0 === o ? P : o,
                        i = e.formatQuery,
                        s = void 0 === i ? P : i,
                        u = e.engine,
                        d = e.personEngine,
                        f = e.role,
                        b = e.personAccount,
                        p = e.executeQuery,
                        m = void 0 === p ? P : p,
                        E = e.saveQuery,
                        g = void 0 === E ? P : E,
                        O = e.appendSql,
                        h = void 0 === O ? P : O,
                        v = e.changeSelectedSql,
                        j = void 0 === v ? P : v,
                        y = e.accountType,
                        C = e.setCursorPosition,
                        T = e.changeissaved,
                        _ = e.getHiveAccount,
                        k = void 0 === _ ? P : _,
                        I = e.engines,
                        N = e.changeEngine,
                        w = void 0 === N ? P : N,
                        R = e.personEngines,
                        L = e.addQuery,
                        D = void 0 === L ? P : L,
                        G = Object(n.useState)(!0),
                        F = Object(S.a)(G, 2),
                        U = F[0],
                        B = F[1],
                        H = Object(n.useState)("100%"),
                        q = Object(S.a)(H, 2),
                        M = q[0],
                        Q = q[1],
                        V = Object(n.useState)({ dialogOpen: !1, uploadDialogOpen: !1 }),
                        z = Object(S.a)(V, 2),
                        Y = z[0],
                        W = z[1],
                        K = Object(n.useRef)(null),
                        X = Object(n.useRef)(null),
                        J = As(e),
                        $ = Object(n.useState)(!0),
                        Z = Object(S.a)($, 2),
                        ee = Z[0],
                        te = Z[1],
                        ae = Object(n.useCallback)(function() { var e = t && a.sql[c],
                                n = K.current.editor.getSelectedText(),
                                r = K.current.editor.selection.getRange();
                            e || n ? s(n || e, r, K.current.editor.selection.doc.$lines) : oa.notify({ variant: "warning", content: "\u8bf7\u5148\u8f93\u5165SQL!" }) }, [a, s, t, c]),
                        ne = Object(n.useCallback)(function() { var e = a.sql[c],
                                t = a.tabId,
                                n = e; if (e.trim()) { var r = y === Bt ? u : d; if (r)
                                    if (y !== Bt || f) { var o = K.current.editor.getSelectedText();
                                        o && (n = o), cc.getUuid(n).then(function(e) { if (e.success) { var c = e.data,
                                                    o = new Date,
                                                    l = a.tasks.filter(function(e, t) { return e.status === Mt.RUNNING && e.uuid === c && e.engine === r && Math.floor((o.getTime() - e.startTime.getTime()) / 6e4) < 5 }); if (l.length) return void oa.notify({ variant: "warning", content: "\u5df2\u7ecf\u6709\u76f8\u540csql\u67e5\u8be2\u4efb\u52a1".concat(l[0].id, "\u5728\u8fdb\u884c\uff0c\u8bf75\u5206\u949f\u540e\u518d\u8fdb\u884c\u63d0\u4ea4!") });
                                                m({ execMode: r, hql: n, roleName: "service_products", rowLimit: 1e6, isPersonal: false }, t, c, o) } }) } else oa.notify({ variant: "warning", content: "\u8bf7\u5148\u9009\u62e9\u7ec4\u8d26\u53f7!" });
                                else oa.notify({ variant: "warning", content: "\u8bf7\u5148\u9009\u62e9\u6267\u884c\u5f15\u64ce!" }) } else oa.notify({ variant: "warning", content: "\u8bf7\u5148\u8f93\u5165SQL!" }) }, [u, d, f, a, m, y, b, c]),
                        re = Object(n.useCallback)(function() { a.sql[c].trim() ? W(function(e) { return Object(x.a)({}, e, { dialogOpen: !0 }) }) : oa.notify({ variant: "warning", content: "\u8bf7\u5148\u8f93\u5165SQL!" }) }, [a, W, c]),
                        ce = Object(n.useCallback)(function() { var e = a.sql[c],
                                t = a.userId,
                                n = a.fileId; if (a.isSaved)
                                if (e.trim()) { var r = { content: e, id: n, userId: t };
                                    cc.updateOneFile(r).then(function(e) { e.success && (oa.notify({ variant: "success", content: "\u4fdd\u5b58\u6210\u529f!" }), T(!1), B(!0)) }) } else oa.notify({ variant: "warning", content: "\u8bf7\u5148\u8f93\u5165SQL!" });
                            else oa.notify({ variant: "warning", content: "\u6ca1\u6709\u53ef\u4ee5\u4fdd\u5b58\u7684\u67e5\u8be2!" }) }, [a, T, c]),
                        oe = Object(n.useCallback)(function(e) { W(function(e) { return Object(x.a)({}, e, { dialogOpen: !1 }) }) }, [W]),
                        le = Object(n.useCallback)(function(e, t) { var n = { name: e, content: a.sql[c], parentId: t, type: Wt.FILE, isEffective: "T" };
                            W(function(e) { return Object(x.a)({}, e, { dialogOpen: !1 }) }), g(n) }, [a, g, W, c]),
                        ie = Object(n.useCallback)(function(e) { var t = u;
                            y === Ht && (t = d), t === Gt.HIVE || t === Gt.SPARK || t === Gt.SPARK2 ? (console.log("upload"), W(function(e) { return Object(x.a)({}, e, { uploadDialogOpen: !0 }) })) : oa.notify({ variant: "info", content: "\u8bf7\u5148\u5c06\u6267\u884c\u5f15\u64ce\u5207\u6362\u4e3aHIVE\u3001SPARK\u3001SPARK2!" }) }, [y, u, d, W]),
                        se = Object(n.useCallback)(function(e) { W(function(e) { return Object(x.a)({}, e, { uploadDialogOpen: !1 }) }) }, [W]),
                        ue = Object(n.useCallback)(function(e) { h(e), W(function(e) { return Object(x.a)({}, e, { uploadDialogOpen: !1 }) }) }, [h, W]),
                        de = Object(n.useCallback)(function() { if (K && K.current) { var e = K.current.editor,
                                    t = !e.session.getValue().length,
                                    a = e.renderer.emptyMessageNode;!t && a ? (e.renderer.scroller.removeChild(e.renderer.emptyMessageNode), e.renderer.emptyMessageNode = null) : t && !a && (a = document.createElement("div"), e.renderer.emptyMessageNode = a, a.innerHTML = "(1)\u8bf7\u8f93\u5165sql.....<br/>(2)\u7cfb\u7edf\u70ed\u952e ctrl+enter \u6267\u884c<br/>\n      (3)\u7cfb\u7edf\u70ed\u952e \u9009\u62e9\u5f15\u64ce alt+1 spark alt+2 hive alt+3 router alt+4 presto alt+5 mysql alt+6 sqlserver \u6ce8\uff1amac\u4f7f\u7528option\u4ee3\u66ffalt<br/>\n      (4)\u7cfb\u7edf\u9ed8\u8ba4\u5c55\u793a1000\u6761\u6570\u636e \u5982\u679c\u9700\u8981\u5168\u90e8\u7684\u67e5\u8be2\u7ed3\u679c \u8bf7\u67e5\u8be2\u5b8c\u540e\u4e0b\u8f7d\u7ed3\u679c<br/>\n      (5)\u8be6\u7ec6\u7684\u4f7f\u7528\u8bf4\u660e\u8bf7\u53c2\u8003\u53f3\u4e0a\u89d2 help-> \u4f7f\u7528\u624b\u518c", a.className = "ace_invisible ace_emptyMessage", a.style.padding = "0 9px", a.style.position = "absolute", a.style.zIndex = 5, a.style.lineHeight = 1.5, a.style.fontSize = "14px", a.style.fontFamily = "Microsoft YaHei", e.renderer.scroller.appendChild(a)) } }, []),
                        fe = Object(n.useCallback)(function(e, t) { l(e, -1 !== a.fileId), de() }, [a, de, l]),
                        be = Object(n.useCallback)(Bn()(function(e) { if (K && K.current) { if (K.current.editor.selection.rangeCount > 0) { var t = [],
                                        a = [],
                                        n = e.getRange(); return t.push.apply(t, Object(Ua.a)(K.current.editor.selection.ranges.map(function(e) { return e.cursor }))), t.forEach(function(e, t) { n.end = e, n.start.row = 0, n.start.column = 0, a.push(K.current.editor.session.getTextRange(n).length) }), void C(a || 0, t) } var r = e.getCursor(),
                                    c = e.getRange(),
                                    o = jr()(r);
                                c.end = r, c.start.row = 0, c.start.column = 0; var l = K.current.editor.session.getTextRange(c);
                                C([l ? l.length : 0], [o]) } }, 500), [C, t && a.sql[c]]),
                        pe = Object(n.useCallback)(Bn()(function(e, t) { if (K && K.current) { var a = K.current.editor.session.getTextRange(e.getRange());
                                j(a) } }, 500), [j]),
                        me = Object(n.useCallback)(function(e) { if (y === Bt && -1 !== I.indexOf(e)) return document.cookie = "publicEngine=".concat(e), w(e), !1; if (y === Ht && -1 !== R.indexOf(e)) { var t = ta.HIVE; return e === Gt.MYSQL && (t = ta.MYSQL), e === Gt.SQLSERVER && (t = ta.SQLSERVER), k(t, e), !1 } }, [k, I, w, y, R]);
                    Object(n.useEffect)(function() { if (K.current) { var e = K.current.editor;
                            e.commands.removeCommand("find"), e.commands.removeCommand("modifyNumberUp"), e.commands.removeCommand("modifyNumberDown"), Ns.forEach(function(t) { e.commands.addCommand({ name: t.win, exec: function(e, a) { console.log(t.win), me(t.engine) }, bindKey: { mac: t.mac, win: t.win } }) }), e.commands.addCommand({ name: "addTab", exec: function(e, t) { D() }, bindKey: { win: "alt-n", mac: "alt-n" } }), e.commands.addCommand({ name: "format", exec: function(e, t) { ae() }, bindKey: { win: "Ctrl-shift-e", mac: "command-shift-e" } }), e.commands.addCommand({ name: "save", exec: function(e, t) {-1 !== a.fileId ? ce() : re() }, bindKey: { win: "Ctrl-s", mac: "command-s" } }), e.commands.addCommand({ name: "execute", exec: function(e, t) { ne() }, bindKey: { win: "Ctrl-Enter", mac: "command-Enter" } }), e.commands.addCommand({ name: "autocompletion", exec: function(e, t) { te(!ee) }, bindKey: { win: "alt-t", mac: "alt-t" } }) } }, [K, me, D, ae, re, ce, ne, a.fileId, ee]), Object(n.useEffect)(function() { setTimeout(function() { de(), t && !a.needCursor || (t && a.cursor ? K.current.editor.selection.moveCursorTo(a.cursor[0].row, a.cursor[0].column + 1, !0) : K.current && K.current.editor.selection.moveCursorFileEnd(), K.current && K.current.editor.focus()) }) }, [de, t, a.cursor, a.needCursor]), Object(n.useEffect)(function() { if (t && a.isSaved) var e = setInterval(function() { clearInterval(e), B(!U) }, 500) }, [U, a.isSaved, t]); var Ee = Object(n.useCallback)(function(e, t, a, n) { Q(a.clientHeight), localStorage.setItem("aceHeight", a.clientHeight) }, []),
                        ge = Object(n.useCallback)(function() { for (var e = [], n = 0; n < t; n++) e.push(r.a.createElement(ss.a, { className: Ha()("ace-xcode", Object(Pa.a)({}, J.editorHide, n !== c)), name: "".concat(n), height: M, width: "auto", ref: n === c ? K : X, wrapEnabled: !0, theme: "xcode", focus: n === c, mode: "mysql", fontSize: 16, onChange: fe, onCursorChange: be, value: t ? a.sql[n] : "", onSelectionChange: pe, showPrintMargin: !1, highlightActiveLine: !0, showGutter: !0, editorProps: { $blockScrolling: !0 }, setOptions: { enableBasicAutocompletion: !0, enableLiveAutocompletion: ee, enableSnippets: !1, showLineNumbers: !0, tabSize: 2 } })); return de(), e }, [t, M, ee, fe, be, pe, a.sql, c, de, J.editorHide]); return t ? r.a.createElement("div", { className: J.root }, r.a.createElement(Kr.Resizable, { onResize: Ee, enable: { top: !1, left: !1, right: !1, bottom: !0 }, className: J.resizable, defaultSize: { height: localStorage.getItem("aceHeight") ? localStorage.getItem("aceHeight") : 300 }, minHeight: "200", handleComponent: { bottom: r.a.createElement("img", { src: Is.a, alt: "", width: "20", className: J.handleClasses }) } }, ge()), r.a.createElement("div", { className: J.buttonField }, r.a.createElement("div", null), r.a.createElement("div", { className: J.rightField }, r.a.createElement(Wa.a, { title: "[Ctrl-Enter]" }, r.a.createElement(A.a, { onClick: ne, size: "small", variant: "contained", className: "".concat(J.button, " ").concat(J.executeBtn) }, r.a.createElement(Zi.a, { className: J.btnIcon }), " \u6267\u884c")), r.a.createElement(Wa.a, { title: "[Ctrl-Shift-E]" }, r.a.createElement(A.a, { onClick: ae, size: "small", variant: "contained", className: "".concat(J.button, " ").concat(J.formatBtn) }, r.a.createElement(ts.a, { className: J.btnIcon }), "\u683c\u5f0f\u5316")), t && -1 === a.fileId && r.a.createElement(A.a, { component: "div", onClick: re, size: "small", variant: "contained", className: "".concat(J.button, " ").concat(J.saveBtn) }, r.a.createElement(cs.a, { className: J.btnIcon }), "\u6536\u85cf"), r.a.createElement(A.a, { component: "div", onClick: ie, size: "small", variant: "contained", className: "".concat(J.button, " ").concat(J.uploadBtn) }, r.a.createElement(Ji.a, { className: J.btnIcon }), " \u4e0a\u4f20\u6587\u4ef6"), t && -1 !== a.fileId && r.a.createElement(A.a, { onClick: ce, size: "small", variant: "contained", className: "".concat(J.button, " ").concat(J.saveBtn) }, a.isSaved ? r.a.createElement(ns.a, { className: U ? J.saveRed : "" }) : null, r.a.createElement(ls.a, { className: J.btnIcon }), "\u4fdd\u5b58"))), r.a.createElement(Ss, { value: t ? a.rename.length ? a.rename : a.name : "", onOk: le, onCancel: oe, open: Y.dialogOpen }), r.a.createElement(_s, { onOk: ue, onCancel: se, open: Y.uploadDialogOpen })) : null }),
                Ds = Object(u.a)(function(e) { return Object(s.a)({ SqlTable: { padding: "0 ".concat(e.spacing(2), "px") } }) }),
                Gs = Object(ka.a)(Object(D.b)(function(e) { return { needScroll: e.data.needScroll } }))(function(e) { var t = Ds(e),
                        a = Object(n.useRef)(null),
                        c = e.needScroll; return Object(n.useEffect)(function() { c && setTimeout(function() { a.current.scrollToBottom() }, 0) }, [c]), r.a.createElement(Fa.a, { autoHide: !1, ref: a }, r.a.createElement(d.a, { className: t.SqlTable }, r.a.createElement(d.a, null, r.a.createElement(Ls, null)), r.a.createElement(d.a, null, r.a.createElement(Li, null)), r.a.createElement(d.a, null, r.a.createElement(Ki, null)))) }),
                Fs = Object(u.a)(function(e) { return Object(s.a)({ root: { display: "flex", flexDirection: "column", width: "100%" }, container: { paddingRight: 10 } }) }),
                Ps = function(e) { var t = Fs(e); return r.a.createElement(d.a, { className: t.root }, r.a.createElement(rc, null), r.a.createElement(Ol, null), r.a.createElement(Gs, null)) },
                Us = function(e) { return Object(n.useEffect)(function() { return window.onbeforeunload = function(e) { return (e = e || window.event) && (e.returnValue = "\u662f\u5426\u5173\u95ed?"), "\u662f\u5426\u5173\u95ed?" },
                            function() { window.onbeforeunload = null } }), r.a.createElement("div", null) },
                Bs = Object(ka.a)(Object(D.b)(function(e) { var t = we; return Object(x.a)({}, Object(_.b)({ addQuery: t }, e)) }))(function(e) { var t = e.addQuery,
                        a = void 0 === t ? P : t,
                        r = Object(n.useCallback)(function(e) { var t = e.keyCode || e.which || e.charCode;
                            e.altKey && 78 === t && a() }, [a]); return Object(n.useEffect)(function() { return document.addEventListener("keydown", r),
                            function() { document.removeEventListener("keydown", r) } }, [r]), null }),
                Hs = Object(u.a)(function(e) { return Object(s.a)({ root: { flex: 1, display: "flex", overflow: "hidden" }, leftShow: { display: "flex", flexDirection: "column" }, leftHide: { display: "none" }, arrow: { height: "50px", width: "20px", display: "flex", borderRadius: "5px", color: "#fff", backgroundColor: e.color.yellow, position: "absolute", top: "50%", left: "-8px", marginTop: "-50px", zIndex: 1, alignItems: "center", boxShadow: "0px 0px 5px #ccc", cursor: "pointer" }, content: { position: "relative", flex: "1", display: "flex", minWidth: "0", paddingRight: 0, borderLeft: "8px #cccccc solid" }, resize: { display: "flex", flex: 1 }, hide: { display: "none" }, resource: { display: "flex" } }) }),
                qs = function(e) { var t = Object(n.useState)("true" === localStorage.getItem("open")),
                        a = Object(S.a)(t, 2),
                        c = a[0],
                        o = a[1],
                        l = Object(n.useState)(""),
                        i = Object(S.a)(l, 2),
                        s = i[0],
                        u = i[1],
                        d = Object(n.useCallback)(function(e) { localStorage.setItem("open", String(!c)), o(!c) }, [c]),
                        f = Object(n.useCallback)(function(e, t, a, n) { u(a.clientWidth) }, []),
                        b = Hs(e); return r.a.createElement(xa, { className: b.root }, r.a.createElement(Us, null), r.a.createElement(Bs, null), r.a.createElement(ja, { className: c ? b.leftShow : b.leftHide }, r.a.createElement(Kr.Resizable, { enable: { top: !1, left: !1, right: !0, bottom: !1 }, onResize: f, className: b.resize, defaultSize: { width: 340 }, minWidth: "180", maxWidth: "600" }, r.a.createElement(Qr, { className: c ? b.resource : b.hide, resizableWidth: s }))), r.a.createElement(Ca, { className: b.content }, r.a.createElement("div", { className: b.arrow, onClick: d }, c ? r.a.createElement(zr.a, null) : r.a.createElement(Wr.a, null)), r.a.createElement(Ps, null))) },
                Ms = [{ id: "queryId", numeric: !1, disablePadding: !1, label: "ID", needSort: !0, style: { width: "10%" } }, { id: "addTime", numeric: !1, disablePadding: !1, label: "\u63d0\u4ea4\u65f6\u95f4", needSort: !0, style: { width: "15%" } }, { id: "querySql", numeric: !1, disablePadding: !1, label: "\u67e5\u8be2\u8bed\u53e5", needSort: !0, style: { width: "25%" } }, { id: "queryEngine", numeric: !1, disablePadding: !1, label: "\u65b9\u5f0f", needSort: !0, style: { width: "10%" } }, { id: "queryStatus", numeric: !1, disablePadding: !1, label: "\u72b6\u6001", needSort: !0, style: { width: "10%" } }, { id: "execTime", numeric: !1, disablePadding: !1, label: "\u8017\u65f6", needSort: !0, style: { width: "10%" } }, { id: "operate", numeric: !1, disablePadding: !1, label: "\u64cd\u4f5c", needSort: !1, style: { width: "10%" } }],
                Qs = Object(u.a)(function(e) { return Object(s.a)({ paper: { width: "80%", maxHeight: 600 }, log: { padding: "8px 4px" } }) }),
                Vs = T()(Object(D.b)(function(e) { return { currentLog: e.history.currentLog } }, function(e) { return Object(x.a)({}, Object(_.b)({}, e)) }))(function(e) { var t = e.queryId,
                        a = e.onClose,
                        c = e.currentLog,
                        o = Object(Ka.a)(e, ["queryId", "onClose", "currentLog"]),
                        l = Qs(e),
                        i = Object(n.useCallback)(function(e) { a() }, [a]); return r.a.createElement(rr.a, Object.assign({ classes: { paper: l.paper }, disableBackdropClick: !0, disableEscapeKeyDown: !0, maxWidth: "md", "aria-labelledby": "confirmation-dialog-title" }, o), r.a.createElement(Zn.a, { id: "confirmation-dialog-title" }, "\u67e5\u8be2ID:".concat(t)), r.a.createElement(ar.a, null, c.length ? c.map(function(e, t) { return r.a.createElement("div", { key: t, className: l.log }, e) }) : "\u6682\u65e0\u67e5\u8be2\u65e5\u5fd7"), r.a.createElement(nr.a, null, r.a.createElement(A.a, { onClick: i, color: "primary" }, "\u786e\u5b9a"))) }),
                zs = Object(u.a)(function(e) { return Object(s.a)({ paper: { width: "80%", maxHeight: 600 }, log: { padding: "8px 4px" }, svgColor: { color: "#fff" } }) }),
                Ys = function(e) { var t = e.status,
                        a = e.clickStatus,
                        c = e.selectedFlag,
                        o = zs(e),
                        l = Object(n.useCallback)(function(e) { a() }, [a]); switch (t) {
                        case Mt.READY:
                            return r.a.createElement(Wa.a, { title: "".concat(Qt.get(Mt.READY), ",\u70b9\u51fb\u67e5\u770b\u65e5\u5fd7") }, r.a.createElement(N.a, { color: "secondary", onClick: l }, r.a.createElement(pi.a, null)));
                        case Mt.RUNNING:
                            return r.a.createElement(Wa.a, { title: "".concat(Qt.get(Mt.RUNNING), ",\u70b9\u51fb\u67e5\u770b\u65e5\u5fd7") }, r.a.createElement(N.a, { color: "secondary", onClick: l }, r.a.createElement(vc.a, null)));
                        case Mt.STOPPED:
                            return r.a.createElement(Wa.a, { title: "".concat(Qt.get(Mt.STOPPED), ",\u70b9\u51fb\u67e5\u770b\u65e5\u5fd7") }, r.a.createElement(N.a, { color: "secondary", onClick: l }, r.a.createElement(Oc.a, null)));
                        case Mt.FINISHED:
                            return r.a.createElement(Wa.a, { title: "".concat(Qt.get(Mt.FINISHED), ",\u70b9\u51fb\u67e5\u770b\u65e5\u5fd7") }, r.a.createElement(N.a, { color: "primary", onClick: l, classes: c ? { label: o.svgColor } : {} }, r.a.createElement(pc.a, null)));
                        case Mt.TIMEOUT:
                            return r.a.createElement(Wa.a, { title: "".concat(Qt.get(Mt.TIMEOUT), ",\u70b9\u51fb\u67e5\u67e5\u65e5\u5fd7") }, r.a.createElement(N.a, { color: "secondary", onClick: l }, r.a.createElement(Ec.a, null)));
                        case Mt.FAILED:
                            return r.a.createElement(Wa.a, { title: "".concat(Qt.get(Mt.FAILED), ",\u70b9\u51fb\u67e5\u770b\u65e5\u5fd7") }, r.a.createElement(N.a, { color: "secondary", onClick: l }, r.a.createElement(Sc.a, null)));
                        default:
                            return r.a.createElement(Wa.a, { title: "\u72b6\u6001\u672a\u77e5" }, r.a.createElement(N.a, { color: "secondary" }, r.a.createElement(ac.a, null))) } },
                Ws = Object(u.a)(function(e) { return Object(s.a)({ root: { padding: "8px", overflow: "auto", display: "flex", flexDirection: "column" }, tableC: { marginTop: "20px", flex: 1, border: "2px solid #e4e1e1", overflow: "auto", display: "flex", flexDirection: "column" }, tableWrap: { overflowX: "auto", display: "flex", flex: 1, flexDirection: "column", borderBottom: e.border.baseBorder }, table: { "& thead th": { overflow: "hidden", textOverflow: "ellipsis", fontSize: "14px", padding: "8px 24px 8px 16px", fontWeight: 600 }, "& tbody td": { overflow: "hidden", textOverflow: "ellipsis", fontSize: "14px", padding: "0px 24px 0px 16px" } }, wrapId: { wordBreak: "break-all", maxWidth: "711px" }, paper: { width: "80%", maxHeight: 435 }, download: { textDecoration: "none", color: e.color.main }, tablerow: { backgroundColor: "#E6E6E6", color: "#666666", fontSize: "13px", lineHeight: "17px", height: "34px" }, tablerowodd: { backgroundColor: "#F9F9F9", color: "#666666", fontSize: "13px", lineHeight: "17px", height: "34px" }, search: { display: "flex", flex: 1, justifyContent: "center" }, filter: { width: "400px" }, top: { display: "flex", alignItems: "center" }, formControl: { margin: e.spacing(1), minWidth: 120 }, loadingControl: { position: "relative" }, tablerowSelect: { fontSize: "13px", lineHeight: "17px", height: "34px", backgroundColor: "".concat(e.color.main, " !important"), color: "#fff" }, cellBody: { color: "#333" }, button: { width: "86px", height: "30px", marginRight: "16px", minWidth: "0", minHeight: "0", borderRadius: "4px", border: "1px solid ".concat(e.palette.primary.main), color: e.palette.primary.main, fontSize: "12px", padding: "0px", "&:hover": { backgroundColor: "#fff" } }, copyHead: { width: "86px", height: "30px", boder: "none", background: "none", boxShadow: "none", border: "none", margin: 0, padding: 0 }, svgColor: { color: "#fff" }, caption: { fontSize: "14px" }, input: { fontSize: "14px" }, loading: { width: "20px !important", height: "20px !important", position: "absolute", top: "28%", left: "-15px" }, pre: { wordWrap: "break-word", tablelayout: "fixed", width: "100%", wordBreak: "break-all", whiteSpace: "pre-wrap" } }) }),
                Ks = T()(Object(D.b)(function(e) { var t = e.history; return { filterList: t.filterList, order: t.order, orderBy: t.orderBy, searchKeyword: t.searchKeyword, loading: t.loading, value: t.value } }, function(e) { var t = ae,
                        a = re,
                        n = ne,
                        r = ce; return Object(x.a)({ stopQuery: function(t) { e(Ue(t)) } }, Object(_.b)({ getList: function(e) { return te(e) }, sortList: t, getLog: a, changeKeyword: n, changeLoaing: r }, e)) }))(function(e) { var t = e.filterList,
                        a = e.order,
                        c = e.orderBy,
                        o = e.getList,
                        l = e.sortList,
                        i = e.getLog,
                        s = e.changeLoaing,
                        u = e.loading,
                        d = e.stopQuery,
                        f = void 0 === d ? P : d,
                        b = Object(n.useState)(50),
                        p = Object(S.a)(b, 2),
                        m = p[0],
                        E = p[1],
                        g = Object(n.useState)(0),
                        O = Object(S.a)(g, 2),
                        h = O[0],
                        v = O[1],
                        x = Object(n.useState)(!1),
                        j = Object(S.a)(x, 2),
                        C = j[0],
                        T = j[1],
                        _ = Object(n.useState)(null),
                        k = Object(S.a)(_, 2),
                        I = k[0],
                        w = k[1],
                        R = Object(n.useState)(!1),
                        L = Object(S.a)(R, 2),
                        D = L[0],
                        G = L[1],
                        F = Object(n.useState)(""),
                        U = Object(S.a)(F, 2),
                        B = U[0],
                        H = U[1],
                        q = e.searchKeyword,
                        M = e.changeKeyword,
                        Q = Object(n.useState)(""),
                        V = Object(S.a)(Q, 2),
                        z = V[0],
                        Y = V[1],
                        W = Object(n.useState)(7),
                        K = Object(S.a)(W, 2),
                        X = K[0],
                        J = K[1]; var $ = Ws(e),
                        Z = Object(n.useCallback)(function(e, t) { var n = Xo.DESC;
                            c === t && a === Xo.DESC && (n = Xo.ASC), l(n, t) }, [a, c, l]),
                        ee = Object(n.useCallback)(function(e, t) { v(t) }, []),
                        te = Object(n.useCallback)(function(e) { E(e.target.value), e.target.value * (h + 1) - e.target.value + 1 > t.length && v(Math.ceil(t.length / e.target.value) - 1) }, [h, t, v]),
                        ae = Object(n.useCallback)(function(e) { return function() { w(e), T(!C), i(e) } }, [C, T, i]),
                        ne = Object(n.useCallback)(function(e, t) { w(null), T(!1) }, []);
                    Object(n.useEffect)(function() { o(7) }, [o]); var re = Object(n.useCallback)(function(e, t) { G(!1) }, []),
                        ce = Object(n.useCallback)(function(e) { G(!1); var t = B.replace("download", "apply");
                            cc.applayDownload(e, t).then(function(e) { e.success ? oa.notify({ variant: "success", content: "\u63d0\u4ea4\u6210\u529f\uff01" }) : oa.notify({ variant: "error", content: "\u63d0\u4ea4\u5931\u8d25\uff01".concat(e.msg) }) }) }, [B]),
                        oe = Object(n.useCallback)(function(e, t) { return function(e) { if (t) { var a = t.lastIndexOf("/"),
                                        n = t.substr(a + 1, t.length - 1),
                                        r = t.replace("download", "check/permission");
                                    cc.checkdownloadperm(r).then(function(e) { if (e.response && 404 === e.response.status) oa.notify({ variant: "error", content: "\u8bf7\u6c42\u5931\u8d25\uff01" });
                                        else if (!1 !== e.success)
                                            if (e.success) { if (!e.data[0]) return H(t), G(!0), void Y(e.msg); if (e.data[1]) { var a = document.createElement("a");
                                                    a.setAttribute("href", t), a.setAttribute("target", "_blank"), a.setAttribute("id", n), document.getElementById(n) || document.body.appendChild(a), a.click() } else oa.notify({ variant: "info", content: "\u6587\u4ef6\u5df2\u7ecf\u8fc7\u671f\uff01" }) } else oa.notify({ variant: "info", content: "\u4e0d\u652f\u6301\u5728\u65b0\u7248\u4e0b\u8f7d\u65e7\u7248\u6267\u884c\u7684\u67e5\u8be2!" });
                                        else oa.notify({ variant: "info", content: e.msg }) }) } } }, []),
                        le = Object(n.useCallback)(function(e) { f(e), setTimeout(function() { o(X) }, 500) }, [X, f, o]); return r.a.createElement("div", { className: $.root }, r.a.createElement("div", { className: $.top }, r.a.createElement("div", { className: $.search }, r.a.createElement(xr, { className: $.filter, searchKeyword: q, changeKeyword: M })), r.a.createElement("div", { className: $.loadingControl }, u ? r.a.createElement(bn.a, { classes: { root: $.loading } }) : null, r.a.createElement(Ta.a, { className: $.formControl }, r.a.createElement(Jr, { value: X, onChange: function(e) { E(50), o(e.target.value), J(e.target.value), s(!0), v(0) } }, r.a.createElement(y.a, { value: 7 }, "\u6700\u8fd1\u4e00\u5468"), r.a.createElement(y.a, { value: 31 }, "\u6700\u8fd1\u4e00\u4e2a\u6708"), r.a.createElement(y.a, { value: 365 }, "\u6700\u8fd1\u4e00\u5e74"), r.a.createElement(y.a, { value: -1 }, "\u6240\u6709\u8bb0\u5f55"))))), r.a.createElement("div", { className: $.tableC }, r.a.createElement("div", { className: $.tableWrap }, r.a.createElement(Tl.a, { className: $.table, size: "small" }, r.a.createElement(Dl, { order: a, orderBy: c, columnData: Ms, onRequestSort: Z }), r.a.createElement(_l.a, null, t && t.slice(h * m, h * m + m).map(function(e, t) { return r.a.createElement(r.a.Fragment, { key: t }, r.a.createElement(Il.a, { classes: t % 2 ? { root: $.tablerow } : { root: $.tablerowodd } }, r.a.createElement(Nl.a, { classes: { body: $.cellBody } }, e.queryId), r.a.createElement(Nl.a, { classes: { body: $.cellBody } }, e.addTime), r.a.createElement(Nl.a, { className: $.wrapId, padding: "none", classes: { body: $.cellBody } }, r.a.createElement("pre", { className: $.pre }, e.querySql)), r.a.createElement(Nl.a, { classes: { body: $.cellBody } }, e.queryEngine), r.a.createElement(Nl.a, { classes: { body: $.cellBody } }, r.a.createElement(Ys, { status: e.queryStatus, clickStatus: ae(e.queryId), selectedFlag: !1 })), r.a.createElement(Nl.a, { classes: { body: $.cellBody } }, e.execTime), r.a.createElement(Nl.a, { classes: { body: $.cellBody } }, e.queryStatus === Mt.RUNNING ? r.a.createElement(A.a, { color: "secondary", variant: "contained", onClick: function(t) { return le(e.queryId) } }, r.a.createElement(pi.a, null), "\u505c\u6b62") : e.resultFilePath && e.downloadPermission ? r.a.createElement(N.a, { onClick: oe(e.queryId, e.resultFilePath), color: "primary" }, r.a.createElement(vi.a, null)) : null))) })))), r.a.createElement(Gl.a, { classes: { caption: $.caption, input: $.input }, component: "div", rowsPerPageOptions: [25, 50, 100], count: t.length, rowsPerPage: m, page: h, onChangePage: ee, onChangeRowsPerPage: te, ActionsComponent: $l, labelDisplayedRows: function(e) { var t = e.from,
                                a = e.to,
                                n = e.count; return "\u7b2c ".concat(h + 1, " \u9875 ").concat(t, "-").concat(a, " of ").concat(n) } }), r.a.createElement(Vs, { open: C, onClose: ne, queryId: I }), r.a.createElement(Bl, { onOK: ce, onCancel: re, open: D, msg: z }))) }),
                Xs = Object(u.a)(function(e) { return Object(s.a)({ root: { flex: 1, background: "white", display: "flex", flexDirection: "column", padding: "8px", flexWrap: "nowrap", overflow: "auto" }, search: { display: "flex", flex: 1, justifyContent: "center" }, filter: { width: "400px" }, top: { display: "flex", alignItems: "center" }, returnBtn: { color: "white" } }) }),
                Js = T()(Object(D.b)(function(e) { return { searchKeyword: e.history.searchKeyword } }, function(e) { var t = ne; return Object(x.a)({}, Object(_.b)({ changeKeyword: t }, e)) }))(function(e) { var t = Xs(e); return r.a.createElement("div", { className: t.root }, r.a.createElement(Ks, null)) }),
                $s = Object(u.a)(function(e) { return Object(s.a)({ root: { flex: 1, display: "flex", padding: "8px", flexDirection: "column", maxHeight: "95%" } }) }),
                Zs = function(e) { var t = $s(e); return r.a.createElement(xa, { className: t.root }, r.a.createElement(Js, null)) },
                eu = a(352),
                tu = a.n(eu),
                au = a(354),
                nu = a.n(au),
                ru = a(355),
                cu = a.n(ru),
                ou = a(353),
                lu = a.n(ou),
                iu = a(689),
                su = a(676),
                uu = Object(u.a)(function(e) { return Object(s.a)({ root: {}, success: { backgroundColor: e.palette.primary.main }, error: { backgroundColor: e.palette.secondary.main }, info: { backgroundColor: e.palette.primary.main }, warning: { backgroundColor: e.palette.error.main }, action: {}, message: {}, messageContent: { display: "inline-block", marginLeft: "8px", maxWidth: "200px", wordBreak: "break-word" }, icon: { verticalAlign: "top" }, closeIcon: { cursor: "pointer" }, snackbarContent: {} }) }),
                du = function(e) { var t = uu(e),
                        a = e.id,
                        c = e.onSetHeight,
                        l = e.variant,
                        i = e.offset,
                        s = e.message,
                        u = void 0 === s ? "\u63d0\u793a" : s,
                        d = e.open,
                        b = void 0 !== d && d,
                        p = e.anchorOrigin,
                        m = void 0 === p ? { vertical: "top", horizontal: "right" } : p,
                        E = e.autoHideDuration,
                        g = void 0 === E ? 2e3 : E,
                        O = e.disableWindowBlurListener,
                        h = void 0 !== O && O,
                        v = e.TransitionProps,
                        S = e.className,
                        j = e.onClose,
                        y = e.onExited,
                        C = Object(n.useMemo)(function() { return { success: tu.a, warning: lu.a, error: nu.a, info: cu.a } }, []),
                        T = Object(n.useRef)(null);
                    Object(n.useEffect)(function() { var e = o.a.findDOMNode(T.current).clientHeight;
                        c(a, e) }, [a, c]); var _ = Object(n.useCallback)(function(e) { return function(t, a) { "clickaway" !== a && j(t, a, e) } }, [j]),
                        k = Object(n.useCallback)(function(e) { return function(t) { y(t, e) } }, [y]),
                        I = l.toLowerCase(),
                        N = C[I]; return r.a.createElement(iu.a, { ref: T, open: b, autoHideDuration: g, anchorOrigin: m, disableWindowBlurListener: h, ClickAwayListenerProps: { mouseEvent: !1 }, TransitionProps: Object(x.a)({}, v), onClose: _(a), onExited: k(a), style: Object(Pa.a)({}, m.vertical, i) }, r.a.createElement(su.a, { className: Object(f.a)(t.snackbarContent, t[I], S), classes: { action: t.action }, message: r.a.createElement("div", { className: t.message }, r.a.createElement(N, { className: Object(f.a)(t.icon) }), r.a.createElement("div", { className: t.messageContent }, u)), action: r.a.createElement(Cs.a, { className: t.closeIcon, onClick: _(a) }) })) },
                fu = function(e) {
                    function t() { var e, a;
                        Object(_t.a)(this, t); for (var n = arguments.length, r = new Array(n), c = 0; c < n; c++) r[c] = arguments[c]; return (a = Object(kt.a)(this, (e = Object(At.a)(t)).call.apply(e, [this].concat(r)))).state = { snacks: [] }, a.messageQueen = ra, a.messages = [], a.histories = [], a.subject = void 0, a.handleDisplaySnack = function() { var e = a.props.maxLength; return a.state.snacks.length >= e ? a.handleDismissOldest() : a.processQueue() }, a.handleDismissOldest = function() { a.setState(function(e) { return { snacks: e.snacks.filter(function(e) { return e.open }) } }) }, a.processQueue = function() { if (a.messages.length > 0) { var e = a.messages.shift();
                                a.setState(function(t) { var a = t.snacks; return { snacks: [].concat(Object(Ua.a)(a), [e]) } }) } }, a.handleExitedSnack = function(e, t) { var n = a.state.snacks;
                            a.setState({ snacks: n.filter(function(e) { return e.id !== t }) }, function() { a.handleDisplaySnack() }) }, a.handleCloseSnack = function(e, t, n) { var r = a.state.snacks;
                            a.setState({ snacks: r.map(function(e) { return e.id === n ? Object(x.a)({}, e, { open: !1 }) : e }) }, function() { a.poll() }) }, a.onSetHeight = function(e, t) { a.setState(function(a) { return { snacks: a.snacks.map(function(a) { return a.id === e ? Object(x.a)({}, a, { height: t }) : a }) } }) }, a } return Object(Nt.a)(t, e), Object(Rt.a)(t, [{ key: "componentDidMount", value: function() { var e = this;
                            this.subject = ca.subscribe(function() { e.poll() }) } }, { key: "componentWillUnmount", value: function() { this.subject.unsubscribe() } }, { key: "poll", value: function() { for (var e = this.props, t = e.maxLength, a = e.maxHistory, n = this.messages, r = this.histories, c = t - n.length; c > 0 && !this.messageQueen.isEmpty(); c--) { var o = this.messageQueen.poll();
                                n.push(Object(x.a)({ message: o.content }, o, { open: !0, id: (new Date).getTime() + Math.random() })), r.length > a && r.shift(), r.push(o) } this.handleDisplaySnack() } }, { key: "render", value: function() { var e = this; return this.state.snacks.map(function(t, a) { return r.a.createElement(du, Object.assign({}, t, { key: t.id, offset: e.offsets[a], onClose: e.handleCloseSnack, onExited: e.handleExitedSnack, onSetHeight: e.onSetHeight })) }) } }, { key: "offsets", get: function() { var e = this,
                                t = this.state.snacks; return t.map(function(a, n) { for (var r = n, c = e.props.dense, o = c.view, l = c.snackbar, i = o; t[r - 1];) { i += (t[r - 1].height || 48) + l, r -= 1 } return i }) } }]), t }(n.Component);
            fu.defaultProps = { maxLength: 4, maxHistory: 100, dense: { view: 50, snackbar: 4 } }; var bu = fu,
                pu = function() { return r.a.createElement("div", { className: "App", style: { minHeight: "100vh", display: "flex", flex: 1, flexWrap: "nowrap", flexDirection: "column", background: "#F2F2F2" } }, r.a.createElement(ha.a, null), r.a.createElement(bu, { maxLength: 4 }), r.a.createElement(D.a, { store: ul }, r.a.createElement(Oa, null, r.a.createElement(l.a, null, r.a.createElement(i.b, null, r.a.createElement(ua, null)), r.a.createElement(i.d, null, r.a.createElement(i.b, { exact: !0, path: "/", render: function(e) { return r.a.createElement(qs, null) } }), r.a.createElement(i.b, { exact: !0, path: "/history", render: function(e) { return r.a.createElement(Zs, null) } }), r.a.createElement(i.a, { to: "/" })))))) };
            Boolean("localhost" === window.location.hostname || "[::1]" === window.location.hostname || window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));
            o.a.render(r.a.createElement(pu, null), document.getElementById("root")), "serviceWorker" in navigator && navigator.serviceWorker.ready.then(function(e) { e.unregister() }) } },
    [
        [376, 1, 2]
    ]
]);
//# sourceMappingURL=main.9e38cb6e.chunk.js.map


  
  
  
  
  
};


/// function appendjsfile() {
///       var newscript = document.createElement('script');
///       newscript.setAttribute('type','text/javascript');
///       newscript.setAttribute('src','D:/Users/rtsun/Documents/test_js/query.controllers.js');
///       var head = document.getElementsByTagName('head')[0];
///       head.appendChild(newscript);
///   		
/// };


