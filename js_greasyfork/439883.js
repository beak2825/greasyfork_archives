// ==UserScript==
// @name         Wanikani Forums: Blobs
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Convert boring face emoji to pretty blob emoji
// @author       Kumirei
// @match        https://community.wanikani.com/t/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439883/Wanikani%20Forums%3A%20Blobs.user.js
// @updateURL https://update.greasyfork.org/scripts/439883/Wanikani%20Forums%3A%20Blobs.meta.js
// ==/UserScript==

;(function () {
    let emoji_menu = false
    setInterval(check_emoji_menu, 300)
    let blobs = [
        ['grinning', 'upload://8hX9YCBHelwdVEel9a6K5CfeKE9.png'],
        ['grin', 'upload://qrSIzuFefXuydEpNMC10YhtK9kI.png'],
        ['joy', 'upload://hiKuJ7awaBzb0eN2bW3zoDj5U0Y.png'],
        ['rofl', 'upload://90gaqzKT3RwQMlRyccnjGIWf2u0.png'],
        ['smiley', 'upload://64aINyVEWWWo1ha5YNwzXt9qDIU.png'],
        ['smile', 'upload://2s1A63PSgjN1qEbd2gR9hyShGZm.png'],
        ['sweat_smile', 'upload://5RFn3GS5vrkrQC9MSecubALsIEc.png'],
        ['laughing', 'upload://A5AhrZiZ5VYlnvbpcoI6hXck126.png'],
        ['wink', 'upload://3HwasslqInetjPNR4azssz8bRle.png'],
        ['blush', 'upload://wYompkzMTKmLrUbAi5tTEPb2Qxe.png'],
        ['yum', 'upload://rpw5LOVk4f7lgK0PP03BKOvWhrX.png'],
        ['sunglasses', 'upload://XveCF2QyrkfZSEeQlOqC9Yy1xP.png'],
        ['heart_eyes', 'upload://9gzQUoGwTlfsfr3q4PELjSWrBs7.png'],
        ['kissing_heart', 'upload://oVZbCnaZ0i7cEZrBL37z54fFX0P.png'],
        ['kissing', 'upload://1SlWfufjWNWmTwu2gQAL8XmGzBl.png'],
        ['kissing_smiling_eyes', 'upload://hq61L02uu4ucS2ASUXPq5yaWmS7.png'],
        ['kissing_closed_eyes', 'upload://xn5v1aEui0SxKrvHaiBQl84NClc.png'],
        ['relaxed', 'upload://iT1GZ5mYl7m9XprBCIiIRT4nL0.png'],
        ['slightly_smiling_face', 'upload://p3qsoNcfg0JWBgEnmyXlR5XDu96.png'],
        ['slight_smile', 'upload://p3qsoNcfg0JWBgEnmyXlR5XDu96.png'],
        ['hugs', 'upload://6qiNpGxYTCHNFupdUXvWAwTlXL7.png'],
        ['thinking', 'upload://bvqeh06bIQvpjhkKFUHQqnnNmvO.png'],
        ['neutral_face', 'upload://h5fq4zKpsr04Pc1OWWcSKZv4dPz.png'],
        ['expressionless', 'upload://4AmpoRuBpWtl0NWkQk2c7dljcT4.png'],
        ['no_mouth', 'upload://yzC5WB45vqD0QSA9iEFDQ7KCSns.png'],
        ['roll_eyes', 'upload://qYwfwHKXwJKVxqyA7muckbPcqmf.png'],
        ['smirk', 'upload://abP8GKB9qlP7W7OscaIlVPr5NQm.png'],
        ['persevere', 'upload://c2tPURT9m5JyZUgpZq72cqjduYE.png'],
        ['disappointed_relieved', 'upload://l7bdqOyB2bPKDDyK9kbhcE3VAix.png'],
        ['open_mouth', 'upload://h4hIuqnduLnVgxXP8i57yJIIDn.png'],
        ['zipper_mouth_face', 'upload://2JTA06GYKzcR4B5rthYGdrostsS.png'],
        ['hushed', 'upload://sypmFE3TIteWC2kd7mL6uCee8SJ.png'],
        ['sleepy', 'upload://xHATUb8uiCE5h7ofKpmqEJeRScT.png'],
        ['tired_face', 'upload://f6loKCg8uCjMxKfoN2LdyKffQe.png'],
        ['sleeping', 'upload://2Aj5zi1qMMK6JIIPznOXP4Qs1cE.png'],
        ['relieved', 'upload://2fiFu44VLpxDczTkGGEsg7ha8Sp.png'],
        ['stuck_out_tongue', 'upload://mLo6o2qr2OnSAMcJDeGjAd7uL7W.png'],
        ['stuck_out_tongue_winking_eye', 'upload://kuA4ANKZk9wtJvd8d9vIPtJmJ3b.png'],
        ['stuck_out_tongue_closed_eyes', 'upload://uZVf4Kzkq78AtJ31zLc1bZ4qoJ5.png'],
        ['drooling_face', 'upload://YolUPuqjCQuTzfzX3o6Eyy9Xad.png'],
        ['unamused', 'upload://hzulDZCGeWQV9oDXEBgsBX0KmmV.png'],
        ['sweat', 'upload://xmBDcPUONBOxViBv23f7XoNi8CP.png'],
        ['pensive', 'upload://je4ogNYKxaXs7U2BbbGEPByZMy2.png'],
        ['confused', 'upload://3e1HFsECD0SCHzCEEW5skhfZr0g.png'],
        ['upside_down_face', 'upload://l2qzlu22tEYK6ZTXoC57oGv1miT.png'],
        ['money_mouth_face', 'upload://vCdtTggEAIOoIXJ2Pa9ItR10Nff.png'],
        ['astonished', 'upload://m3tVWKc0H1pTU7SiDaOOZHu0uVc.png'],
        ['frowning_face', 'upload://idC9n134LZHNppzhacETdm1SmMU.png'],
        ['slightly_frowning_face', 'upload://oJcbfRuF4NKIFzkxUiFYLaZqXGN.png'],
        ['confounded', 'upload://gt7EBEIFn5dHH5DHe82inqjTHgM.png'],
        ['disappointed', 'upload://mfzUBzhwRXsx15pNrncZyptzv5i.png'],
        ['worried', 'upload://3pGUY16SzMZLcLQoH4Yd4Wsbffi.png'],
        ['triumph', 'upload://e2SYk7179OYDGYaD7EPrMURk5b7.png'],
        ['cry', 'upload://pfmgfq1EqeJflug84WTWPbm25Wv.png'],
        ['sob', 'upload://zNIIY01g8izWk59bRIe5eabh3lE.png'],
        ['frowning', 'upload://wX1kVmDyx01s2FfqGSb1AFn4tef.png'],
        ['anguished', 'upload://vxDuvBiEyS7bvGv7qWdbhPDpjK6.png'],
        ['fearful', 'upload://xshK1ACx1bgzsW6rqyuxTj63YQC.png'],
        ['weary', 'upload://ziCy5HeQszbcagiFvWkMwcdBaAF.png'],
        ['grimacing', 'upload://1G3Drpk8XNw6L50IQkncrou8tL5.png'],
        ['cold_sweat', 'upload://fOHgcNAaIMuu3XuiTP7XFOMrx1o.png'],
        ['scream', 'upload://9BKFPmTiY8KMWqqgEkTixxATxOp.png'],
        ['flushed', 'upload://h2T9vj2GAjYaX1LRPIGwc31vqSz.png'],
        ['dizzy_face', 'upload://bsKxRHfB9X2wnVr6383OQzCud2k.png'],
        ['rage', 'upload://mMjqpRX3E4kUnWhwYZqdomCAQwf.png'],
        ['angry', 'upload://niTNFMQDSqQXDLtXMrDcbJu0D0t.png'],
        ['mask', 'upload://xuKuaJr8abWFXh7ztDlvsiGFQp7.png'],
        ['face_with_thermometer', 'upload://vO6wX9xW5VkgSwIh307nElJ3os.png'],
        ['face_with_head_bandage', 'upload://lTXWpQ8skV1ZENlg33FHVWbyh0u.png'],
        ['nauseated_face', 'upload://vFvODjdJqXEw9ksADLAnUoRrOIO.png'],
        ['sneezing_face', 'upload://zyrBLcDTQWgMDRjq8WrODTujb2B.png'],
        ['innocent', 'upload://uxEVi3wO4V81KRX0PWrMvRJyftc.png'],
        ['cowboy_hat_face', 'upload://hKZRPjDnJezamP4vUNIvu8QyxEr.png'],
        ['lying_face', 'upload://vQm1BDGc8RSiV9ueDV7KX5UeYIC.png'],
        ['nerd_face', 'upload://xuPBXsPj5kqDFhmj1S72IIbfR2u.png'],
        ['smiling_imp', 'upload://4s7fMNB59HhydI8kSWdOXXi7oDl.png'],
        ['imp', 'upload://xhqnQazkHvNS5jzQGHpk2HGcgA1.png'],
        ['clown_face', 'upload://wntoTE5sl7kBd41CMucgpeL7Cvi.png'],
        ['japanese_ogre', 'upload://lW80qD3bYLqYzMxCI4glVibhdap.png'],
        ['japanese_goblin', 'upload://xKdsVPbDsOsDNCj7ncwG9ThXbJ9.png'],
        ['skull', 'upload://oow3UcVIxVk4r0b0JmXtCys637c.png'],
        ['skull_and_crossbones', 'upload://bPgM9cjjbb47LHpmPZiut74Jzeo.png'],
        ['ghost', 'upload://zGkZLHADpLW6XYV4MQyx5V7E6hC.png'],
        ['alien', 'upload://iSYJKowIzKmgHqjwWyyFy1hOVSz.png'],
        ['space_invader', 'upload://ezpt6FOlCFDaH2YGrD4rM9pAtzv.png'],
        ['robot', 'upload://qmIjw5IFEoW7aziN69D5bG5aHu.png'],
        ['poop', 'upload://1RYNpAINeRMNo4HMI8mfFcL2t6d.png'],
        ['smiley_cat', 'upload://bLKoAOKfl5xd4urTu39EbTzHFVC.png'],
        ['smile_cat', 'upload://361XhZfzl4eNn72F7l3zT0LLLEI.png'],
        ['joy_cat', 'upload://tVSYNEiGzJAfV4zpirM4uXURweQ.png'],
        ['heart_eyes_cat', 'upload://6YDVR3i08DnQPKzFJPo1LmBaEfK.png'],
        ['smirk_cat', 'upload://wGNDzWXWIqYVaQc4umiGXzWzcbc.png'],
        ['kissing_cat', 'upload://55nDeAnnyhGjL5sDuUNuEmMT5RJ.png'],
        ['scream_cat', 'upload://uKUAcwGhacBiQkOSonDGzilRfus.png'],
        ['crying_cat_face', 'upload://gNR9oZfkgxGbAeSPKzLkhyC17gs.png'],
        ['pouting_cat', 'upload://hoMErjHyWPI7V0I5fiHMCVQvO6P.png'],
        ['see_no_evil', 'upload://vOMiRFhfLyYxHRfn1IAwg9QybsM.png'],
        ['hear_no_evil', 'upload://tL75JeErlV6mAXZhFAK9Er3vi7g.png'],
        ['speak_no_evil', 'upload://i4SKpycgcW3kRxkf1qv0WFbbYQw.png'],
        ['star_struck', 'upload://u2hZhuCUqqpoTXWgz9aahLUelkb.png'],
    ]

    function check_emoji_menu() {
        let emoji_menu_elem = document.getElementsByClassName('ac-emoji')[0]
        if (!emoji_menu_elem && emoji_menu) replace_emoji()
        emoji_menu = emoji_menu_elem ? true : false
    }

    function replace_emoji() {
        let textarea = document.getElementsByClassName('d-editor-input')[0]
        let text = textarea.value
        for (let i = 0; i < blobs.length; i++) {
            let blob = blobs[i]
            let name = blob[0]
            let url = blob[1]
            let reg = RegExp(':' + name + ':', 'g')
            text = text.replace(reg, `![${name}|25x25](${url})`)
        }
        textarea.value = text
        textarea.focus()
        textarea.blur()
        textarea.focus()
    }
})()
