// ==UserScript==
// @name         Geoguessr change Avatar to Pin/ProfilePicture2
// @description  Changes the Avatar to your Pin/Profile Picture. Works in Duels, Br, Profile and many more places and not only your Avatar but also the Avatar of others
// @version      3.4.6
// @license      MIT
// @author       joniber
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @namespace https://greasyfork.org/users/1072330
// @require      https://greasyfork.org/scripts/460322-geoguessr-styles-scan/code/Geoguessr%20Styles%20Scan.js?version=1246943

// @downloadURL https://update.greasyfork.org/scripts/465738/Geoguessr%20change%20Avatar%20to%20PinProfilePicture2.user.js
// @updateURL https://update.greasyfork.org/scripts/465738/Geoguessr%20change%20Avatar%20to%20PinProfilePicture2.meta.js
// ==/UserScript==

//any questons, feedback, problems or feature request -> Discord joniber

//=====================================================================================\\
//    change these values however you like (make sure to hit ctrl+s afterwards)        \\
//                PIN = PROFILE PICTURE                                                \\
//=====================================================================================\\

// replace the "true" with "false" if you would like to disable the feature

const PIN_IN_OWN_PROFILE = true;

const PIN_IN_OTHERS_PROFILE = true;

const PIN_IN_DUELS_MATCHMAKING = true;

const PIN_IN_BR_MATCHMAKING = true;

const NO_AVATARS_END_OF_DUEL = true;

const PIN_IN_TEAM_DUEL_PRIVATE_LOBBY = true;

const PIN_IN_FRIEND_TAB = true;

const PIN_IN_END_OF_BRS = true;

const PIN_IN_TEAM_DUELS_LOBBY = true;

const BETTER_FRAME_QUALITY = false;

const REPLACE_YOUR_AVATAR_IN_CHAT_WITH_YOUR_PROFILEPICTURE = true;



//=====================================================================================\\
//  don't edit anything after this point unless you know what you're doing             \\
//=====================================================================================\\

const GEOGUESSR_USER_ENDPOINT = 'https://geoguessr.com/api/v3/users';
const GEOGUESSR_ENDPOINT = 'https://geoguessr.com/api/v3/social';
const CHAT_ENDPOINT = 'https://game-server.geoguessr.com/api/lobby';
const MAP_ENDPOINT = 'https://geoguessr.com/api/maps';
const SCRIPT_PREFIX = 'up__';
const USER_PIN_CLASS = SCRIPT_PREFIX + 'userPin';
const USER_PIN_ID = SCRIPT_PREFIX + 'profilePin';
let framequality;
if (BETTER_FRAME_QUALITY) {
    framequality = 'high-quality';
} else {
    framequality = 'low-quality';
}

let av = null;
let index = 0;
let index1 = 0;
let player1 = null;
let player2 = null;
let starteChatObserverIndex = 0;

async function fillPin(pin, userId, withLvl, lvl, transparent) {
    if(!transparent && transparent != null){}
    else{
        pin.parentElement.style.backgroundColor = "transparent"
    }
    pin.setAttribute('src', "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=");
    const userData = await getUserData(userId);
    const pinURL = userData.pin.url;
    if(withLvl){
        let level = roundToNearest10(userData.progress.level);
        lvl.parentElement.style.display="none"
        await lvl.setAttribute('src', `/static/avatars/tiers/${framequality}/tier-` + level + '.webp')
        await pin.setAttribute('src', '/images/resize:auto:144:144/gravity:ce/plain/' + pinURL);
        lvl.parentElement.style.display = 'block'
    }
    else if(!withLvl){
        await pin.setAttribute('src', '/images/resize:auto:144:144/gravity:ce/plain/' + pinURL);
    }
}

async function fillLvl(lvl, userId) {
    const userData = await getUserData(userId);
    let level = roundToNearest10(userData.progress.level);

    lvl.setAttribute('src', `/static/avatars/tiers/${framequality}/tier-` + level + '.webp');
}

function fillImageMultiple(link, id, setLvl) {
    if (!link.querySelector(`.${USER_PIN_CLASS}`)) {
        if (wrapper) {
            link.firstChild.style.display = 'none';
            let destination = link;
            fillImage(link, link, id, true, setLvl);
        }
    }
}

function changePinInFriendTab(link) {
    if (link) {
        if (!link.querySelector(`.${USER_PIN_CLASS}`)) {
            const wrapper = link.querySelector('[class*=transparent-avatar_imageWrapper__]');
            if (wrapper) {
                wrapper.classList.remove(cn("transparent-avatar_imageWrapper__"));
                wrapper.classList.add(
                    cn("styles_circle__"),
                    cn("styles_variantFloating__"),
                    cn('styles_colorTransparent__'),
                    cn('styles_borderColorTransparent__'),
                    cn('styles_borderSizeFactorZero__')
                );
                wrapper.insertAdjacentHTML('afterbegin', wrapperFriend1());
                const destination = link.querySelector('[class*=styles_content__] [class*=styles_image__]')
                if(destination){
                    let id = link.querySelector('[class*=anchor_variantNoUnderline__]').href;
                    const userId = retrieveIdFromLink(id);
                    fillPin(destination, userId, false, false, false)
                    wrapper.querySelector('img:not(.up__userPin)').style = 'display: none';

                }
            }
        }
    }
}



function fillImage(destination, link, id, c, withLvl) {
    if (c) {
        destination.insertAdjacentHTML('afterbegin', wrapperDuels());
        destination = link.querySelector('[class*=profile-header_avatarWrapper__].up__');

        destination.insertAdjacentHTML('afterbegin', wrapper());
        destination = link.querySelector('[class*=avatar_titleAvatarImage__].up__');
        destination.insertAdjacentHTML('beforeend', profilePicture());
        const pin = destination.lastChild;
        destination = link.querySelector('[class*=styles_rectangle__].up__');
        destination.insertAdjacentHTML('beforeend', levelBorder());
        const lvl = destination.lastChild;
        fillPin(pin, retrieveIdFromLink(id), withLvl, lvl);
    } else {
        destination.insertAdjacentHTML('beforeend', wrapper());

        destination = document.querySelector('[class*=avatar_titleAvatarImage__].up__');
        destination.insertAdjacentHTML('beforeend', profilePicture1());
        const pin = destination.lastChild;
        destination = document.querySelector('[class*=styles_rectangle__].up__');
        destination.insertAdjacentHTML('beforeend', levelBorder1());
        const lvl = destination.lastChild;
        fillPin(pin, retrieveIdFromLink(id), withLvl, lvl);

    }
}

function changeAvatarToPin(link, avatarToRemove) {
    if (!link.querySelector(`.${USER_PIN_CLASS}`)) {
        if (link) {
            let destination = null;
            if (avatarToRemove == link) {
                link.querySelector('[class*=styles_image__]').style = 'display: none';
                destination = link.firstChild;
            } else {
                link.querySelector('[class*=player-card_lobbyCardInner__]').firstChild.remove();
                destination = link.querySelector('[class*=player-card_lobbyCardInner__]');
            }
            let id = '/me/profile';
            if (link.querySelector('[class*=player-card_userLink__]') != null) {
                id = link.querySelector('[class*=player-card_userLink__]').href;
            }
            fillImage(destination, link, id, true, true);
        }
    }
}

let pfpToLink = {};
let nameToLink = {};

const originalSend = WebSocket.prototype.send;
WebSocket.prototype.send = function (...args) {
    window.ws = this;
    if (this.geoguessrClickablePartyCards == 0) return originalSend.call(this, ...args);
    this.geoguessrClickablePartyCards = 0;
    const originalOnmessage = this.onmessage;
    this.onmessage = ({ data }) => {
        if (originalOnmessage != null) originalOnmessage({ data });
        const received = JSON.parse(data);
        if (received.code == 'PartyUpdated') {
            let payload = JSON.parse(received.payload);
            let players = payload.players;
            for (let player of players) {
                nameToLink[player.name] = 'user/' + player.id;
            }
        }
        if (received.code == 'PartyMemberListUpdated') {
            let payload = JSON.parse(received.payload);
            let members = payload.members;
            for (let member of members) {
                if (member.pin != '') pfpToLink[member.pin] = 'user/' + member.userId;
                if (member.fullBodyPin != ''){
                    pfpToLink[member.fullBodyPin] = 'user/' + member.userId;
                }

            }
        }
    };
    return originalSend.call(this, ...args);
};

function addPinToPartyCard(wrapper) {
    const image = wrapper.querySelector('[class*=member-card_imageWrapper__] img');
    if (image) {
        const imgPin = image.src.substr(57);
        const id = pfpToLink[imgPin];
        if (id != null) {
            const link = wrapper.querySelector('[class*=member-card_imageWrapper__]');
            fillImageMultiple(link, id, false);
        }
    }
}

function addPinToTeamDuelsCard(wrapper) {
    const name = wrapper
    .querySelector('[class*=user-nick_nick__]')
    .innerHTML.replace('&nbsp', '')
    .replace(';', '');
    if (name) {
        if (nameToLink.length != 0) {
            const id = nameToLink[name];

            if (id) {
                const link = wrapper.querySelector('[class*=team-player-card_lobbyCardInner__]');
                fillImageMultiple(link, id, true);
            }
        }
    }
}
let inBattleRoyale = false;
let inDuels = false;
let inDuelsLobby = false;
let inParty = false;
let inTeamDuel = false;
let lastOpenedMapHighscoreTab = 0;
let inGame = false;

async function onMutationTeamDuel(mutations, observer) {
    await scanStyles();
    if (!isTeamDuel()) return;

    const cards = document.querySelectorAll('[class*=team-player-card_lobbyCard__]');
    for (let card of cards) {
        addPinToTeamDuelsCard(card);
    }

    if (document.querySelector('[class*=game-finished_avatarContainer__]')) {
        onMutationEnd();
    }
}

function onMutationsDuelsLobby(mutations, observer) {
    if (!isDuels() || !document.querySelector('[class*=bars_content__]')) return;

    const cards = document.querySelectorAll('[class*=lobby_playerContainer__]');
    for (let card of cards) {
        if (!card.querySelector('.up__')) {
            let id = card.querySelector('[class*=lobby_nickContainer__]').firstChild.href;
            card.querySelector('[class*=lobby_avatarContainer__]').firstChild.style.display = 'none';
            let destination = card.querySelector('[class*=lobby_avatarContainer__]');
            fillImage(destination, card, id, true, true);
        }
    }
}

function onMutationParty(mutations, observer) {

    if (location.pathname != '/party') return;
    const cards = document.querySelectorAll('[class*=member-card_root__]');
    for (let card of cards) {
        addPinToPartyCard(card);
    }
}

function onMutationEnd() {
    if (NO_AVATARS_END_OF_DUEL) {
        const gameFinishedAvatarContainer = document.querySelector(
            '[class*=game-finished_avatarContainer__]'
        );
        if (gameFinishedAvatarContainer) {

            if (document.querySelector('[class*=styles_rectangle__].up__') == null) {
                gameFinishedAvatarContainer.firstChild.remove();
                let destination = gameFinishedAvatarContainer;
                destination.style = 'height: fit-content';
                destination.insertAdjacentHTML('afterbegin', wrapperDuels());
                destination = document.querySelector('[class*=profile-header_avatarWrapper__].up__');
                destination.insertAdjacentHTML('afterbegin', wrapper());
                document.querySelector('[class*=profile-header_avatar__]').style =
                    'display:flex; justify-content:center; align-items:center';
                document.querySelector('[class*=avatar_titleAvatar__]').style = 'width:20rem';
                destination = document.querySelector('[class*=avatar_titleAvatarImage__].up__');
                destination.insertAdjacentHTML('beforeend', profilePicture());
                const pin = destination.lastChild;
                let id = '/me/profile';
                fillPin(pin, retrieveIdFromLink(id), false);
                destination = document.querySelector('[class*=styles_rectangle__].up__');
                destination.insertAdjacentHTML('beforeend', levelBorder());
                const lvl = destination.lastChild;
                if (
                    document.querySelector('[class*=shadow-text_root__]').innerHTML.startsWith('YOU')
                ) {
                    fillLvl(lvl, retrieveIdFromLink(id));
                } else {
                    lvl.setAttribute(
                        'src',
                        '/_next/static/images/laurel-wreath-gold-53fd377e1d268ce57fcd6f0dfb9f3727.png'
                    );
                }
            }
        }
    }
}

async function onMutationsChat(mutations, observer) {
    await scanStyles();

    if (REPLACE_YOUR_AVATAR_IN_CHAT_WITH_YOUR_PROFILEPICTURE) {
        for (let link of document
             .querySelector('[class*=chat-log_scrollContainer__]')
             .querySelectorAll('[class*=chat-message_sharedRoot__]')) {
            if (!link.querySelector('up__newChat')) {
                if (link.querySelector('[class*=chat-message_nick__]')) {
                    if (location.href != "https://www.geoguessr.com/party"){
                        const lobby = await getUsersInGame(location.href.slice(-36));

                        for (const player of lobby.players) {
                            const nickElement = link.querySelector('[class*=chat-message_nick__]');
                            const img = link.querySelector('[class*=chat-message_fullBodyAvatar__]');
                            const isPlayerNick = nickElement.textContent === player.nick;
                            const isUserNick = nickElement.textContent === 'You';

                            if (isPlayerNick || isUserNick) {
                                const playerId = isPlayerNick
                                ? player.playerId
                                : retrieveIdFromLink('/me/profile');
                                if (img.firstChild) {
                                    img.firstChild.classList.add('up__newChat');
                                    img.firstChild.style.borderRadius = '50%';
                                    img.firstChild.style.scale = 0.9;
                                    img.classList.add(cn('chat-message_hasNoAvatarYet__'));
                                    fillPin(img.firstChild, playerId, false, 0, false);

                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}

async function onMutationsDuels(mutations, observer) {
    await scanStyles();

    if (player1 == null) {
        player1 = document.querySelectorAll('[class*=lobby_avatarContainer__]')[0];
        if (player1 != null) {
            player1.children[0].firstChild.remove();
            player1.children[0].remove();
            let destination1 = player1;
            destination1.insertAdjacentHTML('afterbegin', wrapperDuels());
            destination1 = document.querySelector('[class*=profile-header_avatarWrapper__].up__');
            destination1.insertAdjacentHTML('afterbegin', wrapper());
            destination1 = document.querySelector('[class*=avatar_titleAvatarImage__].up__');
            destination1.insertAdjacentHTML('beforeend', profilePicture());
            const pin = destination1.lastChild;
            let id = player1.lastChild.firstChild.href;

            destination1 = document.querySelector('[class*=styles_rectangle__].up__');
            destination1.insertAdjacentHTML('beforeend', levelBorder());
            const lvl = destination1.lastChild;
            fillPin(pin, retrieveIdFromLink(id), true, lvl);

        }
        player2 = document.querySelectorAll('[class*=lobby_avatarContainer__]')[1];
        if (player2 != null) {
            player2.children[0].firstChild.remove();
            player2.children[0].remove();
            let destination2 = player2;
            destination2.insertAdjacentHTML('afterbegin', wrapperDuels());
            destination2 = document.querySelectorAll(
                '[class*=profile-header_avatarWrapper__].up__'
            )[1];
            destination2.insertAdjacentHTML('afterbegin', wrapper());
            destination2 = document.querySelectorAll('[class*=avatar_titleAvatarImage__].up__')[1];
            destination2.insertAdjacentHTML('beforeend', profilePicture());
            const pin1 = destination2.lastChild;
            let id1 = player2.lastChild.firstChild.href;

            destination2 = document.querySelectorAll('[class*=styles_rectangle__].up__')[1];
            destination2.insertAdjacentHTML('beforeend', levelBorder());
            const lvl1 = destination2.lastChild;
            fillPin(pin1, retrieveIdFromLink(id1), true, lvl1);
        }
    }
    if (player1 != null && player2 != null) {
        player1 = null;
        player2 = null;
    }

    if (document.querySelector('[class*=overlay_overlay__]')) {
        const endOfDuelsObserver = new MutationObserver(onMutationEnd);
        if (endOfDuelsObserver) {
            endOfDuelsObserver.observe(
                document.querySelector('[class*=overlay_overlay__]'),
                OBSERVER_CONFIG
            )
        }
    }
}

async function onMutationsStandard(mutations, observer) {
    await scanStyles()



    if (isDuels() && !inDuels && document.querySelector('[class*=game_hud__]')) {
        inDuels = true;
        const duelsObserver = new MutationObserver(onMutationsDuels);
        duelsObserver.observe(document.querySelector('[class*=game_hud__]'), OBSERVER_CONFIG);
    }


    else if (isDuels() && !inDuelsLobby && document.querySelector('[class*=bars_content__]')) {

        inDuelsLobby = true;

        const duelsLobbyObserver = new MutationObserver(onMutationsDuelsLobby);
        duelsLobbyObserver.observe(document.querySelector('.lobby_root__vk5a7'), OBSERVER_CONFIG);

    }








    else if (inDuels && !document.querySelector('[class*=game_hud__]')) {
        inDuels = false;
    } else if (inDuelsLobby && !document.querySelector('[class*=bars_content__]')) {
        inDuelsLobby = false;
    } else if (isParty() && !inParty) {
        inParty = true;
        const partyObserver = new MutationObserver(onMutationParty);
        partyObserver.observe(document.body, OBSERVER_CONFIG);
    } else if (inParty && !document.querySelector('[class*=party_root__]')) {
        inParty = false;
    } else if (isTeamDuel() && !inTeamDuel) {
        inTeamDuel = true;
        const teamDuelObserver = new MutationObserver(onMutationTeamDuel);
        teamDuelObserver.observe(document.body, OBSERVER_CONFIG1);
    } else if (inParty && !document.querySelector('[class*=lobby_root__]')) {
        inTeamDuel = false;
    }
    else if(isGame() && !inGame){
        inGame = true
    }
    else if(inGame && !isGame()){
        !inGame
    }

    if (document.querySelector('[class*=chat-log_scrollContainer__]')) {
        onMutationsChat()
    }

    if (inBattleRoyale || inDuels || inDuelsLobby || inGame) {
        return
    }

    if (PIN_IN_FRIEND_TAB) {
        for (const link of document.querySelectorAll('[class*=chat-friend_content__]')) {
            changePinInFriendTab(link)
        }
        if (document.querySelector('[class*=friend-chat_root__]')) {
            //checks if we are in friend chat
            if (document.querySelector('[class*=friend-chat_root__]')) {
                let link = document.querySelector('[class*=friend-chat_root__]'); //sets link to the whole chat
                //checks if the link exist (might be redundand)
                let friendchat = link.querySelector('[class*=friend-list_friendList__]'); //sets the left side of the whole friend chat (the names and avatars)
                if (!friendchat.lastChild.querySelector('.up__fc1')) {
                    //checks if one of the elements on that list has the "class already". If so it doesn't enter, if not it enters
                    index1 = 0
                    for (let i = 0; i < document.querySelectorAll('[class*=friend-list_friend__]').length; i++){
                        //goes trough the whole list of elements meaning that each element with name and avatar gets checked seperatly. Not the same list than friendchat but that is the list where the links to their profiles are
                        let link1 = document.querySelectorAll('[class*=friend-list_friend__]')[i]
                        if (link1.querySelector('[class*=anchor_variantNoUnderline__]')) {
                            let linkwrapper = link1.querySelector('[class*=anchor_variantNoUnderline__]') //selects the element that contains the profile link
                            //checks if it exists
                            let linktoprofile = linkwrapper.href.substring(31) //gets the id of the profile
                            let userData = await getUserData(linktoprofile) //gets the userdata trough the id
                            if (friendchat) {
                                //checks if the friendchat list of names exist
                                let link2 = friendchat.querySelectorAll('[class*=friend-item_friendListItem__]')[i]; //gets the equivalent element to the id
                                let destination187 = link2.querySelector('[class*=transparent-avatar_imageWrapper__]'); //gets the avatar wrapper from it
                                if (destination187 && !link2.querySelector('.up__fc1')) {
                                    //checks if it exist and if it didn't change the avatar to pfp already
                                    if (destination187.firstChild) {
                                        //gets the avatar of the avatar wrapper
                                        destination187.firstChild.style.display = 'none' //sets the avatar to display none
                                        destination187.insertAdjacentHTML('afterbegin', friendChat2()) //adds the code for the profile picture
                                        destination187.classList.add(cn('transparent-avatar_background__'),cn('transparent-avatar_colorWhite20__'))
                                        if (destination187.classList.contains(cn('transparent-avatar_imageWrapper__'))) {
                                            destination187.classList.remove(cn('transparent-avatar_imageWrapper__'))
                                        }
                                        destination187.querySelector('.up__fc1').src = '/images/resize:auto:48:48/gravity:ce/plain/' + userData.pin.url //adds the profile picture
                                    }
                                }
                            }
                        }
                    }
                }

                if (link.querySelector('[class*=empty-chat_emptyChat__]')) {
                    let avatar = link.querySelector('[class*=empty-chat_emptyChat__]')
                    let friendAvatarLink = ''
                    if (!avatar.querySelector('.up__fc')) {
                        if (avatar.querySelector('[data-nimg="fill"]')) {
                            friendAvatarLink = avatar.querySelector('[data-nimg="fill"]')
                        }
                        if (friendAvatarLink.src) {
                            let avatarLink = friendAvatarLink.src.substring(57)
                            if (avatarLink.startsWith('/')) {
                                avatarLink = avatarLink.substring(1)
                            }
                            let done = false
                            let friendchat = document.querySelector('[class*=friend-list_friendList__]')
                            for (const link1 of document.querySelectorAll('[class*=chat-friend_content__]')) {
                                let linkwrapper = link1.querySelector('[class*=anchor_variantNoUnderline__]')
                                if (linkwrapper) {
                                    let linktoprofile = linkwrapper.href.substring(31)
                                    let userData = await getUserData(linktoprofile)
                                    let fullbodypin = userData.fullBodyPin
                                    if (avatarLink == fullbodypin) {
                                        done = true
                                        //main avatar
                                        let destination = avatar.firstChild
                                        if (destination) {
                                            if (destination.firstChild) {
                                                destination.firstChild.style.display = 'none';
                                                destination.insertAdjacentHTML('afterbegin', friendChat())
                                                destination.querySelector('.up__fc').src = '/images/resize:auto:192:192/gravity:ce/plain/' + userData.pin.url
                                                destination.classList.add(cn('empty-chat_avatar__'))
                                                if (destination.classList.contains(cn('empty-chat_fullBodyAvatar__'))) {
                                                    destination.classList.remove(cn('empty-chat_fullBodyAvatar__'))
                                                }
                                                if (avatar.querySelector('[data-nimg="fill"]')) {
                                                    avatar.querySelector('[data-nimg="fill"]').style.display = 'none'
                                                }
                                            }
                                        }
                                        //picture upper left
                                        let pictureupperleft = link.querySelector('[class*=chat-view_mobileAvatar__]')
                                        if (pictureupperleft) {
                                            let destination = pictureupperleft.firstChild
                                            if (destination) {
                                                if (destination.firstChild) {
                                                    destination.firstChild.style.display = 'none';
                                                    destination.insertAdjacentHTML('afterbegin', friendChat2())
                                                    destination.querySelector('.up__fc1').src = '/images/resize:auto:48:48/gravity:ce/plain/' + userData.pin.url
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            if (done == false) {
                                if (avatar.firstChild.firstChild) {
                                    avatar.firstChild.firstChild.style.display = 'none'
                                }
                            }
                        }
                    } else {
                        link.querySelector('.up__fc').classList.remove('up__fc')
                    }
                }
            }
        }
    }

    if (inParty) return;

    if (isProfile()) {
        if (!PIN_IN_OWN_PROFILE && isOwnProfile()) {
            return
        }
        if (!PIN_IN_OTHERS_PROFILE && isOtherProfile()) {
            return
        }
        if (!document.querySelector(`#${USER_PIN_ID}`)) {
            if (document.querySelector('[class*=profile-header_fullBodyAvatar__]')) {
                document.querySelector('[class*=profile-header_fullBodyAvatar__]').remove()
                let destination = document.querySelector('[class*=profile-header_avatarWrapper__]')
                fillImage(destination, document, location.href, false, true)
                if(destination.querySelector('[class*=avatar_titleAvatar__]')){
                    destination.querySelector('[class*=avatar_titleAvatar__]').style.scale = 2
                    destination.querySelector('[class*=avatar_titleAvatar__]').style.right = "7rem";

                }
            } else {
                // if (document.querySelector('[class*=profile-header_header__][class*=styles_rectangle__]').lastChild.src.includes(framequality)) {
                //     return;
                // } else {
                //     fillLvl(document.querySelector('[class*=profile-header_header__][class*=styles_rectangle__]').lastChild, retrieveIdFromLink(location.href))
                // }
            }
        }
    }
    if (PIN_IN_END_OF_BRS) {
        if (document.querySelector('[class*=popup-view_avatarView__]')) {
            const avatarWrapper = document.querySelector('[class*=popup-view_avatarView__]')
            if (!document.querySelector(`#${USER_PIN_ID}`)) {
                if (avatarWrapper.firstChild) {
                    avatarWrapper.firstChild.style.display = 'none'
                    fillImage(avatarWrapper, document, '/me/profile', false, true)
                }
            }
        }
    }
    if (PIN_IN_BR_MATCHMAKING) {
        // battle royale matchmaking
        for (const link of document.querySelectorAll('[class*=player-card_root__]')) {
            changeAvatarToPin(link, 'player-card_lobbyCardInner__G_xzy')
        }

        //                  if(document.querySelector('.avatar-lobby_wrapper__geAOu')){
        //                      let lobbyWrapper = document.querySelector('.avatar-lobby_wrapper__geAOu')

        //                      lobbyWrapper.querySelector('canvas').style.display = "none"
        //                      if(document.querySelector('.lobby_contentMiddle__JWTt8')){

        //                         const parent = document.querySelector('.lobby_contentMiddle__JWTt8')
        //                         if (!parent.querySelector('.up__newbr')){
        //                          while (parent.firstChild) {
        //                              parent.firstChild.remove()

        //                          }

        //                             parent.insertAdjacentHTML('afterbegin', newbr());


        //                      }
        //                         }

        //             for (let link of document
        //                  .querySelector('.avatar-lobby_wrapper__geAOu')
        //                  .querySelectorAll('.avatar-title_titleWrapper__Jwldu')) {
        //                 if (!link.querySelector('.up__userPin')) {
        //                     if (link.querySelector('.user-nick_nick__y4VIt')) {
        //                         const lobby = await getUsersInGame(location.href.slice(-36));
        //                         console.log(lobby.players)
        //                         for (const player of lobby.players) {
        //                             if (!link.querySelector('.up__userPin')) {

        //                                 const nickElement = link.querySelector('.user-nick_nick__y4VIt').textContent;
        //                                 const isPlayerNick = nickElement.trim() == player.nick;
        //                                 console.log(player)
        //                                 if (isPlayerNick) {
        //                                     console.log("worked")
        //                                     const playerId = player.playerId
        //                                     let destination = link.querySelector('.user-nick_root__DUfvc').parentElement
        //                                     fillImage(destination, link, playerId, true, true)
        //                                     let imgW = link.querySelector('.avatar_titleAvatarImage__A51Dx.up__')

        //                                     link.querySelector('.avatar_titleAvatar__0pdL9').style.scale = 2
        //                                     link.querySelector('.avatar_titleAvatar__0pdL9').style.height = "220px"
        //                                     lobbyWrapper.firstChild.style.height="70%"

        //                                 }

        //                             }
        //                         }
        //                     }
        //                 }
        //             }


        //         }

        // }
    }
    if (PIN_IN_TEAM_DUELS_LOBBY) {
        if (document.querySelectorAll('[class*=team-members_cardContainer__]')[0]) {
            const avatarWrapper = document.querySelectorAll('[class*=team-members_cardContainer__]')[0];
            if (!document.querySelector(`.${USER_PIN_CLASS}`)) {
                if (avatarWrapper.firstChild) {
                    avatarWrapper.firstChild.style.display = 'none'
                    fillImage(avatarWrapper, document, '/me/profile', true, true)
                }
            }
        }
    }

    if (isDuels() && PIN_IN_DUELS_MATCHMAKING) {
        if (!document.querySelector(`#${USER_PIN_ID}`)) {
            if (av == null) {
                av = document.querySelector('[class*=lobby_avatarContainer__]')
            }
            if (av != null) {
                av.children[0].remove()
                fillImage(av, document, retrieveIdFromLink('/me/profile'), false, true)
            }
            if (av != null) {
                av = null
            }
        }
    }

    if (document.querySelector('[class*=join-party_avatarWrapper__]')) {
        let destination = document.querySelector('[class*=join-party_avatarWrapper__]')
        if (!destination.querySelector(`#${USER_PIN_ID}`)) {
            if (destination.firstChild) {
                destination.firstChild.style.display = 'none'
                fillImage(destination, document, retrieveIdFromLink('/me/profile'), false, true)
            }
        }
    }

    if (document.querySelector('[class*=maprunner-start-page_avatar__]')) {
        document.querySelector('[class*=maprunner-start-page_avatar__]').style.visibility = 'hidden'
    }

    if (document.querySelector('[class*=world-progress_avatar__]')) {
        let destination = document.querySelector('[class*=world-progress_avatar__]')
        if (!destination.querySelector(`#${USER_PIN_ID}`)) {
            if (destination.firstChild) {
                destination.firstChild.style.display = 'none'
                destination.style.height = 'initial'
                fillImage(destination, document, retrieveIdFromLink('/me/profile'), false, true)
            }
        }
    }

    if (isCommunity() || isCommunityMaps()) {
        if (document.querySelector('[class*=grid_grid__]')) {
            for (let elements of document.querySelector('[class*=grid_grid__]').getElementsByTagName('a')) {
                if (!elements.querySelector(`.${USER_PIN_CLASS}`)) {
                    if (!elements.querySelector('.up__community')) {
                        let img = elements.querySelector('[class*=community-map-card_avatar__]')
                        if (img) {
                            if (img.firstChild) {
                                img.firstChild.classList.add('up__community')
                                let mapLink = elements.href
                                let mapInfo = await getMapInfo(mapLink.slice(-24))
                                img.firstChild.style.display = 'none'
                                let imgWrapper = elements.querySelector('[class*=community-map-card_avatarWrapper__]')
                                imgWrapper.style.left = '1rem'
                                imgWrapper.style.top = '0rem'
                                imgWrapper.style.overflow = 'visible'
                                img.style.height = '100%'
                                fillImage(img, elements, mapInfo.creator.id, true, true)
                            }
                        } else {
                            let wrapper = elements.querySelector('[class*=community-map-card_avatarWrapper__]')
                            if(wrapper){
                                wrapper.insertAdjacentHTML('beforeend', community())
                            }
                        }
                    }
                }
            }
        }

        if (document.querySelector('[class*=community-landing-page_gridItem--map-of-the-day__]')) {
            let elements = document.querySelector('[class*=community-landing-page_gridItem--map-of-the-day__]').querySelector('a')
            if (!elements.querySelector(`.${USER_PIN_CLASS}`)) {
                if (!elements.querySelector('.up__community')) {
                    let img = elements.querySelector('[class*=community-map-card_avatar__]')
                    if (img) {
                        if (img.firstChild) {
                            img.firstChild.classList.add('up__community')
                            let mapLink = elements.href
                            let mapInfo = await getMapInfo(mapLink.slice(-24))
                            img.firstChild.style.display = 'none'
                            let imgWrapper = elements.querySelector('[class*=community-map-card_avatarWrapper__]')
                            imgWrapper.style.left = '2.5rem'
                            imgWrapper.style.top = '0rem'
                            imgWrapper.style.overflow = 'visible'
                            img.style.height = '100%'
                            fillImage(img, elements, mapInfo.creator.id, true, true)
                        }
                    }
                }
            }
        }
    }

    if(document.querySelector('[class*=avatar-podium_root__]')){
        let wrapper = document.querySelector('[class*=avatar-podium_root__]')
        if(!wrapper.querySelector(`.${USER_PIN_CLASS}`)){
            let destination = wrapper.firstChild.firstChild.firstChild

            if(wrapper.querySelector('canvas') && wrapper.querySelector('canvas').style.display != "none"){
                wrapper.querySelector('canvas').style.display = "none"
                const div = document.createElement('div')
                destination.appendChild(div)
            }
            destination = destination.lastChild
            destination.style.display = "flex";
            destination.style.padding = "2rem"
            destination.style.flexDirection = "row-reverse"



            for(const userLink of wrapper.querySelectorAll('[class*=podium-avatar_anchor__]')){
                fillImage(destination, wrapper, userLink.href.substring(6), true, true)
            }
            for( const i of wrapper.querySelectorAll('[class*=profile-header_avatar__]')){
                i.style="width:initial"

            }

            for(const children of destination.children){
                children.style.width="100%"

            }
            if(destination.children[1]){
                destination.children[1].style.scale="1.25"
            }
            // if(wrapper.firstChild.children[1].firstChild){
            // wrapper.firstChild.firstChild.children[1].firstChild.style.transform = "translate3d(-120%, -50%, 0px)"
            // wrapper.firstChild.firstChild.children[3].firstChild.style.transform = "translate3d(20%, -50%, 0px)"
            // }

            //             for(let i=0; i<3; i = i + 2){
            //                 if(i == 0){
            //                     if(wrapper.querySelectorAll('.podium-avatar_labelRenderer__io05t')[i]){
            //                 wrapper.querySelectorAll('.podium-avatar_labelRenderer__io05t')[i].style.transform = "translate3d(-120%, -50%, 0px)"
            //                 }
            //                 }
            //                 else{
            //                     if(wrapper.querySelectorAll('.podium-avatar_labelRenderer__io05t')[i]){

            //                     wrapper.querySelectorAll('.podium-avatar_labelRenderer__io05t')[i].style.transform = "translate3d(20%, -50%, 0px)"
            //                     }
            //                 }
            //             }



        }
    }

}

//helpfunctions
function roundToNearest10(zahl) {
    if(zahl == 200){
        return 200
    }
    else if (zahl % 10 === 0) {
        return zahl + 10
    }
    else {
        return Math.ceil(zahl / 10) * 10
    }
}

function retrieveIdFromLink(link) {
    if (link.endsWith('/me/profile')) {
        const data = document.querySelector('#__NEXT_DATA__').text
        const json = JSON.parse(data)
        return json.props.middlewareResults[1].account.user.userId
    }
    return link.split('/').at(-1)
}

function isOtherProfile() {
    return pathMatches('user/.+')
}

function isOwnProfile() {
    return pathMatches('me/profile')
}

function isProfile() {
    return isOwnProfile() || isOtherProfile()
}

function isBattleRoyale() {
    return pathMatches('battle-royale/.+')
}

function isMaprunner() {
    return pathMatches('maprunner')
}

function isCommunity() {
    return pathMatches('community')
}

function isCommunityMaps() {
    return pathMatches('community/.+')
}

function isParty() {
    return pathMatches('party')
}

function isTeamDuel() {
    return pathMatches('team-duels/.+')
}

function isDuels() {
    return pathMatches('duels/.+')
}

function isGame(){
    return pathMatches('game/.+')
}

async function getUserData(id) {
    const response = await fetch(`${GEOGUESSR_USER_ENDPOINT}/${id}`)
    const json = await response.json()
    return json
}


async function getUsersInGame(id) {
    const response = await fetch(`${CHAT_ENDPOINT}/${id}`)
    const json = await response.json()
    return json
}

async function getMapInfo(id) {
    const response = await fetch(`${MAP_ENDPOINT}/${id}`)
    const json = await response.json()
    return json
}

async function fetchWithCors(url, method, body) {
    return await fetch(url, {
        headers: {
            accept: '*/*',
            'accept-language': 'en-US,en;q=0.8',
            'content-type': 'application/json',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            'sec-gpc': '1',
            'x-client': 'web',
        },
        referrer: 'https://www.geoguessr.com/',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: method == 'GET' ? null : JSON.stringify(body),
        method: method,
        mode: 'cors',
        credentials: 'include',
    })
}

const stylesUsed = [
    'styles_circle__QFYEk',
    'styles_variantFloating__Srm_N',
    'styles_colorTransparent__2bG5I',
    'styles_borderColorTransparent__CwSAk',
    'styles_borderSizeFactorZero__MEFpf',
    "transparent-avatar_imageWrapper__izUAM",
    "styles_rectangle___6gqv",
    "styles_innerCircle__Y_L_e",
    "styles_content__otIVG",
    "styles_image__8M_kp",
    "community-map-card_avatar__Zd55l",


]

function friendChat() {
    return `
        <div class="${cn("styles_circle__")} ${cn("styles_variantFloating__")} ${cn("styles_colorTransparent__")} ${cn("styles_borderColorTransparent__")} ${cn("styles_borderSizeFactorZero__")}">
        <div class="${cn("styles_rectangle__")}" style="padding-top: 100%;">
        <div class="${cn("styles_innerCircle__")}">
        <div class="${cn("styles_content__")}">
        <img class="${cn("styles_image__")} up__fc" loading="auto" style="object-fit: cover;">
        </div></div></div></div>`

}
const communityClassesUsed = ["community-map-card_avatar__", "styles_image__" ]
function community() {
    return `
    <div class="${cn(community-map-card_avatar__)}" style="height: 100%;">
     <img alt="" loading="lazy" decoding="async" data-nimg="fill" class="${cn(styles_image__)}" src="" style="position: absolute; height: 100%; width: 100%; inset: 0px; object-fit: contain; color: transparent;">
    </div>
    `
}

function friendChat2() {
    return `<div class="${cn("styles_circle__")} ${cn("styles_variantFloating__")} ${cn("styles_colorTransparent__")} ${cn("styles_borderColorTransparent__")} ${cn("styles_borderSizeFactorZero__")}">
        <div class="${cn("styles_rectangle__")}" style="padding-top: 100%;">
        <div class="${cn("styles_innerCircle__")}">
        <div class="${cn("styles_content__")}">
        <img alt="" loading="lazy" decoding="async" data-nimg="fill" class="${cn("styles_image__")} up__fc1" style="position: absolute; height: 100%; width: 100%; inset: 0px; object-fit: cover; color: transparent;">
        </div></div></div></div>`

}
function wrapperFriend1() {
    return `<div class="${cn("styles_rectangle__")}" style="padding-top: 100%">
    <div class="${cn("styles_innerCircle__")}">
    <div class="${cn("styles_content__")} up__userPin">
    <img class="${cn("styles_image__")} ${USER_PIN_CLASS}" loading="auto" style="object-fit: cover"></div></div></div>`
}

function wrapperFriend() {
    return `<div class="${cn("styles_innerCircle__")}  ${cn("styles_variantFloating__")} ${cn("styles_colorTransparent__")} ${cn("styles_borderColorTransparent__")} ${cn("styles_borderSizeFactorZero__")}">
    <div class="${cn("styles_rectangle__")}" style="padding-top: 100%"><div class="${cn("styles_innerCircle__")}"><div class="${cn("styles_content__")} up__"></div></div></div></div>`
}
function wrapperDuels() {
    return `<div class="profile-header_avatarWrapper__5_jDA up__"></div>`
}

function wrapperEndOfDuels() {
    return `<div class="profile-header_avatar__y6vsp up__"></div>`
}

function wrapper() {
    return `
    <div class="profile-header_avatar__y6vsp">
        <div class="${cn("avatar_titleAvatar__")}">
            <div class="${cn("styles_rectangle__")} up__" style="padding-top: 100%">
                <div class="${cn("avatar_titleAvatarImage__")} up__">
                </div>
            </div>
         </div>
    </div>`
}


function profilePicture() {
    return `<img class="${cn("styles_image__")} ${USER_PIN_CLASS}" loading="auto" style="object-fit:cover">`
}
function profilePicture1() {
    return `<img class="${cn("styles_image__")}" id="${USER_PIN_ID}" loading="auto" style="object-fit:cover">`
}

function levelBorder() {
    return `
    <img
    alt=""
    class="${USER_PIN_CLASS}"
    loading="eager"
    decoding="async"
    data-nimg="fill"
    style="position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent"
    src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
    >`
}

function levelBorder1() {
    return `
    <img
    alt=""
    loading="eager"
    decoding="async"
    data-nimg="fill"
    id="${USER_PIN_ID}"
    style="position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent"
    src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
    >`
}



const OBSERVER_CONFIG = {
    characterDataOldValue: false,
    subtree: true,
    childList: true,
    characterData: false,
}

const OBSERVER_CONFIG1 = {
    characterDataOldValue: false,
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['style'],
}

function pathMatches(path) {
    return location.pathname.match(new RegExp(`^/(?:[^/]+/)?${path}$`))
}



const observer = new MutationObserver(onMutationsStandard)

observer.observe(document.body, OBSERVER_CONFIG)