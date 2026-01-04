// ==UserScript==
// @name            TW Chat Media Embedder
// @namespace       http://tampermonkey.net/
// @version         1.0.1
// @description     Enables embedding of certain images in the chat.
// @include         https://*.the-west.*/game.php*
// @grant           none
// @license         GNU
// @downloadURL https://update.greasyfork.org/scripts/498957/TW%20Chat%20Media%20Embedder.user.js
// @updateURL https://update.greasyfork.org/scripts/498957/TW%20Chat%20Media%20Embedder.meta.js
// ==/UserScript==

window.MediaEmbedder = {
    baseUrl: `https://enormous-seasoned-porkpie.glitch.me`,
    screenshotRegex: new RegExp(/(?:https:\/\/)?(?:prnt\.sc|ctrlv\.[a-zA-Z]{2,4}|imgur\.com)\/[\/A-Za-z0-9_-]+/, 'g'),

    showImageFullscreen: function(url, originalUrl) {
        const html = $(`
            <div id='screenshot-framefix' style='position: fixed; inset: 0; padding: 2rem 4rem; z-index: 9999; background-color: rgba(0, 0, 0, .8)'>
                <div style='cursor: pointer; position: absolute; top: 1rem; right: 1rem'>
                    <svg class='tw-chat-embedder-close-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zm175 79c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>
                </div>

                <div style='position: relative; display: flex; height: 100%; justify-content: center; align-items: center'>
                    <img src='${url}' alt='image not found' style='object-fit: contain; max-width: 100%; max-height: 100%'>
                </div>

                <div id='tw-chat-embedder-image-link' style='position: absolute; bottom: 1rem; right: 1rem; color: white'>
                    <a target='_blank' href='${originalUrl}'>${originalUrl}</a>
                    <span></span>
                </div>
            </div>
        `)

        html.click(() => {
            document.body.removeChild(html[0])
        })

        html.find('img').click(e => e.stopPropagation())

        document.body.appendChild(html[0])
    },  

    getImageUrl: async function(url) {
        try {
            const response = await fetch(`${this.baseUrl}/img-url?url=${url}`, {
                method: 'Get',
                mode: 'cors'
            })

            if ( !response.ok ) {
                return null
            }

            const { image_url } = await response.json()     
            return image_url
        } catch(e) {
            console.log(e)
            return null
        }         
    },

    getImageHtml: function(url, originalUrl) {
        const collapseHtml = $(`
            <span style='display: flex; gap: 3px; font-weight: bold'>
                Collapse
                <svg style='fill: white; width: 10px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M439 7c9.4-9.4 24.6-9.4 33.9 0l32 32c9.4 9.4 9.4 24.6 0 33.9l-87 87 39 39c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8H296c-13.3 0-24-10.7-24-24V72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2l39 39L439 7zM72 272H216c13.3 0 24 10.7 24 24V440c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39L73 505c-9.4 9.4-24.6 9.4-33.9 0L7 473c-9.4-9.4-9.4-24.6 0-33.9l87-87L55 313c-6.9-6.9-8.9-17.2-5.2-26.2s12.5-14.8 22.2-14.8z"/></svg>
            </span>
        `)

        const expandHtml = $(`
            <span style='display: flex; gap: 3px; transform: translateY(.3rem); font-weight: bold'>
                Expand
                <svg style='fill: white; width: 10px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M344 0H488c13.3 0 24 10.7 24 24V168c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39-87 87c-9.4 9.4-24.6 9.4-33.9 0l-32-32c-9.4-9.4-9.4-24.6 0-33.9l87-87L327 41c-6.9-6.9-8.9-17.2-5.2-26.2S334.3 0 344 0zM168 512H24c-13.3 0-24-10.7-24-24V344c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2l39 39 87-87c9.4-9.4 24.6-9.4 33.9 0l32 32c9.4 9.4 9.4 24.6 0 33.9l-87 87 39 39c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8z"/></svg>
            </span>
        `)

        const html = $(`
            <span style='width: 100%; cursor: pointer; padding: .2rem .5rem; display: inline-block; box-sizing: border-box; position: relative; overflow: hidden'>
                <img src='${url}' width='100%' alt='embedded image' style='border-radius: 8px' onclick="MediaEmbedder.showImageFullscreen('${url}', '${originalUrl}')">
                <span class='expand-collapse-image' style='position: absolute; right: 5px; bottom: 5px; font-size: .7rem'></span>
            </span> 
        `)

        function replaceElement(isExpanded) {
            const element = isExpanded ? collapseHtml : expandHtml
            html.find('span.expand-collapse-image').html(element)
            html.css('max-height', isExpanded ? '100%': '1rem')
    
            element.off('click')
    
            element.click(toggleExpand(!isExpanded))
    
            return element
        }
    
        function toggleExpand(isExpanded) {
            return function() {
                replaceElement(isExpanded)
            }
        }

        
        collapseHtml.click(toggleExpand(false))
    

        html.find('span.expand-collapse-image').html(collapseHtml)

        return html
    },

    getMessageHtml: function(media) {
        const now = new ServerDate().date

        const hours = now.getHours()
        const minutes = now.getMinutes()

        const html = $(`
            <table cellpadding='0' cellspacing='0'>
                <tr>
                    <td style='white-space: nowrap' class='chat_info'>
                        <span class='chat_time'>
                            [<strong>${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}</strong>]
                        </span>
                        <span class='chat_from'>
                            <strong>Media Embedder</strong>:
                        </span>
                    </td>
                    <td class='media-content'></td>
                </tr>
            </table>
        `)

        html.find('td.media-content').html(media)
        return html
    },

    pushEmbeddedImage: async function(room, url) {
        const imageUrl = await this.getImageUrl(url)

        if ( imageUrl === null ) return

        const imageHtml = this.getImageHtml(imageUrl, url)
        const message = this.getMessageHtml(imageHtml)

        room.history.push(message)
        room.notify('NewMessage', message)
    },

    getMessageContent: function(htmlString) {
        const html = $(htmlString)
        const message = html.find('td.chat_text')
        const tempDiv = $('<div></div>').html(message.html())
        return tempDiv.text()
    },

    testMessage: function(room, message) {
        const text = this.getMessageContent(message)
        const urls = [...new Set(Array.from(text.matchAll(this.screenshotRegex)).map(e => e[0]))]

        for (const url of urls) {
            this.pushEmbeddedImage(room, url)
        }
    },

    replaceEmojis: function(message) {
        const pattern = /(\s|^):[\/D)(|POx]+(\s|$)/g

        const result = message.replace(pattern, match => {
            const emojis = match.trim().slice(1)
            const replacement = ' ' + emojis.split('').map(c => `:${c}`).join(' ') + ' '

            return replacement
        })

        return result
    },

    init: function() {
        const addMessage = Chat.Resource.Room.prototype.addMessage
        Chat.Resource.Room.prototype.addMessage = function(message) {
            addMessage.bind(this, message)()
            MediaEmbedder.testMessage(this, message)
        }

        const sendMessage = Chat.sendMessage
        Chat.sendMessage = function(message, room) {
            message = MediaEmbedder.replaceEmojis(message)
            sendMessage(message, room)
        }
    
        const newCss = `
            #tw-chat-embedder-image-link a {
                text-decoration: none;
                color: white;
                position: relative;
                padding: .4rem .2rem;
            }
    
            #tw-chat-embedder-image-link span {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 100%;
                height: 2px;
                background-color: white;
                opacity: 0;
                transition: opacity .3s;
            }
    
            #tw-chat-embedder-image-link:hover span {
                opacity: 1;
            }
    
            .tw-chat-embedder-close-icon {
                fill: white; 
                transition: fill .3s; 
                width: 25px
            }
    
            .tw-chat-embedder-close-icon:hover {
                fill: rgb(255, 144, 144)
            }
        `
    
        const style = $('<style>').text(newCss)
        $('head').append(style)
    }
}

window.EmojiIndex = {
    emojis: new Map(),
    index: new Map(),
    state: {
        currentIndex: 0,
        lastIndex: 0,
        keyUpHandler: null
    },

    add: function(key, emoji) {
        this.emojis.set(key, emoji)

        modifiedKey = key.replaceAll('_', '')
    
        for(let i = 0; i < modifiedKey.length; i++) {
            for(let j = i + 1; j <= modifiedKey.length; j++) {
                const substr = modifiedKey.slice(i, j)
                if(!this.index.has(substr)) {
                    this.index.set(substr, new Set())
                }
                this.index.get(substr).add(key)
            }
        }
    },

    search: function(substring) {
        substring = substring.replaceAll('_', '')
        return this.index.has(substring) ? 
            Array.from(this.index.get(substring)).map(key => ({
                key,
                emoji: this.emojis.get(key)
            })) : []
    },

    sort: function(result, searchstring) {
        const searchLen = searchstring.replaceAll('_', '').length

        return result.sort((a, b) => (a.key.length - searchLen) - (b.key.length - searchLen))
    },

    getSingleEmojiHtmlString: function({key, emoji}, index) {
        return `
            <div class='emoji_option ${index == 0 ? "active" : ""}' id='emoji-option-${index}' data-emoji='${emoji}' onmouseenter='EmojiIndex.handleMouseEnter(event, ${index})' onclick='EmojiIndex.handleClick(event, ${index})'>
                <span>${emoji}</span>
                <span>:${key}:</span>
            </div>
        `
    },

    getEmojiOptionsHtml: function(result) {
        return $(`
            <div class='emoji_options'>
                ${
                    result.map((e, i) => this.getSingleEmojiHtmlString(e, i)).join('\n')
                }
            </div>
        `)
    },

    removeOptionsWindow: function(inputElement) {
        $('.emoji_options').remove()
        $(inputElement).on('keyup', this.state.keyUpHandler)
        this.state.keyUpHandler = null
    },

    createOptionsWindow: function(searchstring, inputElement) {
        this.removeOptionsWindow(inputElement)

        const search = this.search(searchstring)
        if ( search.length == 0 ) {
            return null
        }
        const sorted = this.sort(search, searchstring)
        const html = this.getEmojiOptionsHtml(sorted)

        this.state.lastIndex = sorted.length - 1
        this.state.currentIndex = 0
        
        $(`#emoji-option-0`).toggleClass('active')

        this.state.keyUpHandler = jQuery._data($(inputElement)[0], 'events').keyup[0]
        $(inputElement).off('keyup')
        return html
    },

    changeActiveOption: function(direction) {
        $(`#emoji-option-${this.state.currentIndex}`).toggleClass('active')
        this.state.currentIndex += direction
        if (this.state.currentIndex < 0) this.state.currentIndex = this.state.lastIndex
        if (this.state.currentIndex > this.state.lastIndex) this.state.currentIndex = 0
        $(`#emoji-option-${this.state.currentIndex}`).toggleClass('active')
        $(`#emoji-option-${this.state.currentIndex}`)[0]?.scrollIntoViewIfNeeded()
    },

    selectEmoji: function(input, index = this.state.currentIndex) {
        const text = input.value
        const cursorPosition = input.selectionStart
        const pattern = /:(?:[a-z_]{2,}):?/g
    
        const matches = [...text.matchAll(pattern)]
        
        for (const match of matches) {
            const matchStart = match.index
            const matchEnd = matchStart + match[0].length
    
            if (cursorPosition >= matchStart && cursorPosition <= matchEnd) {
                const emoji = $(`#emoji-option-${index}`).data('emoji')
                if (!emoji) return
                const beforeMatch = text.slice(0, matchStart)
                const afterMatch = text.slice(matchEnd)
                input.value = beforeMatch + emoji + afterMatch
                
                const newPosition = matchStart + emoji.length
                input.setSelectionRange(newPosition, newPosition)
                
                this.removeOptionsWindow(input)
                return
            }
        }
    },

    getEmojiHtml: function([key, emoji], input, onMouseEnter, onClick) {
        const html = $(`
            <div class='emoji-list-item'>
                ${emoji}
            </div>
        `)

        html.on('mouseenter', onMouseEnter(key, emoji))
        html.on('click', onClick(emoji, input))

        return html
    },

    createEmojiListGui: function(input) {
        const html = $(`
            <aside class='EmojiIndex'>
                <div class='icon-wrapper'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM164.1 325.5C182 346.2 212.6 368 256 368s74-21.8 91.9-42.5c5.8-6.7 15.9-7.4 22.6-1.6s7.4 15.9 1.6 22.6C349.8 372.1 311.1 400 256 400s-93.8-27.9-116.1-53.5c-5.8-6.7-5.1-16.8 1.6-22.6s16.8-5.1 22.6 1.6zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
                </div>
                <div class='emoji-list'>
                    <div class='list'>

                    </div>

                    <div class='emoji-active'>
                        <span class='emoji'>😅</span>
                        <span class='emoji-key'>:sweat_smile:</span>
                    </div>
                </div>
            </aside>
        `)

        function openList() {
            $('aside.EmojiIndex div.emoji-list').toggle()
            $('aside.EmojiIndex div.icon-wrapper').toggleClass('active')
        }

        function onMouseEnter(key, emoji) {
            return function() {
                const div = html.find('div.emoji-list div.emoji-active')
                div.find('span.emoji').html(emoji)
                div.find('span.emoji-key').html(`:${key}:`)
            }
        }

        function onClick(emoji, input) {
            return function() {
                const startPos = input[0].selectionStart
                const endPos = input[0].selectionEnd 
                const currentValue = input.val()
                const newValue = currentValue.substring(0, startPos) + emoji + currentValue.substring(endPos)
                input.val(newValue)
                const newCursorPos = startPos + emoji.length
                input[0].setSelectionRange(newCursorPos, newCursorPos)
            }
        }
        
        const container = html.find('div.emoji-list div.list')
        this.emojis.entries().forEach(e => container.append(this.getEmojiHtml(e, input, onMouseEnter, onClick)))

        html.find('div.icon-wrapper svg').on('click', openList)

        return html
    },

    handleKeyDown: function(event) {
        switch (event.key) {
            case 'ArrowUp':
                event.preventDefault()
                this.changeActiveOption(-1)
                break
            case 'ArrowDown':
                event.preventDefault()
                this.changeActiveOption(1)
                break
            case 'Tab':
                event.preventDefault()
                this.selectEmoji(event.target)
                break
        }
    },

    handleInput: function(event) {
        const input = event.target
        const text = input.value
        const pattern = /:(?:[a-z_]{2,}):?/

        const match = text.match(pattern)
        if (match) {
            const options = this.createOptionsWindow(match[0].replaceAll(':', ''), input)
            $(input).parent().parent().append(options)
        } else {
            this.removeOptionsWindow(input)
        }
    },

    handleMouseEnter: function(event, index) {
        $(`#emoji-option-${this.state.currentIndex}`).toggleClass('active')
        event.target.classList.toggle('active')
        this.state.currentIndex = index
    },

    handleClick: function(event, index) {
        const parent = event.currentTarget.parentElement.parentElement
        const input = parent.querySelector('input.message')
        this.selectEmoji(input, index)
    },

    init: function() {
        const emojis = {       
            // Smileys & Emotion
            'grinning': '😁',
            'laughing': '😆',
            'joy': '😂',
            'sweat_smile': '😅',
            'rofl': '🤣',
            'relaxed': '☺️',
            'blush': '😊',
            'innocent': '😇',
            'slight_smile': '🙂',
            'upside_down': '🙃',
            'smiling_face_with_tear': '🥲',
            'relieved': '😌',
            'heart_eyes': '😍',
            'smiling_face_with_three_hearts': '🥰',
            'kissing_heart': '😘',
            'kissing': '😗',
            'kissing_closed_eyes': '😚',
            'kissing_smiling_eyes': '😙',
            'yum': '😋',
            'stuck_out_tongue_closed_eyes': '😝',
            'stuck_out_tongue_winking_eye': '😜',
            'zany_face': '🤪',
            'thinking': '🤔',
            'shushing': '🤫',
            'zipper_mouth': '🤐',
            'raised_eyebrow': '🤨',
            'neutral_face': '😐',
            'expressionless': '😑',
            'no_mouth': '😶',
            'smirk': '😏',
            'unamused': '😒',
            'rolling_eyes': '🙄',
            'grimacing': '😬',
            'lying_face': '🤥',
            'relieved': '😌',
            'pensive': '😔',
            'sleepy': '😪',
            'drooling_face': '🤤',
            'sleeping': '😴',
            'mask': '😷',
            'thermometer_face': '🤒',
            'dizzy_face': '😵',
            'exploding_head': '🤯',
            'flushed': '😳',
            'pleading': '🥺',
            'frowning2': '☹️',
            'worried': '😟',
            'slight_frown': '🙁',
            'cry': '😢',
            'sob': '😭',
            'anger': '💢',
            'rage': '😡',
            'face_with_symbols': '🤬',
            'face_screaming_in_fear': '😱',
            'face_with_monocle': '🧐',
            'exploding_head': '🤯',
            
            // People & Body
            'wave': '👋',
            'raised_back_of_hand': '🤚',
            'raised_hand': '✋',
            'vulcan': '🖖',
            'ok_hand': '👌',
            'pinching_hand': '🤏',
            'victory': '✌️',
            'crossed_fingers': '🤞',
            'love_you_gesture': '🤟',
            'metal': '🤘',
            'call_me': '🤙',
            'point_left': '👈',
            'point_right': '👉',
            'point_up': '☝️',
            'point_down': '👇',
            'thumbs_up': '👍',
            'thumbs_down': '👎',
            'fist': '✊',
            'punch': '👊',
            'clap': '👏',
            'raising_hands': '🙌',
            'heart': '❤️',
            'broken_heart': '💔',
            'two_hearts': '💕',
            'sparkling_heart': '💖',
            'heartbeat': '💓',
            'heartpulse': '💗',
            'gift_heart': '💝',
            'man_gesturing_no': '🙅‍♂️',
            'man_gesturing_ok': '🙆‍♂️',
            'man_bowing': '🙇‍♂️',
            'man_raising_hand': '🙋‍♂️',
            'man_facepalming': '🤦‍♂️',
            'man_shrugging': '🤷‍♂️',
            'man_pouting': '🙎‍♂️',
            'man_frowning': '🙍‍♂️',
            'man_getting_massage': '💆‍♂️',
            'man_getting_haircut': '💇‍♂️',
            'man_tipping_hand': '💁‍♂️',
            'woman_gesturing_no': '🙅‍♀️',
            'woman_gesturing_ok': '🙆‍♀️',
            'woman_bowing': '🙇‍♀️',
            'woman_raising_hand': '🙋‍♀️',
            'woman_facepalming': '🤦‍♀️',
            'woman_shrugging': '🤷‍♀️',
            'woman_pouting': '🙎‍♀️',
            'woman_frowning': '🙍‍♀️',
            'woman_getting_massage': '💆‍♀️',
            'woman_getting_haircut': '💇‍♀️',
            'woman_tipping_hand': '💁‍♀️',
            'person_bouncing_ball': '⛹️',
            'person_swimming': '🏊',
            'person_walking': '🚶',
            'person_running': '🏃',
            'person_cartwheeling': '🤸',
            'person_juggling': '🤹',
            'person_biking': '🚴',
            'person_rowing_boat': '🚣',
            'person_surfing': '🏄',
            'pray': '🙏',
            'poop': '💩',
            'nail_polish': '💅',
        
            
            // Activities & Objects
            'gift': '🎁',
            'tada': '🎉',
            'medal': '🏅',
            'trophy': '🏆',
            'crown': '👑',
            'musical_note': '🎵',
            'fire': '🔥',
            'boom': '💥',
            'sparkles': '✨',
            'dizzy': '💫',
            '100': '💯',
            'question': '❓',
            'exclamation': '❗',
            'warning': '⚠️',
            'star': '⭐',
            'rainbow': '🌈',
            'sunny': '☀️',
            'moon': '🌙',
            'cloud': '☁️',
            'zap': '⚡',
            'ghost': '👻',
            'skull': '💀',
            'robot': '🤖',
            'space_invader': '👾',
            'knife': '🔪',
            'gun': '🔫',
            'bomb': '💣',
            'pill': '💊',
            'syringe': '💉',
            'money_bag': '💰',
            'credit_card': '💳',
            'gem': '💎',
            'magic_wand': '🪄',
            'video_game': '🎮',
            'joystick': '🕹️',
            'game_die': '🎲',
            'puzzle_piece': '🧩',
            'chess_pawn': '♟️',
            
            // Animals & Nature
            'dog': '🐕',
            'cat': '🐈',
            'mouse': '🐁',
            'hamster': '🐹',
            'rabbit': '🐇',
            'fox': '🦊',
            'bear': '🐻',
            'panda': '🐼',
            'koala': '🐨',
            'tiger': '🐯',
            'lion': '🦁',
            'cow': '🐄',
            'pig': '🐷',
            'frog': '🐸',
            'monkey': '🐒',
            'chicken': '🐔',
            'penguin': '🐧',
            'bird': '🐦',
            'dove': '🕊️',
            'eagle': '🦅',
            'duck': '🦆',
            'owl': '🦉',
            'butterfly': '🦋',
            'snail': '🐌',
            'snake': '🐍',
            'dragon': '🐉',
            'unicorn': '🦄',
            
            // Food & Drink
            'pizza': '🍕',
            'hamburger': '🍔',
            'fries': '🍟',
            'hotdog': '🌭',
            'taco': '🌮',
            'sushi': '🍣',
            'cookie': '🍪',
            'cake': '🍰',
            'cupcake': '🧁',
            'candy': '🍬',
            'lollipop': '🍭',
            'chocolate_bar': '🍫',
            'popcorn': '🍿',
            'doughnut': '🍩',
            'tea': '🍵',
            'coffee': '☕',
            'beer': '🍺',
            'wine_glass': '🍷',
            'cocktail': '🍸',

            //symbols
            'check_mark': '✔️',
            'check_mark_button': '✅'
        }

        for (const key in emojis) {
            this.add(key, emojis[key])
        }

        const newCss = `
            .chat_input input.message {
                padding-right: 30px !important;
                box-sizing: border-box
            }

            .emoji_options {
                position: absolute;
                bottom: 110%;
                width: 100%;
                border-radius: 2px;
                background: rgba(20, 20, 20, .9);
                max-height: calc(4 * 1.8rem);
                overflow-y: auto;
            }

            .emoji_options::-webkit-scrollbar, aside.EmojiIndex div.emoji-list div.list::-webkit-scrollbar {
                width: 6px; 
                background-color: transparent;
            }

            .emoji_options::-webkit-scrollbar-thumb, aside.EmojiIndex div.emoji-list div.list::-webkit-scrollbar-thumb {
                background-color: #CFCFCF;
                border-radius: 2px;
                cursor: pointer;
            }

            .emoji_options::-webkit-scrollbar-thumb:hover, aside.EmojiIndex div.emoji-list div.list::-webkit-scrollbar-thumb:hover {
                background-color: #EFEFEF;
            }

            .emoji_options::-webkit-scrollbar-track, aside.EmojiIndex div.emoji-list div.list::-webkit-scrollbar-track {
                background: rgb(10, 10, 10);
                border-radius: 1px;
            }

            .emoji_option {
                position: relative;
                padding: .2rem .4rem;
                box-sizing: border-box;
                cursor: pointer;
                border-radius: 2px;
                font-size: .9rem;
                transition: background .3s;
            }

            .emoji_option:hover, .emoji_option.active {
                background: rgba(60, 60, 60, .7);
            }

            .emoji_option span:first-child {
                font-size: 1rem;
                padding-right: .75rem;
            }

            aside.EmojiIndex div.icon-wrapper {
                position: absolute;
                right: 5px;
                height: 100%;
                display: grid;
                place-content: center;
            }

            aside.EmojiIndex div.icon-wrapper svg {
                width: 20px;
                height: 20px;
                fill: rgb(194, 196, 193);
                transition: fill .3s;
                cursor: pointer;
            }

            aside.EmojiIndex div.icon-wrapper svg:hover, aside.EmojiIndex div.icon-wrapper.active svg {
                fill: white;
            }

            aside.EmojiIndex div.emoji-list {
                position: absolute;
                bottom: 110%;
                width: 100%;
                height: 150px;
                background: rgba(20, 20, 20, .9);
                display: none;
                border-radius: 3px;
            }

            aside.EmojiIndex div.emoji-list div.list {
                height: calc(100% - 25px);
                width: 100%;
                overflow-y: auto;
                padding: .2rem 1rem;
                box-sizing: border-box;
            }

            aside.EmojiIndex div.emoji-list div.emoji-active {
                position: absolute;
                bottom: 0;
                padding: .2rem 1rem;
                width: 100%;
                box-sizing: border-box;
                max-height: 25px;
                border-top: 1px solid rgba(80, 80, 80, .5);
            }

            aside.EmojiIndex div.emoji-list div.emoji-active span.emoji {
                padding-right: .5rem;
            }

            aside.EmojiIndex div.emoji-list div.emoji-active span.emoji-key {
                font-weight: bold;
            }

            aside.EmojiIndex div.emoji-list div.list div.emoji-list-item {
                display: inline-grid;
                place-content: center;
                border-radius: 2px;
                width: 24px;
                height: 24px;
                transition: background-color .2s;
                cursor: pointer;
            }

            aside.EmojiIndex div.emoji-list div.list div.emoji-list-item:hover {
                background-color: rgba(60, 60, 60, .7);
            }
        `

        const style = $('<style>').text(newCss)
        $('head').append(style)

        const open = ChatWindow.open
        ChatWindow.open = function(room, avoidSwitch) {
            EmojiIndex.removeOptionsWindow()
            open(room, avoidSwitch)
            $('.chat_input').each(function() {
                if (!$(this).data('listenersAdded')) {
                    $(this).append(EmojiIndex.createEmojiListGui($(this).find('input.message')))
                    $(this).find('input.message')
                        .on('keydown', EmojiIndex.handleKeyDown.bind(EmojiIndex))
                        .on('input', EmojiIndex.handleInput.bind(EmojiIndex))
                        .data('listenersAdded', true)
                }
            })
        }
    }
}


$(document).ready(() => {
    EmojiIndex.init()
    MediaEmbedder.init()
})