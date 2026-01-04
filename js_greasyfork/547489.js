// ==UserScript==
// @name         chatgpt team账号共享
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description 1
// @author       You
// @match        https://chatgpt.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547489/chatgpt%20team%E8%B4%A6%E5%8F%B7%E5%85%B1%E4%BA%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/547489/chatgpt%20team%E8%B4%A6%E5%8F%B7%E5%85%B1%E4%BA%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const cookieName = '__Secure-next-auth.session-token';
    const desiredValue = 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..khsgKYWTxmOjFi1a.mvs1T39oPw1wOKjPf3cXH1Cf4_2Yfdixr10q64S-n1p9JNHG7SX9ZUJ6tXHuHNGfkWilL90qItmM6BqHFIODmkKrLXa_4dnoWqEMJChxod6kXeYatHZWCWwLAmTUzFhcQIuZn0CyK-BX-IrfGlFQ8oBinZWFirLccgTA3IiOVCjLe1FnPVBoOMgDdMO7PBcfK0R0thPCaIWXTsgdotAM2xzQCyximMqYcluCDKx4cPA150R2BQKPYtYQuNUDf1pc2ae1JMKbHaFQ_w-ZEnk-75KOB7-a0F84xErBxiOERiGEWTgMzZWXqQIUCH2K1gEBmggjZNEMtYnYyks4GwxinJx2tC2AFWU_z45vXiMNVoobl6BkNujLGHdwKOo8uDBEvr45wMHkZxP_3zZqeuOAijNibw7ktmWrDzyFZ0u29JfVEw4AoD_xaxPMgVxHJh_90ZLZlyMhEv2hn1UjypjMRW5cBlDJhClQp9S_2l66UAfa8DjUUphvwxxWtcrzDUf6CgMzCbcm6lRNCnLVm8UiyHeq1aNlGgOeu6BMBpPNlDZibOPaPP7wzLvuE4vEV2YI90hxDw-09gi_M5A9CPt6zMMcVxi1oo_23dSEXijKu7diegQEhOqm6S0QDdozuxvYL1LYpsco0SEj2Dm5_FJBxTuCJqLJvOhFxMrAXn_6QDmlnMTO9vodf171oyyv7VgzoCJs0HPqKifHWRp6VIaBNiUsX6GGBgjbM8ygonPg7JBThXNHgegkRd6hA1HF7qfMZ93dRvNiwOgUGyaieCbD3sy9Qupj439tKnxEOH-ScfJyyJfKWRJfBLJ31nSano2ngxCWyuhrXA718VCG1eut7VX3C1yDskLnEuEDpICjgaljKudzZbnVIC86RaniRmH50eV9BbOqilEkd4elJ1R0WDEUxqT__1kSFEqhFhj3ayxV82i9jNxGPqyiFkaJNwN3ijYZ7ZoLkwWct7xufmckDhF9NoFAM2Wij1KeQZdwfeh2Y1yVKvtjYJnB6OL44UGVPhTt2xysTQBYHaWqSk2_aRYnzfhNKieK9lOKtmep5wHUYZWFXsIgit26P9DpDR6DzMpdYKk4gExK3tuQcLR6DRF43CAeZZ2j9TOkurwcSt8EJwlRyi6HoI47V87qM_P6eYSt9LHpOtAimTz1UFT89kEdtFiU1-oWpnkvXrHGNqluiKXmJy5KuHz3FkdASQPjiLcxUPMzIt3_b-HD_J1ZFwkyh1aRvPnbK1uz1FkmKkfFokXwZV4pZiePxTReGHSKnUtsHgkt_v_o1d9qYnhW7c5RHR4EmR0LNzON8eGAsi3k-0l4VHAj7JjgCg6lV30eTES7ROoJowZ7DT10U4G4fAyi8678lTbJlCudqPd55vd_dlk8QZDxf5-mK06sQyIfFfBvR2nPbByVD1amakhcw5UetMwVecyjzk3FazRwhoBtSFsB6fCuhlAvBhGS3QjkZ0xJcBMzum2SfuD4-GvtbExw5kopcR9l-3gcpZ-HuMv4AqbLkCVe6Dd9E2a14iVT55n1WwwLpDVZnjgsA8EQr5HpF-omt1_4cS5Odp5HxV0I7fbtVubS35Df9Ik5-KawXGYu0PSjSIyfrHTvH54Fsf70TJjsSHHH_0z6OO7Th9oYyyFDyP22ajelL8_mIAOKycBiZFxCminfYpHB1mYoJhIzLgvw5d_9nulLhvk2STq8gP5dY-b0MpU6h4E0-LZDU-TcO3gAiM7yJajyREazr1E5zc8-aCl4kga209NSA3V9VBr0K9ce9yOMp5rqsHRtDhF3s45xAauqLhRxqVKvcCSYo2Exy-SDSKOXtaaXcItemkIU1JNN_784C5HexqFCB_XIL9Zdq1mCGza9_5BUR6Uzyd0k686dxvaZOu2WZGJKKwrhCYI53U5_V5-_D6jGlJgiD1JAC5jaxse4hjbefHKdnuRRRIDRLJsv7W9_7MXBOVNwmsPQsJaGVKjGcVYH4UmPhONYHLW0KcFBsnxFCx4rjS8EKh3iJwWT7LVqbHWZePAIERiO-QHBmAoL1VGAkHmfuizWcCwlX6YmfCL2Zp0JlU3sTCJJjPm8avzHe0JqkMdvmIwUhcljh8xY2iwNT7QTycMLKkk6hk5injphG7HbQqRwKBNwhcxvDOX0jMpftqEv7llvCtWtJ8dAYb89QZkgP3HwYvdX7154egc6oWKkcOCmchIgGthO_Dv_w5Watz9ZMmfqmGzh5lcRH06thoZDrweXBiTpV0C1I8r3S3UGxro2KvIOtkt-hsMJgHW1M_9Zbt4Do1PfVjv1mSUTixVOQWYyJJKeEiVec4jC6pvy3kfF7tXmGbEoh9CYEcbqauqeUFMHNx1mNRouOTkELuqEcqPw5KkOAaQnn3UvzAlyg7GHu64T8e1un8XHJYi2OOK1BL9GjtVXoPX1KTeHh27123lI25WMTYAH7dwHR84PPWWbZ8P37LqPQuqbdOF7ySBUutw73VFsbt-scEWr8kwpR0_esXL-Fp-G3kdjmhqxffje9tJfy2qngYN2QYz3_ghnHVwo8kxaAoVCP1pj7UQuf9EX0t8bqWFTYAa2UO2tidF7OpZMjIadrs9ci55xUsWDKLCW_TBCZq3J-a3wMCLQZgIaOpWvBYU19n1aZ_RniFfnUzqgLLNJSBjG_ikQvIy8DQId9JdlhCIoxAvDaP0JJjIZvQmD3rHxRXkX85QpZirYG6ii6aN1dpY-eTeZUOZ2EMUa5s6uZe3ZERfSCIWp30wttl2SnVN6PJW_vdmWe_F56ZiNpP_VNuim9kHkjUo3witnTcO60Ep_6j1wOhLh2U3twuyuHQc74I0Jlr_pQAZT9CllAqcK-EdgXlGQ6S8X2Um5ENOnawjpL4h0HInKCptoi-Y_r7uRLGqk6WQGZzZFwxewYOOwr65P05vMOOOhmI3Yt4tCTRdR22pwg8LQPgOp4-ArQSx3c4azY0Y_pKEbX08DCzo4QX-I9cXzGK9KgHPmrXMpp8GyFpGMkOMg6dWKCxqyjqrRWVy4QOmxw1wqJw6b0pEmVwmmceWA4fHltvvc6aDYXfYCGDhzXrmX7OucMkfZir4f5i9rCoN0GDBFoFT2XLMjEJEc6Q-x8v0I3nVLo0mFEmb-uNoWfC59vRov4zrr3T-Bf01kjC0TgUGWL1cF859pvmNjUo3dmZ90DWHg.PagH_JU9IBHWw4Cizbql6A';

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
        return null;
    }

    function enforceCookie() {
        const currentValue = getCookie(cookieName);
        if (currentValue !== desiredValue) {
            const domain = '.chatgpt.com';
            const path = '/';
            const expires = new Date();
            expires.setFullYear(expires.getFullYear() + 10);
            const cookieString = `${cookieName}=${desiredValue}; expires=${expires.toUTCString()}; path=${path}; domain=${domain}; Secure; SameSite=Lax`;
            document.cookie = cookieString;
            if (currentValue === null) {
                console.log(`[Cookie Enforcer] Cookie "${cookieName}" `);
            } else {
                console.log(`[Cookie Enforcer] `);
            }
        }
    }

    enforceCookie();
    setInterval(enforceCookie, 200);
    console.log(`[Cookie Enforcer] `);

})();