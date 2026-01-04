// ==UserScript==
// @name        character-leecher
// @namespace   Morimasa
// @match       https://myanimelist.net/*/characters
// @match       https://anilist.co/*
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @version     0.3
// @author      Morimasa
// @description 7/4/2020, 3:43:14 PM
// @downloadURL https://update.greasyfork.org/scripts/406551/character-leecher.user.js
// @updateURL https://update.greasyfork.org/scripts/406551/character-leecher.meta.js
// ==/UserScript==
const storage = {
  async set(key, value) {
    GM_setValue(key, value)
  },

  async get(key){
    const value = GM_getValue(key)
    return value
  }
}


if (window.location.hostname == "anilist.co") {
  storage.set("al_token", window.al_token).then(() => "al_token refreshed for character-copier")
}
else if(window.location.hostname == "myanimelist.net") {
  const addButtons = [...document.querySelectorAll(".borderClass > a[href^='https://myanimelist.net/character/']")]
  .map(e => e.parentNode)
  .map(addButton)

  const AddAllButton = document.createElement("button")
  AddAllButton.innerText = "Copy all characters"
  AddAllButton.addEventListener("click", () => {
    if (!confirm("add all characters from this entry?")) return
    alert("close this and wait on the page until all of the chars are added")
    addButtons.forEach((e, i) => setTimeout(() => e.click(), i*500))
  })
  document.querySelector(".js-scrollfix-bottom-rel h2").append(AddAllButton)

  function addButton(el) {
    let e = document.createElement("button")
    e.innerText = "Copy to AL"
    e.addEventListener("click", _ => handleEntry(el))
    el.append(e)
    return e
  }

  function handleEntry(entry) {
    const extractID = url => parseInt(url.split("/")[4])
    let char_id = extractID(entry.childNodes[1].href)
    let role = entry.childNodes[3].innerText.toUpperCase()
    let mal_media_id = parseInt(window.location.pathname.split("/")[2])
    let media_type = window.location.pathname.split("/")[1].toUpperCase()
    let VA = null
    try {
      VA = extractID(entry.parentNode.children[2].querySelector("a").href)
    }
    catch{
      console.log(char_id, "No VA")
    }

    let char = new Character(char_id)
    char.get()
      .then(vars => anilist.createChar(vars))
      .then(char_id => anilist.addCharToMedia(char_id, mal_media_id, media_type, role, VA))
      .then(console.log)
      .catch(err => alert(`There was an error adding the character \n\n ${err}`))
  }
}




class Character {
  constructor(char_id) {
    this.char_id = char_id
  }
  
  async get() {
    let entry = await request(`https://api.jikan.moe/v3/character/${this.char_id}`)
    return this.makeVars(entry)
  }
  
  async makeVars(e) {
    const parseName = name => {
      let names = name.split(" ")
      if (names.length === 2) return names
      else return [name, null]
    }
    const cleanAbout = about => about
      .replace(/\r/g, "")
      .replace(/\\n/g, "")
      .replace(/\t/g, "")
      .replace("No voice actors have been added to this character. Help improve our database by searching for a voice actor, and adding this character to their roles .", "")
      .replace("No biography written.", "")
      
    const blobToBase64 = blob => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      return new Promise(resolve => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });
    };
    let [first, last] = parseName(e.name)
    let variables = {
      name: {
        first,
        last,
        native: e.name_kanji ? e.name_kanji.replace(" ", "") : null,
        alternative: e.nicknames
      },
      description: cleanAbout(e.about),
      image: e.image_url == "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png" ? null : await request(e.image_url, {resp: "blob"}).then(blobToBase64)
    }
    if (variables.description == "\n") variables.description = ""
    return variables
  }
  
}

/// utils functions
async function request(url, options={}) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      url,
      method: options.method || "GET",
      headers: options.headers,
      responseType: options.resp || "json",
      data: options.data,
      onload: res => {
        resolve(res.response)
      },
      onerror: reject
    })
  })
}

async function getAnilistId(mal_id, type) {
  const query = "query ($mal: Int, $type: MediaType) {Media(idMal: $mal, type: $type) {id}}"
  let resp = await request("https://graphql.anilist.co", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    data: JSON.stringify({query, variables: {mal: mal_id, type}})
  })
  return resp.data.Media.id
}

const anilist = {
  async createChar(variables) {
    if (variables.name.first.toLowerCase() == "narrator") return 36309
    
    const query = "mutation($name:CharacterNameInput $image:String $description:String){SaveCharacter(name:$name image:$image description:$description){id}}"
    let resp = await SendAuthAL(query, variables)
    return resp.data.SaveCharacter.id
  },
  async addCharToMedia(id, mal_media_id, media_type, role, VA_id) {
    const query = "mutation($id:Int $mediaId:Int $characterId:Int $voiceActorId:Int $role:CharacterRole $parentId:Int){SaveMediaCharacter(id:$id mediaId:$mediaId characterId:$characterId voiceActorId:$voiceActorId role:$role parentId:$parentId)}"
    let media_id = await getAnilistId(mal_media_id, media_type)
    let variables = {
      characterId: id,
		  mediaId: media_id,
		  role: role
    }
    if (VA_id && VA_id < 23386) variables.voiceActorId = VA_id + 95000
    let resp = await SendAuthAL(query, variables)
    return resp.data.SaveMediaCharacter
  }
}

async function SendAuthAL(query, variables) {
  console.log(variables)
  const token = await getToken()
  return request("https://anilist.co/graphql", {
    method: "POST",
    headers: {Origin: "https://anilist.co", "Content-Type": "application/json", "schema": "internal", "x-csrf-token": token},
    data: JSON.stringify({query, variables})
  })
}

async function getToken() {
  return storage.get("al_token")
}

