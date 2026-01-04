// ==UserScript==
// @name         Recon messages moderniser
// @namespace    https://bengrant.dev
// @version      0.1
// @description  Modernises the message interface on recon.com
// @author       Ben Grant
// @match        https://messages.recon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410111/Recon%20messages%20moderniser.user.js
// @updateURL https://update.greasyfork.org/scripts/410111/Recon%20messages%20moderniser.meta.js
// ==/UserScript==

var styles = `
:root {
    --bg-color: #FFF;
    --txt-color: #000;
    --gray-bg: #DDD;
    --gray-txt: #777;
}
@media screen and (prefers-color-scheme: dark) {
    :root {
        --bg-color: #000;
        --txt-color: #FFF;
        --gray-bg: #444;
        --gray-txt: #BBB;
    }
}
body, .bodyBG {
    color: var(--txt-color);
    background-color: var(--bg-color);
}
.container_title_bgcolor, .corner_footer, .listItemFieldDark, .toMessageBodyContainer, .toSenderNameContainer, .gallery_button_off, .MessageTabSelected, .TitleBar, .UnreadGrey, .PullDownTabs {
    background-color: var(--bg-color);
}
.SiteTabs LI A, .MessageTab A, .site_links_outer {
    background-color: var(--bg-color);
}
.SiteTabs LI.SelectedSiteTab A, .MessageTabSelected A, .SelectedSiteTab, .MessageTabSelected {
    border-bottom: none;
}
.SiteTabs LI.SelectedSiteTab A, .MessageTabSelected A {
    background-color: var(--bg-color) !important;
    text-decoration: underline;
}
.MessageTab A, .MessageTabSelected A {
    width: initial;
    padding: 0 16px;
    line-height: initial !important;
    margin-top: 10px !important;
}
a, .white_text, .t101-button:link, .t101-button-highlight:link, .t101-button:visited, .t101-button-highlight:visited, .unread, .unreadProfile, #showPrevious label:hover, .unreadNotification, .uploading_notification span, .tab_closed a:active, .tab_open a:active, .ui-state-default, .ui-widget-content .ui-state-default, .ui-widget-header .ui-state-default, .ui-state-default a, .ui-state-default a:link, .ui-state-default a:visited, .ui-state-hover, .ui-widget-content .ui-state-hover, .ui-widget-header .ui-state-hover, .ui-state-focus, .ui-widget-content .ui-state-focus, .ui-widget-header .ui-state-focus, .TitleBar, .DialogTitle SPAN, .UnreadGrey, .UnreadGrey a, #ReportContentWrapper span, .MCProfileItemName {
    color: var(--txt-color) !important;
}
.MessageTabLogo {
    display: none;
}
.container_menu_bgcolour, .file-list-container, .uploading_notification, .container_message_bgcolor, #MainWrapper, #ConversationList, #MessageList, #GalleryList, #GalleryImageList, #NotesList, #NoteList, #NotLoggedIn, #MyVisitorList, #FavouriteList, #AttachmentImageList, #attachmentContainer, .CloseAttachments, #ReportContentWrapper {
    background-color: var(--bg-color);
}
.dialog_background_frame, .container_content_bgcolour, .button_colour, .listItemFieldLight, .ContentWrapper, .ConversationCol1, .ConversationCol2, #SendMessageFormItems, .DialogWrapper, .MCProfileItem {
    background-color: var(--bg-color);
}
.fromMessageBodyContainer, .fromSenderNameContainer, .ReceivedGrey {
    background-color: var(--gray-bg);
}
#galleryProgressIndicator, .message_background_border, #ConversationList, #MessageList, #GalleryList, #GalleryImageList, #NotesList, #NoteList, #NotLoggedIn, #LoadingMore, #MyVisitorList, #FavouriteList, #AttachmentImageList {
    border: 0;
}
.MessageBodyContainer {
    margin-top: 0;
}
#NoteList, #MessageList {
    background: var(--bg-color);
}
.light_text, .ConversationDate, .MessageReceivedWrapper a, .MessageTimerContainer, .ic_page_header2, .ic_page_personalise, .ic_check_text1, .ic_check_text2 {
    color: var(--txt-color);
}
.Overlay, .LogoutContainer, .FavouritePhotoButton, .favouritePhotoIndicator, #eventPhoto, #eventOverlay, .paymentDivider, .dialogOverlay, .SendBlock, #panel_container {
    background-color: var(--bg-color);
}
#SendMessageTitleBar span, .member_count {
    color: var(--gray-txt) !important;
}
.ui-state-default, .ui-widget-content .ui-state-default, .ui-widget-header .ui-state-default {
    background: none;
}
.ReadIcon {
    opacity: 0;
    width: 0;
}
#ConversationList, #GalleryList, #NotesList {
    background-image: none;
}
.Conversation {
    border-bottom: 1px solid var(--gray-bg);
    margin-top: 2px;
}
#options, #locationsearch_local, #locationsearch_global, #locationsearch, #options, #search_header, #premium_features, .bottom_dark_border, .membership_table_row, .membership_table_heading, .corner_content_general_break, .MCProfileItem {
    border-bottom: 0;
}
.UnreadHighlight {
    background-color: var(--gray-bg) !important;
}
#MessageTabs {
    position: sticky;
    top: 0;
    background-color: var(--bg-color);
    z-index: 1000;
}
body > div {
    overflow: initial !important;
}
#messageBody, #NoteText {
    background-color: var(--bg-color);
    color: var(--txt-color);
}

::-webkit-scrollbar {
    width: 4px;
}
::-webkit-scrollbar-track {
    background: var(--bg-color);
}
::-webkit-scrollbar-thumb {
    background: var(--gray-bg);
}
`

let styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
link.type = 'image/svg+xml';
link.rel = 'shortcut icon';
link.href = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg%3E%3Cpath fill='hsl(0, 100%25, 40%25)' d='M22.772 10.506l-5.618-2.192-2.16-6.5c-.102-.307-.39-.514-.712-.514s-.61.207-.712.513l-2.16 6.5-5.62 2.192c-.287.112-.477.39-.477.7s.19.585.478.698l5.62 2.192 2.16 6.5c.102.306.39.513.712.513s.61-.207.712-.513l2.16-6.5 5.62-2.192c.287-.112.477-.39.477-.7s-.19-.585-.478-.697zm-6.49 2.32c-.208.08-.37.25-.44.46l-1.56 4.695-1.56-4.693c-.07-.21-.23-.38-.438-.462l-4.155-1.62 4.154-1.622c.208-.08.37-.25.44-.462l1.56-4.693 1.56 4.694c.07.212.23.382.438.463l4.155 1.62-4.155 1.622zM6.663 3.812h-1.88V2.05c0-.414-.337-.75-.75-.75s-.75.336-.75.75v1.762H1.5c-.414 0-.75.336-.75.75s.336.75.75.75h1.782v1.762c0 .414.336.75.75.75s.75-.336.75-.75V5.312h1.88c.415 0 .75-.336.75-.75s-.335-.75-.75-.75zm2.535 15.622h-1.1v-1.016c0-.414-.335-.75-.75-.75s-.75.336-.75.75v1.016H5.57c-.414 0-.75.336-.75.75s.336.75.75.75H6.6v1.016c0 .414.335.75.75.75s.75-.336.75-.75v-1.016h1.098c.414 0 .75-.336.75-.75s-.336-.75-.75-.75z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E";
document.getElementsByTagName('head')[0].appendChild(link);