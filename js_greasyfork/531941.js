// ==UserScript==
// @name            GGn itch.io Uploady
// @namespace       https://greasyfork.org/users/1429440
// @version         1.3
// @description     Fills upload form with itch.io info.
// @originalAuthor  ifthesound
// @author          Nyannerz
// @match           https://gazellegames.net/upload.php*
// @match           https://gazellegames.net/torrents.php?action=editgroup*
// @grant           GM_xmlhttpRequest
// @connect         itch.io
// @connect         img.itch.zone
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/531941/GGn%20itchio%20Uploady.user.js
// @updateURL https://update.greasyfork.org/scripts/531941/GGn%20itchio%20Uploady.meta.js
// ==/UserScript==

const useReleaseDate = true;    //This will be the first priority if enabled & checks for "Release date" in the information box.
const usePublished = true;      //This will be the second priority if enabled & checks for "Published" in the information box.
const useLastUpdated = false;   //This will be the third priority if enabled & checks for "Updated" in the information box.
                                //Do note that the updated year is somewhat likely to not be the ACTUAL release year, in which case you're responsible for fixing it.
                                //This is why I disable it by default.
                                //If none are enabled or none of the enabled options are found on itchio, the Year field will remain empty in the upload form.
let itchIoUrl



const tags_mapping = {
    "3D Platformer": [ "platform" ],
    "Adult": [ "adult" ],
    "Action RPG": [ "action", "role.playing.game" ],
    "Action-Adventure": [ "action", "adventure" ],
    "Action": [ "action" ],
    "Adventure": [ "adventure" ],
    "Board Game": [ "board.game" ],
    "Bullet Hell": [ "bullet.hell" ],
    "Card Game": [ "card.game" ],
    //"Casual": [ "casual" ],       //Apparently overused, can reenable this if you want by removing the comment indicator before "casual"
    "City Builder": [ "city.building" ],
    "Clicker": [ "clicker" ],
    "Comedy": [ "comedy" ],
    "dance": [ "dance", "rhythm" ],
    "Dark Fantasy": [ "fantasy" ],
    "Dating Sim": [ "dating.simulation" ],
    "Driving": [ "driving" ],
    "Dungeon Crawler": [ "dungeon.crawler" ],
    "Educational": [ "educational" ],
    "Eroge": [ "adult" ],
    "Erotic": [ "adult" ],
    "Exploration": [ "exploration" ],
    "Fantasy": [ "fantasy" ],
    "Farming": [ "agriculture" ],
    "Fighting": [ "fighting" ],
    "Fishing": [ "fishing" ],
    "FPS": [ "first.person.shooter"],
    "Hack and Slash": [ "hack.and.slash" ],
    "Hentai": [ "adult" ],
    "Historical": [ "historical" ],
    "Horror": [ "horror" ],
    "Interactive Fiction": [ "interactive.fiction" ],
    "JRPG": [ "role.playing.game" ],
    "Life Simulation": [ "life.simulation" ],
    "Management": [ "management" ],
    "Music": [ "music" ],
    "Mystery": [ "mystery" ],
    "NSFW": [ "adult" ],
    "Open World": [ "open.world" ],
    "party": [ "party" ],
    "Platformer": [ "platform" ],
    "Point & Click": [ "point.and.click" ],
    "Porn": [ "adult" ],
    "Puzzle-Platformer": [ "puzzle", "platform" ],
    "Puzzle": [ "puzzle" ],
    "Racing": [ "racing" ],
    "Real time strategy": [ "real.time.strategy"],
    "Rhythm": [ "rhythm" ],
    "Roguelike": [ "roguelike" ],
    "Roguelite": [ "roguelike" ],
    "Role Playing": [ "role.playing.game" ],
    "Romance": [ "romance" ],
    "Sandbox": [ "sandbox" ],
    "Sci-fi": [ "science.fiction" ],
    "Shoot 'Em Up": [ "shoot.em.up" ],
    "Shooter": [ "shooter" ],
    "Simulation": [ "simulation" ],
    "Tycoon": [ "simulation" ],
    "Sports": [ "sports" ],
    "Strategy": [ "strategy" ],
    "Survival Horror": [ "horror" ],
    "Survival": [ "survival" ],
    "Tabletop role-playing game": [ "tabletop" ],
    "Tabletop": [ "tabletop" ],
    "Tactical": [ "tactics" ],
    "Third-Person Shooter": [ "third.person.shooter" ],
    "Thriller": [ "thriller" ],
    "Top down shooter": [ "shooter" ],
    "Tower Defense": [ "tower.defense" ],
    "Turn-based Strategy": [ "turn.based.strategy" ],
    "Visual Novel": [ "visual.novel" ],
    "Walking simulator": [ "walking.simulation" ],
}

function html2bb(str) {
    if (!str) return ""
    str = str.replace(/< *br *\/*>/g, "\n\n") //*/
    str = str.replace(/< *hr *\/*>/g, "\n\n") //*/

    str = str.replace(/< *b *>/g, "[b]")
    str = str.replace(/< *\/ *b *>/g, "[/b]")
    str = str.replace(/< *u *>/g, "[b]")
    str = str.replace(/< *\/ *u *>/g, "[/b]")
    str = str.replace(/< *strong *>/g, "[b]")
    str = str.replace(/< *\/ *strong *>/g, "[/b]")

    str = str.replace(/< *i *>/g, "[i]")
    str = str.replace(/< *\/ *i *>/g, "[/i]")
    str = str.replace(/< *em *>/g, "[i]")
    str = str.replace(/< *\/ *em *>/g, "[/i]")

    //str = str.replace(/< *a[^>]href="([^"]*)"[^>]*>/g, "[url=$1]")
    str = str.replace(/<a[^>]*\s+href="([^"]*)"[^>]*>/g, "[url=$1]")
    str = str.replace(/< *\/ *a *>/g, "[/url]")

    str = str.replace(/< *span[^>]*>/g, "")
    str = str.replace(/< *\/ *span *>/g, "")

    str = str.replace(/<del>.*?<\/del>/g, "")

    str = str.replace(/< *p[^>]*>/g, "\n")
    str = str.replace(/< *\/ *p *>/g, "")
    str = str.replace(/< *blockquote[^>]*>/g, "\n")
    str = str.replace(/< *\/ *blockquote *>/g, "")
    str = str.replace(/< *img[^>]*>/g, "\n")

    str = str.replace(/< *h[1234][^>]*>/g, "\n[align=center][u][b]")
    str = str.replace(/< *\/ *h[1234] *>/g, "[/b][/u][/align]\n")

    str = str.replace(/< *ul[^>]*>/g, "")
    str = str.replace(/< *\/ *ul *>/g, "")
    str = str.replace(/< *li *>/g, "[*]")
    str = str.replace(/< *\/ *li *>/g, "")

    str = str.replace(/<figure[^>]*>[\s\S]*?<\/figure>/g, "")
    str = str.replace(/<button[^>]*>.*?<\/button>/g, "")
    str = str.replace(/< *div[^>]*>/g, "")
    str = str.replace(/< *\/ *div *>/g, "")

    str = str.replace(/\&quot;/g, "\"")
    str = str.replace(/\&amp;/g, "&")
    str = str.replace(/\&nbsp;/g, " ")

    str = str.replace(//g, "\"")
    str = str.replace(//g, "\"")
    str = str.replace(/  +/g, " ")
    str = str.replace(/\n +/g, "\n")
    str = str.replace(/\n\n\n+/gm, "\n\n")
    str = str.replace(/\n\n\n+/gm, "\n\n")
    str = str.replace(/\[\/b]\[\/u]\[\/align]\n\n/g, "[/b][/u][/align]\n")
    str = str.replace(/\n\n\[\*]/g, "\n[*]")
    return str
}

function fix_emptylines(str) {
    const lst = str.split("\n")
    let result = ""
    let empty = 1
    lst.forEach(function (s) {
        if (s) {
            empty = 0
            result = result + s + "\n"
        } else if (empty < 1) {
            empty = empty + 1
            result = result + "\n"
        }
    })
    return result
}

function formatAbout(about) {
    const toTitleCase = unsafeWindow?.TitleAndScreenshotsFormatter?.toTitleCase ?? function (str) { // from Title and Screenshots Formatter script
        return str
    }

    function fixSplitLinesInListItems(input) {
        let lines = input.split('\n')
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith("[*]")) {
                while (i + 1 < lines.length && !lines[i].match(/[.?!。？！]$/)) {
                    if (lines[i + 1].startsWith("[*]")) {
                        lines[i] += '.'
                        break
                    } else if (lines[i + 1].trim() !== '') {
                        lines[i] += ' ' + lines.splice(i + 1, 1)[0]
                    } else {
                        lines.splice(i + 1, 1)
                    }
                }
            }
        }
        return lines.join('\n')
    }

    // If a line starts with [u], [i], or [b], there is no other text on that line, and it contains 'features', replace tags with [align=center][b][u]
    about = about.replace(/^(\[b]|\[u]|\[i])*(.*?)(\[\/b]|\[\/u]|\[\/i])*$/gm, (match, p1, p2, p3) => {
        return (p1 && p3 && /features/i.test(p2)) ? `[align=center][b][u]${p2}[/u][/b][/align]` : match
    })

    // Title case text inside [align=center][b][u]
    about = about.replace(/\[align=center]\[([bu])]\[([bu])]([\s\S]*?)\[\/\2]\[\/\1]\[\/align]/g, (match, p1, p2, p3) => {
        return `[align=center][b][u]${toTitleCase(p3)}[/u][/b][/align]`
    })

    // Add a newline before lines with [align=center] if there isn't already a double newline before it
    about = about.replace(/(?<!\n\n)(\[align=center])/g, '\n\$1')

    // Remove colons in text inside [align=center][b][u]
    about = about.replace(/\[align=center]\[b]\[u](.*?)\[\/u]\[\/b]\[\/align]/g, (match, p1) => {
        return match.replace(/:/g, '')
    })

    // Replace different list symbols at the start with [*]
    about = about.replace(/^[-•◦]\s*/gm, '[*]')

    // If a line starts with [u], [i], or [b] and it is not the only text on that line, add [*] at the start and replace tags with [b]
    about = about.replace(/^(\[b]|\[u]|\[i])*(.*?)(\[\/b]|\[\/u]|\[\/i])+(.*$)/gm, (match, p1, p2, p3, p4) => {
        if (p4.trim() === '') {
            return match
        }
        return p1 && p3 ? `[*][b]${p2}[/b]${p4}` : match
    })

    // If a line starts with [*] followed by a [u] or [i], replace them with [b]
    about = about.replace(/^\[\*]\[[ui]](.*?)\[\/[ui]]/gm, '[b]$1[/b]')

    // Title case text inside tags for lines starting with [u], [i], or [b] and has nothing else after the closing tag
    about = about.replace(/(^|\n)(\[([uib])](.*?)\[\/([uib])]\s*$)/gm, (match, p1, p2, p3, p4) => `${p1}[${p3}]${toTitleCase(p4)}[/${p3}]`)

    // For lines that start with [*], replace newlines with spaces  until that line ends with ., ?, or !
    // and add a full stop if there is no punctuation before another [*]
    about = fixSplitLinesInListItems(about)

    // Remove double newlines between [*] lines
    about = about.replace(/(\[\*][^\n]*)(\n{2,})(?=\[\*])/g, '$1\n')

    // Add a newline when next line doesn't start with [*]
    about = about.replace(/(\[\*][^\n]*\n)([^\[*\]\n])/g, '$1\n$2')

    // Move : and . outside of closing tags
    about = about.replace(/(\[([bui])])(.*?)([:.])\[\/([bui])]/g, '$1\$3[/b]\$4')

    // Remove [u], [i], or [b] if the line starts with [*] followed by a [u], [i], or [b], and ends with a punctuation after the closing tag
    about = about.replace(/^\[\*]\[([bui])](.*?)\[\/([bui])]([.?!。？！])$/gm, "[*]$2$4")

    // If a line ends with [/align] replace double newlines with one newline
    about = about.replace(/(\[\/align])\n\n/g, '$1\n')

    // Remove empty tags
    about = about.replace(/\[b\]\[\/b\]/g, "")
    about = about.replace(/\[u\]\[\/u\]/g, "")
    about = about.replace(/\[align=center\]\[\/align\]/g, "")

    return about
}

function removeRedundantTags(tagSet)
{
  if(tagSet.has("strategy"))
  {
    if(tagSet.has("real.time.strategy") || tagSet.has("turn.based.strategy")) tagSet.delete("strategy");
  }
  if(tagSet.has("shooter"))
  {
    if(tagSet.has("first.person.shooter") || tagSet.has("third.person.shooter")) tagSet.delete("shooter");
  }
  if(tagSet.has("simulation"))
  {
    if(tagSet.has("walking.simulation") || tagSet.has("dating.simulation") || tagSet.has("life.simulation")) tagSet.delete("simulation");
  }
  return tagSet;
}

function fill_form(response) {
    const page = new DOMParser().parseFromString(response.responseText, "text/html")

    // use Steam link that's in the "More info" section (not just the first link to Steam found on the page - it might be a link another game)
    const steamLinkElem = page.querySelector(".info_panel_wrapper a[href*='store.steampowered.com/app/']")

    // Steam link found on itch.io
    if (steamLinkElem) {
        let steamLink = steamLinkElem.attributes["href"].value
        steamLink = steamLink.charAt(steamLink.length-1) =="/" ? steamLink.substr(0, steamLink.length-1) : steamLink
        const steamId = steamLink.match(/store.steampowered.com\/app\/(.*)\/.*/)[1]

        const steamIdInput = document.querySelector("#steamid")
        const steamFillWinButton = document.querySelector("#fill_win")

        // Steam Uploady installed
        if (steamId && steamIdInput && steamFillWinButton) {
            steamIdInput.value = steamId
            // follow Steam uploady user flow: 1. set #platform to Windows
            steamFillWinButton.click()
            // 2. trigger Steam uploady filling form behaviour
            steamIdInput.focus()
            steamIdInput.blur()
        }
        // Steam Uploady not installed
        else {
            // still try to fill in Steam ID
            if (steamId && steamIdInput) {
                steamIdInput.value = steamId
            }
            // proceed with filling in form based on itch.io scrape
            fill_form_from_itch_scrape(page)

        }
    }
    // Steam link not found on itch.io - just scrape
    else {
        fill_form_from_itch_scrape(page)
    }
}

function fill_form_from_itch_scrape(page) {
    // get game name from metadata
    const titleElem = page.querySelector("h1.game_title[itemprop='name']")
    const name = titleElem.innerHTML

    // get cover image from metadata
    const metaOgImageElem = page.querySelector("meta[property='og:image']")
    const coverImg = metaOgImageElem.attributes["content"].value

    // get listed languages
    const languageElems = page.querySelectorAll("a[href*='lang-']")
    const languages = []
    languageElems.forEach(elem => languages.push(elem.text))
    const multiLang = languages.length > 1;

    // format languagesOutput, so that it can be later inserted in the description
    let languagesOutput = ""
    languagesOutput += `[b]Language${multiLang ? "s": ""}[/b]: `;
    if (multiLang) {
        let lastItem = languages.pop();
        languagesOutput += languages.join(', ');
        languagesOutput += ` and ${lastItem}`;
    } else {
        languagesOutput += languages[0];
    }
    languagesOutput += '\n';

    // get description and format it, including system requirements "None available"; also include list of languages if there is more than one
    const aboutElem = page.querySelector(".formatted_description").innerHTML
    const about = "[align=center][b][u]About the game[/u][/b][/align]\n" + formatAbout(html2bb(aboutElem)).trim()
    let full_about = about


    //This block was basically just guessing so I disabled it

    //// get date (the first stopwatch is "last updated" date, the second is "published" date - we prefer second, but will use the first as backup)
    //const updatedElem = page.querySelectorAll(".icon-stopwatch")[0]
    //const publishedElem = page.querySelectorAll(".icon-stopwatch")[1]
    //const dateElem = publishedElem ? publishedElem : (updatedElem ? updatedElem : null)
    //let year = ""
    //if (dateElem) {
    //    const date = dateElem.parentNode.attributes["title"].value.replace(/@.*/, "")
    //    const dateObj = new Date(date)
    //    year = dateObj.getFullYear()
    //}

    //Get Date
    var moreInfoRows = page.querySelector('.game_info_panel_widget').querySelector('table').querySelector('tbody').querySelectorAll('tr');
    var releaseDate,publishDate,lastUpdateDate;
    var rowTitle;
    moreInfoRows.forEach(function(node)
    {
      rowTitle = node.querySelector('td').innerHTML;
      if(rowTitle.toLowerCase().trim() == "release date") releaseDate = node.querySelectorAll('td')[1].querySelector('abbr').title.replace(/@.*/, "");
      else if(rowTitle.toLowerCase().trim() == "published") publishDate = node.querySelectorAll('td')[1].querySelector('abbr').title.replace(/@.*/, "");
      else if(rowTitle.toLowerCase().trim() == "updated") lastUpdateDate = node.querySelectorAll('td')[1].querySelector('abbr').title.replace(/@.*/, "");
    });
    var actualYear = "";
    if(useReleaseDate && releaseDate)
    {
      var dateObj = new Date(releaseDate);
      actualYear = dateObj.getFullYear();
    }
    if(usePublished && publishDate && !actualYear)
    {
      var dateObj = new Date(publishDate);
      actualYear = dateObj.getFullYear();
    }
    if(useLastUpdated && lastUpdateDate && !actualYear)
    {
      var dateObj = new Date(lastUpdateDate);
      actualYear = dateObj.getFullYear();
    }



    // get screenshots
    const screenshotElems = page.querySelectorAll(".screenshot")
    const screenshots = []
    screenshotElems.forEach(elem => {if(!elem.parentElement.href.endsWith(".gif")) screenshots.push(elem.parentElement.href);});

    // get trailer url
    let youtubeUrl = null
    const youtubeElem = page.querySelector(".video_embed iframe")
    if (youtubeElem) {
        const youtubeEmbeddedUrl = youtubeElem.attributes["src"].value
        youtubeUrl = youtubeEmbeddedUrl.replace("youtube.com/embed/", "youtu.be/")
        youtubeUrl = youtubeUrl.replace("//", "https://")
        youtubeUrl = youtubeUrl.replace("www.", "")
    }

    // get tags
    const tags = [];
    const tagElems = page.querySelectorAll("a[href*='itch.io/games/tag-']");
    const genreElems = page.querySelectorAll("a[href*='itch.io/games/genre-']");
    tagElems.forEach(tagElem => tags.push(tagElem.innerHTML));
    genreElems.forEach(genreElem => tags.push(genreElem.innerHTML));

    // fill in screenshots
    const screens = document.getElementsByName("screens[]")
    const add_screen = $("#image_block a[href='#']").first()
    for (let i = 0; i < screenshots.length; i++) {
        if (i === 20) break
        if (i >= 4) add_screen.click()
        screens[i].value = screenshots[i]
    }

    // fill in trailer, if it was found
    if (youtubeUrl) {
        const trailerInput = document.querySelector("#trailer")
        trailerInput.value = youtubeUrl
    }

    // fill in platform as "Windows" by default
    const platformInput = document.querySelector("#platform")
    platformInput.value = "Windows"

    // fill in language (and alter the description if needed)
    const languageInput = document.querySelector("#language")
    // if there is more than one language, fill in "Multi-Language" and add list of languages to the description
    if (multiLang) {
        languageInput.value = "Multi-Language"
        full_about = fix_emptylines(about + languagesOutput)
    } else {
        const languageOptionElems = languageInput.options
        const languageOptions = []
        for (const elem of languageOptionElems) { languageOptions.push(elem.value) }
        // if there is only one language listed and it's matching available option from the form dropdown, fill in that language (and don't change the description)
        if (languageOptions.includes(languages[0])) {
            languageInput.value = languages[0]
        }
        // if there is one language but it doesn't match available options, fill in "Other" and add list of languages to the description
        else {
          languageInput.value = "Other"
          full_about = fix_emptylines(about + languagesOutput)
        }
    }

    // fill in age rating as "N/A"
    const ratingInput = document.querySelector("select[name='rating']")
    ratingInput.value = 13

    // fill in tags
    const tagsInput = document.getElementById('tags')
    var mappedTags = new Set()
    tags.forEach(tag => {
        if (tags_mapping[tag]) {
            tags_mapping[tag].forEach(mappedTag => mappedTags.add(mappedTag))
        } else if (tags_mapping[tag.toLowerCase()]) {
            tags_mapping[tag.toLowerCase()].forEach(mappedTag => mappedTags.add(mappedTag))
        }
    })
    mappedTags = removeRedundantTags(mappedTags);
    tagsInput.value = [...mappedTags].join(', ')

    // append system requirements "None available" at the end of the description
    const sr = "\n\n[quote][align=center][b][u]System Requirements[/u][/b][/align]\n None available[/quote]"
    full_about = fix_emptylines(about + sr)

    // fill in remaining fields based on version of the form
    if (window.location.href.includes("action=editgroup")) {
        $("input[name='name']").val(name)
        $("input[name='year']").val(actualYear)
        $("textarea[name='body']").val(full_about)
        $("input[name='image']").val(coverImg)
    } else {
        $("#title").val(html2bb(name))
        $("#year").val(actualYear)
        $("#album_desc").val(full_about)
        $("#image").val(coverImg)
    }
}

const titleInput = document.querySelector("#title")
titleInput.disabled = false
titleInput.insertAdjacentHTML('afterend', '<a href="javascript:;" id="fill_itchio" style="margin-left: 0.5rem">itch.io</a>')
$('#fill_itchio').click(function () {
    itchIoUrl = titleInput.value
    GM_xmlhttpRequest({
        method: "GET",
        url: itchIoUrl,
        responseType: "json",
        onload: fill_form
    })
})