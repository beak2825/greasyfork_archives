// ==UserScript==
// @name JP Theme
// @namespace tampermonkey
// @version 2.0
// @description JP Theme for bloxflip | Mystic Predictor .gg/predicts
// @match https://bloxflip.com/*
// @grant GM_addStyle
// @author Notserp , smil
// @icon https://media.discordapp.net/attachments/1134262846289616927/1134605371357540423/received_189382747171993.gif?ex=6696ec98&is=66959b18&hm=a3a0d371f2369a5bd0f76ab12b0e8a7e1fd7301b32edccb45b5dbda77663b7db&
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502395/JP%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/502395/JP%20Theme.meta.js
// ==/UserScript==

GM_addStyle(`
    @import url('https://fonts.googleapis.com/css?family=Poppins&display=swap');

    :root {
        --color-dark-100: #191919 !important;
        --color-dark-90: #1A1A1A !important;
        --color-dark-80: #191919 !important;
        --color-dark-70: #151515 !important;
        --color-dark-60: #121212 !important;
        --color-dark-50: #161617 !important;
        --color-dark-40: #252525 !important;
        --color-dark-30: #202020 !important;
        --color-accent-blue: #282828 !important;
        --color-accent-aqua: #282828 !important;
    }

    * {

    }

    body, html {
        font-size: 10px !important;
        line-height: 1.2 !important;
        color: var(--color-white-primary);
        background: #161616;
        -moz-osx-font-smoothing: grayscale;
        -webkit-font-smoothing: antialiased;
        overscroll-behavior-y: contain;
    }

    .header_header__pwrbs {
        position: -webkit-sticky;
        position: sticky;
        z-index: 102;
        background: #1a1a1a;
        display: flex;
        align-items: center;
        top: 0;
        height: 80px;
        padding: 5px 48px 5px 24px;
        border-top: 1px solid rgba(68, 68, 68, 0.8);
        border-bottom: 1px solid rgba(68, 68, 68, 0.8);
    }

    .sidebar_sidebar__7U3PX {
        background: #1d1d1d !important;
        border-top: 1px solid rgba(71, 71, 71, 0.8);
        border-bottom: 1px solid rgba(71, 71, 71, 0.8);

    }

    .layout_layoutSidebar__AGyEt * {

        border-color: rgba(71, 71, 71, 0.8) !important;|

    }

    .gameBlock {
       background: #1d1d1d !important;
       border-radius: 25px;
       border-top: 1px solid rgba(71, 71, 71, 0.8);
       border-bottom: 1px solid rgba(71, 71, 71, 0.8);

    }

    .footer_footer__3kcQj {
       background-color: #202020 !important;
       color: #202020 !important;
       border-color: #202020 !important;
       fill: #202020 !important;
    }

    .Cases_createCaseButtonText__tvNAo {
       visibility: hidden !important;
    }

    .Rewards_rakeback__PFxqr {
       background-image: none !important;
    }

    .Profile_profileMain__llT4J {
       padding: 40px 20px 40px 40px;
       background: #212121;
       border-radius: 25px;
    }

    .Affiliates_affiliatesStats__AqKvC {
    padding: 40px 20px 40px 40px;
    background: #212121;
    border-radius: 25px;
    }

    .ElementsApp, .ElementsApp .InputElement {
    background: url('https://i.ibb.co/gSCp4ZX/sigma-saqon.png');
    line-height: 2em;
    color: #ffffff;
    font-size: 20px;
    font-family: 'Poppins', sans-serif;
    height: 40px;
    }

    .Cases_createCaseButton__Zv1mq {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    min-height: 200px;
    background: #1e1e1e;
    border-radius: 16px;
    border: none;
    padding: 16px;
    box-shadow: none;
    cursor: pointer;
    transition: background .2s ease;
    order: 1;
    }

    .statistics_notiTab__AEYn8 .statistics_container__aucvX {
    background: url('https://i.ibb.co/gSCp4ZX/sigma-saqon.png');;
    border-radius: 4px;
    padding: 2em;
    margin-top: 3em;
    position: relative;
    }

   .mines_minesGameItem__S2ytQ {
    display: inline-block;
    position: relative;
    width: 75px;
    height: 75px;
    background: linear-gradient(145deg, #eb10b0, #911ba8);
    border-radius: 8px;
   box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2), 0px 0px 5px rgba(255, 255, 255, 0.5);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
    border-top: 1px solid rgba(170, 51, 106, 0.8);
    border-bottom: 1px solid rgba(170, 51, 106, 0.8);
    border-left: 1px solid rgba(170, 51, 106, 0.8);
    border-right: 1px solid rgba(170, 51, 106, 0.8);
}
   .mines_minesGameItem__S2ytQ:after {
   background: url('https://i.imgur.com/0WzmT90.png') 50% / 55% auto no-repeat;
}
   .mines_minesGameItem__S2ytQ:hover {
    transform: scale(1.1);
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.3);
}

   .minesGameSpinningItem__1uz91::after {
    animation: spin 2s linear infinite;
    background: linear-gradient(145deg, #9ad8e5, #e6e6e6);
    border-radius: 50%;
}
   .mines_minesGameItemWin__4kRNF::after {
    background: url('https://cdn.discordapp.com/avatars/886041161167425606/a_7f7c2748b7e7af2925654a2109827248.gif?size=96') 100%/100% auto no-repeat;
    position: absolute;
    transform: translate(-50%,-50%);
    top: 50%;
    left: 50%;
}
   .mines_minesGameItem__S2ytQ.mines_minesGameItemOtherMine__cOPla::after {
    background: url('https://cdn.discordapp.com/emojis/1170370423272243231.webp?size=96&quality=lossless') 100%/100% auto no-repeat;
    position: absolute;
    transform: translate(-50%,-50%);
    top: 50%;
    left: 50%;
    content: '';
}
   .mines_minesGameItem__S2ytQ.mines_minesGameItemMine__NeRa4::after {
    background: url('https://cdn.discordapp.com/emojis/1170370423272243231.webp?size=96&quality=lossless') 100%/100% auto no-repeat;
    position: absolute;
    transform: translate(-50%,-50%);
    top: 50%;
    left: 50%;
    content: '';
}
    .mines_minesGame__6Bltb {
    display: flex;
    padding: 64px 32px;
    background: var(--color-dark-50) url() center center/cover no-repeat;
    border-radius: 25px;
    height: 100%;
    position: relative;
    border-top: 1px solid rgba(71, 71, 71, 0.8);
    border-bottom: 1px solid rgba(71, 71, 71, 0.8);
    border-left: 1px solid rgba(71, 71, 71, 0.8);
    border-right: 1px solid rgba(71, 71, 71, 0.8);
    }

    .towers_towersGame__4VfYK {
    display: flex;
    padding: 90px 32px;
    background: var(--color-dark-50) url() center center/cover no-repeat;
    border-radius: 25px;
    border-top: 1px solid rgba(71, 71, 71, 0.8);
    border-bottom: 1px solid rgba(71, 71, 71, 0.8);
    border-left: 1px solid rgba(71, 71, 71, 0.8);
    border-right: 1px solid rgba(71, 71, 71, 0.8);
    }
    .plinko_plinkoGameInner__THlF9 {

     background: var(--color-dark-50) url() center center/cover no-repeat;
    padding: 40px 0 80px;
    border-radius: 25px;
    position: absolute;
    overflow: hidden;
    border-top: 1px solid rgba(71, 71, 71, 0.8);
    border-bottom: 1px solid rgba(71, 71, 71, 0.8);
    border-left: 1px solid rgba(71, 71, 71, 0.8);
    border-right: 1px solid rgba(71, 71, 71, 0.8);
}
.battles_caseBattleItem__Ui7Iy {
  background-color: #121212;

}
    .jackpot_jackpotGame__Weio1 {
    display: flex;
    padding: 125px 32px;
    background: var(--color-dark-50) url() center center/cover no-repeat;
    border-radius: 25px;
    border-top: 1px solid rgba(71, 71, 71, 0.8);
    border-bottom: 1px solid rgba(71, 71, 71, 0.8);
    border-left: 1px solid rgba(71, 71, 71, 0.8);
    border-right: 1px solid rgba(71, 71, 71, 0.8);
    }

    .roulette_rouletteGame__60JcH {
    background: var(--color-dark-50) url() center center/cover no-repeat;
    padding: 40px 0 80px;
    border-radius: 25px;
    position: relative;
    overflow: hidden;
    border-top: 1px solid rgba(71, 71, 71, 0.8);
    border-bottom: 1px solid rgba(71, 71, 71, 0.8);
    border-left: 1px solid rgba(71, 71, 71, 0.8);
    border-right: 1px solid rgba(71, 71, 71, 0.8);
    }

    .roulette_roulettePlayersColumn__iBsQD {
    background: #212121;
    border-radius: 25px;
    padding: 24px;
    height: 35em;
    overflow-y: auto;
    position: relative;
    }

    .crash_crashGame__8up4O {
    background: var(--color-dark-50) url() center bottom/cover no-repeat;
    padding: 200px 0 0;
    height: 100%;
    min-height: 200px;
    border-radius: 25px;
    position: relative;
    display: flex;
    flex-direction: column;
    aspect-ratio: 736/615;
    overflow: hidden;
    border-top: 1px solid rgba(71, 71, 71, 0.8);
    border-bottom: 1px solid rgba(71, 71, 71, 0.8);
    border-left: 1px solid rgba(71, 71, 71, 0.8);
    border-right: 1px solid rgba(71, 71, 71, 0.8);
    }

    .gamePlayersScrollable .gamePlayersTableHead {
    position: -webkit-sticky;
    position: sticky;
    background: #212121;
    border-radius: 12px 12px 0 0;
    z-index: 2;
    margin-top: -1px;
    top: 0;
    }
    .towers_towersGameRow__flu2C {
    background: #1A1B1B;
   }
   .battles_battlesElement__XcTsG {
    background: #1A1B1B;
   }
   .battles_battlesElementAmount__6sn8b {
   background: #1A1B1B;
   }
   .jackpot_jackpotGameInner__wEaud:after {
   background: url("https://cdn.discordapp.com/attachments/1052932517604364349/1262413999329509446/jackpot_black_circle.png?ex=6697d3a7&is=66968227&hm=61aa55cc9017e195057507f03ee4ab38188c6108e561289c0253da52a036997e&") 50%/100% 100% no-repeat
   }
   .roulette_rouletteGameTrackItemRed__dSEzZ {
   background: linear-gradient(180deg, #790b33, #8b0537 47%, #d62323);
   }
   .roulette_rouletteGameTrackItemPurple__wRH_J {
   background: linear-gradient(357deg, #5a009b 19%, #6a0a76 76%, #640a69 132%)
   }
   .gameLatestItemPurple {
   background: #5c007d;
   }
   .gameLatestItemRed {
    background: #CA1E26
   }
   .gamePlayersTableBody .gamePlayersTableRow:nth-child(odd) .gamePlayersTableItem {
    background: #1d1d1d;
   }
   .cups_cupsGameItem___wVx6:nth-child(odd) {
    background: #1d1d1d;
    border-radius: 25px;
    border-left: 1px solid rgba(71, 71, 71, 0.8);
    border-right: 1px solid rgba(71, 71, 71, 0.8);
   }

   .cups_cupsGameItem___wVx6 {
    border-radius: 25px;
    border-top: 1px solid rgba(71, 71, 71, 0.8);
    border-bottom: 1px solid rgba(71, 71, 71, 0.8);
    border-left: 1px solid rgba(71, 71, 71, 0.8);
    border-right: 1px solid rgba(71, 71, 71, 0.8);
   }
   .homeutils_devider__Aryam .homeutils_defButtons__2mJ3g .homeutils_buttonCard__UU5x9 {
   background: #1d1d1d;
   }
   .homeutils_favoiriteSlots__brBik .homeutils_favoiriteSlotsWrap__a9rRR .homeutils_slotCard__w_MW8 {
   background: #1d1d1d;
   }
   .homeutils_devider__Aryam .homeutils_dataSection__fUUub {
   background: #1d1d1d;
   }
   .input_input__N_xjH {
    border-top: 1px solid rgba(71, 71, 71, 0.8);
    border-image: initial;
   }
  .customInputInnerButtons {
   background: #161617
   }
   .roulette_roulettePlayersColumn__iBsQD {
    border-top: 1px solid rgba(71, 71, 71, 0.8);
    border-bottom: 1px solid rgba(71, 71, 71, 0.8);
   }
   .case_case__qg7bq {
   background: rgb(0 0 0 / 30%);
   }
   .modals_modalRetention__4asz2 .modals_ageContainer__UGgCi .modals_retentionItem__LkhD6 {
   background: #282828;

   }
   .blackjack_mainBJPreview__eU0AD .blackjack_tablesCards__5iGej .blackjack_tableCard__KU9yr .blackjack_finalWrap__8agGm {
    background: #1c1c1c;
   }
   .blackjack_mainBJPreview__eU0AD .blackjack_tablesCards__5iGej .blackjack_tableCard__KU9yr {
   background: linear-gradient(0deg, #282929, #202020), #212121;
   }
   .button_button__dZRSb.button_primary__LXFHi, .button_button__dZRSb.button_secondary__Fa_lP, .button_button__dZRSb.button_square__fMSa0 {
    border-top: 1px solid rgba(71, 71, 71, 0.8);
    border-bottom: 1px solid rgba(71, 71, 71, 0.8);
   }
   .chat_chat__paFx8 {
    border-top: 1px solid rgba(71, 71, 71, 0.8);
    border-bottom: 1px solid rgba(71, 71, 71, 0.8);
    border-left: 1px solid rgba(71, 71, 71, 0.8);
    border-right: 1px solid rgba(71, 71, 71, 0.8);
   }
`);
