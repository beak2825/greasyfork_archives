// ==UserScript==
// @name            Camamba Chat Settings Library
// @namespace       dannysaurus.camamba
// @version         0.1
// @description     getter and setter for inChat settings
// @license         MIT License
// @include         https://www.camamba.com/chat/
// @include         https://www.de.camamba.com/chat/
// ==/UserScript==

/* jslint esversion: 9 */
/* global me, camData, rooms, blockList, friendList, friendRequests, adminMessages, jsLang, byId, myRooms, knownUsers, activeRoom, selectedUser */

const settings = (() => {
    
    const propertyNames =  [
        "chatColor",
        "chatFont",
        "chatFontSize",
        "inputFontSize",
        "settingsCamAspect",
        "chatTimeStamps",
        "chatTurtle",
        "noAudioProcessing",
        "settingsUseMyFont",
        "settingsNoImages",
        "enableChatSounds",
        "camDenyNoReal",
        "camDenyNoFriend",
        "camDenyNoCam",
        "camAcceptAny",
        "camAcceptFriends",
        "camAcceptReal",
        "convoDenyAll",
        "convoDenyNoReal",
        "convoAcceptFriends",
        "convoAcceptReal"
    ];
    
    return {
        get chatColor() {
            return localStorage.chatColor;
        },
        set chatColor(value) {
            localStorage.chatColor = value;
        },
        get chatFont() {
            return localStorage.chatFont;
        },
        set chatFont(value) {
            localStorage.chatFont = value;
        },
        get chatFontSize() {
            return (1 + localStorage.chatFontSize / 10)+"em";
        },
        set chatFontSize(value) {
            localStorage.chatFontSize = (Number.parseFloat(value) - 1) * 10;
        },
        get inputFontSize() {
            return (1 + localStorage.inputFontSize / 20)+"em";
        },
        set inputFontSize(value) {
            localStorage.inputFontSize = (Number.parseFloat(value) - 1) * 20;
        },
        get settingsCamAspect() {
            return localStorage.settingsCamAspect;
        },
        set settingsCamAspect(value) {
            localStorage.settingsCamAspect = value;
        },
        get chatTimeStamps() {
            return !!parseInt(localStorage.chatTimeStamps);
        },
        set chatTimeStamps(value) {
            localStorage.chatTimeStamps = value ? 1 : 0;
        },
        get chatTurtle() {
            return !!parseInt(localStorage.chatTurtle);
        },
        set chatTurtle(value) {
            localStorage.chatTurtle = value ? 1 : 0;
        },
        get noAudioProcessing() {
            return !!parseInt(localStorage.noAudioProcessing);
        },
        set noAudioProcessing(value) {
            localStorage.noAudioProcessing = value ? 1 : 0;
        },
        get settingsUseMyFont() {
            return !!parseInt(localStorage.settingsUseMyFont);
        },
        set settingsUseMyFont(value) {
            localStorage.settingsUseMyFont = value ? 1 : 0;
        },
        get settingsNoImages() {
            return !!parseInt(localStorage.settingsNoImages);
        },
        set settingsNoImages(value) {
            localStorage.settingsNoImages = value ? 1 : 0;
        },
        get enableChatSounds() {
            return !!parseInt(localStorage.enableChatSounds);
        },
        set enableChatSounds(value) {
            localStorage.enableChatSounds = value ? 1 : 0;
        },
        get camDenyNoReal() {
            return !!parseInt(localStorage.camDenyNoReal);
        },
        set camDenyNoReal(value) {
            localStorage.camDenyNoReal = value ? 1 : 0;
        },
        get camDenyNoFriend() {
            return !!parseInt(localStorage.camDenyNoFriend);
        },
        set camDenyNoFriend(value) {
            localStorage.camDenyNoFriend = value ? 1 : 0;
        },
        get camDenyNoCam() {
            return !!parseInt(localStorage.camDenyNoCam);
        },
        set camDenyNoCam(value) {
            localStorage.camDenyNoCam = value ? 1 : 0;
        },
        get camAcceptAny() {
            return !!parseInt(localStorage.camAcceptAny);
        },
        set camAcceptAny(value) {
            localStorage.camAcceptAny = value ? 1 : 0;
        },
        get camAcceptFriends() {
            return !!parseInt(localStorage.camAcceptFriends);
        },
        set camAcceptFriends(value) {
            localStorage.camAcceptFriends = value ? 1 : 0;
        },
        get camAcceptReal() {
            return !!parseInt(localStorage.camAcceptReal);
        },
        set camAcceptReal(value) {
            localStorage.camAcceptReal = value ? 1 : 0;
        },
        get convoDenyAll() {
            return !!parseInt(localStorage.convoDenyAll);
        },
        set convoDenyAll(value) {
            localStorage.convoDenyAll = value ? 1 : 0;
        },
        get convoDenyNoReal() {
            return !!parseInt(localStorage.convoDenyNoReal);
        },
        set convoDenyNoReal(value) {
            localStorage.convoDenyNoReal = value ? 1 : 0;
        },
        get convoAcceptFriends() {
            return !!parseInt(localStorage.convoAcceptFriends);
        },
        set convoAcceptFriends(value) {
            localStorage.convoAcceptFriends = value ? 1 : 0;
        },
        get convoAcceptReal() {
            return !!parseInt(localStorage.convoAcceptReal);
        },
        set convoAcceptReal(value) {
            localStorage.convoAcceptReal = value ? 1 : 0;
        },
        save: () => {
            return Object.fromEntries(propertyNames.map(p => ({ [p]:localStorage[p] })));
        },
        restore: (saveObj) => {
            for (let p of propertyNames) {
                localStorage[p] = saveObj[p];
            }
        }
    };
})();