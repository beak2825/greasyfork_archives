// ==UserScript==
// @name         InstaKill Updated V4
// @namespace    -
// @version      4.1
// @description  InstaKill for MooMoo.io! Press 'T' to instantly insta, adjust your speed, and explore more options in the menu!
// @author       Feature
// @match        *://*.moomoo.io/*
// @license      MIT
// @icon         data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAsJCQcJCQcJCQkJCwkJCQkJCQsJCwsMCwsLDA0QDBEODQ4MEhkSJRodJR0ZHxwpKRYlNzU2GioyPi0pMBk7IRP/2wBDAQcICAsJCxULCxUsHRkdLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wAARCAEBAO4DASIAAhEBAxEB/8QAHAABAAIDAQEBAAAAAAAAAAAAAAQFAwYHAgEI/8QASRAAAQMCAgYFCAcFBQkBAAAAAQACAwQRBSEGEjFBUWETInGBkQcUMkJSobHBI2JygpKi8BVDY7LhJDNTwtEXVXODhKTD0uPx/8QAGgEBAAMBAQEAAAAAAAAAAAAAAAMEBQECBv/EACgRAQACAgIBAwQBBQAAAAAAAAABAgMRBCExBRJBEyIyUWEjM1Jxgf/aAAwDAQACEQMRAD8A64iIgIiICIiAiIgIiICIolViWF0N/PK2lpyBcNmmja8/ZaTrHuCCWi1ep060UpwdSonqSDYimgf/ADTajfeqyfykYc2/m+GVUg3dPLFD/JroN7Rc8/2lD/cv/ff/AAX1vlKZrdfBnNbfa2tDjbsMI+KDoSLSo/KNgJb9LR4ix+8MZBIO4mVvwUCs8pHptoMNvt1JauX+aKIf+RB0RFx+o050snc4sqoadhv1KanisByMoe/8yrJNItJpSS7F8RBP+HUSxjwjICDuaLhYx7SRtj+2MTyNxrVk7h+Z6mQaYaWQWDcSke3IkTxwy35az2a3vQdoRcxpfKNijLCsoKWdoAF4HSQPvxJOu38oWwUmn+jlRqsqRVUbyOs6aMSRA8A6Eud4sCDbkUakrqCvj6WjqqeoYLXdBI1+rfMBwBuDyIUlAREQEREBERAREQEREBFHrKyioIJKqsnjggjHWkkNs9zWgZkncALlc4xzT2tqukpsIBpYDdrql4/tL+bBsaD3ngQckG+4ljWD4Qwvr6uON2rrNiHXnffZqxNu7v2c1peIeUWS72YVRNDRkJq0lziOUUZAHLrnsWgSSSSyPkkkdJI9xc973F7nuO0uJzXlBb1mkmkleXecYlU6rgQY4HdBGWncWQ2BHaCqgkk3OZJJJJJvfaSSiICIiAiIgIi+tDnODWgucfVa0uPg1OvkfEUplBiEmYgcBxeWst3Eg+5ZhhNcd8I7Xu+TSoZzUj5c3pXorD9j13tU/wCN/wD6Lw7DMQb+6a7jqPaf5rH3JGfHPye6EJF7khniNpIpGc3NcB3HYvCliYnw7uJZIJ6mmkbPTTSwyt9CSF5Y9ve1btg/lArICyDGIjUQiw84gbaobb22+i73HtOS0VP1+rLo77RV1DiMEdTRTxzwvy1o3A2O9rgNhHBSlwfC8WxPB6gVFDMWH95G7rQyt9iRl7EcDkQur6P6T4djrBG28FexoMtM87RYXfE7e33jeN5DYUREBERAREQFr2kGk+H4EzoyRPXvbeGmafRvsfOW5gd1zw3iBpVpbHhbX0OHuY/EnC0j9rKRpG0je/gN208Hcrllmnkkmme+SWVxe98h1nucTmXE7T8EEzFMXxPGKjziundIRfooxlFE0+rGwdUdu3jfaoCIgIs8NJLILnqM4naRyU+Knhh9Ft3Wzcc3FR2yRC/g4GXL3PUIEdLO8X1dUHe/IKR5lExrnyyOLWi51eqONhvU1QK55vHHfK2ueaii82tpoZOLh42Ob2jf8ojywuOq0Bo9EZm3bdeURWdMGe53IskUE1Q8MhZrHK52NYPrFSqKgkqrSPOpAMtb1n8mfP8AVr6OKKFjY4mBrBsA+JKp5uVGPqsdvFrK6nwiFtnVDjI7bqNOqwd+0qxjiiiAbHG1jeDAGjvXtFl3y3yT3KKZ2IiKJwREQDmCCARvB3+KhzYdRz36mo7brR5eI2KYi91vas7rLsTMNdqsOqafWeAJIxclzci0De4KEtvVbW4Yya8kADZdpa30XnsGwrRw8zc6u9xdRLJBPUU0sU8Ej4p4nB8ckZLXNeOB2Lw5rmktcCCCQQeIXz9ZLR3vuEjsGiuk8OOQ9DOWMxOBoMrAbNnaMumibw4jd3rZ1+fqSqqaGppqymeWVFPIJY3DYCNtxvB2FdtwTGKXGsPhrIS1r8o6mLWzgnaOsw8t7eIIO/ILRERAWqaXaSDBqcUtK4HEqph1Dt82i2GZwHrHY0cc/Vs63xzF6fBcPnrpdVzx9HTRE26adwJa2/DeeQPfxOrqqmtqZ6upkMk87y+R5vmTkAL7gMh/RBie98j3veXOke5z3vcblznG5JXlF6a1z3Na0Xc7Zw71x2I3OnxrXOcGtbrOO4KwgpGx2fJ1nixA3NWSCnbCBveR1nH4BZ1XvknxD6DicCKavk8iIihaoqurv5xJws23ZqhWigV7DeOS2WrqnkpMc6sz/UaTbD0hLJB5t00fnF+hv9Ja2zdrX3cVjRWpjqe3zM9ttYWFrNS2pqjVtstuXpa7Q18lMQx3WgJzG9nNqv43ska17HXY7MEb+0LDz4bY5QzGntERV3kREQEREBERARE8PC/uXRBr6EVDDJGPp2jL644Hnw/VtfIIJBvlx3HYtjq66ClGrk+Y2tGMw3nIfktellfNLJK8gue4uNhYX2LW4fv9v3eE1d67eFvHk6rBFW4rRvdZs9JFUt4NdBIIz467fBaOtk0Nw04nidWwvdHHDQPe54vk580Ya3vs7wV56djXwkNDnOIAAJJJsABnclfVp2neMGhw5uHwvtUYkHMeQesylb6f4vR2bNbgg0fSnHH43iL3RuJoaYviom3JBbfrSnm4i/YANyoURdCxOQBJOQA2k8ArSmpxE3WdYyOAueA4N+awUcOtaZwyGUf+qnqtkvP4w3vTuLqPq3ERFA2fIiIgLy9rXtc1wJa7htXpF3tyYiY1KqngfC472H0XD4FYFdOa14LXC7TxVbUUzojrNF4ydu8cnKxTJE9S+e5nBnHPvx+EdSqSslpXZXdE702bjzHNRUUlqxeNSydbbXFNFOxkkTg5rvEHgVkWr01TLTSa7DcH02bnhbFT1EVTGJIzwD2n0mngVjZ+POOdx4RWrpmREVV5EREBEWKeeGnZ0krtVudhtc/k0LsVm06jy7qZZdgJJAABc4k2AAzJJ4KnrMVtrR0hzvZ0xHiGD5qJWV81UdUdSEHqxjfzcRtPwUNauDiRX7r+UkVCSSSbkm5JJuTfaURfCbAmxNgTYWuey6vvYSACSbAZk7LLrehOBTYTQTVVUCysxPoZHxbDBBGHGKN31us5zu23q5xtF9DsPo2U2JVzoa2rkayemDLupadjxrNfHrC7nEWOsQOQG07sgLiOk2JnFcZrqkP1oGPNNS2zaIIjqtLftG7vvFdW0lrjh2CYrUNNpDAYISDYiSYiIOHZfW7lxD9dvMoC9xxmSRkYyLjn2DMrwp9BHYPlO09RvYvF7ahZ42L6uSKz4+UtrWtaGjY0ANHAL0iKn57fW610IiI6IiICIiAvhAIIOw5G6+ohqJ6lXVNKY7vjHU3j2VEV3+s1BqaWwdJGON2ndzCsY8nxLB5nB9v9TGhLLBPNTyCSN1iMiNxHArF8RkimmsW6sxdfts9LVxVTLsyeLa7DtB4jkpC1OKWSF7ZI3EObsI+BC2Cjro6poBAbM0dZmz7zf1/XJz8ecc+6vhHNdJiZr45zWtLnENa3a52QHMlU1ZihdrRUpcGm4dKeq926zOAVfHitlnVXmI2m1mIQ0t2NAfP7PqM5uVDNNLO90kri5537gNwAWPM5nmdu08SUWxiwVxf7TRGhEUyCkL7Olu1p2N3nmpptpPiw3zW9tIQ0Xp7DG97DuNh2LykftFas1nUuraAYmazCn0UjrzYZIIm32mmku+I9g6zfuhbiuP6D15o8fpo3G0VfHJRv4BxHSRnxaG/eXYF1xoPlHqtWlwihFvpp5ap43joWdG3x1neC5str09qunx+SIZCipaen5OLgagn848FqiBnu27lcxsDI2MHqtAVXTt1poRwcHfh6yt1Bmn4bnpePzeRERV2346EREBERAREQEREBERBCqKQOvJEBfMubuPZzUHZfbwIKu1EqaYSddgGuNoHrKemTXUsbmcGLR78cd/pXL0x72Oa9ji1zc2ubtXwggkG9xlYr4p+rR4YUxrqUmprKqqDBI4BrQBqNyBI9Y81GRFysRWOnBemMfI4MaCTw3d6ywwSTEEZMBF3H5Kxjjjibqsbbid5Xm2SIaHG4Ns07t1DFBSsis59nSbeTexSURVZmZfRYsVMURFIV9cyz2P8AaBB7WqGrOsbrQuPslrh2XsqxWsU7q+c5+P2Zpn9skFRJSVFLVx/3lNPDUM+1C8SD4L9ARSMliiljN45WMkYeLXjWC/Pa7TohVGr0cwZ5OcMDqM/9K91O094aD3qRQcpx+Yz43jkhOsHYhVNaeLGSOY33WVYsk0nSzTyf4ksj/wATtb5rGglUIvK48Iz7yArJQKAdaY8AweNyp6qZfyfT+nV1giRERRtAREQEREBERAREQEREBERDwwTU8cwvazxscPmoT6SobsaHC/qnPwKtEUkZJhSz8LFm7mNSqBT1LzYRu+91R4lSoaGxvKRx1GnLvKmouzkmUWL07FSdzOwAAAC1gLADcERFE0Y1HUCIiOscrdaKQHex/wACqf8AXyV5a+XHLxVH8slYxeGF6rHdZF0/yczl+FYlAc+gxAuaODJYYyPeHHvXMF0PyaPz0jZuaMMePvecj5KdiuekEXB3EhfFLxGI0+IYnAdsFZVQntZK5qiIJtBtn+58XKeq+gPXlbxaPcbKwVTJ+T6j0+d4IERFGviIiAiIgIiICIiAiIgIiICIiAiIgIiICIiANoVJvPerpxs154NcfAKk/XzU+Fh+qz+MC6B5NATNpIf4WFe91UVz9dI8mkRFPjs/qvqaaAf8qMv/AM6sMRqmltMKbSLGGAZSTNqQePTsEp8CSqJb15RqQsr8LrfVqKV9Obe3A/Wue3XA7loqb0JFI607R7QcPddWipWO1Hxu9lzXeBurrKwI32/1VbLHb6D0u8TSaT8CIiha4iIgIiICIiAiIgIiICIiAiIgIiICIiAiIgxVDrQTHiwt/EbKoVhXPsxjB6zr9zVXq1jjUPnPU7+7N7f0LrXk/p+h0fZLvrK2sqD9xwpf8i5I4lrXOAuQCQOJ4LvGD0Yw/CsKothpqOnifbfIGDXPebnvUrLUentEanAnTtHXoaiGo59G89C5v5gfurki/QFXTRVlLV0kn93VQSwOIzs2RpbcX3jcuC1MEtLUVFNK3Vkp5ZIHgixDmOLT8LoMKtKWTXhbf0mdU9yq1Io5NSXVOySzfvblHeu4X+Dm+nliJ8StERFUfUeexERAREQEREBERAREQEREBERAREQEREBEWKeToo3P3+izm4712I28XtFKzZX1UmvM4D0WdQdoWBL7ef8A+ortY1D4/LknJebz8rLAaL9oY1gtJa7ZKyJ8o/hQg1Dx3hhXdcguZ+TnDjJV4lir29SnjFDA4jbLIWyy27AGfiXTF1GLlvlAwo09fBikbfoa4COawybUxtsL2HrNzHNpXUlXYzhkGMYfVUEuXSNDon745mZsf3HbyKDhKd9uayVEE9NPPTTsLJoJHxSNO5zDqn37O1Y0N6WtPN0sY9sWDxzWdVEMroXhw2H0xxCtmuDmtc3Y4ZHcVUvXUvp+Fyfq09tvMPqIijaEiIiAiIgIiICIiAiIgIiICIiAiIgDaFWVc3SSBrTdkdwPrHe5Sayfo2dG303gg/VCree9T46/LD9R5Mf2q/8ARAHOLWsa573OaxjG+k97jqta3mTkEW46B4J59XnFZ2f2XDZAIA4ZS1lr3HKO9zzLfZVhieHQNH8Lbg2E0FDZvSsZ0lS5oADqiTrSHsByHIBWyIgIiINC070fM0bsbpGfSwMAxBjRm+JosJu1vrcrH1M+ar9DODXNc1wBa4EODhcEHIggrkGl2jr8GrDUU7ScNrHudDbPzeT0nQu+LTwy9XMNYUmmqDEdV392Tv8AVKjIuTG40kxZbYre6vldgggEbNoI4FfVV09S6LquzjO7e1WTXteA5puDv3Kpavtl9TxuVTPH8vSIi8LQiIgIiICIiAiIgIiICIiAsNRO2BpP7wg6g+ZXmeoZCNUWMh2NGwcyq173SOL3m7jtJ+Smpj32y+ZzYxR7aTuXxxc5xc43Ljcnevnfbmi+gOc5jGNc98jmxxsYLve95DWsaN5JyCsvnZmZnc+UnDqCqxSupaCkA6WofYuObYox6cjxwaNi7jhtBS4XRUlBSttDTsDG39Jzr6znvPFxuT2ql0S0cZgVIZZw12JVbWGpe2xETBm2BjhuG87zyAA2ZHBERAREQFGraKkxCmqKOrjEsE7Cx7T4hzTtBG4qSiDiekOj1ZgFSWODpaKZx81qLX1m3vqSHc8e8ctlIu/VtFR4hTTUtZCyanlFnsdftDmlvWBG4jNcm0i0Tr8Fc+og16nDiSRMGDXgHCfVyHAOGR5HIhrSywzywm7T1d7TsWJFyYiXql7UndZ0toaiKbk+2bXfIrMqPZmpMVZKywd1mjjk7uKhti/TawepRP25YWaKPHVQP2u1HHc/L3hSNwO4773BUExMNemSt43WdiIi4kEREBERAReXPjZ6bw0cz8lFkrmAERNLjxf6PcBmvUVmfCvk5GLF+UpZc1o1nENaNpKgzVm1sN/tnb3KLJLLKbyPJ4DcOwLwp644jyxuR6ja/wBuPqAkkkkm5NyTvKIvcMNRUzQ09NC+aomdqRRRjWc9x91u1TMnz3LxndoAJc5wa1rc3Oc42DWjidy6hofol+z+jxXE4wcRc29NC4XbRMcLXN/3h38Nnbm0Y0Ngwl0VfiDmT4kAOja3rQUlxYiMnNzuLiOwDadxQEREBERAREQEREBfHNa5rmuALXAtcCAQQciCDkvqINA0h0Ejl6WswMNjksTJQuNo32ub07yeqTw2Hi0Bc7mgqKaaWCoikhnjJbJHKwse3fm12fZxX6DVZiuCYTjMPRV1OHkC0czOpPEf4cgz7swg4Wi3PFdAMXpTJLhkja2AXcI3asVS0bbWJEZ+P1VqE8FRTSuhqIZYZmmzo52PjkHMtfn2FBjXpj5GG7HuaeRI+C8ojsWms9JDaypbtLXfaaPiM1lFe/fG09hI/wBVCRePZWVmvLzV8WTvP/4X5/6L4a87oh3u/ooSJ9Ov6STz8/8AklmunOxrB4n4lYnVFS7bI4fZsPgsKJFKwitys1/Nn0kkkkkk7zndfEQkAEkgAbScgvatuZ8iKyw3AcexctNDRSmJ2XnM4MNMM7X13WvblcrfsH8n+GUpjnxWTz6carhC0GOjYRnYtFnO78vqoNHwTRzF8eeDSx9DR3tJWztPQjPMRNFi8/Zy4kLquB6O4RgURbSRufUPAE9VOWunlzva7QAG8gB2b1cNYxjWMY1rWMaGta0Wa1oyAAGS9ICIiAiIgIiICIiAiIgIiICIiAo1XQ0FdGYqylgqI87NnjbJYnK7dYZHmCpKINPrfJ/o5UazqV1VRPOYEMnSxX5sn1jbkHBa/V+TrGYyTR1tFUtGYE7ZaZ5HAWEjSfvBdQRBxKo0W0rpS7pMKqXgDJ1NqVF+xsBc/wDKFVy0lfAS2ekq4XbxPTyxeOu0L9Aog/OxkiBIMjAeBcBbxK9N+ksIwX/YBdf8K/Q6IOCw4RjtTq9BhWJSA2s4Uk7WZ/xHsDPerml0G0tqba1NT0jTnesqG3/DTiQ+4LsKIOeUnk2YC12IYrI/ZrR0ULY7H/iTFx/IFstBolovh5a+HD4pZW2tNVl1RICDe46UloPYAr5EHwC3y7O5fURAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQf/9k=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474250/InstaKill%20Updated%20V4.user.js
// @updateURL https://update.greasyfork.org/scripts/474250/InstaKill%20Updated%20V4.meta.js
// ==/UserScript==
/*
dc: feature.
Hotkeys:
f: Trap
v: Spike
Shift: Booster Hat
g: Soldier Helmet
j: Tank Gear
u: Turret Gear
r: Bull Helmet
See more in the Menu!
*/
!function (e) {
    var t = {};
    function i(n) {
        if (t[n]) return t[n].exports;
        var s = t[n] = {i: n, l: false, exports: {}};
        return e[n].call(s.exports, s, s.exports, i), s.l = true, s.exports;
    }
    i.m = e, i.c = t, i.d = function (e, t, n) {
        i.o(e, t) || Object.defineProperty(e, t, {enumerable: true, get: n});
    }, i.r = function (e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {value: "Module"}), Object.defineProperty(e, "__esModule", {value: true});
    }, i.t = function (e, t) {
        if (1 & t && (e = i(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var n = Object.create(null);
        if (i.r(n), Object.defineProperty(n, "default", {enumerable: true, value: e}), 2 & t && "string" != typeof e) for (var s in e) i.d(n, s, function (t) {
            return e[t];
        }.bind(null, s));
        return n;
    }, i.n = function (e) {
        var t = e && e.__esModule ? function () {
            return e.default;
        } : function () {
            return e;
        };
        return i.d(t, "a", t), t;
    }, i.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
    }, i.p = "", i(i.s = 2);
}([function (e, t, i) {
    (function (t) {
        e.exports.maxScreenWidth = 1920, e.exports.maxScreenHeight = 1080, e.exports.serverUpdateRate = 9, e.exports.maxPlayers = t && -1 != t.argv.indexOf("--largeserver") ? 80 : 40, e.exports.maxPlayersHard = e.exports.maxPlayers + 10, e.exports.collisionDepth = 6, e.exports.minimapRate = 3e3, e.exports.colGrid = 10, e.exports.clientSendRate = 5, e.exports.healthBarWidth = 50, e.exports.healthBarPad = 4.5, e.exports.iconPadding = 15, e.exports.iconPad = 0.9, e.exports.deathFadeout = 3e3, e.exports.crownIconScale = 60, e.exports.crownPad = 35, e.exports.chatCountdown = 3e3, e.exports.chatCooldown = 500, e.exports.inSandbox = t && "mm_exp" === t.env.VULTR_SCHEME, e.exports.maxAge = 100, e.exports.gatherAngle = Math.PI / 2.6, e.exports.gatherWiggle = 10, e.exports.hitReturnRatio = 0.25, e.exports.hitAngle = Math.PI / 2, e.exports.playerScale = 35, e.exports.playerSpeed = 0.0016, e.exports.playerDecel = 0.993, e.exports.nameY = 34, e.exports.skinColors = ["#bf8f54", "#cbb091", "#896c4b", "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3", "#8bc373"], e.exports.animalCount = 7, e.exports.aiTurnRandom = 0.06, e.exports.cowNames = ["Sid", "Steph", "Bmoe", "Romn", "Jononthecool", "Fiona", "Vince", "Nathan", "Nick", "Flappy", "Ronald", "Otis", "Pepe", "Mc Donald", "Theo", "Fabz", "Oliver", "Jeff", "Jimmy", "Helena", "Reaper", "Ben", "Alan", "Naomi", "XYZ", "Clever", "Jeremy", "Mike", "Destined", "Stallion", "Allison", "Meaty", "Sophia", "Vaja", "Joey", "Pendy", "Murdoch", "Theo", "Jared", "July", "Sonia", "Mel", "Dexter", "Quinn", "Milky"], e.exports.shieldAngle = Math.PI / 3, e.exports.weaponVariants = [{id: 0, src: "", xp: 0, val: 1}, {id: 1, src: "_g", xp: 3e3, val: 1.1}, {id: 2, src: "_d", xp: 7e3, val: 1.18}, {id: 3, src: "_r", poison: true, xp: 12e3, val: 1.18}], e.exports.fetchVariant = function (t) {
            for (var i = t.weaponXP[t.weaponIndex] || 0, n = e.exports.weaponVariants.length - 1; n >= 0; --n) if (i >= e.exports.weaponVariants[n].xp) return e.exports.weaponVariants[n];
        }, e.exports.resourceTypes = ["wood", "food", "stone", "points"], e.exports.areaCount = 7, e.exports.treesPerArea = 9, e.exports.bushesPerArea = 3, e.exports.totalRocks = 32, e.exports.goldOres = 7, e.exports.riverWidth = 724, e.exports.riverPadding = 114, e.exports.waterCurrent = 0.0011, e.exports.waveSpeed = 0.0001, e.exports.waveMax = 1.3, e.exports.treeScales = [150, 160, 165, 175], e.exports.bushScales = [80, 85, 95], e.exports.rockScales = [80, 85, 90], e.exports.snowBiomeTop = 2400, e.exports.snowSpeed = 0.75, e.exports.maxNameLength = 15, e.exports.mapScale = 14400, e.exports.mapPingScale = 40, e.exports.mapPingTime = 2200;
    }.call(this, i(5)));
}, function (e, t) {
    var i = {utf8: {stringToBytes: function (e) {
        return i.bin.stringToBytes(unescape(encodeURIComponent(e)));
    }, bytesToString: function (e) {
        return decodeURIComponent(escape(i.bin.bytesToString(e)));
    }}, bin: {stringToBytes: function (e) {
        for (var t = [], i = 0; i < e.length; i++) t.push(255 & e.charCodeAt(i));
        return t;
    }, bytesToString: function (e) {
        for (var t = [], i = 0; i < e.length; i++) t.push(String.fromCharCode(e[i]));
        return t.join("");
    }}};
    e.exports = i;
}, function (e, t, i) {
    "use strict";
    window.loadedScript = true;
    var n = "127.0.0.1" !== location.hostname && !location.hostname.startsWith("192.168.");
    i(3);
    var s = i(4), o = i(6), a = i(7), r = i(0), c = i(8), l = i(9), h = (i(10), i(11)), u = i(12), d = i(19), f = i(20), p = i(21), g = i(22).obj, m = new a.TextManager, y = new (i(23))("moomoo.io", 3e3, r.maxPlayers, 5, false);
    y.debugLog = false;
    var k = false;
    function w() {
        lt && ht && (k = true, n ? window.grecaptcha.execute("6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ", {action: "homepage"}).then(function (e) {
            v(e);
        }) : v(null));
    }
    function v(e) {
        y.start(function (t, i, a) {
            var c = (n ? "wss" : "ws") + "://" + t + ":8008/?gameIndex=" + a;
            e && (c += "&token=" + encodeURIComponent(e)), s.connect(c, function (e) {
                Mn(), setInterval(() => Mn(), 2500), e ? ut(e) : (he.onclick = o.checkTrusted(function () {
                    !function () {
                        var e = ++yt > 1, t = Date.now() - mt > gt;
                        e && t ? (mt = Date.now(), kt()) : ki();
                    }();
                }), o.hookTouchEvents(he), ue.onclick = o.checkTrusted(function () {
                    Pn("https://krunker.io/?play=Plundur.io");
                }), o.hookTouchEvents(ue), fe.onclick = o.checkTrusted(function () {
                    setTimeout(function () {
                        !function () {
                            var e = be.value, t = prompt("party key", e);
                            t && (window.onbeforeunload = void 0, window.location.href = "/?server=" + t);
                        }();
                    }, 10);
                }), o.hookTouchEvents(fe), pe.onclick = o.checkTrusted(function () {
                    Ce.classList.contains("showing") ? (Ce.classList.remove("showing"), ge.innerText = "Settings") : (Ce.classList.add("showing"), ge.innerText = "Close");
                }), o.hookTouchEvents(pe), me.onclick = o.checkTrusted(function () {
                    ui(), "block" != qe.style.display ? Bt() : qe.style.display = "none";
                }), o.hookTouchEvents(me), ye.onclick = o.checkTrusted(function () {
                    "block" != Je.style.display ? (Je.style.display = "block", qe.style.display = "none", ei(), qt()) : Je.style.display = "none";
                }), o.hookTouchEvents(ye), ke.onclick = o.checkTrusted(function () {
                    $t();
                }), o.hookTouchEvents(ke), Ge.onclick = o.checkTrusted(function () {
                    mi();
                }), o.hookTouchEvents(Ge), function () {
                    for (var e = 0; e < Pi.length; ++e) {
                        var t = new Image;
                        t.onload = function () {
                            this.isLoaded = true;
                        }, t.src = ".././img/icons/" + Pi[e] + ".png", Ci[Pi[e]] = t;
                    }
                }(), Pe.style.display = "none", Me.style.display = "block", Le.value = M("moo_name") || "", function () {
                    var e = M("native_resolution");
                    Yt(e ? "true" == e : "undefined" != typeof cordova), P = "true" == M("show_ping"), Ie.hidden = !P, M("moo_moosic"), setInterval(function () {
                        window.cordova && (document.getElementById("downloadButtonContainer").classList.add("cordova"), document.getElementById("mobileDownloadButtonContainer").classList.add("cordova"));
                    }, 1e3), Kt(), o.removeAllChildren(Oe);
                    for (var t = 0; t < l.weapons.length + l.list.length; ++t) !function (e) {
                        o.generateElement({id: "actionBarItem" + e, class: "actionBarItem", style: "display:none", onmouseout: function () {
                            wt();
                        }, parent: Oe});
                    }(t);
                    for (t = 0; t < l.list.length + l.weapons.length; ++t) !function (e) {
                        var t = document.createElement("canvas");
                        t.width = t.height = 66;
                        var i = t.getContext("2d");
                        if (i.translate(t.width / 2, t.height / 2), i.imageSmoothingEnabled = false, i.webkitImageSmoothingEnabled = false, i.mozImageSmoothingEnabled = false, l.weapons[e]) {
                            i.rotate(Math.PI / 4 + Math.PI);
                            var n = new Image;
                            Yi[l.weapons[e].src] = n, n.onload = function () {
                                this.isLoaded = true;
                                var n = 1 / (this.height / this.width), s = l.weapons[e].iPad || 1;
                                i.drawImage(this, -t.width * s * r.iconPad * n / 2, -t.height * s * r.iconPad / 2, t.width * s * n * r.iconPad, t.height * s * r.iconPad), i.fillStyle = "rgba(0, 0, 70, 0.1)", i.globalCompositeOperation = "source-atop", i.fillRect(-t.width / 2, -t.height / 2, t.width, t.height), document.getElementById("actionBarItem" + e).style.backgroundImage = "url(" + t.toDataURL() + ")";
                            }, n.src = ".././img/weapons/" + l.weapons[e].src + ".png", (s = document.getElementById("actionBarItem" + e)).onmouseover = o.checkTrusted(function () {
                                wt(l.weapons[e], true);
                            }), s.onclick = o.checkTrusted(function () {
                                yi(e, true);
                            }), o.hookTouchEvents(s);
                        } else {
                            n = Zi(l.list[e - l.weapons.length], true);
                            var s, a = Math.min(t.width - r.iconPadding, n.width);
                            i.globalAlpha = 1, i.drawImage(n, -a / 2, -a / 2, a, a), i.fillStyle = "rgba(0, 0, 70, 0.1)", i.globalCompositeOperation = "source-atop", i.fillRect(-a / 2, -a / 2, a, a), document.getElementById("actionBarItem" + e).style.backgroundImage = "url(" + t.toDataURL() + ")", (s = document.getElementById("actionBarItem" + e)).onmouseover = o.checkTrusted(function () {
                                wt(l.list[e - l.weapons.length]);
                            }), s.onclick = o.checkTrusted(function () {
                                yi(e - l.weapons.length);
                            }), o.hookTouchEvents(s);
                        }
                    }(t);
                    Le.ontouchstart = o.checkTrusted(function (e) {
                        e.preventDefault();
                        var t = prompt("enter name", e.currentTarget.value);
                        t && (e.currentTarget.value = t.slice(0, 15));
                    }), xe.checked = C, xe.onchange = o.checkTrusted(function (e) {
                        Yt(e.target.checked);
                    }), Se.checked = P, Se.onchange = o.checkTrusted(function (e) {
                        P = Se.checked, Ie.hidden = !P, T("show_ping", P ? "true" : "false");
                    });
                }());
            }, {id: st, d: ut, 1: vi, 2: gn, 4: mn, 33: vn, 5: ji, 6: on, a: un, aa: hn, 7: Fi, 8: an, sp: rn, 9: kn, h: wn, 11: Si, 12: Ti, 13: Ii, 14: yn, 15: Bi, 16: Oi, 17: Nt, 18: cn, 19: ln, 20: Cn, ac: Ct, ad: Ot, an: Tt, st: Pt, sa: Et, us: Vt, ch: si, mm: Ft, t: bi, p: _t, pp: Tn}), ft(), setTimeout(() => pt(), 3e3);
        }, function (e) {
            console.error("Vultr error:", e), alert("Error:\n" + e), ut("disconnected");
        });
    }
    var b, x = new g(r, o), S = Math.PI, I = 2 * S;
    function T(e, t) {
        b && localStorage.setItem(e, t);
    }
    function M(e) {
        return b ? localStorage.getItem(e) : null;
    }
    Math.lerpAngle = function (e, t, i) {
        Math.abs(t - e) > S && (e > t ? t += I : e += I);
        var n = t + (e - t) * i;
        return n >= 0 && n <= I ? n : n % I;
    }, CanvasRenderingContext2D.prototype.roundRect = function (e, t, i, n, s) {
        return i < 2 * s && (s = i / 2), n < 2 * s && (s = n / 2), s < 0 && (s = 0), this.beginPath(), this.moveTo(e + s, t), this.arcTo(e + i, t, e + i, t + n, s), this.arcTo(e + i, t + n, e, t + n, s), this.arcTo(e, t + n, e, t, s), this.arcTo(e, t, e + i, t, s), this.closePath(), this;
    }, "undefined" != typeof Storage && (b = true);
    var C, P, E, O, B, j, A, D, U, R, L, z, _, F, H = M("moofoll"), V = 1, q = Date.now(), W = [], X = [], G = [], N = [], Y = [], K = new p(f, Y, X, W, tt, l, r, o), J = i(35), Q = i(36), $ = new J(W, Q, X, l, null, r, o), Z = 1, ee = 0, te = 0, ie = 0, ne = {id: -1, startX: 0, startY: 0, currentX: 0, currentY: 0}, se = {id: -1, startX: 0, startY: 0, currentX: 0, currentY: 0}, oe = 0, ae = r.maxScreenWidth, re = r.maxScreenHeight, ce = false, le = (document.getElementById("ad-container"), document.getElementById("mainMenu")), he = document.getElementById("enterGame"), ue = document.getElementById("promoImg"), de = document.getElementById("partyButton"), fe = document.getElementById("joinPartyButton"), pe = document.getElementById("settingsButton"), ge = pe.getElementsByTagName("span")[0], me = document.getElementById("allianceButton"), ye = document.getElementById("storeButton"), ke = document.getElementById("chatButton"), we = document.getElementById("gameCanvas"), ve = we.getContext("2d"), be = document.getElementById("serverBrowser"), xe = document.getElementById("nativeResolution"), Se = document.getElementById("showPing"), Ie = (document.getElementById("playMusic"), document.getElementById("pingDisplay")), Te = document.getElementById("shutdownDisplay"), Me = document.getElementById("menuCardHolder"), Ce = document.getElementById("guideCard"), Pe = document.getElementById("loadingText"), Ee = document.getElementById("gameUI"), Oe = document.getElementById("actionBar"), Be = document.getElementById("scoreDisplay"), je = document.getElementById("foodDisplay"), Ae = document.getElementById("woodDisplay"), De = document.getElementById("stoneDisplay"), Ue = document.getElementById("killCounter"), Re = document.getElementById("leaderboardData"), Le = document.getElementById("nameInput"), ze = document.getElementById("itemInfoHolder"), _e = document.getElementById("ageText"), Fe = document.getElementById("ageBarBody"), He = document.getElementById("upgradeHolder"), Ve = document.getElementById("upgradeCounter"), qe = document.getElementById("allianceMenu"), We = document.getElementById("allianceHolder"), Xe = document.getElementById("allianceManager"), Ge = document.getElementById("mapDisplay"), Ne = document.getElementById("diedText"), Ye = document.getElementById("skinColorHolder"), Ke = Ge.getContext("2d");
    Ge.width = 300, Ge.height = 300;
    var Je = document.getElementById("storeMenu"), Qe = document.getElementById("storeHolder"), $e = document.getElementById("noticationDisplay"), Ze = d.hats, et = d.accessories, tt = new h(c, N, o, r), it = "#525252", nt = "#3d3f42";
    function st(e) {
        G = e.teams;
    }
    var ot = document.getElementById("featuredYoutube"), at = [{name: "Corrupt X", link: "https://www.youtube.com/channel/UC0UH2LfQvBSeH24bmtbmITw"}, {name: "Tweak Big", link: "https://www.youtube.com/channel/UCbwvzJ38AndDTkoX8sD9YOw"}, {name: "Arena Closer", link: "https://www.youtube.com/channel/UCazucVSJqW-kiHMIhQhD-QQ"}, {name: "Godenot", link: "https://www.youtube.com/user/SirGodenot"}, {name: "RajNoobTV", link: "https://www.youtube.com/channel/UCVLo9brXBWrCttMaGzvm0-Q"}, {name: "TomNotTom", link: "https://www.youtube.com/channel/UC7z97RgHFJRcv2niXgArBDw"}, {name: "Nation", link: "https://www.youtube.com/channel/UCSl-MBn3qzjrIvLNESQRk-g"}, {name: "Pidyohago", link: "https://www.youtube.com/channel/UC04p8Mg8nDaDx04A9is2B8Q"}, {name: "Enigma", link: "https://www.youtube.com/channel/UC5HhLbs3sReHo8Bb9NDdFrg"}, {name: "Bauer", link: "https://www.youtube.com/channel/UCwU2TbJx3xTSlPqg-Ix3R1g"}, {name: "iStealth", link: "https://www.youtube.com/channel/UCGrvlEOsQFViZbyFDE6t69A"}, {name: "SICKmania", link: "https://www.youtube.com/channel/UCvVI98ezn4TpX5wDMZjMa3g"}, {name: "LightThief", link: "https://www.youtube.com/channel/UCj6C_tiDeATiKd3GX127XoQ"}, {name: "Fortish", link: "https://www.youtube.com/channel/UCou6CLU-szZA3Tb340TB9_Q"}, {name: "巧克力", link: "https://www.youtube.com/channel/UCgL6J6oL8F69vm-GcPScmwg"}, {name: "i Febag", link: "https://www.youtube.com/channel/UCiU6WZwiKbsnt5xmwr0OFbg"}, {name: "GoneGaming", link: "https://www.youtube.com/channel/UCOcQthRanYcwYY0XVyVeK0g"}], rt = at[o.randInt(0, at.length - 1)];
    ot.innerHTML = "<a target='_blank' class='ytLink' href='" + rt.link + "'><i class='material-icons' style='vertical-align: top;'>&#xE064;</i> " + rt.name + "</a>";
    var ct = true, lt = false, ht = false;
    function ut(e) {
        s.close(), dt(e);
    }
    function dt(e) {
        le.style.display = "block", Ee.style.display = "none", Me.style.display = "none", Ne.style.display = "none", Pe.style.display = "block", Pe.innerHTML = e + "<a href='javascript:window.location.href=window.location.href' class='ytLink'>reload</a>";
    }
    window.onblur = function () {
        ct = false;
    }, window.onfocus = function () {
        ct = true, A && A.alive && ui();
    }, window.onload = function () {
        lt = true, w(), setTimeout(function () {
            k || (alert("Captcha failed to load"), window.location.reload());
        }, 2e4);
    }, window.captchaCallback = function () {
        ht = true, w();
    }, we.oncontextmenu = function () {
        return false;
    };
    function ft() {
        var e, t, i = "", n = 0;
        for (var s in y.servers) {
            for (var o = y.servers[s], a = 0, c = 0; c < o.length; c++) for (var l = 0; l < o[c].games.length; l++) a += o[c].games[l].playerCount;
            n += a;
            var h = y.regionInfo[s].name;
            i += "<option disabled>" + h + " - " + a + " players</option>";
            for (var u = 0; u < o.length; u++) for (var d = o[u], f = 0; f < d.games.length; f++) {
                var p = d.games[f], g = 1 * d.index + f + 1, m = y.server && y.server.region === d.region && y.server.index === d.index && y.gameIndex == f, k = h + " " + g + " [" + Math.min(p.playerCount, r.maxPlayers) + "/" + r.maxPlayers + "]";
                let e = y.stripRegion(s) + ":" + u + ":" + f;
                m && (de.getElementsByTagName("span")[0].innerText = e), i += "<option value='" + e + "' " + (m ? "selected" : "") + ">" + k + "</option>";
            }
            i += "<option disabled></option>";
        }
        i += "<option disabled>All Servers - " + n + " players</option>", be.innerHTML = i, "sandbox.moomoo.io" == location.hostname ? (e = "Back to MooMoo", t = "//moomoo.io/") : (e = "Try the sandbox", t = "//sandbox.moomoo.io/"), document.getElementById("altServer").innerHTML = "<a href='" + t + "'>" + e + "<i class='material-icons' style='font-size:10px;vertical-align:middle'>arrow_forward_ios</i></a>";
    }
    function pt() {
        var e = new XMLHttpRequest;
        e.onreadystatechange = function () {
            4 == this.readyState && (200 == this.status ? (window.vultr = JSON.parse(this.responseText), y.processServers(vultr.servers), ft()) : console.error("Failed to load server data with status code:", this.status));
        }, e.open("GET", "/serverData", true), e.send();
    }
    be.addEventListener("change", o.checkTrusted(function () {
        let e = be.value.split(":");
        y.switchServer(e[0], e[1], e[2]);
    }));
    var gt = 3e5, mt = 0, yt = 0;
    function kt() {
        if (!window.adsbygoogle) return console.log("Failed to load video ad API"), void ki();
        window.adsbygoogle.push({type: "next", adBreakDone: () => {
            ki();
        }});
    }
    function wt(e, t, i) {
        if (A && e) if (o.removeAllChildren(ze), ze.classList.add("visible"), o.generateElement({id: "itemInfoName", text: o.capitalizeFirst(e.name), parent: ze}), o.generateElement({id: "itemInfoDesc", text: e.desc, parent: ze}), i) ; else if (t) o.generateElement({class: "itemInfoReq", text: e.type ? "secondary" : "primary", parent: ze}); else {
            for (var n = 0; n < e.req.length; n += 2) o.generateElement({class: "itemInfoReq", html: e.req[n] + "<span class='itemInfoReqVal'> x" + e.req[n + 1] + "</span>", parent: ze});
            e.group.limit && o.generateElement({class: "itemInfoLmt", text: (A.itemCounts[e.group.id] || 0) + "/" + e.group.limit, parent: ze});
        } else ze.classList.remove("visible");
    }
    window.adsbygoogle && adsbygoogle.push({preloadAdBreaks: "on"}), window.showPreAd = kt;
    var vt, bt, xt, St = [], It = [];
    function Tt(e, t) {
        St.push({sid: e, name: t}), Mt();
    }
    function Mt() {
        if (St[0]) {
            var e = St[0];
            o.removeAllChildren($e), $e.style.display = "block", o.generateElement({class: "notificationText", text: e.name, parent: $e}), o.generateElement({class: "notifButton", html: "<i class='material-icons' style='font-size:28px;color:#cc5151;'>&#xE14C;</i>", parent: $e, onclick: function () {
                jt(0);
            }, hookTouch: true}), o.generateElement({class: "notifButton", html: "<i class='material-icons' style='font-size:28px;color:#8ecc51;'>&#xE876;</i>", parent: $e, onclick: function () {
                jt(1);
            }, hookTouch: true});
        } else $e.style.display = "none";
    }
    function Ct(e) {
        G.push(e), "block" == qe.style.display && Bt();
    }
    function Pt(e, t) {
        A && (A.team = e, A.isOwner = t, "block" == qe.style.display && Bt());
    }
    function Et(e) {
        It = e, "block" == qe.style.display && Bt();
    }
    function Ot(e) {
        for (var t = G.length - 1; t >= 0; t--) G[t].sid == e && G.splice(t, 1);
        "block" == qe.style.display && Bt();
    }
    function Bt() {
        if (A && A.alive) {
            if (ei(), Je.style.display = "none", qe.style.display = "block", o.removeAllChildren(We), A.team) for (var e = 0; e < It.length; e += 2) !function (e) {
                var t = o.generateElement({class: "allianceItem", style: "color:" + (It[e] == A.sid ? "#fff" : "rgba(255,255,255,0.6)"), text: It[e + 1], parent: We});
                A.isOwner && It[e] != A.sid && o.generateElement({class: "joinAlBtn", text: "Kick", onclick: function () {
                    At(It[e]);
                }, hookTouch: true, parent: t});
            }(e); else if (G.length) for (e = 0; e < G.length; ++e) !function (e) {
                var t = o.generateElement({class: "allianceItem", style: "color:" + (G[e].sid == A.team ? "#fff" : "rgba(255,255,255,0.6)"), text: G[e].sid, parent: We});
                o.generateElement({class: "joinAlBtn", text: "Join", onclick: function () {
                    Dt(e);
                }, hookTouch: true, parent: t});
            }(e); else o.generateElement({class: "allianceItem", text: "No Tribes Yet", parent: We});
            o.removeAllChildren(Xe), A.team ? o.generateElement({class: "allianceButtonM", style: "width: 360px", text: A.isOwner ? "Delete Tribe" : "Leave Tribe", onclick: function () {
                Rt();
            }, hookTouch: true, parent: Xe}) : (o.generateElement({tag: "input", type: "text", id: "allianceInput", maxLength: 7, placeholder: "unique name", ontouchstart: function (e) {
                e.preventDefault();
                var t = prompt("unique name", e.currentTarget.value);
                e.currentTarget.value = t.slice(0, 7);
            }, parent: Xe}), o.generateElement({tag: "div", class: "allianceButtonM", style: "width: 140px;", text: "Create", onclick: function () {
                Ut();
            }, hookTouch: true, parent: Xe}));
        }
    }
    function jt(e) {
        s.send("11", St[0].sid, e), St.splice(0, 1), Mt();
    }
    function At(e) {
        s.send("12", e);
    }
    function Dt(e) {
        s.send("10", G[e].sid);
    }
    function Ut() {
        s.send("8", document.getElementById("allianceInput").value);
    }
    function Rt() {
        St = [], Mt(), s.send("9");
    }
    var Lt, zt = [];
    function _t(e, t) {
        for (var i = 0; i < zt.length; ++i) if (!zt[i].active) {
            Lt = zt[i];
            break;
        }
        Lt || (Lt = new function () {
            this.init = function (e, t) {
                this.scale = 0, this.x = e, this.y = t, this.active = true;
            }, this.update = function (e, t) {
                this.active && (this.scale += 0.05 * t, this.scale >= r.mapPingScale ? this.active = false : (e.globalAlpha = 1 - Math.max(0, this.scale / r.mapPingScale), e.beginPath(), e.arc(this.x / r.mapScale * Ge.width, this.y / r.mapScale * Ge.width, this.scale, 0, 2 * Math.PI), e.stroke()));
            };
        }, zt.push(Lt)), Lt.init(e, t);
    }
    function Ft(e) {
        bt = e;
    }
    var Ht = 0;
    function Vt(e, t, i) {
        i ? e ? A.tailIndex = t : A.tails[t] = 1 : e ? A.skinIndex = t : A.skins[t] = 1, "block" == Je.style.display && qt();
    }
    function qt() {
        if (A) {
            o.removeAllChildren(Qe);
            for (var e = Ht, t = e ? et : Ze, i = 0; i < t.length; ++i) t[i].dontSell || function (i) {
                var n = o.generateElement({id: "storeDisplay" + i, class: "storeItem", onmouseout: function () {
                    wt();
                }, onmouseover: function () {
                    wt(t[i], false, true);
                }, parent: Qe});
                o.hookTouchEvents(n, true), o.generateElement({tag: "img", class: "hatPreview", src: "../img/" + (e ? "accessories/access_" : "hats/hat_") + t[i].id + (t[i].topSprite ? "_p" : "") + ".png", parent: n}), o.generateElement({tag: "span", text: t[i].name, parent: n}), (e ? A.tails[t[i].id] : A.skins[t[i].id]) ? (e ? A.tailIndex : A.skinIndex) == t[i].id ? o.generateElement({class: "joinAlBtn", style: "margin-top: 5px", text: "Unequip", onclick: function () {
                    Wt(0, e);
                }, hookTouch: true, parent: n}) : o.generateElement({class: "joinAlBtn", style: "margin-top: 5px", text: "Equip", onclick: function () {
                    Wt(t[i].id, e);
                }, hookTouch: true, parent: n}) : (o.generateElement({class: "joinAlBtn", style: "margin-top: 5px", text: "Buy", onclick: function () {
                    Xt(t[i].id, e);
                }, hookTouch: true, parent: n}), o.generateElement({tag: "span", class: "itemPrice", text: t[i].price, parent: n}));
            }(i);
        }
    }
    function Wt(e, t) {
        s.send("13c", 0, e, t);
    }
    function Xt(e, t) {
        s.send("13c", 1, e, t);
    }
    function Gt() {
        Je.style.display = "none", qe.style.display = "none", ei();
    }
    function Nt(e, t) {
        e && (t ? A.weapons = e : A.items = e);
        for (var i = 0; i < l.list.length; ++i) {
            var n = l.weapons.length + i;
            document.getElementById("actionBarItem" + n).style.display = A.items.indexOf(l.list[i].id) >= 0 ? "inline-block" : "none";
        }
        for (i = 0; i < l.weapons.length; ++i) document.getElementById("actionBarItem" + i).style.display = A.weapons[l.weapons[i].type] == l.weapons[i].id ? "inline-block" : "none";
    }
    function Yt(e) {
        C = e, V = e && window.devicePixelRatio || 1, xe.checked = e, T("native_resolution", e.toString()), oi();
    }
    function Kt() {
        for (var e = "", t = 0; t < r.skinColors.length; ++t) e += t == oe ? "<div class='skinColorItem activeSkin' style='background-color:" + r.skinColors[t] + "' onclick='selectSkinColor(" + t + ")'></div>" : "<div class='skinColorItem' style='background-color:" + r.skinColors[t] + "' onclick='selectSkinColor(" + t + ")'></div>";
        Ye.innerHTML = e;
    }
    var Jt = document.getElementById("chatBox"), Qt = document.getElementById("chatHolder");
    function $t() {
        ti ? setTimeout(function () {
            var e = prompt("chat message");
            e && Zt(e);
        }, 1) : "block" == Qt.style.display ? (Jt.value && Zt(Jt.value), ei()) : (Je.style.display = "none", qe.style.display = "none", Qt.style.display = "block", Jt.focus(), ui()), Jt.value = "";
    }
    function Zt(e) {
        s.send("ch", e.slice(0, 30));
    }
    function ei() {
        Jt.value = "", Qt.style.display = "none";
    }
    var ti, ii, ni = ["cunt", "whore", "fuck", "shit", "faggot", "nigger", "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex", "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune", "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard"];
    function si(e, t) {
        var i = bn(e);
        i && (i.chatMessage = function (e) {
            for (var t, i = 0; i < ni.length; ++i) if (e.indexOf(ni[i]) > -1) {
                t = "";
                for (var n = 0; n < ni[i].length; ++n) t += t.length ? "o" : "M";
                var s = new RegExp(ni[i], "g");
                e = e.replace(s, t);
            }
            return e;
        }(t), i.chatCountdown = r.chatCountdown);
    }
    var hai;
    function oi() {
        _ = window.innerWidth, F = window.innerHeight;
        var e = Math.max(_ / ae, F / re) * V;
        we.width = _ * V, we.height = F * V, we.style.width = _ + "px", we.style.height = F + "px", ve.setTransform(e, 0, 0, e, (_ * V - ae * e) / 2, (F * V - re * e) / 2);
    }
    function ai(e) {
        (ti = e) ? Ce.classList.add("touch") : Ce.classList.remove("touch");
    }
    function ri(e) {
        e.preventDefault(), e.stopPropagation(), ai(true);
        for (var t = 0; t < e.changedTouches.length; t++) {
            var i = e.changedTouches[t];
            i.identifier == ne.id ? (ne.id = -1, gi()) : i.identifier == se.id && (se.id = -1, A.buildIndex >= 0 && (j = 1, fi()), j = 0, fi());
        }
    }
    function ci() {
        return A ? (-1 != se.id ? ii = Math.atan2(se.currentY - se.startY, se.currentX - se.startX) : A.lockDir || ti || (ii = Math.atan2(ie - F / 2, te - _ / 2)), o.fixTo(ii || 0, 2)) : 0;
    }
    window.addEventListener("resize", o.checkTrusted(oi)), oi(), ai(false), window.setUsingTouch = ai, we.addEventListener("touchmove", o.checkTrusted(function (e) {
        e.preventDefault(), e.stopPropagation(), ai(true);
        for (var t = 0; t < e.changedTouches.length; t++) {
            var i = e.changedTouches[t];
            i.identifier == ne.id ? (ne.currentX = i.pageX, ne.currentY = i.pageY, gi()) : i.identifier == se.id && (se.currentX = i.pageX, se.currentY = i.pageY, j = 1);
        }
    }), false), we.addEventListener("touchstart", o.checkTrusted(function (e) {
        if (!ce) return e.preventDefault(), false;
        e.preventDefault(), e.stopPropagation(), ai(true);
        for (var t = 0; t < e.changedTouches.length; t++) {
            var i = e.changedTouches[t];
            i.pageX < document.body.scrollWidth / 2 && -1 == ne.id ? (ne.id = i.identifier, ne.startX = ne.currentX = i.pageX, ne.startY = ne.currentY = i.pageY, gi()) : i.pageX > document.body.scrollWidth / 2 && -1 == se.id && (se.id = i.identifier, se.startX = se.currentX = i.pageX, se.startY = se.currentY = i.pageY, A.buildIndex < 0 && (j = 1, fi()));
        }
    }), false), we.addEventListener("touchend", o.checkTrusted(ri), false), we.addEventListener("touchcancel", o.checkTrusted(ri), false), we.addEventListener("touchleave", o.checkTrusted(ri), false), we.addEventListener("mousemove", function (e) {
        e.preventDefault(), e.stopPropagation(), ai(false), te = e.clientX, ie = e.clientY;
    }, false), we.addEventListener("mousedown", function (e) {
        ai(false), 1 != j && (j = 1, fi());
    }, false), we.addEventListener("mouseup", function (e) {
        ai(false), 0 != j && (j = 0, fi());
    }, false);
    var li = {}, hi = {87: [0, -1], 38: [0, -1], 83: [0, 1], 40: [0, 1], 65: [-1, 0], 37: [-1, 0], 68: [1, 0], 39: [1, 0]};
    function ui() {
        li = {}, s.send("rmd");
    }
    function fi() {
        A && A.alive && s.send("c", j, A.buildIndex >= 0 ? ci() : null);
    }
    window.addEventListener("keydown", o.checkTrusted(function (e) {
        var t = e.which || e.keyCode || 0;
        27 == t ? Gt() : A && A.alive && ("block" != qe.style.display && "block" != Qt.style.display) && (li[t] || (li[t] = 1, 69 == t ? s.send("7", 1) : 67 == t ? (xt || (xt = {}), xt.x = A.x, xt.y = A.y) : 88 == t ? (A.lockDir = A.lockDir ? 0 : 1, s.send("7", 0)) : null != A.weapons[t - 49] ? yi(A.weapons[t - 49], true) : null != A.items[t - 49 - A.weapons.length] ? yi(A.items[t - 49 - A.weapons.length]) : 81 == t ? yi(A.items[0]) : 82 == t ? mi() : hi[t] ? gi() : 32 == t && (j = 1, fi())));
            hai = yi(R.weapons[t - 49])
    })), window.addEventListener("keyup", o.checkTrusted(function (e) {
        if (A && A.alive) {
            var t = e.which || e.keyCode || 0;
            13 == t ? $t() : "block" != qe.style.display && "block" != Qt.style.display && li[t] && (li[t] = 0, hi[t] ? gi() : 32 == t && (j = 0, fi()));
        }
    }));
    (function() {
        'use strict';
        function buyequip(index){
            window.storeBuy(index);
            setTimeout(()=>{
            window.storeEquip(index);
            }, 15);
        }
        function insta() {
            const rangeVAL = parseInt(document.getElementById("speed").value, 6);

            buyequip(7);
            s.send("7", 1);

            setTimeout(() => {
                yi(A.weapons[1], true);
                buyequip(53);

                setTimeout(() => {
                    yi(A.weapons[0], true);
                    buyequip(6);
                    s.send("7", 1);
                }, 130);
            }, 115.2 - rangeVAL);
        }
        function legitInsta(){
            const rangeVAL = parseInt(document.getElementById("speed").value, 6);

            buyequip(7);
            setTimeout(() => {
                s.send("7", 1);

                setTimeout(() => {
                    yi(A.weapons[1], true);

                    setTimeout(()=>{
                        buyequip(53);

                        setTimeout(()=>{
                            yi(A.weapons[0], true);
                            s.send("7", 1);
                            setTimeout(()=>{
                                buyequip(6);
                            }, 1100.9);
                        }, 190);
                    }, 65);
                }, 149.9 - rangeVAL);
            }, 145.5 - rangeVAL);
        }

        function handleKeyUp(e) {
            if (e.keyCode === 84 && !texter(document.activeElement)) {
                if(document.getElementById("legit").checked){
                legitInsta();
                }else{
                    insta();
                }
            }
            if(e.keyCode === 82 && !texter(document.activeElement)){
                buyequip(7);
            }
            if(e.keyCode === 85 && !texter(document.activeElement)){
                buyequip(53);
            }
            if(e.keyCode === 86 && !texter(document.activeElement)){
                buyequip(40);
            }
            if(e.keyCode === 71 && !texter(document.activeElement)){
                buyequip(6);
            }
            if(e.keyCode === 16 && !texter(document.activeElement)){
               buyequip(12);
            }
        }

        function texter(element) {
            return element.tagName === 'INPUT' || element.tagName === 'TEXTAREA';
        }

        function menu() {
            const menu = document.createElement('div');
            menu.style.position = 'fixed';
            menu.style.top = '10px';
            menu.style.left = '10px';
            menu.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            menu.style.borderRadius = '15%';
            menu.style.padding = '10px';
            menu.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
            menu.innerHTML = `
            <img src="https://media.discordapp.net/attachments/1108027764692496427/1146102764905189497/se828pA.png?width=345&height=297" alt="Kreisbild" style="width: 50px; height: 50px; border-radius: 50%;">
            <button id="Radiance">InstaKill</button>
            <br>
            <br>
            <input type="checkbox" id="heal">
<label for="heal" style="color: white;">AutoHeal</label>
<br>
<input type="checkbox" id="legit">
<label for="legit" style="color: white;">legit lookalike insta</label>
            <br>
            <label for="speed" style="color: white;">Speed:</label>
            <input type="range" id="speed" min="0" max="500" step="10" value="150">

        `;
        document.body.appendChild(menu);
const Radiance = document.getElementById("Radiance");
        Radiance.addEventListener('click', function() {
  if (document.getElementById("legit").checked) {
    legitInsta();
  } else {
    insta();
  }
});
    }
        //window.onload = () => {
    menu();
        //};
        document.body.addEventListener('keyup', handleKeyUp);
    })();

    var pi = void 0;
    function gi() {
        var e = function () {
            var e = 0, t = 0;
            if (-1 != ne.id) e += ne.currentX - ne.startX, t += ne.currentY - ne.startY; else for (var i in hi) {
                var n = hi[i];
                e += !!li[i] * n[0], t += !!li[i] * n[1];
            }
            return 0 == e && 0 == t ? void 0 : o.fixTo(Math.atan2(t, e), 2);
        }();
        (null == pi || null == e || Math.abs(e - pi) > 0.3) && (s.send("33", e), pi = e);
    }
    function mi() {
        s.send("14", 1);
    }
    function yi(e, t) {
        s.send("5", e, t);
    }
    function ki() {
        window.FRVR && window.FRVR.tracker.levelStart("game_start"), T("moo_name", Le.value), !ce && s.connected && (ce = true, x.stop("menu"), dt("Loading..."), s.send("sp", {name: Le.value, moofoll: H, skin: oe})), function () {
            var e = document.getElementById("ot-sdk-btn-floating");
            e && (e.style.display = "none");
        }();
    }
    var wi = true;
    function vi(e) {
        Pe.style.display = "none", Me.style.display = "block", le.style.display = "none", li = {}, D = e, j = 0, ce = true, wi && (wi = false, N.length = 0);
    }
    function bi(e, t, i, n) {
        m.showText(e, t, 70, 0.18, 900, Math.abs(i), i >= 0 ? "#fff" : "#8ecc51");
    }
    var xi = 99999;
    function Si() {
        ce = false, function () {
            var e = document.getElementById("ot-sdk-btn-floating");
            e && (e.style.display = "block");
        }();
        try {
            factorem.refreshAds([2], true);
        } catch (e) {}
        Ee.style.display = "none", Gt(), vt = {x: A.x, y: A.y}, Pe.style.display = "none", Ne.style.display = "block", Ne.style.fontSize = "0px", xi = 0, setTimeout(function () {
            Me.style.display = "block", le.style.display = "block", Ne.style.display = "none";
        }, r.deathFadeout), pt();
    }
    function Ii(e) {
        A && tt.removeAllItems(e);
    }
    function Ti(e) {
        tt.disableBySid(e);
    }
    function Mi() {
        Be.innerText = A.points, je.innerText = A.food, Ae.innerText = A.wood, De.innerText = A.stone, Ue.innerText = A.kills;
    }
    var Ci = {}, Pi = ["crown", "skull"], Ei = [];
    function Oi(e, t) {
        if (A.upgradePoints = e, A.upgrAge = t, e > 0) {
            Ei.length = 0, o.removeAllChildren(He);
            for (var i = 0; i < l.weapons.length; ++i) l.weapons[i].age == t && (null == l.weapons[i].pre || A.weapons.indexOf(l.weapons[i].pre) >= 0) && (o.generateElement({id: "upgradeItem" + i, class: "actionBarItem", onmouseout: function () {
                wt();
            }, parent: He}).style.backgroundImage = document.getElementById("actionBarItem" + i).style.backgroundImage, Ei.push(i));
            for (i = 0; i < l.list.length; ++i) if (l.list[i].age == t && (null == l.list[i].pre || A.items.indexOf(l.list[i].pre) >= 0)) {
                var n = l.weapons.length + i;
                o.generateElement({id: "upgradeItem" + n, class: "actionBarItem", onmouseout: function () {
                    wt();
                }, parent: He}).style.backgroundImage = document.getElementById("actionBarItem" + n).style.backgroundImage, Ei.push(n);
            }
            for (i = 0; i < Ei.length; i++) !function (e) {
                var t = document.getElementById("upgradeItem" + e);
                t.onmouseover = function () {
                    l.weapons[e] ? wt(l.weapons[e], true) : wt(l.list[e - l.weapons.length]);
                }, t.onclick = o.checkTrusted(function () {
                    s.send("6", e);
                }), o.hookTouchEvents(t);
            }(Ei[i]);
            Ei.length ? (He.style.display = "block", Ve.style.display = "block", Ve.innerHTML = "SELECT ITEMS (" + e + ")") : (He.style.display = "none", Ve.style.display = "none", wt());
        } else He.style.display = "none", Ve.style.display = "none", wt();
    }
    function Bi(e, t, i) {
        null != e && (A.XP = e), null != t && (A.maxXP = t), null != i && (A.age = i), i == r.maxAge ? (_e.innerHTML = "MAX AGE", Fe.style.width = "100%") : (_e.innerHTML = "AGE " + A.age, Fe.style.width = A.XP / A.maxXP * 100 + "%");
    }
    function ji(e) {
        o.removeAllChildren(Re);
        for (var t = 1, i = 0; i < e.length; i += 3) !function (i) {
            o.generateElement({class: "leaderHolder", parent: Re, children: [o.generateElement({class: "leaderboardItem", style: "color:" + (e[i] == D ? "#fff" : "rgba(255,255,255,0.6)"), text: t + ". " + ("" != e[i + 1] ? e[i + 1] : "unknown")}), o.generateElement({class: "leaderScore", text: o.kFormat(e[i + 2]) || "0"})]});
        }(i), t++;
    }
    let Ai = null;
    function Di(e, t, i, n) {
        ve.save(), ve.setTransform(1, 0, 0, 1, 0, 0), ve.scale(V, V);
        var s = 50;
        ve.beginPath(), ve.arc(e, t, s, 0, 2 * Math.PI, false), ve.closePath(), ve.fillStyle = "rgba(255, 255, 255, 0.3)", ve.fill(), s = 50;
        var o = i - e, a = n - t, r = Math.sqrt(Math.pow(o, 2) + Math.pow(a, 2)), c = r > s ? r / s : 1;
        o /= c, a /= c, ve.beginPath(), ve.arc(e + o, t + a, 0.5 * s, 0, 2 * Math.PI, false), ve.closePath(), ve.fillStyle = "white", ve.fill(), ve.restore();
    }
    function Ui(e, t, i) {
        for (var n = 0; n < Y.length; ++n) (U = Y[n]).active && U.layer == e && (U.update(E), U.active && (U.x - t + U.scale >= 0 && U.x - t - U.scale <= ae && U.y - i + U.scale >= 0 && U.y - i - U.scale <= re) && (ve.save(), ve.translate(U.x - t, U.y - i), ve.rotate(U.dir), Li(0, 0, U, ve, 1), ve.restore()));
    }
    var Ri = {};
    function Li(e, t, i, n, s) {
        if (i.src) {
            var o = l.projectiles[i.indx].src, a = Ri[o];
            a || ((a = new Image).onload = function () {
                this.isLoaded = true;
            }, a.src = ".././img/weapons/" + o + ".png", Ri[o] = a), a.isLoaded && n.drawImage(a, e - i.scale / 2, t - i.scale / 2, i.scale, i.scale);
        } else 1 == i.indx && (n.fillStyle = "#939393", en(e, t, i.scale, n));
    }
    function zi(e, t, i, n) {
        var s = r.riverWidth + n, o = r.mapScale / 2 - t - s / 2;
        o < re && o + s > 0 && i.fillRect(0, o, ae, s);
    }
    function _i(e, t, i) {
        for (var n, s, o, a = 0; a < N.length; ++a) (U = N[a]).active && (s = U.x + U.xWiggle - t, o = U.y + U.yWiggle - i, 0 == e && U.update(E), U.layer == e && (s + (U.scale + (U.blocker || 0)) >= 0 && s - (U.scale + (U.blocker || 0)) <= ae && o + (U.scale + (U.blocker || 0)) >= 0 && o - (U.scale + (U.blocker || 0)) <= re) && (ve.globalAlpha = U.hideFromEnemy ? 0.6 : 1, U.isItem ? (n = Zi(U), ve.save(), ve.translate(s, o), ve.rotate(U.dir), ve.drawImage(n, -n.width / 2, -n.height / 2), U.blocker && (ve.strokeStyle = "#db6e6e", ve.globalAlpha = 0.3, ve.lineWidth = 6, en(0, 0, U.blocker, ve, false, true)), ve.restore()) : (n = Qi(U), ve.drawImage(n, s - n.width / 2, o - n.height / 2))));
    }
    function Fi(e, t, i) {
        (U = bn(e)) && U.startAnim(t, i);
    }
    function Hi(e, t, i) {
        ve.globalAlpha = 1;
        for (var n = 0; n < X.length; ++n) (U = X[n]).zIndex == i && (U.animate(E), U.visible && (U.skinRot += 0.002 * E, z = (U == A ? ci() : U.dir) + U.dirPlus, ve.save(), ve.translate(U.x - e, U.y - t), ve.rotate(z), Vi(U, ve), ve.restore()));
    }
    function Vi(e, t) {
        (t = t || ve).lineWidth = 5.5, t.lineJoin = "miter";
        var i = Math.PI / 4 * (l.weapons[e.weaponIndex].armS || 1), n = e.buildIndex < 0 && l.weapons[e.weaponIndex].hndS || 1, s = e.buildIndex < 0 && l.weapons[e.weaponIndex].hndD || 1;
        if (e.tailIndex > 0 && function (e, t, i) {
            if (!(qi = Gi[e])) {
                var n = new Image;
                n.onload = function () {
                    this.isLoaded = true, this.onload = null;
                }, n.src = ".././img/accessories/access_" + e + ".png", Gi[e] = n, qi = n;
            }
            var s = Ni[e];
            if (!s) {
                for (var o = 0; o < et.length; ++o) if (et[o].id == e) {
                    s = et[o];
                    break;
                }
                Ni[e] = s;
            }
            qi.isLoaded && (t.save(), t.translate(-20 - (s.xOff || 0), 0), s.spin && t.rotate(i.skinRot), t.drawImage(qi, -s.scale / 2, -s.scale / 2, s.scale, s.scale), t.restore());
        }(e.tailIndex, t, e), e.buildIndex < 0 && !l.weapons[e.weaponIndex].aboveHand && (Ki(l.weapons[e.weaponIndex], r.weaponVariants[e.weaponVariant].src, e.scale, 0, t), null == l.weapons[e.weaponIndex].projectile || l.weapons[e.weaponIndex].hideProjectile || Li(e.scale, 0, l.projectiles[l.weapons[e.weaponIndex].projectile], ve)), t.fillStyle = r.skinColors[e.skinColor], en(e.scale * Math.cos(i), e.scale * Math.sin(i), 14), en(e.scale * s * Math.cos(-i * n), e.scale * s * Math.sin(-i * n), 14), e.buildIndex < 0 && l.weapons[e.weaponIndex].aboveHand && (Ki(l.weapons[e.weaponIndex], r.weaponVariants[e.weaponVariant].src, e.scale, 0, t), null == l.weapons[e.weaponIndex].projectile || l.weapons[e.weaponIndex].hideProjectile || Li(e.scale, 0, l.projectiles[l.weapons[e.weaponIndex].projectile], ve)), e.buildIndex >= 0) {
            var o = Zi(l.list[e.buildIndex]);
            t.drawImage(o, e.scale - l.list[e.buildIndex].holdOffset, -o.width / 2);
        }
        en(0, 0, e.scale, t), e.skinIndex > 0 && (t.rotate(Math.PI / 2), function e(t, i, n, s) {
            if (!(qi = Wi[t])) {
                var o = new Image;
                o.onload = function () {
                    this.isLoaded = true, this.onload = null;
                }, o.src = ".././img/hats/hat_" + t + ".png", Wi[t] = o, qi = o;
            }
            var a = n || Xi[t];
            if (!a) {
                for (var r = 0; r < Ze.length; ++r) if (Ze[r].id == t) {
                    a = Ze[r];
                    break;
                }
                Xi[t] = a;
            }
            qi.isLoaded && i.drawImage(qi, -a.scale / 2, -a.scale / 2, a.scale, a.scale), !n && a.topSprite && (i.save(), i.rotate(s.skinRot), e(t + "_top", i, a, s), i.restore());
        }(e.skinIndex, t, null, e));
    }
    var qi, Wi = {}, Xi = {}, Gi = {}, Ni = {}, Yi = {};
    function Ki(e, t, i, n, s) {
        var o = e.src + (t || ""), a = Yi[o];
        a || ((a = new Image).onload = function () {
            this.isLoaded = true;
        }, a.src = ".././img/weapons/" + o + ".png", Yi[o] = a), a.isLoaded && s.drawImage(a, i + e.xOff - e.length / 2, n + e.yOff - e.width / 2, e.length, e.width);
    }
    var Ji = {};
    function Qi(e) {
        var t = e.y >= r.mapScale - r.snowBiomeTop ? 2 : e.y <= r.snowBiomeTop ? 1 : 0, i = e.type + "_" + e.scale + "_" + t, n = Ji[i];
        if (!n) {
            var s = document.createElement("canvas");
            s.width = s.height = 2.1 * e.scale + 5.5;
            var a = s.getContext("2d");
            if (a.translate(s.width / 2, s.height / 2), a.rotate(o.randFloat(0, Math.PI)), a.strokeStyle = it, a.lineWidth = 5.5, 0 == e.type) for (var c, l = 0; l < 2; ++l) tn(a, 7, c = U.scale * (l ? 0.5 : 1), 0.7 * c), a.fillStyle = t ? l ? "#fff" : "#e3f1f4" : l ? "#b4db62" : "#9ebf57", a.fill(), l || a.stroke(); else if (1 == e.type) if (2 == t) a.fillStyle = "#606060", tn(a, 6, 0.3 * e.scale, 0.71 * e.scale), a.fill(), a.stroke(), a.fillStyle = "#89a54c", en(0, 0, 0.55 * e.scale, a), a.fillStyle = "#a5c65b", en(0, 0, 0.3 * e.scale, a, true); else {
                var h;
                !function (e, t, i, n) {
                    var s, a = Math.PI / 2 * 3, r = Math.PI / 6;
                    e.beginPath(), e.moveTo(0, -n);
                    for (var c = 0; c < 6; c++) s = o.randInt(i + 0.9, 1.2 * i), e.quadraticCurveTo(Math.cos(a + r) * s, Math.sin(a + r) * s, Math.cos(a + 2 * r) * n, Math.sin(a + 2 * r) * n), a += 2 * r;
                    e.lineTo(0, -n), e.closePath();
                }(a, 0, U.scale, 0.7 * U.scale), a.fillStyle = t ? "#e3f1f4" : "#89a54c", a.fill(), a.stroke(), a.fillStyle = t ? "#6a64af" : "#c15555";
                var u = I / 4;
                for (l = 0; l < 4; ++l) en((h = o.randInt(U.scale / 3.5, U.scale / 2.3)) * Math.cos(u * l), h * Math.sin(u * l), o.randInt(10, 12), a);
            } else 2 != e.type && 3 != e.type || (a.fillStyle = 2 == e.type ? 2 == t ? "#938d77" : "#939393" : "#e0c655", tn(a, 3, e.scale, e.scale), a.fill(), a.stroke(), a.fillStyle = 2 == e.type ? 2 == t ? "#b2ab90" : "#bcbcbc" : "#ebdca3", tn(a, 3, 0.55 * e.scale, 0.65 * e.scale), a.fill());
            n = s, Ji[i] = n;
        }
        return n;
    }
    var $i = [];
    function Zi(e, t) {
        var i = $i[e.id];
        if (!i || t) {
            var n = document.createElement("canvas");
            n.width = n.height = 2.5 * e.scale + 5.5 + (l.list[e.id].spritePadding || 0);
            var s = n.getContext("2d");
            if (s.translate(n.width / 2, n.height / 2), s.rotate(t ? 0 : Math.PI / 2), s.strokeStyle = it, s.lineWidth = 5.5 * (t ? n.width / 81 : 1), "apple" == e.name) {
                s.fillStyle = "#c15555", en(0, 0, e.scale, s), s.fillStyle = "#89a54c";
                var a = -Math.PI / 2;
                !function (e, t, i, n, s) {
                    var o = e + 25 * Math.cos(n), a = t + 25 * Math.sin(n);
                    s.moveTo(e, t), s.beginPath(), s.quadraticCurveTo((e + o) / 2 + 10 * Math.cos(n + Math.PI / 2), (t + a) / 2 + 10 * Math.sin(n + Math.PI / 2), o, a), s.quadraticCurveTo((e + o) / 2 - 10 * Math.cos(n + Math.PI / 2), (t + a) / 2 - 10 * Math.sin(n + Math.PI / 2), e, t), s.closePath(), s.fill(), s.stroke();
                }(e.scale * Math.cos(a), e.scale * Math.sin(a), 0, a + Math.PI / 2, s);
            } else if ("cookie" == e.name) {
                s.fillStyle = "#cca861", en(0, 0, e.scale, s), s.fillStyle = "#937c4b";
                for (var r = I / (h = 4), c = 0; c < h; ++c) en((u = o.randInt(e.scale / 2.5, e.scale / 1.7)) * Math.cos(r * c), u * Math.sin(r * c), o.randInt(4, 5), s, true);
            } else if ("cheese" == e.name) {
                var h, u;
                for (s.fillStyle = "#f4f3ac", en(0, 0, e.scale, s), s.fillStyle = "#c3c28b", r = I / (h = 4), c = 0; c < h; ++c) en((u = o.randInt(e.scale / 2.5, e.scale / 1.7)) * Math.cos(r * c), u * Math.sin(r * c), o.randInt(4, 5), s, true);
            } else if ("wood wall" == e.name || "stone wall" == e.name || "castle wall" == e.name) {
                s.fillStyle = "castle wall" == e.name ? "#83898e" : "wood wall" == e.name ? "#a5974c" : "#939393";
                var d = "castle wall" == e.name ? 4 : 3;
                tn(s, d, 1.1 * e.scale, 1.1 * e.scale), s.fill(), s.stroke(), s.fillStyle = "castle wall" == e.name ? "#9da4aa" : "wood wall" == e.name ? "#c9b758" : "#bcbcbc", tn(s, d, 0.65 * e.scale, 0.65 * e.scale), s.fill();
            } else if ("spikes" == e.name || "greater spikes" == e.name || "poison spikes" == e.name || "spinning spikes" == e.name) {
                s.fillStyle = "poison spikes" == e.name ? "#7b935d" : "#939393";
                var f = 0.6 * e.scale;
                tn(s, "spikes" == e.name ? 5 : 6, e.scale, f), s.fill(), s.stroke(), s.fillStyle = "#a5974c", en(0, 0, f, s), s.fillStyle = "#c9b758", en(0, 0, f / 2, s, true);
            } else if ("windmill" == e.name || "faster windmill" == e.name || "power mill" == e.name) s.fillStyle = "#a5974c", en(0, 0, e.scale, s), s.fillStyle = "#c9b758", sn(0, 0, 1.5 * e.scale, 29, 4, s), s.fillStyle = "#a5974c", en(0, 0, 0.5 * e.scale, s); else if ("mine" == e.name) s.fillStyle = "#939393", tn(s, 3, e.scale, e.scale), s.fill(), s.stroke(), s.fillStyle = "#bcbcbc", tn(s, 3, 0.55 * e.scale, 0.65 * e.scale), s.fill(); else if ("sapling" == e.name) for (c = 0; c < 2; ++c) tn(s, 7, f = e.scale * (c ? 0.5 : 1), 0.7 * f), s.fillStyle = c ? "#b4db62" : "#9ebf57", s.fill(), c || s.stroke(); else if ("pit trap" == e.name) s.fillStyle = "#a5974c", tn(s, 3, 1.1 * e.scale, 1.1 * e.scale), s.fill(), s.stroke(), s.fillStyle = it, tn(s, 3, 0.65 * e.scale, 0.65 * e.scale), s.fill(); else if ("boost pad" == e.name) s.fillStyle = "#7e7f82", nn(0, 0, 2 * e.scale, 2 * e.scale, s), s.fill(), s.stroke(), s.fillStyle = "#dbd97d", function (e, t) {
                t = t || ve;
                var i = e * (Math.sqrt(3) / 2);
                t.beginPath(), t.moveTo(0, -i / 2), t.lineTo(-e / 2, i / 2), t.lineTo(e / 2, i / 2), t.lineTo(0, -i / 2), t.fill(), t.closePath();
            }(1 * e.scale, s); else if ("turret" == e.name) s.fillStyle = "#a5974c", en(0, 0, e.scale, s), s.fill(), s.stroke(), s.fillStyle = "#939393", nn(0, -25, 0.9 * e.scale, 50, s), en(0, 0, 0.6 * e.scale, s), s.fill(), s.stroke(); else if ("platform" == e.name) {
                s.fillStyle = "#cebd5f";
                var p = 2 * e.scale, g = p / 4, m = -e.scale / 2;
                for (c = 0; c < 4; ++c) nn(m - g / 2, 0, g, 2 * e.scale, s), s.fill(), s.stroke(), m += p / 4;
            } else "healing pad" == e.name ? (s.fillStyle = "#7e7f82", nn(0, 0, 2 * e.scale, 2 * e.scale, s), s.fill(), s.stroke(), s.fillStyle = "#db6e6e", sn(0, 0, 0.65 * e.scale, 20, 4, s, true)) : "spawn pad" == e.name ? (s.fillStyle = "#7e7f82", nn(0, 0, 2 * e.scale, 2 * e.scale, s), s.fill(), s.stroke(), s.fillStyle = "#71aad6", en(0, 0, 0.6 * e.scale, s)) : "blocker" == e.name ? (s.fillStyle = "#7e7f82", en(0, 0, e.scale, s), s.fill(), s.stroke(), s.rotate(Math.PI / 4), s.fillStyle = "#db6e6e", sn(0, 0, 0.65 * e.scale, 20, 4, s, true)) : "teleporter" == e.name && (s.fillStyle = "#7e7f82", en(0, 0, e.scale, s), s.fill(), s.stroke(), s.rotate(Math.PI / 4), s.fillStyle = "#d76edb", en(0, 0, 0.5 * e.scale, s, true));
            i = n, t || ($i[e.id] = i);
        }
        return i;
    }
    function en(e, t, i, n, s, o) {
        (n = n || ve).beginPath(), n.arc(e, t, i, 0, 2 * Math.PI), o || n.fill(), s || n.stroke();
    }
    function tn(e, t, i, n) {
        var s, o, a = Math.PI / 2 * 3, r = Math.PI / t;
        e.beginPath(), e.moveTo(0, -i);
        for (var c = 0; c < t; c++) s = Math.cos(a) * i, o = Math.sin(a) * i, e.lineTo(s, o), a += r, s = Math.cos(a) * n, o = Math.sin(a) * n, e.lineTo(s, o), a += r;
        e.lineTo(0, -i), e.closePath();
    }
    function nn(e, t, i, n, s, o) {
        s.fillRect(e - i / 2, t - n / 2, i, n), o || s.strokeRect(e - i / 2, t - n / 2, i, n);
    }
    function sn(e, t, i, n, s, o, a) {
        o.save(), o.translate(e, t), s = Math.ceil(s / 2);
        for (var r = 0; r < s; r++) nn(0, 0, 2 * i, n, o, a), o.rotate(Math.PI / s);
        o.restore();
    }
    function on(e) {
        for (var t = 0; t < e.length;) tt.add(e[t], e[t + 1], e[t + 2], e[t + 3], e[t + 4], e[t + 5], l.list[e[t + 6]], true, e[t + 7] >= 0 ? {sid: e[t + 7]} : null), t += 8;
    }
    function an(e, t) {
        (U = Sn(t)) && (U.xWiggle += r.gatherWiggle * Math.cos(e), U.yWiggle += r.gatherWiggle * Math.sin(e));
    }
    function rn(e, t) {
        (U = Sn(e)) && (U.dir = t, U.xWiggle += r.gatherWiggle * Math.cos(t + Math.PI), U.yWiggle += r.gatherWiggle * Math.sin(t + Math.PI));
    }
    function cn(e, t, i, n, s, o, a, r) {
        ct && (K.addProjectile(e, t, i, n, s, o, null, null, a).sid = r);
    }
    function ln(e, t) {
        for (var i = 0; i < Y.length; ++i) Y[i].sid == e && (Y[i].range = t);
    }
    function hn(e) {
        (U = xn(e)) && U.startAnim();
    }
    function un(e) {
        for (var t = 0; t < W.length; ++t) W[t].forcePos = !W[t].visible, W[t].visible = false;
        if (e) {
            var i = Date.now();
            for (t = 0; t < e.length;) (U = xn(e[t])) ? (U.index = e[t + 1], U.t1 = void 0 === U.t2 ? i : U.t2, U.t2 = i, U.x1 = U.x, U.y1 = U.y, U.x2 = e[t + 2], U.y2 = e[t + 3], U.d1 = void 0 === U.d2 ? e[t + 4] : U.d2, U.d2 = e[t + 4], U.health = e[t + 5], U.dt = 0, U.visible = true) : ((U = $.spawn(e[t + 2], e[t + 3], e[t + 4], e[t + 1])).x2 = U.x, U.y2 = U.y, U.d2 = U.dir, U.health = e[t + 5], $.aiTypes[e[t + 1]].name || (U.name = r.cowNames[e[t + 6]]), U.forcePos = true, U.sid = e[t], U.visible = true), t += 7;
        }
    }
    var dn = {};
    function fn(e, t) {
        var i = e.index, n = dn[i];
        if (!n) {
            var s = new Image;
            s.onload = function () {
                this.isLoaded = true, this.onload = null;
            }, s.src = ".././img/animals/" + e.src + ".png", n = s, dn[i] = n;
        }
        if (n.isLoaded) {
            var o = 1.2 * e.scale * (e.spriteMlt || 1);
            t.drawImage(n, -o, -o, 2 * o, 2 * o);
        }
    }
    function gn(e, t) {
        var i = function (e) {
            for (var t = 0; t < X.length; ++t) if (X[t].id == e) return X[t];
            return null;
        }(e[0]);
        i || (i = new u(e[0], e[1], r, o, K, tt, X, W, l, Ze, et), X.push(i)), i.spawn(t ? H : null), i.visible = false, i.x2 = void 0, i.y2 = void 0, i.setData(e), t && (R = (A = i).x, L = A.y, Nt(), Mi(), Bi(), Oi(0), Ee.style.display = "block");
    }
    function mn(e, t) {
                    yi(A.items[e]),
                        s.send("c", 1, t),
                        s.send("c", 0, t),
                        yi(hai, !0);
                }
    function yn(e, t) {
        A && (A.itemCounts[e] = t);
    }
    function kn(e, t, i) {
        A && (A[e] = t, i && Mi());
    }
   let lastKeyPressTime = 0;
const debounceDelay = 135;

document.addEventListener('keydown', (event) => {
  const currentTime = Date.now();

  if (event.key === 'n' && currentTime - lastKeyPressTime >= debounceDelay) {
    mn(3, ci());
    lastKeyPressTime = currentTime;
  }

  if (event.key === 'f' && currentTime - lastKeyPressTime >= debounceDelay) {
    mn(4, ci());
    lastKeyPressTime = currentTime;
  }

  if (event.key === 'v' && currentTime - lastKeyPressTime >= debounceDelay) {
    mn(2, ci());
    lastKeyPressTime = currentTime;
  }
});


    /*setInterval(()=>{
        console.log(this.shameCount);
        setTimeout(()=>{
            console.log(U.shameCount);
        }, 100);
    }, 1000);*/
    // HEAL HEAL HEAL HEAL HEAL HEAL
    function wn(e, t) {
        const bal = false;
        const tal = false;
        const pal = false;
    const U = bn(e);

    if (U) {
        U.health = t;

        if (t < 100 && document.getElementById("heal").checked) {
            setTimeout(()=>{
                mn(0, ci());
            }, 120);
            if (t <= 50) {
                setTimeout(() => {
                    mn(0, ci());
                    yi(A.weapons[0], true);
                }, window.pingTime > 100 ? 25 : 125);
            } else {
                setTimeout(() => {
                    if(t < 15){
                    mn(0, ci());
                    }
                }, 10);
            }
        } else {
            return null;
        }
        if (t <= 35 && !pal && document.getElementById("heal").checked) {
            pal = true;
            mn(0, ci());
            setTimeout(()=>{
                pal = false;
                yi(A.weapons[0], true);
            }, 75);
        }else{
            if(t === 100 && !document.getElementById("heal").checked && (A.weapons[1], true)){
                pal = false;
                setTimeout(()=>{
                yi(A.weapons[0], true);
                }, 1500);
            }else{
                return pal;
            }
        }
    }
}

    function vn(e) {
        for (var t = Date.now(), i = 0; i < X.length; ++i) X[i].forcePos = !X[i].visible, X[i].visible = false;
        for (i = 0; i < e.length;) (U = bn(e[i])) && (U.t1 = void 0 === U.t2 ? t : U.t2, U.t2 = t, U.x1 = U.x, U.y1 = U.y, U.x2 = e[i + 1], U.y2 = e[i + 2], U.d1 = void 0 === U.d2 ? e[i + 3] : U.d2, U.d2 = e[i + 3], U.dt = 0, U.buildIndex = e[i + 4], U.weaponIndex = e[i + 5], U.weaponVariant = e[i + 6], U.team = e[i + 7], U.isLeader = e[i + 8], U.skinIndex = e[i + 9], U.tailIndex = e[i + 10], U.iconIndex = e[i + 11], U.zIndex = e[i + 12], U.visible = true), i += 13;
    }
    function bn(e) {
        for (var t = 0; t < X.length; ++t) if (X[t].sid == e) return X[t];
        return null;
    }
    function xn(e) {
        for (var t = 0; t < W.length; ++t) if (W[t].sid == e) return W[t];
        return null;
    }
    function Sn(e) {
        for (var t = 0; t < N.length; ++t) if (N[t].sid == e) return N[t];
        return null;
    }
    var In = -1;
    function Tn() {
        var e = Date.now() - In;
        window.pingTime = e, Ie.innerText = "Ping: " + e + " ms";
    }
    function Mn() {
        In = Date.now(), s.send("pp");
    }
    function Cn(e) {
        if (!(e < 0)) {
            var t = Math.floor(e / 60), i = e % 60;
            i = ("0" + i).slice(-2), Te.innerText = "Server restarting in " + t + ":" + i, Te.hidden = false;
        }
    }
    function Pn(e) {
        window.open(e, "_blank");
    }
    window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (e) {
        window.setTimeout(e, 16.666666666666668);
    }, function () {
        var e = r.mapScale / 2;
        tt.add(0, e, e + 200, 0, r.treeScales[3], 0), tt.add(1, e, e - 480, 0, r.treeScales[3], 0), tt.add(2, e + 300, e + 450, 0, r.treeScales[3], 0), tt.add(3, e - 950, e - 130, 0, r.treeScales[2], 0), tt.add(4, e - 750, e - 400, 0, r.treeScales[3], 0), tt.add(5, e - 700, e + 400, 0, r.treeScales[2], 0), tt.add(6, e + 800, e - 200, 0, r.treeScales[3], 0), tt.add(7, e - 260, e + 340, 0, r.bushScales[3], 1), tt.add(8, e + 760, e + 310, 0, r.bushScales[3], 1), tt.add(9, e - 800, e + 100, 0, r.bushScales[3], 1), tt.add(10, e - 800, e + 300, 0, l.list[4].scale, l.list[4].id, l.list[10]), tt.add(11, e + 650, e - 390, 0, l.list[4].scale, l.list[4].id, l.list[10]), tt.add(12, e - 400, e - 450, 0, r.rockScales[2], 2);
    }(), function e() {
        O = Date.now(), E = O - q, q = O, function () {
            if (A && (!B || O - B >= 1e3 / r.clientSendRate)) {
                B = O;
                const e = ci();
                Ai !== e && (Ai = e, s.send("2", e));
            }
            if (xi < 120 && (xi += 0.1 * E, Ne.style.fontSize = Math.min(Math.round(xi), 120) + "px"), A) {
                var e = o.getDistance(R, L, A.x, A.y), t = o.getDirection(A.x, A.y, R, L), i = Math.min(0.01 * e * E, e);
                e > 0.05 ? (R += i * Math.cos(t), L += i * Math.sin(t)) : (R = A.x, L = A.y);
            } else R = r.mapScale / 2, L = r.mapScale / 2;
            for (var n = O - 1e3 / r.serverUpdateRate, a = 0; a < X.length + W.length; ++a) if ((U = X[a] || W[a - X.length]) && U.visible) if (U.forcePos) U.x = U.x2, U.y = U.y2, U.dir = U.d2; else {
                var c = U.t2 - U.t1, l = (n - U.t1) / c;
                U.dt += E;
                var h = Math.min(1.7, U.dt / 170), u = U.x2 - U.x1;
                U.x = U.x1 + u * h, u = U.y2 - U.y1, U.y = U.y1 + u * h, U.dir = Math.lerpAngle(U.d2, U.d1, Math.min(1.2, l));
            }
            var d = R - ae / 2, f = L - re / 2;
            r.snowBiomeTop - f <= 0 && r.mapScale - r.snowBiomeTop - f >= re ? (ve.fillStyle = "#b6db66", ve.fillRect(0, 0, ae, re)) : r.mapScale - r.snowBiomeTop - f <= 0 ? (ve.fillStyle = "#dbc666", ve.fillRect(0, 0, ae, re)) : r.snowBiomeTop - f >= re ? (ve.fillStyle = "#fff", ve.fillRect(0, 0, ae, re)) : r.snowBiomeTop - f >= 0 ? (ve.fillStyle = "#fff", ve.fillRect(0, 0, ae, r.snowBiomeTop - f), ve.fillStyle = "#b6db66", ve.fillRect(0, r.snowBiomeTop - f, ae, re - (r.snowBiomeTop - f))) : (ve.fillStyle = "#b6db66", ve.fillRect(0, 0, ae, r.mapScale - r.snowBiomeTop - f), ve.fillStyle = "#dbc666", ve.fillRect(0, r.mapScale - r.snowBiomeTop - f, ae, re - (r.mapScale - r.snowBiomeTop - f))), wi || ((Z += ee * r.waveSpeed * E) >= r.waveMax ? (Z = r.waveMax, ee = -1) : Z <= 1 && (Z = ee = 1), ve.globalAlpha = 1, ve.fillStyle = "#dbc666", zi(d, f, ve, r.riverPadding), ve.fillStyle = "#91b2db", zi(d, f, ve, 250 * (Z - 1))), ve.lineWidth = 4, ve.strokeStyle = "#000", ve.globalAlpha = 0.06, ve.beginPath();
            for (var p = -R; p < ae; p += re / 18) p > 0 && (ve.moveTo(p, 0), ve.lineTo(p, re));
            for (var g = -L; g < re; g += re / 18) p > 0 && (ve.moveTo(0, g), ve.lineTo(ae, g));
            for (ve.stroke(), ve.globalAlpha = 1, ve.strokeStyle = it, _i(-1, d, f), ve.globalAlpha = 1, ve.lineWidth = 5.5, Ui(0, d, f), Hi(d, f, 0), ve.globalAlpha = 1, a = 0; a < W.length; ++a) (U = W[a]).active && U.visible && (U.animate(E), ve.save(), ve.translate(U.x - d, U.y - f), ve.rotate(U.dir + U.dirPlus - Math.PI / 2), fn(U, ve), ve.restore());
            if (_i(0, d, f), Ui(1, d, f), _i(1, d, f), Hi(d, f, 1), _i(2, d, f), _i(3, d, f), ve.fillStyle = "#000", ve.globalAlpha = 0.09, d <= 0 && ve.fillRect(0, 0, -d, re), r.mapScale - d <= ae) {
                var y = Math.max(0, -f);
                ve.fillRect(r.mapScale - d, y, ae - (r.mapScale - d), re - y);
            }
            if (f <= 0 && ve.fillRect(-d, 0, ae + d, -f), r.mapScale - f <= re) {
                var k = Math.max(0, -d), w = 0;
                r.mapScale - d <= ae && (w = ae - (r.mapScale - d)), ve.fillRect(k, r.mapScale - f, ae - k - w, re - (r.mapScale - f));
            }
            for (ve.globalAlpha = 1, ve.fillStyle = "rgba(0, 0, 70, 0.35)", ve.fillRect(0, 0, ae, re), ve.strokeStyle = nt, a = 0; a < X.length + W.length; ++a) if ((U = X[a] || W[a - X.length]).visible && (10 != U.skinIndex || U == A || U.team && U.team == A.team)) {
                var v = (U.team ? "[" + U.team + "] " : "") + (U.name || "");
                if ("" != v) {
                    if (ve.font = (U.nameScale || 30) + "px Hammersmith One", ve.fillStyle = "#fff", ve.textBaseline = "middle", ve.textAlign = "center", ve.lineWidth = U.nameScale ? 11 : 8, ve.lineJoin = "round", ve.strokeText(v, U.x - d, U.y - f - U.scale - r.nameY), ve.fillText(v, U.x - d, U.y - f - U.scale - r.nameY), U.isLeader && Ci.crown.isLoaded) {
                        var b = r.crownIconScale;
                        k = U.x - d - b / 2 - ve.measureText(v).width / 2 - r.crownPad, ve.drawImage(Ci.crown, k, U.y - f - U.scale - r.nameY - b / 2 - 5, b, b);
                    }
                    1 == U.iconIndex && Ci.skull.isLoaded && (b = r.crownIconScale, k = U.x - d - b / 2 + ve.measureText(v).width / 2 + r.crownPad, ve.drawImage(Ci.skull, k, U.y - f - U.scale - r.nameY - b / 2 - 5, b, b));
                }
                U.health > 0 && (r.healthBarWidth, ve.fillStyle = nt, ve.roundRect(U.x - d - r.healthBarWidth - r.healthBarPad, U.y - f + U.scale + r.nameY, 2 * r.healthBarWidth + 2 * r.healthBarPad, 17, 8), ve.fill(), ve.fillStyle = U == A || U.team && U.team == A.team ? "#8ecc51" : "#cc5151", ve.roundRect(U.x - d - r.healthBarWidth, U.y - f + U.scale + r.nameY + r.healthBarPad, 2 * r.healthBarWidth * (U.health / U.maxHealth), 17 - 2 * r.healthBarPad, 7), ve.fill());
            }
            for (m.update(E, ve, d, f), a = 0; a < X.length; ++a) if ((U = X[a]).visible && U.chatCountdown > 0) {
                U.chatCountdown -= E, U.chatCountdown <= 0 && (U.chatCountdown = 0), ve.font = "32px Hammersmith One";
                var x = ve.measureText(U.chatMessage);
                ve.textBaseline = "middle", ve.textAlign = "center", k = U.x - d, y = U.y - U.scale - f - 90;
                var S = x.width + 17;
                ve.fillStyle = "rgba(0,0,0,0.2)", ve.roundRect(k - S / 2, y - 23.5, S, 47, 6), ve.fill(), ve.fillStyle = "#fff", ve.fillText(U.chatMessage, k, y);
            }
            !function (e) {
                if (A && A.alive) {
                    Ke.clearRect(0, 0, Ge.width, Ge.height), Ke.strokeStyle = "#fff", Ke.lineWidth = 4;
                    for (var t = 0; t < zt.length; ++t) (Lt = zt[t]).update(Ke, e);
                    if (Ke.globalAlpha = 1, Ke.fillStyle = "#fff", en(A.x / r.mapScale * Ge.width, A.y / r.mapScale * Ge.height, 7, Ke, true), Ke.fillStyle = "rgba(255,255,255,0.35)", A.team && bt) for (t = 0; t < bt.length;) en(bt[t] / r.mapScale * Ge.width, bt[t + 1] / r.mapScale * Ge.height, 7, Ke, true), t += 2;
                    vt && (Ke.fillStyle = "#fc5553", Ke.font = "34px Hammersmith One", Ke.textBaseline = "middle", Ke.textAlign = "center", Ke.fillText("x", vt.x / r.mapScale * Ge.width, vt.y / r.mapScale * Ge.height)), xt && (Ke.fillStyle = "#fff", Ke.font = "34px Hammersmith One", Ke.textBaseline = "middle", Ke.textAlign = "center", Ke.fillText("x", xt.x / r.mapScale * Ge.width, xt.y / r.mapScale * Ge.height));
                }
            }(E), -1 !== ne.id && Di(ne.startX, ne.startY, ne.currentX, ne.currentY), -1 !== se.id && Di(se.startX, se.startY, se.currentX, se.currentY);
        }(), requestAnimFrame(e);
    }(), window.openLink = Pn, window.aJoinReq = jt, window.follmoo = function () {
        H || (H = true, T("moofoll", 1));
    }, window.kickFromClan = At, window.sendJoin = Dt, window.leaveAlliance = Rt, window.createAlliance = Ut, window.storeBuy = Xt, window.storeEquip = Wt, window.showItemInfo = wt, window.selectSkinColor = function (e) {
        oe = e, Kt();
    }, window.changeStoreIndex = function (e) {
        Ht != e && (Ht = e, qt());
    }, window.config = r, window.FRVR && window.FRVR.bootstrapper.complete();
}, function (e, t) {
    !function (e, t, i) {
        var s = [], o = [], a = {_version: "3.5.0", _config: {classPrefix: "", enableClasses: true, enableJSClass: true, usePrefixes: true}, _q: [], on: function (e, t) {
            var i = this;
            setTimeout(function () {
                t(i[e]);
            }, 0);
        }, addTest: function (e, t, i) {
            o.push({name: e, fn: t, options: i});
        }, addAsyncTest: function (e) {
            o.push({name: null, fn: e});
        }}, r = function () {};
        r.prototype = a, r = new r;
        var c = t.documentElement, l = "svg" === c.nodeName.toLowerCase();
        r.addTest("passiveeventlisteners", function () {
            var t = false;
            try {
                var i = Object.defineProperty({}, "passive", {get: function () {
                    t = true;
                }});
                e.addEventListener("test", null, i);
            } catch (e) {}
            return t;
        }), function () {
            var e, t, i, a, c, l;
            for (var h in o) if (o.hasOwnProperty(h)) {
                if (e = [], (t = o[h]).name && (e.push(t.name.toLowerCase()), t.options && t.options.aliases && t.options.aliases.length)) for (i = 0; i < t.options.aliases.length; i++) e.push(t.options.aliases[i].toLowerCase());
                for (a = typeof t.fn === "function" ? t.fn() : t.fn, c = 0; c < e.length; c++) 1 === (l = e[c].split(".")).length ? r[l[0]] = a : (!r[l[0]] || r[l[0]] instanceof Boolean || (r[l[0]] = new Boolean(r[l[0]])), r[l[0]][l[1]] = a), s.push((a ? "" : "no-") + l.join("-"));
            }
        }(), function (e) {
            var t = c.className, i = r._config.classPrefix || "";
            if (l && (t = t.baseVal), r._config.enableJSClass) {
                var n = new RegExp("(^|\\s)" + i + "no-js(\\s|$)");
                t = t.replace(n, "$1" + i + "js$2");
            }
            r._config.enableClasses && (t += " " + i + e.join(" " + i), l ? c.className.baseVal = t : c.className = t);
        }(s), delete a.addTest, delete a.addAsyncTest;
        for (var h = 0; h < r._q.length; h++) r._q[h]();
        e.Modernizr = r;
    }(window, document);
}, function (e, t, i) {
    const {Encoder: n, Decoder: s} = i(37), o = new n, a = new s;
    i(0), e.exports = {socket: null, connected: false, socketId: -1, connect: function (e, t, i) {
        if (!this.socket) {
            var n = this;
            try {
                var s = false, o = e;
                this.socket = new WebSocket(o), this.socket.binaryType = "arraybuffer", this.socket.onmessage = function (e) {
                    var t = new Uint8Array(e.data), s = a.decode(t), o = s[0];
                    t = s[1], "io-init" == o ? n.socketId = t[0] : i[o].apply(void 0, t);
                }, this.socket.onopen = function () {
                    n.connected = true, t();
                }, this.socket.onclose = function (e) {
                    n.connected = false, 4001 == e.code ? t("Invalid Connection") : s || t("disconnected");
                }, this.socket.onerror = function (e) {
                    this.socket && this.socket.readyState != WebSocket.OPEN && (s = true, console.error("Socket error", arguments), t("Socket error"));
                };
            } catch (e) {
                console.warn("Socket connection error:", e), t(e);
            }
        }
    }, send: function (e) {
        var t = Array.prototype.slice.call(arguments, 1), i = o.encode([e, t]);
        this.socket.send(i);
    }, socketReady: function () {
        return this.socket && this.connected;
    }, close: function () {
        this.socket && this.socket.close();
    }};
}, function (e, t) {
    var i, n, s = e.exports = {};
    function o() {
        throw new Error("setTimeout has not been defined");
    }
    function a() {
        throw new Error("clearTimeout has not been defined");
    }
    function r(e) {
        if (i === setTimeout) return setTimeout(e, 0);
        if ((i === o || !i) && setTimeout) return i = setTimeout, setTimeout(e, 0);
        try {
            return i(e, 0);
        } catch (t) {
            try {
                return i.call(null, e, 0);
            } catch (t) {
                return i.call(this, e, 0);
            }
        }
    }
    !function () {
        try {
            i = "function" == typeof setTimeout ? setTimeout : o;
        } catch (e) {
            i = o;
        }
        try {
            n = "function" == typeof clearTimeout ? clearTimeout : a;
        } catch (e) {
            n = a;
        }
    }();
    var c, l = [], h = false, u = -1;
    function d() {
        h && c && (h = false, c.length ? l = c.concat(l) : u = -1, l.length && f());
    }
    function f() {
        if (!h) {
            var e = r(d);
            h = true;
            for (var t = l.length; t;) {
                for (c = l, l = []; ++u < t;) c && c[u].run();
                u = -1, t = l.length;
            }
            c = null, h = false, function (e) {
                if (n === clearTimeout) return clearTimeout(e);
                if ((n === a || !n) && clearTimeout) return n = clearTimeout, clearTimeout(e);
                try {
                    n(e);
                } catch (t) {
                    try {
                        return n.call(null, e);
                    } catch (t) {
                        return n.call(this, e);
                    }
                }
            }(e);
        }
    }
    function p(e, t) {
        this.fun = e, this.array = t;
    }
    function g() {}
    s.nextTick = function (e) {
        var t = new Array(arguments.length - 1);
        if (arguments.length > 1) for (var i = 1; i < arguments.length; i++) t[i - 1] = arguments[i];
        l.push(new p(e, t)), 1 !== l.length || h || r(f);
    }, p.prototype.run = function () {
        this.fun.apply(null, this.array);
    }, s.title = "browser", s.browser = true, s.env = {}, s.argv = [], s.version = "", s.versions = {}, s.on = g, s.addListener = g, s.once = g, s.off = g, s.removeListener = g, s.removeAllListeners = g, s.emit = g, s.prependListener = g, s.prependOnceListener = g, s.listeners = function (e) {
        return [];
    }, s.binding = function (e) {
        throw new Error("process.binding is not supported");
    }, s.cwd = function () {
        return "/";
    }, s.chdir = function (e) {
        throw new Error("process.chdir is not supported");
    }, s.umask = function () {
        return 0;
    };
}, function (e, t) {
    var i = Math.abs, n = (Math.cos, Math.sin, Math.pow, Math.sqrt), s = (i = Math.abs, Math.atan2), o = Math.PI;
    e.exports.randInt = function (e, t) {
        return Math.floor(Math.random() * (t - e + 1)) + e;
    }, e.exports.randFloat = function (e, t) {
        return Math.random() * (t - e + 1) + e;
    }, e.exports.lerp = function (e, t, i) {
        return e + (t - e) * i;
    }, e.exports.decel = function (e, t) {
        return e > 0 ? e = Math.max(0, e - t) : e < 0 && (e = Math.min(0, e + t)), e;
    }, e.exports.getDistance = function (e, t, i, s) {
        return n((i -= e) * i + (s -= t) * s);
    }, e.exports.getDirection = function (e, t, i, n) {
        return s(t - n, e - i);
    }, e.exports.getAngleDist = function (e, t) {
        var n = i(t - e) % (2 * o);
        return n > o ? 2 * o - n : n;
    }, e.exports.isNumber = function (e) {
        return "number" == typeof e && !isNaN(e) && isFinite(e);
    }, e.exports.isString = function (e) {
        return e && "string" == typeof e;
    }, e.exports.kFormat = function (e) {
        return e > 999 ? (e / 1e3).toFixed(1) + "k" : e;
    }, e.exports.capitalizeFirst = function (e) {
        return e.charAt(0).toUpperCase() + e.slice(1);
    }, e.exports.fixTo = function (e, t) {
        return parseFloat(e.toFixed(t));
    }, e.exports.sortByPoints = function (e, t) {
        return parseFloat(t.points) - parseFloat(e.points);
    }, e.exports.lineInRect = function (e, t, i, n, s, o, a, r) {
        var c = s, l = a;
        if (s > a && (c = a, l = s), l > i && (l = i), c < e && (c = e), c > l) return false;
        var h = o, u = r, d = a - s;
        if (Math.abs(d) > 1e-7) {
            var f = (r - o) / d, p = o - f * s;
            h = f * c + p, u = f * l + p;
        }
        if (h > u) {
            var g = u;
            u = h, h = g;
        }
        return u > n && (u = n), h < t && (h = t), !(h > u);
    }, e.exports.containsPoint = function (e, t, i) {
        var n = e.getBoundingClientRect(), s = n.left + window.scrollX, o = n.top + window.scrollY, a = n.width, r = n.height;
        return t > s && t < s + a && i > o && i < o + r;
    }, e.exports.mousifyTouchEvent = function (e) {
        var t = e.changedTouches[0];
        e.screenX = t.screenX, e.screenY = t.screenY, e.clientX = t.clientX, e.clientY = t.clientY, e.pageX = t.pageX, e.pageY = t.pageY;
    }, e.exports.hookTouchEvents = function (t, i) {
        var n = !i, s = false;
        function o(i) {
            e.exports.mousifyTouchEvent(i), window.setUsingTouch(true), n && (i.preventDefault(), i.stopPropagation()), s && (t.onclick && t.onclick(i), t.onmouseout && t.onmouseout(i), s = false);
        }
        t.addEventListener("touchstart", e.exports.checkTrusted(function (i) {
            e.exports.mousifyTouchEvent(i), window.setUsingTouch(true), n && (i.preventDefault(), i.stopPropagation()), t.onmouseover && t.onmouseover(i), s = true;
        }), false), t.addEventListener("touchmove", e.exports.checkTrusted(function (i) {
            e.exports.mousifyTouchEvent(i), window.setUsingTouch(true), n && (i.preventDefault(), i.stopPropagation()), e.exports.containsPoint(t, i.pageX, i.pageY) ? s || (t.onmouseover && t.onmouseover(i), s = true) : s && (t.onmouseout && t.onmouseout(i), s = false);
        }), false), t.addEventListener("touchend", e.exports.checkTrusted(o), false), t.addEventListener("touchcancel", e.exports.checkTrusted(o), false), t.addEventListener("touchleave", e.exports.checkTrusted(o), false);
    }, e.exports.removeAllChildren = function (e) {
        for (; e.hasChildNodes();) e.removeChild(e.lastChild);
    }, e.exports.generateElement = function (t) {
        var i = document.createElement(t.tag || "div");
        function n(e, n) {
            t[e] && (i[n] = t[e]);
        }
        for (var s in n("text", "textContent"), n("html", "innerHTML"), n("class", "className"), t) {
            switch (s) {
                case "tag":
                case "text":
                case "html":
                case "class":
                case "style":
                case "hookTouch":
                case "parent":
                case "children":
                    continue;
            }
            i[s] = t[s];
        }
        if (i.onclick && (i.onclick = e.exports.checkTrusted(i.onclick)), i.onmouseover && (i.onmouseover = e.exports.checkTrusted(i.onmouseover)), i.onmouseout && (i.onmouseout = e.exports.checkTrusted(i.onmouseout)), t.style && (i.style.cssText = t.style), t.hookTouch && e.exports.hookTouchEvents(i), t.parent && t.parent.appendChild(i), t.children) for (var o = 0; o < t.children.length; o++) i.appendChild(t.children[o]);
        return i;
    }, e.exports.eventIsTrusted = function (e) {
        return !e || "boolean" != typeof e.isTrusted || e.isTrusted;
    }, e.exports.checkTrusted = function (t) {
        return function (i) {
            i && i instanceof Event && e.exports.eventIsTrusted(i) && t(i);
        };
    }, e.exports.randomString = function (e) {
        for (var t = "", i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", n = 0; n < e; n++) t += i.charAt(Math.floor(Math.random() * i.length));
        return t;
    }, e.exports.countInArray = function (e, t) {
        for (var i = 0, n = 0; n < e.length; n++) e[n] === t && i++;
        return i;
    };
}, function (e, t) {
    e.exports.AnimText = function () {
        this.init = function (e, t, i, n, s, o, a) {
            this.x = e, this.y = t, this.color = a, this.scale = i, this.startScale = this.scale, this.maxScale = 1.5 * i, this.scaleSpeed = 0.7, this.speed = n, this.life = s, this.text = o;
        }, this.update = function (e) {
            this.life && (this.life -= e, this.y -= this.speed * e, this.scale += this.scaleSpeed * e, this.scale >= this.maxScale ? (this.scale = this.maxScale, this.scaleSpeed *= -1) : this.scale <= this.startScale && (this.scale = this.startScale, this.scaleSpeed = 0), this.life <= 0 && (this.life = 0));
        }, this.render = function (e, t, i) {
            e.fillStyle = this.color, e.font = this.scale + "px Hammersmith One", e.fillText(this.text, this.x - t, this.y - i);
        };
    }, e.exports.TextManager = function () {
        this.texts = [], this.update = function (e, t, i, n) {
            t.textBaseline = "middle", t.textAlign = "center";
            for (var s = 0; s < this.texts.length; ++s) this.texts[s].life && (this.texts[s].update(e), this.texts[s].render(t, i, n));
        }, this.showText = function (t, i, n, s, o, a, r) {
            for (var c, l = 0; l < this.texts.length; ++l) if (!this.texts[l].life) {
                c = this.texts[l];
                break;
            }
            c || (c = new e.exports.AnimText, this.texts.push(c)), c.init(t, i, n, s, o, a, r);
        };
    };
}, function (e, t) {
    e.exports = function (e) {
        this.sid = e, this.init = function (e, t, i, n, s, o, a) {
            o = o || {}, this.sentTo = {}, this.gridLocations = [], this.active = true, this.doUpdate = o.doUpdate, this.x = e, this.y = t, this.dir = i, this.xWiggle = 0, this.yWiggle = 0, this.scale = n, this.type = s, this.id = o.id, this.owner = a, this.name = o.name, this.isItem = null != this.id, this.group = o.group, this.health = o.health, this.layer = 2, null != this.group ? this.layer = this.group.layer : 0 == this.type ? this.layer = 3 : 2 == this.type ? this.layer = 0 : 4 == this.type && (this.layer = -1), this.colDiv = o.colDiv || 1, this.blocker = o.blocker, this.ignoreCollision = o.ignoreCollision, this.dontGather = o.dontGather, this.hideFromEnemy = o.hideFromEnemy, this.friction = o.friction, this.projDmg = o.projDmg, this.dmg = o.dmg, this.pDmg = o.pDmg, this.pps = o.pps, this.zIndex = o.zIndex || 0, this.turnSpeed = o.turnSpeed, this.req = o.req, this.trap = o.trap, this.healCol = o.healCol, this.teleport = o.teleport, this.boostSpeed = o.boostSpeed, this.projectile = o.projectile, this.shootRange = o.shootRange, this.shootRate = o.shootRate, this.shootCount = this.shootRate, this.spawnPoint = o.spawnPoint;
        }, this.changeHealth = function (e, t) {
            return this.health += e, this.health <= 0;
        }, this.getScale = function (e, t) {
            return e = e || 1, this.scale * (this.isItem || 2 == this.type || 3 == this.type || 4 == this.type ? 1 : 0.6 * e) * (t ? 1 : this.colDiv);
        }, this.visibleToPlayer = function (e) {
            return !this.hideFromEnemy || this.owner && (this.owner == e || this.owner.team && e.team == this.owner.team);
        }, this.update = function (e) {
            this.active && (this.xWiggle && (this.xWiggle *= Math.pow(0.99, e)), this.yWiggle && (this.yWiggle *= Math.pow(0.99, e)), this.turnSpeed && (this.dir += this.turnSpeed * e));
        };
    };
}, function (e, t) {
    e.exports.groups = [{id: 0, name: "food", layer: 0}, {id: 1, name: "walls", place: true, limit: 30, layer: 0}, {id: 2, name: "spikes", place: true, limit: 15, layer: 0}, {id: 3, name: "mill", place: true, limit: 7, layer: 1}, {id: 4, name: "mine", place: true, limit: 1, layer: 0}, {id: 5, name: "trap", place: true, limit: 6, layer: -1}, {id: 6, name: "booster", place: true, limit: 12, layer: -1}, {id: 7, name: "turret", place: true, limit: 2, layer: 1}, {id: 8, name: "watchtower", place: true, limit: 12, layer: 1}, {id: 9, name: "buff", place: true, limit: 4, layer: -1}, {id: 10, name: "spawn", place: true, limit: 1, layer: -1}, {id: 11, name: "sapling", place: true, limit: 2, layer: 0}, {id: 12, name: "blocker", place: true, limit: 3, layer: -1}, {id: 13, name: "teleporter", place: true, limit: 2, layer: -1}], t.projectiles = [{indx: 0, layer: 0, src: "arrow_1", dmg: 25, speed: 1.6, scale: 103, range: 1e3}, {indx: 1, layer: 1, dmg: 25, scale: 20}, {indx: 0, layer: 0, src: "arrow_1", dmg: 35, speed: 2.5, scale: 103, range: 1200}, {indx: 0, layer: 0, src: "arrow_1", dmg: 30, speed: 2, scale: 103, range: 1200}, {indx: 1, layer: 1, dmg: 16, scale: 20}, {indx: 0, layer: 0, src: "bullet_1", dmg: 50, speed: 3.6, scale: 160, range: 1400}], t.weapons = [{id: 0, type: 0, name: "tool hammer", desc: "tool for gathering all resources", src: "hammer_1", length: 140, width: 140, xOff: -3, yOff: 18, dmg: 25, range: 65, gather: 1, speed: 300}, {id: 1, type: 0, age: 2, name: "hand axe", desc: "gathers resources at a higher rate", src: "axe_1", length: 140, width: 140, xOff: 3, yOff: 24, dmg: 30, spdMult: 1, range: 70, gather: 2, speed: 400}, {id: 2, type: 0, age: 8, pre: 1, name: "great axe", desc: "deal more damage and gather more resources", src: "great_axe_1", length: 140, width: 140, xOff: -8, yOff: 25, dmg: 35, spdMult: 1, range: 75, gather: 4, speed: 400}, {id: 3, type: 0, age: 2, name: "short sword", desc: "increased attack power but slower move speed", src: "sword_1", iPad: 1.3, length: 130, width: 210, xOff: -8, yOff: 46, dmg: 35, spdMult: 0.85, range: 110, gather: 1, speed: 300}, {id: 4, type: 0, age: 8, pre: 3, name: "katana", desc: "greater range and damage", src: "samurai_1", iPad: 1.3, length: 130, width: 210, xOff: -8, yOff: 59, dmg: 40, spdMult: 0.8, range: 118, gather: 1, speed: 300}, {id: 5, type: 0, age: 2, name: "polearm", desc: "long range melee weapon", src: "spear_1", iPad: 1.3, length: 130, width: 210, xOff: -8, yOff: 53, dmg: 45, knock: 0.2, spdMult: 0.82, range: 142, gather: 1, speed: 700}, {id: 6, type: 0, age: 2, name: "bat", desc: "fast long range melee weapon", src: "bat_1", iPad: 1.3, length: 110, width: 180, xOff: -8, yOff: 53, dmg: 20, knock: 0.7, range: 110, gather: 1, speed: 300}, {id: 7, type: 0, age: 2, name: "daggers", desc: "really fast short range weapon", src: "dagger_1", iPad: 0.8, length: 110, width: 110, xOff: 18, yOff: 0, dmg: 20, knock: 0.1, range: 65, gather: 1, hitSlow: 0.1, spdMult: 1.13, speed: 100}, {id: 8, type: 0, age: 2, name: "stick", desc: "great for gathering but very weak", src: "stick_1", length: 140, width: 140, xOff: 3, yOff: 24, dmg: 1, spdMult: 1, range: 70, gather: 7, speed: 400}, {id: 9, type: 1, age: 6, name: "hunting bow", desc: "bow used for ranged combat and hunting", src: "bow_1", req: ["wood", 4], length: 120, width: 120, xOff: -6, yOff: 0, projectile: 0, spdMult: 0.75, speed: 600}, {id: 10, type: 1, age: 6, name: "great hammer", desc: "hammer used for destroying structures", src: "great_hammer_1", length: 140, width: 140, xOff: -9, yOff: 25, dmg: 10, spdMult: 0.88, range: 75, sDmg: 7.5, gather: 1, speed: 400}, {id: 11, type: 1, age: 6, name: "wooden shield", desc: "blocks projectiles and reduces melee damage", src: "shield_1", length: 120, width: 120, shield: 0.2, xOff: 6, yOff: 0, spdMult: 0.7}, {id: 12, type: 1, age: 8, pre: 9, name: "crossbow", desc: "deals more damage and has greater range", src: "crossbow_1", req: ["wood", 5], aboveHand: true, armS: 0.75, length: 120, width: 120, xOff: -4, yOff: 0, projectile: 2, spdMult: 0.7, speed: 700}, {id: 13, type: 1, age: 9, pre: 12, name: "repeater crossbow", desc: "high firerate crossbow with reduced damage", src: "crossbow_2", req: ["wood", 10], aboveHand: true, armS: 0.75, length: 120, width: 120, xOff: -4, yOff: 0, projectile: 3, spdMult: 0.7, speed: 230}, {id: 14, type: 1, age: 6, name: "mc grabby", desc: "steals resources from enemies", src: "grab_1", length: 130, width: 210, xOff: -8, yOff: 53, dmg: 0, steal: 250, knock: 0.2, spdMult: 1.05, range: 125, gather: 0, speed: 700}, {id: 15, type: 1, age: 9, pre: 12, name: "musket", desc: "slow firerate but high damage and range", src: "musket_1", req: ["stone", 10], aboveHand: true, rec: 0.35, armS: 0.6, hndS: 0.3, hndD: 1.6, length: 205, width: 205, xOff: 25, yOff: 0, projectile: 5, hideProjectile: true, spdMult: 0.6, speed: 1500}], e.exports.list = [{group: e.exports.groups[0], name: "apple", desc: "restores 20 health when consumed", req: ["food", 10], consume: function (e) {
        return e.changeHealth(20, e);
    }, scale: 22, holdOffset: 15}, {age: 3, group: e.exports.groups[0], name: "cookie", desc: "restores 40 health when consumed", req: ["food", 15], consume: function (e) {
        return e.changeHealth(40, e);
    }, scale: 27, holdOffset: 15}, {age: 7, group: e.exports.groups[0], name: "cheese", desc: "restores 30 health and another 50 over 5 seconds", req: ["food", 25], consume: function (e) {
        return !!(e.changeHealth(30, e) || e.health < 100) && (e.dmgOverTime.dmg = -10, e.dmgOverTime.doer = e, e.dmgOverTime.time = 5, true);
    }, scale: 27, holdOffset: 15}, {group: e.exports.groups[1], name: "wood wall", desc: "provides protection for your village", req: ["wood", 10], projDmg: true, health: 380, scale: 50, holdOffset: 20, placeOffset: -5}, {age: 3, group: e.exports.groups[1], name: "stone wall", desc: "provides improved protection for your village", req: ["stone", 25], health: 900, scale: 50, holdOffset: 20, placeOffset: -5}, {age: 7, pre: 1, group: e.exports.groups[1], name: "castle wall", desc: "provides powerful protection for your village", req: ["stone", 35], health: 1500, scale: 52, holdOffset: 20, placeOffset: -5}, {group: e.exports.groups[2], name: "spikes", desc: "damages enemies when they touch them", req: ["wood", 20, "stone", 5], health: 400, dmg: 20, scale: 49, spritePadding: -23, holdOffset: 8, placeOffset: -5}, {age: 5, group: e.exports.groups[2], name: "greater spikes", desc: "damages enemies when they touch them", req: ["wood", 30, "stone", 10], health: 500, dmg: 35, scale: 52, spritePadding: -23, holdOffset: 8, placeOffset: -5}, {age: 9, pre: 1, group: e.exports.groups[2], name: "poison spikes", desc: "poisons enemies when they touch them", req: ["wood", 35, "stone", 15], health: 600, dmg: 30, pDmg: 5, scale: 52, spritePadding: -23, holdOffset: 8, placeOffset: -5}, {age: 9, pre: 2, group: e.exports.groups[2], name: "spinning spikes", desc: "damages enemies when they touch them", req: ["wood", 30, "stone", 20], health: 500, dmg: 45, turnSpeed: 0.003, scale: 52, spritePadding: -23, holdOffset: 8, placeOffset: -5}, {group: e.exports.groups[3], name: "windmill", desc: "generates gold over time", req: ["wood", 50, "stone", 10], health: 400, pps: 1, turnSpeed: 0.0016, spritePadding: 25, iconLineMult: 12, scale: 45, holdOffset: 20, placeOffset: 5}, {age: 5, pre: 1, group: e.exports.groups[3], name: "faster windmill", desc: "generates more gold over time", req: ["wood", 60, "stone", 20], health: 500, pps: 1.5, turnSpeed: 0.0025, spritePadding: 25, iconLineMult: 12, scale: 47, holdOffset: 20, placeOffset: 5}, {age: 8, pre: 1, group: e.exports.groups[3], name: "power mill", desc: "generates more gold over time", req: ["wood", 100, "stone", 50], health: 800, pps: 2, turnSpeed: 0.005, spritePadding: 25, iconLineMult: 12, scale: 47, holdOffset: 20, placeOffset: 5}, {age: 5, group: e.exports.groups[4], type: 2, name: "mine", desc: "allows you to mine stone", req: ["wood", 20, "stone", 100], iconLineMult: 12, scale: 65, holdOffset: 20, placeOffset: 0}, {age: 5, group: e.exports.groups[11], type: 0, name: "sapling", desc: "allows you to farm wood", req: ["wood", 150], iconLineMult: 12, colDiv: 0.5, scale: 110, holdOffset: 50, placeOffset: -15}, {age: 4, group: e.exports.groups[5], name: "pit trap", desc: "pit that traps enemies if they walk over it", req: ["wood", 30, "stone", 30], trap: true, ignoreCollision: true, hideFromEnemy: true, health: 500, colDiv: 0.2, scale: 50, holdOffset: 20, placeOffset: -5}, {age: 4, group: e.exports.groups[6], name: "boost pad", desc: "provides boost when stepped on", req: ["stone", 20, "wood", 5], ignoreCollision: true, boostSpeed: 1.5, health: 150, colDiv: 0.7, scale: 45, holdOffset: 20, placeOffset: -5}, {age: 7, group: e.exports.groups[7], doUpdate: true, name: "turret", desc: "defensive structure that shoots at enemies", req: ["wood", 200, "stone", 150], health: 800, projectile: 1, shootRange: 700, shootRate: 2200, scale: 43, holdOffset: 20, placeOffset: -5}, {age: 7, group: e.exports.groups[8], name: "platform", desc: "platform to shoot over walls and cross over water", req: ["wood", 20], ignoreCollision: true, zIndex: 1, health: 300, scale: 43, holdOffset: 20, placeOffset: -5}, {age: 7, group: e.exports.groups[9], name: "healing pad", desc: "standing on it will slowly heal you", req: ["wood", 30, "food", 10], ignoreCollision: true, healCol: 15, health: 400, colDiv: 0.7, scale: 45, holdOffset: 20, placeOffset: -5}, {age: 9, group: e.exports.groups[10], name: "spawn pad", desc: "you will spawn here when you die but it will dissapear", req: ["wood", 100, "stone", 100], health: 400, ignoreCollision: true, spawnPoint: true, scale: 45, holdOffset: 20, placeOffset: -5}, {age: 7, group: e.exports.groups[12], name: "blocker", desc: "blocks building in radius", req: ["wood", 30, "stone", 25], ignoreCollision: true, blocker: 300, health: 400, colDiv: 0.7, scale: 45, holdOffset: 20, placeOffset: -5}, {age: 7, group: e.exports.groups[13], name: "teleporter", desc: "teleports you to a random point on the map", req: ["wood", 60, "stone", 60], ignoreCollision: true, teleport: true, health: 200, colDiv: 0.7, scale: 45, holdOffset: 20, placeOffset: -5}];
    for (var i = 0; i < e.exports.list.length; ++i) e.exports.list[i].id = i, e.exports.list[i].pre && (e.exports.list[i].pre = i - e.exports.list[i].pre);
}, function (e, t) {
    e.exports = {};
}, function (e, t) {
    var i = Math.floor, n = Math.abs, s = Math.cos, o = Math.sin, a = (Math.pow, Math.sqrt);
    e.exports = function (e, t, r, c, l, h) {
        var u, d;
        this.objects = t, this.grids = {}, this.updateObjects = [];
        var f = c.mapScale / c.colGrid;
        this.setObjectGrids = function (e) {
            for (var t = Math.min(c.mapScale, Math.max(0, e.x)), i = Math.min(c.mapScale, Math.max(0, e.y)), n = 0; n < c.colGrid; ++n) {
                u = n * f;
                for (var s = 0; s < c.colGrid; ++s) d = s * f, t + e.scale >= u && t - e.scale <= u + f && i + e.scale >= d && i - e.scale <= d + f && (this.grids[n + "_" + s] || (this.grids[n + "_" + s] = []), this.grids[n + "_" + s].push(e), e.gridLocations.push(n + "_" + s));
            }
        }, this.removeObjGrid = function (e) {
            for (var t, i = 0; i < e.gridLocations.length; ++i) (t = this.grids[e.gridLocations[i]].indexOf(e)) >= 0 && this.grids[e.gridLocations[i]].splice(t, 1);
        }, this.disableObj = function (e) {
            if (e.active = false, h) {
                e.owner && e.pps && (e.owner.pps -= e.pps), this.removeObjGrid(e);
                var t = this.updateObjects.indexOf(e);
                t >= 0 && this.updateObjects.splice(t, 1);
            }
        }, this.hitObj = function (e, t) {
            for (var i = 0; i < l.length; ++i) l[i].active && (e.sentTo[l[i].id] && (e.active ? l[i].canSee(e) && h.send(l[i].id, "8", r.fixTo(t, 1), e.sid) : h.send(l[i].id, "12", e.sid)), e.active || e.owner != l[i] || l[i].changeItemCount(e.group.id, -1));
        };
        var p, g, m = [];
        this.getGridArrays = function (e, t, n) {
            u = i(e / f), d = i(t / f), m.length = 0;
            try {
                this.grids[u + "_" + d] && m.push(this.grids[u + "_" + d]), e + n >= (u + 1) * f && ((p = this.grids[u + 1 + "_" + d]) && m.push(p), d && t - n <= d * f ? (p = this.grids[u + 1 + "_" + (d - 1)]) && m.push(p) : t + n >= (d + 1) * f && (p = this.grids[u + 1 + "_" + (d + 1)]) && m.push(p)), u && e - n <= u * f && ((p = this.grids[u - 1 + "_" + d]) && m.push(p), d && t - n <= d * f ? (p = this.grids[u - 1 + "_" + (d - 1)]) && m.push(p) : t + n >= (d + 1) * f && (p = this.grids[u - 1 + "_" + (d + 1)]) && m.push(p)), t + n >= (d + 1) * f && (p = this.grids[u + "_" + (d + 1)]) && m.push(p), d && t - n <= d * f && (p = this.grids[u + "_" + (d - 1)]) && m.push(p);
            } catch (e) {}
            return m;
        }, this.add = function (i, n, s, o, a, r, c, l, u) {
            g = null;
            for (var d = 0; d < t.length; ++d) if (t[d].sid == i) {
                g = t[d];
                break;
            }
            if (!g) for (d = 0; d < t.length; ++d) if (!t[d].active) {
                g = t[d];
                break;
            }
            g || (g = new e(i), t.push(g)), l && (g.sid = i), g.init(n, s, o, a, r, c, u), h && (this.setObjectGrids(g), g.doUpdate && this.updateObjects.push(g));
        }, this.disableBySid = function (e) {
            for (var i = 0; i < t.length; ++i) if (t[i].sid == e) {
                this.disableObj(t[i]);
                break;
            }
        }, this.removeAllItems = function (e, i) {
            for (var n = 0; n < t.length; ++n) t[n].active && t[n].owner && t[n].owner.sid == e && this.disableObj(t[n]);
            i && i.broadcast("13", e);
        }, this.fetchSpawnObj = function (e) {
            for (var i = null, n = 0; n < t.length; ++n) if ((g = t[n]).active && g.owner && g.owner.sid == e && g.spawnPoint) {
                i = [g.x, g.y], this.disableObj(g), h.broadcast("12", g.sid), g.owner && g.owner.changeItemCount(g.group.id, -1);
                break;
            }
            return i;
        }, this.checkItemLocation = function (e, i, n, s, o, a, l) {
            for (var h = 0; h < t.length; ++h) {
                var u = t[h].blocker ? t[h].blocker : t[h].getScale(s, t[h].isItem);
                if (t[h].active && r.getDistance(e, i, t[h].x, t[h].y) < n + u) return false;
            }
            return !(!a && 18 != o && i >= c.mapScale / 2 - c.riverWidth / 2 && i <= c.mapScale / 2 + c.riverWidth / 2);
        }, this.addProjectile = function (e, t, i, n, s) {
            for (var o, a = items.projectiles[s], c = 0; c < projectiles.length; ++c) if (!projectiles[c].active) {
                o = projectiles[c];
                break;
            }
            o || (o = new Projectile(l, r), projectiles.push(o)), o.init(s, e, t, i, a.speed, n, a.scale);
        }, this.checkCollision = function (e, t, i) {
            i = i || 1;
            var l = e.x - t.x, h = e.y - t.y, u = e.scale + t.scale;
            if (n(l) <= u || n(h) <= u) {
                u = e.scale + (t.getScale ? t.getScale() : t.scale);
                var d = a(l * l + h * h) - u;
                if (d <= 0) {
                    if (t.ignoreCollision) !t.trap || e.noTrap || t.owner == e || t.owner && t.owner.team && t.owner.team == e.team ? t.boostSpeed ? (e.xVel += i * t.boostSpeed * (t.weightM || 1) * s(t.dir), e.yVel += i * t.boostSpeed * (t.weightM || 1) * o(t.dir)) : t.healCol ? e.healCol = t.healCol : t.teleport && (e.x = r.randInt(0, c.mapScale), e.y = r.randInt(0, c.mapScale)) : (e.lockMove = true, t.hideFromEnemy = false); else {
                        var f = r.getDirection(e.x, e.y, t.x, t.y);
                        if (r.getDistance(e.x, e.y, t.x, t.y), t.isPlayer ? (d = -1 * d / 2, e.x += d * s(f), e.y += d * o(f), t.x -= d * s(f), t.y -= d * o(f)) : (e.x = t.x + u * s(f), e.y = t.y + u * o(f), e.xVel *= 0.75, e.yVel *= 0.75), t.dmg && t.owner != e && (!t.owner || !t.owner.team || t.owner.team != e.team)) {
                            e.changeHealth(-t.dmg, t.owner, t);
                            var p = 1.5 * (t.weightM || 1);
                            e.xVel += p * s(f), e.yVel += p * o(f), !t.pDmg || e.skin && e.skin.poisonRes || (e.dmgOverTime.dmg = t.pDmg, e.dmgOverTime.time = 5, e.dmgOverTime.doer = t.owner), e.colDmg && t.health && (t.changeHealth(-e.colDmg) && this.disableObj(t), this.hitObj(t, r.getDirection(e.x, e.y, t.x, t.y)));
                        }
                    }
                    return t.zIndex > e.zIndex && (e.zIndex = t.zIndex), true;
                }
            }
            return false;
        };
    };
}, function (e, t, i) {
    var n = new (i(13));
    n.addWords("jew", "black", "baby", "child", "white", "porn", "pedo", "trump", "clinton", "hitler", "nazi", "gay", "pride", "sex", "pleasure", "touch", "poo", "kids", "rape", "white power", "nigga", "nig nog", "doggy", "rapist", "boner", "nigger", "nigg", "finger", "nogger", "nagger", "nig", "fag", "gai", "pole", "stripper", "penis", "vagina", "pussy", "nazi", "hitler", "stalin", "burn", "chamber", "cock", "peen", "dick", "spick", "nieger", "die", "satan", "n|ig", "nlg", "cunt", "c0ck", "fag", "lick", "condom", "anal", "shit", "phile", "little", "kids", "free KR", "tiny", "sidney", "ass", "kill", ".io", "(dot)", "[dot]", "mini", "whiore", "whore", "faggot", "github", "1337", "666", "satan", "senpa", "discord", "d1scord", "mistik", ".io", "senpa.io", "sidney", "sid", "senpaio", "vries", "asa");
    var s = Math.abs, o = Math.cos, a = Math.sin, r = Math.pow, c = Math.sqrt;
    e.exports = function (e, t, i, l, h, u, d, f, p, g, m, y, k, w) {
        this.id = e, this.sid = t, this.tmpScore = 0, this.team = null, this.skinIndex = 0, this.tailIndex = 0, this.hitTime = 0, this.tails = {};
        for (var v = 0; v < m.length; ++v) m[v].price <= 0 && (this.tails[m[v].id] = 1);
        for (this.skins = {}, v = 0; v < g.length; ++v) g[v].price <= 0 && (this.skins[g[v].id] = 1);
        this.points = 0, this.dt = 0, this.hidden = false, this.itemCounts = {}, this.isPlayer = true, this.pps = 0, this.moveDir = void 0, this.skinRot = 0, this.lastPing = 0, this.iconIndex = 0, this.skinColor = 0, this.spawn = function (e) {
            this.active = true, this.alive = true, this.lockMove = false, this.lockDir = false, this.minimapCounter = 0, this.chatCountdown = 0, this.shameCount = 0, this.shameTimer = 0, this.sentTo = {}, this.gathering = 0, this.autoGather = 0, this.animTime = 0, this.animSpeed = 0, this.mouseState = 0, this.buildIndex = -1, this.weaponIndex = 0, this.dmgOverTime = {}, this.noMovTimer = 0, this.maxXP = 300, this.XP = 0, this.age = 1, this.kills = 0, this.upgrAge = 2, this.upgradePoints = 0, this.x = 0, this.y = 0, this.zIndex = 0, this.xVel = 0, this.yVel = 0, this.slowMult = 1, this.dir = 0, this.dirPlus = 0, this.targetDir = 0, this.targetAngle = 0, this.maxHealth = 100, this.health = this.maxHealth, this.scale = i.playerScale, this.speed = i.playerSpeed, this.resetMoveDir(), this.resetResources(e), this.items = [0, 3, 6, 10], this.weapons = [0], this.shootCount = 0, this.weaponXP = [], this.reloads = {};
        }, this.resetMoveDir = function () {
            this.moveDir = void 0;
        }, this.resetResources = function (e) {
            for (var t = 0; t < i.resourceTypes.length; ++t) this[i.resourceTypes[t]] = e ? 100 : 0;
        }, this.addItem = function (e) {
            var t = p.list[e];
            if (t) {
                for (var i = 0; i < this.items.length; ++i) if (p.list[this.items[i]].group == t.group) return this.buildIndex == this.items[i] && (this.buildIndex = e), this.items[i] = e, true;
                return this.items.push(e), true;
            }
            return false;
        }, this.setUserData = function (e) {
            if (e) {
                this.name = "unknown";
                var t = e.name + "", s = false, o = (t = (t = (t = (t = t.slice(0, i.maxNameLength)).replace(/[^\w:\(\)\/? -]+/gim, " ")).replace(/[^\x00-\x7F]/g, " ")).trim()).toLowerCase().replace(/\s/g, "").replace(/1/g, "i").replace(/0/g, "o").replace(/5/g, "s");
                for (var a of n.list) if (-1 != o.indexOf(a)) {
                    s = true;
                    break;
                }
                t.length > 0 && !s && (this.name = t), this.skinColor = 0, i.skinColors[e.skin] && (this.skinColor = e.skin);
            }
        }, this.getData = function () {
            return [this.id, this.sid, this.name, l.fixTo(this.x, 2), l.fixTo(this.y, 2), l.fixTo(this.dir, 3), this.health, this.maxHealth, this.scale, this.skinColor];
        }, this.setData = function (e) {
            this.id = e[0], this.sid = e[1], this.name = e[2], this.x = e[3], this.y = e[4], this.dir = e[5], this.health = e[6], this.maxHealth = e[7], this.scale = e[8], this.skinColor = e[9];
        };
        var b = 0;
        this.update = function (e) {
            if (this.alive) {
                if (this.shameTimer > 0 && (this.shameTimer -= e, this.shameTimer <= 0 && (this.shameTimer = 0, this.shameCount = 0)), (b -= e) <= 0) {
                    var t = (this.skin && this.skin.healthRegen ? this.skin.healthRegen : 0) + (this.tail && this.tail.healthRegen ? this.tail.healthRegen : 0);
                    t && this.changeHealth(t, this), this.dmgOverTime.dmg && (this.changeHealth(-this.dmgOverTime.dmg, this.dmgOverTime.doer), this.dmgOverTime.time -= 1, this.dmgOverTime.time <= 0 && (this.dmgOverTime.dmg = 0)), this.healCol && this.changeHealth(this.healCol, this), b = 1e3;
                }
                if (this.alive) {
                    if (this.slowMult < 1 && (this.slowMult += 0.0008 * e, this.slowMult > 1 && (this.slowMult = 1)), this.noMovTimer += e, (this.xVel || this.yVel) && (this.noMovTimer = 0), this.lockMove) this.xVel = 0, this.yVel = 0; else {
                        var n = (this.buildIndex >= 0 ? 0.5 : 1) * (p.weapons[this.weaponIndex].spdMult || 1) * (this.skin && this.skin.spdMult || 1) * (this.tail && this.tail.spdMult || 1) * (this.y <= i.snowBiomeTop ? this.skin && this.skin.coldM ? 1 : i.snowSpeed : 1) * this.slowMult;
                        !this.zIndex && this.y >= i.mapScale / 2 - i.riverWidth / 2 && this.y <= i.mapScale / 2 + i.riverWidth / 2 && (this.skin && this.skin.watrImm ? (n *= 0.75, this.xVel += 0.4 * i.waterCurrent * e) : (n *= 0.33, this.xVel += i.waterCurrent * e));
                        var s = null != this.moveDir ? o(this.moveDir) : 0, f = null != this.moveDir ? a(this.moveDir) : 0, g = c(s * s + f * f);
                        0 != g && (s /= g, f /= g), s && (this.xVel += s * this.speed * n * e), f && (this.yVel += f * this.speed * n * e);
                    }
                    var m;
                    this.zIndex = 0, this.lockMove = false, this.healCol = 0;
                    for (var y = l.getDistance(0, 0, this.xVel * e, this.yVel * e), k = Math.min(4, Math.max(1, Math.round(y / 40))), w = 1 / k, v = {}, x = 0; x < k; ++x) {
                        this.xVel && (this.x += this.xVel * e * w), this.yVel && (this.y += this.yVel * e * w), m = u.getGridArrays(this.x, this.y, this.scale);
                        for (var S = 0; S < m.length; ++S) {
                            for (var I = 0; I < m[S].length && (!m[S][I].active || v[m[S][I].sid] || !u.checkCollision(this, m[S][I], w) || (v[m[S][I].sid] = true, this.alive)); ++I) ;
                            if (!this.alive) break;
                        }
                        if (!this.alive) break;
                    }
                    for (x = (M = d.indexOf(this)) + 1; x < d.length; ++x) d[x] != this && d[x].alive && u.checkCollision(this, d[x]);
                    if (this.xVel && (this.xVel *= r(i.playerDecel, e), this.xVel <= 0.01 && this.xVel >= -0.01 && (this.xVel = 0)), this.yVel && (this.yVel *= r(i.playerDecel, e), this.yVel <= 0.01 && this.yVel >= -0.01 && (this.yVel = 0)), this.x - this.scale < 0 ? this.x = this.scale : this.x + this.scale > i.mapScale && (this.x = i.mapScale - this.scale), this.y - this.scale < 0 ? this.y = this.scale : this.y + this.scale > i.mapScale && (this.y = i.mapScale - this.scale), this.buildIndex < 0) if (this.reloads[this.weaponIndex] > 0) this.reloads[this.weaponIndex] -= e, this.gathering = this.mouseState; else if (this.gathering || this.autoGather) {
                        var T = true;
                        if (null != p.weapons[this.weaponIndex].gather) this.gather(d); else if (null != p.weapons[this.weaponIndex].projectile && this.hasRes(p.weapons[this.weaponIndex], this.skin ? this.skin.projCost : 0)) {
                            this.useRes(p.weapons[this.weaponIndex], this.skin ? this.skin.projCost : 0), this.noMovTimer = 0;
                            var M = p.weapons[this.weaponIndex].projectile, C = 2 * this.scale, P = this.skin && this.skin.aMlt ? this.skin.aMlt : 1;
                            p.weapons[this.weaponIndex].rec && (this.xVel -= p.weapons[this.weaponIndex].rec * o(this.dir), this.yVel -= p.weapons[this.weaponIndex].rec * a(this.dir)), h.addProjectile(this.x + C * o(this.dir), this.y + C * a(this.dir), this.dir, p.projectiles[M].range * P, p.projectiles[M].speed * P, M, this, null, this.zIndex);
                        } else T = false;
                        this.gathering = this.mouseState, T && (this.reloads[this.weaponIndex] = p.weapons[this.weaponIndex].speed * (this.skin && this.skin.atkSpd || 1));
                    }
                }
            }
        }, this.addWeaponXP = function (e) {
            this.weaponXP[this.weaponIndex] || (this.weaponXP[this.weaponIndex] = 0), this.weaponXP[this.weaponIndex] += e;
        }, this.earnXP = function (e) {
            this.age < i.maxAge && (this.XP += e, this.XP >= this.maxXP ? (this.age < i.maxAge ? (this.age++, this.XP = 0, this.maxXP *= 1.2) : this.XP = this.maxXP, this.upgradePoints++, y.send(this.id, "16", this.upgradePoints, this.upgrAge), y.send(this.id, "15", this.XP, l.fixTo(this.maxXP, 1), this.age)) : y.send(this.id, "15", this.XP));
        }, this.changeHealth = function (e, t) {
            if (e > 0 && this.health >= this.maxHealth) return false;
            e < 0 && this.skin && (e *= this.skin.dmgMult || 1), e < 0 && this.tail && (e *= this.tail.dmgMult || 1), e < 0 && (this.hitTime = Date.now()), this.health += e, this.health > this.maxHealth && (e -= this.health - this.maxHealth, this.health = this.maxHealth), this.health <= 0 && this.kill(t);
            for (var i = 0; i < d.length; ++i) this.sentTo[d[i].id] && y.send(d[i].id, "h", this.sid, this.health);
            return !t || !t.canSee(this) || t == this && e < 0 || y.send(t.id, "t", Math.round(this.x), Math.round(this.y), Math.round(-e), 1), true;
        }, this.kill = function (e) {
            e && e.alive && (e.kills++, e.skin && e.skin.goldSteal ? k(e, Math.round(this.points / 2)) : k(e, Math.round(100 * this.age * (e.skin && e.skin.kScrM ? e.skin.kScrM : 1))), y.send(e.id, "9", "kills", e.kills, 1)), this.alive = false, y.send(this.id, "11"), w();
        }, this.addResource = function (e, t, n) {
            !n && t > 0 && this.addWeaponXP(t), 3 == e ? k(this, t, true) : (this[i.resourceTypes[e]] += t, y.send(this.id, "9", i.resourceTypes[e], this[i.resourceTypes[e]], 1));
        }, this.changeItemCount = function (e, t) {
            this.itemCounts[e] = this.itemCounts[e] || 0, this.itemCounts[e] += t, y.send(this.id, "14", e, this.itemCounts[e]);
        }, this.buildItem = function (e) {
            var t = this.scale + e.scale + (e.placeOffset || 0), i = this.x + t * o(this.dir), n = this.y + t * a(this.dir);
            if (this.canBuild(e) && !(e.consume && this.skin && this.skin.noEat) && (e.consume || u.checkItemLocation(i, n, e.scale, 0.6, e.id, false, this))) {
                var s = false;
                if (e.consume) {
                    if (this.hitTime) {
                        var r = Date.now() - this.hitTime;
                        this.hitTime = 0, r <= 120 ? (this.shameCount++, this.shameCount >= 8 && (this.shameTimer = 3e4, this.shameCount = 0)) : (this.shameCount -= 2, this.shameCount <= 0 && (this.shameCount = 0));
                    }
                    this.shameTimer <= 0 && (s = e.consume(this));
                } else s = true, e.group.limit && this.changeItemCount(e.group.id, 1), e.pps && (this.pps += e.pps), u.add(u.objects.length, i, n, this.dir, e.scale, e.type, e, false, this);
                s && (this.useRes(e), this.buildIndex = -1);
            }
        }, this.hasRes = function (e, t) {
            for (var i = 0; i < e.req.length;) {
                if (this[e.req[i]] < Math.round(e.req[i + 1] * (t || 1))) return false;
                i += 2;
            }
            return true;
        }, this.useRes = function (e, t) {
            if (!i.inSandbox) for (var n = 0; n < e.req.length;) this.addResource(i.resourceTypes.indexOf(e.req[n]), -Math.round(e.req[n + 1] * (t || 1))), n += 2;
        }, this.canBuild = function (e) {
            var t = i.inSandbox ? Math.max(3 * e.group.limit, 99) : e.group.limit;
            return !(t && this.itemCounts[e.group.id] >= t) && (!!i.inSandbox || this.hasRes(e));
        }, this.gather = function () {
            this.noMovTimer = 0, this.slowMult -= p.weapons[this.weaponIndex].hitSlow || 0.3, this.slowMult < 0 && (this.slowMult = 0);
            for (var e, t, n, s = i.fetchVariant(this), r = s.poison, c = s.val, h = {}, g = u.getGridArrays(this.x, this.y, p.weapons[this.weaponIndex].range), m = 0; m < g.length; ++m) for (var y = 0; y < g[m].length; ++y) if ((t = g[m][y]).active && !t.dontGather && !h[t.sid] && t.visibleToPlayer(this) && l.getDistance(this.x, this.y, t.x, t.y) - t.scale <= p.weapons[this.weaponIndex].range && (e = l.getDirection(t.x, t.y, this.x, this.y), l.getAngleDist(e, this.dir) <= i.gatherAngle)) {
                if (h[t.sid] = 1, t.health) {
                    if (t.changeHealth(-p.weapons[this.weaponIndex].dmg * c * (p.weapons[this.weaponIndex].sDmg || 1) * (this.skin && this.skin.bDmg ? this.skin.bDmg : 1), this)) {
                        for (var k = 0; k < t.req.length;) this.addResource(i.resourceTypes.indexOf(t.req[k]), t.req[k + 1]), k += 2;
                        u.disableObj(t);
                    }
                } else {
                    this.earnXP(4 * p.weapons[this.weaponIndex].gather);
                    var w = p.weapons[this.weaponIndex].gather + (3 == t.type ? 4 : 0);
                    this.skin && this.skin.extraGold && this.addResource(3, 1), this.addResource(t.type, w);
                }
                n = true, u.hitObj(t, e);
            }
            for (y = 0; y < d.length + f.length; ++y) if ((t = d[y] || f[y - d.length]) != this && t.alive && (!t.team || t.team != this.team) && l.getDistance(this.x, this.y, t.x, t.y) - 1.8 * t.scale <= p.weapons[this.weaponIndex].range && (e = l.getDirection(t.x, t.y, this.x, this.y), l.getAngleDist(e, this.dir) <= i.gatherAngle)) {
                var v = p.weapons[this.weaponIndex].steal;
                v && t.addResource && (v = Math.min(t.points || 0, v), this.addResource(3, v), t.addResource(3, -v));
                var b = c;
                null != t.weaponIndex && p.weapons[t.weaponIndex].shield && l.getAngleDist(e + Math.PI, t.dir) <= i.shieldAngle && (b = p.weapons[t.weaponIndex].shield);
                var x = p.weapons[this.weaponIndex].dmg, S = x * (this.skin && this.skin.dmgMultO ? this.skin.dmgMultO : 1) * (this.tail && this.tail.dmgMultO ? this.tail.dmgMultO : 1), I = 0.3 * (t.weightM || 1) + (p.weapons[this.weaponIndex].knock || 0);
                t.xVel += I * o(e), t.yVel += I * a(e), this.skin && this.skin.healD && this.changeHealth(S * b * this.skin.healD, this), this.tail && this.tail.healD && this.changeHealth(S * b * this.tail.healD, this), t.skin && t.skin.dmg && this.changeHealth(-x * t.skin.dmg, t), t.tail && t.tail.dmg && this.changeHealth(-x * t.tail.dmg, t), !(t.dmgOverTime && this.skin && this.skin.poisonDmg) || t.skin && t.skin.poisonRes || (t.dmgOverTime.dmg = this.skin.poisonDmg, t.dmgOverTime.time = this.skin.poisonTime || 1, t.dmgOverTime.doer = this), !t.dmgOverTime || !r || t.skin && t.skin.poisonRes || (t.dmgOverTime.dmg = 5, t.dmgOverTime.time = 5, t.dmgOverTime.doer = this), t.skin && t.skin.dmgK && (this.xVel -= t.skin.dmgK * o(e), this.yVel -= t.skin.dmgK * a(e)), t.changeHealth(-S * b, this, this);
            }
            this.sendAnimation(n ? 1 : 0);
        }, this.sendAnimation = function (e) {
            for (var t = 0; t < d.length; ++t) this.sentTo[d[t].id] && this.canSee(d[t]) && y.send(d[t].id, "7", this.sid, e ? 1 : 0, this.weaponIndex);
        };
        var x = 0, S = 0;
        this.animate = function (e) {
            this.animTime > 0 && (this.animTime -= e, this.animTime <= 0 ? (this.animTime = 0, this.dirPlus = 0, x = 0, S = 0) : 0 == S ? (x += e / (this.animSpeed * i.hitReturnRatio), this.dirPlus = l.lerp(0, this.targetAngle, Math.min(1, x)), x >= 1 && (x = 1, S = 1)) : (x -= e / (this.animSpeed * (1 - i.hitReturnRatio)), this.dirPlus = l.lerp(0, this.targetAngle, Math.max(0, x))));
        }, this.startAnim = function (e, t) {
            this.animTime = this.animSpeed = p.weapons[t].speed, this.targetAngle = e ? -i.hitAngle : -Math.PI, x = 0, S = 0;
        }, this.canSee = function (e) {
            if (!e) return false;
            if (e.skin && e.skin.invisTimer && e.noMovTimer >= e.skin.invisTimer) return false;
            var t = s(e.x - this.x) - e.scale, n = s(e.y - this.y) - e.scale;
            return t <= i.maxScreenWidth / 2 * 1.3 && n <= i.maxScreenHeight / 2 * 1.3;
        };
    };
}, function (e, t, i) {
    const n = i(14).words, s = i(15).array;
    e.exports = class {
        constructor(e = {}) {
            Object.assign(this, {list: e.emptyList && [] || Array.prototype.concat.apply(n, [s, e.list || []]), exclude: e.exclude || [], placeHolder: e.placeHolder || "*", regex: e.regex || /[^a-zA-Z0-9|\$|\@]|\^/g, replaceRegex: e.replaceRegex || /\w/g});
        }
        isProfane(e) {
            return this.list.filter(t => {
                const i = new RegExp(`\\b${t.replace(/(\W)/g, "\\$1")}\\b`, "gi");
                return !this.exclude.includes(t.toLowerCase()) && i.test(e);
            }).length > 0 || false;
        }
        replaceWord(e) {
            return e.replace(this.regex, "").replace(this.replaceRegex, this.placeHolder);
        }
        clean(e) {
            return e.split(/\b/).map(e => this.isProfane(e) ? this.replaceWord(e) : e).join("");
        }
        addWords() {
            let e = Array.from(arguments);
            this.list.push(...e), e.map(e => e.toLowerCase()).forEach(e => {
                this.exclude.includes(e) && this.exclude.splice(this.exclude.indexOf(e), 1);
            });
        }
        removeWords() {
            this.exclude.push(...Array.from(arguments).map(e => e.toLowerCase()));
        }
    };
}, function (e) {
    e.exports = {words: ["ahole", "anus", "ash0le", "ash0les", "asholes", "ass", "Ass Monkey", "Assface", "assh0le", "assh0lez", "asshole", "assholes", "assholz", "asswipe", "azzhole", "bassterds", "bastard", "bastards", "bastardz", "basterds", "basterdz", "Biatch", "bitch", "bitches", "Blow Job", "boffing", "butthole", "buttwipe", "c0ck", "c0cks", "c0k", "Carpet Muncher", "cawk", "cawks", "Clit", "cnts", "cntz", "cock", "cockhead", "cock-head", "cocks", "CockSucker", "cock-sucker", "crap", "cum", "cunt", "cunts", "cuntz", "dick", "dild0", "dild0s", "dildo", "dildos", "dilld0", "dilld0s", "dominatricks", "dominatrics", "dominatrix", "dyke", "enema", "f u c k", "f u c k e r", "fag", "fag1t", "faget", "fagg1t", "faggit", "faggot", "fagg0t", "fagit", "fags", "fagz", "faig", "faigs", "fart", "flipping the bird", "fuck", "fucker", "fuckin", "fucking", "fucks", "Fudge Packer", "fuk", "Fukah", "Fuken", "fuker", "Fukin", "Fukk", "Fukkah", "Fukken", "Fukker", "Fukkin", "g00k", "God-damned", "h00r", "h0ar", "h0re", "hells", "hoar", "hoor", "hoore", "jackoff", "jap", "japs", "jerk-off", "jisim", "jiss", "jizm", "jizz", "knob", "knobs", "knobz", "kunt", "kunts", "kuntz", "Lezzian", "Lipshits", "Lipshitz", "masochist", "masokist", "massterbait", "masstrbait", "masstrbate", "masterbaiter", "masterbate", "masterbates", "Motha Fucker", "Motha Fuker", "Motha Fukkah", "Motha Fukker", "Mother Fucker", "Mother Fukah", "Mother Fuker", "Mother Fukkah", "Mother Fukker", "mother-fucker", "Mutha Fucker", "Mutha Fukah", "Mutha Fuker", "Mutha Fukkah", "Mutha Fukker", "n1gr", "nastt", "nigger;", "nigur;", "niiger;", "niigr;", "orafis", "orgasim;", "orgasm", "orgasum", "oriface", "orifice", "orifiss", "packi", "packie", "packy", "paki", "pakie", "paky", "pecker", "peeenus", "peeenusss", "peenus", "peinus", "pen1s", "penas", "penis", "penis-breath", "penus", "penuus", "Phuc", "Phuck", "Phuk", "Phuker", "Phukker", "polac", "polack", "polak", "Poonani", "pr1c", "pr1ck", "pr1k", "pusse", "pussee", "pussy", "puuke", "puuker", "queer", "queers", "queerz", "qweers", "qweerz", "qweir", "recktum", "rectum", "retard", "sadist", "scank", "schlong", "screwing", "semen", "sex", "sexy", "Sh!t", "sh1t", "sh1ter", "sh1ts", "sh1tter", "sh1tz", "shit", "shits", "shitter", "Shitty", "Shity", "shitz", "Shyt", "Shyte", "Shytty", "Shyty", "skanck", "skank", "skankee", "skankey", "skanks", "Skanky", "slag", "slut", "sluts", "Slutty", "slutz", "son-of-a-bitch", "tit", "turd", "va1jina", "vag1na", "vagiina", "vagina", "vaj1na", "vajina", "vullva", "vulva", "w0p", "wh00r", "wh0re", "whore", "xrated", "xxx", "b!+ch", "bitch", "blowjob", "clit", "arschloch", "fuck", "shit", "ass", "asshole", "b!tch", "b17ch", "b1tch", "bastard", "bi+ch", "boiolas", "buceta", "c0ck", "cawk", "chink", "cipa", "clits", "cock", "cum", "cunt", "dildo", "dirsa", "ejakulate", "fatass", "fcuk", "fuk", "fux0r", "hoer", "hore", "jism", "kawk", "l3itch", "l3i+ch", "lesbian", "masturbate", "masterbat*", "masterbat3", "motherfucker", "s.o.b.", "mofo", "nazi", "nigga", "nigger", "nutsack", "phuck", "pimpis", "pusse", "pussy", "scrotum", "sh!t", "shemale", "shi+", "sh!+", "slut", "smut", "teets", "tits", "boobs", "b00bs", "teez", "testical", "testicle", "titt", "w00se", "jackoff", "wank", "whoar", "whore", "*damn", "*dyke", "*fuck*", "*shit*", "@$$", "amcik", "andskota", "arse*", "assrammer", "ayir", "bi7ch", "bitch*", "bollock*", "breasts", "butt-pirate", "cabron", "cazzo", "chraa", "chuj", "Cock*", "cunt*", "d4mn", "daygo", "dego", "dick*", "dike*", "dupa", "dziwka", "ejackulate", "Ekrem*", "Ekto", "enculer", "faen", "fag*", "fanculo", "fanny", "feces", "feg", "Felcher", "ficken", "fitt*", "Flikker", "foreskin", "Fotze", "Fu(*", "fuk*", "futkretzn", "gook", "guiena", "h0r", "h4x0r", "hell", "helvete", "hoer*", "honkey", "Huevon", "hui", "injun", "jizz", "kanker*", "kike", "klootzak", "kraut", "knulle", "kuk", "kuksuger", "Kurac", "kurwa", "kusi*", "kyrpa*", "lesbo", "mamhoon", "masturbat*", "merd*", "mibun", "monkleigh", "mouliewop", "muie", "mulkku", "muschi", "nazis", "nepesaurio", "nigger*", "orospu", "paska*", "perse", "picka", "pierdol*", "pillu*", "pimmel", "piss*", "pizda", "poontsee", "poop", "porn", "p0rn", "pr0n", "preteen", "pula", "pule", "puta", "puto", "qahbeh", "queef*", "rautenberg", "schaffer", "scheiss*", "schlampe", "schmuck", "screw", "sh!t*", "sharmuta", "sharmute", "shipal", "shiz", "skribz", "skurwysyn", "sphencter", "spic", "spierdalaj", "splooge", "suka", "b00b*", "testicle*", "titt*", "twat", "vittu", "wank*", "wetback*", "wichser", "wop*", "yed", "zabourah"]};
}, function (e, t, i) {
    e.exports = {object: i(16), array: i(17), regex: i(18)};
}, function (e, t) {
    e.exports = {"4r5e": 1, "5h1t": 1, "5hit": 1, a55: 1, anal: 1, anus: 1, ar5e: 1, arrse: 1, arse: 1, ass: 1, "ass-fucker": 1, asses: 1, assfucker: 1, assfukka: 1, asshole: 1, assholes: 1, asswhole: 1, a_s_s: 1, "b!tch": 1, b00bs: 1, b17ch: 1, b1tch: 1, ballbag: 1, balls: 1, ballsack: 1, bastard: 1, beastial: 1, beastiality: 1, bellend: 1, bestial: 1, bestiality: 1, "bi+ch": 1, biatch: 1, bitch: 1, bitcher: 1, bitchers: 1, bitches: 1, bitchin: 1, bitching: 1, bloody: 1, "blow job": 1, blowjob: 1, blowjobs: 1, boiolas: 1, bollock: 1, bollok: 1, boner: 1, boob: 1, boobs: 1, booobs: 1, boooobs: 1, booooobs: 1, booooooobs: 1, breasts: 1, buceta: 1, bugger: 1, bum: 1, "bunny fucker": 1, butt: 1, butthole: 1, buttmuch: 1, buttplug: 1, c0ck: 1, c0cksucker: 1, "carpet muncher": 1, cawk: 1, chink: 1, cipa: 1, cl1t: 1, clit: 1, clitoris: 1, clits: 1, cnut: 1, cock: 1, "cock-sucker": 1, cockface: 1, cockhead: 1, cockmunch: 1, cockmuncher: 1, cocks: 1, cocksuck: 1, cocksucked: 1, cocksucker: 1, cocksucking: 1, cocksucks: 1, cocksuka: 1, cocksukka: 1, cok: 1, cokmuncher: 1, coksucka: 1, coon: 1, cox: 1, crap: 1, cum: 1, cummer: 1, cumming: 1, cums: 1, cumshot: 1, cunilingus: 1, cunillingus: 1, cunnilingus: 1, cunt: 1, cuntlick: 1, cuntlicker: 1, cuntlicking: 1, cunts: 1, cyalis: 1, cyberfuc: 1, cyberfuck: 1, cyberfucked: 1, cyberfucker: 1, cyberfuckers: 1, cyberfucking: 1, d1ck: 1, damn: 1, dick: 1, dickhead: 1, dildo: 1, dildos: 1, dink: 1, dinks: 1, dirsa: 1, dlck: 1, "dog-fucker": 1, doggin: 1, dogging: 1, donkeyribber: 1, doosh: 1, duche: 1, dyke: 1, ejaculate: 1, ejaculated: 1, ejaculates: 1, ejaculating: 1, ejaculatings: 1, ejaculation: 1, ejakulate: 1, "f u c k": 1, "f u c k e r": 1, f4nny: 1, fag: 1, fagging: 1, faggitt: 1, faggot: 1, faggs: 1, fagot: 1, fagots: 1, fags: 1, fanny: 1, fannyflaps: 1, fannyfucker: 1, fanyy: 1, fatass: 1, fcuk: 1, fcuker: 1, fcuking: 1, feck: 1, fecker: 1, felching: 1, fellate: 1, fellatio: 1, fingerfuck: 1, fingerfucked: 1, fingerfucker: 1, fingerfuckers: 1, fingerfucking: 1, fingerfucks: 1, fistfuck: 1, fistfucked: 1, fistfucker: 1, fistfuckers: 1, fistfucking: 1, fistfuckings: 1, fistfucks: 1, flange: 1, fook: 1, fooker: 1, fuck: 1, fucka: 1, fucked: 1, fucker: 1, fuckers: 1, fuckhead: 1, fuckheads: 1, fuckin: 1, fucking: 1, fuckings: 1, fuckingshitmotherfucker: 1, fuckme: 1, fucks: 1, fuckwhit: 1, fuckwit: 1, "fudge packer": 1, fudgepacker: 1, fuk: 1, fuker: 1, fukker: 1, fukkin: 1, fuks: 1, fukwhit: 1, fukwit: 1, fux: 1, fux0r: 1, f_u_c_k: 1, gangbang: 1, gangbanged: 1, gangbangs: 1, gaylord: 1, gaysex: 1, goatse: 1, God: 1, "god-dam": 1, "god-damned": 1, goddamn: 1, goddamned: 1, hardcoresex: 1, hell: 1, heshe: 1, hoar: 1, hoare: 1, hoer: 1, homo: 1, hore: 1, horniest: 1, horny: 1, hotsex: 1, "jack-off": 1, jackoff: 1, jap: 1, "jerk-off": 1, jism: 1, jiz: 1, jizm: 1, jizz: 1, kawk: 1, knob: 1, knobead: 1, knobed: 1, knobend: 1, knobhead: 1, knobjocky: 1, knobjokey: 1, kock: 1, kondum: 1, kondums: 1, kum: 1, kummer: 1, kumming: 1, kums: 1, kunilingus: 1, "l3i+ch": 1, l3itch: 1, labia: 1, lust: 1, lusting: 1, m0f0: 1, m0fo: 1, m45terbate: 1, ma5terb8: 1, ma5terbate: 1, masochist: 1, "master-bate": 1, masterb8: 1, "masterbat*": 1, masterbat3: 1, masterbate: 1, masterbation: 1, masterbations: 1, masturbate: 1, "mo-fo": 1, mof0: 1, mofo: 1, mothafuck: 1, mothafucka: 1, mothafuckas: 1, mothafuckaz: 1, mothafucked: 1, mothafucker: 1, mothafuckers: 1, mothafuckin: 1, mothafucking: 1, mothafuckings: 1, mothafucks: 1, "mother fucker": 1, motherfuck: 1, motherfucked: 1, motherfucker: 1, motherfuckers: 1, motherfuckin: 1, motherfucking: 1, motherfuckings: 1, motherfuckka: 1, motherfucks: 1, muff: 1, mutha: 1, muthafecker: 1, muthafuckker: 1, muther: 1, mutherfucker: 1, n1gga: 1, n1gger: 1, nazi: 1, nigg3r: 1, nigg4h: 1, nigga: 1, niggah: 1, niggas: 1, niggaz: 1, nigger: 1, niggers: 1, nob: 1, "nob jokey": 1, nobhead: 1, nobjocky: 1, nobjokey: 1, numbnuts: 1, nutsack: 1, orgasim: 1, orgasims: 1, orgasm: 1, orgasms: 1, p0rn: 1, pawn: 1, pecker: 1, penis: 1, penisfucker: 1, phonesex: 1, phuck: 1, phuk: 1, phuked: 1, phuking: 1, phukked: 1, phukking: 1, phuks: 1, phuq: 1, pigfucker: 1, pimpis: 1, piss: 1, pissed: 1, pisser: 1, pissers: 1, pisses: 1, pissflaps: 1, pissin: 1, pissing: 1, pissoff: 1, poop: 1, porn: 1, porno: 1, pornography: 1, pornos: 1, prick: 1, pricks: 1, pron: 1, pube: 1, pusse: 1, pussi: 1, pussies: 1, pussy: 1, pussys: 1, rectum: 1, retard: 1, rimjaw: 1, rimming: 1, "s hit": 1, "s.o.b.": 1, sadist: 1, schlong: 1, screwing: 1, scroat: 1, scrote: 1, scrotum: 1, semen: 1, sex: 1, "sh!+": 1, "sh!t": 1, sh1t: 1, shag: 1, shagger: 1, shaggin: 1, shagging: 1, shemale: 1, "shi+": 1, shit: 1, shitdick: 1, shite: 1, shited: 1, shitey: 1, shitfuck: 1, shitfull: 1, shithead: 1, shiting: 1, shitings: 1, shits: 1, shitted: 1, shitter: 1, shitters: 1, shitting: 1, shittings: 1, shitty: 1, skank: 1, slut: 1, sluts: 1, smegma: 1, smut: 1, snatch: 1, "son-of-a-bitch": 1, spac: 1, spunk: 1, s_h_i_t: 1, t1tt1e5: 1, t1tties: 1, teets: 1, teez: 1, testical: 1, testicle: 1, tit: 1, titfuck: 1, tits: 1, titt: 1, tittie5: 1, tittiefucker: 1, titties: 1, tittyfuck: 1, tittywank: 1, titwank: 1, tosser: 1, turd: 1, tw4t: 1, twat: 1, twathead: 1, twatty: 1, twunt: 1, twunter: 1, v14gra: 1, v1gra: 1, vagina: 1, viagra: 1, vulva: 1, w00se: 1, wang: 1, wank: 1, wanker: 1, wanky: 1, whoar: 1, whore: 1, willies: 1, willy: 1, xrated: 1, xxx: 1};
}, function (e, t) {
    e.exports = ["4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "ass-fucker", "asses", "assfucker", "assfukka", "asshole", "assholes", "asswhole", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "balls", "ballsack", "bastard", "beastial", "beastiality", "bellend", "bestial", "bestiality", "bi+ch", "biatch", "bitch", "bitcher", "bitchers", "bitches", "bitchin", "bitching", "bloody", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buceta", "bugger", "bum", "bunny fucker", "butt", "butthole", "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa", "cl1t", "clit", "clitoris", "clits", "cnut", "cock", "cock-sucker", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck", "cocksucked", "cocksucker", "cocksucking", "cocksucks", "cocksuka", "cocksukka", "cok", "cokmuncher", "coksucka", "coon", "cox", "crap", "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntlick", "cuntlicker", "cuntlicking", "cunts", "cyalis", "cyberfuc", "cyberfuck", "cyberfucked", "cyberfucker", "cyberfuckers", "cyberfucking", "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "fanny", "fannyflaps", "fannyfucker", "fanyy", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker", "felching", "fellate", "fellatio", "fingerfuck", "fingerfucked", "fingerfucker", "fingerfuckers", "fingerfucking", "fingerfucks", "fistfuck", "fistfucked", "fistfucker", "fistfuckers", "fistfucking", "fistfuckings", "fistfucks", "flange", "fook", "fooker", "fuck", "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckin", "fucking", "fuckings", "fuckingshitmotherfucker", "fuckme", "fucks", "fuckwhit", "fuckwit", "fudge packer", "fudgepacker", "fuk", "fuker", "fukker", "fukkin", "fuks", "fukwhit", "fukwit", "fux", "fux0r", "f_u_c_k", "gangbang", "gangbanged", "gangbangs", "gaylord", "gaysex", "goatse", "God", "god-dam", "god-damned", "goddamn", "goddamned", "hardcoresex", "hell", "heshe", "hoar", "hoare", "hoer", "homo", "hore", "horniest", "horny", "hotsex", "jack-off", "jackoff", "jap", "jerk-off", "jism", "jiz", "jizm", "jizz", "kawk", "knob", "knobead", "knobed", "knobend", "knobhead", "knobjocky", "knobjokey", "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", "kunilingus", "l3i+ch", "l3itch", "labia", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "nutsack", "orgasim", "orgasims", "orgasm", "orgasms", "p0rn", "pawn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "pissed", "pisser", "pissers", "pisses", "pissflaps", "pissin", "pissing", "pissoff", "poop", "porn", "porno", "pornography", "pornos", "prick", "pricks", "pron", "pube", "pusse", "pussi", "pussies", "pussy", "pussys", "rectum", "retard", "rimjaw", "rimming", "s hit", "s.o.b.", "sadist", "schlong", "screwing", "scroat", "scrote", "scrotum", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shagging", "shemale", "shi+", "shit", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shits", "shitted", "shitter", "shitters", "shitting", "shittings", "shitty", "skank", "slut", "sluts", "smegma", "smut", "snatch", "son-of-a-bitch", "spac", "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "teez", "testical", "testicle", "tit", "titfuck", "tits", "titt", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", "turd", "tw4t", "twat", "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "vagina", "viagra", "vulva", "w00se", "wang", "wank", "wanker", "wanky", "whoar", "whore", "willies", "willy", "xrated", "xxx"];
}, function (e, t) {
    e.exports = /\b(4r5e|5h1t|5hit|a55|anal|anus|ar5e|arrse|arse|ass|ass-fucker|asses|assfucker|assfukka|asshole|assholes|asswhole|a_s_s|b!tch|b00bs|b17ch|b1tch|ballbag|balls|ballsack|bastard|beastial|beastiality|bellend|bestial|bestiality|bi\+ch|biatch|bitch|bitcher|bitchers|bitches|bitchin|bitching|bloody|blow job|blowjob|blowjobs|boiolas|bollock|bollok|boner|boob|boobs|booobs|boooobs|booooobs|booooooobs|breasts|buceta|bugger|bum|bunny fucker|butt|butthole|buttmuch|buttplug|c0ck|c0cksucker|carpet muncher|cawk|chink|cipa|cl1t|clit|clitoris|clits|cnut|cock|cock-sucker|cockface|cockhead|cockmunch|cockmuncher|cocks|cocksuck|cocksucked|cocksucker|cocksucking|cocksucks|cocksuka|cocksukka|cok|cokmuncher|coksucka|coon|cox|crap|cum|cummer|cumming|cums|cumshot|cunilingus|cunillingus|cunnilingus|cunt|cuntlick|cuntlicker|cuntlicking|cunts|cyalis|cyberfuc|cyberfuck|cyberfucked|cyberfucker|cyberfuckers|cyberfucking|d1ck|damn|dick|dickhead|dildo|dildos|dink|dinks|dirsa|dlck|dog-fucker|doggin|dogging|donkeyribber|doosh|duche|dyke|ejaculate|ejaculated|ejaculates|ejaculating|ejaculatings|ejaculation|ejakulate|f u c k|f u c k e r|f4nny|fag|fagging|faggitt|faggot|faggs|fagot|fagots|fags|fanny|fannyflaps|fannyfucker|fanyy|fatass|fcuk|fcuker|fcuking|feck|fecker|felching|fellate|fellatio|fingerfuck|fingerfucked|fingerfucker|fingerfuckers|fingerfucking|fingerfucks|fistfuck|fistfucked|fistfucker|fistfuckers|fistfucking|fistfuckings|fistfucks|flange|fook|fooker|fuck|fucka|fucked|fucker|fuckers|fuckhead|fuckheads|fuckin|fucking|fuckings|fuckingshitmotherfucker|fuckme|fucks|fuckwhit|fuckwit|fudge packer|fudgepacker|fuk|fuker|fukker|fukkin|fuks|fukwhit|fukwit|fux|fux0r|f_u_c_k|gangbang|gangbanged|gangbangs|gaylord|gaysex|goatse|God|god-dam|god-damned|goddamn|goddamned|hardcoresex|hell|heshe|hoar|hoare|hoer|homo|hore|horniest|horny|hotsex|jack-off|jackoff|jap|jerk-off|jism|jiz|jizm|jizz|kawk|knob|knobead|knobed|knobend|knobhead|knobjocky|knobjokey|kock|kondum|kondums|kum|kummer|kumming|kums|kunilingus|l3i\+ch|l3itch|labia|lust|lusting|m0f0|m0fo|m45terbate|ma5terb8|ma5terbate|masochist|master-bate|masterb8|masterbat*|masterbat3|masterbate|masterbation|masterbations|masturbate|mo-fo|mof0|mofo|mothafuck|mothafucka|mothafuckas|mothafuckaz|mothafucked|mothafucker|mothafuckers|mothafuckin|mothafucking|mothafuckings|mothafucks|mother fucker|motherfuck|motherfucked|motherfucker|motherfuckers|motherfuckin|motherfucking|motherfuckings|motherfuckka|motherfucks|muff|mutha|muthafecker|muthafuckker|muther|mutherfucker|n1gga|n1gger|nazi|nigg3r|nigg4h|nigga|niggah|niggas|niggaz|nigger|niggers|nob|nob jokey|nobhead|nobjocky|nobjokey|numbnuts|nutsack|orgasim|orgasims|orgasm|orgasms|p0rn|pawn|pecker|penis|penisfucker|phonesex|phuck|phuk|phuked|phuking|phukked|phukking|phuks|phuq|pigfucker|pimpis|piss|pissed|pisser|pissers|pisses|pissflaps|pissin|pissing|pissoff|poop|porn|porno|pornography|pornos|prick|pricks|pron|pube|pusse|pussi|pussies|pussy|pussys|rectum|retard|rimjaw|rimming|s hit|s.o.b.|sadist|schlong|screwing|scroat|scrote|scrotum|semen|sex|sh!\+|sh!t|sh1t|shag|shagger|shaggin|shagging|shemale|shi\+|shit|shitdick|shite|shited|shitey|shitfuck|shitfull|shithead|shiting|shitings|shits|shitted|shitter|shitters|shitting|shittings|shitty|skank|slut|sluts|smegma|smut|snatch|son-of-a-bitch|spac|spunk|s_h_i_t|t1tt1e5|t1tties|teets|teez|testical|testicle|tit|titfuck|tits|titt|tittie5|tittiefucker|titties|tittyfuck|tittywank|titwank|tosser|turd|tw4t|twat|twathead|twatty|twunt|twunter|v14gra|v1gra|vagina|viagra|vulva|w00se|wang|wank|wanker|wanky|whoar|whore|willies|willy|xrated|xxx)\b/gi;
}, function (e, t) {
    e.exports.hats = [{id: 45, name: "Shame!", dontSell: false, price: 2e50, scale: 120, desc: "hacks are for pros"}, {id: 51, name: "Moo Cap", price: 0, scale: 120, desc: "coolest mooer around"}, {id: 50, name: "Apple Cap", price: 0, scale: 120, desc: "apple farms remembers"}, {id: 28, name: "Moo Head", price: 0, scale: 120, desc: "no effect"}, {id: 29, name: "Pig Head", price: 0, scale: 120, desc: "no effect"}, {id: 30, name: "Fluff Head", price: 0, scale: 120, desc: "no effect"}, {id: 36, name: "Pandou Head", price: 0, scale: 120, desc: "no effect"}, {id: 37, name: "Bear Head", price: 0, scale: 120, desc: "no effect"}, {id: 38, name: "Monkey Head", price: 0, scale: 120, desc: "no effect"}, {id: 44, name: "Polar Head", price: 0, scale: 120, desc: "no effect"}, {id: 35, name: "Fez Hat", price: 0, scale: 120, desc: "no effect"}, {id: 42, name: "Enigma Hat", price: 0, scale: 120, desc: "join the enigma army"}, {id: 43, name: "Blitz Hat", price: 0, scale: 120, desc: "hey everybody i'm blitz"}, {id: 49, name: "Bob XIII Hat", price: 0, scale: 120, desc: "like and subscribe"}, {id: 57, name: "Pumpkin", price: 50, scale: 120, desc: "Spooooky"}, {id: 8, name: "Bummle Hat", price: 100, scale: 120, desc: "no effect"}, {id: 2, name: "Straw Hat", price: 500, scale: 120, desc: "no effect"}, {id: 15, name: "Winter Cap", price: 600, scale: 120, desc: "allows you to move at normal speed in snow", coldM: 1}, {id: 5, name: "Cowboy Hat", price: 1e3, scale: 120, desc: "no effect"}, {id: 4, name: "Ranger Hat", price: 2e3, scale: 120, desc: "no effect"}, {id: 18, name: "Explorer Hat", price: 2e3, scale: 120, desc: "no effect"}, {id: 31, name: "Flipper Hat", price: 2500, scale: 120, desc: "have more control while in water", watrImm: true}, {id: 1, name: "Marksman Cap", price: 3e3, scale: 120, desc: "increases arrow speed and range", aMlt: 1.3}, {id: 10, name: "Bush Gear", price: 3e3, scale: 160, desc: "allows you to disguise yourself as a bush"}, {id: 48, name: "Halo", price: 3e3, scale: 120, desc: "no effect"}, {id: 6, name: "Soldier Helmet", price: 4e3, scale: 120, desc: "reduces damage taken but slows movement", spdMult: 0.94, dmgMult: 0.75}, {id: 23, name: "Anti Venom Gear", price: 4e3, scale: 120, desc: "makes you immune to poison", poisonRes: 1}, {id: 13, name: "Medic Gear", price: 5e3, scale: 110, desc: "slowly regenerates health over time", healthRegen: 3}, {id: 9, name: "Miners Helmet", price: 5e3, scale: 120, desc: "earn 1 extra gold per resource", extraGold: 1}, {id: 32, name: "Musketeer Hat", price: 5e3, scale: 120, desc: "reduces cost of projectiles", projCost: 0.5}, {id: 7, name: "Bull Helmet", price: 6e3, scale: 120, desc: "increases damage done but drains health", healthRegen: -5, dmgMultO: 1.5, spdMult: 0.96}, {id: 22, name: "Emp Helmet", price: 6e3, scale: 120, desc: "turrets won't attack but you move slower", antiTurret: 1, spdMult: 0.7}, {id: 12, name: "Booster Hat", price: 6e3, scale: 120, desc: "increases your movement speed", spdMult: 1.16}, {id: 26, name: "Barbarian Armor", price: 8e3, scale: 120, desc: "knocks back enemies that attack you", dmgK: 0.6}, {id: 21, name: "Plague Mask", price: 1e4, scale: 120, desc: "melee attacks deal poison damage", poisonDmg: 5, poisonTime: 6}, {id: 46, name: "Bull Mask", price: 1e4, scale: 120, desc: "bulls won't target you unless you attack them", bullRepel: 1}, {id: 14, name: "Windmill Hat", topSprite: true, price: 1e4, scale: 120, desc: "generates points while worn", pps: 1.5}, {id: 11, name: "Spike Gear", topSprite: true, price: 1e4, scale: 120, desc: "deal damage to players that damage you", dmg: 0.45}, {id: 53, name: "Turret Gear", topSprite: true, price: 1e4, scale: 120, desc: "you become a walking turret", turret: {proj: 1, range: 700, rate: 2500}, spdMult: 0.7}, {id: 20, name: "Samurai Armor", price: 12e3, scale: 120, desc: "increased attack speed and fire rate", atkSpd: 0.78}, {id: 58, name: "Dark Knight", price: 12e3, scale: 120, desc: "restores health when you deal damage", healD: 0.4}, {id: 27, name: "Scavenger Gear", price: 15e3, scale: 120, desc: "earn double points for each kill", kScrM: 2}, {id: 40, name: "Tank Gear", price: 15e3, scale: 120, desc: "increased damage to buildings but slower movement", spdMult: 0.3, bDmg: 3.3}, {id: 52, name: "Thief Gear", price: 15e3, scale: 120, desc: "steal half of a players gold when you kill them", goldSteal: 0.5}, {id: 55, name: "Bloodthirster", price: 2e4, scale: 120, desc: "Restore Health when dealing damage. And increased damage", healD: 0.25, dmgMultO: 1.2}, {id: 56, name: "Assassin Gear", price: 2e4, scale: 120, desc: "Go invisible when not moving. Can't eat. Increased speed", noEat: true, spdMult: 1.1, invisTimer: 1e3}], e.exports.accessories = [{id: 12, name: "Snowball", price: 1e3, scale: 105, xOff: 18, desc: "no effect"}, {id: 9, name: "Tree Cape", price: 1e3, scale: 90, desc: "no effect"}, {id: 10, name: "Stone Cape", price: 1e3, scale: 90, desc: "no effect"}, {id: 3, name: "Cookie Cape", price: 1500, scale: 90, desc: "no effect"}, {id: 8, name: "Cow Cape", price: 2e3, scale: 90, desc: "no effect"}, {id: 11, name: "Monkey Tail", price: 2e3, scale: 97, xOff: 25, desc: "Super speed but reduced damage", spdMult: 1.35, dmgMultO: 0.2}, {id: 17, name: "Apple Basket", price: 3e3, scale: 80, xOff: 12, desc: "slowly regenerates health over time", healthRegen: 1}, {id: 6, name: "Winter Cape", price: 3e3, scale: 90, desc: "no effect"}, {id: 4, name: "Skull Cape", price: 4e3, scale: 90, desc: "no effect"}, {id: 5, name: "Dash Cape", price: 5e3, scale: 90, desc: "no effect"}, {id: 2, name: "Dragon Cape", price: 6e3, scale: 90, desc: "no effect"}, {id: 1, name: "Super Cape", price: 8e3, scale: 90, desc: "no effect"}, {id: 7, name: "Troll Cape", price: 8e3, scale: 90, desc: "no effect"}, {id: 14, name: "Thorns", price: 1e4, scale: 115, xOff: 20, desc: "no effect"}, {id: 15, name: "Blockades", price: 1e4, scale: 95, xOff: 15, desc: "no effect"}, {id: 20, name: "Devils Tail", price: 1e4, scale: 95, xOff: 20, desc: "no effect"}, {id: 16, name: "Sawblade", price: 12e3, scale: 90, spin: true, xOff: 0, desc: "deal damage to players that damage you", dmg: 0.15}, {id: 13, name: "Angel Wings", price: 15e3, scale: 138, xOff: 22, desc: "slowly regenerates health over time", healthRegen: 3}, {id: 19, name: "Shadow Wings", price: 15e3, scale: 138, xOff: 22, desc: "increased movement speed", spdMult: 1.1}, {id: 18, name: "Blood Wings", price: 2e4, scale: 178, xOff: 26, desc: "restores health when you deal damage", healD: 0.2}, {id: 21, name: "Corrupt X Wings", price: 2e4, scale: 178, xOff: 26, desc: "deal damage to players that damage you", dmg: 0.25}];
}, function (e, t) {
    e.exports = function (e, t, i, n, s, o, a) {
        this.init = function (e, t, i, n, s, o, r, c, l) {
            this.active = true, this.indx = e, this.x = t, this.y = i, this.dir = n, this.skipMov = true, this.speed = s, this.dmg = o, this.scale = c, this.range = r, this.owner = l, a && (this.sentTo = {});
        };
        var r, c = [];
        this.update = function (l) {
            if (this.active) {
                var h, u = this.speed * l;
                if (this.skipMov ? this.skipMov = false : (this.x += u * Math.cos(this.dir), this.y += u * Math.sin(this.dir), this.range -= u, this.range <= 0 && (this.x += this.range * Math.cos(this.dir), this.y += this.range * Math.sin(this.dir), u = 1, this.range = 0, this.active = false)), a) {
                    for (var d = 0; d < e.length; ++d) !this.sentTo[e[d].id] && e[d].canSee(this) && (this.sentTo[e[d].id] = 1, a.send(e[d].id, "18", o.fixTo(this.x, 1), o.fixTo(this.y, 1), o.fixTo(this.dir, 2), o.fixTo(this.range, 1), this.speed, this.indx, this.layer, this.sid));
                    for (c.length = 0, d = 0; d < e.length + t.length; ++d) !(r = e[d] || t[d - e.length]).alive || r == this.owner || this.owner.team && r.team == this.owner.team || o.lineInRect(r.x - r.scale, r.y - r.scale, r.x + r.scale, r.y + r.scale, this.x, this.y, this.x + u * Math.cos(this.dir), this.y + u * Math.sin(this.dir)) && c.push(r);
                    for (var f = i.getGridArrays(this.x, this.y, this.scale), p = 0; p < f.length; ++p) for (var g = 0; g < f[p].length; ++g) h = (r = f[p][g]).getScale(), r.active && this.ignoreObj != r.sid && this.layer <= r.layer && c.indexOf(r) < 0 && !r.ignoreCollision && o.lineInRect(r.x - h, r.y - h, r.x + h, r.y + h, this.x, this.y, this.x + u * Math.cos(this.dir), this.y + u * Math.sin(this.dir)) && c.push(r);
                    if (c.length > 0) {
                        var m = null, y = null, k = null;
                        for (d = 0; d < c.length; ++d) k = o.getDistance(this.x, this.y, c[d].x, c[d].y), (null == y || k < y) && (y = k, m = c[d]);
                        if (m.isPlayer || m.isAI) {
                            var w = 0.3 * (m.weightM || 1);
                            m.xVel += w * Math.cos(this.dir), m.yVel += w * Math.sin(this.dir), null != m.weaponIndex && n.weapons[m.weaponIndex].shield && o.getAngleDist(this.dir + Math.PI, m.dir) <= s.shieldAngle || m.changeHealth(-this.dmg, this.owner, this.owner);
                        } else for (m.projDmg && m.health && m.changeHealth(-this.dmg) && i.disableObj(m), d = 0; d < e.length; ++d) e[d].active && (m.sentTo[e[d].id] && (m.active ? e[d].canSee(m) && a.send(e[d].id, "8", o.fixTo(this.dir, 2), m.sid) : a.send(e[d].id, "12", m.sid)), m.active || m.owner != e[d] || e[d].changeItemCount(m.group.id, -1));
                        for (this.active = false, d = 0; d < e.length; ++d) this.sentTo[e[d].id] && a.send(e[d].id, "19", this.sid, o.fixTo(y, 1));
                    }
                }
            }
        };
    };
}, function (e, t) {
    e.exports = function (e, t, i, n, s, o, a, r, c) {
        this.addProjectile = function (l, h, u, d, f, p, g, m, y) {
            for (var k, w = o.projectiles[p], v = 0; v < t.length; ++v) if (!t[v].active) {
                k = t[v];
                break;
            }
            return k || ((k = new e(i, n, s, o, a, r, c)).sid = t.length, t.push(k)), k.init(p, l, h, u, f, w.dmg, d, w.scale, g), k.ignoreObj = m, k.layer = y || w.layer, k.src = w.src, k;
        };
    };
}, function (e, t) {
    e.exports.obj = function (e, t) {
        var i;
        this.sounds = [], this.active = true, this.play = function (t, n, s) {
            n && this.active && ((i = this.sounds[t]) || (i = new Howl({src: ".././sound/" + t + ".mp3"}), this.sounds[t] = i), s && i.isPlaying || (i.isPlaying = true, i.play(), i.volume((n || 1) * e.volumeMult), i.loop(s)));
        }, this.toggleMute = function (e, t) {
            (i = this.sounds[e]) && i.mute(t);
        }, this.stop = function (e) {
            (i = this.sounds[e]) && (i.stop(), i.isPlaying = false);
        };
    };
}, function (e, t, i) {
    var n = i(24), s = i(32);
    function o(e, t, i, n, s) {
        "localhost" == location.hostname && (window.location.hostname = "127.0.0.1"), this.debugLog = false, this.baseUrl = e, this.lobbySize = i, this.devPort = t, this.lobbySpread = n, this.rawIPs = !!s, this.server = void 0, this.gameIndex = void 0, this.callback = void 0, this.errorCallback = void 0, this.processServers(vultr.servers);
    }
    o.prototype.regionInfo = {0: {name: "Local", latitude: 0, longitude: 0}, "vultr:1": {name: "New Jersey", latitude: 40.1393329, longitude: -75.8521818}, "vultr:2": {name: "Chicago", latitude: 41.8339037, longitude: -87.872238}, "vultr:3": {name: "Dallas", latitude: 32.8208751, longitude: -96.8714229}, "vultr:4": {name: "Seattle", latitude: 47.6149942, longitude: -122.4759879}, "vultr:5": {name: "Los Angeles", latitude: 34.0207504, longitude: -118.691914}, "vultr:6": {name: "Atlanta", latitude: 33.7676334, longitude: -84.5610332}, "vultr:7": {name: "Amsterdam", latitude: 52.3745287, longitude: 4.7581878}, "vultr:8": {name: "London", latitude: 51.5283063, longitude: -0.382486}, "vultr:9": {name: "Frankfurt", latitude: 50.1211273, longitude: 8.496137}, "vultr:12": {name: "Silicon Valley", latitude: 37.4024714, longitude: -122.3219752}, "vultr:19": {name: "Sydney", latitude: -33.8479715, longitude: 150.651084}, "vultr:24": {name: "Paris", latitude: 48.8588376, longitude: 2.2773454}, "vultr:25": {name: "Tokyo", latitude: 35.6732615, longitude: 139.569959}, "vultr:39": {name: "Miami", latitude: 25.7823071, longitude: -80.3012156}, "vultr:40": {name: "Singapore", latitude: 1.3147268, longitude: 103.7065876}}, o.prototype.start = function (e, t) {
        this.callback = e, this.errorCallback = t;
        var i = this.parseServerQuery();
        i ? (this.log("Found server in query."), this.password = i[3], this.connect(i[0], i[1], i[2])) : (this.log("Pinging servers..."), this.pingServers());
    }, o.prototype.parseServerQuery = function () {
        var e = n.parse(location.href, true), t = e.query.server;
        if ("string" == typeof t) {
            var i = t.split(":");
            if (3 == i.length) {
                var s = i[0], o = parseInt(i[1]), a = parseInt(i[2]);
                return "0" == s || s.startsWith("vultr:") || (s = "vultr:" + s), [s, o, a, e.query.password];
            }
            this.errorCallback("Invalid number of server parameters in " + t);
        }
    }, o.prototype.findServer = function (e, t) {
        var i = this.servers[e];
        if (Array.isArray(i)) {
            for (var n = 0; n < i.length; n++) {
                var s = i[n];
                if (s.index == t) return s;
            }
            console.warn("Could not find server in region " + e + " with index " + t + ".");
        } else this.errorCallback("No server list for region " + e);
    }, o.prototype.pingServers = function () {
        var e = this, t = [];
        for (var i in this.servers) if (this.servers.hasOwnProperty(i)) {
            var n = this.servers[i], s = n[Math.floor(Math.random() * n.length)];
            null != s ? function (n, s) {
                var o = new XMLHttpRequest;
                o.onreadystatechange = function (n) {
                    var o = n.target;
                    if (4 == o.readyState) if (200 == o.status) {
                        for (var a = 0; a < t.length; a++) t[a].abort();
                        e.log("Connecting to region", s.region);
                        var r = e.seekServer(s.region);
                        e.connect(r[0], r[1], r[2]);
                    } else console.warn("Error pinging " + s.ip + " in region " + i);
                };
                var a = "//" + e.serverAddress(s.ip, true) + ":" + e.serverPort(s) + "/ping";
                o.open("GET", a, true), o.send(null), e.log("Pinging", a), t.push(o);
            }(0, s) : console.log("No target server for region " + i);
        }
    }, o.prototype.seekServer = function (e, t, i) {
        null == i && (i = "random"), null == t && (t = false);
        const n = ["random"];
        var s = this.lobbySize, o = this.lobbySpread, a = this.servers[e].flatMap(function (e) {
            var t = 0;
            return e.games.map(function (i) {
                var n = t++;
                return {region: e.region, index: e.index * e.games.length + n, gameIndex: n, gameCount: e.games.length, playerCount: i.playerCount, isPrivate: i.isPrivate};
            });
        }).filter(function (e) {
            return !e.isPrivate;
        }).filter(function (e) {
            return !t || 0 == e.playerCount && e.gameIndex >= e.gameCount / 2;
        }).filter(function (e) {
            return "random" == i || n[e.index % n.length].key == i;
        }).sort(function (e, t) {
            return t.playerCount - e.playerCount;
        }).filter(function (e) {
            return e.playerCount < s;
        });
        if (t && a.reverse(), 0 != a.length) {
            var r = Math.min(o, a.length), c = Math.floor(Math.random() * r), l = a[c = Math.min(c, a.length - 1)], h = l.region, u = (c = Math.floor(l.index / l.gameCount), l.index % l.gameCount);
            return this.log("Found server."), [h, c, u];
        }
        this.errorCallback("No open servers.");
    }, o.prototype.connect = function (e, t, i) {
        if (!this.connected) {
            var n = this.findServer(e, t);
            null != n ? (this.log("Connecting to server", n, "with game index", i), n.games[i].playerCount >= this.lobbySize ? this.errorCallback("Server is already full.") : (window.history.replaceState(document.title, document.title, this.generateHref(e, t, i, this.password)), this.server = n, this.gameIndex = i, this.log("Calling callback with address", this.serverAddress(n.ip), "on port", this.serverPort(n), "with game index", i), this.callback(this.serverAddress(n.ip), this.serverPort(n), i))) : this.errorCallback("Failed to find server for region " + e + " and index " + t);
        }
    }, o.prototype.switchServer = function (e, t, i, n) {
        this.switchingServers = true, window.location.href = this.generateHref(e, t, i, n);
    }, o.prototype.generateHref = function (e, t, i, n) {
        var s = "/?server=" + (e = this.stripRegion(e)) + ":" + t + ":" + i;
        return n && (s += "&password=" + encodeURIComponent(n)), s;
    }, o.prototype.serverAddress = function (e, t) {
        return "127.0.0.1" == e || "7f000001" == e || "903d62ef5d1c2fecdcaeb5e7dd485eff" == e ? window.location.hostname : this.rawIPs ? t ? "ip_" + this.hashIP(e) + "." + this.baseUrl : e : "ip_" + e + "." + this.baseUrl;
    }, o.prototype.serverPort = function (e) {
        return 0 == e.region ? this.devPort : location.protocol.startsWith("https") ? 443 : 80;
    }, o.prototype.processServers = function (e) {
        for (var t = {}, i = 0; i < e.length; i++) {
            var n = e[i], s = t[n.region];
            null == s && (s = [], t[n.region] = s), s.push(n);
        }
        for (var o in t) t[o] = t[o].sort(function (e, t) {
            return e.index - t.index;
        });
        this.servers = t;
    }, o.prototype.ipToHex = function (e) {
        return e.split(".").map(e => ("00" + parseInt(e).toString(16)).substr(-2)).join("").toLowerCase();
    }, o.prototype.hashIP = function (e) {
        return s(this.ipToHex(e));
    }, o.prototype.log = function () {
        return this.debugLog ? console.log.apply(void 0, arguments) : console.verbose ? console.verbose.apply(void 0, arguments) : void 0;
    }, o.prototype.stripRegion = function (e) {
        return e.startsWith("vultr:") ? e = e.slice(6) : e.startsWith("do:") && (e = e.slice(3)), e;
    }, window.testVultrClient = function () {
        var e = 1;
        function t(t, i) {
            (t = "" + t) == (i = "" + i) ? console.log(`Assert ${e} passed.`) : console.warn(`Assert ${e} failed. Expected ${i}, got ${t}.`), e++;
        }
        var i = new o("test.io", -1, 5, 1, false);
        i.errorCallback = function (e) {}, i.processServers(function (e) {
            var t = [];
            for (var i in e) for (var n = e[i], s = 0; s < n.length; s++) t.push({ip: i + ":" + s, scheme: "testing", region: i, index: s, games: n[s].map(e => ({playerCount: e, isPrivate: false}))});
            return t;
        }({1: [[0, 0, 0, 0], [0, 0, 0, 0]], 2: [[5, 1, 0, 0], [0, 0, 0, 0]], 3: [[5, 0, 1, 5], [0, 0, 0, 0]], 4: [[5, 1, 1, 5], [1, 0, 0, 0]], 5: [[5, 1, 1, 5], [1, 0, 4, 0]], 6: [[5, 5, 5, 5], [2, 3, 1, 4]], 7: [[5, 5, 5, 5], [5, 5, 5, 5]]})), t(i.seekServer(1, false), [1, 0, 0]), t(i.seekServer(1, true), [1, 1, 3]), t(i.seekServer(2, false), [2, 0, 1]), t(i.seekServer(2, true), [2, 1, 3]), t(i.seekServer(3, false), [3, 0, 2]), t(i.seekServer(3, true), [3, 1, 3]), t(i.seekServer(4, false), [4, 0, 1]), t(i.seekServer(4, true), [4, 1, 3]), t(i.seekServer(5, false), [5, 1, 2]), t(i.seekServer(5, true), [5, 1, 3]), t(i.seekServer(6, false), [6, 1, 3]), t(i.seekServer(6, true), void 0), t(i.seekServer(7, false), void 0), t(i.seekServer(7, true), void 0), console.log("Tests passed.");
    };
    Array.prototype.flatMap = function (e) {
        return function (e, t) {
            return t.map(e).reduce(a, []);
        }(e, this);
    }, e.exports = o;
}, function (e, t, i) {
    "use strict";
    var n = i(25), s = i(28);
    function o() {
        this.protocol = null, this.slashes = null, this.auth = null, this.host = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.query = null, this.pathname = null, this.path = null, this.href = null;
    }
    t.parse = w, t.resolve = function (e, t) {
        return w(e, false, true).resolve(t);
    }, t.resolveObject = function (e, t) {
        return e ? w(e, false, true).resolveObject(t) : t;
    }, t.format = function (e) {
        return s.isString(e) && (e = w(e)), e instanceof o ? e.format() : o.prototype.format.call(e);
    }, t.Url = o;
    var a = /^([a-z0-9.+-]+:)/i, r = /:[0-9]*$/, c = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, l = ["{", "}", "|", "\\", "^", "`"].concat(["<", ">", '"', "`", " ", "\r", "\n", "	"]), h = ["'"].concat(l), u = ["%", "/", "?", ";", "#"].concat(h), d = ["/", "?", "#"], f = /^[+a-z0-9A-Z_-]{0,63}$/, p = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, g = {javascript: true, "javascript:": true}, m = {javascript: true, "javascript:": true}, y = {http: true, https: true, ftp: true, gopher: true, file: true, "http:": true, "https:": true, "ftp:": true, "gopher:": true, "file:": true}, k = i(29);
    function w(e, t, i) {
        if (e && s.isObject(e) && e instanceof o) return e;
        var n = new o;
        return n.parse(e, t, i), n;
    }
    o.prototype.parse = function (e, t, i) {
        if (!s.isString(e)) throw new TypeError("Parameter 'url' must be a string, not " + typeof e);
        var o = e.indexOf("?"), r = -1 !== o && o < e.indexOf("#") ? "?" : "#", l = e.split(r);
        l[0] = l[0].replace(/\\/g, "/");
        var w = e = l.join(r);
        if (w = w.trim(), !i && 1 === e.split("#").length) {
            var v = c.exec(w);
            if (v) return this.path = w, this.href = w, this.pathname = v[1], v[2] ? (this.search = v[2], this.query = t ? k.parse(this.search.substr(1)) : this.search.substr(1)) : t && (this.search = "", this.query = {}), this;
        }
        var b = a.exec(w);
        if (b) {
            var x = (b = b[0]).toLowerCase();
            this.protocol = x, w = w.substr(b.length);
        }
        if (i || b || w.match(/^\/\/[^@\/]+@[^@\/]+/)) {
            var S = "//" === w.substr(0, 2);
            !S || b && m[b] || (w = w.substr(2), this.slashes = true);
        }
        if (!m[b] && (S || b && !y[b])) {
            for (var I, T, M = -1, C = 0; C < d.length; C++) -1 !== (P = w.indexOf(d[C])) && (-1 === M || P < M) && (M = P);
            for (-1 !== (T = -1 === M ? w.lastIndexOf("@") : w.lastIndexOf("@", M)) && (I = w.slice(0, T), w = w.slice(T + 1), this.auth = decodeURIComponent(I)), M = -1, C = 0; C < u.length; C++) {
                var P;
                -1 !== (P = w.indexOf(u[C])) && (-1 === M || P < M) && (M = P);
            }
            -1 === M && (M = w.length), this.host = w.slice(0, M), w = w.slice(M), this.parseHost(), this.hostname = this.hostname || "";
            var E = "[" === this.hostname[0] && "]" === this.hostname[this.hostname.length - 1];
            if (!E) for (var O = this.hostname.split(/\./), B = (C = 0, O.length); C < B; C++) {
                var j = O[C];
                if (j && !j.match(f)) {
                    for (var A = "", D = 0, U = j.length; D < U; D++) j.charCodeAt(D) > 127 ? A += "x" : A += j[D];
                    if (!A.match(f)) {
                        var R = O.slice(0, C), L = O.slice(C + 1), z = j.match(p);
                        z && (R.push(z[1]), L.unshift(z[2])), L.length && (w = "/" + L.join(".") + w), this.hostname = R.join(".");
                        break;
                    }
                }
            }
            this.hostname.length > 255 ? this.hostname = "" : this.hostname = this.hostname.toLowerCase(), E || (this.hostname = n.toASCII(this.hostname));
            var _ = this.port ? ":" + this.port : "", F = this.hostname || "";
            this.host = F + _, this.href += this.host, E && (this.hostname = this.hostname.substr(1, this.hostname.length - 2), "/" !== w[0] && (w = "/" + w));
        }
        if (!g[x]) for (C = 0, B = h.length; C < B; C++) {
            var H = h[C];
            if (-1 !== w.indexOf(H)) {
                var V = encodeURIComponent(H);
                V === H && (V = escape(H)), w = w.split(H).join(V);
            }
        }
        var q = w.indexOf("#");
        -1 !== q && (this.hash = w.substr(q), w = w.slice(0, q));
        var W = w.indexOf("?");
        if (-1 !== W ? (this.search = w.substr(W), this.query = w.substr(W + 1), t && (this.query = k.parse(this.query)), w = w.slice(0, W)) : t && (this.search = "", this.query = {}), w && (this.pathname = w), y[x] && this.hostname && !this.pathname && (this.pathname = "/"), this.pathname || this.search) {
            _ = this.pathname || "";
            var X = this.search || "";
            this.path = _ + X;
        }
        return this.href = this.format(), this;
    }, o.prototype.format = function () {
        var e = this.auth || "";
        e && (e = (e = encodeURIComponent(e)).replace(/%3A/i, ":"), e += "@");
        var t = this.protocol || "", i = this.pathname || "", n = this.hash || "", o = false, a = "";
        this.host ? o = e + this.host : this.hostname && (o = e + (-1 === this.hostname.indexOf(":") ? this.hostname : "[" + this.hostname + "]"), this.port && (o += ":" + this.port)), this.query && s.isObject(this.query) && Object.keys(this.query).length && (a = k.stringify(this.query));
        var r = this.search || a && "?" + a || "";
        return t && ":" !== t.substr(-1) && (t += ":"), this.slashes || (!t || y[t]) && false !== o ? (o = "//" + (o || ""), i && "/" !== i.charAt(0) && (i = "/" + i)) : o || (o = ""), n && "#" !== n.charAt(0) && (n = "#" + n), r && "?" !== r.charAt(0) && (r = "?" + r), t + o + (i = i.replace(/[?#]/g, function (e) {
            return encodeURIComponent(e);
        })) + (r = r.replace("#", "%23")) + n;
    }, o.prototype.resolve = function (e) {
        return this.resolveObject(w(e, false, true)).format();
    }, o.prototype.resolveObject = function (e) {
        if (s.isString(e)) {
            var t = new o;
            t.parse(e, false, true), e = t;
        }
        for (var i = new o, n = Object.keys(this), a = 0; a < n.length; a++) {
            var r = n[a];
            i[r] = this[r];
        }
        if (i.hash = e.hash, "" === e.href) return i.href = i.format(), i;
        if (e.slashes && !e.protocol) {
            for (var c = Object.keys(e), l = 0; l < c.length; l++) {
                var h = c[l];
                "protocol" !== h && (i[h] = e[h]);
            }
            return y[i.protocol] && i.hostname && !i.pathname && (i.path = i.pathname = "/"), i.href = i.format(), i;
        }
        if (e.protocol && e.protocol !== i.protocol) {
            if (!y[e.protocol]) {
                for (var u = Object.keys(e), d = 0; d < u.length; d++) {
                    var f = u[d];
                    i[f] = e[f];
                }
                return i.href = i.format(), i;
            }
            if (i.protocol = e.protocol, e.host || m[e.protocol]) i.pathname = e.pathname; else {
                for (var p = (e.pathname || "").split("/"); p.length && !(e.host = p.shift());) ;
                e.host || (e.host = ""), e.hostname || (e.hostname = ""), "" !== p[0] && p.unshift(""), p.length < 2 && p.unshift(""), i.pathname = p.join("/");
            }
            if (i.search = e.search, i.query = e.query, i.host = e.host || "", i.auth = e.auth, i.hostname = e.hostname || e.host, i.port = e.port, i.pathname || i.search) {
                var g = i.pathname || "", k = i.search || "";
                i.path = g + k;
            }
            return i.slashes = i.slashes || e.slashes, i.href = i.format(), i;
        }
        var w = i.pathname && "/" === i.pathname.charAt(0), v = e.host || e.pathname && "/" === e.pathname.charAt(0), b = v || w || i.host && e.pathname, x = b, S = i.pathname && i.pathname.split("/") || [], I = (p = e.pathname && e.pathname.split("/") || [], i.protocol && !y[i.protocol]);
        if (I && (i.hostname = "", i.port = null, i.host && ("" === S[0] ? S[0] = i.host : S.unshift(i.host)), i.host = "", e.protocol && (e.hostname = null, e.port = null, e.host && ("" === p[0] ? p[0] = e.host : p.unshift(e.host)), e.host = null), b = b && ("" === p[0] || "" === S[0])), v) i.host = e.host || "" === e.host ? e.host : i.host, i.hostname = e.hostname || "" === e.hostname ? e.hostname : i.hostname, i.search = e.search, i.query = e.query, S = p; else if (p.length) S || (S = []), S.pop(), S = S.concat(p), i.search = e.search, i.query = e.query; else if (!s.isNullOrUndefined(e.search)) return I && (i.hostname = i.host = S.shift(), (E = !!(i.host && i.host.indexOf("@") > 0) && i.host.split("@")) && (i.auth = E.shift(), i.host = i.hostname = E.shift())), i.search = e.search, i.query = e.query, s.isNull(i.pathname) && s.isNull(i.search) || (i.path = (i.pathname ? i.pathname : "") + (i.search ? i.search : "")), i.href = i.format(), i;
        if (!S.length) return i.pathname = null, i.search ? i.path = "/" + i.search : i.path = null, i.href = i.format(), i;
        for (var T = S.slice(-1)[0], M = (i.host || e.host || S.length > 1) && ("." === T || ".." === T) || "" === T, C = 0, P = S.length; P >= 0; P--) "." === (T = S[P]) ? S.splice(P, 1) : ".." === T ? (S.splice(P, 1), C++) : C && (S.splice(P, 1), C--);
        if (!b && !x) for (; C--; C) S.unshift("..");
        !b || "" === S[0] || S[0] && "/" === S[0].charAt(0) || S.unshift(""), M && "/" !== S.join("/").substr(-1) && S.push("");
        var E, O = "" === S[0] || S[0] && "/" === S[0].charAt(0);
        return I && (i.hostname = i.host = O ? "" : S.length ? S.shift() : "", (E = !!(i.host && i.host.indexOf("@") > 0) && i.host.split("@")) && (i.auth = E.shift(), i.host = i.hostname = E.shift())), (b = b || i.host && S.length) && !O && S.unshift(""), S.length ? i.pathname = S.join("/") : (i.pathname = null, i.path = null), s.isNull(i.pathname) && s.isNull(i.search) || (i.path = (i.pathname ? i.pathname : "") + (i.search ? i.search : "")), i.auth = e.auth || i.auth, i.slashes = i.slashes || e.slashes, i.href = i.format(), i;
    }, o.prototype.parseHost = function () {
        var e = this.host, t = r.exec(e);
        t && (":" !== (t = t[0]) && (this.port = t.substr(1)), e = e.substr(0, e.length - t.length)), e && (this.hostname = e);
    };
}, function (e, t, i) {
    (function (e, n) {
        var s;
        !function (o) {
            t && t.nodeType, e && e.nodeType;
            var a = "object" == typeof n && n;
            a.global !== a && a.window !== a && a.self;
            var r, c = 2147483647, l = 36, h = /^xn--/, u = /[^\x20-\x7E]/, d = /[\x2E\u3002\uFF0E\uFF61]/g, f = {overflow: "Overflow: input needs wider integers to process", "not-basic": "Illegal input >= 0x80 (not a basic code point)", "invalid-input": "Invalid input"}, p = Math.floor, g = String.fromCharCode;
            function m(e) {
                throw new RangeError(f[e]);
            }
            function y(e, t) {
                for (var i = e.length, n = []; i--;) n[i] = t(e[i]);
                return n;
            }
            function k(e, t) {
                var i = e.split("@"), n = "";
                return i.length > 1 && (n = i[0] + "@", e = i[1]), n + y((e = e.replace(d, ".")).split("."), t).join(".");
            }
            function w(e) {
                for (var t, i, n = [], s = 0, o = e.length; s < o;) (t = e.charCodeAt(s++)) >= 55296 && t <= 56319 && s < o ? 56320 == (64512 & (i = e.charCodeAt(s++))) ? n.push(((1023 & t) << 10) + (1023 & i) + 65536) : (n.push(t), s--) : n.push(t);
                return n;
            }
            function v(e) {
                return y(e, function (e) {
                    var t = "";
                    return e > 65535 && (t += g((e -= 65536) >>> 10 & 1023 | 55296), e = 56320 | 1023 & e), t + g(e);
                }).join("");
            }
            function b(e) {
                return e - 48 < 10 ? e - 22 : e - 65 < 26 ? e - 65 : e - 97 < 26 ? e - 97 : l;
            }
            function S(e, t, i) {
                var n = 0;
                for (e = i ? p(e / 700) : e >> 1, e += p(e / t); e > 455; n += l) e = p(e / 35);
                return p(n + 36 * e / (e + 38));
            }
            function I(e) {
                var t, i, n, s, o, a, r, h, u, d, f = [], g = e.length, y = 0, k = 128, w = 72;
                for ((i = e.lastIndexOf("-")) < 0 && (i = 0), n = 0; n < i; ++n) e.charCodeAt(n) >= 128 && m("not-basic"), f.push(e.charCodeAt(n));
                for (s = i > 0 ? i + 1 : 0; s < g;) {
                    for (o = y, a = 1, r = l; s >= g && m("invalid-input"), ((h = b(e.charCodeAt(s++))) >= l || h > p((c - y) / a)) && m("overflow"), y += h * a, !(h < (u = r <= w ? 1 : r >= w + 26 ? 26 : r - w)); r += l) a > p(c / (d = l - u)) && m("overflow"), a *= d;
                    w = S(y - o, t = f.length + 1, 0 == o), p(y / t) > c - k && m("overflow"), k += p(y / t), y %= t, f.splice(y++, 0, k);
                }
                return v(f);
            }
            function T(e) {
                var t, i, n, s, o, a, r, h, u, d, f, y, k, v, b, I = [];
                for (y = (e = w(e)).length, t = 128, i = 0, o = 72, a = 0; a < y; ++a) (f = e[a]) < 128 && I.push(g(f));
                for (n = s = I.length, s && I.push("-"); n < y;) {
                    for (r = c, a = 0; a < y; ++a) (f = e[a]) >= t && f < r && (r = f);
                    for (r - t > p((c - i) / (k = n + 1)) && m("overflow"), i += (r - t) * k, t = r, a = 0; a < y; ++a) if ((f = e[a]) < t && ++i > c && m("overflow"), f == t) {
                        for (h = i, u = l; !(h < (d = u <= o ? 1 : u >= o + 26 ? 26 : u - o)); u += l) b = h - d, v = l - d, I.push(g(d + b % v + 22 + 75 * (d + b % v < 26) - 0)), h = p(b / v);
                        I.push(g(h + 22 + 75 * (h < 26) - 0)), o = S(i, k, n == s), i = 0, ++n;
                    }
                    ++i, ++t;
                }
                return I.join("");
            }
            r = {version: "1.4.1", ucs2: {decode: w, encode: v}, decode: I, encode: T, toASCII: function (e) {
                return k(e, function (e) {
                    return u.test(e) ? "xn--" + T(e) : e;
                });
            }, toUnicode: function (e) {
                return k(e, function (e) {
                    return h.test(e) ? I(e.slice(4).toLowerCase()) : e;
                });
            }}, void 0 === (s = function () {
                return r;
            }.call(t, i, t, e)) || (e.exports = s);
        }();
    }.call(this, i(26)(e), i(27)));
}, function (e, t) {
    e.exports = function (e) {
        return e.webpackPolyfill || (e.deprecate = function () {}, e.paths = [], e.children || (e.children = []), Object.defineProperty(e, "loaded", {enumerable: true, get: function () {
            return e.l;
        }}), Object.defineProperty(e, "id", {enumerable: true, get: function () {
            return e.i;
        }}), e.webpackPolyfill = 1), e;
    };
}, function (e, t) {
    var i;
    i = function () {
        return this;
    }();
    try {
        i = i || new Function("return this")();
    } catch (e) {
        "object" == typeof window && (i = window);
    }
    e.exports = i;
}, function (e, t, i) {
    "use strict";
    e.exports = {isString: function (e) {
        return "string" == typeof e;
    }, isObject: function (e) {
        return "object" == typeof e && null !== e;
    }, isNull: function (e) {
        return null === e;
    }, isNullOrUndefined: function (e) {
        return null == e;
    }};
}, function (e, t, i) {
    "use strict";
    t.decode = t.parse = i(30), t.encode = t.stringify = i(31);
}, function (e, t, i) {
    "use strict";
    e.exports = function (e, t, i, o) {
        t = t || "&", i = i || "=";
        var a = {};
        if ("string" != typeof e || 0 === e.length) return a;
        var r = /\+/g;
        e = e.split(t);
        var c = 1e3;
        o && "number" == typeof o.maxKeys && (c = o.maxKeys);
        var l = e.length;
        c > 0 && l > c && (l = c);
        for (var h = 0; h < l; ++h) {
            var u, d, f, p, g = e[h].replace(r, "%20"), m = g.indexOf(i);
            m >= 0 ? (u = g.substr(0, m), d = g.substr(m + 1)) : (u = g, d = ""), f = decodeURIComponent(u), p = decodeURIComponent(d), Object.prototype.hasOwnProperty.call(a, f) ? s(a[f]) ? a[f].push(p) : a[f] = [a[f], p] : a[f] = p;
        }
        return a;
    };
    var s = Array.isArray || function (e) {
        return "[object Array]" === Object.prototype.toString.call(e);
    };
}, function (e, t, i) {
    "use strict";
    var n = function (e) {
        switch (typeof e) {
            case "string":
                return e;
            case "boolean":
                return e ? "true" : "false";
            case "number":
                return isFinite(e) ? e : "";
            default:
                return "";
        }
    };
    e.exports = function (e, t, i, r) {
        return t = t || "&", i = i || "=", null === e && (e = void 0), "object" == typeof e ? o(a(e), function (a) {
            var r = encodeURIComponent(n(a)) + i;
            return s(e[a]) ? o(e[a], function (e) {
                return r + encodeURIComponent(n(e));
            }).join(t) : r + encodeURIComponent(n(e[a]));
        }).join(t) : r ? encodeURIComponent(n(r)) + i + encodeURIComponent(n(e)) : "";
    };
    var s = Array.isArray || function (e) {
        return "[object Array]" === Object.prototype.toString.call(e);
    };
    function o(e, t) {
        if (e.map) return e.map(t);
        for (var i = [], n = 0; n < e.length; n++) i.push(t(e[n], n));
        return i;
    }
    var a = Object.keys || function (e) {
        var t = [];
        for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.push(i);
        return t;
    };
}, function (e, t, i) {
    !function () {
        var t = i(33), n = i(1).utf8, s = i(34), o = i(1).bin, a = function (e, i) {
            e.constructor == String ? e = i && "binary" === i.encoding ? o.stringToBytes(e) : n.stringToBytes(e) : s(e) ? e = Array.prototype.slice.call(e, 0) : Array.isArray(e) || (e = e.toString());
            for (var r = t.bytesToWords(e), c = 8 * e.length, l = 1732584193, h = -271733879, u = -1732584194, d = 271733878, f = 0; f < r.length; f++) r[f] = 16711935 & (r[f] << 8 | r[f] >>> 24) | 4278255360 & (r[f] << 24 | r[f] >>> 8);
            r[c >>> 5] |= 128 << c % 32, r[14 + (c + 64 >>> 9 << 4)] = c;
            var p = a._ff, g = a._gg, m = a._hh, y = a._ii;
            for (f = 0; f < r.length; f += 16) {
                var k = l, w = h, v = u, b = d;
                h = y(h = y(h = y(h = y(h = m(h = m(h = m(h = m(h = g(h = g(h = g(h = g(h = p(h = p(h = p(h = p(h, u = p(u, d = p(d, l = p(l, h, u, d, r[f + 0], 7, -680876936), h, u, r[f + 1], 12, -389564586), l, h, r[f + 2], 17, 606105819), d, l, r[f + 3], 22, -1044525330), u = p(u, d = p(d, l = p(l, h, u, d, r[f + 4], 7, -176418897), h, u, r[f + 5], 12, 1200080426), l, h, r[f + 6], 17, -1473231341), d, l, r[f + 7], 22, -45705983), u = p(u, d = p(d, l = p(l, h, u, d, r[f + 8], 7, 1770035416), h, u, r[f + 9], 12, -1958414417), l, h, r[f + 10], 17, -42063), d, l, r[f + 11], 22, -1990404162), u = p(u, d = p(d, l = p(l, h, u, d, r[f + 12], 7, 1804603682), h, u, r[f + 13], 12, -40341101), l, h, r[f + 14], 17, -1502002290), d, l, r[f + 15], 22, 1236535329), u = g(u, d = g(d, l = g(l, h, u, d, r[f + 1], 5, -165796510), h, u, r[f + 6], 9, -1069501632), l, h, r[f + 11], 14, 643717713), d, l, r[f + 0], 20, -373897302), u = g(u, d = g(d, l = g(l, h, u, d, r[f + 5], 5, -701558691), h, u, r[f + 10], 9, 38016083), l, h, r[f + 15], 14, -660478335), d, l, r[f + 4], 20, -405537848), u = g(u, d = g(d, l = g(l, h, u, d, r[f + 9], 5, 568446438), h, u, r[f + 14], 9, -1019803690), l, h, r[f + 3], 14, -187363961), d, l, r[f + 8], 20, 1163531501), u = g(u, d = g(d, l = g(l, h, u, d, r[f + 13], 5, -1444681467), h, u, r[f + 2], 9, -51403784), l, h, r[f + 7], 14, 1735328473), d, l, r[f + 12], 20, -1926607734), u = m(u, d = m(d, l = m(l, h, u, d, r[f + 5], 4, -378558), h, u, r[f + 8], 11, -2022574463), l, h, r[f + 11], 16, 1839030562), d, l, r[f + 14], 23, -35309556), u = m(u, d = m(d, l = m(l, h, u, d, r[f + 1], 4, -1530992060), h, u, r[f + 4], 11, 1272893353), l, h, r[f + 7], 16, -155497632), d, l, r[f + 10], 23, -1094730640), u = m(u, d = m(d, l = m(l, h, u, d, r[f + 13], 4, 681279174), h, u, r[f + 0], 11, -358537222), l, h, r[f + 3], 16, -722521979), d, l, r[f + 6], 23, 76029189), u = m(u, d = m(d, l = m(l, h, u, d, r[f + 9], 4, -640364487), h, u, r[f + 12], 11, -421815835), l, h, r[f + 15], 16, 530742520), d, l, r[f + 2], 23, -995338651), u = y(u, d = y(d, l = y(l, h, u, d, r[f + 0], 6, -198630844), h, u, r[f + 7], 10, 1126891415), l, h, r[f + 14], 15, -1416354905), d, l, r[f + 5], 21, -57434055), u = y(u, d = y(d, l = y(l, h, u, d, r[f + 12], 6, 1700485571), h, u, r[f + 3], 10, -1894986606), l, h, r[f + 10], 15, -1051523), d, l, r[f + 1], 21, -2054922799), u = y(u, d = y(d, l = y(l, h, u, d, r[f + 8], 6, 1873313359), h, u, r[f + 15], 10, -30611744), l, h, r[f + 6], 15, -1560198380), d, l, r[f + 13], 21, 1309151649), u = y(u, d = y(d, l = y(l, h, u, d, r[f + 4], 6, -145523070), h, u, r[f + 11], 10, -1120210379), l, h, r[f + 2], 15, 718787259), d, l, r[f + 9], 21, -343485551), l = l + k >>> 0, h = h + w >>> 0, u = u + v >>> 0, d = d + b >>> 0;
            }
            return t.endian([l, h, u, d]);
        };
        a._ff = function (e, t, i, n, s, o, a) {
            var r = e + (t & i | ~t & n) + (s >>> 0) + a;
            return (r << o | r >>> 32 - o) + t;
        }, a._gg = function (e, t, i, n, s, o, a) {
            var r = e + (t & n | i & ~n) + (s >>> 0) + a;
            return (r << o | r >>> 32 - o) + t;
        }, a._hh = function (e, t, i, n, s, o, a) {
            var r = e + (t ^ i ^ n) + (s >>> 0) + a;
            return (r << o | r >>> 32 - o) + t;
        }, a._ii = function (e, t, i, n, s, o, a) {
            var r = e + (i ^ (t | ~n)) + (s >>> 0) + a;
            return (r << o | r >>> 32 - o) + t;
        }, a._blocksize = 16, a._digestsize = 16, e.exports = function (e, i) {
            if (null == e) throw new Error("Illegal argument " + e);
            var n = t.wordsToBytes(a(e, i));
            return i && i.asBytes ? n : i && i.asString ? o.bytesToString(n) : t.bytesToHex(n);
        };
    }();
}, function (e, t) {
    !function () {
        var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", i = {rotl: function (e, t) {
            return e << t | e >>> 32 - t;
        }, rotr: function (e, t) {
            return e << 32 - t | e >>> t;
        }, endian: function (e) {
            if (e.constructor == Number) return 16711935 & i.rotl(e, 8) | 4278255360 & i.rotl(e, 24);
            for (var t = 0; t < e.length; t++) e[t] = i.endian(e[t]);
            return e;
        }, randomBytes: function (e) {
            for (var t = []; e > 0; e--) t.push(Math.floor(256 * Math.random()));
            return t;
        }, bytesToWords: function (e) {
            for (var t = [], i = 0, n = 0; i < e.length; i++, n += 8) t[n >>> 5] |= e[i] << 24 - n % 32;
            return t;
        }, wordsToBytes: function (e) {
            for (var t = [], i = 0; i < 32 * e.length; i += 8) t.push(e[i >>> 5] >>> 24 - i % 32 & 255);
            return t;
        }, bytesToHex: function (e) {
            for (var t = [], i = 0; i < e.length; i++) t.push((e[i] >>> 4).toString(16)), t.push((15 & e[i]).toString(16));
            return t.join("");
        }, hexToBytes: function (e) {
            for (var t = [], i = 0; i < e.length; i += 2) t.push(parseInt(e.substr(i, 2), 16));
            return t;
        }, bytesToBase64: function (e) {
            for (var i = [], n = 0; n < e.length; n += 3) for (var s = e[n] << 16 | e[n + 1] << 8 | e[n + 2], o = 0; o < 4; o++) 8 * n + 6 * o <= 8 * e.length ? i.push(t.charAt(s >>> 6 * (3 - o) & 63)) : i.push("=");
            return i.join("");
        }, base64ToBytes: function (e) {
            e = e.replace(/[^A-Z0-9+\/]/gi, "");
            for (var i = [], n = 0, s = 0; n < e.length; s = ++n % 4) 0 != s && i.push((t.indexOf(e.charAt(n - 1)) & Math.pow(2, -2 * s + 8) - 1) << 2 * s | t.indexOf(e.charAt(n)) >>> 6 - 2 * s);
            return i;
        }};
        e.exports = i;
    }();
}, function (e, t) {
    e.exports = function (e) {
        return null != e && (!!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e) || function (e) {
            return "function" == typeof e.readFloatLE && "function" == typeof e.slice && (!!e.slice(0, 0).constructor && "function" == typeof e.slice(0, 0).constructor.isBuffer && e.slice(0, 0).constructor.isBuffer(e.slice(0, 0)));
        }(e) || !!e._isBuffer);
    };
}, function (e, t) {
    e.exports = function (e, t, i, n, s, o, a, r, c) {
        this.aiTypes = [{id: 0, src: "cow_1", killScore: 150, health: 500, weightM: 0.8, speed: 0.00095, turnSpeed: 0.001, scale: 72, drop: ["food", 50]}, {id: 1, src: "pig_1", killScore: 200, health: 800, weightM: 0.6, speed: 0.00085, turnSpeed: 0.001, scale: 72, drop: ["food", 80]}, {id: 2, name: "Bull", src: "bull_2", hostile: true, dmg: 20, killScore: 1e3, health: 1800, weightM: 0.5, speed: 0.00094, turnSpeed: 0.00074, scale: 78, viewRange: 800, chargePlayer: true, drop: ["food", 100]}, {id: 3, name: "Bully", src: "bull_1", hostile: true, dmg: 20, killScore: 2e3, health: 2800, weightM: 0.45, speed: 0.001, turnSpeed: 0.0008, scale: 90, viewRange: 900, chargePlayer: true, drop: ["food", 400]}, {id: 4, name: "Wolf", src: "wolf_1", hostile: true, dmg: 8, killScore: 500, health: 300, weightM: 0.45, speed: 0.001, turnSpeed: 0.002, scale: 84, viewRange: 800, chargePlayer: true, drop: ["food", 200]}, {id: 5, name: "Quack", src: "chicken_1", dmg: 8, killScore: 2e3, noTrap: true, health: 300, weightM: 0.2, speed: 0.0018, turnSpeed: 0.006, scale: 70, drop: ["food", 100]}, {id: 6, name: "MOOSTAFA", nameScale: 50, src: "enemy", hostile: true, dontRun: true, fixedSpawn: true, spawnDelay: 6e4, noTrap: true, colDmg: 100, dmg: 40, killScore: 8e3, health: 18e3, weightM: 0.4, speed: 0.0007, turnSpeed: 0.01, scale: 80, spriteMlt: 1.8, leapForce: 0.9, viewRange: 1e3, hitRange: 210, hitDelay: 1e3, chargePlayer: true, drop: ["food", 100]}, {id: 7, name: "Treasure", hostile: true, nameScale: 35, src: "crate_1", fixedSpawn: true, spawnDelay: 12e4, colDmg: 200, killScore: 5e3, health: 2e4, weightM: 0.1, speed: 0, turnSpeed: 0, scale: 70, spriteMlt: 1}, {id: 8, name: "MOOFIE", src: "wolf_2", hostile: true, fixedSpawn: true, dontRun: true, hitScare: 4, spawnDelay: 3e4, noTrap: true, nameScale: 35, dmg: 10, colDmg: 100, killScore: 3e3, health: 7e3, weightM: 0.45, speed: 0.0015, turnSpeed: 0.002, scale: 90, viewRange: 800, chargePlayer: true, drop: ["food", 1e3]}], this.spawn = function (l, h, u, d) {
            for (var f, p = 0; p < e.length; ++p) if (!e[p].active) {
                f = e[p];
                break;
            }
            return f || (f = new t(e.length, s, i, n, a, o, r, c), e.push(f)), f.init(l, h, u, d, this.aiTypes[d]), f;
        };
    };
}, function (e, t) {
    var i = 2 * Math.PI;
    e.exports = function (e, t, n, s, o, a, r, c) {
        this.sid = e, this.isAI = true, this.nameIndex = o.randInt(0, a.cowNames.length - 1), this.init = function (e, t, i, n, s) {
            this.x = e, this.y = t, this.startX = s.fixedSpawn ? e : null, this.startY = s.fixedSpawn ? t : null, this.xVel = 0, this.yVel = 0, this.zIndex = 0, this.dir = i, this.dirPlus = 0, this.index = n, this.src = s.src, s.name && (this.name = s.name), this.weightM = s.weightM, this.speed = s.speed, this.killScore = s.killScore, this.turnSpeed = s.turnSpeed, this.scale = s.scale, this.maxHealth = s.health, this.leapForce = s.leapForce, this.health = this.maxHealth, this.chargePlayer = s.chargePlayer, this.viewRange = s.viewRange, this.drop = s.drop, this.dmg = s.dmg, this.hostile = s.hostile, this.dontRun = s.dontRun, this.hitRange = s.hitRange, this.hitDelay = s.hitDelay, this.hitScare = s.hitScare, this.spriteMlt = s.spriteMlt, this.nameScale = s.nameScale, this.colDmg = s.colDmg, this.noTrap = s.noTrap, this.spawnDelay = s.spawnDelay, this.hitWait = 0, this.waitCount = 1e3, this.moveCount = 0, this.targetDir = 0, this.active = true, this.alive = true, this.runFrom = null, this.chargeTarget = null, this.dmgOverTime = {};
        };
        var l = 0;
        this.update = function (e) {
            if (this.active) {
                if (this.spawnCounter) return this.spawnCounter -= e, void (this.spawnCounter <= 0 && (this.spawnCounter = 0, this.x = this.startX || o.randInt(0, a.mapScale), this.y = this.startY || o.randInt(0, a.mapScale)));
                (l -= e) <= 0 && (this.dmgOverTime.dmg && (this.changeHealth(-this.dmgOverTime.dmg, this.dmgOverTime.doer), this.dmgOverTime.time -= 1, this.dmgOverTime.time <= 0 && (this.dmgOverTime.dmg = 0)), l = 1e3);
                var s = false, r = 1;
                if (!this.zIndex && !this.lockMove && this.y >= a.mapScale / 2 - a.riverWidth / 2 && this.y <= a.mapScale / 2 + a.riverWidth / 2 && (r = 0.33, this.xVel += a.waterCurrent * e), this.lockMove) this.xVel = 0, this.yVel = 0; else if (this.waitCount > 0) {
                    if (this.waitCount -= e, this.waitCount <= 0) if (this.chargePlayer) {
                        for (var h, u, d, f = 0; f < n.length; ++f) !n[f].alive || n[f].skin && n[f].skin.bullRepel || (d = o.getDistance(this.x, this.y, n[f].x, n[f].y)) <= this.viewRange && (!h || d < u) && (u = d, h = n[f]);
                        h ? (this.chargeTarget = h, this.moveCount = o.randInt(8e3, 12e3)) : (this.moveCount = o.randInt(1e3, 2e3), this.targetDir = o.randFloat(-Math.PI, Math.PI));
                    } else this.moveCount = o.randInt(4e3, 1e4), this.targetDir = o.randFloat(-Math.PI, Math.PI);
                } else if (this.moveCount > 0) {
                    var p = this.speed * r;
                    if (this.runFrom && this.runFrom.active && (!this.runFrom.isPlayer || this.runFrom.alive) ? (this.targetDir = o.getDirection(this.x, this.y, this.runFrom.x, this.runFrom.y), p *= 1.42) : this.chargeTarget && this.chargeTarget.alive && (this.targetDir = o.getDirection(this.chargeTarget.x, this.chargeTarget.y, this.x, this.y), p *= 1.75, s = true), this.hitWait && (p *= 0.3), this.dir != this.targetDir) {
                        this.dir %= i;
                        var g = (this.dir - this.targetDir + i) % i, m = Math.min(Math.abs(g - i), g, this.turnSpeed * e), y = g - Math.PI >= 0 ? 1 : -1;
                        this.dir += y * m + i;
                    }
                    this.dir %= i, this.xVel += p * e * Math.cos(this.dir), this.yVel += p * e * Math.sin(this.dir), this.moveCount -= e, this.moveCount <= 0 && (this.runFrom = null, this.chargeTarget = null, this.waitCount = this.hostile ? 1500 : o.randInt(1500, 6e3));
                }
                this.zIndex = 0, this.lockMove = false;
                var k = o.getDistance(0, 0, this.xVel * e, this.yVel * e), w = Math.min(4, Math.max(1, Math.round(k / 40))), v = 1 / w;
                for (f = 0; f < w; ++f) {
                    this.xVel && (this.x += this.xVel * e * v), this.yVel && (this.y += this.yVel * e * v), C = t.getGridArrays(this.x, this.y, this.scale);
                    for (var b = 0; b < C.length; ++b) for (var x = 0; x < C[b].length; ++x) C[b][x].active && t.checkCollision(this, C[b][x], v);
                }
                var S, I, T, M = false;
                if (this.hitWait > 0 && (this.hitWait -= e, this.hitWait <= 0)) {
                    M = true, this.hitWait = 0, this.leapForce && !o.randInt(0, 2) && (this.xVel += this.leapForce * Math.cos(this.dir), this.yVel += this.leapForce * Math.sin(this.dir));
                    for (var C = t.getGridArrays(this.x, this.y, this.hitRange), P = 0; P < C.length; ++P) for (b = 0; b < C[P].length; ++b) (S = C[P][b]).health && (I = o.getDistance(this.x, this.y, S.x, S.y)) < S.scale + this.hitRange && (S.changeHealth(5 * -this.dmg) && t.disableObj(S), t.hitObj(S, o.getDirection(this.x, this.y, S.x, S.y)));
                    for (b = 0; b < n.length; ++b) n[b].canSee(this) && c.send(n[b].id, "aa", this.sid);
                }
                if (s || M) for (f = 0; f < n.length; ++f) (S = n[f]) && S.alive && (I = o.getDistance(this.x, this.y, S.x, S.y), this.hitRange ? !this.hitWait && I <= this.hitRange + S.scale && (M ? (T = o.getDirection(S.x, S.y, this.x, this.y), S.changeHealth(-this.dmg), S.xVel += 0.6 * Math.cos(T), S.yVel += 0.6 * Math.sin(T), this.runFrom = null, this.chargeTarget = null, this.waitCount = 3e3, this.hitWait = o.randInt(0, 2) ? 0 : 600) : this.hitWait = this.hitDelay) : I <= this.scale + S.scale && (T = o.getDirection(S.x, S.y, this.x, this.y), S.changeHealth(-this.dmg), S.xVel += 0.55 * Math.cos(T), S.yVel += 0.55 * Math.sin(T)));
                this.xVel && (this.xVel *= Math.pow(a.playerDecel, e)), this.yVel && (this.yVel *= Math.pow(a.playerDecel, e));
                var E = this.scale;
                this.x - E < 0 ? (this.x = E, this.xVel = 0) : this.x + E > a.mapScale && (this.x = a.mapScale - E, this.xVel = 0), this.y - E < 0 ? (this.y = E, this.yVel = 0) : this.y + E > a.mapScale && (this.y = a.mapScale - E, this.yVel = 0);
            }
        }, this.canSee = function (e) {
            if (!e) return false;
            if (e.skin && e.skin.invisTimer && e.noMovTimer >= e.skin.invisTimer) return false;
            var t = Math.abs(e.x - this.x) - e.scale, i = Math.abs(e.y - this.y) - e.scale;
            return t <= a.maxScreenWidth / 2 * 1.3 && i <= a.maxScreenHeight / 2 * 1.3;
        };
        var h = 0, u = 0;
        this.animate = function (e) {
            this.animTime > 0 && (this.animTime -= e, this.animTime <= 0 ? (this.animTime = 0, this.dirPlus = 0, h = 0, u = 0) : 0 == u ? (h += e / (this.animSpeed * a.hitReturnRatio), this.dirPlus = o.lerp(0, this.targetAngle, Math.min(1, h)), h >= 1 && (h = 1, u = 1)) : (h -= e / (this.animSpeed * (1 - a.hitReturnRatio)), this.dirPlus = o.lerp(0, this.targetAngle, Math.max(0, h))));
        }, this.startAnim = function () {
            this.animTime = this.animSpeed = 600, this.targetAngle = 0.8 * Math.PI, h = 0, u = 0;
        }, this.changeHealth = function (e, t, i) {
            if (this.active && (this.health += e, i && (this.hitScare && !o.randInt(0, this.hitScare) ? (this.runFrom = i, this.waitCount = 0, this.moveCount = 2e3) : this.hostile && this.chargePlayer && i.isPlayer ? (this.chargeTarget = i, this.waitCount = 0, this.moveCount = 8e3) : this.dontRun || (this.runFrom = i, this.waitCount = 0, this.moveCount = 2e3)), e < 0 && this.hitRange && o.randInt(0, 1) && (this.hitWait = 500), t && t.canSee(this) && e < 0 && c.send(t.id, "t", Math.round(this.x), Math.round(this.y), Math.round(-e), 1), this.health <= 0 && (this.spawnDelay ? (this.spawnCounter = this.spawnDelay, this.x = -1000000, this.y = -1000000) : (this.x = this.startX || o.randInt(0, a.mapScale), this.y = this.startY || o.randInt(0, a.mapScale)), this.health = this.maxHealth, this.runFrom = null, t && (r(t, this.killScore), this.drop)))) for (var n = 0; n < this.drop.length;) t.addResource(a.resourceTypes.indexOf(this.drop[n]), this.drop[n + 1]), n += 2;
        };
    };
}, function (e, t, i) {
    "use strict";
    i.r(t);
    var n, s, o, a = 4294967295;
    function r(e, t, i) {
        var n = Math.floor(i / 4294967296), s = i;
        e.setUint32(t, n), e.setUint32(t + 4, s);
    }
    var l = ("undefined" == typeof process || "never" !== (null === (n = null === process || void 0 === process ? void 0 : process.env) || void 0 === n ? void 0 : n.TEXT_ENCODING)) && "undefined" != typeof TextEncoder && "undefined" != typeof TextDecoder;
    function h(e) {
        for (var t = e.length, i = 0, n = 0; n < t;) {
            var s = e.charCodeAt(n++);
            if (0 != (4294967168 & s)) if (0 == (4294965248 & s)) i += 2; else {
                if (s >= 55296 && s <= 56319 && n < t) {
                    var o = e.charCodeAt(n);
                    56320 == (64512 & o) && (++n, s = ((1023 & s) << 10) + (1023 & o) + 65536);
                }
                i += 0 == (4294901760 & s) ? 3 : 4;
            } else i++;
        }
        return i;
    }
    var u = l ? new TextEncoder : void 0, d = l ? "undefined" != typeof process && "force" !== (null === (s = null === process || void 0 === process ? void 0 : process.env) || void 0 === s ? void 0 : s.TEXT_ENCODING) ? 200 : 0 : a, f = (null == u ? void 0 : u.encodeInto) ? function (e, t, i) {
        u.encodeInto(e, t.subarray(i));
    } : function (e, t, i) {
        t.set(u.encode(e), i);
    };
    function p(e, t, i) {
        for (var n = t, s = n + i, o = [], a = ""; n < s;) {
            var r = e[n++];
            if (0 == (128 & r)) o.push(r); else if (192 == (224 & r)) {
                var c = 63 & e[n++];
                o.push((31 & r) << 6 | c);
            } else if (224 == (240 & r)) {
                c = 63 & e[n++];
                var l = 63 & e[n++];
                o.push((31 & r) << 12 | c << 6 | l);
            } else if (240 == (248 & r)) {
                var h = (7 & r) << 18 | (c = 63 & e[n++]) << 12 | (l = 63 & e[n++]) << 6 | 63 & e[n++];
                h > 65535 && (h -= 65536, o.push(h >>> 10 & 1023 | 55296), h = 56320 | 1023 & h), o.push(h);
            } else o.push(r);
            o.length >= 4096 && (a += String.fromCharCode.apply(String, o), o.length = 0);
        }
        return o.length > 0 && (a += String.fromCharCode.apply(String, o)), a;
    }
    var g = l ? new TextDecoder : null, m = l ? "undefined" != typeof process && "force" !== (null === (o = null === process || void 0 === process ? void 0 : process.env) || void 0 === o ? void 0 : o.TEXT_DECODER) ? 200 : 0 : a, y = function (e, t) {
        this.type = e, this.data = t;
    }, k = function () {
        var e = function (t, i) {
            return (e = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
                e.__proto__ = t;
            } || function (e, t) {
                for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
            })(t, i);
        };
        return function (t, i) {
            if ("function" != typeof i && null !== i) throw new TypeError("Class extends value " + String(i) + " is not a constructor or null");
            function n() {
                this.constructor = t;
            }
            e(t, i), t.prototype = null === i ? Object.create(i) : (n.prototype = i.prototype, new n);
        };
    }(), w = function (e) {
        function t(i) {
            var n = e.call(this, i) || this, s = Object.create(t.prototype);
            return Object.setPrototypeOf(n, s), Object.defineProperty(n, "name", {configurable: true, enumerable: false, value: t.name}), n;
        }
        return k(t, e), t;
    }(Error);
    function v(e) {
        var t, i = e.sec, n = e.nsec;
        if (i >= 0 && n >= 0 && i <= 17179869183) {
            if (0 === n && i <= 4294967295) {
                var s = new Uint8Array(4);
                return (t = new DataView(s.buffer)).setUint32(0, i), s;
            }
            var o = i / 4294967296, a = 4294967295 & i;
            return s = new Uint8Array(8), (t = new DataView(s.buffer)).setUint32(0, n << 2 | 3 & o), t.setUint32(4, a), s;
        }
        return s = new Uint8Array(12), (t = new DataView(s.buffer)).setUint32(0, n), r(t, 4, i), s;
    }
    function b(e) {
        var t = e.getTime(), i = Math.floor(t / 1e3), n = 1e6 * (t - 1e3 * i), s = Math.floor(n / 1e9);
        return {sec: i + s, nsec: n - 1e9 * s};
    }
    function x(e) {
        return e instanceof Date ? v(b(e)) : null;
    }
    function S(e) {
        var t = new DataView(e.buffer, e.byteOffset, e.byteLength);
        switch (e.byteLength) {
            case 4:
                return {sec: t.getUint32(0), nsec: 0};
            case 8:
                var i = t.getUint32(0);
                return {sec: 4294967296 * (3 & i) + t.getUint32(4), nsec: i >>> 2};
            case 12:
                return {sec: 4294967296 * t.getInt32(4) + t.getUint32(8), nsec: t.getUint32(0)};
            default:
                throw new w("Unrecognized data size for timestamp (expected 4, 8, or 12): ".concat(e.length));
        }
    }
    function I(e) {
        var t = S(e);
        return new Date(1e3 * t.sec + t.nsec / 1e6);
    }
    var T = {type: -1, encode: x, decode: I}, M = function () {
        function e() {
            this.builtInEncoders = [], this.builtInDecoders = [], this.encoders = [], this.decoders = [], this.register(T);
        }
        return e.prototype.register = function (e) {
            var t = e.type, i = e.encode, n = e.decode;
            if (t >= 0) this.encoders[t] = i, this.decoders[t] = n; else {
                var s = 1 + t;
                this.builtInEncoders[s] = i, this.builtInDecoders[s] = n;
            }
        }, e.prototype.tryToEncode = function (e, t) {
            for (var i = 0; i < this.builtInEncoders.length; i++) if (null != (n = this.builtInEncoders[i]) && null != (s = n(e, t))) return new y(-1 - i, s);
            for (i = 0; i < this.encoders.length; i++) {
                var n, s;
                if (null != (n = this.encoders[i]) && null != (s = n(e, t))) return new y(i, s);
            }
            return e instanceof y ? e : null;
        }, e.prototype.decode = function (e, t, i) {
            var n = t < 0 ? this.builtInDecoders[-1 - t] : this.decoders[t];
            return n ? n(e, t, i) : new y(t, e);
        }, e.defaultCodec = new e, e;
    }();
    function C(e) {
        return e instanceof Uint8Array ? e : ArrayBuffer.isView(e) ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength) : e instanceof ArrayBuffer ? new Uint8Array(e) : Uint8Array.from(e);
    }
    var P = function () {
        function e(e, t, i, n, s, o, a, r) {
            void 0 === e && (e = M.defaultCodec), void 0 === t && (t = void 0), void 0 === i && (i = 100), void 0 === n && (n = 2048), void 0 === s && (s = false), void 0 === o && (o = false), void 0 === a && (a = false), void 0 === r && (r = false), this.extensionCodec = e, this.context = t, this.maxDepth = i, this.initialBufferSize = n, this.sortKeys = s, this.forceFloat32 = o, this.ignoreUndefined = a, this.forceIntegerToFloat = r, this.pos = 0, this.view = new DataView(new ArrayBuffer(this.initialBufferSize)), this.bytes = new Uint8Array(this.view.buffer);
        }
        return e.prototype.reinitializeState = function () {
            this.pos = 0;
        }, e.prototype.encodeSharedRef = function (e) {
            return this.reinitializeState(), this.doEncode(e, 1), this.bytes.subarray(0, this.pos);
        }, e.prototype.encode = function (e) {
            return this.reinitializeState(), this.doEncode(e, 1), this.bytes.slice(0, this.pos);
        }, e.prototype.doEncode = function (e, t) {
            if (t > this.maxDepth) throw new Error("Too deep objects in depth ".concat(t));
            null == e ? this.encodeNil() : "boolean" == typeof e ? this.encodeBoolean(e) : "number" == typeof e ? this.encodeNumber(e) : "string" == typeof e ? this.encodeString(e) : this.encodeObject(e, t);
        }, e.prototype.ensureBufferSizeToWrite = function (e) {
            var t = this.pos + e;
            this.view.byteLength < t && this.resizeBuffer(2 * t);
        }, e.prototype.resizeBuffer = function (e) {
            var t = new ArrayBuffer(e), i = new Uint8Array(t), n = new DataView(t);
            i.set(this.bytes), this.view = n, this.bytes = i;
        }, e.prototype.encodeNil = function () {
            this.writeU8(192);
        }, e.prototype.encodeBoolean = function (e) {
            false === e ? this.writeU8(194) : this.writeU8(195);
        }, e.prototype.encodeNumber = function (e) {
            Number.isSafeInteger(e) && !this.forceIntegerToFloat ? e >= 0 ? e < 128 ? this.writeU8(e) : e < 256 ? (this.writeU8(204), this.writeU8(e)) : e < 65536 ? (this.writeU8(205), this.writeU16(e)) : e < 4294967296 ? (this.writeU8(206), this.writeU32(e)) : (this.writeU8(207), this.writeU64(e)) : e >= -32 ? this.writeU8(224 | e + 32) : e >= -128 ? (this.writeU8(208), this.writeI8(e)) : e >= -32768 ? (this.writeU8(209), this.writeI16(e)) : e >= -2147483648 ? (this.writeU8(210), this.writeI32(e)) : (this.writeU8(211), this.writeI64(e)) : this.forceFloat32 ? (this.writeU8(202), this.writeF32(e)) : (this.writeU8(203), this.writeF64(e));
        }, e.prototype.writeStringHeader = function (e) {
            if (e < 32) this.writeU8(160 + e); else if (e < 256) this.writeU8(217), this.writeU8(e); else if (e < 65536) this.writeU8(218), this.writeU16(e); else {
                if (!(e < 4294967296)) throw new Error("Too long string: ".concat(e, " bytes in UTF-8"));
                this.writeU8(219), this.writeU32(e);
            }
        }, e.prototype.encodeString = function (e) {
            if (e.length > d) {
                var t = h(e);
                this.ensureBufferSizeToWrite(5 + t), this.writeStringHeader(t), f(e, this.bytes, this.pos), this.pos += t;
            } else t = h(e), this.ensureBufferSizeToWrite(5 + t), this.writeStringHeader(t), function (e, t, i) {
                for (var n = e.length, s = i, o = 0; o < n;) {
                    var a = e.charCodeAt(o++);
                    if (0 != (4294967168 & a)) {
                        if (0 == (4294965248 & a)) t[s++] = a >> 6 & 31 | 192; else {
                            if (a >= 55296 && a <= 56319 && o < n) {
                                var r = e.charCodeAt(o);
                                56320 == (64512 & r) && (++o, a = ((1023 & a) << 10) + (1023 & r) + 65536);
                            }
                            0 == (4294901760 & a) ? (t[s++] = a >> 12 & 15 | 224, t[s++] = a >> 6 & 63 | 128) : (t[s++] = a >> 18 & 7 | 240, t[s++] = a >> 12 & 63 | 128, t[s++] = a >> 6 & 63 | 128);
                        }
                        t[s++] = 63 & a | 128;
                    } else t[s++] = a;
                }
            }(e, this.bytes, this.pos), this.pos += t;
        }, e.prototype.encodeObject = function (e, t) {
            var i = this.extensionCodec.tryToEncode(e, this.context);
            if (null != i) this.encodeExtension(i); else if (Array.isArray(e)) this.encodeArray(e, t); else if (ArrayBuffer.isView(e)) this.encodeBinary(e); else {
                if ("object" != typeof e) throw new Error("Unrecognized object: ".concat(Object.prototype.toString.apply(e)));
                this.encodeMap(e, t);
            }
        }, e.prototype.encodeBinary = function (e) {
            var t = e.byteLength;
            if (t < 256) this.writeU8(196), this.writeU8(t); else if (t < 65536) this.writeU8(197), this.writeU16(t); else {
                if (!(t < 4294967296)) throw new Error("Too large binary: ".concat(t));
                this.writeU8(198), this.writeU32(t);
            }
            var i = C(e);
            this.writeU8a(i);
        }, e.prototype.encodeArray = function (e, t) {
            var i = e.length;
            if (i < 16) this.writeU8(144 + i); else if (i < 65536) this.writeU8(220), this.writeU16(i); else {
                if (!(i < 4294967296)) throw new Error("Too large array: ".concat(i));
                this.writeU8(221), this.writeU32(i);
            }
            for (var n = 0, s = e; n < s.length; n++) {
                var o = s[n];
                this.doEncode(o, t + 1);
            }
        }, e.prototype.countWithoutUndefined = function (e, t) {
            for (var i = 0, n = 0, s = t; n < s.length; n++) void 0 !== e[s[n]] && i++;
            return i;
        }, e.prototype.encodeMap = function (e, t) {
            var i = Object.keys(e);
            this.sortKeys && i.sort();
            var n = this.ignoreUndefined ? this.countWithoutUndefined(e, i) : i.length;
            if (n < 16) this.writeU8(128 + n); else if (n < 65536) this.writeU8(222), this.writeU16(n); else {
                if (!(n < 4294967296)) throw new Error("Too large map object: ".concat(n));
                this.writeU8(223), this.writeU32(n);
            }
            for (var s = 0, o = i; s < o.length; s++) {
                var a = o[s], r = e[a];
                this.ignoreUndefined && void 0 === r || (this.encodeString(a), this.doEncode(r, t + 1));
            }
        }, e.prototype.encodeExtension = function (e) {
            var t = e.data.length;
            if (1 === t) this.writeU8(212); else if (2 === t) this.writeU8(213); else if (4 === t) this.writeU8(214); else if (8 === t) this.writeU8(215); else if (16 === t) this.writeU8(216); else if (t < 256) this.writeU8(199), this.writeU8(t); else if (t < 65536) this.writeU8(200), this.writeU16(t); else {
                if (!(t < 4294967296)) throw new Error("Too large extension object: ".concat(t));
                this.writeU8(201), this.writeU32(t);
            }
            this.writeI8(e.type), this.writeU8a(e.data);
        }, e.prototype.writeU8 = function (e) {
            this.ensureBufferSizeToWrite(1), this.view.setUint8(this.pos, e), this.pos++;
        }, e.prototype.writeU8a = function (e) {
            var t = e.length;
            this.ensureBufferSizeToWrite(t), this.bytes.set(e, this.pos), this.pos += t;
        }, e.prototype.writeI8 = function (e) {
            this.ensureBufferSizeToWrite(1), this.view.setInt8(this.pos, e), this.pos++;
        }, e.prototype.writeU16 = function (e) {
            this.ensureBufferSizeToWrite(2), this.view.setUint16(this.pos, e), this.pos += 2;
        }, e.prototype.writeI16 = function (e) {
            this.ensureBufferSizeToWrite(2), this.view.setInt16(this.pos, e), this.pos += 2;
        }, e.prototype.writeU32 = function (e) {
            this.ensureBufferSizeToWrite(4), this.view.setUint32(this.pos, e), this.pos += 4;
        }, e.prototype.writeI32 = function (e) {
            this.ensureBufferSizeToWrite(4), this.view.setInt32(this.pos, e), this.pos += 4;
        }, e.prototype.writeF32 = function (e) {
            this.ensureBufferSizeToWrite(4), this.view.setFloat32(this.pos, e), this.pos += 4;
        }, e.prototype.writeF64 = function (e) {
            this.ensureBufferSizeToWrite(8), this.view.setFloat64(this.pos, e), this.pos += 8;
        }, e.prototype.writeU64 = function (e) {
            this.ensureBufferSizeToWrite(8), function (e, t, i) {
                var n = i / 4294967296, s = i;
                e.setUint32(t, n), e.setUint32(t + 4, s);
            }(this.view, this.pos, e), this.pos += 8;
        }, e.prototype.writeI64 = function (e) {
            this.ensureBufferSizeToWrite(8), r(this.view, this.pos, e), this.pos += 8;
        }, e;
    }(), E = {};
    var j = function () {
        function e(e, t) {
            void 0 === e && (e = 16), void 0 === t && (t = 16), this.maxKeyLength = e, this.maxLengthPerKey = t, this.hit = 0, this.miss = 0, this.caches = [];
            for (var i = 0; i < this.maxKeyLength; i++) this.caches.push([]);
        }
        return e.prototype.canBeCached = function (e) {
            return e > 0 && e <= this.maxKeyLength;
        }, e.prototype.find = function (e, t, i) {
            e: for (var n = 0, s = this.caches[i - 1]; n < s.length; n++) {
                for (var o = s[n], a = o.bytes, r = 0; r < i; r++) if (a[r] !== e[t + r]) continue e;
                return o.str;
            }
            return null;
        }, e.prototype.store = function (e, t) {
            var i = this.caches[e.length - 1], n = {bytes: e, str: t};
            i.length >= this.maxLengthPerKey ? i[Math.random() * i.length | 0] = n : i.push(n);
        }, e.prototype.decode = function (e, t, i) {
            var n = this.find(e, t, i);
            if (null != n) return this.hit++, n;
            this.miss++;
            var s = p(e, t, i), o = Uint8Array.prototype.slice.call(e, t, t + i);
            return this.store(o, s), s;
        }, e;
    }(), A = function (e, t) {
        var i, n, s, o, a = {label: 0, sent: function () {
            if (1 & s[0]) throw s[1];
            return s[1];
        }, trys: [], ops: []};
        return o = {next: r(0), throw: r(1), return: r(2)}, "function" == typeof Symbol && (o[Symbol.iterator] = function () {
            return this;
        }), o;
        function r(o) {
            return function (r) {
                return function (o) {
                    if (i) throw new TypeError("Generator is already executing.");
                    for (; a;) try {
                        if (i = 1, n && (s = 2 & o[0] ? n.return : o[0] ? n.throw || ((s = n.return) && s.call(n), 0) : n.next) && !(s = s.call(n, o[1])).done) return s;
                        switch (n = 0, s && (o = [2 & o[0], s.value]), o[0]) {
                            case 0:
                            case 1:
                                s = o;
                                break;
                            case 4:
                                return a.label++, {value: o[1], done: false};
                            case 5:
                                a.label++, n = o[1], o = [0];
                                continue;
                            case 7:
                                o = a.ops.pop(), a.trys.pop();
                                continue;
                            default:
                                if (!(s = (s = a.trys).length > 0 && s[s.length - 1]) && (6 === o[0] || 2 === o[0])) {
                                    a = 0;
                                    continue;
                                }
                                if (3 === o[0] && (!s || o[1] > s[0] && o[1] < s[3])) {
                                    a.label = o[1];
                                    break;
                                }
                                if (6 === o[0] && a.label < s[1]) {
                                    a.label = s[1], s = o;
                                    break;
                                }
                                if (s && a.label < s[2]) {
                                    a.label = s[2], a.ops.push(o);
                                    break;
                                }
                                s[2] && a.ops.pop(), a.trys.pop();
                                continue;
                        }
                        o = t.call(e, a);
                    } catch (e) {
                        o = [6, e], n = 0;
                    } finally {
                        i = s = 0;
                    }
                    if (5 & o[0]) throw o[1];
                    return {value: o[0] ? o[1] : void 0, done: true};
                }([o, r]);
            };
        }
    }, D = function (e) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var t, i = e[Symbol.asyncIterator];
        return i ? i.call(e) : (e = "function" == typeof __values ? __values(e) : e[Symbol.iterator](), t = {}, n("next"), n("throw"), n("return"), t[Symbol.asyncIterator] = function () {
            return this;
        }, t);
        function n(i) {
            t[i] = e[i] && function (t) {
                return new Promise(function (n, s) {
                    !function (e, t, i, n) {
                        Promise.resolve(n).then(function (t) {
                            e({value: t, done: i});
                        }, t);
                    }(n, s, (t = e[i](t)).done, t.value);
                });
            };
        }
    }, U = function (e) {
        return this instanceof U ? (this.v = e, this) : new U(e);
    }, R = function (e, t, i) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var n, s = i.apply(e, t || []), o = [];
        return n = {}, a("next"), a("throw"), a("return"), n[Symbol.asyncIterator] = function () {
            return this;
        }, n;
        function a(e) {
            s[e] && (n[e] = function (t) {
                return new Promise(function (i, n) {
                    o.push([e, t, i, n]) > 1 || r(e, t);
                });
            });
        }
        function r(e, t) {
            try {
                !function (e) {
                    e.value instanceof U ? Promise.resolve(e.value.v).then(c, l) : h(o[0][2], e);
                }(s[e](t));
            } catch (e) {
                h(o[0][3], e);
            }
        }
        function c(e) {
            r("next", e);
        }
        function l(e) {
            r("throw", e);
        }
        function h(e, t) {
            e(t), o.shift(), o.length && r(o[0][0], o[0][1]);
        }
    }, L = function (e) {
        var t = typeof e;
        return "string" === t || "number" === t;
    }, z = new DataView(new ArrayBuffer(0)), _ = new Uint8Array(z.buffer), F = function () {
        try {
            z.getInt8(0);
        } catch (e) {
            return e.constructor;
        }
        throw new Error("never reached");
    }(), H = new F("Insufficient data"), V = new j, q = function () {
        function e(e, t, i, n, s, o, r, c) {
            void 0 === e && (e = M.defaultCodec), void 0 === t && (t = void 0), void 0 === i && (i = a), void 0 === n && (n = a), void 0 === s && (s = a), void 0 === o && (o = a), void 0 === r && (r = a), void 0 === c && (c = V), this.extensionCodec = e, this.context = t, this.maxStrLength = i, this.maxBinLength = n, this.maxArrayLength = s, this.maxMapLength = o, this.maxExtLength = r, this.keyDecoder = c, this.totalPos = 0, this.pos = 0, this.view = z, this.bytes = _, this.headByte = -1, this.stack = [];
        }
        return e.prototype.reinitializeState = function () {
            this.totalPos = 0, this.headByte = -1, this.stack.length = 0;
        }, e.prototype.setBuffer = function (e) {
            this.bytes = C(e), this.view = function (e) {
                if (e instanceof ArrayBuffer) return new DataView(e);
                var t = C(e);
                return new DataView(t.buffer, t.byteOffset, t.byteLength);
            }(this.bytes), this.pos = 0;
        }, e.prototype.appendBuffer = function (e) {
            if (-1 !== this.headByte || this.hasRemaining(1)) {
                var t = this.bytes.subarray(this.pos), i = C(e), n = new Uint8Array(t.length + i.length);
                n.set(t), n.set(i, t.length), this.setBuffer(n);
            } else this.setBuffer(e);
        }, e.prototype.hasRemaining = function (e) {
            return this.view.byteLength - this.pos >= e;
        }, e.prototype.createExtraByteError = function (e) {
            var t = this.view, i = this.pos;
            return new RangeError("Extra ".concat(t.byteLength - i, " of ").concat(t.byteLength, " byte(s) found at buffer[").concat(e, "]"));
        }, e.prototype.decode = function (e) {
            this.reinitializeState(), this.setBuffer(e);
            var t = this.doDecodeSync();
            if (this.hasRemaining(1)) throw this.createExtraByteError(this.pos);
            return t;
        }, e.prototype.decodeMulti = function (e) {
            return A(this, function (t) {
                switch (t.label) {
                    case 0:
                        this.reinitializeState(), this.setBuffer(e), t.label = 1;
                    case 1:
                        return this.hasRemaining(1) ? [4, this.doDecodeSync()] : [3, 3];
                    case 2:
                        return t.sent(), [3, 1];
                    case 3:
                        return [2];
                }
            });
        }, e.prototype.decodeAsync = function (e) {
            var t, i, n, s;
            return function (e, t, i, n) {
                return new (i || (i = Promise))(function (s, o) {
                    function a(e) {
                        try {
                            4294967296 * n.next(e).getInt32(t) + n.next(e).getUint32(t + 4);
                        } catch (e) {
                            o(e);
                        }
                    }
                    function r(e) {
                        try {
                            4294967296 * n.throw(e).getInt32(t) + n.throw(e).getUint32(t + 4);
                        } catch (e) {
                            o(e);
                        }
                    }
                    function c(e) {
                        e.done ? s(e.value) : function (e) {
                            return e instanceof i ? e : new i(function (t) {
                                t(e);
                            });
                        }(e.value).then(a, r);
                    }
                    4294967296 * (n = n.apply(e, t || [])).next().getInt32(t) + (n = n.apply(e, t || [])).next().getUint32(t + 4);
                });
            }(this, void 0, void 0, function () {
                var o, a, r, c, l, h, u, d;
                return A(this, function (f) {
                    switch (f.label) {
                        case 0:
                            o = false, f.label = 1;
                        case 1:
                            f.trys.push([1, 6, 7, 12]), t = D(e), f.label = 2;
                        case 2:
                            return [4, t.next()];
                        case 3:
                            if ((i = f.sent()).done) return [3, 5];
                            if (r = i.value, o) throw this.createExtraByteError(this.totalPos);
                            this.appendBuffer(r);
                            try {
                                a = this.doDecodeSync(), o = true;
                            } catch (e) {
                                if (!(e instanceof F)) throw e;
                            }
                            this.totalPos += this.pos, f.label = 4;
                        case 4:
                            return [3, 2];
                        case 5:
                            return [3, 12];
                        case 6:
                            return c = f.sent(), n = {error: c}, [3, 12];
                        case 7:
                            return f.trys.push([7, , 10, 11]), i && !i.done && (s = t.return) ? [4, s.call(t)] : [3, 9];
                        case 8:
                            f.sent(), f.label = 9;
                        case 9:
                            return [3, 11];
                        case 10:
                            if (n) throw n.error;
                            return [7];
                        case 11:
                            return [7];
                        case 12:
                            if (o) {
                                if (this.hasRemaining(1)) throw this.createExtraByteError(this.totalPos);
                                return [2, a];
                            }
                            throw h = (l = this).headByte, u = l.pos, d = l.totalPos, new RangeError("Insufficient data in parsing ".concat("".concat(h < 0 ? "-" : "", "0x").concat(Math.abs(h).toString(16).padStart(2, "0")), " at ").concat(d, " (").concat(u, " in the current buffer)"));
                    }
                });
            });
        }, e.prototype.decodeArrayStream = function (e) {
            return this.decodeMultiAsync(e, true);
        }, e.prototype.decodeStream = function (e) {
            return this.decodeMultiAsync(e, false);
        }, e.prototype.decodeMultiAsync = function (e, t) {
            return R(this, arguments, function () {
                var i, n, s, o, a, r, c, l, h;
                return A(this, function (u) {
                    switch (u.label) {
                        case 0:
                            i = t, n = -1, u.label = 1;
                        case 1:
                            u.trys.push([1, 13, 14, 19]), s = D(e), u.label = 2;
                        case 2:
                            return [4, U(s.next())];
                        case 3:
                            if ((o = u.sent()).done) return [3, 12];
                            if (a = o.value, t && 0 === n) throw this.createExtraByteError(this.totalPos);
                            this.appendBuffer(a), i && (n = this.readArraySize(), i = false, this.complete()), u.label = 4;
                        case 4:
                            u.trys.push([4, 9, , 10]), u.label = 5;
                        case 5:
                            return [4, U(this.doDecodeSync())];
                        case 6:
                            return [4, u.sent()];
                        case 7:
                            return u.sent(), 0 == --n ? [3, 8] : [3, 5];
                        case 8:
                            return [3, 10];
                        case 9:
                            if (!((r = u.sent()) instanceof F)) throw r;
                            return [3, 10];
                        case 10:
                            this.totalPos += this.pos, u.label = 11;
                        case 11:
                            return [3, 2];
                        case 12:
                            return [3, 19];
                        case 13:
                            return c = u.sent(), l = {error: c}, [3, 19];
                        case 14:
                            return u.trys.push([14, , 17, 18]), o && !o.done && (h = s.return) ? [4, U(h.call(s))] : [3, 16];
                        case 15:
                            u.sent(), u.label = 16;
                        case 16:
                            return [3, 18];
                        case 17:
                            if (l) throw l.error;
                            return [7];
                        case 18:
                            return [7];
                        case 19:
                            return [2];
                    }
                });
            });
        }, e.prototype.doDecodeSync = function () {
            e: for (;;) {
                var e = this.readHeadByte(), t = void 0;
                if (e >= 224) t = e - 256; else if (e < 192) if (e < 128) t = e; else if (e < 144) {
                    if (0 != (n = e - 128)) {
                        this.pushMapState(n), this.complete();
                        continue e;
                    }
                    t = {};
                } else if (e < 160) {
                    if (0 != (n = e - 144)) {
                        this.pushArrayState(n), this.complete();
                        continue e;
                    }
                    t = [];
                } else {
                    var i = e - 160;
                    t = this.decodeUtf8String(i, 0);
                } else if (192 === e) t = null; else if (194 === e) t = false; else if (195 === e) t = true; else if (202 === e) t = this.readF32(); else if (203 === e) t = this.readF64(); else if (204 === e) t = this.readU8(); else if (205 === e) t = this.readU16(); else if (206 === e) t = this.readU32(); else if (207 === e) t = this.readU64(); else if (208 === e) t = this.readI8(); else if (209 === e) t = this.readI16(); else if (210 === e) t = this.readI32(); else if (211 === e) t = this.readI64(); else if (217 === e) i = this.lookU8(), t = this.decodeUtf8String(i, 1); else if (218 === e) i = this.lookU16(), t = this.decodeUtf8String(i, 2); else if (219 === e) i = this.lookU32(), t = this.decodeUtf8String(i, 4); else if (220 === e) {
                    if (0 !== (n = this.readU16())) {
                        this.pushArrayState(n), this.complete();
                        continue e;
                    }
                    t = [];
                } else if (221 === e) {
                    if (0 !== (n = this.readU32())) {
                        this.pushArrayState(n), this.complete();
                        continue e;
                    }
                    t = [];
                } else if (222 === e) {
                    if (0 !== (n = this.readU16())) {
                        this.pushMapState(n), this.complete();
                        continue e;
                    }
                    t = {};
                } else if (223 === e) {
                    if (0 !== (n = this.readU32())) {
                        this.pushMapState(n), this.complete();
                        continue e;
                    }
                    t = {};
                } else if (196 === e) {
                    var n = this.lookU8();
                    t = this.decodeBinary(n, 1);
                } else if (197 === e) n = this.lookU16(), t = this.decodeBinary(n, 2); else if (198 === e) n = this.lookU32(), t = this.decodeBinary(n, 4); else if (212 === e) t = this.decodeExtension(1, 0); else if (213 === e) t = this.decodeExtension(2, 0); else if (214 === e) t = this.decodeExtension(4, 0); else if (215 === e) t = this.decodeExtension(8, 0); else if (216 === e) t = this.decodeExtension(16, 0); else if (199 === e) n = this.lookU8(), t = this.decodeExtension(n, 1); else if (200 === e) n = this.lookU16(), t = this.decodeExtension(n, 2); else {
                    if (201 !== e) throw new w("Unrecognized type byte: ".concat("".concat(e < 0 ? "-" : "", "0x").concat(Math.abs(e).toString(16).padStart(2, "0"))));
                    n = this.lookU32(), t = this.decodeExtension(n, 4);
                }
                this.complete();
                for (var s = this.stack; s.length > 0;) {
                    var o = s[s.length - 1];
                    if (0 === o.type) {
                        if (o.array[o.position] = t, o.position++, o.position !== o.size) continue e;
                        s.pop(), t = o.array;
                    } else {
                        if (1 === o.type) {
                            if (!L(t)) throw new w("The type of key must be string or number but " + typeof t);
                            if ("__proto__" === t) throw new w("The key __proto__ is not allowed");
                            o.key = t, o.type = 2;
                            continue e;
                        }
                        if (o.map[o.key] = t, o.readCount++, o.readCount !== o.size) {
                            o.key = null, o.type = 1;
                            continue e;
                        }
                        s.pop(), t = o.map;
                    }
                }
                return t;
            }
        }, e.prototype.readHeadByte = function () {
            return -1 === this.headByte && (this.headByte = this.readU8()), this.headByte;
        }, e.prototype.complete = function () {
            this.headByte = -1;
        }, e.prototype.readArraySize = function () {
            var e = this.readHeadByte();
            switch (e) {
                case 220:
                    return this.readU16();
                case 221:
                    return this.readU32();
                default:
                    if (e < 160) return e - 144;
                    throw new w("Unrecognized array type byte: ".concat("".concat(e < 0 ? "-" : "", "0x").concat(Math.abs(e).toString(16).padStart(2, "0"))));
            }
        }, e.prototype.pushMapState = function (e) {
            if (e > this.maxMapLength) throw new w("Max length exceeded: map length (".concat(e, ") > maxMapLengthLength (").concat(this.maxMapLength, ")"));
            this.stack.push({type: 1, size: e, key: null, readCount: 0, map: {}});
        }, e.prototype.pushArrayState = function (e) {
            if (e > this.maxArrayLength) throw new w("Max length exceeded: array length (".concat(e, ") > maxArrayLength (").concat(this.maxArrayLength, ")"));
            this.stack.push({type: 0, size: e, array: new Array(e), position: 0});
        }, e.prototype.decodeUtf8String = function (e, t) {
            var i;
            if (e > this.maxStrLength) throw new w("Max length exceeded: UTF-8 byte length (".concat(e, ") > maxStrLength (").concat(this.maxStrLength, ")"));
            if (this.bytes.byteLength < this.pos + t + e) throw H;
            var n, s = this.pos + t;
            return n = this.stateIsMapKey() && (null === (i = this.keyDecoder) || void 0 === i ? void 0 : i.canBeCached(e)) ? this.keyDecoder.decode(this.bytes, s, e) : e > m ? function (e, t, i) {
                var n = e.subarray(t, t + i);
                return g.decode(n);
            }(this.bytes, s, e) : p(this.bytes, s, e), this.pos += t + e, n;
        }, e.prototype.stateIsMapKey = function () {
            return this.stack.length > 0 && 1 === this.stack[this.stack.length - 1].type;
        }, e.prototype.decodeBinary = function (e, t) {
            if (e > this.maxBinLength) throw new w("Max length exceeded: bin length (".concat(e, ") > maxBinLength (").concat(this.maxBinLength, ")"));
            if (!this.hasRemaining(e + t)) throw H;
            var i = this.pos + t, n = this.bytes.subarray(i, i + e);
            return this.pos += t + e, n;
        }, e.prototype.decodeExtension = function (e, t) {
            if (e > this.maxExtLength) throw new w("Max length exceeded: ext length (".concat(e, ") > maxExtLength (").concat(this.maxExtLength, ")"));
            var i = this.view.getInt8(this.pos + t), n = this.decodeBinary(e, t + 1);
            return this.extensionCodec.decode(n, i, this.context);
        }, e.prototype.lookU8 = function () {
            return this.view.getUint8(this.pos);
        }, e.prototype.lookU16 = function () {
            return this.view.getUint16(this.pos);
        }, e.prototype.lookU32 = function () {
            return this.view.getUint32(this.pos);
        }, e.prototype.readU8 = function () {
            var e = this.view.getUint8(this.pos);
            return this.pos++, e;
        }, e.prototype.readI8 = function () {
            var e = this.view.getInt8(this.pos);
            return this.pos++, e;
        }, e.prototype.readU16 = function () {
            var e = this.view.getUint16(this.pos);
            return this.pos += 2, e;
        }, e.prototype.readI16 = function () {
            var e = this.view.getInt16(this.pos);
            return this.pos += 2, e;
        }, e.prototype.readU32 = function () {
            var e = this.view.getUint32(this.pos);
            return this.pos += 4, e;
        }, e.prototype.readI32 = function () {
            var e = this.view.getInt32(this.pos);
            return this.pos += 4, e;
        }, e.prototype.readU64 = function () {
            var e = function (e, t) {
                return 4294967296 * e.getUint32(t) + e.getUint32(t + 4);
            }(this.view, this.pos);
            return this.pos += 8, e;
        }, e.prototype.readI64 = function () {
            var e = 4294967296 * this.view.getInt32(this.pos) + this.view.getUint32(this.pos + 4);
            return this.pos += 8, e;
        }, e.prototype.readF32 = function () {
            var e = this.view.getFloat32(this.pos);
            return this.pos += 4, e;
        }, e.prototype.readF64 = function () {
            var e = this.view.getFloat64(this.pos);
            return this.pos += 8, e;
        }, e;
    }(), W = {};
    var N = function (e, t) {
        var i, n, s, o, a = {label: 0, sent: function () {
            if (1 & s[0]) throw s[1];
            return s[1];
        }, trys: [], ops: []};
        return o = {next: r(0), throw: r(1), return: r(2)}, "function" == typeof Symbol && (o[Symbol.iterator] = function () {
            return this;
        }), o;
        function r(o) {
            return function (r) {
                return function (o) {
                    if (i) throw new TypeError("Generator is already executing.");
                    for (; a;) try {
                        if (i = 1, n && (s = 2 & o[0] ? n.return : o[0] ? n.throw || ((s = n.return) && s.call(n), 0) : n.next) && !(s = s.call(n, o[1])).done) return s;
                        switch (n = 0, s && (o = [2 & o[0], s.value]), o[0]) {
                            case 0:
                            case 1:
                                s = o;
                                break;
                            case 4:
                                return a.label++, {value: o[1], done: false};
                            case 5:
                                a.label++, n = o[1], o = [0];
                                continue;
                            case 7:
                                o = a.ops.pop(), a.trys.pop();
                                continue;
                            default:
                                if (!(s = (s = a.trys).length > 0 && s[s.length - 1]) && (6 === o[0] || 2 === o[0])) {
                                    a = 0;
                                    continue;
                                }
                                if (3 === o[0] && (!s || o[1] > s[0] && o[1] < s[3])) {
                                    a.label = o[1];
                                    break;
                                }
                                if (6 === o[0] && a.label < s[1]) {
                                    a.label = s[1], s = o;
                                    break;
                                }
                                if (s && a.label < s[2]) {
                                    a.label = s[2], a.ops.push(o);
                                    break;
                                }
                                s[2] && a.ops.pop(), a.trys.pop();
                                continue;
                        }
                        o = t.call(e, a);
                    } catch (e) {
                        o = [6, e], n = 0;
                    } finally {
                        i = s = 0;
                    }
                    if (5 & o[0]) throw o[1];
                    return {value: o[0] ? o[1] : void 0, done: true};
                }([o, r]);
            };
        }
    }, Y = function (e) {
        return this instanceof Y ? (this.v = e, this) : new Y(e);
    }, K = function (e, t, i) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var n, s = i.apply(e, t || []), o = [];
        return n = {}, a("next"), a("throw"), a("return"), n[Symbol.asyncIterator] = function () {
            return this;
        }, n;
        function a(e) {
            s[e] && (n[e] = function (t) {
                return new Promise(function (i, n) {
                    o.push([e, t, i, n]) > 1 || r(e, t);
                });
            });
        }
        function r(e, t) {
            try {
                !function (e) {
                    e.value instanceof Y ? Promise.resolve(e.value.v).then(c, l) : h(o[0][2], e);
                }(s[e](t));
            } catch (e) {
                h(o[0][3], e);
            }
        }
        function c(e) {
            r("next", e);
        }
        function l(e) {
            r("throw", e);
        }
        function h(e, t) {
            e(t), o.shift(), o.length && r(o[0][0], o[0][1]);
        }
    };
    function J(e) {
        return function (e) {
            return null != e[Symbol.asyncIterator];
        }(e) ? e : function (e) {
            return K(this, arguments, function () {
                var t, i, n, s;
                return N(this, function (o) {
                    switch (o.label) {
                        case 0:
                            t = e.getReader(), o.label = 1;
                        case 1:
                            o.trys.push([1, , 9, 10]), o.label = 2;
                        case 2:
                            return [4, Y(t.read())];
                        case 3:
                            return i = o.sent(), n = i.done, s = i.value, n ? [4, Y(void 0)] : [3, 5];
                        case 4:
                            return [2, o.sent()];
                        case 5:
                            return function (e) {
                                if (null == e) throw new Error("Assertion Failure: value must not be null nor undefined");
                            }(s), [4, Y(s)];
                        case 6:
                            return [4, o.sent()];
                        case 7:
                            return o.sent(), [3, 2];
                        case 8:
                            return [3, 10];
                        case 9:
                            return t.releaseLock(), [7];
                        case 10:
                            return [2];
                    }
                });
            });
        }(e);
    }
    function Q(e, t) {
        return void 0 === t && (t = W), function (e, t, i, n) {
            return new (i || (i = Promise))(function (s, o) {
                function a(e) {
                    try {
                        4294967296 * n.next(e).getInt32(t) + n.next(e).getUint32(t + 4);
                    } catch (e) {
                        o(e);
                    }
                }
                function r(e) {
                    try {
                        4294967296 * n.throw(e).getInt32(t) + n.throw(e).getUint32(t + 4);
                    } catch (e) {
                        o(e);
                    }
                }
                function c(e) {
                    e.done ? s(e.value) : function (e) {
                        return e instanceof i ? e : new i(function (t) {
                            t(e);
                        });
                    }(e.value).then(a, r);
                }
                4294967296 * (n = n.apply(e, t || [])).next().getInt32(t) + (n = n.apply(e, t || [])).next().getUint32(t + 4);
            });
        }(this, void 0, void 0, function () {
            var i;
            return function (e, t) {
                var i, n, s, o, a = {label: 0, sent: function () {
                    if (1 & s[0]) throw s[1];
                    return s[1];
                }, trys: [], ops: []};
                return o = {next: r(0), throw: r(1), return: r(2)}, "function" == typeof Symbol && (o[Symbol.iterator] = function () {
                    return this;
                }), o;
                function r(o) {
                    return function (r) {
                        return function (o) {
                            if (i) throw new TypeError("Generator is already executing.");
                            for (; a;) try {
                                if (i = 1, n && (s = 2 & o[0] ? n.return : o[0] ? n.throw || ((s = n.return) && s.call(n), 0) : n.next) && !(s = s.call(n, o[1])).done) return s;
                                switch (n = 0, s && (o = [2 & o[0], s.value]), o[0]) {
                                    case 0:
                                    case 1:
                                        s = o;
                                        break;
                                    case 4:
                                        return a.label++, {value: o[1], done: false};
                                    case 5:
                                        a.label++, n = o[1], o = [0];
                                        continue;
                                    case 7:
                                        o = a.ops.pop(), a.trys.pop();
                                        continue;
                                    default:
                                        if (!(s = (s = a.trys).length > 0 && s[s.length - 1]) && (6 === o[0] || 2 === o[0])) {
                                            a = 0;
                                            continue;
                                        }
                                        if (3 === o[0] && (!s || o[1] > s[0] && o[1] < s[3])) {
                                            a.label = o[1];
                                            break;
                                        }
                                        if (6 === o[0] && a.label < s[1]) {
                                            a.label = s[1], s = o;
                                            break;
                                        }
                                        if (s && a.label < s[2]) {
                                            a.label = s[2], a.ops.push(o);
                                            break;
                                        }
                                        s[2] && a.ops.pop(), a.trys.pop();
                                        continue;
                                }
                                o = t.call(e, a);
                            } catch (e) {
                                o = [6, e], n = 0;
                            } finally {
                                i = s = 0;
                            }
                            if (5 & o[0]) throw o[1];
                            return {value: o[0] ? o[1] : void 0, done: true};
                        }([o, r]);
                    };
                }
            }(this, function (n) {
                return i = J(e), [2, new q(t.extensionCodec, t.context, t.maxStrLength, t.maxBinLength, t.maxArrayLength, t.maxMapLength, t.maxExtLength).decodeAsync(i)];
            });
        });
    }
    function $(e, t) {
        void 0 === t && (t = W);
        var i = J(e);
        return new q(t.extensionCodec, t.context, t.maxStrLength, t.maxBinLength, t.maxArrayLength, t.maxMapLength, t.maxExtLength).decodeArrayStream(i);
    }
    function Z(e, t) {
        void 0 === t && (t = W);
        var i = J(e);
        return new q(t.extensionCodec, t.context, t.maxStrLength, t.maxBinLength, t.maxArrayLength, t.maxMapLength, t.maxExtLength).decodeStream(i);
    }
    i.d(t, "encode", function () {
        return O;
    }), i.d(t, "decode", function () {
        return X;
    }), i.d(t, "decodeMulti", function () {
        return G;
    }), i.d(t, "decodeAsync", function () {
        return Q;
    }), i.d(t, "decodeArrayStream", function () {
        return $;
    }), i.d(t, "decodeMultiStream", function () {
        return Z;
    }), i.d(t, "decodeStream", function () {
        return ee;
    }), i.d(t, "Decoder", function () {
        return q;
    }), i.d(t, "DecodeError", function () {
        return w;
    }), i.d(t, "DataViewIndexOutOfBoundsError", function () {
        return F;
    }), i.d(t, "Encoder", function () {
        return P;
    }), i.d(t, "ExtensionCodec", function () {
        return M;
    }), i.d(t, "ExtData", function () {
        return y;
    }), i.d(t, "EXT_TIMESTAMP", function () {
        return -1;
    }), i.d(t, "encodeDateToTimeSpec", function () {
        return b;
    }), i.d(t, "encodeTimeSpecToTimestamp", function () {
        return v;
    }), i.d(t, "decodeTimestampToTimeSpec", function () {
        return S;
    }), i.d(t, "encodeTimestampExtension", function () {
        return x;
    }), i.d(t, "decodeTimestampExtension", function () {
        return I;
    });
}]);
