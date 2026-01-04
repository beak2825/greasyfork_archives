// ==UserScript==
// @name        Quality filters - torrentgalaxy.to
// @namespace   Violentmonkey Scripts
// @match       https://torrentgalaxy.to/*
// @grant       GM_addStyle
// @version     0.31
// @run-at      document-end
// @author      https://github.com/webdevsk
// @description Feel some of the benefits of Private trackers.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/471752/Quality%20filters%20-%20torrentgalaxyto.user.js
// @updateURL https://update.greasyfork.org/scripts/471752/Quality%20filters%20-%20torrentgalaxyto.meta.js
// ==/UserScript==

// Scene release*: Orange background
// High Quality Encoders*: Yellow background
// Micro encoders*: Hidden
// XXX uploaders: Hidden

// In search result, torrents under some categories have been hidden as well.
// // Blocked Categories
//  //   SD
//  //  Episodes SD
//  //  XXX
//  //  CAM/TS
//  //  XXX - SD


// *Scene: Source WEB-DL uploads. But renames to WEBRip for some reason.
// *High Quality Encoders: Rips in almost close to Blu-ray/WEB-DL source.
// *Micro encoders: Very tiny file size which greatly impacts quality.

// Why not JS?         With JS I would have to take page-load, async functions into account.

// Torrent links ENDING with these strings
// TGx] translates to TGx- in their urls
const blockAdultContent = true

const scene = [
  'TGx-',
  'FLUX',
  'CMRG',
  'Ntb',
  'TheBiscuitMan',
  'AOC',
  // Remux
  'E-N-D',
  'NAHOM',
  'MassModz',
  'SGF'
]

const notScene = [
    'MeGusta-TGx-'
]

// Torrent links ENDING with these strings
const quality = [
  'QxR-',
  'FGT',
  'FraMeSToR',
  'Prof-',
  'Vyndros-'
]

// uploader profile href="/profile/EACH_STRING"
// for landing page
const blocked = !blockAdultContent ? [] : [
  'TheDarkRider',
  'GalaxyRG',
  'Pornbits',
  'NoisyBoY',
  'sbudennogo',
  'GalaXXXy',
  'Pornlake',
  'XLeech'
]

const blockedCategory = {
  'Movies - SD'       : 1,
  'TV - Episodes SD'  : 5,
  'Movies - CAM/TS'   : 45,
}

if (blockAdultContent) {
  Object.assign(blockedCategory, {
  'XXX - Misc'        : 47,
  'XXX - HD'          : 35,
  'XXX - 4K UHD'      : 48,
  'XXX - SD'          : 34
  })
}

const populate = value => `[href*="${value}"]`

const dimensions = {
  [populate('-2160p-')] : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEyUlEQVR4nO1ZSU9bVxh9q3TTn5FKLaJpkzZNSRpbZACDMQ4GM4OZE+IEyAQJiCEMZkrIppt2FambLtp102UjddWSKgOtmqRBDPaCN/nZCQUPnOrea/sZ7JBn1cZG8iddifv08Dvn3vOd77vvcVw2spGNbGQjGQED9x503Az0nAt6Dhk6XNBz08jhDsQS0HEzm/nvQyj4AGuFH2XkEAoOgmCEnpuKJaDnXOSGdINc00ACes4Zj0Dawa1pHATr/iRgyAVfdEgbAd/CI4TD92x+z8H6tj3/EfjiI+BLjoI3famNwM7Yc5nsCKH0BASzDkJZ/j4gYPg45vmC5TTEikKIlUUaJfRsPvLPvqe/7xl4vugT8Maj8C88jjzf/+dTiFVGiDVmiHWWTE3iHPDFn4IvOQah9CSEslNsxQnwWjPE+nJIjVWQmmozkUAO+OLDNEGpzsvPUKmINaUMuK0KUnMdpFYbpI6WzCPAh8Gf00MoPxta9XOQGqyQmmtDwFshXzgP2X4xNTb65ruv2c1bW9uuh0PubaJzwXocQVmk1zZ++UmVjTkKfF0Z/M//VnPgxQvIdjvkri64r1xJvguJbUZs+TY1Edh4+IDOA65l8OV54Eu+UGUTAi/ZqmOeT4C7b9yA++bNJBMoyoXvr8fwLz6n4HcjoIzYQ0vqh9xTC974OYTSr5hFVhaHwFdBam2MJdDXB/fAAJShoeTaqPebKQra3d++6w4o490ISgL92/vtDNW9YMqjhUm0GqjTSI2VkFoaIHe0wf/ypSqhxUUog4NQbt+GMjGRvCQWG89ga/0N/n3wI92J3QgElv9hi/HkN6wVHaJtgWDWQawogFhtgthQAam5niXrxU7I3d1MMv39UIaHoYyNQZmchGd2NkkEDDnYnP8VQYkHX37snQTCO7rl9UBsKoZgOg7BciokHQukphpIbU2QOy+wZL1+He5btxj48XEo09Pw3L0Lz717ySHgHupkK7vyiibmxsOfI2DJXLSd3UbAPdCOwBKThW/hDwiWfLb6NaVMOq0NkM+3Q750Ce6rV2myEr0T8B4Cfm6OgtdM4F02qox2USeJHhG5uJYhdZhikljurgaCQTpf//5+1OrXQmpvZtLp6YG7txeBpSX191ZXI+A1E9DsQlFupMVG13+4H7nPM9bPilVLaPUvX4b72jWq+50RBu9NKwFDLoSyEwgsvaLXgqIA2d6maj+0+u7BwbgEvIkQSEk3StyHtAzEOkmvU2dhrQJxHrudaZ8k7sgIAisr2yTkTZRAKgZpG5j7nGZVt6ECUku9Kh/iPKRYjY4y14nSfYYQOMxOVqRtqDZBarTSqkubNGKdIflQ55mdjQs+vQSMR1jrQJq2sH222VT99/Ux65yYgOfOnfgE5ubSd6jnjZ9BMJ9U/d9WFUrgTpUAKVwOBwJOp5oDTmeEwGutBBJ2oYQJmFUCYf8nxStEYGdkIIHdd+B/E0iFjSaSA4HV1fg2qpXAnrhQw35zIVoH8lJWB1wpfzudQCVWHI5I+xxN4LVj+K1vp6fY94GDqX05Sw8yeojWQnYKs1WrvRA5xIRlNDYGz8zMtl0g4APWDwEd54glkMMdoF8/9JwzA77E4C3DCR03GfcLTTaykY1scOmI/wCm++g56wN58AAAAABJRU5ErkJggg==",
  [populate('-1080p-')] : "data:image/png;base64,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",
  [populate('-720p-')]  : "data:image/png;base64,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",
}

// icon sources
// 4k: https://icons8.com/icon/Xtjk5RoPkiIS/4k
// 1080p: https://icons8.com/icon/VhSBJNE2qUmZ/hd-1080p
// 720p : https://icons8.com/icon/flSq0SlAbE2e/hd-720p


const sceneTemplates = scene.map(s => `[href$="${s}"]`).join(" ,")
const notSceneTemplates = notScene.map(ns => `[href$="${ns}"]`).join(" ,")
const qualityTemplates = quality.map(q => `[href$="${q}"]`).join(" ,")
const blockedTemplates = blocked.map(b => `[href="/profile/${b}"]`).join(" ,")
const categoryTemplates = Object.values(blockedCategory).map(cat => `[href="/torrents.php?cat=${cat}"]`).join(" ,")

console.log(Object.keys(dimensions))


GM_addStyle(`
/*-----------------------   Scene   -----------------------*/
.tgxtable .tgxtablerow:has( :is(${ sceneTemplates }):not(:is(${ notSceneTemplates })) ){
    --_background: #ffd700;
    background: var(--_background);
    color: #1b1b1b;
}


.tgxtable .tgxtablerow:has( :is(${ sceneTemplates }):not(:is(${ notSceneTemplates }))) .tgxtablecell{
  border-bottom: 1px solid #333;
}

.tgxtable .tgxtablerow:has( :is(${ sceneTemplates }):not(:is(${ notSceneTemplates }))) a:not([title="comments"]){
  color: #1b1b1b;
  text-shadow: none;
}

/*-----------------------   Quality Rippers   -----------------------*/
.tgxtable .tgxtablerow:has( :is(${ qualityTemplates })){
  --_background: #f2970e;
  background: var(--_background);
  color: #1b1b1b;
}


.tgxtable .tgxtablerow:has( :is(${ qualityTemplates })) .tgxtablecell{
  border-bottom: 1px solid #333;
}

.tgxtable .tgxtablerow:has( :is(${ qualityTemplates })) a:not([title="comments"]){
  color: #1b1b1b;
  text-shadow: none;
}

/*-----------------------       Blocked         -----------------------*/
.tgxtable .tgxtablerow:has( :is(${ blockedTemplates })){
  display: none;
}

/*-----------------------       Block by Category        -----------------------*/

.tgxtable .tgxtablerow:has( :is(${ categoryTemplates })){
  display: none;
}

/*-----------------------   Video dimensions   -----------------------*/

.tgxtable .tgxtablerow:has( :is(${ sceneTemplates }, ${ qualityTemplates }) ) .tgxtablecell:first-child{
  position: relative;
}

.tgxtable .tgxtablerow:has( :is(${ sceneTemplates}, ${ qualityTemplates }) ) .tgxtablecell:first-child::after{
    content: "";
    position: absolute;
    border-radius: inherit;
    inset: 0;
    background: var(--_background);
    background-size: 48px;
    background-position: center;
    background-repeat: no-repeat;
}

`)

Object.entries(dimensions).map(( [key, value] ) => {
  GM_addStyle(`.tgxtable .tgxtablerow:has( :is(${ sceneTemplates}, ${ qualityTemplates })${ key }:not(:is(${ notSceneTemplates })) ) .tgxtablecell:first-child::after{
    background-image: url(${value});
  }`)
})
