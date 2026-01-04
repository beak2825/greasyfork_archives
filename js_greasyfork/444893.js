// ==UserScript==
// @name         SuperiorScript
// @namespace    http://tampermonkey.net/
// @version      V1
// @description  para x1, guerra
// @author       Vencija
// @match        *.bloble.io/*
// @icon         https://www.google.com/s2/favicons?domain=bloble.io
// @grant        none
// @license      GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/444893/SuperiorScript.user.js
// @updateURL https://update.greasyfork.org/scripts/444893/SuperiorScript.meta.js
// ==/UserScript==
//armory for (var i = 0; i < units.length; ++i) {if (0 === units[i].type && "circle" == units[i].shape) {for (var z = 0; z < window.sockets.length; z++){sockets[z].emit("4", units[i].id, 0)}}}
//document.getElementById("enterGameButton").innerHTML = `<button type="button" onclick=entergamebutton id="enterGameButton">PLAY</button>`
var cid = UTILS.getUniqueID()
localStorage.setItem("cid", cid)
function enterGame() {
    socket && unitList && (showMainMenuText(randomLoadingTexts[UTILS.randInt(0, randomLoadingTexts.length - 1)]), hasStorage && localStorage.setItem("lstnmdbl", userNameInput.value), mainCanvas.focus(), grecaptcha.execute("6Ldh8e0UAAAAAFOKBv25wQ87F3EKvBzyasSbqxCE").then(function(a) {
        socket.emit("spawn", {
            name: userNameInput.value,
            skin: 0
        }, a)
    }))
}
document.getElementById("skinSelector").innerHTML = `SKIN<br>⬄`;
document.getElementById("skinSelector").style = `background: #101010;`;
document.getElementById("infoLinks").innerHTML = `<div id="infoLinks">
			<a target="_blank" href="./changes.txt">changes</a>  <a target="_blank" href="./privacy.txt">privacy</a>
			 <a target="_blank" href="https://chrome.google.com/webstore/detail/adblock-%E2%80%94-best-ad-blocker/gighmmpiobklfepjocnamgkkbiglidom?hl=pt-BR">adblock</a>
		</div>`;
document.getElementById("menuContainer").style = "background: #101010;"
document.getElementById("creatorLink").innerHTML = "<div id='creatorLink'>Utilize Adblock</div>"


function changeSkin(a) {
    currentSkin += a;
    0 > currentSkin && (currentSkin = playerSkins);
    currentSkin > playerSkins && (currentSkin = 0);
    a = document.createElement("canvas");
    a.width = a.height = 100;
    var d = a.getContext("2d");
    d.translate(a.width / 2, a.height / 2);
    d.lineWidth = outlineWidth;
    d.strokeStyle = darkColor;
    renderPlayer({
        size: 50,
        color: 1,
        skin: currentSkin,
    }, 0, 0, d, currentSkin);
    skinIcon.src = a.toDataURL()
}
function renderPlayer(a, d, c, b, g) {
    b.save();
    if (a.skin && 0 < a.skin && a.skin <= playerSkins && !skinSprites[a.skin]) {
        var e = new Image;
        e.onload = function() {
            this.readyToDraw = !0;
            this.onload = null;
            g == currentSkin && changeSkin(0);
        }
        //skin 1 = suíça...
                 if(a.skin === 27){
        e.src = "https://lh3.googleusercontent.com/-6gUod-Kz4sg/YWWFQwhlrxI/AAAAAAAAAIM/bk7Lu0Y_4bUWNjjoEe0TFsWtHpR2EgoKwCLcBGAsYHQ/skin26.png.png";
        skinSprites[a.skin] = e
                 }else if(a.skin === 26){
        e.src = "https://blogger.googleusercontent.com/img/a/AVvXsEh6kUCN-57QA5hg2z2bJm0M0MSSx38L96e_Ostp199yQGL-FfGMVE_yjQO8dYMvzYBo944L_qu5QGrPkm-yvZGn2UizIljlkVf_QM6tw2m6NsMnwNMXUvLH_IBE8hN1v_tI5pLFvpLF8pG_hKsDYJVOtJdPFXtD3ISqJ0FjqAzFYZPAvwbiNBfLLmCicQ";
        skinSprites[a.skin] = e
        }else if(a.skin === 25){
        e.src = "https://blogger.googleusercontent.com/img/a/AVvXsEhkmU2yQDRoqjlT2V2BC1tJrUM5qyJPGo36yDAl7ss-TvWstTR7wv-10v4RqDrvQYN9jZ0V2XtNDQvSq4uHBYAnhIl4m_xjlwTNAz2L0mqerG6sY1AYcA3e9HOOuzqjR01mlrDWaxNCv98n_z65dXZkTLGzGUDYiALmkK3MOzSn9vxKKzHpd3SwwzBQfQ";
        skinSprites[a.skin] = e
        }
        else if(a.skin === 24){
        e.src = "https://blogger.googleusercontent.com/img/a/AVvXsEilVWdgvF64fL66r2G3rwcLpG7BtGOve1lr92tSdThfGX5cM-d3WShICMqeel8ARKM4K8W6JMpPO9BEqNcWyLZol1Vwr_hAQup6ADUGmxhdE6-i82HPp9JwJAM9dugdXawX9ClQ_xXUfjDKm8mdhSy4XaBKSxNdrpGADA1MNybLGyT8XfutBXfQkYC0LQ";
        skinSprites[a.skin] = e
        }
        else if(a.skin === 23){
        e.src = "https://blogger.googleusercontent.com/img/a/AVvXsEjz1jgTyW2eHwbWgIv8YIsAvRDEvYjA0DgNewEWURBY4zOcBmeqo-EYLQF5iaqZZpLF-pFCYu1GDwcS46tl2kwtWQaO3AMju9HdyhoDOnVfvi1ArfhlTLtpGn4gag0zmeYEjPNAc4hClKQ-O631L_75ZTsuuk7xuYuL6T8BCawe-g6kH53tFyze5gcMGw";
        skinSprites[a.skin] = e
        }
        else if(a.skin === 22){
        e.src = "https://blogger.googleusercontent.com/img/a/AVvXsEiijIUHpUWcB7JGD_1QO6VY4V-gjQ3bVNmtoC_T4fBX6BhWfz-hgrE5rFSn345WzG4xW_RmU6qdj9V6A4V5-Jl9x1S06J-ILgbYtAFNKucW-fx37-6o955rGbAMB6m75hULnLxti1oLYqG0DqVlEjc4dDsMVVDMsUog0ChyCiO-EsqYjtEcboR_TYJYRg";
        skinSprites[a.skin] = e
        }
        else if(a.skin === 21){
        e.src = "https://blogger.googleusercontent.com/img/a/AVvXsEhbBh5selAG_aS4lspe39idOhG8vEJYq_lf1D80EshcdTgXt6ZeGqsJWuQtuBkSkxGfDBWWVOIGR7rYYMIU1i41bDbQWydK62FuKRFmX2cHoru21Lg2l6c0IpQkgaVawp6UsrGfejMjlWsrPn2cQdh2LX7kgVs-6AGxg96TAQ56lg20xj-RWjDyEdkbXg";
        skinSprites[a.skin] = e
        }
        else if(a.skin === 20){
        e.src = "https://blogger.googleusercontent.com/img/a/AVvXsEgyhJ0vPIYhOzynU2-3XjWQ-EfJZtD5XfmBjQDHz5yvBnSXzYIItuY44CSYHK0ZyDKK3xo2LtIIYb1COiuQnVsrGjnPWQbgAVfRMP8B18zwbefVWINvnryhDf9gag2HmniykIs1QBqyyagKb5T8E4Vb1VfsatgbeuYDCjGF2Fau2qZcrhB1pBGs5DtCsw";
        skinSprites[a.skin] = e
        }
        else if(a.skin === 19){
        e.src = "https://blogger.googleusercontent.com/img/a/AVvXsEh53E25GpEvxW4bj6Nkj6jWYPyqsvqw4HDVRdZyw78BVSjRwDHAHK_ynixlXZskg_V_Erg_U8vFcTguVcfGm82CmiWGYUD2vQhlhgBKEQ8kyJ4_Y5VfHA6i1oF47T1J9afJiEsjCGCZ5o4jHCaRB8wfOMfnnyfHjVtAYrVxyTm69x96WHElqj56P4VBBA";
        skinSprites[a.skin] = e
        }
        else if(a.skin === 18){
        e.src = "https://blogger.googleusercontent.com/img/a/AVvXsEi8fnmCJdpcefW8pm7ASR0cpigE2CNlz3h_i0daCZYJ2JBN1OlqaHaYFXihfRZnyrCDAKQfxrEIpTKzZb-N9g345rlXtUvNfACvVHsTVDwyRP0-uBJ_XkFE_58-ylHIH1qdnJcxvJau74JVClnxbwg2n_0iUESJaOh9E5YSgEBWCnaBwSgCYvuZAxmdxw";
        skinSprites[a.skin] = e
        }
        else if(a.skin === 17){
        e.src = "https://blogger.googleusercontent.com/img/a/AVvXsEguED_QgO7aVjFRNOfNM4C9U7jXohLlzsnyFholCS8nBuLiawdDIc2Q-yZyFOYmv_IbjGyZgqtCVw63HFG4D_-6KNUxe0jlEFll1dQVq9FEy1oJdBzqjjBzp5ajjmvpEVu7sh4SB6HSDND__E1Qw2oBbpN8uixDdByNLRNTJrYcpcDXhTZ1vZ2IDZn0wA";
        skinSprites[a.skin] = e
        }
        else if(a.skin === 16){
        e.src = "https://blogger.googleusercontent.com/img/a/AVvXsEhwLz8BOw9gLyJJnJMKH4IpU-h3vVfnzOE79wkHAHXt82K2kWbquKkQqNkLpA80h4AIPFt0-S4NeDcJ7yuF-n74hbFwC3zFMv-3avpQ_90Mah4hkB1DwWySZKOaApwumbgj3P5l1ucT6A83rpM86_7EYpMY-M8THpuspj_X5j8q1FB4s4uD_Qt2U8VJmQ";
        skinSprites[a.skin] = e
        }
        else if(a.skin === 15){
        e.src = "https://blogger.googleusercontent.com/img/a/AVvXsEg86lbHMRlfjqBmLfSNx4YWzP9P_RVH6NePukS0IP74D9XvwSgbD5z8qvoYP8bPHv2CPegvoWdLiEHOucPXmTNsR0-IWgRgL_yHVQnSSpe_Ko73gv6wb0xKevSdPy0HobxbIzI0ctWnvgh6J1BmEvbv4WAC8mJdyCaeQS4p4JX3zBAmEkRtqp9bX7-Fjg";
        skinSprites[a.skin] = e
        }
        else if(a.skin === 14){
        e.src = "https://blogger.googleusercontent.com/img/a/AVvXsEiu09QOUGNBp5W8Of7e0v8P14ufNK_8BaX0LEqpzA4vtnqTa6wOGh0eZxaJ_GlDkzx_LPAQYRgjkDD4YkBJDAQ4ns5kgL9kscn_kWbNkwN8ucqTrjBMIHH2GonXoeJbwE9I0vQsmaF-KKeDQ-is3ZlXcQiFYJukDTrg0JZAi9IoSekArEgJcO4trfxZGA";
        skinSprites[a.skin] = e
        }
        else if(a.skin === 13){
        e.src = "https://blogger.googleusercontent.com/img/a/AVvXsEimv6MjQbOR73FAyOx6BwQXLCVXIHnm8n00v9LojXeLQYpuWYIaX8Nf1rGuj-79oJiCctjEvxYXtKpOFVdQGTXDYWSrWAQuFxaSAOgUv4TNRNmZ3Cf1vT81IgWXc1hEVrZbvb8fIBMsuoffSc6SFx3MytD1PJ0mP0Vf9DHEbhkP_M38ufiDYXmyyqbDww";
        skinSprites[a.skin] = e
        }
        else if(a.skin === 12){
        e.src = "https://blogger.googleusercontent.com/img/a/AVvXsEgJ-T2B0sgAcDU1kO-_E9VHzNtxYJYjPjAkdypdo1jgG8zGdcqAfvBgkVFiKGvd0Yr05MmS1lAcP5mc3pWdb8ErM_R8LQLUOPT0hjR4au_MYGX2fFQtoIHcRZVNzWMYxGEegRF_FlfkdFnt_2ostFqEW1hbC0rht1RkunbS-sVlRyZtP2ijGjteoqZePw";
        skinSprites[a.skin] = e
        }
        else if(a.skin === 11){
        e.src = "https://blogger.googleusercontent.com/img/a/AVvXsEjF9t_V5H9PDV38_L5e_6q2f3FO-fNjhGLlj_UHXuSWA7sd1ehHLKjK18c2FuPfEvDfVgpwcro-ceNkMJsmH9HSbphns8QmBj5lXqYiNK7bGdjunrrPvoHrYfdk717A1Pz64AkiayViEZ3TRMBFnaOHsOlNEI9QAvPKg6pSTYzkyvtr-VD_iyfM83p4TA";
        skinSprites[a.skin] = e
        }
        else if(a.skin === 10){
        e.src = "https://blogger.googleusercontent.com/img/a/AVvXsEhNWl5-YsU_uyNba-JXiD-fARlvrf1ann649I7s0cYvlP48bsy7G3Ao8IHBEtD-_iwOY2eCy-z6pPYXWrHWycGgZlBlBd8UgfyNpESHX_cNqxignCwIOOzz3A0iTuNRLhFgh6gtp2Fk1762ze8GOLF8yVasxXkAS78pdpqSHT6ttZP-SE8YxVhx5vQBXw";
        skinSprites[a.skin] = e
        }
        else if(a.skin === 9){
        e.src = "https://blogger.googleusercontent.com/img/a/AVvXsEj6pck_MpBsNn_XrBTFB1DHK4mhriUaNdRqg3YE3OEem0FJiTk3bO5b8_3mQqjQUswZ-6PmHySfTuQoqeGDQyMd5nBp3wa5gpCcbMHkHJYKhbGs1dRcz-9SYzIK4LPhnyMrIFH6dhlQu9E7yZ8Ph3TafTJdwaMPrHxgKjcBefr1K55tJ929ajWwySedow";
        skinSprites[a.skin] = e
        }
        else if(a.skin === 8){
        e.src = "https://blogger.googleusercontent.com/img/a/AVvXsEhIQ5N5lIqFFbkQTY1Z_R-PYL4Ohvjrq3L7zQqefsKYqx6_TWddUclILOFzWwEjTE01FpiGwWpkjdZu9Uh8u_VrKdqXYrMQNejIVFguaIuxfh8n63IVoa12xIbfwM132VF7XD7C0YCSlRVHK0iKEbxgECQn6OQBBLmpUNUhV0sNStQhXdUI_DnyON5L1g";
        skinSprites[a.skin] = e
        }
        else if(a.skin === 7){
        e.src = "https://blogger.googleusercontent.com/img/a/AVvXsEjNmuuLHra-Q01sUiIZbIRpQY1x2SA1_DrQnF2J5OGX7n9wfNoQ5WBdw9zgPfT_Cz8t3xnbnkiK8Cbsz0q-lcqgYqN66qDE7U2LmPNPcT85WpGl_ZH0kDlwo6bwcAjUcdGgAki_LqSVddo3nX0uaJZI8XcQHPVXN1kTg_HS261ghkXosHnB79fIUjJCpw";
        skinSprites[a.skin] = e
        }
        else if(a.skin === 6){
        e.src = "https://blogger.googleusercontent.com/img/a/AVvXsEgEGzmGOKsmCLbuw1U_cCZ2d8sNU9xZ5AAqf9LKRy2TEaFAHVIv0VyZlyzQ057G7gNRbRtCh_uiDYMtgh0KwChTnSjBtsdOw6fD5zopaMrgOcuwhH-G5uXk3ura1Z2DSsUQNiwWMqh250JsppUlYgpp4KNpdMkYZIsmW-vVbGPfU7BJu1nBQ60ezhgVFA";
        skinSprites[a.skin] = e
        }
        else if(a.skin === 5){
        e.src = "https://blogger.googleusercontent.com/img/a/AVvXsEho3YhTE3bnocejpl0NbuIqcq5B9hOO3EZ8KiYq3t42tYptMzn3NlqbSar92tH-cpS-0UfboyjgQAcAIPp-6tAPtwq0BSvm4YkZeWCV2MeL7RKm-8FISBBPxBjoZC8S11FTW3bSS2ogpf_PbOoiY_hnX-8xZkNqzxvhjflgiefOukJDRxX75adU-IcN6A";
        skinSprites[a.skin] = e
        }
        else if(a.skin === 4){
        e.src = "https://blogger.googleusercontent.com/img/a/AVvXsEjEmS-S82qB45IK4czqVUVtIdERgmoghX0zvR9Vj4mIBpG-6v-vp4zEAbsyKUiR9_4kLvS64dXC_pjzSpJ8tAwAz_EXfP-8lLIN5UXwZImT89e5pnadWoSwxMb0e9mmpRryL8cXkLVBX3vfZE6LowwPvIkvvqp8UMidzyhk3lxiCdGJ-VgGGCCKk98rZw";
        skinSprites[a.skin] = e
        }
        else if(a.skin === 3){
        e.src = "https://blogger.googleusercontent.com/img/a/AVvXsEiOb-FH2lV5bpXlLrEWR7DvFX_g6T8YentdlXYi-pSlf8wUNEcwAFQkp92W4YV39i2XscT0POzAL9NBE0PFFp8BUZhZtvL4BCe-CF-YCNt_4hUtxSLsY1ktcPcuyE5qE_p7RGIR1uvkeb0A1GZ_yEjwSnuCjffnh5afKlhbX_RN0fifdY4rQzThp-Gnuw";
        skinSprites[a.skin] = e
        }
        else if(a.skin === 2){
        e.src = "https://blogger.googleusercontent.com/img/a/AVvXsEj7Ows5zIDQqy9g4gTEwWESCnd6dDcXcmpVySnghyQx9ZbYKNqiI34g6tZirP9eoftATY3Efq-MYVaGmiwMLuDr8lckXy4hOclX6AL1ujEUAIkkfDP4Gf7GA7Vn0eF6waM_7rnbvn_EHgWRzsba814maASCpM5cxkrDPCxXCs4UclC0TBebM9qCLlrjGA";
        skinSprites[a.skin] = e
        }
        else if(a.skin === 1){
        e.src = "https://blogger.googleusercontent.com/img/a/AVvXsEifBBsQahVqygOpGT1ax9vNPjg1mOy5iMRXPB0q_6f5lln2W1JeesbpAyoIQDAV3iRhNnyDBDkWHxFiZEvy5rB94vEAbg5kChtGM4gZK9UelIlgOK0-tbsLipmzpfIHkHgs_T-R9QKMqnBZhxUC_Q0Ejg02BA6LmcKeRZCI9nSmM402S-1j_aes31R5Tw";
        skinSprites[a.skin] = e
        }
    }
    a.skin && skinSprites[a.skin] && skinSprites[a.skin].readyToDraw ? (e = a.size - b.lineWidth / 4, b.drawImage(skinSprites[a.skin], d - e, c - e, 2 * e, 2 * e), b.lineWidth /= 2, renderCircle(d, c, a.size, b, !1, !0)) : g || (b.fillStyle = playerColors[a.color], renderCircle(d,
        c, a.size, b));
    b.restore()
}
var playerColors = "#f9ff60a3 #ff6060a3 #82ff60a3 #607effa3 #60eaffa3 #ff60eea3 #e360ffa3 #ffaf60a3 #a3ff60a3 #ff609ca3 #60ff82a3 #cc60ffa3 #c65959a3 #404b7fa3 #f2d957a3 #c55252a3 #c55252a3 #498e56a3 #c45151a3 #c35454a3 #c85757a3 #c85959a3 #5b74b6a3 #cd6868a3 #5c81bda3 #5bb146a3 #d8c963a3 #c55252a3 #404b7fa3 #c55252a3 #c55252a3 #c55252a3 #c55252a3 #404b7fa3 #498e56a3 #498e56a3 #dbd245a3 #ca514ea3 #43427ea3".split(" ");

//var playerColors = "#f9ff60 #ff6060 #82ff60 #607eff #60eaff #ff60ee #e360ff #ffaf60 #a3ff60 #ff609c #60ff82 #cc60ff #c65959 #404b7f #f2d957 #c55252 #c55252 #498e56 #c45151 #c35454 #c85757 #c85959 #5b74b6 #cd6868 #5c81bd #5bb146 #d8c963 #c55252 #404b7f #c55252 #c55252 #c55252 #c55252 #404b7f #498e56 #498e56 #dbd245 #ca514e #43427e".split(" ");
function renderUnit(a, d, c, b, g, e, k) {
    var f = b.size * (k ? iconSizeMult : 1),
        h = f + ":" + b.cloak + ":" + b.renderIndex + ":" + b.iSize + ":" + b.turretIndex + ":" + b.shape + ":" + g;
    if (!unitSprites[h]) {
        var m = document.createElement("canvas"),
            l = m.getContext("2d");
        m.width = 2 * f + 30;
        m.height = m.width;
        m.style.width = m.width + "px";
        m.style.height = m.height + "px";
        l.translate(m.width / 2, m.height / 2);
        l.lineWidth = outlineWidth * (k ? .9 : 1.2);
        l.strokeStyle = darkColor;
        l.fillStyle = g;
        4 == b.renderIndex ? l.fillStyle = turretColor : 5 == b.renderIndex && (l.fillStyle = turretColor,
            renderRect(0, .76 * f, 1.3 * f, f / 2.4, l), l.fillStyle = g);
        b.cloak && (l.fillStyle = backgroundColor);
        "circle" == b.shape ? (renderCircle(0, 0, f, l), b.iSize && (l.fillStyle = turretColor, renderCircle(0, 0, f * b.iSize, l))) : "triangle" == b.shape ? (renderTriangle(0, 0, f, l), b.iSize && (l.fillStyle = turretColor, renderTriangle(0, 2, f * b.iSize, l))) : "hexagon" == b.shape ? (renderAgon(0, 0, f, l, 6), b.iSize && (l.fillStyle = turretColor, renderAgon(0, 0, f * b.iSize, l, 6))) : "octagon" == b.shape ? (l.rotate(MathPI / 8), renderAgon(0, 0, .96 * f, l, 8), b.iSize && (l.fillStyle =
            turretColor, renderAgon(0, 0, .96 * f * b.iSize, l, 8))) : "pentagon" == b.shape ? (l.rotate(-MathPI / 2), renderAgon(0, 0, 1.065 * f, l, 5), b.iSize && (l.fillStyle = turretColor, renderAgon(0, 0, 1.065 * f * b.iSize, l, 5))) : "square" == b.shape ? (renderSquare(0, 0, f, l), b.iSize && (l.fillStyle = turretColor, renderSquare(0, 0, f * b.iSize, l))) : "spike" == b.shape ? renderStar(0, 0, f, .7 * f, l, 8) : "star" == b.shape && (f *= 1.2, renderStar(0, 0, f, .7 * f, l, 6));
        if (1 == b.renderIndex) l.fillStyle = turretColor, renderRect(f / 2.8, 0, f / 4, f / 1, l), renderRect(-f / 2.8, 0, f / 4, f / 1, l);
        else if (2 ==
            b.renderIndex) l.fillStyle = turretColor, renderRect(f / 2.5, f / 2.5, f / 2.5, f / 2.5, l), renderRect(-f / 2.5, f / 2.5, f / 2.5, f / 2.5, l), renderRect(f / 2.5, -f / 2.5, f / 2.5, f / 2.5, l), renderRect(-f / 2.5, -f / 2.5, f / 2.5, f / 2.5, l);
        else if (3 == b.renderIndex) l.fillStyle = turretColor, l.rotate(MathPI / 2), renderRectCircle(0, 0, .75 * f, f / 2.85, 3, l), renderCircle(0, 0, .5 * f, l), l.fillStyle = g;
        else if (6 == b.renderIndex) l.fillStyle = turretColor, l.rotate(MathPI / 2), renderRectCircle(0, 0, .7 * f, f / 4, 5, l), l.rotate(-MathPI / 2), renderAgon(0, 0, .4 * f, l, 6);
        else if (7 == b.renderIndex)
            for (g =
                0; 3 > g; ++g) l.fillStyle = g ? 1 == g ? "transparent" : "transparent" : "#89d95fa0", renderStar(0, 0, f, .7 * f, l, 8), f *= -10;
        else 8 == b.renderIndex && (l.fillStyle = turretColor, renderRectCircle(0, 0, .75 * f, f / 2.85, 3, l), renderSquare(0, 0, .5 * f, l));
        1 != b.type && b.turretIndex && renderTurret(0, 0, b.turretIndex, k ? iconSizeMult : 1, -(MathPI / 2), l);
        unitSprites[h] = m
    }
    f = unitSprites[h];
    e.save();
    e.translate(a, d);
    e.rotate(c + MathPI / 2);
    e.drawImage(f, -(f.width / 2), -(f.height / 2), f.width, f.height);
    1 == b.type && b.turretIndex && renderTurret(0, 0, b.turretIndex, k ? iconSizeMult :
        1, b.turRot - MathPI / 2 - c, e);
    e.restore()
}

setupSocket = function() {
    socket.on("connect_error", function() {
        lobbyURLIP ? kickPlayer("Connection failed. Please check your lobby ID") : kickPlayer("Connection failed. Check your internet and firewall settings")
    });
    socket.on("disconnect", function(a) {
        kickPlayer("Disconnected.")
    });
    socket.on("error", function(a) {
        kickPlayer("Disconnected. The server may have updated.")
    });
    socket.on("kick", function(a) {
        kickPlayer(a)
    });
    socket.on("lk", function(a) {
        partyKey = a
    });
    socket.on("spawn", function() {
        gameState = 1;
        unitList = share.getUnitList();
        resetCamera();
        toggleMenuUI(!1);
        toggleGameUI(!0);
        updateUnitList();
        player.upgrades = share.getBaseUpgrades();
        mainCanvas.focus()
    });
    socket.on("gd", function(a) {
        gameData = a
    });
    socket.on("mpd", function(a) {
        mapBounds = a
    });
    socket.on("ch", function(a, d, c) {
        addChatLine(a, d, c)
    });
    socket.on("setUser", function(a, d) {
        if (a && a[0]) {
            var c = getUserBySID(a[0]),
                b = {
                    sid: a[0],
                    name: a[1],
                    iName: "Headquarters",
                    upgrades: [window.share.getBaseUpgrades()[1]],
                    dead: !1,
                    color: a[2],
                    size: a[3],
                    startSize: 32,
                    x: a[5],
                    y: a[6],
                    buildRange: a[7],
                    gridIndex: a[8],
                    spawnProt: a[9],
                    skin: a[10],
                    desc: "Base of operations of " +
                        a[1] + "<br>" + "ID: " + a[0],
                    kills: 0,
                    typeName: "Base"
                };
            null != c ? (users[c] = b, d && (player = users[c])) : (users.push(b), d && (player = users[users.length - 1]))
        }
    });
    socket.on("klUser", function(a) {
        var d = getUserBySID(a);
        null != d && (users[d].dead = !0);
        player && player.sid == a && (hideMainMenuText(), leaveGame())
    });

    socket.on("delUser", function(a) {
        a = getUserBySID(a);
        null != a && users.splice(a, 1)
    });
    socket.on("au", function(a) {
        a && (units.push({
            id: a[0],
            owner: a[1],
            uPath: a[2] || 0,
            type: a[3] || 0,
            color: a[4] || 0,
            paths: a[5],
            x: a[6] || 0,
            sX: a[6] || 0,
            y: a[7] || 0,
            sY: a[7] || 0,
            dir: a[8] ||
                0,
            turRot: a[8] || 0,
            speed: a[9] || 0,
            renderIndex: a[10] || 0,
            turretIndex: a[11] || 0,
            range: a[12] || 0,
            cloak: a[13] || 0
        }), units[units.length - 1].speed && (units[units.length - 1].startTime = window.performance.now()), a = getUnitFromPath(units[units.length - 1].uPath)) && (units[units.length - 1].size = a.size, units[units.length - 1].shape = a.shape, units[units.length - 1].layer = a.layer, units[units.length - 1].renderIndex || (units[units.length - 1].renderIndex = a.renderIndex), units[units.length - 1].range || (units[units.length - 1].range = a.range),
            units[units.length - 1].turretIndex || (units[units.length - 1].turretIndex = a.turretIndex), units[units.length - 1].iSize = a.iSize)
    });
    socket.on("spa", function(a, d, c, b) {
        a = getUnitById(a);
        if (null != a) {
            var g = UTILS.getDistance(d, c, units[a].x || d, units[a].y || c);
            300 > g && g ? (units[a].interpDst = g, units[a].interpDstS = g, units[a].interpDir = UTILS.getDirection(d, c, units[a].x || d, units[a].y || c)) : (units[a].interpDst = 0, units[a].interpDstS = 0, units[a].interpDir = 0, units[a].x = d, units[a].y = c);
            units[a].interX = 0;
            units[a].interY = 0;
            units[a].sX =
                units[a].x || d;
            units[a].sY = units[a].y || c;
            b[0] && (units[a].dir = b[0], units[a].turRot = b[0]);
            units[a].paths = b;
            units[a].startTime = window.performance.now()
        }
    });
    socket.on("uc", function(a, d) {
        unitList && (unitList[a].count = d);
        forceUnitInfoUpdate = !0
    });
    socket.on("uul", function(a, d) {
        unitList && (unitList[a].limit += d)
    });
    socket.on("rpu", function(a, d) {
        var c = getUnitFromPath(a);
        c && (c.dontShow = d, forceUnitInfoUpdate = !0)
    });
    socket.on("sp", function(a, d) {
        var c = getUserBySID(a);
        null != c && (users[c].spawnProt = d)
    });
    socket.on("ab", function(a) {
        a &&
            bullets.push({
                x: a[0],
                sX: a[0],
                y: a[1],
                sY: a[1],
                dir: a[2],
                speed: a[3],
                size: a[4],
                range: a[5]
            })
    });
    socket.on("uu", function(a, d) {
        if (void 0 != a && d) {
            var c = getUnitById(a);
            if (null != c)
                for (var b = 0; b < d.length;) units[c][d[b]] = d[b + 1], "dir" == d[b] && (units[c].turRot = d[b + 1]), b += 2
        }
    });
    socket.on("du", function(a) {
        a = getUnitById(a);
        null != a && units.splice(a, 1)
    });
    socket.on("sz", function(a, d) {
        var c = getUserBySID(a);
        null != c && (users[c].size = d)
    });
     var playerColors2 = "#f9ff60 #ff6060 #82ff60 #607eff #60eaff #ff60ee #e360ff #ffaf60 #a3ff60 #ff609c #60ff82 #cc60ff #c65959 #404b7f #f2d957 #c55252 #c55252 #498e56 #c45151 #c35454 #c85757 #c85959 #5b74b6 #cd6868 #5c81bd #5bb146 #d8c963 #c55252 #404b7f #c55252 #c55252 #c55252 #c55252 #404b7f #498e56 #498e56 #dbd245 #ca514e #43427e".split(" ");
    socket.on("pt",function(a){let power = (a < 6e3) ? a : '6k';scoreContainer.innerHTML=`Power <span style='color:${playerColors2[player.color]}'>${power}`;player.power = a});
    socket.on("l", function(a) {
        for (var d = "", c = 1, b = 0; b < a.length;) d += "<div class='leaderboardItem'><div style='display:inline-block;float:left;' class='whiteText'>" + c + ".</div> <div class='" + (player && a[b] == player.sid ? "leaderYou" : "leader") + "'>" + a[b + 1] + "</div><div class='scoreText'>" + a[b + 2] + "</div></div>", c++, b += 3;
        leaderboardList.innerHTML = d
    })
}
/*Instafind*/
var gotoUsers = [];var gotoIndex = 0;
window.overrideSocketEvents = window.overrideSocketEvents || [];
window.chatCommands = window.chatCommands || {};
window.overrideSocketEvents.push({name: "l",description: "Leaderboard Insta Find override",func: function(a) {var d = "",c = 1,b = 0;for (; b < a.length;) {d += "<div class='leaderboardItem' onclick=goto2(" + a[b] + ");><div style='display:inline-block;float:left;' class='whiteText'>" + c + ".</div> <div class='" + (player && a[b] == player.sid ? "leaderYou" : "leader") + "'>" + a[b + 1] + "</div><div class='scoreText'>" + a[b + 2] + "</div></div>", c++, b += 3;}leaderboardList.innerHTML = d;}});leaderboardList.style.pointerEvents = 'auto';chatListWrapper.style.pointerEvents = 'auto';
window.goto = function(username) {gotoUsers = users.filter((user) => {return user.name === username});gotoIndex = 0;if (gotoUsers[0]) {camX = gotoUsers[0].x - player.x;camY = gotoUsers[0].y - player.y;}addChat(gotoUsers.length + ' users found with the name ' + username, 'Client');return gotoUsers.length;}
window.goto2 = function(id, go) {gotoUsers = users.filter((user) => {return user.sid === id;});gotoIndex = 0;if (!go && gotoUsers[0]) {camX = gotoUsers[0].x - player.x;camY = gotoUsers[0].y - player.y;}return gotoUsers.length;}
window.resetCamera = function() {camX = camXS = camY = camYS = 0;cameraKeys = {l: 0,r: 0,u: 0,d: 0};if (socket && window.overrideSocketEvents && window.overrideSocketEvents.length) {
window.overrideSocketEvents.forEach((item) => {socket.removeAllListeners(item.name);socket.on(item.name, item.func);});}}
window.addChatLine = function(a, d, c) {if (player) {var b = getUserBySID(a);if (c || 0 <= b) {var g = c ? "SERVER" : users[b].name;c = c ? "#fff" : playerColors[users[b].color] ? playerColors[users[b].color] : playerColors[0];player.sid == a && (c = "#fff");b = document.createElement("li");b.className = player.sid == a ? "chatme" : "chatother";b.innerHTML = '<span style="color:' + c + '" onclick=goto2(' + a + ');>[' + g + ']</span> <span class="chatText">' + d + "</span>";10 < chatList.childNodes.length && chatList.removeChild(chatList.childNodes[0]);chatList.appendChild(b)}}}


window.toggleUnitInfo = function(a, d) {
    var c = "";
    a && a.uPath && (c = void 0 != a.group ? a.group : a.uPath[0], c = unitList[c].limit ? (unitList[c].count || 0) + "/" + unitList[c].limit : "");
    if (a && (forceUnitInfoUpdate || "block" != unitInfoContainer.style.display || unitInfoName.innerHTML != (a.iName || a.name) || lastCount != c)) {
        forceUnitInfoUpdate = !1;
        unitInfoContainer.style.display = "block";
        unitInfoName.innerHTML = a.iName || a.name;
        a.cost ? (unitInfoCost.innerHTML = "Cost " + a.cost, unitInfoCost.style.display = "block") : unitInfoCost.style.display = "none";
        unitInfoDesc.innerHTML = a.desc;
        unitInfoType.innerHTML = a.typeName;
        var b = a.space;
        lastCount = c;
        c = '<span style="color:#fff">' + c + "</span>";
        unitInfoLimit.innerHTML = b ? '<span><i class="material-icons" style="vertical-align: top; font-size: 20px;">&#xE7FD;</i>' + b + "</span> " + c : c;
        unitInfoUpgrades.innerHTML = "";
        if (d && a.upgrades) {
            for (var g, e, h, f, k, c = 0; c < a.upgrades.length; ++c)(function(b) {
                g = a.upgrades[b];
                var c = !0;
                g.lockMaxBuy && void 0 != g.unitSpawn && (unitList[g.unitSpawn].count || 0) >= (unitList[g.unitSpawn].limit || 0) ?
                    c = !1 : g.dontShow && (c = !1);
                c && (e = document.createElement("div"), e.className = "upgradeInfo", h = document.createElement("div"), h.className = "unitInfoName", h.innerHTML = g.name, e.appendChild(h), f = document.createElement("div"), f.className = "unitInfoCost", g.cost ? (f.innerHTML = "Cost " + g.cost, e.appendChild(f)) : (null), k = document.createElement("div"), k.id = "upgrDesc" + b, k.className = "unitInfoDesc", k.innerHTML = g.desc, k.style.display = "none", e.appendChild(k), e.onmouseover = function() {
                        document.getElementById("upgrDesc" + b).style.display = "block"
                    },
                    e.onmouseout = function() {
                        document.getElementById("upgrDesc" + b).style.display = "none"
                    }, e.onclick = function() {
                        upgradeUnit(b);
                        mainCanvas.focus()
                    }, unitInfoUpgrades.appendChild(e))
            })(c);
            g = e = h = f = k = null
        }
    } else a || (unitInfoContainer.style.display = "none")
}

updateGameLoop = function(a) {
    if (player && gameData) {
        updateTarget();
        if (gameState && mapBounds) {
            if (camXS || camYS) camX += camXS * cameraSpd * a, camY += camYS * cameraSpd * a;
            player.x + camX < mapBounds[0] ? camX = mapBounds[0] - player.x : player.x + camX > mapBounds[0] + mapBounds[2] && (camX = mapBounds[0] + mapBounds[2] - player.x);
            player.y + camY < mapBounds[1] ? camY = mapBounds[1] - player.y : player.y + camY > mapBounds[1] + mapBounds[3] && (camY = mapBounds[1] + mapBounds[3] - player.y);
            currentTime - lastCamSend >= sendFrequency && (lastCamX != camX || lastCamY != camY) && (lastCamX = camX, lastCamY = camY, lastCamSend = currentTime, socket.emit("2", Math.round(camX), Math.round(camY)))
        }
        renderBackground(outerColor);
        var d = (player.x || 0) - maxScreenWidth / 2 + camX,
            c = (player.y || 0) - maxScreenHeight / 2 + camY;
        mapBounds && (mainContext.fillStyle = backgroundColor, mainContext.fillRect(mapBounds[0] - d, mapBounds[1] - c, mapBounds[2], mapBounds[3]));
        for (var b, g, e = 0; e < units.length; ++e) b = units[e], b.interpDst && (g = b.interpDst * a * .015, b.interX +=
            g * MathCOS(b.interpDir), b.interY += g * MathSIN(b.interpDir), b.interpDst -= g, .1 >= b.interpDst && (b.interpDst = 0, b.interX = b.interpDstS * MathCOS(b.interpDir), b.interY = b.interpDstS * MathSIN(b.interpDir))), b.speed && (updateUnitPosition(b), b.x += b.interX || 0, b.y += b.interY || 0);
        var h, f;
        if (gameState)
            if (activeUnit) {
                h = player.x - d + targetDst * MathCOS(targetDir) + camX;
                f = player.y - c + targetDst * MathSIN(targetDir) + camY;
                var k = UTILS.getDirection(h, f, player.x - d, player.y - c);
                0 == activeUnit.type ? (b = UTILS.getDistance(h, f, player.x - d, player.y -
                        c), b - activeUnit.size < player.startSize ? (h = player.x - d + (activeUnit.size + player.startSize) * MathCOS(k), f = player.y - c + (activeUnit.size + player.startSize) * MathSIN(k)) : b + activeUnit.size > player.buildRange - .15 && (h = player.x - d + (player.buildRange - activeUnit.size - .15) * MathCOS(k), f = player.y - c + (player.buildRange - activeUnit.size - .15) * MathSIN(k))) : 1 == activeUnit.type || 2 == activeUnit.type ? (h = player.x - d + (activeUnit.size + player.buildRange) * MathCOS(k), f = player.y - c + (activeUnit.size + player.buildRange) * MathSIN(k)) : 3 == activeUnit.type &&
                    (b = UTILS.getDistance(h, f, player.x - d, player.y - c), b - activeUnit.size < player.startSize ? (h = player.x - d + (activeUnit.size + player.startSize) * MathCOS(k), f = player.y - c + (activeUnit.size + player.startSize) * MathSIN(k)) : b + activeUnit.size > player.buildRange + 2 * activeUnit.size && (h = player.x - d + (player.buildRange + activeUnit.size) * MathCOS(k), f = player.y - c + (player.buildRange + activeUnit.size) * MathSIN(k)));
                activeUnitDir = k;
                activeUnitDst = UTILS.getDistance(h, f, player.x - d, player.y - c);
                activeUnit.dontPlace = !1;
                mainContext.fillStyle =
                    outerColor;
                if (0 == activeUnit.type || 2 == activeUnit.type || 3 == activeUnit.type)
                    for (e = 0; e < units.length; ++e)
                        if (1 != units[e].type && units[e].owner == player.sid && 0 <= activeUnit.size + units[e].size - UTILS.getDistance(h, f, units[e].x - d, units[e].y - c)) {
                            mainContext.fillStyle = redColor;
                            activeUnit.dontPlace = !0;
                            break
                        }
                renderCircle(h, f, activeUnit.range ? activeUnit.range : activeUnit.size + 30, mainContext, !0)
            } else if (selUnits.length)
            for (e = 0; e < selUnits.length; ++e) mainContext.fillStyle = outerColor, 1 < selUnits.length ? renderCircle(selUnits[e].x -
                d, selUnits[e].y - c, selUnits[e].size + 25, mainContext, !0) : renderCircle(selUnits[e].x - d, selUnits[e].y - c, selUnits[e].range ? selUnits[e].range : selUnits[e].size + 25, mainContext, !0);
        else activeBase && (mainContext.fillStyle = outerColor, renderCircle(activeBase.x - d, activeBase.y - c, activeBase.size + 50, mainContext, !0));
        if (selUnits.length)
            for (mainContext.strokeStyle = targetColor, e = 0; e < selUnits.length; ++e) selUnits[e].gatherPoint && renderDottedCircle(selUnits[e].gatherPoint[0] - d, selUnits[e].gatherPoint[1] - c, 30, mainContext);
        for (e = 0; e < users.length; ++e)
            if (b = users[e], !b.dead) {
                mainContext.lineWidth = 1.2 * outlineWidth;
                mainContext.strokeStyle = indicatorColor;
                isOnScreen(b.x - d, b.y - c, b.buildRange) && (mainContext.save(), mainContext.translate(b.x - d, b.y - c), mainContext.rotate(playerBorderRot), renderDottedCircle(0, 0, b.buildRange, mainContext), renderDottedCircle(0, 0, b.startSize, mainContext), mainContext.restore());
                b.spawnProt && (mainContext.strokeStyle = redColor, mainContext.save(), mainContext.translate(b.x - d, b.y - c), mainContext.rotate(playerBorderRot),
                    renderDottedCircle(0, 0, b.buildRange + 140, mainContext), mainContext.restore());
                for (var m = 0; m < users.length; ++m) e < m && !users[m].dead && (mainContext.strokeStyle = b.spawnProt || users[m].spawnProt ? redColor : indicatorColor, playersLinked(b, users[m]) && (isOnScreen(b.x - d, b.y - c, 0) || isOnScreen(users[m].x - d, users[m].y - c, 0) || isOnScreen((b.x + users[m].x) / 2 - d, (b.y + users[m].y) / 2 - c, 0)) && (g = UTILS.getDirection(b.x, b.y, users[m].x, users[m].y), renderDottedLine(b.x - (b.buildRange + lanePad + (b.spawnProt ? 140 : 0)) * MathCOS(g) - d, b.y - (b.buildRange +
                    lanePad + (b.spawnProt ? 140 : 0)) * MathSIN(g) - c, users[m].x + (users[m].buildRange + lanePad + (users[m].spawnProt ? 140 : 0)) * MathCOS(g) - d, users[m].y + (users[m].buildRange + lanePad + (users[m].spawnProt ? 140 : 0)) * MathSIN(g) - c, mainContext)))
            }
        mainContext.strokeStyle = darkColor;
        mainContext.lineWidth = 1.2 * outlineWidth;
        for (e = 0; e < units.length; ++e) b = units[e], b.layer || (b.onScreen = !1, isOnScreen(b.x - d, b.y - c, b.size) && (b.onScreen = !0, renderUnit(b.x - d, b.y - c, b.dir, b, playerColors[b.color], mainContext)));
        for (e = 0; e < units.length; ++e) b = units[e],
            1 == b.layer && (b.onScreen = !1, isOnScreen(b.x - d, b.y - c, b.size) && (b.onScreen = !0, renderUnit(b.x - d, b.y - c, b.dir, b, playerColors[b.color], mainContext)));
        mainContext.fillStyle = bulletColor;
        for (e = bullets.length - 1; 0 <= e; --e) {
            b = bullets[e];
            if (b.speed && (b.x += b.speed * a * MathCOS(b.dir), b.y += b.speed * a * MathSIN(b.dir), UTILS.getDistance(b.sX, b.sY, b.x, b.y) >= b.range)) {
                bullets.splice(e, 1);
                continue
            }
            isOnScreen(b.x - d, b.y - c, b.size) && renderCircle(b.x - d, b.y - c, b.size, mainContext)
        }
        mainContext.strokeStyle = darkColor;
        mainContext.lineWidth =
            1.2 * outlineWidth;
        for (e = 0; e < users.length; ++e) b = users[e], !b.dead && isOnScreen(b.x - d, b.y - c, b.size) && (renderPlayer(b, b.x - d, b.y - c, mainContext), "unknown" != b.name && (tmpIndx = b.name + "-" + b.size, 20 <= b.size && b.nameSpriteIndx != tmpIndx && (b.nameSpriteIndx = tmpIndx, b.nameSprite = renderText(b.name, b.size / 4)), b.nameSprite && mainContext.drawImage(b.nameSprite, b.x - d - b.nameSprite.width / 2, b.y - c - b.nameSprite.height / 2, b.nameSprite.width, b.nameSprite.height)));
        if (selUnits.length)
            for (e = selUnits.length - 1; 0 <= e; --e) selUnits[e] &&
                0 > units.indexOf(selUnits[e]) && disableSelUnit(e);
        activeUnit && renderUnit(h, f, k, activeUnit, playerColors[player.color], mainContext);
        showSelector && (mainContext.fillStyle = "rgba(0, 0, 0, 0.1)", h = player.x - d + targetDst * MathCOS(targetDir) + camX, f = player.y - c + targetDst * MathSIN(targetDir) + camY, mainContext.fillRect(mouseStartX, mouseStartY, h - mouseStartX, f - mouseStartY));
        playerBorderRot += a / 5600;
        hoverUnit ? toggleUnitInfo(hoverUnit) : activeBase ? toggleUnitInfo(activeBase, true) : activeUnit ? toggleUnitInfo(activeUnit) :
            0 < selUnits.length ? toggleUnitInfo(selUnits[0].info, !0) : toggleUnitInfo()
    }
};
window.centralizer = function() {
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);
socket.emit("5", (player.x)-1, (player.y)+1, e, 0, -1);
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);
socket.emit("5", (player.x)+1, (player.y)-1, e, 0, -1);
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);
socket.emit("5", (player.x)*1, (player.y)*1, e, 0, -1);
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);
socket.emit("5", (player.x), (player.y), e, 0, -1);
}

window.makeUI = function() {
    if (window.hasMadeUI) return;
    window.hasMadeUI = true;
    window.statusItems.sort(function(a, b) {
        return a.order - b.order;
    })
    var levels = [];
    window.UIList.forEach((item) => {
        if (!levels[item.level]) levels[item.level] = [];
        levels[item.level].push(item)
    })

    levels = levels.filter((a) => {
        if (a) {
            a.sort(function(a, b) {
                return a.x - b.x;
            })
            return true;
        } else {
            return false;
        }
    })

    var headAppend = document.getElementsByTagName("head")[0],
        style = document.createElement("div");

    var toast = document.createElement('div');
    toast.id = "snackbar";
    var css = document.createElement('div');
    //legal Colors
    css.innerHTML = '<style>\n\
#snackbar {\n\
    visibility: hidden;\n\
    min-width: 250px;\n\
    margin-left: -125px;\n\
    background-color: #ffffff;\n\
    color: #303f9f;\n\
    text-align: center;\n\
    border-radius: 4px;\n\
    padding: 10px;\n\
    font-family: "regularF";\n\
    font-size: 20px;\n\
    position: fixed;\n\
    z-index: 100;\n\
    left: 30%;\n\
    top: 30px;\n\
}\n\
#snackbar.show {\n\
    visibility: visible;\n\
    -webkit-animation: fadein 0.5s;\n\
    animation: fadein 0.5s;\n\
}\n\
#snackbar.hide {\n\
    visibility: visible;\n\
    -webkit-animation: fadeout 0.5s;\n\
    animation: fadeout 0.5s;\n\
}\n\
@-webkit-keyframes fadein {\n\
    from {top: 0; opacity: 0;}\n\
    to {top: 30px; opacity: 1;}\n\
}\n\
@keyframes fadein {\n\
    from {top: 0; opacity: 0;}\n\
    to {top: 30px; opacity: 1;}\n\
}\n\
@-webkit-keyframes fadeout {\n\
    from {top: 30px; opacity: 1;}\n\
    to {top: 0; opacity: 0;}\n\
}\n\
@keyframes fadeout {\n\
    from {top: 30px; opacity: 1;}\n\
    to {top: 0; opacity: 0;}\n\
}\n\
</style>'
    var height = levels.length * (14 + 19) + (levels.length - 1) * 7 + 15;
    style.innerHTML = "<style>\n\
#noobscriptUI, #noobscriptUI > div > div {\n\
    background-color:rgba(51, 51, 51, 0.6);\n\
    margin-left: 3px;\n\
    border-radius:4px;\n\
    pointer-events:all\n\
}\n\
#noobscriptUI {\n\
    top: -" + (height + 12) + "px;\n\
    transition: 0.5s;\n\
    right: 400px;\n\
    position:absolute;\n\
    padding-left:24px;\n\
    margin-top:9px;\n\
    padding-top:15px;\n\
    width:650px;\n\
    height: " + height + "px;\n\
    font-family:regularF;\n\
}\n\
#noobscriptUI:hover{\n\
    top:0px\n\
}\n\
#noobscriptUI > div > div {\n\
    color:#fff;\n\
    padding:7px;\n\
    height:19px;\n\
    display:inline-block;\n\
    cursor:pointer;\n\
    font-size:15px\n\
}\n\
</style>"

    headAppend.appendChild(style);
    headAppend.appendChild(css);


    var contAppend = document.getElementById("gameUiContainer"),
        menuA = document.createElement("div");

    var code = ['<div id="noobscriptUI">\n'];

    levels.forEach((items, i) => {
        code.push(i === 0 ? '    <div>\n' : '    <div style="margin-top:7px;">\n');
        items.forEach((el) => {
            code.push('        ' + el.html + '\n');
        })
        code.push('    </div>\n');
    })
    code.push('    <div id="confinfo" style="margin-top:4px; color: white; text-align: center; font-size: 10px; white-space:pre"></div>')
    code.push('</div>');

    menuA.innerHTML = code.join("");
    contAppend.insertBefore(menuA, contAppend.firstChild)
    contAppend.appendChild(toast)
    var toastTimeout = false;
    window.showToast = function(msg) {
        toast.textContent = msg;

        if (toastTimeout) clearTimeout(toastTimeout);
        else toast.className = "show";
        toastTimeout = setTimeout(function() {
            toast.className = 'hide'
            setTimeout(function() {
                toast.className = '';
            }, 400);
            toastTimeout = false;
        }, 3000);
    }
    window.statusBar = function() {
        var el = document.getElementById('confinfo');
        var text = [];

        window.statusItems.forEach((item, i) => {
            if (i !== 0) text.push('     ');
            if (item.name) text.push(item.name + ': ');
            text.push(item.value());
        })

        el.textContent = text.join('');
    }
    window.statusBar();

    window.initFuncs.forEach((func) => {
        func();
    })
}
setTimeout(() => {
    window.makeUI();
}, 0)

window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];
window.UIList.push({
    level: 0,
    x: 0,
    html: '<div onclick=keycodemenu()>Key Codes</div>'},{
    level: 0,
    x: 1,
    html: '<div onclick=resetkeys()>Reset Keys</div>'},{
    level: 0,
    x: 2,
    html: '<div onclick=invite()>Invite</div>'},{
        level: 0,
    x: 4,
    html: '<div onclick=botsmais()>+</div><div>Bots</div><div onclick=botsmenos()>-</div>'},{
    level:0,x:5,html: '<div id=botsactions onclick=actions()>Ações Individuais</div>'},{
    level: 1,
    x: 0,
    html: '<div id="Theme" onclick=theme()>Black Theme</div>'},{
    level: 0,
    x: 3,
    html: '<div onclick=centralizer()>Centralizer</div>'
})
/*var floodtop = false;
window.floodao = function () {
    var elaa = document.getElementById('floo');
    if (floodtop) {
        floodtop = false;
        elaa.textContent = 'Auto Defense: Off';
        clearInterval(flood);
    } else {
        floodtop = true;
        elaa.textContent = 'Auto Defense: On';
        window.flood = setInterval(reconhecimento, 50)
function reconhecimento(){
if(floodtop===false) return
units.forEach(async(unit) => {
if(unit.owner!==player.sid && (unit.x>(player.x-311))&&(unit.x<(player.x+311))&&(unit.y>(player.y-311))&&(unit.y<(player.y+311))){
            socket.emit("1", -1.06, 310, 1),socket.emit("1", -2.08, 310, 1),socket.emit("1", -0.64, 310, 1),socket.emit("1", -2.5, 310, 1),socket.emit("1", -1.87, 306, 1),socket.emit("1", -1.27, 306, 1),socket.emit("1", -1.67, 306, 1),socket.emit("1", -1.47, 306, 1),socket.emit("1", -2.29, 306, 1),socket.emit("1", -0.85, 306, 1),socket.emit("1", -0.43, 306, 1),socket.emit("1", -2.71, 306, 1),socket.emit("1", -2.91, 306, 1),socket.emit("1", -0.23, 306, 1),socket.emit("1", -0.03, 306, 1),socket.emit("1", -3.11, 306, 1),socket.emit("1", 2.97, 306, 1),socket.emit("1", 0.17, 306, 1),socket.emit("1", 2.77, 306, 1),socket.emit("1", 0.37, 306, 1),socket.emit("1", 0.57, 306, 1),socket.emit("1", 2.57, 306, 1),socket.emit("1", 2.37, 306, 1),socket.emit("1", 0.77, 306, 1),socket.emit("1", 0.97, 306, 1),socket.emit("1", 2.17, 306, 1),socket.emit("1", 1.97, 306, 1),socket.emit("1", 1.17, 306, 1),socket.emit("1", 1.37, 306, 1),socket.emit("1", 1.77, 306, 1),socket.emit("1",Math.PI*-1.5,306,1)

if(unit.owner!==player.sid && (unit.x>(player.x-246))&&(unit.x<(player.x+246))&&(unit.y>(player.y-246))&&(unit.y<(player.y+246))){
    socket.emit("1", -1.7, 245.85, 1),socket.emit("1", -1.45, 245.85, 1),socket.emit("1", -1.96, 245.85, 1),socket.emit("1", -1.19, 245.85, 1),socket.emit("1", -0.94, 245.85, 1),socket.emit("1", -2.21, 245.85, 1),socket.emit("1", -2.46, 245.85, 1),socket.emit("1", -0.69, 245.85, 1),socket.emit("1", -2.71, 245.85, 1),socket.emit("1", -0.44, 245.85, 1),socket.emit("1", -2.96, 245.85, 1),socket.emit("1", -0.19, 245.85, 1),socket.emit("1", 3.07, 245.85, 1),socket.emit("1", 0.06, 245.85, 1),socket.emit("1", 2.82, 245.85, 1),socket.emit("1", 0.31, 245.85, 1),socket.emit("1", 2.57, 245.85, 1),socket.emit("1", 0.57, 245.85, 1),socket.emit("1", 2.32, 245.85, 1),socket.emit("1", 0.82, 245.85, 1),socket.emit("1", 1.07, 245.85, 1),socket.emit("1", 2.07, 245.85, 1),socket.emit("1", 1.32, 245.85, 1),socket.emit("1", 1.82, 245.85, 1),socket.emit("1",Math.PI*-1.5,245.85,1)
if(unit.owner!==player.sid && (unit.x>(player.x-186))&&(unit.x<(player.x+186))&&(unit.y>(player.y-1))&&(unit.y<(player.y+186))){
    socket.emit("1", -1.91, 184.69, 1),socket.emit("1", -1.23, 184.4, 1),socket.emit("1", -2.25, 185.57, 1),socket.emit("1", -0.89, 184.93, 1),socket.emit("1", -2.58, 190.21, 1),socket.emit("1", -0.56, 190.16, 1),socket.emit("1", -2.9, 186.72, 1),socket.emit("1", -0.24, 185.76, 1),socket.emit("1", 3.05, 183.1, 1),socket.emit("1", 0.09, 183.95, 1),socket.emit("1", 0.42, 189.81, 1),socket.emit("1", 2.72, 189.79, 1),socket.emit("1", 0.74, 187.09, 1),socket.emit("1", 2.4, 188, 1),socket.emit("1", 2.07, 181, 1),socket.emit("1", 1.08, 181.02, 1),socket.emit("1", 1.735, 188.31, 1),socket.emit("1", 1.41, 188.81, 1)
if(unit.owner!==player.sid && (unit.x>(player.x-141))&&(unit.x<(player.x+141))&&(unit.y>(player.y-141))&&(unit.y<(player.y+141))){
    socket.emit("1",Math.PI*1.5,140,1),socket.emit("1", -2.095, 130, 1),socket.emit("1", -1.048, 130, 1),socket.emit("1", -2.565, 130, 1),socket.emit("1", -0.58, 130, 1),socket.emit("1", -3.035, 130, 1),socket.emit("1", -0.09, 130, 1),socket.emit("1", 0.38, 130, 1),socket.emit("1", 2.78, 130, 1),socket.emit("1", 2.3, 130, 1),socket.emit("1", 0.86, 130, 1),socket.emit("1", 1.83, 130, 1),socket.emit("1", 1.33, 130, 1)

}}}}})
}
    }
    window.statusBar();
    return floodtop()
}
*/
var outlineWidth = 2.5,
lanePad = 10,
darkColor = "#ffffff99",
backgroundColor = "#101010",
outerColor = "#262626",
indicatorColor = "#ffffff",
turretColor = "#000000",
bulletColor = "#ffffff99",
redColor = "#ffffff",
targetColor = "#ffffff",
unitRotSpd = .5,
cameraSpd = 1.2,
camSpdM = 1.2,
playerSkins = 27,
currentSkin = 0
window.useTheme = true;
window.theme = function () {
    var el = document.getElementById('Theme');
    if (useTheme) {
        useTheme = false
    outlineWidth = 7
    lanePad = 20
    darkColor = "#666666"
    backgroundColor = "#ebebeb"
    outerColor = "#d6d6d6"
    indicatorColor =
    "rgba(0,0,0,0.08)"
    turretColor = "#A8A8A8"
    bulletColor = "#A8A8A8"
    redColor = "rgba(255, 0, 0, 0.1)"
    targetColor = "#b4b4b4"
    el.textContent = 'White Theme'
    } else {
        useTheme = true;
outlineWidth = 2.5
lanePad = 10
darkColor = "#ffffff99"
backgroundColor = "#101010"
outerColor = "#262626"
indicatorColor = "#ffffff"
turretColor = "#000000"
bulletColor = "#ffffff99"
redColor = "#ffffff"
targetColor = "#ffffff"
unitRotSpd = .5
cameraSpd = 1.2
camSpdM = 1.2
playerSkins = 27
currentSkin = 0
    el.textContent = 'Black Theme';
    }
    window.statusBar();
    return useTheme;
}
window.acoesbots = false;
window.actions = function () {
var elaa = document.getElementById('botsactions');
if (acoesbots) {
acoesbots = false
elaa.textContent = 'Ações Individuais'
} else {
acoesbots = true;
elaa.textContent = 'Ações Espelhadas';
}}
function renderDottedCircle (a, d, c, b) {
b.setLineDash([5500, 1200]);
b.beginPath();
b.arc(a, d, c + b.lineWidth / 2, 0, 2 * Math.PI);
b.stroke();
b.setLineDash([])
}
window.botsmais=function() {
    var xy = parseInt(prompt("Quantidade de bot"));
    if(xy > 0 && xy < 50){BotAmout(xy,name)
}else{
addChat('Quantidade de bots não aceita.', 'Client')
}}
window.botsmenos=function() {window.sockets.forEach(socket => {socket.close();var id=0})};
window.sockets = [];
window.unlockSkins();
var id=0;
window.newSocket=function() {
window.socketBot = io.connect(socket.io.uri, {
query: "cid=" + UTILS.getUniqueID() + "&rmid=" + lobbyRoomID,
});
window.sockets.push(window.socketBot);
grecaptcha.execute("6Ldh8e0UAAAAAFOKBv25wQ87F3EKvBzyasSbqxCE").then(function(a) {
sockets[id].emit("spawn", {
name: userNameInput.value,
skin: currentSkin
}, a);
id++;
});
}
function BotAmout(number, botName) {for (var i = 0; i < number; i++) {newSocket(botName);}}
function playersLinked(a, d) {if (a.sid == player.sid && d.name.startsWith(player.name)) {return true}}

window.resetkeys = function () {
localStorage.clear();
}
window.invite = function() {
alert("http://bloble.io/?l="+partyKey)
}
function buildbase(){socket.emit("1", -1.06, 310, 8); socket.emit("1", -2.08, 310, 8); socket.emit("1", -0.64, 310, 8); socket.emit("1", -2.5, 310, 8); socket.emit("1", -1.87, 306, 1); socket.emit("1", -1.27, 306, 1); socket.emit("1", -1.67, 306, 1); socket.emit("1", -1.47, 306, 1); socket.emit("1", -2.29, 306, 1); socket.emit("1", -0.85, 306, 1); socket.emit("1", -0.43, 306, 1); socket.emit("1", -2.71, 306, 1); socket.emit("1", -2.91, 306, 1); socket.emit("1", -0.23, 306, 1); socket.emit("1", -0.03, 306, 1); socket.emit("1", -3.11, 306, 1); socket.emit("1", 2.97, 306, 1); socket.emit("1", 0.17, 306, 1); socket.emit("1", 2.77, 306, 1); socket.emit("1", 0.37, 306, 1); socket.emit("1", 0.57, 306, 1); socket.emit("1", 2.57, 306, 1); socket.emit("1", 2.37, 306, 1); socket.emit("1", 0.77, 306, 1); socket.emit("1", 0.97, 306, 1); socket.emit("1", 2.17, 306, 1); socket.emit("1", 1.97, 306, 1); socket.emit("1", 1.17, 306, 1); socket.emit("1", 1.37, 306, 1); socket.emit("1", 1.77, 306, 1); socket.emit("1",Math.PI*-1.5,306,1); socket.emit("1", -1.7, 245.85, 4); socket.emit("1", -1.45, 245.85, 4); socket.emit("1", -1.96, 245.85, 4); socket.emit("1", -1.19, 245.85, 4); socket.emit("1", -0.94, 245.85, 4); socket.emit("1", -2.21, 245.85, 4); socket.emit("1", -2.46, 245.85, 4); socket.emit("1", -0.69, 245.85, 4); socket.emit("1", -2.71, 245.85, 4); socket.emit("1", -0.44, 245.85, 4); socket.emit("1", -2.96, 245.85, 4); socket.emit("1", -0.19, 245.85, 4); socket.emit("1", 3.07, 245.85, 4); socket.emit("1", 0.06, 245.85, 4); socket.emit("1", 2.82, 245.85, 4); socket.emit("1", 0.31, 245.85, 4); socket.emit("1", 2.57, 245.85, 4); socket.emit("1", 0.57, 245.85, 4); socket.emit("1", 2.32, 245.85, 4); socket.emit("1", 0.82, 245.85, 4); socket.emit("1", 1.07, 245.85, 4); socket.emit("1", 2.07, 245.85, 4); socket.emit("1", 1.32, 245.85, 4); socket.emit("1", 1.82, 245.85, 4); socket.emit("1",Math.PI*-1.5,245,4); socket.emit("1", -1.91, 184.69, 4); socket.emit("1", -1.23, 184.4, 4); socket.emit("1", -2.25, 185.57, 4); socket.emit("1", -0.89, 184.93, 4); socket.emit("1", -2.58, 190.21, 4); socket.emit("1", -0.56, 190.16, 4); socket.emit("1", -2.9, 186.72, 4); socket.emit("1", -0.24, 185.76, 4); socket.emit("1", 3.05, 183.1, 4); socket.emit("1", 0.09, 183.95, 4); socket.emit("1", 0.42, 189.81, 4); socket.emit("1", 2.72, 189.79, 4); socket.emit("1", 0.74, 187.09, 4); socket.emit("1", 2.4, 188, 4); socket.emit("1", 2.07, 181, 4); socket.emit("1", 1.08, 181.02, 4); socket.emit("1", 1.735, 188.31, 4); socket.emit("1", 1.41, 188.81, 4); socket.emit("1",Math.PI*1.5,140,7); socket.emit("1", -2.095, 130, 4); socket.emit("1", -1.048, 130, 4); socket.emit("1", -2.565, 130, 4); socket.emit("1", -0.58, 130, 4); socket.emit("1", -3.035, 130, 4); socket.emit("1", -0.09, 130, 4); socket.emit("1", 0.38, 130, 4); socket.emit("1", 2.78, 130, 4); socket.emit("1", 2.3, 130, 4); socket.emit("1", 0.86, 130, 4); socket.emit("1", 1.83, 130, 4); socket.emit("1", 1.33, 130, 4)}

function sellwallsespecificas(){
function Sell(MyX, MyY, MyPath){var getY;for(var s=[],i=0;i<units.length;i++){if(units[i].owner==player.sid){if(units[i].type!==1){
getY = UTILS.getDistance(player.x,player.y,units[i].x,units[i].y);
var X = units[i].dir,Y = UTILS.roundToTwo(getY),Path = units[i].uPath;
if(X>(MyX-0.1)&&X<(MyX+0.1)){if(Y>(MyY-1)&&Y<(MyY+1)){if(Path[0]==MyPath){s.push(units[i].id);socket.emit("3",s);}}}}}}};
Sell(-1.06, 306, 1);Sell(-2.08, 306, 1);Sell(-0.64, 306, 1);Sell(-2.5, 306, 1);
for (var i = 0, s = []; i < units.length; ++i) {
var SellTest = UTILS.getDistance(player.x, player.y, units[i].x, units[i].y);
if (UTILS.roundToTwo(SellTest) < 300 && "circle" === units[i].shape && units[i].type === 3 && units[i].owner === player.sid) {
s.push(units[i].id);socket.emit("3", s);
}}
}
function antikick() {setInterval(function(){if(window.socket){window.socket.emit("2",window.camX,window.camY)}},20000)}antikick();
function antikickbots() {setInterval(function(){if(window.sockets){for (var z = 0; z < window.sockets.length; z++){window.sockets[z].emit("2",window.camX,window.camY)}}},20000)}antikickbots();
function usersWithTag() {if (users.lenght !== 0) {for (var o = [], i = 0, e = users; i < e.length; ++i) {if (users[i].sid !== player.sid && users[i].name.startsWith(player.name)) {o.push(users[i])}}return o.length}else {return 0}}
function selUnitsMidPoint() {x = 0;y = 0;for (i = 0, a = selUnits; i < a.length; ++i) {y = selUnits[i].y + y;x = selUnits[i].x + x}return [x / a.length, y / a.length]}
function upgradeSelUnits(firstUnit,upgrade){var firstUnitName = window.getUnitFromPath(firstUnit.uPath).name;for(var i=0;i<window.selUnits.length;i++){var unit = window.selUnits[i];if(window.getUnitFromPath(unit.uPath).name==firstUnitName){socket.emit("4",unit.id,upgrade);for (var b = 0; b < window.sockets.length; b++){window.sockets[b].emit("4",unit.id,upgrade)}}}}
function gens(){
socket.emit("1", 4.73, 245, 3), socket.emit("1", 5.0025, 245, 3), socket.emit("1", 5.275, 245, 3), socket.emit("1", 5.5475, 245, 3), socket.emit("1", 5.82, 245, 3), socket.emit("1", 6.0925, 245, 3), socket.emit("1", 6.365, 245, 3), socket.emit("1", 6.6375, 245, 3), socket.emit("1", 6.91, 245, 3), socket.emit("1", 7.1825, 245, 3), socket.emit("1", 7.455, 245, 3), socket.emit("1", 7.7275, 245, 3), socket.emit("1", 8.0025, 245, 3), socket.emit("1", 8.275, 245, 3), socket.emit("1", 8.5475, 245, 3), socket.emit("1", 8.82, 245, 3), socket.emit("1", 9.0925, 245, 3), socket.emit("1", 9.3675, 245, 3), socket.emit("1", 9.64, 245, 3), socket.emit("1", 9.9125, 245, 3), socket.emit("1", 10.1875, 245, 3), socket.emit("1", 10.4625, 245, 3), socket.emit("1", 10.7375, 245, 3), socket.emit("1", 5.64, 180, 3), socket.emit("1", 5.999, 180, 3), socket.emit("1", 6.51, 185, 3), socket.emit("1", 7.05, 185, 3), socket.emit("1", 7.6, 185, 3), socket.emit("1", 8.15, 185, 3), socket.emit("1", 8.675, 185, 3), socket.emit("1", 9.225, 185, 3), socket.emit("1", 9.78, 185, 3), socket.emit("1", 10.325, 185, 3), socket.emit("1", 5.36, 130, 3), socket.emit("1", 6.275, 130, 3), socket.emit("1", 6.775, 130, 3), socket.emit("1", 7.3, 130, 3), socket.emit("1", 7.85, 130, 3), socket.emit("1", 8.4, 130, 3), socket.emit("1", 8.925, 130, 3), socket.emit("1", 9.5, 130, 3), socket.emit("1", 10.05, 130, 3),socket.emit("1",Math.PI*1.5,140,7)}
function walls(){
socket.emit("1", -1.87, 306, 1),socket.emit("1", -1.27, 306, 1),socket.emit("1", -1.67, 306, 1),socket.emit("1", -1.47, 306, 1),socket.emit("1", -2.29, 306, 1),socket.emit("1", -0.85, 306, 1),socket.emit("1", -0.43, 306, 1),socket.emit("1", -2.71, 306, 1),socket.emit("1", -2.91, 306, 1),socket.emit("1", -0.23, 306, 1),socket.emit("1", -0.03, 306, 1),socket.emit("1", -3.11, 306, 1),socket.emit("1", 2.97, 306, 1),socket.emit("1", 0.17, 306, 1),socket.emit("1", 2.77, 306, 1),socket.emit("1", 0.37, 306, 1),socket.emit("1", 0.57, 306, 1),socket.emit("1", 2.57, 306, 1),socket.emit("1", 2.37, 306, 1),socket.emit("1", 0.77, 306, 1),socket.emit("1", 0.97, 306, 1),socket.emit("1", 2.17, 306, 1),socket.emit("1", 1.97, 306, 1),socket.emit("1", 1.17, 306, 1),socket.emit("1", 1.37, 306, 1),socket.emit("1", 1.77, 306, 1),socket.emit("1",Math.PI*-1.5,306,1)}
function base(){
socket.emit("1", -1.87, 306, 1),socket.emit("1", -1.27, 306, 1),socket.emit("1", -1.67, 306, 1),socket.emit("1", -1.47, 306, 1),socket.emit("1", -2.29, 306, 1),socket.emit("1", -0.85, 306, 1),socket.emit("1", -0.43, 306, 1),socket.emit("1", -2.71, 306, 1),socket.emit("1", -2.91, 306, 1),socket.emit("1", -0.23, 306, 1),socket.emit("1", -0.03, 306, 1),socket.emit("1", -3.11, 306, 1),socket.emit("1", 2.97, 306, 1),socket.emit("1", 0.17, 306, 1),socket.emit("1", 2.77, 306, 1),socket.emit("1", 0.37, 306, 1),socket.emit("1", 0.57, 306, 1),socket.emit("1", 2.57, 306, 1),socket.emit("1", 2.37, 306, 1),socket.emit("1", 0.77, 306, 1),socket.emit("1", 0.97, 306, 1),socket.emit("1", 2.17, 306, 1),socket.emit("1", 1.97, 306, 1),socket.emit("1", 1.17, 306, 1),socket.emit("1", 1.37, 306, 1),socket.emit("1", 1.77, 306, 1),socket.emit("1",Math.PI*-1.5,306,1),socket.emit("1", -1.7, 245.85, 4),socket.emit("1", -1.45, 245.85, 4),socket.emit("1", -1.96, 245.85, 4),socket.emit("1", -1.19, 245.85, 4),socket.emit("1", -0.94, 245.85, 4),socket.emit("1", -2.21, 245.85, 4),socket.emit("1", -2.46, 245.85, 4),socket.emit("1", -0.69, 245.85, 4),socket.emit("1", -2.71, 245.85, 4),socket.emit("1", -0.44, 245.85, 4),socket.emit("1", -2.96, 245.85, 4),socket.emit("1", -0.19, 245.85, 4),socket.emit("1", 3.07, 245.85, 4),socket.emit("1", 0.06, 245.85, 4),socket.emit("1", 2.82, 245.85, 4),socket.emit("1", 0.31, 245.85, 4),socket.emit("1", 2.57, 245.85, 4),socket.emit("1", 0.57, 245.85, 4),socket.emit("1", 2.32, 245.85, 4),socket.emit("1", 0.82, 245.85, 4),socket.emit("1", 1.07, 245.85, 4),socket.emit("1", 2.07, 245.85, 4),socket.emit("1", 1.32, 245.85, 4),socket.emit("1", 1.82, 245.85, 4),socket.emit("1",Math.PI*-1.5,245,4),socket.emit("1", -1.91, 184.69, 4),socket.emit("1", -1.23, 184.4, 4),socket.emit("1", -2.25, 185.57, 4),socket.emit("1", -0.89, 184.93, 4),socket.emit("1", -2.58, 190.21, 4),socket.emit("1", -0.56, 190.16, 4),socket.emit("1", -2.9, 186.72, 4),socket.emit("1", -0.24, 185.76, 4),socket.emit("1", 3.05, 183.1, 4),socket.emit("1", 0.09, 183.95, 4),socket.emit("1", 0.42, 189.81, 4),socket.emit("1", 2.72, 189.79, 4),socket.emit("1", 0.74, 187.09, 4),socket.emit("1", 2.4, 188, 4),socket.emit("1", 2.07, 181, 4),socket.emit("1", 1.08, 181.02, 4),socket.emit("1", 1.735, 188.31, 4),socket.emit("1", 1.41, 188.81, 4),socket.emit("1",Math.PI*1.5,140,7),socket.emit("1", -2.095, 130, 4),socket.emit("1", -1.048, 130, 4),socket.emit("1", -2.565, 130, 4),socket.emit("1", -0.58, 130, 4),socket.emit("1", -3.035, 130, 4),socket.emit("1", -0.09, 130, 4),socket.emit("1", 0.38, 130, 4),socket.emit("1", 2.78, 130, 4),socket.emit("1", 2.3, 130, 4),socket.emit("1", 0.86, 130, 4),socket.emit("1", 1.83, 130, 4),socket.emit("1", 1.33, 130, 4)}
function barracks1(){
socket.emit("1", -2.5, 310, 8)}
function barracks2(){
socket.emit("1", -1.06, 310, 8);socket.emit("1", -2.08, 310, 8);socket.emit("1", -0.64, 310, 8);}
function greatleadership(){
for (var i = 0; i < units.length; ++i) 1 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0);}
function upbarracks(){
for (var i = 0; i < units.length; ++i) 2 == units[i].type && "square" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)}
function micro(){
for (var i = 0; i < units.length; ++i) 3== units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)}
function upgens(){
for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)}
function command(){
socket.emit("4",0,0,1)}
function siege(){
for (var i = 0; i < units.length; ++i) 2 == units[i].type && "square" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 2)}
function armory(){
for (var i = 0; i < units.length; ++i) 0 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)}
function sellgens(){
 for (var a = [], d = 0; d < units.length; ++d) {
  if (units[d].type === 0 && units[d].owner == player.sid) {
   var name = getUnitFromPath(units[d].uPath).name;
    (name === 'Generator' || name === 'Power Plant') && a.push(units[d].id)
}}
socket.emit("3", a)}
function sellsiege(){
 for (var a = [], d = 0; d < units.length; ++d) {
  if (units[d].type === 2 && units[d].owner == player.sid) {
   var name = getUnitFromPath(units[d].uPath).name;
    (name === 'Siege Factory') && a.push(units[d].id)
}}
socket.emit("3", a)}
bases()
function bases(){
if(acoesbots) {window.sockets.forEach(socket => {
var w=2;
var defend=function defend(){socket.emit("1", -1.06, 310, 1),socket.emit("1", -2.08, 310, 1),socket.emit("1", -0.64, 310, 1),socket.emit("1", -2.5, 310, 1),socket.emit("1", -1.87, 306, 1),socket.emit("1", -1.27, 306, 1),socket.emit("1", -1.67, 306, 1),socket.emit("1", -1.47, 306, 1),socket.emit("1", -2.29, 306, 1),socket.emit("1", -0.85, 306, 1),socket.emit("1", -0.43, 306, 1),socket.emit("1", -2.71, 306, 1),socket.emit("1", -2.91, 306, 1),socket.emit("1", -0.23, 306, 1),socket.emit("1", -0.03, 306, 1),socket.emit("1", -3.11, 306, 1),socket.emit("1", 2.97, 306, 1),socket.emit("1", 0.17, 306, 1),socket.emit("1", 2.77, 306, 1),socket.emit("1", 0.37, 306, 1),socket.emit("1", 0.57, 306, 1),socket.emit("1", 2.57, 306, 1),socket.emit("1", 2.37, 306, 1),socket.emit("1", 0.77, 306, 1),socket.emit("1", 0.97, 306, 1),socket.emit("1", 2.17, 306, 1),socket.emit("1", 1.97, 306, 1),socket.emit("1", 1.17, 306, 1),socket.emit("1", 1.37, 306, 1),socket.emit("1", 1.77, 306, 1),socket.emit("1",Math.PI*-1.5,306,1), socket.emit("1", -1.7, 245.85, 1),socket.emit("1", -1.45, 245.85, 1),socket.emit("1", -1.96, 245.85, 1),socket.emit("1", -1.19, 245.85, 1),socket.emit("1", -0.94, 245.85, 1),socket.emit("1", -2.21, 245.85, 1),socket.emit("1", -2.46, 245.85, 1),socket.emit("1", -0.69, 245.85, 1),socket.emit("1", -2.71, 245.85, 1),socket.emit("1", -0.44, 245.85, 1),socket.emit("1", -2.96, 245.85, 1),socket.emit("1", -0.19, 245.85, 1),socket.emit("1", 3.07, 245.85, 1),socket.emit("1", 0.06, 245.85, 1),socket.emit("1", 2.82, 245.85, 1),socket.emit("1", 0.31, 245.85, 1),socket.emit("1", 2.57, 245.85, 1),socket.emit("1", 0.57, 245.85, 1),socket.emit("1", 2.32, 245.85, 1),socket.emit("1", 0.82, 245.85, 1),socket.emit("1", 1.07, 245.85, 1),socket.emit("1", 2.07, 245.85, 1),socket.emit("1", 1.32, 245.85, 1),socket.emit("1", 1.82, 245.85, 1),socket.emit("1",Math.PI*-1.5,245.85,1), socket.emit("1", -1.91, 184.69, 1),socket.emit("1", -1.23, 184.4, 1),socket.emit("1", -2.25, 185.57, 1),socket.emit("1", -0.89, 184.93, 1),socket.emit("1", -2.58, 190.21, 1),socket.emit("1", -0.56, 190.16, 1),socket.emit("1", -2.9, 186.72, 1),socket.emit("1", -0.24, 185.76, 1),socket.emit("1", 3.05, 183.1, 1),socket.emit("1", 0.09, 183.95, 1),socket.emit("1", 0.42, 189.81, 1),socket.emit("1", 2.72, 189.79, 1),socket.emit("1", 0.74, 187.09, 1),socket.emit("1", 2.4, 188, 1),socket.emit("1", 2.07, 181, 1),socket.emit("1", 1.08, 181.02, 1),socket.emit("1", 1.735, 188.31, 1),socket.emit("1", 1.41, 188.81, 1), socket.emit("1",Math.PI*1.5,140,1),socket.emit("1", -2.095, 130, 1),socket.emit("1", -1.048, 130, 1),socket.emit("1", -2.565, 130, 1),socket.emit("1", -0.58, 130, 1),socket.emit("1", -3.035, 130, 1),socket.emit("1", -0.09, 130, 1),socket.emit("1", 0.38, 130, 1),socket.emit("1", 2.78, 130, 1),socket.emit("1", 2.3, 130, 1),socket.emit("1", 0.86, 130, 1),socket.emit("1", 1.83, 130, 1),socket.emit("1", 1.33, 130, 1)}
addEventListener('keydown',function(a){
if(a.keyCode==keydefesa){
defend()
let y=1;
if(w<y){defend()
}}})})}
var w=2;
var defend=function defend(){socket.emit("1", -1.06, 310, 1),socket.emit("1", -2.08, 310, 1),socket.emit("1", -0.64, 310, 1),socket.emit("1", -2.5, 310, 1),socket.emit("1", -1.87, 306, 1),socket.emit("1", -1.27, 306, 1),socket.emit("1", -1.67, 306, 1),socket.emit("1", -1.47, 306, 1),socket.emit("1", -2.29, 306, 1),socket.emit("1", -0.85, 306, 1),socket.emit("1", -0.43, 306, 1),socket.emit("1", -2.71, 306, 1),socket.emit("1", -2.91, 306, 1),socket.emit("1", -0.23, 306, 1),socket.emit("1", -0.03, 306, 1),socket.emit("1", -3.11, 306, 1),socket.emit("1", 2.97, 306, 1),socket.emit("1", 0.17, 306, 1),socket.emit("1", 2.77, 306, 1),socket.emit("1", 0.37, 306, 1),socket.emit("1", 0.57, 306, 1),socket.emit("1", 2.57, 306, 1),socket.emit("1", 2.37, 306, 1),socket.emit("1", 0.77, 306, 1),socket.emit("1", 0.97, 306, 1),socket.emit("1", 2.17, 306, 1),socket.emit("1", 1.97, 306, 1),socket.emit("1", 1.17, 306, 1),socket.emit("1", 1.37, 306, 1),socket.emit("1", 1.77, 306, 1),socket.emit("1",Math.PI*-1.5,306,1), socket.emit("1", -1.7, 245.85, 1),socket.emit("1", -1.45, 245.85, 1),socket.emit("1", -1.96, 245.85, 1),socket.emit("1", -1.19, 245.85, 1),socket.emit("1", -0.94, 245.85, 1),socket.emit("1", -2.21, 245.85, 1),socket.emit("1", -2.46, 245.85, 1),socket.emit("1", -0.69, 245.85, 1),socket.emit("1", -2.71, 245.85, 1),socket.emit("1", -0.44, 245.85, 1),socket.emit("1", -2.96, 245.85, 1),socket.emit("1", -0.19, 245.85, 1),socket.emit("1", 3.07, 245.85, 1),socket.emit("1", 0.06, 245.85, 1),socket.emit("1", 2.82, 245.85, 1),socket.emit("1", 0.31, 245.85, 1),socket.emit("1", 2.57, 245.85, 1),socket.emit("1", 0.57, 245.85, 1),socket.emit("1", 2.32, 245.85, 1),socket.emit("1", 0.82, 245.85, 1),socket.emit("1", 1.07, 245.85, 1),socket.emit("1", 2.07, 245.85, 1),socket.emit("1", 1.32, 245.85, 1),socket.emit("1", 1.82, 245.85, 1),socket.emit("1",Math.PI*-1.5,245.85,1), socket.emit("1", -1.91, 184.69, 1),socket.emit("1", -1.23, 184.4, 1),socket.emit("1", -2.25, 185.57, 1),socket.emit("1", -0.89, 184.93, 1),socket.emit("1", -2.58, 190.21, 1),socket.emit("1", -0.56, 190.16, 1),socket.emit("1", -2.9, 186.72, 1),socket.emit("1", -0.24, 185.76, 1),socket.emit("1", 3.05, 183.1, 1),socket.emit("1", 0.09, 183.95, 1),socket.emit("1", 0.42, 189.81, 1),socket.emit("1", 2.72, 189.79, 1),socket.emit("1", 0.74, 187.09, 1),socket.emit("1", 2.4, 188, 1),socket.emit("1", 2.07, 181, 1),socket.emit("1", 1.08, 181.02, 1),socket.emit("1", 1.735, 188.31, 1),socket.emit("1", 1.41, 188.81, 1), socket.emit("1",Math.PI*1.5,140,1),socket.emit("1", -2.095, 130, 1),socket.emit("1", -1.048, 130, 1),socket.emit("1", -2.565, 130, 1),socket.emit("1", -0.58, 130, 1),socket.emit("1", -3.035, 130, 1),socket.emit("1", -0.09, 130, 1),socket.emit("1", 0.38, 130, 1),socket.emit("1", 2.78, 130, 1),socket.emit("1", 2.3, 130, 1),socket.emit("1", 0.86, 130, 1),socket.emit("1", 1.83, 130, 1),socket.emit("1", 1.33, 130, 1)}
addEventListener('keydown',function(a){
if(a.keyCode==keydefesa){
defend()
let y=1;
if(w<y){defend()
}}})};
window.addEventListener("keypress",function(event){
    if(document.activeElement == mainCanvas){
        if(event.key == keydefesa){
            socket.emit("1", -1.06, 310, 1),socket.emit("1", -2.08, 310, 1),socket.emit("1", -0.64, 310, 1),socket.emit("1", -2.5, 310, 1),socket.emit("1", -1.87, 306, 1),socket.emit("1", -1.27, 306, 1),socket.emit("1", -1.67, 306, 1),socket.emit("1", -1.47, 306, 1),socket.emit("1", -2.29, 306, 1),socket.emit("1", -0.85, 306, 1),socket.emit("1", -0.43, 306, 1),socket.emit("1", -2.71, 306, 1),socket.emit("1", -2.91, 306, 1),socket.emit("1", -0.23, 306, 1),socket.emit("1", -0.03, 306, 1),socket.emit("1", -3.11, 306, 1),socket.emit("1", 2.97, 306, 1),socket.emit("1", 0.17, 306, 1),socket.emit("1", 2.77, 306, 1),socket.emit("1", 0.37, 306, 1),socket.emit("1", 0.57, 306, 1),socket.emit("1", 2.57, 306, 1),socket.emit("1", 2.37, 306, 1),socket.emit("1", 0.77, 306, 1),socket.emit("1", 0.97, 306, 1),socket.emit("1", 2.17, 306, 1),socket.emit("1", 1.97, 306, 1),socket.emit("1", 1.17, 306, 1),socket.emit("1", 1.37, 306, 1),socket.emit("1", 1.77, 306, 1),socket.emit("1",Math.PI*-1.5,306,1), socket.emit("1", -1.7, 245.85, 1),socket.emit("1", -1.45, 245.85, 1),socket.emit("1", -1.96, 245.85, 1),socket.emit("1", -1.19, 245.85, 1),socket.emit("1", -0.94, 245.85, 1),socket.emit("1", -2.21, 245.85, 1),socket.emit("1", -2.46, 245.85, 1),socket.emit("1", -0.69, 245.85, 1),socket.emit("1", -2.71, 245.85, 1),socket.emit("1", -0.44, 245.85, 1),socket.emit("1", -2.96, 245.85, 1),socket.emit("1", -0.19, 245.85, 1),socket.emit("1", 3.07, 245.85, 1),socket.emit("1", 0.06, 245.85, 1),socket.emit("1", 2.82, 245.85, 1),socket.emit("1", 0.31, 245.85, 1),socket.emit("1", 2.57, 245.85, 1),socket.emit("1", 0.57, 245.85, 1),socket.emit("1", 2.32, 245.85, 1),socket.emit("1", 0.82, 245.85, 1),socket.emit("1", 1.07, 245.85, 1),socket.emit("1", 2.07, 245.85, 1),socket.emit("1", 1.32, 245.85, 1),socket.emit("1", 1.82, 245.85, 1),socket.emit("1",Math.PI*-1.5,245.85,1), socket.emit("1", -1.91, 184.69, 1),socket.emit("1", -1.23, 184.4, 1),socket.emit("1", -2.25, 185.57, 1),socket.emit("1", -0.89, 184.93, 1),socket.emit("1", -2.58, 190.21, 1),socket.emit("1", -0.56, 190.16, 1),socket.emit("1", -2.9, 186.72, 1),socket.emit("1", -0.24, 185.76, 1),socket.emit("1", 3.05, 183.1, 1),socket.emit("1", 0.09, 183.95, 1),socket.emit("1", 0.42, 189.81, 1),socket.emit("1", 2.72, 189.79, 1),socket.emit("1", 0.74, 187.09, 1),socket.emit("1", 2.4, 188, 1),socket.emit("1", 2.07, 181, 1),socket.emit("1", 1.08, 181.02, 1),socket.emit("1", 1.735, 188.31, 1),socket.emit("1", 1.41, 188.81, 1), socket.emit("1",Math.PI*1.5,140,1),socket.emit("1", -2.095, 130, 1),socket.emit("1", -1.048, 130, 1),socket.emit("1", -2.565, 130, 1),socket.emit("1", -0.58, 130, 1),socket.emit("1", -3.035, 130, 1),socket.emit("1", -0.09, 130, 1),socket.emit("1", 0.38, 130, 1),socket.emit("1", 2.78, 130, 1),socket.emit("1", 2.3, 130, 1),socket.emit("1", 0.86, 130, 1),socket.emit("1", 1.83, 130, 1),socket.emit("1", 1.33, 130, 1)
        }

                if(event.key == keyremontar){
setTimeout(function() {sellwallsespecificas();},20);setTimeout(function() {buildbase();},50);
}
                if(event.key == keydefesagens){
socket.emit("1",1.5707963267948966,243.8499999999999,1);socket.emit("1",1.8341063193780445,243.85475882172162,1);socket.emit("1",2.097409582037474,243.84792330466948,1);socket.emit("1",2.360689167768742,243.8482366144977,1);socket.emit("1",2.624018281259737,243.84886835907207,1);socket.emit("1",2.8873142923831505,243.8510112753277,1);socket.emit("1",-3.1325705886781208,243.84992433872102,1);socket.emit("1",-2.869308976083654,243.85375391820386,1);socket.emit("1",-2.605990783170995,243.84809308255834,1);socket.emit("1",-2.3427104018746365,243.85379984736753,1);socket.emit("1",-2.0793925277555356,243.8435317985696,1);socket.emit("1",-1.8161032109519273,243.8501812589033,1);socket.emit("1",-1.5707963267948966,212.10000000000002,1);socket.emit("1",1.3074863342117489,243.85475882172162,1);socket.emit("1",1.0441830715523193,243.84792330466948,1);socket.emit("1",0.7809034858210512,243.8482366144977,1);socket.emit("1",0.5175743723300568,243.84886835907196,1);socket.emit("1",0.25427836120664254,243.8510112753277,1);socket.emit("1",-0.009022064911672656,243.84992433872114,1);socket.emit("1",-0.27228367750613897,243.853753918204,1);socket.emit("1",-0.5356018704187981,243.84809308255834,1);socket.emit("1",-0.7988822517151568,243.85379984736753,1);socket.emit("1",-1.0622001258342575,243.8435317985696,1);socket.emit("1",-1.325489442637866,243.8501812589033,1);socket.emit("1",-1.947760341395465,183.99923722667975,1);socket.emit("1",-2.2110551209598306,132.00469385593817,1);socket.emit("1",-2.474371898253103,183.99975869549385,1);socket.emit("1",-1.1938323121943284,183.99923722667975,1);socket.emit("1",-0.9305375326299626,132.00469385593817,1);socket.emit("1",-0.6672207553366902,183.99975869549385,1);socket.emit("1",-2.7376757003789844,132.00241967479246,1);socket.emit("1",-3.0009638047543623,183.99640349745977,1);socket.emit("1",1.018863230790163,132.0029003469242,1);socket.emit("1",-0.4039169532108087,132.00241967479246,1);socket.emit("1",-0.14062884883543106,183.99640349745965,1);socket.emit("1",0.12272942279963023,132.0029003469242,1);socket.emit("1",2.755606132718582,183.99713177112304,1);socket.emit("1",2.492303642944235,132.0002109846799,1);socket.emit("1",0.38598652087121105,183.99713177112304,1);socket.emit("1",0.6492890106455582,132.0002109846799,1);socket.emit("1",2.245020241043296,184.25695237900794,1);socket.emit("1",2.0023892963532264,132.00476658060506,1);socket.emit("1",1.747493624131154,182.5016219106012,1);socket.emit("1",0.8965724125464976,184.25695237900794,1);socket.emit("1",1.139203357236567,132.00476658060506,1);socket.emit("1",1.3940990294586393,182.5016219106012,1);socket.emit("1",Math.PI*1.5,140,1)
        }
                if(event.key == keyautobase){
        setTimeout(function(){ gens();},1000);setTimeout(function(){ gens();},10000);setTimeout(function(){ gens();},20000);setTimeout(function(){ gens();},30000);setTimeout(function(){ gens();},50000);setTimeout(function(){ walls();},60000);setTimeout(function(){ walls();},63000);setTimeout(function(){ micro();},80000);setTimeout(function(){ micro();},95000);setTimeout(function(){ upgens();},100000);setTimeout(function(){ upgens();},130000);setTimeout(function(){ upgens();},155000);setTimeout(function(){ upgens();},160000);setTimeout(function(){ command();},170000);setTimeout(function(){ command();},180000);setTimeout(function(){ greatleadership();},185000);setTimeout(function(){ armory();},190000);setTimeout(function(){ barracks1();},195000);setTimeout(function(){ siege();},230000);setTimeout(function(){ siege();},234000);setTimeout(function(){ barracks2();},235000);setTimeout(function(){ barracks2();},240000);setTimeout(function(){ upbarracks();},250000);setTimeout(function(){ upbarracks();},255000);setTimeout(function(){ upbarracks();},260000);setTimeout(function(){ upbarracks();},270000);setTimeout(function(){ upbarracks();},280000);setTimeout(function(){ sellgens();},310000);setTimeout(function(){ base();},315000);setTimeout(function(){ sellsiege();},340000);setTimeout(function(){ barracks1();},341000);setTimeout(function(){ upbarracks();},342000);setTimeout(function(){ upbarracks();},345000);setTimeout(function(){ upbarracks();},350000);
                }
        else if(event.key == keybaseatk) {
socket.emit("1",Math.PI*1.5,140,7),socket.emit("1", -1.87, 306, 1),socket.emit("1", -1.27, 306, 1),socket.emit("1", -1.67, 306, 1),socket.emit("1", -1.47, 306, 1),socket.emit("1", -2.29, 306, 1),socket.emit("1", -0.85, 306, 1),socket.emit("1", -0.43, 306, 1),socket.emit("1", -2.71, 306, 1),socket.emit("1", -2.91, 306, 1),socket.emit("1", -0.23, 306, 1),socket.emit("1", -0.03, 306, 1),socket.emit("1", -3.11, 306, 1),socket.emit("1", 2.97, 306, 1),socket.emit("1", 0.17, 306, 1),socket.emit("1", 2.77, 306, 1),socket.emit("1", 0.37, 306, 1),socket.emit("1", 0.57, 306, 1),socket.emit("1", 2.57, 306, 1),socket.emit("1", 2.37, 306, 1),socket.emit("1", 0.77, 306, 1),socket.emit("1", 0.97, 306, 1),socket.emit("1", 2.17, 306, 1),socket.emit("1", 1.97, 306, 1),socket.emit("1", 1.17, 306, 1),socket.emit("1", 1.37, 306, 1),socket.emit("1", 1.77, 306, 1),socket.emit("1",Math.PI*-1.5,306,1),socket.emit("1", -1.7, 245.85, 4),socket.emit("1", -1.45, 245.85, 4),socket.emit("1", -1.96, 245.85, 4),socket.emit("1", -1.19, 245.85, 4),socket.emit("1", -0.94, 245.85, 4),socket.emit("1", -2.21, 245.85, 4),socket.emit("1", -2.46, 245.85, 4),socket.emit("1", -0.69, 245.85, 4),socket.emit("1", -2.71, 245.85, 4),socket.emit("1", -0.44, 245.85, 4),socket.emit("1", -2.96, 245.85, 4),socket.emit("1", -0.19, 245.85, 4),socket.emit("1", 3.07, 245.85, 4),socket.emit("1", 0.06, 245.85, 4),socket.emit("1", 2.82, 245.85, 4),socket.emit("1", 0.31, 245.85, 4),socket.emit("1", 2.57, 245.85, 4),socket.emit("1", 0.57, 245.85, 4),socket.emit("1", 2.32, 245.85, 4),socket.emit("1", 0.82, 245.85, 4),socket.emit("1", 1.07, 245.85, 4),socket.emit("1", 2.07, 245.85, 4),socket.emit("1", 1.32, 245.85, 4),socket.emit("1", 1.82, 245.85, 4),socket.emit("1",Math.PI*-1.5,245,4),socket.emit("1", -1.91, 184.69, 4),socket.emit("1", -1.23, 184.4, 4),socket.emit("1", -2.25, 185.57, 4),socket.emit("1", -0.89, 184.93, 4),socket.emit("1", -2.58, 190.21, 4),socket.emit("1", -0.56, 190.16, 4),socket.emit("1", -2.9, 186.72, 4),socket.emit("1", -0.24, 185.76, 4),socket.emit("1", 3.05, 183.1, 4),socket.emit("1", 0.09, 183.95, 4),socket.emit("1", 0.42, 189.81, 4),socket.emit("1", 2.72, 189.79, 4),socket.emit("1", 0.74, 187.09, 4),socket.emit("1", 2.4, 188, 4),socket.emit("1", 2.07, 181, 4),socket.emit("1", 1.08, 181.02, 4),socket.emit("1", 1.735, 188.31, 4),socket.emit("1", 1.41, 188.81, 4),socket.emit("1", -2.095, 130, 4),socket.emit("1", -1.048, 130, 4),socket.emit("1", -2.565, 130, 4),socket.emit("1", -0.58, 130, 4),socket.emit("1", -3.035, 130, 4),socket.emit("1", -0.09, 130, 4),socket.emit("1", 0.38, 130, 4),socket.emit("1", 2.78, 130, 4),socket.emit("1", 2.3, 130, 4),socket.emit("1", 0.86, 130, 4),socket.emit("1", 1.83, 130, 4),socket.emit("1", 1.33, 130, 4),socket.emit("1", -1.06, 310, 8),socket.emit("1", -2.08, 310, 8),socket.emit("1", -0.64, 310, 8),socket.emit("1", -2.5, 310, 8);
if(acoesbots) {
window.sockets.forEach(socket => {
socket.emit("1",Math.PI*1.5,140,7),socket.emit("1", -1.06, 310, 8),socket.emit("1", -2.08, 310, 8),socket.emit("1", -0.64, 310, 8),socket.emit("1", -2.5, 310, 8),socket.emit("1", -1.87, 306, 1),socket.emit("1", -1.27, 306, 1),socket.emit("1", -1.67, 306, 1),socket.emit("1", -1.47, 306, 1),socket.emit("1", -2.29, 306, 1),socket.emit("1", -0.85, 306, 1),socket.emit("1", -0.43, 306, 1),socket.emit("1", -2.71, 306, 1),socket.emit("1", -2.91, 306, 1),socket.emit("1", -0.23, 306, 1),socket.emit("1", -0.03, 306, 1),socket.emit("1", -3.11, 306, 1),socket.emit("1", 2.97, 306, 1),socket.emit("1", 0.17, 306, 1),socket.emit("1", 2.77, 306, 1),socket.emit("1", 0.37, 306, 1),socket.emit("1", 0.57, 306, 1),socket.emit("1", 2.57, 306, 1),socket.emit("1", 2.37, 306, 1),socket.emit("1", 0.77, 306, 1),socket.emit("1", 0.97, 306, 1),socket.emit("1", 2.17, 306, 1),socket.emit("1", 1.97, 306, 1),socket.emit("1", 1.17, 306, 1),socket.emit("1", 1.37, 306, 1),socket.emit("1", 1.77, 306, 1),socket.emit("1",Math.PI*-1.5,306,1),socket.emit("1", -1.7, 245.85, 4),socket.emit("1", -1.45, 245.85, 4),socket.emit("1", -1.96, 245.85, 4),socket.emit("1", -1.19, 245.85, 4),socket.emit("1", -0.94, 245.85, 4),socket.emit("1", -2.21, 245.85, 4),socket.emit("1", -2.46, 245.85, 4),socket.emit("1", -0.69, 245.85, 4),socket.emit("1", -2.71, 245.85, 4),socket.emit("1", -0.44, 245.85, 4),socket.emit("1", -2.96, 245.85, 4),socket.emit("1", -0.19, 245.85, 4),socket.emit("1", 3.07, 245.85, 4),socket.emit("1", 0.06, 245.85, 4),socket.emit("1", 2.82, 245.85, 4),socket.emit("1", 0.31, 245.85, 4),socket.emit("1", 2.57, 245.85, 4),socket.emit("1", 0.57, 245.85, 4),socket.emit("1", 2.32, 245.85, 4),socket.emit("1", 0.82, 245.85, 4),socket.emit("1", 1.07, 245.85, 4),socket.emit("1", 2.07, 245.85, 4),socket.emit("1", 1.32, 245.85, 4),socket.emit("1", 1.82, 245.85, 4),socket.emit("1",Math.PI*-1.5,245,4),socket.emit("1", -1.91, 184.69, 4),socket.emit("1", -1.23, 184.4, 4),socket.emit("1", -2.25, 185.57, 4),socket.emit("1", -0.89, 184.93, 4),socket.emit("1", -2.58, 190.21, 4),socket.emit("1", -0.56, 190.16, 4),socket.emit("1", -2.9, 186.72, 4),socket.emit("1", -0.24, 185.76, 4),socket.emit("1", 3.05, 183.1, 4),socket.emit("1", 0.09, 183.95, 4),socket.emit("1", 0.42, 189.81, 4),socket.emit("1", 2.72, 189.79, 4),socket.emit("1", 0.74, 187.09, 4),socket.emit("1", 2.4, 188, 4),socket.emit("1", 2.07, 181, 4),socket.emit("1", 1.08, 181.02, 4),socket.emit("1", 1.735, 188.31, 4),socket.emit("1", 1.41, 188.81, 4),socket.emit("1", -2.095, 130, 4),socket.emit("1", -1.048, 130, 4),socket.emit("1", -2.565, 130, 4),socket.emit("1", -0.58, 130, 4),socket.emit("1", -3.035, 130, 4),socket.emit("1", -0.09, 130, 4),socket.emit("1", 0.38, 130, 4),socket.emit("1", 2.78, 130, 4),socket.emit("1", 2.3, 130, 4),socket.emit("1", 0.86, 130, 4),socket.emit("1", 1.83, 130, 4),socket.emit("1", 1.33, 130, 4);
})}
            /*for (var a = [], d = 0; d < units.length; ++d) {
if (units[d].type === 0 && units[d].owner == player.sid) {
var name = getUnitFromPath(units[d].uPath).name;
(name === 'Generator' || name === 'Power Plant') && a.push(units[d].id)
}
}
socket.emit("3", a)
})*/
        }
        else if(event.key == keygens) {
socket.emit("1",1.5707963267948966,243.8499999999999,3);socket.emit("1",1.8341063193780445,243.85475882172162,3);socket.emit("1",2.097409582037474,243.84792330466948,3);socket.emit("1",2.360689167768742,243.8482366144977,3);socket.emit("1",2.624018281259737,243.84886835907207,3);socket.emit("1",2.8873142923831505,243.8510112753277,3);socket.emit("1",-3.1325705886781208,243.84992433872102,3);socket.emit("1",-2.869308976083654,243.85375391820386,3);socket.emit("1",-2.605990783170995,243.84809308255834,3);socket.emit("1",-2.3427104018746365,243.85379984736753,3);socket.emit("1",-2.0793925277555356,243.8435317985696,3);socket.emit("1",-1.8161032109519273,243.8501812589033,3);socket.emit("1",-1.5707963267948966,212.10000000000002,3);socket.emit("1",1.3074863342117489,243.85475882172162,3);socket.emit("1",1.0441830715523193,243.84792330466948,3);socket.emit("1",0.7809034858210512,243.8482366144977,3);socket.emit("1",0.5175743723300568,243.84886835907196,3);socket.emit("1",0.25427836120664254,243.8510112753277,3);socket.emit("1",-0.009022064911672656,243.84992433872114,3);socket.emit("1",-0.27228367750613897,243.853753918204,3);socket.emit("1",-0.5356018704187981,243.84809308255834,3);socket.emit("1",-0.7988822517151568,243.85379984736753,3);socket.emit("1",-1.0622001258342575,243.8435317985696,3);socket.emit("1",-1.325489442637866,243.8501812589033,3);socket.emit("1",-1.947760341395465,183.99923722667975,3);socket.emit("1",-2.2110551209598306,132.00469385593817,3);socket.emit("1",-2.474371898253103,183.99975869549385,3);socket.emit("1",-1.1938323121943284,183.99923722667975,3);socket.emit("1",-0.9305375326299626,132.00469385593817,3);socket.emit("1",-0.6672207553366902,183.99975869549385,3);socket.emit("1",-2.7376757003789844,132.00241967479246,3);socket.emit("1",-3.0009638047543623,183.99640349745977,3);socket.emit("1",3.018863230790163,132.0029003469242,3);socket.emit("1",-0.4039169532108087,132.00241967479246,3);socket.emit("1",-0.14062884883543106,183.99640349745965,3);socket.emit("1",0.12272942279963023,132.0029003469242,3);socket.emit("1",2.755606132718582,183.99713177112304,3);socket.emit("1",2.492303642944235,132.0002109846799,3);socket.emit("1",0.38598652087121105,183.99713177112304,3);socket.emit("1",0.6492890106455582,132.0002109846799,3);socket.emit("1",2.245020241043296,184.25695237900794,3);socket.emit("1",2.0023892963532264,132.00476658060506,3);socket.emit("1",1.747493624131154,182.5016219106012,3);socket.emit("1",0.8965724125464976,184.25695237900794,3);socket.emit("1",1.139203357236567,132.00476658060506,3);socket.emit("1",1.3940990294586393,182.5016219106012,3);socket.emit("1",Math.PI*1.5,140,3)
for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
if(acoesbots) {window.sockets.forEach(socket => {
socket.emit("1",1.5707963267948966,243.8499999999999,3);socket.emit("1",1.8341063193780445,243.85475882172162,3);socket.emit("1",2.097409582037474,243.84792330466948,3);socket.emit("1",2.360689167768742,243.8482366144977,3);socket.emit("1",2.624018281259737,243.84886835907207,3);socket.emit("1",2.8873142923831505,243.8510112753277,3);socket.emit("1",-3.1325705886781208,243.84992433872102,3);socket.emit("1",-2.869308976083654,243.85375391820386,3);socket.emit("1",-2.605990783170995,243.84809308255834,3);socket.emit("1",-2.3427104018746365,243.85379984736753,3);socket.emit("1",-2.0793925277555356,243.8435317985696,3);socket.emit("1",-1.8161032109519273,243.8501812589033,3);socket.emit("1",-1.5707963267948966,212.10000000000002,3);socket.emit("1",1.3074863342117489,243.85475882172162,3);socket.emit("1",1.0441830715523193,243.84792330466948,3);socket.emit("1",0.7809034858210512,243.8482366144977,3);socket.emit("1",0.5175743723300568,243.84886835907196,3);socket.emit("1",0.25427836120664254,243.8510112753277,3);socket.emit("1",-0.009022064911672656,243.84992433872114,3);socket.emit("1",-0.27228367750613897,243.853753918204,3);socket.emit("1",-0.5356018704187981,243.84809308255834,3);socket.emit("1",-0.7988822517151568,243.85379984736753,3);socket.emit("1",-1.0622001258342575,243.8435317985696,3);socket.emit("1",-1.325489442637866,243.8501812589033,3);socket.emit("1",-1.947760341395465,183.99923722667975,3);socket.emit("1",-2.2110551209598306,132.00469385593817,3);socket.emit("1",-2.474371898253103,183.99975869549385,3);socket.emit("1",-1.1938323121943284,183.99923722667975,3);socket.emit("1",-0.9305375326299626,132.00469385593817,3);socket.emit("1",-0.6672207553366902,183.99975869549385,3);socket.emit("1",-2.7376757003789844,132.00241967479246,3);socket.emit("1",-3.0009638047543623,183.99640349745977,3);socket.emit("1",3.018863230790163,132.0029003469242,3);socket.emit("1",-0.4039169532108087,132.00241967479246,3);socket.emit("1",-0.14062884883543106,183.99640349745965,3);socket.emit("1",0.12272942279963023,132.0029003469242,3);socket.emit("1",2.755606132718582,183.99713177112304,3);socket.emit("1",2.492303642944235,132.0002109846799,3);socket.emit("1",0.38598652087121105,183.99713177112304,3);socket.emit("1",0.6492890106455582,132.0002109846799,3);socket.emit("1",2.245020241043296,184.25695237900794,3);socket.emit("1",2.0023892963532264,132.00476658060506,3);socket.emit("1",1.747493624131154,182.5016219106012,3);socket.emit("1",0.8965724125464976,184.25695237900794,3);socket.emit("1",1.139203357236567,132.00476658060506,3);socket.emit("1",1.3940990294586393,182.5016219106012,3);socket.emit("1",Math.PI*1.5,140,3)
for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && socket.emit("4", units[i].id, 0)
})}
}
        else if(event.key == keyunits) {
     selUnits = []; units.forEach((unit) => { if (unit.owner === player.sid && unit.type === 1) { if (!unit.info) unit.info = getUnitFromPath(unit.uPath); if (unit.info.name === 'Soldier') { selUnits.push(unit); return false; } } return true; }); selUnitType = "Unit"; }
        else if(event.key == keycommander) {
     selUnits = []; units.every((unit) => { if (unit.owner === player.sid && unit.type === 1) { if (!unit.info) unit.info = getUnitFromPath(unit.uPath); if (unit.info.name === 'Commander') { selUnits.push(unit); return false; } } return true; }); selUnitType = "Unit";
  socket.emit("4",0,0,1);
if(acoesbots) {window.sockets.forEach(socket => {
  socket.emit("4",0,0,1);
})}
        }
        else if(event.key == keyunitscommander) {
            selUnits = []; units.forEach((unit) => { if (unit.owner === player.sid && unit.type === 1) { if (!unit.info) unit.info = getUnitFromPath(unit.uPath); unit.info.name !== 'Siege Ram' && selUnits.push(unit)  } });  selUnitType = "Unit";
       }


          else if(event.key == keymicrogens) {
        for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1);
if(acoesbots) {window.sockets.forEach(socket => {
        for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && socket.emit("4", units[i].id, 1);
})}
          }



        else if(event.key == keyjoin) {
joinEnabled = !joinEnabled
joinTroopsDiv.innerText = joinEnabled?("ON"):("OFF")
           }
    }})
  var joinEnabled = true,
  joinTroopsDiv = document.createElement("div");
var css = document.createElement("style")
css.innerText = `
#joinTroopContainer {
 display: inline-block;
  padding: 10px;
   background-color: rgba(40, 40, 40, 0.5);
    font-family: 'regularF';
     font-size: 20px;
      border-radius: 4px;
       color: #fff;
}`
document.head.appendChild(css)
/*temporario*/function lagTroops(){
addEventListener("keydown", function(a) {
if (a.keyCode==192){
lag()
lag2()
}
function lag(){
var a = player.x + targetDst * MathCOS(targetDir) + camX,
d = player.y + targetDst * MathSIN(targetDir) + camY;
for (var e = [], b = 0; b < selUnits.length; ++b) e.push(selUnits[b].id);
socket.emit("5", UTILS.roundToOne(a), UTILS.roundToOne(d), e, 0, -1)
}
function lag2(){
var a = player.x + targetDst * MathCOS(targetDir) + camX,
d = player.y + targetDst * MathSIN(targetDir) + camY;
for (var e = [], b = 0; b < selUnits.length; ++b) e.push(selUnits[b].id);
socket.emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d), e, 0, -1)
}})
}
lagTroops()
  function sendChatMessage(str) {
        if (!window.sockets) return alert("no sockets");
        window.sockets.forEach(socket => {
            socket.emit("ch", str);
        });
    }
/*temporario*/
document.getElementById("statContainer").appendChild(joinTroopsDiv)
joinTroopsDiv.innerText = joinEnabled?("ON"):("OFF")
moveSelUnits=function(){if(selUnits.length){var a=player.x+targetDst*MathCOS(targetDir)+camX,d=player.y+targetDst*MathSIN(targetDir)+camY,c=1;if(c&&1<selUnits.length)for(var b=0;b<users.length;++b)if(UTILS.pointInCircle(a,d,users[b].x,users[b].y,users[b].size)){c=0;break}var g=-1;if(c)for(b=0;b<units.length;++b)if(units[b].onScreen&&units[b].owner!=player.sid&&UTILS.pointInCircle(a,d,units[b].x,units[b].y,units[b].size)){c=0;g=units[b].id;break}1==selUnits.length&&(c=0);for(var e=[],b=0;b<selUnits.length;++b)e.push(selUnits[b].id);
socket.emit("5",UTILS.roundToTwo(a),UTILS.roundToTwo(d),e,joinEnabled?(0):(c),g)}}
  joinTroopsDiv.id = "joinTroopContainer"
var keydefesa,keybaseatk,keygens,keyjoin,keyunits,keycommander,keyunitscommander,keymicrogens,keydefesagens,keyremontar,keyautobase;
    keydefesa = localStorage.getItem("keys1",keydefesa)
    keybaseatk = localStorage.getItem("keys2",keybaseatk)
    keygens = localStorage.getItem("keys3",keygens)
    keyjoin = localStorage.getItem("keys4",keyjoin)
    keyunits = localStorage.getItem("keys5",keyunits)
    keycommander = localStorage.getItem("keys6",keycommander)
    keydefesagens = localStorage.getItem("keys8",keydefesagens)
    keyunitscommander = localStorage.getItem("keys7",keyunitscommander)
    keymicrogens = localStorage.getItem("keys9",keymicrogens)
    keyremontar = localStorage.getItem("keys10",keyremontar)
    keyautobase = localStorage.getItem("keys11",keyautobase)


    window.keycodemenu = function () {
//keydefesa
    keydefesa = localStorage.getItem("keys1",keydefesa)
    if(keydefesa == undefined)
{
  keydefesa = prompt("Key para defesa atk");
      localStorage.setItem("keys1", keydefesa)
}
    if(keydefesa == null)
{
  keydefesa = prompt("Key para defesa atk");
      localStorage.setItem("keys1", keydefesa)
}
//keyataque
    keybaseatk = localStorage.getItem("keys2",keybaseatk)
    if(keybaseatk == undefined)
{
  keybaseatk = prompt("Key para ataque");
      localStorage.setItem("keys2", keybaseatk)
}
    if(keybaseatk == null)
{
  keybaseatk = prompt("Key para ataque");
      localStorage.setItem("keys2", keybaseatk)
}
//keygens
        keygens = localStorage.getItem("keys3",keygens)
    if(keygens == undefined)
{
  keygens = prompt("Key para gens");
      localStorage.setItem("keys3", keygens)
}
    if(keygens == null)
{
  keygens = prompt("Key para gens");
      localStorage.setItem("keys3", keygens)
}
//keyjoin
        keyjoin = localStorage.getItem("keys4",keyjoin)
    if(keyjoin == undefined)
{
  keyjoin = prompt("Key para jointroop(aglomerar tropas)");
      localStorage.setItem("keys4", keyjoin)
}
    if(keyjoin == null)
{
  keyjoin = prompt("Key para jointroop(aglomerar tropas)");
      localStorage.setItem("keys4", keyjoin)
}
        //keyunits
        keyunits = localStorage.getItem("keys5",keyunits)
    if(keyunits == undefined)
{
  keyunits = prompt("Key para selecionar tropas");
      localStorage.setItem("keys5", keyunits)
}
    if(keyunits == null)
{
  keyunits = prompt("Key para selecionar tropas");
      localStorage.setItem("keys5", keyunits)
}
        //keycommander
        keycommander = localStorage.getItem("keys6",keycommander)
    if(keycommander == undefined)
{
  keycommander = prompt("Key para selecionar commander");
      localStorage.setItem("keys6", keycommander)
}
    if(keycommander == null)
{
  keycommander = prompt("Key para selecionar commander");
      localStorage.setItem("keys6", keycommander)
}
        //keyunitscommander
        keyunitscommander = localStorage.getItem("keys7",keyunitscommander)
    if(keyunitscommander == undefined)
{
  keyunitscommander = prompt("Key para selecionar tudo");
      localStorage.setItem("keys7", keyunitscommander)
}
    if(keyunitscommander == null)
{
  keyunitscommander = prompt("Key para selecionar tudo");
      localStorage.setItem("keys7", keyunitscommander)
}
     //keydefesagens
        keydefesagens = localStorage.getItem("keys8",keydefesagens)
    if(keydefesagens == undefined)
{
  keydefesagens = prompt("Key para defesa gens");
      localStorage.setItem("keys8", keydefesagens)
}
    if(keydefesagens == null)
{
  keydefesagens = prompt("Key para defesa gens");
      localStorage.setItem("keys8", keydefesagens)
}
        //keymicrogens
        keymicrogens = localStorage.getItem("keys9",keymicrogens)
    if(keymicrogens == undefined)
{
  keymicrogens = prompt("Key para microgens");
      localStorage.setItem("keys9", keymicrogens)
}
    if(keymicrogens == null)
{
  keymicrogens = prompt("Key para microgens");
      localStorage.setItem("keys9", keymicrogens)
}
    //keyremontar
        keyremontar = localStorage.getItem("keys10",keyremontar)
    if(keyremontar == undefined)
{
  keyremontar = prompt("Key para remontar para base atk");
      localStorage.setItem("keys10", keyremontar)
}
    if(keyremontar == null)
{
  keyremontar = prompt("Key para remontar para base atk");
      localStorage.setItem("keys10", keyremontar)
}
    //keyautobase
        keyautobase = localStorage.getItem("keys11",keyautobase)
    if(keyautobase == undefined)
{
  keyautobase = prompt("Key para autobase atk");
      localStorage.setItem("keys11", keyautobase)
}
    if(keyautobase == null)
{
  keyautobase = prompt("Key para autobase atk");
      localStorage.setItem("keys11", keyautobase)
}
    }

sellSelUnits = function() {
if (selUnits.length) {for (var a = [], d = 0; d < selUnits.length; ++d)a.push(selUnits[d].id);socket.emit("3", a);for(var i=0; i<window.sockets.length; i++){sockets[i].emit("3", a)}}
}
moveSelUnits = function (){
if (selUnits.length) {
var a = player.x + targetDst * MathCOS(targetDir) + camX
, d = player.y + targetDst * MathSIN(targetDir) + camY
, c = 1;
if (c && 1 < selUnits.length)
for (var b = 0; b < users.length; ++b)
if (UTILS.pointInCircle(a, d, users[b].x, users[b].y, users[b].size)) {
c = 0;
break}
var g = -1;
if (c)
for (b = 0; b < units.length; ++b)
if (units[b].onScreen && units[b].owner != player.sid && UTILS.pointInCircle(a, d, units[b].x, units[b].y, units[b].size)) {
c = 0;
g = units[b].id;
break}
1 == selUnits.length && (c = 0);
var e = [];
for (b = 0; b < selUnits.length; ++b)
e.push(selUnits[b].id);
socket.emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d), e,joinEnabled?(0):(c),g)
for(var i=0; i<window.sockets.length; i++){sockets[i].emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d), e,joinEnabled?(0):(c),g)}}}
sendUnit = function(a) {
socket && gameState && activeUnit && !activeUnit.dontPlace && socket.emit("1", UTILS.roundToTwo(activeUnitDir), UTILS.roundToTwo(activeUnitDst), a);
console.log('socket.emit("1,"',UTILS.roundToTwo(activeUnitDir) + ",",UTILS.roundToTwo(activeUnitDst) + ",",a + ")")
window.sockets.forEach(socket => {socket.emit("1", UTILS.roundToTwo(activeUnitDir), UTILS.roundToTwo(activeUnitDst), a);})}
upgradeUnit = function(a) {
socket && gameState && (1 == selUnits.length ? socket.emit("4", selUnits[0].id, a) : (activeBase) ? (a == 0 && activeBase.sid == player.sid ? (socket.emit("4", 0, a, 1)) : (handleActiveBaseUpgrade(activeBase.sid, activeBase.upgrades[a].name))) : (upgradeSelUnits(selUnits[0], a)))
window.sockets.forEach(socket => {socket && gameState && (1 == selUnits.length ? socket.emit("4", selUnits[0].id, a) : activeBase && activeBase.sid == player.sid && socket.emit("4", 0, a, 1));})}
toggleSelUnit = function() {
if (player && !activeUnit && units) {var a = (player.x || 0) - maxScreenWidth / 2 + camX, d = (player.y || 0) - maxScreenHeight / 2 + camY, c = player.x - a + targetDst * MathCOS(targetDir) + camX, b = player.y - d + targetDst * MathSIN(targetDir) + camY; disableSelUnit(); var g = 4 >= MathABS(c - mouseStartX + (b - mouseStartY)), e = !1; activeBase = null; if (g) for (var h = 0; h < users.length; ++h)if (0 <= users[h].size - UTILS.getDistance(c, b, users[h].x - a, users[h].y - d)) { activeBase = users[h]; forceUnitInfoUpdate = !0; break } if (!activeBase) {activeBase = null;for (h = 0; h < units.length; ++h)if (users[getUserBySID(units[h].owner)] !== undefined && users[getUserBySID(units[h].owner)].name.startsWith(player.name) === true || units[h].owner == player.sid) if (g) { if (0 <= units[h].size - UTILS.getDistance(c, b, units[h].x - a, units[h].y - d)) { selUnits.push(units[h]); var f = getUnitFromPath(selUnits[0].uPath); f && (selUnits[0].info = f, "Unit" == f.typeName && (e = !0)); break } } else UTILS.pointInRect(units[h].x - a, units[h].y - d, mouseStartX, mouseStartY, c - mouseStartX, b - mouseStartY) && (selUnits.push(units[h]), f = getUnitFromPath(selUnits[selUnits.length - 1].uPath)) && (selUnits[selUnits.length - 1].info = f, "Unit" == f.typeName && (e = !0));if (selUnits.length) { for (h = selUnits.length - 1; 0 <= h; --h)e && "Tower" == selUnits[h].info.typeName ? selUnits.splice(h, 1) : e || "Unit" != selUnits[h].info.typeName || selUnits.splice(h, 1); selUnitType = e ? "Unit" : "Tower"; 1500 < selUnits.length && (selUnits.length = 1500) }} updateSelUnitViews()}}
setSelUnitGather = function() {
if (selUnits.length) {for (var a = player.x + targetDst * MathCOS(targetDir) + camX, d = player.y + targetDst * MathSIN(targetDir) + camY, c = [], b = 0; b < selUnits.length; ++b)void 0 != selUnits[b].info.unitSpawn && (selUnits[b].gatherPoint = [a, d],c.push(selUnits[b].id));socket.emit("6", a, d, c);for (var i = 0; i < window.sockets.length; i++){sockets[i].emit("6", a, d, c)}}}

window.share.getUnitList = function() {
return [{
name: "Soldier",
shape: "circle",
desc: "Expendable and perfect for rushing the enemy",
typeName: "Unit",
limit: 4,
reward: 3,
notUser: true,
uPath: [0],
space: 2,
type: 1,
size: 18,
speed: 0.18,
health: 30,
dmg: 10
}, {
name: "Wall",
shape: "circle",
desc: "Blocks incoming units and projectiles",
typeName: "Tower",
uPath: [1],
type: 3,
size: 30,
cost: 20,
health: 100,
dmg: 50,
upgrades: [{
name: "Boulder",
shape: "hexagon",
desc: "Strong barrier that blocks incoming units",
typeName: "Tower",
uPath: [1, 0],
type: 3,
size: 30,
cost: 60,
health: 150,
dmg: 50,
upgrades: [{
name: "Spikes",
shape: "spike",
desc: "Strong spike that blocks incoming units",
typeName: "Tower",
uPath: [1, 0, 0],
type: 3,
size: 30,
cost: 200,
health: 200,
dmg: 100
}]
}, {
name: "Micro Generator",
shape: "circle",
desc: "Generates power over time",
typeName: "Tower",
uPath: [1, 1],
type: 3,
size: 30,
iSize: 0.55,
cost: 30,
health: 50,
dmg: 10,
pts: 0.5
}]
}, {
name: "Simple Turret",
shape: "circle",
desc: "Shoots incoming enemy units",
typeName: "Tower",
uPath: [2],
type: 0,
size: 29,
cost: 25,
turretIndex: 1,
range: 180,
reload: 800,
health: 20,
dmg: 20,
upgrades: [{
name: "Rapid Turret",
shape: "circle",
desc: "Shoots incoming units at faster rate",
typeName: "Tower",
uPath: [2, 0],
type: 0,
size: 30,
cost: 60,
turretIndex: 2,
range: 180,
reload: 400,
health: 20,
dmg: 20,
upgrades: [{
name: "Gatlin Turret",
shape: "circle",
desc: "Rapidly shoots incoming units at close range",
typeName: "Tower",
uPath: [2, 0, 0],
type: 0,
size: 30,
cost: 100,
turretIndex: 7,
range: 180,
reload: 140,
health: 20,
dmg: 15
}]
}, {
name: "Ranged Turret",
shape: "circle",
desc: "Turret with higher range and damage",
typeName: "Tower",
uPath: [2, 1],
type: 0,
size: 30,
cost: 60,
turretIndex: 3,
range: 240,
reload: 800,
health: 30,
dmg: 30,
upgrades: [{
name: "Spotter Turret",
shape: "circle",
desc: "Shoots at very high range and reveals cloaked units",
typeName: "Tower",
seeCloak: true,
uPath: [2, 1, 0],
type: 0,
size: 30,
cost: 100,
turretIndex: 10,
range: 290,
reload: 800,
health: 30,
dmg: 30
}]
}]
}, {
name: "Generator",
shape: "hexagon",
desc: "Generates power over time",
typeName: "Tower",
uPath: [3],
type: 0,
size: 32,
iSize: 0.55,
cost: 50,
health: 50,
dmg: 10,
pts: 1,
upgrades: [{
name: "Power Plant",
shape: "octagon",
desc: "Generates power at a faster rate",
typeName: "Tower",
uPath: [3, 0],
type: 0,
size: 32,
iSize: 0.6,
cost: 100,
health: 80,
dmg: 10,
pts: 1.5
}]
}, {
name: "House",
shape: "pentagon",
desc: "Increases unit limit",
typeName: "Tower",
uPath: [4],
type: 0,
size: 30,
iSize: 0.3,
cost: 60,
health: 40,
dmg: 10,
lmt: [0, 3]
}, {
name: "Sniper Turret",
shape: "circle",
desc: "Slower firerate but larger range and damage",
typeName: "Tower",
uPath: [5],
type: 0,
size: 32,
cost: 80,
turretIndex: 4,
range: 240,
reload: 2000,
health: 30,
tDmg: 50,
dmg: 30,
upgrades: [{
name: "Semi-Auto Sniper",
shape: "circle",
desc: "Fast firerate sniper turret",
typeName: "Tower",
uPath: [5, 0],
type: 0,
size: 32,
cost: 180,
turretIndex: 5,
range: 240,
reload: 1000,
health: 60,
tDmg: 50,
dmg: 30
}, {
name: "Anti Tank Gun",
shape: "circle",
desc: "High damage turret with very slow firerate",
typeName: "Tower",
target: 1,
uPath: [5, 1],
type: 0,
size: 32,
cost: 300,
turretIndex: 6,
range: 280,
reload: 4500,
health: 60,
tDmg: 250,
dmg: 30
}]
}, {
name: "Tank",
shape: "triangle",
desc: "More powerful unit but moves slower",
typeName: "Unit",
group: 0,
reward: 100,
notUser: true,
uPath: [6],
space: 15,
type: 1,
size: 31,
speed: 0.05,
health: 250,
dmg: 50
}, {
name: "Armory",
shape: "circle",
desc: "Provides improvements for your army",
typeName: "Tower",
uPath: [7],
limit: 1,
type: 0,
size: 40,
renderIndex: 3,
cost: 100,
health: 90,
dmg: 30,
upgrades: [{
name: "Power Armor",
desc: "Increases soldier armor",
powerup: true,
uPath: [7, 0],
cost: 500,
uVals: [0, 'health', 20, 'renderIndex', 4]
}, {
name: "Booster Engines",
desc: "Increases tank movement speed",
powerup: true,
uPath: [7, 1],
cost: 600,
uVals: [6, 'speed', 0.04, 'renderIndex', 5]
}, {
name: "Panzer Cannons",
desc: "Adds cannons to tank units",
powerup: true,
uPath: [7, 2],
cost: 1000,
uVals: [6, 'turretIndex', 8, 'tDmg', 10, 'reload', 900, 'range', 200, 'shoot', true, 'target', 1]
}, {
name: "Cloaking Device",
desc: "Hides tanks from enemy towers",
powerup: true,
uPath: [7, 3],
cost: 2000,
uVals: [6, 'cloak', 1, 'canCloak', 1]
}]
}, {
name: "Barracks",
shape: "square",
desc: "Produces soldiers over time",
typeName: "Tower",
uPath: [8],
limit: 4,
type: 2,
size: 34,
iSize: 0.55,
cost: 150,
reload: 3500,
unitSpawn: 0,
health: 60,
dmg: 30,
upgrades: [{
name: "Greater Barracks",
shape: "square",
desc: "Produces soldiers more rapidly",
typeName: "Tower",
uPath: [8, 0],
type: 2,
size: 34,
renderIndex: 1,
cost: 500,
reload: 2500,
unitSpawn: 0,
health: 80,
dmg: 40
}, {
name: "Tank Factory",
shape: "square",
desc: "Slowly produces tanks over time",
typeName: "Tower",
uPath: [8, 1],
type: 2,
size: 35,
range: 70,
renderIndex: 2,
cost: 2000,
reload: 10000,
unitSpawn: 6,
health: 140,
dmg: 50,
upgrades: [{
name: "Blitz Factory",
shape: "square",
desc: "Produces Tanks at a Faster rate",
typeName: "Tower",
uPath: [8, 1, 0],
type: 2,
size: 35,
range: 70,
renderIndex: 2,
cost: 5000,
reload: 6000,
unitSpawn: 6,
health: 180,
dmg: 50
}]
}, {
name: "Siege Factory",
shape: "square",
desc: "Produces siege tanks over time",
typeName: "Tower",
uPath: [8, 2],
type: 2,
size: 35,
range: 70,
renderIndex: 8,
cost: 3000,
reload: 20000,
unitSpawn: 11,
health: 200,
dmg: 100
}]
}, {
name: "Commander",
shape: "star",
hero: true,
desc: "Powerful commander unit",
typeName: "Unit",
reward: 200,
notUser: true,
uPath: [9],
limit: 1,
type: 1,
size: 32,
speed: 0.16,
health: 700,
dmg: 100,
tDmg: 30,
turretIndex: 9,
reload: 600,
range: 160,
target: 1,
upgrades: [{
name: "Great Leadership",
desc: "Increases population cap",
powerup: true,
removeOthers: true,
uPath: [9, 0],
cost: 500,
lmt: [0, 10]
}]
}, {
name: "Tree",
desc: "Can be used for cover",
typeName: "Nature",
layer: 1,
uPath: [10],
type: 4,
notUser: true,
dontUpdate: true,
size: 90,
renderIndex: 7
}, {
name: "Siege Ram",
shape: "circle",
desc: "Very powerful and slow siege tank",
typeName: "Tower",
group: 0,
reward: 300,
notUser: true,
uPath: [11],
space: 40,
type: 1,
size: 40,
iSize: 0.5,
speed: 0.015,
health: 1500,
dmg: 100
}];
}
window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];
window.overrideSocketEvents = window.overrideSocketEvents || [];
window.chatCommands = window.chatCommands || [];

window.test = 0;
function ChatTest(){for(i=0;i<units.length;i++){if(test==0){test = 1;comandos();}}};
setInterval(ChatTest,500);

var muted = [];
window.overrideSocketEvents.push({
name: "ch",
description: "Chat Muter",
func: function (a, d, c) {
if (!muted[a])
addChatLine(a, d, c)
}})

window.addChat = function (msg, from, color) {color = color || "#fff";var b = document.createElement("li");b.className = "chatother";b.innerHTML = '<span style="color:' + color + '">[' + from + ']</span> <span class="chatText">' + msg + "</span>";10 < chatList.childNodes.length && chatList.removeChild(chatList.childNodes[0]);chatList.appendChild(b)}
window.chatCommands.mute = function (split) {
if (split[1] > 0) {
var ID = split[1];
users.forEach((user) => {
if(ID==user.sid){
muted[user.sid] = true;
addChat('Player mutado com sucesso.', 'Client');
}
})
}      if (!split[1]) {
        addChat('Por favor selecione um nome para mutar, ou "todos" para desmutar todos.')
    } else if (split[1] === 'todos') {
        users.forEach((user) => {
            muted[user.sid] = true;
        });
        addChat('Mutados ' + users.length + ' usuários', 'Client');

    } else {
        var len = 0;
        users.forEach((user) => {
            if (user.name === split[1]) {
                muted[user.sid] = true;
                len++;
            }

        });
addChat('Players mutados com sucesso.', 'Client');
    }}

window.chatCommands.unmute = function (split) {
if (split[1] > 0) {
var ID = split[1];
users.forEach((user) => {
if(ID==user.sid){
muted[user.sid] = false;
addChat('Player desmutado com sucesso.', 'Client');
}

})
}
 if (!split[1]) {
        addChat('Por favor selecione um nome para desmutar, ou "todos" para desmutar todos.')
         } else if (split[1] === 'todos') {
        addChat('Desmutados todos os usuários', 'Client');
                muted = {};
    } else {
        var len = 0;
        users.forEach((user) => {
            if (user.name === split[1]) {
                muted[user.sid] = false;
                len++;
            }
        });
addChat('Players desmutados com sucesso.', 'Client');
    }}
window.chatCommands.help = function (split) {
    var avail = Object.keys(window.chatCommands);
    addChat('Existem ' + avail.length + ' commandos acessíveis..', 'Client')
    addChat(avail.join(', '), 'Client');
}
window.chatCommands.clear = function () {
    while (chatList.hasChildNodes()) {
        chatList.removeChild(chatList.lastChild);
    }
}
window.chatCommands.addbots= function (split) {
    if (split[1] > 0 && split[1] < 50) {
var xy = split[1];
BotAmout(xy,name);
    addChat('Adicionando ' + xy + ' bots a esse servidor.','Client')
    }
    if (split[1] == 0 || split[1] >= 50){
    addChat('Quantidade de bots muito alta, não será possível adicionar.','Client')
    }
}
window.chatCommands.playercount= function () {
    addChat('Existem ' + users.length + ' players nesse servidor.','Client')
}
window.chatCommands.zoomout= function () {
(maxScreenHeight = 150000, maxScreenWidth = 500000, resize(true));
cameraSpd = 2.0;
(Math.log(maxScreenHeight / 1080) + 1)
addChat('Zoom out.','Client')
}
window.chatCommands.zoomin= function () {
(maxScreenHeight = 1080, maxScreenWidth = 1920, resize(true))
cameraSpd = 2.0;
addChat('Zoom in.','Client')
}
window.chatCommands.takebots= function () {
    window.sockets.forEach(socket => {socket.close();var id=0})
    addChat('Retirados todos os bots desse servidor.','Client')
}
window.chatCommands.playercount= function () {
    addChat('Existem ' + users.length + ' players nesse servidor.','Client')
}
var modsShown = true;
window.chatCommands.toggle = function () {
    var element = document.getElementById('noobscriptUI')
    if (modsShown) {
        modsShown = false;
        element.style.display = 'none';
        addChat('Menu desabilitado', 'Client')
    } else {
        modsShown = true;
        element.style.display = 'block';
        addChat('Menu desabilitado', 'Client')
    }
}
var chatHist = [];
var chatHistInd = -1;
var prevText = '';

function comandos() {
    setTimeout(function () {
    var old = chatInput
    chatInput = old.cloneNode(true);
    old.parentNode.replaceChild(chatInput, old);
    chatInput.onclick = function () {
    toggleChat(!0)
};

chatInput.addEventListener("keyup", function (a) {
var b = a.which || a.keyCode;
if (b === 38) { /* up*/
if (chatHistInd === -1) {
prevText = chatInput.value;
chatHistInd = chatHist.length;}
if (chatHistInd > 0) chatHistInd--;
chatInput.value = prevText + (chatHist[chatHistInd] || '')
} else if (b === 40) {
if (chatHistInd !== -1) {
if (chatHistInd < chatHist.length) chatHistInd++;
else chatHistInd = -1;
chatInput.value = prevText + (chatHist[chatHistInd] || '')
}} else
if (gameState && socket && 13 === (a.which || a.keyCode) && "" != chatInput.value) {
var value = chatInput.value;
chatInput.value = ""
mainCanvas.focus()
if (value.charAt(0) === '/') {
var split = value.split(' ');
var name = split[0].substr(1);
if (window.chatCommands[name]) window.chatCommands[name](split);
else {addChat("Comando '" + name + "' não indentificado. Digite /help para acessar a lista de comandos.", 'Client');
}} else {
socket.emit("ch", value)}
if (chatHist[chatHist.length - 1] !== value) {
var ind = chatHist.indexOf(value);
if (ind !== -1) {chatHist.splice(ind, 1);}
chatHist.push(value);}
chatHistInd = -1;
}})},1000)}