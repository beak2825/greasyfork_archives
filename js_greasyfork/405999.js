/* ==UserStyle==
@name           Filmweb MegaTweak
@namespace      https://greasyfork.org/pl/users/636724-cml99
@version        3.3.5
@description    Zbiór opcji dla Filmweb, takich jak ciemny motyw, mniejsze elementy, klasyczna galeria i powiązane oraz wiele innych.
@description:en Collection of options for Filmweb, such as a dark theme, smaller elements, classic gallery and many more.
@author         CML99
@license        CC-BY-NC-SA-4.0
@preprocessor   stylus
@homepageURL    https://greasyfork.org/pl/scripts/406046-filmweb-megatweak
@supportURL     https://greasyfork.org/pl/scripts/406046-filmweb-megatweak/feedback
@var            select cmlTheme "◑ Motyw" ["vanilla:☀ oryginalny*", "reader:⚯ dark reader +", "dark:☾ ciemny", "dim:⛯ przyciemniony"]
@var            checkbox cmlNoFooterHome "✖ Ukrycie głównej pod stronami" 1
@var            checkbox cmlForum "➥ Usprawnienia forum" 1
@var            checkbox cmlMisc "✔ Drobne usprawnienia" 1
@var            checkbox cmlCompact "🡶 Zwarte elementy" 1
@var            select cmlWideRatings "★ Widok ocen" ["vanilla: 4/1 (oryginalny)*", "default:6/2 (szeroki)", "compact:8/3 (zwarty)"]
@var            select cmlFilterBar "✦ Pasek filtrów" ["vanilla:oryginalny*", "compact:zwarty", "basic:zwarty prosty", "unstick:odpięty"]
@var            select cmlProgramTV "▣ Program TV" ["vanilla:oryginalny*", "unstick:odpięty", "compact:zwarty"]
@var            select cmlThinScroll "⭥ Wąski suwak" ["none: - - -*", "light:jasny", "dark:ciemny", "yella:żółty"]
@var            select cmlEmbedFilms"⚌ Wyróżnienie filmografii" ["none: - - -*", "dark:ciemne", "darker:ciemniejsze", "darkColor:ciemne kolory", "light:jasne", "lightColor:jasne kolory"]
@var            select cmlStickyOldNav "⭶ Przypięty stary nagłówek" ["none: - - -*", "default:domyślny", "compact:zwarty"]
@var            select cmlMove "⮁ Przeniesienie" ["none: - - -*", "related:powiązane", "video:wideo", "both:powiązane i wideo"]
@var            select cmlBlur "❖ Rozmycie" ["none: - - -*", "rating:oceny", "spoiler:spoilery", "both:oceny i spoilery"]
@downloadURL https://update.greasyfork.org/scripts/406046/Filmweb%20MegaTweak.user.css
@updateURL https://update.greasyfork.org/scripts/406046/Filmweb%20MegaTweak.meta.css
==/UserStyle== */               


@-moz-document domain("filmweb.pl") {
/* ------------------------------------------ */
/*                   Tweaks                   */
/*                 23.06.2020                 */
/* ------------------------------------------ */
    
#cmlPlaceholder { display: none; }  

if cmlThinScroll == light { 
    * { scrollbar-width: thin; } 
    :root { scrollbar-width: thin; scrollbar-color: #bbb #eee; }
    ::-webkit-scrollbar { width: 8px !important; }
    ::-webkit-scrollbar:horizontal { height: 8px; }
    ::-webkit-scrollbar-track { background-color: #eee; }
    ::-webkit-scrollbar-thumb { background-color: #bbb; }
    ::-webkit-scrollbar-thumb:hover { background-color: #999; }
}

if cmlThinScroll == dark { 
    * { scrollbar-width: thin; } 
    :root { scrollbar-width: thin;  scrollbar-color: #444 #222; }  
    ::-webkit-scrollbar { width: 8px !important; }
    ::-webkit-scrollbar:horizontal { height: 8px; }
    ::-webkit-scrollbar-track { background: #222; }
    ::-webkit-scrollbar-thumb { background: #444; }
    ::-webkit-scrollbar-thumb:hover { background: #555; }
    ::-webkit-scrollbar-thumb:active { background: #666; }    
}

if cmlThinScroll == yella { 
    * { scrollbar-width: thin; } 
    :root { scrollbar-width: thin;  scrollbar-color: #fc0 #666; }  
    ::-webkit-scrollbar { width: 8px !important; }
    ::-webkit-scrollbar:horizontal { height: 8px; }
    ::-webkit-scrollbar-track { background: #666; }
    ::-webkit-scrollbar-thumb { background: #fc0; }
    ::-webkit-scrollbar-thumb:hover { background: #da0; }
    ::-webkit-scrollbar-thumb:active { background: #750; }    
}

/* ------------------------------------------ */

if cmlNoFooterHome { 
    #site:not([data-linkable="home"]) .page[data-linkable="home"],
    #site:not([data-linkable="home"]) .infiniteContentLoader, 
    #site:not([data-linkable="home"])[data-linkable="filmMain"] .vodPage[data-linkable="vod"] { 
        display: none; 
    }
    #site:not([data-linkable="home"])[data-linkable="filmDescriptions"] .page[data-linkable="filmMain"], 
    #site:not([data-linkable="home"])[data-linkable="filmFullCast"] .page[data-linkable="filmMain"], 
    #site:not([data-linkable="home"])[data-linkable="iriSerialEpisodesPage"] .page[data-linkable="filmMain"] { 
        display: none; 
    }
} 

/* ------------------------------------------ */

if cmlBlur == spoiler or cmlBlur == both {
.page[data-group="filmPage"], .page[data-group="personPage"], .page[data-group="characterPage"], .page[data-group="worldPage"] {     
div, div > span { transition: 0.35s filter linear, 0.35s -webkit-filter linear; }    
.filmPosterSection__plot:not(.filmPosterSection__plotEmpty):not(:hover), .descriptionSection__container:not(:hover), .descriptionSection__list:not(:hover), .curiositiesSection__item:not(:hover), .flatReview:not(:hover), .filmFriendComment__comment:not(:hover), .forumSection__contentWrapper:not(:hover) { 
    filter: blur(0.5rem); 
}
.characterRelated:not(:hover), .characterRelationSection .page__container--paddingless:not(:hover), .characterRelationSection .crs__item:not(:hover) { 
    filter: blur(1rem) saturate(0%);  
}  
}

.filmsPage, .serialsPage {
    div { transition: 0.35s filter linear, 0.35s -webkit-filter linear; }  
    .filmPreview__description:not(:hover), .trailer__lead:not(:hover) { filter: blur(0.5rem); }
}

.recommendationsPage .filmPreview .filmPreview__description p:not(:hover) { filter: blur(0.5rem); }      
}

/* ------------------------------------------ */

if cmlBlur == rating or cmlBlur == both {
.page[data-group="filmPage"], .page[data-group="personPage"], .page[data-group="characterPage"], .page[data-group="worldPage"] {     
div, div > span { transition: 0.35s filter linear, 0.35s -webkit-filter linear; }        
.filmRating:not(:hover), .personRating__rate:not(:hover), .filmCriticsVotesSection__criticRating:not(:hover), .ratingSummary__userRate:not(:hover), .personRole__container:not(:hover) .personRole__ratingRate, .forumSection__rate:not(:hover), .rankingElement__rate:not(:hover), .ratingSummary__average:not(:hover) { 
    filter: blur(0.5rem); 
}  
.reviewsSection .reviewBox:not(:hover), .filmFriendComment__status:not(:hover) { filter: blur(0.5rem) saturate(0%); }     
}

.recommendationsPage .recommText .recomVal:not(:hover), .rateBox__rate:not(:hover) { filter: blur(0.35rem); }
}

/* ------------------------------------------ */

if cmlMisc {
/* restore date */
.filmInfo__header.hide[data-premiere], .filmInfo__info.hide[data-premiere] { display: grid !important; }

/* hints */
.tipsBoarding { display: none; }    /* nowe oznaczenia filmow */
.floatingActionButton__bubble, .floatingActionButton__area::before { display: none; }   /* glowna - znajomi */
    
/* tv */
#platformSelect .dropdown-toggle:hover label { cursor: pointer !important; }
.guideContainer .t_wts.seance .ribbonElement { margin-top: 0px; }
.guideContainer .seance:hover .sh { height: 46.2px; background: none !important; }
.guideContainer .seance:hover:not(.t_wts) .ribbonElement { position: relative; padding-left: 0px; padding-top: 0px; }
.guideContainer .seance:not(:hover):not(.t_wts) .ribbonElement { display: block; }
.guideContainer .seance:not(:hover):not(.t_wts) .ribbonElement .ribbonButton.notSeenYet { display: none !important; } 
.tvProgramSection div[data-now-line="true"] > div { background-color: #ffc404; color: #000; }
.tvProgramSection div[data-now-line="true"] { background-color: rgba(255, 200, 0, 0.25); }
.tvProgramSection .Seance:has(.ico--starSolid) { background-color: #fc01; }
.tvProgramSection .Seance:has(.ico--eyeSolid) { background-color: #2f01; }

/* misc */
@media (min-width: 1152px) { .page__section.videoSection .videoSection__container { max-width: 64rem; } }     
.page__contribsButton .icoButton { top: 0.12rem; }
.fwBtn.fwBtn--s:not(.fwBtn--wide), .fwBtn.fwBtn--m:not(.fwBtn--wide), .fwBtn.fwBtn--l:not(.fwBtn--wide) { max-width: 22rem; }

/* hide your taste */
.filmRatingSection .ratingPanel > div > div > div > div > div > div > div > div:nth-of-type(2):has(button) > div:nth-of-type(1):not(:has(div)) { 
    display: none; 
}
.filmRatingSection .ratingPanel > div > div > div > div > div > div > div:hover > div:nth-of-type(2):has(button) > div:nth-of-type(1):not(:has(div)) { 
    display: flex !important; 
}

/* profil */
.userProfilePage #app > div[type="noMobilePadding"]:not(section):nth-child(2) > div:not(section):nth-child(1) { z-index: 10; }
.userProfilePage #app > div:not(section):nth-child(2) > div:has(.ico--filterThinLarge) > div:nth-of-type(2):has(button[type="borderShadow"]) > div > div:nth-of-type(1):has(.favoriteButton) { height: 2.5rem; }
    
/* textshad */
.filmCoverSection .filmCoverSection__info, .coverSection__desc, .personCoverSection__title { text-shadow: 2px 1px 1px #000; }  
.personPhotosByYears__desc { text-shadow: 1px 2px #000; }  
.mainSlideshowSection .firstNewsContainer .polaroid__title a, .slideshowSection__firstRowTitle { text-shadow: 2px 2px #000; }    
.mainSlideshowSection .firstNewsContainer .polaroid__commentsCount, .slideshowSection__firstRowComments { text-shadow: 1px 1px #000; } 
.userProfileHeader .user__name { color: #fff; text-shadow: 2px 2px 0px #111; } 
.surveyBox.variantHome .surveyBoxAnswer__content { text-shadow: #000 1px 1px 1px; background: none; }
.surveyBox.variantHome { filter: brightness(80%); }
.homeMostPopularSection .crs__item .filmPoster::before, 
.vodPopularSection .crs__item .simplePoster__poster::before { text-shadow: #000 2px 2px 2px; }
.vodPopularSection:not([data-state]) .crs__item .simplePoster__poster::before { text-shadow: #000 2px 1px; }
.filmCoverSection .fP__title { text-shadow: 1px 2px 1px #000; }
.filmCoverSection .fP__originalTitle, .filmCoverSection .fP__year, .filmCoverSection .fP__duration, .filmCoverSection .filmRating__rateValue, .filmCoverSection .filmRating__count, .filmCoverSection .fP__card::before, .filmCoverSection .filmCoverSection__title:not(.filmCoverSection__title--large), .filmCoverSection__originalTitle, .filmCoverSection__year, .filmCoverSection__duration, .filmCoverSection .filmCoverSection__type, .episodesProgressLine__text { text-shadow: 1px 1px 1px #000; }

}

/* ------------------------------------------ */

if cmlEmbedFilms == dark or cmlEmbedFilms == darker or cmlEmbedFilms == darkColor or cmlEmbedFilms == light or cmlEmbedFilms == lightColor {
    :is(.preview, .previewHolder).variantBadge .preview__card::before { background: none; }
    .personFilmographySection__titleCounter.personFilmographySection__afterPremiereCounter { padding-bottom: 0.75rem !important; }
}

if cmlEmbedFilms == dark {
    .personFilmographySection__item[data-user-rate="1"] .personFilmographySection__itemInner, 
    .personFilmographySection__item[data-user-rate="1"] :is(.preview, .previewHolder).isMini { background-color: #303030; }
    .personFilmographySection__item[data-user-wts="1"] .personFilmographySection__itemInner, 
    .personFilmographySection__item[data-user-wts="1"] :is(.preview, .previewHolder).isMini { background-color: #282828; }
}
if cmlEmbedFilms == darker {
    .personFilmographySection__item[data-user-rate="1"] .personFilmographySection__itemInner, 
    .personFilmographySection__item[data-user-rate="1"] :is(.preview, .previewHolder).isMini { background-color: #111; }
    .personFilmographySection__item[data-user-wts="1"] .personFilmographySection__itemInner, 
    .personFilmographySection__item[data-user-wts="1"] :is(.preview, .previewHolder).isMini { background-color: #161616; } 
}
if cmlEmbedFilms == darkColor {
    .personFilmographySection__item[data-user-rate="1"] .personFilmographySection__itemInner, 
    .personFilmographySection__item[data-user-rate="1"] :is(.preview, .previewHolder).isMini { background-color: #262211; }
    .personFilmographySection__item[data-user-wts="1"] .personFilmographySection__itemInner, 
    .personFilmographySection__item[data-user-wts="1"] :is(.preview, .previewHolder).isMini { background-color: #121; }     
}
if cmlEmbedFilms == light {
    .personFilmographySection__item[data-user-rate="1"] .personFilmographySection__itemInner, 
    .personFilmographySection__item[data-user-rate="1"] :is(.preview, .previewHolder).isMini { background-color: #ccc; }
    .personFilmographySection__item[data-user-wts="1"] .personFilmographySection__itemInner, 
    .personFilmographySection__item[data-user-wts="1"] :is(.preview, .previewHolder).isMini { background-color: #ddd; }   
}
if cmlEmbedFilms == lightColor {
    .personFilmographySection__item[data-user-rate="1"] .personFilmographySection__itemInner, 
    .personFilmographySection__item[data-user-rate="1"] :is(.preview, .previewHolder).isMini { background-color: #fea; }
    .personFilmographySection__item[data-user-wts="1"] .personFilmographySection__itemInner, 
    .personFilmographySection__item[data-user-wts="1"] :is(.preview, .previewHolder).isMini { background-color: #afa; }     
}

/*
if cmlEmbedFilms == dark {
    .tvGrids .seance:has(.seenWithRate) { background-color: #303030; }
    .tvGrids .seance.t_wts:has(.wantsToSee) { background-color: #282828; }
}
if cmlEmbedFilms == darker {
    .tvGrids .seance:has(.seenWithRate) { background-color: #111; }
    .tvGrids .seance.t_wts:has(.wantsToSee) { background-color: #161616; }    
}
if cmlEmbedFilms == darkColor or cmlEmbedFilms == lightColor {
    .tvGrids .seance:has(.seenWithRate) { background-color: #262211; }
    .tvGrids .seance.t_wts:has(.wantsToSee) { background-color: #121; }       
}
if cmlEmbedFilms == light {
    .tvGrids .seance:has(.seenWithRate) { background-color: #ccc; }
    .tvGrids .seance.t_wts:has(.wantsToSee) { background-color: #ddd; }      
}
if cmlEmbedFilms == lightColor {
    .tvGrids .seance:has(.seenWithRate) { background-color: #fea; }
    .tvGrids .seance.t_wts:has(.wantsToSee) { background-color: #afa; }         
}
*/

.searchPage, .searchApp__results, .searchSortAndFilterReactApp {
if cmlEmbedFilms == dark or cmlEmbedFilms == light {
    div:has(> div > .ribbon:not([data-state="wts"]):not([data-state="unchecked"])) { background-color: hsla(0, 0%, 20%, 0.3); }
    div:has(> div > .ribbon[data-state="wts"]) { background-color: hsla(0, 0%, 20%, 0.15); }
}
if cmlEmbedFilms == darker {
    div:has(> div > .ribbon:not([data-state="wts"]):not([data-state="unchecked"])) { background-color: hsla(0, 0%, 0%, 0.5); }
    div:has(> div > .ribbon[data-state="wts"]) { background-color: hsla(0, 0%, 0%, 0.25); }
}
if cmlEmbedFilms == darkColor or cmlEmbedFilms == lightColor {
    div:has(> div > .ribbon:not([data-state="wts"]):not([data-state="unchecked"])) { background-color: hsla(48, 100%, 20%, 0.2); }
    div:has(> div > .ribbon[data-state="wts"]) { background-color: hsla(131, 100%, 20%, 0.2); }
}
}

/* ------------------------------------------ */

if cmlForum {
@media (min-width: 768px) { .variantReply.forumTopic .forumTopic__topicText { margin-left: 0rem; } }
@media (min-width: 1152px) {
    .forumTopic.variantReply[data-indent="1"] { margin-left: 1rem; }
    .forumTopic.variantReply[data-indent="2"] { margin-left: 2rem; }
    .forumTopic.variantReply[data-indent="3"] { margin-left: 3rem; }
    .forumTopic.variantReply[data-indent="4"] { margin-left: 4rem; }
    .forumTopic.variantReply[data-indent="5"] { margin-left: 5rem; }
    .forumTopic.variantReply[data-indent="6"] { margin-left: 6rem; }
    .forumTopic.variantReply[data-indent="7"] { margin-left: 7rem; }
    .forumTopic.variantReply[data-indent="8"] { margin-left: 8rem; }
    .forumTopic.variantReply[data-indent="9"] { margin-left: 9rem; }
    .forumTopic.variantReply[data-indent="10"] { margin-left: 10rem; }
    .forumTopic.variantReply[data-indent="11"] { margin-left: 11rem; }
    .forumTopic.variantReply[data-indent="12"] { margin-left: 12rem; }
    .forumTopic.variantReply[data-indent="13"] { margin-left: 13rem; }
    .forumTopic.variantReply[data-indent="14"] { margin-left: 14rem; }
    .forumTopic.variantReply[data-indent="15"] { margin-left: 15rem; }
    .forumTopic.variantReply[data-indent="16"] { margin-left: 16rem; }
    .forumTopic.variantReply[data-indent="17"] { margin-left: 17rem; }
    .forumTopic.variantReply[data-indent="18"] { margin-left: 18rem; }
    .forumTopic.variantReply[data-indent="19"] { margin-left: 19rem; }
    .forumTopic.variantReply[data-indent="20"] { margin-left: 20rem; }
}
.plusMinusWidget__up:not(.plusMinusWidget__up--selected):hover::before { color: #7f5; }
.plusMinusWidget__down:not(.plusMinusWidget__down--selected):hover::before { color: #f55; }
.forumSection__item .forumSection__toolsIcon:hover, .forumTopicSection__tools .ico:hover::before { color: #fc0; }
.btnMinus:hover { color: #f55 !important; }
.btnPlus:hover { color: #7f5 !important; }
.comment-opts-opener:hover .icon-notification::before { color: #fc0 !important; }
}

/* ------------------------------------------ */

if cmlWideRatings == default { 
@media (min-width: 1152px) {
.userProfilePage #app div[type="noMobilePadding"]:has(section) > div:has(.fa__slot--sidebar), 
.userProfilePage #app div[type="noMobilePadding"]:has(section) > div:nth-child(3) { display: none; }
.userProfilePage #app div[type="noMobilePadding"]:has(section) { grid-template-columns: auto; gap: 1rem 0rem; }
.userProfilePage #app div > div > a > div { margin-left: 0rem;  display: block; }
.userProfilePage #app section[type="noPadding"] > div:nth-child(2):not([type="noPadding"]), 
.userProfilePage #app section[type="noPadding"] > div:nth-child(1):not([type="noPadding"]) { 
    grid-template-columns: repeat(6, 9rem); 
}
.userProfilePage #app section[type="noPadding"] > div:nth-child(2)[type="noPadding"] { 
    grid-template-columns: repeat(2, 31rem); gap: 1rem 2rem; display: grid; 
}
.userProfilePage #app section[type="noPadding"] > div:nth-child(2)[type="noPadding"] .vodButton { 
    left: 6rem; top: 5rem; height: 1.5rem; min-width: 6rem; max-width: 8rem; 
}
.userProfilePage #app section[type="noPadding"] > div:nth-child(2)[type="noPadding"] > div:has(> div > div > button[data-state="closed"]) { display:none; } 
}
}

/* ------------------------------------------ */

if cmlWideRatings == compact { 
@media (min-width: 1152px) {
.userProfilePage #app div[type="noMobilePadding"]:has(section) > div:has(.fa__slot--sidebar), 
.userProfilePage #app div[type="noMobilePadding"]:has(section) > div:nth-child(3) { display: none; }
.userProfilePage #app div[type="noMobilePadding"]:has(section) { grid-template-columns: auto; gap: 1rem 0rem; }
.userProfilePage #app div > div > a > div { margin-left: 0rem;  display: block; }

/* basic */
.userProfilePage #app section[type="noPadding"] > div:nth-child(2):not([type="noPadding"]), 
.userProfilePage #app section[type="noPadding"] > div:nth-child(1):not([type="noPadding"]) {
    grid-template-columns: repeat(8, 6.25rem); 
}
.userProfilePage #app section[type="noPadding"] > div:nth-child(2):not([type="noPadding"]) div > div:nth-of-type(3) > a > div > div,
.userProfilePage #app section[type="noPadding"] > div:nth-child(2):not([type="noPadding"]) div > div:nth-of-type(2) > a > div > div, 
.userProfilePage #app section[type="noPadding"] > div:nth-child(1):not([type="noPadding"]) div > div:nth-of-type(3) > a > div > div { 
    font-size: 0.875rem; line-height: 1.1rem; 
}
.userProfilePage #app section[type="noPadding"] div:has(> .rankingType.hasVod), 
.userProfilePage #app section[type="noPadding"] > div:nth-of-type(2) div:has(> .ico--tasteSolid) { display: none; }
.userProfilePage #app section[type="noPadding"] > div:not([type="noPadding"]) div, 
.ribbonPanel__image[style="width: 100px; height: 142.367px;"] {
    .isInit.ribbon { width: 1.5rem; height: 1.875rem; }
    .isInit.ribbon::after { top: .1875rem; font-size: 1.125rem; }
}

/* roles */
.userProfilePage #app section[type="noPadding"] > div:nth-child(2)[type="noPadding"] > div:has(> div > div > button[data-state="closed"]) { display:none; } 
.userProfilePage #app section[type="noPadding"] > div:nth-child(2)[type="noPadding"] > div:not(:has(> div > div > button[data-state="closed"])) span { font-size: 0.875rem; }
.userProfilePage #app section[type="noPadding"] div[type="noPadding"]:has(.ribbonRole) > div:has(.thumbUpStart) { display: none; }

/* ext */
.userProfilePage #app section[type="noPadding"] > div:nth-child(2)[type="noPadding"] { 
    grid-template-columns: repeat(3, 20rem); gap: 1rem 2rem; display: grid; 
}
.userProfilePage #app section[type="noPadding"] > div:nth-child(2)[type="noPadding"] .vodButton { 
    left: 6.2rem; top: 5.1rem; height: 1.3rem; min-width: 6rem; max-width: 6rem; font-size: 0.8rem !important;
}
.userProfilePage #app section[type="noPadding"] > div:nth-child(2)[type="noPadding"] {
    div > div:nth-of-type(1) > div:nth-of-type(1) > a { font-size: 1rem; }
    div > div:nth-of-type(1) > div:nth-of-type(1) > dl > dd > a { font-size: 0.8rem; }
    div > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > span:nth-of-type(1) > .ico { font-size: 1.1rem; }
    div > div:nth-of-type(2) > div:nth-of-type(1) > span { font-size: 0.85rem; line-height: 1.1rem; }
    div > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(2) > button:nth-of-type(1) { font-size: 0.8rem; }
    div > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(2) > button:nth-of-type(2) { height: 1rem; }
    div > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(2) > button:nth-of-type(2) > div > .animatedIcon { 
        width: 1.75rem; height: 1.75rem; 
    }
    div > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(2) > button:nth-of-type(2):has(> div > .animatedIcon) > div:nth-of-type(2) { margin-top: -0.4rem; }
    div > div:nth-of-type(2) > div:nth-of-type(1) span:has(.ico--starSolid) { width: 1.2rem; height: 1.2rem; }
}

}
}

/* ------------------------------------------ */

if cmlMove == related or cmlMove == both { 
#site:not([data-linkable="home"])[data-linkable="filmMain"] {
@media screen and (min-width: 1151px) {
    [data-group="filmPage"].page .page__wrapper--grid [data-group="g10"].page__group { grid-area: g3; }    
    .page__wrapper--grid .filmMainRelatedsSection { top: 25rem; z-index: 1; } 
}
.filmMainRelatedsSection .simplePoster__title { font-size: 0.75rem; line-height: 1.0; margin: 0.5rem 0 .25rem 0; }
.filmMainRelatedsSection .simplePoster__year { padding-bottom: .5rem; font-size: 0.8rem; line-height: 1.0; }  
.page__wrapper--grid .filmMainRelatedsSection__wrapper { 
    grid-row-gap: 0rem; 
    grid-column-gap: 0.5rem; 
    grid-template-columns: repeat(4,minmax(0,1fr)); 
    padding-bottom: 0.5rem; 
}
}
body:has(#site:not([data-linkable="home"])[data-linkable="filmMain"]) {
.filmMainRelatedsSection .isInit.ribbon, 
.ribbonPanel__image[style="width: 70px; height: 99.65px;"] .isInit.ribbon { width: 1.5rem; height: 2rem; }
.filmMainRelatedsSection .isInit.ribbon::after, 
.ribbonPanel__image[style="width: 70px; height: 99.65px;"] .isInit.ribbon::after { top: 0.1rem; }
}
}

/* ------------------------------------------ */

if cmlMove == video or cmlMove == both {
html { 
/* obsada */ [data-group="filmPage"].page .page__wrapper--grid [data-group="g6"].page__group { grid-area: g5; }
/* ranking rol */ [data-group="filmPage"].page .page__wrapper--grid [data-group="g8"].page__group { grid-area: g6; }
/* zwiastuny */ [data-group="filmPage"].page .page__wrapper--grid [data-group="g5"].page__group { grid-area: g8; }
}
.noFilmVideoData, .noFilmReviewData.noPhotoGalleryData.noTopRolesData { 
/* zwiastuny */ [data-group="filmPage"].page .page__wrapper--grid [data-group="g5"].page__group { grid-area: g5 !important; }    
/* obsada */ [data-group="filmPage"].page .page__wrapper--grid [data-group="g6"].page__group { grid-area: g6 !important; }
/* ranking rol */ [data-group="filmPage"].page .page__wrapper--grid [data-group="g8"].page__group { grid-area: g8 !important; }
}
}  

/* ------------------------------------------ */

if cmlFilterBar == unstick {
    .userProfilePage #app > div[type="noMobilePadding"] > div:has(ul) { position: relative; top: 0rem; }
    .searchSortAndFilterReactApp.sticky, 
    .searchSortAndFilterReactApp:not(.sticky) > section { position: relative !important; top: 0rem; }
    [data-group="vodPage"] .page__group[data-group="g2"], 
    [data-group="rankingPage"].page .page__group[data-group="g2"]  { position: relative; top: 0rem; }
}

if cmlFilterBar == basic {
    .userProfilePage #app > div[type="noMobilePadding"] > div:has(ul) {
        min-height: 1rem;
        padding: 0.5rem;
        > div:nth-of-type(2):has(button[type="borderShadow"]) { display: none; }
    }
}

if cmlFilterBar == compact {
    .userProfilePage #app > div[type="noMobilePadding"] > div:has(ul) {
        min-height: 1rem;
        padding: 0.5rem;
        > div:nth-of-type(2):has(button[type="borderShadow"]) {
            margin-bottom: -1.5rem;
            > div { padding: 0.5rem 1rem 0px; }
            > div > div:nth-of-type(1):has(.favoriteButton) { height: 2rem; }
            button[type="borderShadow"] { height: 2rem; }
            .favoriteButton { height: 2rem; }
            .vodPicker { min-width: 2rem; height: 2rem; }
            > div > div:nth-of-type(2) { padding-bottom: 0.5rem; }
            > div > div:nth-of-type(2) > button { height: 2rem; }
        }
    }
}

if cmlFilterBar == compact or cmlFilterBar == basic {
    .searchSortAndFilterReactApp.sticky, .searchSortAndFilterReactApp:not(.sticky) {
        top: calc(var(--fw-header-height) + .0rem);
        > section > div:nth-of-type(1) { padding-bottom: 0.25rem; }
        > section > div:nth-of-type(2) { padding-bottom: 0.5rem; }
        > section > div:nth-of-type(1) > div > div:nth-of-type(1), 
        > section > div:nth-of-type(1) > div > div:nth-of-type(2) > div { height: 1.5rem; min-height: 1.5rem; }
        > section > div:nth-of-type(1) button[type="borderShadow"] { --button-height-md: 1.5rem; padding: 0rem 0.75rem; }
    }
    .searchSortAndFilterReactApp:not(.sticky) > section { padding: 0.35rem 0px 0px; }
    .searchSortAndFilterReactApp.sticky:has(button) { top: calc(var(--fw-header-height) + .35rem);}
    [data-group="vodPage"] .page__group[data-group="g2"] .vodProvidersSection { 
        .page__container { padding: 0.5rem 1rem .25rem; }
        .providerFilter__default, .providerFilter__expand { height: 1.5rem; }
        .providerFilter__edit { height: 1.5rem; width: 1.5rem; }
        .providerFilter__item { height: 1.5rem; }
        .providerFilter__list { min-height: 1.5rem; max-height: 2.25rem; }
        .navList--primary .navList__button, .navList--tertiary .navList__button { font-size: 1rem; line-height: 1rem; }
    }
    [data-group="rankingPage"].page .page__group[data-group="g2"] .rankingProviderSection { 
        .rankingProvider__expand { height: 2rem; }
        .rankingProvider__item { height: 2rem; }
        .rankingProvider__list { margin-bottom: 0.0rem; }
    }
}

/* ------------------------------------------ */

if cmlProgramTV == unstick {
    .tvProgramSection__content { 
        div[style*="--channel-top"] > div[size="5"] > div:nth-of-type(3):has(button) > button { display: none; }
        > div:nth-of-type(1) > div:nth-of-type(2) { position: static; }
        > div:nth-of-type(1) > div:nth-of-type(3), 
        > div:nth-of-type(1) > div:nth-of-type(3)::before, 
        > div:nth-of-type(1) > div:nth-of-type(3)::after { position: static; }
        div:has(> div > div[data-btn-center-sel="poster"]) { width: 3.5rem; height: 5rem; }
    }
}

if cmlProgramTV == compact {
@media (min-width: 1152px) {
    /* filter */
    .tvProgramSection__content {
        /* > div:nth-of-type(1) > div:nth-of-type(2) { top: 3.25rem; } */
        /*
        > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) {
            > button:nth-child(4), > button:nth-child(5) {  display: none; }
        }
        */
        /* > div:nth-child(1) > div:nth-child(2) { flex-direction: row; gap: 0.35rem; } */
        /*
        > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) { width: 1820px; gap: 0.35rem; }
        > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) { gap: 0.25rem; }
        > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) {
            --date-picker-size: 19.69rem; --date-picker-items: 6; --date-picker-gap: 0rem;
        }
        div:has(input[placeholder="Wpisz nazwę kanału"]) > button { height: 1.75rem; top: 48%; }
        */
        > div:nth-of-type(1) > div:nth-of-type(3) { top: 6.9rem; }
        > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) button { padding: 0px 0.35rem; }
        > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) button { padding: 0px 0.5rem; }
        .insertion[data-name="TVP - FaButton"] button { padding: 0.1rem 0.2rem; }
        h1:has(.insertion) { font-size: 1.25rem; line-height: 1.5rem; }
        > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) {
	        > div:nth-of-type(1), > div:nth-of-type(2), > div:nth-of-type(3) {
		        > div:nth-of-type(1) > div:nth-of-type(2) { display: none; }
	        }
	        > div:nth-of-type(n+4) {
		        > div:nth-of-type(1) > div:nth-of-type(1) { display: none; }
	        }
        }

    }

    /* channel */
    .tvProgramSection__content {
        .slide > div:nth-child(1) > div:nth-child(1):has(div[data-channel-header-id]), 
        > div:nth-of-type(1) > div:nth-of-type(3), 
        > div:nth-of-type(1) > div:nth-of-type(3)::before, 
        > div:nth-of-type(1) > div:nth-of-type(3)::after { height: 2.2rem !important; }
        > div:nth-of-type(1) > div:nth-of-type(3)::before, > div:nth-of-type(1) > div:nth-of-type(3)::after {
            --channel-header-height: 2.2rem;
            --filter-header-height: 2.2rem;
            --sticky-header-top: 2.2rem;
        }
        div[style*="--channel-top"] > div[size="5"] { margin-top: -2.2rem; }
        div.slide > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) { padding-top: 2.2rem; }
        div[style*="--channel-top"] > div[size="5"] > div:nth-of-type(3):has(button) { top: 2.2rem; }
        div[style*="--channel-top"] > div[size="5"] > div:nth-of-type(3):has(button) > button { display: none; }
        div[style*="--channel-top"] > div[size="5"] > div:nth-of-type(2) { --ceres-navigation-top: 2.3rem; }
        .slide div[data-channel-header-id] img { width: 3rem !important; }
        .slide div[data-channel-header-id] a:has(img) { flex-direction: row; }
        .slide div[data-channel-header-id] a:has(img) > div { width: 7rem; }
        .slide div[data-channel-header-id] > div:nth-child(1) { top: 0.575rem; right: 0.15rem; }
        .slide div[data-channel-header-id] > div:nth-child(1) > a {
            --heart-width: 1.5rem;
            --heart-height: 1.5rem;
            --heart-font-size: 1.2rem;
        }
        /* item */
        div:has(> div > div[data-btn-center-sel="poster"]) { width: 2.75rem; height: 3.85rem; }
        .Seance div[mode="normal"] { --seance-block-padding: 0.5rem; gap: 0.1rem; padding-top: 0.2rem; }
        .Seance div[mode="normal"] .title { font-size: 0.95rem; }
        .Seance .ico--starSolid, .Seance .ico--eyeSolid { width: 1rem; height: 1rem; }
        .Seance div:has(.ico--starSolid), .Seance div:has(.ico--eyeSolid) { right: 0.25rem; top: 0.25rem; }
    }
}
}

/* ------------------------------------------ */

@media screen and (min-width: 1152px) {
    
if cmlStickyOldNav == default {
    #header { position: fixed; min-width: 100%; }  
    #body { margin-top: 112px; }  
    .ikeaBanner, .fa.faBannerProgramTv { top: 112px; }       
    .channelInfo[style] { margin-top: 113px !important; }
    .tvGrids .buttons[style] { margin-top: 142px; }        
}    

if cmlStickyOldNav == compact {
    #header { position: fixed; min-width: 100%; }  
    #body { margin-top: 45px; }  
    .ikeaBanner, .fa.faBannerProgramTv { top: 45px; }  
    .channelInfo[style] { margin-top: 48px !important; }   
    .tvGrids .buttons[style] { margin-top: 80px; }    
    #header {
        .header--main { height: 0; padding-top: 5px; padding-bottom: 42px; padding-left: 0; padding-right: 0; }    
        .header__logo { width: 33px; height: 30px; background-size: cover !important; z-index: 5; }    
        #siteMenuWrapper { top: 0px; left: -350px; /*text-transform: unset;*/ }  
        #siteMenuWrapper .item-top > a { font-size: .75rem; padding: 7px 0.5rem 0; }
        #siteMenuWrapper .item__new { top: 0; margin-top: 0; }    
        #userHeader .user__name-wrap { display: none; }    
        #userHeader #userHeaderButton { z-index: 10; }   
        #userHeader .user__avatar { margin-right: 0rem; }    
        #searchMain { width: 310px; margin-left: 480px; z-index: 15; position: relative; margin-top: 2px; }  
        #searchMain #searchForm { width: 310px; }
        #searchMain .form__input { height: 33px; letter-spacing: -.3px; padding-top: 0.4rem; width: 100%; }  
        #searchMain .search__submit { top: -5px; }    
        a.popularList__item:nth-child(n+4) { display: none; }
        #siteMenuWrapper > .list #canalPlusDesktopLink, #siteMenuWrapper > .list #netflixDesktopLink { display: none !important; }    
        .facebookLoginButton { height: 33px; width: 40px; min-width: 40px; max-width: 40px; left: 200px; top: 2px; }    
    }
}

} /* stickyEnd */

} /* domainEnd */


@-moz-document domain("filmweb.pl") {
/* ------------------------------------------ */
/*                   Compact                  */
/*                 23.06.2020                 */
/* ------------------------------------------ */
    
#cmlPlaceholder { display: none; }  

if cmlCompact {
/* generic */
.page__moreButton .fwBtn--default, .page__moreButton .fwBtn--black, .page__moreButton .fwBtn__black, 
.resultsList + .fwBtn__wrapper .fwBtn--default, .commentMore--gradient button, .fwBtn--default { padding: 5px; } 
button[type="quaternary"] { height: 1.85rem; }
.page__moreButton:not(.page__moreButton--paddingless) { padding: 0 0 0.5rem; }

/* home */
.homePage {
.mainSlideshowSection .firstNewsContainer, .mainSlideshowSection .innerBg { height: 31rem; }    
.tabSection--skyAd .tabSection__content { width: 100%; }
.polaroid--wide { text-align: center; width: 14.5rem; flex-flow: wrap; }
.polaroid--wide .polaroid__thumbnail { width: 100%; }
.polaroid--wide .polaroid__caption { width: 100%; height: 130px; }
.polaroid--wide .polaroid__title { font-size: 1rem; line-height: 1rem; }
.polaroid--wide .polaroid__meta { left: 0; bottom: 0; position: relative; text-align: center; }
.polaroid--wide .polaroid__header { height: 56px; } 
.polaroid--carousel, .polaroid--compact { width: 14.5rem; } 
.polaroid--compact .polaroid__title a, .polaroid--wide .polaroid__title a { line-height: 1.1rem !important; }       
.tabSection__content .newsSection__item:nth-of-type(n+5), .tabSection--skyAd .tabSection__skyAd { display:none; }        
.tabSectionMostPopular {      
    .posterInfoBox.posterInfoBox--big { width: 7.5rem; }
    .posterInfoBox.posterInfoBox--big .filmPoster.filmPoster--big .filmPoster__link { width: 7.5rem; height: 11.25rem; }
    .crs--posters .crs__item { padding-right: .85rem;} 
    .advertButton a { font-size: 0rem !important; }        
}   
.expandableSection--homeTrailers {
    .expandingImagesCarousel { height: 400px; }
    .expandingImagesCarousel .crs__item { width: 12.1rem; }
    .expandingImagesCarousel .crs__item.wide { width: 32rem; }
    .filmSnapshot__link, .filmSnapshot__link .filmSnapshot__image { height: 20rem; }
    .expandableBox__info { height: 138%; }  
} 
.tabSectionRanking .posterInfoBox.posterInfoBox--wide .posterInfoBox__meta { padding-top: 0 !important; }
.tabSectionRanking .posterInfoBox--rankings .posterInfoBox__title { height: 5rem; }  
.tabSectionTakePart {
    .crs--polaroids .crs__item { width: 17rem; }
    .polaroid__title { font-size: 1.1rem; }
    .polaroid__header { height: 1.5rem; overflow: hidden; }
}   
.tabSectionReviews .recommendedReviewsList__item { width: 22rem; }
.tabSectionFwPrograms, .fwmArticlesSection, .slideshowSection--gamesSlideshowSection  {
    .crs--polaroids .crs__item { width: 16.5rem; }
    .polaroid__title { font-size: 1rem; line-height: 1.4; }
    .polaroid__header { height: 1.5rem; overflow: hidden; }
    .slideshowSection__firstRowImage, .slideshowSection__firstRowImageContainer { height: 14rem; }
}     
.bornTodaySection .filmPoster.filmPoster--normal .filmPoster__link { width: 7.5rem; height: 10rem; }
.bornTodaySection .posterInfoBox { width: 7.5rem; } 
}  

/* - naglowek filmu - */
.filmCoverSection__wrapper { padding-top: 0px; padding-bottom: 1rem; min-height: 21rem !important; }
html:not(.coverFrame) .filmCoverSection__wrapper { overflow-x: visible; }
.filmCoverSection__trailerLink { top: 16rem; left: 60%; width: 15rem; display: none; }
.filmCoverSection__trailerLink .trailerInfo { display: none; }  
.filmCoverSection .page__container .filmCoverSection__type { font-size: 0.9rem; }
.filmCoverSection .page__container .filmCoverSection__title { font-size: 1.5rem; line-height: 2rem; letter-spacing: 1px; }
.filmCoverSection .page__container .filmCoverSection__meta { font-size: 0.8rem; }
.filmCoverSection__ratings { margin-top: 5px; }
.coverPhoto .filmCoverSection__coverPhoto .filmCoverSection__bg::before { background-color: hsla(50,0%,0%,0.5); } 
@media screen and (max-width: 1151px) { .filmCoverSection__wrapper { min-height: 16rem; padding-top: 15rem; } }
@media screen and (min-width: 1151px) { 
    .filmCoverSection__wrapper, .page[data-linkable="filmMain"] .filmCoverSection__wrapper { min-height: 18rem; padding-top: 15rem; } 
}
.page[data-linkable="filmMain"] .filmCoverSection__coverPhoto { padding-top: 0rem !important; }
.filmEpisodePage .filmCoverSection__wrapper { padding-bottom: 0rem; }
.filmEpisodePage .filmCoverSection__coverPhoto { min-height: 18rem !important; padding-top: 5rem; padding-bottom: 1rem; }
.filmCoverSection .fP__title { font-size: 1.5rem; letter-spacing: 1px; line-height: 2rem; }
.filmCoverSection .fP__card::before { top: -1rem; font-size: 0.85rem; }
.filmCoverSection__tooltip { top: calc(-100% - 1.5rem); padding: 0.5rem 0.75rem ; line-height: 0.8rem; }
.filmCoverSection__tooltip .subtype { line-height: 1; margin-bottom: .25rem; }
.filmCoverSection__tooltip span { margin-bottom: .25rem; }
.premiereCountdown__countdown { height: 1rem; width: 7rem; }
.premiereCountdown__countdown::before { top: 1rem; display: none; }
.premiereCountdown__hours, .premiereCountdown__minutes, .premiereCountdown__seconds { font-size: 0.85rem; }
.premiereCountdown__labelHours, .premiereCountdown__labelMinutes, .premiereCountdown__labelSeconds { display: none; }
.premiereCountdown__divider { margin-top: -0.2rem; }
.homePromotedSection.homePromotedSection--countdown .ads { display: none; }
.homePromotedSection.homePromotedSection--countdown .homePromotedSection__title { height: 3rem; }
.filmPosterSection { padding-top: 1rem; }
/* .filmPosterSection__container, .personPosterSection__wrapper { padding-bottom: 5.5rem; } */
.mainTapeMenuSection__item, .mainTapeMenuSection__navigation button { height: 1.1rem; }
.mainTapeMenuSection__navigation button { padding: 0rem .75rem; }
.filmCoverSection__tooltip { top: calc(-100% + 0.5rem); max-width: 28rem; margin-bottom: 1rem; }
/* .page[data-linkable="episodeMain"] .filmCoverSection__wrapper--episode { margin-top: -5rem; } */
.ratingSummary { margin-top: 0; }
.ratingSummary > div { column-gap: 0.5rem; }
.ratingSummary > div > div:has(a) { margin-top: 0.55rem; }
.ratingSummary > div > div > a { padding: 0.5rem 0.5rem; flex-direction: row; }
.ratingSummary > div > div > a > span { margin-bottom: 0; }
.ratingSummary > div > div > a > span > .ico { width: 1.35rem; height: 1.35rem; }
.ratingSummary > div > div > a > div:nth-child(1) { margin-bottom: 0.1rem; }
.ratingSummary > div > div > a > div:nth-child(1) > span { margin-left: -0.88rem; scale: 1; }
.ratingSummary > div > div > a > div:nth-child(1) > span:first-of-type { padding-left: 0.75rem; }
.ratingSummary > div > div > a > div:nth-child(1) > span:nth-child(n+3) { display: none; }
.ratingSummary > div > div > a > div:nth-child(1) > span > span { width: 1.35rem; height: 1.35rem; }
.ratingSummary > div > div > a > div:nth-child(2) { margin-left: 0.35rem; }
.ratingSummary > div > div > a > div:nth-child(2) > div:nth-child(1) { font-size: 0.8rem; line-height: 0.7rem; }
.ratingSummary > div > div > a > div:nth-child(2) > div:nth-child(2) { font-size: 0.75rem; line-height: 0.8rem; }
    
/* - naglowek uniwersum - */
.coverSection__bg::before { background-color: hsla(50,0%,0%,0.5); }      
.coverSection__title { font-size: 1.5rem; line-height: 2.0rem; }    
.coverSection__meta { margin-bottom: 0.5rem; font-size: .8rem; line-height: 0.5rem; }     
.coverSection { padding-bottom: 0.5rem; top: -16rem; }
.coverSection__license.is-open { top: 24rem; }    
.worldPage div.page__group:nth-child(1), .characterPage div.page__group:nth-child(1) { height: 12rem; }       
.coverSection__bg { top:15rem; }  
@media screen and (max-width: 1151px) { 
.coverSection { padding-bottom: 0.5rem; top: -10rem; }
.coverSection__license.is-open { top: 10rem; }    
.worldPage div.page__group:nth-child(1), .characterPage div.page__group:nth-child(1) { height: 10rem; }       
.coverSection__bg { top: 5rem; }
}

/* - strona uniwersum - */
.characterPerformerSection .characterItemPerson__person { font-size: 0.85rem; line-height: 1rem; } 
.characterPerformerSection .characterItemPerson__more { font-size: .75rem; line-height: 1rem; } 
.rankingElement__card, .rankingElement__poster { width: 8.29rem; }  
.rankingElement__card, .rankingElement__person { font-size: 0.85rem; line-height: 1rem; }  
.rankingElement__film { font-size: .8rem; line-height: 1rem; }    
.rankingElement__rate span { display: none; }    
.worldPopular__card, .worldPopular__poster { width:9rem; }    
.filmCharactersSection__characterPoster { height: 100%; }
.filmCharactersSection__character, .filmCharactersSection__characterPoster { width: 6.25rem; }  
.characterPage .characterFilmographySection__item:nth-child(n+6) { display: none; } 
.characterRelated .simplePoster { width: 5rem; }       
.characterRelation, .usualPartnerItem, .characterPerformerSection .characterItemPerson { width: 6.75rem; }     
.characterRelation, .usualPartnerItem { width: 6.175rem; } 
.characterRelation[data-spoiler]::after { top: -1.8rem; right: -1rem; left: -0.7rem; }    
.worldCharactersSection__tile { min-width: 50%; width: 7rem; margin-right: 1rem !important; }   
.characterPerformerSection__list { grid-gap: 0.15rem; grid-template-columns: repeat(5,1fr); } 
.worldCharactersSection__list { grid-gap: 0 0.15rem; grid-template-columns: repeat(5,1fr); }    
@media screen and (min-width: 1151px) { 
    .characterPerformerSection, .worldCharactersSection { width: 1056px; } 
    .characterPerformerSection__list { grid-gap: 1rem; grid-template-columns: repeat(8,1fr); } 
    .worldCharactersSection__list { grid-gap: 0 0.15rem; grid-template-columns: repeat(8,1fr); }
}
.worldPage .crs--posters .crs__item { padding-right: 0; }
.worldPopular__card, .worldPopular__poster, .worldAllProduction__card, .worldAllProduction__poster { width: 7.125rem; }    
.characterPage .multiPoster { height: 4rem; width: 4rem; }
.characterPage .preview.previewCard .poster { width: 4rem; height: 5.75rem; }
.characterPage .isInit.ribbon:not(.ribbonRole)  { width: 1.5rem; height: 2rem; }
.characterPage .isInit.ribbon.ribbonRole  { width: 1.375rem; height: 1.375rem; }
.characterFilmographySection__header .page__header { padding: 0rem 0; }
.worldLastSection .preview.previewCard .poster { width: 4rem; height: 5.75rem; }
.worldLastSection .preview.previewCard .preview__card { padding: 0rem 0rem; }
.worldLastSection--nosubmenu .worldLastSection__navButton { margin-top: -0.8rem; }

/* - strona ludzi kina - */
.personCoverSection { margin-top: -10rem; } 
.personCoverSection__title { font-size: 1.75rem; }        
.personKnownForItem { width: 6.8rem; }   
.personKnownForSection > div:nth-child(2) > div:nth-child(1) > div:nth-child(2), 
.personKnownForSection > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) { top: 65px; }
.personPage .latestTrailerSection__video { width: 50%; min-height: 10rem; }  
.personRoleCharacter { width: 9rem; }
.personRoleCharacter .collagePoster, .personRoleCharacter .poster, .personRoleCharacter .posterRole { width: 9rem; height: 9rem; }   
.personPage .usualPartnerItem { width: 6.8rem; }    
.personPage section.page__section:nth-child(7) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2),
.personPage section.page__section:nth-child(7) > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) { top: 65px; }  
.personPage .bornTodaySection .crs__item { min-height: 5rem !important; }   
.personPage .bornTodaySection .posterInfoBox { width: 6.8rem !important; }   
.personPage .bornTodaySection .filmPoster__link { width: 6.8rem !important; height: 10rem !important; }    
.personPage .bornTodaySection > div:nth-child(2) > div:nth-child(1) { height: auto !important; }    
.personPage .bornTodaySection > div:nth-child(2) > div:nth-child(1) > div:nth-child(3),
.personPage .bornTodaySection > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) { top: 65px !important; }       
.personPage .personPhotosByYears__list { grid-template-columns: repeat(5,1fr); }  
.personPage figure.personPhotosByYears:nth-child(n+3):nth-last-child(n+4) { display: none; }     
.personPage .personPhotosByYears__year, .personPhotosByYears__title { line-height: .85rem; }   
.personPage .personFilmographySection__item:nth-child(n+6) { display: none; }  
.personPage .personFilmographySection .simplePoster__link { padding-bottom: 4rem; width: 3rem; }
.personPage .personFilmographySection .personRolePreview__role .efficientPoster, 
.personPage .personFilmographySection .personRolePreview__role { height: 4rem; width: 4rem; }
.personPage .personFilmographySection .posterRole.poster--auto { width: 4rem; }
.personPage .personFilmographySection .personRolePreview__film, 
.personPage .personFilmographySection .filmBasicInfo__poster { width: 3rem; height: 4rem; }
.personPage .personFilmographySection .personRolePreview__filmRating, 
.personPage .personFilmographySection .personRolePreview__year { max-height: 4rem; }
.personPage .personFilmographySection .personRolePreview__header { min-height: 1rem; }
.personPage .personFilmographySection .personRolePreview__originalTitle { display: none; }
.personPage .personFilmographySection .personRolePreview__card { height: 4rem; }   
.personPage .personFilmographySection .personRolePreview__characterPoster, 
.personPage .personFilmographySection .personRolePreview__awards { display: none; }       
.personPage .personFilmographySection .personRolePreview__roleText { display: block ruby; } 
.personPage .personFilmographySection .personRolePreview__roleText h4 { margin-right: 1.5rem; }  
.personPage .personFilmographySection .personRolePreview__character { margin-bottom: 0; display: contents; }      
.personPage .personFilmographySection .page__moreButton span { display: none; }  
.personCareerHistorySection .page__moreButton .fwBtn { padding: 2px; }  
.personPage .personFilmographySection .filmBasicInfo__details { margin-top: unset; }
.personPage .personFilmographySection .filmBasicInfo__card { padding: 0; }
.personPage .personFilmographySection .filmBasicInfo__badge { display: none; }  
.personTopRolesSection .crs--persons .crs__item, 
.personTopRolesSection .crs--persons .crs__item:last-child { width: 11rem; padding-right: 1rem; padding-bottom: 1rem; padding-left: 1rem; }
.personTopRolesSection .personRole__title { font-size: 0.9rem; }
.personPage .personRole__ratingCount { display: none; font-size: .75rem; }
.personPage .personRole__rating:hover .personRole__ratingCount { display: initial; }
.personPage .personFilmographySection__filmPreview .filmBasicInfo__year { top: 1.5rem; }
.personFilmographySection__filters .control--switchIcon, .personFilmographySection__filters .slumpdown, 
.personFilmographySection__filters .slumpdown .slumpdown__button--toggle { height: 1.75rem; }
.personFilmographySection__filters .slumpdown::after { top: 45%; }
.personFilmographySection__counterEpisodes { margin-top: -0.65rem; }
.personFilmographySection__counterEpisodes::after { top: .35rem; font-size: 1.25rem; }
.personFilmographySection__counterEpisodesList { top: -0.75rem; }
/* .personFilmographySection__titleCounter.personFilmographySection__afterPremiereCounter { padding-bottom: 0.75rem !important; } */
.roleInEpisodes__more { height: 1.75rem; margin-top: 0.1rem; }
.roleInEpisodes__list:not(.hasSeason) { padding-top: 0; }
.roleInEpisodes__seasonTitle { margin: .5rem 0; padding: 0rem .25rem; font-size: .6rem; line-height: 1.25; }
.roleInEpisodes__episode { margin-bottom: .25rem; }
.personPage .preview.previewCard .poster { width: 3rem; height: 4.3rem; }
.personPage .preview.previewCard.previewFilm .preview__originalTitle { display: none; }
:is(.preview, .previewHolder).variantBadge.isSpaced .preview__card { padding-top: 1rem; }
:is(.preview, .previewHolder).variantBadge.isSpaced .preview__card::before { top: -.05rem; line-height: 0.75rem; }
.personSubPageFilmography .preview.previewCard .poster { width: 3rem; height: 4.3rem; }
.personSubPageFilmography .preview.previewCard.previewFilm .preview__originalTitle { display: none; }
.personSubPageFilmography .personFilmographySection .personRolePreview__role .efficientPoster, 
.personSubPageFilmography .personFilmographySection .personRolePreview__role { height: 4rem; width: 4rem; }
.personSubPageFilmography .personFilmographySection .posterRole.poster--auto { width: 4rem; }
.personSubPageFilmography .personFilmographySection .personRolePreview__film, 
.personSubPageFilmography .personFilmographySection .filmBasicInfo__poster { width: 3rem; height: 4rem; }
.personFilmographySection .variantIndex .preview__index, .personFilmographySection .variantRatings .preview__ratingIndex { margin-left: 0; }
.personFilmographySection:not(.isMini) .preview__detail--roles h3 { font-size: .875rem; line-height: 1rem; margin-right: 0.75rem; }
.personFilmographySection:not(.isMini) .preview__detail--roles h3 img { width: 1.5rem; height: 1.5rem; margin-bottom: 4px; }
@media (min-width: 1152px) { .personCoverSection__buttons { top: 11rem; } }
.personFilmographySection__item {
.preview.isMini { --preview-card-poster-width: 2.5rem; } 
.preview.hasBadge, .preview.variantBadge { --variant-badge-position-left: 0rem; }
.preview.previewCard .preview__card { justify-content: space-between; }
.personRolePreview__role { min-width: 5.1rem; }
.preview.isMini.variantRatings .preview__ratingIndex, 
.preview.isMini.variantIndex .preview__index { padding-right: 0.75rem; }
.hasVod:hover .vodBadge.mini span { display: none; }
.hasVod:hover .vodBadge.mini { grid-template-columns: 0rem 1.375rem; }
:is(.preview, .previewHolder).variantBadge.isSpaced .preview__card { padding-top: 1rem; left: 0.5rem; }
.preview.previewCard .preview__title { margin: 0; line-height: 1rem; }
.preview.previewCard.previewFilm .preview__headerDetails { display: none; }
}
.personFilmographySection__crs .crs__item {
.preview.variantBadge { --variant-badge-position-left: 0rem; --variant-badge-top: 0.5rem; }
.preview.isMini { --preview-card-poster-width: 2.5rem; }
.preview__card { top: -1rem; left: 0.35rem; }
.preview__header { margin-top: 0.5rem; }
.preview__content { margin: 0 0; }
.preview__details { margin-top: -1.75rem; }
.preview.previewCard .preview__title { margin: 0; line-height: 1rem; }
}
.personFilmographySection .preview.previewCard .preview__detail a { line-height: 2rem; }
.personFilmographySection .preview.previewCard .preview__detail a img { margin-left: 0.35rem; }
.personFilmographySection .isInit.ribbon:is(.ribbon--episode, .ribbon--film).ribbon--small { width: 1.25rem; height: 1.64rem; }
.personFilmographySection .isInit.ribbon:is(.ribbon--episode, .ribbon--film).ribbon--small::after { top: 0rem; font-size: 1rem; }
.ribbonPanel__image[style="width: 48px; height: 68.8px;"] .isInit.ribbon:is(.ribbon--episode, .ribbon--film).ribbon--small { width: 1.25rem; height: 1.64rem; }
.ribbonPanel__image[style="width: 48px; height: 68.8px;"] .isInit.ribbon:is(.ribbon--episode, .ribbon--film).ribbon--small::after { top: 0rem; font-size: 1rem; }
.personFilmographySection, .ribbonPanel__image[style="width: 64px; height: 64px;"] {
    .isInit.ribbon.ribbon--role.ribbon--small { width: 1.25rem; height: 1.25rem; margin-top: .2rem; margin-left: .2rem; }
    .isInit.ribbon.ribbon--role.ribbon--small::after { font-size: 1rem; top: -0.2rem; }
}
.personFilmographySection .navList--secondOutline .navList__item:has(.navList__button) .navList__text { padding: .25rem .5rem; }
.personFilmographySection .navList--secondOutline .navList__item:has(.navList__button) { padding-top: 0.5rem; }
.personFilmographySection__filters .slumpdown { margin-top: 0.5rem; }

/* - galeria - */        
.gallerySection { padding-bottom: 0rem; margin-bottom: 0.5rem; }
.gallerySection .page__header { padding-bottom: 0.5rem; padding-top: 1rem; }
.gallerySection .gallery__photos-list__container { padding-bottom: 0.5rem; }
.gallerySection .gallery__photos-list.grid { grid-template-columns: repeat(4,1fr); }   
.gallerySection .gallery__photos-list.grid.grid-6 { grid-template-columns: repeat(6,1fr); }     
.gallerySection .gallery__photos-list.grid-6 .gallery__photo-item--0,
.gallerySection .gallery__photos-list.grid-6 .gallery__photo-item--1,
.gallerySection .gallery__photos-list.grid-6 .gallery__photo-item--2,
.gallerySection .gallery__photos-list.grid-6 .gallery__photo-item--3,
.gallerySection .gallery__photos-list.grid-6 .gallery__photo-item--4,
.gallerySection .gallery__photos-list.grid-6 .gallery__photo-item--5,
.gallerySection .gallery__photos-list.grid-6 .gallery__photo-item--6 { grid-area: unset; }    
.gallerySection .gallery__photos-list.grid-111, 
.gallerySection .gallery__photos-list.grid-1111 { grid-template-columns: repeat(5,1fr); }

/* - zwiastuny - */
.filmMainVideosSection--full .page__header { padding-bottom: 0.5rem; padding-top: 0.5rem; }
.filmMainVideosSection__container { padding: 0 0 1rem; }
.filmMainVideosSection .videoBlock.videoBlock--big { width: 50%; }     
.filmMainVideosSection--double .filmMainVideosSection__container .videoBlock { width: 100%; }      
.filmMainVideosSection--double .videoBlock.videoBlock--big { width: 100%; }  
.filmMainVideosSection--double .filmMainVideosSection__container, 
.videosSection__grid--2 { grid-template-columns: repeat(3,1fr); column-gap: 2rem; } 
.videosSection__grid--2 > :nth-child(2) { grid-column: 2/3; }    
html.noFilmReviewData.noPhotoGalleryData body:not(.userCantSeeFa) .filmMainVideosSection .videoBlock.videoBlock--big {
    width: 50%; height: auto; 
}    
.videosSection__grid { margin: 0 0 1rem; } 
.videosSection__grid--1:nth-child(1) > :nth-child(1), .videosSection__grid--1:nth-child(2) > :nth-child(1) { width: 50%; } 
@media (min-width: 768px) { 
    .videosSection__grid:not(.videosSection__grid--2) .videoItem[data-index="1"] { 
        width: 320px; height: 180px; 
        .videoItem__title {  font-size: 1rem; line-height: 1.5rem; }
        .videoItem__meta { bottom: .5rem; }
        .thumbnail__link::after { width: 3.5rem; height: 3.5rem; }
    } 
    .page__section--wide .videosSection__grid--3 { grid-template-columns: 20rem 2rem 20rem; }
    .page__section--wide .videosSection__grid--3 .videosSection__grid--wrapper { flex-direction: row; grid-column: 3/5; }
    .page__section--wide .videosSection__grid--wrapper .videoItem { width: 320px; }
    .videosSection__grid--3 { grid-template-columns: 20rem 2rem 20rem; grid-template-rows: auto; }
    .videosSection__grid--3 .videosSection__grid--wrapper { flex-direction: row; grid-column: 3/5; grid-row: 1/2; }
    .videosSection__grid--3 .videosSection__grid--wrapper .videoItem:nth-of-type(2) { margin-left: 2rem; }
    .worldPage .videosSection:has(.videosSection__grid--3) .page__moreButton { margin-left: 22rem; }
}
.ExpandableSection .expandingImagesCarousel { height: 400px; }
.ExpandableSection .expandingImagesCarousel .crs__item { width: 12.1rem; }
.ExpandableSection .expandingImagesCarousel .crs__item.wide { width: 32rem; }
.ExpandableSection .filmSnapshot__link, .filmSnapshot__link .filmSnapshot__image { height: 20rem; }
.ExpandableSection .expandableBox__info { height: 138%; }  

/* - odcinki - */
@media (min-width: 768px) and (orientation: portrait), (min-width: 768px) and (orientation: landscape) and (min-height: 461px), (min-width: 768px) and (orientation: landscape) and (min-width: 897px) {
    :is(.preview.previewEpisode, .previewHolder).isMedium {
        --preview-card-poster-width: 10.7rem;
        --preview-card-poster-height: 6rem; 
        height: 6rem; 
        margin-bottom: 0.75rem;
    }
.filmEpisodesListSection__list, .filmNewestSeasonsAndEpisodesSection, .filmEpisodesRankingSection__list  {
    .preview.previewCard .preview__title { font-size: 1rem; }
    .preview.previewCard .preview__ratings > div { padding-top: 0px; }
    .filmEpisodesListSection__list .communityRatings__rating::before { font-size: 1rem; }
    .preview__extraVote { margin: 0 0 2px 0; }
    .preview__extraVote button { line-height: 1.5rem; }
    .preview.previewCard.previewEpisode .preview__topic { margin: -0.25rem 0 0.75rem auto; }
    .preview.previewCard .posterEpisode.poster { height: 6rem; width: 10.7rem; }
}
}
@media (min-width: 1152px) { 
    .filmBestSeasonsAndEpisodesSection .crs--polaroids.lg-2 .crs__item { width: 33.3%; } 
    .filmBestSeasonsAndEpisodesSection .crs--polaroids .crs__item { padding: 0 1rem 0.5rem; }
    .filmBestSeasonsAndEpisodesSection .polaroid__title { font-size: 1rem; }
    .filmBestSeasonsAndEpisodesSection .polaroid__lead:not(:empty) { padding-top: 0rem; margin-top: 0.1rem; margin-bottom: .15rem; }
    .filmBestSeasonsAndEpisodesSection .polaroid__caption { padding: .5rem 0 .5rem; }
    .filmBestSeasonsAndEpisodesSection .crs { height: auto !important; }
}
@media (min-width: 768px) { .filmBestSeasonsAndEpisodesSection .polaroid__caption { padding-left: 0.25rem; padding-right: .25rem; } }
.filmBestSeasonsAndEpisodesSection .polaroid__title span:first-of-type { display: block; }
.preview.previewCard .preview__ratings > div { padding-top: 0rem; } 
/* mini odc */
@media (min-width: 768px) and (orientation: portrait), (min-width: 768px) and (orientation: landscape) and (min-height: 461px), (min-width: 768px) and (orientation: landscape) and (min-width: 897px) {
:is(.preview.previewEpisode, .previewHolder, .preview.previewSeason).isMedium {
    display: flex; 
    --preview-card-poster-width: 8rem;
    --preview-card-poster-height: 4.5rem; 
    height: 4.5rem; 
}
.preview.previewCard .posterEpisode.poster, 
.preview.previewCard .posterSeason.poster { height: 4.5rem !important; width: 8rem !important; }
.filmEpisodesListSection, .filmEpisodesRankingSection, .filmSeasonsRankingSection, .filmNewestSeasonsAndEpisodesSection { 
    .preview.previewCard .preview__card { flex-direction: row; align-self: center; padding: 1rem 1rem; min-width: 250px; }
}
.preview.previewCard .preview__ratings { align-items: center; }
.preview.previewCard.previewEpisode .preview__content, 
.preview.previewCard.previewSeason .preview__content { flex-direction: column; height: auto; gap: 0rem; }
.filmEpisodesRankingSection__item :is(.preview.previewEpisode, .previewHolder, .previewSeason).isMedium { margin-bottom: 0rem; }
.ribbonEpisode, .ribbonSeason { width: 1.5rem !important; height: 2rem !important; }
.ribbonEpisode::after, .ribbonSeason::after { top: 0.1rem !important; }
}
.ribbonPanel__image[style="width: 128px; height: 72px;"] .ribbonEpisode, 
.ribbonPanel__image[style="width: 202.417px; height: 113.85px;"] .ribbonSeason { width: 1.5rem !important; height: 2rem !important; }
.ribbonPanel__image[style="width: 128px; height: 72px;"] .ribbonEpisode::after, 
.ribbonPanel__image[style="width: 202.417px; height: 113.85px;"] .ribbonSeason::after { top: 0.1rem !important; }


/* - obsada - */
.filmCastSection { padding-bottom: 0rem; margin-bottom: 1rem; }
.filmCastSection .page__header { padding-bottom: 0.5em; padding-top: 0.5rem; }
.filmCastSection .crs { min-height: 295px; }
.filmCastSection--crs { overflow: hidden; }
.filmCastSection--crs .simplePoster { width: 7.4rem !important; }
.filmCastSection--crs .simplePoster__title { line-height: 1rem; }
.filmCastSection--crs .simplePoster__character { line-height: 1rem; margin-bottom: 0rem; font-size: .85rem; padding: 0 5px 0; } 
.filmCastSection .page__moreButton, .filmCastSection .page__pagination { padding: 0 !important; }   
.page__wrapper--grid [data-group="g4"].page__group .filmCastSection .simplePoster { width: 6.8rem !important; }

/* - ranking rol - */
.FilmTopRolesSection { padding-bottom: 0rem; margin-bottom: 0.5rem; }
.FilmTopRolesSection .page__header { padding-bottom: 0.5rem; padding-top: 0.5rem; }   
.FilmTopRolesSection .crs { min-height: 265px; }
.FilmTopRolesSection .crs--persons .crs__item, 
.FilmTopRolesSection .crs--persons .crs__item:last-child { width: 11rem; padding-right: 1rem; padding-bottom: 1rem; padding-left: 1rem; }    
.FilmTopRolesSection .personRole__person { margin-bottom: 0rem; font-size: 0.85rem; margin-top: -.5rem; line-height: 1rem; }     
.FilmTopRolesSection .personRole__role { margin-bottom: 0.25rem; line-height: 1rem; font-size: .8rem; padding: 0 5px 0; }
.FilmTopRolesSection .personRole__ratingCount { display: none; font-size: .75rem; }
.FilmTopRolesSection .personRole__rating:hover .personRole__ratingCount { display: flex; }
.FilmTopRolesSection .personRole__rating:hover .personRole__ratingRate, 
.FilmTopRolesSection .personRole__rating:hover .personRole__ratingIcon { display: none; }
.characterRankingSection .rankingElement__pip { top: 5.3rem; right: 0rem; }
.filmCharactersSection__character .filmCharactersSection__characterPoster { width: 6.25rem; height: 9rem; }
.rankingSection .simplePoster--tiny { top: 5rem; }

/* - powiazane - */
/*
.page__wrapper--grid .filmMainRelatedsSection .filmMainRelatedsSection__item { margin: 0px; padding: 0px; }
.filmMainRelatedsSection .page__header { padding-bottom: 0.5rem !important; padding-top: 0.5rem !important; }
.filmMainRelatedsSection { background-color: transparent; }    
.filmMainRelatedsSection .simplePoster__title { font-size: 0.75rem; line-height: 1.0; margin: 0.5rem 0 .25rem 0; }
.filmMainRelatedsSection .simplePoster__year { padding-bottom: .5rem; font-size: 0.75rem; line-height: 1.0; }  
.filmMainRelatedsSection .simplePoster:hover { box-shadow: 0 2px 6px 0 rgba(0,0,0,.08); }     
.page__wrapper--grid .filmMainRelatedsSection__wrapper { 
    grid-row-gap: 0rem; 
    grid-column-gap: 0.5rem; 
    grid-template-columns: repeat(4,minmax(0,1fr)); 
    padding-bottom: 0.5rem; 
} 
*/

/* - quiz - */
.filmTakePartSection { padding-bottom: 0rem; margin-bottom: 1rem; }
.filmTakePartSection .page__header { padding-bottom: 0.5rem; padding-top: 0.5rem; }
.filmTakePartSection .crs { height: 350px; }
.filmTakePartSection .crs--polaroids.lg-2 .crs__item { width: 33%; }    
.filmTakePartSection .polaroid__lead, .quizItem__lead { display: none; }  
.filmTakePartSection .polaroid__header { line-height: 1rem; margin-top: -0.5rem; }  
.filmTakePartSection .polaroid--horizontal { width: 82%; }
.quizSection .crs--hasNoNav { height: inherit; }
.quizSection .quizItem { width: 12.5rem; }  
.filmPage .polaroid--horizontal .labelBox--gold, 
.personPage .polaroid--horizontal .labelBox--gold { padding: 0; background-color: transparent; color: #ffcc00; left: 1rem; }   
.characterPage .polaroid--horizontal .labelBox--gold { padding: 0; background-color: transparent; color: #ffcc00; }
.filmTakePartSection .thumbnail--1x1, .quizSection .thumbnail--1x1 { padding-top: 60%; }    
.quizPage__quiz:nth-of-type(8n-7), .quizPage__quiz:nth-of-type(8n-6) { width: 33.33%; }

/* - baza - */
.rangeSlider__container, .starSlider__stars { padding-top: .5rem; }    
.rangeSlider__display, .rangeSlider__state--center, .rangeSlider__state--center span, .starSlider__state, .starSlider__state span { 
    font-size: 1.1rem; 
    line-height: 1rem; 
}    
.rankingPage .rankingVideosSection { display: none; }
    
/* - puste sekcje - */
.filmEmptySection { margin-top: 0rem; }
.forumSection.page__section--gray.filmEmptySection { margin-top: -0.5rem; }
.filmEmptySection .forumSection__addFirst { padding: 0.5rem 0rem 1rem; } 
    
/* - opis - */
.filmDescriptionSection { padding-bottom: 0rem; margin-bottom: 0.5rem; }
.filmDescriptionSection .page__header { padding-bottom: 0.5rem; padding-top: 0.5rem; }
.filmDescriptionSection .filmDescriptionSection__item { padding-bottom: 0.5rem; }

/* - info - */
.filmOtherInfoSection { padding-bottom: 0rem; margin-bottom: 1rem; line-height: 1.25rem; }
.filmOtherInfoSection .page__header { padding-bottom: 0.5rem; padding-top: 0.5rem; }

/* - ciekawostki - */
.filmMainCuriositiesSection { padding-bottom: 0rem; margin-bottom: 1rem; }
.filmMainCuriositiesSection .page__header { padding-bottom: 0.5rem; padding-top: 0.5rem; }
.filmMainCuriositiesSection__item { line-height: 1.25rem; }

/* - forum - */
.page[data-group="filmPage"] .forumSection { padding-bottom: 0rem; margin-bottom: 1rem;  }
.page[data-group="filmPage"] .forumSection .page__header { padding-bottom: 1.5rem; padding-top: 0.5rem; }

/* - contributors - */
.filmContributorsSection { padding-bottom: 0rem; margin-bottom: 1rem; }
.filmContributorsSection .page__header { padding-bottom: 0.5rem; padding-top: 0.5rem; }
.filmContributeSection__buttonsWrapper .fwBtn { padding: 5px; }

/* - recenzje uzytkownikow - */
.userReviewSection { padding-bottom: 0rem; margin-bottom: 1rem; }
.userReviewSection .page__header { padding-bottom: 0.5rem; padding-top: 0.5rem; }

/* - oceny krytykow - */
.filmCriticsVotesSection { padding-bottom: 0rem; margin-bottom: 1rem; }
.filmCriticsVotesSection .page__header { padding-bottom: 0.5rem; padding-top: 0.5rem; }
    
/* - programy fw - */
.filmMainVideosSection--productions .page__header { padding-top: 0.5rem; padding-bottom: 0.5rem; }
    
/* - opisy - */
.DescriptionSection .page__header { padding-top: 0.5rem; padding-bottom: 0.5rem; }
    
/* - ciekawostki - */
.curiositiesSection--main .page__header { padding-top: 0.5rem; padding-bottom: 0.5rem; } 

} /* compactEnd */

} /* domainEnd */


@-moz-document domain("filmweb.pl") {   
/* ------------------------------------------ */
/*              Dark Reader Plus              */
/*                 15.05.2025                 */
/* ------------------------------------------ */
    
#cmlPlaceholder { display: none; }  

if cmlTheme == reader {
:root {
    --darkreader-text-d0980e: #fc0 !important;
    --darkreader-text-976103: #fc0 !important;
    --darkreader-text-976103b8: #fe4 !important;
    --darkreader-text-e7a90f: #fc0 !important;
    --darkreader-border-ffc200: #fc0 !important;
/*  
    --darkreader-background-ffc200: #fc0 !important;
    --darkreader-background-ffd900: #fe4 !important;
*/
}

/* generic */
#colvar1 { color: #ebb83a; }
#colvar2 { color: #f1b92d; }
#colvar3 { color: #ffc81a; }
a.linkifyplus { color: #fc0; }
a.linkifyplus:hover { text-decoration: underline; color: #da0; }
/* a:hover { color: #fc0; } */
.text-link { color: #fc0; }
.s-16:hover { color: #fc0 !important; }
.mouse .text-link:hover { color: #ddd; }
.navList--slender .navList__item .navList__text { color: #aaa; background: #222; }
.navList--slender .navList__item--selected .navList__text { background-color: #fc0; color: #000; box-shadow: none; }
.navList--secondary .navList__item--selected .navList__button .navList__text { background-color: #fc0; color: #000; }
.mouse .navList--slender .navList__item--selected .navList__button:hover .navList__text { background-color: #fc0; color: #000; box-shadow: none; }
.mouse .navList--slender .navList__button:hover .navList__text { background-color: #333; color: #ddd; box-shadow: none; }
.fwBtn__gold, .fwBtn--gold { background-color: #fc0; border-color: #fc0; color: #000; }
.fwBtn__gold:hover, .fwBtn__gold:focus, .fwBtn--gold:hover, .fwBtn--gold:focus { background-color: #fc0; border-color: #fc0; color: #000; }
.fwBtn__default, .fwBtn--default { background-color: #111; border-color: #111; color: #ccc; }
.fwBtn__default:hover, .fwBtn__default:focus, .fwBtn--default:hover, .fwBtn--default:focus { color: #ccc; background: #222; border-color: #222; }
.fwBtn__black, .fwBtn--black { background-color: #000; border-color: #000; }
.fwBtn__black:hover, .fwBtn__black:focus, .fwBtn--black:hover, .fwBtn--black:focus { background-color: #222; border-color: #222; }
.slumpdownSearch .slumpdown__input:valid, .slumpdown--long { background-color: #111; border: none; }
.slumpdown__item:not(.slumpdown__item--active):hover { color: #fff; cursor: pointer; background-color: #222; }
.slumpdown--long .slumpdown__list { background-color: #111; }
button[type="quaternary"] { background: #333; border-color: #333; box-shadow:none; }
button[type="quaternary"]:hover { background-color: #111; }
.nextArrow, .page__moreButton .next { background-color: #fc0; color: #000; }
.nextArrow svg path { fill: #000 !important; }
.page__moreButton .next svg path { stroke: #000 !important; }
.crs__prev, .crs__next, .next:not(span), .prev:not(span) { background-color: #fc0 !important; color: #000 !important; }
.crs__prev:hover, .crs__next:hover, .prev:hover, .next:hover { background-color: #fe4 !important; }
.crs__showAllButton .ico { background-color: #fc0; }
.crs__showAllButton:hover .ico { background-color: #fe4; }
.crs__showAllButton .ico--goUp::before { color: #000; }
.lightBox__nav .ico { background-color: #333; color: #fff; }
html.mouse .lightBox__nav .ico:hover { background-color: #fc0; color: #000; }
.poster { background-color: #3a3c3c; }
.pagination__item:not(.pagination__item--is-active) .pagination__link { background-color: #222; border-color: transparent; } 
.pagination__item:not(.pagination__item--is-active):hover .pagination__link { background-color: #333; border-color: transparent; } 
.pagination__item--is-active .pagination__link { border-color: transparent; background-color: #111; color: #fc0; }
.pagination__item--is-active:hover .pagination__link { border-color: transparent !important; background-color: #111 !important; color: #fc0 !important; }
.pagination__item--next .pagination__link, .pagination__item--prev .pagination__link { background-color: #222; border-color: #222; }
.forumTopic .pagination__link, .forumTopic .pagination__dots { border-color: transparent; }
.forumTopic .pagination__item--is-active .pagination__link { background-color: #fc0; color: #000; border-color: #fc0; }
.forumTopic .pagination__item--is-active:hover .pagination__link { background-color: #fc0 !important; color: #000 !important; border-color: #fc0 !important; }
.forumTopic__topicText > a {color: #fc0; }
#mainPageHeader.header #searchForm .form__input:hover { box-shadow: #fc0; }
input[placeholder="Szukaj"]:focus { border-color: #fc0; }

/* footer */
.mouse .siteFooterSection__footer a:hover, .no-touch .siteFooterSection__footer a:hover, 
.siteFooterSection__copyLinks li, .siteFooterSection__copyLinks a:hover, 
.mouse .siteFooterSection__copyLinks a:hover, 
.no-touch .siteFooterSection__copyLinks a:hover, 
.mouse .siteFooterSection__sitemap .sitemap__links a:hover, 
.no-touch .siteFooterSection__sitemap .sitemap__links a:hover, 
.mouse .siteFooterSection__sitemap .sitemap__socialLogos a:hover .ico, 
.no-touch .siteFooterSection__sitemap .sitemap__socialLogos a:hover .ico { color: #fc0; }
.siteFooterSection__copyLinks li:not(:hover) { color: #d1cdc7; }

/* settings */    
.editForm__inputText, .dateInput__input { background-color: #111; }
form[data-formid="settingsSexForm"] .control__label { background: #111; }
.control--switchIcon .control__label:not(:hover) { background-color: #282828; }
.control--switchIcon .control__label:hover { background-color: #333; }
.control--switchIcon input:checked + .control__label { background-color: #111; }
.control--switchIcon input:checked + .control__label .ico, .control--switchIcon input:checked + .control__label .control__text { color: #fc0; }
.control--switchIcon input + .control__label .ico, .control--switchIcon input + .control__label .control__text { color: #ccc; }
.control__indicator { background-color: #111; border-color: #111; }
.mouse .control:hover input:not([disabled]) ~ .control__indicator { border-color: #fc0; }
.mouse .control--radio:hover input:not([disabled]):not(:checked) ~ .control__indicator::after, 
.mouse .control--radio:hover input:not([disabled]):not(:checked) ~ .control__indicator::before, 
.control--radio input:checked:not([disabled]) ~ .control__indicator::after { background: #fc0; }
.control input:checked ~ .control__indicator, 
.control.control--is-selected .control__indicator, 
.control.control--not-all-check .control__indicator, 
.mouse .control.control--not-all-check:hover input:not([disabled]):not(:checked) ~ .control__indicator, 
.mouse .control:hover input:not([disabled]):checked ~ .control__indicator { 
    background-color: #fc0; border-color: #fc0; 
}
.control--checkbox input .control__indicator::after, 
.control--checkbox .control__indicator::after, 
.control--link .control__indicator::after { border-color: #111; }
.mouse .control--ico:hover input:not([disabled]):not(:checked) ~ .control__indicator::before { color: #111; }
.mouse .control--checkbox:hover input:not([disabled]):not(:checked) ~ .control__indicator::after { border-color: #fc0; }
.flexTable__header { color: #ccc; }
.flexTable .topic__removeLink:hover .ico, .flexTable .blog__removeLink:hover .ico { color: #f44; }
.section--userSettingsSubscription .subscriptionTypes__tile { background-color: #333; border-color: #333; }
html.mouse .section--userSettingsSubscription .subscriptionTypes__tile:hover { background-color: #3d2f00; border-color: #3d2f00; }
.settingsCinemasSection .noResultsInfo--alabaster { background-color: #111; }
.settingsCinemasSection .noResultsInfo__container { color: #aaa; }
img[alt="poznaj-filmweb"] { filter: invert(85%) hue-rotate(180deg); }

/* tv white bg */
div[class*="channel"], span[class*="channel"], div[data-channel-header-id] {
img[alt*="TVN"], img[alt*="TVN Siedem"], img[alt*="Film Cafe"], img[alt*="AMC"], img[alt*="Discovery LIFE"], img[alt*="Polsat Comedy Central Extra"], img[alt*="TVC"], img[alt*="Sky Select"], img[alt*="Telewizja Pomerania"], img[alt*="TVT"], img[alt*="Twoja Telewizja Morska"], img[alt*="Bollywood"], img[alt*="MGM (DE)"], img[alt*="Tele 5 (DE)"], img[alt*="Polsat Sport Fight"], img[alt*="Polsat Sport Premium 1"], img[alt*="Polsat Sport Premium 2"], img[alt*="Polsat Rodzina"], img[alt*="TVP Nauka"], img[alt*="TVP Kultura 2"], img[alt*="Red Top TV"], img[alt*="wPolsce.pl"], img[alt*="Canal+ Sport 3 HD"], img[alt*="Canal+ Sport 4 HD"], img[alt*="Canal+ Dokument"], img[alt*="Canal+ Now HD"], img[alt*="Eska Tv Ekstra"], img[alt*="Eska Rock TV"], img[alt*="iTVN"], img[alt*="MCM Pop"], img[alt*="RMF Classic"], img[alt*="RMF FM"], img[alt*="RMF Max"], img[alt*="TBN Polska"], img[alt*="TVP Kobieta"], img[alt*="TVP Dokument"], img[alt*="Golf Channel"], img[alt*="Polsat Games"], img[alt*="Biznes24 HD"], img[alt*="Antena HD"], img[alt*="Alfa TVP"], img[alt*="Polsat News Polityka"], img[alt*="Kabaret TV"], img[alt*="CTV9"], img[alt*="24 Horas"], img[alt*="E-Sport HD"], img[alt*="TV Regio"], img[alt*="XTREME TV HD"], img[alt*="TVP Wilno"], img[alt*="NASA TV HD"], img[alt*="Novelas+1"], img[alt*="Sky Sport 2"], img[alt*="Nitro"], img[alt*="Novelas+ HD"], img[alt*="Nautical Channel"] {  
    filter: invert(90%) hue-rotate(180deg) saturate(150%); 
}
}
.promotedChannels {
    img[alt="TVN"], img[alt="TVN Siedem"], img[alt="Film Cafe"] {  filter: invert(90%) hue-rotate(180deg) saturate(0%); }
}
.promotedChannels a:hover {
    img[alt="TVN"], img[alt="TVN Siedem"], img[alt="Film Cafe"] {  filter: invert(90%) hue-rotate(180deg) saturate(150%); }
}

/* tv black logo */
/*div[class*="channel"],*/ span[class*="channel"], .filmWhereToWatchSection > *, div[data-channel-header-id] {
img[alt*="HBO"], img[alt*="Eurosport 1"], img[alt*="MTV Polska"], img[alt*="VIVA Polska"], img[alt*="National Geographic"], img[alt*="Cartoon Network"], img[alt*="HBO2"], img[alt*="Cinemax"], img[alt*="Warner TV"], img[alt*="Comedy Central"], img[alt*="HBO 3"], img[alt*="Cinemax 2"], img[alt*="TVP Kultura"], img[alt*="TVN Turbo"], img[alt*="13 Ulica"], img[alt*="Discovery Historia"], img[alt*="Eurosport 2"], img[alt*="MTV Rocks"], img[alt*="Cartoonito"], img[alt*="Sundance Channel"], img[alt*="CI Polsat"], img[alt*="Investigation Discovery"], img[alt*="Kino TV"], img[alt*="Disney Junior"], img[alt*="BBC Lifestyle"], img[alt*="BBC First"], img[alt*="13th Street"], img[alt*="360TuneBox"], img[alt*="Bloomberg"], img[alt*="C Music TV"], img[alt*="Deutsches Musik Fernsehen"], img[alt*="E! Entertainment"], img[alt*="EWTN"], img[alt*="MTV Germany"], img[alt*="MTV Hits"], img[alt*="Motorvision"], img[alt*="Romance TV"], img[alt*="Spice"], img[alt*="TV Relax"], img[alt*="TVN Fabuła"], img[alt*="VH1 Classic European"], img[alt*="VIVA"], img[alt*="VOX"], img[alt*="Zest TV"], img[alt*="ZOOM TV"], img[alt*="Dorcel TV"], img[alt*="Red Carpet TV"], img[alt*="Sport 1 - PL"], img[alt*="MTV Base"], img[alt*="MTV Dance"], img[alt*="MTV Europe"], img[alt*="MTV Live"], img[alt*="Nat Geo People"], img[alt*="Discovery"] { 
    filter: invert(80%) hue-rotate(180deg) saturate(150%); 
}
}
.promotedChannels {
img[alt="HBO"], img[alt="HBO2"], img[alt="Warner TV"], img[alt="Comedy Central"], img[alt="HBO 3"], img[alt="Cinemax 2"], 
img[alt="13 Ulica"], img[alt="TVP Kultura"], img[alt="Kino TV"] {  
    filter: invert(80%) hue-rotate(180deg) saturate(0%); 
}
}
.promotedChannels a:hover {
img[alt="HBO"], img[alt="HBO2"], img[alt="Warner TV"], img[alt="Comedy Central"], img[alt="HBO 3"], img[alt="Cinemax 2"], 
img[alt="13 Ulica"], img[alt="TVP Kultura"], img[alt="Kino TV"] { 
    filter: invert(80%) hue-rotate(180deg) saturate(150%); 
}
}

/* <tvmt> */
.channelSearchWrap, .search-box, .input-text { background: #222; color: #ccc; border-color: #666; box-shadow: none !important; }
.channelSearchWrap:focus, .search-box:focus, .input-text:focus { background: #282828; color: #ddd; border-color: #ffcc00; }
.alert { background: #333; color: #ccc; border-color: #333; text-shadow: none !important; }
.guide-carousel { color: #aaa !important; }
.link-btn { color: #aaa !important; border: none !important; }
.link-btn:hover { background: #222 !important; color: #aaa !important; }
#platformSelect .dropdown-toggle { color: #ddd; background: #222; border-color: #666; }
#platformSelect .dropdown-toggle:hover { background: #333 !important; border-color: #ffcc00; }
#dayDropdown .dropdown-toggle { color: #ffcc00 !important; box-shadow: none !important; background-color: transparent !important; }
#dayDropdown .dropdown-toggle:hover { border-bottom-color: #ffcc00 !important; }
#channelTypeFilters { background: #222; color: #ccc; border-color: #666; }
.channel-types-box:not(.active) .channel-type-label:hover, #channelTypeFilters .dropdown-toggle:hover { background: #333 !important; }
.channel-types-box { background-color: transparent; } 
#channelTypeFilters .dropdown-body { border: 1px solid #666; }
#channelTypeFilters .dropdown-body:hover { border-color: #ffcc00; background-color: #333; }
#tvGuideHeaderLine h1 { color: #ccc; }
.nav-bar > li a, .nav-bar > li span { color: #ccc; }
.nav-bar > li.active a, .nav-bar > li.off.active a, .nav-bar > li.active span, .nav-bar > li.off.active span { color: #000; }
#timeSwitcher, #wtsSwitcher, #favSwitcher { background: #222; color: #aaa; border-color: #666; }
.tvGuide #typeSwitcher { color: #aaa; border-color: #666; background-color: #222; }
.person .mainColWrapper #typeSwitcher li { border: none; }
.person .mainColWrapper .sbtn-switcher > li > button:hover { border-color: #ffcc00; }
.person .mainColWrapper #typeSwitcher .on:hover, 
.person .mainColWrapper #activitySwitcher .on:hover { cursor: default; }
.tvGuide #timeSwitcher li, .tvGuide #wtsSwitcher li, .tvGuide #favSwitcher li, 
.tvGuide #typeSwitcher li { border: 1px solid #666; }
.tvGuide #timeSwitcher li:hover, .tvGuide #wtsSwitcher li:hover, .tvGuide #favSwitcher li:hover, 
.tvGuide #typeSwitcher li:hover { border: 1px solid #ffcc00; }
.tvGuide #timeSwitcher li.active, .tvGuide #wtsSwitcher li.active, .tvGuide #favSwitcher li.active, 
.tvGuide #typeSwitcher li.active { border: 1px solid #ffcc00; }
.tvGuide #wtsSwitcher li.active:hover, .tvGuide #favSwitcher li.active:hover, 
.tvGuide #typeSwitcher li.active:hover { border: 1px solid #ccc; background-color: #ccc;  }
#timeSwitcher li.active:hover { cursor: default !important; border: 1px solid #ffcc00; background-color: #ffcc00 !important; }
.seance a, #seanceReflector a { color: #ffcc00 !important; }
.tvGuideGrid, .show-evening { background-color: #181818 !important; color: #ddd !important; }
.tvGrids { border-bottom: #ddd 1px solid; }
.tvGrids .element.off .channel { background-color: #111 !important; }
.pkc, .pkc-wrapper { border-color: #ddd; }
.seance { background: #222; color: #ddd; border-color: #444; }
.seance:hover { padding: 10px 10px 10px 5px; border-top: none; border-left: none; border-right: none; border-color: #444; }
.seance:hover { background-color: #181818 !important; border-top-color: transparent !important; }    
.seance.current { background: #111 !important; }
#seanceReflector { background: #111 !important; color: #bbb !important; border: #333 1px solid; }
.seanceAttributes, .seanceDuration { color: #aaa !important; }
.seance .st, .seance .sh { color: #aaa !important; }
.tvGrids .buttons { background: #555 !important; color: #ccc !important; border-color: #666; }
.tvGrids .buttons:hover { background: #aaa !important; color: #333 !important; border-color: #666; }
#tvGuideExclaimer { color: #fff !important; }
.percentBar { background: #ffcc00 !important; }
.channel-types-box.active .channel-type-label { color: #000 !important; }
.channel-types-box.active #channelTypeFilters .dropdown-toggle:not([disabled]) { color: #000 !important; }
.channelInfo .btnFav:hover { color: #ffcc00 !important; text-decoration: none !important; }
.nodata-info { background-color: #222 !important; }
#timeSwitcher li.active, #wtsSwitcher li.active, #favSwitcher li.active, #typeSwitcher li.active { background-color: #ffcc00 !important; }
.channel-types-box.off .channel-type-label, #channelTypeFilters.off .dropdown-toggle, 
#platformSelect.off .dropdown-toggle { background-color: #111; }
.tvGrids .pkc .pkc-wrapper { background: repeat url("https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjqNtAFZwdBf9LXfgdPThg5AHVsE8QcCCApEytQ3qKab6LF-hsqqvpWQlxWSHlcPab-m1wOUd-hsLpvTwkFOT29Z6YBKvB8YWosmRV1xBW7YVyw8FVW7vJev4Dy22WG4ntfMvp9ScOWebafKruudqnq6LC2-06ednbmxlgJcYU5T8yajtu8Sk_zBYcuuw/s200/upNborder.png") 0 0; }
.dayInfo { background-color: #333; }
.tvGrids .element .channel .dayInfo { background-color: #444; }   
.dayInfo:hover { color: #ddd; }
.dayInfo.s-16 { background-color: #333 !important; }
.guideGrid, .tvGrids { border-color: #444; background-color: #444; }
#timeTypeSwitcher .icon-small-expandArr { filter: invert(100%); }   
.playNowCampaign #dayDropdown label { color: #bc8bff; }   
.playNowCampaign .nav-bar > li.active a, .playNowCampaign .nav-bar > li.active span { color: black; }    
.playNowCampaign body { background: #111 !important; }   
.s-16:hover { color: #ccc; }    
.rTvChannel_53 { filter: invert(91%); }
.rTvChannel_53:hover { filter: invert(91%) hue-rotate(185deg); }  
.hits .hits__item { background-color: #222; }    
.seance.has-reflector:not(:hover) { background-color: #181818; }  
#dayDropdown .dropdown-toggle { border-style: dashed; }   
.posterInfoBox__channel img[src="https://fwcdn.pl/chan/53.1.png"], .posterInfoBox__channel img[src="https://fwcdn.pl/chan/49.1.png"] { filter: invert(73%) hue-rotate(180deg); }    
.single .channel.on .channelInfo { border-color: #666; } 
.single .channel.on .channelInfo:not(:hover) { background-color: #444 !important; }    
.nav-bar > li.active a, .nav-bar > li.off.active a, .nav-bar > li.active span, .nav-bar > li.off.active span { color: #000 !important; } 
.toggleFullTextWrap .ico--arrowDown::before { color: #aaa !important; }    
img[src="https://fwcdn.pl/chan/408.0.png"] { filter: invert(85%) hue-rotate(180deg); }
.channel-types-box.active #channelTypeFilters .dropdown-toggle:not(:hover) .icon-small-expandArr { filter: none !important; }
.seance .scheck .scheck-button { background: #111; padding: 0 10px 0 5px; }
.seance .scheck .scheck-button::after { padding-left: 1px; }
/* </tvmt> */
#dayDropdown .dropdown-toggle { color: #fc0; border-bottom-color: #fc0; }
.tvGuide .dropdown-menu { background-color: #111; border: none; }
.tvGuide .dropdown-menu button { background-color: #111; border: none; }
.tvGuide .dropdown-menu button:hover { background-color: #333; color: #fc0; border: none; }
.nav-bar li.active, .nav-bar li.active:hover { background-color: #fc0; border-color: #fc0; }
.nav-bar > li.active a, .nav-bar > li.off.active a, .nav-bar > li.active span, .nav-bar > li.off.active span { color: #000; }
#timeSwitcher li.active:hover, .tvGuide .nav-bar li:hover:not(.off), .dropdown-parent:not(.off) .dropdown-body:hover, 
#platformSelect .dropdown-toggle:hover, #platformSelect .dropdown-toggle.sbtn:hover { border-color: #fc0; }
.icon-small-expandArr { filter: invert(100%); }
.channel-types-box.active .channel-type-label { background-color: #fc0; }
.channel-types-box.active #channelTypeFilters .dropdown-toggle:not([disabled]) { background-color: #fc0; border-color: #fc0; }
.channelInfo:hover { border-color: #fc0; }
.tvGuide #timeSwitcher li, .tvGuide #wtsSwitcher li, .tvGuide #favSwitcher li, .tvGuide #typeSwitcher li, #channelTypeFilters .dropdown-body, #platformSelect .dropdown-toggle, .channelSearchWrap, .search-box, .input-text { border-color: #222; }
.tvGuide #timeSwitcher li:hover, .tvGuide #wtsSwitcher li:hover, .tvGuide #favSwitcher li:hover, .tvGuide #typeSwitcher li:hover { background-color: #333; border-color: #333; }
#timeSwitcher li.active:hover, .tvGuide .nav-bar li:hover:not(.off), .dropdown-parent:not(.off) .dropdown-body:hover, 
#platformSelect .dropdown-toggle:hover, #platformSelect .dropdown-toggle.sbtn:hover { border-color: #333 !important; }
#tvGuideExclaimer { opacity: .5; color: #aaa; }
.tvProgramSection .ico--arrowRight:not([width="1.5000rem"]), 
.tvProgramSection .ico--arrowLeft:not([width="1.5000rem"]) { color: #000; }

/* ribbons */
.isInit.ribbon[data-state="unchecked"]::after { color: #000; }
.isInit.ribbon.ribbon--role[data-state="unchecked"]::after { background-color: #fc0; color: #000; }
.isInit.ribbon.ribbon--role:not([data-state]) .ico, .isInit.ribbon.ribbon--role[data-state="unseen"] .ico, .isInit.ribbon.ribbon--role[data-state="unchecked"] .ico { color: #000; }
.isInit.ribbon.ribbon--role:not([data-state]), .isInit.ribbon.ribbon--role[data-state="unseen"], .isInit.ribbon.ribbon--role[data-state="unchecked"] { background-color: rgb(255, 204, 0); }
.ribbonParent .wantsToSee .ribbonBg { color: #6f6 !important; }
.ribbonParent .seenNoRate .ribbonLbl, .ribbonParent .seenWithRate .ribbonLbl { filter: none !important; }
.isInit.ribbon[data-state="rated"]::before, 
.isInit.ribbon[data-state="faved"]::before, 
.isInit.ribbon[data-state="checked"]::before, 
.isInit.ribbon[data-state="seen"]::before { filter: invert(100%); }
.isInit.ribbon[data-state="1"]::after, 
.isInit.ribbon[data-state="2"]::after, 
.isInit.ribbon[data-state="3"]::after, 
.isInit.ribbon[data-state="4"]::after, 
.isInit.ribbon[data-state="5"]::after, 
.isInit.ribbon[data-state="6"]::after, 
.isInit.ribbon[data-state="7"]::after, 
.isInit.ribbon[data-state="8"]::after, 
.isInit.ribbon[data-state="9"]::after, 
.isInit.ribbon[data-state="10"]::after { filter: none !important; }
.isInit.ribbon[data-state="1"]:not(.ribbonRole)::before,
.isInit.ribbon[data-state="2"]:not(.ribbonRole)::before,
.isInit.ribbon[data-state="3"]:not(.ribbonRole)::before,
.isInit.ribbon[data-state="4"]:not(.ribbonRole)::before,
.isInit.ribbon[data-state="5"]:not(.ribbonRole)::before,
.isInit.ribbon[data-state="6"]:not(.ribbonRole)::before,
.isInit.ribbon[data-state="7"]:not(.ribbonRole)::before,
.isInit.ribbon[data-state="8"]:not(.ribbonRole)::before,
.isInit.ribbon[data-state="9"]:not(.ribbonRole)::before,
.isInit.ribbon[data-state="10"]:not(.ribbonRole)::before { 
background-image: url("data:image/svg+xml,%3csvg%20width='32'%20height='40'%20viewBox='0%200%2032%2040'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M28%200H4C1.79086%200%200%201.79086%200%204V39L16%2031L32%2039V4C32%201.79086%2030.2091%200%2028%200Z'%20fill='black'/%3e%3cpath%20d='M4%200.5H28C29.933%200.5%2031.5%202.067%2031.5%204V38.1904L16.2236%2030.5527L16%2030.4414L15.7764%2030.5527L0.5%2038.1904V4C0.5%202.067%202.067%200.5%204%200.5Z'%20stroke='%23888888'%20stroke-opacity='0.32'/%3e%3c/svg%3e") !important;
}
.isInit.ribbon.ribbonFilm[data-state="unchecked"]::before { 
background-image: url("data:image/svg+xml,%3csvg%20width='32'%20height='41'%20viewBox='0%200%2032%2041'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20opacity='0.32'%20d='M28%201H4C1.79086%201%200%202.79086%200%205V41L16%2032.7949L32%2041V5C32%202.79086%2030.2091%201%2028%201Z'%20fill='black'/%3e%3cpath%20d='M28%200H4C1.79086%200%200%201.79086%200%204V40L16%2031.7949L32%2040V4C32%201.79086%2030.2091%200%2028%200Z'%20fill='%23FFC200'/%3e%3c/svg%3e") !important; 
}

/* profil */
.eventsPage #app > section > div[type="noMobilePadding"] > div > ul > li > a::after, 
.navList--primary .navList__container > .navList__item::after, 
.navList--primary .navList__more > .navList__item::after, 
.navList--tertiary .navList__container > .navList__item::after, 
.navList--tertiary .navList__more > .navList__item::after { background-color: #fc0; }
.notificationsContainer b, .notificationsContainer strong { color: #fc0; }
.recommendationsPage, .userProfilePage, .eventsPage {
    button[data-state="on"] { color: #000; background-color: #fc0; }
    #checkboxWTS[data-state="checked"] { background-color: #fc0; border-color: #fc0; }
    #checkboxWTS[data-state="checked"] i { color: #000; }
    #checkboxWTS:not([data-state="checked"]):hover { border-color: #fc0; }
    label[for="checkboxWTS"] { color: #ccc; }
    div[dir="ltr"][data-orientation="horizontal"][type="default"] { border-color: #666; }
    div[role="tablist"] button[data-state="active"]::after { background-color: #fc0; }
    div[role="tablist"] button:not([data-state="active"]):hover { color: #fff; }
    .slide .hasDropdown { background: #181a1b; }
}
.animatedIcon .thumbUpStart { fill: #ccc !important; }
.animatedIcon:hover .thumbUpStart { fill: #fc0 !important; }
.userProfilePage {
    div[type="noMobilePadding"] ul li a[data-counter][href*="#/wantToSee/"] { color: #ccc; }
    div[type="noMobilePadding"] ul li a[data-counter][href*="#/wantToSee/"]:hover { color: #fc0; }
    div[type="noMobilePadding"] > div:nth-of-type(1):not(:has(#votes)):not(:has(a)) { color: #aaa; background-color: #222; border-color: #222; }
    div[type="noMobilePadding"] > div:not([data-type="sidebar"]):not(:has(#votes)):not(:has(a)) > div:nth-of-type(1) { color: #aaa; background-color: #333; border-color: #333; }
    div[type="noMobilePadding"] > div:not([data-type="sidebar"]):not(:has(#votes)):not(:has(a)) > div:nth-of-type(1):hover { color: #fc0; background-color: #444; border-color: #444; }
    .voteViewSwitch { border-color: #181a1b; }
    .voteViewSwitch button[data-state="off"] { background-color: #333; }
    .voteViewSwitch button[data-state="off"]:hover { background-color: #111; }
    #app div[type="noMobilePadding"] > div > ul li a.active { background-color: #fc0; color: #000; }
    #app div[type="noMobilePadding"] > div > ul li a:not(.active) { background-color: #333; color: #ccc; }
    #app div[type="noMobilePadding"] > div > ul li a:not(.active):hover { background-color: #111; color: #ccc; }
    div[type="noDesktopPadding"] > div > div > div > div > div > div:nth-of-type(2) > div:nth-of-type(2) > div > div > span { color: #000; }
    div[type="noDesktopPadding"] > div > div > div > div > div > div:nth-of-type(2) > div:nth-of-type(2) > div > span { color: #aaa; }
    .contribsChartStats .stats { background-color: #333; border-color: #333; }
    .noContribsLabel { background-color: #111; }
    .contribBox__author .contribBox__value { color: #fc0; }
    #app div[type="noMobilePadding"] ul li a.active::after { background-color: #fc0; }
}
button[type="borderShadow"], button.vodPicker, .vodButton { background-color: #333; border-color: #333; }
button[type="borderShadow"]:hover, button.vodPicker:hover, .vodButton:hover { background-color: #555; border-color: #555; }
div[role="option"][data-radix-collection-item][data-state="unchecked"]::after { border-color: #ccc; }
div[role="option"][data-radix-collection-item][data-state="unchecked"]:hover::after { border-color: #fc0; }
div[role="option"][data-radix-collection-item][data-state="checked"]::after { border-color: #fc0; background-color: #fc0; box-shadow: #111 0px 0px 0px 0.188rem, #fc0 0px 0px 0px 0.25rem; }
button[type="selectable"][value="false"] { background-color: #282828; border-color: #282828; }
button[type="selectable"][value="false"]:hover { background-color: #444; border-color: #444; }
button.a-dmBp { background-color: #fc0; border-color: #fc0; color: #000; }
button[type="primary"], button[type="primary"]:hover { background-color: #fc0; border-color: #fc0; color: #000; }
button[type="regular"][value="false"] { background-color: #333; border-color: #333; color: #ccc; }
button[type="regular"][value="false"]:hover { background-color: #111; border-color: #111; color: #ccc; }
.ribbonParent .wantsToSee .ribbonBg { color: #008000; }
.ribbonParent .ribbonBg { color: #888; }
.ribbonParent .seenNoRate .ribbonLbl, .ribbonParent .seenWithRate .ribbonLbl { color: #000; }
.userProfilePage #app:has(section[type="coverMainPerson"]) > div:nth-of-type(1) > div { background-color: #111213; }
.userProfilePage div[type="noMobilePadding"]:has(a[href="#/"]) li a::after { background-color: #fc0; }
.userProfilePage #app > div[type="noMobilePadding"] > div:has(ul) { background-color: #222; }
.userProfilePage #app > div[type="noMobilePadding"] > div:has(ul) > div:has(.ico--filterFunnel) { background-color: #333; border: none; }
.userProfilePage #app > div[type="noMobilePadding"] > div:has(ul) > div:has(.ico--filterFunnel):hover { background-color: #111; }
.userProfilePage section:has(h2[type="latoPrimary"]):has(h3[type="latoSecondary"])::before { background: none; }

/* stats */
.userProfilePage section:has(.slide):not(#actors) {
    .slide { background-color: #222; }
    .slide:hover { background-color: #333; }
    .slide > div > div { border-color: transparent; }
    button:has(.ico)::after { background-color: #fc0; }
    button:has(.ico) .ico { color: #000; }
}
.userProfilePage #votes, .userProfilePage #genres {
    div[type="column"][style][aria-label], div[type="bar"][style][aria-label] { background-color: #fc0; }
    div[type="column"][style][aria-label]:hover, div[type="bar"][style][aria-label]:hover { background-color: #970; }
    button { background-color: #222; border-color: transparent; }
    button:hover { background-color: #333; }
    div:has(>button > div > span > .ico--filterFunnel) > button:nth-of-type(1) { color: #fc0;  }
    button:has(> div > span > .ico--filterFunnel) .ico--filterFunnel { color: #ccc !important; }
}
.userProfilePage .progressInEvaluatingRanking { background-color: #222; border-color: transparent; }
.userProfilePage .progressInEvaluatingRanking:hover { background-color: #333; }
.userProfilePage #actors .slide > div > div[type="vertical"] > div:nth-of-type(1) { background-color: #fc0; color: #000; }

/* quiz */
.progressBar--partial .progressBar__partial.active i { background-color: #fc0; }
.quizQuestionsSection__type { color: #fc0; }

/* survey */
.surveyResultsBox--photo .surveyResultsBoxItem .surveyResultsBoxItem__label { background-color: #fc0; color: #000; }
.surveyResultsBoxItem__barValue { background-color: #fc0; }
.surveyHeaderSection__details::after { background-color: #fc0; box-shadow: none; }

/* ranking */
.progressInEvaluatingThings__circle { stroke: #008000; }
.rankingTypeSection .page__header:last-child .rankingType__filter > div, 
.rankingHeader__filter--button > div { background-color: #282828; border-color: #282828; }
.rankingTypeSection .page__header:last-child .rankingType__filter > div:hover, 
.rankingHeader__filter--button > div:hover { background-color: #444; border-color: #444; }
/*
.rankingTypeSection .page__header:last-child .rankingType__filter > div > div:nth-of-type(1), 
.rankingHeader__filter--button > div > div:nth-of-type(1) { color: #000; background: #fc0; }
*/
.rankingProvider__item:not(.noBorder), .providerFilter__item:not(.noBorder), 
.providerFilter__expand, .providerFilter__default { background-color: #363b3d; border-color: #363b3d; }
.rankingProvider__item:not(.noBorder):not(.rankingProvider__item--active):hover, 
.providerFilter__item:not(.noBorder):hover, .providerFilter__expand:hover, 
.providerFilter__default:hover { background-color: #4c585d !important; border-color: #4c585d !important; box-shadow: none !important; }
.rankingProvider__item:not(.noBorder).rankingProvider__item--active, 
.rankingProvider__item:not(.noBorder).rankingProvider__item--active:hover, 
.providerFilter__item:not(.noBorder).providerFilter__item--active, 
.providerFilter__item:not(.noBorder).providerFilter__item--active:hover { background-color: #fc0 !important; border-color: #fc0 !important; box-shadow: none !important; }

/* pages */
.page__section--dark .premieresHeader__group .navList--primary .navList__item--selected { background-color: #fc0; color: #000; border-radius: 0px; }
.page__section--dark .premieresHeader__group .navList--primary .navList__item--selected .navList__text { color: #000; }
.page__section--dark .premieresHeader__group .navList--primary .navList__item:not(.navList__item--selected) { background-color: #222; }
.page__section--dark .premieresHeader__group .navList--primary .navList__item:not(.navList__item--selected):hover { background-color: #333; }
.searchSortAndFilterReactApp > section > div > div > div:nth-of-type(1), 
.searchSortAndFilterReactApp > section > div > div > div:nth-of-type(2) > div { background-color: #333; border-color: #333; box-shadow: none; }
.searchSortAndFilterReactApp > section > div > div > div:nth-of-type(1):hover, 
.searchSortAndFilterReactApp > section > div > div > div:nth-of-type(2) > div:hover { background-color: #444; border-color: #444; box-shadow: none; }
.page__section--gray .page__moreButton a { background-color: #333; border-color: #333; }
.mouse .page__section--gray .page__moreButton a:hover { background-color: #111; border-color: #111; }
.boxBadge__item.boxBadge__item--premiere { background-color: #fc0; color: #000; }
.variantIndex--compact .preview__placeholderIndex, .variantIndex--compact .preview__index { background: #323737; }
.page__section .isDark .page__moreButton a, .page__section--dark .page__moreButton a, 
.page__section--black .page__moreButton a { background-color: #111; border-color: #111; }
.mouse .page__section .isDark .page__moreButton a:hover, .mouse .page__section--dark .page__moreButton a:hover, 
.mouse .page__section--black .page__moreButton a:hover { background-color: #222; border-color: #222; }
.page__section--secondaryDark hr { border-bottom-color: #111; }
.page__section--secondaryDark .author-box { border-color: transparent; }
.mouse .navList--secondary .navList__item--selected .navList__button:hover .navList__text { color: #000; }
.mouse .navList--secondary .navList__item:not(.navList__item--selected) .navList__button:hover .navList__text { color: #ddd; background-color: #333; }
.awardsSearchSection .searchFormAwards .input__container { background-color: #25282a; border-color: #25282a; }
.awardsSearchSection .searchFormAwards .input__cover { background: none; }
.awardsSearchSection .searchFormAwards .input__container.isActive { border-color: #fc0; box-shadow: none; }
.fwBtn.fwBtn--iconRight img { filter: invert(100%); }
.labelBox--gold:not(.isEnded) { background-color: #fc0; color: #000; }
.newsRelatedFilmsSection__switchLeft, .newsRelatedFilmsSection__switchRight { background-color: #fc0; box-shadow: none; }
.newsRelatedFilmsSection__switchLeft .ico, .newsRelatedFilmsSection__switchRight .ico { color: #000; }
.newsMainSection__news > .page__text > a:not(.black):not(.fwPlayerPlusBtn):not(.markupPhoto), .newsMainSection__news > .page__text > * > a:not(.black):not(.fwPlayerPlusBtn):not(.markupPhoto), .newsMainSection__news a.internal:not(.fwPlayerPlusBtn), .newsMainSection__news .textRankingItem__description > a.external:not(.fwPlayerPlusBtn) { border-color: #fc0; }
.mouse .newsMainSection__news > .page__text > a:not(.black):not(.fwPlayerPlusBtn):not(.markupPhoto):hover, .mouse .newsMainSection__news > .page__text > * > a:not(.black):not(.fwPlayerPlusBtn):not(.markupPhoto):hover, .mouse .newsMainSection__news a.internal:not(.fwPlayerPlusBtn):hover, .mouse .newsMainSection__news .textRankingItem__description > a.external:not(.fwPlayerPlusBtn):hover { border-color: #fc0; color: #fc0; }

/* strona filmu */
.filmPosterSection__plot a:not(.fwBtn), .filmOtherInfoSection a, .personRole__subtitle a, .simplePoster__character .link, .simplePoster__character a, .descriptionSection__text a, .descriptionSection__noBio a, .curiositiesSection__item a, .userReviewSection .flatReview__more, .castRoleListElement__info span[data-role-source] a, .reviewBox__readMore, .personPosterSection__lead a, .subPageMenu__link--active, .filmVodInfoSection .page__container.filmVodInfoSection__grid a, .filmVodProvidersSection__linkVodPage, .atmDesc a, .awardsNavSection__link, .awardsNavSection__groupPerson, .curiositiesNavSection__text a, .characterPosterSection__plot a, .worldPosterSection__plot a, .page__subtitleMore, .filmPosterSection__postCreditScenes a { 
    color: #fc0 !important; 
}
.filmPosterSection__plot a:not(.fwBtn):hover, .filmOtherInfoSection a:hover, .personRole__subtitle a:hover, .simplePoster__character .link:hover, .simplePoster__character a:hover, .mouse .descriptionSection__text a:hover, .mouse .descriptionSection__noBio a:hover, .curiositiesSection__item a:hover, .userReviewSection .flatReview__more:hover, .castRoleListElement__info span[data-role-source] a:hover, .filmInfo__info > a:hover, .filmInfo__info > span a:hover, .personPosterSection__lead a:hover, .filmVodInfoSection .page__container.filmVodInfoSection__grid a:hover, .filmVodProvidersSection__linkVodPage:hover, .atmDesc a:hover, .awardsNavSection__groupPerson:hover, .curiositiesNavSection__text a:hover, .characterPosterSection__plot a:hover, .worldPosterSection__plot a:hover, .page__subtitleMore:hover, .filmPosterSection__postCreditScenes a:hover { 
    color: #fe4 !important; 
}
.simplePoster__title:hover, .preview.previewCard.previewEpisode .preview__link:hover [data-source-title], .personRole__title:hover a, .icoButton:hover, .icoButton--gray:hover, .forumTopic__authorName a:hover, .forumTopic__title:hover, .forumTopic__comments:hover .ico::before, .forumTopic__menu:hover .ico.ico--moreVertical, .forumTopic__lastLink:hover, .breadcrumbs__item--active:hover, .breadcrumbs__item--nolink:hover, .breadcrumbs__item:hover, .filmCharactersSection__characterName:hover, .preview.previewCard .preview__header .preview__title > .preview__link:hover, .mouse .characterPerformerSection .characterCardPerson__person a:hover, html.mouse .rankingElement__person:hover, .mouse .characterPosterSection__info a:hover, .mouse .worldPosterSection__info a:hover { 
    color: #fc0 !important; 
}
.variantMenu.forumTopic .ico.ico--moreVertical { color: #fff; }
.linkButton, .filmInfo__info--group a.link, .filmPosterSection__buttons button { background-color: #333; border-color: #333; color: #ccc; }
.linkButton:hover, .filmInfo__info--group a.link:hover, html.mouse .filmPosterSection__buttons button:hover { background-color: #111; border-color: #111; color: #ccc; }
.squareNavigation__item, .squareNavigation__select { background-color: #333; border-color: #333; color: #ccc; }
.mouse .squareNavigation__item:not(.isActive):hover { background-color: #111; border-color: #111; }
.filmInfo__vodInfo, .subPageLinkBlock__container, .awardsSection__container { background-color: #222; border-color: #222; }
.mouse .filmInfo__vodInfo:hover.FilmVodButton--vod, .subPageLinkBlock__container:hover, 
.awardsSection__container:hover { background-color: #333; border-color: #333; box-shadow: none; }
.page__moreButton .next, .page__moreButton .page__footerCounter, 
.page__moreButton:hover .next, .page__moreButton:hover .page__footerCounter { color: #000 !important; }
.slumpdown__button--toggle { background-color: #282828; border-color: #282828; }
.slumpdown--inSentence .slumpdown__button--toggle { background-color: initial; border-color: inital; }
.variantSearch .forumTopicsList__searchInput { background-color: #282828; border-color: #282828; }
.variantSearch .forumTopicsList__searchInput:focus { background-color: #333; border-color: #333; }
.subPageMenu__indicator .icoButton { background-color: #fc0; color: #000; }
.personTopRolesSection__rankingLink { background-color: #333; color: #aaa; }
.personTopRolesSection__rankingLink::before { border-color: #333; }
.personTopRolesSection__rankingLink:hover { background-color: #111; }
.mouse .personTopRolesSection__rankingLink:hover::before { border-color: #111; }
.squareNavigation__item.isActive, .squareNavigation__select.isActive { background-color: #fc0; border-color: #fc0; color: #000; }
/* .filmEpisodesListSection__buttons > div > button > div > div { color: #000; background-color: #fc0; } */
.filmEpisodesListSection__buttons > div > button { background-color: #333; border-color: #333; }
.filmEpisodesListSection__buttons > div > button:hover { background-color: #111; border-color: #111; box-shadow: none; }
.personFilmographySection .crs .crs__item :is(.preview, .previewHolder).hasShadow { background: none; }
.filmPage .reviewBox--wide .reviewBox__content--label { background-color: transparent; }
.forumTopic__badge { background-color: #333; border-color: #333; }
.forumTopic__badge:hover { background-color: #444; border-color: #444; color: #ccc; }
.filmVodProvidersSection__image:not(.noBorder) { background-color: #444; border-color: #444; }
.mouse .filmVodProvidersSection__image:not(.noBorder):hover { background-color: #666; border-color: #666; box-shadow: none; }
#champion > path { fill: #ccc; }
.roleInEpisodes__seasonTitle { background-color: #fc0; color: #000; }
.atmWrap.atmWrap--decor, .atmWrap--decor .atmWrap:not(.no-decor) { border-color: #fc0; }
.atmImage.atmImage--ring { box-shadow: 0 0 0 .0625rem #fc0, 0 0 0 .125rem #fc0; }
.subPageMenu::after { background-color: transparent; background-image: linear-gradient(transparent, #17191a 50%); }
.filmWhereToWatchSection button[id="radix-:rb:-trigger-"][data-state="active"] { color: #000; }
.filmWhereToWatchSection button[id*="radix-:rb:-trigger-"]:not([data-state="active"]):hover { background-color: #111; }
.filmWhereToWatchSection button[id="radix-:r0:-trigger-"][data-state="active"] { color: #fc0; }
.filmWhereToWatchSection button[id="radix-:r0:-trigger-"][data-state="active"]::after { background-color: #fc0; }
.filmWhereToWatchSection button[id*="radix-:r0:-trigger-"]:hover { color: #ccc; }
.filmWhereToWatchSection > section > div:nth-of-type(1) > div[dir="ltr"][data-orientation="horizontal"][type="default"] { border-color: #444; }
.filmWhereToWatchSection button.more[role="combobox"]> span:first-of-type::after { background-color: #fc0; }
.typeCounter__item { background-color: #333; border-color: #333; color: #ccc; box-shadow: none; }
.mouse .typeCounter__item:hover { background-color: #444; border-color: #444; color: #ddd; box-shadow: none; }
.characterFilmographySection .preview.previewCard { background: transparent; }
.mainTapeMenuSection__item { background-color: #181a1b; border-color: #181a1b; }
html.mouse .mainTapeMenuSection__item:hover { background-color: #111; border-color: #111; }
.mainTapeMenuSection__navigation button { background-color: #181a1b; border-color: #181a1b; }
html.mouse .mainTapeMenuSection__navigation button:hover { background-color: #181a1b; border-color: #181a1b; color: #fc0; }
.mainTapeMenuSection__navigation:has(> button[data-id="next"]) { 
    background-color: transparent; background-image: linear-gradient(to right, transparent, #181a1b 25%); 
}
.mainTapeMenuSection__navigation:has(> button[data-id="prev"]) { 
    background-color: transparent; background-image: linear-gradient(to left, transparent, #181a1b 25%); 
}
.overlayLinks__link:hover, .overlayLinks__link--active { background-color: #fc0; color: #000; border-color: #fc0; }
:is(.preview.previewEpisode, .previewHolder).isMedium { background-color: #282828; border-color: #282828; }
.filmEpisodesRankingSection__item, .filmSeasonsRankingSection__item, 
.filmSeasonsRankingSection__item .previewCard { background-color: #282828; border-color: #282828; }
.filmEpisodesListSection__buttons .ico.ico--tv::after, 
.filmRatingSection .ico.ico--tv::after { background-color: #fc0; color: #000; }
.filmEpisodesListSection__buttons button:hover .ico.ico--tv::after, 
.filmRatingSection button:hover .ico.ico--tv::after { background-color: #ccc !important; color: #000 !important; }
.personRole__ranking--top20 { background-color: #fc0; color: #000; }
.filmRatingSection .ico--check, .filmEpisodesListSection__buttons .ico.ico--check, 
.seasonOrEpisodeRatingBox__checkBox.isChecked .ico.ico--check { background-color: #fc0; color: #000; }
.filmRatingSection button:not(.gPrqeh):hover .ico--check, .filmEpisodesListSection__buttons button:not(.iqRyvj):hover .ico--check, 
.seasonOrEpisodeRatingBox__checkBox:not(.isChecked):hover .ico.ico--check { background-color: #ccc !important; color: #000 !important; }
.navList--secondOutline .navList__item--selected .navList__button .navList__text, 
.mouse .navList--secondOutline .navList__item--selected .navList__button:hover .navList__text { 
    color: #000; border-color: #fc0; background-color: #fc0;  
}
.mouse .navList--secondOutline .navList__button:hover .navList__text { border-color: #333; background-color: #333; }
.ratingPanel > div:nth-of-type(1) > div:nth-of-type(1) > div > div:nth-of-type(2)[width$="%"] { background-color: #fc0; }
.filmEpisodesListSection__buttons button:nth-of-type(1) > div > .hVpSwl { color: #000; background-color: #fc0; }
.autoPlayer__info .autoPlayer__watchMore { background-color: #fc0; color: #000; }
.squareNavigation--rounded .squareNavigation__item, 
.squareNavigation--rounded .squareNavigation__select { background-color: #333; color: #ccc; border-color: #333; }
.squareNavigation--rounded .squareNavigation__item.isActive, 
.squareNavigation--rounded .squareNavigation__select.isActive { color: #000; background-color: #fc0; border-color: #fc0; }
.textExpander.isCollapsed .textExpander__more {
    background: linear-gradient(90deg,rgba(0,0,0,0) 0%,var(--preview-background-color, #181818) 10%,var(--preview-background-color, #181818) 100%); 
}
.opinionBoxNew__readMore { background: linear-gradient(90deg,rgba(0,0,0,0) 0%,var(--text-expander-background-color, #181818) 1rem,var(--text-expander-background-color, #181818) 100%); }
div:has(.ico--similarity) > span { filter: invert(100); }
.filmSubPageOpinions[data-linkable="filmOpinions"] .filmOpinionsSection img[src="https://fwcdn.pl/prt/static/pages/film/opinie/opinionsFilterTip.svg"] {
  filter: invert(90%) hue-rotate(190deg) saturate(150%) brightness(160%) contrast(140%);
}

} /* readerEnd */

} /* domainEnd */


@-moz-document domain("filmweb.pl") {
/* ------------------------------------------ */
/*                   Dimmer                   */
/*                 30.03.2021                 */
/* ------------------------------------------ */
    
#cmlPlaceholder { display: none; }  

if cmlTheme == dim {    
/* general */    
body, body.hideSite, body.hasScreening, body.hasScreening .page__wrapper, body.hasScreening:not(.hasScreeningExpanded) #site:not(.subpage-webVideoPage).deprecated .fa__wrapper { background-color: #ddd !important; } 
.skin-1:not(.screening) body { background-color: #dadada !important; }
.skin-2:not(.screening) body { background-color: #d8d8d8 !important; }  
#body, #advertising-pl_PL div, #publisher-pl_PL div, #editorial-pl_PL div, #regulations-pl_PL div, .richContentPage__header--main, .privacyPage, .richContentPage { 
    background-color: #ddd !important; 
}    
.siteFooterSection, .IRI .siteFooterSection { background: #ccc; }
.page__section--white { background-color: #ccc; }    
.page__section--gray, .page__section--gray .page__moreButton a, .page__section .isGray, .page__section .isGray .page__moreButton a { background-color: #d0d0d0; }
.page__section--gradient .page__top { background: #ddd; }    
.page__section--black, .page__section--dark, .page__section .isDark {
    background-color: #111; 
    .labelBox { color: #ffcc00; }
    .polaroid__meta { color: #aaa; }        
}
.page__section--black .page__moreButton a, .page__section--dark .page__moreButton a, .page__section .isDark .page__moreButton a { background-color: #222; border-color: #444; } 
.page__section--black .navList__text, .page__section--dark .navList__text, .page__section .isDark .navList__text { color: #888 !important; }
.page__section--black .navList__text:hover, .page__section--dark .navList__text:hover, .page__section .isDark .navList__text:hover { color: #aaa !important; }   
.page__section--black .navList__item--selected .navList__text, .page__section--dark .navList__item--selected .navList__text, .page__section .isDark .navList--primary .navList__item--selected  .navList__text { color: #ccc !important; }    
.mouse .page__section--black .page__moreButton a:hover, .mouse .page__section--dark .page__moreButton a:hover, .mouse .page__section .isDark .page__moreButton a:hover { background-color: #aaa; border-color: #888; color: #000; }
.fwBtn--default, .fwBtn__default { background-color: #bbb; }     
.fwBtn .fwBtn--label, .fwBtn .fwBtn__label { color: #555; }
.slumpdown--long .slumpdown__button--toggle, .section--userChannels .mainSettings .slumpdown { background-color: #eee; } 
.site--home .header--fixed, .site--home .header--main:hover, #header, .header--main { background: #111; }    
    
/* no img */    
.place .film__title .role__poster .inner, .place .film__roles .film__poster, .place .person__roles .film__poster, .place__poster .entity__link, .place__poster .main-picture-poster, .personRole__image, .polaroid__thumbnail .thumbnail, .filmPoster__link, .filmPoster__link .thumbnail, .filmPosterSection__poster, .personRoleCharacter .collagePoster, .personRoleCharacter .poster, .personRoleCharacter .posterRole, .personPosterSection__poster, .thumbnail, .episodePreview__imageWrapper::before, .seasonPreview__imageWrapper::before, .personRole__image--empty, .simplePoster__link, .recentlyViewed__poster, .siteSectionHeader__poster, .ribbonPanel.isOpen .ribbonPanel__poster, .personPoster__link, .filmPreview__poster .poster__image, .poster__wrapper { background-color: #bbb; }
    
/* search */   
div[data-v-app] {
.liveSearch .page__container { background-color: #ddd; }
.form__input { background-color: #ccc; caret-color: #aa6600; }
.form { border-color: #aaa; }
#searchMain .form__input { background: #333; color: #ccc; }
#searchMain #searchForm fieldset { background-color: #333; }    
#searchResults .resultsList, .popularList { background-color: #ccc; }    
.resultItem.active::before { background-color: #ccc; border-color: #aa6600; } 
.form__remove, .resultItem__title--second, .promoted { color: #555; }
}
    
/* tv */    
.percentBar { background-color: #aa6600;}    
.tvGrids .pkc .pkc-wrapper { background-color: #d0d0d0; }    
.seance { background: #e8e8e8; }  
.seance.current { background: #dfdfdf; }    
.seance.past { color: #888; } 
.seance.past a { color: #cc8833; }    
.channelInfo { background-color: #d8d8d8; border-color: #ccc; } 
#tvGuideExclaimer { opacity: .75; }    
.promotedChannels a { background: #fff; } 
.tvGuide .nav-bar li:hover:not(.off) { background-color: #ccc; }    
.tvGuide .dropdown-menu button:hover { background-color: #ccc; }  
.guideGrid, #channelTypeFilters .dropdown-body:hover { background: #ccc !important; }    
    
/* quiz */    
.quizQuestionsSection__header { background-color: #ddd; }  
.quizQuestionsSection__progressBar { background: #ddd; }    
.progressBar__bar { background: #ccc; }  
.control--ico .control__indicator::before { color: #aaa; background: #000; }    
.mouse .control--ico:hover input:not([disabled]):not(:checked) ~ .control__indicator::before { background: #fff; color: #333; } 
.control.control--is-selected .control__indicator, .control.control--not-all-check .control__indicator, .control input:checked ~ .control__indicator { border-color: #aa6600; background: #aa6600; }    
.control--ico input:checked:not([disabled]) ~ .control__indicator::before { background: #000; }        
    
/* paging */
.pagination__item--is-active .pagination__link { background: #555; border-color: #333; }  
.pagination__dots, .pagination__link { background: #ccc; }
html:not(.touch) .pagination__link:hover { background: #888; border-color: #666; }    
.pagination__item--next .pagination__link, .pagination__item--prev .pagination__link { border-color: #888; } 
    
/* text */
.polaroid__meta, .navList--primary .navList__button, .navList--tertiary .navList__button, .navList--primary .navList__text, .navList--tertiary .navList__text, .posterInfoBox__channelDate, .posterInfoBox__channelName, .reviewBox__dots, .reviewBox__text, .posterInfoBox__datePremiere, .posterInfoBox__platforms, .siteFooterSection__footer a, .siteFooterSection__footer li, .siteFooterSection__footer span, .siteFooterSection__footer ul, .siteFooterSection__copyLinks .copyright, .forceCap, a.cap, .cap, .forceCap a, .fwBtn--checkbox, .fwBtn__checkbox, .filmPreviewHolder .filmPreview .filmPreview__info > span, .hit.hit--person .hit__personBirthDate, .hit__bioCat, .hit__bioCatList, .characterPreview__info > span, .worldPreview__info > span, .navList--secondary .navList__text, .fwmArticle .contentElement .articleContentElement .innerFix .articleAuthor .articleInfoWrapper .articleInfo li, .fwmArticle .contentElement .articleContentElement .innerFix .articleAuthor .articleInfoWrapper .articleInfo li a, .lig, #pkc .article__author, .section__fw-recommends .section__description, .recommends__list .film .review__lead, .recommends__list .film .author, .rankingType__rate--count, .sausageBar__button, .rankingType__roleName, .rankingTypePerson__desc, .surveyResultsBox__date, .plusCount, .userDescriptionSection__link span, .similarityUsersInfo__similarity, .votesInfoBox--bold .votesInfoBox__caption, .barsListBox--vertical .barsListBox__value, .userEventSummary__meta, .userNewestFriends__mutualFriends, .rolePreviewHolder .rolePreview__personAsRole, .rolePreviewHolder .rolePreview__film, .rolePreviewHolder .rolePreview__profession, .rankingList__row--header, .rankingList__description, .userBox__description, .userConnectionBox__badge .userConnectionBox__btn, .contribsChartStats .stats__desc, .contribsChartStats .chart__points, .ct-label, .notificationsContainer .entryFooter .eventDate, .filmPreview .filmPreview__info span, .photoSelector__sub-header, .voteCommentBox__date, .slumpdown--grouped .slumpdown__tglBtnGrLbl, .slumpdown__groupLabel, .barFilter__count, .sausageBar__button span, .rateRolesBox__selectedRole, .flexTable__header, .flexTable .blog__details, .flexTable .topic__details, .socialConnectBox__desc, .section--userFavoriteCinema .noResultsInfo__container, .section--userSettingsConsents .mainSettings__groupItemForm .control--checkbox .control__title, .section--userSettingsConsents .mainSettings__groupItemState .control--checkbox .control__title, .popup__content, .notificationsContainer .entryTitle, .filmInfo__header, .personRole__role, .filmInfo__infoText, .curiositiesSection--main .curiositiesSection__item, .filmFriendComment__publisher, .userReviewSection .flatReview__text, .userReviewSection .flatReview__positiveVotes, .newsHeaderSection__info, .newsHeaderSection__date, .author-box__desc, .reviewRatingSection__text, .comment__reply, .commentForm__submit, .forumSection__topicText, .forumSection__rate, .forumSection__lastWhen, .forumSection__date, .plusMinusWidget__count, .forumSection__commentsCount, .forumSection__plusCount, .filmFriendComment__date, .filmFriendComment__commentIt, .filmFriendComment__action, .reactionsList__summary, .polaroid--single .polaroid__lead, .flatReview__text, .subPageMenu__title, .castRoleListElement__info, .descriptionSection__author, .descriptionSection__authorInfo, .filmPressbooksSection__text, .filmEditionsSection .edition__group, .personAwardSection__titleInfo, .filmographyCounterUser__itemText, .personKnownForItem__characterName, .personRating--gray .personRating__count, .personRoleCharacter__filmTitle, .personTopRolesSection__rankingLink, .overlayLinks__link, .overlayLinks__groupHeader, .personMaritalStatusSection__text, .usualPartnerItem__counter, .quizItem__lead, .contributorBox__points, .waitingContribsSection__row .text--gray, .objMetaInfo > :nth-child(2n+1), .worldCharactersSection__card > a, .rankingElement__film, .rankingElement__rate span, .worldLastSection .filmPreview .filmPreview__info > span, .forumSection__header--text span, .copyrightSection > div, .rolesBoxItem__about, .characterPerformerSection .characterItemPerson__more, .characterRelated__more span, .characterFilmographySection .filmPreview .filmPreview__info > span, .quizResult, .fwBtn--badge, .fwBtn__badge, .profileSubNavigationSection .navList__item:not(.navList__item--selected, :hover) .navList__text, .reviewBox__label--gray, .reviewBox__filmTitle, .reviewBox__filmYear, .filmEmptySection .emptyBlock__text, .filmRatingAssistant__title, .filmRatingAssistant__clear, .filmRatingBox__date, .textInput__label--placeholder, .IRI .siteFooterSection__copyLinks .copyright, .forumSection__addFirstText, .personPosterSection__infoData h3, .navList--slender .navList__item .navList__text, .preview.previewCard .preview__detail[data-detail-type]::before, .communityRatings__description, .personRolesBox__footer, .voteCommentText__label--placeholder, .reactionsBar__container, .eventBox__about, .eventBox__date, .previewRole .preview__character, .voteStatsBox__item, .filterSelect__labelDesc, .inlineSwitch__label, .plusLandingPage__section--home .plusLandingPage__price, .plusLandingPage__sectionSubHeader, .simplePoster__year, .rankingType__genres strong { 
    color: #555; 
}  
.icoButton--silver, .forumSection__comments .ico::before, .forumSection__plusPanel .ico::before, .plusMinusWidget__up::before, .plusMinusWidget__down::before, .forumSection__toolsIcon, .userRate__icon:not(.userRate__icon--active), .uniVotePanel.light .gwt-favButton, .uniVotePanel.light .wantToSeeButton .dot, .uniVotePanel.light .gwt-baseVoteWidget > div, .userRate .favourite__icon, .voteCommentBox__addComment, .barFilter__favouriteIcon, .inlineSwitch--iconic .inlineSwitch__option:not(.inlineSwitch__option--active) i, .postInfo .profile__head .ifw-fw:not(.ifw-fw--retired, .ifw-fw--new-evaluation), .filmFriendComment__commentPlaceholder, .newsNewestSection .labelBox__category, .newsNewestSection__item-commentsCount, .newsNewestSection__item-date, .filmFriendComment__status .ico, .flatReview .ico--starSolid, .forumSection__search .ico::before, .comment__like button, .comment__notification button, .btnMinus, .btnPlus, .iconicRate__icon:not(.iconicRate__icon--rated)::before, .reactionsBar__icon, .rateStatus__container .ico, .profile__head .ico { 
    color: #888; 
}
.labelBox, .characterPreview__badge, .worldPreview__badge, .rankingVideosSection__header h3 a, .slumpdown__item--active, .slumpdown__list .slumpdown__button:hover, .slumpdown--inSentence .slumpdown__button--toggle, .slumpdown--chevron .slumpdown__button--toggle::after, .quizQuestionsSection__type, .quizResultSection__type, .rankingTypePerson__desc > a:hover, .userDescriptionSection__link .ico, .userDescriptionSection__since .ico, .userDescriptionSection__link:hover span, .votesInfoBox__item.isActive .ico, .userEventSummary__event:hover a, .userEventSummary__event:hover span, .dynamicTextField__editIcon i, .filterSelect__extraOption--checked, .filterSelect__extraOption:hover, .userRate .favourite__icon--active, .userRate button.favourite .favourite__icon:hover, html.mouse .barFilter__favourite:hover .barFilter__favouriteIcon, .inlineSwitch--iconic .inlineSwitch__option--active i, .navList__item--selected .navList__text, .mouse .section--userPersonal .link:hover, .section--userPersonal .link__editLabel, .item-sub:hover a, .item-sub:hover span, .navList__button:focus, #userMenu .item-user > a:hover, #userMenu .item-user > a:hover .ico, .user-extra-button:hover, .navList__more:not(.navList__more--clicked):hover .navList__item--more .navList__button, .navList__item--more::before, .buttonLooksLink, .stdButton, .oldPage a, .commentForm__text:focus + button, .mouse .newsMainSection__news > .page__text > * > a:not(.black):not(.fwPlayerPlusBtn):not(.markupPhoto):hover, .mouse .newsMainSection__news > .page__text > a:not(.black):not(.fwPlayerPlusBtn):not(.markupPhoto):hover, .mouse .newsMainSection__news a.internal:not(.fwPlayerPlusBtn):hover, .subPageMenu__link--active, .contribHeader a, #body .siteSectionHeader__title a, .forumSection__searchInput:focus ~ .ico::before, .fwBtn--badge:focus, .fwBtn--badge:hover, .fwBtn__badge:focus, .fwBtn__badge:hover, .richContentPage a:hover, .dynamicTextField__seeMore.dynamicTextField__seeMore--withoutLabel::before, .link-btn, .genreButtons .genre, .mouse .navList__button:not(.navList__button--advert):hover .navList__text, .navList__button:focus, .personPosterBox .breadcrumbs__title, .section__header .list .item__is-active a, .slumpdown::after { 
    color: #aa6600; 
}     
.userNewestFriends__icon, .voteStatsBox__icon, .rateStatus__container .ico.isSelected, .communityRatings__rating::before, .preview.variantBadge .preview__card::before { 
    color: #d2a200; 
} 
.labelBox--gold { color: #000; }  
.profileMainNavigation .navList__text { color: #ccc; }  
.firstNews .labelBox__category { color: #ffcc00; }
.labelBox--firstNewsContainer .labelBox__category, .navList--secondary .navList__item--selected .navList__text { color: #000 !important; } 
    
/* plus */    
.forumSection__comments:hover .ico::before, .forumSection__plusPanel:hover .ico::before { color: #222; }  
.plusAdd, .addPlus, .addTopic, .observe, .comment-opts-opener { color: #666 !important; }        
.plusAdd:hover, .addPlus:hover, .addTopic:hover, .observe:hover, .comment-opts-opener:hover { color: #444 !important; }
.hdr i { filter: brightness(25%); }     
    
/* borders */    
.newHr, .hr, .navList--bordered, .recommends__list .film__rec-info .inner, .recommends__list .film, .rankingTypePerson, .question__answer:not(:last-of-type), .surveyResultsBox__header, .forumMain .topicWrapper, .dropdown-toggle.sbtn, .post .postContentAndInfo, .userDescriptionSection__userAbout .dynamicTextField, .userTopRatedSection__info, .voteStatsBox__table tr td:first-child, .voteStatsBox__table tr:first-child, .userNewestFriends__stats, .rankingList__row:not(.rankingList__row--header):not(:last-child), .rankingUsersPage__usersTable:nth-child(2) .rankingList__container, .rankingUsersPage__usersTop--evaluatorMonthly .rankingList__container, .rankingUsersPage__usersTop--evaluatorsAllTime .rankingList__container, .profileSubNavigation, .contribsList__element:not(:first-child), .contribsChartStats .stats, .filterSelect__extraOptions, .inlineSwitch--iconic .inlineSwitch__option, .mainSettings__group, .flexTable .blog, .flexTable .topic, .curiositiesSection__item, .newsNewestSection__item, .forumSection__item, .userReviewSection .flatReview:not(:last-of-type), .flatReview:not(:last-of-type), .descriptionSection__item + .descriptionSection__item, .curiositiesNavSection__text, .filmEditionsSection .edition__text, .broadCastBox__channel, .personFilmographySection__item::after, .forumSection__wrapper, .characterFilmographySection__itemInner::after, .userVoteHeaderSection__info { 
    border-color: #aaa; 
}  
.slumpdown--inSentence .slumpdown__button--toggle, .commentForm__text:focus, .newsMainSection__news > .page__text > * > a:not(.black):not(.fwPlayerPlusBtn):not(.markupPhoto), .newsMainSection__news > .page__text > a:not(.black):not(.fwPlayerPlusBtn):not(.markupPhoto), .newsMainSection__news a.internal:not(.fwPlayerPlusBtn), .mouse .newsMainSection__news > .page__text > * > a:not(.black):not(.fwPlayerPlusBtn):not(.markupPhoto):hover, .mouse .newsMainSection__news > .page__text > a:not(.black):not(.fwPlayerPlusBtn):not(.markupPhoto):hover, .mouse .newsMainSection__news a.internal:not(.fwPlayerPlusBtn):hover, .richContentPage a { 
    border-color: #aa6600; 
}      
    
/* misc */    
.page__subtitle.page__subtitle--tiny a:hover, .page__subtitle.page__subtitle--tiny h2 a:hover { background-color: transparent !important; }   
.personPosterSection__contribButton { background-color: transparent; }
.mainSettings__groupItem::before { background: #ddd; }      
.control__indicator::after, .control__indicator::before { opacity: 0.75; }             
.sidebarPanel--sticky .sidebarPanel__header, .sidebarPanel__panel, .sidebarPanel__header, .sidebarPanel__navigation { background-color: #ddd; }  
.navList--primary::after, .navList--tertiary::after, .voteStatsBox__close::before, .voteStatsBox__close::after { background-color: #aaa; }
.navList--primary .navList__item::after, .navList--tertiary .navList__item::after { background-color: #aa6600; } 
.reviewBox .ico--starSolid { color: #ccc; }  
.menu__extra { background-color: #ccc; }  
.filmPreviewHolder .filmPreview, .hits__item, .rankingType__card, .characterRelated__card { background: #eee; }    
.slumpdown__button--toggle { border-color: #ccc; }
.slumpdown { background: #eee; }   
.slumpdown--inSentence { background: #ddd; }
.filterSelect__panel { background: #ccc; } 
.filter-select--dark .filterSelect__button, .page__section--dark .filter-select .filterSelect__button { background: #222; }  
.mCommentArea, .sbtn { background: #ddd; }    
.sausageBar__button, [data-view="A"] .rankingHeader__filters form { background: #eee; }    
.rankingTypePerson__position, .rankingTypePerson { background: #eee; }    
.surveyResultsBox__header { background: #eee; }    
.surveyResultsBoxItem__bar { background-color: #ccc; }    
.recommends__list .film .inner, .recommends__list .film .review::before { background: #ccc; }   
.recommends__list .film .review:hover::before { border: none; background: #ddd; }    
#pk-popup { background: #ccc; }  
.friendSuggestBox { background: #ccc; }
.userFriendSuggestBoxSection { background-color: #ccc; }    
.fwBtn--delta, .fwBtn__delta { background: #bbb; border-color: #aaa; color: #333; } 
.similarityBox__users::before { background: #ccc; border-radius: 15px; }    
body.isUserHeaderPinned .userHeaderSection .user__name:not(.user__link) { border-right-color: #333; } 
.userTopRatedSection__header, .userVoteHeaderSection__header { background: #ccc; }  
.profile__head .ifw-fw.ifw-fw--retired { color: #ffcc00; }  
.voteStatsBox__element:hover { background-color: #eee; }    
.rankingList__row--header { background: #ccc; }    
.rankingUsersPage__topReviewers { background: #eee; }   
.userBox__container { background-color: #ddd; }  
.rolePreviewHolder .rolePreview__card { background-color: #eee; }    
.myVoteBox__rightCol { background-color: #eee; }    
.userConnectionBox__inner { background: #ccc; }    
.contribBox__container, .contribBox__footer, .contribBox__header { background: #ccc; }  
#recommendationsEntry .filmPreview { background-color: #eee; }   
#recommendationsEntry .slider-handle { background: url("https://4.bp.blogspot.com/-bQfMRKmN20k/W1oY1kox10I/AAAAAAAAD2A/QV5LBm4bhGYI3noASkXq64DuH1XdHTUlQCLcBGAs/s1600/spYellow.png") no-repeat scroll center top transparent; }
.filmsTogglePanelParent .filmsTogglePanel { background: #ccc; }
.filmsTogglePanelParent .filmsTogglePanel button.on { 
    background: #ffcc00 !important; 
    color: #000 !important;
    border-radius: 2px !important;
}  
.filmsTogglePanelParent .filmsTogglePanel button { color: #000; }
.filmsTogglePanelParent { background-color: #fff; background-image: none; border-color: #fff; } 
.dynamicTextField__editIcon { background-color: transparent; }    
.photoSelector__body { background-color: #ccc; }   
.userVotesPage__sortBy .slumpdown { background: #fff; }    
.userVotesPage--userVotes .userVotesPage__filters, .userVotesPage--userWantToSee .userVotesPage__filters { background-color: #eee; }
.barFilter__clearButton { background: #ddd; }    
.inlineSwitch--iconic .inlineSwitch__option { background: #ccc; }    
.inlineSwitch--iconic .inlineSwitch__option--active { background: #eee; }    
.control--switchIcon input + .control__label .control__text, .control--switchIcon input + .control__label .ifw { color: #000; }    
.mouse .control:hover input:not([disabled]):not(:checked) ~ .control__indicator { background: #aaa; }    
.mouse .control:hover input:not([disabled]) ~ .control__indicator { border-color: #aaa; }   
.section--userSettingsNotifications .mainSettings__thGroup { background: #ccc; }    
.flexTable__header { background: #ccc; }    
.socialConnectBox { background: #ccc; }   
.mainSettings .channel::before { background: #fff; }   
.popup__body { background-color: #ccc; }   
.titlesPreviewSection::after { background-color: #111; }    
.titlesPreviewSection__coverPhoto::before { background: linear-gradient(180deg,#1a1a1a,rgba(0,0,0,.001) 6.7%,rgba(0,0,0,.001) 64%,#1a1a1a),linear-gradient(90deg,#1a1a1a,rgba(0,0,0,.001) 32%,transparent 81.41%,#1a1a1a); }    
.notificationsContainer .notifyParent:hover { background: #ccc; }
.notificationsContainer .notifyParent { background: #ddd; } 
#userMenu .item-user { background: #ddd; }    
.filmPosterSection__awards, .subPageLinkBlock, .personAwardSection__container { background: #ccc; } 
.filmFriendComment__status .ico { color: #ccc; }    
.filmFriendComment--criticSection { background: #eee; }  
.commentMore--gradient::before, .newsNewestSection__showMore::before, .collapse__gradient::before { 
    background: linear-gradient(180deg,hsla(0,0%,100%,0),#ddd); 
}    
.commentForm__text { background: #eee; }    
.infiniteContentTerminator { background: none !important; } 
.castRoleListElement { background: #eee; }  
.awardsNavSection__groupContent { background: #eee; }  
.overlayLinks { background: #ddd; }    
.overlayLinks__link:not(.overlayLinks__link--active, .overlayLinks__link:hover) { background: #eee; }    
.descriptionSection__more { background: linear-gradient(90deg,hsla(0,0%,100%,.1),#ddd 20%); }    
.typeCounter__item, .filmInfo__info--group a { background: #ccc; }
.rankingSection { background: #d8d8d8; border-color: #aaa; }      
.socialMenu { background: #eee; } 
.sidebar .rankingUsersPage__header h2 { background-color: #ddd; } 
.dynamicTextField--expandable:not(.dynamicTextField--editing):not(.dynamicTextField--expanded) .dynamicTextField__value::after { background-image: linear-gradient(180deg,hsla(0,0%,100%,0) 4%,#ddd); }    
.filmActionBox__card, .roleActionBox__card, .worldOrCharacterActionBox__card { background: #eee; }   
.filmRatingAssistant__container, .filmRatingAssistant.isOpen .filmRatingAssistant__container { background-color: #dfdfdf; }  
.textInput--editable .textInput__text, .textInput__text > i::after { background: #ddd; }   
.wantToSeeStateButton__container, .notInterestedStateButton__container, .wantToSeeStateButton:not([data-value="0"]):not([data-value="-1"]).hasPanel.hasVoted .wantToSeeStateButton__container, .wantToSeeStateButton:not([data-value="0"]):not([data-value="-1"]):not(.hasPanel) .wantToSeeStateButton__container, .ratingSummary__button .button { background-color: #ddd; }   
.ratingSummary--compact.ratingSummary .ratingSummary__users { background-color: #ddd; }    
.btn-action { background: #ffcc00; color: #000; }    
.btn-action:hover { background: #aa6600; color: #fff; }    
.forumTopicSection__authorReply a { color: #555; }    
.personPosterSection__more { background: linear-gradient(to right,rgba(255,255,255,.1),#ddd 20%); }
.preview.previewCard, .personFilmographySection__itemInner { background-color: #eee; }
.voteCommentText--alabaster .voteCommentText__comment:not(.voteCommentText__comment--open) .voteCommentText__label
.voteCommentText--alabaster .voteCommentText__comment:not(.voteCommentText__comment--open) .voteCommentText__textarea, 
.voteCommentText--alabaster .voteCommentText__comment:not(.voteCommentText__comment--open) > i::after, 
.voteCommentText--alabaster .voteCommentText__comment:not(.voteCommentText__comment--open) { background: #ddd; }
.voteCommentText__comment { border-color: #ddd !important; }
.voteCommentText__comment > i::after, .voteCommentText__textarea, .voteCommentText__label, .voteCommentText__comment { background: #ddd; }
.voteCommentText__comment, .voteCommentText__comment > i { border-color: #ddd !important; }
.eventBox__reactions { background-color: #fff; }
.userFavoriteSection .posterInfoBox, .userTopRatedSection .posterInfoBox { background-color: #fff; }
    
} /* dimmerEnd */

} /* domainEnd */


@-moz-document domain("filmweb.pl") {
/* ------------------------------------------ */
/*                 Lights OFF                 */
/*              REL: 01.08.2018               */
/*              CFG: 24.06.2020               */
/* ------------------------------------------ */
    
#cmlPlaceholder { display: none; }  

if cmlTheme == dark { 
/* <tlo> */
html.screening .bodyWrapper, .bodyWrapper, .sidebar { background: #181818; }

.page:not([data-linkable="iriRcInternalPage"]) .page__content, 
.page:not([data-linkable="iriRcInternalPage"]) .page__wrapper, 
.page:not([data-linkable="iriRcInternalPage"]) .fa__wrapper { 
    background-color: #181a1b; 
}

/* ciemnoszary */
body.hasScreening .page { max-width: inherit; }
body.hasScreening .page__wrapper, /*body.hasScreening:not(.hasScreeningExpanded)*/ #site:not(.subpage-webVideoPage).deprecated .fa__wrapper { 
    background-color: #181a1b; 
}
body, body.hasScreening { background: #111 !important; color: #aaa; }
/* szary */ .skin-1:not(.screening) body { background: #181818 !important; color: #aaa; }
/* jasnoszary */ .skin-2:not(.screening) body { background: #222 !important; color: #aaa; }  

.skin--0 /* nowy ciemnoszary */ { background: #141414; border-color: #444; }
.skin--1 /* nowy szary */ { background: #181818; border-color: #444; }    
.skin--2 /* nowy jasnoszary */ { background: #222; border-color: #444; }

.settingsPage .mainSettings__groupItem:last-child .editForm__radios {
.control:nth-of-type(1) > span { text-indent: -9999px; }
.control:nth-of-type(1) > span::after { content: "ciemnoszary"; text-indent: 0; }
.control:nth-of-type(2) > span { text-indent: -9999px; }
.control:nth-of-type(2) > span::after { content: "szary"; text-indent: 0; }
.control:nth-of-type(3) > span { text-indent: -9999px; }
.control:nth-of-type(3) > span::after { content: "jasnoszary"; text-indent: 0; }
}
/* </tlo> */

.isInit.ribbon[data-state="1"]::after, .isInit.ribbon[data-state="2"]::after, .isInit.ribbon[data-state="3"]::after, .isInit.ribbon[data-state="4"]::after, .isInit.ribbon[data-state="5"]::after, .isInit.ribbon[data-state="6"]::after, .isInit.ribbon[data-state="7"]::after, .isInit.ribbon[data-state="8"]::after, .isInit.ribbon[data-state="9"]::after, .isInit.ribbon[data-state="10"]::after {
    filter: none !important; 
}

/* -------------------------------------------------- */

/* strony */
.pagination__item { color: #aaa; background: #222; border: 1px solid #666; }
.pagination__link { border-color: transparent !important; }
.pagination__item .pagination__link:hover { background-color: #181818 !important; }     
.pagination__item--is-active .pagination__link { color: #ffcc00; background-color: #333; }
.pagination__item--is-active .pagination__link:hover { color: #ffcc00 !important; background-color: #333 !important; }   

/* -------------------------------------------------- */

/* <szukajka> */
#searchMain .popularList, #searchResults .resultsList { background-color: #333; color: #ccc; }
#searchMain #searchResults .resultsList a, #searchMain #searchResults .resultsList span { color: #ccc; }
#searchMain #searchResults .resultsList li:hover { background-color: #222; }
#searchMain #searchResults .resultsList li.moreResultsInfo { background-color: #222; }
#searchMain #searchResults .resultsList li { background-color: #333; }
#searchMain #searchResults .resultsList li { border-color: #666; }
#searchMain .searchError { cursor: default; }
#searchMain .searchError:hover { background-color: transparent; box-shadow: none; }
.comboInput__input.comboInput__input--buttonWithin { background-color: #333; border-color: #666; color: #aaa; }
.comboInput__button { background: #ffc200; color: #000; }
#searchMain .search__submit { color: #ccc; }
#searchMain .search__submit:hover { color: #ffcc00; }
#searchOpener i { color: #ffcc00; }
#searchMain.focusOn { background-color: #333; }
#searchCloser i { color: #aaa; }
#searchCloser:hover i { color: #ddd; }
#searchMain.focusOn .search__submit { color: #ccc; }  
#searchMain.focusOn .search__submit:hover { color: #fff; }
#searchMain .form__input { color: #aaa !important; } 
#searchMain #searchForm fieldset { background-color: #333; }
.form__input, .placeholder__input { background: #222; color: #ddd; caret-color: #aaa; }
/* nowa */
div[data-v-app] {
.liveSearch .page__container { background: #333; }
.liveSearch { background: #111; }
.form__input { color: #aaa; }
.form__remove { background: #222; }
.form--search, .form, .resultItem__imageWrapper, .resultItem { border-color: #666; }
.resultItem__title { color: #aaa; }
.resultItem--advert::before { background: #282828; }
.promoted { color: #aaa; }
.promoted__button { color: #ffc404; }
.resultItem.active::before, .resultItem--advert::before { background-color: #222; }
}
/* new @ main, profile, results */
/*bg*/ .dhYYya, .vvWOA, .NyQAS, .smRpT { background-color: #111; }
/*box*/ .kINWWJ, .lnQXQi, .Uamez, .gNsgwC, .gPnrOg, .McRTl, .iCuXUO, .hWlIAt, .fUMurf, .cKYSzw, .jjUxai { background-color: #222; }
/*input*/ .lanrEC, .hwtorA, .ktoTRU, .ijUljd { color: #ccc; border-color: #222; background-color: #333; }
/*input fcs*/ .lanrEC:focus, .hwtorA:focus, .ktoTRU:focus, .ijUljd:focus { box-shadow: none; }
/*button*/ .cFyoXJ { background-color: #333; color: #ccc; }
/*btnhvr*/ .cFyoXJ:hover { background-color: #111; }
/*clear*/ .bJkILC, .iIkLCG, .kzOFoW, .ILWcp { background-color: #111; color: #aaa; border-color: #111; box-shadow: none !important; }
/*link*/ .JPmSI, .iDkWMY, .bwXWIz, .fFOKtV { color: #ffc404; }
/*title*/ .ffBNtn, .gDgna-D, .fxgEVU, .crWVKK { color: #aaa; }
/*more*/ .hTStlx, .cUSTkB, .ezWYsp, .bHecNP { background-color: #111; border-color: #111; }
/*morehvr*/ .hTStlx:hover, .cUSTkB:hover, .ezWYsp:hover, .bHecNP:hover { background-color: #333; border-color: #333; }
/*rslt*/ .ZqBoG, .hBSmts, .hSpMp { background-color: #222; color: #aaa; border-color: #222; }
/*rslt flair*/ .kKzCoe { background-color: #333; }
/*rslt usr*/ .fPjuCs { background-color: #333; border-color: #333; }
/*rslt usr hvr*/ .fPjuCs:hover { background-color: #444; border-color: #444; color: #ccc; }
/*rslt fltr*/ .jLqvfV { background-color: #222; border-color: #222; }
/*rslt fltr hvr*/ .jLqvfV:hover { background-color: #333; border-color: #333; color: #ccc; }
/*rslt bar */ .cqNwzk { background-color: #222; }
/*rlst bar btn*/ .iHgfgt { background-color: #333; border-color: #333; color: #aaa; }
/*rlst bar btn hvr*/ .iHgfgt:hover { background-color: #666; border-color: #666; color: #ccc; box-shadow: none; }
/*rslt adv*/ .kQOZvc::after { background-color: #333; }
/* </szukajka> */

/* -------------------------------------------------- */

/* <menu rozwijane> */
#mainMenu .menu__submenu { background: #333; }
#mainMenu .menu__submenu a { color: #ccc; }
#mainMenu .menu__submenu a:hover { color: #ffcc00; }
#userMenu .item-user.item-extra .list { background: #333; color: #ccc; }
#userMenu .user-extra .item.item__is-active .user-extra-button:hover { color: #ffcc00; }
#userMenu .item-user > a { color: #ccc; background: #333; }
#userMenu .item-user > a:hover { color: #ffcc00; }
.notificationsContainer .notify.btnShowMore, #userMenu .user-extra { color: #ccc; background: #333; border-color: #666; }
.notificationsContainer .notify.btnShowMore:hover { color: #ffcc00; }
.notificationsContainer .entryTitle b { color: #ffcc00; }
.notifyDetail { color: #ccc; }
.notifyDetail:hover { color: #ddd; }
.notificationsContainer .notify.seance { box-shadow: none; background-color: transparent; }
.dashboardAssistant .unreaded + .unreaded .element { box-shadow: none; background-color: transparent; }
.notificationsContainer .notifyParent { background: #222; border-color: #666; }
.notificationsContainer .notifyParent:hover { background: #444; }
.notificationsContainer .seance strong { color: #ffcc00; }
.dashboardAssistant .eventTitle a { color: #ccc; }
.dashboardAssistant .eventTitle strong, .entryTitle strong { color: #ffcc00; }
#assistantOpener, #notificatonsOpener { color: #ccc; }
#assistantOpener:hover, #notificatonsOpener:hover { color: #ffcc00; }
#mainMenu.open #userHeader { background-color: #333; border-color: #666; }
.body__locked #mainMenu.open #userHeader:hover { background-color: #222; }
#mainMenu.open .menuOpenerIcon { background-color: #333; }
#mainMenu.open .menuOpenerIcon span { background-color: #aaa; }
#mainMenu.open #siteMenuWrapper { background-color: #333; }
#mainMenu.open #siteMenuWrapper .item-top > a > span:hover { color: #ddd; }
.filmCastSection__otherCast::before { background-color: #666; }  
#header .notificationsContainer .notify.btnShowMore, #header #searchResults li a.btnShowMore, 
#header #searchResults .moreResultsInfo a { color: #aaa; border-color: #666; background-color: #333; }     
#header #searchResults .moreResultsInfo a:hover { color: #ccc; border-color: #666; background-color: #222; }  
.body__locked.overlay__on.mobile-menu-opened #mainMenu.open::before { background: #222; }
.body__locked.overlay__on.mobile-menu-opened .item-top .item-title { background-color: #222; color: #ccc; }
.body__locked.overlay__on.mobile-menu-opened #mainMenu.open #siteMenuWrapper .list--nested { background-color: #222; }
.body__locked.overlay__on.mobile-menu-opened .footer-list { background-color: #222; border-color: #666; }
.body__locked.overlay__on.mobile-menu-opened .footer-list .label { color: #aaa; }
.body__locked.overlay__on.mobile-menu-opened #siteMenuWrapper.stayAtHomePromo #stayAtHomeMenuLink { background-color: #333; }
.body__locked.overlay__on.mobile-menu-opened #siteMenuWrapper.stayAtHomePromo #stayAtHomeMenuLink > span { color: #ccc !important; }
.menu__extra { background-color: #222; }    
#mainMenu.open #siteMenuWrapper .list { background-color: #333; border-color: #666; }   
#mainMenu .item__new { color: #000; }   
.notificationsContainer .notifyImg.media__avatar { border-color: #222; }  
.notificationsContainer .notifyImg { background-color: transparent; }    
.notification + .notification { border-color: #444; }    
/* </rozwijane menu> */

/* -------------------------------------------------- */

/* <quizy> */
.quizImageLeadParent.quizElement { background: #333; }
.relatedQuizzes .singleQuiz.finished { border-color: #666; }
.quizVoteInfo, .finishedQuizInfo, .quizVoteBtn { color: #bbb; }
.relatedQuizzes .singleQuiz.finished .quizImageLead { color: #ccc; text-decoration-color: #ccc; }
.top-5 { color: #bbb; }
.bCommentForm .bCommentArea { background: #333; color: #bbb; }
.addCommentForm textarea { color: #bbb; }
.sbtn-wide { background: #333; color: #bbb; border: #666 1px solid; }
.sbtn-wide:hover { background: #ffcc00; color: #000; border: #ffcc00 1px solid; }
.userEvent.animatedPopList__item.userEvent--quiz { border: #444 1px solid; }
.quizResult__label, .polaroid__lead { color: #aaa; }
.quizResult__result { color: #bbb; }
.polaroid.polaroid--raised.polaroid--horizontal.polaroid--border, .polaroid.polaroid--small-mobile.polaroid--border { border: none; }
.polaroid.polaroid--userEvent, .polaroid.polaroid--userEvent.polaroid--raised { border: none; }
.polaroid.polaroid--raised.polaroid--horizontal .polaroid__caption, 
.polaroid.polaroid--small-mobile .polaroid__caption { background: #111; border-color: #444; }
.mainQuiz { background: #333; color: #bbb; }
.quizTitle { color: #ccc; }
.quizTitle a { color: #ccc; }
.text.quizDesc span { color: #ccc; }
.sticker { background: #222; border-color: #444; }
.qInfo-bottom.qInfo-small .quizVoteInfo.finishedQuizInfo.quizVoteBtn { color: #fff; background: rgba(0, 0, 0, 0.5); }
.qInfo-bottom.qInfo-small .quizVoteInfo.finishedQuizInfo.quizVoteBtn:hover { color: #000; background: rgba(255, 196, 4, 0.85); }
.answerContent { color: #ccc; }
.fwPrBtnGold.disabled, a.fwPrBtnGold.disabled, input[type="submit"].fwPrBtnGold.disabled, span.fwPrBtnGold.disabled, 
.fwPrBtnGold[disabled], a.fwPrBtnGold[disabled], input[type="submit"].fwPrBtnGold[disabled], 
span.fwPrBtnGold[disabled] { color: #333; background: #999; border: #666 1px solid; }
.quizPercentCont { color: #111; }
.quizResultDesc { color: #aaa; }
.answersList.results .correct .answerText span { color: #43b95b; }
.answersList.results .correct.selected .answerText span { color: #43b95b; }
.answersList.results .selected .answerText span { color: #ff5d60; }
.ellipsis.s-12 a, .quizFriendsResult .quizGradeDesc a { color: #ccc; }
.quizFriendsResult.quizKnowledgeFriendsResults .box.full-width a {color: #ccc }
.popularQuizzesSection__showMore::after { background: #111; }
.popularQuizzesSection__showMore::before { background: linear-gradient(0deg,#111,hsla(0,0%,100%,0)); }  
.quizQuestionsSection__description, .question .control__title, .quizResultSection__gradeContent, 
.quizResultSection__questionsHeader { color: #aaa; }    
.quizQuestionsSection__title, .question__title, .quizResultSection__title { color: #ccc; }    
.progressBar__bar { background-color: #333; }  
.quizQuestionsSection__header, .quizQuestionsSection__progressBar { background: none; }       
.progressBar--partial .progressBar__partial.active:not(:last-of-type), .question__answer:not(:last-of-type), 
.progressBar--partial .progressBar__partial.checked:not(:last-of-type) { border-color: #333; }   
.mouse .control--ico:hover input:not([disabled]):not(:checked) ~ .control__indicator::before, 
 .control--ico input:checked:not([disabled]) ~ .control__indicator::before { background: #000; }
.mouse .control--ico:hover input:not([disabled]):not(:checked) ~ .control__indicator::before { color: #ffcc00; }
.control:hover input:not([disabled]) ~ .control__indicator { border-color: #ffcc00; }    
.quizResultSection[data-type="KNOWLEDGE"] .quizResultSection__share { border-color: #666; }    
.question--disabled .question__answer .control--ico .control__indicator::before { color: #333; }
.friendsResultSection__header, .friendResult__name { color: #aaa; }
.percentCircle__svg > g:nth-child(1) > circle:nth-child(3) { stroke: #888; }    
.quizResultSection .control__indicator { background: none; }
.contestsQuestionnaresQuizzes .polaroid__caption { border: none; }  
/* </quizy> */

/* -------------------------------------------------- */

/* <ustawienia> */
.control--switchIcon input:checked + .control__label .ifw, 
.control--switchIcon input:checked + .control__label .control__text { color: #ffcc00; }
.fieldset__edit.link { color: #aaa; }
.fieldset__edit.link:hover { color: #ffcc00; }
.mainSettings__groupItemState .control--checkbox .control__title { color: #aaa; }
.mainSettings__group { border-color: #666; }
.section--userFavoriteCinema .noResultsInfo--alabaster { background-color: #222; }
.section--addToFavoriteCinema .citiesList > .slumpdown--searchable .slumpdown__inputLabel:valid, .section--addToFavoriteCinema .cinemasList > .slumpdown--searchable .slumpdown__inputLabel:valid { background-color: #333; color: #ccc; }
.section--addToFavoriteCinema .fwBtn, .section--addToFavoriteCinema .buttonsContainer button, 
.buttonsContainer .section--addToFavoriteCinema button { color: #111; }
.cinema__thumbnail { background-color: #333; }    
.cinema { border-color: #666; }
.cinema__desc { background-color: #222; }
.section--userChannels .mainSettings .hoverMenu .hoverMenuBtn:not(:nth-of-type(2))::before { background-color: #666; }
.mainSettings__countWrapper { border-color: #666; background-color: #222; }
.editForm .slumpdown__button { background-color: #222; }
.section--userSettingsNotifications .mainSettings__thGroup { background-color: #222; }
.text-link { color: #ffcc00; }
.text-link:hover { color: #976103; }
.socialConnectBox { background-color: #222; border-color: #666; box-shadow: 0 1px 0 0 #444, 0 1px 0 0 #444 inset; }
.socialConnectBox__header { color: #ccc; }
.mainSettings__groupItemStateContent, .mainSettings__groupDesc, .control__label, .control__title, .mainSettings__count, .editForm__label, .section--userSettingsPrivacy .editForm .slumpdown__button, .mainSettings__th { color: #aaa; }
.control--switchIcon .control__label:hover .control__text, .control--switchIcon .control__label:hover .ifw { color: #ffcc00; }
.control--switchIcon .control__label, .control--switchIcon input:checked ~ .control__indicator { border-color: #666; }    
.control--switchIcon .control__label { border: #666 1px solid; background-color: #333; }
.control--switchIcon input + .control__label .control__text, .control--switchIcon input + .control__label .ifw { color: #aaa; }    
.control--switchIcon input:checked + .control__label { background: #ffcc00; border-color: #ffcc00; }
.control--switchIcon input:checked + .control__label .control__text, 
.control--switchIcon input:checked + .control__label .ifw { color: #000; }
.channel { background-color: #222; }
.channel:hover { background-color: #666; color: #111; }
.channel__button .ico { color: #aaa; }
.channel__button:hover .ico { color: #ffcc00; }
.channel::before { box-shadow: inset 0 0 0 1px #666; }
.channel:hover::before { box-shadow: inset 0 0 0 1px #999; }
.editForm__inputText { background-color: #222; border-color: #666; color: #ccc; }
.editForm__inputText:focus { border-color: #aaa; }
.dateInput__input { background-color: #222; border-color: #666; }
.dateInput__input:hover { background-color: #333; }    
.dateInput__input--selected { border-color: #aaa; background-color: #282828 !important; }
.dateInput__input--selected::before { border-bottom-color: #222; }    
.datePicker--simple .datePicker__picker { background-color: #222; }
.datePicker__button:hover span { background-color: #444; }
.datePicker--simple .datePicker__nav { background-color: #333; color: #aaa; }
.datePicker--simple .datePicker__nav:hover { background-color: #111; }
.dateInput__datePicker::before { border-color: #222; }
.editForm__buttons { border-width: 1px; }
.editForm__cancelBtn { background-color: #222; }
.editForm__buttons .fwBtn--gold { background-color: #ffcc00; color: #000; border: none; }
.editForm__buttons .fwBtn--gold:hover { background-color: #aaa; }
.editForm__fieldestInputInfo .editForm__btnOpenPopup, .editForm__fieldestInputInfo a { color: #ffcc00; text-decoration: none; }
.editForm__fieldestInputInfo .editForm__btnOpenPopup, .editForm__fieldestInputInfo a:hover { color: #ffcc00; text-decoration: underline; }
.slumpdown--searchable .slumpdown__inputLabel:valid { background-color: #222; color: #aaa; }
.changeAvatar .selectFile__input + label { background-color: #222; }
.changeAvatar .selectFile__input + label:hover { background-color: #333; }
.changeAvatar .selectFile__input + label.gold { background: #ffcc00; color: #333; }
.changeAvatar .selectFile__input + label.gold:hover { background: #ddd; color: #222; }
.flexTable__header { background-color: #222; }
.flexTable .blog, .flexTable .topic, .flexTable .blog__nameLabel, .flexTable .forum__nameLabel, 
.settingsSubNavigationSection .navList.NavList { border-color: #666;  }
.mainSettings__groupItem::before, .mainSettings__groupItem::after { background: #111 !important; }  
.dateInput__input--empty + .dateInput__input--empty { background-color: #222; color: #aaa; }    
.notificationTable::after, .notificationTable::before { background-color: transparent; }   
a.stdButton:hover, div.stdButton:hover, input.stdButton:hover, button.stdButton:hover, .dropdownMenu:hover .dropdownBtn { 
    color: #ccc; 
    background-color: #222; 
}    
.sendMessageForm .submitButton { padding: 5px; }    
.control__indicator { border-color: #666; background: #333; }    
.mouse .control:hover input:not([disabled]):not(:checked) ~ .control__indicator { background: #333; }  
.mouse .control--checkbox:hover input:not([disabled]):not(:checked) ~ .control__indicator::after { border-color: #ffcc00; }   
.control--radio .control__indicator::after { box-shadow: none; width: 1rem; height: 1rem; left: 0; top: 0; }
.channel__img[src="https://fwcdn.pl/chan/53.1.png"], .channel__img[src="https://fwcdn.pl/chan/49.1.png"], .channel__img[src="https://fwcdn.pl/chan/380.1.png"], .channel__img[src="https://fwcdn.pl/chan/381.1.png"], .channel__img[src="https://fwcdn.pl/chan/347.1.png"], .channel__img[src="https://fwcdn.pl/chan/260.1.png"], .channel__img[src="https://fwcdn.pl/chan/398.1.png"], .channel__img[src="https://fwcdn.pl/chan/408.1.png"] { 
    filter: invert(87%) hue-rotate(185deg); 
}
.settingsPage .navList--bordered, .mainSettings__group { border-color: #444 !important; }
/* </ustawienia> */

/* -------------------------------------------------- */

/* <footer> */ 
.siteFooterSection, .IRI .siteFooterSection { background: #222; }
.siteFooterSection__recentlyViewed .recentlyViewed__btn, .IRI .siteFooterSection__recentlyViewed .recentlyViewed__btn { color: #ffcc00; }
.mouse .siteFooterSection__sitemap .sitemap__links a, .no-touch .siteFooterSection__sitemap .sitemap__links a, 
.mouse .IRI .siteFooterSection__sitemap .sitemap__links a, .no-touch .IRI .siteFooterSection__sitemap .sitemap__links a { color: #aaa; }
.mouse .siteFooterSection__sitemap .sitemap__links a:hover, .no-touch .siteFooterSection__sitemap .sitemap__links a:hover, 
.mouse .IRI .siteFooterSection__sitemap .sitemap__links a:hover, 
.no-touch .IRI .siteFooterSection__sitemap .sitemap__links a:hover { color: #ffcc00; }
.siteFooterSection__copyLinks a, .siteFooterSection__copyLinks li, 
.IRI .siteFooterSection__copyLinks a, .siteFooterSection__copyLinks li { color: #aaa; }
.mouse .siteFooterSection__copyLinks a:hover, .no-touch .siteFooterSection__copyLinks a:hover, 
.IRI .siteFooterSection__copyLinks a:hover { color: #ffcc00; }       
.mouse .siteFooterSection__sitemap .sitemap__socialLogos a:hover .ico, 
.no-touch .siteFooterSection__sitemap .sitemap__socialLogos a:hover .ico, 
.mouse .IRI .siteFooterSection__sitemap .sitemap__socialLogos a:hover .ico,
.no-touch .IRI .siteFooterSection__sitemap .sitemap__socialLogos a:hover .ico,
.mouse .siteFooterSection__footer a:hover, .no-touch .siteFooterSection__footer a:hover, 
.mouse .IRI .siteFooterSection__footer a:hover, .no-touch .IRI .siteFooterSection__footer a:hover { color: #ffcc00; }      
.mouse .IRI .siteFooterSection__sitemap .sitemap__socialLogos a:hover .ico, 
.no-touch .IRI .siteFooterSection__sitemap .sitemap__socialLogos a:hover .ico { color: #ffcc00; }    
.siteFooterSection__appDownload, .infiniteContentTerminator { background-color: #333; }
/* </footer> */

/* -------------------------------------------------- */

/* <films, serials, games - main> */
.hdr-big { color: #ddd; } 
.s-16 { color: #ffcc00; }
.s-16 a { color: #ffcc00; }
.top-10 a { color: #ffcc00; }
.epTitle { color: #ccc; }
.link-btn { color: #ddd; }
.link-btn:hover { color: #ffcc00; }
#watchListWrapper .sbtn { background: #333; color: #ddd; border-color: #666; }
#watchListWrapper .sbtn:hover { background: #ffcc00; color: #000; border-color: #ffcc00; }
.allLink, .cap { color: #aaa; }
.moreBtn { background: #222; color: #ccc; border-color: #666; }
.moreBtn:hover { background: #ffcc00; color: #000; border-color: #ffcc00; }
.newsTitle, .link-btn, .newsContent, .text { color: #ccc; }
.newsTitle a { color: #ccc; }
.maxlines-2, .bottom-5 { color: #ffcc00; }
.box-top { color: #ccc; }
.cap { color: #bbb; }
.hdr a { color: #ddd; }
.firstCol, .center, .place { color: #bbb; }
.skin-2 .niceTable tbody td { border-bottom-color: #666; }
.skin-1 .niceTable tbody td { border-bottom-color: #666; }
.niceTable tbody td { border-bottom-color: #666; }
.newsWrapper { background: #222; padding: 5px; border: #333 1px solid; }
.hdr a.link, .link, .text a, .fbtn { color: #ffcc00; }
.hdr a.link:hover, .link:hover, .text a:hover, .fbtn:hover { color: #ddd; }
.filmInfo a { color: #ddd; }
.filmInfo a:hover { color: #ffcc00; }
.filmCast a { color: #ddd; }
.filmCast a:hover { color: #ffcc00; }
.filmMenu a { color: #ffcc00; }
.filmMenu { color: #aaa; }
#watchListWrapper .entityPoster img, .upcomingSerialsEpisodes .entityPoster img { color: #aaa; }
.entityDesc .getMoreBtn:hover { background-color: transparent; }
.serials.cleanPage #watchListWrapper .cl.seSingle.element .s-16 { color: #ffcc00; }
.video-description__titles { color: #aaa; }
.video-description__title { color: #ccc; }
.video-description__title:hover { color: #ffcc00; }
.upcomingSerialsEpisodes .content > div + div, #watchListWrapper .seSingle + .seSingle { border-color: #666; }
.serials.cleanPage .withoutRibbon .linkDescBottom span { color: #fff; }
.serials.cleanPage .withoutRibbon .linkDescBottom:hover span { color: #ffcc00; }
.titlesReview__review .filmPreview, .titlesReview__review .filmPreview__card { border: none; background-color: transparent; }
.advertisingPolaroidsSection .crs::after { background-color: #222; }
.review__readMore { color: #ddd; }
.review__readMore:hover { color: #ffcc00; }
.video-linked--desktop::after { background-color: transparent; }
.labelBox--gray { background-color: #666; color: #111; }
.recommendItemPanel--popup .recommendItem__card { background-color: #333; color: #ccc; } 
.serialCard__listBox { background-color: #333; }
.serialCard__listTitle { background-color: #222; }
.serialCard__listTitleLink { color: #ccc; }
.serialCard__listTitleLink:hover { color: #ffcc00; }
.serialCard__list { background-color: #333; }
.serialCardList { background-color: #333; color: #ccc; }
.serialCardList .episodeRatingBox { border-color: #666; }
.serialCard__list .episodeRatingBox { background-color: #333; }
.serialCard__list .episodeRatingBox__title { color: #ccc; }
.serialCard__list .episodeRatingBox__info { color: #aaa; } 
.serialCardList--open .serialCardList__seasonHeader { background-color: #282828; border-color: #666; } 
.serialCardList__season:not(.serialCardList__season--open)::after { border-color: #666; }    
.serialCard__list .ribbon--deprecated::before { color: #666; } 
.tooltip.tooltip--white .tooltip__option { background-color: #222; color: #aaa; }    
.tooltip.tooltip--white .tooltip__option:hover { background-color: #333; }    
.serialCardList__back .icoButton { filter: invert(100%); }
.navList__item[data-value="playnow"] .navList__text span { filter: invert(100%); }   
.navList__item[data-value="playnow"]:hover .navList__text span { filter: invert(75%); }   
.canalPlusPage .page__subtitle, .page__subtitle h2 { color: #ccc; } 
#canalPlusOffer .canalPlusOfferItem__subtitle { color: #aaa; } 
.titlesPreviewSection .filmPreview__extraYear, .titlesPreviewSection .filmPreview__filmTime, .titlesPreviewSection .filmPreview__originalTitle, .titlesPreviewSection .filmPreview__seasonsCount { color: #aaa; }  
.whySection, .whySection__bottom { background: #222; }    
.whySection__subtitle { color: #aaa; }    
.advertButton--dark a, .isDark .advertButton a { background-color: #181818; }    
.straightFromCinemaSection .simplePoster { background-color: #222; }    
.titlesPreviewSection .crs__item .simplePoster { background-color: #222; }    
.crs--polaroids .playDrawMovieSection__card--first.crs__item { filter: invert(85%) hue-rotate(170deg); }    
.mouse .div:not(filmMainRelatedsSection__item) .simplePoster:hover::before { background: #333; }    
[data-group="vodPage"] .page__group[data-group="g2"] .vodCommonSection .page__container, 
[data-group="vodPage"] .page__group[data-group="g2"] .vodProvidersSection .page__container { background: #222; }
[data-group="vodPage"] .page__group[data-group="g2"] .vodCommonSection .navList--primary .navList__text, 
[data-group="vodPage"] .page__group[data-group="g2"] .vodCommonSection .navList--tertiary .navList__text, 
[data-group="vodPage"] .page__group[data-group="g2"] .vodCommonSection .navList--primary .navList__button, 
[data-group="vodPage"] .page__group[data-group="g2"] .vodCommonSection .navList--tertiary .navList__button { color: #aaa; }
.personRole__title { color: #aaa; }
#filmsPopularFilms .filmPreview__extraYear, 
#filmsPopularFilms .filmPreview__filmTime, 
#filmsPopularFilms .filmPreview__originalTitle, 
#filmsPopularFilms .filmPreview__seasonsCount { color: #fff !important; }
#filmsPopularFilms .communityRatings__description { color: #ddd; }
.wantToSeeStateButton__container:hover, .notInterestedStateButton__container:hover, 
.ratingStats__content:hover { background-color: #181818 !important; }
.infiniteContentLoader { background-color: #333; }
/* </films, serials, games - main> */

/* -------------------------------------------------- */

/* <tv> */
.channelSearchWrap, .search-box, .input-text { background: #222; color: #ccc; border-color: #666; box-shadow: none !important; }
.channelSearchWrap:focus, .search-box:focus, .input-text:focus { background: #282828; color: #ddd; border-color: #ffcc00; }
.alert { background: #333; color: #ccc; border-color: #666; text-shadow: none !important; }
.dropdown-menu { background: #333 !important; color: #aaa !important; border: none !important; border-radius: 0px !important; }
.guide-carousel { color: #aaa !important; }
.link-btn { color: #aaa !important; border: none !important; }
.link-btn:hover { background: #222 !important; color: #aaa !important; }
#platformSelect .dropdown-toggle { color: #ddd; background: #222; border-color: #666; }
#platformSelect .dropdown-toggle:hover { background: #333 !important; border-color: #ffcc00; }
#dayDropdown .dropdown-toggle { color: #ffcc00 !important; box-shadow: none !important; background-color: transparent !important; }
#dayDropdown .dropdown-toggle:hover { border-bottom-color: #ffcc00 !important; }
#channelTypeFilters { background: #222; color: #ccc; border-color: #666; }
.channel-types-box:not(.active) .channel-type-label:hover, #channelTypeFilters .dropdown-toggle:hover { background: #333 !important; }
.channel-types-box { background-color: transparent; } 
#channelTypeFilters .dropdown-body { border: 1px solid #666; }
#channelTypeFilters .dropdown-body:hover { border-color: #ffcc00; background-color: #333; }
#tvGuideHeaderLine h1 { color: #ccc; }
.nav-bar > li a, .nav-bar > li span { color: #ccc; }
.nav-bar > li.active a, .nav-bar > li.off.active a, .nav-bar > li.active span, .nav-bar > li.off.active span { color: #000; }
#timeSwitcher, #wtsSwitcher, #favSwitcher { background: #222; color: #aaa; border-color: #666; }
.tvGuide #typeSwitcher { color: #aaa; border-color: #666; background-color: #222; }
.person .mainColWrapper #typeSwitcher li { border: none; }
.person .mainColWrapper .sbtn-switcher > li > button:hover { border-color: #ffcc00; }
.person .mainColWrapper #typeSwitcher .on:hover, 
.person .mainColWrapper #activitySwitcher .on:hover { cursor: default; }
.tvGuide #timeSwitcher li, .tvGuide #wtsSwitcher li, .tvGuide #favSwitcher li, 
.tvGuide #typeSwitcher li { border: 1px solid #666; }
.tvGuide #timeSwitcher li:hover, .tvGuide #wtsSwitcher li:hover, .tvGuide #favSwitcher li:hover, 
.tvGuide #typeSwitcher li:hover { border: 1px solid #ffcc00; }
.tvGuide #timeSwitcher li.active, .tvGuide #wtsSwitcher li.active, .tvGuide #favSwitcher li.active, 
.tvGuide #typeSwitcher li.active { border: 1px solid #ffcc00; }
.tvGuide #wtsSwitcher li.active:hover, .tvGuide #favSwitcher li.active:hover, 
.tvGuide #typeSwitcher li.active:hover { border: 1px solid #ccc; background-color: #ccc;  }
#timeSwitcher li.active:hover { cursor: default !important; border: 1px solid #ffcc00; background-color: #ffcc00 !important; }
.tvChannelIco:hover { background: #666 !important; border-radius: 5px !important; }
.seance a, #seanceReflector a { color: #ffcc00 !important; }
.tvGuideGrid, .show-evening { background-color: #181818 !important; color: #ddd !important; }
.tvGrids { border-bottom: #ddd 1px solid; }
.tvGrids .element.off .channel { background-color: #111 !important; }
.pkc, .pkc-wrapper { border-color: #ddd; }
.channelInfo { background: #333; color: #ddd; border-color: #333; }
.channelInfo h2 { color: #ddd !important; }
.channelInfo:hover { background: #666; border-color: #666; }
.seance { background: #222; color: #ddd; border-color: #444; }
.seance:hover { padding: 10px 10px 10px 5px; border-top: none; border-left: none; border-right: none; border-color: #444; }
.seance:hover { background-color: #181818 !important; border-top-color: transparent !important; }    
.seance.current { background: #111 !important; }
#seanceReflector { background: #111 !important; color: #bbb !important; border: #333 1px solid; }
.seanceAttributes, .seanceDuration { color: #aaa !important; }
.seance .st, .seance .sh { color: #aaa !important; }
.tvGrids .buttons { background: #555 !important; color: #ccc !important; border-color: #666; }
.tvGrids .buttons:hover { background: #aaa !important; color: #333 !important; border-color: #666; }
#tvGuideExclaimer { color: #fff !important; }
.percentBar { background: #ffcc00 !important; }
#channelTypeFilters .dropdown-toggle:not(active) { border-color: #666; }
#channelTypeFilters .dropdown-toggle:active { border-color: #ffcc00; }
#channelTypeFilters .dropdown-toggle:hover { border-color: #ffcc00; }
.channel-types-box.active .channel-type-label { color: #000 !important; }
.channel-types-box.active #channelTypeFilters .dropdown-toggle:not([disabled]) { color: #000 !important; }
.channelInfo .btnFav:hover { color: #ffcc00 !important; text-decoration: none !important; }
.nodata-info { background-color: #222 !important; }
#timeSwitcher li.active, #wtsSwitcher li.active, #favSwitcher li.active, #typeSwitcher li.active { background-color: #ffcc00 !important; }
.channel-types-box.off .channel-type-label, #channelTypeFilters.off .dropdown-toggle, 
#platformSelect.off .dropdown-toggle { background-color: #111; }
.tvGrids .pkc .pkc-wrapper { background: repeat url("https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjqNtAFZwdBf9LXfgdPThg5AHVsE8QcCCApEytQ3qKab6LF-hsqqvpWQlxWSHlcPab-m1wOUd-hsLpvTwkFOT29Z6YBKvB8YWosmRV1xBW7YVyw8FVW7vJev4Dy22WG4ntfMvp9ScOWebafKruudqnq6LC2-06ednbmxlgJcYU5T8yajtu8Sk_zBYcuuw/s200/upNborder.png") 0 0; }
.dayInfo { background-color: #333; }
.tvGrids .element .channel .dayInfo { background-color: #444; }   
.dayInfo:hover { color: #ddd; }
.dayInfo.s-16 { background-color: #333 !important; }
.guideGrid, .tvGrids { border-color: #444; background-color: #444; }
#timeTypeSwitcher .icon-small-expandArr { filter: invert(100%); }   
.playNowCampaign #dayDropdown label { color: #bc8bff; }   
.playNowCampaign .nav-bar > li.active a, .playNowCampaign .nav-bar > li.active span { color: black; }    
.playNowCampaign body { background: #111 !important; }   
.s-16:hover { color: #ccc; }    
.rTvChannel_53 { filter: invert(91%); }
.rTvChannel_53:hover { filter: invert(91%) hue-rotate(185deg); }  
.hits .hits__item { background-color: #222; }    
.seance.has-reflector:not(:hover) { background-color: #181818; }  
#dayDropdown .dropdown-toggle { border-style: dashed; }   
.posterInfoBox__channel img[src="https://fwcdn.pl/chan/53.1.png"], .posterInfoBox__channel img[src="https://fwcdn.pl/chan/49.1.png"] { filter: invert(73%) hue-rotate(180deg); }    
.single .channel.on .channelInfo { border-color: #666; } 
.single .channel.on .channelInfo:not(:hover) { background-color: #444 !important; }    
.nav-bar > li.active a, .nav-bar > li.off.active a, .nav-bar > li.active span, .nav-bar > li.off.active span { color: #000 !important; } 
.toggleFullTextWrap .ico--arrowDown::before { color: #aaa !important; }    
img[src="https://fwcdn.pl/chan/408.0.png"] { filter: invert(85%) hue-rotate(180deg); }
.channel-types-box.active #channelTypeFilters .dropdown-toggle:not(:hover) .icon-small-expandArr { filter: none !important; }
.seance .scheck .scheck-button { background: #111; padding: 0 10px 0 5px; }
.seance .scheck .scheck-button::after { padding-left: 1px; }
/* </tv> */

/* -------------------------------------------------- */

/* <carousel> */
.bornTodayList.section .Carousel__button-next, .fwPrograms.Tabs.hasSpecialButton .Carousel__button-next, 
.fwmNewsList .Carousel__button-next, .slideshowMain.section .Carousel__button-next, .popularFilmsOfDay .Carousel__button-next, 
.programsInTV .Carousel__button-next, .filmPremieres .Carousel__button-next, .gamesSlider.section .Carousel__button-next, 
.gamePremieres.section .Carousel__button-next {
    box-shadow: -5px 5px 0px 0px hsla(50,0%,25%,0.25);
    border: #111 2px solid;
    background-color: #ffcc00;
    color: #000;
}
.bornTodayList.section .Carousel__button-next:hover, .fwPrograms.Tabs.hasSpecialButton .Carousel__button-next:hover, 
.fwmNewsList .Carousel__button-next:hover, .slideshowMain.section .Carousel__button-next:hover, 
.popularFilmsOfDay .Carousel__button-next:hover, .programsInTV .Carousel__button-next:hover, 
.filmPremieres .Carousel__button-next:hover, .gamesSlider.section .Carousel__button-next:hover, 
.gamePremieres.section .Carousel__button-next:hover { box-shadow: -5px 5px 0px 0px hsla(50,0%,50%,0.25); color: #111; }
    
.bornTodayList.section .Carousel__button-prev, .fwPrograms.Tabs.hasSpecialButton .Carousel__button-prev, 
.fwmNewsList .Carousel__button-prev, .slideshowMain.section .Carousel__button-prev, .popularFilmsOfDay .Carousel__button-prev, 
.programsInTV .Carousel__button-prev, .filmPremieres .Carousel__button-prev, .gamesSlider.section .Carousel__button-prev, 
.gamePremieres.section .Carousel__button-prev {
    box-shadow: 5px 5px 0px 0px hsla(50,0%,25%,0.25);
    border: #111 2px solid;
    background-color: #ffcc00;
    color: #000;    
}
.bornTodayList.section .Carousel__button-prev:hover, .fwPrograms.Tabs.hasSpecialButton .Carousel__button-prev:hover, 
.fwmNewsList .Carousel__button-prev:hover, .slideshowMain.section .Carousel__button-prev:hover, 
.popularFilmsOfDay .Carousel__button-prev:hover, .programsInTV .Carousel__button-prev:hover, 
.filmPremieres .Carousel__button-prev:hover, .gamesSlider.section .Carousel__button-prev:hover, 
.gamePremieres.section .Carousel__button-prev:hover { box-shadow: 5px 5px 0px 0px hsla(50,0%,50%,0.25); color: #111; }
/* </carousel> */

/* -------------------------------------------------- */

/* <showtimes> */
.vertical-align, .cinemasSort, .cinemaLink { color: #ccc !important; }
.boxContainer .box:first-child, .recommLvl { color: #aaa !important; }
.sidebar .dropdown-toggle.sbtn, .mainCol .dropdown-toggle.sbtn {
    color: #ccc !important;
    background-color: #333 !important;
    border-color: #666;
}
.sidebar .dropdown-toggle.sbtn:hover, .mainCol .dropdown-toggle.sbtn:hover {
    color: #000 !important;
    background-color: #ffcc00 !important;
    border-color: #ffcc00 !important;
}
.sidebar .dropdown-toggle.sbtn:focus, .mainCol .dropdown-toggle.sbtn:focus {
    color: #000 !important;
    background-color: #ffcc00 !important;
    border-color: #ffcc00 !important;
}
.sidebar .dropdown-toggle.sbtn:hover, .mainCol .dropdown-toggle.sbtn:hover { border-color: #976103 !important; }
.nav-bar, .day-switcher { background-color: #222 !important; border-color: #666 !important; }
.nav-bar > li { border-color: #666 !important; }
.nav-bar > li:not(.active):hover { background-color: #333; }    
.nav-bar > li.off { background-color: #151515 !important; border-color: #666 !important; }
.nav-bar > li.active, .nav-bar > li.off.active { border-color: #ffcc00 !important; }
#showCinemasWithoutSeances { color: #ffcc00 !important; }
#showCinemasWithoutSeances:hover { color: #ddd !important; }
.recomm-graph-small { background-image: url("https://2.bp.blogspot.com/-cYBfe48yFDM/W1Do7r_nAZI/AAAAAAAAD10/1_WDcNjHJXIcOAJW_Z4G5YYWJ02Xbp60gCLcBGAs/s1600/set43dark.png") !important; }
.ribbonParent .notSeenYet .ribbonBg { color: #999 !important; }
.zoom-1 { color: #aaa !important; }
.seances-table .attr { color: #aaa !important; }
.otherCinemasList li { border-color: #666 !important; }
.city-films > li { border-color: #666 !important; }
.favoriteCinemas li + li { border-color: #666 !important; }
.city-films .films-last-border::before { background-color: #666; }    
.fwPlusBtn--wide, .fwPlusBtn--big, .fwPlusBtn { opacity: 0.75; }    
.fwPlusBtn--wide:hover, .fwPlusBtn--big:hover, .fwPlusBtn:hover { opacity: 1; } 
.showtimesSort .dropdown-toggle:not(:hover):not(:focus) .icon-small-expandArr, 
.showtimesFilter .dropdown-toggle:not(:hover):not(:focus) .icon-small-expandArr { filter: invert(100%); }    
.sweetPage .nav-bar > li.active a, .sweetPage .nav-bar > li.off.active a { color: #aaa; }   
.sweetPage .nav-bar > li.active span, .sweetPage .nav-bar > li.off.active span { color: #111; }     
.sweetPage .filmPreview__card { background-color: #222 !important; }    
.nav-bar > li.off.active span { color: #aaa !important; }    
/* </showtimes> */

/* -------------------------------------------------- */

/* <profil> */
.ad__page-wrapper { background-color: #111 !important; }
.registerStepWrapper { background-color: #333 !important; color: #ccc !important; }
.registerBtn { color: #ddd !important; }
.registerBtn .link { color: #ffcc00 !important; }
.togglePasswordFieldType { color: #ffcc00 !important; }
.rbtn.rbtn-google.top-20 { color: #fff !important; }
.rbtn.rbtn-primary.top-10.step-submit { color: #000 !important; }
.hr-2 { border-color: #666 !important; }
.link-btn.link:hover { box-shadow: none !important; background-color: transparent !important; color: #ccc !important; }
.rinp { background-color: #222 !important; border-color: #666 !important; }
.rinp input { color: #ccc !important; }
.filmwebLogoBlack { background: url(https://2.bp.blogspot.com/-tPx_b_609PQ/W2WyVu7pDVI/AAAAAAAAD24/lNocwOwXPQUIFKz7ymQL5FA0_313BUp7gCLcBGAs/s1600/revLogoLight.png) !important; }
.dynamicTextField__area { color: #666 !important; }
.dynamicTextField__placeholder:hover { color: #aaa !important; }
.dynamicTextField--editing .dynamicTextField__area { background-color: #333 !important; border-color: #444 !important; }
.dynamicTextField--editing .dynamicTextField__textarea { color: #bbb !important; }
.dynamicTextField__value { color: #aaa !important; }
.sectionUserInfo__userAbout .dynamicTextField { border-color: #333 !important; }
.posterInfoBox:hover { box-shadow: 0px 0px 10px 0px #111 !important; }
.posterInfoBox:hover a { color: #ffcc00 !important; }
.userProfileHeader .user__name { color: #fff !important; text-shadow: 2px 2px 0px #111 !important; }
.userProfileHeader .user__avatar .avatar__link { box-shadow: 2px 2px 0px #111 !important; }
.userProfileHeader .user__avatar .avatar.avatar--online::after { box-shadow: 2px 2px 0px #111 !important; }
.userProfileHeader, .user__menu, .list--horizontal, .doubleFixedMenu__menuContainer {
    background-color: #111; 
    color: #ddd;
    border: none;   
}
.section__header .sub-tabs .list { background-color: #111 !important; }
.userProfileHeader .user__menu::before { border: none !important; }
.section__header { border: none !important; }
.hoverMenu__btn { background-color: transparent !important; box-shadow: none !important; }
.hoverMenu__btn:hover { background-color: transparent !important; box-shadow: none !important; color: #ffcc00 !important; }
.hoverMenu, .hoverMenuBtn { background-color: #333 !important; color: #ddd !important; }
.hoverMenuBtn:hover { background-color: #222 !important; color: #ddd !important; }
.hoverMenu::before { border-color: #333 transparent transparent; }
.TabsNavGroup { background-color: #333 !important; color: #ddd !important; border-color: #666 !important; }
.TabsNavGroup .item:hover { background-color: #888 !important; color: #000 !important; font-weight: bold !important; }
.sectionUserInfo__since { color: #aaa !important; }
.userProfileHeader .user__menu .TabsNav--head .item--others-group .TabsNavGroup { border-top: none !important; }
.doubleFixedMenu__fixed .user__menu .TabsNav--head .item--others-group .TabsNavGroup { margin-top: -1px !important; }
.doubleFixedMenu__fixed .user__firstName, .doubleFixedMenu__fixed .user__name { color: #ddd !important; }
.doubleFixedMenu__fixed .user__firstName, .doubleFixedMenu__fixed .user__name:hover { color: #ffcc00 !important; }
.blockHeader__title, .noResultsPlaceholder__header { color: #ccc !important; }
.posterInfoBox__header { background-color: #333 !important; }
.posterInfoBox__link { color: #ddd !important; }
.posterInfoBox__link:hover { color: #ffcc00 !important; }
.posterInfoBox__year, .posterInfoBox__personYears, .posterInfoBox__datePremiere { color: #ccc !important; }
.userGenres { background-color: #222 !important; border-color: #666 !important; }
.barsListBox__label { color: #aaa !important; }
.barsListBox__label:hover { color: #ddd !important; }
.posterInfoBox__personRate { background-color: #151515 !important; color: #ddd !important; border: #ddd 2px solid; }
.fwBtn--center { background-color: #222 !important; color: #ccc !important; border-color: #666 !important; }
.fwBtn--center:hover { background-color: #181818 !important; color: #aaa !important; }
.slideshowMain, .promoNewsList, .setcion__trailers, .TabsContainer, .rankingsList, .contestsQuestionnaresQuizzes, .Tabs.section, .bornTodayList, .gamesSlider, .gamePremieres { background-color: #111 !important; color: #ccc !important; }
.section__subtitle {
    background-color: #333 !important; 
    color: #ccc !important; 
    border: #aaa 2px solid !important; 
    padding: 5px !important; 
}
.filmReviewsList__item .review, .CarouselItem .review { background-color: #222 !important; color: #fff !important; }
.review.review--raised .review__inner { background-color: #222 !important; }
.review__description, .review__header { background: #333 !important; color: #ccc; }
.review__movie, .review__title { color: #ddd !important; }
.page__container .review { background-color: transparent; }
.page__section--white { background-color: #111 !important; }
.review__shortDesc, .review__authorName { color: #aaa !important; }
.posterInfoBox__channel { background: #444; } 
.posterInfoBox__channelName, .posterInfoBox__channelDate { color: #bbb !important; }
.polaroid__caption {
    background: rgba(51, 51, 51, 0.5);
    border: rgba(111, 111, 111, 0.75) 1px solid;
    padding-left: 15px;
    padding-right: 15px;
    padding-bottom: 15px;
}
.polaroid__title a, .polaroid__title span { color: #ccc !important; }
.polaroid__title a:hover { color: #ffcc00 !important; }
.polaroid__meta { color: #bbb !important; }
.posterInfoBox--rankings .posterInfoBox__meta { background-color: #222 !important; color: #ccc !important; }
.posterInfoBox--rankings .posterInfoBox__meta:hover { background-color: #999 !important; color: #222 !important; }
.fwBtn--submenu { color: #bbb !important; }
.fwBtn--submenu:hover { color: #ffcc00 !important; border: #666 1px solid; }
.item__is-active .fwBtn--submenu { color: #111 !important; }
.item__is-active .fwBtn--submenu:hover { color: #ffcc00 !important; }
.fwBtn--text { border-color: #666 !important; color: #bbb !important; }
.fwBtn--text:hover { background-color: #111 !important; color: #ffcc00 !important; }
.fwBtn--default { background-color: #444 !important; color: #bbb !important; border-color: #666; }
.fwBtn--default:hover { background-color: #222 !important; color: #ffcc00 !important; }
.popup__body, .photoSelector__body { background-color: #222 !important; color: #bbb !important; }
.popup__button.fwBtn { border-color: #666 !important; }
.popup__button.fwBtn:hover { background-color: #111 !important; color: #ffcc00 !important; }
#photoSelectorPhrase { background-color: #333 !important; color: #bbb !important; padding-left: 7px !important; }
.photoSelector__input-wrapper .ifw { padding-right: 7px !important; }
.userProfileHeader .user__menu .TabsNav--head .item--others-group .TabsNavGroup .item:hover { 
    background-color: #999 !important; 
    font-weight: normal !important; 
}
.popup__button.fwBtn.fwBtn--confirmBtn.sendMessage__sendButton--disabled.fwBtn--gold { color: #000 !important; }
#userMenu .notificationsContainer .noData { color: #aaa !important; }
.profileSubNavigation, .userProfileHeader .user__menu > .container::after { border-color: #444; }
.userProfileHeader .user__menu > .container { border: none !important; }
.doubleFixedMenu__menuContainer { background-color: transparent !important; }
.doubleFixedMenu__fixed .user__menu > .container { background-color: transparent !important; }
/* ten cholerny separator */ .doubleFixedMenu__fixed .user__avatar::after { background-color: transparent !important; }    
.userProfileHeader .user__menu > .container .navList__dropdown .navList__button:hover { background-color: #222 !important; }
.navList--slender .navList__button:hover { color: #000 !important; background-color: #999 !important; }
.navList--primary .navList__item:not(.navList__item--selected) .navList__text:hover, 
.navList--primary .navList__item--selected .navList__text { color: #ddd !important; }
.item-sub.item-sub__space-bottom.item-sub__plus, .item-sub.item-sub__space-bottom.item-sub--plus { background: #666 !important; }
.item-sub.item-sub__space-bottom.item-sub__plus:hover, .item-sub.item-sub__space-bottom.item-sub--plus:hover { background: #999 !important; }
.plusLandingPage__section--home .plusLandingPage__price { color: inherit !important; }
.plusLandingPage__section--payment .plusLandingPage__sectionHeader { color: #333 !important; }
.paymentBoxes__box { background-color: #333 !important; border-color: #111 !important; }
.paymentBoxes__details { color: #ffcc00 !important; }
.paymentBoxes__details:hover { color: #ccc !important; }
.paymentBoxes .details { background-color: #555 !important; color: #ddd !important; }
.paymentBoxes .details a { color: #ffcc00 !important; }
.paymentBoxes .details a:hover { color: #eee !important; }
.paymentBoxes .details--right::before { border-right-color: #555 !important; }
.section--userSettingsSubscription .mainSettings__group { background-color: #181818 !important; }
.userProfileHeader .user__menu > .page__container { border-color: #444 !important; }
.doubleFixedMenu__fixed .user__menu > .page__container { background-color: #252525 !important; }
.mouse .navList__dropdown .navList__button:hover .navList__text { background-color: #222 !important; }
.userProfileHeader .user__menu > .page__container::after { border-color: #666; }
.userReflector, .userReflector__userLabel, .userReflector__votesInfoBox { background-color: #333; border-color: #666; }
.userReflector__mutualVotes { color: #ccc; }
.userDescriptionSection__userAbout .dynamicTextField, .userTopRatedSection__header { border-color: #444 !important; }
.dynamicTextField__editIcon { background: none !important; }
.dynamicTextField__editIcon:hover i { color: #ccc !important; }
.userTopRatedSection__header, .posterInfoBox__header { background-color: #222; }
.votesInfoBox--bold .votesInfoBox__item.isActive .votesInfoBox__vote { color: #aaa !important; }
.posterInfoBox--alabaster .posterInfoBox__rateBox { 
    background-color: #111 !important; 
    color: #ccc !important; 
    border: 1px solid #444;
}
.userTopRatedSection .crs__item, .userFavoriteSection .crs__item:first-of-type, 
.userWantToSeeSection .crs__item:first-of-type { padding: 0 2rem 1.25rem 0 !important; }
.floatingActionButton__area::after { background-color: #444 !important; }
.floatingActionButton__button { background-color: #222 !important; color: #ccc !important; }
.floatingActionButton__button:hover { background-color: #666 !important; color: #fff !important; }
.floatingActionButton.hasBubble .floatingActionButton__bubble span { color: #222 !important; }
.floatingActionButton__ok { 
    color: #111 !important; 
    background-color: #d2a200 !important; 
    padding-left: 5px; 
    padding-right: 5px;  
    transition-duration: 1s;
}
.floatingActionButton__ok:hover { 
    color: #111 !important; 
    background-color: #ffd546 !important; 
    padding-left: 5px; 
    padding-right: 5px;  
}
.userHeaderSection .user__name { 
    color: #fff !important; 
    text-shadow: -2px 2px 0px #000 !important; 
    padding-left: 5px; 
    padding-right: 5px; 
    background-color: transparent;
    background-image: radial-gradient(closest-side at 50% 50%, #000, transparent)
}
body.isUserHeaderPinned .userHeaderSection .user__name:not(.user__link) { border-color: #444; }
.userTopRatedSection__header { background: #222 !important; }    
.userTopRatedSection__info, .userVoteHeaderSection__info { border-color: transparent; }  
.userVoteHeaderSection__header { background: #222; }    
.posterInfoBox--white .posterInfoBox__rateBox { background-color: #222; }  
.userConnectionBox--alabaster .userConnectionBox__badge { background-color: #181818; }
.userConnectionBox__menu .menuList .fwBtn { border-bottom-color: #666; }      
.photoSelector__input-wrapper hr { background-color: #666; }    
.changeAvatar .cropperPreviews, .changeAvatar .cropperPreview, .changeAvatar .cropperPreviewOld { border-color: #444; }   
.profile__head .ifw-fw.ifw-fw--retired { color: #ffcc00; }        
.fa.faNotificationPopup.faNotificationPopup--popup .faNotificationPopup__popup { background-color: #333; }
.fa.faNotificationPopup.faNotificationPopup--popup .faNotificationPopup__popup::before { background-color: #333; }    
.recommendedCriticsSection__container { background: #222; }
.userConnectionRecommended.userConnection .userConnection__container { background-color: #333; }
.userConnection__name { color: #aaa; }
.similarityBadge__value { color: #000; }
.userReflectorFollow__container, .userReflectorFollow__votes { background-color: #222; }
.userReflectorFollow__button .buttonFollowFriend { background-color: #333; }
.userReflectorFollow__button .buttonFollowFriend:hover { background-color: #111; }
.userReflectorFollow__user { border-color: #444; }
.userReflectorFollow__votes .voteBox:hover .voteBox__label { color: #ccc !important; }
body.isUserHeaderPinned .userHeaderSection .user__body { border-color: #333; }
.buttonInvite.button { 
    --button-background-color: #222; 
    --button-background-color-hover: #444; 
    --button-color: #aaa;
    --button-color-hover: #ccc; 
    --button-box-shadow: 0 0 0 .0625rem #222;
    --button-box-shadow-hover: 0 0 1rem 0 #444;
}
/*
.userProfilePage #app section[type="noPadding"] > div:nth-of-type(2):not([type="noPadding"]) div > div:nth-of-type(2) { background-color: #111; }
*/
/* </profil> */

/* -------------------------------------------------- */

/* <aktywnosc> */
.ico--expand.voteStatsBox__expand { display: none !important; }
.voteStatsBox__table { table, th, td, tr { border-color: #333 !important; background-color: transparent !important; } }
.voteStatsBox__element, .voteStatsBox__counter { color: #aaa !important; border-color: #333 !important; }
.voteStatsBox__element:hover { background: #222 !important; border: #333 1px solid; }
.voteStatsBox__covering { background: #222 !important; color: #aaa !important; border: #333 1px solid; }
.voteStatsBox__countAll, .voteStatsBox__rates, .voteStatsBox__header, .voteStatsBox__count, .voteStatsBox__head {
    color: #aaa !important;
    border-color: #333 !important;
}
.voteStatsBox__item:hover { color: #000 !important; font-weight: bold !important; }
.userEventSummary__inner { background: #222 !important; color: #ccc !important; }
.userRate__rate, .userEventSummary__userName { color: #ccc !important; }
.userEventSummary__userName:hover { color: #ffcc00 !important; }
.userEvent.animatedPopList__item.userEvent--entity { border: #555 1px solid; }
.userEvent.animatedPopList__item.userEvent--role.animatedPopList__item--ajaxAppended { border: #555 1px solid; }
.userEventSummary__event a { color: #ddd !important; padding-right: 5px !important; }
.userEventSummary__event a:hover { color: #ffcc00 !important; }
.userEventSummary__event { color: #aaa !important; }
.userEventSummary .fYear { color: #aaa !important; }
.userEventRolePreview__personName, .userEventRolePreview__entityTitle { color: #ccc !important; }
.userEventRolePreview__personName:hover { color: #ffcc00 !important; }
.socialMenu { background: #222 !important; border: none !important; }
.filmPreview__card { background: #181818; color: #ccc; } 
.filmPreview .filmPreview__poster { margin: 0px 1px 0px 0px !important; border-right: #444 1px solid; }
.voteCommentBox__addComment { color: #aaa; }    
.voteCommentBox__addComment:hover { color: #ffcc00 !important; }
.filmPreview__info--developers, .filmPreview__info--publishers { color: #ddd !important; }
.filmPreview .filmPreview__info a { color: #ccc !important; }
.filmPreview .filmPreview__info a:hover { color: #ffcc00 !important; }
.filmPreview__link { color: #ddd !important; }
.filmPreview__link:hover { color: #ffcc00 !important; }
#moreResultsButton { background-color: #333; color: #aaa; border-color: #666; }
#moreResultsButton:hover { background-color: #111; color: #ccc; border-color: #aaa; }
.filmPremieres .Carousel .CarouselViewport, .popularFilmsOfDay .Carousel .CarouselViewport { background-color: #000 !important; }
.flatContentWrapper { background-color: #111; }
#searchResult .filmPreview__card, #searchResult .hit.hit--person, #searchResult .polaroid.polaroid--raised.polaroid--horizontal .polaroid__caption, #searchResult .polaroid.polaroid--small-mobile .polaroid__caption { background-color: #181818; }   
.filmPreviewHolder .filmPreview .filmPreview__badge { background: none !important; }
.section__searchMenu .section__header .navList { border-top: 1px solid #333; }
#body {
    background: #181818;
    padding-left: 15px;
    padding-right: 15px;
}
.video-pane { margin-top: 0px !important; }
.user__menu.doubleFixedMenu__menuContainer { border-color: #666; }
.noResultsPlaceholder__img { display: none !important; }
.userEvent.animatedPopList__item.userEvent--coverPhoto { border: #444 1px solid; }
.userEvent .commentSection, .userEvent .commentSection__group {
    border-top: #444 1px solid;
    border-left: none;
    border-right: none;
    border-bottom: none;
    background-color: #222;
}
.comment__bubble { background-color: #333 !important; }
.comment__authorAvatar, .comment__authorAvatar::after { background-color: transparent !important; }
.comment__authorLink { color: #aaa !important; }
.comment__authorLink:hover { color: #ffcc00 !important; }
.avatar__link:hover { border-color: #ffcc00 !important; }
.comment__btn--plusIcon:hover { color: #65ff65 !important; }
.comment__btn--minusIcon:hover { color: #ff4f4f !important; }
.crs--constH .crs__item { background-color: #333 !important; border-top: #444 1px solid; }
.userEvent.animatedPopList__item.userEvent--grouped { border: #444 1px solid; }
.userEvent--miniRole .userEventRolePreview { background-color: #111 !important; }
.userEventSummary.userEventSummary--mini { border-color: #444; background-color: #151515 !important; }
.userEvent--miniRole .filmPoster--empty.filmPoster--role.filmPoster:not(.filmPoster--fixed):not(.filmPoster--auto) .filmPoster__link::after {
    border-color: #444 !important;    
}  
.userEventSummary__user { padding-bottom: 15px !important; }   
.crs__next { border: #000 1px solid; box-shadow: -2px 2px 0px 0px #333; }
.crs__next:hover { box-shadow: -2px 2px 0px 0px #666; }
.crs__prev { border: #000 1px solid; box-shadow: 2px 2px 0px 0px #333; }
.crs__prev:hover { box-shadow: 2px 2px 0px 0px #666; }
.userEvent.animatedPopList__item.userEvent--review.animatedPopList__item--ajaxAppended { border: #444 1px solid; }
.userEvent__footer.reviewFooter { border-color: #444; background-color: #181818; }
.review.review--userEvent.review--withPoster { background-color: #333; border-color: #444; }
.review.review--userEvent.review--withPoster .review__inner .review__description { padding: 10px !important; }
.userEvent.animatedPopList__item.userEvent--role { border: #444 1px solid; }
.singleActivity .userVote .likeCountText a { color: #ccc !important; }
.singleActivity .userVote .likeCountText a:hover { color: #ffcc00 !important; }
#userEvents .crs--stretched .crs__item { background-color: #111; }
.userNewestFriends__stats { border-color: #666; }
.userEventRolePreview__ratingRate { color: #ccc; }    
.userEvent--grouped { background-color: #222; /*padding-top: 1rem !important;*/ } 
.userEvent--glue + .userEvent { padding-top: 0rem; }
.rolePreviewHolder .rolePreview__person { color: #aaa; }  
.rolePreviewHolder .rolePreview__person:hover { color: #ffcc00 !important; }   
#userEvents .characterPreview__card { background-color: #181818;}
.characterPreview__meta * { color: #999; }    
.worldPreview__badge { background: none; }   
.eventBox__header { background: #222; }
.eventBox__about strong { color: #ccc; }
html.mouse .eventBox__about a:hover, html.mouse .eventBox__about a:hover strong { color: #ffcc00; }
.ratingSummary--compact.ratingSummary .ratingSummary__usersInfo { color: #aaa; }
.ratingSummary--compact.ratingSummary .ratingSummary__extra, .ratingSummary--compact.ratingSummary .ratingSummary__user { 
    background-color: #666; 
}   
.filmActionBox__preview { background-color: #181818; }
.subpage-userActivity .polaroid__caption, .subpage-userActivity .rolePreviewHolder .rolePreview, 
.subpage-userActivity .characterPreview  { background: #181818 !important; }  
.userAvatar--online .userAvatar__body::before { border-color: #111; }    
.eventBox__forum { border-top-color: #333; background-color: #222; }   
.eventBox__reactions { background-color: #222; }    
.commentEntry__comment { background-color: #333; }  
.userEventSummary__shortDesc { color: #aaa; }    
.crs .userEvent .characterPreview, .crs .userEvent .filmPreview, .crs .userEvent.userEvent--miniRole .userEventRolePreview, .crs .userEvent .userEventSummary--groupedFriends, .crs .userEvent .worldPreview { border-color: #444; }   
.eventBoxGrouped .eventBox__groupedEvents { background: #222; }    
.eventBox__preview { background: #222; }    
.rateStatus__container .rate { color: #ccc; }    
.eventBox__quizResult strong { color: #aaa; }    
.eventBox__placeholderHeader { background: #222; }
.eventBox__placeholderHeaderAvatar { background: #333; }
.eventBox__placeholderPreviewPoster { background: #333; }    
.placeholder::before { background: #333; }
.placeholder { background: #444; }    
.preview.previewCard .preview__detail a { color: #aaa; } 
.preview.previewCard .preview__detail a:hover { color: #ffc404 !important; } 
.preview.previewCard .preview__title { color: #ccc; }
.mouse .preview.previewCard .preview__link:hover { color: #ffc404; }
.preview.variantBadge .preview__card::before { background: #222; }
.eventBox__preview { background: #181818; }
.hasBadge .preview__card::before, .variantBadge .preview__card::before { background: none !important; }
/* </aktywnosc> */

/* -------------------------------------------------- */

/* <oceny> */
.voteCommentBox.voteCommentBox--editable.VoteCommentBox.voteCommentBox--emptyBar {
    background-color: #222;
    border: #444 1px solid;
}
.simpleView .myVoteBox .voteCommentBox { padding: 15px; }
.filmPreview__filmTime { color: #888 !important; }
.userVotesPage .slumpdown, .filterSelect__button.filter-select__btn.fwBtn.fwBtn--beta, .slumpdown__button.slumpdown__button--toggle {
    border-color: #666;
    background-color: #222; 
}
.slumpdown--grouped .slumpdown__button--toggle, .filterSelect__button.filter-select__btn.fwBtn.fwBtn--beta {
    background-color: #333 !important;
    border-color: #666 !important;
}
.statsDetails .blockHeader .slumpdown__button.slumpdown__button--toggle {
    background-color: transparent !important;
    box-shadow: none !important;
}
.slumpdown__tglBtnGrLbl, .filterSelect__labelDesc { color: #aaa !important; }
.slumpdown__tglBtnTxtLbl, .filterSelect__label { color: #ccc !important; }
.voteCommentText__comment, .simpleView .voteCommentText__comment { background-color: transparent; }  
.userVotesPage .__OwnerProfile .voteCommentText__comment, .voteCommentText__comment--open, .voteCommentText__comment i, .voteCommentText__comment i::after, .voteCommentText__label.voteCommentText__label--placehoder, 
.voteCommentText__textarea, .voteCommentText__label {
    background-color: #333;
    color: #aaa;
    border-color: #555;
}
.voteCommentBox__voteCommentText, .voteCommentText.voteCommentText--editable.VoteCommentText, .voteCommentText__comment i {
    background-color: transparent !important;
}
.rateRolesBox.RateRolesBox { background-color: #333 !important; color: #ccc !important; }
.rateRolesBox__content { padding-right: 10px !important; margin-left: -20px !important; }
.rateRolesBox__title { color: #ccc !important; }
.rateRolesBox__selectedRole { color: #aaa !important; }
.rateRolesBox__selectedActor:hover { color: #ffcc00 !important; }
.rateRolesBox__navBtn--prev, .rateRolesBox__navBtn--next { background-color: #555 !important; }
.rateRolesBox__navBtn--prev:hover, .rateRolesBox__navBtn--next:hover { background-color: #ffcc00 !important; }
.rateRolesBox__navBtn--disable:hover { background-color: #555 !important; }
.inlineSwitch__option.tooltip__parent.inlineSwitch__option--active { background-color: #333 !important; border-color: #666 !important; }
.inlineSwitch__option.tooltip__parent.inlineSwitch__option--active:hover {
    background-color: #333 !important; 
    border-color: #666 !important; 
    cursor: default !important; 
}
.inlineSwitch__option.tooltip__parent { background-color: #222 !important; border-color: #666; }
.inlineSwitch__option.tooltip__parent:hover { background-color: #666 !important; border-color: #666; }
.inlineSwitch__option { color: #aaa !important; }
.tvProgramTable { background: #282828 !important; border-color: #666; }
.tvProgramTable__channelImage img:hover { background-color: #666 !important; border-radius: 5px !important; }
.blockHeader__headerStats { color: #ccc !important; }
.sausageBar__button { background-color: #444; border-color: #666; }
.sausageBar__button:hover { background-color: #333; border-color: #444; }
.sausageBar--open .sausageBar__button { border-color: #444; }    
.sausageBar__button span { color: #ccc !important; }
.sausageBar__button strong { color: #ddd !important; }
.barFilter__count { color: #aaa !important; }
.barFilter__rate--active .barFilter__count { color: #fff !important; }
.barFilter__bar { background-color: #666 !important; }
.barFilter__bar:hover { background-color: #ffcc00 !important; }
.barFilter__bar.barFilter__bar--active { background-color: #cc9c00 !important; }
.filterSelect__extraOptions { color: #aaa !important; }
.filterSelect__close { color: #aaa !important; }
.filterSelect__close:hover { color: #ffcc00 !important; }
.userVotesPage__filters { border-color: #666; background-color: #222 !important; color: #ccc; }
.isDefault .barFilter__clearButton {
    background-color: #444 !important;
    color: #fff !important;
    border-color: #aaa;
    opacity: 0.25 !important; 
}
.isDefault .barFilter__clearButton:hover {
    background-color: #444 !important;
    color: #fff !important;
    border-color: #aaa;
    opacity: 0.25 !important;
}
.barFilter__clearButton {
    background-color: #333 !important;
    color: #fff !important;
    border-color: #aaa;
    opacity: 0.75 !important;
}
.barFilter__clearButton:hover {
    background-color: #555 !important;
    color: #fff !important;
    border-color: #aaa;
    opacity: 1.0 !important;
}
.slumpdown__list, .slumpdown__group, .slumpdown__button.slumpdown__button--select, .slumpdown__list-wrapper {
    background-color: #444 !important;
    color: #ccc !important;
    border: none !important;
}
.filterSelect__panel { background-color: #222 !important; }
.filterSelect__header, .filterSelect__search, .filterSelect__searchContainer {
    background-color: #333 !important;
    color: #ccc !important;
    padding-left: 2px !important;
}
.filterSelect__option { background-color: #333 !important; color: #bbb !important; border-color: #666; }
.filterSelect__option:hover { background-color: #ffcc00 !important; color: #111 !important; border-color: #cc9c00; }
.filterSelect__option--selected { background-color: #cc9c00 !important; color: #000 !important; border-color: #ffcc00; }
.filterSelect__save, .filterSelect__clearAll {
    background-color: #999;
    border: #ccc 1px solid;
    padding: 5px;
}
.filterSelect__save:hover, .filterSelect__clearAll:hover {
    background-color: #111;
    border: #ccc 1px solid;
    padding: 5px;
}
.personRolesBox__header { color: #ccc !important; }
.personRolesBox__movie, .personRolesBox__year { color: #ccc !important; }
.personRolesBox { background-color: #222 !important; border-color: #666; }
.personRolesBox__index span {
    background-color: #151515;
    color: #ddd;
    border: #999 2px solid;
}
.personRolesBox__personRole { border-color: #666; }
.personRole--active, .personRole:hover { border-color: #ffcc00 !important; }
.crs__prev--small { border: #333 2px solid; box-shadow: 5px 5px 0px 0px #666; }
.crs__prev--small.crs--isInactive { background-color: #ffcc00 !important; }
.crs__next--small { border: #333 2px solid; box-shadow: -5px 5px 0px 0px #666; }
.crs__next--small.crs--isInactive { background-color: #ffcc00 !important; }
.userVotesPage--userPersonRatings .userVotesPage__inlineFilter { padding-bottom: 5px !important; }
.slumpdown__button--select:hover { text-decoration: underline !important; }
.slumpdown__item--active .slumpdown__button.slumpdown__button--select { color: #ffcc00 !important; }
.filmRatingPanel .rateLabel { color: #ddd !important; }
.personRolePanelOpener:not([data-rate="0"]):not([data-rate=""]) { color: #000 !important; }
.personRolePanel__wrapper, .personRolePanel__container { background-color: #181818 !important; }
.sub-tabs .list .item__is-active .fwBtn--submenu {
    border-color: #ffcc00 !important;
    color: #000 !important;
    background-color: #ffcc00 !important;
}
.sub-tabs .list .item a { border-color: #666 !important; background-color: #222 !important; color: #aaa !important; }
.sub-tabs .list .item a:hover { border-color: #ffcc00 !important; color: #000 !important; background-color: #ffcc00 !important; }
.userProfileHeader .sub-tabs .list .item a:hover { 
    border-color: #ffcc00 !important; 
    color: #aaa !important; 
    background-color: transparent !important; 
}
.personRolesBox__person:hover, .personRolesBox__movie:hover { color: #ffcc00 !important; }
.rolesFriendVotes .roleInfo a { color: #ffcc00 !important; }
#userConnectionsSmallAll .userList li { border-color: #666 !important; }
.btn.link-btn.likingNonFriends { background-color: transparent !important; box-shadow: none !important; }
.btn.link-btn.likingNonFriends:hover { color: #ffcc00 !important; }
.sausageBar__target { border-color: #444; }
.personPreviewRoles .personPreview { border-color: #666; background-color: #222 !important; }
.personPreview__info span + span, 
.personPreviewRoles .rateRolesBox__selectedRole a, .personPreviewRoles .rateRolesBox__selectedRole span { color: #aaa !important; }
.personPreview .awards { color: #ffcc00 !important; }
.episodesContainer--bestSection::after { background-color: #666 !important; }
.serialBestSection .serialBestSection__navs .serialBestSection__item:hover { color: #ffcc00 !important; }
.episode.episode--upcoming { background-color: #444 !important; border-bottom: 1px solid #666 !important; }
.myVoteBox__filmPreview { border: 1px solid #444; border-right: none; }
.navList--slender .navList__item--selected .navList__text { color: #000 !important; }
.mouse .navList--slender .navList__button:hover .navList__text { color: #000; background-color: #333; }
.mouse .navList--slender:hover .navList__item--selected .navList__text { color: #000 !important; }
.mouse .navList--slender .navList__item--selected .navList__button:hover .navList__text { color: #000; background-color: #ffcc00; }    
.navList--slender .navList__item--selected .navList__text, 
.mouse .navList--slender .navList__button:hover .navList__text { box-shadow: none !important; }   
.sidebarPanel__panel { background-color: #333 !important; }
.userEventsInfo__text { color: #aaa !important; }
.userEventsInfo__image { opacity: 0.5 !important; }
.aboveAssistant-v1 { background-color: #222 !important; }
.aboveAssistant__btn { background-color: #111 !important; border-color: #444; color: #aaa !important; }
.aboveAssistant__btn:hover { background-color: #333 !important; border-color: #666; color: #ccc !important; }
.myVoteBox .filmPreviewHolder.isMini .filmPreview .filmPreview__card { 
    background: #181818 !important; 
    border-color: #444 !important; 
}    
.userFavouriteVotesSection .myVoteBox { border-color: #444; }
worldPreview__badge, .worldPreviewHolder.isLarge .worldPreview .worldPreview__badge { background: none; }    
.worldPreview__title, .worldPreview__card .commonRating__count, .worldPreview__info a { color: #aaa; }
.worldPreview__title:hover, .worldPreview__info a:hover { color: #ffcc00 !important; }    
.filmPreviewHolder.noBorder .filmPreview .filmPreview__card { background: #181818 !important; }    
.filterSelect__extraOptions { border-color: #444; }     
.section__contribsChartStats .blockHeader__meta--slumpdown .slumpdown__button.slumpdown__button--toggle { 
    background: transparent !important;  
    border-bottom: 2px dotted #e7a90f !important; 
}  
.myVoteBox__preview:not(.isMini) { border-color: #444; }    
.filterSelect__button { padding: .9rem .9rem !important; }    
.voteCommentText--alabaster .voteCommentText__comment:not(.voteCommentText__comment--open), .voteCommentText--alabaster .voteCommentText__comment:not(.voteCommentText__comment--open) .voteCommentText__label, .voteCommentText--alabaster .voteCommentText__comment:not(.voteCommentText__comment--open) .voteCommentText__textarea, .voteCommentText--alabaster .voteCommentText__comment:not(.voteCommentText__comment--open) > i::after, .voteCommentText--editable { background-color: #333; } 
.voteCommentText.voteCommentText--alabaster .voteCommentText__comment, .voteCommentText.voteCommentText--editable .voteCommentText__comment { border-color: #444; }    
.characterPreview__info--groups li:not(:last-child)::after { color: #aaa; }
.characterPreviewHolder.isLarge .characterPreview .commonRating, 
.characterPreviewHolder.isLarge .characterPreview .characterPreview__header { margin-bottom: 0.5rem; }    
.myVoteBox__rightCol, .likeCounter__popupUnnamedCounter { border-color: #444; }    
.userList__userName { color: #aaa; }    
.userList__userName:hover { color: #ccc; }    
.myVoteBox__preview.filmPreviewHolder.noBorder.isMini { border: 1px solid #444; }    
.isMyProfile .simpleView .myVoteBox .voteCommentBox:not([data-likes-count="0"]) { border: 1px solid #444; }
.multiDotPicker__dot button { background: #aaa; }
.multiDotPicker__line { background: #666; } 
.simpleView .myVoteBox .voteCommentBox__bar .buttonsContainer button:not(:hover), 
.simpleView .myVoteBox .voteCommentBox__bar .fwBtn:not(:hover) { color: #ccc; }    
.commentCounter__action:hover { color: #ffcc00; }    
.userFavouriteVotesSection .myVoteBox .voteCommentBox { background-color: #181818; }    
.fwBtn.fwBtn--badge.commentButton__button:hover, .fwBtn.fwBtn--badge.likeButton__button:hover { color: #ffcc00; }    
.fwBtn--delta, .fwBtn__delta { background-color: #222; border-color: #444; }  
.fwBtn--delta:hover, .fwBtn__delta:hover { background-color: #333; border-color: #666; color: #ccc; }  
.compactView .myVoteBox .voteCommentBox, .simpleView .myVoteBox .voteCommentBox, body:not(.isMyProfile) .compactView .myVoteBox__lastBox, body:not(.isMyProfile) .simpleView .myVoteBox__lastBox { border-color: #444; }   
.ico--arrowDown::before { color: #aaa !important; }   
.personPreview__info a { color: #ffc404; }    
.mouse .personPreview__link:hover { color: #ddd; }    
.preview__platforms { background-color: #222; }
.preview__platforms li { background-color: #333; color: #aaa; line-height: 0.8rem; }
.preview__platforms li:hover, .preview__platforms li:focus { background-color: #ffc404; color: #000; }
.filmRatingBox { background: #333; }
.placeholderOld__poster { background: #333; }
.placeholderOld__element { background: #333; }
.placeholderOld__element::before { background: #666; }
.placeholderOld { outline-color: #333; }
.loadingWave__dot { background: #666; }
.voteCommentBox:not(.isReady)::before { background-color: #333; }
.preview.previewCard .preview__placeholderCard { background: #181818; }
.rateRolesBox:not(.isReady)::after { background-color: #333; }
.userVotesPage--userVotes .preview.previewCard.previewFilm .preview__originalTitle { color: #aaa; }
.preview.previewCard .preview__detail h3:not(:first-child)::before { color: #aaa; }
.userProfilePage #app section[type="noPadding"] > div:nth-child(2)[type="noPadding"] > div > div:nth-child(2) > div > span { 
    background: #1c1e1f; 
    border-radius: 5px; 
    padding: 1px 6px; 
}
.userProfilePage #app section[type="noPadding"] > div:nth-child(2)[type="noPadding"] > :nth-child(2n) > div:nth-child(2) > div > span { 
    background: #181a1b; 
}
.userProfilePage #app section[type="noPadding"] > div:nth-child(2)[type="noPadding"] > div > div:nth-child(1) > a { background: none; }
.userProfilePage #app section[type="noPadding"] > div:nth-child(2)[type="noPadding"] > div > div:nth-child(2) span { color: #aaa; }
.userProfilePage #app > div[type="noMobilePadding"]:nth-child(2) > div:nth-child(1) { background: #222; }
.userProfilePage #app > div[type="noMobilePadding"]:nth-child(2) > div:nth-child(1) > div:nth-child(2) { background: #333; border-color: #333; color: #aaa; }
.userProfilePage #app > div[type="noMobilePadding"]:nth-child(2) > div:nth-child(1) > div:nth-child(2):hover { background: #444; border-color: #444; color: #ccc; }
.userProfilePage #app > div[type="noMobilePadding"]:nth-child(2) > section { background: #181a1b; color: #aaa; }
.userProfilePage #app section[type="noPadding"] > div:nth-child(2)[type="noPadding"] > :nth-child(2n) { background-color: #1c1e1f; }
.userProfilePage #app section[type="noPadding"] > div:nth-child(1) > .voteViewSwitch { border-color: #181a1b; background-color: #222; }
.userProfilePage #app section[type="noPadding"] > div:nth-child(1) > .voteViewSwitch::after { background-color: #181a1b; }
/* </oceny> */ 

/* -------------------------------------------------- */

/* <chce zobaczyc> */
.myVoteBox__lastBox { background-color: #222 !important; border: #444 1px solid; }
.myVoteBox__wantToSeeRateBox, .WantToSeeRateBox { background-color: #222 !important; color: #ccc !important; }
.myVoteBox__recommendBox { color: #ccc !important; }
.FilmRatingBoxContainer { background-color: #222 !important; border: #444 1px solid !important; }
.FilmRatingBoxContainer .filmRatingPanel .doNotWtsButton.on .label, .FilmRatingBoxContainer .filmRatingPanel .doNotWtsButton:hover .label, .FilmRatingBoxContainer .filmRatingPanel .wtsButton.on .label, .FilmRatingBoxContainer .filmRatingPanel .wtsButton:hover .label, .FilmRatingBoxContainer .filmRatingPanel .wtsButtonWrapper:hover .label { color: #ccc !important; }
.FilmRatingBoxContainer .recommendBox { background-color: #222 !important; color: #ccc !important; }
.FilmRatingBoxContainer .filmRatingPanel .filmRatingPanelVote .rateVoteActions .commentAreaWrapper, .FilmRatingBoxContainer .filmRatingPanel .filmRatingPanelVote .rateVoteActions .commentAreaWrapper textarea {
    background-color: #333 !important;
    color: #ccc !important;
    border-color: #666 !important;
}
.filmRatingPanelWTS { border-color: #666 !important; }
.boxBadge__item { background-color: #333 !important; color: #ccc !important; border-color: #666 !important; }
.FilmRatingBox.filmRatingBox.isInited { background-color: #222 !important; }
.filmRatingBox__recommendBox { background-color: #222 !important; }
.userRate .favourite:hover .favourite__icon.ico { color: #ffcc00 !important; }
.userRate__icon { color: #aaa; }  
.userRate__icon--active { color: #ffcc00; }  
.placeholder__poster { background-color: #666; }    
.myVoteBox__mainBox { background: #181818; } 
body.isMyProfile .compactView .myVoteBox__lastBox, body.isMyProfile .simpleView .myVoteBox__lastBox { border: 1px solid #444; }    
/* </chce zobaczyc> */

/* -------------------------------------------------- */

/* <blog> */
.noDataToShow, .userSurname { color: #ccc !important; }
.hdrBig a, .pageTitle a, a.hdrBig { color: #ffcc00 !important; text-shadow: 2px 2px #000 !important; }
.userSurnameUpdateProfile a, .btnsContWrapper a { color: #ffcc00 !important; text-decoration: none !important; }
.userSurnameUpdateProfile a:hover, .btnsContWrapper a:hover { color: #ffcc00 !important; text-decoration: underline !important; }
.awTN th, .awTNS th { background: #333; color: #aaa; }
.rmv { background: url(https://4.bp.blogspot.com/-vbOnpgfe3gI/W1DYYhZ5pII/AAAAAAAAD1c/1IL-Y-vV9QchrjWk7T4pWm7teYeHBgh7QCLcBGAs/s1600/common17dark.png) -76px -82px !important; }
.rmv:hover { background: url(https://4.bp.blogspot.com/-vbOnpgfe3gI/W1DYYhZ5pII/AAAAAAAAD1c/1IL-Y-vV9QchrjWk7T4pWm7teYeHBgh7QCLcBGAs/s1600/common17dark.png) -89px -82px !important; }
.comTabMenu.dark li > a {
    background: #333 !important;
    color: #ffcc00 !important;
    border-color: #666 !important;
    border-width: 1px !important;
}
.comTabMenu.dark li > a:hover { background: #111 !important; color: #ffcc00 !important; }
.comTabMenu ul { border-color: #666 !important; border-width: 0 0 1px !important; height: 18px; }
.blogDesc, .singleBlogEntry, .archMnth em, .stdPara1 { color: #aaa !important; }
.entryComments a, .entryContent a, .singleComment a, .singleComment .buttonLooksLink, .userNameLink, .blogEntryTitle, .stdPara1 a {
    color: #ffcc00 !important;
}
.singleComment { border-color: #666 !important; color: #aaa !important; }
.singleComment.authorComment { background-color: #222 !important; }
.archYear { background: url(https://1.bp.blogspot.com/-qUY5e7r6RlY/W18gN5FacBI/AAAAAAAAD2M/816PFsvr008WNIN7U9QnGbwJONEQ0kHFwCLcBGAs/s1600/bgArrY.png) 1px -18px no-repeat !important; }
.observ { background-image: url('https://2.bp.blogspot.com/-u-718ZdFvRc/W18p8TbfsUI/AAAAAAAAD2g/ulboDcquj4kqOEwh_kPYSaREJm00Yu6swCLcBGAs/s1600/smlBtnsY.png') !important; }
.bL3 { background-color: #333 !important; border-color: #666 !important; color: #aaa !important; } 
.blogObservations .singleFrBlogEntry a { color: #ffcc00 !important; }  
.blogTitle a.hdrAG { color: #ccc; }    
.padlockSSLInfo { color: #888; } 
.userButtonsMenu .stdButton, .blogInfoPart .userBlogManage, #messagesList .remove { 
    background-color: #222; 
    color: #ffcc00; 
    border: none; 
    border-bottom: 1px solid #666; 
}     
.userButtonsMenu .stdButton:hover, .blogInfoPart .userBlogManage:hover, #messagesList .remove:hover { 
    background-color: #333; 
    border-color: #333; 
    color: #ccc; 
}  
.singleEntryPhotosCont li a { color: #ffcc00; }
.singleEntryPhotosCont li:hover { background: #333; }
#messagesList tbody tr:hover td { background-color: #222; }    
.awT td, .awTN th { border-color: #444; }    
/* </blog> */

/* -------------------------------------------------- */

/* <contrib> */
.section__contribsChartStats .blockHeader__meta--slumpdown span, .contribsChartStats .stats__value { color: #ccc !important; }
.contribsList__elementsHeader, .contribBox__container, .contribBox__footer, .contribBox__header { background-color: #333 !important; }
.contribBox__value { color: #ccc !important; }
.contribBox__filmTitleLink { color: #ccc !important; }
.contribBox__filmTitleLink:hover { color: #aaa !important; }
.filmBecomeContributor > li a { color: #ffcc00 !important; }
.filmBecomeContributor > li span a { color: #aaa !important; }
.nowrap { color: #aaa !important; }
.sbtn.report.top-10 {
    background-color: #333 !important;
    color: #aaa !important;
    border-color: #aaa !important;
    font-weight: bold !important;
}
.sbtn.report.top-10:hover { background-color: #ffcc00 !important; color: #000 !important; border-color: #ffcc00 !important; }
.contribLinksSelectHelper { margin-bottom: 15px !important; }
.input.btn, button.btn {
    background: #333 !important;
    color: #bbb !important;
    border-color: #666 !important;
    text-shadow: none !important;
    margin-left: 5px !important;
}
.input.btn:hover, button.btn:hover { background: #ffcc00 !important; color: #000 !important; border-color: #ffcc00 !important; }
.halfSize, .filmTime { color: #bbb !important; }
.contribHeader a { color: #ffcc00 !important; }
.well { background: #222 !important; }
.gwt-contribAddingInfo { color: #aaa !important; }
.voteStatsBox__table > table a, th a, td a, tr a { color: #ffcc00 !important; }
.gwt-Label, .gwt-HTML, .contrib-filmGenres-sourceGenre { color: #aaa !important; }
.localeWidget { background: #333 !important; }
.genresPanel td { background: #333 !important; }
.contribCuriosities .newElementPanel .categoryLabel { background: #333 !important; color: #ccc !important; }
.contribCuriosities .gwt-elementPanel, .newElementPanel { background: #333 !important; color: #ccc !important; }
.gwt-PushButton.gwt-PushButton-up, .gwt-ToggleButton.gwt-ToggleButton-up { background: #444 !important; }
.gwt-PushButton.gwt-PushButton-up-hovering, .gwt-ToggleButton.gwt-ToggleButton-up-hovering { background: #222 !important; }
.gwt-Button { background: #444 !important; color: #ccc !important; }
.gwt-Button:hover { background: #222 !important; color: #ccc !important; }
.gwt-commonWidgetPanel { background: #333 !important; color: #ccc !important; }  
.gwt-TextArea-source-creatorComment { background-color: #282828 !important; color: #ccc !important; }
.contribTabs .header .arr { background-image: url("https://2.bp.blogspot.com/-cYBfe48yFDM/W1Do7r_nAZI/AAAAAAAAD10/1_WDcNjHJXIcOAJW_Z4G5YYWJ02Xbp60gCLcBGAs/s1600/set43dark.png") !important; }
.contribTabs td { color: #bbb !important; }
.contribTabs thead th { color: #ccc !important; }
.gwt-statusBox-Invalid { color: #f55 !important; }
.contribElementLabel.contribElementNew, .contribElementLabel.contribElementDelete { color: #fff !important; font-weight: bold !important; }
.contribElementLabel.contribElementUpdate { color: #000 !important; font-weight: bold !important; }
.gwt-elementPanel { background-color: #333 !important; border: 1px solid #666; }
.contribCountries .panel, .contribRelateds .panel { background: #333 !important; }
.contribCountries .CountriesPanel { background: #333 !important; border-color: #666; }
.contribsChartStats .stats { background-color: #222 !important; border-color: #666; }
.statsDetails .item { background-color: #333 !important; }
.statsDetails .item--summary .stats__value { color: #aaa !important; }
.statsDetailsListFixedHeader .list__item.item.item--header { background-color: #333 !important; color: #aaa !important; }
.ct-label { color: #aaa !important; }
.contribBox__filmTitleLink:hover { color: #ffcc00 !important; }
.contribsList__element:not(:first-child) { border-color: #444; }
.statsDetails .item--bordered::before { background-color: #444; }    
.contribsChartStats .chart .ct-series-a .ct-point-center { stroke: #000 !important; }
.gwt-TextBox { background-color: #222; border-color: #666; color: #ccc; }
.contribsChartStats .stats--CREATOR .stats__item:nth-of-type(2), 
.contribsChartStats .stats--CREATOR .stats__item:nth-of-type(3) { border-color: #666; }    
.selectToEdit, .contributeFormSubmit { background-color: #222; color: #aaa; }   
.contribsField.castRoleListElement .checkboxes { background: #222; }    
.gwt-TextArea, .gwt-SuggestBox, .contribRoles .imdbNumberBox { background-color: #222; border-color: #666; color: #aaa; } 
.awards strong, .awards ul { color: #aaa; }    
.oldpage a, .oldpage .link { color: #aaa; }  
.oldpage a:hover, .oldpage .link:hover { color: #ffcc00; }     
.waitingContribsSection__row, .waitingContribsSection__row:last-of-type { border-color: #444; background-color: #222; }  
.personMainPage a, .personMainPage .link { color: #ffcc00; }    
.personMainPage a:hover, .personMainPage .link:hover { color: #ccc; }    
.contribsChartStats .chart__stats { border-color: #666; }
.contribsChartStats .chart .ct-grid { stroke: #999; } 
.contribsList--LIMITED { border-color: #444; }    
.well { border-color: #666; }    
.contribStudios .newElementPanel { border-color: #444; }    
.gwt-ListBox { filter: invert(95%); }
#main .gwt-Button, .gwt-PopupPanel .gwt-Button  { border-color: #666; }
.section__header .list, .contribsList .section__header .list { background-color: #333; border-color: #444; }

/* </contrib> */

/* -------------------------------------------------- */
    
/* anti-adblock */
.tnxxqoas__box { background-color: #333; border-color: #333; box-shadow: 0 -50px 50px 50px #333; }
.tnxxqoas__description, .tnxxqoas__caption, .tnxxqoas__caption a  { color: #ccc; }
.tnxxqoas__img-wrapper { filter: brightness(50%); }  
.tnxxqoas__dButton a, .tnxxqoas__instruction, .tnxxqoas__instruction:hover { color: #ffcc00; }  
  
/* -------------------------------------------------- */
   
/* cookies */
#didomi-host .didomi-popup-backdrop { background-color: rgba(64,64,64,.5); }
#didomi-host .didomi-exterior-border { border-color: #ffc404; }
#didomi-host .didomi-popup-container { background-color: #222; }
#didomi-host .didomi-popup-notice.didomi-popup-notice-with-data-processing { color: #aaa; }
#didomi-host .didomi-notice-data-processing-container .didomi-notice-data-processing-title { color: #aaa; }
#didomi-host a:not(.didomi-no-link-style) { color: #ffc404 !important; }
#didomi-host .didomi-notice-data-processing-container .didomi-notice-data-processing-list { color: #8cd; } 

/* -------------------------------------------------- */

/* <strona filmu/osoby/uniwersum> */    
#dabOld { color: #111 !important; }
.filmDescriptionSection__item + .filmDescriptionSection__item { border-color: #666; }
.filmDescriptionSection__authorName { color: #ffcc00; }
.filmRatingBox__date:hover span { color: #aaa; }
.filmInfo th, .uName, ul.sep-comma > li::after, .sideBoxClean p, .descW, .characterName, 
.filmCast td, .seanceTime { color: #ddd !important; }
.sep-line { color: #aaa !important; }
.sep-line a { color: #ccc !important; }
.sbtn.seeAll { background-color: #333 !important; color: #bbb !important; border-color: #666 !important; }
.sbtn.seeAll:hover { background-color: #ffcc00 !important; color: #000 !important; border-color: #ffcc00 !important; }
.syg { background-color: #666 !important; border-color: #666 !important; }
.syg::after { border-color: #aaa !important; }
.syg:hover::after { border-color: #fff !important; }
.sbtn-switcher > li > button { background-color: #333 !important; border-color: #666 !important; color: #ccc !important; }
.sbtn-switcher > li > button:hover { background-color: #333 !important; border-color: #ffcc00 !important; color: #ccc !important; }
.sbtn-switcher > li > button.on { background-color: #ffcc00 !important; border-color: #ffcc00 !important; color: #000 !important; }
.sbtn-switcher > li > button.on:hover { cursor: default !important; }
.rolesCarousel .rateInfo, .rolesCarousel .rateInfo > span { color: #bbb !important; }
.s-15 a, .s-13 { color: #bbb !important; }
.upcomingSerial .episodeDate { color: #bbb !important; }
.fwPrBtnGold, a.fwPrBtnGold, input[type="submit"].fwPrBtnGold, span.fwPrBtnGold { 
    background: #ffcc00; 
    color: #333; 
    border: #ffcc00 1px solid; 
    font-weight: bold; 
}
.logo-cell img { margin-right: 5px !important; }
.logo-cell img:hover { background: #666 !important; border-radius: 5px !important; }
.boxContainer { color: #999 !important; }
.countrySwitcher .on { color: #ccc !important; }
.countrySwitcher span { color: #ffcc00 !important; }
.inline { color: #ccc !important; }
.episodesTable .collapse .reset { color: #aaa !important; }
.seasonWatched.sbtn { background: #333 !important; color: #ddd !important; }
.seasonWatched.sbtn:hover { background: #ffcc00 !important; color: #000 !important; border-color: #ffcc00 !important; }
.filmSubpageMenu .box li.on a { color: #000 !important; font-weight: bold !important; }
.filmSubpageMenu .box li.on { background: #ffcc00 !important; color: #000 !important; }
.sbtn.pull-right { background: #333 !important; color: #ddd !important; }
.sbtn.pull-right:hover { background: #ffcc00 !important; color: #000 !important; border-color: #ffcc00 !important; }
.episodesTable .arr { background-image: url("https://2.bp.blogspot.com/-cYBfe48yFDM/W1Do7r_nAZI/AAAAAAAAD10/1_WDcNjHJXIcOAJW_Z4G5YYWJ02Xbp60gCLcBGAs/s1600/set43dark.png") !important; }
.votePanel { background: transparent !important; }
.ribbonSmall { color: #333 !important; }
.filmVoteRatingPanelWrapper { background-color: #202020 !important; }
.filmRatingPanel .commentAreaWrapper.hasComment { background-color: #252525 !important; }
.filmSubpageMenu strong { text-decoration: underline !important; color: #ccc !important; }
.filmInfo td, .filmInfo th { color: #aaa !important; }
.toggleBtn, .quickLinks, .filmographyTable tr td, .filmographyTable tr th { color: #aaa !important; }
.personInfo th { color: #aaa !important; }
.personInfo td { color: #ccc !important; }
.communityRateDrop { background: #222 !important; color: #aaa !important; }
.communityRateDrop ul > li > a { color: #ccc !important; }
.personKnownFor a, .personKnownFor li > div { color: #aaa !important; }
.awardsTable { color: #aaa !important; }
.vertical-align a { color: #ccc !important; }
.inline.sep-comma a { color: #ccc !important; }
.inline.sep-comma a:hover { color: #ffcc00 !important; }
.personSubpageMenu strong { color: #ccc !important; text-decoration: underline !important; }
.personSubpageMenu a { color: #ffcc00 !important; }
.personSubpageMenu .box li.on a { color: #000 !important; font-weight: bold !important; }
.personMenu a { color: #ddd !important; }
#filmVoteRatingPanel { background: transparent !important; }
#whereToWatchEditions li td { color: #bbb !important; }
#whereToWatchEditions th { color: #999 !important; }
.episodesTable .episode .title, .episodesTable .pull-left.normal { color: #ccc !important; }
.btn-original-production { color: #ccc !important; background-color: #333 !important; border: #666 1px solid !important; }
.btn-original-production:hover { color: #111 !important; background-color: #ffcc00 !important; border: #ffcc00 1px solid !important; }
.pageContributors li .boxContainer .s-16.userNameLink { color: #ddd !important; }
.contribTabs.table-sweet-1.s-16 a { color: #ffcc00 !important; }
.filmMenu a { color: #ffcc00 !important; }
#userConnectionsSmall .userList .userVote .entityDesc .bottom-5 { color: #aaa !important; }
.badge-white { background: #333 !important; color: #ccc !important; border-color: #666 !important; }
.filmSeancesList.filmSeancesCinemaList.pageBox span { color: #aaa !important; }
.fwPrBtnDefault { background: #333 !important; color: #ccc !important; border-color: #666 !important; }
.fwPrBtnDefault:hover { background: #ffcc00 !important; color: #000 !important; border-color: #ffcc00 !important; }
#whereToWatch .fwPrBtnBorder { background: #333 !important; color: #ccc !important; border-color: #666 !important; }
#whereToWatch .fwPrBtnBorder:hover { background: #ffcc00 !important; color: #000 !important; border-color: #ffcc00 !important; }
#cinemaDropdown .sbtn.dropdown-toggle { color: #ffcc00 !important; box-shadow: none !important; background-color: transparent !important; }
.bottom-10.s-16 span { color: #aaa !important; }
.voteBar .link-btn.cap.s-12 { background-color: transparent !important; box-shadow: none !important; }
.votePanel { background: #181818 !important; }
.hasRibbon, .episodesTable dd > ul > li { border-color: #666 !important; }
.filmCuriosities .droptions-opener:hover { color: #ffcc00 !important; }
.sep-hr > * { border-color: #666 !important; }
.enhanced-lightbox-displaybox .enhanced-lightbox-displaybox-sidebar .rateInfo .border { border-color: #666 !important; }
.enhanced-lightbox-displaybox .enhanced-lightbox-displaybox-sidebar .roleVoteFriends .list__userList::before { background: none !important; }
.link-btn.activityButtons__likeButton.s-13 { background-color: transparent !important; box-shadow: none !important; }
.awardsTable { border-color: #666 !important; }
.filmographyTable { border-color: #666 !important; }
.ranking__header .slumpdown__button.slumpdown__button--toggle { background-color: transparent !important; box-shadow: none !important; }
.droptions-box .droptions-content, .droptions-box .droptions-content > a + a { border-color: #666; }
.droptions-box .droptions-content::before { border-color: #666 !important; background: url("https://2.bp.blogspot.com/-cYBfe48yFDM/W1Do7r_nAZI/AAAAAAAAD10/1_WDcNjHJXIcOAJW_Z4G5YYWJ02Xbp60gCLcBGAs/s1600/set43dark.png") no-repeat -520px -220px; }
.filmRatingBox__votePart { border-color: #666 !important; }
.slumpdown__group:not(:last-child)::after { background-color: #777 !important; }
.episodesTable dt { border-color: #666 !important; }
.recommendForm .btnsRow .cancelBtn:hover { background-color: transparent !important; box-shadow: none !important; }
ul.token-input-list-filmweb, .recommendForm .msgArea { border-color: #666 !important; background-color: #222 !important; }
li.token-input-input-token-filmweb, ul.token-input-list-filmweb li input, .recommendForm textarea { 
    background-color: #222 !important; 
    color: #aaa !important; 
}
div.token-input-dropdown-filmweb, div.token-input-dropdown-filmweb strong { 
    border-color: #666 !important; 
    background-color: #111 !important; 
}
.tokenInputProp, .otherFriends li { background-color: #111 !important; border-color: #666 !important; color: #ccc !important; }
.btn-large.btn-fb { background-color: #3b5998 !important; }
.seriesInfoBar .episodesSeason li a { color: #ccc !important; background-color: #202020 !important; margin: 2px !important; width: 25px !important; }
.seriesInfoBar .episodesYear li a { color: #ccc !important; background-color: #202020 !important; margin: 2px !important; width: 50px !important; }
.seriesInfoBar .episodesSeason li a:hover, .seriesInfoBar .episodesYear li a:hover { color: #fff !important; background-color: #3f3f3f !important; }
.seriesInfoBar .episodesHeader a { color: #ccc !important; }
.episodesSeasonList .seasonsNav li a.seasonNavItem { 
    color: #ccc !important; 
    background-color: #202020 !important; 
    margin: 2px !important; 
    width: 25px !important; 
}
.episodesSeasonList .seasonsNav li a.seasonNavItem:hover { color: #fff !important; background-color: #3f3f3f !important; }
.hdr .filmTitle a:hover { color: #ffcc00 !important; }
.serialBestSection .serialBestSection__navs .serialBestSection__item--isActive { color: #bbb; }
.serialBestSection .serialBestSection__navs .serialBestSection__item--isActive:hover { color: #ffcc00; }
.episode.episode--best, .episode.episode--best .episode__rates { background-color: #333 !important; }
.episode__communityRate.episode__communityRate--votes { color: #bbb !important; }
.serialBestSection .serialBestSection__navs { border-color: #666 !important; }
.episode.episode--best:last-of-type::after, .episode::after { background-color: #666 !important; }
.episode.episode--hidden .episode__rates::before, .episode .episode__rates::before { background-color: #333 !important; }
.serialInfoBar .serialInfoBar__label { color: #aaa !important; }
.serialInfoBar .serialInfoBar__link { 
    color: #ccc !important; 
    background-color: #202020 !important; 
    margin: 2px !important; 
    width: 25px !important; 
}
.serialInfoBar .serialInfoBar__link:hover { color: #fff !important; background-color: #3f3f3f !important; }
.episodesSection .episodesSection__options .slumpdown .slumpdown__button { background-color: #333 !important; color: #aaa !important; border: 1px solid #666 !important; }
.episodesSection .episodesSection__options .slumpdown .slumpdown__value, 
.episodesSection .episodesSection__options .slumpdown .slumpdown__labelGroup { color: #ccc !important; }
.episodesSection .episodesSection__options .slumpdown .slumpdown__value:hover { color: #ffcc00 !important; }
.slumpdown .slumpdown__item:not(:first-of-type)::before { background-color: #666 !important; }
.episodesContainer .episodesContainer__header { background: #282828 !important; color: #ccc !important; border-color: #444 !important; }
.episodesList, .episode .episode__rates { background: #333 !important; color: #ccc !important; border-color: #444 !important; }
.episodesList .episodesList__episodesListLabel::after { background-color: #444 !important; }
.episodesContainer__currentRate { color: #ccc !important; }
.episodesContainer .episodesContainer__footer { border-color: #444 !important; background-color: #222 !important; }
.episodesContainer .episodesContainer__btn { background-color: #222 !important; }
.episodesContainer .episodesContainer__btn--contrib a { color: #ffcc00 !important; }
.episodesContainer .episodesContainer__btn--contrib a:hover { color: #ddd !important; }
.episodesContainer .episodesContainer__btn:hover { color: #ccc !important; }
.episode.episode--newest { background-color: #333 !important; }
.sidebar .wtsList .pho-47::before, .wantToSeeUsersBox .pho-47::before { border-color: #757575 !important; border-width: 2px !important; }
#pk-popup-wrapper button.close { background: #666 !important; }
#pk-popup-wrapper button.close:hover { background: #999 !important; }
.wantToSeeUsersBox .eyesBar .fonti.fonti-eye.fonti-on.s-20 { color: #ffcc00 !important; }
.episode.episode--best .episode__rates::before, .episode.hidden .episode__rates::before { background-color: #333 !important; }
.episodesSection .singleEpisodes .singleEpisodes__btn a, 
.episodesSection .singleEpisodes .singleEpisodes__btn { background-color: #222 !important; color: #ffcc00 !important; }
.episodesSection .singleEpisodes .singleEpisodes__btn::after { background-color: #666 !important; }
.wantToSeeStateButton__container, .notInterestedStateButton__container { background: #111 !important; }
.textInput--editable .textInput__text, .textInput__text > i::after { background: #111 !important; border-color: #353535 !important; }
.textInput__text > i { border-color: #353535 !important; }
.textInput--open:not(.isProcessing) .textInput__text > i::after, 
.textInput--open:not(.isProcessing) .textInput__text > i { border-color: #ffcc00 !important; }
.textInput--open:not(.isProcessing) .textInput__textarea { color: #aaa !important; }
.filmActionBox__filmRatingFriends { border-top: none !important; border: 1px solid #444; background: #333 !important; }
html.mouse .filmRatingFriends__button .button:not(:hover) { border-color: #666 !important; background-color: #222 !important; }
html.mouse .filmRatingFriends__button .button:hover { color: #000 !important; }
.filmRatingAssistant.isOpen .filmRatingAssistant__container, .filmRatingAssistant__container { background-color: #2c2c2c; border-color: transparent; }
.filmRatingAssistant.isOpen .filmRatingAssistant__title { color: #aaa !important; }
html.mouse .filmRatingAssistant__clear:hover, .icoButton--silver:hover { color: #ffcc00 !important; }
.filmPosterSection__plot, .filmDescriptionSection__text, .page__subtitle.page__subtitle--tiny, .page__subtitle.page__subtitle--tiny h2, .filmInfo__info { color: #aaa !important; }
.mouse .page__subtitle.page__subtitle--tiny h2 a:hover, 
.mouse .page__subtitle.page__subtitle--tiny a:hover { background-color: transparent !important; color: #ffcc00 !important; }
.page__subtitle.page__subtitle--tiny a:not(:hover) span { color: #aaa; }    
html.mouse .personRole { background-color: #222 !important; }
html.mouse .personRole:hover { background-color: #111 !important; }
.ribbonPanel__background, .roleRatingBox__container { background: #333; }
.filmDescriptionSection__btn, .filmOtherInfoSection a { color: #ffcc00 !important; }
.filmDescriptionSection__btn:hover, .filmOtherInfoSection a:hover { color: #ddd !important; }
.filmMainCuriositiesSection__item { border-color: #666 !important; }
.filmCriticsVotesSection__criticRating, .filmCriticsVotesSection__criticAverage { color: #ccc !important; border-color: #666; }
.filmCriticsVotesSection__criticRating:hover { color: #ffcc00 !important; }
.filmCriticsVotesSection__criticAverage { background-color: #222; }    
.filmCriticsVotesSection .filmFriendComment { background-color: #222 !important; }
.filmFriendComment__comment { background-color: #333 !important; }
.mouse .userReviewSection .review__link, .userReviewSection .review__author { color: #ccc !important; }
.mouse .userReviewSection .review__link:hover, .userReviewSection .review__author:hover { color: #ffcc00 !important; }
.userReviewSection .review { background-color: #333 !important; border-color: #666 !important; padding: 10px !important; }
.mouse .userReviewSection .review__more, .contributorBox__link, .editTrigger:hover { color: #ffcc00 !important; }
.mouse .userReviewSection .review__more:hover, .contributorBox__link:hover { color: #b07103 !important; }
.page__moreButton, .page__pagination { padding: 5px 0 2rem; }
.forumSection__searchInput { background: #222; border-color: #666; color: #ccc; }
.forumSection__topicTitle, .forumSection__right a, .filmReviewsSection__subheader, .filmAwardsSection__collectionCount, 
.filmAwardsSection__groupTitle a, .filmVideosSection__groupTitle, .filmPostersSection__groupHeader, 
.filmCuriositiesSection__subtitle, .filmEditionsSection .edition__text, .filmEditionsSection .edition__title { color: #aaa !important; }
.forumSection__item, .filmContributeSection__text { border-color: #444; }
.subPageMenu { background-color: #222 !important; color: #ccc !important; }
/* .subPageMenu::after { filter: invert(85%); } */
.subPageMenu::after { background-color: transparent; background-image: linear-gradient(180deg, transparent, #222) !important; }
.subPageMenu__link, .filmFullCastSection__header, .castRoleListElement__info a { 
    color: #ccc !important; 
}
.subPageMenu__link:hover { background-color: #333 !important; color: #ffcc00 !important; }
.navList__item--selected .navList__text:hover, .navList__item:hover .navList__text, .mouse .castRoleListElement__info a:hover, .filmAwardsSection__groupTitle a:hover { color: #ffcc00 !important; }
.castRoleListElement { border-color: #666; background: #222; }
.filmReviewsSection__list.filmReviewsSection__list--user .review, .filmAwardsSection [data-type="awards"].filmAwardsSection__groupContent, .filmAwardsSection__groupContent, .mouse .simplePoster:hover { background-color: #333; }
.filmAwardsSection__groupSubHeader > div, .filmAwardsSection__groupAwardName, .simplePoster__title, .review__userMovieRate .review__rate { color: #aaa !important; }
.filmAwardsSection__groupPerson { color: #ffcc00 !important; }
/* .filmPosterSection__buttons a { background-color: #333; color: #aaa; border-color: #666; } */
.filmActionBox__card { background-color: #222; }
.filmActionBox__filmRatingSummary { background-color: #333 !important; color: #aaa !important; border-top: none; }
.filmRatingSummary__button .button { border-color: #666; background-color: #222; }
html.mouse .filmRatingSummary__button .button:hover { color: #000 !important; }
.filmRatingBox[data-rate="-1"]:not(.isRatePreview) .filmRatingBox__vote, .seasonOrEpisodeRatingBox__status .noRate { color: #aaa !important; }
.filmRatingBox__recommendBox { color: #888; }
.filmInfo__linkAdd { background-color: transparent; color: #ccc; }
.filmPosterSection__plot a:not(.fwBtn) { color: #ccc; }
.filmPosterSection__plot a:not(.fwBtn):hover { color: #ffcc00; }
.mouse .filmInfo__info--group a { background-color: #222; border-color: #444; color: #aaa; }
.mouse .filmInfo__info--group a:hover { background-color: #333; color: #ccc; }
.filmHeaderSection__navigation { background-color: #222; }
.seasonOrEpisodeRatingBox__checkBox { border-color: #444; background-color: #333; }
.seasonOrEpisodeRatingBox__checkBox { color: #ccc; }
html.mouse .seasonOrEpisodeRatingBox__checkBox:not(.isChecked):hover { color: #ffcc00; }
.seasonOrEpisodeRatingBox__container { background-color: #282828; border-color: #444; }
.squareNavigation__item { background-color: #333; border-color: #666; }
.squareNavigation__item:not(.squareNavigation__item--active):hover { background-color: #444 !important; color: #ddd !important; border-color: #666 !important; }    
.mouse .squareNavigation__item:not(.squareNavigation__item--active):hover { color: #111; }
.squareNavigation__item--active { background-color: #ffcc00; color: #000; border-color: #ffcc00; }
.squareNavigation__item--active:not(:hover) .squareNavigation__text span { color: #000 !important; }
.squareNavigation__item--active:hover { background-color: #ffcc00; color: #111 !important; }    
.squareNavigation__dropdownList { background: #333; }
.squareNavigation__dropdown:hover .squareNavigation__item--label { border-color: #666; }
.squareNavigation__dropdown::after { color: #ccc !important; }
.squareNavigation__dropdown::after:active { color: #000 !important; }
.filmHeaderSection__navigation--hasNav .page__text { border-color: #444; }
.episodePreview, .seasonPreview { border-color: #666; background-color: #282828; }
.episodePreview__rate, .seasonPreview__rate { color: #bbb; }
.episodePreview__date, .seasonPreview__date { color: #aaa; }
.episodePreview__subTitle, .episodePreview__title, .seasonPreview__subTitle, .seasonPreview__title { color: #ddd; }
.forumSection__authorName, .forumSection__starsNo { color: #aaa !important; }
.forumSection.page__section--gray .page__container { background-color: #333; }
.forumSection__addFirstTitleMsg { color: #ccc; }
.forumSection__addFirstText { color: #aaa; }
.recentlyViewed__poster a { color: #fff; }
.navList--primary::after, .navList--tertiary::after { background: #666; }
.subPageLinkBlock__container { border-color: #666; background-color: #333; }
.subPageLinkBlock__container:hover { background-color: #282828; }    
.subPageLinkBlock__header { color: #aaa; }
.filmEmptySection__wrapper { background-color: #111; margin: 0; }
.filmEmptySection .emptyBlock__button { border-color: #666 !important; color: #aaa !important; }    
.broadCastBox__title, .broadCastBox__channelLink { color: #aaa; }
img[src="https://ssl-gfx.filmweb.pl/channels/46.2.png"] { filter: invert(75%); }
.page__container .review { background-color: #333; }
.review--film .review__rate { color: #aaa; }
.filmContributorsSection .page__moreButton a, .enhanced-lightbox-displaybox .enhanced-lightbox-displaybox-sidebar .personRole, .enhanced-lightbox-displaybox .enhanced-lightbox-displaybox-sidebar .roleDetails a, .enhanced-lightbox-displaybox .enhanced-lightbox-displaybox-sidebar .personRole:hover, .enhanced-lightbox-displaybox .enhanced-lightbox-displaybox-sidebar .roleDetails a:hover { background-color: transparent !important; }
.enhanced-lightbox-displaybox .enhanced-lightbox-displaybox-sidebar .voteLabel { color: #ccc; }
.filmFriendsActivitySidebar__panel, .filmDetailedVotesSidebar__panel { background-color: #333; }
.filmFriendsActivitySidebar__summary .criticsAverage, .filmFriendComment__status .rate { color: #aaa; border-color: #aaa; }
.filmFriendsActivitySidebar__list > div:not(:last-child), .filmDetailedVotesSidebar__subHeader::after { border-color: #666; }
.filmFriendsActivitySidebar__button, .filmDetailedVotesSidebar__button { background-color: #444; }
.filmFriendsActivitySidebar__button:hover, .filmDetailedVotesSidebar__button:hover { background-color: #222; }
.filmFriendsActivitySidebar__navigation::before { background-color: #333; }
.filmDetailedVotesSidebar__title { color: #aaa; }
.filmDetailedVotesSidebar .filmRating__rateValue { color: #aaa; }
.filmDetailedVotesSidebar .filmDetailedBar__container { background-color: #666; }
.seasonOrEpisodeRatingBox__checkBox.isChecked { color: #ccc; }
.filmCriticsVotesSection .crs__showAllButton { background-color: #222; }
.ico--goUp::before { filter: invert(100%); }
.filmFriendsActivitySidebar__summary strong { color: #aaa; }
.beforePremiere__premiereIcon { background: #333 !important; color: #aaa !important; border: 1px solid #666; }
.beforePremiere__premiereInfo, .beforePremiere__premiereTime, .notInterestedStateButton__desc { color: #888 !important; }
.notInterestedStateButton__container:hover { border-color: #353535 !important; }
.wantToSeeStateButton__state, .wantToSeeStateButton__desc, .ico--eye::before:not(:hover), .ico--close::before:not(:hover) { color: #888 !important; }
.wantToSeeStateButton:not([data-value="0"]):not([data-value="-1"]).hasPanel.hasVoted .wantToSeeStateButton__icon, .wantToSeeStateButton:not([data-value="0"]):not([data-value="-1"]):not(.hasPanel) .wantToSeeStateButton__icon { color: #ffcc00 !important; }
.wantToSeeStateButton__container { color: #888 !important; }
.textInput .textInput__counter { background-color: #333 !important; color: #ccc !important; border: 1px solid #ffcc00; }
.textInput .textInput__counter .ico--pen::before { color: #fff; }
.textInput--saved::before { background-color: #333 !important; color: #ffcc00; }
html.mouse .filmRatingSummary__button .button:hover { background-color: #111; border-color: #666; color: #aaa !important; }
.navList--primary .navList__item--selected .navList__text, .navList--tertiary .navList__item--selected .navList__text { color: #ccc; }
.see-all-results-link:hover, .internal:hover, .top3-result h4 a:hover { color: #ddd !important; }
.filmBecomeContributorSection__row, .filmBecomeContributorSection__list .filmBecomeContributorSection__row:last-child { border-color: #666; }
.userEvent--glue { margin-bottom: 30px !important; }
.episodesProgressLine__text { text-shadow: 1px 1px 1px #000; }
.userVotesPage.userVotesPage--userWantToSeeNowInTV .__FiltersResultsSortBox .userVotesPage__daySort .inlineSwitch__option.tooltip__parent.inlineSwitch__option--active { 
    background-color: transparent !important; 
    border-color: #ffcc00 !important; 
}
.userVotesPage.userVotesPage--userWantToSeeNowInTV .__FiltersResultsSortBox .userVotesPage__daySort .inlineSwitch__option.tooltip__parent { background-color: transparent !important; border-color: #666 !important; }
.personRole__ranking, .personRoleCharacter__ranking { background: #222; color: #aaa; }
.personRole__ranking:hover, .personRoleCharacter__ranking:hover { background: #111 !important; }
.filmEpisodesListSection__checkBox .ico { color: inherit; }
.filmEpisodesListSection__checkBox:hover span { color: #ffcc00; }
.filmEpisodesListSection__checkBox.page__text.isInit.isChecked span { color: #aaa; }
.floatingFilmActionBox__button .ico::before { color: #222; }
.floatingFilmActionBox.isOpen .floatingFilmActionBox__button { background-color: #333; }
.floatingFilmActionBox.isOpen .floatingFilmActionBox__button:hover { background-color: #222; }
.floatingFilmActionBox.isOpen .floatingFilmActionBox__button .ico::before { color: #aaa; }
.enhanced-lightbox-displaybox .enhanced-lightbox-displaybox-sidebar .roleDetails a { color: #ffcc00; }
.enhanced-lightbox-displaybox .enhanced-lightbox-displaybox-sidebar .roleDetails a:hover { color: #ddd; }
.reactionsList__summary .criticsAverage { color: #aaa; border-color: #aaa; }
.reactionsList__list:not(.reactionsList__list--review) > div:not(:last-child) { border-color: #666; }
.sidebarPanel__close { background-color: #222; }
.sidebarPanel__close:hover { background-color: #444; }
.reactionsList__summary strong { color: #ccc; }
.tinyReview__more, .tinyReview__title { background-color: #222; color: #aaa; }
.reviewBox__content { background-color: #222; }
.reviewBox__title, .flatReview__name, .userReviewSection .flatReview__rate, .filmFriendComment__status .ico { color: #aaa; }
.reviewBox__readMore, .mouse .userReviewSection .flatReview__more { color: #ffcc00; }
.mouse .userReviewSection .flatReview__more:hover, .flatReview__link:hover { color: #ddd; }
.userReviewSection .flatReview:not(:last-of-type) { border-color: #444; }
.sidebarPanel--sticky .sidebarPanel__header { background-color: #333; }
.filmDetailedBar__bar .avatar__link { background: none; border: 2px solid #ffcc00; }
.sidebarPanel__header, .sidebarPanel__navigation { background-color: #333 !important; }
.filmCoverSection__wrapper--episode .filmCoverSection__episodeNavs { background-color: #222 !important; }
.filmCoverSection__wrapper--episode .filmCoverSection__episodeCounter, .filmOtherInfoSection { color: #aaa !important; }
html.coverPhoto--episode .filmCoverSection__navsWrapper { border-color: #666 !important; }
.filmCoverSection__wrapper--episode .filmCoverSection__navItem { border-color: #666 !important; background-color: #333 !important; }
.filmCoverSection__wrapper--episode .filmCoverSection__navItem:hover { border-color: #666 !important; background-color: #111 !important; }
.forumSection__addFirstImage { opacity: 0.75; }
.personVoteInfo .communityRateSwitcher .options .communityRateDrop::before { 
    border-color: transparent transparent #666 transparent !important; 
}
.personVoteInfo .communityRateSwitcher .options .communityRateDrop { border-color: #666 !important; }
.filmInfo__header--platforms { color: #aaa !important; }
.flatReview__name:hover { color: #ffcc00 !important; }
.seasonOrEpisodeRatingBox.isBeforePremiere { background-color: #282828 !important; }
.filmRatingSection__placeholder { background-color: #666 !important; }
.filmCoverSection .filmRating, .filmCoverSection .filmRating--filmCritic, 
.filmCoverSection .page__container .filmCoverSection__info { text-shadow: 2px 1px 1px #000; }
.plusDiscountButton { background-color: #666; }
.filmRatingAssistant .filmRatingAssistant__bar .ico::before { color: #aaa; }
.ribbonPanel__filmHeader, .ribbonPanel__roleHeader { border-color: transparent; }   
.filmMainBestSection__background { background-color: transparent; }  
.polaroid__lead:not(:empty) { color: #aaa; }    
.filmAwardsSection__groupDesc { color: #aaa; }
.filmAwardsSection__link { color: #ffcc00; }
.filmAwardsSection__groupContent { /* border-color: #666; */ border: none; }   
.castRoleListElement__episodeInfo { border-color: #444; background: #333; }
.castRoleListElement__episodeInfo:hover { border-color: #444; background: #222 !important; }
.castRoleListElement.expanded .castRoleListElement__episodeInfoList { background-color: #333; }
.mouse .castRoleListElement__episodeInfoList .role__episode { color: #aaa; }
.mouse .castRoleListElement__episodeInfoList .role__episode:hover { color: #ccc; }
.castRoleListElement__episodeInfoList .role__episodesMore { background: #222; color: #aaa; }
.castRoleListElement__episodeInfoList .role__episodesMore:hover { color: #ccc !important; }   
.advertButton--huawei span { filter: invert(85%); }    
.filmCuriositiesSection__text, .filmEditionsSection .edition__text { border-color: #666; }  
.filmEditionsSection .edition__details a { color: #ffcc00; }     
.filmEditionsSection .edition__details a:hover { color: #976103; }  
.enhanced-lightbox-displaybox .enhanced-lightbox-displaybox-sidebar .rateInfo .topRate a { color: #aaa; }  
.mainCol .userList li, .personVoteInfo .cap { color: #aaa; } 
.filmographyTable [class^="icon-small-"], .filmographyTable [class*=" icon-small-"], 
.filmographySort .dropdown-toggle i { filter: invert(75%); }   
.filmographySort:hover .dropdown-toggle i { filter: invert(0%); }     
.addTopic.reset.addPlus .icon-small-plusCircle:hover { filter: brightness(50%); }    
.subPageLinkBlock__logo--playnow { filter: brightness(200%) saturate(75%); }   
.filmPlotSection__plot { color: #aaa; }    
.filmPlotSection__btn:hover { color: #ffcc00; }    
.filmTitlesSection__title { color: #aaa; }    
.filmTitlesSection__item:not(:last-of-type) { border-color: #666; }    
.filmAwardsSection [data-type="awards"].filmAwardsSection__groupContent { background: #222; }    
#stayAtHomeAdvertSamsung .page__header::before, #stayAtHomeAdvertSamsung .page__header .page__subtitle::after { background: none; }  
.worldOrCharacterActionBox__card { background-color: #222; }    
.typeCounter__item { background: #333; border-color: #666; color: #aaa; }    
.typeCounter__item:hover { background: #222 !important; color: #ccc; }     
.mouse .characterPosterSection__info a, .mouse .worldPosterSection__info a, .objMetaInfo > :nth-child(2n) { color: #aaa; }    
.mouse .characterPosterSection__info a:hover, .mouse .worldPosterSection__info a:hover { color: #ffcc00 !important; }  
.characterPerformerSection .characterItemPerson__person, .characterUsualPartner__name, .characterRelation__name, 
.worldCharactersSection__tile .worldCharactersSection__card, .worldAllProduction__card { color: #ccc; }    
.characterPerformerSection .characterItemPerson:hover, 
.characterUsualPartner:hover .characterUsualPartner__name, .characterRelation:hover .characterRelation__name, 
.mouse .worldAllProduction:hover .worldAllProduction__card { background: #333; }   
.worldCharactersSection__tile:hover .worldCharactersSection__card { background: #333 !important; }       
.rankingSection { background-color: #111; border-color: #666; }    
.rankingElement__card { color: #ccc; } 
.rankingElement:hover .rankingElement__card { background-color: #333; }   
.characterRelated__card { background: #222; color: #aaa; border-color: #444; }    
.characterRelated__more span > * { color: #aaa; }    
.overlayLinks { border-color: #666; background-color: #181818; }   
.overlayLinks__link:not(:hover), .characterFilmographySection .simplePoster:not(:hover) { border-color: #666; background-color: #333; }
.overlayLinks__link--active { background-color: #ffcc00 !important; }
.overlayLinks__link--active:hover, .overlayLinks__link:hover { box-shadow: none; }   
.overlayLinks__link:hover { background-color: #111; color: #aaa; border-color: #444; }      
.overlayLinks__link--active:hover { color: #000 !important; }    
.popup--gradient .popup__message { color: #aaa; }    
.popup--gradient .popup__content::after { background-image: linear-gradient(179deg,hsla(0,0%,100%,0) 6%,#111 87%); }   
.worldOrCharacterRatingBox[data-fav="1"] .worldOrCharacterRatingBox__about, .worldOrCharacterRatingBox__about { color: #aaa; }  
.characterRelation[data-spoiler] button { background-color: #222; color: #aaa; }    
.quizItem__title { color: #aaa; }    
.quizItem__title:hover { color: #ffcc00; }  
.switcherElements__btn i { color: #000; }   
[data-group="worldPage"].page .page__wrapper--grid [data-group="g7g8"].page__group, 
[data-group="worldPage"].page .page__wrapper--grid [data-group="g10g11"].page__group, 
[data-group="worldPage"].page .page__wrapper--grid [data-group="g13g14"].page__group,
[data-group="worldPage"].page .page__wrapper--grid [data-group="g7"].page__group, 
[data-group="worldPage"].page .page__wrapper--grid [data-group="g8"].page__group, 
[data-group="worldPage"].page .page__wrapper--grid [data-group="g10"].page__group, 
[data-group="worldPage"].page .page__wrapper--grid [data-group="g11"].page__group, 
[data-group="worldPage"].page .page__wrapper--grid [data-group="g13"].page__group, 
[data-group="worldPage"].page .page__wrapper--grid [data-group="g14"].page__group { background-color: #111; } 
.forumSection__wrapper, .curiositiesSection__item { border-color: #444; }
.characterPerformerSection .characterCardPerson__card { border-color: #666; background: #222; } 
.characterPerformerSection .characterCardPerson__person { color: #aaa; }    
.characterPerformerSection .characterCardPerson__more { border-color: #666; background-color: #333; color: #aaa; }   
.characterPerformerSection .characterCardPerson__more:hover { background-color: #181818; color: #aaa; }    
.filmsPage .filmPreview { border: none !important; }    
.filmsPage .filmPreview__card { background: none !important; }    
.wantToSeeStateButton__container, .notInterestedStateButton__container, .filmActionBox__ratingSummary, .ratingSummary__button .button, 
.wantToSeeStateButton:not([data-value="0"]):not([data-value="-1"]).hasPanel.hasVoted .wantToSeeStateButton__container, 
.wantToSeeStateButton:not([data-value="0"]):not([data-value="-1"]):not(.hasPanel) .wantToSeeStateButton__container, 
[data-value="0"][data-important="1"]:not(.hasPanel):not(.hasVoted).wantToSeeStateButton .wantToSeeStateButton__container { 
    border-color: #353535; 
}
.ratingSummary__button .button { background-color: #111; }
.ratingSummary__button .button:hover { border-color: #353535 !important; }    
.characterWorldSection .subPageLinkBlock__typeCounter { border-color: #666; color: #aaa; /* background-color: #111; */ }
.mainPage .playButton { background-color: #111; }    
.characterPosterSection__plot a, .worldPosterSection__plot a { color: #ffcc00; }
.descriptionSection__more { background: linear-gradient(90deg,hsla(0,0%,100%,.0),#111 30%); } 
.tipsBoarding__button { background: #222; color: #aaa; }    
.tipsBoarding__button:hover { background: #333; }        
.characterPage .filmPreview__card, .worldPage .filmPreview__card { background-color: transparent !important; }
.personRole__role a { color: #aaa; } 
.personRole__role a:hover { color: #ffcc00 !important; }      
.filmStudiosSection__title { color: #aaa; }  
.filmStudiosSection__item:not(:last-of-type) { border-color: #666; }    
.imageBorderShadow .tooltip-container { background-color: #333; color: #aaa; }   
.imageBorderShadow .tooltip-container::after { background-color: #333; }    
.descriptionSection__text { color: #aaa; }  
.descriptionSection__btn { color: #ffcc00; }    
html.noFilmReviewData.noFilmVideoData.noPhotoGalleryData body:not(.userCantSeeFa) [data-group=filmPage].page .page__wrapper--grid [data-group=g5] .page__section--dark,
html.noFilmReviewData.noPhotoGalleryData body:not(.userCantSeeFa) [data-group=filmPage].page .page__wrapper--grid [data-group=g5] .page__section--dark { background-color:transparent; color:#ccc; }  
.characterFilmographySection__itemInner::after, .worldLastSection__itemInner::after { border-color: #444; }
.ribbonPanel__panel .roleActionBox__rolesBox { background-color: #333; color: #aaa; }    
.ribbonPanel .roleActionBox .rolesBoxItem__about > *, .ribbonPanel .roleActionBox .rolesBoxItem__about > span > strong, 
.ribbonPanel .roleActionBox .rolesBoxItem__vote > div> span { color: #aaa; }  
.worldCharactersSection__item .worldCharactersSection__card { border-color: #444; background-color: #181818; }  
.simpleBox__title { color: #aaa; }    
.becomeContributorSection__row, .becomeContributorSection__list .becomeContributorSection__row:last-child { border-color: #444; background-color: #222; }  
.mouse .becomeContributorSection__row a:hover::before { background-color: hsla(0,0%,25%,.5); }    
.descriptionSection__item + .descriptionSection__item, .curiositiesNavSection__text { border-color: #444; }    
.curiositiesNavSection__item h3, .curiositiesNavSection__text { color: #aaa; }
.poster__wrapper { background-color: #666; }    
.filmEditionsSection .edition__text a, .awardsNavSection__groupPerson, .awardsNavSection__link { color: #ffcc00; }    
.awardsNavSection [data-type="awards"] { background: #333; }  
.awardsNavSection__groupContent { border-color: #666; background: #222; }    
html.mouse .rankingElement:hover { background-color: #222; }  
html.mouse .rankingElement__film:hover { color: #ccc; }    
html.mouse .rankingElement__person:hover { color: #ffcc00; }    
.descriptionSection__body, .usualPartnerItem__name { color: #aaa; } 
.usualPartnerItem__name:hover a { color: #ccc; }  
.floatingActionBox.isOpen .floatingActionBox__button { background: #666; }
.floatingActionBox.isOpen .floatingActionBox__button:hover { background: #888; }    
.floatingActionBox.isOpen .floatingActionBox__button .ico::before { color: #000; }    
.poster__wrapper { background-color: #666; }  
.gallerySection .gallery__photo-item--placeholder > * { background: #333; }    
.gallerySection .gallery__photo-item--placeholder > *:hover { background: #222; }    
.curiositiesSection--subPage .curiositiesSection__item { color: #aaa; }  
.awardsNavSection__collectionCount, .awardsNavSection__groupAward { color: #aaa; }    
.personRolePreview__filmRating, .personRolePreview__year { color: #ccc; }    
.personFilmographySection__item::after { border-color: #444; }  
.personRolePreview__roleText h4:not(.personRolePreview__characterPoster), .personRolePreview__character a { color: #aaa; }  
.efficientPoster { background: #666 url(https://fwcdn.pl/front/gfx/d.241740e7c59302575824baae6de87972c.svg) 50% no-repeat; }  
.personFilmographySection__header .inlineSwitch--iconic .inlineSwitch__option--active i { color: #ccc; }    
.inlineSwitch--iconic .inlineSwitch__option i { color: #666; }    
.personCareerHistorySection .personRating--lg .personRating__rate { color: #aaa; }  
.roleTooltip__card span, .roleTooltip__rate { color: #aaa; }    
.roleTooltip__card a { color: #ccc; }   
.roleTooltip__card a:hover { color: #ffcc00; }    
.roleTooltip__wrapper, .roleTooltip::before { background: #333; }        
.personPosterSection__leadText, .personPosterSection__subHeader, .personPosterSection__infoData h3 { color: #aaa; }   
.personPosterSection__lead a { color: #ffcc00; }
.personPosterSection__more { background: linear-gradient(90deg,hsla(0,0%,0%,.1),#111 20%); }    
.personAwardSection__container { border-color: #666; background-color: #333; }   
.personAwardSection__container:hover { background-color: #222; }    
.personAwardSection__header { color: #aaa; }    
.awardsNavSection.awards [data-type="awards"] ~ [data-type="awards"], .awardsNavSection [data-type="awards"] + [data-type="awards"] { 
    border-color: #666; 
}    
.rolesBoxItem__about a, .rolesBoxItem__about strong, .rolesBoxItem__vote div, .rolesBoxItem__vote span { color: #aaa; }    
.rolesBoxItem__about a:hover { color: #ffcc00 !important; } 
.personCareerHistorySection__graph { filter: brightness(75%); }  
.roleActionBox__card { background: #333; }  
.myVoteBox__rightCol { background: #333; }
.personTopRolesSection__rankingLink { color: #888; background-color: #282828; border-radius: 5px; } 
.personTopRolesSection__rankingLink:hover { color: #aaa !important; background-color: #333; }     
.mouse .personTopRolesSection__rankingLink::before { border-color: #333; }   
.mouse .personTopRolesSection__rankingLink:hover::before { border-color: #666; }  
.personRoleCharacter__characterName--tooltip, .personRoleCharacter__characterName { color: #aaa; }    
html.mouse .personRoleCharacter:hover { background-color: #222; }
html.mouse .personRoleCharacter__filmTitle:hover { color: #aaa; }    
.descriptionSection__authorName { color: #ccc; }    
.personPosterSection__copyright .personPosterSection__copyrightTooltip { background-color: #333; color: #aaa; }    
.personPosterSection__copyright .personPosterSection__copyrightTooltip::after { background-color: #333; }  
.personPosterSection__contribButton { background: transparent; }   
.labelBox__category, .labelBox__category:hover { color: inherit; }   
.placeholder__element { background: #666; }   
.personRolePreview__title { color: #ffcc00; }    
.personRolePreview__title:hover { color: #ccc; }         
.personRolePreview__originalTitle { color: #aaa; }
.mouse .personRolePreview__character a:hover { color: #ccc; }        
.personFilmographySection .personRolePreview__card { height: 6.4rem; }   
.inlineSwitch__listType--simple .personRolePreview__card { height: 4.5rem !important; }
.personFilmographySection .personRolePreview__characterPoster { display: none; }      
.personFilmographySection .personRolePreview__roleText { display: block ruby; } 
.personFilmographySection .personRolePreview__roleText h4 { margin-right: 1.5rem; }  
.personFilmographySection .personRolePreview__character { margin-bottom: 0; }    
.forumSection__seasonEpisodeBadge { background-color: #222; border-color: #666; }  
.forumSection__seasonEpisodeBadge:hover { background-color: #333; }    
.gallerySection .gallery__photo { background-color: #333; }   
.filmographyCounterUser__itemCount { color: #aaa; }
.slumpdown__groupLabel { color: #aaa; }    
.personKnownForItem__name { color: #ccc; } 
.ribbonPanel__roleHeaderVote u { color: #aaa; }   
.filmActionBox__ratingSummary { border-color: #353535; }    
html.mouse .wantToSeeStateButton:not(.hasVoted):not([data-value="0"]):not([data-value="-1"]):not(.hasPanel):hover .wantToSeeStateButton__container { border-color: #444; }   
.slider__nav--next::before, .slider__nav--prev::before { color: #111; }    
[data-value="1"].notInterestedStateButton .notInterestedStateButton__container { border-color: #353535; }    
[data-value="1"].notInterestedStateButton .notInterestedStateButton__icon { color: #ffcc00; }    
html.mouse [data-value="1"].notInterestedStateButton:hover .notInterestedStateButton__icon { color: #aaa; }  
.wantToSeeRateBox__doNotWantToSee:hover { color: #aaa; }    
/* .filmPosterSection__buttons a:hover { background-color: #282828; } */
.personTopRolesSection__rankingLink:hover { background-color: #333; }    
.personKnownForItem__characterItem--link { color: #aaa; }   
.personFilmographySection__navButton { background: none; }  
.personFilmographySection__navButton .fwBtn.active, .personFilmographySection__navButton .fwBtn:hover, 
.personFilmographySection__navButton .fwBtn.overlayLinks__btn--extended { box-shadow: none; } 
html.mouse .filmRatingBox__vote .ico:hover { color: #aaa; }    
.filmCoverSection .page__container .filmCoverSection__info, 
.coverSection__desc, .personCoverSection__title { text-shadow: 2px 1px 1px #000; }  
.personPhotosByYears__desc { text-shadow: 1px 2px #000; }     
.awardsNavSection__groupSubTitle, .awardsNavSection__groupYear { color: #aaa; }    
.awardsNavSection__groupTitle { color: #ccc; } 
.isDark .textInput .textInput__label, .isDark .textInput .textInput__text, 
.isDark .textInput .textInput__textarea { background-color: transparent; }  
.postersListSection__groupHeader { color: #aaa; }    
.broadCastBox__channelImg:hover { background: #666; }    
.broadCastBox__channel { border-color: #666; }    
.filmCoverSection__buttons a, .filmCoverSection__buttons span { color: #ccc; }   
.filmCoverSection__buttons a::before, .filmCoverSection__buttons span::before { border-color: #666; }   
.mouse .breadcrumbs a:hover { color: #aaa; }   
.seasonPreview__details { color: #aaa; }    
.ico--arrowDown::before { color: #aaa; }    
.subPageMenu__dropDownList .subPageMenu__link:not(.dropDownButton) { background-color: #222; }    
.characterFilmographySection__header .slumpdown__button.slumpdown__button--toggle { background-color: transparent; }    
.worldLastSection__navButton { background: transparent; }    
.becomeContributorSection__row a:hover { color: #ffcc00; }    
.mouse .characterRelation:hover { background: #333; }    
.filmPosterSection__awards { background-color: #222; border-color: #444; }  
.filmPosterSection__awards:hover { background-color: #333; }    
.filmPosterSection__awardsHeader { color: #aaa; }   
html.mouse .gallerySection__header--title:hover { color: #ccc; }    
.navList--tertiary .navList__more:hover .navList__item--more .navList__text { color: #ccc; }    
.worldPopularSection .page__title, .worldPopularSection .page__title h2 { font-size: 1.5rem; line-height: 1.5rem; }  
html.mouse .personRoleCharacter__characterName--tooltip:hover { color: #ccc; }  
.personFilmographySection__filters .slumpdown--activity .slumpdown__tglBtnTxtLbl[data-counter]::after, 
.personFilmographySection__filters .slumpdown--activity .slumpdown__item[data-counter]::after { color: #aaa; } 
.mouse .coverSection__typeInfo:hover { color: #ccc; } 
.filmPressbooksSection__subtitle { color: #aaa; }      
.userReflector.slideFromTopLeft::before, .userReflector.slideFromTopRight::before { border-color: #333 transparent transparent !important; }    
.plc { background: #444; }
.plc::before { background: #666; }
.lazyDots::after { filter: invert(75%); }    
.ratingSummary--compact.ratingSummary .ratingSummary__users { border-color: #444; background-color: #181818; }    
.boxOpener__container { background-color: #333; }    
.boxOpener__container::after, .boxOpener__container::before { background-color: #333; }    
.boxOpener__title, .boxOpener.isOpen .boxOpener__title { color: #aaa; } 
html.mouse .boxOpener__bar:hover .boxOpener__title, html.mouse .boxOpener__bar:hover .boxOpener__toggle .ico { color: #ccc; }
.boxOpener__toggle { background-color: #222; }
.boxOpener__toggle .ico--arrowDown::before { color: #aaa; }  
.control--switchIcon .control__label:not(:last-child)::after { background-color: transparent; }    
.personFilmographySection__couterEpisodes { background: #222; color: #aaa; border-color: #444; }
.roleInEpisodes__list { color: #aaa; }
.roleInEpisodes__container { background: #181818; }
.roleInEpisodes__seasons, .roleInEpisodes__seasonTitle { color: #000; }    
.filmRatingBox__datePicker { background: #111; }
.filmRatingBox__datePickerHeader { color: #aaa; }
.datePicker__button { color: #aaa; }    
.filmRatingBox__extraPart .boxOpener.isOpen .roleActionBox__card { background: #333; }        
.forumSection.page__section--gray { background: #111; }    
.filmPosterSection__plot + .filmPosterSection__info::before { background-color: #444; }  
.filmInfo__vodInfo.vodActive a, .vodActive .filmInfo__vodInfoWrap span { color: #ccc; }  
.vodActive .filmInfo__vodInfoIcon { filter: invert(100%) hue-rotate(180deg) brightness(50%); }    
.filmInfo__vodInfo { border-color: #444; background: #222; }    
.filmVodSection__item--big { border-color: #444; background: #222; }   
.filmVodSection__item--big .filmVodSection__text { color: #aaa; }    
.filmVodSection__image--itunes, .filmVodSection__image--hbo, .filmVodSection__image--noweHoryzonty, .filmVodSection__image--appleTv, .filmVodSection__image--piecSmakow, .filmVodSection__image--ninateka, .filmVodSection__image--chili { filter: invert(65%); } 
.filmVodSection__image--playstation, .filmVodSection__image--mojeEkino { filter: invert(100%) hue-rotate(180deg); }    
.filmDatesSection__title { color: #aaa; }
.filmDatesSection__item:not(:last-of-type) { border-color: #444; }    
.ratingStats.isCompact .ratingStats__content { border-color: #333; background-color: #111; color: #aaa; }  
html.mouse .ratingStats.isCompact .ratingStats__content:hover { border-color: #444; }    
.filmInfo__vodInfo.vodActive:hover { background-color: #333; }  
.castRoleListElement__info { border-color: #444; }    
.ratingStats.isCompact .ratingStats__extra { background-color: #333; border-color: #444; }
.ratingStats__extraCount { background: #222; color: #aaa; }
.awardsSection__container { border-color: #444; background: #222; }   
.awardsSection__header { color: #aaa; }    
.awardsSection__container:hover { background: #333; } 
.ratingStats__extra { background: none; }    
.ratingStats__extraCount { border-color: #444; background-color: #111; color: #ccc !important; }  
.ratingStats__extraText { color: #aaa; } 
html.mouse .ratingStats__extra:hover .ratingStats__extraCount { border-color: #666; background-color: #333; }    
.filmEpisodesListSection__checkBox span { color: #aaa; }    
html.mouse .filmEpisodesListSection__checkBox:not(.isChecked):hover .ico, 
html.mouse .seasonOrEpisodeRatingBox__checkBox:not(.isChecked):hover .ico { color: #ffc404; }
html.mouse .filmEpisodesListSection__checkBox:not(.isChecked):hover .ico::after, 
html.mouse .seasonOrEpisodeRatingBox__checkBox:not(.isChecked):hover .ico::after { background: #ffc404; color: #000; }    
html.mouse .seasonOrEpisodeRatingBox__checkBox:not(.isChecked):hover { background-color: #333; }    
.filmRatingBox__beforePremiere + .filmRatingBox__votePart::after { border-color: #444; }    
.subPageMenu hr { border-color: #444; }    
.filmBasicInfo__title { color: #aaa; }
.mouse .filmBasicInfo__link:hover { color: #ccc; }
.characterFilmographySection .filmBasicInfo__info a { color: #aaa; }
.characterFilmographySection .filmBasicInfo__info a:hover { color: #ffc404 !important; }
.characterFilmographySection__couterEpisodes { background: #222; border-color: #444; }
.roleInEpisodes__more { background: #222; }
.mouse .roleInEpisodes__more:hover { color: #aaa; }
.preview.previewCard .preview__link { color: #aaa; }    
/* .preview.previewCard { background-color: #181818; } */
.filmSubPageHeaderSection :is(.preview, .previewHolder) { background-color: #000 !important; }
.subPageMenu .ico--arrowDown::before { color: #000; }
.subPageMenu__indicator .ico--arrowDown::before { color: #000 !important; }
.filmVodProvidersSection__image:not(.noBorder) { border-color: #333; background-color: #333; }
.filmVodProvidersSection__image:not(.noBorder):hover { border-color: #666 !important; background-color: #666 !important; box-shadow: inset 0 0 0 1px #666 !important; }
.filmVodProvidersSection__linkVodPage { color: #ffc404; }
.sidebarPanelRolesRates .sidebarPanel__roles { background: #222; }
.filmInfo__vodInfo::after, .filmInfo__vodInfo::before { background: #444; }
.isFlat .filmActionBox__seasonOrEpisodeRatingBox, .isFlat .filmActionBox__filmRatingBox { border-color: #444; }
.filmEmptySection { background: #111; }
.recentlyViewed__clear { color: #ffc404; }
.filmEmptySection .emptyBlock__image { filter: invert(75%) brightness(50%) grayscale(100%); }
.personFilmographySection__counterEpisodes { background: #222; color: #aaa; border-color: #444; }
/* .personFilmographySection__itemInner { background: #181818; } */
:is(.preview, .previewHolder).variantBadge { background-color: transparent; }
.personRole__subtitle a { color: #ffc404; }
.FilmSubPage .filmHeaderSection__navigation .page__text { border-color: #444; }
.filmBasicInfo__title a:hover { color: #ffc404 !important; }
.preview.previewCard .preview__header, .variantIndex .preview__index, .preview.previewCard .preview__content { color: #aaa; }
.simplePoster__character .link, .simplePoster__character a { color: #ffc404; }
/*
.personRolePreview:not([data-user-wts="0"]) .personFilmographySection__itemInner,
.personRolePreview:not([data-user-wts="0"]) .preview.previewCard { background-color: #1d1d1d; } 
.personRolePreview:not([data-user-rate="-1"]) .personFilmographySection__itemInner, 
.personRolePreview:not([data-user-rate="-1"]) .preview.previewCard { background-color: #222; }  
*/
.iconicRate__icon::before, .iconicRate[data-rate="-1"] .iconicRate__icon::before, 
.iconicRate--role[data-rate="0"] .iconicRate__icon::before { color: #aaa; }
.filmSeasonsAndEpisodesSection__message { background: transparent; }
.atmHeader { color: #aaa; }
.seasonPage .filmMenuSection .subPageMenu { background-color: #111 !important; }   
.seasonPage .filmMenuSection .subPageMenu__link:hover, 
.seasonPage .filmMenuSection .subPageMenu__dropDownList .subPageMenu__link:not(.dropDownButton) { background: initial !important; }    
.squareNavigation__item, .squareNavigation__select { background-color: #222; border-color: #444; }
.squareNavigation__dropdown:hover .squareNavigation__select { border-color: #444; color: #ccc; }
.mouse .squareNavigation__item:not(.squareNavigation__item--active):hover, 
.mouse .squareNavigation__select:not(.squareNavigation__item--active):hover { border-color: #444; background-color: #444; }
.squareNavigation__dropdown:hover::before { border-color: #444; }
.seasonPage .squareNavigation__item--active:not(:hover) { color: #ccc; }
.seasonPage .squareNavigation__item--active:not(:hover) .squareNavigation__text span { color: #ccc !important; }
.reviewBox--wide .reviewBox__content--label { background-color: #222; }
.filmCharactersSection__characterName { color: #aaa; }
.filmPosterSection__postCreditScenes a { color: #ffc404; }
.page.faOverlay .page__group[data-group="g3"] .stickyLayer__container { opacity: 0.25; }
.page.faOverlay .iconicRate__icon:not(.iconicRate__icon--rated)::before { color: #aaa; }
.wantToSeeStateButton__icon, .notInterestedStateButton__icon { color: #666; }
.personRole__ratingCount, .personRole__ratingRate { color: #aaa; }
.filmSeasonsRankingSection__item, .filmEpisodesRankingSection__item { border-color: #444; }
.cItDhZ[data-state="active"] { color: #ccc; }
.ePvSNF, .eRLMIY { border-color: #444; }
.ioXhHC, .enBNBX { color: #aaa; }
.enBNBX:hover { color: #ccc; }
.enBNBX:hover img { background: #444; border-radius: 5px; }
.filmPosterSection__postCreditScenes { color: #aaa; }
.filmRatingBox__vote { color: #aaa; }
.jGLsYu { color: #aaa; }
.jUIjfp { background-color: #222; border-color: #444; }
.filmVodInfoSection .page__container.filmVodInfoSection__grid a { color: #ffc404; }
.ieaOfv[data-state="active"] { color: #ccc; }
.dLxa-d, .cHsWSM { border-color: #444; }
.emLwOR, .jxVaMt { color: #aaa; }
.isKgxL { background-color: #333; border-radius: 3px; }
.isKgxL:hover { background-color: #444; }
.filmPosterSection__buttons a .worldRankingButton { background-color: #333; }
.opinionBox--hasShadow .opinionBox__container { background-color: #333; color: #aaa; }
.userInfo__link { color: #ccc; }
html.mouse .userInfo__link:hover { color: #fc0; }
.linkButton--white, .linkButton { color: #aaa; border-color: #222; background-color: #222; }
.linkButton::after { color: #aaa; }
.linkButton--white:hover, .linkButton:hover { color: #aaa; border-color: #111; background-color: #111; }
.filmInfo__vodInfoWrap span { color: #aaa; }
.communityRatings__rating--rate .communityRatings__value { color: #aaa; }
.squareNavigation__item.isActive, .squareNavigation__select.isActive { color: #000; }
/*
.filmRatingSection__filmActionBox .ratingPanel > div:first-child { background: #555 !important; }
.filmRatingSection__filmActionBox .ratingPanel > div:first-child > div:nth-child(2) { background: #555 !important; }
.filmRatingSection__filmActionBox .ratingPanel > div:first-child > div:nth-child(2) > div:first-child { background: #555 !important; }
*/
.filmEpisodesListSection__list .previewHolder .previewEpisode { background-color: #222; }
.ratingPanel > div:nth-child(1) { background-color: #222; color: #aaa; }
.ratingPanel > div:nth-child(1) > div { color: #aaa; }
.ratingPanel span[data-text="person"], .ratingPanel span[data-text="character"], .ratingPanel span[data-text="film"] { color: #ccc !important; }
.ratingPanel span[data-text] a:hover { color: #fc0 !important; }
.iconFavoriteButton--fav { background-color: #333; color: #aaa; border-color: #333; }
.iconFavoriteButton--fav .iconFavoriteButton__message { color: #aaa; }
.personFilmographySection__crs .preview.previewCard { background-color: transparent; }
.personFilmographySection .personFilmographySection__titleCounter { color: #aaa; }
/* </strona filmu/osoby/uniwersum> */

/* -------------------------------------------------- */

/* <forum> */
.buttonLooksLink, .notification__userName, .notification b { color: #ffcc00 !important; }
.forumSearch { background: #333; border-color: #666; }
.droptions-box .droptions-content > a, .droptions-box .droptions-content > button, .droptions-box .droptions-content form, 
.userPreviewInner .buttonsContainer { background: #333 !important; }
#pk-popup { background-color: #333 !important; color: #ccc !important; box-shadow: none !important; }
.notificationPopup a { color: #ddd; }
.post .userName { color: #ffcc00 !important; }
.post .postInfo { color: #bbb !important; }
.userPreview, .userPreviewInner { background-color: #333 !important; color: #ccc !important; box-shadow: none !important; }
.userPreviewInner::before, .userPreview .upp_arrow {
    border-color: #333 transparent transparent transparent;
    border-top-style: solid;
    box-shadow: none !important;
}
.user__link a, .user__link, .user__since, .user__preview, .user__nameFull { color: #ccc !important; }
.user__link:hover { color: #ffcc00 !important; }
.userPreview .sbtn { background-color: #333 !important; border-color: #666 !important; color: #ccc !important; }
.userPreview .sbtn:hover { background-color: #ffcc00 !important; border-color: #ffcc00 !important; color: #000 !important; }
.userPreview .followButton.sbtn .fonti.fonti-binoculars.s-20.vertical-align:hover { color: #000 !important; }
.blog-sidebar-entry-caption { color: #999 !important; }
.top-10 a { color: #ccc !important; }
.fbtn-page { background-color: #222; border-color: #444; color: #ccc; }    
.fbtn-page[disabled] { background-color: #333; color: #ffcc00 !important; }    
.fbtn-page:hover { background-color: #111; border-color: #444; }
/* <careful with that> */
.commentButtons input[type="submit"] { background-color: #333 !important; border-color: #666 !important; color: #ccc !important; }
.commentButtons input[type="submit"]:hover {
    background-color: #ffcc00 !important;
    border-color: #ffcc00 !important;
    color: #000 !important;
}
.controls input[type="submit"] { background-color: #333 !important; border-color: #666; color: #ccc !important; }
.controls input[type="submit"]:hover { background-color: #ffcc00 !important; border-color: #ffcc00; color: #000 !important; }
/* </careful with that> */
.addTopic.reset.addPlus { box-shadow: none !important; background-color: transparent !important; }
.addTopic.reset.addPlus:hover { box-shadow: none !important; background-color: transparent !important; color: #ffcc00 !important; }
.commentsHeaderOpinion, .commentsHeader { color: #ccc !important; }
.mCommentArea { background-color: #333 !important; border-color: #666 !important; }
.mCommentArea textarea { color: #aaa !important; }
.mCommentForm .cancel { background-color: #222 !important; color: #ccc !important; border: #666 1px solid !important; }
.mCommentForm .cancel:hover { background-color: #222 !important; color: #ccc !important; border: #ffcc00 1px solid !important; }
.btnMinus, .btnPlus { color: #ccc !important; }
.userReviews .sep-hr > li, .forumMain .topicWrapper, .post .postContentAndInfo { border-color: #444; }
.mComment { padding: 10px !important; background-color: #111 !important; border: #222 1px solid !important; }
.mCommentsSubList .mComment { box-shadow: none !important; border: none !important; }
.bComment {
    padding: 10px !important;
    background-color: #111 !important;
    border: #222 1px solid;
    margin-bottom: 10px !important;
}
.bCommentsSubList .bComment { box-shadow: none !important; border: none !important; }
#textareaReply { color: #ccc !important; background: #333 !important; }
.fwPrBtnWhite { border: #666 1px solid; background-color: #999 !important; }
.fwPrBtnWhite:hover { border: #666 1px solid; background-color: #333 !important; color: #ccc !important; }
.plusAdd:hover { color: #ffcc00 !important; }
.link.userNameLink { color: #ffcc00 !important; }
.comment__notifications--open .notificationList { background-color: #555 !important; color: #ddd !important; }
.actionsList { background-color: #333 !important; border-color: #666 !important; }
.actionsList button { color: #ccc !important; }
.reportAbuseContainer { background-color: #333 !important; box-shadow: none !important; }
.reportAbuseContainer textarea { background-color: #555 !important; color: #ddd !important; }
.forumTopicSection__backToForum, .forumSection__topicText--spoiler { color: #aaa; }
.forumTopicSection__backToForum:hover { color: #ccc; }
.forumTopicSection__title { color: #ccc; }
.forumTopicSection__authorName, .forumTopicSection__starsNo { color: #aaa; }
.forumTopicSection__topicText { background-color: #222; color: #aaa; }
.forumPopups__message h2, .popup__content .popup__message p { color: #aaa; }    
.forumPopups__message a:not(.popup__close) { color: #ffcc00; }    
.forumPopups__message a:not(.popup__close):hover { color: #976103; } 
.topicForm__title, .userBox__container { color: #aaa; }    
.topicForm__seasonEpisode .ss-wrapper { border-color: #666; }    
.topicForm__subject, .topicForm__content  { color: #aaa; border-color: #666; background-color: #333; }  
.userPreviewInner .user__preview, .userPreviewInner .user__preview .item:not(:first-of-type) { border-color: #666 !important; }    
.userPreviewInner .buttonsContainer .box .sbtn:hover { background: none !important; color: #ffcc00 !important; }  
.userPreview, .userPreviewInner { background: #333 !important; }  
.userReflector > * { border-color: #666 !important; background-color: #333 !important; }
.userReflector__voteBox, .userReflector__voteBox--hasData { border-color: #666 !important; background-color: #333 !important; }    
.userPreviewInner .user__image a, .userReflector .userAvatar { border-color: #666; background-color: #444; } 
.userAvatar.isLoaded { border-color: transparent; } 
.oldPage .filterForm__button { border-color: #666; }
.oldPage .filterForm { background: #333; }
.oldPage .inputForm__input { color: #aaa; border-color: #666; background-color: #333; } 
.oldPage .inputForm input:focus { color: #ccc; }    
.searchResult__find { background-color: #644c00; color: #ffcc00; } 
.searchResult__barBottom { border-color: #666; }
.searchResult--reply .replyTitle { color: #ccc; }  
.forumSection__itemLink:hover, .forumSection__authorName:hover { color: #ffcc00 !important; }    
.forumSection__lastWho span { color: #aaa; }    
.forumSection__lastWho:hover span { color: #ffcc00; } 
a.cap { color: #aaa; }    
.onlineInfo.userIsOnline { border-color: #111; }    
.forumSection__sort .slumpdown__button--toggle { background-color: #222; color: #aaa; }    
.commentForm__submit { color: #aaa; }    
.commentForm__text { padding: 5px; }    
.rankingUsersPage__topReviewers .rankingUsersPage__header, .rankingUsersPage__topReviewers .userBox__container { padding: 5px; }    
.filterForm__item { background-color: #333; }   
.filterForm__item:hover { background-color: #222; }    
.filterForm__item:hover a { color: #aaa; }    
.open .dropdown-toggle { color: #aaa; }    
#body.oldPage { color: #aaa; }    
#btnZapisz { background: #333; color: #aaa; border-color: #444; }    
.forumTopicSection__author:hover .forumTopicSection__authorName { color: #ccc; }      
.forumTopicSection__authorReply a:hover { color: #aaa; }  
img {color: #888; }    
.postContentAndInfo__overlay { background: rgba(64,64,64,0.5); }
a.cap:hover { color: #ccc; }    
.forumSection__topicText { color: #aaa; }    
.userPreviewInner .user__preview { background: #333; border-color: #444; }
.skin-1 .forumMain .topicWrapper, .skin-2 .forumMain .topicWrapper { border-color: #444; }
.forumSection__sort .slumpdown, .forumSection__query .slumpdown { background-color: #444; }
.forumSection__toolsIcon { color: #aaa; }
.forumSection__lastWho { color: #666; }
.variantSearch .forumTopicsList__searchInput { background-color: #222; color: #aaa; border-color: #333; }
.forumTopic__authorName, .forumTopic__title { color: #ccc; }
.forumTopic__authorName:hover, .forumTopic__title:hover { color: #fc0; }
.forumTopic__starsNo, .forumTopic .forumTopic__lastWho { color: #aaa; }
.forumTopic[data-spoiler="true"] .forumTopic__topicText, 
.forumTopic[data-block="true"] .forumTopic__topicTitle { color: #aaa; background-color: #222; border-radius: 5px; padding: 5px; }
.variantReply.forumTopic .forumTopic__topicText { background-color: #222; color: #aaa; }
.forumTopic__badge { background-color: #222; border-color: #222; color: #aaa; }
.forumTopic__badge:hover { background-color: #333; border-color: #333; color: #ccc; }
.forumTopic .pagination__link { background-color: #333; color: #aaa; border-color: #333; }
.mouse .forumTopic .pagination__link:hover { background-color: #222; color: #aaa; }
.forumTopic .pagination__dots { background-color: #222; color: #aaa; border-color: #222; }
.variantMainTopic.forumTopic .forumTopic__title { color: #ccc; }
.forumDiscussionSection__backToForum { color: #aaa; }
/* </forum> */

/* -------------------------------------------------- */

/* <video> */
.headerBar .pageHdr .hdr span { color: #ccc !important; }
.headerBar .pageHdr .hdrCaption, .headerBar .pageHdr .trailerDesc { color: #aaa !important; }
.bCommentArea textarea { color: #ccc !important; }
.bCommentForm .bCommentArea { color: #ccc !important; border-color: #666 !important; }
.entityDesc { color: #ccc !important; }
.link-btn.link.s-14.slideshowStart:hover { background: transparent !important; box-shadow: none !important; }
.commentFooter .reply.link.link-btn { background: transparent !important; box-shadow: none !important; }
#filmPhotosGallery .sbtn { background-color: #333 !important; color: #ccc !important; border: #666 1px solid; }
#filmPhotosGallery .sbtn:hover { background-color: #ffcc00 !important; color: #000 !important; border: #ffcc00 1px solid; }
.enhanced-lightbox-imagetitle a { color: #ffcc00 !important; }
.enhanced-lightbox-displaybox .enhanced-lightbox-displaybox-sidebar .rateInfo, .voteRate.container, .roleList.container, 
.enhanced-lightbox-displaybox .enhanced-lightbox-displaybox-sidebar { background: #333 !important; color: #bbb !important; }
.text-center { color: #bbb !important; }
.theme-bVotePanelLight .voteComment { background-color: #222 !important; border-color: #666 !important; }
.theme-bVotePanelLight .voteComment textarea { background-color: #222 !important; color: #aaa !important; }
.plusMinusSortToggle .dropdown-toggle { background-color: #333 !important; color: #ccc !important; border: #666 1px solid; }
.plusMinusSortToggle .dropdown-toggle:hover { 
    background-color: #ffcc00 !important; 
    color: #000 !important; 
    border: #ffcc00 1px solid; 
}
.sidebar .dropdown-toggle.sbtn:hover, .mainCol .dropdown-toggle.sbtn:hover { border-color: #ffcc00 !important; }
.reviewRate { color: #bbb !important; }
.reviewRateButtons button { background-color: #333 !important; color: #ccc !important; border: #666 1px solid; }
.reviewRateButtons button:hover { background-color: #ffcc00 !important; color: #000 !important; border: #ffcc00 1px solid; }
.contentExpander.isEnabled::after { background-image: linear-gradient(to top,#333,rgba(255,255,255,0)); }
.contentExpander__expand::before { color: #000; }
.videoAboutSection__descriptionPlot span { color: #aaa !important; }
.videoAboutSection { background: #181818; }
/* </video> */

/* -------------------------------------------------- */
    
/* <stars> */
.user__preview .ic-star_solid, .ic-star_solid.primary, .ic-large_star_in_circle, .ic-star_solid.frp_activeIc, 
.ic-heart_solid.primary-heart { color: #ffcc00 !important; }
.ic-star_solid.inactive { color: #aaa !important; }
.ic-star_solid { color: #aaa !important; }
.spc-ic.ic-star_solid.inactive { color: #aaa !important; }
.ifw-chceck-bold { color: #aaa !important; }
.ic-large_star_in_circle.primary.s-18 { color: #ffcc00 !important; }
.rate.s-20.vertical-align:hover, .ic-large_star_in_circle.s-20:hover { color: #ccc !important; }  
/* </stars> */    

/* -------------------------------------------------- */

/* <my fw> */
.infoPlace { background-color: #ffcc00 !important; color: #000 !important; }
.infoPlace .text { color: #111 !important; }
.infoPlace .sbtn { background-color: #333 !important; color: #ccc !important; border: #666 1px solid; }
.infoPlace .sbtn:hover { background-color: #ccc !important; color: #333 !important; border: #ccc 1px solid; }
.dashboardAssistantFilters button { color: #ffcc00 !important; }
.dashboardAssistantFilters button:hover { background-color: transparent !important; }
.dashboardAssistantFilters button.on { color: #bbb !important; }
.hdr-mega { color: #ccc !important; }
.invitationToConnect { color: #aaa !important; }
.dashboardAssistant .unreaded { background: #333 !important; color: #ccc !important; }
.dashboardAssistant .element {
    background: #333 !important;
    color: #ccc !important;
    margin-top: 1px;    
    margin-bottom: 1px;  
    box-shadow: none !important;    
    margin-left: 0px !important;
}
.dashboardAssistant .eventTitle { color: #ccc !important; }
.myFilmwebSort > .sbtn { background-color: #222 !important; color: #aaa !important; border-color: #666 !important; }
.myFilmwebSort > .sbtn:hover { background-color: #ffcc00 !important; color: #000 !important; border-color: #ffcc00 !important;}
.filmVote .activityEntryDesc p { color: #aaa !important; }
.item-sub .badge { color: #ccc !important; border-color: #ccc !important; }
.item-sub:hover .badge { color: #ffcc00 !important; border-color: #ffcc00 !important; background-color: transparent !important; }
.activityButtons .link-btn.likeButton.s-13:hover { background-color: transparent !important; box-shadow: none !important; }
.activityCounters .light { color: #bbb !important; font-weight: normal !important; }
.ohidden a { color: #ccc !important; }
#userMenu .item-user.item-extra .list { border-color: #666 !important; }
.plusLandingPage__section--home .plusLandingPage__logo {
    width: 19rem;
    height: 3.375rem;
    background-image: url("https://1.bp.blogspot.com/-gnMuotL7MTo/XIy-fGnLvlI/AAAAAAAAD-o/WdSQ68M9baYBZEt5sNRcQ_4X_5NVvRW0QCLcBGAs/s1600/fw%252Blogo.png");
}
.plusLandingPage__section--multikino .plusLandingPage__box::after { background-image: url("https://3.bp.blogspot.com/-uA3gFSOoqFI/XIy-fOFRKkI/AAAAAAAAD-s/6IJFdwWRgzsZBG32EKeJVqW4ZlqV5P-WwCLcBGAs/s1600/fw%252Bmulti.jpg"); }
.plusLandingPage__section--noAds .plusLandingPage__box::after { background-image: url("https://1.bp.blogspot.com/-3-k9WUoyj0o/XIy-fm-j7BI/AAAAAAAAD-w/64q2iWOnddIKfPyzi9AiQtK8YD7ZS3l5ACLcBGAs/s1600/fw%252Brambo.jpg"); }
.plusLandingPage__section--muve .plusLandingPage__box::after { background-image: url(https://1.bp.blogspot.com/-5g-6V36Jw6M/XvTPZ9RM5GI/AAAAAAAAEJQ/XuwFaVbOP8co9T1Z-4L6u25YXXlcWpTOQCLcBGAsYHQ/s1600/muvepl.jpg); } 
.plusLandingPage__section--multikino .container::before { filter: opacity(75%) contrast(150%) !important; }
.plusLandingPage__section--soon .plusLandingPage__box::after, .plusLandingPage__section--soon .plusLandingPage__placeholder {
    background: #666 !important;
}
.navList__item[data-value="rakuten"] .navList__text span { filter: invert(85%); }
.page__subtitle.page__subtitle--linkable a:not(:hover) { color: #ffcc00; }   
.paymentStep.paymentVariant { background: #222; }
.paymentStep.paymentVariant h1 { color: #ccc; }  
.paymentStep { background-color: #222; }   
.paymentStep__title { color: #aaa; }   
.subscriptionHeader__btn, .control__text a { color: #ffcc00; }    
.paymentTerms__check--alabaster { background-color: #222; } 
.fwBtn--plain, .fwBtn__plain { color: #aaa; }    
.fwBtn--plain:hover, .fwBtn__plain:hover { background-color: #333; color: #ccc; }  
.actionPage__mask { background: transparent !important; }    
.popup .orderedList { color: #aaa; }    
/* </my fw> */

/* -------------------------------------------------- */

/* <survey> */
.paginator_cont ul { background: transparent; border-color: #666; }
.paginator_cont ul { border-color: #666; }
.paginator_cont ul li a { color: #aaa; }
.paginator_cont ul .on span a { color: #ddd !important; }
.survey-details { background: #333 !important; border-color: #666; }
.survey-deadline { color: #bbb !important; }
.survey-description a, .survey-description-plain a, .survey-options a, .survey-question-other-results a { color: #ffcc00 !important; }
.survey-list h3 { color: #bbb !important; }
.see-all-results-link, .internal, .top3-result h4 a { color: #ccc !important; }
.see-all-results-link:hover, .internal:hover, .top3-result h4 a:hover { color: #ffcc00 !important; }    
.top3-result-wrap { background: #666 !important; }
.top3-result-wrap.with-img .top3-result .rank-number, .top3-result .result-score { color: #111 !important; }
.bottom-50 { background: #333 !important; color: #bbb !important; }
.survey-question-results, .survey-details { border-color: #666 !important; }
.survey-question-results h2 a, .survey-details h2 a { color: #ddd !important; }
.top3-result-wrap:not(.with-img) .rank-number { color: #fff !important; }
.top3-result h4 { color: #ddd !important; }
.survey-description-plain, .question-content { color: #bbb !important; }
.survey-answer-card { background: #333 !important; color: #bbb !important; border-color: #666 !important; }
.survey-results a.btn--light { background-color: #333 !important; color: #ccc !important; border: #666 1px solid; }
.survey-results a.btn--light:hover { background-color: #111 !important; color: #ccc !important; border: #666 1px solid; }
.survey-participate h1 { color: #ccc !important; }
.survey-participate div { color: #aaa !important; }
.survey-answer-card input + label:hover div, .survey-answer-card input:checked + label div { color: #333 !important; }
.survey-participate .btn { background-color: #333 !important; color: #ccc !important; border: #666 1px solid; }
.survey-participate .btn:hover { background-color: #111 !important; color: #ccc !important; border: #666 1px solid; }
.survey-answer-card input:checked + label, 
.survey-answer-card input + label:hover { background-color: #ffcc00 !important; border: #ffcc00 1px solid; }
.survey-answer-card input + label:hover a, .survey-answer-card input:checked + label a { color: #000 !important; }
.survey-details .survey-description p { color: #aaa; }   
.survey-participate hr, .survey-results hr { background: #666; }   
.surveyResultsBox__description, .surveyResultsBox__title, .surveyResultsBoxItem__title,
.surveyResultsBox--photo .surveyResultsBoxItem .surveyResultsBoxItem__score { color: #aaa; }  
.surveyResultsBox__header { border: none; background: #222; }    
.surveyResultsBox--photo .surveyResultsBox__answers { background-color: #333; }    
.surveyResultsBox--photo .surveyResultsBoxItem .surveyResultsBoxItem__label { color: #000; }    
.surveyResultsBoxItem { border: none; background-color: #333; }  
.surveyResultsBoxItem__label { background-color: #303030; } 
.surveyResultsBoxItem__bar { background-color: #666; }   
.surveyHeaderSection__title { color: #ccc; }
.surveyHeaderSection__description { color: #aaa; }
.resultsListSection__bestList { background-color: #333; } 
.surveyAnswer { background-color: #333; border-color: #666; }    
.surveyAnswer__score, .surveyAnswer__link h3 { color: #aaa; }  
.surveyAnswer__photo::before, .surveyHeaderSection__photoContainer { border-color: #666; }  
.surveyAnswersSection__question { color: #aaa; }    
.newHr, .hr { border-color: #444; }  
.surveyAnswer__text { color: #aaa; } 
.surveyBox__question { color: #aaa; } 
.surveyBox { background-color: #333; }
.surveyBox__title { color: #ccc; }
.surveyBoxAnswer__content { color: #aaa; }
.surveyBoxAnswer { border-color: #666; }
html.mouse .surveyBoxAnswer:hover { background: #222; }
.surveyBoxAnswer__score { color: #ccc; }
.surveyBoxAnswer__bar { background-color: #222; }
/* </survey> */

/* -------------------------------------------------- */

/* <konkursy> */
.slideshowMain--advertisement .Carousel::after { background-color: #111 !important; }
#homeAdvertisingPlace .CarouselWrapper::after { background-color: transparent !important; border-color: #999 !important; }
#homeAdvertisingPlace .slideshowMain__wrapper { background-color: #666 !important; border: 2px solid #ccc; }
#homeAdvertisingPlace .slideshowMain__wrapper:hover { background-color: #ffcc00 !important; border-color: #ffcc00 !important; }
#homeAdvertisingPlace .slideshowMain__wrapper:hover a { color: #111 !important; }
.slideshowMain--advertisement .Carousel__button-next, .slideshowMain--advertisement .Carousel__button-prev {
    background-color: #999 !important;
}
.slideshowMain--advertisement .Carousel__button-next:hover, .slideshowMain--advertisement .Carousel__button-prev:hover {
    background-color: #ccc !important;
}
.mainCol#awardSpecial .section-gala-show h2.hdr.section-title, .mainCol#awardSpecial h2.hdr.section-title { color: #ccc !important; }
.bL3 { background-color: #333 !important; color: #ccc !important; border-color: #666 !important; }
.bL3 a { color: #ffcc00 !important; }
ul.vertical-list li { color: #ccc !important; }
.tpc { background-color: #333 !important; color: #aaa !important; border-color: #666 !important; }
.contestsInfo { text-align: center !important; }
.boxSwitcher .bsDark { background-color: #333 !important; color: #aaa !important; }
.boxSwitcher .bsDark a.contCat { color: #ddd !important; }
.boxSwitcher .bsLight { background-color: #222 !important; color: #ddd !important; }
.boxSwitcher .bsLight a.contCat { color: #ffcc00 !important; }
.latestContests th, .latestContests td { background-color: #222 !important; color: #aaa !important; }
.top-20 { color: #aaa !important; }
.top-20 .sbtn { background-color: #333; color: #ccc; border-color: #444; }
.top-20 .sbtn:hover { background-color: #ffcc00; color: #000; border-color: #ffcc00; }
.regulationsLabel span a { color: #ddd !important; }
.redLabel { background-color: #ffcc00 !important; color: #000 !important; font-weight: bold !important; }
.mcAwardSection { background-color: #333 !important; color: #bbb !important; }
.mcPointsSection { background-color: #333 !important; color: #bbb !important; }
.contestContainer section.mcPointsSection li { color: #aaa !important; }
.contestContainer section.mcPointsSection li span { color: #000 !important; }
.pageBox { color: #aaa !important; }
.contestContainer, .fileUploadSection, #contestPhotosWrapper { background: #222 !important; color: #aaa !important; }
.contestContainer section.contestPhotos .photo .desc .photo-about .user-name { color: #ffcc00 !important; }
.contestContainer .pollTitle, .contestContainer .filmDescription { color: #aaa !important; }
.regulationHuawei { background: #333 !important; }
.awT .headerSortDown span { background: url(https://1.bp.blogspot.com/-qUY5e7r6RlY/W18gN5FacBI/AAAAAAAAD2M/816PFsvr008WNIN7U9QnGbwJONEQ0kHFwCLcBGAs/s1600/bgArrY.png) no-repeat 5px -59px !important; }
.awT .headerSortUp span { background: url(https://1.bp.blogspot.com/-qUY5e7r6RlY/W18gN5FacBI/AAAAAAAAD2M/816PFsvr008WNIN7U9QnGbwJONEQ0kHFwCLcBGAs/s1600/bgArrY.png) no-repeat 5px -40px !important; }
.contestDescr .text.contentDescr.text-large.normal.bottom-50 { padding: 10px !important; }
.top-20.contestForm .normal.s-16.bottom-10, .contestDescr .normal.s-16 { color: #ccc !important; }
.contest__description, .contest__priceDesc { color: #aaa; }
.contest__finished, .contest__form { background-color: #333; }
.contest__finished textarea, .contest__form textarea { background-color: #222; border-color: #666; color: #aaa; }
.contest__finished .control__title a, .contest__form .control__title a { color: #ffcc00; }
.contest__finished .control__title a:hover, .contest__form .control__title a:hover { color: #ddd; }
.filmRelated .winners .nominationsList.twice, .filmRelated .winners .nominationsList.twice li .photoPoster, .filmRelated .winners .nominationsList.twice li + li .photoPoster { border-color: #444; }    
/* </konkursy> */

/* -------------------------------------------------- */

/* <rekomendacje> */
.hdr.hdr-super.vertical-align { text-shadow: none !important; }
.howItWorks { background: #222 !important; border-color: #666; }
.howItWorks a { color: #ffcc00 !important; }
#recommendationsEntry .slider-handle { background: url("https://4.bp.blogspot.com/-bQfMRKmN20k/W1oY1kox10I/AAAAAAAAD2A/QV5LBm4bhGYI3noASkXq64DuH1XdHTUlQCLcBGAs/s1600/spYellow.png") no-repeat scroll center top transparent; }
.filmsTogglePanelParent .filmsTogglePanel { background: #444; }
.filmsTogglePanelParent .filmsTogglePanel button.on { 
    background: #ffcc00 !important; 
    color: #000 !important;
    border-radius: 2px !important;
}
.filmsTogglePanelParent { background: #333 !important; border-color: transparent !important; }
.filmsTogglePanelParent .typeNameLabel { color: #ccc !important; }
.filmPreview .filmPreview__title { color: #ddd !important; }
.filmPreview .filmPreview__title:hover { color: #ffcc00 !important; }
.filmPreview__year { color: #ccc !important; }
.cloud { background: #333 !important; color: #aaa !important; }
.tvSeanceLink { color: #aaa !important; }
.sChannel:hover { background: #666 !important; border-radius: 5px !important; }
.filmAdditionalInfo a { color: #aaa !important; }
.recommText, .recomVal, .gwt-InlineLabel { color: #ccc !important; }
.uniVotePanel.light { background-color: #333 !important; border-color: #666; }
.uniVotePanel.light .watchingButton, .uniVotePanel.light .wantToSeeButton, .uniVotePanel.light .dontWantToSeeButton, 
.uniVotePanel.light .voteGroup { border-color: #666; }
.uniVotePanel .wantToSeeButton:hover .dot { color: #ffcc00 !important; }
.uniVotePanel.light button { color: #bbb !important; }    
.uniVotePanel .dontWantToSeeButton:hover .dot { background: url("https://fwcdn.pl/front/ogfx/beta/set.43.png") no-repeat scroll -600px -140px rgba(0,0,0,0); }
.cloud { border-color: #666; }    
.filmsTogglePanelParent .filmsTogglePanel button:hover { background-color: #666; border-radius: 2px; }  
.genreButtons .genre { color: #ffcc00; }    
.genreButtons .genre:hover { color: #ccc; } 
html.mouse .dropdown--bottom.dropdown .dropdown__button .button:hover { color: #ccc; }
.dropdown__list { background: #333; color: #aaa; }
html.mouse .button:hover { background: #444; color: #ccc; }
html.mouse .userConnection__followers:hover { color: #ccc; }
/* nowe */
.kwVeyi[data-state="active"], .bSdull[data-state="active"] { color: #ccc; }
.eudtnw { border-color: #444; }
.kNoeRN, .eeMyuF, .EgAz, .ifhPDR { color: #aaa; }
.kNoeRN:hover, .EgAz:hover, .ifhPDR:hover { color: #ddd; }
section.sc-bXCLTC:not(.itemList) { background-color: #000; color: #aaa; }
.Rhykp, .Rhykp.hasDropdown, .ebUKbW, .dAjhPh, .hgytmV { background: #333; }
.iQqEwD, .hwpeyD { background-color: #222; color: #aaa; }
/* </rekomendacje> */

/* -------------------------------------------------- */

/* <reviews> */
.fwBtn.fwBtn--small:hover { color: #000 !important; background-color: #ffcc00 !important; }
.TabsNav .item--others-group .TabsNavGroup { background-color: #333 !important; }
.TabsNav .item--others-group .TabsNavGroup .item a.fwBtn {
    border: none !important;
    box-shadow: none !important;
    background-color: transparent !important;
    margin: auto !important;
}
.TabsNav .item--others-group .TabsNavGroup .item a.fwBtn:hover { color: #000 !important; background-color: #ffcc00 !important; }
.TabsNav .item--others-group .TabsNavGroup .item { background: transparent !important; box-shadow: none !important; }
.filmReviewsList__item .review__description, #userReviewsCarousel .review__description { padding-left: 10px !important; }
.userReviews__item { border-color: #666 !important; }
.userReviews__item .review__description { padding: 10px !important; }
.navList--outlined .navList__item--selected .navList__button:hover { background-color: transparent !important; }
.reviewBox--middle .reviewBox__content { background-color: #222; }
.reviewBox__filmTitle, .reviewBox__rate, .reviewBox__userName { color: #aaa; }
.reviewsPage .reviewBox__content { background: #111; }
.newsHeaderSection { background-color: #222 !important; }
.breadcrumbs__list, .newsHeaderSection--noCover, .reviewRatingSection__wrapper .author-box {  border-color: #666 !important; }
.newsRelatedFilmsSection .filmRatingBox__container, .reviewsLatestSection .reviewItem { border-color: #444 !important; }
.breadcrumbs__item, .newsHeaderSection__typeLabel, .newsHeaderSection__title, .newsHeaderSection__authorName, .newsRelatedFilmsSection__title, 
.reviewsLatestSection .reviewItem__title, .author-box__authorName:not(:hover) { color: #ccc !important; }
.reviewsLatestSection .reviewItem__title:hover, .newsRelatedFilmsSection__title:hover,.newsHeaderSection__authorName:hover, 
.reviewRatingSection__wrapper .author-box__desc a:hover { color: #ffcc00 !important; }
.newsMainSection__news, .myVote__label, .myVote__rate, .reviewRatingSection__header, 
.commentSection__headerTitle { color: #aaa !important; }
.reviewRatingSection__wrapper { background-color: #333 !important; }
.comment__body { background-color: #333 !important; color: #aaa !important; }
.comment__body span:last-child::before { color: #aaa !important; }
.commentForm__text { border-color: #666 !important; color: #ccc !important; background: #222; }
.commentMore--gradient::before { background: #333; background: linear-gradient(180deg,hsla(0,0%,0%,0),#111); }   
.flatReview__more, .reviewRatingSection__wrapper .author-box__desc a { color: #ffcc00; }    
.flatReview__more:hover, .reviewRatingSection__wrapper .author-box__desc a:hover { color: #ccc !important; }    
.flatReview:not(:last-of-type) { border-color: #444; }    
.flatReview__rate, .flatReview .ico--starSolid { color: #aaa; }     
.newsRelatedFilmsSection .filmRatingBox, .newsRelatedFilmsSection__panel { background-color: #333; }
.reviewBox .ico--starSolid, .myVote__iconRate .ico { color: #aaa; }    
.author-box__desc, .reviewRatingSection__text { color: #aaa; }    
.opinionBox__container { background-color: #222; }
.opinionBox__name { color: #aaa; }
.reviewPage .atmTile, .crs--polaroids .crs__item > .atmTile { background: #222; }
.atmDesc a { color: #ffc404; }
.atmRate { color: #aaa; }
.atmRate__count { color: #aaa; }
/* </reviews> */    

/* -------------------------------------------------- */

/* notifications */
#notificationsPage .settingsNotifications, #notificationsPage .notify a { color: #ffcc00 !important; }
#notificationsPage .eventTime { color: #aaa !important; }
.winners div, .nomineeHdr, .nominationsList .filmsList { color: #ccc; }
.nomineDesc, .categoryName { color: #aaa; }    

/* -------------------------------------------------- */

/* <magazyn> */
.footer .fwPrBtn { background-color: #333 !important; color: #ccc !important; border-color: #666 !important; }
.footer .fwPrBtn:hover { background-color: #999 !important; color: #000 !important; border-color: #999 !important; }
.menuColumn.gold, .menuList ol span, .menuList ul span { color: #000 !important; }
.menuList .groupDesc { font-weight: bold !important; }
.menuHeader { color: #000 !important; }
.fwmArticle .contentElement { background: #222 !important; color: #ccc !important; }
.icon-thumb-up, .icon-thumb-down { background-image: none !important; }
#pkc .list h3 { color: #ccc !important; }
.articleShareFB { background: #4761a3 !important; color: #fff !important; }
.articleShareFB:hover { background: #6f8ddb !important; color: #fff !important; }
#thumbnails #titleRoller .thumbnailDescription { background-color: rgba(34, 34, 34, .5) !important; }
.fwmArticleQuote, .extraElement, .extras.tempHide, .extras.tempHide .active, .extraElement.active { background-color: #777; } 
.fwmArticle .contentElement .articleContentElement .innerFix .articleTitle,
.fwmArticle .contentElement .articleContentElement .innerFix .articleAuthorName { color: #ccc; }
.fwmArticle .contentElement .articleContentElement .innerFix .articleContent { color: #aaa; }
.mobile .comment-opts-opener { background-color: transparent; }
.fwmArticle, .fwmArticle .extras { background: #333 !important; }
.reverseLogo #fwmLogo, .parallaxVisible #fwmLogo { background-image: url('https://2.fwcdn.pl/gf/fwm/logo_fwm.svg'); }
.reverseLogo .fwmMenuOpenerIcon, .parallaxVisible .fwmMenuOpenerIcon { background-image: url('https://2.fwcdn.pl/gf/fwm/x_white.svg'); }
.quoteContainer, .fwmArticleQuote, .fwmArticleQuote .quoteParent div { color: #ccc !important; }  
#fwmMenu .menuList ul span { color: #ccc !important; }       
#fwmMenu .menuColumn .menuHeader { color: #ccc !important; }   
#fwmMenu .menuColumn { background: #333; }    
#fwmMenu .menuColumn.gold { background: #ffcc00; }     
#fwmMenu .menuColumn.gold .menuHeader { color: #000 !important; }    
#commentsSortBy { background: #333; color: #aaa; border: 1px solid #666; } 
/* </magazyn> */

/* -------------------------------------------------- */

/* <baza> */
.section__searchMenu, .section__header.section__header--bwb { background: #111 !important; color: #ccc !important; }
.navList__dropdown { background-color: #333 !important; }
.navList__dropdown .navList__button:hover { background-color: #333 !important; }
.section__header--bwb .section__title .no-query { color: #ddd !important; }
.fwBtn__wrapper.fwBtn__wrapper--full { background: transparent !important; }
.rangeSlider__state span, .rangeSlider__state--center, .starSlider__state label, .starSlider__state span { color: #aaa !important; }
.collapse__btn.collapse__full-btn .fwBtn__label { color: #ccc !important; }
.collapse__btn.collapse__full-btn .fwBtn__label .fwBtn__activeFilters { color: #ccc !important; }
.collapse__btn { background-color: #333 !important; border-color: #444; }
.collapse__btn:hover { background-color: #333 !important; border-color: #555; }
.collapse__btn.collapse__is-expanded .ifw-arrow_down, .collapse__btn .ifw-arrow_down { color: #ffcc00 !important; }
.handle { background-color: #aaa !important; } 
.genderSelect__option:hover { background-color: #ffcc00 !important; }
.hit.hit--person { border-color: #444; background-color: #111; color: #ccc; }
.hit__title a { color: #ddd !important; }
.hit__title a:hover { color: #ffcc00 !important; }
.sbtn.full-width { color: #ccc !important; background-color: #333 !important; border-color: #666; }
.sbtn.full-width:hover { color: #000 !important; background-color: #ffcc00 !important; border-color: #ffcc00; }
.noinationsInfoCont { color: #ccc !important; background-color: #333 !important; }
.noinationsInfoCont:hover { color: #000 !important; background-color: #ffcc00 !important; }
.sbtn.sbtn-primary { color: #000 !important; }
.s-20 { color: #ccc !important; }
.s-20:hover { color: #ffcc00 !important; }
.awardDescription .cap a { color: #bbb !important; }
.winners .nominationsList > li { border-color: #666; }
.awardDescription { background-color: #222 !important; }
.serialsWTSSelectionSection { border-color: #666 !important; }
.page__section--gray { background-color: #111; }
.serialsWTSSelectionSection__searchBox .searchBox__container { background-color: #222 !important; border-color: #666; }
.serialsWTSSelectionSection__searchBox .searchBox__input { color: #ccc !important; }
.navList--secondary .navList__item--selected .navList__button .navList__text { color: #111 !important; }
.mouse .navList--secondary .navList__item:not(.navList__item--selected) .navList__button:hover .navList__text, .page__navigation.page__navigation--sticky .navList--secondary.navList--sticky, 
.collapse__full::before, .collapse__none::before { background-color: #333; }
.page__navigation .navList--secondary:last-child { border-color: #666; }
.subpage-searchFilm .filmPreviewHolder .filmPreview { border: 1px solid hsla(0,0%, 75%,.2); }
.characterPreview__card, .worldPreview__card { background: #181818; }    
.characterPreview__badge { background: none; }   
.characterPreview__title { color: #ccc; }    
.characterPreview__title a:hover, .characterPreview__info a:hover { color: #ffcc00 !important; }      
.characterPreview__card .commonRating__count, .characterPreview__info, .characterPreview__info a { color: #aaa; }    
.filterSelect__showAllButton:not(:hover) { background-color: #333; color: #aaa; }    
.worldPreview__info { color: #aaa; }   
.canalPlusPage .filmPreview__card, .serialsPage .filmPreview__card, .stayAtHomePage .filmPreview__card { background: none !important; }
.canalPlusPage .filmPreview, .serialsPage .filmPreview, .stayAtHomePage .filmPreview { border: none !important; }
.filmPreviewHolder.isSmall .filmPreview .filmPreview__card, 
.filmPreviewHolder.isMini .filmPreview .filmPreview__card { background: #181818 !important; }    
/* cannes */ img[src="https://fwcdn.pl/award/92.jpg"] { filter: invert(92%) hue-rotate(170deg) brightness(120%); } 
/* goya */ img[src="https://fwcdn.pl/award/324.jpg"] { filter: brightness(180%); }    
.searchProvider__default--active a { color: #111; } 
.page__section--shadow { background-color: #222; }   
.searchProvider__default, .searchProvider__item { background-color: #444; }    
.searchProvider__item:not(.noBorder) { border-color: #555; }    
.searchProvider__expand { background: #333; border-color: #444; }   
.searchProvider__default--active { background: #ffc200 !important; }   
.ico--arrowDown::before { color: #ccc; }   
.searchProvider__separator { background: #444; }    
.mouse .searchProvider__item:hover { background-color: #666; }  
.mouse .searchProvider__item:hover:not(.searchProvider__item--active) { border-color: #666; }
.searchProvider__default { border-color: #555; } 
.premieresHeader__group .navList--primary .navList__item--selected .navList__text { color: #000 !important; } 
.premieresHeader .slumpdown__button.slumpdown__button--toggle { background-color: inherit; }    
.rankingProvider__item:not(.noBorder) { border-color: #444; }    
.rankingProvider__item { background-color: #444; }   
.mouse .rankingProvider__item:hover { background-color: #666; }  
.rankingProvider__expand { background: #333; border-color: #333; }     
.rankingProvider__expand .ico--arrowDown::before { color: #aaa; }    
.rankingProvider__expand:hover { background: #444; border-color: #444; }       
.providerFilter__item:not(.noBorder) { border-color: #444; }
.providerFilter__default, .providerFilter__edit, .providerFilter__item { background-color: #333; }
.mouse .providerFilter__item:hover { background-color: #666; }
.providerFilter__expand { border-color: #444; background: #181818; }
.providerFilter__expand:hover { background: #333; }    
.providerFilter__default { background-color: #181818; border-color: #333; }
.mouse .providerFilter__default:hover { background-color: #333; border-color: #333; }  
.providerFilter__edit { background-color: #333; }    
.mouse .providerFilter__edit:active { background-color: #444; }
.mouse .providerFilter__edit:active .ico { color: #ccc; }    
.mouse .providerFilter__edit:hover .ico { color: #aaa; }    
.vodButton { background: #333; border-color: #333; color: #ccc; }
.vodButton:hover, .mouse .vodButton .vodButton__logo:hover { background-color: #666; border-color: #666; } 
.popup--vodPicker.popup .popup__footer .fwBtn--plain.fwBtn--gold.fwBtn--disabled { color: #000; background-color: #aaa; }  
.popup--vodPicker.popup .popup__footer .fwBtn--plain.fwBtn--gold:not(.fwBtn--disabled) { color: #000; }    
.popup--vodPicker.popup .popup__footer .fwBtn--plain.fwBtn--label { background-color: #333; }
[data-linkable="vodUpcoming"] .providerFilter__item[data-original-producer="false"]::before, 
[data-linkable="vodFree"] .providerFilter__item[data-has-free="false"]::before { background: #222; }
.mouse .rankingProvider__item:not(.noBorder):hover { background-color: #666; box-shadow: inset 0 0 0 1px #666; border-color: #666; }
.mouse .providerFilter__item:hover:not(.providerFilter__item--active) { box-shadow: inset 0 0 0 1px #666; border-color: #666; }
.mouse .providerFilter__item:not(.noBorder):hover { background-color: #666; box-shadow: inset 0 0 0 1px #666; }
.navList--secondary .navList__text { color: #aaa; }
.searchPage .simplePoster { background-color: #222; }
.preview.previewCard.previewFilm .preview__year { color: #aaa; }
.communityRatings__value { color: #ccc; }
.vue-control__button, .vue-slumpdown { background-color: #333;  border-color: #444; }
.vue-header, .vue-slumpdown__active .vue-slumpdown__value { color: #aaa; }
.vue-slumpdown__active { border-color: #333; }
.vue-slumpdown__groups { background-color: #222; }
.vue-slumpdown__group { border-color: #444; }
.vue-control__checkbox input, .searchApp__filter .control input { filter: invert(80%) hue-rotate(15deg) saturate(200%); }
.vue-slumpdown__button:hover { color: #ccc; }
.sidebarPanel .sidebarPanel__header { border-color: #666 !important; }
.sidebarPanel .divider { background: #666 !important; }
.sidebarPanel .starButton { color: #ccc !important; }
.sidebarPanel .starButton:hover { color: #ffc404 !important; }
.slider .noUi-handle { background: #ccc; border-color: #ccc; box-shadow: none; top: -0.5rem; }
.slider.noUi-target { border: none; background: #aaa; border-color: #aaa; box-shadow: none;  }
.sidebarPanel__footer { background: #222 !important; }
.sidebarPanel__footer::before { background: linear-gradient(to bottom,rgba(248,248,248,0) 0%,#222 100%) !important; }
.sidebarPanel .filterButton { background-color: #181818 !important; }
html.mouse .sidebarPanel .filterButton:hover { color: #aaa !important; }
.mouse .vodButton:hover:not(.active) { background-color: #666 !important; box-shadow: none !important; border-color: #666 !important; }
.sidebarPanel .searchWrapper .search { border-color: #444 !important; background-color: #222 !important; }
.sidebarPanel__back g[stroke="#000"] { stroke: #fff !important; }
.sidebarPanel .filter__clear:hover { color: #ccc !important; }
.vue-header__extra--colon span + span::before { color: #aaa; }
/* </baza> */    

/* -------------------------------------------------- */

/* <premiery-zapowiedzi> */
.pageContent .subHeader .TabsNav .item__is-active a { background-color: transparent !important; border: #ffcc00 1px solid !important; }
.pageContent .subHeader .TabsNav .item a:hover { background-color: transparent !important; border: #666 1px solid !important; }
.pageContent .subHeader .TabsNav .item a { border: transparent 1px solid; }
.pageContent .subHeader .subHeader__bar { border-color: #666 !important; }
.pageContent .subHeader .subHeader__bar--fixed { background-color: #222 !important; }
.listBadge, .listBadge .listBadge__item { background-color: #222 !important; color: #ccc !important; border-color: #444 !important; }
.listBadge .listBadge__item .realease-link { color: #ccc !important; }
.listBadge .listBadge__item .realease-link:hover { color: #fff !important; }
.boxBadge { background-color: transparent !important; }
.sideBoxes .sideBox__pos { border-color: #444 !important; background-color: #222 !important; }
.sideBoxes .sideBox__pos .extraInfo time { color: #aaa !important; }
.sideBoxes .sideBox__pos .itemTitle a:hover { color: #ffcc00 }
.premieresList .filmPreviewHolder .filmPreview { border: 1px solid hsla(0,0%,100.0%,.2); }
.premieresHeader__group .navList__container::before { background: #111; }    
.premieresHeader__group .navList--primary .navList__item:not(.navList__item--selected):hover { background: #222; }   
.md-checkbox input[type="checkbox"]:checked + label::before { background: #ffc404; }
.md-checkbox input[type="checkbox"]:checked + label::after { border-color: #111; }      
.md-checkbox label::before { background: #444; } 
.md-checkbox:hover label::before { background: #666; }  
.posterInfoBox__remaster { color: #aaa; }
.preview__placeholderIndex, .variantIndex--compact .preview__index { background: #333; }
.variantIndex--compact .preview__index::after { border-color: #333; }
/* </premiery-zapowiedzi> */

/* -------------------------------------------------- */

/* <fw prod> */
.author-box { background-color: #333 !important; }
.author-box.description-box .author-box__desc { color: #aaa !important; }
.TabsNav .item--others-group .TabsNavGroup .item:hover { font-weight: normal !important; color: #ddd !important; }
.discontinuedProductions { background-color: transparent !important; }
.netflixNews .crs .crs__wrapper, .netflixNews .carousel__wrapper { background: #181818 !important; }
.section-sn__footer { background-color: #111 !important; border-color: #333 !important; }
.section-sn__footer a { color: #aaa !important; }
.section-sn__footer a:hover { color: #d81f26 !important; }
.drawMovie--background { background: url(https://3.bp.blogspot.com/--WpCXO15VjI/XG7PLnsUCAI/AAAAAAAAD60/tjFBDdnwRS8SUm8Z4_rjthOqlec3A0UtACLcBGAs/s1600/ntflxRndm.png) no-repeat right top; }
.filmPreview__card { background: transparent; }
.userEventRolePreview, .filmPreview { border: none; }
#netflixMostWantToSee .FilmRatingBox.filmRatingBox.isInited { background: transparent !important; border: none !important; }
#netflixTopTenToday { background-color: #222 !important; }
.advertButton a { background-color: #181818; color: #ccc; }
.advertButton a:hover { background-color: #333; color: #ccc; }
.advertButton::after { border: none; }
.advertButton--hbo span { filter: invert(75%); }
.page__header + .page__header { margin: 0; }
.drawMovie__button.fwBtn.drawMovie__button--netflix { background-color: #333 !important; }
.drawMovie__button.fwBtn.drawMovie__button--netflix:hover a { color: red; }
.drawMovie__filmPreview.filmPreviewHolder { background-color: #222; }
.drawMovie .filter { background-color: #222;}
.drawMovie .filter__title, .drawMovie .filter__columnTitle { color: #ccc; }
.drawMovie .filter__button { background: #333; color: #aaa; }
.drawMovie .filter__button:hover { background: #666 !important; color: #ddd; }
.drawMovie .filter__button--active { background: #ffcc00 !important; color: #000 !important; }
.filmHeaderSection__header { border-color: #111; background-color: #000; }  
.netflixPage .filmPreview__card { background: none !important; }  
.netflixPage .filmPreview { border: none !important; } 
.netflixPage .rankingSection { background: none; }
.simpleCarouselSection--hbo .hboLogo { filter: invert(75%); }   
#hboHomePageSection .simpleBox__image { margin-top: -1.5rem; }    
/* </fw prod> */    

/* -------------------------------------------------- */

/* <news> */
.fwBtn.fwBtn--small { background-color: #333 !important; color: #aaa !important; border-color: #666; }
.fwBtn.fwBtn--small:hover { background-color: #999 !important; color: #000 !important; border-color: #666; }
.EmbeddedTweet--mediaForward .EmbeddedTweet-tweet { background-color: #111 !important; border-color: #666; }
.navList--bordered, .newsNewestSection__item { border-color: #666; }
.navList__button:hover { color: #ffcc00 !important; }
.TabsContainer { background-color: transparent !important; }
.newsNewestSection__item-title:not(:hover) { color: #ccc !important; }
.newsRelatedFilmsSection__switchRight .ico::before, .newsRelatedFilmsSection__switchLeft .ico::before,
.newsNewestSection__showMoreBtn .ico::before { color: #222 !important; }
.newsNewestSection__showMore::before {
    background-image: linear-gradient(180deg,hsla(0,0%,100%,0),#111);
    border-color: #666;
}
.newsSocialSection__header{ color: #aaa !important; }
.newsMainSection__news > .page__text > * > a:not(.black):not(.fwPlayerPlusBtn):not(.markupPhoto), 
.newsMainSection__news > .page__text > a:not(.black):not(.fwPlayerPlusBtn):not(.markupPhoto), 
.newsMainSection__news a.internal:not(.fwPlayerPlusBtn) { color: #ffcc00 !important; }
.newsMainSection__news > .page__text > * > a:not(.black):not(.fwPlayerPlusBtn):not(.markupPhoto):hover, 
.newsMainSection__news > .page__text > a:not(.black):not(.fwPlayerPlusBtn):not(.markupPhoto):hover, 
.newsMainSection__news a.internal:not(.fwPlayerPlusBtn):hover { color: #ddd !important; border-color: #ddd !important; }
.textRankingItem { background-color: #333 !important; color: #ccc !important; border-color: #666; }
.textRankingItem__body { border-color: #666; }
.textRankingItem__body .rateBox__rate, .textRankingItem__body .filmPreview__advertButton a { color: #ccc !important; }
.textRankingItem__description { background-color: #222 !important; border-color: #666; color: #aaa !important; }
.textRankingItem__body .filmPreview__badge { background-color: #222 !important; border: 1px solid #666; }
.textRankingItem__body .filmPreview__card { padding-left: 10px; }
.textRankingItem__position { background-color: #444 !important; color: #ddd !important; border-color: #666; }
.newsSection .page__text span { color: #aaa !important; } 
.polaroid--horizontal .labelBox { top: 0.5rem;}    
.page__section--gradient .page__top { background: none; }  
html body, html button, html input, html textarea { color: #aaa; }    
.filmsList :hover, filmsList .link:hover { color: #fff; } 
.newsRelatedFilmsSection__photo { background-color: #444; }    
.newsHeaderSection__author .link { color: #ccc; }    
.mainSlideshowSection .firstNewsContainer .polaroid__title a, .slideshowSection__firstRowTitle { text-shadow: 2px 2px #000; }    
.mainSlideshowSection .firstNewsContainer .polaroid__commentsCount, .slideshowSection__firstRowComments { text-shadow: 1px 1px #000; } 
.mainSlideshowSection .firstNewsContainer .polaroid__caption { border: none !important; }  
#playerHomePageSection .crs__prev, #playerHomePageSection .crs__next { top: 110px !important; }
#playerHomePageSection .crs__wrapper > div:nth-child(1), #playerHomePageSection .crs__wrapper > div:nth-child(4), #playerHomePageSection .crs__wrapper > div:nth-child(5) { display: none; }    
.homePromotedSection, .homePromotedSection__crs, .homePromotedSection .crs::after { background: none !important; }   
.homePromotedSection .page__title { color: #aaa; }   
.breadcrumbs, .socialSection__container { border-color: #444; }    
.socialSection__header { color: #aaa; }   
.homePromotedSection .page__subtitle {color: #aaa; }  
.homePromotedSection.homePromotedSection--player .playerLogo::before { filter: invert(75%) hue-rotate(180deg); }
.whySection__tvElements { background: url(https://i.imgur.com/QxuuLKm.png) center top no-repeat; background-size: contain; }
.whySection__ico { border-color: #444; background: #333; border-radius: 5px; }
.homePromotedSection.homePromotedSection--hbo .hboLogo { filter: invert(80%); }
.surveyBox.variantHome .surveyBoxAnswer__content { text-shadow: #000 1px 1px 1px; background: none; }
.surveyBox.variantHome { filter: brightness(80%); }
.homeMostPopularSection .crs__item .filmPoster::before, .vodPopularSection .crs__item .simplePoster__poster::before { text-shadow: #000 2px 2px 2px; }
.advertisingPolaroidsSection__crs .polaroid__caption { background: #333; }
.newsMainSection table tr:first-of-type { background: #333; color: #ccc; }
.newsMainSection table tr { border-color: #333; color: #aaa; }
.newsMainSection table tr:not(:first-of-type) { background: #181818; }
.homeNewsSection .navList--primary .navList__text, .homeNewsSection .navList--tertiary .navList__text { color: #aaa; }
.homeNewsSection__items .group--second .homeNewsSection__item:nth-child(1) .tile.tile--video .tile__title a { color: #aaa; }
.faNews__content { background-color: #222; border-color: #222; color: #aaa; }
.faNews__teaser { color: #bbb; }
/* </news> */

/* -------------------------------------------------- */

/* search results */
.query, .no-query { color: #ddd; }
.listBadge.listBadge--related .listBadge__item a { color: #fff; }
.listBadge.listBadge--related .listBadge__item a:hover { color: #999; }
.hit.hit--user { border-color: #666; }
.polaroid.polaroid--small-mobile.polaroid--border { border-color: #444; }

/* -------------------------------------------------- */

/* 404 */
.error__title { color: #aaa !important; }
.error__description { color: #ccc !important; }
.error__description a { color: #ffcc00 !important; }    
.fail-message a, .fail-message a:hover { color: #ffcc00 !important; }

/* -------------------------------------------------- */

/* <zwiastuny> */
.productionsTypesList a { color: #ccc !important; }
.productionsTypesList .active a { color: #000 !important; }
.productionsTypesList li.active { border-radius: 5px !important; }
.productionsElements .moreBtn { background: none !important; box-shadow: none !important; }
.vjs-resize-manager { display: none !important; }
.commentForm__line { background-color: #666; }
.video-linked--desktop { background-color: #222 !important; }
.video-linked--desktop .crs__title { color: #bbb !important; }
.video-linked--desktop .crs__title:hover { color: #ffcc00 !important; }
.video-linked { background-color: #333; }
.video-linked .crs__title { color: #ccc; }
.ico--arrowDown::before { color: #000; }
.page__section--wide:not(.isDark):not(.page__section--black) .crs::before { 
    background: linear-gradient(90deg,hsla(0, 0%, 6.7%, 0.72) 0,hsla(0, 0%, 100%, 0) 98%) no-repeat; 
}
.page__section--wide:not(.isDark):not(.page__section--black) .crs::after { 
    background: linear-gradient(90deg,hsla(0,0%,100%,0) 0,hsla(0, 0%, 6.7%, 0.72) 98%) no-repeat; 
}    
.mostCommentedTrailersSection .boxTrailer .trailer { background: #222; }
.mostCommentedTrailersSection .boxTrailer .trailer__lead { color: #aaa; }    
.videoItem--placeholder a { background-color: #222; } 
.videoItem--placeholder a:hover { background-color: #333; }  
.trailersMostCommentedSection .boxTrailer .trailer { background: #222; }
.trailersMostCommentedSection .boxTrailer .trailer__lead { color: #aaa; } 
.navRankingSection .posterInfoBox--rankings .posterInfoBox__title { height: 5.5rem; padding: 0.25rem 0; }    
/* </zwiastuny> */    

/* -------------------------------------------------- */

/* <ranking> */
.contestsQuestionnaresQuizzes { background-color: transparent !important; }
.collapse { border-color: #444 !important; background-color: transparent !important; }
.collapse__gradient::before { background: linear-gradient(hsla(0, 0%, 100%, 0), hsla(0, 0%, 100%, 0), #181818) !important; }
.ranking__filter-btn { border: #ffcc00 1px solid !important; }
.ranking__filter-btn.fwBtn--disabled { border: #666 1px solid !important; }
.ranking__list .item.place { border-color: #444; background-color: #181818; }
.rate__value, .rate__count, .ranking__short-info { color: #aaa !important; }
.ranking__legend .ranking__header, .ranking__formula { color: #bbb !important; }
.ranking-category__list a:hover { color: #ddd !important; }
.ranking__list .film__title:hover { color: #ffcc00 !important; }
.role__person-link:hover, .role__film-link:hover, .role__film.film__link:hover { color: #ffcc00 !important; }
.hasQuestionnaire .questVoteButton .sbtn { background-color: #333; border-color: #444; color: #ccc !important; }
.hasQuestionnaire .questVoteButton .sbtn:hover { 
    background-color: #ffcc00; 
    border-color: #ffcc00; 
    color: #000 !important; 
}
.rankingUsersPage__header h1, .rankingUsersPage__header h2, .rankingUsersPage__header h3, .rankingUsersPage__header h4,
.rankingUsersPage__headerh5, .rankingUsersPage__header h6, .rankingUsersPage__header h7 { color: #ccc !important; }
.rankingUsersPage__topReviewers { background-color: #333 !important; }
.userBox__container { background-color: #222; border-color: #666; }
.contest__winners-list .userBox__container { background-color: transparent; }
.rankingList__userName { color: #aaa !important; }
.rankingList__userName:hover { color: #ccc !important; text-decoration: underline !important; }
.rankingList__row--header { background-color: #333 !important; color: #aaa !important; }
.rankingList__container, .rankingList__row { border-color: #666 !important; }
.rankingUsersPage__backToRanking { color: #aaa !important; }
.rankingUsersPage__backToRanking:hover { color: #ddd !important; }
.slumpdown--long { border-color: #666; background-color: #282828 !important; }
.slumpdown--long:hover { border-color: #999; }
.slumpdown--long .slumpdown__button.slumpdown__button--toggle {
    background-color: transparent !important;
    box-shadow: none !important;
    color: #bbb !important;
}
.rankingUsersPage__awards { background-color: #222 !important; }
.userRankingAwards__header { color: #ccc !important; }
.userRankingAwards__userName a { color: #aaa !important; }
.userRankingAwards__userName a:hover { color: #ddd !important; }
.filmRatingPanelHeader a { color: #ddd !important; }
.filmRatingPanelHeader a:hover { color: #ffcc00 !important; }
.filmRatingPanelHeader .originalTitle { color: #ccc !important; }
.sausageBar__navigation::before { background-color: #444; }    
.rankingType__position, .rankingTypePerson__position { background: #222; color: #ccc; }    
.rankingType, .rankingTypePerson { border-color: #666; background-color: #222; }    
.rankingType__title, .rankingTypePerson__title { color: #ccc; } 
.rankingType__title:hover, .rankingTypePerson__title:hover, .rankingTypePerson__desc > a:hover { color: #ffcc00; } 
.rankingType__originalTitle, .rankingTypePerson__desc > * { color: #aaa; }  
.rankingType__year { color: #999; }
.rankingStatic__formula strong { color: #aaa; }    
.sausageBar__content > * { background-color: transparent; }    
.sausageBar__content::before { background-image: linear-gradient(transparent,#333); }    
.sausageBar__button .ico { filter: invert(75%); }  
.playNowBanner { background:#222; color:#aaa; }   
#canalPlusOriginalsRanking { background: none; }
.posterInfoBox.posterInfoBox--wide .posterInfoBox__link, 
.posterInfoBox.posterInfoBox--wide .posterInfoBox__trailerName + .posterInfoBox__link { padding: 1px; } 
.sausageBar__button { color: #aaa; }    
#rankingHeaderSection .slumpdown__button.slumpdown__button--toggle { background-color: transparent !important; }    
.rankingStaticSection .category__item a:hover { color: #aaa; }    
.rolePreview__ranking { background-color: #666; color: #fff; }
.rolePreview__ranking:hover { background-color: #444 !important; color: #eee !important; }    
.rankingType__genres > a { color: #aaa; }    
.rankingType__genres > a:hover { color: #ddd; }  
.rankingType__genres { color: #aaa; }     
.rankingType--role .rankingType__title.expand [data-expand] { color: #ffc404; }    
.rankingType.rankingType--even, .rankingType.rankingType--even .rankingType__position { background: #333 !important; }
.rankingType__vod a { color: #aaa; background-color: #111; border-color: #111; }
.mouse .rankingType__vod a:hover { color: #aaa; background-color: #000; border-color: #000; }
/* </ranking> */

/* -------------------------------------------------- */

/* <fw poleca> */
.recommends__list .film__rec-info .inner { border-color: #666; background-color: #333; }
.recommends__list .film__rate-info, .recommends__list .film__want-to-see-info { color: #aaa; }
.recommends__list .film .review, .recommends__list .film__poster-wrapper { background-color: #222; }
.recommends__list .film .review__header { background-color: transparent !important; }
.recommends__list .film { border-color: #666; }
.section__fw-recommends .slumpdown__button.slumpdown__button--toggle { 
    background-color: transparent !important; 
    box-shadow: none !important; 
}
.pageContent .premieresHeader .section__title .slumpdown__button.slumpdown__button--toggle {
    background-color: transparent !important;
    box-shadow: none !important;    
}
.navList__dropdown .navList__button:hover { background-color: #222 !important; }
/* </fw poleca> */    

/* -------------------------------------------------- */

/* <vod> */
.vodDrawMovieSection__info { background-color: #333; }
.vodDrawMovieSection { background: #111; }
.drawMovie .step__action--gold { background: #ffc200; color: #000; }
.drawMovie__wrapper { background: #222; }
.drawMovie__step { background: #333; }
.drawMovie__title { color: #aaa; }
.drawMovie__close { color: #aaa; }
.drawMovie .step__setFavorites .control input:disabled ~ * { opacity: .5; color: #aaa; }
.drawMovie .control__indicator { background: #111; }
.drawMovie__item:not(.noBorder) { border-color: #555; }
.drawMovie__default, .drawMovie__edit, .drawMovie__item { background-color: #222; }
.mouse .drawMovie__item:not(.noBorder):hover { background-color: #666; box-shadow: inset 0 0 0 1px #666; }
.mouse .drawMovie__item:not(.drawMovie__favorites):hover:not(.drawMovie__item--active) { border-color: #666; }
.drawMovie__item:not(.noBorder).drawMovie__item--active { border: 1px solid #ffc200; background: #ffc200; }
.result__vods { background: #222; }
.drawMovie .filmPreviewHolder.isSmall .filmPreview .filmPreview__card, 
.drawMovie .filmPreviewHolder.isMini .filmPreview .filmPreview__card { background: none !important; }
.mouse .result__vods:hover { background: #e7a90f; color: #000; }
.step .typeList li, .step .moreInfoList li, .step .genres li:not(.head) { border-color: #444; background: #222; }
.step .typeList li:hover, .step .moreInfoList li:hover, .step .genres li:not(.head):hover { background: #444; }
.step .typeList li.active, .step .moreInfoList li.active, .step .genres li:not(.head).active { border-color: #ffc200; background: #ffc200; color: #000; }
.step .typeList li[disabled], .step .moreInfoList li[disabled] { background: #666; opacity: .25; }
.vodScheduleSection__date { background-color: #333; }
.vodScheduleSection__provider { background: #333; }
.vodScheduleSection__providerLogo { border-color: #333; }
.vodScheduleSection__list::before { background-color: #444; }
.vodScheduleSection__date { padding: 0 0.5rem; }
.filmCoverRateCritic__overlayInner { background-color: #222; color: #aaa; }
.filmCoverRateCritic__criticName { color: #ccc; }
.filmCoverRateCritic__overlay::before { background: #222; }
.page__group[data-group="g2"] .vodCommonSection .page__container, .page__group[data-group="g2"] .vodProvidersSection .page__container { 
    background: #222; 
}
.page__group[data-group="g2"] .vodCommonSection .navList--primary .navList__text, .page__group[data-group="g2"] .vodCommonSection .navList--tertiary .navList__text, .page__group[data-group="g2"] .vodCommonSection .navList--primary .navList__button, .page__group[data-group="g2"] .vodCommonSection .navList--tertiary .navList__button { color: #aaa; }
.providerFilter__text.clear { background: #181818; }
.mouse .providerFilter__text.clear:hover { color: #aaa; }
.vodFaqSection__item { background: #222; }
.disneyCatalogInfo { background: #222; }
.providerFilter__expand:hover { box-shadow: inset 0 0 0 1px #333; }
/* </vod> */
    
/* -------------------------------------------------- */

/* <dokumenty> */
#help-pl_PL a { color: #ffcc00 !important; }
.privacyPage { background-color: #111 !important; padding-top: 1px !important; padding-bottom: 25px !important; }
.richContentPage, .richContentPage__header--main { background-color: #111 !important; color: #ccc !important; }
.richContentPage__header { color: #bbb !important; }
.richContentPage a { color: #ffcc00 !important; }
#advertising-pl_PL div, #publisher-pl_PL div, #editorial-pl_PL div { background-color: #111; }
#specyfikacja-new-pl_PL .tabbedPanels .panelContainer, 
#specification-pl_PL .tabbedPanels .panelContainer { border-top: #666 1px solid !important; }
.rodoBoard, .rodo__wrapper { background: #222 !important; }
.rodo__desc { color: #aaa; }
.rodo__description, .rodo__description--wide { background-color: #282828; color: #aaa; }
.rodo__wrapper a { color: #ffcc00; }
.rodo__wrapper a:hover { color: #ccc; }
#advertising-pl_PL, #publisher-pl_PL, #editorial-pl_PL, #privacy-pl_PL, #help-pl_PL { color: #aaa; }
.oldPage a { color: #ffcc00; }   
#editorial-pl_PL .person__name { color: #aaa; }
#advertProfilingShowButton { color: #ffc404; }
/* </dokumenty> */    

/* -------------------------------------------------- */

/* brak obrazu */
.place .film__title .role__poster .inner, .place .film__roles .film__poster, .place .person__roles .film__poster, .place__poster .entity__link, .place__poster .main-picture-poster, .personRole__image, .polaroid__thumbnail .thumbnail, .filmPoster__link, .filmPoster__link .thumbnail, .filmPosterSection__poster, .personRoleCharacter .collagePoster, .personRoleCharacter .poster, .personRoleCharacter .posterRole, .personPosterSection__poster, .thumbnail, .episodePreview__imageWrapper::before, .seasonPreview__imageWrapper::before, .personRole__image--empty, .simplePoster__link, .recentlyViewed__poster, .siteSectionHeader__poster, .ribbonPanel.isOpen .ribbonPanel__poster, .personPoster__link, .filmPreview__poster .poster__image, .poster__wrapper, .IRI .recentlyViewed__poster, .personRole__posterRole--empty, .personRole__placeholderPoster, .bVtDiV, .iaOJFg, .klHqdt, .cuXzHG, .eMZpNV, .atmImage, .surveyAnswer__photo, .opinionBox.variantFilm .opinionBox__coverPhoto, .rJRWW, .dggzuU, .boXLmA, .ckrBFE, .jjvZwd, .ha-DLIP, .MEtZK, .caFjUk, .fISsUs {
    background-color: #444; 
    border-color: #444;
}
.promotedItem--default .promotedItem__image { background-color: #444 !important; border-color: #444 !important; }

/* -------------------------------------------------- */

/* <users> */
.similarityUsersInfo__roles, .similarityUsersInfo__users { color: #aaa !important; }
.sendMessage__input, .sendMessage__textarea { background: #333 !important; border-color: #666 !important; }
.popup__button.fwBtn.fwBtn--black.fwBtn--confirmBtn, .popup__button.fwBtn.fwBtn--black { background-color: #111 !important; }
.popup__button.fwBtn.fwBtn--black.fwBtn--confirmBtn:hover, .popup__button.fwBtn.fwBtn--black:hover { background-color: #222 !important; }
.popup__button.fwBtn.fwBtn--text.sendMessage__popupFloatButton { border-left: #666 1px solid; padding-left: 2rem !important; }
.sendMessage__popupAnchor { color: #ffcc00 !important; }
.userAboutTopRated__list .posterInfoBox__rateBox, .userAboutTopRated__list .posterInfoBox__rateBox:hover, .userAboutWTS__list .posterInfoBox__rateBox, .userAboutWTS__list .posterInfoBox__rateBox:hover, .userAboutFavorite__list .posterInfoBox__rateBox, .userAboutFavorite__list .posterInfoBox__rateBox:hover { 
    box-shadow: none !important; 
    background-color: transparent !important; 
    color: #aaa !important; 
}
.similarityUsers__similarity, .similarity__count { color: #000 !important; }
.friendSuggestBox { background-color: #333 !important; }
.friendSuggestBox__button .fwBtn { border-color: #666 !important; background-color: #222 !important; }
.friendSuggestBox__button .fwBtn:hover { border-color: #ffcc00 !important; color: #ffcc00 !important; }
.dynamicTextField__seeMore { border-color: #444; background-color: #333; }
.dynamicTextField--expandable:not(.dynamicTextField--editing):not(.dynamicTextField--expanded) .dynamicTextField__value::after { 
    background-image: linear-gradient(180deg, hsla(0, 0%, 50%, 0) 4%, #111);
}
.section--alabaster.userReviews { background-color: #151515 !important; border-color: #666 !important; }
.similarityBox { padding-top: 15px !important; }
.wrapperContent__sidebars .userReviews .review { background-color: #222 !important; border-color: #666 !important; }
.wrapperContent__sidebars .userReviews .review__inner .review__description, .gridView__item .review__description { padding: 10px !important; }
.wrapperContent__sidebars .userReviews .review__inner .review__meta { padding-left: 10px !important; padding-top: 10px !important; }
.userNewestFriends__stats { border-color: #666 !important; }
.likeCounter__person { color: #aaa !important; }
.voteCommentBox.VoteCommentBox { background-color: #222; border: #444 1px solid; padding: 25px; }
.voteCommentBox.VoteCommentBox.hasComment { background-color: #282828; }    
.voteCommentText, .voteCommentText__label { background-color: transparent !important; }
.userConnectionBox .userPreview { background-color: transparent !important; box-shadow: none !important; }
.userConnectionBox .userConnectionBox__inner { border-color: #444 !important; background-color: #222 !important; }
.userConnectionBox__badge { background-color: #181818; border: #444 1px solid; border-top: none; }
.userConnectionBox--alabaster .userConnectionBox__btn { background-color: #181818; }
.userConnectionBox__badge .userConnectionBox__btn { border-color: #666 !important; }
.userConnectionBox__badge .userConnectionBox__btn:hover { color: #ffcc00 !important; }
.userConnectionBox__menu--is-open .menuList { background-color: #333 !important; }
.userConnectionBox__menu--is-open .menuList::before { border-color: transparent transparent #333 !important; }
.userConnectionBox__menu .menuList .fwBtn .fwBtn__message { color: #aaa !important; }
.userConnectionBox__menu .menuList .fwBtn .fwBtn__message:hover { color: #ddd !important; }
.hideSectionButtons__menu { background-color: #222 !important; }
.hideSectionButtons__menu::before { border-color: transparent transparent #222 !important; }
.hideSectionButtons__btn { color: #aaa !important; }
.hideSectionButtons__btn:hover { color: #ffcc00 !important; }
.section--alabaster { background-color: #333 !important; border-color: #666 !important; }
.userConnectionBox .user__message:hover { color: #ddd !important; }
.userConnectionBox .user__fullName:hover { color: #ffcc00 !important; }
.user__link a:hover, .user__nameFull:hover { color: #ffcc00 !important; }
.authPage__card { background-color: #222 !important; }
.authPage__title { color: #ccc !important; }
.authButton--google, .authButton--filmweb, .authButton--secondary, .authButton--register, 
.authButton:not(.authButton--text):not(.authButton--secondary):not(.authButton--register) { 
    color: #ccc !important; 
    background-color: #444 !important; 
    border: none !important; 
}
.authButton--google:hover, .authButton--filmweb:hover, 
.authButton:not(.authButton--text):not(.authButton--secondary):not(.authButton--register):hover { 
    color: #ccc !important; 
    background-color: #666 !important; 
    border: none !important; 
}
.authButton--secondary:hover, .authButton--register:hover { color: #000 !important; background-color: #ffcc00 !important; }
.facebookLoginButton:hover { background-color: #6f8ddb !important; }
.authButton--text { color: #ffcc00 !important; }
.authButton--text:hover { text-decoration: underline !important; }
.userFriendSuggestBoxSection { background-color: #333; }
.similarityBox__users::before { background-color: #222; border-radius: 15px; }
.similarityUsersInfo .fwBtn { background-color: #333; padding: 10px; padding-top: 7px !important; }
.similarityUsers__similarity--error { filter: invert(75%); }
.loginEncourageTooltip { background-color: #333; }   
.loginEncourageTooltip__wrapper { color: #ccc; }   
.popup__close { background-color: #333; }
.popup__close:hover { background-color: #222; }    
.loginPopup__card { background-color: #333; }
.loginPopup__header { color: #ccc; }
.loginPopup__button:not(.loginPopup__button--back):not(.loginPopup__button--divider) { color: #aaa; border-color: #666; background-color: #222; }
.loginPopup__button:not(.loginPopup__button--back):not(.loginPopup__button--divider):hover { background-color: #444; }
.loginPopup__close { color: #ffcc00; }  
.userDescriptionSection__link, .userDescriptionSection__since { color: #aaa; }   
.materialForm__input { background-color: #333; }   
img[src="https://fwcdn.pl/front/ogfx/beta/ic/plugs/v01/user_plug.svg"],
img[src="https://fwcdn.pl/front/ogfx/avatars/asexual.svg"],
img[src="https://fwcdn.pl/front/ogfx/avatars/male.svg"],
img[src="https://fwcdn.pl/front/ogfx/avatars/female.svg"] { filter: invert(75%); }   
.avatar > a, .avatar__link { background: none; } 
.userAvatar.isLoaded .userAvatar__imageWrap::before { border: none; }   
.similaritiesFilms__header { color: #aaa; }    
/* </users> */

} /* darkEnd */

} /* domainEnd */


@-moz-document domain("filmweb.pl") {
/* ------------------------------------------ */
/*               End of the Line              */
/* ------------------------------------------ */
    
#cmlPlaceholder { display: none; }  

}
