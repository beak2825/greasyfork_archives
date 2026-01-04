// ==UserScript==
// @name        Remove Bot Comments
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/watch
// @grant       none
// @version     1.1
// @author      tikhiy
// @description 10/15/2022, 1:36:23 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453093/Remove%20Bot%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/453093/Remove%20Bot%20Comments.meta.js
// ==/UserScript==

const THRESHOLD = 0.9

const AUTHORS = [
  `DONT READ MY PROFILE PICTURE`,
  `Kavetion`,
  `Savetion Xi`,
  `YeaMan`,
  `F?СК МЕ. ТАР 0N MY РIС`,
  `yuno hati`,
  `I’m subbing to everyone who subs to me`,
  `Mason`,
  `Don't Read Profile Photo`,
  `Woody Perfect`,
  `[redacted]`,
  `johnny1893`,
  `Mod M`,
  `Sleve McDichael`
]

const CONTENTS = [
  `I actually just made a script that removes this person and a few others from comment section. It works with Violentmonkey BETA extension. You should search Remove Bot Comments by TokyoRose on the Find scripts page`,
  `DONT READ MY USERNAME!`,
  `I’m better than Penguinz0`,
  `[Stop right there!!] Please ignore any bait replies such as "I'm better" "read my name" or anything that's offensive because they only want your attention. If you ignore them and not give them any views or attention then they will get bored and stop.`,
  `The music on my paige is better than charlie lol.`,
  `Pls,  rate my english in my last video, wanna some feedback from natives, im ukrainian and i dont have people around that can assess me`,
  `Whoever's reading this, I hope that whatever you're going through gets better and whatever you're struggling or worrying about will be fine and that everyone has a fantastic day! Amen`,
  `Dont_Read_My_Names`,
  `bro that's exactly how i feel istg girl called me a N-word and immediately regretted it vid on my chnnl`,
  `I know right?? Lmaoooo hilarious tbh`,
  `I meet PENGUINZ0 yesterday he shouted and did not agree to take a Picture with me! He should be banned!!!! Loved the comment`
]

const normalize = (() => {
    const VARIANTS = {
        0: /[߀]/g,
        " ": /[ ]/g,
        a: /[4ÀÁÂÃÄÅàáâãäåĀāĂăĄąǍǎǞǟǺǻȀȁȂȃȺɑАаḀḁẚẠạẢảẤấẦầẨẩẪẫẬậẮắẰằẲẳẴẵẶặⒶⓐⱥⱯＡａ]/g,
        aa: /[Ꜳꜳ]/g,
        ae: /[ÆæǢǣǼǽ]/g,
        ao: /[Ꜵꜵ]/g,
        au: /[Ꜷꜷ]/g,
        av: /[ꜸꜹꜺꜻ]/g,
        ay: /[Ꜽꜽ]/g,
        b: /[ƀƁƂƃɃɓБВбḄḅḆḇⒷⓑＢｂ]/g,
        c: /[CÇçĆćĈĉČčƇƈȻȼСсḈḉↄⒸⓒꜾꜿＣｃ]/g,
        d: /[ĎďĐđƉƊƋƌɖɗԁᏧᴅḌḍḎḏḐḑḒḓⒹⓓꞪＤｄ]/g,
        dz: /[ǅǆǲǳ]/g,
        e: /[ÈÉÊËèéêëĒēĔĕĘęĚěƎƐǝȄȅȆȇȨȩɇɛЕеᴇḔḕḖḗḘḙḚḛḜḝẸẹẺẻẼẽẾếỀềỂểỄễỆệⒺⓔＥｅ]/g,
        f: /[ƑƒⒻⓕꝻꝼＦｆ]/g,
        ff: /[ﬀ]/g,
        ffi: /[ﬃ]/g,
        ffl: /[ﬄ]/g,
        fi: /[ﬁ]/g,
        fl: /[ﬂ]/g,
        g: /[ĜĝĞğĢģƓǤǥǦǧǴǵɠɢᵹḠḡⒼⓖꝽꝾꝿꞠꞡＧｇ]/g,
        h: /[ĤĥĦħȞȟɥНнḤḥḦḧḨḩḪḫẖⒽⓗⱧⱨⱵⱶꞍＨｈ]/g,
        hv: /[ƕ]/g,
        i: /[ÌÍÎÏìíîïĨĩĪīĬĭĮįıƗǏǐȈȉȊȋɨḬḭḮḯỈỉỊịⒾⓘＩｉ]/g,
        j: /[ĴĵǰȷɈɉⒿⓙＪｊ]/g,
        k: /[ĶķƘƙǨǩКкḰḱḲḳḴḵⓀⓚⱩⱪꝀꝁꝂꝃꝄꝅꞢꞣＫｋ]/g,
        l: /[ĹĺĻļĽľĿŀŁłƚȽɫɭḶḷḸḹḺḻḼḽⓁⓛⱠⱡⱢꝆꝇꝈꝉꞀꞁＬｌ]/g,
        lj: /[ǈǉ]/g,
        m: /[ƜɯɱϻМмḾḿṂṃⓂⓜⱮＭｍ]/g,
        n: /[ÑñŃńŅņŇňŉƝƞǸǹȠɲИилԉᴎṆṇṈṉṊṋⓃⓝꞐꞑꞤꞥＮｎ]/g,
        nj: /[ǋǌ]/g,
        o: /[ÒÓÔÕÖØòóôõöøŌōŎŏŐőƆƟƠơǑǒǪǫǬǭǾǿȌȍȎȏȪȫȬȭɔɵОо߀ᴑṌṍṎṏṐṑṒṓỌọỎỏỐốỒồỔổỖỗỘộỚớỜờỞởỠỡỢợⓄⓞꝊꝋꝌꝍＯｏ]/g,
        oe: /[Œœ]/g,
        oi: /[Ƣƣ]/g,
        oo: /[Ꝏꝏ]/g,
        ou: /[Ȣȣ]/g,
        p: /[ƤƥρРрᵽṔṕⓅⓟⱣꝐꝑꝒꝓꝔꝕＰｐ]/g,
        q: /[ɊɋⓆⓠꝖꝗꝘꝙＱｑ]/g,
        r: /[ŔŕŖŗŘřȐȑȒȓɌɍɽГЯгяṚṛṜṝṞṟⓇⓡⱤꝚꝛꞂꞃꞦꞧＲｒ]/g,
        s: /[ŚśŜŝŞşŠšȘșȿʂṢṣẞⓈⓢⱾꞄꞅꞨꞩＳｓ]/g,
        t: /[ŢţŤťŦŧƬƭƮȚțȾʈТтṬṭṮṯṰṱẗⓉⓣⱦꞆꞇＴｔ]/g,
        th: /[Þþ]/g,
        tz: /[Ꜩꜩ]/g,
        u: /[ÙÚÛÜùúûüŨũŪūŬŭŮůŰűŲųƯưǓǔǕǖǗǘǙǚǛǜȔȕȖȗɄʉПпṲṳṴṵṶṷṸṹṺṻỤụỦủỨứỪừỬửỮữỰựⓊⓤＵｕ]/g,
        v: /[ƲɅʋʌṼṽṾṿⓋⓥꝞꝟＶｖ]/g,
        vy: /[Ꝡꝡ]/g,
        w: /[ŴŵẀẁẂẃẄẅẈẉẘⓌⓦⱲⱳＷｗ]/g,
        x: /[ХхẌẍⓍⓧＸｘ]/g,
        y: /[ÝýÿŶŷŸƳƴȲȳɎɏУуẙỲỳỴỵỶỷỸỹỾỿⓎⓨＹｙ]/g,
        z: /[ŹźŽžƵƶȤȥɀẐẑẒẓẔẕⓏⓩⱫⱬⱿꝢꝣＺｚ]/g,
    }

    const VARIANTS_ENTRIES = Object.entries(VARIANTS)

    return (string) => {
        return VARIANTS_ENTRIES.reduce((result, [k, regex]) => {
            return result.replace(regex, k)
        }, string.toLowerCase())
    }
})()

const letters = (() => {
  const LETTERS = /[a-z]+/g

  return (string) => {
    return string.match(LETTERS).join("")
  }
})()

const compare = (a, b) => {
	if (a === b) {
    return 1
  }

	if (a.length < 2 || b.length < 2) {
    return 0
  }

	const bigrams = new Map()

	for (let i = 0; i < a.length - 1; i++) {
		const bigram = a.substring(i, i + 2)

		const count = bigrams.has(bigram)
			? bigrams.get(bigram) + 1
			: 1

		bigrams.set(bigram, count)
	};

	let intersection = 0

	for (let i = 0; i < b.length - 1; i++) {
		const bigram = b.substring(i, i + 2)

		const count = bigrams.has(bigram)
			? bigrams.get(bigram)
			: 0

		if (count > 0) {
			bigrams.set(bigram, count - 1)
			intersection++
		}
	}

	return (2 * intersection) / (a.length + b.length - 2)
}

const hasSimilar = (() => {
  function callback(sample) {
    return compare(sample, this) > THRESHOLD
  }

  return (array, value) => {
    return array.some(callback, value)
  }
})()

const AUTHORS_NORMALIZED = AUTHORS.map(normalize)
const AUTHORS_LETTERS = AUTHORS_NORMALIZED.map(letters)

const CONTENTS_NORMALIZED = CONTENTS.map(normalize)
const CONTENTS_LETTERS = CONTENTS_NORMALIZED.map(letters)

const observer = new MutationObserver((mutations, observer) => {
  const comments = new Set()

  for (const mutation of mutations) {
    if (!mutation.addedNodes.length) {
      continue
    }

    if (mutation.target.nodeName !== "YT-ICON") {
      continue
    }

    const closest = mutation.target.closest("ytd-comment-renderer")

    if (closest) {
      comments.add(closest)
    }
  }

  if (!comments.size) {
    return
  }

  for (const comment of comments) {
    const author = letters(normalize(comment.querySelector("#author-text").textContent))

    if (hasSimilar(AUTHORS_LETTERS, author)) {
      comment.remove()
    }

    const content = letters(normalize(comment.querySelector("#content-text").textContent))

    if (hasSimilar(CONTENTS_LETTERS, content)) {
      comment.remove()
    }
  }
})

const getTarget = (callback) => {
  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      const target = callback()

      if (target) {
        observer.disconnect()
        resolve(target)
      }
    })

    observer.observe(document.querySelector("ytd-app"), { childList: true, subtree: true })
  })
}

getTarget(() => document.querySelector("#below ytd-item-section-renderer #contents")).then((contents) => {
  observer.observe(contents, { childList: true, subtree: true })
})
