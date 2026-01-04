// ==UserScript==
// @name         Newspaper (Syndication Feed Reader)
// @namespace    i2p.schimon.newspaper
// @description  This software renders syndication feeds as XHTML; It supports Atom Activity Streams (Friendica, Nostr, OStatus), Atom Over XMPP (Blasta, Libervia, Movim, Rivista), BitTorrent RSS, JSON Feed, OPML, RDF (DOAP, FOAF, RSS, XMPP), RSS-in-JSON, Simple Machines Forum (SMF), Sitemap, The Atom Syndication Format, and Twtxt; and it also supports navigation (RFC 5005).
// @tag          rss
// @author       Schimon Jehudah
// @collaborator CY Fung
// @collaborator hacker09
// @collaborator NotYou
// @homepageURL  https://schapps.woodpeckersnest.eu/newspaper/
// @supportURL   https://greasyfork.org/scripts/465932-newspaper/feedback
// @copyright    2023 - 2025, Schimon Jehudah (http://schimon.i2p)
// @license      MIT; https://opensource.org/licenses/MIT
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB5PSIuOWVtIiBmb250LXNpemU9IjkwIj7wn5OwPC90ZXh0Pjwvc3ZnPgo=
// @match        file:///*
// @match        *://*/*
// @noframes
// @exclude      *?streamburner=0*
// @exclude      *&streamburner=0*
// @version      26.01.09
// @resource     atom.svg https://upload.wikimedia.org/wikipedia/commons/0/07/Application_atom%2Bxml.svg#md5=16cf76b471caddb6021d522044a5018e
// @resource     feed.svg https://upload.wikimedia.org/wikipedia/en/4/43/Feed-icon.svg#md5=adac2c035e465a4057b7a77c5ccf40b8
// @resource     xmpp.svg https://upload.wikimedia.org/wikipedia/commons/9/95/XMPP_logo.svg#md5=8f0c633975f0ce545260974cf64e3403
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM.getResourceUrl
// @grant        GM.getValue
// @grant        GM.notification
// @grant        GM.registerMenuCommand
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/465932/Newspaper%20%28Syndication%20Feed%20Reader%29.user.js
// @updateURL https://update.greasyfork.org/scripts/465932/Newspaper%20%28Syndication%20Feed%20Reader%29.meta.js
// ==/UserScript==

//"use strict";

/*

TODO

Tasks

* Formats - XSPF, JSPF, Json Activity Streams.

* Follow as a "drop-down" menu.

* Next and Previous to be at the edges.

* Navigation bar to be at the side.

* Create an additional funtion to render documents as tables (DOAP, FOAF, RDF, and Sitemap)

* Support filtering by authors, contributors, and categories.

* Support loading of comments (wfw:commentRss and atom:link rel="replies").

* Advertisement filtering

* Subtitle as an entry.

* * Place Subtitles under About title which will be placed at the bottom of the page
    May include feed icon too
    See https://forums.ubports.com/topic/3257.rss

* * Turn subtitle (top) to about (bottom)
    https://ethresear.ch/t/design-idea-to-solve-the-scalability-problem-of-a-decentralized-social-media-platform/10523.rss

* Check and analyze content type of a clicked link, render it at the given document, and change URL.
  Forced to be downloaded https://ffmpeg.org/main.rss

* Consider RDF features

<textinput>
<title>Search this site:</title>
<description>Find:</description>
<name>q</name>
<link>http://internet.i2p/search</link>
</textinput>
<skiphours>
<hour>24</hour>
</skiphours>

NOTE

https://timburton.com/news?format=json
https://pentagon-mushroom-xbey.squarespace.com/news?format=json
https://mirrors.tuna.tsinghua.edu.cn/feed.xml
https://wiki.gnome.org/action/rss_rc/Home?action=rss_rc&unique=1&ddiffs=1
https://web.resource.org/rss/1.0/schema.rdf

This appears to be a not usuable Atom feed
https://dbpedia.org/data/Searx.atom

EPUB (documentation) and CSS as files
https://wiki.greasespot.net/Metadata_Block#.40resource
https://wiki.greasespot.net/GM.getResourceUrl

*/

const namespace = "i2p.schimon.newspaper",
      domParser = new DOMParser(),
      xmlSerializer = new XMLSerializer(),
      xmlns = {
        "access"          : "http://www.bloglines.com/about/specs/fac-1.0",
        "activity"        : "http://activitystrea.ms/spec/1.0/",
        "admin"           : "http://webns.net/mvcb/",
        "atom"            : "http://www.w3.org/2005/Atom",
        "atom03"          : "http://purl.org/atom/ns#",
        "atommedia"       : "http://purl.org/syndication/atommedia",
        "atompub"         : "http://purl.org/atompub/tombstones/1.0",
        "atomsub"         : "urn:xmpp:microblog:0",
        "blogChannel"     : "http://backend.userland.com/blogChannelModule",
        "c"               : "http://s.opencalais.com/1/pred/",
        "cc"              : "http://web.resource.org/cc/",
        "content"         : "http://purl.org/rss/1.0/modules/content/",
        "creativeCommons" : "http://backend.userland.com/creativeCommonsRssModule",
        "dbo"             : "http://dbpedia.org/ontology/",
        "dbp"             : "http://dbpedia.org/property/",
        "dc"              : "http://purl.org/dc/elements/1.1/",
        "dct"             : "http://purl.org/dc/terms/",
        "dcterms"         : "http://purl.org/dc/terms/", // dcterms:modified (ikiwiki)
        "dfrn"            : "http://purl.org/macgirvin/dfrn/1.0",
        "discourse"       : "http://www.discourse.org/",
        "doap"            : "http://usefulinc.com/ns/doap#",
        "docbook"         : "http://docbook.org/ns/docbook",
        "dpawson"         : "http://www.dpawson.co.uk/ns#",
        "dt"              : "http://xsltsl.org/date-time",
        "ecommerce"       : "http://shopping.discovery.com/erss",
        "enc"             : "http://purl.oclc.org/net/rss_2.0/enc#",
        "exsl"            : "http://exslt.org/common",
        "feedburner"      : "http://rssnamespace.org/feedburner/ext/1.0",
        "fh"              : "http://purl.org/syndication/history/1.0",
        "foaf"            : "http://xmlns.com/foaf/0.1/",
        "geo"             : "http://www.w3.org/2003/01/geo/wgs84_pos#",
        "georss"          : "http://www.georss.org/georss",
        "gml"             : "http://www.opengis.net/gml",
        "icbm"            : "http://postneo.com/icbm",
        "icra"            : "http://www.icra.org/rdfs/vocabularyv03#",
        "itunes"          : "http://www.itunes.com/dtds/podcast-1.0.dtd",
        "jsonx"           : "http://www.ibm.com/xmlns/prod/2009/jsonx",
        "label"           : "http://www.w3.org/2004/12/q/contentlabel#",
        "media-rss"       : "http://www.rssboard.org/media-rss",
        "metalink"        : "http://www.metalinker.org/",
        "metalink4"       : "urn:ietf:params:xml:ns:metalink",
        "microsummaries"  : "http://www.mozilla.org/microsummaries/0.1",
        "mrss"            : "http://search.yahoo.com/mrss/",
        "osd"             : "http://a9.com/-/spec/opensearch/1.1/",
        "ostatus"         : "http://ostatus.org/schema/1.0",
        "owl"             : "http://www.w3.org/2002/07/owl#",
        "pingback"        : "http://madskills.com/public/xml/rss/module/pingback/",
        "poco"            : "http://portablecontacts.net/spec/1.0",
        "podcast"         : "https://podcastindex.org/namespace/1.0",
        "prov"            : "http://www.w3.org/ns/prov#",
        "psc"             : "http://podlove.org/simple-chapters",
        "pubsub"          : "http://jabber.org/protocol/pubsub",
        "rawvoice"        : "https://blubrry.com/developer/rawvoice-rss/",
        "rdf"             : "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        "rdfs"            : "http://www.w3.org/2000/01/rdf-schema#",
        "re"              : "http://purl.org/atompub/rank/1.0",
        "rsd"             : "http://archipelago.phrasewise.com/rsd",
        "rss"             : "http://purl.org/rss/1.0/",
        "rss09"           : "http://my.netscape.com/rdf/simple/0.9/",
        "rss10"           : "https://web.resource.org/rss/1.0/",
        "schema"          : "https://schema.org/",
        "sioc"            : "http://rdfs.org/sioc/ns#",
        "sioct"           : "http://rdfs.org/sioc/types#",
        "sitemap"         : "http://www.sitemaps.org/schemas/sitemap/0.9",
        "skos"            : "http://www.w3.org/2004/02/skos/core#",
        "slash"           : "http://purl.org/rss/1.0/modules/slash/",
        "smf"             : "http://www.simplemachines.org/",
        "smr"             : "http://www.simplemachines.org/xml/recent",
        "ss"              : "http://purl.org/rss/1.0/modules/servicestatus/",
        "statusnet"       : "http://status.net/schema/api/1/",
        "sy"              : "http://purl.org/rss/1.0/modules/syndication/",
        "taxo"            : "http://purl.org/rss/1.0/modules/taxonomy/",
        "thr"             : "http://purl.org/syndication/thread/1.0",
        "tf"              : "urn:schapps:params:xml:ns:focus",
        "torrent"         : "http://xmlns.ezrss.it/0.1/",
        "trackback"       : "http://madskills.com/public/xml/rss/module/trackback/",
        "vlc"             : "http://www.videolan.org/vlc/playlist/ns/0/",
        "webfeeds"        : "http://webfeeds.org/rss/1.0",
        "wfw"             : "http://wellformedweb.org/CommentAPI/",
        "x"               : "jabber:x:data",
        "xhtml"           : "http://www.w3.org/1999/xhtml",
        "xlink"           : "http://www.w3.org/1999/xlink",
        "xsd"             : "http://www.w3.org/2001/XMLSchema#",
        "xspf"            : "http://xspf.org/ns/0/",
        "xmpp"            : "https://linkmauve.fr/ns/xmpp-doap#",
        "xsi"             : "http://www.w3.org/2001/XMLSchema-instance",
        "xsl"             : "http://www.w3.org/1999/XSL/Transform",
        "xul"             : "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
        "xup"             : "http://www.w3.org/2002/03/xup"
      },
      defaultTitle = "StreamBurner",
      // This news feed is brought to you by StreamBurner News Reader
      defaultSubtitle = "Syndicated document feed rendered with StreamBurner",
      defaultAbout = "No description was provided.",
      rtlLocales = ["ar", "fa", "he", "ji", "ku", "ur", "yi"],
      svgGraphics = '<?xml version="1.0"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="128px" height="128px" viewBox="0 0 256 256"><defs><linearGradient x1="0.085" y1="0.085" x2="0.915" y2="0.915" id="syndication"><stop  offset="0.0" stop-color="#E3702D"/><stop  offset="0.1071" stop-color="#EA7D31"/><stop  offset="0.3503" stop-color="#F69537"/><stop  offset="0.5" stop-color="#FB9E3A"/><stop  offset="0.7016" stop-color="#EA7C31"/><stop  offset="0.8866" stop-color="#DE642B"/><stop  offset="1.0" stop-color="#D95B29"/></linearGradient></defs><rect width="256" height="256" rx="55" ry="55" x="0"  y="0"  fill="#CC5D15"/><rect width="246" height="246" rx="50" ry="50" x="5"  y="5"  fill="#F49C52"/><rect width="236" height="236" rx="47" ry="47" x="10" y="10" fill="url(#syndication)"/><circle cx="68" cy="189" r="24" fill="#FFF"/><path d="M160 213h-34a82 82 0 0 0 -82 -82v-34a116 116 0 0 1 116 116z" fill="#FFF"/><path d="M184 213A140 140 0 0 0 44 73 V 38a175 175 0 0 1 175 175z" fill="#FFF"/></svg>',
  banner = `<svg width="256" height="100" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient x1="77.1180071%" y1="12.3268731%" x2="3.36110907%" y2="118.781335%" id="a"><stop stop-color="#D446FF" offset="0%"/><stop stop-color="#A0D8FF" offset="100%"/></linearGradient><linearGradient x1="50.7818321%" y1="-17.173918%" x2="76.3448843%" y2="77.2144178%" id="b"><stop stop-color="#3C3C3C" offset="0%"/><stop stop-color="#191919" offset="100%"/></linearGradient><linearGradient x1="148.794275%" y1="-26.5643443%" x2="-21.1415871%" y2="99.3029307%" id="c"><stop stop-color="#D446FF" offset="0%"/><stop stop-color="#A0D8FF" offset="100%"/></linearGradient><linearGradient x1="41.8083357%" y1="20.866645%" x2="95.5956597%" y2="-8.31097281%" id="d"><stop stop-color="#FFF" offset="0%"/><stop stop-color="#DADADA" offset="100%"/></linearGradient><linearGradient x1="52.2801818%" y1="70.5577815%" x2="2.53678786%" y2="8.97706744%" id="e"><stop stop-color="#FFF" offset="0%"/><stop stop-color="#DADADA" offset="100%"/></linearGradient><linearGradient x1="98.684398%" y1="12.9995489%" x2="35.2678133%" y2="40.863838%" id="f"><stop stop-color="#D0D0D0" offset="0%"/><stop stop-color="#FFF" offset="100%"/></linearGradient><linearGradient x1="34.2841787%" y1="31.6476155%" x2="-40.2132134%" y2="123.398162%" id="g"><stop stop-color="#FFDC68" offset="0%"/><stop stop-color="#CE4300" offset="100%"/></linearGradient><linearGradient x1="95.7086811%" y1="2.33776624%" x2="-10.5474304%" y2="34.7418529%" id="h"><stop stop-color="#FFDC68" offset="0%"/><stop stop-color="#CE4300" offset="100%"/></linearGradient><linearGradient x1="55.2222258%" y1="39.6484627%" x2="-63.5655829%" y2="222.055577%" id="i"><stop stop-color="#FFDC68" offset="0%"/><stop stop-color="#CE4300" offset="100%"/></linearGradient></defs><g fill="none" fill-rule="evenodd"><path fill="#252525" fill-rule="nonzero" d="M68.3766216 33.24450169V46.6414437h17.1215335v4.3309176H68.3766216v18.9693703h-4.9083597V28.91359256h23.7622535v4.33090913H68.3766216zm31.2822046-4.92645583h5.5724368L119.81199 69.3461849h-4.966111l-4.157673-11.9244357H93.7687843l-4.1576731 11.9244357H85.078099l14.5807272-41.02813904Zm2.5696738 4.7928662L95.241299 53.1197155h13.945526L102.2285 33.11091206Zm20.879509-4.1973195h4.90836V65.6397065h18.420795v4.3020251h-23.329155zm27.650382 0h4.908369V69.9417316h-4.908369zm48.41257-.4253905c2.714031 0 5.245206.48121024 7.593526 1.44363071 2.367565.9431758 4.407905 2.28094667 6.121021 4.01331259 1.732366 1.73235454 3.089381 3.89780774 4.071046 6.49635944.981671 2.5792957 1.472507 5.4184455 1.472507 8.5174493 0 4.1961709-.837308 7.9303791-2.511923 11.2026246-1.655364 3.2529952-3.965184 5.7745455-6.929458 7.5646511-2.945012 1.770861-6.284623 2.6562914-10.018831 2.6562914-2.463811 0-4.82175-.43309-7.073818-1.2992702-2.252074-.8854361-4.282792-2.1654616-6.092154-3.8400765-1.80935-1.6746149-3.252981-3.8593184-4.330892-6.5541105-1.077922-2.7140367-1.616884-5.7649203-1.616884-9.1526508 0-3.1759995.490836-6.0825226 1.472507-8.7195693.981676-2.6370411 2.329072-4.8506144 4.042188-6.64072001 1.713115-1.8093616 3.753455-3.20487781 6.12102-4.18654862 2.367559-1.00091547 4.927607-1.50137321 7.680145-1.50137321Zm-.259854 4.30203363c-1.751611 0-3.435857.32722172-5.052738.98166514-1.616863.65445477-3.108617 1.61688087-4.475261 2.88727847-1.347399 1.2511471-2.434941 2.9450124-3.262626 5.0815957-.808429 2.117333-1.212643 4.5137703-1.212643 7.1893121 0 2.560051.375344 4.9276129 1.126034 7.1026855.750689 2.1558337 1.770858 3.9651924 3.060506 5.4280763 1.289648 1.4628896 2.810277 2.5985489 4.561887 3.406978 1.770867.8084405 3.666844 1.2126607 5.687931 1.2126607 1.366643 0 2.704411-.2021115 4.013304-.6063346 1.328148-.4042174 2.598552-1.0394161 3.811209-1.9055963 1.212647-.8854361 2.271313-1.9633529 3.176-3.2337505.923925-1.2703975 1.655367-2.8391469 2.194326-4.7062481.558203-1.867107.837304-3.9170723.837304-6.149896 0-2.2713186-.288726-4.3501538-.86618-6.2365054-.577453-1.8863516-1.347393-3.4647261-2.309819-4.7351237-.943176-1.2704032-2.049963-2.3386948-3.32036-3.2048749-1.251159-.88543618-2.550435-1.52063777-3.897828-1.90560483-1.328143-.40421172-2.685158-.60631758-4.071046-.60631758Zm23.397966-3.87664313h6.207638l22.347481 34.32967654V28.91359256h4.908369V69.9417316h-6.20763l-22.34749-34.3874106v34.3874106h-4.908368V28.91359256z"/><path fill="url(#a)" fill-rule="nonzero" d="M174.265411 4.50913925h6.14987L163.062778 24.0848526l-6.178763.4042146z" transform="translate(0 25)"/><path fill="url(#b)" fill-rule="nonzero" d="M162.552309 23.4815553 181.00198 44.933981h-6.323132l-18.305302-21.0482111z" transform="translate(0 25)"/><g transform="translate(0 25)"><ellipse stroke="#A3A3A3" stroke-width=".5" fill="url(#c)" fill-rule="nonzero" cx="26.8134179" cy="26.3507547" rx="26.805321" ry="26.3202814"/><path d="M9.37216085 52.0819111S17.7489335 22.7696899 50.3566889 26.4969018c0 0-20.723434-12.3020208-40.84161386 4.2828996-5.94153114 13.7625736-.14291419 21.3021097-.14291419 21.3021097Z" fill="url(#d)"/><path d="M11.8660211 48.3743096s8.7405326-21.0730284 32.0717549-21.4433648c-17.7350232 4.3205976.0290967 19.6378374.0290967 19.6378374s-14.0287234 12.7111189-32.1008516 1.8055274Z" fill="url(#e)"/><path d="M6.99959641 32.2202162S24.4574437 13.0165918 50.527832 26.2845469c-.4655559-3.607941-3.5497731-7.6814378-9.0780884-8.8452977-1.2220448-.5819257-10.1837464-14.43182348-29.4455641-6.459393 5.9256811.461387 8.4682656 1.291426 8.612541 1.9203488C10.369106 11.1390373 7.33148608 25.722572 6.99959641 32.2202162Z" fill="url(#f)"/><path d="M32.03706 15.9299212s4.4665322-1.5996384 5.0482196 3.1577417c-4.4042039.4155129-5.0482196-3.1577417-5.0482196-3.1577417Z" fill="#202020"/><path d="M9.2551104 52.1772666s7.6361082-24.9093105 33.1663186-25.8730411c0 0-20.7166787-3.7798413-35.34817197 19.3977044-.08112197 3.2790716 2.18185337 6.4753367 2.18185337 6.4753367Z" fill="url(#g)"/><path d="M12.0256021 10.9822724s6.3677384.3703449 8.6411954 1.9339868c.9492333-.1952797 1.7552122-.8451998 1.892222-1.7303694-.8145463-.337105-8.2702464-.9442903-10.5334174-.2036174Z" fill="url(#h)"/><path d="M7.05701562 32.2533371s7.97220928-9.5753699 24.06662038-10.719313c0 0-21.9094907.9901814-23.7487686 7.1768481-.5113449 1.4876671-.31785178 3.5424649-.31785178 3.5424649Z" fill="url(#i)"/></g></g></svg>`,
  quote = `
<p>"The technology that big organizations want you to forget".</p>
<p>-- Alex J. Anderson</p>`,
  htmlSettings = `
<div class="about-newspaper" id="page-settings">
<div class="document">
  <h1>Settings</h1>
  <p>Settings are saved instantly. Reload for new results.</p>
  <h2>Behaviour</h2>
  <dl>
    <dt>
      <span>Detection</span>
    </dt>
    <dd>
      <p>
        <span>
          <input type="checkbox" name="detection-scan" id="detection-scan" />
          <label for="detection-scan">Scan pages of feeds</label>
        </span>
      </p>
    </dd>
    <dd>
      <p>
        <span>
          <input type="checkbox" name="detection-notification" id="detection-notification" />
          <label for="detection-notification">Display a notification of discovered feeds</label>
        </span>
      </p>
    </dd>
    <dt>
      <span>Content</span>
    </dt>
    <dd>
      <p>
        <select name="content-mode" id="content-mode">
          <option value="content-title">Titles only </option>
          <option value="content-summary">Prefer short summary</option>
          <option value="content-complete">Prefer full content</option>
        </select>
      </p>
    </dd>
    <dt>
      <span>Enclosures</span>
    </dt>
    <dd>
      <p>
        <span>
          <input type="checkbox" name="enable-enclosure" id="enable-enclosure" />
          <label for="enable-enclosure">Enable enclosures</label>
        </span>
        <span>
          <input type="checkbox" name="play-enclosure" id="play-enclosure" />
          <label for="play-enclosure">Play audio (Podcast)</label>
        </span>
      </p>
    </dd>
    <dt>
      <span>Media</span>
    </dt>
    <dd>
      <p>
        <span>
          <input type="checkbox" name="show-audio" id="show-audio" />
          <label for="show-audio">Audio</label>
        </span>
        <span>
          <input type="checkbox" name="show-icon" id="show-icon" />
          <label for="show-icon">Icon</label>
        </span>
        <span>
          <input type="checkbox" name="show-image" id="show-image" />
          <label for="show-image">Image</label>
        </span>
        <span>
          <input type="checkbox" name="show-video" id="show-video" />
          <label for="show-video">Video</label>
        </span>
      </p>
    </dd>
  </dl>
  <h2>Appearance</h2>
  <dl>
    <dt>
      <span>Articles</span>
    </dt>
    <dd>
      <p>
        <input type="number" name="item-number" id="item-number" min="3" max="50" />
        <label>№</label>
      </p>
      <p>Maximum number of articles to display (3 - 50).</p>
    </dd>
    <dt>
      <span>Font size</span>
    </dt>
    <dd>
      <p>
        <input type="number" name="font-size" id="font-size" min="20" max="35" />
        <label>px.</label>
      </p>
      <p>Routine font size (20 - 35).</p>
    </dd>
    <dt>
      <span>Font style</span>
    </dt>
    <dd>
      <p>
        <select name="font-type" id="font-type">
          <option value="system-ui">System</option>
          <option value="arial">Arial</option>
          <option value="sans">Sans</option>
          <option value="serif">Serif</option>
          <option value="tahoma">Tahoma</option>
        </select>
      </p>
    </dd>
    <dt>
      <span for="view-mode">Mode</span>
    </dt>
    <dd>
      <p>
        <select name="view-mode" id="view-mode">
          <option value="bright">Bright</option>
          <option value="dark">Dark</option>
          <option value="sepia">Sepia</option>
        </select>
      </p>
    </dd>
    <dt>
      <span for="enclosure-view">Enclosures</span>
    </dt>
    <dd>
      <p>
        <select name="enclosure-view" id="enclosure-view">
          <option value="list">List</option>
          <option value="table">Table</option>
        </select>
      </p>
    </dd>
    <dt>
      <span>Stylesheet</span>
    </dt>
    <dd>
      <p>
        <select name="stylesheet" id="stylesheet">
          <option value="blacklistednews">BlackListedNews</option>
          <option value="waco">Davidian</option>
          <option value="falkon">Falkon</option>
          <option value="greasyfork">Greasy Fork</option>
          <option value="msie">Internet Explorer</option>
          <option value="minicss">mini.css</option>
          <option value="openuserjs">OpenUserJS</option>
          <option value="openuserjs-classic">OpenUserJS (Classic)</option>
          <option value="opera">Opera</option>
          <option value="otter">Otter</option>
          <option value="palemoon">Pale Moon</option>
          <option value="pioneer">Pioneer</option>
          <option value="qupzilla">QupZilla</option>
          <option value="rubyridge">Ruby Ridge</option>
          <option value="simplecss">Simple.css</option>
          <option value="superfastpython">SuperFastPython</option>
          <option value="netscape">Netscape</option>
          <option value="7css">Win7</option>
          <option value="98css">Win9x (ReactOS)</option>
          <option value="xpcss">WinXP</option>
        </select>
      </p>
    </dd>
  </dl>
  <h2>Content control</h2>
  <p>Control and filter contents.</p>
  <dl>
    <dt>
      <span>Filtering</span>
    </dt>
    <dd>
      <p>
        <span>
          <input type="checkbox" name="filter-blacklist" id="filter-blacklist" />
          <label for="filter-blacklist">Blacklist</label>
        </span>
        <span>
          <input type="checkbox" name="filter-whitelist" id="filter-whitelist" />
          <label for="filter-whitelist">Whitelist</label>
        </span>
      </p>
    </dd>
    <dt>
      <span>Blacklist</span>
    </dt>
    <dd>
      <p>Add keywords to ignore.</p>
      <p>
        <input type="text" name="keywords-blacklist" id="keywords-blacklist" />
        <label>(comma separates)</label>
      </p>
    </dd>
    <dd>
      <details>
        <summary>Blacklisted keywords</summary>
        <p id="keywords-blacklist-current"></p>
      </details>
    </dd>
    <dt>
      <span>Whitelist</span>
    </dt>
    <dd>
      <p>Add keywords to always show.</p>
      <p>
        <input type="text" name="keywords-whitelist" id="keywords-whitelist" />
        <label>(comma separates)</label>
      </p>
    </dd>
    <dd>
      <details>
        <summary>Whitelisted keywords</summary>
        <p id="keywords-whitelist-current"></p>
      </details>
    </dd>
  </dl>
  <h2>Subscription handler</h2>
  <p>Select an online service or software to subscribe with.</p>
  <dl>
    <dt>
      <span>Handler</span>
    </dt>
    <dd>
    <p>
      <select name="handler" id="handler">
      <option value="desktop">Desktop</option>
      <option value="commafeed">CommaFeed</option>
      <!-- option value="drummer">Drummer</option -->
      <option value="feedbin">Feedbin</option>
      <option value="feedcity">FeedCity</option>
      <option value="feeder">Feeder</option>
      <!-- option value="feedhq">FeedHQ</option -->
      <!-- option value="feeds">Feeds</option -->
      <!-- option value="feedsonfeeds">Feeds on Feeds</option -->
      <!-- option value="feedland">FeedLand</option -->
      <option value="feedly">Feedly</option>
      <!-- option value="freshrss">FreshRSS</option -->
      <option value="goodnews">Good News</option>
      <option value="inoreader">Inoreader</option>
      <!-- option value="miniflux">Miniflux</option -->
      <!-- option value="netvibes">Netvibes</option -->
      <option value="newsblur">NewsBlur</option>
      <!-- option value="rawdog">rawdog</option -->
      <!-- option value="reader">Reader</option -->
      <!-- option value="reedah">Reedah</option -->
      <!-- option value="rrss">RRSS</option -->
      <!-- option value="selfoss">selfoss</option -->
      <option value="subtome">SubToMe</option>
      <option value="tapestry">Tapestry</option>
      <!-- option value="theoldreader">The Old Reader</option -->
      <!-- option value="tt-rss">Tiny Tiny RSS</option -->
      <!-- option value="yarr">yarr</option -->
      <!-- option value="yarrharr">Yarrharr</option -->
      <option value="custom">Custom</option>
      </select>
    </p>
    </dd>
    <dt>
      <span>Instance</span>
    </dt>
    <dd>
      <p>
        <input type="text" name="instance" id="instance" placeholder="gemini://news.schimon.i2p/?add=" />
        <label>Enter instance URL.</label>
      </p>
    </dd>
    <dt>
      <span>URL handler</span>
    </dt>
    <dd>
      <p id="handler-url"></p>
    </dd>
  </dl>
  <p>
    * Select "Desktop" to use software installed on your device or machine and
    "Custom" for a custom online reader that is not included on the list.
  </p>
  <div id="buttons">
    <button id="reload-document">Reload</button>
    <button id="close-page-settings">Return</button>
  </div>
</div>
</div>`,
  htmlSupport = `
<div class="about-newspaper" id="page-support">
<div class="document">
  <h1>Donations</h1>
  <h2>No, thank you. Yet, I do appreciate your concern.</h2>
  <p>Here are some things you can do instead, in no particular order…</p>
  <ul>
    <li>Promote <a href="https://rfc-editor.org/rfc/rfc4287">The Atom syndication Format</a>, <a href="https://geminiprotocol.net">Project Gemini</a>, <a href="https://xmpp.org">XMPP</a> (aka Jabber) and BitTorrent in order to get us out from the HTML5 calamity to a better telecommunication system.</li>
    <li>Talk with your friends about the benefits of syndication feeds. That would be a good table talk.</li>
    <li>Use a feed reader. (See list of software in Help menu)</li>
    <li>Teach other people to use feed readers. publish posts about feed readers. And about other open technologies and apps.</li>
    <li>Write a journal (blog) instead of posting to “social networks”. (You can always re-post to those places if you want to extend your reach.) <a href="https://justjournal.com/">Just Journal</a>, <a href="https://micro.blog/">Micro.blog</a> and <a href="https://monocles.social/">monocles.social</a> are good places to get going, and these are not the only ones.</li>
    <li>Petition <a href="http://unicode.org/pending/proposals.html">unicode.org</a> and promote the initiative for the <a href="https://github.com/vhf/unicode-syndication-proposal">Proposal to Include Syndication Symbol</a>.</li>
    <li>Donate to charities that promote literacy.</li>
    <li>Tell other people about cool journals and feeds you have found.</li>
    <li>Support independent podcast apps and desktop software.</li>
    <li>Support your local library.</li>
    <li>Be bold and do your best work.</li>
    <li>Support indie developers. Even though software like Falkon, Newspaper, postmarketOS etc. are free, software are most definitely not free to make, and it costs time and effort to keep improving them. It is worth it.</li>
    <li>Finally: report of issues and make feature requests on our issues tracker. We also need testers, writers, and, especially, people who are willing to talk things over. Most of software development is just making decisions, and we appreciate all the help we can get!</li>
    <li>Or: skip helping us, and, instead, help people who need help more than we do. Those people should not be hard to find.</li>
    <li>Buy a meal to a man or a woman in need, or, even better, get a job for him or her.</li>
    <li>Establish a family, or if you already are a father or a mother, bring a new healthy child to the world.</li>
    <li>Get more ideas from <a href="https://github.com/Ranchero-Software/NetNewsWire/blob/main/Technotes/HowToSupportNetNewsWire.markdown#here-are-some-things-you-can-do">Ranchero-Software/NetNewsWire</a>.</li>
  </ul>
  <p>If you happen to visit in the Middle East, reach me out and we can meet for a café or tea.</p>
  <p>Sharing is caring, and is exactly what makes us humans.  It is "all of us for all of us" or we are on our own.</p>
  <p>Schimon</p>
  <div class="decor"></div>
  <div class="quote">
    <p>Syndicated technologies, such as Atom, NNTP, OStatus, RSS, XMPP, and even Email, are the very simple technologies that big organizations are jealously trying to oppress and conceal from us;</p>
    <p>Because it unleashes the embodiment of what free and open telecommunication should really be, a truely free-speech-driven telecommunication and publishing international system.</p>
    <p>The problem, for them, is that when true openness would flourish, it might have the "dire" potential, at least for them, to put many of them off the market, for good.</p>
    <p>-- Alex J. Anderson</p>
  </div>
  <div id="buttons">
    <button class="return-to-feed">Return</button>
  </div>
</div>
</div>`,
  htmlAbout = `
<div class="about-newspaper" id="page-about">
<div class="document">
  <!-- div id="buttons-custom">
    <span class="button" id="back">❰ Table of Contents</span>
    <span class="button" id="close">Return to Syndication Feed ❱</span>
  </div -->
  <div id="table-of-contents" class="segment">
    <h1>Table of contents</h1>
    <p>Help, information, and further support, concerning to the syndication technology.</p>
  </div>
  <h2>Introduction</h2>
  <details id="intro" class="segment">
  <summary>News feeds and their benefits</summary>
  <h3>👋️ Greetings, syndication feeds!</h3>
  <h4>Syndicate, collect, and share!</h4>
  <h5><abbr title="Too long; did not read">TL;DR</abbr></h5>
  <p>Syndication feeds free you from the manual news checking tasks, and no browser is required.</p>
  <div class="background">
    <p>RSS (Really Simple Syndication or Rich Site Summary) is a service that allows people to receive news articles from sites quickly and conveniently through the installation of an RSS reader similar to e-mail.</p>
    <p>News provide by RSS news can be allocated into sections, including cultural, economy, international, national, politics, and special feature news.</p>
    <p>Through RSS, you can easily receive news updates on your PC, mobile and tablet without visiting the site yourself.</p>
    <p>Use RSS service to receive news on any site fast and easy.</p>
    <hr/>
    <p>Subscribing to an Atom or RSS feed (henceforth "Syndication Feed") spares the need for you to manually check the site for new content.</p>
    <p>Instead, a software known as "Feed Reader" or "RSS Reader" does that task for you, by constantly monitoring the sites you follow and it automatically informs you of any updates.</p>
    <p>The software can also be commanded to automatically download the new data for you (e.g. Audio Podcasts, Documents, Torrents, Videos etc.).</p>
  </div>
  <h4>About <span class="text-icon orange">Atom</span> and <span class="text-icon orange">RSS</span> syndication feeds</h4>
  <h5>An introduction to a time-saving technology.</h5>
  <div class="content">
    <p>A syndication feed can include news articles, press releases, journal posts, updates and other changing contents, including audio files (PodCasts), video files (VodCasts), and even Torrent files that would enable your <a href="http://bittorrent.org/beps/bep_0036.html">BitTorrent</a> client to automaticlly download the latest of the latest as soon as it is published.</p>
    <p>Once you subscribe to a feed, the Feed Reader automatically checks for new content and organizes it in an easily and readable format, and it keeps you updated with the latest news, and you can collect syndication feeds from various of sources in one place without visiting multiple sites.</p>
    <p>To retrieve syndication feed content, you can download Feed Readers or use browsers that support syndication feeds.</p>
    <p><b>Note:</b> RSS is an abbreviation of "Really Simple Syndication". Atom Syndication Format (RFC 4287) is the standard for RSS.</p>
  </div>
  <h4>Syndicated daily news</h4>
  <h5>How syndication feeds work. Simplified explanation and benefits.</h5>
  <div class="content">
    <p>Syndication news feeds form a mean for content and media publishers to reach a wider audience easily.  They allow you to receive information directly without the going from site to site.</p>
    <p>Essentially, feeds, as a whole, embody a function that allows “Feed Readers” to access multiple sites, automatically looking for new contents and then posting the information about new contents and updates to another site, mobile app or desktop software at your office.</p>
    <p>Feeds provide a simple way to keep up with the latest news, events, package and delivery status information posted on different sites such as news sites, music sites, content sites (aka “social networks”), torrent indexers, podcasts and <a href="#feeds" class="link">more</a>; all, in one single spot.</p>
    <p>In the hope that you would find this software useful; and in the hope that you would enjoy and get the most out of this software!</p>
    <p>Read more about <a href="http://rss.userland.com/howUseRSS">How you can use RSS</a> and <a href="http://rss.userland.com/whyImportant">Why is RSS important?</a> and <a href="https://marcus.io/blog/making-rss-more-visible-again-with-slash-feeds">Making RSS more accessible with a /feeds page</a>.</p>
  </div>
  </details>
  <details id="who">
  <summary>Who is using syndication feeds and what for?</summary>
  <h4>Who is using syndication feeds and what for?</h4>
  <h5>Learn how you can use syndication feeds to your advantage.</h5>
  <div class="content">
    <p>Amongst those who make use of syndication feeds are Accountants, Analysts, Engineers, Farmers, Government Ministries, Intelligence Agencies, Lawyers, Militaries, Parliaments, Police, Programmers, Publishers, Realtors, Reasearchers, Statisticians, Tribunals, Weather Stations, and many others.</p>
    <p>And the uses are vast, to name just a few:</p>
    <ul>
      <li>Publishing of events;</li>
      <li>Monitoring of inventory;</li>
      <li>Receiving search results;</li>
      <li>Sharing of data and information;</li>
      <li>Automating BitTorrent downloads;</li>
      <li>Publishing of laws and regulations;</li>
      <li>Weather forecasting and monitoring;</li>
      <li>Monitoring of stock market and trades;</li>
      <li>Publishing of court decisions and verdicts;</li>
      <li>Publishing of real estate and vacancy boards;</li>
      <li>Communicating of information, including mailing-list archives;</li>
      <li>Publishing journal posts and news updates, including urgent ones;</li>
      <li>Managing, remote controlling and supervising of automated machines (IoT, so called) and peripherals; and</li>
      <li>So much more…</li>
    </ul>
    <p>Start using syndication feeds, <i>today!</i></p>
  </div>
  </details>
  <details id="matter" class="segment">
  <summary>Why syndication feeds matter so much?</summary>
  <h3>🪙 Syndication feeds are important</h3>
  <p>Factors that make syndication feeds very and mostly important.</p>
  <h4>♿ Accessibility</h4>
  <h5>One of the fundamental arguments for syndication feeds is accessibility for the blind and the visually impaired.</h5>
  <p>With syndication feeds and particularly <span class="text-icon orange">Atom</span>, as a standard format, all may enjoy a consistent fashion of content delivery and consumption across multiple sites.</p>
  <p>And it includes the blind and the visually impaired, without having to be bound to specific apps or services that do not opperate in the same manner nor display contents in the same manner of similar services, which would always make it difficult and even impossible to communicate with, to those who are subjected to the need of different and special means of accessibility.</p>
  <p>Syndication feeds make everyone equally communicated and no one is left behind; yet ignoring, suppressing and even actively discouraging syndication feeds would only leave the blind and the visually impaired excommunicated.</p>
  <p>If accessibility is a human right, then syndication feeds must be so too.</p>
  <h4>😊 Mental health</h4>
  <h5>Using syndication feeds is better for your mental health.</h5>
  <p>Studies show that the ways we consume content today—especially when on social media sites—can negatively impact our lives and be significantly detrimental to our mental health. It has been linked to increased anxiety, depression, sleep disruption, and anti-social behavior.</p>
  <p>And while syndication feeds do not eliminate these risks entirely, consuming news and social media content through syndication feeds, instead of through sites and apps directly, can combat some of these negative effects. <a href="https://openrss.org/blog/rss-feeds-may-be-better-for-your-mental-health">Continue reading…</a></p>
  <p><a href="https://stallman.org/facebook.html">More about cons of social media.</a></p>
  <h4>🧠 Free your mind</h4>
  <h5>Because with syndication feeds you are not easily manipulated nor distracted.</h5>
  <p>Since syndication feeds are structured formats (and Atom being the standard format for syndication feeds), you are completely in control of the data you consume, without being subjected to distractions, targeted advertising and manipulations of sorts.</p>
  <p>You are also in control of the appearance and fashion that content is being delivered to you, unlike dynamic pages.</p>
  <p>And if you are not interested in certain content you see, all you need to do, is to disable or delete the source feed from which that content was resulted from. That's it!</p>
  <h4>📶 Bandwidth efficient</h4>
  <h5>Feeds mean getting data and getting it fast.</h5>
  <p>Feeds is basically an XML based text file that weight less than 10KB on average, meaning that scanning 1000 feeds would only cost you 10MB.</p>
  <p>Read more about how to make syndication feeds even more efficient over HTTP at <a href="https://ctrl.blog/entry/feed-caching.html">Ctrl.journal</a> (See <a href="https://datatracker.ietf.org/meeting/66/materials/slides-66-atompub-1.pdf">Atom Over XMPP</a> for communicating over XMPP).</p>
  <h4>🪲 We are not bugs</h4>
  <h5>Commercial content publishers hate syndication feeds because they can not engage in user tracking with it.</h5>
  <p>Syndication feeds are just text with some bits attached, such as MP3 files for podcasts. There is no ECMAScript (JavaScript) or any of the fancy stuff for tracking you, just an IP address. And if you go through an aggregator there is not even that.</p>
  <p>They absolutely hate that. They would much prefer if you used their sites or apps, where they can study you like a bug. (<a href="https://farside.link/redlib/r/apple/comments/4xx1gv/apple_news_no_longer_supports_rss_feeds/d6jo3g9/#c">source</a>)</p>
  <h4>🫵 You and your power</h4>
  <h5>If you want to, you have the power to make any difference you want.</h5>
  <p>You are advised not to participate in the miserable and unfortunate charade of publishers and browser vendors to excommunicate blind people, visually impaired people and people with other disabilities to whom syndication feeds are either their only or most useful fashion to get news and updates.</p>
  <p>Take into your attention that some of the uses of syndication feeds for the disabled are merely for the sake of their lives (e.g. Emergency S.O.S. Unit).</p>
  <p>When we cut our syndication feeds from them, we might cut our their lives, literally.</p>
  <p>Join our endeavor to restore and promote syndication feeds.</p>
  </details>
  <h2>Guides</h2>
  <details id="corbett" class="segment">
  <summary>How to use that RSS thing?</summary>
  <h3>🎙️ The Corbett Report – #SolutionsWatch</h3>
  <h4>RSS solutions from Growth Origin and Mr. James Corbett.</h4>
  <div class="content">
    <h5>RSS Made Easy – Growth Origin</h5>
    <p>Learn how to use RSS feeds to subscribe to all your favorite websites, so all the latest content you follow goes directly one place of your choosing.</p>
    <p>Source: <a href="https://youtube.com/watch?v=6HNUqDL-pI8">https://youtube.com/watch?v=6HNUqDL-pI8</a> (3 minutes)</p>
    <h5>Really Simple Syndication – #SolutionsWatch</h5>
    <p>#SolutionsWatch is not just about the Big Ideas. It is also about the simple tricks, tips and techniques that we can use to regain power over our lives and help create the world we want. Today, James explores one very simple and tragically under-appreciated tool: Really Simple Syndication.</p>
    <p>Source: <a href="https://corbettreport.com/really-simple-syndication-solutionswatch/">https://corbettreport.com/really-simple-syndication-solutionswatch/</a></p>
    <p>Download video <a href="https://corbettreport.com/mp4/solutionswatch-rss.mp4" download="solutionswatch-rss.mp4">solutionswatch-rss.mp4</a> (10 minutes)</p>
    <h5>How to use that RSS thing – #SolutionsWatch</h5>
    <p>Have you heard James talking about “that RSS thing” but do not know how to start using it? Well, this episode of #SolutionsWatch is for you!</p>
    <p>Source: <a href="https://corbettreport.com/how-use-rss/">https://corbettreport.com/how-use-rss/</a></p>
    <p>Download video <a href="https://corbettreport.com/mp4/solutionswatch-howuserss.mp4" download="solutionswatch-howuserss.mp4">solutionswatch-howuserss.mp4</a> (30 minutes)</p>
  </div>
  <!-- div><span>📗 Recommended Feeds</span -->
  <!-- div><span>{ } &lt;rss&gt; Is Everywhere</span -->
  </details>
  <details id="feeds" class="segment">
  <summary><b>Subscribe to feeds</b></summary>
  <h3>🗂️ Feeds are everywhere</h3>
  <h4>The technology that will keep you up to date with the latest information and trends, all the time.</h4>
  <div class="content">
    <p>It is not a secret, and even well known, that experts extensively leverage the power of syndication feeds to stay updated with latest information and trends</p>
    <p>This is a list of feeds that should get you started with your news reader <a href="#software" class="link">app or software</a>.</p>
    <p>You can download this list as an <span class="cursor-pointer" id="opml-selection"><u>OPML Outline</u></span> file which can be imported into other feed readers.</p>
    <p>The filetype formats of the feeds below are vary, from ActivityStreams and JSON to Atom and RDF, not only RSS.</p>
    <p class="background center">Random news feed from <a class="feed-category"></a>: <b><a class="feed-url"></a></b></p>
    <h5>Categories</h5>
    <ul>
      <li><a href="#art">Art, Culture, Literature &amp; Photography</a></li>
      <li><a href="#automation">Automation</a></li>
      <li><a href="#journal">Journals &amp; Webring</a></li>
      <li><a href="#business">Business &amp; Careers</a></li>
      <li><a href="#code">Coding, Development, SysAdmin &amp; Tutorials</a></li>
      <li><a href="#entertainment">Comic, Entertainment, Games &amp; Memes</a></li>
      <li><a href="#events">Conferences &amp; Events</a></li>
      <li><a href="#cybersecurity">Cybersecurity, Data, IT &amp; Privacy</a></li>
      <li><a href="#data">Data &amp; OSINT</a></li>
      <li><a href="#forum">Discussions, Forums &amp; Message Boards</a></li>
      <li><a href="#diy">DIY, 3D Modeling &amp; Printing, Architecture and Crafting</a></li>
      <li><a href="#wiki">Documentation, Issue Trackers &amp; WikiMedia</a></li>
      <li><a href="#nature">Earth, History, Nature, Science &amp; Weather</a></li>
      <li><a href="#hacking">Electronics, Hardware &amp; Robotics</a></li>
      <li><a href="#family">Family, Fitness, Leisure &amp; Travel</a></li>
      <li><a href="#fantasy">Fantasy, Fiction &amp; Pseudo-Science</a></li>
      <li><a href="#news">Government, History, Media, Politics &amp; World Affairs News</a></li>
      <li><a href="#health">Health, Nutrition &amp; Recipes</a></li>
      <li><a href="#music">Music, Radio, Scores &amp; Sound</a></li>
      <li><a href="#radio">Podcasts &amp; Radio</a></li>
      <li><a href="#shopping">Product, Real Estate, Services, Shopping Reviews &amp; Stores</a></li>
      <li><a href="#activism">Social Action (Activism)</a></li>
      <li><a href="#technology">Software, Guides, Reviews &amp; Technology</a></li>
      <li><a href="#package">Software Package Updates</a></li>
      <li><a href="#project">Software Project Updates</a></li>
      <li><a href="#syndication">Syndication &amp; XML</a></li>
      <li><a href="#telecom">Telecom, Mesh &amp; Mix Protocols</a></li>
      <li><a href="#torrents">Torrents</a></li>
      <li><a href="#video">Videos</a></li>
    </ul>
    <div class="category" id="art">
      <h5>Art, Culture, Literature &amp; Photography</h5>
      <a href="https://4columns.org/feed">4Columns</a>
      <a href="https://queue.acm.org/rss/feeds/latestitems.xml">ACM Queue</a>
      <a href="https://aeon.co/feed.atom">Aeon</a>
      <a href="https://annas-blog.org/rss.xml">Anna’s Journal</a>
      <a href="https://audiobookbay.is/feed/atom/">AudioBook Bay</a>
      <!-- a href="https://barnesreview.org/feed/">Barnes Review</a -->
      <!-- a href="https://kusc.org/feed/">Classical KUSC</a -->
      <a href="https://dafont.com/new.xml">DaFont</a>
      <a href="http://davidkphotography.com/index.php?x=rss">David Kleinert Photography</a>
      <a href="http://darksitefinder.com/feed/atom/">Dark Site Finder</a>
      <a href="https://tpb.party/rss/new/601">E-books (TPB)</a>
      <a href="https://motd.ambians.com/out/rss/daily-fortunes.xml">Daily Fortunes - Quotes &amp; Quips</a>
      <a href="http://freedif.org/blog.atom">Freedif</a>
      <a href="https://kb.nl/rss.xml">Galerij | Koninklijke Bibliotheek</a>
      <a href="https://sacred-texts.com/rss/new.xml">ISTA - Internet Sacred Text Archive</a>
      <a href="https://librivox.org/feed/atom/">LibriVox News</a>
      <a href="https://librivox.org/rss/latest_releases">LibriVox's New Releases</a>
      <a href="https://onlinebooks.library.upenn.edu/newrss.xml">New Online Books</a>
      <a href="https://nioc.eu/rss">Nioc Photos</a>
      <a href="https://transformativeworks.org/feed/atom/">Organization for Transformative Works</a>
      <a href="https://brainyquote.com/link/quotebr.rss">Quotes</a>
      <a href="https://zenfolio.com/feed">Ron Reyes Photography</a>
      <a href="https://thegraphicsfairy.com/feed/atom/">The Graphics Fairy</a>
      <a href="https://publicdomainreview.org/rss.xml">The Public Domain Review</a>
      <a href="https://torrent911.me/rss/ebooks">Torrent911</a>
    </div>
    <div class="category" id="automation">
      <h5>Automation</h5>
      <a href="https://home-assistant.io/atom.xml">Home Assistant</a>
      <a href="https://zapier.com/blog/feeds/latest/">Zapier</a>
    </div>
    <div class="category" id="journals">
      <h5>Journals &amp; Webring</h5>
      <a href="https://nerdy.dev/rss.xml">Adam Argyle</a>
      <a href="https://alixandercourt.com/feed/atom/">Alixander Court</a>
      <a href="https://web.lewman.com/feed.xml">Andrew Lewman</a>
      <a href="https://momi.ca/feed.xml">Anjan Momi</a>
      <a href="https://arantius.com/feed.rss">Anthony (Tony) Lieuallen</a>
      <a href="https://automationrhapsody.com/feed/atom/">Automation Rhapsody</a>
      <a href="https://blog.stigok.com/feed.xml">journal of stigok</a>
      <a href="https://carlschwan.eu/index.xml">Carl Schwan</a>
      <a href="https://carlosbecker.com/index.xml">Carlos Becker</a>
      <a href="https://chee.party/feed.xml">cherries by chee rabbits</a>
      <a href="https://chee.party/feeds/everything.xml">cherries: everything by chee rabbits</a>
      <a href="https://copyblogger.com/feed/atom/">Copyblogger</a>
      <a href="https://denshi.org/index.xml">DenshiSite</a>
      <a href="https://tilde.town/~dustin/index.xml">~dustin</a>
      <a href="https://blog.esmailelbob.xyz/feed/atom/">Esmail EL BoB</a>
      <a href="https://fivefilters.org/feed/atom/">FiveFilters</a>
      <a href="https://nu.federati.net/api/statuses/user_timeline/16.as">GeniusMusing (@geniusmusing)</a>
      <a href="https://mccor.xyz/rss.xml">Jacob McCormick</a>
      <a href="https://janwagemakers.be/jekyll/feed.xml">Jan Wagemakers</a>
      <a href="https://kasesag.me/index.xml">kasesag</a>
      <a href="https://kirsle.net/blog.atom">Kirsle</a>
      <a href="https://len.ro/index.xml">len.ro</a>
      <a href="https://nu.federati.net/api/statuses/user_timeline/2.as">LinuxWalt (@lnxw48a1)</a>
      <a href="https://lukesmith.xyz/index.xml">Luke Smith</a>
      <a href="https://blog.mathieui.net/feeds/all.atom.xml">mathieui’s journal</a>
      <a href="https://nadim.computer/rss.xml">Nadim Kobeissi</a>
      <a href="http://aaronsw.com/2002/feeds/pgessays.rss">Paul Graham: Essays</a>
      <a href="https://problogger.com/feed/atom/">ProBlogger</a>
      <a href="http://schneegans.github.io/feed.xml">Simon Schneegans' Journal</a>
      <a href="https://sizeof.cat/atom.xml">sizeof(cat)</a>
      <a href="https://singpolyma.net/feed/action_stream/?full">Stephen Paul Weber</a>
      <a href="http://susannaspencer.com/feed/atom/">Susanna Spencer</a>
      <a href="http://thedarnedestthing.com/atom.xml">the darnedest thing</a>
      <a href="https://flu0r1ne.net/logs/rss.xml">The Logs (flu0r1ne.net)</a>
      <a href="https://geniusmusing.com/feed/rss">The Random Thoughts of GeniusMusing</a>
      <a href="https://blogs.gnome.org/thaller/feed/atom/">Thomas Haller</a>
      <a href="https://thoughtcatalog.com/feed/atom/">Thought Catalog</a>
      <a href="https://tomblog.rip/feed/atom/">Tomb Log</a>
      <a href="http://truthstreammedia.com/feed/atom/">Truthstream Media</a>
      <a href="https://unixsheikh.com/feed.rss">unixsheikh.com</a>
      <a href="https://waitbutwhy.com/feed">Wait But Why</a>
      <a href="https://webring.xxiivv.com/#rss">Webring (index)</a>
      <a href="https://willnorris.com/atom.xml">Will Norris</a>
    </div>
    <div class="category" id="business">
      <h5>Business &amp; Careers</h5>
      <a href="https://coderslegacy.com/feed/atom/">CodersLegacy</a>
    </div>
    <div class="category" id="code">
      <h5>Coding, Development, SysAdmin &amp; Tutorials</h5>
      <a href="https://60devs.com/feed.xml">60devs</a>
      <a href="https://askpython.com/feed/atom">AskPython</a>
      <a href="https://crunchydata.com/blog/rss.xml">CrunchyData</a>
      <a href="https://coderslegacy.com/feed/atom/">CodersLegacy</a>
      <a href="https://codeproject.com/WebServices/ArticleRSS.aspx?cat=1">CodeProject</a>
      <!-- a href="https://datatofish.com/feed/atom/">Data to Fish</a -->
      <a href="https://linux-audit.com/atom.xml">Linux Audit</a>
      <a href="https://linuxconfig.org/feed/atom">LinuxConfig</a>
      <a href="https://linuxguides.de/feed/atom/">Linux Guides</a>
      <a href="https://linuxhandbook.com/rss/">Linux Handbook</a>
      <a href="https://linuxize.com/index.xml">Linuxize</a>
      <a href="https://mfitzp.com/feeds/all.atom.xml">Martin Fitzpatrick
</a>
      <a href="https://peps.python.org/peps.rss">Newest Python PEPs</a>
      <a href="https://pythonclear.com/feed/atom/">Python Clear</a>
      <a href="https://pythonguides.com/feed/atom/">Python Guides</a>
      <a href="https://realpython.com/atom.xml">Real Python</a>
      <a href="https://superfastpython.com/feed/atom/">Super Fast Python</a>
      <!-- a href="https://vegibit.com/feed/">vegibit</a -->
    </div>
    <div class="category" id="entertainment">
      <h5>Comic, Entertainment, Games &amp; Memes</h5>
      <a href="https://abstrusegoose.com/atomfeed.xml">Abstruse Goose</a>
      <a href="https://basicinstructions.net/basic-instructions?format=rss">Basic Instructions</a>
      <a href="https://boredpanda.com/feed/atom/">Bored Panda</a>
      <a href="http://cdrom.ca/feed.xml">CD-ROM Journal</a>
      <a href="https://crossfire.nu/feed/journals">Crossfire Journals</a>
      <a href="https://crossfire.nu/feed/news">Crossfire News</a>
      <a href="https://demilked.com/feed/atom/">DeMilked</a>
      <a href="https://dieselsweeties.com/ds-unifeed.xml">Diesel Sweeties</a>
      <a href="https://dsogaming.com/feed/atom/">DSOGaming</a>
      <a href="https://gamingonlinux.com/article_rss.php">GamingOnLinux</a>
      <a href="https://grrrgraphics.com/feed/atom/">GrrrGraphics</a>
      <a href="https://handheldgameconsoles.com/f.atom">Handheld Game Consoles</a>
      <a href="https://itch.io/blog.rss">itch.io</a>
      <!-- a href="https://joyreactor.com/rss">JoyReactor</a -->
      <!-- a href="https://joyreactor.cc/rss">JoyReactor (RU)</a -->
      <a href="https://lichess.org/blog.atom">Lichess</a>
      <a href="https://mindblur.thecomicseries.com/rss/">Mindblur</a>
      <a href="https://rss.moddb.com/headlines/feed/rss.xml">Mod DB</a>
      <a href="https://pikabu.ru/xmlfeeds.php?cmd=popular">pikabu.ru</a>
      <a href="https://readcomicsonline.ru/feed">Read Comics Online</a>
      <a href="https://revive.thecomicseries.com/rss/">Revive</a>
      <a href="https://pbfcomics.com/feed/atom/">The Perry Bible Fellowship</a>
      <a href="https://toothpastefordinner.com/rss/rss.php">Toothpaste For Dinner</a>
      <a href="https://xkcd.com/atom.xml">xkcd</a>
    </div>
    <div class="category" id="events">
      <h5>Conferences &amp; Events</h5>
      <a href="https://mov.im/feed/pubsub.movim.eu/berlin-xmpp-meetup">Berlin XMPP Meetup</a>
      <a href="https://bsd.network/@bsdcan.rss">BSDCan</a>
      <a href="https://about.cocalc.com/feed/atom/">CoCalc</a>
      <a href="https://datacarpentry.org/feed">Data Carpentry</a>
      <a href="https://defcon.org/defconrss.xml">DEF CON</a>
      <a href="https://fosdem.org/atom.xml">FOSDEM</a>
      <a href="https://joinmobilizon.org/en/news/feed.xml">Mobilizon</a>
      <a href="https://mastodon.social/@pgcon.rss">PGCon</a>
      <a href="http://redheadconvention.ie/?feed=atom" title="Irish Red Head Convention in aid of Irish Cancer Society, Crosshaven, Co. Cork.">Irish Red Head Convention</a>
    </div>
    <div class="category" id="cybersecurity">
      <h5>Cybersecurity, IT &amp; Privacy</h5>
      <a href="https://404media.co/rss/">404 Media</a>
      <a href="https://abovephone.com/feed/atom/">Above Phone</a>
      <a href="https://bleepingcomputer.com/feed/">Bleeping Computer</a>
      <a href="https://cocalc.com/news/rss.xml">CoCalc</a>
      <a href="https://comparitech.com/feed/">Comparitech</a>
      <a href="https://hacktivis.me/feed.atom">Cyber-Home of Lanodan</a>
      <a href="https://cyberscoop.com/feed/atom/">CyberScoop</a>
      <a href="https://dataoverhaulers.com/feed/atom/">Data Overhaulers</a>
      <a href="https://decrypt.fail/feed/">decrypt[.]fail</a>
      <a href="https://fastly.com/blog_rss.xml">Fastly Journal</a>
      <a href="https://hackread.com/feed/atom/">HackRead</a>
      <a href="https://news.ycombinator.com/rss">Hacker News</a>
      <a href="https://mobiforge.com/feed">mobiForge</a>
      <a href="https://news.sophos.com/en-us/category/serious-security/feed/atom/">Naked Security</a>
      <a href="https://privacytools.io/guides/rss.xml">Privacy Guides</a>
      <a href="https://privacysavvy.com/feed/atom/">PrivacySavvy</a>
      <a href="https://rapidseedbox.com/feed">RapidSeedbox</a>
      <a href="https://reclaimthenet.org/feed/atom">Reclaim The Net</a>
      <a href="https://restoreprivacy.com/feed/atom/">Restore Privacy</a>
      <a href="https://fosstodon.org/@RTP.rss">(RTP) Privacy and Tech Tips</a>
      <a href="https://schneier.com/feed/atom/">Schneier on Security</a>
      <a href="https://securityintelligence.com/feed/atom/">Security Intelligence</a>
      <a href="https://simpleit.rocks/index.xml">Simple IT Rocks</a>
      <a href="https://simplifiedprivacy.com/feed/">Simplified Privacy</a>
      <a href="https://rss.slashdot.org/Slashdot/slashdotIt">Slashdot: IT</a>
      <a href="https://takebackourtech.org/rss/">Take Back Our Tech</a>
      <a href="https://taosecurity.blogspot.com/feeds/posts/default">TaoSecurity</a>
      <a href="https://proton.me/blog/feed">The Proton Journal</a>
      <a href="https://torrentfreak.com/feed/atom/">TorrentFreak</a>
      <a href="https://venturebeat.com/feed/atom/">VentureBeat</a>
    </div>
    <div class="category" id="data">
      <h5>Data &amp; OSINT</h5>
      <a href="https://jcchouinard.com/feed/atom/">JC Chouinard</a>
      <a href="https://northdata.com/feed.rss?global=true">North Data</a>
      <a href="https://blog.northdata.com/rss.xml">North Data Journal</a>
      <a href="https://opencorporates.com/feed/index.xml">OpenCorporates</a>
    </div>
    <div class="category" id="forum">
      <h5>Discussions, Forums &amp; Message Boards</h5>
      <div class="subcategory">
        <h4>Art, Literature and Music</h4>
        <a href="https://forum.librivox.org/app.php/feed">LibriVox</a>
        <a href="https://community.metabrainz.org/posts.rss">MusicBrainz</a>
        <a href="https://usingenglish.com/forum/forums/-/index.rss">UsingEnglish.com</a>
      </div>
      <div class="subcategory">
        <h4>Automation</h4>
        <a href="https://community.home-assistant.io/posts.rss">Home Assistant</a>
        <a href="https://huggingface.co/blog/feed.xml">Hugging Face</a>
        <a href="https://forum.fhem.de/index.php?action=.xml;type=atom">FHEM</a>
      </div>
      <div class="subcategory">
        <h4>Computer</h4>
        <a href="https://community.e.foundation/posts.rss">/e/OS community</a>
        <a href="https://arcolinux.com/feed/atom/">ArcoLinux</a>
        <a href="https://armbian.com/feed/atom/">Armbian</a>
        <a href="https://antixforum.com/feed/">antiX Linux</a>
        <a href="https://bbs.archlinux.org/extern.php?action=feed&amp;type=atom&amp;limit=20">Arch Linux</a>
        <a href="https://forum.artixlinux.org/index.php?action=.xml&amp;type=atom&amp;limit=20">Artix Linux</a>
        <a href="https://gitlab.com/divested-mobile.atom">DivestOS Mobile</a>
        <a href="https://forums.docker.com/posts.rss">Docker Community Forums</a>
        <a href="https://forum.endeavouros.com/posts.rss">EndeavourOS</a>
        <a href="https://forums.freebsd.org/forums/-/index.rss">FreeBSD</a>
        <a href="https://forum.garudalinux.org/posts.rss">Garuda Linux</a>
        <a href="https://discourse.gnome.org/posts.rss">GNOME</a>
        <a href="https://hardforum.com/forums/-/index.rss">[H]ard</a>
        <a href="https://forums.kali.org/external.php?type=RSS2">Kali Linux</a>
        <a href="http://board.kolibrios.org/app.php/feed">KolibriOS (FASM)</a>
        <a href="https://linux.org/articles/index.rss">Linux.org</a>
        <a href="https://forum.linux-hardware.org/index.php?action=.xml&amp;type=atom&amp;limit=20">Linux Hardware Review</a>
        <a href="https://forum.mxlinux.org/feed">MX Linux</a>
        <a href="https://discourse.nixos.org/posts.rss">NixOS</a>
        <a href="https://labs.parabola.nu/projects/parabola-community-forum/boards/4.atom">Parabola Community Forum</a>
        <a href="https://pclinuxos.com/forum/index.php?type=atom&amp;action=.xml">PCLinuxOS</a>
        <a href="https://forum.pine64.org/syndication.php?type=atom1.0">PINE64</a>
        <a href="https://psx-place.com/forums/-/index.rss">PSX-Place</a>
        <a href="https://sourceforge.net/p/rescuezilla/activity/feed">Rescuezilla (activity)</a>
        <a href="https://sourceforge.net/p/rescuezilla/discussion/feed.rss">Rescuezilla (discussion)</a>
        <a href="https://reactos.org/forum/app.php/feed">ReactOS</a>
        <a href="https://riscosopen.org/forum/posts.rss">ROOL Forum (RISC OS Open)</a>
        <a href="https://systemcrafters.net/rss/news.xml">System Crafters</a>
        <a href="https://portablefreeware.com/forums/app.php/feed">The Portable Freeware Collection Forums</a>
        <a href="https://thinkpad-forum.de/forums/-/index.rss">ThinkPad-Forum.de</a>
        <a href="http://usa.x10host.com/mybb/syndication.php?type=atom1.0">UserScripts Archive</a>
        <a href="https://forum.xda-developers.com/f/-/index.rss">XDA Developers</a>
      </div>
      <div class="subcategory">
        <h4>DIY and Household</h4>
        <a href="https://diychatroom.com/forums/-/index.rss">DIY Home Improvement</a>
        <a href="https://doityourself.com/forum/external.php?type=RSS2">DoItYourself.com</a>
        <a href="https://houserepairtalk.com/forums/-/index.rss">Home Improvement, Remodeling &amp; Repair</a>
      </div>
      <div class="subcategory">
        <h4>Games and Multimedia</h4>
        <a href="https://discourse.ardour.org/posts.rss">Ardour</a>
        <a href="http://stream-recorder.com/forum/external.php?type=RSS2">Audio/video stream recording forums</a>
        <a href="https://crossfire.nu/feed/threads">Crossfire</a>
        <a href="https://gamingonlinux.com/forum_rss.php">GamingOnLinux</a>
        <a href="https://head-fi.org/forums/-/index.rss">Head-Fi</a>
        <a href="https://hydrogenaud.io/index.php?action=.xml;type=atom;limit=20">HydrogenAudio</a>
        <a href="https://forums.libretro.com/posts.rss">Libretro</a>
        <a href="https://obsproject.com/forum/list/-/index.rss">OBS</a>
        <a href="http://forums.dumpshock.com/index.php?act=rssout&amp;id=1">Shadowrun Discussion</a>
        <a href="https://vogons.org/feed">VOGONS</a>
        <a href="https://forum.zdoom.org/app.php/feed">ZDoom</a>
      </div>
      <div class="subcategory">
        <h4>Miscellaneous</h4>
        <a href="https://discourse.asciinema.org/posts.rss">asciinema</a>
        <a href="https://happiness.com/rss/1-happinesscom-magazine.xml/">Happiness and Meditation</a>
        <a href="https://forum.invoiceninja.com/posts.rss">Invoice Ninja</a>
        <a href="https://solveforum.com/forums/forums/-/index.rss">SolveForum</a>
        <a href="https://stormfront.org/forum/external.php?type=RSS2">Stormfront</a>
        <a href="https://sqlite.org/forum/timeline.rss">SQLite</a>
        <a href="https://zigforums.com/xml/feed.rss">Zig</a>
      </div>
      <div class="subcategory">
        <h4>Nature</h4>
        <a href="https://climate-debate.com/feeds/threads.php" title="Earth is not a globe. There is no weather crisis.">Climate Debate</a>
        <a href="https://flatearth.freeforums.net/rss/public" title="Yes. You and I are living on an enclosed horizontal plane. Do not use the word 'Flat'. The word 'Flat' is a bad reference to our horizontal and level earth. The phrase 'Flat Earth' was intentionally made over the years in order to retract you from looking into this matter.">Level-Earth Education Forum</a>
        <a href="https://ifers.forumotion.com/feed/?type=atom" title="Yes. You and I are living on an enclosed horizontal plane. Do not use the word 'Flat'. The word 'Flat' is a bad reference to our horizontal and level earth. The phrase 'Flat Earth' was intentionally made over the years in order to retract you from looking into this matter.">IFERS (Horizontal and Level Earth)</a>
      </div>
      <div class="subcategory">
        <h4>Network, Privacy and Security</h4>
        <a href="https://community.bitwarden.com/posts.rss">Bitwarden</a>
        <a href="https://discourse.mailinabox.email/posts.rss">Mail-in-a-Box</a>
        <a href="https://discuss.privacyguides.net/posts.rss">Privacy Guides</a>
        <a href="https://smf.rantradio.com/index.php?type=atom;action=.xml">RantMedia Forum</a>
      </div>
      <div class="subcategory">
        <h4>Telecommunication</h4>
        <a href="https://community.asterisk.org/posts.rss">Asterisk</a>
        <a href="https://meta.getaether.net/posts.rss">Meta Aether</a>
        <a href="http://i2pforum.i2p/app.php/feed">I2P support</a>
        <a href="https://discuss.ipfs.tech/posts.rss">IPFS Forums</a>
        <a href="https://forum.jami.net/posts.rss">Jami</a>
        <a href="https://community.jitsi.org/posts.rss">Jitsi</a>
        <a href="https://forum.tribler.org/latest.rss">Tribler</a>
      </div>
    </div>
    <div class="category" id="diy">
      <h5>DIY, 3D Modeling &amp; Printing, Architecture and Crafting</h5>
      <a href="https://all3dp.com/feed/newsfeed">All3DP</a>
      <a href="http://tracker2.postman.i2p/?view=RSS&amp;mapset=85701">Cad/3D Printing</a>
      <a href="https://designoptimal.com/feed/atom/">DesignOptimal</a>
      <a href="https://doityourself.com/feed">Doityourself.com</a>
      <a href="https://elementalchile.cl/en/feed/atom/">Elemental</a>
      <a href="https://familyhandyman.com/feed/atom/">Family Handyman</a>
      <a href="https://mom-on-a-mission.blog/all-posts?format=rss">Mom on a Mission</a>
      <a href="https://opensourceecology.org/feed/atom/">Open Source Ecology</a>
      <a href="https://tpb.party/rss/new/605">Physibles (TPB)</a>
      <a href="https://systemcrafters.net/rss/news.xml">System Crafters</a>
      <a href="http://yorik.uncreated.net/feed">Yorik's journal</a>
    </div>
    <div class="category" id="wiki">
      <h5>Documentation, Issue Trackers &amp; WikiMedia</h5>
      <a href="https://wiki.alpinelinux.org/w/api.php?hidebots=1&amp;urlversion=1&amp;days=7&amp;limit=50&amp;action=feedrecentchanges&amp;feedformat=atom">Alpine Linux</a>
      <a href="https://wiki.archlinux.org/api.php?hidebots=1&amp;urlversion=1&amp;days=7&amp;limit=50&amp;action=feedrecentchanges&amp;feedformat=atom">ArchWiki</a>
      <a href="https://sourceforge.net/p/aros/activity/feed">AROS Research Operating System</a>
      <a href="https://sourceforge.net/p/butt/activity/feed">Broadcast Using This Tool</a>
      <a href="https://coreboot.org/api.php?hidebots=1&amp;urlversion=1&amp;days=7&amp;limit=50&amp;action=feedrecentchanges&amp;feedformat=atom">coreboot</a>
      <a href="https://doomwiki.org/w/api.php?hidebots=1&amp;days=7&amp;limit=50&amp;hidecategorization=1&amp;action=feedrecentchanges&amp;feedformat=atom">DoomWiki.org</a>
      <a href="https://wiki.greasespot.net/api.php?hidebots=1&amp;urlversion=1&amp;days=7&amp;limit=50&amp;action=feedrecentchanges&amp;feedformat=atom">GreaseSpot Wiki</a>
      <a href="https://indieweb.org/wiki/api.php?hidebots=1&amp;urlversion=1&amp;days=7&amp;limit=50&amp;action=feedrecentchanges&amp;feedformat=atom">IndieWeb</a>
      <a href="https://community.kde.org/api.php?hidebots=1&amp;urlversion=1&amp;days=7&amp;limit=50&amp;action=feedrecentchanges&amp;feedformat=atom">KDE Community</a>
      <a href="https://userbase.kde.org/api.php?hidebots=1&amp;translations=filter&amp;urlversion=1&amp;days=7&amp;limit=50&amp;action=feedrecentchanges&amp;feedformat=atom">KDE UserBase</a>
      <a href="http://websvn.kolibrios.org/rss.php?repname=Kolibri+OS&amp;path=%2F&amp;isdir=1&amp;">Kolibri OS</a>
      <a href="https://linux-sunxi.org/api.php?hidebots=1&amp;urlversion=1&amp;days=7&amp;limit=50&amp;action=feedrecentchanges&amp;feedformat=atom">linux-sunxi.org</a>
      <a href="http://source.netsurf-browser.org/netsurf.git/atom/?h=master">NetSurf Browser</a>
      <a href="https://wiki.postmarketos.org/api.php?hidebots=1&amp;urlversion=1&amp;days=7&amp;limit=50&amp;action=feedrecentchanges&amp;feedformat=atom">postmarketOS</a>
      <a href="https://sourceforge.net/p/rescuezilla/activity/feed">Rescuezilla</a>
      <a href="https://gitlab.riscosopen.org/RiscOS.atom">RiscOS activity</a>
      <a href="https://riscosopen.org/tracker/rss/tickets">ROOL Tracker</a>
      <a href="https://sourceforge.net/p/salix/activity/feed">Salix OS</a>
      <a href="https://wiki.syslinux.org/wiki/api.php?hidebots=1&amp;days=7&amp;limit=50&amp;hidecategorization=1&amp;action=feedrecentchanges&amp;feedformat=atom">Syslinux</a>
      <a href="https://mirror.git.trinitydesktop.org/cgit/tde/atom/?h=master">Trinity Desktop Environment (tde, branch master)</a>
      <a href="https://bugs.trinitydesktop.org/buglist.cgi?query_format=advanced&amp;title=Bug%20List&amp;ctype=atom">Trinity Bug List</a>
      <a href="https://wiki.trinitydesktop.org/api.php?hidebots=1&amp;urlversion=1&amp;days=7&amp;limit=50&amp;action=feedrecentchanges&amp;feedformat=atom">Trinity Desktop Project</a>
      <a href="https://wikispooks.com/w/api.php?hidebots=1&amp;urlversion=1&amp;days=7&amp;limit=50&amp;action=feedrecentchanges&amp;feedformat=atom">Wikispooks</a>
      <a href="https://wiki.znc.in/api.php?hidebots=1&amp;urlversion=1&amp;days=7&amp;limit=50&amp;action=feedrecentchanges&amp;feedformat=atom">ZNC</a>
    </div>
    <div class="category" id="nature">
      <h5>Earth, History, Nature, Science &amp; Weather</h5>
      <a href="https://ericdubay.wordpress.com/feed/atom/">EricDubay.com</a>
      <a href="https://geograph.org.uk/discuss/syndicator.php?forum=1&amp;first=1">Geograph</a>
      <a href="https://nhc.noaa.gov/aboutrss.shtml">National Hurricane Center And
Central Pacific Hurricane Center</a>
      <a href="https://weather.gov/rss_page.php?site_name=nws">National Weather Service</a>
      <a href="https://roaring.earth/feed/atom/">Roaring Earth</a>
      <a href="https://climbing.com/feed/atom">Climbing</a>
      <a href="http://rssweather.com/">RSS Weather</a>
      <a href="http://atlanteanconspiracy.com/feeds/posts/default">The Atlantean Way</a>
      <a href="https://vetclassics.com/feed/atom/">VETCLASSICS</a>
    </div>
    <div class="category" id="hacking">
      <h5>Electronics, Hardware &amp; Robotics</h5>
      <a href="https://baylibre.com/feed/atom/">BayLibre</a>
      <a href="https://c0ffee.net/rss/">c0ffee</a>
      <a href="https://ccc.de/de/rss/updates.xml">Chaos Computer Club</a>
      <a href="https://complete.org/index.xml">complete.org</a>
      <a href="https://crlf.link/feed.xml">&amp;Cr&#59; &amp;Lf</a>
      <a href="http://dangerousprototypes.com/blog/feed/atom/">Dangerous Prototypes</a>
      <a href="https://pyra-handheld.com/boards/forums/-/index.rss">DragonBox (Pyra and Pandora)</a>
      <a href="https://dojofordrones.com/feed/atom/">Drone Dojo</a>
      <a href="https://electro.pizza/feed.xml">electro·pizza</a>
      <a href="https://blog.flipperzero.one/rss/">Flipper Zero Journal</a>
      <a href="https://getdroidtips.com/feed/atom/">Get Droid Tips</a>
      <a href="https://hnrss.org/frontpage">Hacker News</a>
      <a href="https://homehack.nl/feed/atom/">HomeHack</a>
      <a href="http://righto.com/feeds/posts/default">Ken Shirriff's journal</a>
      <a href="https://knuxify.github.io/blog/feed.xml">knuxify’s journal</a>
      <a href="https://louwrentius.com/feed/all.atom.xml">Louwrentius</a>
      <a href="https://mansfield-devine.com/speculatrix/feed/">Machina Speculatrix</a>
      <a href="http://moderntoil.com/?feed=rss2">Modern Toil</a>
      <a href="https://n-o-d-e.net/rss/rss.xml">N O D E</a>
      <a href="https://notenoughtech.com/feed/">NotEnoughTECH</a>
      <a href="https://mastodon.social/@olimex.rss">Olimex</a>
      <a href="https://open-electronics.org/feed/atom/">Open Electronics</a>
      <a href="https://pimylifeup.com/feed/">Pi My Life Up</a>
      <a href="https://raspberrytips.com/feed/">RaspberryTips</a>
      <a href="https://rfidresearchgroup.com/feed/">RFID Research Group</a>
      <a href="https://smartbuilds.io/feed/">SmartBuilds</a>
      <a href="https://thedronegirl.com/feed/">The Drone Girl</a>
      <a href="https://webring.xxiivv.com/#rss">Webring (index)</a>
      <a href="https://wellerpcb.com/feed/">Weller PCB</a>
      <a href="https://xnux.eu/rss.xml">xnux.eu</a>
    </div>
    <div class="category" id="family">
      <h5>Family, Fitness, Leisure &amp; Travel</h5>
      <a href="https://baldandbeards.com/feed/atom/">Bald &amp; Beards</a>
      <a href="https://blastaloud.com/feed/atom/">BlastAloud</a>
      <a href="https://dailyurbanista.com/feed/atom/">Daily Urbanista</a>
      <a href="https://divinelifestyle.com/feed/atom/">Divine Lifestyle</a>
      <a href="https://expertvagabond.com/feed/">Expert Vagabond</a>
      <a href="https://girlschase.com/rss.xml">Girls Chase</a>
      <a href="https://gmb.io/feed/atom/">GMB Fitness</a>
      <a href="https://www.imom.com/feed/atom/">iMOM</a>
      <a href="http://elizabethfoss.com/journal?format=rss">In The Heart of My Home</a>
      <a href="https://latest-fashion-tips.com/feed/">Latest Fashion Tips</a>
      <a href="https://lifeadvancer.com/feed/">Life Advancer</a>
      <a href="https://mom-on-a-mission.blog/all-posts?format=rss">Mom on a Mission</a>
      <a href="https://rebelliousdevelopment.com/feed">Rebellious Development</a>
      <a href="https://artofmanliness.com/feed/atom/">The Art of Manliness</a>
      <a href="https://thebaldbrothers.com/feed/atom/">The Bald Brothers</a>
      <a href="https://theeverygirl.com/feed/atom/">The Everygirl</a>
      <a href="https://thefrugalgirls.com/feed/atom">The Frugal Girls</a>
      <a href="https://trip101.com/feed">Trip101</a>
    </div>
    <div class="category" id="fantasy">
      <h5>Fantasy, Fiction &amp; Pseudo-Science</h5>
      <p>The following sites are manipulative disinformation sites that mostly contain large amounts of AI and CGI type of images, and do not provide verifiable proofs to their fabricated and made up claims.</p>
      <a href="https://blog.discoveryeducation.com/feed/">Discovery Indoctrination Journal</a>
      <a href="https://futurism.com/feed">Futurism</a>
      <a href="https://nasa.gov/feeds/iotd-feed" title="SA(T)AN">NASA</a>
      <a href="https://nature.com/nature.rss">Nature</a>
      <a href="https://sciencealert.com/feed">ScienceAlert</a>
      <a href="https://sciencedaily.com/rss/all.xml">ScienceDaily</a>
      <a href="https://scitechdaily.com/feed/">SciTechDaily</a>
      <a href="https://storiesbywilliams.com/feed/">Stories by Williams</a>
    </div>
    <div class="category" id="news">
      <h5>Government, His-story, Media, Politics &amp; World Affairs News</h5>
      <a href="https://12bytes.org/feed.xml">12bytes.org</a>
      <a href="https://alternet.org/feeds/feed.rss">AlterNet</a>
      <!-- Intel Strike. his is not over yet. -->
      <!-- a href="https://blacklistednews.com/rss.php">BlackListed News</a -->
      <a href="http://cafe.nfshost.com/?feed=atom">CAFE: Canadian Association for Free Expression</a>
      <a href="https://historiography-project.org/feed/">Clippings and Commentary</a>
      <a href="https://cryptogon.com/?feed=atom">cryptogon</a>
      <a href="https://mastodon.social/@Cryptome.rss">Cryptome</a>
      <a href="https://spiegel.de/international/index.rss">DER SPIEGEL</a>
      <a href="http://dprogram.net/feed/">Dprogram.net - Countering Propaganda</a>
      <a href="https://earthnewspaper.com/feed/atom/">EarthNewspaper.com</a>
      <a href="https://fakeologist.com/feed/atom/">Fakeologist</a>
      <a href="https://freedomain.com/feed/atom/">Freedomain – The no. 1 philosophy show online</a>
      <a href="https://historicly.net/feed">Historic.ly</a>
      <a href="https://informationliberation.com/rss.xml">Information Liberation</a>
      <a href="https://icij.org/feed/">International Consortium of Investigative Journalists</a>
      <a href="https://iep.utm.edu/feed/atom/">Internet Encyclopedia of Philosophy</a>
      <a href="https://irishexaminer.com/feed/35-top_news.xml">Irish Examiner</a>
      <a href="https://jermwarfare.com/feed">Jerm Warfare</a>
      <a href="https://tube.kla.tv/feeds/videos.xml?videoChannelId=5">Kla.TV - klagemauer.TV</a>
      <a href="https://leohohmann.com/feed/">Leo Hohmann</a>
      <a href="https://medialens.org/feed/">Media Lens</a>
      <a href="https://mintpressnews.com/feed/">MintPress News</a>
      <a href="https://api.ntd.com/feed">NTD Television</a>
      <a href="https://off-guardian.org/feed/">OffGuardian</a>
      <a href="https://pjnewsletter.com/feed">Patriot Journal</a>
      <a href="https://presstv.ir/rss.xml">Press TV</a>
      <a href="https://presswatchers.org/feed/">Press Watch</a>
      <a href="https://redice.tv/rss/news">Red Ice News</a>
      <a href="https://rmx.News/feed/">Remix News</a>
      <a href="https://seymourhersh.substack.com/feed">Seymour Hersh</a>
      <a href="https://rss.slashdot.org/Slashdot/slashdotMain">Slashdot</a>
      <a href="https://stevekirsch.substack.com/feed">Steve Kirsch</a>
      <a href="https://stewpeters.com/feed/atom/">Stew Peters</a>
      <a href="https://strategicinvestment.com/page/str/rssfeed.xml">Strategic Investment</a>
      <a href="https://sandrafinley.ca/blog/?feed=rss2">The Battles</a>
      <a href="https://canadianpatriot.org/feed/">the Canadian patriot</a>
      <a href="https://theconsciousresistance.com/feed/">The Conscious Resistance Network</a>
      <a href="https://dailysceptic.org/feed/">The Daily Sceptic</a>
      <a href="https://thegatewaypundit.com/feed/">The Gateway Pundit</a>
      <a href="https://interpretermag.com/feed/">The Interpreter</a>
      <a href="http://themostimportantnews.com/feed/atom">The Most Important News</a>
      <a href="https://theorganicprepper.com/feed/atom/">The Organic Prepper</a>
      <a href="https://thepeoplesvoice.tv/feed/atom/">The People's Voice</a>
      <a href="https://vigilantcitizen.com/feed/atom/">The Vigilant Citizen</a>
      <a href="https://truthstreammedia.com/feed/atom/">Truthstream Media</a>
      <a href="https://unlimitedhangout.com/feed/atom/">Unlimited Hangout</a>
      <a href="https://vdare.com/generalfeed">VDARE</a>
      <a href="https://veteranstoday.com/feed/">VT Foreign Policy</a>
    </div>
    <div class="category" id="health">
      <h5>Health, Nutrition &amp; Recipes</h5>
      <a href="https://101cookbooks.com/feed">101 Cookbooks</a>
      <a href="https://asweetpeachef.com/feed/">A Sweet Pea Chef</a>
      <a href="https://annalenashearthbeat.com/feed/">Annalena's Heart(h)beat</a>
      <a href="https://askannamoseley.com/feed/">Ask Anna</a>
      <a href="https://based.cooking/index.xml">Based Cooking</a>
      <a href="https://bonappetit.com/feed/rss">Bon Appétit</a>
      <a href="https://cooknourishbliss.com/feed/">Cook Nourish Bliss</a>
      <a href="https://easycookingwithmolly.com/feed/">Easy Cooking with Molly</a>
      <a href="http://easypeasyjapanesey.com/blogeasypeasyjapanesey?format=rss">Easy Peasy Japanesey</a>
      <a href="https://farmersforum.com/feed/">Farmers Forum</a>
      <!--a href="https://fathub.org/feed/">FatHub</a-->
      <a href="http://foodly.com/feed/">Foodly</a>
      <a href="https://freezedryguy.com/feed/">Freeze Dry Guy</a>
      <a href="https://heathenherbs.com/feed/">Heathen Herbs</a>
      <a href="https://healthyandnaturalworld.com/feed/">Healthy and Natural World</a>
      <a href="https://jamieoliver.com/feed/">Jamie Oliver</a>
      <a href="https://jacobwsmith.xyz/cookbook/rss.xml">Jacob's Guide to Possibly Delicious Food</a>
      <a href="https://juicing-for-health.com/feed">Juicing for Health</a>
      <a href="https://loveandlemons.com/feed/">Love &amp; Lemons</a>
      <a href="https://thoughts.melonking.net/atom/?section=recipes">Melon's Thoughts - Recipes</a>
      <a href="https://articles.mercola.com/sites/articles/rss.aspx">Mercola.com</a>
      <a href="https://mindful.org/feed/">Mindful</a>
      <a href="https://themythicbox.com/feed/">Mythic food</a>
      <a href="https://nutritionaustralia.org/category/recipes/feed/">Nutrition Australia</a>
      <a href="https://pinchofyum.com/feed">Pinch of Yum</a>
      <a href="https://plantbasedwithamy.com/feed/">Plant Based with Amy</a>
      <a href="https://punchdrink.com/feed/">PUNCH</a>
      <a href="https://marginalia.nu/recipes/index.xml">Recipes on marginalia.nu</a>
      <a href="https://recipeswitholiveoil.com/feed/">Recipes With Olive Oil</a>
      <a href="https://sallysbakingaddiction.com/feed/">Sally's Baking Addiction</a>
      <a href="https://sheknows.com/food-and-recipes/feed/">SheKnows</a>
      <a href="https://steptohealth.com/feed/">Step To Health</a>
      <a href="https://stevekirsch.substack.com/feed">Steve Kirsch</a>
      <a href="https://stopdirtyelectricity.com/feed/">Stop Dirty Electricity</a>
      <a href="https://thegreenloot.com/feed/">The Green Loot</a>
      <a href="https://theprettybee.com/feed/">The Pretty Bee</a>
      <a href="https://traditionalcookingschool.com/feed/">Traditional Cooking School</a>
      <a href="https://wonderfulcook.com/feed/">Wonderful Cook</a>
    </div>
    <div class="category" id="music">
      <h5>Music, Radio, Scores &amp; Sound</h5>
      <a href="https://320kbpshouse.net/feed">320KBPSHOUSE</a>
      <a href="https://acidstag.com/feed/">Acid Stag</a>
      <a href="https://free-scores.com/rss/fluxrss-uk.xml">Free-Scores</a>
      <a href="https://frostclick.com/wp/index.php/feed/">FrostClick</a>
      <a href="https://homemusicproducer.com/rsslatest.xml">Home Music Producer</a>
      <a href="https://imslp.org/wiki/Special:IMSLPRecordingsFeed/atom">IMSLP Recent Recordings</a>
      <a href="https://indiegamemusic.com/rss.php?f=1">IndieGameMusic</a>
      <a href="https://intmusic.net/feed">IntMusic</a>
      <a href="https://itopmusicx.com/feed/">iTOPMUSICX</a>
      <a href="https://downloads.khinsider.com/rss">KHInsider Video Game Music</a>
      <a href="https://legismusic.com/feed/">Legis Music</a>
      <a href="https://losslessclub.com/atom.php">LosslessClub</a>
      <a href="https://musicaustria.at/feed/">mica – music austria</a>
      <a href="https://nfodb.ru/rss.php">MP3 NFO Database</a>
      <a href="https://tpb.party/rss/new/101">Music (TPB)</a>
      <a href="https://musicrider.org/feed/">Music Rider</a>
      <a href="https://music-scores.com/blog/feed/">Music Scores Journal</a>
      <a href="https://losslessalbums.club/rss.xml">New lossless albums</a>
      <a href="https://rss.ngfiles.com/latestsubmissions.xml">Newgrounds</a>
      <a href="https://rss.ngfiles.com/weeklyaudiotop5.xml">Newgrounds (Weekly Top 5)</a>
      <a href="https://opengameart.org/rss.xml">OpenGameArt</a>
      <a href="https://phish.in/feeds/rss">Phish.in</a>
      <a href="https://playonloop.com/feed/">PlayOnLoop</a>
      <a href="https://radioking.com/blog/feed/">RadioKing Journal</a>
      <a href="https://secondhandsongs.com/rss/new.xml">Second Hand Songs</a>
    </div>
    <div class="category" id="radio">
      <h5>Podcasts &amp; Radio</h5>
      <a href="https://media.ccc.de/podcast.xml">CCC (Chaos Computer Club)</a>
      <a href="https://files.manager-tools.com/files/public/feeds/career_tools_podcasts.xml">Career Tools</a>
      <a href="https://clownfishtv.com/feed/atom/">CFTV (ClownfishTV)</a>
      <a href="https://feeds.megaphone.fm/darknetdiaries">Darknet Diaries</a>
      <a href="https://fakeologist.com/blog/category/audio/fakeologistshow/feed/">Fakeologist Show</a>
      <a href="http://hackerpublicradio.org/hpr_spx_rss.php">Hacker Public Radio</a>
      <a href="https://iceagefarmer.com/feed/atom/">Ice Age Farmer</a>
      <a href="https://jameshfetzer.org/feed/">James H. Fetzer</a>
      <a href="https://johnderbyshire.com/feed.xml">John Derbyshire's Commentaries</a>
      <a href="http://larkenrose.com/?format=feed&amp;type=atom">Larken Rose</a>
      <a href="https://files.manager-tools.com/files/public/feeds/manager-tools-podcasts.xml">Manager Tools</a>
      <a href="https://mediamonarchy.com/feed/podcast/">Media Monarchy</a>
      <a href="https://feed.podbean.com/ediviney/feed.xml">Midwest Vegan Radio</a>
      <a href="http://opensourcetruth.com/feed/atom/">Open Source Truth</a>
      <a href="https://optoutpod.com/index.xml">Opt Out</a>
      <a href="https://osnews.com/feed/podcast/">OSnews</a>
      <a href="https://rss.podomatic.net/rss/peacerevolution.podomatic.com/rss2.xml">Peace Revolution</a>
      <a href="https://pine64.org/feed/mp3/">PineTalk</a>
      <a href="https://cast.postmarketos.org/feed.rss">postmarketOS</a>
      <a href="https://redice.tv/rss/radio-3fourteen">Radio 3Fourteen</a>
      <a href="https://reallibertymedia.com/rss/">Real Liberty Media</a>
      <a href="https://redice.tv/rss/red-ice-radio">Red Ice Radio</a>
      <a href="https://redice.tv/rss/red-ice-tv">Red Ice TV</a>
      <a href="http://revolutionradio.org/feed/atom/">Revolution Radio</a>
      <a href="https://feed.podbean.com/rightonradio/feed.xml">Right on Radio</a>
      <a href="https://roaring.earth/category/podcast/feed/">Roaring Earth</a>
      <a href="https://shrinkrapradio.com/feed/atom/">Shrink Rap Radio</a>
      <a href="https://speakfreeradio.com/feed/atom/">Speak Free Radio</a>
      <a href="https://talkpython.fm/episodes/rss">Talk Python To Me</a>
      <a href="https://corbettreport.com/feed/atom/">The Corbett Report</a>
      <a href="https://thehighersidechats.com/feed/atom/">The Higherside Chats</a>
      <a href="http://robbwolf.com/feed/atom/">The Paleo Diet</a>
      <a href="http://truthstreammedia.com/feed/atom/">Truthstream Media</a>
      <a href="https://youarenotsosmart.com/feed/atom/">You Are Not So Smart</a>
    </div>
    <div class="category" id="shopping">
      <h5>Product, Real Estate, Services, Shopping Reviews &amp; Stores</h5>
      <a href="https://alohakb.com/collections/all.atom">ALOHAKB</a>
      <a href="https://cambodiaproperty.info/feed/">Cambodia Property</a>
      <a href="https://faddis.com/feed">Faddis Concrete</a>
      <a href="https://fanlesstech.com/feeds/posts/default">FanlessTech</a>
      <a href="https://fincadracula.com/en/feed/">Finca Drácula</a>
      <a href="https://fossbytes.com/feed/">Fossbytes</a>
      <a href="https://gearrice.com/web-stories/feed/">Gearrice</a>
      <a href="https://geartaker.com/feed/">Gear Taker</a>
      <a href="https://geniatech.com/products/embedded-mainboards/feed/">Geniatech</a>
      <a href="https://gizmochina.com/feed/">Gizmochina</a>
      <a href="https://guru3d.com/atom.xml">Guru of 3D</a>
      <a href="https://headfonia.com/feed/">Headfonia</a>
      <a href="https://headfonics.com/feed/">Headfonics</a>
      <a href="https://headphone.guru/feed/">Headphone Guru</a>
      <a href="https://kbdfans.com/collections/all.atom">KBDfans® Mechanical Keyboards Store</a>
      <a href="https://lab401.com/collections/flipper-zero.atom">Lab401</a>
      <a href="https://liliputing.com/feed/">Liliputing</a>
      <a href="https://megabites.com.ph/feed/">MegaBites</a>
      <a href="https://mouser.com/rss/rss.xml">Mouser Electronics Inc.</a>
      <a href="https://newatlas.com/index.rss">New Atlas</a>
      <a href="https://notebookcheck.net/RSS-Feed-Notebook-Reviews.8156.0.html">Notebook Reviews</a>
      <a href="https://phonearena.com/feed/news">PhoneArena</a>
      <a href="https://pocket-lint.com/feed/">Pocket-lint</a>
      <a href="https://protoolreviews.com/feed/">Pro Tool Reviews</a>
      <a href="https://productsfromcyprus.com/collections/all.atom">Products from Cyprus</a>
      <a href="https://producthunt.com/feed">Product Hunt</a>
      <a href="https://russh.com/feed/">RUSSH</a>
      <a href="https://sheknows.com/feed/">SheKnows</a>
      <a href="https://simplynuc.com/feed/">Simply NUC</a>
      <a href="https://soundvisionreview.com/feed/">SoundVisionReview</a>
      <a href="https://techbuy.in/feed/">TechBuy</a>
      <a href="https://techpowerup.com/rss/news">TechPowerUp</a>
      <a href="https://the-gadgeteer.com/feed/">The Gadgeteer</a>
      <a href="https://trustedreviews.com/feed">Trusted Reviews</a>
      <a href="https://tweakers.net/feeds/mixed.xml">Tweakers Mixed</a>
    </div>
    <div class="category" id="activism">
      <h5>Social Action (Activism)</h5>
      <a href="http://cafe.nfshost.com/?feed=atom">CAFE: Canadian Association for Free Expression</a>
      <a href="http://campaignforliberty.org/feed/atom">Campaign for Liberty</a>
      <a href="https://demandprogress.org/feed/">Demand Progress</a>
      <a href="https://derrickbroze.com/feed/">Derrick Broze</a>
      <a href="https://doctors4covidethics.org/feed/">Doctors for COVID Ethics</a>
      <a href="https://fightforthefuture.org/news/feed.xml">Fight for the Future</a>
      <a href="https://fluoridealert.org/feed/">Fluoride Action Network</a>
      <a href="https://geoengineeringwatch.org/feed/atom/">Geoengineering Watch</a>
      <a href="https://nlnet.nl/feed.atom">NLnet Foundation</a>
      <a href="https://participatorypolitics.org/feed/">Participatory Politics Foundation</a>
      <a href="http://live-personaldemocracy.pantheonsite.io/rss.xml">Personal Democracy Forum</a>
      <a href="https://primarywater.org/?feed=rss2">Primary Water</a>
      <a href="https://publicknowledge.org/feed/atom/">Public Knowledge</a>
      <a href="https://reclaimyourface.eu/feed/atom/">Reclaim Your Face</a>
      <a href="https://saveusnow.org.uk/feed/atom/">SUN (Save Us Now)</a>
      <a href="https://sfconservancy.org/feeds/news/">Software Freedom Conservancy</a>
      <a href="https://stop5g.cz/us/feed/atom/">Stop 5G</a>
      <a href="https://stopdirtyelectricity.com/feed/">Stop Dirty Electricity</a>
      <a href="http://stopsprayingus.com/feed/">Stop Spraying Us!</a>
      <a href="https://stopthecrime.net/wp/feed/">Stop The Crime</a>
      <a href="https://takebackourtech.org/rss/">Take Back Our Tech</a>
      <a href="https://theconsciousresistance.com/feed/">The Conscious Resistance Network</a>
    </div>
    <div class="category" id="technology">
      <h5>Software, Guides, Reviews &amp; Technology</h5>
      <a href="http://feeds.arstechnica.com/arstechnica/index">Ars Technica</a>
      <a href="https://cnx-software.com/feed/">CNX Software</a>
      <a href="https://comparitech.com/feed/">Comparitech</a>
      <a href="https://computer.rip/rss.xml">computers are bad</a>
      <a href="https://disguised.work/atom.xml">Debian Disguised Work</a>
      <a href="https://ddos-guard.net/rss">DDoS-GUARD</a>
      <a href="https://dedoimedo.com/rss_feed.xml">Dedoimedo</a>
      <a href="https://spiegel.de/thema/energy_and_natural_resources_en/index.rss">DER SPIEGEL - Energy and Natural Resources</a>
      <a href="https://denx.de/feed/">DENX Software Engineering</a>
      <a href="https://distrowatch.com/news/news-headlines.xml">DistroWatch</a>
      <a href="https://evilsocket.net/atom.xml">evilsocket</a>
      <a href="https://blog.front-matter.io/atom/">Front Matter</a>
      <a href="https://gamingonlinux.com/article_rss.php">GamingOnLinux</a>
      <a href="https://ghacks.net/feed/">gHacks</a>
      <a href="https://guides.lw1.at/index.xml">guides.lw1.at</a>
      <a href="https://i2p.rocks/blog/feeds/all.atom.xml">i2p.rocks</a>
      <a href="https://incompetech.com/wordpress/feed/">incompetech</a>
      <a href="https://internetpkg.com/feed/">Internet Packages</a>
      <a href="https://planet.jabber.org/atom.xml">Jabber World</a>
      <a href="https://bgstack15.ddns.net/blog/rss.xml">Knowledge Base</a>
      <a href="https://cyber.dabamos.de/blog/feed.rss">Lazy Reading | The Cyber Vanguard</a>
      <a href="https://leimao.github.io/atom.xml">Lei Mao's Log Book</a>
      <a href="https://liliputing.com/feed/">Liliputing</a>
      <a href="https://linuxgameconsortium.com/feed/">Linux Game Consortium</a>
      <a href="https://linuxgizmos.com/feed/">Linux Gizmos</a>
      <a href="https://linmob.net/feed.xml">LINux on MOBile</a>
      <a href="https://linuxuprising.com/feeds/posts/default">Linux Uprising Journal</a>
      <a href="https://medevel.com/rss/">MEDevel</a>
      <a href="https://mrfunkedude.com/feed/">Mr. Funk E. Dude's Place</a>
      <a href="https://newatlas.com/index.rss">New Atlas</a>
      <a href="https://nerdstuff.org/index.xml">Nerd Stuff</a>
      <a href="https://cyberciti.com/feed/">nixCraft</a>
      <a href="https://nngroup.com/feed/rss/">NN/g latest articles and announcements</a>
      <a href="https://notebookcheck.net/News.152.100.html">NotebookCheck</a>
      <a href="https://blog.obco.pro/rss/">OblivionCoding</a>
      <a href="https://osnews.com/feed/">OSnews</a>
      <a href="https://ostechnix.com/feed/atom/">OSTechNix</a>
      <a href="https://pendrivelinux.com/feed/">Pen Drive Linux</a>
      <a href="https://phoronix.com/rss.php">Phoronix</a>
      <a href="https://simplified.guide/feed.php">Simplified Guide linux</a>
      <a href="https://singpolyma.net/feed/">Singpolyma</a>
      <a href="https://sourceforge.net/blog/feed/">SourceForge Community Journal</a>
      <a href="https://sqlservercentral.com/articles/feed">SQLServerCentral</a>
      <a href="https://srinimf.com/feed/">Srinimf</a>
      <a href="https://systemcrafters.net/rss/news.xml">System Crafters</a>
      <a href="https://tecmint.com/feed/">Tecmint</a>
      <a href="https://en.blog.nic.cz/category/turris/feed/">Turris</a>
      <a href="https://tuxphones.com/rss/">TuxPhones</a>
      <a href="https://tux.pizza/feed.xml">tux.pizza</a>
      <a href="https://warmcat.com/feed.xml">Warmcat</a>
    </div>
    <div class="category" id="package">
      <h5>Software Package Updates</h5>
      <a href="https://archhurd.org/feeds/packages/">Arch Hurd</a>
      <a href="https://archlinux.org/feeds/packages/">Arch Linux</a>
      <a href="https://aur.archlinux.org/rss/">Arch Linux (AUR)</a>
      <a href="https://ctan.org/ctan-ann/atom.xml">CTAN-ANN</a>
      <a href="https://distrowatch.com/news/dw.xml">DistroWatch</a>
      <a href="https://flathub.org/feeds">Flathub</a>
      <a href="https://freshports.org/backend/rss2.0.php">FreshPorts</a>
      <a href="https://extensions.gnome.org/rss/">GNOME Shell Extensions</a>
      <a href="https://greasyfork.org/en/scripts.atom?sort=updated">Greasy Fork</a>
      <a href="https://hyperbola.info/feeds/packages/">Hyperbola</a>
      <a href="https://store.kde.org/content.rdf">KDE Store</a>
      <a href="http://feeds.launchpad.net/announcements.atom">Launchpad</a>
      <a href="https://metacpan.org/recent.rss">MetaCPAN</a>
      <a href="https://opendesktop.org/content.rdf">OpenDesktop Linux Apps</a>
      <a href="https://open-store.io/rss/new.xml">OpenStore New Apps</a>
      <a href="https://open-store.io/rss/updates.xml">OpenStore Updated Apps</a>
      <a href="https://packagist.org/feeds/packages.rss">Packagist</a>
      <a href="https://parabola.nu/feeds/packages/">Parabola GNU/Linux-libre</a>
      <a href="https://pypi.org/rss/updates.xml">PyPI</a>
      <a href="https://slackbuilds.org/rss/ChangeLog.rss">SlackBuilds.org</a>
      <a href="https://xfce-look.org/content.rdf">Xfce-Look.org</a>
    </div>
    <div class="category" id="project">
      <h5>Software Project Updates</h5>
      <div class="subcategory">
        <h4>Language Models and Machine Learning (falsly called "Artificial Intelligence" and "LLM")</h4>
        <a href="https://news.agpt.co/feed/">Auto-GPT</a>
        <a href="https://huggingface.co/blog/feed.xml">Hugging Face</a>
        <a href="https://translatelocally.com/rss/">Translate Locally</a>
      </div>
      <div class="subcategory">
        <h4>Blockchain</h4>
        <a href="https://gostco.in/feed/">GOSTcoin</a>
        <a href="https://litecoin.com/rss.xml">Litecoin</a>
        <a href="https://getmonero.org/feed.xml">Monero</a>
        <a href="https://pirate.black/feed/">Pirate Chain (ARRR)</a>
      </div>
      <div class="subcategory">
        <h4>Communication and Social Platforms</h4>
        <a href="https://pod.diaspora.software/public/hq.atom">diaspora* HQ</a>
        <a href="https://dino.im/index.xml">Dino</a>
        <a href="https://blog.discourse.org/rss/">Discourse</a>
        <a href="https://ekiga.org/rss.xml">Ekiga</a>
        <a href="https://joinfirefish.org/rss.xml">Firefish</a>
        <a href="https://blog.funkwhale.audio/feeds/all.atom.xml">Funkwhale</a>
        <a href="https://gajim.org/index.xml">Gajim</a>
        <a href="https://jsxc.org/feed.xml">JSXC</a>
        <a href="https://jami.net/feed/">Jami</a>
        <a href="https://jitsi.org/feed/">Jitsi</a>
        <a href="https://community.jitsi.org/c/news/5.rss">Jitsi News</a>
        <a href="https://kaidan.im/atom.xml">Kaidan</a>
        <a href="https://discourse.mailinabox.email/c/announcements/9.rss">Mail-in-a-Box</a>
        <a href="https://mailcow.email/index.xml">Mailcow</a>
        <a href="https://blog.joinmastodon.org/index.xml">Mastodon</a>
        <a href="https://oxen.io/feed/atom">Oxen Session</a>
        <a href="https://joinpeertube.org/rss-en.xml">PeerTube</a>
        <a href="https://postmarks.glitch.me/index.xml">Postmarks</a>
        <a href="https://soapbox.pub/rss/atom.xml">Soapbox</a>
        <a href="https://typo3.org/rss">TYPO3</a>
      </div>
      <div class="subcategory">
        <h4>Desktop and Mobile Operating Systems</h4>
        <a href="https://artixlinux.org/feed.php">Artix Linux</a>
        <a href="https://bodhilinux.com/feed/">Bodhi Linux</a>
        <a href="https://gitlab.com/divested-mobile/divestos-build.atom">DivestOS-(activity)</a>
        <a href="https://droidian.org/index.xml">Droidian</a>
        <a href="https://dragonflydigest.com/feed/">DragonFly BSD Digest</a>
        <a href="https://e.foundation/feed/">e Foundation</a>
        <a href="https://fiwix.org/rss.xml">Fiwix</a>
        <a href="https://sourceforge.net/p/freedos/news/feed.rss">FreeDOS</a>
        <a href="https://blogs.gnome.org/pabloyoyoista/feed/">GNOME adventures in mobile</a>
        <a href="https://blogs.gnome.org/shell-dev/feed/">GNOME Shell &amp; Mutter</a>
        <a href="https://grapheneos.social/@GrapheneOS.rss">GrapheneOS</a>
        <a href="https://haiku-os.org/index.xml">Haiku Project</a>
        <a href="https://libreboot.org/feed.xml">Libreboot</a>
        <a href="https://blog.mobian.org/index.xml">Mobian</a>
        <a href="https://mobile.nixos.org/index.xml">Mobile NixOS</a>
        <a href="https://osmocom.org/news.atom">Open Source Mobile Communications</a>
        <a href="https://parabola.nu/feeds/news/">Parabola GNU/Linux-libre</a>
        <a href="https://pine64.org/feed/">PINE64</a>
        <a href="https://postmarketos.org/blog/feed.atom">postmarketOS</a>
        <a href="https://qemu.org/feed.xml">QEMU</a>
        <a href="https://reactos.org/index.xml">ReactOS</a>
        <a href="https://blog.replicant.us/feed/">Replicant</a>
        <a href="https://forum.salixos.org/app.php/feed/news">Salix OS</a>
        <a href="https://trinitydesktop.org/rss.php">Trinity Desktop Environment</a>
        <a href="https://ubports.com/blog/ubports-news-1/feed">UBports</a>
        <a href="https://devices.ubuntu-touch.io/new.xml">Ubuntu Touch</a>
        <a href="https://forums.whonix.org/c/news/21.rss">Whonix</a>
      </div>
      <div class="subcategory">
        <h4>Development and Statistics</h4>
        <a href="https://clojurescript.org/feed.xml">ClojureScript</a>
        <a href="https://git.zx2c4.com/cgit/atom/?h=master">cgit</a>
        <a href="https://fltk.org/index.rss">Fast Light Toolkit</a>
        <a href="https://flatassembler.Net/atom.Php">Flat Assembler</a>
        <a href="https://about.gitea.com/index.xml">Gitea</a>
        <a href="https://blog.gtk.org/feed/">GTK Toolkit</a>
        <a href="https://kde.org/index.xml">KDE Desktop</a>
        <a href="https://labplot.kde.org/feed/">LabPlot</a>
        <a href="https://lxqt-project.org/feed.xml">LXQt Desktop</a>
        <a href="https://plausible.io/blog/feed.xml">Plausible Analytics</a>
        <a href="https://pypy.org/rss.xml">PyPy</a>
        <a href="https://rubyonrails.org/feed.xml">Ruby on Rails</a>
        <a href="https://blog.rust-lang.org/feed.xml">Rust</a>
      </div>
      <div class="subcategory">
        <h4>Education</h4>
        <a href="https://gcompris.net/feed-en.xml">GCompris</a>
      </div>
      <div class="subcategory">
        <h4>Games</h4>
        <a href="https://play0ad.com/feed/">0 A.D.</a>
        <a href="https://forum.cubers.net/syndication.php?fid=8&amp;limit=5&amp;type=atom1.0">AssaultCube</a>
        <a href="https://itch.io/feed/featured.xml">itch.io Featured Games</a>
        <a href="https://libretro.com/index.php/feed/">Libretro (Lakka &amp; RetroArch)</a>
        <a href="https://scummvm.org/feeds/atom/">ScummVM</a>
        <a href="https://speed-dreams.net/en/feed/">Speed Dreams</a>
        <a href="https://supertux.org/feed.xml">SuperTux</a>
        <a href="https://winehq.org/news/rss/">WineHQ</a>
        <a href="https://xonotic.org/index.xml">Xonotic</a>
      </div>
      <div class="subcategory">
        <h4>Graphics, Multimedia and Office</h4>
        <a href="https://discourse.ardour.org/c/blog/15.rss">Ardour</a>
        <a href="https://sourceforge.net/p/butt/activity/feed">Broadcast Using This Tool</a>
        <a href="https://xiph.org/flac/feeds/feed.xml">FLAC</a>
        <a href="https://handbrake.fr/rss.php">HandBrake</a>
        <a href="https://jackaudio.org/atom.xml">JACK Audio Connection Kit</a>
        <a href="https://fosstodon.org/@libreoffice.rss">LibreOffice</a>
        <a href="https://obsproject.com/blog/rss">Open Broadcaster Software</a>
        <a href="https://owncast.online/index.xml">Owncast</a>
        <a href="https://phoboslab.org/log/feed">Phoboslab (QOA and QOI)</a>
        <a href="https://kdenlive.org/en/feed/">Kdenlive</a>
        <a href="https://ruffle.rs/feed.xml">Ruffle</a>
        <a href="https://khronos.org/feeds/news_feed">The Khronos Group Inc</a>
        <a href="https://edrlab.org/feed/">Thorium Reader</a>
        <a href="https://krita.org/en/feed/">Krita</a>
        <a href="http://un4seen.com/rss.xml">Un4seen Developments</a>
      </div>
      <div class="subcategory">
        <h4>Network and Telecommunication</h4>
        <a href="https://apps.kde.org/akregator/index.xml">Akregator</a>
        <a href="https://brave.com/index.xml">Brave Browser</a>
        <a href="https://dillo-browser.github.io/feed/">Dillo Browser</a>
        <a href="https://falkon.org/index.xml">Falkon Browser</a>
        <a href="https://github.com/Floorp-Projects/Floorp/releases.atom">Floorp</a>
        <a href="https://leafletjs.com/atom.xml">Leaflet Dev Journal</a>
        <a href="https://lemmy.ml/feeds/c/librewolf.xml?sort=Active">Librewolf</a>
        <a href="https://lzone.de/liferea/blog/feed.xml">Liferea</a>
        <a href="https://nagios.com/feed/atom/">Nagios</a>
        <a href="https://netnewswire.blog/feed.xml">NetNewsWire</a>
        <a href="https://blogs.gnome.org/thaller/feed/atom/">NetworkManager</a>
        <a href="https://otter-browser.org/feed/">Otter Browser</a>
        <a href="https://quiterss.org/en/rss.xml">QuiteRSS</a>
        <a href="https://servo.org/blog/feed.xml">Servo</a>
        <a href="https://sourceforge.net/p/shareaza/activity/feed">Shareaza</a>
        <a href="https://spidermonkey.dev/feed.xml">SpiderMonkey</a>
        <a href="https://uzbl.org/atom.xml">Uzbl Browser</a>
        <a href="https://webkit.org/feed/atom/">WebKit</a>
      </div>
      <div class="subcategory">
        <h4>Package Management and Recovery Tools</h4>
        <!-- a href="https://cydia.saurik.com/">Cydia App Store</a -->
        <a href="https://f-droid.org/feed.xml">F-Droid Store</a>
        <!-- a href="https://orangefox.tech/feed.xml">OrangeFox</a -->
        <a href="https://twrp.me/feed.xml">TWRP</a>
      </div>
      <div class="subcategory">
        <h4>Miscellaneous</h4>
        <a href="https://bitwarden.com/blog/feed.xml">Bitwarden</a>
        <a href="https://sourceforge.net/p/hyperic-hq/activity/feed">Hyperic Application &amp; System Monitoring</a>
        <a href="https://texample.net/feeds/community/">The TeX community aggregator</a>
        <a href="https://tug.org/rss/tug.xml">TeX Users Group</a>
        <a href="https://techhub.social/@TeXUsersGroup.rss">TeX Users Group Updates</a>
      </div>
      <div class="subcategory">
        <h4>Theme</h4>
        <a href="https://aquoid.com/feed/">Aquoid</a>
        <!-- a href="https://github.com/ClassicOS-Themes">ClassicOS</a -->
        <!-- a href="https://draculatheme.com/">Dracula Theme</a -->
        <!-- a href="https://numixproject.github.io/feed/">Numix Project</a -->
        <!-- a href="https://shimmerproject.org/feed/">Shimmer Project</a -->
      </div>
    </div>
    <div class="category" id="syndication">
      <h5>Syndication &amp; XML</h5>
      <a href="https://activitypub.rocks/feed.xml">ActivityPub Rocks!</a>
      <a href="https://rss-specifications.com/blog-feed.xml">An RSS Journal</a>
      <a href="https://dublincore.org/index.xml">Dublin Core</a>
      <a href="https://feedforall.com/blog-feed.xml">FeedForAll</a>
      <a href="https://jsonfeed.org/feed.xml">JSON Feed</a>
      <a href="https://microformats.org/feed">Microformats</a>
      <a href="https://openrss.org/rss">Open RSS</a>
      <a href="http://opml.org/?format=opml">OPML</a>
      <a href="https://rss-specifications.com/article-feed.xml">RSS and News Feed Articles</a>
      <a href="http://scripting.com/rss.xml">Scripting News</a>
      <a href="https://blog.saxonica.com/atom.xml">Saxonica</a>
      <a href="http://docs.subtome.com/feed.xml">SubToMe</a>
      <a href="https://sword.cottagelabs.com/feed/">SWORD</a>
      <a href="http://rss.userland.com/xml/rss.xml">UserLand RSS Central</a>
      <a href="http://xml.coverpages.org/covernews.xml">XML Cover Pages</a>
      <a href="https://xml.com/feed/all/">XML.com</a>
    </div>
    <div class="category" id="telecom">
      <h5>Telecom, Mesh &amp; Mix Protocols</h5>
      <a href="https://ethlimo.substack.com/feed">ETH.LIMO</a>
      <a href="https://gemini.circumlunar.space/news/atom.xml">Gemini Project</a>
      <a href="https://gnunet.org/en/rss.xml">GNUnet</a>
      <a href="https://gopher.zone/index.xml">Highway to the Gopher Zone</a>
      <a href="https://geti2p.net/en/feed/blog/atom">I2P Journal</a>
      <a href="https://blog.ipfs.io/index.xml">IPFS</a>
      <a href="https://mysterium.network/blog-feed.xml">Mysterium Network</a>
      <a href="https://blog.nymtech.net/feed">Nym</a>
      <a href="https://openwrt.org/feed.php?mode=list">OpenWrt</a>
      <a href="https://oxen.io/feed/atom">Oxen Lokinet</a>
      <a href="https://panoramix-project.eu/feed/">Panoramix</a>
      <a href="https://phillymesh.net/post/index.xml">Philly Mesh</a>
      <a href="https://blog.torproject.org/feed.xml">Tor Project</a>
      <a href="https://veilid.com/atom.xml">Veilid Project</a>
      <a href="https://w3.org/blog/news/feed/atom">W3C</a>
      <a href="https://xmpp.org/feeds/all.atom.xml">XMPP Journal</a>
      <a href="https://yggdrasil-network.github.io/feed.xml">Yggdrasil Network</a>
    </div>
    <div class="category" id="torrents">
      <h5>Torrents</h5>
      <a href="https://androidkino.net/rss.xml">AndroidKino (RU)</a>
      <a href="https://angietorrents.cc/rss.php?custom=1">AngieTorrents</a>
      <a href="https://anidex.info/rss/">AniDex Tracker (JA)</a>
      <a href="https://anirena.com/rss.php">AniRena (JA)</a>
      <a href="https://audiobookbay.is/feed/atom/">AudioBook Bay</a>
      <a href="https://bangumi.moe/rss/latest">Bangumi Moe</a>
      <a href="https://eztv.re/ezrss.xml">EZTV</a>
      <a href="http://firebit.org/rss.xml">FireBit</a>
      <a href="https://fosstorrents.com/feed/distribution.xml">FOSS Torrents - Distributions</a>
      <a href="https://fosstorrents.com/feed/game.xml">FOSS Torrents - Games</a>
      <a href="https://fosstorrents.com/feed/software.xml">FOSS Torrents - Softwares</a>
      <a href="https://igg-games.com/feed">Install Guide Games</a>
      <a href="https://limetorrents.lol/rss/">Lime Torrents</a>
      <a href="https://nyaa.si/?page=rss">Nyaa</a>
      <a href="https://pcgamestorrents.com/feed">PCGamesTorrents</a>
      <a href="http://tracker2.postman.i2p/?view=AddRSSMap">Postman</a>
      <a href="https://rarbg.to/rss.php">RARBG</a>
      <a href="http://rutor.info/rss.php">RUTOR (EN/RU)</a>
      <a href="https://sktorrent.org/feed_rss.xml">SkTorrent</a>
      <a href="https://tpb.party/rss">The Pirate Bay</a>
      <a href="https://tokyo-tosho.net/rss.php">Tokyo Toshokan</a>
      <!--a href="https://tokyotosho.info/rss.php">Tokyo Toshokan</a-->
      <a href="https://torlock.com/rss.xml">Torlock</a>
      <a href="https://torrent911.me/rss">Torrent911 (FR)</a>
      <a href="https://torrentdownload.info/feed_latest">Torrent Download</a>
      <a href="https://torrentdownloads.pro/rss.xml">Torrent Downloads</a>
      <a href="https://torrentgalaxy.to/rss">TorrentGalaxy</a>
      <a href="https://booktracker.org/rss.php">Книжный трекер (RU)</a>
      <a href="https://gamestracker.org/torrents/rss/">Торрент игры (RU)</a>
    </div>
    <div class="category" id="video">
      <h5>Videos &amp; PeerTube</h5>
      <a href="https://altcensored.com/feed">altCensored</a>
      <a href="https://denshi.live/feeds/videos.atom">denshi.live</a>
      <a href="https://filmsbykris.com/rss.xml">Films By Kris</a>
      <a href="https://videos.lukesmith.xyz/feeds/videos.atom?sort=-publishedAt&amp;isLocal=true">Luke's Videos</a>
      <a href="https://diode.zone/feeds/videos.atom?videoChannelId=9828">Mr. Funk E. Dude's Place</a>
      <a href="https://media.ccc.de/news.atom">media.ccc.de</a>
      <a href="https://opensubtitles.com/" title="RSS Per Movie/Page">OpenSubtitles.com</a>
      <a href="http://truthstreammedia.com/feed/atom/">Truthstream Media</a>
      <a href="https://video.xmpp-it.net/feeds/videos.atom?sort=-trending">XMPP-IT.NET</a>
    </div>
    <div class="background center">
      Random news feed from <a class="feed-category"></a>:
      <p><b><a class="feed-url"></a></b></p>
    </div>
  </div>
  </details>
  <details id="software" class="segment">
  <summary><b>Install a feed reader</b></summary>
  <h3>💿 Install feed reader apps for desktop and mobile</h3>
  <h4>Take your news with you - everywhere you go.</h4>
  <div class="content">
    <p>This is a list of desktop applications, mobile apps and online services for you to choose from.</p>
    <p>This list includes news readers, podcast managers, torrent clients, chat bots, browsers and extensions which support syndication feeds.</p>
    <p>Recommended software are marked with 🔖</p>
    <div id="filter">
      <span class="filter" id="torrent">BitTorrent</span>
      <span class="filter" id="email">Email</span>
      <span class="filter" id="news">News</span>
      <span class="filter" id="music">Podcast</span>
      <span class="filter" id="browser">Browser</span>
    </div>
    <div class="category">
      <h4>Desktop</h4>
      <div class="subcategory" id="unix">
        <h5>Linux</h5>
        <a class="news" href="https://apps.kde.org/akregator/">Akregator</a>
        <a class="music" href="https://amarok.kde.org">Amarok</a>
        <a class="browser" href="https://brave.com">Brave</a>
        <a class="email" href="https://claws-mail.org">Claws Mail</a>
        <a class="torrent" href="https://deluge-torrent.org">Deluge</a>
        <a class="news" href="https://github.com/jeena/FeedTheMonkey">Feed The Monkey</a>
        <a class="news" href="https://fraidyc.at">Fraidycat</a>
        <a class="music" href="https://gpodder.github.io">gPodder</a>
        <a class="music" href="https://apps.kde.org/kasts/">Kasts</a>
        <a class="news recom" href="https://leechcraft.org">LeechCraft</a>
        <a class="news recom" href="https://lzone.de/liferea/">Liferea</a>
        <a class="music" href="https://github.com/son-link/minimal-podcasts-player">Minimal Podcasts Player</a>
        <a class="news recom" href="https://apps.gnome.org/app/com.gitlab.newsflash/">NewsFlash</a>
        <a class="browser" href="https://otter-browser.org">Otter Browser</a>
        <a class="torrent" href="https://qbittorrent.org">qBittorrent</a>
        <a class="news" href="https://quiterss.org">QuiteRSS</a>
        <a class="news" href="https://ravenreader.app">Raven Reader</a>
        <a class="news" href="https://github.com/martinrotter/rssguard">RSS Guard</a>
        <a class="news" href="http://rssowl.org">RSSOwl</a>
        <a class="news" href="https://github.com/Xyrio/RSSOwlnix">RSSOwlnix</a>
        <a class="music" href="https://wiki.gnome.org/Apps/Rhythmbox">Rhythmbox</a>
        <a class="news recom" href="https://textbrowser.github.io/spot-on/">Spot-On</a>
        <a class="music" href="https://strawberrymusicplayer.org">Strawberry Music Player</a>
        <a class="email" href="https://thunderbird.net">Thunderbird</a>
        <a class="news" href="https://open-tickr.net">TICKR</a>
        <a class="torrent recom" href="https://tribler.org">Tribler</a>
        <a class="browser" href="https://vivaldi.com/features/feed-reader/">Vivaldi</a>
      </div>
      <div class="subcategory" id="mac-os">
        <h5>macOS</h5>
        <a class="music" href="https://amarok.kde.org">Amarok</a>
        <a class="browser" href="https://brave.com">Brave</a>
        <a class="torrent" href="https://deluge-torrent.org">Deluge</a>
        <a class="news" href="http://docserver.scripting.com/drummer/about.opml">Drummer</a>
        <a class="news" href="https://hyliu.me/fluent-reader/">Fluent Reader</a>
        <a class="news" href="https://fraidyc.at">Fraidycat</a>
        <a class="music" href="https://gpodder.github.io">gPodder</a>
        <a class="news recom" href="https://leechcraft.org">LeechCraft</a>
        <a class="music" href="https://github.com/son-link/minimal-podcasts-player">Minimal Podcasts Player</a>
        <a class="news recom" href="https://netnewswire.com">NetNewsWire</a>
        <a class="browser" href="https://otter-browser.org">Otter Browser</a>
        <a class="torrent" href="https://qbittorrent.org">qBittorrent</a>
        <a class="news" href="https://quiterss.org">QuiteRSS</a>
        <a class="news" href="https://ravenreader.app">Raven Reader</a>
        <a class="news" href="https://github.com/martinrotter/rssguard">RSS Guard</a>
        <a class="news" href="http://rssowl.org">RSSOwl</a>
        <a class="news" href="https://github.com/Xyrio/RSSOwlnix">RSSOwlnix</a>
        <a class="news recom" href="https://textbrowser.github.io/spot-on/">Spot-On</a>
        <a class="music" href="https://strawberrymusicplayer.org">Strawberry Music Player</a>
        <a class="email" href="https://thunderbird.net">Thunderbird</a>
        <a class="torrent recom" href="https://tribler.org">Tribler</a>
        <a class="news recom" href="https://vienna-rss.com">ViennaRSS</a>
        <a class="browser" href="https://vivaldi.com/features/feed-reader/">Vivaldi</a>
      </div>
      <div class="subcategory" id="react-os">
        <h5>React OS</h5>
        <p>WineHQ and Windows</p>
        <a class="music" href="https://amarok.kde.org">Amarok</a>
        <a class="browser" href="https://brave.com">Brave</a>
        <a class="email" href="https://claws-mail.org">Claws Mail</a>
        <a class="torrent" href="https://deluge-torrent.org">Deluge</a>
        <a class="news" href="http://feeddemon.com">FeedDemon</a>
        <a class="news" href="https://hyliu.me/fluent-reader/">Fluent Reader</a>
        <a class="news" href="https://fraidyc.at">Fraidycat</a>
        <a class="music" href="https://gpodder.github.io">gPodder</a>
        <a class="browser" href="http://kmeleonbrowser.org">K-Meleon</a>
        <a class="news recom" href="https://leechcraft.org">LeechCraft</a>
        <a class="music" href="https://github.com/son-link/minimal-podcasts-player">Minimal Podcasts Player</a>
        <a class="browser" href="https://otter-browser.org">Otter Browser</a>
        <a class="torrent" href="https://qbittorrent.org">qBittorrent</a>
        <a class="news" href="https://quiterss.org">QuiteRSS</a>
        <a class="news" href="https://ravenreader.app">Raven Reader</a>
        <a class="news" href="http://rssbandit.org">RSS Bandit</a>
        <a class="news" href="https://github.com/martinrotter/rssguard">RSS Guard</a>
        <a class="news" href="http://rssowl.org">RSSOwl</a>
        <a class="news" href="https://github.com/Xyrio/RSSOwlnix">RSSOwlnix</a>
        <a class="news" href="http://sharpreader.net">SharpReader</a>
        <a class="news recom" href="https://textbrowser.github.io/spot-on/">Spot-On</a>
        <a class="music" href="https://strawberrymusicplayer.org">Strawberry Music Player</a>
        <a class="email" href="https://thunderbird.net">Thunderbird</a>
        <a class="torrent recom" href="https://tribler.org">Tribler</a>
        <a class="browser" href="https://vivaldi.com/features/feed-reader/">Vivaldi</a>
      </div>
    </div>
    <div class="category">
      <h4>Mobile</h4>
      <div class="subcategory" id="android-os">
        <h5>Android</h5>
        <p>Above Phone, AOSPA, CopperheadOS, DivestOS, GrapheneOS and LineageOS</p>
        <a class="browser" href="https://brave.com">Brave</a>
        <a class="news" href="https://f-droid.org/en/packages/com.nononsenseapps.feeder/">Feeder</a>
        <a class="news" href="https://f-droid.org/packages/org.decsync.flym/">Flym DecSync</a>
        <a class="music" href="https://apps.kde.org/kasts/">Kasts</a>
        <a class="torrent recom" href="https://f-droid.org/en/packages/org.proninyaroslav.libretorrent/">LibreTorrent</a>
        <a class="music" href="https://f-droid.org/en/packages/io.gitlab.listentogether">ListenTogether</a>
        <a class="news" href="https://f-droid.org/en/packages/co.appreactor.news/">News</a>
        <a class="news" href="https://f-droid.org/en/packages/com.nunti/">Nunti</a>
        <a class="music" href="https://f-droid.org/en/packages/com.podverse.fdroid/">Podverse</a>
        <a class="news" href="https://f-droid.org/en/packages/me.ash.reader/">Read You</a>
        <a class="news" href="https://selfoss.aditu.de">selfoss</a>
        <a class="news recom" href="https://f-droid.org/en/packages/com.aerotoad.thud/">Thud</a>
        <a class="torrent" href="https://f-droid.org/en/packages/org.transdroid.full/">Transdroid</a>
        <a class="browser" href="https://vivaldi.com/features/feed-reader/">Vivaldi</a>
      </div>
      <div class="subcategory" id="unix">
        <h5>Linux Phone</h5>
        <h5>Droidian, Kupfer Linux, Mobian, Mobile NixOS and postmarketOS</h5>
        <a class="news" href="https://apps.kde.org/alligator/">Alligator</a>
        <a class="news" href="https://gfeeds.gabmus.org">Feeds</a>
        <a class="music" href="https://gpodder.github.io">gPodder</a>
        <a class="music" href="https://apps.kde.org/kasts/">Kasts</a>
      </div>
      <div class="subcategory" id="gerda-os">
        <h5>GerdaOS and KaiOS</h5>
        <a class="news" href="https://store.bananahackers.net/#feedolin">feedolin</a>
        <a class="music" href="https://store.bananahackers.net/#FoxCastLite">FoxCast Lite</a>
        <a class="music" href="https://store.bananahackers.net/#Mica">Mica</a>
        <a class="music" href="https://store.bananahackers.net/#PodKast">PodKast</a>
        <a class="music" href="https://store.bananahackers.net/#podlp">PodLP</a>
        <a class="news" href="https://store.bananahackers.net/#n4no.com.rss-reader">RSS Reader</a>
      </div>
      <div class="subcategory" id="ios">
        <h5>iOS</h5>
        <a class="browser" href="https://brave.com">Brave</a>
        <a class="news" href="https://netnewswire.com">NetNewsWire</a>
        <a class="music" href="https://github.com/guumeyer/Podcast">Podcast</a>
        <a class="music" href="https://github.com/rafaelclaycon/PodcastApp">PodcastApp</a>
        <a class="news" href="https://selfoss.aditu.de">selfoss</a>
      </div>
      <div class="subcategory" id="sailfish-os">
        <h5>Sailfish OS</h5>
        <a class="news" href="https://github.com/mkiol/kaktus">Kaktus</a>
        <a class="news" href="https://github.com/donaggio/harbour-feedhaven">Feed Haven</a>
        <a class="news" href="http://gitlab.unique-conception.org/apps-4-sailfish/feed-me">Feed Me</a>
        <a class="music" href="https://gpodder.github.io">gPodder</a>
        <a class="news" href="https://github.com/walokra/haikala">Haikala</a>
        <a class="news" href="https://github.com/pycage/tidings">Tidings</a>
      </div>
      <div class="subcategory" id="tizen">
        <h5>Tizen</h5>
        <a class="news" href="https://github.com/CESARBR/tizenreader">Tizen Reader</a>
      </div>
      <div class="subcategory" id="ubports">
        <h5>Ubuntu Touch</h5>
        <a class="music" href="https://open-store.io/app/com.mikeasoft.podbird">Podbird</a>
        <a class="music" href="https://open-store.io/app/soy.iko.podphoenix">Podphoenix</a>
        <a class="news" href="https://open-store.io/app/rssreader.florisluiten">RSSreader</a>
        <a class="news" href="https://open-store.io/app/simplestrss.kazord">SimplestRSS</a>
        <!-- a class="torrent" href="https://open-store.io/app/transmission.pavelprosto">Transmission</a -->
        <!-- a class="torrent" href="https://open-store.io/app/tr.davidv.dev">Transmission Remote</a -->
        <a class="news" href="https://open-store.io/app/darkeye.ursses">uRsses</a>
      </div>
    </div>
    <div class="category">
      <h4>Chat bots</h4>
        <h5>ActivityPub</h5>
        <a class="news" href="https://codeberg.org/MarvinsMastodonTools/feed2fedi">Feed2Fedi</a>
        <a class="news" href="https://gitlab.com/chaica/feed2toot">Feed2toot</a>
        <a class="news" href="https://git.sp-codes.de/samuel-p/feed2toot-docker">feed2toot-docker</a>
        <h5>XMPP</h5>
        <a class="news" href="https://github.com/imattau/atomtopubsub">AtomToPubsub</a>
        <a class="news" href="https://salsa.debian.org/mdosch/feed-to-muc">feed-to-muc</a>
        <a class="news" href="http://jotwewe.de/de/xmpp/jabrss/jabrss_en.htm">JabRSS</a>
        <a class="news" href="https://codeberg.org/TheCoffeMaker/Morbot">Morbot</a>
        <a class="news" href="https://gitgud.io/sjehuda/slixfeed">Slixfeed</a>
    </div>
    <div class="category">
      <h4>Browser extensions</h4>
      <a class="news" href="https://addons.basilisk-browser.org/addon/bamboo-feed-reader/">Bamboo Feed Reader</a>
      <a class="news" href="https://addons.mozilla.org/firefox/addon/boring-rss/">Boring RSS</a>
      <a class="news" href="https://nodetics.com/feedbro/">Feedbro</a>
      <a class="news" href="https://code.guido-berhoerster.org/addons/firefox-addons/feed-preview/">Feed Preview</a>
      <a class="news" href="https://fraidyc.at">Fraidycat</a>
      <a class="news" href="https://addons.basilisk-browser.org/addon/inforss-reloaded/">infoRSS Reloaded</a>
      <a class="news" href="https://realityripple.com/Software/XUL/LiveClick-Lunar/">LiveClick Lunar</a>
      <a class="news" href="https://github.com/nt1m/livemarks/">Livemarks</a>
      <a class="news" href="https://github.com/mpod/mpage">mPage</a>
      <a class="news" href="https://addons.basilisk-browser.org/addon/sidebar-feed-reader/">Sidebar Feed Reader</a>
      <a class="news" href="https://addons.basilisk-browser.org/addon/silver/">Silver</a>
      <a class="news" href="https://github.com/SmartRSS/Smart-RSS">Smart RSS</a>
    </div>
    <div class="category">
      <h4>Terminal</h4>
      <a class="news" href="https://codezen.org/canto-ng/">Canto (The Next Generation RSS)</a>
      <a class="news" href="https://github.com/zefr0x/mujammi">Mujammi' | مجمع</a>
      <a class="news" href="https://newsboat.org">Newsboat</a>
      <a class="news" href="https://codeberg.org/newsraft/newsraft">Newsraft</a>
      <a class="news" href="https://ploum.net/2023-11-25-offpunk2.html">Offpunk</a>
      <a class="news" href="https://sr.ht/~ghost08/photon/">Photon</a>
      <a class="torrent" href="https://github.com/rakshasa/rtorrent">RTorrent</a>
      <a class="torrent" href="https://github.com/dpsenner/bridge-from-torrent-rss-feed-to-rtorrent">bridge-from-torrent-rss-feed-to-rtorrent</a>
      <a class="news" href="https://codemadness.org/sfeed_curses-ui.html">Sfeed</a>
    </div>
    <div class="category">
      <h4>HTML (self hosted)</h4>
      <a class="news" href="https://commafeed.com">CommaFeed</a>
      <a class="news" href="https://feedbin.com">Feedbin</a>
      <a class="news" href="https://feedhq.org">FeedHQ</a>
      <a class="news" href="https://0xdstn.site/projects/feeds/">Feeds</a>
      <a class="news" href="http://feedonfeeds.com">Feeds on Feeds</a>
      <a class="news" href="https://freshrss.org">FreshRSS</a>
      <a class="news" href="https://miniflux.app">Miniflux</a>
      <a class="news" href="https://git.adammathes.com/neko/">neko</a>
      <a class="news" href="https://offog.org/code/rawdog/">rawdog</a>
      <a class="news" href="https://0xdstn.site/projects/reader/">Reader</a>
      <a class="news" href="https://github.com/acavalin/rrss">RRSS</a>
      <a class="torrent" href="https://github.com/Novik/ruTorrent">ruTorrent</a>
      <a class="news" href="https://selfoss.aditu.de">selfoss</a>
      <a class="news" href="https://tt-rss.org">Tiny Tiny RSS</a>
      <a class="news" href="https://github.com/nkanaev/yarr">yarr</a>
      <a class="news" href="https://github.com/twm/yarrharr">Yarrharr</a>
    </div>
    <div class="category">
      <h4>HTML (instances and services)</h4>
        <a class="news" href="https://commafeed.com">CommaFeed</a>
        <a class="news" href="https://drummer.land">Drummer</a>
        <a class="news" href="https://feedbin.com">Feedbin</a>
        <a class="news" href="https://feeder.co">Feeder</a>
        <a class="news" href="https://feedland.org">FeedLand</a>
        <a class="news" href="https://feedly.com">Feedly</a>
        <a class="news" href="https://goodnews.click">Good News</a>
        <a class="news" href="https://inoreader.com">Inoreader</a>
        <a class="news" href="http://netvibes.com/en">Netvibes</a>
        <a class="news" href="https://newsblur.com">NewsBlur</a>
        <a class="news" href="https://reedah.com">Reedah</a>
        <a class="news" href="https://theoldreader.com">The Old Reader</a>
    </div>
  </div>
  </details>
  <details id="services-publish" class="segment">
    <summary><b>Speak your mind</b></summary>
    <h3>🔊 Publishing platforms with syndication</h3>
    <h4>Express yourself through text, audio and video, and be truely open and social.</h4>
    <div class="content">
      <!-- p>Truely social means to express yourself through text, audio and video in a truely free platform.</p -->
      <p>Do you want to start a syndication-enabled podcast?</p>
      <p>The following journal and podcast hosting services provide access to syndication. Recommended providers are marked with 🔖</p>
      <div>
        <div class="category">
          <h5>Decentralized services (ActivityPub)</h5>
          <ul>
            <li><a class="recom" href="https://akkoma.social">Akkoma</a></li>
            <li><a href="https://joinbookwyrm.com/instances/">BookWyrm</a></li>
            <li><a href="https://diaspora.fediverse.observer/list">diaspora*</a></li>
            <li><a class="recom" href="https://funkwhale.fediverse.observer/list">Funkwhale</a></li>
            <li><a href="https://friendica.fediverse.observer/list">Friendica</a></li>
            <li><a class="recom" title="Also known as Identi.ca, Quitter and StatusNet" href="https://gnusocial.network/try/">GNU social</a></li>
            <li><a href="https://gotosocial.org">GoToSocial</a></li>
            <li><a class="recom" href="https://hubzilla.fediverse.observer/list">Hubzilla</a></li>
            <li><a href="https://infosec.pub/instances">Lemmy</a></li>
            <li><a href="https://instances.social">Mastodon</a></li>
            <li><a class="recom" href="https://micro.blog">Micro.blog</a></li>
            <li><a class="recom" href="https://monocles.social">monocles social</a></li>
            <li><a class="recom" href="https://instances.joinpeertube.org">PeerTube</a></li>
            <li><a href="https://pixelfed.fediverse.observer/list">Pixelfed</a></li>
            <li><a class="recom" href="https://pleroma.social">Pleroma</a></li>
            <li><a href="https://postmarks.glitch.me">Postmarks</a></li>
            <li><a href="https://soapbox.pub/servers/">Soapbox</a></li>
            <li><a href="https://takahe.social">Takahē</a></li>
          </ul>
        </div>
        <div class="category">
          <h5>Decentralized services (Blockchain, DHT and XMPP)</h5>
          <ul>
            <li><a href="https://getaether.net">Aether</a></li>
            <li><a class="recom" href="https://libervia.org">Libervia</a></li>
            <li><a class="recom" href="https://movim.eu">Movim</a></li>
            <li><a class="recom" href="https://plebbit.com">Plebbit</a> (h-entry syndication)</li>
            <li><a href="https://scuttlebutt.nz">Scuttlebutt</a></li>
          </ul>
        </div>
        <div class="category">
          <h5>Free of charge services</h5>
          <ul>
            <li><a href="https://acast.com">Acast</a></li>
            <li><a href="https://blogtalkradio.com">Blog Talk Radio</a></li>
            <li><a class="recom" href="https://chatons.org/search/by-service?service_type_target_id=154">Chatons</a> (list of services)</li>
            <li><a href="https://castos.com">Castos</a></li>
            <li><a href="https://feedpress.com">FeedPress</a></li>
            <li><a href="https://forumotion.com">FORUMOTION</a></li>
            <li><a class="recom" href="https://justjournal.com">Just Journal</a></li>
            <li><a href="http://libsyn.com">libsyn</a></li>
            <li><a class="recom" href="https://mov.im">Mov.im</a></li>
            <li><a class="recom" href="https://neocities.org">Neocities</a></li>
            <li><a class="recom" href="https://noblogs.org">NoBlogs</a></li>
            <li><a href="https://podbean.com">PodBean</a></li>
            <li><a href="https://podomatic.com">Podomatic</a></li>
            <li><a href="https://rawvoice.com">RawVoice</a></li>
            <li><a href="https://rss.com">RSS.com</a></li>
            <li><a href="https://spreaker.com">Spreaker</a></li>
            <li><a href="https://substack.com">Substack</a></li>
            <li><a class="recom" href="https://tedomum.net/service">TeDomum</a> (list of services)</li>
            <li><a class="recom" href="https://weblog.lol">weblog.lol</a></li>
            <li><a href="https://typepad.com">Typepad</a></li>
          </ul>
        </div>
        <div class="category">
          <h5>Prepaid services</h5>
          <ul>
            <li><a href="https://cloudaccess.net">CloudAccess</a></li>
            <li><a href="https://hetzner.com">Hetzner</a></li>
            <li><a href="https://hostinger.co.uk">Hostinger</a></li>
            <li><a href="https://masto.host">Masto.host</a></li>
            <li><a class="recom" href="https://micro.blog">Micro.blog</a></li>
            <li><a class="recom" href="https://monocles.eu/more/">monocles</a></li>
            <li><a class="recom" href="https://monocles.chat">monocles chat</a></li>
            <li><a href="https://notado.app">Notado</a></li>
            <li><a href="https://rochen.com">Rochen</a></li>
            <li><a href="https://strato.de">STRATO</a></li>
            <li><a href="https://typepad.com">Typepad</a></li>
            <li><a class="recom" href="https://xrd.me">XRD.ME</a></li>
            <li><a class="recom" href="https://zourit.net">Zourit</a></li>
          </ul>
        </div>
        <div class="category">
          <h5>Self hosted</h5>
          <p>Publishing platforms that support Atom Syndication are recommended and marked with 🔖.</p>
          <ul>
            <li><a href="https://ablog.readthedocs.io">ABlog for Sphinx</a></li>
            <li><a href="https://forgejo.sny.sh/sun/Axiom">Axiom</a></li>
            <li><a href="https://backdropcms.org">Backdrop CMS</a> (<a href="https://github.com/backdrop/backdrop">code</a>)</li>
            <li><a class="recom" href="https://barf.btxx.org">barf</a> (<a href="https://git.btxx.org/barf">code</a>)</li>
            <li><a href="https://cfenollosa.github.io/bashblog/">bashblog</a> (<a href="https://github.com/cfenollosa/bashblog">code</a>)</li>
            <li><a class="recom" href="https://bearblog.dev">ʕ•ᴥ•ʔ Bear</a> (<a href="https://github.com/HermanMartinus/bearblog">code</a>)</li>
            <li><a href="https://justine.smithies.me.uk/blarg.html">blarg</a> (<a href="https://git.sr.ht/~justinesmithies/blarg">code</a>)</li>
            <li><a href="https://karl.berlin/blog.html">blog.sh</a> (<a href="https://github.com/karlb/karl.berlin/blob/master/blog.sh">code</a>)</li>
            <li><a class="recom" href="https://blogo.site">Blogo</a> (<a href="https://github.com/pluja/blogo">code</a>)</li>
            <li><a href="https://sourceforge.net/projects/blojsom/">blojsom</a> (<a href="https://github.com/timothystone/blojsom">code</a>)</li>
            <li><a href="https://bssg.dragas.net">BSSG</a></li>
            <li><a class="recom" href="https://chyrplite.net">Chyrp Lite</a> (<a href="https://github.com/xenocrat/chyrp-lite">code</a>)</li>
            <li><a class="recom" href="https://classicpress.net">ClassicPress</a></li>
            <li><a href="https://concretecms.com">Concrete CMS</a></li>
            <li><a href="https://dataswamp.org/~solene/tag-cl-yag.html">cl-yag</a> (<a href="git://bitreich.org/cl-yag">code</a>)</li>
            <li><a href="https://github.com/cdidier/clog">clog</a></li>
            <!-- li><a href="https://dnnsoftware.com/community/download">DNN</a></li -->
            <li><a href="https://dokuwiki.org/dokuwiki">DokuWiki</a></li>
            <li><a href="https://drupal.org">Drupal</a></li>
            <li><a class="recom" href="https://utcc.utoronto.ca/~cks/space/dwiki/DWiki">DWiki (Dinky Wiki)</a></li>
            <li><a href="https://11ty.dev">Eleventy</a></li>
            <li><a href="https://simonrepp.com/faircamp/">Faircamp</a> (<a href="https://codeberg.org/simonrepp/faircamp">code</a>)</li>
            <li><a href="https://github.com/llewelld/flagellum">Flagellum</a></li>
            <li><a href="https://formatforest.com">FormatForest</a> (<a href="https://gitlab.com/nadimk/formatforest">code</a>)</li>
            <li><a class="recom" href="https://foswiki.org">Foswiki</a></li>
            <li><a href="https://sourceforge.net/projects/gallery/">Gallery</a></li>
            <li><a href="https://gatsbyjs.com">Gatsby</a> (<a href="https://github.com/gatsbyjs/gatsby">code</a>)</li>
            <li><a href="https://ghost.org">Ghost</a> (<a href="https://github.com/TryGhost/Ghost">code</a>)</li>
            <li><a class="recom" href="https://github.com/piranha/gostatic">gostatic</a></li>
            <li><a class="recom" href="https://getgrav.org">Grav</a></li>
            <li><a href="https://github.com/infoforcefeed/greshunkel">Greshunkel</a></li>
            <li><a href="https://github.com/botherder/habu">Habu</a></li>
            <li><a class="recom" href="https://github.com/hanejs/hane">Hane JS</a></li>
            <li><a class="recom" href="https://dthompson.us/projects/haunt.html">Haunt</a></li>
            <li><a class="recom" href="https://hexo.io">Hexo</a> (<a href="https://github.com/hexojs/hexo">code</a>)</li>
            <li><a class="recom" href="https://gohugo.io">Hugo</a></li>
            <li><a href="http://hyde.github.io">hyde</a></li>
            <li><a href="http://ikiwiki.info">ikiwiki</a></li>
            <li><a class="recom" href="https://jekyllrb.com">Jekyll</a></li>
            <li><a href="https://joomla.org">Joomla</a></li>
            <li><a class="recom" href="https://justjournal.com">Just Journal</a> (<a href="https://sourceforge.net/projects/justjournal/">code</a>)</li>
            <li><a href="https://gt.kalli.st/czar/kalli.st">kallist CMS</a></li>
            <li><a href="https://getkirby.com">Kirby</a> (<a href="https://github.com/getkirby/kirby">code</a>)</li>
            <li><a href="https://withknown.com">Known</a> (<a href="https://github.com/idno/known">code</a>)</li>
            <li><a href="https://leafo.net/lapis/">Lapis</a></li>
            <li><a class="recom" href="https://libervia.org">Libervia</a></li>
            <li><a href="https://lume.land">Lume</a></li>
            <li><a href="https://squidfunk.github.io/mkdocs-material/">Material for MkDocs</a></li>
            <li><a href="https://mkws.sh">mkws</a></li>
            <li><a href="http://moinmo.in">MoinMoin</a></li>
            <li><a class="recom" href="https://movim.eu">Movim</a></li>
            <li><a class="recom" href="https://getnikola.com">Nikola</a></li>
            <li><a class="recom" href="http://octopress.org">Octopress</a> (<a href="https://sourceforge.net/p/oscailt/code/HEAD/tree/">code</a>)</li>
            <li><a href="https://oddmuse.org">Oddmuse</a> (<a href="https://github.com/kensanata/oddmuse">code</a>)</li>
            <li><a class="recom" href="https://pkp.sfu.ca/software/ojs/">Open Journal Systems (OJS)</a></li>
            <li><a class="recom" href="http://indymedia.ie/oscailt/">Oscailt</a></li>
            <li><a href="https://pebble.sourceforge.net">Pebble</a></li>
            <li><a class="recom" href="https://getpelican.com">Pelican</a></li>
            <li><a href="http://phpwiki.demo.free.fr">PhpWiki</a></li>
            <li><a href="https://picocms.org">Pico</a></li>
            <li><a href="https://cblgh.org/plain/">plain</a> (<a href="https://github.com/cblgh/plain">code</a>)</li>
            <li><a href="https://pluxml.org">plain</a> (<a href="https://github.com/pluxml/PluXml">code</a>)</li>
            <li><a href="https://pmwiki.org">PmWiki</a> (see <a href="https://pmwiki.org/wiki/Cookbook/RSS">Cookbook/RSS</a>)</li>
            <li><a href="https://podcastgenerator.net">Podcast Generator</a></li>
            <!-- li><a a href="https://processwire.com">ProcessWire</a></li -->
            <li><a class="recom" href="https://getpublii.com">Publii</a></li>
            <li><a href="https://pulkomandy.tk/_/_PulkoCMS/_About%20PulkoCMS">PulkoCMS</a></li>
            <li><a href="https://quarto.org">Quarto</a> (<a href="https://github.com/quarto-dev/quarto-cli">code</a>)</li>
            <!-- li><a href="http://radiantcms.org">Radiant CMS</a></li -->
            <li><a class="recom" href="https://git.xmpp-it.net/sch/Rivista">Rivista</a></li>
            <li><a href="https://s9y.org">Serendipity</a></li>
            <li><a href="https://bkhome.org/shellcms/">shellCMS</a></li>
            <li><a href="https://leafo.net/sitegen/">Sitegen</a></li>
            <li><a href="https://git.adammathes.com/snkt">snkt</a></li>
            <li><a class="recom" href="https://soupault.app">soupault</a> (<a href="https://github.com/PataphysicalSociety/soupault">code</a>)</li>
            <li><a href="https://gitlab.com/kevincox/statit">statit</a></li>
            <li><a href="https://github.com/PiotrZPL/staurolite">Staurolite</a></li>
            <li><a href="https://github.com/garbeam/staw">staw</a></li>
            <li><a href="https://forge.a-lec.org/echolib/stl-statilque-litterateur">STL: Statique Littérateur</a></li>
            <li><a class="recom" href="https://textpattern.com">Textpattern CMS</a></li>
            <li><a class="recom" href="https://tiki.org/HomePage">TIKI WIKI CMS GROUPWARE</a> (<a href="https://sourceforge.net/projects/tikiwiki/">code</a>)</li>
            <li><a href="https://github.com/TurnWheel/TWCMS">TW-CMS</a></li>
            <!-- li><a href="https://twiki.org">TWiki</a></li -->
            <li><a href="https://typo3.org">TYPO3</a></li>
            <li><a href="https://umbraco.com">Umbraco</a> (<a href="https://github.com/umbraco/Umbraco-CMS">code</a>)</li>
            <li><a class="recom" href="https://webgen.gettalong.org">webgen</a> (<a href="https://github.com/gettalong/webgen">code</a>)</li>
            <li><a href="http://werc.cat-v.org">werc</a></li>
            <li><a class="recom" href="https://wikkawiki.org">WikkaWiki</a></li>
            <li><a class="recom" href="https://wordpress.org">WordPress</a></li>
            <li><a class="recom" href="https://git.xmpp-it.net/sch/Rivista">XMPP Journal Publisher (XJP)</a></li>
            <li><a href="https://xwiki.org">XWiki</a></li>
            <li><a href="https://github.com/jgm/yst">yst</a></li>
            <li><a href="https://getzola.org">Zola</a></li>
            <li><a class="recom" href="https://zotonic.com">Zotonic</a> (<a href="https://github.com/zotonic/zotonic">code</a>)</li>
          </ul>
        </div>
        <div class="category">
          <h5>Of note</h5>
          <p>Decentralized services are <i>very and mostly</i> encouraged; Use one ActivityPub-based account to communicate with all services and platforms.</p>
          <p>Free of monetary charge services are generally <i>not</i> encouraged and are mostly usable as a backup medium.</p>
          <p>You are encouraged to host <b>your own</b> server connected to <a href="https://i2pd.readthedocs.io/en/latest/tutorials/http/#host-anonymous-website">the I2P network</a>.</p>
          <p>Whatever is your medium of choice to publish your podcast, best ways to make your files available are via BitTorrent, I2P and IPFS.</p>
          <p>* PeerTube has built-in BitTorrent support.</p>
        </div>
      </div>
    </div>
  </details>
  <details id="journal" class="segment">
    <summary>Be a publisher</summary>
    <h3>📢 Create your site, journal or even both</h3>
    <h4>This is the Creative Collective. Decentralize, curate, and diverse. But do not mix!</h4>
    <p>Ignore social media, it has sucked up everything cool about the internet and made it absolutely terrible to those who are bound and manipulated by it.</p>
    <p>Join to the campaign <a href="https://100daystooffload.com">100 Days To Offload</a>!</p>
    <p>Apply to the January 2023 endeavor <a href="https://bringback.blog/">Bring Back Journals</a>!</p>
    <p>And read the <a href="https://sizeof.cat/post/dos-and-donts/">Dos and Don'ts of current times</a>.</p>
    <p>And if you do not already have a site, then <a href="https://videos.lukesmith.xyz/w/9aadaf2f-a8e7-4579-913d-b250fd1aaaa9">Get a site Now!</a> (Do not be a Web Peasant!)</p>
    <h5>Articles</h5>
    <ul>
      <li><a href="https://sizeof.cat/post/dos-and-donts/">Dos and Don'ts of current times</a></li>
      <li><a href="https://jacobwsmith.xyz/stories/200812.html">How to Stop the Boring from being Boring</a></li>
      <li><a href="https://thoughts.melonking.net/guides/introduction-to-the-web-revival-1-what-is-the-web-revival">Intro to the Web Revival #1: What is the Web Revival?</a></li>
      <!-- li><a href="https://theblogstarter.com">The Journal Starter - How To Start A Journal In 2023</a></li -->
    </ul>
    <h5>Campaigns</h5>
    <ul>
      <li><a href="https://100daystooffload.com">100 Days To Offload</a></li>
      <li><a href="https://bringback.blog">Bring Back Journals! January 2023</a></li>
    </ul>
    <h5>Free of charge services</h5>
    <ul>
      <li><a class="recom" href="https://chatons.org/search/by-service?service_type_target_id=154">Chatons</a> (list of services)</li>
      <li><a href="https://feedpress.com">FeedPress</a></li>
      <li><a href="https://forumotion.com">FORUMOTION</a></li>
      <li><a href="http://libsyn.com">libsyn</a></li>
      <li><a class="recom" href="https://neocities.org">Neocities</a></li>
      <li><a class="recom" href="https://noblogs.org">NoBlogs</a></li>
      <li><a href="https://podbean.com">PodBean</a></li>
      <li><a href="https://spreaker.com">Spreaker</a></li>
      <li><a href="https://substack.com">Substack</a></li>
      <li><a class="recom" href="https://tedomum.net/service/">TeDomum</a> (list of services)</li>
      <li><a href="https://typepad.com">Typepad</a></li>
      <li><a class="recom" href="https://weblog.lol">weblog.lol</a></li>
    </ul>
    <h5>Prepaid services</h5>
    <ul>
      <li><a href="https://cloudaccess.net">CloudAccess</a></li>
      <li><a href="https://hetzner.com">Hetzner</a></li>
      <li><a href="https://hostinger.co.uk">Hostinger</a></li>
      <li><a href="https://masto.host">Masto.host</a></li>
      <li><a class="recom" href="https://micro.blog">Micro.blog</a></li>
      <li><a class="recom" href="https://monocles.eu/more/">monocles</a></li>
      <li><a class="recom" href="https://monocles.chat">monocles chat</a></li>
      <li><a href="https://rochen.com">Rochen</a></li>
      <li><a href="https://strato.de">STRATO</a></li>
      <li><a href="https://typepad.com">Typepad</a></li>
      <li><a class="recom" href="https://xrd.me">XRD.ME</a></li>
      <li><a class="recom" href="https://zourit.net">Zourit</a></li>
    </ul>
    <h5>Software</h5>
    <p>With over a billion people and over hundred of trillions of posts, you can choose from a variety of CMS or community and forum management software systems with support for syndication.</p>
    <p class="background" title="This document shows you that 'free and open source software' are also subjected to a bad type of politics, yet it is recommended to choose open source forum software, just in case some feature is gone and you desire to bring it back.">We advise to choose open source forum software.  If you choose a proprietary software, please <i>do</i> make sure that you have a convenient way to import/export and backup all data.</p>
    <h4>Site management</h4>
    <p>Publishing platforms that support Atom Syndication are recommended and marked with 🔖.</p>
    <ul>
      <li><a href="https://ablog.readthedocs.io">ABlog for Sphinx</a></li>
      <li><a href="https://forgejo.sny.sh/sun/Axiom">Axiom</a></li>
      <li><a href="https://backdropcms.org">Backdrop CMS</a> (<a href="https://github.com/backdrop/backdrop">code</a>)</li>
      <li><a class="recom" href="https://barf.btxx.org">barf</a> (<a href="https://git.btxx.org/barf">code</a>)</li>
      <li><a href="https://cfenollosa.github.io/bashblog/">bashblog</a> (<a href="https://github.com/cfenollosa/bashblog">code</a>)</li>
      <li><a class="recom" href="https://bearblog.dev">ʕ•ᴥ•ʔ Bear</a> (<a href="https://github.com/HermanMartinus/bearblog">code</a>)</li>
      <li><a href="https://justine.smithies.me.uk/blarg.html">blarg</a> (<a href="https://git.sr.ht/~justinesmithies/blarg">code</a>)</li>
      <li><a href="https://karl.berlin/blog.html">blog.sh</a> (<a href="https://github.com/karlb/karl.berlin/blob/master/blog.sh">code</a>)</li>
      <li><a class="recom" href="https://blogo.site">Blogo</a> (<a href="https://github.com/pluja/blogo">code</a>)</li>
      <li><a href="https://sourceforge.net/projects/blojsom/">blojsom</a> (<a href="https://github.com/timothystone/blojsom">code</a>)</li>
      <li><a href="https://bssg.dragas.net">BSSG</a></li>
      <li><a class="recom" href="https://chyrplite.net">Chyrp Lite</a> (<a href="https://github.com/xenocrat/chyrp-lite">code</a>)</li>
      <li><a class="recom" href="https://classicpress.net">ClassicPress</a></li>
      <li><a href="https://concretecms.com">Concrete CMS</a></li>
      <li><a href="https://dataswamp.org/~solene/tag-cl-yag.html">cl-yag</a> (<a href="git://bitreich.org/cl-yag">code</a>)</li>
      <li><a href="https://github.com/cdidier/clog">clog</a></li>
      <!-- li><a href="https://dnnsoftware.com/community/download">DNN</a></li -->
      <li><a href="https://dokuwiki.org/dokuwiki">DokuWiki</a></li>
      <li><a href="https://drupal.org">Drupal</a></li>
      <li><a class="recom" href="https://utcc.utoronto.ca/~cks/space/dwiki/DWiki">DWiki (Dinky Wiki)</a></li>
      <li><a href="https://11ty.dev">Eleventy</a></li>
      <li><a href="https://simonrepp.com/faircamp/">Faircamp</a> (<a href="https://codeberg.org/simonrepp/faircamp">code</a>)</li>
      <li><a href="https://github.com/llewelld/flagellum">Flagellum</a></li>
      <li><a href="https://formatforest.com">FormatForest</a> (<a href="https://gitlab.com/nadimk/formatforest">code</a>)</li>
      <li><a class="recom" href="https://foswiki.org">Foswiki</a></li>
      <li><a href="https://sourceforge.net/projects/gallery/">Gallery</a></li>
      <li><a href="https://gatsbyjs.com">Gatsby</a> (<a href="https://github.com/gatsbyjs/gatsby">code</a>)</li>
      <li><a href="https://ghost.org">Ghost</a> (<a href="https://github.com/TryGhost/Ghost">code</a>)</li>
      <li><a class="recom" href="https://github.com/piranha/gostatic">gostatic</a></li>
      <li><a class="recom" href="https://getgrav.org">Grav</a></li>
      <li><a href="https://github.com/infoforcefeed/greshunkel">Greshunkel</a></li>
      <li><a href="https://github.com/botherder/habu">Habu</a></li>
      <li><a class="recom" href="https://github.com/hanejs/hane">Hane JS</a></li>
      <li><a class="recom" href="https://dthompson.us/projects/haunt.html">Haunt</a></li>
      <li><a class="recom" href="https://hexo.io">Hexo</a> (<a href="https://github.com/hexojs/hexo">code</a>)</li>
      <li><a class="recom" href="https://gohugo.io">Hugo</a></li>
      <li><a href="http://hyde.github.io">hyde</a></li>
      <li><a href="http://ikiwiki.info">ikiwiki</a></li>
      <li><a class="recom" href="https://jekyllrb.com">Jekyll</a></li>
      <li><a href="https://joomla.org">Joomla</a></li>
      <li><a class="recom" href="https://git.xmpp-it.net/sch/Rivista">Rivista</a></li>
      <li><a class="recom" href="https://justjournal.com">Just Journal</a> (<a href="https://sourceforge.net/projects/justjournal/">code</a>)</li>
      <li><a href="https://gt.kalli.st/czar/kalli.st">kallist CMS</a></li>
      <li><a href="https://getkirby.com">Kirby</a> (<a href="https://github.com/getkirby/kirby">code</a>)</li>
      <li><a href="https://withknown.com">Known</a> (<a href="https://github.com/idno/known">code</a>)</li>
      <li><a href="https://leafo.net/lapis/">Lapis</a></li>
      <li><a class="recom" href="https://libervia.org">Libervia</a></li>
      <li><a href="https://lume.land">Lume</a></li>
      <li><a href="https://squidfunk.github.io/mkdocs-material/">Material for MkDocs</a></li>
      <li><a href="https://mkws.sh">mkws</a></li>
      <li><a href="http://moinmo.in">MoinMoin</a></li>
      <li><a class="recom" href="https://movim.eu">Movim</a></li>
      <li><a class="recom" href="https://getnikola.com">Nikola</a></li>
      <li><a class="recom" href="http://octopress.org">Octopress</a></li>
      <li><a href="https://oddmuse.org">Oddmuse</a> (<a href="https://github.com/kensanata/oddmuse">code</a>)</li>
      <li><a class="recom" href="https://pkp.sfu.ca/software/ojs/">Open Journal Systems (OJS)</a></li>
      <li><a class="recom" href="http://indymedia.ie/oscailt/">Oscailt</a> (<a href="https://sourceforge.net/p/oscailt/code/HEAD/tree/">code</a>)</li>
      <li><a href="https://pebble.sourceforge.net">Pebble</a></li>
      <li><a class="recom" href="https://getpelican.com">Pelican</a></li>
      <li><a href="http://phpwiki.demo.free.fr">PhpWiki</a></li>
      <li><a href="https://picocms.org">Pico</a></li>
      <li><a href="https://cblgh.org/plain/">plain</a> (<a href="https://github.com/cblgh/plain">code</a>)</li>
            <li><a href="https://pluxml.org">plain</a> (<a href="https://github.com/pluxml/PluXml">code</a>)</li>
      <li><a href="https://pmwiki.org">PmWiki</a> (see <a href="https://pmwiki.org/wiki/Cookbook/RSS">Cookbook/RSS</a>)</li>
      <li><a href="https://podcastgenerator.net">Podcast Generator</a></li>
      <!-- li><a a href="https://processwire.com">ProcessWire</a></li -->
      <li><a class="recom" href="https://getpublii.com">Publii</a></li>
      <li><a href="https://pulkomandy.tk/_/_PulkoCMS/_About%20PulkoCMS">PulkoCMS</a></li>
      <li><a href="https://quarto.org">Quarto</a> (<a href="https://github.com/quarto-dev/quarto-cli">code</a>)</li>
      <!-- li><a href="http://radiantcms.org">Radiant CMS</a></li -->
      <li><a href="https://s9y.org">Serendipity</a></li>
      <li><a href="https://bkhome.org/shellcms/">shellCMS</a></li>
      <li><a href="https://leafo.net/sitegen/">Sitegen</a></li>
      <li><a href="https://git.adammathes.com/snkt/">snkt</a></li>
      <li><a class="recom" href="https://soupault.app">soupault</a> (<a href="https://github.com/PataphysicalSociety/soupault">code</a>)</li>
      <li><a href="https://gitlab.com/kevincox/statit">statit</a></li>
      <li><a href="https://github.com/PiotrZPL/staurolite">Staurolite</a></li>
      <li><a href="https://github.com/garbeam/staw">staw</a></li>
      <li><a href="https://forge.a-lec.org/echolib/stl-statilque-litterateur">STL: Statique Littérateur</a></li>
      <li><a class="recom" href="https://textpattern.com">Textpattern CMS</a></li>
      <li><a class="recom" href="https://tiki.org/HomePage">TIKI WIKI CMS GROUPWARE</a> (<a href="https://sourceforge.net/projects/tikiwiki/">code</a>)</li>
      <li><a href="https://github.com/TurnWheel/TWCMS">TW-CMS</a></li>
      <!-- li><a href="https://twiki.org">TWiki</a></li -->
      <li><a href="https://typo3.org">TYPO3</a></li>
      <li><a href="https://umbraco.com">Umbraco</a> (<a href="https://github.com/umbraco/Umbraco-CMS">code</a>)</li>
      <li><a class="recom" href="https://webgen.gettalong.org">webgen</a> (<a href="https://github.com/gettalong/webgen">code</a>)</li>
      <li><a href="http://werc.cat-v.org">werc</a></li>
      <li><a class="recom" href="https://wikkawiki.org">WikkaWiki</a></li>
      <li><a class="recom" href="https://wordpress.org">WordPress</a></li>
      <li><a class="recom" href="https://git.xmpp-it.net/sch/Rivista">XMPP Journal Publisher (XJP)</a></li>
      <li><a href="https://xwiki.org">XWiki</a></li>
      <li><a href="https://github.com/jgm/yst">yst</a></li>
      <li><a href="https://getzola.org">Zola</a></li>
      <li><a class="recom" href="https://zotonic.com">Zotonic</a> (<a href="https://github.com/zotonic/zotonic">code</a>)</li>
    </ul>
    <h4>Forum management</h4>
    <ul>
      <li><a href="https://askbot.com">Askbot</a> (<a href="https://github.com/ASKBOT/askbot-devel">code</a>)</li>
      <li><a href="https://git.2f30.org/bliper/log.html">bliper</a></li>
      <li><a href="https://cblgh.org/cerca">Cerca</a></li>
      <li><a href="https://discourse.org">Discourse</a></li>
      <li><a href="https://djangobb.org">DjangoBB</a></li>
      <li><a class="recom" href="https://elkarte.net">ElkArte</a></li>
      <li><a class="recom" href="https://fluxbb.org">FluxBB</a></li>
      <li><a href="https://invisioncommunity.com">Invision Community (IP.Board)</a></li>
      <li><a href="https://mediawiki.org/wiki/MediaWiki">MediaWiki</a></li>
      <li><a class="recom" href="https://mybb.com">MyBB</a></li>
      <li><a href="https://mylittleforum.net">my little forum</a></li>
      <li><a href="https://nodebb.org">NodeBB</a></li>
      <li><a href="https://camendesign.com/nononsense_forum">NoNonsense Forum</a> (<a href="https://github.com/Kroc/NoNonsenseForum">code</a>)</li>
      <li><a href="https://phorum.org">Phorum</a></li>
      <li><a class="recom" href="https://phpbb.com">phpBB</a></li>
      <li><a href="https://join.piefed.social">PieFed</a></li>
      <li><a href="https://proboards.com">ProBoards</a></li>
      <li><a href="https://punbb.informer.com">PunBB</a></li>
      <li><a class="recom" href="https://redmine.org">Redmine</a></li>
      <!-- li><a href="http://textboard.i2p">SchemeBBS</a></li -->
      <!-- li><a href="https://wakaba.c3.cx/shii/shiichan">Shiichan Anonymous BBS</a></li -->
      <li><a href="https://simplemachines.org">Simple Machines Forum</a></li>
      <!-- li><a href="https://syndie.de">Syndie</a></li -->
      <li><a href="https://vbulletin.com">vBulletin</a></li>
      <li><a href="https://xenforo.com">XenForo</a></li>
    </ul>
    <h5>Webrings</h5>
    <p>Introduction to <a href="https://brisray.com/web/webring-history.htm">Webring History</a>.</p>
    <p>We advise you to bookmark the following links.</p>
    <p>Do not worry, there is more than enough for anyone for reading of contents and sharing of media; yes, even more than you will be able to consume on the so called "social" platforms.</p>
    <ul>
      <li><a href="https://1mb.club">1MB Club</a></li>
      <li><a href="https://250kb.club">250KB Club</a></li>
      <li><a href="https://512kb.club">512KB Club</a></li>
      <li><a href="https://xn--sr8hvo.ws">An IndieWeb Webring</a></li>
      <li><a href="https://blowfish.page/users/">Blowfish</a></li>
      <li><a href="https://chaotic.ninja/webring/">chaotic.ninja</a></li>
      <li><a href="https://ring.exozy.me">exozyme</a></li>
      <li><a href="https://hotlinewebring.club">Hotline Webring</a></li>
      <li><a href="https://czar.kalli.st/webring/">->k- czar's</a></li>
      <li><a href="https://nekoweb.org">Nekoweb</a></li>
      <li><a href="https://neocities.org/browse">Neocities</a></li>
      <li><a href="https://nocss.club">No CSS Club</a></li>
      <li><a href="https://notnite.com">notnite</a></li>
      <li><a href="https://nownownow.com">/now page</a></li>
      <li><a href="https://ooh.directory">ooh.directory</a></li>
      <li><a href="https://heaventree.xyz">The Guild of Heaven Tree</a></li>
      <li><a href="https://no-js.club">The no-JS Club</a></li>
      <li><a href="https://webring.recurse.com">The Recurse Center</a></li>
      <li><a href="https://uberblogr.de">UberBlogr</a></li>
      <li><a href="https://webring.adilene.net/members.php">Vocaloid Webring</a></li>
      <li><a href="https://xhtml.club">XHTML Club</a></li>
      <li><a href="https://webring.xxiivv.com/#rss">XXIIVV Webring</a></li>
      <li><a href="http://yakumo.dev/webring/">Yakumo Laboratories</a></li>
    </ul>
    <p>Get into the Web Ring.</p>
    <span id="webring">🕸 💍</span>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 170"><style type="text/css">#web-and-ring{filter: drop-shadow(2px 4px 6px black);user-select: none;}</style><text y="1.3em" font-size="100" id="web-and-ring">🕸 💍</text></svg>
  </details>
  <h2>Information</h2>
  <details id="searx" class="segment">
  <summary>Monitor your online presence</summary>
    <h3>👁️ Monitoring online presence and facilitating SEO</h3>
    <h4>Power tools that advertisers do not want you to know about.</h4>
    <div class="content">
      <p>Advertising and marketing agencies make an extensive use of syndication feeds to monitor information presented by search results and other trends.  Many of them use SearXNG to do this task.</p>
      <p>SearXNG and YaCy are private and decentralized engines that retrieve results from multiple sources, including commercial search engines, RSS feeds and also from shared peers using the DHT technology.</p>
      <p>Results are provided in both HTML and <b class="text-icon orange">RSS</b>, including CSV and JSON.</p>
      <p>While SearXNG retrieves results only from live search engines, YaCy provides results from both local database (i.e. bookmarks) and other YaCy peers, in addition to live search engines.</p>
      <h5>Marginalia</h5>
      <p>Marginalia Search a small independent do-it-yourself search engine for surprising but content-rich sites that never ask you to accept cookies or subscribe to newsletters.</p>
      <ul>
        <li><a href="https://search.marginalia.nu">Homepage</a></li>
        <li><a href="https://git.marginalia.nu">Source code</a></li>
      </ul>
      <h5>MetaGer</h5>
      <p>MetaGer has been free software under GNU AGPL v3 since August 16, 2016, so that our strict protection of your data and your privacy can be publicly verified and so that you as a programmer can help to make everything even better.</p>
      <ul>
        <li><a href="https://metager.de">Homepage</a></li>
        <li><a href="https://gitlab.metager.de/open-source/MetaGer">Source code</a></li>
      </ul>
      <h5>SearXNG (RSS supported)</h5>
      <p>SearXNG is a meta-search engine, aggregating the results of other search engines while not storing information about its clients.</p>
      <ul>
        <li><a href="https://searx.space">Homepage</a></li>
        <li><a href="https://github.com/searxng/searxng">Source code</a></li>
      </ul>
      <h5>Wiby</h5>
      <p>Wiby is a search engine and the source code is now free as of July 8, 2022.</p>
      <ul>
        <li><a href="https://wiby.me">Homepage</a></li>
        <li><a href="https://github.com/wibyweb/wiby">Source code</a></li>
      </ul>
      <h5>YaCy (P2P and RSS supported)</h5>
      <p>Imagine if, rather than relying on the proprietary software of a large professional search engine operator, your search engine was run across many private devices, not under the control of any one company or individual. Well, that is what YaCy does!</p>
      <ul>
        <li><a href="https://yacy.net">Homepage</a></li>
        <li><a href="https://github.com/yacy/yacy_search_server">Source code</a></li>
      </ul>
      <h5>More about search engines</h5>
      <ul>
        <li><a href="https://12bytes.org/alternative-search-engines-that-are-more-respectful-of-your-privacy/">Search engines that are more respectful of your privacy</a> (October 15, 2023)</li>
      </ul>
    </div>
  </details>
  <details id="services-feed" class="segment">
  <summary><b>Syndication feed services and software</b></summary>
    <h3>🛎️ Your RSS is kindly served. Sir!</h3>
    <h4>Because no one should nor would stop you from being in control of your precious time.</h4>
    <div class="content">
      <p>Below are online services that extend the syndication experience by means of bookmarking and multimedia, and also enhance it by restoring access to news syndication feeds.</p>
      <!-- h5><a href="https://teddit.net">teddit</a></h5>
      <p>Turn /r/ into syndication feeds. (<a href="https://github.com/libreddit/libreddit">source code</a>)</p -->
      <h5><a href="https://git.xmpp-it.net/sch/Blasta">Blasta</a></h5>
      <p>Blasta is a collaborative bookmarks manager for organizing online content. It allows you to add links to your private collection of links, to categorize them with keywords, and to share your collection not only among your own software, devices and machines, but also with others.</p>
      <h5><a href="http://blogmarks.net">BlogMarks</a></h5>
      <p>Welcome to the social bookmarking revolution. BlogMarks is a social bookmarking service, which was founded in late 2003.</p>
      <p>BlogMarks is a collaborative link management project based on sharing and key-word tagging. Build on a journal basis, BlogMarks is an open and free technology. Now, you can access your favorite URL's from any computer. And with BlogMarks, you share your favourite with other people, friends and family.</p>
      <p class="background">⚠️ Invitation only membership.</p>
      <p>Please refer to <a href="https://notado.app">Notado</a> in case you do not know from where to get an invitation.</p>
      <h5><a href="https://drummer.land">Drummer</a></h5>
      <p>Drummer is a multi-tab outliner that runs as a browser app and as a Mac desktop app.</p>
      <h5><a href="https://github.com/jonschoning/espial">Espial</a></h5>
      <p>Espial is an open-source, HTML-based bookmarking server with support for sharing feeds as RSS.</p>
      <h5><a href="https://feedcontrol.fivefilters.org">Feed Control</a></h5>
      <p>Monitor feeds and HTML pages, filter content, receive alerts, expand partial feeds, and integrate with your app.</p>
      <h5><a href="https://fivefilters.org/feed-creator/">Feed Creator</a></h5>
      <p>Create feeds from HTML pages. Generate RSS and JSON feeds from a set of links or other HTML elements.</p>
      <h5><a href="https://feedland.org">FeedLand</a></h5>
      <p>FeedLand is a place to share and discover feeds.</p>
      <h5><a href="https://feedle.world">feedle - It is a world of feeds!</a></h5>
      <p>
        Every search is an RSS feed.
        feedle is a search engine of syndication feeds for jourmals and podcasts.
        Find what you are looking for across millions of blog posts and podcast episodes.
        Subscribe and stay up-to-date when a new result matches your criteria.
        Discover content creators you may not know about, all from a single RSS feed, solely based on your interests.
        It is a perfect match!
      </p>
      <h5><a href="https://feedmail.org">FeedMail</a></h5>
      <p>FeedMail sends you updates from your favourite sites directly to your inbox.</p>
      <h5><a href="https://feedrabbit.com">Feedrabbit</a></h5>
      <p>Follow your favorite journals by email. Atom and RSS feed to email service.</p>
      <h5><a href="https://feedsin.space">feedsin.space</a></h5>
      <p>This is a tool you can use to get RSS feeds into the fediverse. You can use it to create an account which will post a new entry any time there is a new entry in the feed.</p>
      <h5><a href="https://freelists.org">FreeLists</a></h5>
      <p>FreeLists is a mailing list service which is visited by millions of people from across the world every day to connect with friends, customers, co-workers, and more. It focuses on high-quality topics and groups means that it is easy for people to relate themselves respectively and be a part of a special community. FreeLists also offers syndication feeds for spectating.</p>
      <h5><a href="https://fivefilters.org/full-text-rss/">Full-Text RSS</a></h5>
      <p>Easy article extraction. Extract the full article content from an HTML page or a summary-only RSS feed.</p>
      <h5><a href="https://granary.io">Granary - The social web translator</a></h5>
      <p>Fetches and converts data between social networks, HTML and JSON with microformats2, ActivityStreams 1 and 2 (including ActivityPub, Nostr, and OStatus), Atom, RSS, JSON Feed, and more.</p>
      <h5><a href="https://blog.miso.town">HTML Blog to Atom</a></h5>
      <p>Do you have a blog.html page on your site? Or a section on your homepage where you list posts? Structure it the following way to make it an HTML Journal and let anyone <a href="https://blog.miso.town/blog-to-atom">subscribe to it with an atom feed</a>.</p>
      <h5><a href="https://journal.miso.town">HTML Journal to Atom</a></h5>
      <p>Do you have a journal.html page on your site? Or a section on your homepage where you give updates? Structure it the following way to make it an HTML Journal and let anyone <a href="https://journal.miso.town/journal-to-atom">subscribe to it with an atom feed</a>.</p>
      <h5><a href="https://invidious.io">Invidious</a></h5>
      <p>Turn video channels into Atom feeds. (<a href="https://gitea.invidious.io/iv-org/invidious">source code</a>)</p>
      <h5><a href="https://kill-the-newsletter.com">Kill the Newsletter!</a></h5>
      <p>Convert email newsletters into syndication feeds. (<a href="https://github.com/leafac/kill-the-newsletter">source code</a>)</p>
      <h5><a href="https://lbry.vern.cc">Librarian</a></h5>
      <p>Turn Odysee channels into RSS feeds. (<a href="https://codeberg.org/librarian/librarian">source code</a>)</p>
      <!-- h5><a href="https://libreddit.no-logs.com">libreddit</a></h5>
      <p>Turn /r/ into syndication feeds. (<a href="https://github.com/libreddit/libreddit">source code</a>)</p -->
      <h5><a href="https://github.com/zedeus/nitter/wiki/Instances">Nitter</a></h5>
      <p>Turn tweets into RSS feeds. (<a href="https://github.com/zedeus/nitter">source code</a>)</p>
      <h5><a href="https://notado.app">Notado</a></h5>
      <p>Content-first Bookmarking. Create smart feeds that are automatically populated by your tagged notes.</p>
      <h5><a href="https://omnom.zone">Omnom</a></h5>
      <p>Create self-contained snapshots for every bookmark you save. Access and share previously visited pages without worrying about modifications or availability.</p>
      <h5><a href="https://openrss.org">Open RSS</a></h5>
      <p>Open RSS is a nonprofit organization that provides free RSS feeds for sites and applications that do not already provide them, so RSS feeds can continue to be a reliable way for people to stay up-to-date with content anywhere on the internet.</p>
      <h5><a href="https://pinboard.in">Pinboard</a></h5>
      <p>Pinboard is a fast, independently run, no-nonsense bookmarking site for people who value privacy and speed.</p>
      <h5><a href="https://codeberg.org/ThePenguinDev/Proxigram/wiki/Instances">Proxigram</a></h5>
      <p>Turn stories into RSS feeds. (<a href="https://codeberg.org/ThePenguinDev/Proxigram">source code</a>)</p>
      <h5><a href="https://github.com/pablouser1/ProxiTok/wiki/Public-instances">ProxiTok</a></h5>
      <p>Turn videos into RSS feeds. (<a href="https://github.com/pablouser1/ProxiTok">source code</a>)</p>
      <h5><a href="https://rss.app/rss-feed">RSS.app</a></h5>
      <p>Create RSS Feeds from <i>almost</i> any page.</p>
      <h5><a href="https://rss.beauty">RSS.Beauty - Make Your RSS Beautiful</a></h5>
      <p>Transform RSS feeds into beautiful reading formats for a better reading experience.</p>
      <h5><a href="https://rss-bridge.org/bridge01/">RSS Bridge</a></h5>
      <p>RSS-Bridge is free and open source software for generating Atom or RSS feeds from sites which do not have one. It is written in PHP and intended to run on a server. (<a href="https://github.com/RSS-Bridge/rss-bridge">source code</a>)</p>
      <h5><a href="https://rssfilter.com">RSS Filter: clean your feed</a></h5>
      <p>Tired of seeing the same topics over and over in your RSS reader? RSSfilter.com lets you fine-tune your feeds by removing the noise.</p>
      <h5><a href="https://docs.rsshub.app">RSSHub</a></h5>
      <p>RSSHub is an open source, easy to use, and extensible RSS feed generator. It is capable of generating RSS feeds from pretty much everything. (<a href="https://github.com/DIYgod/RSSHub">source code</a>)</p>
      <h5><a href="https://rsserpent-rev.github.io/RSSerpent/latest/">RSSerpent</a></h5>
      <p>RSSerpent is an open-source software that creates RSS feeds for websites without them. (<a href="https://github.com/RSSerpent-Rev/RSSerpent">source code</a>)</p>
      <h5><a href="https://recommend.shinobi.jp">忍者画像RSS (旧:忍者レコメンド)</a></h5>
      <p>画像付きRSSブログパーツ【忍者画像RSS (旧:忍者レコメンド)】は、</p>
      <p>閲覧回数（PV）を上げ、忍者あんてなからのアクセスが</p>
      <p>期待できる画像付きのブログパーツです。</p>
    </div>
  </details>
  <details id="learn" class="segment">
  <summary>A historical overview of syndications</summary>
  <h3>🗓 History that they do not want you to know about</h3>
  <h4>Learn more about standards and syndication technology.</h4>
  <div class="content">
    <p>This is a short history and reference guide to syndication feeds.</p>
    <p>It is an essential learning that will expose to you the technologies that are vigorously being suppressed and concealed from us for over 20 years.</p>
    <p>The sign 🔖 indicates of a mature and recommended specification.</p>
    <h5>2017: RSS-in-JSON</h5>
    <p>RSS-in-JSON feed format is simply an RSS 2.0 feed that uses JSON syntax in place of XML. <a href="https://github.com/scripting/Scripting-News/tree/master/rss-in-json">Continue reading…</a></p>
    <h5>2017: JSON Feed</h5>
    <p>The JSON Feed format is a pragmatic syndication format, like RSS and Atom, but with one big difference: it is JSON instead of XML. <a href="https://jsonfeed.org/version/1.1/">Continue reading…</a></p>
    <h5>2016: Twtxt 🔖</h5>
    <p>Twtxt is a minimalist, plain-text micro-journaling format that is simple to use and easy to understand. <a href="https://twtxt.dev">Continue reading…</a></p>
    <h5>2012: Microsummary 🔖</h5>
    <p>Microsummary is a minimalist, plain-text format that is cheap to deploy, and is meant for notifications of a few words or a sentence. <a href="https://wiki.mozilla.org/Microsummaries">Continue reading…</a></p>
    <h5>2008: Atom Activity Streams 🔖</h5>
    <p>Based on Atom Over XMPP, Atom Activity Stream is an extension to the Atom feed format to express what people are doing. The stream in ActivityStreams is a feed of related activities for a given person or social object. It is utilized by ActivityPub and OStatus. <a href="https://wiki.activitystrea.ms/w/page/1359261/FrontPage">Continue reading…</a></p>
    <h5>2006: h-entry and hAtom 🔖</h5>
    <p>h-entry is a simple, open format for episodic or datestamped content. h-entry is often utilized with content intended to be syndicated, e.g. journal and blog posts. h-entry is one of several open microformat standards suitable for embedding data in HTML. <a href="http://microformats.org/wiki/h-entry">Continue reading…</a></p>
    <h5>2005: Atom Over XMPP 🔖</h5>
    <p>Presented to the public at the IETF 66 by Peter Saint-Andre of the Jabber Software Foundation (nowadays, XMPP Standards Foundation); Atom Over XMPP allows to publish Atom Syndication Format feeds into PubSub (XEP-0060: Publish-Subscribe) nodes which has an additional advantage of forming Atom Syndication Format feeds into push notifications, which significantly saves bandwidth at all ends. Atom Over XMPP is extensively utilized by the XMPP platforms <a href="https://schapps.woodpeckersnest.eu/blasta/">Blasta</a>, <a href="https://libervia.org">Libervia</a>, <a href="https://movim.eu">Movim</a> and <a href="https://schapps.woodpeckersnest.eu/rivista/">Rivista XJP</a> to store and share information <a href="https://datatracker.ietf.org/meeting/66/materials/slides-66-atompub-1.pdf">Continue reading…</a></p>
    <h5>2003: Atom and AtomPub 🔖</h5>
    <p>Atom is the name of an XML-based content and metadata syndication format, and an application-level protocol for publishing and editing resources belonging to periodically updated sites. <a href="https://web.archive.org/web/20120105062737if_/http://atomenabled.org:80/developers/syndication/#whatIsAtom">Continue reading…</a></p>
    <h5>2000: OPML 🔖</h5>
    <p>OPML is a text-based format designed to store and exchange outlines with attributes. It has been around since the early 2000s, and is widely utilized in the RSS world to exchange subscription lists. It is an established standard for interop among outliners. <a href="http://scripting.com/davenet/2000/09/24/opml10.html">Continue reading…</a></p>
    <h5>1999: RSS</h5>
    <p>RSS is a content syndication format. Its name is an acronym for Really Simple Syndication. RSS is a dialect of XML. <a href="https://rssboard.org/rss-specification#whatIsRss">Continue reading…</a></p>
    <h5>1998: XSL and XSLT 🔖</h5>
    <p>XSL (Extensible Stylesheet Language) is designed for use as part of XSLT, which is a stylesheet language for XML that has document manipulation capabilities beyond styling. <a href="http://xml.coverpages.org/xsl.html">Continue reading…</a></p>
  </div>
  </details>
  <h2>Publications</h2>
  <details id="shame" class="segment">
  <summary>Who is trying to hide syndication feeds and why?</summary>
    <h3>🏢️ Meet the mind subverters</h3>
    <!-- h3>👎 Hall of shame</h3 -->
    <h4>Discover who are those whom want to suppress syndication feeds and the technology behind it.</h4>
    <p>Below is a list of brands of products and services with userbase of over 100K, and who once used to provide access to syndication feeds in the past.</p>
    <p>The companies responsible for the following brands, pretend to be competitors when they are really cooperating and working together against progress, against people, against free flow of information, and even against their own clients.</p>
    <p>
        <h5>#1 Mozilla</h5>
        <h4>Playing the role of the selected (i.e. controlled) opposition of the internet since 1998.</h4>
        <p>Mozilla is a brand unofficially owned and controlled by Google Inc. In other words, Mozilla is the plaything and marketing toy of Gooble. It always has been and it always will be, as long as it pays the rent.</p>
      <ul>
        <li><a href="https://openrss.org/blog/browsers-should-bring-back-the-rss-button">Browsers removed the RSS Button and they should bring it back</a> (May 30, 2023)</li>
        <li><a href="https://techdows.com/2018/10/mozilla-removes-rss-live-bookmarks-support-from-firefox-64.html">Mozilla removes RSS feed and Live Bookmarks support from Firefox 64</a> (October 12, 2018)</li>
        <li><a href="https://zdnet.com/article/end-nears-for-rss-firefox-64-to-drop-built-in-support-for-rss-atom-feeds-says-mozilla/">Firefox 64 to drop built-in support for RSS, Atom feeds, says Mozilla</a> (October 15, 2018)</li>
        <li><a href="https://bleepingcomputer.com/news/software/mozilla-to-remove-support-for-built-in-feed-reader-from-firefox/">Mozilla to Remove Support for Built-In Feed Reader From Firefox</a> (July 26, 2018)</li>
        <li><a href="https://ghacks.net/2018/07/25/mozilla-plans-to-remove-rss-feed-reader-and-live-bookmarks-support-from-firefox/">Mozilla plans to remove RSS feed reader and Live Bookmarks support from Firefox</a> (July 25, 2018)</li>
        <li><a href="https://camendesign.com/blog/rss_is_dying">RSS Is Dying, and You Should Be Very Worried</a> (January 3, 2011)</li>
      </ul>
    </p>
    <p>
        <h5>#2 Google</h5>
        <h4>Be as I preach, not as I practice.</h4>
        <p>Google Chrome once had <a href="https://chromium.org/user-experience/feed-subscriptions/">a built-in RSS button</a> in the desktop version of it, and also in the source code of Chromium, the browser upon which it is based.</p>
        <p>However, the company has since removed the feature from the browser and no reason was given for its removal.</p>
      <ul>
        <li><a href="https://jwz.org/xscreensaver/google.html">XScreenSaver: Boogle Store Privacy Policy</a> (Unlike Boogle,…)</li>
        <li><a href="https://jwz.org/blog/2024/06/your-personal-information-is-very-important-to-us/">"Your private information is very important to us."</a> (June 8, 2024)</li>
        <li><a href="https://openrss.org/blog/browsers-should-bring-back-the-rss-button">Browsers removed the RSS Button and they should bring it back</a> (May 30, 2023)</li>
        <li><a href="https://theverge.com/2021/10/8/22716813/google-chrome-follow-button-rss-reader">Google Reader is still defunct, but now you can ‘follow’ RSS feeds in Chrome on Android</a> (October 8, 2021)</li>
        <li><a href="https://web.archive.org/web/20201108022203/https://support.google.com/googleplay/android-developer/answer/10177647">Developer Program Policy (To Silently Limit And Ban RSS Apps Using Falsified Premises)</a> (October 21, 2020)</li>
      </ul>
    </p>
    <p>
        <h5>#3 Apple</h5>
        <!-- h5>Shiny products with no meaningful functionality</h5 -->
        <h4>Nonfunctional shiny products.</h4>
        <p>Safari browser once showed a feed "Reader" button in the address bar for any page that had a feed available. Clicking that button opened the feed in your chosen feed reader application or Safari by default.</p>
        <p>On July 2012, the feature disappeared with no explanation from Apple on why it was removed. And despite <a href="https://archive.ph/ZYfP5">many complaints and requests to bring it back</a>, Apple refuses to restore it.</p>
      <ul>
        <li><a href="https://openrss.org/blog/browsers-should-bring-back-the-rss-button">Browsers removed the RSS Button and they should bring it back</a> (May 30, 2023)</li>
        <li><a href="https://mjtsai.com/blog/2019/12/26/apple-news-no-longer-supports-rss/">Apple News No Longer Supports RSS</a> (December 26, 2019)</li>
        <li><a href="https://imore.com/what-happened-rss-subscriptions-safari-ios-11">What happened to RSS subscriptions on Safari on iPhone?</a> (September 8, 2018)</li>
        <li><a href="https://farside.link/redlib/r/apple/comments/4xx1gv/apple_news_no_longer_supports_rss_feeds/">Apple News no longer supports RSS feeds</a> (August 16, 2016)</li>
        <li><a href="https://macobserver.com/tmo/article/apples_safari_6_rss_blunder">Apple’s Safari 6 RSS Blunder</a> (August 8, 2012)</li>
      </ul>
    </p>
    <p>
        <h5>#4 Microsoft</h5>
        <h4>We are just trying to be good at marketing.</h4>
        <p>Internet Explorer (now called Edge) once had a feed subscribe button that displayed prominently when visiting a site that had a feed.</p>
        <p>After clicking the RSS button, it even showed you a helpful page allowing you to subscribe and manage the feed, all without leaving the browser.</p>
        <p>Over time, the button got removed without warning.</p>
      <ul>
        <li><a href="https://openrss.org/blog/browsers-should-bring-back-the-rss-button">Browsers removed the RSS Button and they should bring it back</a> (May 30, 2023)</li>
        <li><a href="https://bleepingcomputer.com/news/microsoft/microsoft-adds-new-rss-feed-for-security-update-notifications/">Microsoft adds new RSS feed for security update notifications</a> (October 12, 2022)</li>
        <li><a href="http://catb.org/~esr/not-the-osi/halloween-rant.html">The Halloween Documents: An Appreciation</a></li>
        <li><a href="http://catb.org/~esr/halloween/">The Halloween Documents</a></li>
      </ul>
    </p>
    <h5>🎞️ Live bookmarks is a smart feature</h5>
    <h4>They are not saying RSS is dead, they are just actively removing support for it.</h4>
    <p>Seems to be a way to ensure that usage keeps on decreasing.</p>
    <p>Live bookmarks is a smart feature. It allows you to see a whole range of sites and articles at a glance. I use it heavily.</p>
    <p>This is a continued phony “progress” in browsers. (<a href="https://techdows.com/2018/10/mozilla-removes-rss-live-bookmarks-support-from-firefox-64.html#comment-171769">source</a>)</p>
    <h5>🪲 We are not bugs</h5>
    <h4>Commercial content publishers hate RSS because they can not engage in user tracking with it.</h4>
    <p>RSS feeds are just text with some bits attached, such as MP3 files for podcasts. There is no ECMAScript (JavaScript) or any of the fancy stuff for tracking you, just an IP address. And if you go through an aggregator there is not even that.</p>
    <p>They absolutely hate that. They would much prefer if you used their sites or apps, where they can study you like a bug. (<a href="https://farside.link/redlib/r/apple/comments/4xx1gv/apple_news_no_longer_supports_rss_feeds/d6jo3g9/#c">source</a>)</p>
    <h5>🏛️ Cartelization</h5>
    <h4>Does this reminiscing price fixing to you?</h4>
    <p>If you already figured it would be worth to call to an Antitrust Division or Competition Commission, that could have be a good idea, if the government was not involved.</p>
    <p>In case you have wondered… Yes, this is a coordinated effort of corporations, intelligence agencies, publishing platforms and governments to suppress RSS.</p>
    <h5>🎭 Bad criminals go to jail, good criminals go to parliament</h5>
    <h4>The government is a problem, not a solution.</h4>
    <p>History shows that governments and unions are always confounded to fail as people with great wealth and special interest will eventually find their way into public offices, be it by bribing, lobbying or actually sending puppets of their own to take a sit.</p>
    <h5>🚫 Boycott</h5>
    <h4>The only solution is to boycott.</h4>
    <i>"The economic boycott is our means of self-defense." --Samuel Untermyer</i>
    <p>As a Jew, I can confidently state that boycott has been proven to be a successful, albeit ignoble, practice mean which has been adopted extensively by Jews and Zionists since the 19th century and has proven to be effective; I advise you to do the same.</p>
    <p>Boycott all platforms and corporations that refuse or fail to provide a proper and easy access to syndication feeds.</p>
    <h5>〽️ Alternatives</h5>
    <h4>There are always quality alternatives.</h4>
    <p>Please refer to <a href="#alternative" class="link">alternative browsers</a>.</p>
    <!-- p>There are always quality alternatives.</p -->
  </details>
  <details id="mozilla" class="segment">
  <summary>Red lizard attacks and shenanigans</summary>
    <h3><span class="lizard">🦎</span> Red lizard assault on syndication feeds and further spasms on XSLT technologies</h3>
    <h4>Because playing the controlled-opposition role can never be ridiculous more than enough.</h4>
    <p>Not for nothing it was one of the first pioneers to adopt syndication feeds and the first one to drop it.</p>
    <p>This is a story about a multibillion organization that has made a joke out of itself by deliberately plotting and conniving against a graphical component as small as 16x16 pixels.</p>
    <h5>Syndication feeds</h5>
    <h4>Upcoming changes as a public affair.</h4>
    <p>During 2010, the organization refers itself by the brand "Mozilla Foundation" (the organization) has made a public display (i.e. phony public suggestion and mindstorm, so called) that proposed an idiotic and impossible notion that any individual is eligible to participate in proposing changes to its products, such as "Firefox" version 3.</p>
    <p>To make that public display convincing, the organization has made a "heatmap" page that displayed a new UI of "Firefox" against colorful numbers and figures, in order to make people to believe that the organization is honest and "transparent" so called.</p>
    <p>That public heatmap show and display took place for less than just a month. That's it!?</p>
    <p>It is important to note that the heatmap had first accounted for 7% - 15% of activity for the feed button and a week afterwords, it accounted for only 3% - 5% and then the heatmap results have been suddenly stopped.</p>
    <p>It is mostly probably that the heatmap stoppage has occured because the statistics, albeit probably forged, were convenient to that organization.</p>
    <p>Finally, the organization has replaced the feed button by a feed menu item, and whilst:</p>
    <ul>
      <li>The button included a visual and active indicator and took 2 - 3 clicks to get into syndication feeds;</li>
      <li>The new menu item had no automated indication, which requires to manually open the Bookmarks menu to check whether or not a feed is available;</li>
    </ul>
      <p>This task took 3 - 4 clicks and further mouse cursor move to get into syndication feeds;</p>
      <p>The menu item has made syndication feeds unemployable because, unlike the feed button which provided a visual indicator for auto-discovered feeds, people had to actively check whether or not a feed is available, which they would find out only after opening the Bookmarks menu;</p>
      <p class="cyan">This change has distorted the desired functionality for automation.</p>
      <p>This change has made people to allocate the <a href="https://rssboard.org/rss-autodiscovery">feed auto-discovery task</a> to desktop Feed Readers, which not all people in the future be familiar with because they would be lesser familiar with the Feed icon due to it concealment.</p>
    <p>Whether you are a software engineer or not, this is simple to understand that this is not an improvement in UI. It is the complete opposite of improvement.</p>
    <h4>Complete removal of syndication feeds.</h4>
    <p>On December 2018, the organization has stated that the built-in feed reader was removed from a software browser branded as "Firefox" due to security concerns which were never proven. The statement is as follows:</p>
    <p class="quote">"After reviewing the usage data and technical maintenance requirements for these features and taking into account alternative Atom/RSS feed readers already available to you, we have realized that these features have an outsized maintenance and security impact relative to their usage. Removing the feed reader and Live Bookmarks allows us to focus on features that make a greater impact." (<a href="https://support.mozilla.org/en-US/kb/feed-reader-replacements-firefox" rel="noreferrer">source</a>)</p>
    <p>At the same moment, the organization introduced a new built-in element called "Pocket" which connects to a centralized data mining platform referred to by the same name and is publicly presented as a news and content aggregating service; in reality, it is a centralized closed-source platform, not supporting interoperability, privacy unfriendly, and is subjected to potential massive data leaks which are both a privacy and a security concern.</p>
    <h4>Heatmap and karma: Hitting at 3% and getting 3% in return.</h4>
    <!-- p class="cyan">This is a story about a man who was deliberately hitting at 3% and the lord has returned 3%.</p -->
    <p>In the "Firefox Main Window Heatmap" so called, "Based on over 117,000 Windows 7 and Vista Test Pilot submissions from 7 days in July 2010" Mozilla has determined that the RSS (i.e. feed) button has less than 3% of use.</p>
    <p>The following is an excerpt from the heatmap:</p>
    <ul>
      <li>RSS</li>
      <li>Utilized by 3% of beta users, with an average of 0.05 clicks per user.</li>
      <li>Adv. 5% Int. 4% Beg. 3%</li>
    </ul>
    <p>It means nothing and constitutes no indication whatsoever, and this heatmap is biased from start to finish.</p>
    <p>Here are some reasons:</p>
    <ol>
      <li>This given data may be arbitrarily forged.</li>
      <li>Why was the earlier heatmap with 7% - 15% was ignored and overridden?</li>
      <li> Was this postpone intentional and deliberate in order to make feeds to look lesser popular?</li>
      <li>In what manner Advanced (Adv.) and Intermediate (Int.) users were counted, because most of them usually opt-out from data sharing of all kinds, even in "beta" releases.</li>
      <li>How can one determine who is to be regarded as Advanced (Adv.), Intermediate (Int.) or Beginner (Beg.)?</li>
      <li>Why Linux and other UNIX-based systems, which have the most Advanced (Adv.) and Intermediate (Int.) users, were excluded?</li>
      <li>Why were "beta users" a premier indicator, let alone Beginners (Beg.), especially when RSS was not amongst the new features that would require testing by "beta" testers?</li>
      <li>The heatmap includes number of (finger) clicks, but it does not include number of <b>eye gazes</b>, which is also an indicator.</li>
      <li>Eyes and vision, albeit unmeasurable, are also part of the matter of UX.</li>
      <li>
        <p>The 3% indication might also mean that most people, like the author of this RSS software, <i>do</i> make an extensive use of syndication feeds, but they do not need to click that button over and over, because:</p>
        <ul>
          <li>The visual indicator (feature) for the persence of RSS is just as important in and on itself.</li>
          <li>
            <p>"Click once, and get lifetime updates." That is the main point of syndication feeds!</p>
            <p>Once you are subscribed to a syndication feed with a feed reader that would <i>automatically</i> notify you for changes and new items, then you obviously do not need to press that icon again, because automation is what syndication feeds were made for.</p>
            <p>In other words, by the nature of syndication feeds, it is not meant to be clicked oftentimes.</p>
            <p>Hence equally comparison the RSS button against other components and ruthlessly setting the rate to 3% out of 100% just like other components (e.g. back and forward buttons) make no sense.</p>
            <p>The fact that a tiny screw in an airplane is not actively utilized at all times or at least at the same rate as a chair or a wheel, does not mean that the screw is not important for the airplane to operate as expected and to provide a best flying experience.</p>
          </li>
        </ul>
      </li>
    </ol>
    <p class="cyan">The purpose of the RSS icon is to <b>reduce</b> the amount of clicks by solely using the visual appearance of it. Therefore this "test" was rigged and misleading by misusing an argument which does not belong to the subject matter!</p>
    <p class="cyan">The percentage representation of the aforementioned icon, which size may vary between 16x16 to 24x24 pixels, is between 0.83% to 1.25% on a screen resolution of 1920 pixels.</p>
    <p class="cyan">The icon is indeed small and indeed also useful; then why raising an argument to remove it?</p>
    <p>Only a decade later, after this corporate-sponsored mischief, the market share of Firefox went further down to 3%.</p>
    <p>By now, the people of the aforementioned company should know that everything is at the hand of God!</p>
    <p class="quote">And said, Naked came I out of my mother's womb, and naked shall I return thither: <b>the Lord gave, and the Lord hath taken away;</b> blessed be the name of the Lord.<br/>-- Job 1:21 (King James Version)</p>
    <!-- p>The Karma. Oh, the Karma!</p -->
    <h5>XSLT</h5>
    <h4>Sabotaging a standard software module.</h4>
    <p>While figuring out how to build a syndication feed renderer (XML to HTML) addon into more browsers, an attorney at law has referred to the XSLT technology to find out that the process was not only easier than JavaScript but was also more secure and private.</p>
    <p>Compared to the PHP programming language and framework which typically work on the server-side, XSLT is exclusive to client-side, which means that all actions committed by XSLT are enclosed to the client machine, unlike PHP which actions are absolutely exposed to server.</p>
    <p>After the company has removed support for Atom/RSS, the attorney has referred to the Userscript technology in order to facilitate transition accross multiple browsers.</p>
    <p>While he continued programming a viable alternative for the long-term, he found out that the built-in Javascript programming library called <b>XSLTProcessor</b> works differently in the company's software, all in complete contradiction to the public documentation provided by the company.</p>
    <p>In other words, he discovered that <b>XSLTProcessor</b>, which is also useful for the rendering of Syndication Feeds, is deliberately malformed and would specifically fail with processing XSLT data on Syndication Feeds such as Atom, RDF and RSS file types.</p>
    <p>The findings are available at <a href="https://openuserjs.org/garage/Why_my_script_doesnt_work_with_Firefox#comment-1810ec600fe">openuserjs.org</a>.</p>
    <h5>More about this untrustful brand</h5>
    <ul>
      <li><a href="https://digdeeper.neocities.org/articles/mozilla.xhtml">Mozilla - Devil Incarnate</a> (diggy.club), <b>you should read this</b>.</li>
      <li><a href="https://spyware.neocities.org/articles/firefox">Firefox — Spyware Watchdog</a></li>
      <li><a href="https://restoreprivacy.com/mozilla-faces-gdpr-complaint-over-firefox-tracking-users-without-consent/">Mozilla Faces GDPR Complaint Over Firefox Tracking Users Without Consent</a> (September 25, 2024)</li>
      <li><a href="https://12bytes.org/firefox-add-ons-more-malware-commeth/">Firefox add-ons - more malware commeth?</a> (September 13, 2024)</li>
      <li><a href="https://jwz.org/blog/2024/06/mozillas-original-sin/">Mozilla's Original Sin</a> (June 22, 2024)</li>
      <li><a href="https://jwz.org/blog/2024/06/mozilla-is-an-advertising-company-now/">Mozilla is an advertising company now</a> (June 20, 2024)</li>
      <li><a href="https://hacktivis.me/articles/firefox-begone">Firefox begone</a> (February 9, 2024)</li>
      <li><a href="https://lunduke.locals.com/post/5053290/mozilla-2023-annual-report-ceo-pay-skyrockets-while-firefox-marketshare-nosedives">Mozilla 2023 Annual Report: CEO pay skyrockets, while Firefox Marketshare nosedives</a> (December 28, 2023)</li>
      <li><a href="https://12bytes.org/the-mozilla-monster/">The Mozilla Monster</a> (October 15, 2023)</li>
      <li><a href="https://sizeof.cat/post/firefox-telemetry-disabled-yet/">Firefox telemetry disabled, yet telemetry sent</a> (June 24, 2023)</li>
      <li><a href="https://jwz.org/blog/2020/09/this-is-a-pretty-dire-assessment-of-mozilla/">This is a pretty dire assessment of Mozilla</a> (September 23, 2020)</li>
      <li><a href="https://calpaterson.com/mozilla.html">Firefox usage is down 85% despite Mozilla's top exec pay going up 400%</a> (September 22, 2020)</li>
      <li><a href="https://jwz.org/blog/2016/10/they-live-and-the-secret-history-of-the-mozilla-logo/">They Live and the secret history of the Mozilla logo</a> (October 28, 2016)</li>
      <li><a href="https://hacktivis.me/articles/Mozilla%20is%20Broken">Mozilla is Broken</a> (November 11, 2015)</li>
    </ul>
  </details>
  <details id="advertising" class="segment">
  <summary>The case against advertisers</summary>
    <!-- h3>🚨 From advertising to totalitarianism</h3 -->
    <!-- h3>🛜 RSS as an autonomous publishing platform</h3 -->
    <h3>📰 Syndication feeds as autonomous publishing platforms</h3>
    <h4>From free speech to total surveillance promoted by western governments, and by the advertisment and censorship industries.</h4>
    <p>Learn how the contemporary advertisement industry stifles our freedoms and self-eliminates itself by embodying an amalgamation of everything that is worst in advertising and in societies of unwell consumption.</p>
    <p>Herein are arguments against the advertisement industry and the end result to where it tries to (mis)lead us.</p>
    <p class="quote">Advertisements and marketing jobs do not coexist in totalitarianism, so when the advertisement industry fights against syndication feeds, it fights for its own demise.</p>
    <h5>Preface</h5>
    <p>The advertisement industry promotes user tracking, and illegal and unethical spying instruments which are applied extensively into newer and useless standards such as HTML5. These newer standards are significantly simple to exploit against and target of individuals which make the internet more dangerous than ever before.</p>
    <p>The advertisement industry is not interested in Atom and RSS (henceforth "Syndication Feeds") because these are formats that are not subjected to the vast tracking instruments that are applied today in HTML conjoined with JavaScript; furthermore, Syndication Feeds are also lesser susceptible to targeted mind manipulation.</p>
    <h5>The mischievous story of mozilla</h5>
    <p>In 2009, the worldwide market share of the brand Mozilla has reached to 30%; and 80% of its annual revenue relied merely on promoting a specific search engine by determining it as a default search engine in its products.</p>
    <p>In 2016, the worldwide market share of Mozilla has dropped below 10%; and its annual revenue could not be the same by doing the same.</p>
    <p>In 2021, in a desperate move, Mozilla has foolishly partnered with advertising companies, very likely to provide advertisers with private data of people, and monitoring the browser activity of people, which resulted in an annual revenue which exceeded $450 million dollars.</p>
    <p>In 2022, as a result of a yet another shenanigan of Mozilla, its worldwide market share went further below 3%.</p>
    <p>Mozilla is a good lesson for the world to see that there is no such thing as a benevolent multi-billion or multi-million organization that really wants to promote free telecommunication.</p>
    <p>The brand Mozilla ca not be trusted.</p>
    <h5>The false and miserable argument perpetrated by publishers and the advertisement industry</h5>
    <p>In the recent five decades, publishers and the advertisement industry strive to convey a false narrative about the alleged mutuality and reciprocation of contents and advertisements, which basically says that "without advertisements there would be no incentive to create content" for the public to enjoy.</p>
    <p>There are many fundamental problems with this statement, and we will nullify this statement in three parts.</p>
    <ol>
      <li>The content of the big publishing houses is shamefully, disgracefully, dishonorably and indecently of very low quality.</li>
      <li>
        <p>When applying advertisements as an integrated part of a revenue model of a content production business so to speak, there is a conflict of interest between generating quality content to generating revenue;</p>
        <p>Which means that sooner or later a content producer will inevitably publish content that is either aberrational, defective, deficient, false, faulty, flawed, inadequate, wanting or even the lack thereof, which turns the content producer to a so called (i.e. false) content producer.</p>
      </li>
      <li>The conflict of interest extends to the censorship of contents that all or some advertisers do not want to be published (i.e. this is the <i>lack</i> of content as written above).</li>
    </ol>
    <h5>Saying that content depends on revenue is exactly as saying that speech depends on revenue</h5>
    <p>It is as if you would not be able to greet or say "Good day!" to your mother, father or mate unless you generate revenue by doing so or display an advertisement while doing so.</p>
    <p>To make this argument concise and successful, I will present the most obvious examples that would prove that content production is reciprocating with speech and ideology, not revenue.</p>
    <ol>
      <li>If you desire to publish anything, you will do it with or without advertisements.</li>
      <li>
        <p>Assuming you now live in a dystopian and hostile world as described in books like 1984, Brave New World and Fahrenheit 451, and you want to bring change by delivering and producing contents that would make this change that you so desire…</p>
        <p>Would you really have avertisements or revenue generating scheme in mind? Of course you would not! Rather, you will look for any possible mean available to you to make this possible, with or without advertisements or revenue.</p>
      </li>
    </ol>
    <p>To prove this point, below is a list of links to sites which the author (a Jewish Attorney) is not approving of nor is opposing to, but is definitely supportive of you to freely exercise your speech and express your opinions or views however unpopular they might be.</p>
    <p>The sites herein do prove that content production does not rely on advertisements nor has anyhing to do with revenue.</p>
    <ul>
      <li><a href="https://annas-archive.org">Anna’s Archive</a></li>
      <li><a href="https://christs.net">Christ's Net</a></li>
      <li><a href="https://copy-me.org/feed/">Copy-Me</a></li>
      <li><a href="https://defending-gibraltar.net">Defending Gibraltar</a></li>
      <li><a href="https://digdeeper.club">Dig Deeper</a></li>
      <li><a href="https://gibraltar-messenger.net">Gibraltar Messenger</a></li>
      <li><a href="https://howbadismybatch.com">How Bad is my Batch?</a></li>
      <li><a href="https://jforjustice.net">J for Justice</a></li>
      <li><a href="https://jahtruth.net">JAH Truth</a></li>
      <li><a href="http://kimmoa.se">Kimmoa</a></li>
      <li><a href="https://kopimi.com/kopimi/">Kopimi</a></li>
      <li><a href="https://metapedia.org">Metapedia</a></li>
      <li><a href="https://stormfront.org/forum/">Stormfront</a></li>
      <li><a href="http://zundelsite.org">The Zundelsite</a></li>
      <li><a href="https://thewayhomeorfacethefire.net">The Way home or face The Fire</a></li>
      <li><a href="http://vanguardnewsnetwork.com">Vanguard News Network</a></li>
      <li><a href="http://wakeupkiwi.com">Wake Up New Zealand</a></li>
      <li><a href="http://whale.to">WHALE</a></li>
    </ul>
    <p>The Zundelsite site is one of the most mirrored sites in history with hundreds of genuine copies from all over the world, and it was served freely <i>without</i> a single corporate advertisement.</p>
    <p class="cyan">Ask yourself again, do we really need advertisements and jumping banners in order to enjoy the internet?</p>
    <p>No. Of course, not!</p>
    <h5>Free speech is at peril but it really is about total control</h5>
    <p>Supported by the advertisement industry, some organizations who are part of the censorship industry, have the audacity to claim authority and to actually <i>label</i> entities and sites—freely and without legal consequences—with terms such as "hate speech", so to speak.</p>
    <p>Be it true or false, this is nothing more than a miserable way to deny the idea of <b>Internet for Speech</b>, and a truly free internet which is clean from advertisements and tracking.</p>
    <p>Those who dare to label others with outlandish terms like "hate speech" or "white supremacist" etc., are danger to humanity, society and especially to Jewish people, like myself, in particular, because they use people of my kind to promote bad ideas, to say the least.</p>
    <p>If Mr. Alex Linder of Vanguard News Network did not exist, governments, and other entities who hate your freedom of expression, have sufficient resources to create an Alex Linder of their own that would function as a pawn in their game to point their fingers at, and consequently look up for fake and prefabricated excuses to legitimize baseless censorship, in addition to perverting the internet with advertisements and tracking instruments.</p>
    <p>Hate it or like it, in this day and age, providing you are interested in saving and protecting your freedoms, people like Alex Linder are your best trusted friends, not enemies.</p>
    <h5>Advertising. Censorship. Tracking.</h5>
    <p>It is not really about speech, speech is a false pretext, it is actually about tracking and monitoring people, all in the sake of creating an anti-privacy and anti-freedom world; a world as depicted in the book 1984.</p>
    <p>Censoring and speaking out against ideology sites, especially those which do not rely on advertisements, helps to strengthen the nonsensical and senseless notion that content publishing relies on revenue, which is clearly not the case in the sites presented above.</p>
    <p>Do not fall the narrative of "hate speech" or other similar misleading ideas to suppress freedom of expression; it is a conniving plot that intends for you to participate in, and — without realizing — enforce censorship against yourselves by you, yourselves, in the end.</p>
    <p class="cyan">And it all ties directly to the deliberate attempts to suppress the syndication feed technology.</p>
    <p>And last, but not least… Greed always strikes against oneself.</p>
    <p>Advertisements and marketing jobs do not coexist in totalitarianism, so when the advertisement industry fights against syndication feeds, it fights for its own demise.</p>
    <h5>Relevant resources concerning the discussion matter</h5>
    <ul>
      <li><a href="https://jacobwsmith.xyz/stories/ad_block.html">The Ethics of Ad Blocking</a></li>
      <li><a href="https://kopimi.com/kopimi/">The History of Kopimism</a> (April 21, 2023)</li>
      <li><a href="https://reclaimthenet.org/the-thousands-of-ways-advertisers-target-your-family">The Secret Ways Advertisers Target Your Family, Including Based On Your Mood or Personality</a> (June 27, 2023)</li>
      <li><a href="https://historicly.net/p/saddam-husseins-letter-to-an-american">Saddam Hussein's Letter to an American</a> (March 16, 2019)</li>
      <li><a href="https://mashable.com/article/facebook-ad-targeting-by-mood">Ads will target your emotions, unless you are using Syndication Feeds</a> (May 2, 2017)</li>
      <li><a href="https://warpspire.com/posts/ad-supported">Ad Supported</a> (September 17, 2015)</li>
      <li><a href="https://blog.mathieui.net/they-dont-want-my-money.html">They Do Mot Want My Money</a> (July 20, 2013)</li>
      <li><a href="https://newsome.org/2011/01/04/why-big-media-wants-to-kill-rss-and-why-we-shouldnt-let-it/">Why Big Media Wants to Kill RSS, and Why We Should Not Let It</a> (January 4, 2011)</li>
    </ul>
  </details>
  <details id="proof" class="segment">
  <summary>Proving that syndication feeds are at a high demand</summary>
    <!-- h3><span class="text-icon orange">RSS</span> Is Relevant</h3 -->
    <h3>📈 Syndication feeds are very popular</h3>
    <!-- h4>From farmers to statisticians - we all need RSS</h4 -->
    <!-- h4>The good, the bad and the ugly - from farmers to statisticians - everyone use RSS</h4 -->
    <h4>"One of the most popular feature requests we have been getting for our browser has been to add an RSS reader." —<a href="https://opera.com/features/news-reader">opera.com</a></h4>
    <p>Below are resources that indicate of the popularity and high demand of syndication feeds.</p>
    <h5>Indications from various of cases</h5>
    <ul>
      <li><a href="https://trends.builtwith.com/feeds/traffic/Entire-Internet">RSS is the most popular Feed technology on the Entire Internet</a> (June 18, 2023)</li>
      <li>F-Droid: Over 50 free and open source mobile apps for <a href="https://search.f-droid.org/?q=Feed%20Reader" title="~15">Feed Reader</a>, <a href="https://search.f-droid.org/?q=Podcast" title="~18">Podcast</a> <a href="https://search.f-droid.org/?q=RSS" title="~48">and RSS</a> (June 18, 2023)</li>
      <li><a href="https://androidpolice.com/2021/04/13/google-podcasts-hits-100-million-installs-on-android-proving-people-might-care-about-rss-after-all/">Podcasts App hits 100 million installs on Android, proving people care about RSS</a> (April 13, 2021)</li>
      <li><a href="https://wired.com/story/rss-readers-feedly-inoreader-old-reader/">It is time for an RSS revival</a> (March 30, 2018)</li>
    </ul>
    <h5>Enterprises, projects, and organizations that are utilizing syndication feeds</h5>
    <p>If you do not deploy syndication feeds in your site, be it a journal, a store or even a foundation, then you are very much behind.</p>
    <h4>Companies, enterprises and shops</h4>
    <p>From prestige enterprises to enterprises with over a million of subscribers, here are some enterprises that utilize the syndication feed technology.</p>
    <a href="https://96boards.org/feed.xml">96Boards</a>
    <!-- a href="https://aerospike.com/feed/">Aerospike</a -->
    <a href="https://archos.com/en/feed/atom/">ARCHOS</a>
    <a href="https://bis.org/rss/index.htm">Bank for International Settlements ("BIS")</a>
    <a href="http://blog.bittorrent.com/feed/atom/">BitTorrent Inc.</a>
    <a href="https://bulsatcom.bg/feed/atom/">Bulsatcom Telecom</a>
    <a href="https://cuni.cz/rsshome.php?web=UKEN">Charles University</a>
    <a href="https://cheapshark.com/api/1.0/deals?output=rss&amp;title=">CheapShark</a> (per product/title)
    <a href="https://git.zx2c4.com/cgit/atom/?h=master">cgit</a>
    <a href="https://codeberg.org">Codeberg</a>
    <a href="https://consolidated.com/DesktopModules/DnnForge%20-%20NewsArticles/Rss.aspx?TabID=1877&amp;ModuleID=5685&amp;MaxCount=25">Consolidated Communications</a>
    <a href="https://cubebik.com/feed/atom/">CubeBik</a>
    <a href="https://en.blog.nic.cz/feed/atom/">CZ.NIC</a>
    <a href="https://daihatsu.com/rss.xml">DAIHATSU</a>
    <a href="https://darpa.mil/Rss/">DARPA</a>
    <a href="https://debian.org/News/news">debian Linux</a>
    <a href="https://pod.diaspora.software/public/hq.atom">diaspora* HQ</a>
    <a href="https://distrowatch.com/news/dw.xml">DistroWatch</a>
    <a href="https://diva.exchange/en/feed/atom/">DIVA.EXCHANGE</a>
    <a href="https://cdn.dnalounge.com/backstage/log/feed/">DNA Lounge</a>
    <a href="https://dnalounge.com/calendar/dnalounge.rss">DNA Pizza</a>
    <a href="https://edgedb.com/rss.xml">EdgeDB</a>
    <a href="https://edrlab.org/feed/atom/">EDRLab</a>
    <a href="https://etsy.com">Etsy Shop</a> (per brand/store)
    <a href="https://firestorm.ch/feed/atom/">FireStorm ISP</a>
    <a href="https://rss.framasoft.org">Framasoft</a>
    <a href="https://gab.com">Gab</a> (per channel)
    <a href="https://about.gitea.com/index.xml">Gitea</a>
    <a href="https://about.gitlab.com/atom.xml">GitLab</a>
    <a href="https://blog.hubspot.com/website/rss.xml">HubSpot</a>
    <a href="https://www.iaea.org/feeds">IAEA</a>
    <a href="https://idc.com/about/rss">IDC Corporate</a>
    <a href="https://indiegogo.com">Indiegogo</a> (per project)
    <a href="https://itch.io/blog.rss">itch.io</a> (per project)
    <a href="https://khadas.com/blog-feed.xml">Khadas</a>
    <a href="https://kickstarter.com">Kickstarter</a> (per project)
    <a href="https://kinsta.com/feed/atom/">Kinsta</a>
    <a href="https://loc.gov/rss/">Library of Congress</a>
    <a href="https://lukesmith.xyz/lindy.xml">LindyPress.net Books Publication</a>
    <a href="https://mailchimp.com/help/troubleshooting-rss-in-campaigns/">Mailchimp</a>
    <a href="https://blog.joinmastodon.org/index.xml">Mastodon</a>
    <a href="https://joinmobilizon.org/en/news/feed.xml">Mobilizon</a>
    <a href="https://moviepilot.de/rss/moviepilot-standard">Moviepilot</a>
    <a href="https://mullvad.net/blog/feed/atom/">Mullvad</a>
    <a href="https://newgrounds.com/wiki/help-information/rss">Newgrounds</a>
    <a href="https://oktv.se/sv/a.rss">OKTV</a>
    <a href="https://olympus-global.com/rss/index.xml">OLYMPUS</a>
    <a href="https://opensubtitles.com">OpenSubtitles</a> (per film)
    <a href="https://joinpeertube.org/rss-en.xml">PeerTube</a>
    <a href="https://procolix.com/feed/atom/">ProcoliX</a>
    <a href="https://sk.ru/rss/">Новости Сколково</a>
    <a href="https://slackbuilds.org/rss/ChangeLog.rss">SlackBuilds.org</a>
    <a href="https://sourceforge.net/blog/feed/atom/">SourceForge</a>
    <a href="https://sourcehut.org/blog/index.xml">sourcehut</a>
    <a href="https://stackexchange.com/feeds/questions">Stack Exchange</a>
    <a href="https://stackoverflow.com/feeds">Stack Overflow</a>
    <a href="https://supremecourt.gov">Supreme Court for the United States</a>
    <a href="https://tailscale.com/blog/index.xml">Tailscale</a>
    <a href="https://tpb.party/rss">The Pirate Bay</a>
    <a href="https://packages.slackware.com">The Slackware Linux Project</a>
    <a href="https://timetecinc.com/blogs/blogs.atom">Timetecinc</a>
    <a href="https://tutanota.com/blog/feed.xml">Tutanota</a>
    <a href="https://marines.mil/RSS/">United States Marine Corps</a>
    <a href="https://usembassy.gov/feed/atom/">USEmbassy.gov</a> (Replace "<span title="www is ווו (Hebrew) which translates to 666.">www</span>" by country code name for a specific Embassy)
    <a href="https://vimeo.com">Vimeo</a> (per channel)
    <a href="https://xinuos.com/feed/atom/">Xinuos</a>
    <a href="https://zapier.com/blog/feeds/latest/">Zapier</a>
    <a href="https://zendesk.com/public/assets/sitemaps/en/feed.xml">Zendesk</a>
    <a href="https://blog.zorin.com/index.xml">Zorin</a>
    <h4>Content and forum management systems</h4>
    <p>With over a billion people and over hundred of trillions of posts, you can choose from a variety of CMS or community and forum management software systems with support for syndication.</p>
    <p class="background" title="This document shows you that 'free and open source software' are also subjected to a bad type of politics, yet it is recommended to choose open source forum software, just in case some feature is gone and you desire to bring it back.">We advise to choose open source forum software.  If you choose a proprietary software, please <i>do</i> make sure that you have a convenient way to import/export and backup all data.</p>
    <ul>
      <li><a href="https://askbot.com">Askbot</a></li>
      <li><a href="https://discourse.org">Discourse</a></li>
      <li><a href="https://djangobb.org">DjangoBB</a></li>
      <li><a class="recom" href="https://elkarte.net">ElkArte</a></li>
      <li><a class="recom" href="https://fluxbb.org">FluxBB</a></li>
      <li><a href="https://invisioncommunity.com">Invision Community (IP.Board)</a></li>
      <li><a href="https://mediawiki.org/wiki/MediaWiki">MediaWiki</a></li>
      <li><a class="recom" href="https://mybb.com">MyBB</a></li>
      <li><a href="https://mylittleforum.net">my little forum</a></li>
      <li><a href="https://nodebb.org">NodeBB</a></li>
      <li><a href="https://camendesign.com/nononsense_forum">NoNonsense Forum</a></li>
      <li><a href="https://phorum.org">Phorum</a></li>
      <li><a class="recom" href="https://phpbb.com">phpBB</a></li>
      <li><a href="https://proboards.com">ProBoards</a></li>
      <li><a href="https://punbb.informer.com">PunBB</a></li>
      <li><a class="recom" href="https://redmine.org/">Redmine</a></li>
      <!-- li><a href="http://textboard.i2p">SchemeBBS</a></li -->
      <!-- li><a href="https://wakaba.c3.cx/shii/shiichan">Shiichan Anonymous BBS</a></li -->
      <li><a href="https://simplemachines.org">Simple Machines Forum</a></li>
      <!-- li><a href="https://syndie.de">Syndie</a></li -->
      <li><a href="https://vbulletin.com">vBulletin</a></li>
      <li><a href="https://xenforo.com">XenForo</a></li>
    </ul>
    <h4>Foundations and organizations</h4>
    <a href="http://cafe.nfshost.com/?feed=atom">Canadian Association for Free Expression</a>
    <a href="https://canine.org/feed/atom/">Canine Companions</a>
    <a href="https://ccc.de/de/rss/updates.xml">Chaos Computer Club</a> (Internationally recognized, highly accredited and respectful organization from Germany)
    <a href="https://static.fsf.org/fsforg/rss/news.xml">Free Software Foundation</a>
    <a href="https://freebsdfoundation.org/feed/atom/">FreeBSD Foundation</a>
    <a href="https://freedomboxfoundation.org/news/archive/index.atom">FreedomBox Foundation</a>
    <a href="https://planet.gnu.org/rss20.xml">GNU</a>
    <a href="https://linaro.org/feed.xml">Linaro</a>
    <a href="https://nlnet.nl/feed.atom">NLnet Foundation</a>
    <a href="https://perc.org/feed/atom/">PERC</a>
    <a href="https://prototypefund.de/feed/atom/">Prototype Fund</a>
    <a href="https://foundation.rust-lang.org/feed/feed.xml">Rust Foundation</a>
    <a href="https://sovereigntechfund.de/feed.rss">Sovereign Tech Fund</a>
    <a href="https://sfconservancy.org/feeds/omnibus/">The Software Freedom Conservancy</a>
    <h4>Governments and legislatures</h4>
    <h5>🇧🇿 Belize</h5>
    <ul>
      <li><a href="https://nationalassembly.gov.bz/feed/atom/">National Assembly of Belize</a></li>
    </ul>
    <h5>🇧🇴 Bolivia</h5>
    <ul>
      <li><a href="https://diputados.gob.bo/feed/atom/">Chamber of Deputies</a></li>
      <li><a href="https://web.senado.gob.bo/rss.xml">Chamber of Senators</a></li>
    </ul>
    <h5>🇨🇺 Cuba</h5>
    <ul>
      <li><a href="https://parlamentocubano.gob.cu/index.php/rss.xml">National Assembly of People's Power - Asamblea Nacional del Poder Popular</a></li>
    </ul>
    <h5>🇨🇾 Cyprus</h5>
    <ul>
      <li><a href="https://www.parliament.cy/feed">House of Representatives</a></li>
    </ul>
    <h5>🇩🇴 Dominican Republic</h5>
    <ul>
      <li><a href="https://senadord.gob.do/feed/atom/">Senate - Senado de la República Dominicana</a></li>
    </ul>
    <h5>🇸🇻 El Salvador</h5>
    <ul>
      <li><a href="https://www.presidencia.gob.sv/feed/atom/">Presidencia de la República de El Salvador</a></li>
    </ul>
    <h5>🇪🇪 Estonia</h5>
    <ul>
      <li><a href="https://valitsus.ee/en/rss-feeds/rss.xml">Eesti Vabariigi Valitsus</a></li>
      <li><a href="https://riigikogu.ee/telli-rss/">Riigikogu</a></li>
    </ul>
    <h5>🇫🇯 Fiji</h5>
    <ul>
      <li><a href="http://fiji.gov.fj/Media-Center/Speeches.aspx?rss=news">Fiji Government</a></li>
    </ul>
    <h5>🇩🇪 Germany</h5>
    <ul>
      <li><a href="https://bundesrat.de/DE/service-navi/rss/rss-node.html">German Federal Council - Bundesrat</a></li>
      <li><a href="https://bundestag.de/static/appdata/includes/rss/aktuellethemen.rss">German Parliament - Bundestages</a></li>
      <u>Ministries</u>
      <li><a href="https://bmbf.de/bmbf/de/service/aktuelle-nachrichten-im-rss-newsfeed.html">Federal Ministry of Education and Research (BMBF)</a></li>
      <li><a href="https://prototypefund.de/feed/atom/">Prototype Fund</a></li>
    </ul>
    <h5>🇭🇰 Hong Kong</h5>
    <ul>
      <li><a href="https://fso.gov.hk/rss/fsblog_rss_e.xml">Financial Secretary</a></li>
      <li><a href="https://gov.hk/en/about/rsshelp.htm">GovHK</a></li>
      <li><a href="https://elegislation.gov.hk/verified-chapters!en.rss.xml">Hong Kong e-Legislation</a></li>
    </ul>
    <h5>🇮🇸 Iceland</h5>
    <span>Icelandic Parliament</span>
    <ul>
      <li><a href="https://althingi.is/rss.xml">Alþingi</a></li>
      <li><a href="https://althingi.is/um-althingi/skrifstofa-althingis/jafnlaunavottun/rss.xml">Alþingi - Jafnlaunavottun</a></li>
    </ul>
    <h5>🏴󠁵󠁳󠁩󠁤󠁿 Idaho</h5>
    <ul>
      <li><a href="https://legislature.idaho.gov/feed/atom/">Idaho State Legislature</a></li>
    </ul>
    <h5>🇮🇷 Iran</h5>
    <ul>
      <li><a href="https://en.parliran.ir/eng/en/allrss">Islamic Parliament of IRAN</a></li>
      <li><a href="https://president.ir/rss">President of Iran</a></li>
      <li><a href="https://www.leader.ir/en/rss">The Office of the Supreme Leader, Sayyid Ali Khamenei</a></li>
    </ul>
    <h5>🇮🇪 Ireland</h5>
    <span>Houses of the Oireachtas</span>
    <ul>
      <li><a href="https://oireachtas.ie/en/rss/dail-schedule.xml">Dail Schedule</a></li>
      <li><a href="https://oireachtas.ie/en/rss/press-releases.xml">Press Releases</a></li>
      <li><a href="https://oireachtas.ie/en/rss/committee-schedule.xml">Committee Schedule</a></li>
      <li><a href="https://oireachtas.ie/en/rss/seanad-schedule.xml">Seanad Schedule</a></li>
    </ul>
    <h5>🇮🇲 Isle of Man</h5>
    <ul>
      <li><a href="https://gov.im/news/RssNews">Isle of Man Government News</a></li>
    </ul>
    <h5>🇯🇴 Jordan</h5>
    <ul>
      <li><a href="http://senate.jo/ar/rss.xml">Jordanian Senate - مجلس الأعيان</a></li>
      <li><a href="https://representatives.jo/AR/Pages/خدمة_RSS">Jordanian Parliament - مجلس النواب الأردني</a></li>
    </ul>
    <h5>🇱🇺 Luxembourg</h5>
    <ul>
      <li><a href="https://chd.lu/en/podcast">Chamber of Deputies</a></li>
      <li><a href="https://gouvernement.lu/en/actualites/toutes_actualites.rss">Gouvernement</a></li>
    </ul>
    <h5>🇲🇾 Malaysia</h5>
    <ul>
      <li><a href="https://kedah.gov.my/feed/atom/">Portal Rasmi Kerajaan Negeri Kedah</a></li>
    </ul>
    <h5>🇲🇹 Malta</h5>
    <ul>
      <li><a href="https://parlament.mt/en/rss/?t=calendar">Parliamentary Calendar</a></li>
    </ul>
    <h5>🇳🇱 Netherlands</h5>
    <ul>
      <li><a href="https://feeds.aivd.nl/nieuws.rss">AIVD</a></li>
      <li><a href="https://government.nl/rss">Government of the Netherlands</a></li>
      <li><a href="https://rijksoverheid.nl/rss">Rijksoverheid.nl</a></li>
    </ul>
    <h5>🇳🇴 Norway</h5>
    <ul>
      <li><a href="https://stortinget.no/no/Stottemeny/RSS/">Parliament of Norway</a></li>
    </ul>
    <h5>🇵🇭 Philippines</h5>
    <ul>
      <li><a href="https://parliament.bangsamoro.gov.ph/feed/atom/">Bangsamoro Parliament</a></li>
      <li><a href="https://econgress.gov.ph/feed/atom/">Congress of the Philippines</a></li>
    </ul>
    <h5>🏴󠁵󠁳󠁲󠁩󠁿 Rhode Island</h5>
    <ul>
      <li><a href="https://ri.gov/rss/">Rhode Island eGovernment Exchange Portal</a></li>
    </ul>
    <h5>🇷🇺 Russia</h5>
    <ul>
      <li><a href="https://govvrn.ru/rss">Portal of the Voronezh region - Портал Воронежской области</a></li>
    </ul>
    <h5>🇸🇷 Suriname</h5>
    <ul>
      <li><a href="https://dna.sr/rss-feed/">National Assembly - De Nationale Assemblee</a></li>
    </ul>
    <h5>🇨🇭 Switzerland</h5>
    <ul>
      <li><a href="https://admin.ch/gov/de/start/dokumentation/medienmitteilungen/rss-feeds.html">Swiss Federal Council - Der Bundesrat</a></li>
    </ul>
    <h5>🇸🇾 Syria</h5>
    <ul>
      <li><a href="http://parliament.gov.sy/arabic/index.php?node=17">The People's Assembly of Syria - مجلس الشعب السوري</a></li>
    </ul>
    <h5>🇹🇹 Trinidad and Tobago</h5>
    <ul>
      <li><a href="https://ttparliament.org/feed/atom/">Parliament of the Republic</a></li>
    </ul>
    <h5>🏴󠁵󠁳󠁵󠁴󠁿 Utah</h5>
    <ul>
      <li><a href="https://utah.gov/whatsnew/rss.xml">Utah.gov News Provider</a></li>
    </ul>
    <h4>Political movements</h4>
    <p class="background">⚠ Be warry of the political parties or movements that you support, because some might be controlled-oppositions.</p>
    <h5>🇦🇱 Albania</h5>
    <ul>
      <li><a href="https://ballikombetar.info/feed/atom/">Zani i Arbërit</a></li>
    </ul>
    <h5>🏴󠁵󠁳󠁡󠁫󠁿 Alaska</h5>
    <ul>
      <li><a href="https://alaskanindependence.party/feed/atom/">Alaskan Independence Party</a></li>
    </ul>
    <h5>🇦🇲 Armenia</h5>
    <ul>
      <li><a href="http://hhk.am/rss/?l=en">Republican Party of Armenia</a></li>
      <li><a href="http://hhk.am/rss/?l=hy">Հայաստանի Հանրապետական կուսակցություն</a></li>
      <li><a href="http://hhk.am/rss/?l=ru">Республиканская партия Армении</a></li>
    </ul>
    <h5>🇦🇺 Australia</h5>
    <ul>
      <li><a href="https://pirateparty.org.au/feed/atom/">Pirate Party Australia</a></li>
    </ul>
    <h5>🇦🇹 Austria</h5>
    <ul>
      <li><a href="https://piratenpartei.at/feed/atom/">Piratenpartei Österreichs</a></li>
    </ul>
    <h5>🏴󠁧󠁥󠁡󠁢󠁿 Abkhazia</h5>
    <ul>
      <li><a href="http://rpp-ea.org/index.php?format=feed&amp;type=atom">РПП - Единая Абхазия - United Abkhazia</a></li>
    </ul>
    <h5>🇧🇷 Brazil</h5>
    <ul>
      <li><a href="https://psol50.org.br/rss">PSOL 50</a></li>
    </ul>
    <h5>🇨🇾 Cyprus</h5>
    <ul>
      <li><a href="http://piratepartycyprus.com/rss.php">Pirate Party Cyprus</a></li>
    </ul>
    <h5>🇨🇿 Czech</h5>
    <ul>
      <li><a href="https://pirati.cz/feeds/atom/">Česká pirátská strana</a></li>
      <li><a href="https://svycarska-demokracie.cz/feed/">Švýcarská demokracie</a></li>
    </ul>
    <h5>🇩🇰 Denmark</h5>
    <ul>
      <li><a href="https://nordfront.dk/feed/atom/">Nordfront</a></li>
    </ul>
    <h5>🇫🇴 Faroe Islands</h5>
    <ul>
      <li><a href="https://folkaflokkurin.fo/feed/atom/">Fólkaflokkurin</a></li>
    </ul>
    <h5>🇫🇮 Finland</h5>
    <ul>
      <li><a href="https://vastarinta.com/feed/atom/">Kansallinen Vastarinta | Radikalisoituvan Suomen uutiset</a></li>
      <li><a href="https://kd.fi/feed/atom/">Kristillisdemokraatit</a></li>
      <li><a href="https://sinimustaliike.fi/feed/atom/">Sinimusta Liike</a></li>
      <li><a href="https://skepuolue.fi/feed/atom/">Suomen Kansa Ensin r.p.</a></li>
    </ul>
    <h5>🇬🇦 Gabon</h5>
    <ul>
      <li><a href="https://pdg-gabon.com/feed">Parti Démocratique Gabonais</a></li>
    </ul>
    <h5>🇩🇪 Germany</h5>
    <ul>
      <li><a href="https://afd.de/feed/atom/">Alternative für Deutschland</a></li>
      <li><a href="https://buendnis-c.de/feed/atom/">Bündnis C - Christen für Deutschland</a></li>
      <li><a href="http://deutsche-partei-dp.de/?feed=atom">Deutsche Partei</a></li>
      <li><a href="https://fdp.de/rss.xml">FDP - Freie Demokratische Partei</a></li>
      <li><a href="http://we-love-liberty.org/feed/">German Freedom Party</a></li>
      <li><a href="https://der-dritte-weg.info/feed/">Nationale Partei – DER III. WEG</a></li>
      <li><a href="https://parteidervernunft.de/feed/atom/">Partei der Vernunft</a></li>
      <li><a href="https://piratenpartei.de/feed/atom/">Piratenpartei Deutschland</a></li>
    </ul>
    <h5>🇬🇷 Greece</h5>
    <ul>
      <li><a href="https://pirateparty.gr/feed/atom/">Κόμμα Πειρατών Ελλάδας – Pirate party of Greece</a></li>
      <li><a href="https://xrisiavgi.com/feed/atom/">ΧΡΥΣΗ ΑΥΓΗ - Golden Dawn</a></li>
    </ul>
    <h5>🇭🇹 Haiti</h5>
    <ul>
      <li><a href="http://oplhaiti.org/feed/atom/">Oganizasyon Pèp k ap Lite</a></li>
      <li><a href="http://phtk.ht/feed/">Parti Haïtien Tèt Kale (PHTK)</a></li>
    </ul>
    <h5>🇰🇿 Kazakhstan</h5>
    <ul>
      <li><a href="http://pirateparty.kz/feed/">Pirate Party of Kazakhstan</a></li>
    </ul>
    <h5>🇮🇪 Ireland</h5>
    <ul>
      <li><a href="https://finegael.ie/feed/atom">Fine Gael</a></li>
      <li><a href="https://libertyrepublic.ie/index.php/feed/atom/">Liberty Republic</a></li>
      <li><a href="https://niconservatives.com/events/feed">NI Conservatives - Previous Events</a></li>
      <li><a href="https://irishfreedom.ie/feed/atom/">The Irish Freedom Party</a></li>
      <li><a href="https://nationalparty.ie/feed/atom/">The National Party - AN PÁIRTÍ NÁISIÚNTA</a></li>
    </ul>
    <h5>🇮🇹 Italy</h5>
    <ul>
      <li><a href="https://partito-pirata.it/feed/atom/">Partito Pirata Italiano</a></li>
    </ul>
    <h5>🇱🇻 Latvia</h5>
    <ul>
      <li><a href="https://nacionalaapvieniba.lv/feed/atom/">Nacionālā Apvienība</a></li>
    </ul>
    <h5>🇱🇹 Lithuania</h5>
    <ul>
      <li><a href="https://susivienijimas.lt/feed/atom/">Nacionalinis susivienijimas</a></li>
      <li><a href="https://piratupartija.lt/feed/atom/">Piratų Partija</a></li>
    </ul>
    <h5>🇱🇺 Luxembourg</h5>
    <ul>
      <li><a href="https://adr.lu/feed/">adr Webseite</a></li>
      <li><a href="https://piraten.lu/feed/atom/">PIRATEN</a></li>
      <li><a href="https://piraten.lu/en/feed/atom/">PIRATEN (en)</a></li>
      <li><a href="https://piraten.lu/fr/feed/atom/">PIRATES (fr)</a></li>
      <li><a href="https://piraten.lu/pt-pt/feed/atom/">PIRATEN (pt)</a></li>
      <li><a href="https://pid4you.lu/blog-feed.xml">Partei fir integral Demokratie</a></li>
    </ul>
    <h5>🇲🇾 Malaysia</h5>
    <ul>
      <li><a href="https://umno.org.my/en/feed/atom/">United Malays National Organization (UMNO)</a></li>
    </ul>
    <h5>🏴󠁵󠁳󠁭󠁡󠁿 Massachusetts</h5>
    <ul>
      <li><a href="https://masspirates.org/blog/feed/atom/">Massachusetts Pirate Party</a></li>
    </ul>
    <h5>🇲🇽 Mexico</h5>
    <ul>
      <li><a href="https://relial.org/feed/atom/">Relial Red Liberal de América Latina</a></li>
    </ul>
    <h5>🇳🇱 Netherlands</h5>
    <ul>
      <li><a href="https://bvnl.nl/feed/atom/">BVNL - Nederland voorop en vooruit!</a></li>
      <li><a href="https://piratenpartij.nl/feed/atom/">Piratenpartij</a></li>
    </ul>
    <h5>🏴󠁵󠁳󠁮󠁹󠁿 New York</h5>
    <ul>
      <li><a href="https://cpnys.org/feed/atom/">Conservative Party of New York State (CPNYS)</a></li>
      <li><a href="https://nysrighttolife.org/feed/atom/">NYS Right to Life</a></li>
    </ul>
    <h5>🇳🇿 New Zealand</h5>
    <ul>
      <li><a href="http://pirateparty.org.nz/feed/">The Pirate Party of New Zealand</a></li>
    </ul>
    <h5>🇲🇰 North Macedonia</h5>
    <ul>
      <li><a href="https://vmro-dpmne.org.mk/feed/atom">ВМРО-ДПМНЕ</a></li>
    </ul>
    <h5>🇳🇴 Norway</h5>
    <ul>
      <li><a href="https://frihetskamp.net/feed/atom/">Den nordiske Motstandsbevegelsen</a></li>
      <li><a href="https://motstandsbevegelsen.info/feed/atom/">Den nordiske Motstandsbevegelsen</a></li>
      <li><a href="https://nordicresistancemovement.org/feed/atom/">Nordic Resistance Movement | The National Socialist Front Line</a></li>
    </ul>
    <h5>🇵🇰 Pakistan</h5>
    <ul>
      <li><a href="https://pnbest.my/blog-feed.xml">Perikatan Nasional</a></li>
    </ul>
    <h5>🇵🇱 Poland</h5>
    <ul>
      <li><a href="https://konfederacja.pl/feed/atom/">Konfederacja</a></li>
      <li><a href="https://polskapartiapiratow.pl/feed/atom/">Polska Partia Piratów</a></li>
      <li><a href="https://suwerennapolska.pl/feed/atom/">Suwerenna Polska</a></li>
    </ul>
    <h5>🇵🇹 Portugal</h5>
    <ul>
      <li><a href="http://partidoergue-te.pt/feed/atom/">Ergue-te!</a></li>
    </ul>
    <h5>🇷🇴 Romania</h5>
    <ul>
      <li><a href="https://partidulpirat.ro/feed/atom/">Partidul Pirat Romania</a></li>
      <li><a href="https://partidulromaniamare.ro/feed/atom/">Partidul România Mare</a></li>
      <li><a href="https://partidulromaniamare.com/feed/atom/">Partidul Romania Mare – Spania</a></li>
    </ul>
    <h5>🇷🇺 Russia</h5>
    <ul>
      <li><a href="https://pirate-party.ru/feed/">Пиратская партия России | PPRU</a></li>
      <li><a href="https://zapravdu.org/feed/atom/">ЗА ПРАВДУ</a></li>
      <li><a href="http://xn--80aaag6azbdefu3lf.xn--p1ai/atom/">Политическая партия "Гражданская Платформа"</a></li>
      <li><a href="https://cprf.ru/feed/atom/">Communist Party of the Russian Federation</a></li>
      <li><a href="https://kprf.ru/export/rss/first.xml">КПРФ.ру - Главные новости</a></li>
      <li><a href="http://komros.org/feed/atom/">КОММУНИСТЫ РОССИИ Официальный сайт</a></li>
      <li><a href="http://patriot-rus.ru/rss/rss_news.xml">Патриоты России. Новости</a></li>
      <li><a href="https://partyadela.ru/feed/atom/">Партия Дела</a></li>
    </ul>
    <h5>🇸🇮 Slovenia</h5>
    <ul>
      <li><a href="https://piratskastranka.si/rss/">Pirati</a></li>
    </ul>
    <h5>🇪🇸 Spain</h5>
    <ul>
      <li><a href="https://alianzanacional.net/feed/atom/">Alianza Nacional</a></li>
    </ul>
    <h5>🇸🇪 Sweden</h5>
    <ul>
      <li><a href="https://nordfront.se/feed/atom/">Nordfront</a></li>
      <li><a href="https://nordurvigi.se/feed/atom/">Norræna Mótstöðuhreyfingin</a></li>
      <li><a href="https://piratpartiet.se/feed/atom/">Piratpartiet</a></li>
    </ul>
    <h5>🇨🇭 Switzerland</h5>
    <ul>
      <li><a href="https://die-mitte.ch/feed/atom/">Christian Democratic People's Party of Switzerland</a></li>
      <li><a href="https://edu-schweiz.ch/feed/atom/">EDU Schweiz</a></li>
      <li><a href="https://lega-dei-ticinesi.ch/feed/atom/">Lega dei Ticinesi</a></li>
      <li><a href="https://mcge.ch/feed/atom/">MCGE - Mouvement Citoyens Genevois</a></li>
      <li><a href="https://piratenpartei.ch/feed/atom/">Piratenpartei Schweiz</a></li>
      <li><a href="https://svp.ch/feed/atom/">SVP Schweiz - Schweizerische Volkspartei SVP</a></li>
    </ul>
    <h5>🇺🇦 Ukraine</h5>
    <ul>
      <li><a href="https://azov.org.ua/feed/">Бригада спеціального призначення АЗОВ</a></li>
    </ul>
    <h5>🇬🇧 United Kingdom</h5>
    <ul>
      <li><a href="https://cpaparty.net/feed/atom/">Christian Peoples Alliance</a></li>
      <li><a href="https://cityhallconservatives.com/blog-feed.xml">City Hall Conservatives</a></li>
      <li><a href="https://communistparty.co.uk/feed/atom/">Communist Party of Great Britain</a></li>
      <li><a href="https://heritageparty.org/feed/atom/">Heritage Party</a></li>
      <li><a href="http://natfront.info/feed/atom/">National Front</a></li>
      <li><a href="https://pirateparty.org.uk/feed.xml">Pirate Party UK</a></li>
      <li><a href="https://bnp.org.uk/feed/atom/">The British National Party (BNP)</a></li>
      <li><a href="http://libertarian.co.uk/feed/atom/">The Libertarian Alliance</a></li>
      <li><a href="https://ukchristianparty.org/feed/atom/">UK Christian Party</a></li>
    </ul>
    <h5>🇺🇸 United States for America</h5>
    <ul>
      <li><a href="https://campaignforliberty.org/feed/atom">Campaign for Liberty</a></li>
      <li><a href="https://constitutionparty.com/feed/atom/">Constitution Party</a></li>
      <li><a href="https://natall.com/feed/atom/">National Alliance</a></li>
      <li><a href="https://prohibitionparty.org/blog-feed.xml">Prohibition Party</a></li>
      <li><a href="https://reformparty.org/feed/atom/">Reform Party National Committee</a></li>
      <li><a href="https://therightstuff.biz/feed/atom">The Right Stuff</a></li>
      <li><a href="https://uspirates.org/feed/atom/">United States Pirate Party</a></li>
    </ul>
    <h5>🏴󠁧󠁢󠁷󠁬󠁳󠁿 Wales</h5>
    <ul>
      <li><a href="https://conservatives.wales/events/feed">The Welsh Conservative Party - Previous Events</a></li>
    </ul>
    <h4>Legal</h4>
    <ul>
      <li><a href="https://daihatsu.com/rss.xml">DAIHATSU</a> (Recovering)</li>
      <li><a href="https://elegislation.gov.hk/verified-chapters!en.rss.xml">Hong Kong e-Legislation</a></li>
      <li><a href="https://madofftrustee.com/rss.php">Madoff Trustee</a></li>
    </ul>
    <h4>Major publications</h4>
    <a href="http://feeds.arstechnica.com/arstechnica/index">Ars Technica</a>
    <a href="https://blacklistednews.com/rss.php">BlackListed News</a>
    <a href="https://breitbart.com/feed">Breitbart</a>
    <a href="https://ft.lk/rss">Daily FT</a>
    <a href="https://dailytelegraph.com.au/help-rss">Daily Telegraph</a>
    <a href="https://spiegel.de/dienste/besser-surfen-auf-spiegel-online-so-funktioniert-rss-a-1040321.html">DER SPIEGEL</a>
      <!-- a href="https://corporate.dw.com/de/rss/s-9773">Deutsche Welle</a -->
    <a href="https://dw.com/rss">Deutsche Welle</a>
    <a href="https://filmdienst.de/rss">Filmdienst Magazin</a>
    <a href="https://gawker.com/rss">Gawker</a>
    <a href="https://news.ycombinator.com/rss">Hacker News</a>
    <a href="https://hindustantimes.com/rss">Hindustan Times</a>
    <a href="https://tube.kla.tv/feeds/videos.xml?videoChannelId=5">Kla.TV - klagemauer.TV</a>
    <a href="https://ksl.com/rss/news">KSL News</a>
    <a href="https://lemonde.fr/actualite-medias/article/2019/08/12/les-flux-rss-du-monde-fr_5498778_3236.html">Le Monde</a>
    <a href="https://linux-magazine.com/rss/feed/lmi_news">Linux Magazine</a>
    <a href="https://malaymail.com/rss">Malay Mail</a>
    <a href="https://news.com.au/help/rss-feeds">news.com.au</a>
    <a href="https://newatlas.com/rss">New Atlas</a>
    <a href="https://newsblenda.com/feed/atom/">Newsblenda</a>
    <a href="https://api.ntd.com/feed">NTD Television</a>
    <a href="https://oraclebroadcasting.com">Oracle Broadcasting Network</a>
    <a href="https://pcmag.com/feeds/rss/latest">PCMag.com</a>
    <a href="https://pcworld.com/feed">PCWorld</a>
    <a href="https://phoronix.com/rss.php">Phoronix</a>
    <a href="https://prnewswire.com/rss/">PR Newswire</a>
    <a href="https://presstv.ir/rss.xml">Press TV</a>
    <a href="https://smithsonianmag.com/rss/">Smithsonian Magazine</a>
    <a href="https://rss.slashdot.org/Slashdot/slashdotMain">Slashdot</a>
    <a href="https://substack.com">Substack</a>
    <a href="https://tehrantimes.com/rss-help">Tehran Times</a>
    <a href="https://sltrib.com/rss/">The Salt Lake Tribune</a>
    <a href="https://theverge.com/rss/index.xml">The Verge</a>
    <a href="https://thewest.com.au/rss-feeds">The West Australian</a>
    <a href="https://torrentfreak.com/feed/atom/">TorrentFreak</a>
    <a href="https://variety.com/feed/atom/">Variety</a>
    <a href="https://vdare.com/generalfeed">VDARE</a>
    <a href="https://en.yna.co.kr/channel/index">Yonhap News Agency</a>
    <a href="https://ziffdavis.com/feed/atom">Ziff Davis</a>
    <h4>Propaganda and PsyOp sites that are sponsored by intelligence agencies</h4>
    <h5>Intelligence and foreign controlled disinformation publications</h5>
    <p>The following agent publications below pretend to be news outlets, when in fact, these are funded and controlled either by internal or foreign intelligence or military agencies, and their purpose is to instil fear, disrupt and subvert your mind with bogus information, not otherwise.</p>
    <p>You might as well want to refer them as Corporate Lame-Ass Propaganda (CLAP) as written at <a href="https://reallibertymedia.com/about-rlm/">RLM</a>.</p>
    <ul>
      <!-- TODO Find that article titled "Why the news will never get (or be) better" with a comic of a news anchor in studio saying "You are all going to die" -->
      <li><a href="https://farside.link/teddit/r/comics/comments/y21feb/the_news">The News</a> (Comic)</li>
      <!-- li><a href="https://farside.link/teddit/pics/w:null_p52ifybn1dt91.png">The News</a> (Comic)</li -->
      <li><a href="https://informationliberation.com/?id=23538">64% - Internet News Audience Critical of Press</a></li>
      <li><a href="https://jacobwsmith.xyz/stories/dont_watch_the_news.html">Do not watch the news</a></li>
      <li><a href="https://icyphox.sh/blog/dont-news/">You do not need news</a></li>
      <!-- li><a href="https://theguardian.com/media/2013/apr/12/news-is-bad-rolf-dobelli">News is bad for you – and giving up reading it will make you happier</a></li -->
      <li><a href="https://web.archive.org/web/20220930204955if_/https://tomfasano.net/posts/private-networking.html">Computer Networking and It's Future</a></li>
    </ul>
    <p>The fact that these compromised publications (so called) make use of syndication feeds, realizes the obvious importance of the syndication feed technology.</p>
    <p class="background">The resources below are listed for realization purposes only, and we further advise you <i>not</i> to subscribe to any of these harmful publications, unless you are interested in fictional information.</p>
    <div>
      <p>
      Al Jazeera, BBC, CBN, CBS, CNBC, CNN, DC News Now, FOX, Gizmodo, Google News, Hindustan Times, Infowars, <span title="SA(T)AN">NASA</span>, NPR, Rolling Stone, RT (Russia Today), SciTechDaily, SKY News, The Athletic, The Daily Beast, The Daily Mail Online, The Daily Wire, The Guardian, The New York Times, The New Yorker, The Wall Street Journal, The Washington Post, U.S. Department of State, Variety, Wikimedia Foundation, Yahoo News
      </p>
      <p>P.S. <a href="http://whale.to/a/wikipedia.html">Wikipedia: The Matrix encyclopedia</a> is really a false publication medium of <a href="https://dcpp.wordpress.com/2022/04/10/adc-no-cancelled/">biased</a>, and <a href="https://digdeeper.club/articles/wikipedia.xhtml#circumcision">bad</a> <a href="https://fivefilters.org/2023/glenn-greenwald-on-wikipedia-bias/">propaganda</a> (including the censoring of free communications such as <a href="https://web.archive.org/web/20110721145902if_/https://stpeter.im/index.php/2009/12/22/routing-around-wikipedia/">XMPP</a> telecommunications). You are advised to read and get your information from <a href="https://metapedia.org">Metapedia</a> which actually has factual information.</p>
    </div>
    <h5>Conclusion</h5>
    <!-- h4>Do not be left behind. Use RSS.</h4 -->
    <!-- p>Do not be left behind. Use RSS.</p -->
    <p>If you do not make use of syndication feeds yet; then, you definitely should start using them, now. <b>You need it.</b></p>
    <p>Do not be left behind. Use Syndication Feeds. <i>Today!</i></p>
    <!-- p>And if you do not already have a site, then <a href="https://videos.lukesmith.xyz/w/9aadaf2f-a8e7-4579-913d-b250fd1aaaa9"><u>Get a Website Now!</u> <b>Do not be a Digital Peasant!</b></a></p -->
    <!-- p>You might also want to read the <a href="https://sizeof.cat/post/dos-and-donts/">Dos and Don'ts of current times</a>.</p -->
    <!-- p><i>Use RSS Today!</i></p -->
  </details>
  <details id="alternative" class="segment">
  <summary><b>Recommended browsers</b></summary>
    <h3>🖥️ Appropriate vendors</h3>
    <!-- h4>You and your friends deserve to have access to RSS.</h4 -->
    <h4>You and your friends deserve to have a first-class RSS experience baked in to your software so well your grandmother could use it —<a href="https://camendesign.com/blog/rss_is_dying">Kroc Camen</a></h4>
    <p>Below are browsers with built-in support for syndication feeds, and as such are worthy of the name Browser.</p>
    <h5>🐍️ <a href="https://basilisk-browser.org">Basilisk</a></h5>
    <p>Basilisk is a free and Open Source XUL-based web browser, featuring the well-known Firefox-style interface and operation. It is based on the Goanna layout and rendering engine (a fork of Gecko) and builds upon the Unified XUL Platform (UXP), which in turn is a fork of the Mozilla code base without Servo nor Rust.</p>
    <h5><span class="cyan-color">𝐂</span> <a href="http://conkeror.org">Conkeror</a></h5>
    <!-- ℭ -->
    <p>Conkeror is a keyboard-oriented, highly-customizable, highly-extensible web browser based on Mozilla XULRunner, written mainly in JavaScript, and inspired by exceptional software such as Emacs and vi. Conkeror features a sophisticated keyboard system, allowing users to run commands and interact with content in powerful and novel ways. It is self-documenting, featuring a powerful interactive help system.</p>
    <h5>🦅 <a href="https://falkon.org">Falkon</a></h5>
    <h5>Lightweight multiplatform browser.</h5>
    <!-- p>Falkon (previously QupZilla) is a modern browser based on WebKit core and Qt Framework. WebKit guarante fast browsing and Qt availability on all major platforms.</p -->
    <p>Falkon is a KDE browser using QtWebEngine rendering engine, previously known as QupZilla. It aims to be a lightweight browser available through all major platforms. This project has been originally started only for educational purposes. But from its start, Falkon has grown into a feature-rich browser.</p>
    <p>Falkon has all standard functions you expect from a browser. It includes bookmarks, history (both also in sidebar) and tabs. Above that, it has by default enabled blocking ads with a built-in AdBlock plugin.</p>
    <h5>🦎 <a href="http://kmeleonbrowser.org">K-Meleon</a></h5>
    <h5>The browser you control.</h5>
    <p>K-Meleon is a lightweight, customizable, open-source browser. It is designed for MS Windows (Win32) operating systems.</p>
    <p>K-Meleon can use the secure Goanna engine based on Mozilla's Gecko layout engine or Gecko itself. Support for legacy operating systems, low RAM usage, a macro language to customize the browser, and privacy-respecting defaults are among K-Meleon's unique features.</p>
    <p>K-Meleon can run also on Windows 2000, Windows XP and <a href="https://reactos.org">ReactOS</a>.</p>
    <h5>🛡️ <a href="https://stoutner.com/privacy-browser-pc/">Privacy Browser PC</a></h5>
    <h5>The only way to prevent data from being abused is to prevent it from being collected in the first place.</h5>
    <p>Privacy Browser PC is an open source web browser focused on user privacy based on Qt WebEgnine. It is released under the GPLv3+ license. The source code can be viewed at gitweb.stoutner.com.</p>
    <p>Privacy Browser has two primary goals.</p>
    <ul>
      <li>Minimize the data that is sent to the internet.</li>
      <li>Minimize the data that is stored on the device.</li>
    </ul>
    <p>Most browsers silently give websites massive amounts of information that allows them to track you and compromise your privacy. Websites and ad networks use technologies like JavaScript, cookies, DOM storage, user agents, and many other things to uniquely identify each user and track them between visits and across the web.</p>
    <p>In contrast, privacy sensitive features are disabled by default in Privacy Browser. If one of these technologies is required for a website to function correctly, the user may choose to turn it on for just that visit. Or, they can use domain settings to automatically turn on certain features when entering a specific website and turn them off again when leaving.</p>
    <h5>🐦 <a href="https://ladybird.org">Ladybird</a></h5>
    <h5>A new cross platform browser project.</h5>
    <p>The Ladybird browser came to life on July 4th; it was originally a headless mode of LibWeb (previously LibHTML) and is also featuring a Qt GUI for the LibWeb browser engine. Ladybird was intended to be a debugging tool for people to remain in Linux while working on LibWeb if they wanted to. Two months later, Ladybird has became a browser in its own right.</p>
    <p>At this point, we might as well tweak the scope from “browser engine for SerenityOS” to “cross-platform browser engine” and build something that many more people could potentially have use for some day. :^)</p>
    <h5>🌆 <a href="https://gmi.skyjake.fi/lagrange/">Lagrange</a></h5>
    <h5>Browser for people who talk business… securely.</h5>
    <!-- h5>Browser For People Who Talk <sup>Secured</sup> Business.</h5 -->
    <p>Lagrange is a GUI client for browsing Geminispace. It offers modern conveniences familiar from browsers, such as smooth scrolling, inline image viewing, multiple tabs, visual themes, Unicode fonts, bookmarks, history, and page outlines.</p>
    <p>Like Gemini, Lagrange has been designed with minimalism in mind. It depends on a small number of essential libraries. It is written in C and uses SDL for hardware-accelerated graphics. OpenSSL is utilized for secure communications.</p>
    <p>Lagrange supports <b>Gemini and Atom</b> feed subscriptions. Atom feeds are automatically translated to the Gemini feed format so they can be viewed and subscribed to as a typical 'text/gemini' page.</p>
    <h5>🦦 <a href="https://otter-browser.org">Otter Browser</a></h5>
    <h5>Controlled by the user, not vice versa.</h5>
    <p>Otter Browser aims to recreate the best aspects of the classic Opera (12.x) UI using Qt5.</p>
    <p>Otter Browser aims to recreate the best aspects of Opera 12 and to revive its spirit. We are focused on providing the powerful features "power users" want while keeping the browser fast and lightweight.</p>
    <p>We also learned from history and decided to release the browser under the GNU GPL v3.</p>
    <h5>🌕 <a href="https://palemoon.org">Pale Moon</a></h5>
    <h5>Your browser, your way.</h5>
    <p>Pale Moon is an Open Source, Goanna-based browser, focusing on efficiency and customization.</p>
    <p>Pale Moon offers you a browsing experience in a browser completely built from its own, independently developed source that has been forked off from Firefox/Mozilla code a number of years ago, with carefully selected features and optimizations to improve the browser's stability and user experience, while offering full customization and a growing collection of extensions and themes to make the browser truly your own.</p>
    <h5>🦁 <a href="https://brave.com/brave-today-rss/">Brave</a></h5>
    <h5>Secure, fast, and private browser.</h5>
    <p>Brave is on a mission to protect your privacy online. We make a suite of internet privacy tools—including our browser and search engine—that shield you from the ads, trackers, and other creepy stuff trying to follow you across the internet.</p>
    <p>Brave News, the privacy-preserving news reader integrated into the Brave browser, now features syndication feeds.</p>
    <h5><span class="red-color">𝐎</span> <a href="https://opera.com/features/news-reader">Opera</a></h5>
    <h5>Faster, safer, smarter.</h5>
    <p>Experience faster, distraction-free browsing with Ad blocking, and browse privately. Smoothly sync your data and send files between Opera on Mac, Windows, Linux, iOS, Android, and Chromebook.</p>
    <p><i>One of the most popular feature requests we have been getting for our browser has been to add an RSS reader.</i></p>
    <p><i>Your feedback matters a lot to us when we are planning our roadmap. As such, Opera’s news reader now supports RSS feeds, too!</i></p>
    <p class="background">⚠️ Opera is a proprietary freeware.</p>
    <h5><span class="orange-color">𝓥</span> <a href="https://vivaldi.com/features/feed-reader/">Vivaldi</a></h5>
    <h5>Powerful, personal, private.</h5>
    <p>Get unrivaled customization options and built-in browser features for better performance, productivity, and privacy.</p>
    <p>Vivaldi Feed Reader helps you build a private news feed based on your interests, not what you do online.</p>
    <p class="background">⚠️ Vivaldi is a proprietary freeware.</p>
  </details>
  <details id="even" class="segment">
  <summary><b>Even <i>"they"</i> have syndication feeds</b></summary>
    <h3><span class="redice">🧊</span> Even <i>"they"</i> have syndication feeds</h3>
    <h4>Then why should not you too?</h4>
    <p>This is a list of sources who are infamous by government regulated media (<abbr title="Corporate Lame-Ass Propaganda">CLAP</abbr>), which does not mean that these sources are necessarily bad; it only means that some governments hate them, which is fine, because most people hate most of the political imposters (i.e. politicians) either, so that makes it all even.</p>
    <p>Call them <span title="Are they?">silly</span>; call them <span title="It seems that they are pretty large!">small</span>; call them <span title="Are they?">stupid</span>; call them <span title="Is being racist a bad thing?">racists</span>; call them <span title="Are they?">incompetent</span>; call them <span title="Are they?">extremists</span>; even call them <span title="Are they?">dangerous</span>, <span title="Are they?">terrorists</span> and <span title="Are they?">saboteurs</span>; call them <a href="http://newworldorderreport.com/Articles/tabid/266/ID/980/33-Conspiracy-Theories-That-Turned-Out-To-Be-True-What-Every-Person-Should-Know.aspx" title="33 Conspiracy Theories That Turned Out To Be True, What Every Person Should Know…">conspiracy</a> <a href="https://blacklistednews.com/article/83721/5-crazy-conspiracy-theories-that-actually-turned-out-to-be.html" title="5 “CRAZY” CONSPIRACY THEORIES THAT ACTUALLY TURNED OUT TO BE TRUE">theorists</a>; call them <span title="Are they?">bad</span>!</p>
    <p>You can call them anything you want, and yet, they are indeed wiser when it regards to be easy to reach.</p>
    <h5>Asia</h5>
    <ul>
      <li><a href="https://addameer.org/rss.xml">Addameer</a>, an organization from Ramallah, Palestine</li>
      <li><a href="https://aljazeera.com/xml/rss/all.xml">Al Jazeera</a>, a major publication from Doha, Qatar</li>
      <li><a href="https://ericdubay.wordpress.com/feed/atom/">EricDubay.com</a>, a major publication of Mr. Eric Dubay from Thailand</li>
      <li><a href="https://pnbest.my/blog-feed.xml">Perikatan Nasional</a>, a political party from Pakistan</li>
      <li><a href="https://pflp.ps/rss">Popular Front for the Liberation of Palestine</a>, an organization from Palestine</li>
      <li><a href="https://presstv.ir/rss.xml">Press TV</a>, a major publication from Iran</li>
      <li><a href="https://sobhfestival.com/feed/atom/">Sobh International Media Festival</a>, Iran Radio and Television Media Festival from Iran</li>
      <li><a href="https://corbettreport.com/feed/atom/">The Corbett Report</a>, a popular podcast of Mr. James Corbett from Japan</li>
    </ul>
    <h5>Europe</h5>
    <ul>
      <li><a href="https://alianzanacional.net/feed/atom/">Alianza Nacional</a>, a political party from Spain</li>
      <li><a href="https://afd.de/feed/atom/">Alternative für Deutschland</a>, a political party from Germany</li>
      <li><a href="https://arktos.com/feed/atom/">Arktos Media</a>, a major publication of Mr. Daniel Friberg from Budapest</li>
      <li><a href="https://frihetskamp.net/feed/atom/">Den nordiske Motstandsbevegelsen</a> and <a href="https://motstandsbevegelsen.info/feed/atom/">Den nordiske Motstandsbevegelsen</a>, a political party from Norway</li>
      <li><a href="https://hopoi.org/?feed=atom">Hands Off the People of Iran</a>, a political movement from London and Oxford, England</li>
      <li><a href="https://vastarinta.com/feed/atom/">Kansallinen Vastarinta</a>, a political party from Finland</li>
      <li><a href="https://tube.kla.tv/feeds/videos.xml?videoChannelId=5">Kla.TV - klagemauer.TV</a>, a major publication of Mr. Ivo Sasek from Switzerland</li>
      <li><a href="http://libertarian.co.uk/feed/atom/">Libertarian Alliance</a>, a political party from UK</li>
      <li><a href="https://middleeastmonitor.com/feed/atom/">Middle East Monitor</a>, a major publication of Ardi Associates from UK</li>
      <li><a href="https://susivienijimas.lt/feed/atom/">Nacionalinis susivienijimas</a>, a political party from Lithuania</li>
      <li><a href="https://nacionalaapvieniba.lv/feed/atom/">Nacionālā Apvienība</a>, a political party from Latvia</li>
      <li><a href="http://natfront.info/feed/atom/">National Front</a>, a political party from UK</li>
      <li><a href="https://nordfront.dk/feed/atom/">Nordfront</a>, a political party from Denmark</li>
      <li><a href="https://nordfront.se/feed/atom/">Nordfront</a> and <a href="https://nordurvigi.se/feed/atom/">Norræna Mótstöðuhreyfingin</a>, a political party from Sweden</li>
      <li><a href="https://nordicresistancemovement.org/feed/atom/">Nordic Resistance Movement</a>, a political party from Norway</li>
      <li><a href="https://piraten.lu/feed/atom/">PIRATEN</a>, a political party from Luxembourg</li>
      <li><a href="https://piratpartiet.se/feed/atom/">Piratpartiet</a>, a political party from Sweden</li>
      <li><a href="https://redice.tv/rss/red-ice-radio">Red Ice Radio</a>, a major publication of activist and journalist Mr. Henrik Palmgren from Post Falls, Idaho and Sweden (there are even more <a href="https://redice.tv/rss" class="not-an-xml">syndication feeds</a>)</li>
      <li><a href="https://nationalparty.ie/feed/atom/">AN PÁIRTÍ NÁISIÚNTA</a>, a political party from Ireland</li>
      <li><a href="https://xrisiavgi.com/feed/atom/">ΧΡΥΣΗ ΑΥΓΗ</a>, a political party from Greece</li>
    </ul>
    <h5>North America</h5>
    <ul>
      <li><a href="https://afgj.org/feed">Alliance for World Justice</a>, a political movement from Arizona</li>
      <li><a href="https://bdscoalition.ca/feed/atom/">BDS Coalition</a>, a political movement from Canada</li>
      <li><a href="https://bdsmovement.net/rss-feed.xml">BDS Movement</a>, a political movement</li>
      <li><a href="https://blacklistednews.com/rss.php">BlackListed News</a>, a major publication of Mr. Doug Owen from Round Rock, Texas</li>
      <li><a href="http://cafe.nfshost.com/?feed=atom">CAFE</a> (Canadian Association for Free Expression), a popular organization from Canada</li>
      <li><a href="https://campaignforliberty.org/feed/atom">Campaign for Liberty</a>, a political movement of Mr. Dr. Ron Paul from Haymarket, Prince William County, Virginia</li>
      <li><a href="https://codoh.com/feed/atom/">Committee for Open Debate on the Holocaust</a>, a popular organization from Healdsburg, California</li>
      <li><a href="https://davidduke.com/feed/atom/">DavidDuke.com</a>, a private publication of a former Louisiana politician Mr. Dr. David Duke from Louisiana</li>
      <li><a href="https://drrimatruthreports.com/feed/atom/">Dr. Rima Truth Reports</a> and <a href="http://opensourcetruth.com/feed/atom/">Open Source Truth</a>, major publications of Mrs. Dr. Rima E. Laibow, M.D. from Newton, New Jersey</li>
      <li><a href="https://fakeologist.com/feed/atom/">Fakeologist</a>, a major publication and popular podcast of Mr. Ab Irato from Canada</li>
      <li><a href="https://grrrgraphics.com/feed/atom/">GrrrGraphics</a>, a major satiric publication of a cartoonist Mr. Ben Garrison from San Angelo, Texas</li>
      <li><a href="https://johnderbyshire.com/feed.xml">JohnDerbyshire.com</a>, a popular podcast of Mr. John Derbyshire from Pennsylvania</li>
      <li><a href="http://larkenrose.com/?format=feed&amp;type=atom">LarkenRose.com</a>, a private publication of Mr. Larken Rose, the author of the book "The Most Dangerous Superstition"</li>
      <li><a href="https://lewrockwell.com/feed/atom/">LewRockwell.com</a>, a major publication of Mr. Lew Rockwell from Auburn, Alabama</li>
      <li>Ludwig von <a href="https://mises.org/rss.xml">Mises Institute</a>, for Austrian Economics, a major publication and a well renowned institution of Mr. Lew Rockwell from Auburn, Alabama</li>
      <li><a href="http://grizzom.blogspot.com/feeds/posts/default">Mami's Shit</a>, a popular and communal publication operated by Zapoper</li>
      <li><a href="https://jack-donovan.com/sowilo/feed/atom/">Masculine Philosophy</a>, a major publication of Mr. Jack Donovan from Pennsylvania</li>
      <li><a href="https://mintpressnews.com/feed/atom/">MintPress News</a>, a major publication which includes the <a href="https://mintpressnews.com/category/podcasts/feed/atom/">MintCast</a> podcast of "Behind The Headlines" from Minneapolis, Minnesota</li>
      <li><a href="https://nationalvanguard.org/feed/atom/">National Vanguard</a>, a major publication from Mountain City, Tennessee</li>
      <li><a href="http://oraclebroadcasting.com/" class="not-an-xml">Oracle Broadcasting Network</a>, a major radio station and a popular podcast of Mr. Lee Rogers from Texas (<a href="http://oraclebroadcasting.com/rss_recent.php">Oracle Broadcasting Network</a> has been inactive since 2013)</li>
      <li><a href="https://redice.tv/rss/radio-3fourteen">Radio 3Fourteen</a>, a popular podcast of activist and journalist Mrs. Lana Lokteff from Post Falls, Idaho</li>
      <li><a href="https://realjewnews.com/?feed=atom">Real Jew News</a>, a major publication and a popular podcast of "Street Evangelist" Brother Nathanael Kapner from Priest River, Idaho</li>
      <li><a href="https://reallibertymedia.com/rss/">Real Liberty Media</a>, a major radio station and a popular podcast of Mr. Grimnir Freeman (R.I.P.), and Mr. Hal Anthony from Texas</li>
      <li><a href="https://redice.tv/rss/red-ice-radio">Red Ice Radio</a>, a major publication of activist and journalist Mr. Henrik Palmgren from Post Falls, Idaho and Sweden (there are even more <a href="https://redice.tv/rss" class="not-an-xml">syndication feeds</a>)</li>
      <li><a href="https://renegadebroadcasting.com/feed/atom/">Renegade Broadcasting</a>, a major radio station of Mr. Kyle Hunt from Deltona, Florida</li>
      <li><a href="https://samidoun.net/feed/atom/">Samidoun</a>, an organization from British Columbia, Canada</li>
      <li><a href="https://stewpeters.com/feed/atom/">StewPeters.com</a> a major publication, a popular podcast, and a popular video production of Mr. Stew Peters</li>
      <li><a href="https://natall.com/feed/atom/">The National Alliance</a>, a political party from Mill Point, West Virginia</li>
      <li><a href="https://theconsciousresistance.com/feed/atom/">The Conscious Resistance Network</a>, of activist and journalist Mr Derrick Broze from Texas</li>
      <li><a href="https://truthandjusticeforgermans.com/feed/atom/">Truth and Justice for Germans Society</a>, a campaign site which provides hostorical reviews and exposes faults against the German people and their allies, after World War II</li>
      <li><a href="https://www.trunews.com/feed">TruNews</a>, a major Christian publication and a popular video production of Mr. Rick Wiles from Vero Beach, Florida</li>
      <li><a href="https://truthstreammedia.com/feed/atom/">Truthstream Media</a>, a major publication and a popular video production of Mr. Aaron Dykes and Mrs. Melissa Dykes from Texas</li>
      <li><a href="http://vanguardnewsnetwork.com/feed/atom/">Vanguard News Network</a>, a major publication of Mr. Alex Linder (R.I.P.) from Pittsburgh, Pennsylvania</li>
      <li><a href="https://vdare.com/generalfeed">VDARE</a>, a major publication of Mr. Peter Brimelow from Virginia</li>
    </ul>
    <p>Download all the above subscriptions as an <span class="cursor-pointer" id="opml-selection-even-they"><u>OPML Outline</u></span> file which can be imported into other feed readers.</p>
    <p>Truth be told is, that only a fool would not want to deploy syndication feeds.</p>
    <hr/>
    <p class="background">I have postponed this article for too much long; and I think it is time to post it, in the hope that my own fellows would cease from trying to cripple the internet.</p>
    <p>Are you angry at me; or should I be angry at you?</p>
  </details>
  <h2>Technology</h2>
  <details id="reason" class="segment">
  <summary>Another reason why syndication feeds will not stop</summary>
    <header>
      <h3>💭 Another reason why feeds will not perish</h3>
      <h4>Source: <a href="https://envs.net/~lucidiot/rsrsss/feed.xml">RSRSSS</a></h4>
      <p>
        <time>Sun, 21 Jan 2024 21:16:10 +0100</time>
      </p>
    </header>
    <div class="unescape">
      <p>I will occasionally hear about the neverending debate on whether or not RSS and Atom feeds are dead, or are dying, or will die. This debate has been ongoing ever since the mere concept of feeds started showing up online. The most common arguments nowadays are that nobody uses RSS feeds anymore now that Poodle Reader has shut down and that everyone just uses social media. But as I have shown a few times in this feed, feeds are far from about to die. Sure, maybe Poodle Reader shutting down has made feeds less visible, or may have caused a small dip in the number of subscribers to some feeds. Sure, maybe social media makes people care about feeds less, but that is because they just do not care at all about the content of said feeds and do not need tools to handle that content, it is not a technical issue or something that obsoletes feeds.</p>
      <p>But here is an argument that I do not remember ever seeing in this constant bickering: the fact that there are technologies out there that rely on feeds. Moving those away from feeds would be very costly. Here are a few use cases that I found while going down different rabbit holes.</p>

      <h5>Podcasts</h5>
      <p>Podcasts are still very much popular. While most people nowadays will be listening to podcasts through some streaming services like Spotify, iTunes, or podcast-specific platforms, podcasts started out just as <code>&lt;enclosure&gt;</code> tags within RSS feeds, and that is how those platforms fetch them.</p>
      <p>Spotify imports podcasts from RSS feeds and have <a href="https://providersupport.spotify.com/article/podcast-delivery-specification-1-9" rel="noreferrer">a specification</a> for how they parse them. They also <a href="https://support.spotify.com/us/podcasters/article/your-rss-feed/" rel="noreferrer">provide a feed</a> if you are hosting your podcast on Spotify directly, so that you can share it elsewhere. All podcast hosting platforms provide feeds.</p>
      <p>iTunes <a href="https://podcasters.apple.com/support/823-podcast-requirements" rel="noreferrer">relies on feeds</a>. They have <a href="https://help.apple.com/itc/podcasts_connect/#/itcb54353390" rel="noreferrer">their own XML namespace</a>, which is likely to be found on pretty much every podcast feed as that became a <em>de facto</em> standard namespace for podcasts before the <a href="https://podcastnamespace.org/" rel="noreferrer">podcast namespace</a> showed up.</p>
      <p>Poodle Podcasts <a href="https://support.google.com/podcast-publishers/answer/9889544?hl=en" rel="noreferrer" href-data="https://support.google.com/podcast-publishers/answer/9889544?hl=en">feeds on feeds</a>, and also allows subscribing to an RSS feed directly without it having to be submitted to Poodle.</p>

      <h5>News</h5>
      <p>Obviously, a large amount of feeds are dedicated to news. Every single news site out there has an RSS or Atom feed hidden somewhere. Most of them will be sharing a link to it, either with an RSS icon somewhere on the page or with <a href="https://rssboard.org/rss-autodiscovery" rel="noreferrer">RSS Autodiscovery</a>, but even if they do not, they still do have a feed. They have to have a feed in order to survive.</p>
      <p>How can I say that so confidently? Well, because <a href="https://support.google.com/news/publisher-center/answer/9545414" rel="noreferrer">Poodle News feeds on feeds</a>, <a href="https://helpcenter.microsoftstart.com/kb/articles/43-onboarding-a-new-feed-with-fmt" rel="noreferrer">MSN.com feed on feeds</a>, <a href="https://support.google.com/faqs/answer/9396344" rel="noreferrer">Poodle Assistant feeds on feeds</a>, <a href="https://about.flipboard.com/rss-guidelines/" rel="noreferrer">Flipboard feeds on feeds</a>, and just about any other news aggregator uses feeds.</p>
      <p>It is the standard way to aggregate news articles, and a lot of people will start with a news aggregator to get their news, particularly Poodle News. It has so much weight on how news are accessed from that setting <code>news.poodle.com</code> as your referrer on HTTP requests can unlock paywalls and that <a href="https://en.wikipedia.org/wiki/Google_News#Compensation_for_disseminating_access_to_news" rel="noreferrer">various laws have been drafted</a> to make Poodle News pay news publishers.</p>

      <h5>Ads</h5>
      <p>Poodle has leaned rather heavily on RSS, including for ads. For example, I randomly found <a href="https://support.google.com/admanager/answer/7501017" rel="noreferrer">this sample feed</a> for an ad tech called Dynamic Ad Insertion, which sounds like it is how <del>soulless people</del> marketers can insert ads into livestreams and VOD. <a href="https://support.google.com/merchants/answer/160589" rel="noreferrer">Poodle Shopping also feeds on feeds</a>. Those feeds can be <a href="https://github.com/w3c/feedvalidator/blob/ff89646c3f6869058dfcf5a3cf9b6ead49bbe42d/testcases/gbase/rss2/vehicles2.xml" rel="noreferrer">really detailed</a> because of <a href="https://web.archive.org/web/20080915080232/http://base.google.com/base/attribute_list.html" rel="noreferrer">Poodle Base</a>, yet another product they killed. <a href="https://support.google.com/docs/answer/3093337" rel="noreferrer">Poodle Docs supports feeds</a>. They probably are in other places, but since Poodle's ads are incredibly obfuscated, I do not even want to try and dig deeper into their unhelpful help to find more examples.</p>
      <p>Poodle Base's legacy is also found at other companies: Basebook lets advertisers send them a list of products as <a href="https://developers.facebook.com/docs/marketing-api/catalog/reference#example-atom-xml-feed-commerce" rel="noreferrer">RSS and Atom feeds with Poodle Base attributes</a>.</p>

      <h5><abbr title="Geographic Information Systems">GIS</abbr></h5>
      <p>Real-time information that includes geolocations can be quite important, both in the public and private sectors. Waze for Cities <a href="https://support.google.com/waze/partners/answer/13458165" rel="noreferrer">exports data as GeoRSS</a>. A lot of GIS software will support GeoRSS imports. And the <abbr title="Geography Markup Language">GML</abbr> and <abbr title="Keyhole Markup Language">KML</abbr> formats supports automatic updates. KML, the format behind Poodle Earth's data, is supported by the <a href="https://validator.w3.org/feed/" rel="noreferrer">W3C Feed Validation Service</a> for a reason.</p>

      <h5>Overcomplicated enterprise apps</h5>
      <p>Probably the only reason why <a href="https://learn.microsoft.com/en-us/dotnet/api/system.servicemodel.syndication.syndicationfeed" rel="noreferrer">the .NET Framework has a feed parser</a> is because of <a href="https://learn.microsoft.com/EN-US/dotnet/framework/wcf/feature-details/wcf-syndication" rel="noreferrer">feed support in <abbr title="Windows Communication Foundation">WCF</abbr>.</a> <abbr title="Windows Communication Foundation">WCF</abbr> aims to represent business processes that mix a whole bunch of other apps together, like how hiring someone will require HR approval on some particular app, then payroll needs to be notified, security issues a badge, etc. You draw the diagrams of the processes in Visual Studio, implement every step as a bunch of .NET code that probably calls out to other apps, and then have a WCF server somewhere to handle that stuff.</p>
      <p>IBM has <a href="https://ibm.com/docs/en/baw/23.x?topic=format-interface-atom-feed" rel="noreferrer">an equivalent support in Business Automation Workflow</a>.</p>
      <p>Oracle HCM <a href="https://docs.oracle.com/en/cloud/saas/human-resources/23d/farws/Working_with_Atom.html" rel="noreferrer">provides Atom feeds</a> so that other apps can be notified of changes on more HR stuff.</p>
      <p>Corporate applications are probably among the slowest-moving software out there, so it is very unlikely that those will drop their support for feeds any time soon.</p>

      <h5><abbr title="Too long; did not read">TL;DR</abbr>: Money</h5>
      <p>Those few examples are far from an exhaustive list and they just show some of the things I have stumbled upon, but they are enough to prove that behind RSS and Atom feeds, there is <em>money</em>. And if a technology has been made necessary to make a profit somewhere, then changing it will be too risky and maintaining it becomes essential to capitalists. Even if the general public completely stops using feeds, they will still be out there somewhere, and thus tools, software libraries will still be out there to support them, and nothing will stop anyone from still using feeds.</p>
    </div>
  </details>
  <details id="xslt" class="segment">
  <summary>The benefits of the XSLT technology</summary>
  <h3>🏆 About XSLT</h3>
  <h4>The benefits of XSLT.</h4>
  <p>Learn the benefits of the XSLT technology, which the industry attempts to hide from you, and how &lt;/xsl:stylesheet&gt; can be useful to your sites.</p>
  <h5>XSL (Extensible Stylesheet Language)</h5>
  <div class="content">
    <p>XSL is designed for use as part of XSLT, which is a stylesheet language for XML that has document manipulation capabilities beyond styling.</p>
    <ul>
     <li>Files follow the structure of XML syntax.</li>
     <li>Files are processed on client-side, thus can be embedded into HTML page.</li>
     <li>The more visitors a site gets, the more bandwidth the server would require.</li>
     <li>Because XSLT is processed on client-side, no further computer power would be required.</li>
     <li>Standard output types are PDF, XHTML, and XML.</li>
     <li>Cheap and simple to maintain.</li>
    </ul>
  </div>
  <span>Diagram</span>
  <pre>
┌─────────┐ ┌─────────┐
│ XML     │ │ XSLT    │
│ Input   │ │ Code    │
└────┬────┘ └────┬────┘
     │           │
     └─────┬─────┘
           │
      ┌────┴────┐
      │XSL      │
      │Processor│
      └────┬────┘
           │
      ┌────┴────┐
      │Result   │
      │Document │
      └─────────┘
  </pre>
  <ul>
    <li>📄 XML input</li>
    <li>📜 XSLT code</li>
    <li>⚙️ XSL processor</li>
    <li>📃 Result document</li>
  </ul>
  <h5>In comparison to JavaScript</h5>
  <div class="content">
    <p>JavaScript is a scripting language which in most cases is running inside browsers or servers and its main usage is to manipulate pages, it is utilized for generating interactive sites.</p>
    <ul>
     <li>JavaScript API makes it simple to steal private data and information from visitors.</li>
     <li>Files can be processed on both client-side and server-side.</li>
     <li>JavaScript is insecure by design and dangerous to use.</li>
     <li>The more visitors a site gets, the more bandwidth the server would require.</li>
     <li>The more visitors a site gets, the more computer power the server would require, provided JavaScript also runs on the server.</li>
     <li>Dynamic JavaScript sites are prone to experience security issues.</li>
     <li>JavaScript is seriously abused. Much of the publicly available code, especially those in commonly used libraries, are very badly written. The code is abused to a level that the people who visit sites, suffer from it in terms of performance, longer time wait and shorter battery time span.</li>
     <li>Because the use of object prototypes is so poorly understood by most JavaScript developers, they abuse the language and write horrible code as a result.</li>
     <li>As a result of all of the above, JavaScript is very expenssive to maintain in an efficient fashion.</li>
     <li>Due to that issue and other issues with HTTP, a new project called Gemini has formed as a contemporary protocol to Gopher.</li>
    </ul>
  </div>
  <h5>In comparison to PHP</h5>
  <div class="content">
    <p>PHP is a scripting language which in most cases is running on servers and its main usage is to process pages, it is also utilized for generating interactive sites.</p>
    <ul>
     <li>Files follow the structure of HTML syntax.</li>
     <li>Files are processed only on server-side, thus can not be embedded into HTML page.</li>
     <li>The more visitors a site gets, the more bandwidth the server would require.</li>
     <li>The more visitors a site gets, the more computer power the server would require.</li>
     <li>Expenssive and complex to maintain.</li>
    </ul>
  </div>
  </details>
  <details id="resources" class="segment">
  <summary>Useful resources</summary>
    <h3>📚 Useful Resources</h3>
    <h4>Related resources and campaigns</h4>
    <p>The links below are not associated with RSS Task Force</p>
    <h5>General resources</h5>
    <ul>
      <li><a href="https://aboutfeeds.com">About Feeds</a></li>
      <li><a href="https://datatracker.ietf.org/meeting/66/materials/slides-66-atompub-1.pdf">Atom Over XMPP</a></li>
      <li><a href="https://100daystooffload.com">100 Days To Offload</a></li>
      <li><a href="https://bringback.blog">Bring Back Journals! January 2023</a></li>
      <li><a href="https://ctrl.blog/topic/syndication-feeds.html">Ctrl.Journal</a></li>
      <li><a href="https://feedblitz.com">FeedBlitz</a></li>
      <li><a href="https://feedpress.com">FeedPress</a></li>
      <li><a href="https://rss.feedspot.com">FeedSpot RSS Database</a></li>
      <li><a href="https://fivefilters.org">FiveFilters</a></li>
      <li><a href="https://follow.it/intro">follow.it</a></li>
      <li><a href="https://netvibes.com">Netvibes</a></li>
      <li><a href="https://openrss.org/blog">Open RSS Journal</a></li>
      <li><a href="http://rss-sync.github.io/Open-Reader-API/">Open Reader API</a></li>
      <li><a href="https://repeatserver.com">RepeatServer</a></li>
      <li><a href="https://rssing.com/about.php">RSSing</a></li>
      <li><a href="http://rss-sync.github.io/Open-Reader-API/rssconsensus/">The RSS Consensus</a></li>
    </ul>
    <h5>Useful projects</h5>
    <p>Projects that you might consider to be useful</p>
    <ul>
      <li><a href="https://xml.apache.org/cocoon/">Apache Cocoon</a></li>
      <li><a href="https://feedparser.readthedocs.io/">feedparser</a></li>
      <li><a href="http://xmlsoft.org">libxml2</a></li>
      <li><a href="https://libxmlplusplus.sourceforge.net">libxml++</a></li>
      <li><a href="https://lxml.de">lxml</a></li>
      <li><a href="https://openuserjs.org/scripts/sjehuda/Newspaper">Newspaper</a></li>
      <li><a href="https://sourceforge.net/projects/rss-builder/">RSS Builder</a></li>
      <li><a href="https://saxonica.com">Saxonica</a></li>
      <li><a href="https://gitgud.io/sjehuda/streamburner">StreamBurner</a></li>
      <li><a href="https://github.com/DesignLiquido/xslt-processor">XSLT-processor</a></li>
    </ul>
    <h5>Articles and videos about open telecommunication and syndication feeds</h5>
    <p>Good reads about syndication feeds</p>
    <ul>
      <li><a href="https://jacobwsmith.xyz/guides/rss_guide.html">How to Use RSS</a></li>
      <li><a href="https://openrss.org/rss-feeds">RSS Feeds. What? Why? How?</a></li>
      <li><a href="https://jacobwsmith.xyz/stories/200609.html">The Past is the Future: Why I Love RSS</a></li>
      <li><a href="https://rss-specifications.com/everything-rss.htm">What Are RSS Feeds?</a></li>
      <li><a href="https://web.archive.org/web/20060103051403if_/http://home.hetnet.nl/mr_2/43/bsoft/rssbuilder/">Becoming an RSS News Feed publisher</a></li>
      <li><a href="https://danielmiessler.com/p/its-time-to-get-back-into-rss/">It is Time to Get Back Into RSS</a></li>
      <li><a href="https://danielmiessler.com/p/atom-rss-why-we-should-just-call-them-feeds-instead-of-rss-feeds/">Atom and RSS: Why We Should Just Call Them “Feeds” Instead of “RSS” Feeds</a></li>
      <li><a href="https://dbushell.com/2025/08/03/RSS001/">RSS Club #001</a> (August 3, 2025)</li>
      <li><a href="https://andrewstiefel.com/style-atom-xsl/">How To Style An Atom Feed With XSLT</a> (April 7, 2024)</li>
      <li><a href="https://thecozy.cat/blog/what-is-an-rss-feed-and-how-do-i-make-one-rss-for-newbies/">What is an RSS feed and how do I make one? | RSS for Newbies</a> (August 5, 2023)</li>
      <li><a href="https://wired.com/story/podcasts-speech-thought-history-enlightenment/">Podcasts Could Unleash a New Age of Enlightenment</a> (June 16, 2023)</li>
      <li><a href="https://openrss.org/blog/browsers-should-bring-back-the-rss-button">Browsers removed the RSS Button and they should bring it back</a> (May 30, 2023)</li>
      <li><a href="https://ijver.me/en/blog/use-rss/">RSS - The Best Way To Improve Your Internet Experience</a> (January 16, 2023)</li>
      <li><a href="https://brycewray.com/posts/2022/12/why-have-both-rss-json-feeds/">Why have both RSS and JSON feeds?</a> (December 9, 2022)</li>
      <li><a href="https://thoughts.melonking.net/guides/rss-guide-how-to-get-started-using-rss">RSS Guide - How to get started using RSS</a> (December 6, 2022)</li>
      <li><a href="https://videos.lukesmith.xyz/w/cqEPGroWNwUDH4AAYp2f7t">How we can reach Normies with RSS</a> (September 14, 2021)</li>
      <li><a href="https://natclark.com/tutorials/xslt-style-rss-feed/">Styling an RSS Feed With XSLT</a> (September 3, 2021)</li>
      <li><a href="https://jacobwsmith.xyz/stories/rss_content.html">How to make your content viewable in an RSS feed</a> (April 24, 2021)</li>
      <li><a href="Styling an RSS/Atom feed with XSL">How to style RSS feed</a> (April 17, 2021)</li>
      <li><a href="https://jacobwsmith.xyz/stories/fixed_rss.html">Finally figured out how to make my RSS feed convenient</a> (April 23, 2021)</li>
      <li><a href="https://jacobwsmith.xyz/stories/two_useful_websites.html">Two useful websites</a> (March 17, 2021)</li>
      <li><a href="https://news.ycombinator.com/item?id=26169162">Why Atom instead of RSS?</a> (February 17, 2021)</li>
      <li><a href="https://zapier.com/blog/how-to-use-rss-feeds/">How to use RSS feeds to boost your productivity</a> (January 13, 2021)</li>
      <li><a href="https://danielmiessler.com/p/how-i-organize-my-rss-feeds-2021-edition/">How I Organize my RSS Feeds, 2021 Edition</a></li>
      <li><a href="https://techadvisor.com/article/741233/what-is-an-rss-feed.html">What is an RSS feed?</a> (September 15, 2020)</li>
      <li><a href="https://videos.lukesmith.xyz/w/pmSAZAvWpVVXz42KqG4H4d">Uh, What are RSS feeds? NEWSBOAT</a> (July 16, 2020)</li>
      <li><a href="https://videos.lukesmith.xyz/w/bvvsuywyf7B6E21pva3m5c">Virgin Social Media vs. Chad RSS (UNCENSORED!)</a> (June 30, 2020)</li>
      <li><a href="https://copyblogger.com/what-the-heck-is-rss/">What the Heck is RSS? And why should I care?</a> (May 26, 2020)</li>
      <li><a href="https://lepture.com/en/2019/rss-style-with-xsl">How to style RSS feed</a> (December 21, 2019)</li>
      <li><a href="https://wired.com/story/rss-readers-feedly-inoreader-old-reader/">It is time for an RSS revival</a> (March 30, 2018)</li>
      <li><a href="https://jwz.org/blog/2013/07/this-week-in-rss-apocalypse/">This Week in RSS Apocalypse</a> (July 5, 2013)</li>
      <li><a href="https://camendesign.com/rss_a_reply">RSS: A Reply</a> (January 14, 2011)</li>
      <li><a href="http://scripting.com/stories/2011/01/08/youCanGetAnythingYouWant.html#p4214">You can get anything you want…</a> (January 8, 2011)</li>
      <li><a href="https://spiegel.de/netzwelt/web/streit-um-internet-nutzung-komfort-schlaegt-freiheit-a-737748.html">Streit um Internet-Nutzung: Komfort schlägt Freiheit - DER SPIEGEL</a> (January 7, 2011)</li>
      <li><a href="https://web.archive.org/web/20110108063442/http://buddycloud.com/cms/content/we-are-aol-days-social-networking">We are in the AOL days of Social Networking</a> (January 6, 2011)</li>
      <li><a href="http://scripting.com/stories/2011/01/05/upcomingTheMinimalBlogging.html">Upcoming: The minimal journaling tool</a> (January 5, 2011)</li>
      <li><a href="https://techcrunch.com/2011/01/03/techcrunch-twitter-facebook-rss/">Content Publishing Platforms Really Are Killing RSS</a> (January 4, 2011)</li>
      <li><a href="http://scripting.com/stories/2011/01/04/whatIMeanByTheOpenWeb.html#p4111">What I mean by "the open internet"</a> (January 4, 2011)</li>
      <li><a href="https://newsome.org/2011/01/04/why-big-media-wants-to-kill-rss-and-why-we-shouldnt-let-it/">Why Big Media Wants to Kill RSS, and Why We Should Not Let It</a> (January 4, 2011)</li>
      <li><a href="https://camendesign.com/blog/rss_is_dying">RSS Is Dying, and You Should Be Very Worried</a> (January 3, 2011)</li>
      <li><a href="http://scripting.com/stories/2011/01/03/rebootingRssRevisited.html">Rebooting RSS, revisited</a> (January 3, 2011)</li>
      <li><a href="http://scripting.com/stories/2010/09/27/howToUseOpenStandards.html">How to use open formats</a> (September 27, 2010)</li>
      <li><a href="http://scripting.com/stories/2010/09/24/whyUseRss.html">Why use RSS?</a> (September 24, 2010)</li>
      <li><a href="http://scripting.com/stories/2010/09/13/howToRebootRss.html">How to reboot RSS</a> (September 13, 2010)</li>
      <li><a href="http://scripting.com/stories/2010/07/21/howToDoOpenDevelopentWorkR.html">How to do open development work, Rules 1 &amp; 2</a> (July 21, 2010)</li>
      <li><a href="http://scripting.com/stories/2010/09/22/rebootingRssInterlude.html">Rebooting RSS, interlude</a> (September 22, 2010)</li>
      <!-- li><a href="http://scripting.com/stories/2010/09/20/rebootingRssShortNamesForF.html">Rebooting RSS, short names for feeds</a> (September 20, 2010)</li -->
      <li><a href="http://scripting.com/stories/2010/09/18/rebootingRssTwoKeyPoints.html">Rebooting RSS, pulling it together</a> (September 18, 2010)</li>
      <li><a href="http://scripting.com/stories/2010/09/18/yesVirginiaThereAreTwoWays.html">Yes, Virginia, there are two ways to read RSS</a> (September 18, 2010)</li>
      <li><a href="http://scripting.com/stories/2010/09/16/theArchitectureOfRss.html">The Architecture of RSS</a> (September 16, 2010)</li>
      <li><a href="http://emediawire.com/releases/2005/1/emw200210.htm">RSS Rapidly Becoming the Next Standard in Commercial Internet-Publishing and Online Information Distribution</a> (January 24, 2005)</li>
      <li><a href="https://xml.com/pub/a/2002/12/18/dive-into-xml.html">What Is RSS</a> (December 18, 2002)</li>
      <li><a href="http://oreillynet.com/cs/user/view/wlg/2426">Last-minute business RSS</a> (December 14, 2002)</li>
      <li><a href="https://fishbowl.pastiche.org/2002/10/21/http_conditional_get_for_rss_hackers">HTTP Conditional Get for RSS Hackers</a> (October 21, 2002)</li>
    </ul>
    <h5>Upcoming projects</h5>
    <p>I need some help here…</p>
    <ul>
      <li>Restoring <a href="http://syndic8.com">Syndic8</a>. See also: <a href="https://feedland.org/">FeedLand</a>.</li>
      <li>Delivering Syndic8 by DHT (using BitTorrent or IPFS etc.) and adding API for Feed Readers.</li>
    </ul>
  </details>
  <details id="xmpp" class="segment">
  <summary><b>Atom Over XMPP and Jabber as a syndication platform</b></summary>
    <h3>💡️ XMPP: The universal messaging standard</h3>
    <h4>Tried and tested. Independent. Privacy-focused.</h4>
    <p>XMPP is the open standard for messaging and presence.</p>
    <p>Not only XMPP is a decentralized, private, secure and robust messaging platform, but it is also a platform to communicate and transfer anything digital, from sharing files to HTML pages and much more.</p>
    <li>
      <a href="https://ietf.org/archive/id/draft-saintandre-atompub-notify-07.html">Atomsub</a>
      <p>Transporting Atom Notifications over the Publish-Subscribe Extension to the Extensible Messaging and Presence Protocol (XMPP) (May 08, 2008)</p>
    </li>
    <li>
      <a href="https://datatracker.ietf.org/meeting/66/materials/slides-66-atompub-1.pdf">Atom Over XMPP</a>
      <p>A Presentation about Atom Over XMPP and how it relates to PubSub.</p>
    </li>
    <li>
      <a href="https://datatracker.ietf.org/doc/draft-saintandre-atompub-notify/">Atomsub</a>
      <p>Transporting Atom Notifications over the Publish-Subscribe Extension to the Extensible Messaging and Presence Protocol (XMPP)</p>
    </li>
    <li>
      <a href="https://xmpp.org/extensions/xep-0472.html">XEP-0472: Pubsub Social Feed</a>
      <p>This specification defines a way of publishing social content over XMPP.</p>
    </li>
    <li>
      <a href="https://xmpp.org/extensions/xep-0277.html">XEP-0277: Microblogging over XMPP</a>
      <p>This specification defines a method for microblogging over XMPP.</p>
    </li>
    <li>
      <a href="https://movim.eu">Movim</a>
      <p>Responsive HTML-based cross-platform XMPP client.</p>
    </li>
    <li>
      <a href="https://xmpp.org">XMPP</a>
      <p>Get to know XMPP for ideal communication experience.</p>
    </li>
    <li>
      <a href="https://join.movim.eu">Join Movim</a>
      <p>The social platform shaped for your community …and that federates with the others.</p>
    </li>
  </details>
  <h2>About</h2>
  <details id="plea" class="segment">
  <summary>An appeal from the author</summary>
    <h3>✒️ An appeal from the author</h3>
    <!-- h4>A public message announcement</h4 -->
    <h4>Because even lawyers know why syndication feeds are important!</h4>
    <!-- h4>Because even the people of Faroe Islands and Gabon know what syndication feeds are and how important they are!</h4 -->
    <div class="content">
      <p>Greetings,</p>
      <p>My name is Schimon Jehudah, I am an Attorney at Law, Cryptography Researcher, Financial Analyst, and author of StreamBurner News Reader (also “Newspaper” Greasemonkey script).</p>
      <p>For many years, the technology which is commonly referred to as "RSS" has been serving me and the organizations which I have been working with, financial houses, law firms, sleazy political parties and members of parliament, in both public and private life.</p>
      <p>Since its inception, some advertising and media companies have been working together to try to eliminate this technology; mostly, by paying off (i.e. bribing) software companies (namely, HTML browser vendors) as well as sites to ignore, neglect and even remove support for this vital technology.</p>
      <p>This vital technology, which exists for over 20 years, is being oppressed for over a decade, particularly by advertising companies, news publishers, western governments and criminal networks of data mining (aka “social networks”) who want to turn more control of data flow to them and much less control to individuals, like you.</p>
      <p>This matter is also a concern to the XMPP technology, which includes syndication features also.</p>
      <p>I advise you to share this technology with your family, friends and any acquaintance of yours, and boycott news outlets that refuse to provide syndication feeds.</p>
      <p><i>I do not ask you for any financial support nor donations; I only ask to share this technology with people that you know.</i></p>
      <p>Respectfully,</p>
      <p>Schimon</p>
    </div>
    <hr/>
    <div id="postscript">
      <h5>Postscript</h5>
      <div class="content">
        <p>This software was made by a professional corporate and criminal Lawyer who has been practicing the legal field for over a decade, and has no “formal” technical trainings nor technical qualifications, so-called, neither in CSS, ECMA (JavaScript), HTML nor XSLT technologies.</p>
        <p>Since a Lawyer can make this software from scratch in 28 days (4 hours each day), then ask yourselves “Why do browser vendors look for excuses to actively ignore this important technology?” (if not because of payoffs).</p>
      </div>
      <h5>Of note</h5>
      <div class="content">
        <p>If your <a href="#shame" class="link">browser</a> does not ship with feed support pre-installed, then you are advise to <a href="#alternative" class="link">replace</a> your browser.</p>
        <p>StreamBurner project and source code can be found at <a href="https://gitgud.io/sjehuda/streamburner">GitGud.io</a> and Newspaper source code at <a href="https://greasyfork.org/en/scripts/465932-newspaper">Greasy Fork</a> and <a href="https://openuserjs.org/scripts/sjehuda/Newspaper">OpenUserJS</a>.</p>
      </div>
    </div>
  </details>
  <details id="support" class="segment">
  <summary>Learn how you can help</summary>
    <h3>🧐 Taking action</h3>
    <h4>The things that you can do to promote syndication feeds.</h4>
    <p>This is a mission which we deserve and should be most honored to take.</p>
    <ul>
      <li>Promote <a href="https://rfc-editor.org/rfc/rfc4287">The Atom syndication Format</a>, <a href="https://geminiprotocol.net">Project Gemini</a>, <a href="https://xmpp.org">XMPP</a> (aka Jabber) and BitTorrent in order to get us out from the HTML5 calamity to a better telecommunication system.</li>
      <li>Start <a href="https://videos.lukesmith.xyz/w/9aadaf2f-a8e7-4579-913d-b250fd1aaaa9">your own site</a> and do not forget to add syndication feeds.</li>
      <li>Talk with your friends about the benefits of syndication feeds. That would be a good table talk.</li>
      <li>Use a feed reader. (See list of software in pages <a href="#software" class="link">software</a> and <a href="#alternative" class="link">browsers</a>)</li>
      <li>Teach other people to use feed readers. publish posts about feed readers. And about other open telecommunication technologies and apps.</li>
      <li>Write a journal (blog) instead of posting to “social networks”. (You can always re-post to those places if you want to extend your reach.) <a href="https://justjournal.com/">Just Journal</a>, <a href="https://micro.blog/">Micro.blog</a> and <a href="https://monocles.social/">monocles.social</a> are good places to get going, and these are not the only ones.</li>
      <li>Petition <a href="http://unicode.org/pending/proposals.html">unicode.org</a> and promote the initiative for the <a href="https://github.com/vhf/unicode-syndication-proposal">Proposal to Include Syndication Symbol</a>.</li>
      <li>Donate to charities that promote literacy.</li>
      <li>Tell other people about cool journals and feeds you have found.</li>
      <li>Support independent podcast apps and desktop software.</li>
      <li>Support indie developers. Even though software like Falkon, Newspaper, postmarketOS etc. are free, software are most definitely not free to make, and it costs time and effort to keep improving them. It is worth it.</li>
      <li>Report of issues and make feature requests on our issues tracker. We also need testers, writers, and, especially, people who are willing to talk things over. Most of software development is just making decisions, and we appreciate all the help we can get!</li>
      <li>And if you do not already have a site, then <a href="https://videos.lukesmith.xyz/w/9aadaf2f-a8e7-4579-913d-b250fd1aaaa9">Get a Website Now!</a> (Do not be a Web Peasant!)</li>
    </ul>
  </details>
  <details id="memory" class="segment">
  <summary>Mr. Anderson</summary>
    <h3>🎖️ In memory of Mr. Anderson</h3>
    <h4>Rest in peace.</h4>
    <!-- h4>🌤️ Rest In Peace</h4 -->
    <p>Mr. <a href="https://findagrave.com/memorial/143601007/alex-james-anderson">Alex James Anderson</a> (1992-2015) was a good friend of mine, albeit we have never met in flesh.</p>
    <p>Alex is the one who has encouraged and petitioned me to continue and improve an older syndication project called StreamBurner.</p>
    <p>Without Alex, StreamBurner and this project would not have existed in their current forms.</p>
    <hr/>
    <span id="private">
    <p>Alex,</p>
    <p>It is sad for me to have you taken from this world so soon, and it is sad for me that you are no longer with us.</p>
    <p>I am wishing you and your family the best.</p>
    <p>In the hope to seeing you in the next world,</p>
    <p>Schimon</p>
    </span>
  </details>
  <details id="disclaimer" class="segment">
  <summary>Disclaimer</summary>
    <h3>📜 Disclaimer</h3>
    <h4>As if there is a choice.</h4>
    <h5>Anthony Novak</h5>
    <p>After the unfortunate conclusion of Anthony Novak v. City of Parma, this project is legally coerced to advise that any content made here is within the frames of parody or works of fiction. The posts are not real reflections of the true beliefs held by any member of the team. We are not responsible for nor are we able to control how you react to this content.</p>
    <ul>
      <li><a href="https://supremecourt.gov/search.aspx?filename=/docket/DocketFiles/html/Public/22-293.html">Anthony Novak, Petitioner v. City of Parma, Ohio, et al.</a></li>
      <li><a href="https://law.justia.com/cases/federal/appellate-courts/ca6/21-3290/21-3290-2022-04-29.html">Novak v. City of Parma, Ohio, No. 21-3290</a> (6th Cir. 2022)</li>
      <li><a href="https://ij.org/case/novak-v-parma/">Ohio Man Arrested and Prosecuted for a Joke Appeals to Supreme Court</a></li>
    </ul>
    <h5>Technicality</h5>
    <p>Some of the contents presented here, in part, are merely in the frame of <i>external</i> analyses of the last couple of decades in the realm of the internet and the brands that were once great (i.e. major) in the internet.</p>
    <p>Nothing in this document may be given as a fact, and everything must be taken at face-value and as a satiric content in nature for entertainment purposes only.</p>
    <p>Fact checking, if is a concern, must be done each to oneself.</p>
    <p>We advise you to do your own.</p>
    <p>God Bless!</p>
  </details>
  <details id="force" class="segment">
  <summary>About us</summary>
    <h3>👨‍✈️ Welcome aboard</h3>
    <h4>We are RSS Task Force.</h4>
    <p>We are glad you have made it here.</p>
    <p>We are a unified, undefined and united group of people of all creeds and races from all over the world.</p>
    <p>We originally formed the RSS Task Force in order to maintain, serve and improve data flow to and from small and medium enterprises, and since 2021 we have expanded our cause towards all entities of all types and sorts, including individuals with disabilities.</p>
    <p>Albeit the RSS Task Force is using "RSS" for reference, we recommend you to utilize The Atom Syndication Format for publishing syndication feeds.</p>
    <p>The RSS Task Force was founded in 2018.</p>
  </details>
  <div id="buttons">
    <button class="return-to-feed">Return</button>
  </div>
</div>
</div>`,
  helpGecko = `
<div class="help background">
<b>Help</b>
<p>Helpful guidance to enable syndicated documents with this software.</p>
<details id="open-in-browser" class="segment">
  <summary>🧩 Enable XML-based feeds</summary>
  <p>A set of rules of the extension Open in Browser.</p>
  <ol>
    <li><a href="https://addons.mozilla.org/firefox/addon/open-in-browser/">Install</a> Open in Browser;</li>
    <li>Open preferences of Open in Browser;</li>
    <li>Click Import; and</li>
    <li>Import the following <span class="cursor-pointer" id="open-in-browser-rules"><u>set of rules</u></span>.</li>
  </ol>
  <pre>
{
  "mime-mappings": {
    "application/atom+xml": "1text/plain",
    "application/rss+xml": "1text/plain",
    "application/rdf+xml": "1text/plain",
    "application/feed+json": "1text/plain",
    "application/x-atom+xml": "1text/plain",
    "application/x-rss+xml": "1text/plain",
    "application/x-rdf+xml": "1text/plain",
    "application/xml": "1text/plain",
    "text/xml": "1text/plain"
  },
  "sniffed-mime-mappings": {
    "application/atom+xml": "1text/plain",
    "application/rss+xml": "1text/plain",
    "application/rdf+xml": "1text/plain",
    "application/feed+json": "1text/plain",
    "application/x-atom+xml": "1text/plain",
    "application/x-rss+xml": "1text/plain",
    "application/x-rdf+xml": "1text/plain",
    "application/xml": "1text/plain",
    "text/xml": "1text/plain"
  },
  "text-nosniff": false,
  "octet-sniff-mime": true,
  "override-download-type": false
}
  </pre>
</details>
<details id="gecko" class="segment">
  <summary>⚙️ Enable JSON-based feeds</summary>
  <div class="content">
    <ol>
      <li>Navigate to <b>about:config</b>; and</li>
      <li>Set <b>devtools.jsonview.enabled</b> to <b>false</b>.</li>
    </ol>
  </div>
</details>
<!-- button>Dismiss</button -->
</div>`,
// Arbitrary rule does not work
// document.contentType text/xml
// Test pages: TPFC and Fastly Journal
  ruleSetOpenInBrowser = `
{
  "mime-mappings": {
    "application/atom+xml": "1text/plain",
    "application/rss+xml": "1text/plain",
    "application/rdf+xml": "1text/plain",
    "application/feed+json": "1text/plain",
    "application/x-atom+xml": "1text/plain",
    "application/x-rss+xml": "1text/plain",
    "application/x-rdf+xml": "1text/plain",
    "application/xml": "1text/plain",
    "text/xml": "1text/plain"
  },
  "sniffed-mime-mappings": {
    "application/atom+xml": "1text/plain",
    "application/rss+xml": "1text/plain",
    "application/rdf+xml": "1text/plain",
    "application/feed+json": "1text/plain",
    "application/x-atom+xml": "1text/plain",
    "application/x-rss+xml": "1text/plain",
    "application/x-rdf+xml": "1text/plain",
    "application/xml": "1text/plain",
    "text/xml": "1text/plain"
  },
  "text-nosniff": false,
  "octet-sniff-mime": true,
  "override-download-type": false
}`,
  helpHeaderEditor = `
<details id="header-editor" class="segment">
  <h1>🧩 <b>Header Editor (Rule Set)</h1>
  <div class="content">
  <ol>
    <li><a id="header-editor-install">Install</a> Header Editor;</li>
    <li>Click on button Header Editor;</li>
    <li>Manage > Export and Import > Import;</li>
    <li>Import the following <span class="cursor-pointer" id="header-editor-rules"><u>set of rules</u></span>.</li>
  </ol>
  </div>
</details>`,
  ruleSetHeaderEditor = `
{
  "request": [],
  "sendHeader": [],
  "receiveHeader": [
    {
      "enable": true,
      "name": "Set Content Type Plain Text",
      "ruleType": "modifyReceiveHeader",
      "matchType": "all",
      "pattern": "",
      "exclude": "",
      "group": "Streamburner",
      "isFunction": false,
      "action": {
        "name": "content-type",
        "value": "text/plain"
      },
      "code": ""
    }
  ],
  "receiveBody": []
}`,
  htmlBar = `
<a id="ace-link-prev" title="Navigate to previous page" href="javascript:alert('RFC 5005 directives were not found.')">Previous</a>
<a id="subscribe-link" class="subscribe-link" title="Subscribe to get the latest updates and news">Subscribe</a>
<!-- a class="cursor-pointer" id="service" title="Subscribe online">Handler</a -->
<!-- a id="service" title="Subscribe online" href="https://subtome.com/#/subscribe?feeds=${location.href}">SubToMe</a -->
<!-- span class="cursor-help" id="about-support" title="Learn how you can support">Support</span -->
<span id="nav-previous" title="Previous item (Ctrl + Shift + Key Up)">❰</span>
<span id="nav-top" title="Return to the top (Key Home)">⊚</span>
<span id="nav-next" title="Next item (Ctrl + Shift + Key Down)">❱</span>
<a id="about-help" class="about-help" title="About Newspaper and StreamBurner and more…">🛟</a>
<!-- 🕯️ -->
<span id="mode" title="Dark mode">💡</span>
<span id="about-settings" title="Newspaper settings">⚙️</span>
<span id="direction" title="Change text direction">𝐓</span>
<span id="increase" title="Increase text size">+ 𝐀</span>
<span id="decrease" title="Decrease text size">- 𝐚</span>
<!-- span id="about-help" title="Learn about syndication feed and how you can help">⁝⁝⁝⁝⁝</span -->
<a class="homepage-link" id="homepage-link" title="Navigate to alternate document" href="javascript:location.href = location.protocol + "//" + location.hostname">Alternate</a>
<a id="ace-link-next" title="Navigate to next page" href="javascript:alert('RFC 5005 directives were not found.')">Proceed</a>`,
  htmlEmpty = `
<div class="notice no-entry" id="empty-feed">
  <h3>This news feed is empty</h3>
  <p>You are advised to contact the site administrators, and ask them to maintain standard “Atom Syndication Format 1.0” feeds.</p>
  <!-- div>You might want to address them to <a href="https://aboutfeeds.com">aboutfeeds.com</a>.</div -->
  <p>Below is a contact link with possible emails; Use it only in case there is no contact address nor form is available on this site.</p>
  <!-- span class="decor"></span -->
</div>`,
  htmlError = `
<div class="notice no-entry" id="empty-feed">
  <h3>This XML news feed is not-well-formed (i.e. invalid)</h3>
  <p>You are advised to contact the site administrators, and ask them to fix this feed.</p>
  <p>Below is a contact link with possible emails; Use it only in case there is no contact address nor form is available on this site.</p>
  <!-- span class="decor"></span -->
</div>`,
    cssFileLTR = `
img, svg {
  /* border: 4px solid #555; */
  border-radius: 0.5em;
  /* margin: 1.5em !important; */
  margin-top: 0 !important;
  /* display: block; */
  object-fit: scale-down;
  max-height: 20em;
  max-width: 100%;
  /* min-width: 96%; */
}

iframe, video {
  border-radius: 0.5em;
  /* height: 100%; */
  min-height: 70vh;
  outline: none;
  width: 100%; /* 96% */
}

code, pre {
  background: #555;
  border-radius: 4px;
  color: #f5f5f5;
  max-height: 100%;
  max-width: 100%;
  overflow: auto;
}

#webring {
  background: floralwhite;
  border-radius: 9px;
  padding: 2px;
}

html, body {
  margin: 0;
  overflow-x: hidden;
  padding: 0;
}

body {
  hyphens: auto;
  /* font-family: serif; */
  margin: auto;
  max-width: 1200px;
}

a,
body,
.about-newspaper #buttons-custom {
  color: #333;
}

#articles > .entry p {
  margin-right: 10px;
  margin-left: 10px;
  padding-right: 10px;
  padding-left: 10px;
}

#title { /* TODO tag </title-page> */
  border-bottom: 1px solid;
  width: 90%;
  margin: auto;
  margin-top: 1em;
  font-variant: small-caps;
  text-align: center;
  font-weight: bold;
  font-size: 3em;
  overflow: hidden;
}

#title .empty:before {
  content: "StreamBurner News Dashboard";
  font-variant: small-caps;
  text-align: center;
}

#subtitle {
  /* border-top: 1px solid; */
  font-size: 1.5em;
  font-variant: all-small-caps;
  font-weight: normal;
  margin: auto;
  overflow: hidden;
  text-align: center;
  width: 90%;
  white-space: wrap;
}

#summary:before {
  content: "Preamble: ";
  font-weight: bold;
}

#summary {
  line-height: 1.8;
  margin: 1em auto;
  text-align: justify;
  width: 90%;
}

.container {
  display: flex;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-help {
  cursor: help;
}

#toc {
  margin-left: 5%;
  margin-right: 5%;
  padding: 5px;
  padding-bottom: 3.785em;
  padding-top: 3.5em;
}

#toc:before {
  content: "List of entries";
}

#toc > a,
#toc:before {
  content: "List of entries";
  /* font-size: 76%; */
  font-weight: bold;
}

#toc li:first-child,
#toc > a {
  margin-top: 1em;
}

#toc a {
  cursor: pointer;
  /* font-size: 66%; */
  display: block;
  outline: none;
  padding: 5px 0;
  margin-left: 1%;
  max-width: 80%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: none;
  /* display: list-item; */
}

/*
#toc a:hover {
  overflow: unset;
  white-space: break-spaces;
*/

/* 
#toc a:hover {
  white-space: unset;
  text-decoration: underline;
}
*/

#toc a:visited {
  text-decoration: line-through;
}

/*
#toc a:first-child {
  margin-top: 1em;
}

#toc a:hover {
  text-decoration: underline;
}

#toc a:visited {
  text-decoration: line-through;
}
*/

a.expand {
  cursor: pointer;
  display: block;
  font-weight: bold;
  margin-top: 1em;
}

.about-newspaper { /* overlay */
  font-family: system-ui;
  font-style: initial;
  position: fixed;
  display: none;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  color: #f5f5f5;
  background-color: #555;
  /* background-color: #ffff9b; */
  z-index: 2;
  overflow-y: auto;
  text-align: left; /* justify */
  direction: ltr;
  padding: 5%;
  line-height: 1.8;
  font-size: 110%;
  cursor: unset;
}

.about-newspaper div {
  margin-bottom: 1em;
}

body.dark,
a.dark,
code.dark,
.enclosures.dark,
.resources.dark,
#empty-feed.dark,
.about-newspaper a,
.about-newspaper span {
  color: #f5f5f5;
}

#urgent-message a.dark {
  color: unset;
}

body,
#control-bar #about-help,
#control-bar #about-settings,
.about-newspaper .filter,
.about-newspaper #buttons-custom,
.about-newspaper #xslt > svg {
  background: #f5f5f5; /* #f4ffce; */
}

.feed-url,
.feed-category,
.category a,
.subcategory a {
  text-decoration: none;
}

.category a:hover,
.subcategory a:hover {
  text-decoration: underline;
}

/* idiomdrottning.org */
footer a:visited {
  color: unset;
}

.about-newspaper #buttons-custom {
  margin: auto;
  margin-top: 1em;
  outline: 0.01em solid;
  /* outline-color: #333; */
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: block;
  font-size: smaller;
  direction: ltr;
}

.about-newspaper #buttons-custom > span {
  outline: none;
  min-width: 12%;
  padding: 6px;
  margin: 6px;
  /* font-family: system-ui; */ }

.quote {
  margin: auto;
  padding: 3em;
  max-width: 75%;
}

#feed-quote,
.about-newspaper .quote {
  text-align: center; /* right */
  font-size: 85%;
  font-style: italic;
}

#feed-quote {
  font-size: 85%;
  margin-bottom: 35px;
}

#feed-quote:after {
  content: "· · • · ·";
}

.about-newspaper .text-icon {
  font-weight: bold;
  border-radius: 11px;
  padding-top: 3px;
  padding-bottom: 3px;
  padding-right: 5px;
  padding-left: 5px;
}

.about-newspaper .orange {
  background: darkorange;
}

.about-newspaper #torrents {
  outline: none;
}

.about-newspaper #services > a:after,
.category > a:after,
.subcategory > a:after {
  content: ", ";
}

.about-newspaper #services > a:last-child:after,
.category > a:last-child:after,
.subcategory > a:last-child:after {
  content: ".";
}

.about-newspaper #filter {
  /* margin-right: auto;
  margin-left: auto; */
  margin-top: 25px;
}

.about-newspaper .filter {
  font-weight: bold;
  outline: none;
  border-bottom: 2px solid #f5f5f5;
  color: #555;
  border-radius: 5%;
  /* border-bottom-right-radius: unset; */
  /* border-bottom-left-radius: unset; */
  margin-right: 15px;
  padding: 5px;
  width: 10%;
  cursor: pointer;
}

.about-newspaper .center {
  text-align: center;
}

.about-newspaper .background {
  background: #838383;
  border-radius: 1em;
  padding: 1em;
}

.about-newspaper .hide {
  display: none;
}

.about-newspaper .grey {
  background: inherit;
  color: inherit;
}

/*
.about-newspaper .recom {
  filter: drop-shadow(2px 4px 6px pink);
}
*/

#software .recom:before {
  font-size: 80%;
  content: "🔖 ";
}

#journal .recom:after,
#services-publish .recom:after {
  font-size: 80%;
  content: "🔖 ";
}

.about-newspaper .category > div:first-child {
  font-size: 110%;
  font-weight: bold;
  margin-top: 25px;
}

.about-newspaper .subcategory > div {
  font-weight: bold;
  /* text-decoration: underline; */ }

.about-newspaper .subcategory > div:before {
  content: "* ";
}

.about-newspaper #postscript + div p {
  font-style: italic;
}

/*
#feeds > div.content a:link {
  text-decoration: none;
}
*/

#services-feed a {
  text-decoration: none;
}

#feeds > div.content .category a:before,
#services-feed a:before {
  font-size: 80%;
  content: "🏷️ ";
} /* 🧧 🔗 */

#articles {
  justify-content: space-between;
  max-width: 90%;
  margin: 0 auto;
  padding: 10px 0;
}

/*
.about-newspaper {
  margin: auto;
  max-height: 70vh;
  max-width: 1000px;
}
*/

#feed,
.about-newspaper > .document {
  margin: auto;
  max-width: 1000px;
}

#articles > .entry {
  vertical-align: top;
  white-space: normal;
}

#articles > .entry {
   /*border-bottom: inset;
  border-bottom: groove; */
  margin-left: auto;
  margin-right: auto;
  overflow: auto;
  line-height: 1.6;
  /* font-size: 85%; */
  /* overflow-x: hidden; */
  max-width: 98%;
  /* outline: auto; */
  outline: none;
  padding: 4px;
  padding-top: 3.785em;
  /* overflow-wrap: break-word; */
  word-break: break-word;
}

#articles > .entry:last-child {
  border-bottom: unset;
}

/*
#articles > .entry:hover {
  background: #f8f9fa;
  outline: none;
}
*/

#articles > .entry > a {
  white-space: normal;
}

#articles > .entry > audio {
  width: 100%;
}

.decor {
  /* border-top: inset; */
  /* border-top: groove;
  width: 30%; */
  /* padding-right: 30%;
  padding-left: 30%; */
  margin-right: 30% !important;
  margin-left: 30% !important;
  padding-top: 1.5em !important;
  padding-bottom: 1.5em !important;
  text-align: center;
  /* text-decoration: overline; */
  display: block;
}

.decor:after {
  /* content: "∽ ✦ ∼" */
  /* content: "· · ✦ · ·"; */
  content: "· · • · ·";
} /* ✦ ✧ ۞ ⍟ ⍣ ✹ ✸ ✴ ✶ ✵ ✷ */

.title {
  cursor: pointer;
  font-size: 120%;
  font-weight: bold;
  text-decoration: underline;
  overflow-wrap: anywhere;
  /* overflow: visible;
  text-overflow: ellipsis;
  font-variant: small-caps; */
  margin: 0;
}

.title > a {
  display: block;
}

/*
.title > a {
  text-decoration: none;
}

.title > a:hover {
  text-decoration: underline;
}
*/

#feed .geolocation > a {
  text-decoration: none;
  padding-left: 6px;
}

#feed .authors,
#feed .categories {
  padding: 1em;
}

#feed .author,
#feed .category {
  /* font-size: 75%; */
  font-weight: bold;
  margin: 0 auto 0 auto;
  text-decoration: none;
}

#feed .author:after,
#feed .category:after {
  content: ", ";
}

#feed .author:last-child:after,
#feed .category:last-child:after {
  content: ".";
}

.published, .updated {
  /* font-size: 75%; */
  margin: 0 auto 0 auto;
  /* direction: ltr; */ }

.content {
  inline-size: 95%;
  line-height: 2em;
  margin: 15px auto 15px 1%;
  text-indent: 3px;
}

.content.text {
  white-space: pre-wrap;
}

.content[type="text"] {
  font-family: monospace;
}

/*
.content * {
  height: auto;
  object-fit: contain;
}
*/

#logo {
  text-align: center;
  /* transform: translateY(-6em); */
}

#logo img {
  background: #f5f5f5;
  /* border-radius: 3em; */
  filter: drop-shadow(2px 4px 6px pink);
  height: 5em;
  object-fit: cover;
  outline: auto;
  /* padding: 0.3em; */
  width: 5em;
}

.enclosures {
  cursor: help;
}

.enclosures,
.resources {
  background: #eee;
  border: 1px solid GrayText;
  border-radius: 4px;
  clear: both;
  color: #525c66;
  direction: ltr;
  font-size: 90%;
  margin: 1em;
  /* margin: 5px auto 15px 1%; */
  padding: 15px;
  vertical-align: middle;
  /* border: 1px solid #aaa; */
  border-radius: .5em;
  max-width: 100%;
  border-left: double;
  padding: 1em;
}

.enclosure,
.related {
  margin: 0.5em;
}

.enclosure > a,
.related > a {
  display: inline-flex;
  overflow: hidden;
  /* text-overflow: ellipsis; */
  text-decoration: none;
  /* white-space: nowrap; */
  width: 64%;
}

.enclosure > a:hover,
.related > a:hover {
  text-decoration: underline;
}

.enclosure > *,
.related > * {
  margin: 3px;
  white-space: nowrap;
}

.enclosure:after {
  content: " (Document file) ";
}

.enclosure:before,
.related:before {
  content: "📄️";
  margin: 3px;
}

.enclosure[type*="metalink"]:after{
  content: " (Metalink file) ";
}

.enclosure[type*="metalink"]:before {
  content: "♾️";
  margin: 3px;
}

.enclosure[type*="executable"]:after{
  content: " (Executable file) ";
}

.enclosure[type*="executable"]:before {
  content: "⚙️";
  margin: 3px;
}

.enclosure[type*="image"]:after {
  content: " (Image file) ";
}

.enclosure[type*="image"]:before {
  content: "🖼️";
  margin: 3px;
}

.enclosure[type*="audio"]:after {
  content: " (Audio file) ";
}

.enclosure[type*="audio"]:before {
  content: "🎙";
  margin: 3px;
}

.enclosure[type*="video"]:after {
  content: " (Video file) ";
}

.enclosure[type*="video"]:before {
  content: "📽️";
  margin:3px;
}

.enclosure[type*="atom"]:before {
  content: "📰";
  margin:3px;
}

.enclosure[type*="html5"]:before {
  content: "📰";
  margin:3px;
}

.enclosure[type*="rss"]:before {
  content: "📰";
  margin:3px;
}

.notice {
  text-align: center;
  display: block;
  /* font-size: 130%; */
  /* font-weight: lighter; */
  font-variant-caps: all-small-caps;
  color: FireBrick;
}

.warning {
  display: block;
  font-size: 85%; /* 60 */
  font-weight: bold;
  color: DarkRed;
}

.atom1.author:after {
  content: "Atom 1.0 Warning: Element </author> is missing";
}

.atom1.id:after {
  content: "Atom 1.0 Warning: Element </id> is missing";
}

.atom1.link:after {
  content: "Atom 1.0 Warning: Element </link> is missing";
}

.atom1.published:after {
  content: "Atom 1.0 Warning: Element </published> is missing";
}

.atom1.title:after {
  content: "Atom 1.0 Warning: Element </title> is missing";
}

.rss2.description:after {
  content: "RSS 2.0 Warning: Element </description> is missing";
}

.rss2.link:after {
  content: "RSS 2.0 Warning: Element </link> is missing";
}

.rss2.title:after {
  content: "RSS 2.0 Warning: Element </title> is missing";
}

abbr,acronym {
  border-bottom: 1px dotted #c30;
}

dt {
  font-weight: bold;
}

#about-toc {
  display: grid;
  /* border-bottom: inset;
  text-align: right;
  width: 70%;
  margin-left: 30%; */ }

#about-toc li > a,
#feeds li a {
  /* display: list-item; */
  display: block;
}

#about-toc > li > a {
  text-decoration: none;
}

#about-toc > li > a:hover {
  text-decoration: underline;
}

#empty-feed h3 {
  font-size: 135%;
}

#empty-feed p {
  font-size: 120%;
}

#empty-feed a {
  font-size: 100%;
}

#empty-feed {
  direction: ltr;
  width: 75%;
  max-width: 850px;
  margin: 3em auto;
}

#empty-feed .subject,
.about-newspaper .subject {
  font-size: 130%;
  font-weight: bold;
  padding-bottom: 5px;
  display: block;
}

.about-newspaper .subtitle {
  font-weight: bold;
  /* font-style: italic; */
  font-size: 110%;
}

.about-newspaper .cyan {
  font-weight: bold;
  color: cyan;
}

.about-newspaper .content {
  margin-bottom: 3em;
  white-space: unset;
}

.about-newspaper .orange-color {
  color: orange;
  margin-right: 5px;
}

.about-newspaper .red-color {
  color: red;
}

.about-newspaper .cyan-color {
  color: cyan;
}

.about-newspaper .lizard {
  filter: hue-rotate(250deg);
}

.about-newspaper .redice {
  filter: hue-rotate(170deg);
}

.about-newspaper #private {
  font-style: italic;
}

#info-square.dark {
  filter: drop-shadow(1px -10px 30px pink);
}

#info-square {
  filter: drop-shadow(1px -10px 30px grey);
}

#info-square {
  direction: ltr;
  position: fixed;
  margin: auto;
  bottom: 0;
  right: 0;
  left: 0;
  /* top: 33px; */
  padding: 5px;
  color: #f5f5f5;
  background: #555;
  /* border-radius: 50px; */
  /* width: 50%; */
  font-size: 85%;
  /* font-style: italic; */
  font-family: system-ui;
  /* justify-content: center; */
  align-items: center;
  display: flex;
  text-overflow: ellipsis;
  outline: 0.01em solid;
  overflow: hidden;
  /* white-space: pre; in case we have html tags */
  white-space: nowrap;
}

#info-square > * {
  color: #f5f5f5;
  font-size: 85%;
  margin-left : 0.5em;
  margin-right : 0.5em;
}

#top-navigation-button {
  text-decoration: none;
  /* set position */
  position : fixed;
  bottom : 1em;
  right : 2em;
  z-index : 1;
  /* set appearance */
  background : #f5f5f5;
  color: #555;
  border : 2px solid #555;
  border-radius : 50px;
  /* margin : 10px; */
  min-width : 30px;
  min-height : 30px;
  /* font-size : 1.1em; */
  /* opacity : 0.3; */
  /* center character */
  padding: 0.3em;
  justify-content: center;
  align-items : center;
  display : none;
  /* disable selection marks */
  outline : none;
  /* cursor : default;
  transform: rotate(-90deg) scale(1, -1); */ }

/*
#page-settings button,
#page-settings input,
#page-settings label {
  padding: 5px;
}
*/

#page-settings #keywords-blacklist-current span:after,
#page-settings #keywords-whitelist-current span:after {
  content: ", ";
}

#page-settings td {
  vertical-align: initial;
}

#email-link {
  display: block;
  margin-top: 3em;
  text-decoration: overline;
  outline: none;
}

#feed-banner {
  outline: none;
  display: table;
  margin: auto;
  /* filter: drop-shadow(2px 4px 6px black); */ }

.about-newspaper #buttons {
  text-align: center;
}

#articles-filtered {
  background: #166c23;
}

#petition-alert {
  background: blueviolet;
}

#feature-limited {
  background: indianred;
}

#not-well-formed {
  background: dimgrey; /* #449 */
}

#atom-message {
  background: royalblue;
  text-decoration: none;
}

#xslt-message {
  background: darkgoldenrod; /* coral royalblue #2c3e50 */
  cursor: pointer;
}

#you-are-not-supposed-to-be-here {
  background: #130200;
  color: #be3a1b;
  font-weight: bold;
  /* overflow: hidden;
  text-overflow: ellipsis; */
  white-space: nowrap;
}

.infobar-message {
  color: white; /* #eee navajowhite */
  direction: ltr;
  display: block;
  font-family: system-ui;
  /* height: 50px; */
  line-height: 50px;
  padding: 0.3em;
  text-align: center; /* justify */
}

.infobar-message:last-child {
  border-bottom-left-radius: 1em;
  border-bottom-right-radius: 1em;
}


#infobar-messages {
  /* left: 0; */
  margin: auto 1em;
  /* position: absolute; */
  /* right: 0; */
}


body.dark {
  background: #444;
}

#feed code.dark,
.enclosures.dark,
.resources.dark {
  background: #555;
}

::selection {
  color: #000;
  background: #d3d3d3;
}

th {
  text-align: start;
}

tr > * {
  min-width: 150px;
  padding: 0.5em;
}

#feed-info {
  border-bottom: 1px solid;
  width: 90%;
  margin: auto;
  font-size: 90%;
  padding: 3px;
  /* margin: 3px; */
  margin-top: 3em;
  text-align: center;
}

body > footer {
  direction: ltr;
  display: block;
  /* font-family: system-ui; */
  font-size: 90%;
  /* font-weight: lighter; */
  margin: auto;
  text-align: center;
  width: 96%;
  }

body > footer > *,
body > footer > *:hover {
  display: inline-flex;
  justify-content: center;
  text-decoration: unset;
  /* min-width: 100px; */
  color: unset;
  margin: 5px;
  }
/*
body > footer > *:after {
  content: "|";
  margin-left: inherit;
  }

body > footer > *:last-child:after {
  content: "";
  }
*/
placeholder {
  display: block;
  margin-bottom: 3em;
  }

body > footer,
details > summary,
.about-newspaper #buttons-custom > span,
.about-newspaper #buttons-custom,
.about-newspaper #buttons,
.about-newspaper .text-icon,
.about-newspaper .filter,
.decor,
.infobar-message,
#webring,
#control-bar *,
#top-navigation-button,
#page-settings {
  user-select: none;
}

#top-navigation-button {
  display: flex;
}

#control-bar-container.dark {
  filter: drop-shadow(1px 10px 30px pink);
}

#control-bar a {
  color: #f5f5f5;
  /* font-style: italic; */
  font-family: system-ui;
  /* NOTE Should not this be max-width? */
  /* min-width: 100px; */
  margin: 6px;
}

#control-bar-container {
  background: #555; /* #eee */
  filter: drop-shadow(1px 10px 30px grey);
  left: 0;
  position: fixed;
  right: 0;
  z-index: 1;
}

#control-bar {
  color: #f5f5f5;
  cursor: default;
  direction: ltr;
  display: block;
  font-family: system-ui;
  height: 50px;
  margin: auto;
  max-width: 1200px;
  padding: 0.3em;
  text-align: center;
  white-space: nowrap;
  /* scrollbar-width: none; Gecko */
  /* -ms-overflow-style: none;  Edge */
}

/* Falkon and Otter */
#control-bar::-webkit-scrollbar {
  display: none;
}

#control-bar * {
  text-decoration: none;
  font-size: 85%;
  outline: none;
  /* min-width: 12%; */
  padding: 6px;
  /* font-family: system-ui; */
  white-space: nowrap;
  /* margin: 20px; */
  margin: 6px;
  /* min-width: unset; */
  display: inline-block;
  /* margin-right: 5px; */
  /* margin-left: 5px; */
  padding-right: 5px;
  padding-left: 5px;
  min-width: 4%;
}

#control-bar *:hover {
  opacity: 0.9;
}

#control-bar #homepage-link,
#control-bar #subscribe-link {
  border-left-style: solid;
  border-radius: 0.5em; /* 2em 40% */
  border-right-style: solid;
  /* color: #f5f5f5; */
  font-weight: 900;
  cursor: pointer;
  border-color: grey;
  width: 12%;
}

#control-bar #about-help,
#control-bar #about-settings {
  /* border-bottom: solid; */
  border-radius: 0.7em;
  border-color: grey;
  /* cursor: pointer; */ }

/* character ❱

#control-bar #nav-next {
  transform: rotate(90deg);
}

#control-bar #nav-previous {
  transform: rotate(-90deg);
  margin-left: unset;
}
*/

#control-bar #mode {
  transform: rotate(180deg);
}

/*
#control-bar #nav-next:after,
#control-bar #nav-previous:after {
  content: "";
  border: solid;
  padding: 5px;
  border-width: 1px 0 0 1px;
  position: absolute;
}

#control-bar #nav-next:after {
  transform: rotate(-135deg);
}

#control-bar #nav-previous:after {
  transform: rotate(45deg);
}

#control-bar #mode {
  filter: saturate(7);
}
*/

@media (max-width: 1350px) {
    #homepage-link,
    #subscribe-link {
      display: none;
    }
  }

@media (max-width: 800px) {
    #ace-link-next,
    #ace-link-prev {
      display: none;
    }

    #control-bar * {
      min-width: 5%;
    }
}

@media (max-width: 550px) {
    #control-bar #about-help {
      display: none;
    }

    #control-bar #about-settings {
      background: unset;
    }
  }`,
  cssFileRTL = `
html, body {
  text-align: right;
}

#feed {
  direction: rtl;
}

.geolocation > a {
  padding-right: 6px;
}
`;

var articlesFiltered = [],
    motd,
    //contentText, // NOTE Should this data be cached?
    contentMode,
    cssFileBase,
    detectionNotification,
    detectionScan,
    enableEnclosure,
    enableIcon = false,
    enclosureView,
    filterBlacklist,
    filterWhitelist,
    fontSize,
    fontType,
    gmGetValue,
    gmNotification,
    gmRegisterMenuCommand,
    gmSetValue,
    handlerInstance,
    handlerUrl,
    ignoreMinimumItemNumber = false,
    indirect,
    init,
    keywords,
    keywordsBlacklist,
    keywordsWhitelist,
    minimumItemNumber,
    playEnclosure = false,
    subscriptionHandler,
    viewMode,
    wellFormed = true,
    xmlStylesheet = false,
    xmlStylesheetMissing = false;

// Check availability of Greasemonkey API

if (typeof GM !== "undefined" && typeof GM.registerMenuCommand === "function") {
  gmRegisterMenuCommand = true;
} else {
  gmRegisterMenuCommand = false;
  console.warn("Greasemonkey API GM.registerMenuCommand does not seem to be available.");
}

if (typeof GM !== "undefined" && typeof GM.notification === "function") {
  gmNotification = true;
} else {
  gmNotification = false;
  console.warn("Greasemonkey API GM.notification does not seem to be available.");
}

if (typeof GM !== "undefined" && typeof GM.getValue === "function") {
  gmGetValue = true;
} else {
  gmGetValue = false;
  console.warn("Greasemonkey API GM.getValue does not seem to be available.");
}

if (typeof GM !== "undefined" && typeof GM.setValue === "function") {
  gmSetValue = true;
} else {
  gmSetValue = false;
  console.warn("Greasemonkey API GM.setValue does not seem to be available.");
}

let sessionStorageAvailable, loadRawDocument;

try {
  loadRawDocument = sessionStorage.getItem("loadRawDocument");
  sessionStorageAvailable = true;
} catch {
  sessionStorageAvailable = false;
}

if (sessionStorageAvailable && loadRawDocument) {
  window.addEventListener("load", async function() {
    console.info("📰 Greasemonkey Newspaper: RSS renderer is currently disabled to this site.");
    if (gmNotification) {
      await GM.notification({
        text: "RSS renderer is currently disabled to this site. Click to enable.",
        title: "📰 Greasemonkey Newspaper",
        image: characterAsSvgDataUri("🗞️"),
        onclick: function() {
          sessionStorage.removeItem("loadRawDocument");
          // Consider to pass dictionary "feed" to function postProcess, so that it
          // be possible to utilize this function.
          //checkContentType(contentText);
          retrieveContent(true);
        }
      });
    }
  });
} else {
  // Start processing
  //init = (function init() {
  //  retrieveContent(false);
  //})();
  init = retrieveContent(false);
}

async function retrieveContent(reload) {
  // It shows, yet neglects to show stylesheet directive.
  if (!reload &&
      document.documentElement &&
      document.documentElement.nodeName &&
      (document.documentElement.nodeName.toLowerCase() == "feed" ||
       document.documentElement.nodeName.toLowerCase() == "rdf" ||
       document.documentElement.nodeName.toLowerCase() == "rss")
     ) {
    indirect = false;
    for (let childNode of document.childNodes) {
      if (childNode.target == "xml-stylesheet") {
        childNode.remove();
        xmlStylesheet = true;
        break;
      }
    }
    const contentText = xmlSerializer.serializeToString(document.documentElement);
    await checkContentType(contentText);
  } else
  if (!reload &&
      document.contentType == "text/plain" &&
      document.querySelector("pre")) {
    indirect = false;
    const contentText = document.querySelector("pre").textContent;
    //await checkContentType(String.fromCharCode(parseInt(contentText,16)));
    await checkContentType(contentText);
  } else {
    indirect = true;
    let promise = new Promise(
      function(success, failure) {
        let request = new XMLHttpRequest();
        //request.overrideMimeType("text/plain");
        //request.responseType = "text"; // ms-stream also works but both do not make a difference
        request.open("GET", document.documentURI);
        //request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
        //request.setRequestHeader("Content-Type", "text/plain");
        request.onload = function() {
          console.info("📰 Greasemonkey Newspaper: Retrieving data…");
          //notification("Retrieving data…", "🗃")
          if (document.URL.startsWith("file:") || request.status == 200) {
            const contentText = request.response;
            success(contentText);
          } else {
            failure("File not Found.");
          }
        };
        request.send();
    
        /* gmXmlhttpRequest({
          method: "GET",
          url: document.documentURI,
          headers: {
            "Content-Type": "text/plain",
            "Accept": "text/plain"
          },
          onprogress: function(request) {
            request.responseType = "text";
          },
          onload: function(request) {
            request.overrideMimeType = "text/plain";
            if (document.URL.startsWith("file:") ||
                request.status == 200) {
              success(request);
            }
            else {
              failure("File not Found");
            }
          },
          onerror: function(request) {
            failure("File not Found")
          }
        }) */
      }
    );
    promise.then(
      async (contentText) => {
        await checkContentType(contentText)
      }
    );
  }
}

async function checkContentType(contentText) {
  console.info("📰 Greasemonkey Newspaper: Analyzing data…");
  //await notification("Analyzing data…", "📊")
  // Read settings
  if (gmGetValue) {
    motd = await getMotd();
    contentMode = await getContentMode();
    detectionNotification = await getDetectionNotification();
    detectionScan = await getDetectionScan();
    enableIcon = await getIconMode();
    enableEnclosure = await getEnclosureMode();
    enclosureView = await getEnclosureView();
    fontSize = await getFontSize();
    fontType = await getFontType();
    filterBlacklist = await getFilterBlacklist();
    filterWhitelist = await getFilterWhitelist();
    handlerInstance = await getHandlerInstance();
    handlerUrl = await getHandlerUrl();
    keywordsBlacklist = await getKeywordsBlacklist();
    keywordsWhitelist = await getKeywordsWhitelist();
    minimumItemNumber = await getMinimumItemNumber() -1;
    playEnclosure = await getAudioEnclosureMode();
    subscriptionHandler = await getSubscriptionHandler();
    viewMode = await getViewMode();
  }

  /*
  if (request.response.toLowerCase().includes("<?xml-stylesheet")) {
    // Apparently, this software does not influence server stylesheet
    // This if statement is useful to save CPU and RAM resources.
    // NOTE We can remove it using DOMParser.
    return; // exit
  }
  */

  let jsonFile,
      xmlFile,
      newDocument,
      isHtml = false,
      isJson = false, //isXml = false isTxt = false
      feed = {};
  feed.generator = {};
  feed.update = {};
  //let contentText = request.response;
  //console.log(contentText);
  //console.log(request.getResponseHeader("Content-Type"));
  // NOTE Binary check.
  //if (contentText instanceof Blob) {
  //if (contentText.constructor === Blob) {
  //if (Object.prototype.toString.call(contentText) === '[object Blob]') {
  // NOTE Textual check.
  // It is possible to utilize a graceful system for content recognision.
  // let contentType = request.getResponseHeader("Content-Type");
  // if (contentType.includes("application/atom+xml")) {}
  // However, due to the hostility and shenanigans of some HTML browser
  // vendors;
  // Additionally, some servers could be misconfigured, and return "null" or
  // wrong MIME-Type;
  // Therefore, it is essential to conduct arbitrary checks.
  // TODO Set the "graceful" system as a routine and offer the "arbitrary"
  // system as an option.
  if (!contentText.startsWith("<") &&
      contentText.includes("{") &&
      contentText.includes("}")) {
    try { // Check whether JSON.
      jsonFile = JSON.parse(contentText);
      isJson = true;
    } catch (e) {
      console.error(e);
      isJson = false;
    }
  } else {
    isJson = false;
  }
  if (!isJson) {
    let htmlFile;
    try {
      htmlFile = domParser.parseFromString(contentText, "text/html");
    } catch (e) {
      console.warn(e);
      // TODO Recognize TrustedHTML, as or similarly to "securitypolicyviolation".
      if (e.toString().includes("TypeError") && e.toString().includes("TrustedHTML")) {
        // Thank you. hacker09.
        // https://greasyfork.org/en/discussions/development/220765#comment-469969
        if (window.trustedTypes && window.trustedTypes.createPolicy) {  
            window.trustedTypes.createPolicy("default", {
              createHTML: (string, sink) => string
            }); 
        }
        htmlFile = domParser.parseFromString(contentText, "text/html");
      }
    }
    if (htmlFile.documentElement.tagName == "HTML" &&
        htmlFile.doctype && htmlFile.doctype.name == "html") {
    //if (htmlFile.body && htmlFile.body.childNodes.length > 0) {
      // TODO Analyze for Microformat.
      isHtml = true;
    } else {
      xmlFile = domParser.parseFromString(contentText.trim(), "text/xml");
      //isXml = true;
    }
  }

  /*
  try {
    
  } catch (e) {
    alert("An error was encountered.");
    console.error("An error was encountered.");
    console.error(e);
  }
  */

  // Scan for possible syndication feeds.
  if (isHtml && detectionScan) {
    scanDocument();
  } else
  if (isJson) { // Attempt to parse JSON.
    console.info("📰 Greasemonkey Newspaper: Collecting JSON data…");
    notification("Collecting JSON data…", "🧱");
    if (jsonFile.version) {
      // FIXME TODO Handle empty feed https://jblevins.org/index.json
      if (jsonFile.version.toLowerCase().includes("jsonfeed.org")) {
        //setTimeout(function(){renderJSONFeed(jsonFile)}, 1500);
        extractJsonFeed(jsonFile, feed);
        if (feed.version) {
          let version;
          version = feed.version.split("/").pop();
          feed.type = `JSONFeed ${version}`;
        } else {
          feed.type = "JSONFeed";
        }
      }
    } else
    if (jsonFile["@context"]) {
      if (jsonFile["@context"][0] == "https://www.w3.org/ns/activitystreams" &&
          jsonFile["@context"][1] == "https://w3id.org/security/v1") {
        
        extractNostr(jsonFile, feed);
        feed.link = "nostr:" + jsonFile.preferredUsername;
        feed.type = "ActivityStream (Nostr)";
        feed.version = jsonFile["@context"][2].nostr;
      }
    } else
    if (jsonFile.generator) {
      if (jsonFile.generator.toLowerCase().includes("statusnet") ||
          jsonFile.generator.toLowerCase().includes("gnu social")) {
        feed.date = jsonFile.items[0].published;
        extractOStatus(jsonFile, feed);
        feed.generator.name = jsonFile.generator;
        feed.link = location.protocol + "//" + location.hostname;
        feed.type = "ActivityStream (OStatus)";
      }
    } else
    if (jsonFile.rss) {
      if (jsonFile.rss.version.toLowerCase().includes("2.0")) {
        feed.date = jsonFile.rss.channel.pubDate;
        extractRssInJson(jsonFile.rss.channel, feed);
        feed.generator.name = jsonFile.rss.channel.generator;
        feed.link = jsonFile.rss.channel.link;
        feed.type = "RSS-in-JSON";
        feed.version = jsonFile.rss.version;
      }
    } else {
      console.info("📰 Greasemonkey Newspaper: No supported JSON structure was found. Exiting.");
      return; // Exit.
    }
    // FIXME Parse ActivityStream entry
    // https://nu.federati.net/api/statuses/show/3424682.json
    // https://status.hackerposse.com/api/statuses/show/153301.json
    console.info("📰 Greasemonkey Newspaper: Rendering JSON data as XHTML document…");
    notification("Rendering JSON data as XHTML document…", "📝");
    newDocument = renderDocument(feed);
    feedInfo(newDocument, feed);
    await preProcess(newDocument, feed);
    placeNewDocument(newDocument);
    await postProcess(feed);
  } else
  if (document.contentType == "text/plain" &&
      (location.pathname.endsWith("twtxt.txt") ||
        location.pathname.endsWith("tw.txt") ||
        location.pathname.includes("/twtxt") || // TODO Test this
        (location.hostname.split(".").length > 2 &&
        location.hostname.split(".")[0] == "twtxt"
        )
      )
     ) { // Attempt to parse twtxt.
    console.info("📰 Greasemonkey Newspaper: Collecting Twtxt data…");
    notification("Collecting Twtxt data…", "🧱");
    extractTwtxt(contentText, feed);
    feed.type = "Twtxt";
    console.info("📰 Greasemonkey Newspaper: Rendering Twtxt data as XHTML document…");
    notification("Rendering Twtxt data as XHTML document…", "📝");
    newDocument = renderDocument(feed);
    feedInfo(newDocument, feed);
    await preProcess(newDocument, feed);
    placeNewDocument(newDocument);
    await postProcess(feed);
  } else
  if (xmlFile) { // Attempt to parse XML.

    // TODO Preference to respect or override stylesheet
    // TODO Ignore all stylesheets if all are CSS

    // orgFile = domParser.parseFromString(request.response, "text/xml");
    // /questions/6334119/check-for-xml-errors-using-javascript
    // console.error(orgFile.documentElement.nodeName == "parsererror" ? "error while parsing" : orgFile.documentElement.nodeName);

    // Check validity.
    let wellFormedMessage = xmlFile.getElementsByTagName("parsererror").length ? 
      (new XMLSerializer()).serializeToString(xmlFile) : "This XML is well-formed.";
    if (wellFormedMessage != "This XML is well-formed.") {
      console.warn("This XML is not-well-formed (i.e. invalid).");
      wellFormed = false;
    }

    if (document.childNodes.length == 1 &&
        document.childNodes[0].target == "xml-stylesheet") {
        xmlStylesheetMissing = true;
    } else
    // https://wok.oblomov.eu/index.atom
    if (document.childNodes.length == 2 &&
        document.childNodes[0].target == "xslt-param") {
        xmlStylesheetMissing = true;
    }

    for (let childNode of xmlFile.childNodes) {
      if (childNode.target == "xml-stylesheet") {
        childNode.remove();
        xmlStylesheet = true;
        break;
      }
    }

/*
    // TODO Configuration to override existing stylesheet
    if (override) {
      if (xmlFile.firstChild.nodeName == "xml-stylesheet") {
        console.log(xmlFile.firstChild)
        xmlFile.firstChild.remove();
      }
    } else {
      return; // Exit.
    }
*/

/*
    // Remove node of type comment
    // Because of this code below
    if (xmlFile.childNodes[0] == xmlFile.querySelector("feed")) {
      while (xmlFile.firstChild.nodeName == "#comment") {
        xmlFile.firstChild.remove(); // xmlFile.childNodes[0]
      }
    }
*/

/*
    // Remove all nodes of type comment
    nodeIterator = xmlDoc.createNodeIterator(
      xmlDoc,  // Starting node, usually the document body
      NodeFilter.SHOW_ALL,  // NodeFilter to show all node types
      null,  
      false  
    );

    let currentNode;
    // Loop through each node in the node iterator
    while (currentNode = nodeIterator.nextNode()) {
      // Do something with each node
      console.log(currentNode.nodeName);
    }
*/

    // TODO In order to not having this notification displayed with every HTML
    //      document, check that this is not HTML, and continue.
    console.info("📰 Greasemonkey Newspaper: Collecting XML data…");
    //notification("Collecting XML data…", "🧱");
    let nodeAtom = xmlFile.queryPath(xmlns.atom, "atom:feed"),
        nodeAtom03 = xmlFile.queryPath(xmlns.atom03, "atom:feed"),
        nodeEntry = xmlFile.queryPath(xmlns.atom, "atom:entry"),
        nodeGenerator = xmlFile.queryPath(xmlns.microsummaries, "microsummaries:generator"),
        nodeItem = xmlFile.queryPath(xmlns.pubsub, "pubsub:item"),
        nodeOpml = xmlFile.queryPath(null, "opml"),
        nodeProject = xmlFile.queryPath(xmlns.doap, "//doap:Project"),
        nodeRdf = xmlFile.queryPath(xmlns.rdf, "rdf:RDF"),
        nodeRss = xmlFile.queryPath(null, "rss"),
        nodeSitemapIndex = xmlFile.queryPath(xmlns.sitemap, "sitemap:sitemapindex"),
        nodeSitemapUrlset = xmlFile.queryPath(xmlns.sitemap, "sitemap:urlset"),
        nodeSmf = xmlFile.queryPath(xmlns.smf, "smf:xml-feed");
    if (nodeItem) {
      extractAtomOverXmpp(xmlFile, feed);
      feed.type = "Atomsub (Atom Over XMPP / XEP-0277 / XEP-0472)";
    } else
    if (nodeGenerator) {
      extractMicrosummary(xmlFile, feed);
      feed.type = "Microsummary";
    } else
    if (nodeAtom) {
      // <feed xmlns="http://www.w3.org/2005/Atom">
      // xmlFile.getElementsByTagNameNS("http://www.w3.org/2005/Atom","feed")
      extractAtomSyndicationFormat(xmlFile, feed);
      feed.type = "The Atom Syndication Format 1.0";
    } else
    if (nodeAtom03) {
      extractAtomSyndicationFormat03(xmlFile, feed);
      feed.type = "The Atom Syndication Format 0.3";
    } else
    if (nodeEntry) {
      extractAtomActivityStreams(xmlFile, feed);
      feed.type = "Atom Activity Streams 1.0";
    } else
    if (nodeRss) {
      // Netscape RSS 0.91 <!DOCTYPE rss SYSTEM "http://my.netscape.com/publish/formats/rss-0.91.dtd">
      // Userland RSS 0.91 <rss version="0.91">
      // RSS 0.92 <rss version="0.92">
      // RSS 0.93 <rss version="0.93">
      // RSS 0.94 <rss version="0.94">
      // RSS 2.0 <rss version="2.0">
      extractRss(xmlFile, feed);
      
      //aboutInfo(xmlFile, rdfRules);
      // FIXME https://elegislation.gov.hk/verified-chapters!en.rss.xml
      let rssVersion = xmlFile.firstElementChild.getAttribute("version");
      if (rssVersion) {
        feed.type = `RSS ${rssVersion}`;
      } else {
        feed.type = "RSS"; // RSS Syndication Feed 2.0
      }
      feed.alternative = possibleAtomDocument(xmlFile, feed)
    } else
    if (nodeSmf) {
      extractSmf(xmlFile, feed);
      feed.type = "SMF - Simple Machines Forum";
    } else
    if (nodeProject) {
      extractDoapXmpp(xmlFile, feed);
      feed.type = "DOAP - Description of a Project (XMPP)";
    } else
    if (nodeRdf && nodeRdf.getAttribute("xmlns:foaf")) {
      extractFoaf(xmlFile, feed);
      feed.type = "FOAF - Friend Of A Friend";
    } else
    if (nodeRdf) { // RDF Vocabulary
      let rssVersion;
      switch (nodeRdf.getAttribute("xmlns")) {
        case "http://my.netscape.com/rdf/simple/0.9/":
          extractRdfSiteSummary90(xmlFile, feed);
          rssVersion = "0.90";
          break;
        case "https://web.resource.org/rss/1.0/":
        case "http://purl.org/rss/1.0/":
          extractRdfSiteSummary(xmlFile, feed);
          rssVersion = "1.0";
          break;
      }
      feed.type = `RSS ${rssVersion}`; // RDF Site Summary
    } else
    if (nodeOpml) {
      // dateCreated http://source.scripting.com/?format=opml
      extractOpml(xmlFile, feed);
      feed.type = "OPML Collection";
    } else
    if (nodeSitemapIndex) {
      extractSitemapIndex(xmlFile, feed);
      feed.type = "Sitemap (index)";
    } else
    if (nodeSitemapUrlset) {
      extractSitemapUrlset(xmlFile, feed);
      feed.type = "Sitemap (urlset)";
    } else {
      console.info("📰 Greasemonkey Newspaper: No supported XML structure was found. Exiting.");
      return; // Exit.
    }
    console.info("📰 Greasemonkey Newspaper: Rendering XML data as XHTML document…");
    notification("Rendering XML data as XHTML document…", "📝");
    newDocument = renderDocument(feed);
    //aboutInfo(xmlFile, rdfRules);
    feedInfo(newDocument, feed);
    await preProcess(newDocument, feed);
    placeNewDocument(newDocument);
    await postProcess(feed);
  }

  // Information of request
  //console.info(xmlFile);
  //console.info(document);
  //console.info(`all headers: ${request.getAllResponseHeaders()}`);
  //console.info(`content-type header: ${request.getResponseHeader("content-type")}`);
  //console.info(`content-type document: ${document.contentType}`);

  // errorPage is a good idea to promote Falkon
  //setTimeout(function(){renderFeed(request.response)}, 1500); // timeout for testing

}

/*

Test code (attempting to modify content type):

console.info(document);
request = new XMLHttpRequest();
// "false" is only used for this test
request.open("GET", document.documentURI, false);
request.overrideMimeType("text/plain");
request.setRequestHeader("content-type", "text/plain");
request.send();
//console.info(request.response);
console.info(`all headers: ${request.getAllResponseHeaders()}`);
console.info(`content-type header:
${request.getResponseHeader("content-type")}`);
console.info(`content-type document: ${document.contentType}`);

*/

/*
(function checkContentType() {

  fetch(
    document.documentURI,
    {
      method: "GET",
      headers: {
        "Content-Type" : "text/plain",
      },
    }
  )

  .then((response) => {
     console.info(response.headers.get("content-type"))
     //console.info(response.arrayBuffer())
     return response.arrayBuffer();
  })

  .then((data) => {
    let decoder = new TextDecoder(document.characterSet);
    let text = decoder.decode(data);

      domParser = domParser = new DOMParser();

      try {
        if (JSON.parse(text)) {
          jsonFile = JSON.parse(text);
          if (jsonFile.version) {
            if (jsonFile.version.toLowerCase().includes("jsonfeed.org")) {
              renderJSONFeed(jsonFile);
              await extensionLoader(jsonFile.feed_url); // , jsonFile, "JSON"
            }
          } else
          if (jsonFile.generator) {
            if (jsonFile.generator.toLowerCase().includes("statusnet") || // TODO Case insensitive
                jsonFile.generator.toLowerCase().includes("gnu social")) {
              renderOStatus(jsonFile);
              await extensionLoader(); // null, jsonFile, "ActivityStream"
            }
          }
        }
      } catch {
        if (domParser.parseFromString(text, "text/xml")) {
          xmlFile = domParser.parseFromString(text, "text/xml");
          // errorPage is a good idea to promote Falkon
          if (xmlFile.querySelector("feed")) {
            renderXML(xmlFile, atomRules);
            await extensionLoader(xmlFile.querySelector("feed > link").href); // , xmlFile, "Atom"
          } else
          if (xmlFile.querySelector("rss")) {
            renderXML(xmlFile, rssRules);
            await extensionLoader(xmlFile.querySelector("channel > link").href); // , xmlFile, "RSS"
          }
        }
      }
  });
})();
*/

// TODO Markdown https://uninformativ.de/twtxt.txt
function extractTwtxt(txtFile, feed) {
  let lines = txtFile.trim().split("\n");
  let metadata = {};
  for (const line of lines) {
    if (line.startsWith("#") && line.includes("=")) {
      let newLine = line.replace("#","");
      let keyValue = newLine.split("=");
      let key = keyValue[0].trim();
      let value = keyValue[1].trim();
      metadata[key] = value;
    }
  }
  feed.count = lines.length;
  feed.icon = metadata.avatar;
  feed.language = metadata.lang;
  feed.logo = metadata.avatar;
  feed.link = metadata.url;
  feed.prev = {}
  if (metadata.prev) {
    feed.prev.href = metadata.prev.split(" ")[1];
    feed.prev.title = metadata.prev.split(" ")[0];
  }
  feed.subtitle = metadata.description;
  feed.title = metadata.nick;
  feed.entries = [];
  for (const line of lines.reverse()) {
    if (line && !line.startsWith("#")) {
      let entry = {};
      entry.summary = {};
      let twtEntry = line.split("	");
      let date = twtEntry[0], text = twtEntry[1];
      entry.date = date;
      entry.summary.text = text;
      entry.summary.type = "html";
      feed.entries.push(entry);
    }
  }
}

// TODO Test with a Nostr feed.
function extractNostr(jsonFile, feed) {
  feed.title = jsonFile.name;
  // NOTE It appears that Nostr has no attribute language.
  feed.language = jsonFile.language;
  feed.name = jsonFile.name;
  feed.subtitle = jsonFile.summary;
  if (jsonFile.icon) {
    feed.icon = jsonFile.icon.url;
  }
  feed.count = jsonFile.items.length;
  if (feed.count) {
    feed.entries = [];
    for (const item of jsonFile.items) {
    //for (let i = 0; i < jsonFile.items.length; i++) {
      // /questions/5002111/how-to-strip-html-tags-from-string-in-javascript
      let entry = {};
      entry.date = item.published;
      emtry.author = item.actor.portablecontacts_net.preferredUsername;
      entry.link = item.url;
      //entry.id = item.id;
      if (item.actor && item.actor.image) {
        entry.image = item.actor.image;
      }
      entry.summary = {};
      entry.summary.text = item.content;
      entry.summary.type = "html";
      feed.entries.push(entry);
    }
  }
}

function extractOStatus(jsonFile, feed) {
  feed.title = jsonFile.title;
  feed.language = jsonFile.language;
  feed.subtitle = jsonFile.items[0].actor.summary;
  feed.count = jsonFile.items.length;
  for (const link of jsonFile.links) {
    switch (link.rel) {
      case "alternate":
        feed.link = link.url;
        break;
      case "next":
        feed.next = link.url;
        break;
      case "previous":
        feed.prev = {};
        feed.prev.href = link.url;
        break;
    }
  }
  feed.icon = jsonFile.items[0].actor.status_net.avatarLinks[0].url;
  if (feed.count) {
    feed.entries = [];
    for (const item of jsonFile.items) {
    //for (let i = 0; i < jsonFile.items.length; i++) {
      let entry = {};
      entry.content = {};
      entry.summary = {};
      entry.date = item.published;
      let dateAsTitle = new Date(entry.date);
      //entry.author = item.actor.portablecontacts_net.preferredUsername;
      entry.author = {};
      entry.author.name = item.actor.displayName;
      entry.author.uri = item.actor.url;
      entry.authors = [entry.author];
      //titleToc.textContent = item.content.replace(/(<([^>]+)>)/gi, "");
      //titleToc.textContent = item.actor.portablecontacts_net.preferredUsername;
      entry.link = item.url;
      entry.image =  item.actor.image.url;
      entry.content.text = item.content;
      entry.content.type = "html";
      entry.categories = [];
      if (item.object.tags) {
        for (const tag of item.object.tags) {
          let entryCategory = {};
          entryCategory.term = tag.displayName;
          entry.categories.push(entryCategory);
        }
      }
      feed.entries.push(entry);
    }
  }
}

function extractRssInJson(jsonFile, feed) {
  feed.title = jsonFile.title;
  feed.language = jsonFile.language;
  feed.title = jsonFile.title;
  feed.subtitle = jsonFile.description;
  feed.count = jsonFile.item.length;
  if (feed.count) {
    feed.entries = [];
    for (const item of jsonFile.item) {
      let entry = {};
      entry.summary = {};
      entry.summary.text = item.description;
      entry.summary.type = "html";
      entry.date = item.pubDate;
      //entry.title = 
      entry.link = item.link; // item["source:outline"].permalink
      //entry.id = item.id;

      /*
      if (item["source:outline"].image) {
        let image = newDocument.createElement("img");
        image.src = item["source:outline"].image;
        entry.append(image);
      }
      */

      // item["source:outline"].text
      // item["source:outline"].description
      // item["source:outline"].subs (array)
      feed.entries.push(entry);
    }
  }
}

function extractJsonFeed(jsonFile, feed) {

  let feedMap = {
    "title": "title",
    "subtitle": "description",
    "language" : "language",
    "item": [{
      "title" : "title",
      "url" : ["url", "id"],
      "content" : ["content_html", "content_text"],
      "image" : "image",
      "date" : ["date_published", "date_modified"],
      "authors" : ["authors", "author"],
      "tags" : "tags",
      "language" : "language",
      "id" : "id",
      }],
    "attachments": [{
      "url" : "url",
      "mime_type" : "mime_type",
      "title" : "title",
      "size_in_bytes" : "size_in_bytes",
      "duration_in_seconds" : "duration_in_seconds"
      }],
    "homepage": "home_page_url",
    "version": "version",
    "url": "feed_url"
  };

  /*
  newDocument = domParser.parseFromString("<html></html>", "text/html");
  elements = ["html", "head", "body"];
  //for (const element of elements) {
  for (let i = 1; i < elements.length; i++) {
    element = newDocument.createElement(elements[i]);
    newDocument.documentElement.append(element);
  }
  */

  feed.count = jsonFile.items.length;
  feed.date = jsonFile.items[0].date_published;
  feed.generator.name = jsonFile.generator;
  feed.icon = jsonFile.icon;
  feed.language = jsonFile.language;
  feed.link = jsonFile.home_page_url;
  //feed.link = jsonFile.feed_url;
  feed.subtitle = jsonFile.description;
  feed.title = jsonFile.title;
  feed.version = jsonFile.version;

  /* FIXME
     These couple of for-loops do not work
     Failing part: jsonFile.cellOfArray
     Uncaught (in promise) TypeError: Cannot read property "0" of undefined

  tags = ["title", "description"];
  for (const tag of tags) {
    element = newDocument.createElement("div");
    element.textContent = jsonFile.tag;
    element.id = tag;
    feed.append(element);
  }

  elements = ["title", "description"];
  for (let i = 0; i < elements.length; i++) {

    element = newDocument.createElement("div");
    element.textContent = jsonFile.elements[i];
    element.id = elements[i];
    feed.append(element);

  }
  */

  if (feed.count) {
    feed.entries = [];
    for (let item of jsonFile.items) {
    //for (let i = 0; i < jsonFile.items.length; i++) {
      let entry = {};
      entry.content = {};
      entry.summary = {};
      entry.title = item.title;
      entry.date = item.date_published;
      entry.link = item.url;
      entry.id = item.id;
      //entry.updated = date_modified;
      // TODO Set it as enclosure unless content is not html (i.e. is text)
      entry.image = item.image;
      entry.content.text = item.content_html;
      entry.content.type = "html";
      entry.summary.text = item.content_text;
      entry.summary.type = "text";
      // TODO Test
      if (item.authors) {
        entry.authors = [];
        // TODO Check whether this is singular: item.author
        for (let item of item.authors) {
          author = {};
          if (item.name) {
              author.name = item.name;
            if (item.uri) {
              author.uri = item.uri;
            }
          }
        }
        entry.authors.push(author);
      }
      feed.entries.push(entry);
    }
  }
}

function extractMicrosummary(xmlFile, feed) {
  let nodeGenerator = xmlFile.queryPath(xmlns.microsummaries, "microsummaries:generator");
  feed.title = nodeGenerator.getAttribute("name");
  feed.entries = [];
  let entry = {};
  entry.summary = {};
  entry.title = "Template";
  let msInclude, msTemplate, xslMatch, xslOutput, xslSelect, xslTransform;
  let nodeMsInclude = nodeGenerator.queryPath(xmlns.microsummaries, "microsummaries:pages/microsummaries:include");
  if (nodeMsInclude) {
    msInclude = nodeMsInclude.textContent;
  }
  let nodeMsTemplate = nodeGenerator.queryPath(xmlns.microsummaries, "microsummaries:template");
  if (nodeMsTemplate) {
    msTemplate = nodeMsTemplate.textContent;
  }
  let nodeTransform = nodeMsTemplate.queryPath(xmlns.xsl, "xsl:transform");
  if (nodeTransform) {
    xslTransform = nodeTransform.textContent;
  }
  let nodeOutput = nodeTransform.queryPath(xmlns.xsl, "xsl:output");
  if (nodeOutput) {
    xslOutput = nodeOutput.getAttribute("method");
  }
  let nodeTemplate = nodeTransform.queryPath(xmlns.xsl, "xsl:template");
  if (nodeTemplate) {
    xslMatch = nodeTemplate.getAttribute("match");
  }
  let nodeValueOf = nodeTemplate.queryPath(xmlns.xsl, "xsl:value-of");
  if (nodeValueOf) {
    xslSelect = nodeValueOf.getAttribute("select");
  }
  entry.summary.type = "html";
  entry.summary.text = `
    Microsummary:\n
     Include rule: ${msInclude}\n\n
    XSLT:\n
     Output (method): ${xslOutput}
     Template (match): ${xslMatch}
     Value-of (select): ${xslSelect}`;
  entry.summary.text = nodeGenerator.outerHTML;
  entry.summary.text += "\n\n"
  entry.summary.text += "<textarea>" + xmlSerializer.serializeToString(nodeTransform) + "</textarea>";
  feed.entries.push(entry);
}

// https://my-place.social/display/feed-item/106337699.atom
// https://libranet.de/display/feed-item/270708499.atom
// https://venera.social/display/feed-item/199057923.atom
function extractAtomActivityStreams(xmlFile, feed) {
  let nodeEntry = xmlFile.queryPath(xmlns.atom, "atom:entry");
  if (enableIcon) {
    let nodeAuthor, nodeAuthorLinkAvatar, nodeAuthorLinkPhoto;
    nodeAuthor = nodeEntry.queryPath(xmlns.atom, "atom:author");
    if (nodeAuthor) {
      nodeAuthorLinkAvatar = nodeAuthor.queryPath(xmlns.atom, "atom:link[@rel='avatar']");
      nodeAuthorLinkPhoto = nodeAuthor.queryPath(xmlns.atom, "atom:link[@rel='photo']");
    }
    let nodeOwner, nodeOwnerLinkAvatar, nodeOwnerLinkPhoto;
    nodeOwner = nodeEntry.queryPath(xmlns.dfrn, "dfrn:owner");
    if (nodeOwner) {
      let nodeOwnerLinkAvatar = nodeOwner.queryPath(xmlns.atom, "atom:link[@rel='avatar']");
      let nodeOwnerLinkPhoto = nodeOwner.queryPath(xmlns.atom, "atom:link[@rel='photo']");
    }
    let iconPath = nodeEntry.queryPath(xmlns.atom, "atom:icon");
    if (iconPath) {
      feed.icon = iconPath.textContent;
    } else
    if (nodeAuthor && nodeAuthorLinkAvatar) {
      feed.icon = nodeAuthorLinkAvatar.getAttribute("href");
    } else
    if (nodeOwner && nodeOwnerLinkAvatar) {
      feed.icon = nodeOwnerLinkAvatar.getAttribute("href");
    }
    let logoPath = nodeEntry.queryPath(xmlns.atom, "atom:logo");
    if (logoPath) {
      feed.logo = logoPath.textContent;
    } else
    if (nodeAuthorLinkPhoto) {
      feed.logo = nodeAuthorLinkPhoto.getAttribute("href");
    } else
    if (nodeOwnerLinkPhoto) {
      feed.logo = nodeOwnerLinkPhoto.getAttribute("href");
    }
  }
  let nodeLinkAlt = nodeEntry.queryPath(xmlns.atom, "atom:link[@rel='alternate']");
  if (nodeLinkAlt) {
    feed.link = nodeLinkAlt.getAttribute("href");
  }
  let entry = {};
  let nodeName = nodeEntry.queryPath(xmlns.atom, "atom:author/atom:name");
  if (nodeName) {
    feed.title = nodeName.textContent;
  }
  let nodeHandle = nodeEntry.queryPath(xmlns.dfrn, "dfrn:owner/dfrn:handle");
  if (nodeHandle) {
    entry.summary = nodeHandle.textContent;
    feed.subtitle = nodeHandle.textContent;
  }
  let nodeConversation = nodeEntry.queryPath(xmlns.ostatus, "ostatus:conversation");
  if (nodeConversation) {
    entry.link = nodeConversation.getAttribute("href");
  }
  // Entry identifier
  let nodeId = nodeEntry.queryPath(xmlns.atom, "atom:id");
  if (nodeId.textContent) {
    entry.id = nodeId.textContent;
  }
  // Entry title
  let nodeTitle = nodeEntry.queryPath(xmlns.atom, "atom:title");
  if (nodeTitle.textContent) {
    entry.title = nodeTitle.textContent;
  }
  // Entry content
  let nodeContent = nodeEntry.queryPath(xmlns.atom, "atom:content");
  if (nodeContent && nodeContent.textContent) {
    entry.content = {};
    if (nodeContent.childElementCount) {
      entry.content.text = nodeContent.innerHTML;
    } else {
      entry.content.text = nodeContent.textContent;
    }
    if (nodeContent.getAttribute("type") &&
        nodeContent.getAttribute("type").includes("html")) {
      entry.content.type = "html";
    }
  }
  // Entry date
  let nodeUpdated = nodeEntry.queryPath(xmlns.atom, "atom:updated");
  let nodePublished = nodeEntry.queryPath(xmlns.atom, "atom:published");
  if (nodeUpdated && nodeUpdated.textContent) {
    feed.date = nodeUpdated.textContent;
    entry.date = nodeUpdated.textContent;
  } else
  if (nodePublished && nodePublished.textContent) {
    feed.date = nodePublished.textContent;
    entry.date = nodePublished.textContent;
  }
  // Entry author
  entry.authors = [];
  let nodesAuthor = nodeEntry.queryPathAll(xmlns.atom, "atom:author");
  for (const nodeAuthor of nodesAuthor) {
    let entryAuthor = {};
    let nodeAuthorName = nodeAuthor.queryPath(xmlns.atom, "atom:name");
    let nodeAuthorUri = nodeAuthor.queryPath(xmlns.atom, "atom:uri");
    if (nodeAuthorName && nodeAuthorName.textContent) {
        entryAuthor.name = nodeAuthorName.textContent;
    } else {
        continue;
    }
    if (nodeAuthorUri) {
        entryAuthor.uri = nodeAuthorUri.textContent;
    }
    entry.authors.push(entryAuthor);
  }
  let nodesOwner = nodeEntry.queryPathAll(xmlns.dfrn, "dfrn:owner");
  for (const nodeOwner of nodesOwner) {
    let entryOwner = {};
    let nodeOwnerName = nodeOwner.queryPath(xmlns.atom, "atom:name");
    let nodeOwnerUri = nodeOwner.queryPath(xmlns.atom, "atom:uri");
    if (nodeOwnerName && nodeOwnerName.textContent) {
        entryOwner.name = nodeOwnerName.textContent;
    } else {
        continue;
    }
    if (nodeOwnerUri) {
        entryOwner.uri = nodeOwnerUri.textContent;
    }
    entry.authors.push(entryOwner);
  }
  feed.entries = [];
  feed.entries.push(entry);
}

function extractAtomOverXmpp(xmlFile, feed) {
  let entry = {};
  entry.content = {};
  entry.summary = {};
  let nodeItem = xmlFile.queryPath(xmlns.pubsub, "pubsub:item");
  let nodeEntry = nodeItem.queryPath(xmlns.atom, "atom:entry");
  let nodeLinkAlt = nodeEntry.queryPath(xmlns.atom, "atom:link[@rel='alternate']");
  if (nodeLinkAlt) {
    feed.link = nodeLinkAlt.getAttribute("href");
  }
  let nodeAuthor = nodeEntry.queryPath(xmlns.atom, "atom:author");
  let nodeName = nodeAuthor.queryPath(xmlns.atom, "atom:name");
  let nodeUri = nodeAuthor.queryPath(xmlns.atom, "atom:uri");
  let authorName, authorUri;
  if (nodeName) {
    authorName = nodeName.textContent;
  }
  if (nodeUri) {
    authorUri = nodeUri.textContent;
  }
  if (authorName || authorUri) {
    feed.title = authorName || authorUri;
    feed.subtitle = authorUri;
  }
  // Entry link
  let nodeLink = nodeEntry.queryPath(xmlns.atom, "atom:link");
  if (nodeLink && nodeLink.getAttribute("href")) {
    // TODO Add an option to configure preferred type (e.g. Atom) and href (e.g. XMPP).
    if (nodeEntry.queryPath(xmlns.atom, "atom:link[@rel='alternate' and contains(@href,'http')]")) {
      entry.link = nodeEntry.queryPath(xmlns.atom, "atom:link[@rel='alternate' and contains(@href,'http')]").getAttribute("href");
    } else {
      entry.link = nodeEntry.queryPath(xmlns.atom, "atom:link").getAttribute("href");
    }
  }
  // Entry identifier
  let nodeId = nodeEntry.queryPath(xmlns.atom, "atom:id");
  if (nodeId.textContent) {
    entry.id = nodeId.textContent;
  }
  // Entry title
  let nodeTitle = nodeEntry.queryPath(xmlns.atom, "atom:title");
  if (nodeTitle.textContent) {
    entry.title = nodeTitle.textContent;
  }
  // Entry date
  let nodeUpdated = nodeEntry.queryPath(xmlns.atom, "atom:updated");
  let nodePublished = nodeEntry.queryPath(xmlns.atom, "atom:published");
  if (nodeUpdated && nodeUpdated.textContent) {
    feed.date = nodeUpdated.textContent;
    entry.date = nodeUpdated.textContent;
  } else
  if (nodePublished && nodePublished.textContent) {
    feed.date = nodePublished.textContent;
    entry.date = nodePublished.textContent;
  }
  // Entry content
  let nodeContent = nodeEntry.queryPath(xmlns.atom, "atom:content");
  let nodeSummary = nodeEntry.queryPath(xmlns.atom, "atom:summary");
  let nodeContentXhtml = nodeEntry.queryPath(xmlns.xhtml, "xhtml:content");
  let nodeSummaryXhtml = nodeEntry.queryPath(xmlns.xhtml, "xhtml:summary");
  if (nodeContentXhtml && nodeContentXhtml.textContent) {
    entry.content.text = nodeContentXhtml.innerHTML;
    entry.content.type = "html";
  } else
  if (nodeContent && nodeContent.textContent) {
    if (nodeContent.childElementCount) {
      entry.content.text = nodeContent.innerHTML;
    } else {
      entry.content.text = nodeContent.textContent;
    }
    if (nodeContent.getAttribute("type") &&
        nodeContent.getAttribute("type").includes("html")) {
      entry.content.type = "html";
    }
  }
  if (nodeSummaryXhtml && nodeSummaryXhtml.textContent) {
    entry.summary.text = nodeSummaryXhtml.innerHTML;
    entry.summary.type = "html";
  } else
  if (nodeSummary && nodeSummary.textContent) {
    if (nodeSummary.childElementCount) {
      entry.summary.text = nodeSummary.innerHTML;
    } else {
      entry.summary.text = nodeSummary.textContent;
    }
    if (nodeSummary.getAttribute("type") &&
        nodeSummary.getAttribute("type").includes("html")) {
      entry.summary.type = "html";
    }
  }
  // Entry enclosures
  if (enableEnclosure) {
    entry.enclosures = [];
    // FIXME XPath
    let nodesLinkEnclosure = nodeEntry.queryPathAll(xmlns.atom, "atom:link[@rel='enclosure' or @rel='image' or @rel='magnet' or @rel='photo' or @rel='preview']");
    for (const enclosure of nodesLinkEnclosure) {
      let entryEnclosure = {};
      if (enclosure.getAttribute("type")) {
        entryEnclosure.type = enclosure.getAttribute("type");
      } else {
        entryEnclosure.type = "";
      }
      if (enclosure.getAttribute("title")) {
        entryEnclosure.title = enclosure.getAttribute("title");
      }
      if (enclosure.getAttribute("length")) {
        entryEnclosure.length = enclosure.getAttribute("length");
      }
      // atom https://tomosnowbug.hatenablog.com/feed
      if (enclosure.getAttribute("href")) {
        entryEnclosure.uri = enclosure.getAttribute("href");
        entryEnclosure.filename = extractEnclosureFilename(entryEnclosure.uri.trim());
      }
      entry.enclosures.push(entryEnclosure);
    }
  }
  // Entry related
  entry.resources = [];
  // FIXME XPath
  let nodesLinkRelated = nodeEntry.queryPathAll(xmlns.atom, "atom:link[@rel='related']");
  for (const related of nodesLinkRelated) {
    let entryResource = {};
    if (related.getAttribute("type")) {
      entryResource.type = related.getAttribute("type");
    } else {
      entryResource.type = "";
    }
    if (related.getAttribute("title")) {
      entryResource.title = related.getAttribute("title");
    }
    if (related.getAttribute("href")) {
      entryResource.uri = related.getAttribute("href");
    }
    entry.resources.push(entryResource);
  }
  // Entry author
  entry.authors = [];
  let nodesAuthor = nodeEntry.queryPathAll(xmlns.atom, "atom:author");
  for (const nodeAuthor of nodesAuthor) {
    let entryAuthor = {};
    let nodeAuthorName = nodeAuthor.queryPath(xmlns.atom, "atom:name");
    let nodeAuthorUri = nodeAuthor.queryPath(xmlns.atom, "atom:uri");
    if (nodeAuthorName && nodeAuthorName.textContent) {
        entryAuthor.name = nodeAuthorName.textContent;
    } else {
        continue;
    }
    if (nodeAuthorUri) {
        entryAuthor.uri = nodeAuthorUri.textContent;
    }
    entry.authors.push(entryAuthor);
  }
  // Entry category
  entry.categories = [];
  let nodesCategory = nodeEntry.queryPathAll(xmlns.atom, "atom:category");
  for (const nodeCategory of nodesCategory) {
    let entryCategory = {};
    entryCategory.label = nodeCategory.getAttribute("label");
    entryCategory.term = nodeCategory.getAttribute("term");
    entryCategory.scheme = nodeCategory.getAttribute("scheme");
    if (!entryCategory.label && !entryCategory.term) {
        continue;
    }
    entry.categories.push(entryCategory);
  }
  feed.entries = [];
  feed.entries.push(entry);
}

function extractAtomSyndicationFormat(xmlFile, feed) {
  let nodeFeed = xmlFile.queryPath(xmlns.atom, "atom:feed");
  let nodeLinkNext = nodeFeed.queryPath(xmlns.atom, "atom:link[@rel='next']");
  let nodeLinkPrevious = nodeFeed.queryPath(xmlns.atom, "atom:link[@rel='previous']");
  feed.next = {};
  feed.prev = {};
  if (nodeLinkNext) {
    feed.next.href = nodeLinkNext.getAttribute("href");
    feed.next.title = nodeLinkNext.getAttribute("title");
  }
  if (nodeLinkPrevious) {
    feed.prev.href = nodeLinkPrevious.getAttribute("href");
    feed.prev.title = nodeLinkPrevious.getAttribute("title");
  }
  if (enableIcon) {
    let iconPath = nodeFeed.queryPath(xmlns.atom, "atom:icon");
    if (iconPath) {
      feed.icon = iconPath.textContent;
    }
    let logoPath = nodeFeed.queryPath(xmlns.atom, "atom:logo");
    if (logoPath) {
      feed.logo = logoPath.textContent;
    }
  }
  let nodeLinkAlt = nodeFeed.queryPath(xmlns.atom, "atom:link[@rel='alternate']");
  if (nodeLinkAlt) {
    feed.link = nodeLinkAlt.getAttribute("href");
  }
  let nodeTitle = nodeFeed.queryPath(xmlns.atom, "atom:title");
  if (nodeTitle) {
    feed.title = nodeTitle.textContent;
  }
  if (nodeFeed.getAttribute("xml:lang")) {
    feed.language = nodeFeed.getAttribute("xml:lang");
  }
  let nodeLinkSelf = nodeFeed.queryPath(xmlns.atom, "atom:link[@rel='self']");
  if (nodeLinkSelf) {
    feed.self = nodeLinkSelf.getAttribute("href");
  }
  if (nodeFeed.getAttribute("xml:base")) {
    feed.base = nodeFeed.getAttribute("xml:base");
  } else {
    feed.base = feed.self;
  }
  let nodeSubtitle = nodeFeed.queryPath(xmlns.atom, "atom:subtitle");
  if (nodeSubtitle) {
    feed.subtitle = nodeSubtitle.textContent;
  }
  // https://trung.fun/atom.en.xml
  // atom:summary[parent::atom:feed]
  let nodeSummary = nodeFeed.queryPath(xmlns.atom, "atom:summary");
  if (nodeSummary) {
    feed.summary = nodeSummary.textContent;
  }
  let nodeUpdated = nodeFeed.queryPath(xmlns.atom, "atom:updated");
  if (nodeUpdated) {
    feed.date = nodeUpdated.textContent;
  }
  let nodeGenerator = nodeFeed.queryPath(xmlns.atom, "atom:generator");
  if (nodeGenerator) {
    feed.generator.name = nodeGenerator.textContent;
    feed.generator.uri = nodeGenerator.getAttribute("uri");
    feed.generator.version = nodeGenerator.getAttribute("version");
  }
  let nodesEntry = nodeFeed.queryPathAll(xmlns.atom, "atom:entry");
  feed.count = nodesEntry.length;
  if (feed.count) {
    feed.entries = [];
    let numberOfArticles = 0, numberOfArticlesBlacklisted = 0;
    for (let nodeEntry of nodesEntry) {
      let entry = {};
      entry.content = {};
      entry.summary = {};
      // Entry date
      let nodeUpdated = nodeEntry.queryPath(xmlns.atom, "atom:updated");
      let nodePublished = nodeEntry.queryPath(xmlns.atom, "atom:published");
      if (nodeUpdated && nodeUpdated.textContent) {
        entry.date = nodeUpdated.textContent;
      } else
      if (nodePublished && nodePublished.textContent) {
        entry.date = nodePublished.textContent;
      }
      // Entry identifier
      let nodeId = nodeEntry.queryPath(xmlns.atom, "atom:id");
      if (nodeId && nodeId.textContent) {
        entry.id = nodeId.textContent;
      }
      // Entry title
      let nodeTitle = nodeEntry.queryPath(xmlns.atom, "atom:title");
      if (nodeTitle && nodeTitle.textContent.trim()) {
        entry.title = nodeTitle.textContent;
      }
      // Entry link
      let nodeLink = nodeEntry.queryPath(xmlns.atom, "atom:link");
      if (nodeLink && nodeLink.getAttribute("href")) {
        // TODO Add an option to configure preferred type (e.g. Atom) and href (e.g. XMPP).
        if (nodeEntry.queryPath(xmlns.atom, "atom:link[@rel='alternate' and contains(@href,'http')]")) {
          entry.link = nodeEntry.queryPath(xmlns.atom, "atom:link[@rel='alternate' and contains(@href,'http')]").getAttribute("href");
        } else {
          entry.link = nodeEntry.queryPath(xmlns.atom, "atom:link").getAttribute("href");
        }
      }
      //if (getHomeLink(xmlFile, xmlRules)) {
      //  entry.link = getHomeLink(xmlFile, xmlRules);
      //}
      // Entry content
      let nodeContent = nodeEntry.queryPath(xmlns.atom, "atom:content");
      let nodeSummary = nodeEntry.queryPath(xmlns.atom, "atom:summary");
      let nodeContentXhtml = nodeEntry.queryPath(xmlns.xhtml, "xhtml:content");
      let nodeSummaryXhtml = nodeEntry.queryPath(xmlns.xhtml, "xhtml:summary");
      if (nodeContentXhtml && nodeContentXhtml.textContent) {
        entry.content.text = nodeContentXhtml.innerHTML;
        entry.content.type = "html";
      } else
      if (nodeContent && nodeContent.textContent) {
        if (nodeContent.childElementCount) {
          entry.content.text = nodeContent.innerHTML;
        } else {
          entry.content.text = nodeContent.textContent;
        }
        if (nodeContent.getAttribute("type") &&
            nodeContent.getAttribute("type").includes("html")) {
          entry.content.type = "html";
        }
      }
      if (nodeSummaryXhtml && nodeSummaryXhtml.textContent) {
        entry.summary.text = nodeSummaryXhtml.innerHTML;
        entry.summary.type = "html";
      } else
      if (nodeSummary && nodeSummary.textContent) {
        if (nodeSummary.childElementCount) {
          entry.summary.text = nodeSummary.innerHTML;
        } else {
          entry.summary.text = nodeSummary.textContent;
        }
        if (nodeSummary.getAttribute("type") &&
            nodeSummary.getAttribute("type").includes("html")) {
          entry.summary.type = "html";
        }
      }
      // Entry enclosures
      if (enableEnclosure) {
        entry.enclosures = [];
        // FIXME XPath
        let nodesLinkEnclosure = nodeEntry.queryPathAll(xmlns.atom, "atom:link[@rel='enclosure' or @rel='image' or @rel='magnet' or @rel='photo' or @rel='preview']");
        for (const enclosure of nodesLinkEnclosure) {
          let entryEnclosure = {};
          if (enclosure.getAttribute("type")) {
            entryEnclosure.type = enclosure.getAttribute("type");
          } else {
            entryEnclosure.type = "";
          }
          if (enclosure.getAttribute("title")) {
            entryEnclosure.title = enclosure.getAttribute("title");
          }
          if (enclosure.getAttribute("length")) {
            entryEnclosure.length = enclosure.getAttribute("length");
          }
          // atom https://tomosnowbug.hatenablog.com/feed
          if (enclosure.getAttribute("href")) {
            entryEnclosure.uri = enclosure.getAttribute("href");
            entryEnclosure.filename = extractEnclosureFilename(entryEnclosure.uri.trim());
          }
          entry.enclosures.push(entryEnclosure);
        }
      }
      // Entry related
      entry.resources = [];
      // FIXME XPath
      let nodesLinkRelated = nodeEntry.queryPathAll(xmlns.atom, "atom:link[@rel='related']");
      for (const related of nodesLinkRelated) {
        let entryResource = {};
        if (related.getAttribute("type")) {
          entryResource.type = related.getAttribute("type");
        } else {
          entryResource.type = "";
        }
        if (related.getAttribute("title")) {
          entryResource.title = related.getAttribute("title");
        }
        if (related.getAttribute("href")) {
          entryResource.uri = related.getAttribute("href");
        }
        entry.resources.push(entryResource);
      }
      // Entry author
      entry.authors = [];
      let nodesAuthor = nodeEntry.queryPathAll(xmlns.atom, "atom:author");
      for (const nodeAuthor of nodesAuthor) {
        let entryAuthor = {};
        let nodeAuthorName = nodeAuthor.queryPath(xmlns.atom, "atom:name");
        let nodeAuthorUri = nodeAuthor.queryPath(xmlns.atom, "atom:uri");
        if (nodeAuthorName && nodeAuthorName.textContent) {
            entryAuthor.name = nodeAuthorName.textContent;
        } else {
            continue;
        }
        if (nodeAuthorUri) {
            entryAuthor.uri = nodeAuthorUri.textContent;
        }
        entry.authors.push(entryAuthor);
      }
      // Entry category
      entry.categories = [];
      let nodesCategory = nodeEntry.queryPathAll(xmlns.atom, "atom:category");
      for (const nodeCategory of nodesCategory) {
        let entryCategory = {};
        entryCategory.label = nodeCategory.getAttribute("label");
        entryCategory.term = nodeCategory.getAttribute("term");
        entryCategory.scheme = nodeCategory.getAttribute("scheme");
        if (!entryCategory.label && !entryCategory.term) {
            continue;
        }
        entry.categories.push(entryCategory);
      }
      let entryContent;
      entryContent = entry.content.text + " " + entry.summary.text + " " + entry.title + " " + entry.subtitle;
      entryContent = entryContent.toLowerCase();
      entry.blacklisted = false;
      entry.whitelisted = false;
      if (filterBlacklist && keywordsBlacklist) {
        if (filterWhitelist) {
          entry.whitelisted = isListed(entryContent, keywordsWhitelist);
        }
        if (!entry.whitelisted) {
          entry.blacklisted = isListed(entryContent, keywordsBlacklist);
        }
      }
      feed.entries.push(entry);
      if (entry.blacklisted) {
        numberOfArticlesBlacklisted += 1;
      }
      numberOfArticles += 1;
      let numberOfArticlesToDisplay = numberOfArticles - numberOfArticlesBlacklisted;
      if (
        numberOfArticlesToDisplay > minimumItemNumber &&
        numberOfArticlesToDisplay < feed.count &&
        !ignoreMinimumItemNumber
         ) {
        break;
      }
    }
  }
}

// http://dpawson.co.uk/relaxng/atom03/atom.xml
function extractAtomSyndicationFormat03(xmlFile, feed) {
  let nodeFeed = xmlFile.queryPath(xmlns.atom03, "atom03:feed");
  let nodeLinkNext = nodeFeed.queryPath(xmlns.atom03, "atom03:link[@rel='next']");
  let nodeLinkPrevious = nodeFeed.queryPath(xmlns.atom03, "atom03:link[@rel='previous']");
  feed.next = {};
  feed.prev = {};
  if (nodeLinkNext) {
    feed.next.href = nodeLinkNext.getAttribute("href");
    feed.next.title = nodeLinkNext.getAttribute("title");
  }
  if (nodeLinkPrevious) {
    feed.prev.href = nodeLinkPrevious.getAttribute("href");
    feed.prev.title = nodeLinkPrevious.getAttribute("title");
  }
  let nodeLinkAlt = nodeFeed.queryPath(xmlns.atom03, "atom03:link[@rel='alternate']");
  if (nodeLinkAlt) {
    feed.link = nodeLinkAlt.getAttribute("href");
  }
  let nodeTitle = nodeFeed.queryPath(xmlns.atom03, "atom03:title");
  if (nodeTitle) {
    feed.title = nodeTitle.textContent;
  }
  if (nodeFeed.getAttribute("xml:lang")) {
    feed.language = nodeFeed.getAttribute("xml:lang");
  }
  let nodeLinkSelf = nodeFeed.queryPath(xmlns.atom03, "atom03:link[@rel='self']");
  if (nodeLinkSelf) {
    feed.self = nodeLinkSelf.getAttribute("href");
  }
  if (nodeFeed.getAttribute("xml:base")) {
    feed.base = nodeFeed.getAttribute("xml:base");
  } else {
    feed.base = feed.self;
  }
  let nodeSubtitle = nodeFeed.queryPath(xmlns.atom03, "atom03:tagline");
  if (nodeSubtitle) {
    feed.subtitle = nodeSubtitle.textContent;
  }
  let nodeInfo = nodeFeed.queryPath(xmlns.atom03, "atom03:info");
  if (nodeInfo) {
    feed.summary = nodeInfo.textContent;
  }
  let nodeModified = nodeFeed.queryPath(xmlns.atom03, "atom03:modified");
  if (nodeModified) {
    feed.date = nodeModified.textContent;
  }
  let nodeGenerator = nodeFeed.queryPath(xmlns.atom03, "atom03:generator");
  if (nodeGenerator) {
    feed.generator.name = nodeGenerator.textContent;
    feed.generator.uri = nodeGenerator.getAttribute("uri");
    feed.generator.version = nodeGenerator.getAttribute("version");
  }
  let nodesEntry = nodeFeed.queryPathAll(xmlns.atom03, "atom03:entry");
  feed.count = nodesEntry.length;
  if (feed.count) {
    feed.entries = [];
    let numberOfArticles = 0, numberOfArticlesBlacklisted = 0;
    for (let nodeEntry of nodesEntry) {
      let entry = {};
      entry.content = {};
      entry.summary = {};
      // Entry date
      let nodeCreated = nodeEntry.queryPath(xmlns.atom03, "atom03:created");
      let nodeModified = nodeEntry.queryPath(xmlns.atom03, "atom03:modified");
      let nodeIssued = nodeEntry.queryPath(xmlns.atom03, "atom03:issued");
      if (nodeModified && nodeModified.textContent) {
        entry.date = nodeModified.textContent;
      } else
      if (nodeIssued && nodeIssued.textContent) {
        entry.date = nodeIssued.textContent;
      } else
      if (nodeCreated && nodeCreated.textContent) {
        entry.date = nodeCreated.textContent;
      }
      // Entry identifier
      let nodeId = nodeEntry.queryPath(xmlns.atom03, "atom03:id");
      if (nodeId && nodeId.textContent) {
        entry.id = nodeId.textContent;
      }
      // Entry title
      let nodeTitle = nodeEntry.queryPath(xmlns.atom03, "atom03:title");
      if (nodeTitle && nodeTitle.textContent.trim()) {
        entry.title = nodeTitle.textContent;
      }
      // Entry link
      let nodeLink = nodeEntry.queryPath(xmlns.atom03, "atom03:link");
      if (nodeLink && nodeLink.getAttribute("href")) {
        // TODO Add an option to configure preferred type (e.g. Atom) and href (e.g. XMPP).
        if (nodeEntry.queryPath(xmlns.atom03, "atom03:link[@rel='alternate' and contains(@href,'http')]")) {
          entry.link = nodeEntry.queryPath(xmlns.atom03, "atom03:link[@rel='alternate' and contains(@href,'http')]").getAttribute("href");
        } else {
          entry.link = nodeEntry.queryPath(xmlns.atom03, "atom03:link").getAttribute("href");
        }
      }
      //if (getHomeLink(xmlFile, xmlRules)) {
      //  entry.link = getHomeLink(xmlFile, xmlRules);
      //}
      // Entry content
      let nodeContent = nodeEntry.queryPath(xmlns.atom03, "atom03:content");
      let nodeSummary = nodeEntry.queryPath(xmlns.atom03, "atom03:summary");
      let nodeContentXhtml = nodeEntry.queryPath(xmlns.xhtml, "xhtml:content");
      let nodeSummaryXhtml = nodeEntry.queryPath(xmlns.xhtml, "xhtml:summary");
      if (nodeContentXhtml && nodeContentXhtml.textContent) {
        entry.content.text = nodeContentXhtml.innerHTML;
        entry.content.type = "html";
      } else
      if (nodeContent && nodeContent.textContent) {
        if (nodeContent.childElementCount) {
          entry.content.text = nodeContent.innerHTML;
        } else {
          entry.content.text = nodeContent.textContent;
        }
        if (nodeContent.getAttribute("type") &&
            nodeContent.getAttribute("type").includes("html")) {
          entry.content.type = "html";
        }
      }
      if (nodeSummaryXhtml && nodeSummaryXhtml.textContent) {
        entry.summary.text = nodeSummaryXhtml.innerHTML;
        entry.summary.type = "html";
      } else
      if (nodeSummary && nodeSummary.textContent) {
        if (nodeSummary.childElementCount) {
          entry.summary.text = nodeSummary.innerHTML;
        } else {
          entry.summary.text = nodeSummary.textContent;
        }
        if (nodeSummary.getAttribute("type") &&
            nodeSummary.getAttribute("type").includes("html")) {
          entry.summary.type = "html";
        }
      }
      // Entry enclosures
      if (enableEnclosure) {
        entry.enclosures = [];
        // FIXME XPath
        let nodesLinkEnclosure = nodeEntry.queryPathAll(xmlns.atom03, "atom03:link[@rel='enclosure' or @rel='image' or @rel='magnet' or @rel='photo' or @rel='preview']");
        for (const enclosure of nodesLinkEnclosure) {
          let entryEnclosure = {};
          if (enclosure.getAttribute("type")) {
            entryEnclosure.type = enclosure.getAttribute("type");
          } else {
            entryEnclosure.type = "";
          }
          if (enclosure.getAttribute("title")) {
            entryEnclosure.title = enclosure.getAttribute("title");
          }
          if (enclosure.getAttribute("length")) {
            entryEnclosure.length = enclosure.getAttribute("length");
          }
          // atom https://tomosnowbug.hatenablog.com/feed
          if (enclosure.getAttribute("href")) {
            entryEnclosure.uri = enclosure.getAttribute("href");
            entryEnclosure.filename = extractEnclosureFilename(entryEnclosure.uri.trim());
          }
          entry.enclosures.push(entryEnclosure);
        }
      }
      // Entry related
      entry.resources = [];
      // FIXME XPath
      let nodesLinkRelated = nodeEntry.queryPathAll(xmlns.atom03, "atom03:link[@rel='related']");
      for (const related of nodesLinkRelated) {
        let entryResource = {};
        if (related.getAttribute("type")) {
          entryResource.type = related.getAttribute("type");
        } else {
          entryResource.type = "";
        }
        if (related.getAttribute("title")) {
          entryResource.title = related.getAttribute("title");
        }
        if (related.getAttribute("href")) {
          entryResource.uri = related.getAttribute("href");
        }
        entry.resources.push(entryResource);
      }
      // Entry author
      entry.authors = [];
      let nodesAuthor = nodeEntry.queryPathAll(xmlns.atom03, "atom03:author");
      for (const nodeAuthor of nodesAuthor) {
        let entryAuthor = {};
        let nodeAuthorName = nodeAuthor.queryPath(xmlns.atom03, "atom03:name");
        let nodeAuthorUri = nodeAuthor.queryPath(xmlns.atom03, "atom03:uri");
        if (nodeAuthorName && nodeAuthorName.textContent) {
            entryAuthor.name = nodeAuthorName.textContent;
        } else {
            continue;
        }
        if (nodeAuthorUri) {
            entryAuthor.uri = nodeAuthorUri.textContent;
        }
        entry.authors.push(entryAuthor);
      }
      // Entry category
      entry.categories = [];
      let nodesCategory = nodeEntry.queryPathAll(xmlns.atom03, "atom03:category");
      for (const nodeCategory of nodesCategory) {
        let entryCategory = {};
        entryCategory.label = nodeCategory.getAttribute("label");
        entryCategory.term = nodeCategory.getAttribute("term");
        entryCategory.scheme = nodeCategory.getAttribute("scheme");
        if (!entryCategory.label && !entryCategory.term) {
            continue;
        }
        entry.categories.push(entryCategory);
      }
      let entryContent;
      entryContent = entry.content.text + " " + entry.summary.text + " " + entry.title + " " + entry.subtitle;
      entryContent = entryContent.toLowerCase();
      entry.blacklisted = false;
      entry.whitelisted = false;
      if (filterBlacklist && keywordsBlacklist) {
        if (filterWhitelist) {
          entry.whitelisted = isListed(entryContent, keywordsWhitelist);
        }
        if (!entry.whitelisted) {
          entry.blacklisted = isListed(entryContent, keywordsBlacklist);
        }
      }
      feed.entries.push(entry);
      if (entry.blacklisted) {
        numberOfArticlesBlacklisted += 1;
      }
      numberOfArticles += 1;
      let numberOfArticlesToDisplay = numberOfArticles - numberOfArticlesBlacklisted;
      if (
        numberOfArticlesToDisplay > minimumItemNumber &&
        numberOfArticlesToDisplay < feed.count &&
        !ignoreMinimumItemNumber
         ) {
        break;
      }
    }
  }
}

function extractFoaf(xmlFile, feed) {
  let nodeRdf = xmlFile.queryPath(xmlns.rdf, "rdf:RDF");
  let nodeGroup = nodeRdf.queryPath(xmlns.foaf, "foaf:Group");
  let nodeTitle = nodeGroup.queryPath(xmlns.foaf, "foaf:name");
  if (nodeTitle) {
    feed.title = nodeTitle.textContent;
  }
  let nodeLink = nodeGroup.queryPath(xmlns.foaf, "foaf:homepage");
  if (nodeLink) {
    feed.link = nodeLink.textContent;
  }
  let nodeSeeAlso = nodeGroup.queryPath(xmlns.rdfs, "rdfs:seeAlso");
  if (nodeSeeAlso) {
    feed.alternate = nodeSeeAlso.getAttribute("rdf:resource");;
  }
  let nodesMember = nodeGroup.queryPathAll(xmlns.foaf, "foaf:member");
  feed.count = nodesMember.length;
  if (feed.count) {
    feed.entries = [];
    let numberOfArticles = 0, numberOfArticlesBlacklisted = 0;
    for (const nodeMember of nodesMember) {
      let entry = {};
      entry.summary = {};
      let nodeAgent = nodeMember.queryPath(xmlns.foaf, "foaf:Agent");
      let nodeWeblog = nodeAgent.queryPath(xmlns.foaf, "foaf:weblog");
      let nodeDocument = nodeWeblog.queryPath(xmlns.foaf, "foaf:Document");
      // Entry title
      let nodeName = nodeAgent.queryPath(xmlns.foaf, "foaf:name");
      if (nodeName && nodeName.textContent.trim()) {
        entry.title = nodeName.textContent;
      }
      // Entry link
      let nodeSeeAlso = nodeDocument.queryPath(xmlns.rdfs, "rdfs:seeAlso");
      let nodeChannel = nodeSeeAlso.queryPath(xmlns.rss, "rss:channel");
      if (nodeChannel && nodeChannel.getAttribute("rdf:about")) {
        entry.link = nodeChannel.getAttribute("rdf:about");
      } else
      if (nodeDocument && nodeDocument.getAttribute("rdf:about")) {
        entry.link = nodeDocument.getAttribute("rdf:about");
      }
      // Entry content
      let nodeTitle = nodeDocument.queryPath(xmlns.dc, "dc:title");
      if (nodeTitle && nodeTitle.textContent.trim()) {
        entry.summary.text = nodeTitle.textContent;
        entry.summary.type = "text";
      }
      // TODO Entry attachments
      // TODO Entry author
      let entryContent;
      entryContent = entry.summary.text + " " + entry.title + " " + entry.link;
      entryContent = entryContent.toLowerCase();
      entry.blacklisted = false;
      entry.whitelisted = false;
      if (filterBlacklist && keywordsBlacklist) {
        if (filterWhitelist) {
          entry.whitelisted = isListed(entryContent, keywordsWhitelist);
        }
        if (!entry.whitelisted) {
          entry.blacklisted = isListed(entryContent, keywordsBlacklist);
        }
      }
      feed.entries.push(entry);
      if (entry.whitelisted) {
        numberOfArticlesBlacklisted += 1;
      }
      numberOfArticles += 1;
      let numberOfArticlesToDisplay = numberOfArticles - numberOfArticlesBlacklisted;
      if (
        numberOfArticlesToDisplay > minimumItemNumber &&
        numberOfArticlesToDisplay < feed.count &&
        !ignoreMinimumItemNumber
         ) {
        break;
      }
    }
  }
}

// https://bohwaz.net/videos/?feed
function extractRdfSiteSummary(xmlFile, feed) {
  let nodeRdf = xmlFile.queryPath(xmlns.rdf, "rdf:RDF");
  let nodeChannel = nodeRdf.queryPath(xmlns.rss, "rss:channel");
  if (enableIcon) {
    let nodeImage = nodeChannel.queryPath(xmlns.rss, "rss:image");
    if (nodeImage) {
      feed.icon = nodeImage.getAttribute("rdf:resource");
    }
  }
  let nodeTitle = nodeChannel.queryPath(xmlns.rss, "rss:title");
  if (nodeTitle) {
    feed.title = nodeTitle.textContent;
  }
  //let nodeLanguage = nodeChannel.queryPath(xmlns.rss, "rss:language");
  //if (nodeLanguage) {
  //  feed.language = nodeLanguage.textContent;
  //}
  let nodeDescription = nodeChannel.queryPath(xmlns.rss, "rss:description");
  if (nodeDescription) {
    feed.subtitle = nodeDescription.textContent;
  }
  let nodesItem = nodeRdf.queryPathAll(xmlns.rss, "rss:item");
  feed.count = nodesItem.length;
  if (feed.count) {
    feed.entries = [];
    let numberOfArticles = 0, numberOfArticlesBlacklisted = 0;
    for (const nodeItem of nodesItem) {
      let entry = {};
      entry.content = {};
      entry.summary = {};
      // Entry date
      let nodeDate = nodeItem.queryPath(xmlns.dc, "dc:date");
      if (nodeDate) {
        entry.date = nodeDate.textContent;
      }
      // Entry title
      let nodeTitle = nodeItem.queryPath(xmlns.rss, "rss:title");
      if (nodeTitle && nodeTitle.textContent.trim()) {
        entry.title = nodeTitle.textContent;
      } else
      if (entry.date) {
        let dateAsTitle = new Date(entry.date);
        entry.title = dateAsTitle.toDateString();
      }
      // Entry link
      let nodeLink = nodeItem.queryPath(xmlns.rss, "rss:link");
      if (nodeLink && nodeLink.textContent) {
        // FIXME Ignore whitespace
        // https://handheldgameconsoles.com/f.atom
        entry.link = nodeLink.textContent;
      }
      //if (getHomeLink(xmlFile, xmlRules)) {
      //  entry.link = getHomeLink(xmlFile, xmlRules);
      //}
      // Entry content
      let nodeDescription = nodeItem.queryPath(xmlns.rss, "rss:description");
      let nodeContentEncoded = nodeItem.queryPath(xmlns.content, "content:encoded");
      if (nodeContentEncoded && nodeContentEncoded.textContent) {
        entry.content.text = nodeContentEncoded.textContent;
        entry.content.type = "html";
      }
      if (nodeDescription && nodeDescription.textContent) {
        entry.summary.text = nodeDescription.textContent;
        entry.summary.type = "html";
      }
      // Entry enclosures (media)
      entry.enclosures = [];
      let nodesMediaContent = nodeItem.queryPathAll(xmlns.mrss, "mrss:content");
      for (const media of nodesMediaContent) {
        let entryMedia = {};
        if (media.getAttribute("type")) {
          entryMedia.type = media.getAttribute("type");
        } else
        if (media.getAttribute("medium")) {
          entryMedia.type = media.getAttribute("medium");
        }
        if (media.getAttribute("url")) {
          mediaUrl = media.getAttribute("url");
          entryMedia.uri = mediaUrl;
          entryMedia.filename = mediaUrl.split("/").pop();
        }
        if (media.getAttribute("fileSize")) {
          entryMedia.length = media.getAttribute("fileSize");
        }
        entry.enclosures.push(entryMedia);
      }
      // Entry category
      entry.categories = [];
      let nodesCategory = nodeItem.queryPathAll(xmlns.mrss, "mrss:category");
      for (const nodeCategory of nodesCategory) {
        let entryCategory = {};
        entryCategory.label = nodeCategory.textContent;
        if (!entryCategory.label) {
            continue;
        }
        entryCategory.term = entryCategory.label.toLowerCase();
        //entryCategory.scheme = 
        entry.categories.push(entryCategory);
      }
      // Entry author
      entry.authors = [];
      let nodeAuthor = nodeItem.queryPath(xmlns.rss, "author");
      let nodePublisher = nodeItem.queryPath(xmlns.dc, "dc:creator|dc:publisher");
      if (nodeAuthor && nodeAuthor.textContent) {
        let entryAuthor = {};
        entryAuthor.name = nodeAuthor.textContent;
        entry.authors.push(entryAuthor);
      } else
      if (nodePublisher && nodePublisher.textContent) {
        let entryAuthor = {};
        entryAuthor.name = nodePublisher.textContent;
        entry.authors.push(entryAuthor);
      }
      let entryContent;
      entryContent = entry.summary.text + " " + entry.title + " " + entry.subtitle;
      entryContent = entryContent.toLowerCase();
      entry.blacklisted = false;
      entry.whitelisted = false;
      if (filterBlacklist && keywordsBlacklist) {
        if (filterWhitelist) {
          entry.whitelisted = isListed(entryContent, keywordsWhitelist);
        }
        if (!entry.whitelisted) {
          entry.blacklisted = isListed(entryContent, keywordsBlacklist);
        }
      }
      feed.entries.push(entry);
      if (entry.whitelisted) {
        numberOfArticlesBlacklisted += 1;
      }
      numberOfArticles += 1;
      let numberOfArticlesToDisplay = numberOfArticles - numberOfArticlesBlacklisted;
      if (
        numberOfArticlesToDisplay > minimumItemNumber &&
        numberOfArticlesToDisplay < feed.count &&
        !ignoreMinimumItemNumber
         ) {
        break;
      }
    }
  }
}

function extractRdfSiteSummary90(xmlFile, feed) {
  let nodeRdf = xmlFile.queryPath(xmlns.rdf, "rdf:RDF");
  if (enableIcon) {
    let nodeImageUrl = nodeRdf.queryPath(xmlns.rss09, "rss:image/rss:url");
    if (nodeImageUrl) {
      feed.icon = nodeImageUrl.textContent;
    }
  }
  let nodeChannel = nodeRdf.queryPath(xmlns.rss09, "rss:channel");
  let nodeTitle = nodeChannel.queryPath(xmlns.rss09, "rss:title");
  if (nodeTitle) {
    feed.title = nodeTitle.textContent;
  }
  //let nodeLanguage = nodeChannel.queryPath(xmlns.rss09, "rss:language");
  //if (nodeLanguage) {
  //  feed.language = nodeLanguage.textContent;
  //}
  let nodeDescription = nodeChannel.queryPath(xmlns.rss09, "rss:description");
  if (nodeDescription) {
    feed.subtitle = nodeDescription.textContent;
  }
  let nodesItem = nodeRdf.queryPathAll(xmlns.rss09, "rss:item");
  feed.count = nodesItem.length;
  if (feed.count) {
    feed.entries = [];
    let numberOfArticles = 0, numberOfArticlesBlacklisted = 0;
    for (const nodeItem of nodesItem) {
      let entry = {};
      entry.summary = {};
      // Entry title
      let nodeTitle = nodeItem.queryPath(xmlns.rss09, "rss:title");
      if (nodeTitle && nodeTitle.textContent.trim()) {
        entry.title = nodeTitle.textContent;
      } else
      if (entry.date) {
        let dateAsTitle = new Date(entry.date);
        entry.title = dateAsTitle.toDateString();
      }
      // Entry link
      let nodeLink = nodeItem.queryPath(xmlns.rss09, "rss:link");
      if (nodeLink && nodeLink.textContent) {
        // FIXME Ignore whitespace
        // https://handheldgameconsoles.com/f.atom
        entry.link = nodeLink.textContent;
      }
      //if (getHomeLink(xmlFile, xmlRules)) {
      //  entry.link = getHomeLink(xmlFile, xmlRules);
      //}
      // Entry content
      let nodeDescription = nodeItem.queryPath(xmlns.rss09, "rss:description");
      if (nodeDescription) {
        entry.summary.text = nodeDescription.innerHTML;
        entry.summary.type = "html";
      }
      let entryContent;
      entryContent = entry.summary.text + " " + entry.title + " " + entry.subtitle;
      entryContent = entryContent.toLowerCase();
      entry.blacklisted = false;
      entry.whitelisted = false;
      if (filterBlacklist && keywordsBlacklist) {
        if (filterWhitelist) {
          entry.whitelisted = isListed(entryContent, keywordsWhitelist);
        }
        if (!entry.whitelisted) {
          entry.blacklisted = isListed(entryContent, keywordsBlacklist);
        }
      }
      feed.entries.push(entry);
      if (entry.whitelisted) {
        numberOfArticlesBlacklisted += 1;
      }
      numberOfArticles += 1;
      let numberOfArticlesToDisplay = numberOfArticles - numberOfArticlesBlacklisted;
      if (
        numberOfArticlesToDisplay > minimumItemNumber &&
        numberOfArticlesToDisplay < feed.count &&
        !ignoreMinimumItemNumber
         ) {
        break;
      }
    }
  }
}

function extractRss(xmlFile, feed) {
  let nodeChannel = xmlFile.queryPath(null, "rss/channel");
  let nodeTitle = nodeChannel.queryPath(null, "title");
  if (nodeTitle) {
    feed.title = nodeTitle.textContent;
  }
  let nodeLanguage = nodeChannel.queryPath(null, "language");
  if (nodeLanguage) {
    feed.language = nodeLanguage.textContent;
  }
  let nodeLinkSelf = nodeChannel.queryPath(xmlns.atom, "atom:link[@rel='self']");
  if (nodeLinkSelf) {
    feed.self = nodeLinkSelf.getAttribute("href");
  }
  let nodeLink = nodeChannel.queryPath(null, "link");
  if (nodeLink) {
    feed.base = nodeLink.textContent;
    feed.link = nodeLink.textContent;
  } else {
    feed.base = feed.self;
    feed.link = feed.self;
  }
  let nodeDescription = nodeChannel.queryPath(null, "description");
  if (nodeDescription) {
    feed.subtitle = nodeDescription.textContent;
  }
  let nodePubDate = nodeChannel.queryPath(null, "pubDate");
  if (nodePubDate) {
    feed.date = nodePubDate.textContent;
  }
  if (!feed.date) {
    let nodeLastBuildDate = nodeChannel.queryPath(null, "lastBuildDate");
    if (nodeLastBuildDate) {
      feed.date = nodeLastBuildDate.textContent;
    }
  }
  let nodeGenerator = nodeChannel.queryPath(null, "generator");
  if (nodeGenerator) {
    feed.generator.name = nodeGenerator.textContent;
  }
  let nodeUpdatePeriod = nodeChannel.queryPath(xmlns.sy, "sy:updatePeriod");
  if (nodeUpdatePeriod) {
    feed.update.period = nodeUpdatePeriod.textContent;
  }
  let nodeUpdateFrequency = nodeChannel.queryPath(xmlns.sy, "sy:updateFrequency");
  if (nodeUpdateFrequency) {
    feed.update.frequency = nodeUpdateFrequency.textContent;
  }
  if (enableIcon) {
    let nodeImageUrl = nodeChannel.queryPath(null, "image/url");
    if (nodeImageUrl) {
      feed.logo = nodeImageUrl.textContent;
    }
    let nodeIcon = nodeChannel.queryPath(xmlns.webfeeds, "webfeeds:icon");
    if (nodeIcon) {
      feed.icon = nodeIcon.textContent;
    }
  }
  let nodesItem = nodeChannel.queryPathAll(null, "item");
  feed.count = nodesItem.length;
  if (feed.count) {
    feed.entries = [];
    let numberOfArticles = 0, numberOfArticlesBlacklisted = 0;
    for (const nodeItem of nodesItem) {
      let entry = {};
      entry.content = {};
      entry.summary = {};
      // Entry date
      let nodeDate = nodeItem.queryPath(xmlns.dc, "dc:date");
      let nodePubDate = nodeItem.queryPath(null, "pubDate");
      if (nodePubDate) {
        entry.date = nodePubDate.textContent;
      } else
      if (nodeDate) {
        entry.date = nodeDate.textContent;
      }
      // Entry title
      let nodeTitle = nodeItem.queryPath(null, "title");
      let nodeMrssTitle = nodeItem.queryPath(xmlns.mrss, "mrss:title");
      if (nodeTitle && nodeTitle.textContent.trim()) {
        entry.title = nodeTitle.textContent;
      } else
      if (nodeMrssTitle && nodeMrssTitle.textContent.trim()) {
        entry.title = nodeMrssTitle.textContent;
      }
      // Entry link
      let nodeLink = nodeItem.queryPath(null, "link");
      if (nodeLink && nodeLink.textContent) {
        // FIXME Ignore whitespace
        // https://handheldgameconsoles.com/f.atom
        entry.link = nodeLink.textContent;
      }
      //if (getHomeLink(xmlFile, xmlRules)) {
      //  entry.link = getHomeLink(xmlFile, xmlRules);
      //}
      // Entry content
      // https://agovernmentofwolves.com/feed/
      let nodeDescription = nodeItem.queryPath(null, "description");
      let nodeContentEncoded = nodeItem.queryPath(xmlns.content, "content:encoded");
      if (nodeContentEncoded && nodeContentEncoded.textContent) {
        entry.content.text = nodeContentEncoded.textContent;
        entry.content.type = "html";
      }
      if (nodeDescription && nodeDescription.textContent) {
        entry.summary.text = nodeDescription.textContent;
        entry.summary.type = "html";
      }
      let nodePeers = nodeItem.queryPath(xmlns.torrent, "torrent:peers");
      let nodeSeeds = nodeItem.queryPath(xmlns.torrent, "torrent:seeds");
      if (nodePeers && nodeSeeds) {
        entry.torrent = {};
        let filename,
            statusPeers = "Unknown",
            statusSeeds = "Unknown",
            statusVerified = "Not verified";
        let nodeVerified = nodeItem.queryPath(xmlns.torrent, "torrent:verified");
        let verified = nodeVerified.textContent;
        if (verified == "1") {
          statusVerified = "Verified";
        }
        let peers = nodePeers.textContent;
        if (peers) {
          statusPeers = peers;
        }
        let seeds = nodeSeeds.textContent;
        if (seeds) {
          statusSeeds = seeds;
        }
        entry.torrent.text = `Peers (${statusPeers}) Seeds (${statusSeeds}) ${statusVerified}.`;
        entry.torrent.type = "text";
      }
      // Entry chapters
      let nodeChapters = nodeItem.queryPath(xmlns.psc, "psc:chapters");
      if (nodeChapters) {
        let nodeChaptersChapter = nodeChapters.queryPathAll(xmlns.psc, "psc:chapter");
        if (nodeChaptersChapter.length) {
          entry.chapters = [];
          for (let nodeChapter of nodeChaptersChapter) {
            let chapter = {};
            chapter.image = nodeChapter.getAttribute("image");
            chapter.start = nodeChapter.getAttribute("start");
            chapter.title = nodeChapter.getAttribute("title");
            entry.chapters.push(chapter);
          }
        }
      }
      // Entry enclosures
      if (enableEnclosure) {
        entry.enclosures = [];
        let nodesEnclosure = nodeItem.queryPathAll(null, "enclosure");
        for (const nodeEnclosure of nodesEnclosure) {
          let entryEnclosure = {};
          if (nodeEnclosure.getAttribute("type")) {
            entryEnclosure.type = nodeEnclosure.getAttribute("type");
          } else {
            entryEnclosure.type = "";
          }
          // NOTE Check if there is an element enclosure with attribute title for RSS.
          if (nodeEnclosure.getAttribute("title")) {
            entryEnclosure.title = nodeEnclosure.getAttribute("title");
          }
          if (nodeEnclosure.getAttribute("length")) {
            entryEnclosure.length = nodeEnclosure.getAttribute("length");
          }
          if (nodeEnclosure.getAttribute("url")) {
            entryEnclosure.uri = nodeEnclosure.getAttribute("url");
            entryEnclosure.filename = extractEnclosureFilename(entryEnclosure.uri.trim());
          }
          entry.enclosures.push(entryEnclosure);
        }
        // Entry enclosures (media)
        let nodesMediaContent = nodeItem.queryPathAll(xmlns.mrss, "mrss:content");
        for (const media of nodesMediaContent) {
          let entryMedia = {};
          if (media.getAttribute("type")) {
            entryMedia.type = media.getAttribute("type");
          } else
          if (media.getAttribute("medium")) {
            entryMedia.type = media.getAttribute("medium");
          }
          if (media.getAttribute("url")) {
            mediaUrl = media.getAttribute("url");
            entryMedia.uri = mediaUrl;
            entryMedia.filename = mediaUrl.split("/").pop();
          }
          if (media.getAttribute("length")) {
            entryMedia.length = media.getAttribute("length");
          }
          entry.enclosures.push(entryMedia);
        }
        // Entry enclosures (image)
        let nodesImage = nodeItem.queryPathAll(xmlns.itunes, "itunes:image");
        for (const nodeMedia of nodesImage) {
          let entryImage = {};
          if (nodeMedia.getAttribute("href")) {
            mediaUri = nodeMedia.getAttribute("href");
            entryImage.uri = mediaUri;
            entryImage.filename = mediaUri.split("/").pop();
          }
          if (entryImage.filename.includes(".")) {
            let extension = entryImage.filename.split(".").pop();
            entryImage.type = "image/" + extension;
          }
          entry.enclosures.push(entryImage);
        }
        // Entry enclosures (torrent)
        let nodesTorrent = nodeItem.queryPathAll(xmlns.torrent, "torrent:torrent");
        for (const nodeTorrent of nodesTorrent) {
          let entryTorrent = {};
          let nodeMagnet = nodeTorrent.queryPath(xmlns.torrent, "torrent:magnetURI");
          let nodeContentLength = nodeTorrent.queryPath(xmlns.torrent, "torrent:contentLength");
          if (nodeContentLength) {
            entryTorrent.length = nodeContentLength.textContent;
          }
          if (nodeMagnet) {
            entryTorrent.uri = nodeMagnet.textContent.replace("&amp;", "&");
            entryTorrent.filename = extractEnclosureFilename(entryTorrent.uri);
          }
          if (!entryTorrent.filename) {
            let nodeInfoHash = nodeTorrent.queryPath(xmlns.torrent, "torrent:infoHash");
            if (nodeInfoHash) {
              entryTorrent.filename = nodeInfoHash.textContent;
            } else {
              entryTorrent.filename = "Untitled";
            }
          }
          entry.enclosures.push(entryTorrent);
        }
        // Entry enclosure (torrent)
        let nodeMagnet = nodeItem.queryPath(xmlns.torrent, "torrent:magnetURI");
        let nodeContentLength = nodeItem.queryPath(xmlns.torrent, "torrent:contentLength");
        let nodeFilename = nodeItem.queryPath(xmlns.torrent, "torrent:fileName");
        if (nodeMagnet) {
          let entryTorrent = {};
          entryTorrent.uri = nodeMagnet.textContent;
          entryTorrent.filename = nodeFilename.textContent;
          entryTorrent.length = nodeContentLength.textContent;
          if (entryTorrent.filename) {
            entryTorrent.filename = extractEnclosureFilename(nodeMagnet.textContent);
          }
          entryTorrent.title = entryTorrent.filename;
          entry.enclosures.push(entryTorrent);
        }
      }
      // Entry creator
      entry.authors = [];
      let nodesCreator = nodeItem.queryPathAll(xmlns.dc, "dc:creator|dc:publisher");
      for (const nodeAuthor of nodesCreator) {
        let entryAuthor = {};
        entryAuthor.name = nodeAuthor.textContent;
        entry.authors.push(entryAuthor);
      }
      let nodesAuthor = nodeItem.queryPathAll(null, "author");
      for (const nodeAuthor of nodesAuthor) {
        let entryAuthor = {};
        entryAuthor.name = nodeAuthor.textContent;
        entry.authors.push(entryAuthor);
      }
      let nodesAuthorI = nodeItem.queryPathAll(xmlns.itunes, "itunes:author");
      for (const nodeAuthorI of nodesAuthorI) {
        let entryAuthor = {};
        entryAuthor.name = nodeAuthorI.textContent;
        entry.authors.push(entryAuthor);
      }
      // Entry category
      entry.categories = [];
      let nodesCategory = nodeItem.queryPathAll(null, "category");
      for (const nodeCategory of nodesCategory) {
        let entryCategory = {};
        entryCategory.label = nodeCategory.textContent;
        if (!entryCategory.label) {
            continue;
        }
        entryCategory.term = entryCategory.label.toLowerCase();
        //entryCategory.scheme = 
        entry.categories.push(entryCategory);
      }
      let entryContent;
      entryContent = entry.content.text + " " + entry.summary.text + " " + entry.title + " " + entry.subtitle;
      entryContent = entryContent.toLowerCase();
      entry.blacklisted = false;
      entry.whitelisted = false;
      if (filterBlacklist && keywordsBlacklist) {
        if (filterWhitelist) {
          entry.whitelisted = isListed(entryContent, keywordsWhitelist);
        }
        if (!entry.whitelisted) {
          entry.blacklisted = isListed(entryContent, keywordsBlacklist);
        }
      }
      feed.entries.push(entry);
      if (entry.whitelisted) {
        numberOfArticlesBlacklisted += 1;
      }
      numberOfArticles += 1;
      let numberOfArticlesToDisplay = numberOfArticles - numberOfArticlesBlacklisted;
      if (
        numberOfArticlesToDisplay > minimumItemNumber &&
        numberOfArticlesToDisplay < feed.count &&
        !ignoreMinimumItemNumber
         ) {
        break;
      }
    }
  }
}

function extractSitemapIndex(xmlFile, feed) {
  let nodeSitemapIndex = xmlFile.queryPath(xmlns.sitemap, "sitemap:sitemapindex");
  let nodesSitemap = nodeSitemapIndex.queryPathAll(xmlns.sitemap, "sitemap:sitemap");
  feed.count = nodesSitemap.length;
  if (feed.count) {
    feed.entries = [];
    let numberOfArticles = 0, numberOfArticlesBlacklisted = 0;
    for (const nodeSitemap of nodesSitemap) {
      let entry = {};
      let nodeLoc = nodeSitemap.queryPath(xmlns.sitemap, "sitemap:loc");
      if (nodeLoc) {
        entry.link = nodeLoc.textContent;
        entry.title = nodeLoc.textContent;
      }
      let nodeLastmod = nodeSitemap.queryPath(xmlns.sitemap, "sitemap:lastmod");
      if (nodeLastmod) {
        entry.date = nodeLastmod.textContent;
      }
      let entryContent;
      entryContent = entry.title;
      entryContent = entryContent.toLowerCase();
      entry.blacklisted = false;
      entry.whitelisted = false;
      if (filterBlacklist && keywordsBlacklist) {
        if (filterWhitelist) {
          entry.whitelisted = isListed(entryContent, keywordsWhitelist);
        }
        if (!entry.whitelisted) {
          entry.blacklisted = isListed(entryContent, keywordsBlacklist);
        }
      }
      feed.entries.push(entry);
      if (entry.whitelisted) {
        numberOfArticlesBlacklisted += 1;
      }
      numberOfArticles += 1;
      let numberOfArticlesToDisplay = numberOfArticles - numberOfArticlesBlacklisted;
      if (
        numberOfArticlesToDisplay > minimumItemNumber &&
        numberOfArticlesToDisplay < feed.count &&
        !ignoreMinimumItemNumber
         ) {
        break;
      }
    }
  }
}

function extractSitemapUrlset(xmlFile, feed) {
  let nodeUrlset = xmlFile.queryPath(xmlns.sitemap, "sitemap:urlset");
  let nodesUrl = nodeUrlset.queryPathAll(xmlns.sitemap, "sitemap:url");
  feed.count = nodesUrl.length;
  if (feed.count) {
    feed.entries = [];
    let numberOfArticles = 0, numberOfArticlesBlacklisted = 0;
    for (const nodeUrl of nodesUrl) {
      let entry = {};
      let nodeLoc = nodeUrl.queryPath(xmlns.sitemap, "sitemap:loc");
      if (nodeLoc) {
        entry.link = nodeLoc.textContent;
        entry.title = nodeLoc.textContent;
      }
      let nodeLastmod = nodeUrl.queryPath(xmlns.sitemap, "sitemap:lastmod");
      if (nodeLastmod) {
        entry.date = nodeLastmod.textContent;
      }
      let entryContent;
      entryContent = entry.title;
      entryContent = entryContent.toLowerCase();
      entry.blacklisted = false;
      entry.whitelisted = false;
      if (filterBlacklist && keywordsBlacklist) {
        if (filterWhitelist) {
          entry.whitelisted = isListed(entryContent, keywordsWhitelist);
        }
        if (!entry.whitelisted) {
          entry.blacklisted = isListed(entryContent, keywordsBlacklist);
        }
      }
      feed.entries.push(entry);
      if (entry.whitelisted) {
        numberOfArticlesBlacklisted += 1;
      }
      numberOfArticles += 1;
      let numberOfArticlesToDisplay = numberOfArticles - numberOfArticlesBlacklisted;
      if (
        numberOfArticlesToDisplay > minimumItemNumber &&
        numberOfArticlesToDisplay < feed.count &&
        !ignoreMinimumItemNumber
         ) {
        break;
      }
    }
  }
}

function extractDoapXmpp(xmlFile, feed) {
  let nodeRdf = xmlFile.queryPath(xmlns.rdf, "rdf:RDF");
  let nodeProject = nodeRdf.queryPath(xmlns.doap, "doap:Project");
  if (enableIcon) {
    let logoPath = nodeProject.queryPath(xmlns.schema, "schema:logo");
    if (logoPath) {
      feed.logo = logoPath.getAttribute("rdf:resource");
    }
  }
  let nodeShortdesc = nodeProject.queryPath(xmlns.doap, "doap:shortdesc");
  if (nodeShortdesc) {
    feed.subtitle = nodeShortdesc.textContent;
  }
  let nodeName = nodeProject.queryPath(xmlns.doap, "doap:name");
  if (nodeName) {
    feed.title = nodeName.textContent;
  }
  let nodeDescription = nodeProject.queryPath(xmlns.doap, "doap:description");
  if (nodeDescription) {
    feed.summary = nodeDescription.textContent;
  }
  let nodeHomepage = nodeProject.queryPath(xmlns.doap, "doap:homepage");
  if (nodeHomepage) {
    feed.link = nodeHomepage.getAttribute("rdf:resource");
  }
  let nodesImplements = nodeProject.queryPathAll(xmlns.doap, "doap:implements");
  feed.count = nodesImplements.length;
  if (feed.count) {
    feed.entries = [];
    let numberOfArticles = 0, numberOfArticlesBlacklisted = 0;
    for (const nodeImplements of nodesImplements) {
      if (nodeImplements.children.length) {
        let entry = {};
        entry.summary = {};
        // Entry date
        let nodeSupportedXep = nodeImplements.queryPath(xmlns.xmpp, "xmpp:SupportedXep");
        let note, since, status, uri, version;
        if (nodeSupportedXep) {
          let nodeNote = nodeSupportedXep.queryPath(xmlns.xmpp, "xmpp:note");
          if (nodeNote) {
            note = nodeNote.textContent;
          }
          let nodeStatus = nodeSupportedXep.queryPath(xmlns.xmpp, "xmpp:status");
          if (nodeStatus) {
            status = nodeStatus.textContent;
          }
          let nodeSince = nodeSupportedXep.queryPath(xmlns.xmpp, "xmpp:since");
          if (nodeSince) {
            since = nodeSince.textContent;
          }
          let nodeVersion = nodeSupportedXep.queryPath(xmlns.xmpp, "xmpp:version");
          if (nodeVersion) {
            version = nodeVersion.textContent;
          }
          let nodeXep = nodeSupportedXep.queryPath(xmlns.xmpp, "xmpp:xep");
          if (nodeXep) {
            uri = nodeXep.getAttribute("rdf:resource");
          }
        }
        let uriSplit = uri.split("/");
        let base = uriSplit.pop();
        let xep = base.substring(4, base.indexOf("."));
        // Entry title
        //entry.title = `XEP-${xep}`;
        //entry.summary.text = `XEP-${xep} version ${version} is supported since version ${since}.\n\nStatus: ${status}`;
        entry.summary.type = "text";
        entry.summary.text = "";
        if (version) {
          entry.summary.text += `XEP version (${version}). `;
        }
        if (status) {
          entry.summary.text += `Scope of support is ${status}.`
        }
        if (since) {
          entry.summary.text += `\n\nSupported since ${feed.title} version ${since}.`;
        }
        let icon;
        if (status == "complete") {
          icon = "⊕"; // 🟢 ✽ ■ ☑ ●
        } else
        if (status == "partial") {
          icon = "⊖"; // 🟡 ✾ ▣ ☒ ◉ ⍻
        } else
        if (status == "deprecated") {
          icon = "⊗"; // 🔴 ✻ ▩ ☓ ◎ ⨂
        } else {
          icon = "⊚"; // ⚪ ✼ □ ☐ ○
        }
        if (note) {
          entry.summary.text += `\n\nNote: ${note}`;
          entry.title = `${icon} XEP-${xep} (${note})`;
        } else {
          entry.title = `${icon} XEP-${xep}`;
        }
        // Entry link
        entry.link = uri;
        let entryContent;
        entryContent = entry.summary.text + " " + entry.title;
        entryContent = entryContent.toLowerCase();
        entry.blacklisted = false;
        entry.whitelisted = false;
        if (filterBlacklist && keywordsBlacklist) {
          if (filterWhitelist) {
            entry.whitelisted = isListed(entryContent, keywordsWhitelist);
          }
          if (!entry.whitelisted) {
            entry.blacklisted = isListed(entryContent, keywordsBlacklist);
          }
        }
        feed.entries.push(entry);
        if (entry.whitelisted) {
          numberOfArticlesBlacklisted += 1;
        }
        numberOfArticles += 1;
        let numberOfArticlesToDisplay = numberOfArticles - numberOfArticlesBlacklisted;
        if (
          numberOfArticlesToDisplay > minimumItemNumber &&
          numberOfArticlesToDisplay < feed.count &&
          !ignoreMinimumItemNumber
          ) {
          break;
        }
      }
    }
  }
}

function extractSmf(xmlFile, feed) {
  let nodeFeed = xmlFile.queryPath(xmlns.smf, "smf:xml-feed");
  feed.date = nodeFeed.getAttribute("generated-date-UTC"); // generated-date-localized
  feed.subtitle = nodeFeed.getAttribute("description");
  //feed.subtitle = nodeFeed.getAttribute("about");
  feed.title = nodeFeed.getAttribute("forum-name");
  feed.language = nodeFeed.getAttribute("xml:lang");
  //feed.link = nodeFeed.getAttribute("forum-url");
  feed.version = nodeFeed.getAttribute("version");
  let nodesRecentPost = nodeFeed.queryPathAll(xmlns.smr, "smf:recent-post");
  feed.count = nodesRecentPost.length;
  if (feed.count) {
    feed.entries = [];
    let numberOfArticles = 0, numberOfArticlesBlacklisted = 0;
    for (const nodeRecentPost of nodesRecentPost) {
      let entry = {};
      entry.summary = {};
      // Entry date
      let nodeTime = nodeRecentPost.queryPath(xmlns.smr, "smf:time");
      if (nodeTime) {
        //entry.date = nodeTime.textContent;
        entry.date = nodeTime.getAttribute("UTC");
      } else {
        entry.date = nodeTime.textContent;
      }
      // Entry title
      let nodeSubject = nodeRecentPost.queryPath(xmlns.smr, "smf:subject");
      if (nodeSubject && nodeSubject.textContent.trim()) {
        // NOTE Perhaps HTML should be parsed.
        entry.title = nodeSubject.textContent;
      }
      // Entry link
      let nodeLink = nodeRecentPost.queryPath(xmlns.smr, "smf:link");
      if (nodeLink && nodeLink.textContent) {
        // FIXME Ignore whitespace
        // https://handheldgameconsoles.com/f.atom
        entry.link = nodeLink.textContent;
      }
      //if (getHomeLink(xmlFile, xmlRules)) {
      //  entry.link = getHomeLink(xmlFile, xmlRules);
      //}
      // Entry content
      let nodeBody = nodeRecentPost.queryPath(xmlns.smr, "smf:body");
      if (nodeBody) {
        entry.summary.text = nodeBody.innerHTML;
        entry.summary.type = "html";
      }
      // TODO Entry attachments
      entry.enclosures = [];
      // Entry author
      let nodePoster = nodeRecentPost.queryPath(xmlns.smr, "smf:poster");
      let nodeStarter = nodeRecentPost.queryPath(xmlns.smr, "smf:starter");
      if (nodePoster) {
        if (nodePoster.queryPath(xmlns.smr, "smf:name")) {
          entry.authors = [];
          let entryAuthor = {};
          entryAuthor.name = nodePoster.queryPath(xmlns.smr, "smf:name").textContent;
          entryAuthor.uri = nodePoster.queryPath(xmlns.smr, "smf:link").textContent;
          entry.authors.push(entryAuthor);
        }
      }
      if (nodeStarter) {
        if (nodeStarter.queryPath(xmlns.smr, "smf:name")) {
          entry.authors = [];
          let entryAuthor = {};
          entryAuthor.name = nodeStarter.queryPath(xmlns.smr, "smf:name").textContent;
          entryAuthor.uri = nodeStarter.queryPath(xmlns.smr, "smf:link").textContent;
          entry.authors.push(entryAuthor);
        }
      }
      let entryContent;
      entryContent = entry.summary.text + " " + entry.title + " " + entry.subtitle;
      entryContent = entryContent.toLowerCase();
      entry.blacklisted = false;
      entry.whitelisted = false;
      if (filterBlacklist && keywordsBlacklist) {
        if (filterWhitelist) {
          entry.whitelisted = isListed(entryContent, keywordsWhitelist);
        }
        if (!entry.whitelisted) {
          entry.blacklisted = isListed(entryContent, keywordsBlacklist);
        }
      }
      feed.entries.push(entry);
      if (entry.whitelisted) {
        numberOfArticlesBlacklisted += 1;
      }
      numberOfArticles += 1;
      let numberOfArticlesToDisplay = numberOfArticles - numberOfArticlesBlacklisted;
      if (
        numberOfArticlesToDisplay > minimumItemNumber &&
        numberOfArticlesToDisplay < feed.count &&
        !ignoreMinimumItemNumber
         ) {
        break;
      }
    }
  }
}

function renderDocument(feed) {
  let newDocument = createPage();
  if (!feed.title) {
    if (location.hostname) {
      feed.title = location.hostname;
    } else {
      feed.title = "An untitled document";
    }
  }
  if (feed.language) {
    newDocument.documentElement.setAttribute(
      "lang",
      feed.language
    );
  }
  newDocument.title = feed.title;
  let div = newDocument.createElement("div");
  div.id = "feed";
  let titlePage = newDocument.createElement("h1");
  titlePage.textContent = feed.title;
  titlePage.id = "title";
  div.append(titlePage);
  let subtitle = newDocument.createElement("h2");
  subtitle.textContent = feed.subtitle;
  subtitle.id = "subtitle";
  div.append(subtitle);
  let toc = newDocument.createElement("ol");
  toc.id = "toc";
  div.append(toc);
  if (feed.summary) {
    let elementSummary = newDocument.createElement("p");
    elementSummary.id = "summary";
    elementSummary.textContent = feed.summary;
    div.append(elementSummary);
  }
  let articles = newDocument.createElement("div");
  articles.id = "articles";
  div.append(articles);
  if (feed.entries && feed.entries.length) {
    for (const entry of feed.entries) {
      let index = Array.from(feed.entries).indexOf(entry) + 1;
      let titleToc = newDocument.createElement("a");
      if (!entry.title) {
      //if (!entry.title || entry.title && !entry.title.length) {
        if (entry.date) {
          let plainDate, plainText;
          if (entry.summary.text) {
            plainText = entry.summary.text;
          } else
          if (entry.content.text) {
            plainText = entry.content.text;
          } else
          if (entry.authors[0] && entry.authors[0].name) {
            plainText = entry.authors[0].name;
          } else {
            plainText = "No title";
          }
          plainText = plainText.replace(/(<([^>]+)>)/gi, "");
          if (feed.type.toLowerCase().includes("rdf") ||
              feed.type.toLowerCase().includes("rss")) {
            plainDate = entry.date.slice(0,16);
          } else {
            plainDate = entry.date.slice(0,10);
          }
          let dateText = `${plainDate} ${plainText}`;
          entry.title = dateText;
        } else {
          entry.title = "No title";
        }
      }
      //if (entry.title.includes("<") && entry.title.includes(">")) { // &lt; &gt;
      if (/<\/?[a-z][\s\S]*>/i.test(entry.title)) {
        //entry.title = domParser.parseFromString(entry.title, 'text/html').body.innerHTML;
        entry.title = entry.title.replace(/(<([^>]+)>)/gi, "");
      }
      //titleToc.textContent = entry.title;
      titleToc.innerHTML = entry.title;
      if (titleToc.textContent.length > 55) {
        titleToc.innerHTML = titleToc.textContent.slice(0,50) + "…";
      }
      titleToc.href = `#newspaper-oujs-${index}`;
      titleToc.title = entry.title;
      let liElement = newDocument.createElement("li");
      liElement.append(titleToc);
      //let article = newDocument.createElement("article");
      let article = newDocument.createElement("div");
      article.className = "entry";
      article.id = `newspaper-oujs-${index}`;
      let link = newDocument.createElement("a");
      //link.textContent = entry.title;
      link.innerHTML = entry.title;
      let href;
      if (entry.link) {
        href = entry.link;
      } else {
        href = "";
      }
      link.href = href;
      let title = newDocument.createElement("h3");
      title.className = "title";
      title.append(link);
      article.append(title);
      let date = newDocument.createElement("div");
      date.className = "published";
      date.textContent = entry.date;
      article.append(date);
      // /<\/?[a-z][\s\S]*>/i.test(entry.text)
      // domParser.parseFromString(text.textContent, 'text/html').body.innerHTML;
      if (entry.torrent && entry.torrent.text) {
        let details = newDocument.createElement("details");
        details.setAttribute("open", "");
        let summary = newDocument.createElement("summary");
        summary.textContent = "Information";
        let text = newDocument.createElement("div");
        if (entry.torrent.type == "html") {
          text.className = "content html";
          text.innerHTML = entry.torrent.text;
        } else {
          text.className = "content text";
          text.textContent = entry.torrent.text;
        }
        details.append(summary);
        details.append(text);
        article.append(details);
      }
      if (entry.summary && entry.summary.text) {
        let details = newDocument.createElement("details");
        if (entry.content && !entry.content.text || contentMode == "content-summary") {
          details.setAttribute("open", "");
        }
        let summary = newDocument.createElement("summary");
        summary.textContent = "Summary";
        let text = newDocument.createElement("div");
        if (entry.summary.type == "html") {
          text.className = "content html";
          text.innerHTML = entry.summary.text;
        } else {
          text.className = "content text";
          text.textContent = entry.summary.text;
        }
        details.append(summary);
        details.append(text);
        article.append(details);
      }
      if (entry.content && entry.content.text) {
        let details = newDocument.createElement("details");
        if (entry.summary && !entry.summary.text || contentMode == "content-complete") {
          details.setAttribute("open", "");
        }
        let summary = newDocument.createElement("summary");
        summary.textContent = "Content";
        let text = newDocument.createElement("div");
        if (entry.content.type == "html") {
          text.className = "content html";
          text.innerHTML = entry.content.text;
        } else {
          text.className = "content text";
          text.textContent = entry.content.text;
        }
        details.append(summary);
        details.append(text);
        article.append(details);
      }
      // Chapters
      // TODO Chapter image
      if (entry.chapters) {
        let details = newDocument.createElement("details");
        let summary = newDocument.createElement("summary");
        summary.textContent = `${entry.chapters.length} Chapters`;
        let ol = newDocument.createElement("ol");
        for (let chapter of entry.chapters) {
          let li = newDocument.createElement("li");
          li.textContent = chapter.start + " " + chapter.title;
          ol.append(li);
        }
        details.append(ol);
        details.append(summary);
        article.append(details);
      }
      // Handle enclosures with search parameters (images of "the mark" website)
      if (enableEnclosure && entry.enclosures && entry.enclosures.length) {
        let details = newDocument.createElement("details");
        let enclosures = newDocument.createElement("div");
        enclosures.className = "enclosures";
        let summary = newDocument.createElement("summary");
        summary.textContent = `${entry.enclosures.length} Enclosures`;
        details.append(summary);
        details.append(enclosures);
        //Table view
        if (enclosureView == "table") {
          let table = newDocument.createElement("table");
          enclosures.append(table);
          let thead = newDocument.createElement("thead");
          table.append(thead);
          let rowh = newDocument.createElement("tr");
          thead.append(rowh);
          let fn = newDocument.createElement("th");
          fn.textContent = "Filename";
          rowh.append(fn);
          let ft = newDocument.createElement("th");
          ft.textContent = "MIME-Type";
          rowh.append(ft);
          let fs = newDocument.createElement("th");
          fs.textContent = "Size";
          rowh.append(fs);
          //let fu = newDocument.createElement("th");
          //fu.textContent = "URI";
          //rowh.append(fu);
          let tbody = newDocument.createElement("tbody");
          table.append(tbody);
          for (const entryEnclosure of entry.enclosures) {
            let rowb = newDocument.createElement("tr");
            thead.append(rowb);
            // Name
            let tf = newDocument.createElement("td");
            rowb.append(tf);
            let cf = newDocument.createElement("a");
            if (entryEnclosure.filename) {
              cf.textContent = entryEnclosure.filename;
            } else {
              cf.textContent = entryEnclosure.uri;
            }
            cf.href = entryEnclosure.uri;
            tf.append(cf);
            // Type
            let tt = newDocument.createElement("td");
            rowb.append(tt);
            let ct = newDocument.createElement("span");
            if (entryEnclosure.type) {
              ct.textContent = entryEnclosure.type;
            } else {
              ct.textContent = "Unknown";
            }
            tt.append(ct);
            // Size
            let ts = newDocument.createElement("td");
            rowb.append(ts);
            let cs = newDocument.createElement("span");
            if (entryEnclosure.length) {
              cs.textContent = entryEnclosure.length;
            } else {
              cs.textContent = "Unknown";
            }
            ts.append(cs);
            // URI
            //let tl = newDocument.createElement("td");
            //rowb.append(tl);
            //let cl = newDocument.createElement("a");
            //tl.append(cl);
            //cl.textContent = entryEnclosure.uri;
            //cl.download = entryEnclosure.filename;
            //cl.href = entryEnclosure.uri;
          }
        // List view
        } else {
          for (const entryEnclosure of entry.enclosures) {
            let file = newDocument.createElement("div");
            file.className = "enclosure";
            enclosures.append(file);
            file.setAttribute("type", entryEnclosure.type);
            let link = newDocument.createElement("a");
            if (entryEnclosure.title) {
              link.textContent = entryEnclosure.title;
            } else 
            if (entryEnclosure.filename) {
              link.textContent = entryEnclosure.filename;
            } else {
              link.textContent = entryEnclosure.uri;
            }
            link.download = entryEnclosure.filename;
            link.href = entryEnclosure.uri;
            file.append(link);
            let size = newDocument.createElement("span");
            // class="size" is needed for function transformFileSize
            size.className = "size";
            size.textContent = `${entryEnclosure.length}`;
            file.append(size);
          }
          // FIXME Skip enclosures with empty href
          // https://gnu.tiflolinux.org/api/statuses/public_timeline.atom
        }
        article.append(details);
      }
      // Handle related resources
      if (entry.resources && entry.resources.length) {
        let details = newDocument.createElement("details");
        article.append(details);
        let resources = newDocument.createElement("div");
        resources.className = "resources";
        details.append(resources);
        let summary = newDocument.createElement("summary");
        summary.textContent = `${entry.resources.length} Resources`;
        details.append(summary);
        for (const entryResource of entry.resources) {
          let file = newDocument.createElement("div");
          file.className = "related";
          resources.append(file);
          let icon = newDocument.createElement("span");
          icon.setAttribute("icon", entryResource.type);
          file.append(icon);
          let link = newDocument.createElement("a");
          if (entryResource.title) {
            link.textContent = entryResource.title;
          } else {
            link.textContent = entryResource.uri;
          }
          link.href = entryResource.uri;
          file.append(link);
        }
      }
      if (entry.authors && entry.authors.length) {
        let details = newDocument.createElement("details");
        article.append(details);
        let authors = newDocument.createElement("div");
        authors.className = "authors";
        details.append(authors);
        let summary = newDocument.createElement("summary");
        summary.textContent = `${entry.authors.length} Authors`;
        details.append(summary);
        for (let entryAuthor of entry.authors) {
          let author = newDocument.createElement("a");
          author.className = "author";
          if (entryAuthor.uri) {
              author.href = entryAuthor.uri;
          }
          author.textContent = entryAuthor.name;
          authors.append(author);
        }
      }
      if (entry.categories && entry.categories.length) {
        let details = newDocument.createElement("details");
        article.append(details);
        let categories = newDocument.createElement("div");
        categories.className = "categories";
        details.append(categories);
        let summary = newDocument.createElement("summary");
        summary.textContent = `${entry.categories.length} Labels`;
        details.append(summary);
        for (let entryCategory of entry.categories) {
          let category = newDocument.createElement("a");
          category.className = "category";
          if (entryCategory.scheme && entryCategory.term) {
              category.href = entryCategory.scheme + "/" + entryCategory.term;
          //} else
          //if (entryCategory.term) {
          //    category.href = entryCategory.term;
          }
          category.textContent = entryCategory.label || entryCategory.term;
          categories.append(category);
        }
      }
      if (entry.blacklisted) {
        articlesFiltered.push(entry);
      } else {
        articles.append(article);
        toc.append(liElement);
      }
      let numberOfArticles = articles.querySelectorAll(".entry").length;
      if (numberOfArticles > minimumItemNumber &&
          numberOfArticles < feed.count &&
          !ignoreMinimumItemNumber) {
        let titleToc = newDocument.createElement("a");
        titleToc.textContent = "Display all posts >";
        titleToc.title = `This feed offers ${feed.count} items`;
        titleToc.className = "expand";
        toc.append(titleToc);
        articles.append(titleToc.cloneNode(true));
        break;
      }
    }
  }
  newDocument.body.append(div);
  /*
  if (feed.next || feed.prev) {
    let sequentialNavigation = newDocument.createElement("div");
    sequentialNavigation.id = "sequential-navigation";
    newDocument.body.append(sequentialNavigation);
    if (feed.prev) {
      let navigationProceed = newDocument.createElement("a");
      navigationProceed.setAttribute("type", "prev");
      navigationProceed.href = feed.prev.getAttribute("href");
      navigationProceed.textContent = "<< Previous";
      sequentialNavigation.append(navigationProceed);
    }
    if (feed.next) {
      let navigationPrevious = newDocument.createElement("a");
      navigationPrevious.setAttribute("type", "next");
      navigationPrevious.href = feed.next.getAttribute("href");
      navigationPrevious.textContent = "Proceed >>";
      sequentialNavigation.append(navigationPrevious);
    }
  }
  */

  // Display announcement
  if (motd) {
    motdAnnouncements(newDocument);
  }

  /*
  let icon;
  if (feed.logo || feed.icon) {
    icon = feed.logo || feed.icon;
  } else {
    icon = GM.getResourceURL("atom.svg");
  }
  */

  if (enableIcon) {
    if (feed.logo || feed.icon) {
      let div = newDocument.createElement("div");
      div.id = "logo";
      newDocument.body.append(div);
      let logoLink = newDocument.createElement("a");
      logoLink.className = "homepage-link";
      div.append(logoLink);
      let logoImage = newDocument.createElement("img");
      logoImage.src = feed.logo || feed.icon;
      logoLink.append(logoImage);
    }
  }
  newDocument = checkContentEmptiness(newDocument);
  return newDocument;
}

// TODO Support categories of element "outline".
// NOTE http://east-village.org/subs.opml
function extractOpml(xmlFile, feed) {
  let nodeOpml = xmlFile.queryPath(null, "opml");
  let nodeHead = nodeOpml.queryPath(null, "head");
  let nodeTitle = nodeHead.queryPath(null, "title");
  if (nodeTitle) {
    feed.title = nodeTitle.textContent;
  }
  let nodeDescription = nodeHead.queryPath(null, "description");
  if (nodeDescription) {
    feed.title = nodeDescription.textContent;
  }
  let nodeBody = nodeOpml.queryPath(null, "body");
  let nodesOutlineOutline = nodeBody.queryPathAll(null, "outline/outline");
  feed.count = nodesOutlineOutline.length;
  let nodesOutline = nodeBody.queryPathAll(null, "outline");
  let outline_count = nodesOutline.length;
  if (outline_count) {
    feed.entries = [];
    for (const nodeOutline of nodesOutline) {
      if (nodeOutline.children.length) {
        let nodesOutlineOutline = nodeOutline.queryPathAll(null, "outline");
        for (const nodeOutlineOutline of nodesOutlineOutline) {
          let entry = {};
          entry.summary = {};
          entry.summary.text = nodeOutlineOutline.getAttribute("description");
          entry.summary.type = "text";
          entry.title = nodeOutlineOutline.getAttribute("text");
          entry.link = nodeOutlineOutline.getAttribute("xmlUrl");
          if (entry.link && !entry.link.length) {
            entry.link = nodeOutlineOutline.getAttribute("htmlUrl");
          }
          if (entry.link && !entry.link.length) {
            entry.link = nodeOutlineOutline.getAttribute("href");
          }
          if (entry.link && entry.link.length) {
            feed.entries.push(entry);
          }
        }
      }
    }
  }
}

function createPage() {
  let newDocument = domParser.parseFromString("", "text/html");
  return newDocument;
}

async function getFontSize() {
  return await GM.getValue("font-size", 20);
}

async function setSettingValue(title, message, key) {
  let value = parseInt(prompt(message));
  if (typeof value == "number") {
    await GM.setValue(key, value);
    notification(`${title} (${value})`, "🎛");
  } else {
    alert("Value must be numeric.");
  }
}

async function getEnclosureView() {
  return await GM.getValue("enclosure-view", "list");
}

async function getFontType() {
  return await GM.getValue("font-type", "serif");
}

async function getViewMode() {
  return await GM.getValue("view-mode", "bright");
}

async function getAudioEnclosureMode() {
  return await GM.getValue("play-enclosure", false);
}

async function getMinimumItemNumber() {
  return await GM.getValue("item-number", 5);
}

async function getSubscriptionHandler() {
  return await GM.getValue("handler", "subtome");
}

async function getContentMode() {
  return await GM.getValue("content-mode", "content-complete");
}

async function getDetectionNotification() {
  return await GM.getValue("detection-notification", true);
}

async function getDetectionScan() {
  return await GM.getValue("detection-scan", true);
}

async function getFilterBlacklist() {
  return await GM.getValue("filter-blacklist", true);
}

async function getFilterWhitelist() {
  return await GM.getValue("filter-whitelist", true);
}

async function getHandlerInstance() {
  return await GM.getValue("instance", "");
}

async function getHandlerUrl() {
  return await GM.getValue("handler-url", "");
}

async function getMotd() {
  return await GM.getValue("motd", true);
}

async function getKeywordsBlacklist() {
  // No one cares.
  // Be sure you protect your civil liberties, instead of concentrating on gang wars.
  // Be sure you design better digital telecommunication means (e.g. BitTorrent, I2P, XMPP etc.).
  let defaultKeywordsToIgnore = [
    "abc",
    "amazon",
    "android",
    "barack obama",
    "biden",
    "bilderberg",
    "brother hovind",
    "chromium",
    "clinton",
    "cloudflare",
    "cnn",
    "dell",
    "dhs",
    "discord",
    "disqus",
    "evolution",
    "facebook",
    "firefox",
    "gaza",
    "george bush",
    "global",
    "globe",
    "goldman sachs",
    "google",
    "gsoc",
    "gwb",
    "hamas",
    "hassan",
    "hate speech",
    "homosexual",
    "homosexuals",
    "homosexualism",
    "homosexuality",
    "ipad",
    "iphone",
    "isis",
    "israel",
    "joe biden",
    "lgbt",
    "lgbtq",
    "lgbtq+",
    "linkedin",
    "mac",
    "microsoft",
    "mozilla",
    "musk",
    "nasa",
    "nuclear",
    "nvidia",
    "obama",
    "osama bin laden",
    "palestine",
    "putin",
    "queer",
    "rand paul",
    "ron paul",
    "systemd",
    "terror",
    "terrorism",
    "terrorist",
    "terrorists",
    "toxic masculinity",
    "trump",
    "twitter",
    "war",
    "wef",
    "world economic forum",
    "white house",
    "yahoo",
    "youtube",
    "xiaomi",
  ];
  return await GM.getValue("keywords-blacklist", defaultKeywordsToIgnore.toString());
}

async function getKeywordsWhitelist() {
  // Watch the 30 minute movie, The News Benders 1968.
  let defaultKeywordsToAllow = [
    "/bin",
    "adc",
    "activitypub",
    "aipac",
    "bible",
    "bittorrent",
    "christ",
    "christian",
    "christianity",
    "chromium linux",
    "conspiracy",
    "creation",
    "creationism",
    "creationist",
    "divest os",
    "e14n",
    "ed2k",
    "freenet",
    "gnu",
    "gnusocial",
    "gnutella",
    "hemp",
    "herb",
    "i2p",
    "ipfs",
    "jabber",
    "jesus",
    "jones plantation",
    "kent hovind",
    "larken rose",
    "lxmf",
    "mastodon",
    "mnt",
    "mobian",
    "monero",
    "mqtt",
    "mutant cybernetics",
    "mutantcybernetics",
    "newsbenders",
    "olimex",
    "openpandora",
    "pleroma",
    "postmarketos",
    "quitter",
    "qvitter",
    "reactos",
    "react os",
    "reticulum",
    "risc-v",
    "riscv",
    "salix",
    "slackware",
    "statusnet",
    "sudomaker",
    "xmpp"
  ];
  return await GM.getValue("keywords-whitelist", defaultKeywordsToAllow.toString());
}

async function getEnclosureMode() {
  return await GM.getValue("enable-enclosure", true);
}

async function getIconMode() {
  return await GM.getValue("show-icon", false);
}

// TODO Return true or false. Do not process newDocument.
function checkContentEmptiness(newDocument) {
  let isEmpty = false;
  if (newDocument.getElementsByClassName("entry").length == 1) {
    newDocument.getElementById("toc").remove();
    // NOTE https://dbpedia.org/data/Searx.atom
    if (!newDocument.getElementById("articles").outerText) {
      newDocument.getElementsByClassName("entry")[0].remove();
      // Should removed data be added to the htmlEmpty message?
      // newDocument.getElementsByClassName("entry")[0].outerHTML;
      isEmpty = true;
    }
  } else
  if (newDocument.getElementsByClassName("entry").length == 0) {
    if (newDocument.getElementById("logo")) {
      newDocument.getElementById("logo").remove();
    }
    if (newDocument.getElementById("toc")) {
      newDocument.getElementById("toc").remove();
    }
    isEmpty = true;
  }
  if (isEmpty) {
    newDocument.getElementById("articles").insertAdjacentHTML("beforeend", htmlEmpty);
  }
  return newDocument;
}

// Possible solution for the document.contentType issue
// /questions/40201137/i-need-to-read-a-text-file-from-a-javascript
// https://openuserjs.org/garage/Loading_functions_after_document_is_replaced_by_new_document
function placeNewDocument(newDocument) {
  //newDocument.querySelector("#homepage").href = location.protocol + "//" + location.hostname;
  //var newDoc = document.adoptNode(newDoc.documentElement, true);
  let insertDocument = document.importNode(newDocument.documentElement, true);
  if (indirect && !xmlStylesheetMissing) {
    let removeDocument = document.documentElement;
  //try {
    document.replaceChild(insertDocument, removeDocument);
  //} catch (e) {
  } else {
    //console.warn(e);
    //console.info(document.contentType);
    if (document.documentElement) {
      document.documentElement.remove();
    }
    document.appendChild(insertDocument);
    /* NOTE This is another method.
    //let currentRoot = document.documentElement;
    while (currentRoot.firstChild) {
      currentRoot.removeChild(currentRoot.firstChild);
    }
    Array.from(newDocument.documentElement.childNodes).forEach(node => {
      const importedNode = document.importNode(node, true);
      currentRoot.appendChild(importedNode);
    });
    */
  }
  /* NOTE This is an additional fashion to replace element "document".
  const newDocumentHTML = new XMLSerializer().serializeToString(newDocument);
  document.open();
  document.write(newDocumentHTML);
  document.close();
  */
}

async function preProcess(newDocument, feed) {

  let elementMeta = newDocument.createElement("meta");
  elementMeta.setAttribute("http-equiv", "Content-Security-Policy");
  elementMeta.setAttribute("content", "style-src 'self' 'unsafe-inline';");
  newDocument.head.append(elementMeta);

  let infobarMessages = newDocument.createElement("div");
  infobarMessages.id = "infobar-messages";
  newDocument.body.prepend(infobarMessages);

  if (articlesFiltered.length) {
      let infobarMessage = newDocument.createElement("div");
      infobarMessages.prepend(infobarMessage);
      infobarMessage.textContent = `${articlesFiltered.length} articles were filtered.`;
      infobarMessage.id = "articles-filtered";
      infobarMessage.className = "infobar-message";
  }

  if (feed.alternative) {
    let infobarMessage = newDocument.createElement("a");
    infobarMessages.prepend(infobarMessage);
    infobarMessage.innerHTML = "Navigate to The Atom Syndication Format version of this document.";
    infobarMessage.id = "atom-message";
    infobarMessage.className = "infobar-message";
    if (location.pathname.endsWith("/rss") ||
        location.pathname.endsWith("/rss/")) {
      infobarMessage.href = location.href.replace("/rss", "/atom");
    } else
    if (location.pathname.endsWith("/")) {
      infobarMessage.href = location.href + "atom";
    } else {
      infobarMessage.href = location.href + "/atom";
    }
  }

  if (xmlStylesheet && !xmlStylesheetMissing) {
//  function stylesheetMessage(newDocument) {
    let infobarMessage = newDocument.createElement("div");
    infobarMessages.prepend(infobarMessage);
    infobarMessage.innerHTML = "View this syndicated document with its own stylesheet.";
    infobarMessage.title = "This feed has its own stylesheet";
    infobarMessage.id = "xslt-message";
    infobarMessage.className = "infobar-message";
//    return newDocument;
//  }
  }

// NOTE newDocument.contentType when is executed
// directly from this function, returns text/html
//function issue3164Message(newDocument, mimetype) {
  if (document.contentType.endsWith("xml")) {
      let mimeType = document.contentType;
      let infobarMessage = newDocument.createElement("div");
      infobarMessages.prepend(infobarMessage);
      infobarMessage.textContent = `Some actions might not work on this page due to MIME-Type ${mimeType}.`;
      //infobarMessage.title = mimeType;
      infobarMessage.id = "feature-limited";
      infobarMessage.className = "infobar-message";
  }
//  return newDocument;
//}

  if (!wellFormed) {
      let infobarMessage = newDocument.createElement("div");
      infobarMessages.prepend(infobarMessage);
      infobarMessage.textContent = `XML document is not-well-formed (i.e. invalid). Please inform the administrators.`;
      infobarMessage.id = "not-well-formed";
      infobarMessage.className = "infobar-message";
  }

  // Alert
  //let alertElement = newDocument.createElement("a");
  //infobarMessages.prepend(alertElement);
  //alertElement.textContent = "Five organizations conspire against the technologies RSS and XSLT!";
  //alertElement.id = "petition-alert";
  //alertElement.className = "infobar-message";
  //alertElement.href = "https://github.com/whatwg/html/issues/11590";

  // A place holder
  let infobarMessage = newDocument.createElement("div");
  infobarMessages.prepend(infobarMessage);
  infobarMessage.textContent = `YOU ARE NOT SUPPOSED TO SEE THIS ― LEVELORD.`;
  infobarMessage.title = `This elaborated and witty phrase was taken from the video game Duke Nukem 3D.`;
  infobarMessage.id = "you-are-not-supposed-to-be-here";
  infobarMessage.className = "infobar-message";

  // Remove attribute style from all elements recursively.
  const elementsContent = newDocument.querySelectorAll("#feed #articles div.entry div.content");
  elementsContent.forEach(elementContent => {
    removeStyleAttribute(elementContent);
  });

// NOTE
// https://momi.ca/feed.xml
// https://momi.ca/css/base.css
// https://momi.ca/css/dark.css
// https://schollz.com/index.xml
// https://chee.party/feeds/everything.xml element style of post https://chee.party/quiet-party/

//function purgeStylesheets(newDocument) {
  if (gmGetValue) {
    if (await GM.getValue("ignore-css", true)) {
      for (const style of newDocument.querySelectorAll("style, link[rel=\"stylesheet\"]")) {
        style.remove();
      }
    }
  }
//  return newDocument; // FIXME
//}

// TODO
// Set XML-STYLESHEET if Content-Type is XML
//function setCssStylesheet(newDocument) {
  let cssStylesheet = newDocument.createElement("style");
  newDocument.head.append(cssStylesheet);
  //stylesheet.setAttribute("crossorigin", "anonymous");
  cssStylesheet.type = "text/css";
  cssStylesheet.id = namespace;

  // TODO
  // Set direction by words if no language specified.
  let isRtl = false;
  for (rtlLocale of rtlLocales) {
    if (newDocument.documentElement.getAttribute("lang") &&
        newDocument.documentElement.getAttribute("lang").startsWith(rtlLocale)) {
      isRtl = true
      break;
    }
  }
  //if (rtlLocales.includes(newDocument.documentElement.getAttribute("lang"))) {
  if (isRtl) {
    cssFileBase = cssFileLTR + cssFileRTL;
  } else {
    cssFileBase = cssFileLTR;
  }

  cssStylesheet.textContent = cssFileBase;
  //cssStylesheet.setAttribute("unsafe-hashes", null);
//  return newDocument; // FIXME
//}

//function footerBar(newDocument) {
  //if (newDocument.contentType.endsWith("xml")) { return; }
  let infoFooter = newDocument.createElement("footer");
  newDocument.body.append(infoFooter);
  let linkSubscribe = newDocument.createElement("a");
  linkSubscribe.title = "Subscribe to this page.";
  linkSubscribe.className = "subscribe-link";
  linkSubscribe.textContent = "Subscribe";
  infoFooter.append(linkSubscribe);
  let linkHome = newDocument.createElement("a");
  linkHome.title = "Visit homepage.";
  linkHome.className = "homepage-link";
  linkHome.textContent = "Homepage";
  infoFooter.append(linkHome);
  let linkSource = newDocument.createElement("a");
  linkSource.href = "view-source:${location.href}?streamburner=0";
  linkSource.title = "View page source code: Right-click; and Open link in new tab.";
  linkSource.textContent = "Page source";
  linkSource.target = "_blank";
  linkSource.rel = "noopener";
  linkSource.id = "source-link";
  infoFooter.append(linkSource);
  let linkHelp = newDocument.createElement("span");
  linkHelp.title = "Learn about syndication feed and how you can help.";
  linkHelp.className = "about-help cursor-help";
  linkHelp.textContent = "Help";
  infoFooter.append(linkHelp);
  let linkSupport = newDocument.createElement("span");
  linkSupport.title = "Learn how you can support.";
  linkSupport.className = "cursor-pointer";
  linkSupport.textContent = "Support our cause";
  linkSupport.id = "about-support";
  infoFooter.append(linkSupport);
  let linkMuc = newDocument.createElement("a");
  //linkMuc.href = "xmpp:syndication@conference.movim.eu?join";
  linkMuc.href = "https://join.jabber.network/#syndication@conference.movim.eu?join";
  linkMuc.title = "Chat with us about Syndictaion and PubSub over XMPP.";
  linkMuc.textContent = "Contact us";
  //linkMuc.target = "_blank";
  //linkMuc.rel = "noopener";
  linkMuc.id = "about-muc";
  infoFooter.append(linkMuc);
//  let linkVisit = newDocument.createElement("a");
//  linkVisit.href = "http://schimon.i2p/";
//  linkVisit.title = "Visit project site: schimon.i2p";
//  linkVisit.textContent = "Visit Us";
//  linkVisit.id = "about-visit";
//  infoFooter.append(linkVisit);
  let software = [
    { // 100daystooffload
      "text" : "Join to #100DaysToOffload",
      "link" : "https://100daystooffload.com",
      "title" : "Can you publish 100 posts on your journal in a year?",
    },
    { // 100daystooffload
      "text" : "Join to 100 Days To Offload",
      "link" : "https://100daystooffload.com",
      "title" : "Can you publish 100 posts on your blog in a year?",
    },
    { // 1mb.club
      "text" : "The 1MB Club Webring",
      "link" : "https://1mb.club",
      "title" : "",
    },
    { // 250kb.club
      "text" : "The 250KB Club Webring",
      "link" : "https://250kb.club",
      "title" : "",
    },
    { // 512kb.club
      "text" : "The 512KB Club Webring",
      "link" : "https://512kb.club",
      "title" : "",
    },
    { // 750words
      "text" : "Join to 750 Words",
      "link" : "https://750words.com",
      "title" : "750 Words - Practice Writing Every Day.",
    },
    { // blowfish
      "text" : "The Blowfish Webring",
      "link" : "https://blowfish.page/users/",
      "title" : "",
    },
    { // chaos computer club
      "text" : "Chaos Computer Club",
      "link" : "https://ccc.de",
      "title" : "The Chaos Computer Club e. V. (CCC) is Europe's largest association of hackers. For more than forty years we are providing information about technical and societal issues, such as surveillance, privacy, freedom of information, hacktivism, data security, and hacking.",
    },
    { // chaotic.ninja
      "text" : "The chaotic.ninja Webring",
      "link" : "https://chaotic.ninja/webring/",
      "title" : "",
    },
    { // cheogram
      "text" : "Get Cheogram Messenger",
      "link" : "https://cheogram.com",
      "title" : "Extensible Messaging and Presence for the Telephone Network.",
    },
    { // conversations
      "text" : "Get Conversations Messenger",
      "link" : "https://conversations.im",
      "title" : "The very last word in instant messaging.",
    },
    { // coyim
      "text" : "Get CoyIM Messenger",
      "link" : "https://coy.im",
      "title" : "Safe and secure chat client.",
    },
    { // delightfulcomputing.com
      "text" : "Delightful Computing",
      "link" : "https://delightfulcomputing.com",
      "title" : "A big welcome from all at Delightful Computing, where you can find technical analysis, training, and full-time information work.",
    },
    { // delightfulcomputing.com
      "text" : "Delightful Computing",
      "link" : "https://delightfulcomputing.com",
      "title" : "Mastering data, JSON, XML, and standard development.",
    },
    { // digdeeper.club
      "text" : "Visit DigDeeper",
      "link" : "https://digdeeper.neocities.org",
      "title" : "The most outstanding independent internet research publication.",
    },
    { // dillo
      "text" : "Get Dillo Browser",
      "link" : "https://dillo-browser.github.io",
      "title" : "Dillo is a fast and small graphical HTML browser.",
    },
    { // divested
      "text" : "Get DivestOS",
      "link" : "https://divestos.org",
      "title" : "A mobile operating system divested from the norm. (take back (some) control of your device).",
    },
    { // exozyme
      "text" : "The exozyme Webring",
      "link" : "https://ring.exozy.me",
      "title" : "",
    },
    { // fdroid
      "text" : "Get F-Droid",
      "link" : "https://f-droid.org",
      "title" : "Free and open source Android app repository.",
    },
    { // falkon
      "text" : "Get Falkon Browser",
      "link" : "https://falkon.org",
      "title" : "Reclaim your online privacy.",
    },
    { // futo
      "text" : "Visit FUTO",
      "link" : "https://futo.org",
      "title" : "Bringing control of computing back to the people.",
    },
    { // gajim
      "text" : "Get Gajim Messenger",
      "link" : "https://gajim.org",
      "title" : "A fully-featured XMPP client.",
    },
    { // gutenberg
      "text" : "Visit Project Gutenberg",
      "link" : "https://gutenberg.org",
      "title" : "Project Gutenberg is a library of over 70,000 free eBooks.",
    },
    { // greasyfork
      "text" : "Visit GreasyFork",
      "link" : "https://greasyfork.org",
      "title" : "Lightweight site-specific browser extensions.",
    },
    { // heaventree
      "text" : "Visit The Guild of Heaven Tree Webring",
      "link" : "https://heaventree.xyz",
      "title" : "I dip Stokers Wintergeen longcut because the flavour is unsurpassed.",
    },
    { // her.st
      "text" : "Visit her.st",
      "link" : "https://her.st",
      "title" : "Do you see it yet?:",
    },
    { // hotlinewebring
      "text" : "Visit Hotline Webring",
      "link" : "https://hotlinewebring.club",
      "title" : "Hotline Webring is not accepting new sites (but existing sites still work)",
    },
    { // i2p
      "text" : "Get I2P",
      "link" : "https://geti2p.net",
      "title" : "Welcome to the Invisible Internet.",
    },
    { // i2pd
      "text" : "Get I2Pd",
      "link" : "http://i2pd.xyz",
      "title" : "Invisible Internet Protocol Daemon.",
    },
    { // indieweb
      "text" : "The IndieWeb Webring",
      "link" : "https://xn--sr8hvo.ws",
      "title" : "This proof-of-concept webring is a way for folks adding IndieWeb building blocks to their personal websites to find (and be found by) other folks with IndieWeb building blocks on their sites!",
    },
    { // izzysoft
      "text" : "Visit IzzyOnDroid",
      "link" : "https://apt.izzysoft.de/fdroid/",
      "title" : "IzzyOnDroid F-Droid repository.",
    },
    { // ->k- czar"s
      "text" : "The ->k- czar’s Webring",
      "link" : "https://czar.kalli.st/webring/",
      "title" : "Illumination should be free",
    },
    { // kmeleon
      "text" : "Get K-Meleon Browser",
      "link" : "http://kmeleonbrowser.org",
      "title" : "The browser you control.",
    },
    { // ladybird
      "text" : "Get Ladybird Browser",
      "link" : "https://ladybird.org",
      "title" : "A new cross platform browser project.",
    },
    { // lagrange
      "text" : "Get Lagrange Browser",
      "link" : "https://gmi.skyjake.fi/lagrange/",
      "title" : "Your guide to the Gemini.",
    },
    { // leechcraft
      "text" : "Get LeechCraft Browser",
      "link" : "https://leechcraft.org",
      "title" : "LeechCraft is a free open source cross-platform modular live environment.",
    },
    { // leechcraft
      "text" : "Get LeechCraft Messenger",
      "link" : "https://leechcraft.org",
      "title" : "LeechCraft is a free open source cross-platform modular live environment.",
    },
    { // librivox
      "text" : "Visit Project LibriVox",
      "link" : "https://librivox.org",
      "title" : "Free public domain audiobooks.",
    },
    { // liferea
      "text" : "Get Liferea News Reader",
      "link" : "https://lzone.de/liferea",
      "title" : "Liferea is a feed reader/news aggregator that brings together all of the content from your favorite subscriptions.",
    },
    { // mystery-paper
      "text" : "Watch Mystery Paper Documentary Series (babylonobserver.com)",
      "link" : "https://babylonobserver.com/mystery-paper/",
      "title" : "An episodic documentary series about the origins and mechanisms of the mysterious paper documents that appear to fund and control our modern world. Inspired by the experiences and research of Cal Washington.",
    },
    { // nekoweb
      "text" : "The Nekoweb Webring",
      "link" : "https://nekoweb.org",
      "title" : "Social media is too limiting. We believe that everyone should be able to freely express themselves in their own little corner of the web, without having to worry about things like algorithms, tracking, or advertisements.",
    },
    { // neocities
      "text" : "The Neocities Webring",
      "link" : "https://neocities.org/browse",
      "title" : "Neocities is a social network of 1,059,800 web sites that are bringing back the lost individual creativity of the web. We offer free static web hosting and tools that allow you to create your own web site. Join us!",
    },
    { // netsurf
      "text" : "Get NetSurf Browser",
      "link" : "https://netsurf-browser.org",
      "title" : "Small as a mouse, fast as a cheetah and available for free.",
    },
    { // nlnet
      "text" : "Visit NLnet Foundation",
      "link" : "https://nlnet.nl",
      "title" : "Help to help the internet.",
    },
    { // nocss
      "text" : "The No CSS Club Webring",
      "link" : "https://nocss.club",
      "title" : "The modern web is literally Satan and will probably eat your first-born child if we don not do anything about it, and quick! (had to increase the hyperbolism from the other websites; interestingly, the NoJS Club, which until now has arguably been the most radical of *.clubs, does not have much hyperbole, which really is a shame).",
    },
    { // nojs
      "text" : "The no-JS Club Webring",
      "link" : "https://no-js.club",
      "title" : "This project was inspired by websites like the 250KB club, the 512KB club, the 1MB club and the former noJS club.",
    },
    { // notnite
      "text" : "The notnite Webring",
      "link" : "https://notnite.com",
      "title" : "",
    },
    { // /now
      "text" : "The /now page Webring",
      "link" : "https://nownownow.com",
      "title" : "Sites with a link that says “now” goes to a page that tells you what this owner is focused on at this point in their life. For short, we call it a “now page”.",
    },
    { // omnom
      "text" : "Get Omnom",
      "link" : "https://omnom.zone",
      "title" : "Create self-contained snapshots for every bookmark you save.",
    },
    { // ooh.directory
      "text" : "The ooh.directory Webring",
      "link" : "https://ooh.directory",
      "title" : "ooh.directory is a place to find good blogs that interest you.",
    },
    { // ooh.directory
      "text" : "The ooh.directory Webring",
      "link" : "https://ooh.directory",
      "title" : "ooh.directory is a place to find good blogs that interest you.",
    },
    { // otter
      "text" : "Get Otter Browser",
      "link" : "https://otter-browser.org",
      "title" : "Controlled by the people, not vice versa.",
    },
    { // oujs
      "text" : "Visit OpenUserJS.org",
      "link" : "https://openuserjs.org",
      "title" : "Lightweight site-specific browser extensions.",
    },
    { // palemoon
      "text" : "Get Pale Moon Browser",
      "link" : "https://palemoon.org",
      "title" : "Your browser, your way.",
    },
    { // peoplesopen
      "text" : "Join People\"s Open Network",
      "link" : "https://peoplesopen.net/learn/build/",
      "title" : "So you want to build your own internet?!",
    },
    { // pmos
      "text" : "Free your PDA or phone. Get postmarketOS",
      "link" : "https://postmarketos.org",
      "title" : "A real Linux distribution for phones.",
    },
    { // psi
      "text" : "Get Psi Instant Messenger",
      "link" : "https://psi-im.org",
      "title" : "Instant messaging as free and open as it should be.",
    },
    { // recurse
      "text" : "The Recurse Center Webring",
      "link" : "https://webring.recurse.com",
      "title" : "This webring seeks to inspire recursers to build an online home and share traffic among each other. The webring welcomes personal sites such as blogs, portfolios, or wikis.",
    },
    { // salix
      "text" : "Get SalixOS",
      "link" : "https://salixos.org",
      "title" : "The Bonsai OS - Linux for the lazy Slacker.",
    },
    { // slidge
      "text" : "Get Slidge",
      "link" : "https://slidge.im",
      "title" : "Gateway library for XMPP to other networks.",
    },
    { // systemcrafters
      "text" : "System Crafters",
      "link" : "https://systemcrafters.net/rss/news.xml",
      "title" : "System Crafters is a community and learning resource for computer enthusiasts who are interested in crafting their computing experience to increase their enjoyment and productivity.",
    },
    { // newsbenders
      "text" : "Watch The News Benders (1968)",
      "link" : "magnet:?xt=urn:btih:75af6576572a08a62a7a614b1fd399712fcf1e58&dn=newsbenders",
      "title" : "A 30 minute film that you are ought to carefully listen to",
    },
    { // ubports
      "text" : "UberBlogr",
      "link" : "https://uberblogr.de",
      "title" : "UberBlogr ist ein Webring für alle die ein privates Journal betreiben.",
    },
    { // ubports
      "text" : "Get Ubuntu Touch",
      "link" : "https://devices.ubuntu-touch.io",
      "title" : "A Linux Mobile OS that gives you pure freedom.",
    },
    { // vocaloid
      "text" : "The Vocaloid Webring",
      "link" : "https://webring.adilene.net/members.php",
      "title" : "V1 of the webring.",
    },
    { // xhtml.club
      "text" : "The XHTML Club Webring",
      "link" : "https://xhtml.club",
      "title" : "Extreme HyperText Movement for Luddites.",
    },
    { // xxiivv
      "text" : "The XXIIVV Webring",
      "link" : "https://webring.xxiivv.com/#rss",
      "title" : "This webring is an attempt to inspire artists and developers to build their websites and share traffic amongst each other. The ring welcomes hand-crafted wikis and portfolios.",
    },
    { // yakumo
      "text" : "The Yakumo Laboratories Webring",
      "link" : "http://yakumo.dev/webring/",
      "title" : "This barely works as such.",
    },
  ];
  // TODO Each software to each day: new Date().getDay()
  let selected = software[Math.floor(Math.random()*software.length)];
  let linkSoftware = newDocument.createElement("a");
  linkSoftware.href = selected.link;
  linkSoftware.title = selected.title;
  linkSoftware.textContent = selected.text;
  linkSoftware.id = "about-software";
  infoFooter.append(linkSoftware);
  let linkJabber = newDocument.createElement("a");
  linkJabber.href = "https://xmpp.org";
  linkJabber.title = "The universal messaging standard. Tried and tested. Independent. Privacy-focused.";
  linkJabber.textContent = "Join to XMPP";
  linkJabber.id = "about-jabber";
  infoFooter.append(linkJabber);
  let linkGemini = newDocument.createElement("a");
  linkGemini.href = "https://geminiprotocol.net";
  linkGemini.title = "The internet as it was truly intended.";
  linkGemini.textContent = "Project Gemini";
  linkGemini.id = "about-gemini";
  infoFooter.append(linkGemini);
  if (isMoz()) {
    let linkMoz = newDocument.createElement("a");
    linkMoz.href = "https://digdeeper.neocities.org/articles/mozilla.xhtml";
    linkMoz.title = "The secrets that Mozilla and its collaborators do not want you to know about.";
    linkMoz.textContent = "Nozilla - Devil Incarnate (digdeeper.club)";
    linkMoz.id = "about-moz";
    infoFooter.append(linkMoz);
  }
  let placeHolder = newDocument.createElement("placeholder");
  newDocument.body.append(placeHolder);
//  return newDocument;
//}

//function viewSourceCode(newDocument) {
  //if (newDocument.contentType.endsWith("xml")) { return; }
  let url = new URL(location.href);
  url.searchParams.set("streamburner","0");
  url.hash = "";
  let sourceLink = newDocument.querySelector("#source-link");
  sourceLink.href = "view-source:" + url.href;
  //sourceLink.title = "Right-click; and Open link in new tab";
//  return newDocument;
//}

//function trimTextContent(newDocument) {
  for (const content of newDocument.querySelectorAll(".content.text")) {
    content.textContent = content.textContent.trim();
  }
//  return newDocument;
//}


//function decorateEntry(newDocument) {
  for (const entry of newDocument.querySelectorAll(".entry")) {
    if (playEnclosure) {
      let encElementSib = entry.querySelector("span[icon=\"audio\"]");
      if (encElementSib) {
        let encElement = encElementSib.nextSibling;
        let encElementParent = encElement.parentElement;
        let audioElement = newDocument.createElement("audio");
        let audioSource = encElement.href;
        //let audioFilename = encElement.textContent;
        //audioElement.textContent = audioFilename;
        audioElement.src = audioSource;
        audioElement.controls = true;
        entry.append(audioElement);
        //encElementParent.append(audioElement)
        //encElement.remove();
      }
    }
    let divElement = newDocument.createElement("span");
    divElement.className = "decor";
    entry.parentNode.insertBefore(divElement, entry.nextSibling);
    //entry.parentNode.insertBefore(divElement, entry);
  }
//  return newDocument;
//}

//async function setFont(newDocument) {
  //if (newDocument.contentType.endsWith("xml")) return;

  // type
  if (gmGetValue) {
    newDocument.body.style.fontFamily = fontType;
  }

  // size
  if (gmGetValue) {
    if (fontSize < 20) {
      fontSize = 20;
      await GM.setValue("font-size", fontSize);
    }
    newDocument.getElementById("articles").style
    .fontSize = fontSize + "px";
  }
//  return newDocument;
//}

//function trimEnclosureFilename(newDocument) {
  for (const fileName of newDocument.querySelectorAll(".enclosure > a")) {
    if (fileName.textContent.includes("?")) {
      //let newfileName;
      //newfileName = fileName.href.split("/").pop();
      //newfileName = newfileName.substring(0, newfileName.indexOf("?"));
      let newfileName = fileName.textContent.substring(0, fileName.textContent.indexOf("?"));
      fileName.textContent = newfileName;
      fileName.download = newfileName;
      fileName.href = newfileName;
    }
  }
//  return newDocument;
//}

//function mailTo(newDocument) {
  // Add link with emails
  if (newDocument.querySelector("#empty-feed")) {
    let ele, eml, hyl;
    ele = newDocument.querySelector("#empty-feed");
    aElement = newDocument.createElement("a");
    aElement.id = "email-link";
    if (ele.className.includes("dark")) {
      aElement.className = "dark";
    }
    aElement.textContent = "Send an E-Mail message";
    let una = ["admin", "contact", "feedback", "form",
               "hello", "hi", "info", "me", "office", "pr",
               "press", "support", "web", "webmaster",];
    hyl = `${una[0]}@${location.hostname},`;
    for (let i = 1; i < una.length; i++) {
      hyl += `${una[i]}@${location.hostname},`;
    }
    //hyl = hyl.slice(0. -1);
    aElement.href = `mailto:?subject=Add Syndication Feeds for ${location.hostname}&body=Greetings,%0D%0A%0D%0AI have visited ${document.baseURI.slice(document.baseURI.indexOf(":")+3)} and saw that your Syndication Feed is empty.%0D%0A%0D%0APlease populate your RSS Syndication Feed so that people can easily receive updates from your site.%0D%0A%0D%0AIf you do not know what a Syndication Feed is or how you can benefit from it, visit aboutfeeds.com to read more about it.%0D%0A%0D%0AThe recommended standard of RSS is The Atom Syndication Format (RFC 4287).%0D%0A%0D%0AKind regards,%0D%0A&bcc=${hyl}`;
    ele.append(aElement);
  }
//  return newDocument;
//}

//function linksBar(newDocument) {
  let divElement = newDocument.createElement("div");
  let spanOfDivElement = newDocument.createElement("span");
  divElement.id = "control-bar-container";
  spanOfDivElement.id = "control-bar";
  spanOfDivElement.innerHTML = htmlBar;
  //let feedElement = newDocument.querySelector("#feed");
  //feedElement.parentNode.insertBefore(divElement, feedElement);
  divElement.append(spanOfDivElement);
  newDocument.body.prepend(divElement);
  //let yanstbhElement = newDocument.querySelector("#you-are-not-supposed-to-be-here");
  //yanstbhElement.parentNode.insertBefore(divElement, yanstbhElement.previousSibling);
//  return newDocument;
//}

//async function handler(newDocument) {
  //let service = newDocument.querySelector("#subscribe-link");
  //service.removeAttribute("href");
  let instance, link, text;
  if (gmGetValue) {
    switch (subscriptionHandler) {
      case "desktop":
        text = "Subscribe";
        link = "feed:";
        break;
      case "commafeed":
        text = "CommaFeed";
        instance = handlerInstance;
        if (!instance) {instance ="commafeed.com";}
        link = `https://${instance}/rest/feed/subscribe?url=`;
        break;
      case "feedbin":
        text = "Feedbin";
        link = "https://feedbin.com/?subscribe=";
        break;
      case "feedcity":
        text = "FeedCity";
        link = "https://feed.city/feed?url=";
        break;
      case "feeder":
        text = "Feeder";
        link = "https://feeder.co/add-feed?url=";
        //link = "https://feeder.co/library/feeds/new?feed_id=";
        break;
      case "feedly":
        text = "Feedly";
        link = "https://feedly.com/i/discover/sources/search/feed/";
        break;
      case "goodnews":
        text = "Good News";
        link = "https://goodnews.click/add?url=";
        break;
      case "inoreader":
        text = "Inoreader";
        link = "https://inoreader.com/search/feeds/";
        break;
      case "newsblur":
        text = "NewsBlur";
        link = "https://newsblur.com/?url=";
        break;
      case "subtome":
        text = "SubToMe";
        instance = handlerInstance;
        if (!instance) {instance ="subtome.com";}
        link = `https://${instance}/#/subscribe?feeds=`;
        subToMe(instance);
        break;
      case "tapestry":
        text = "Tapestry";
        link = "tapestry://feedfinder?url=";
        break;
      case "custom":
        text = "Subscribe";
        if (!instance) {instance ="gemini://news.schimon.i2p/?add=";}
        link = `${instance}`;
        break;
    }
  } else {
    // TODO Change to SubToMe
    text = "Subscribe";
    link = "feed:";
  }
  if (gmSetValue) {
    await GM.setValue("handler-url", link);
    await GM.setValue("instance", instance);
  }
  for (const element of newDocument.querySelectorAll(".subscribe-link")) {
      element.textContent = text;
      element.href = link + location.href; // feed.self
  }
//  return newDocument;
//}

//async function dark(newDocument) {
//  if (!newDocument.contentType.endsWith("xml")) {
  if (gmGetValue) {
      let cssSelectors = [
        "a", "body", "code", ".enclosures", ".resources",
        "#control-bar-container", "#empty-feed", "#info-square"];
      if (viewMode == "dark") {
        for (let cssSelector of cssSelectors) {
          for (let element of newDocument.querySelectorAll(cssSelector)) {
            element.classList.add("dark");
            let mode = newDocument.querySelector("#mode");
            //mode.textContent = "💡"; // 🌓
            //mode.style.filter = "saturate(7)";
            //mode.style.filter = "brightness(0.5)"; // invert
            mode.style.filter = "hue-rotate(300deg)";
            mode.title = "Switch to bright mode";
          }
        }
      }
    }
//  }
//  return newDocument;
//}

//function formatDate(newDocument) {
  let elements = [".published", ".updated"];
  for (let i = 0; i < elements.length; i++) {
    for (const element of newDocument.querySelectorAll(elements[i])) {
      let date = new Date(element.textContent);
      if (date == "Invalid Date") continue;
      //element.textContent = date.toDateString();
      element.textContent = date.toLocaleString();
    }
  }
//  return newDocument;
//}

// FIXME
// questions/10420352/converting-file-size-in-bytes-to-human-readable-string
//function transformFileSize(newDocument) {
  for (const item of newDocument.querySelectorAll(".size")) {
    let size = item.textContent;
    let i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    item.textContent = (size / Math.pow(1024, i)).toFixed(2) * 1 + " " + ["B", "KB", "MB", "GB", "TB"][i];
    if (item.textContent == "0 B" ||
        item.textContent == "NaN undefined") {
      item.textContent = null;
    }
  }
//  return newDocument;
//}

//function noReferrer(newDocument) {
  for (const element of newDocument.querySelectorAll("a[href]")) {
    element.rel = "noreferrer";
  }
//  return newDocument;
//}

  // Failed attempt to force browser to treat file as HTML
  let meta = newDocument.createElement("meta");
  meta.setAttribute("http-equiv", "Content-Type");
  meta.setAttribute("content", "text/html; charset=utf-8");
  // Append the <meta> element to the <head> element
  newDocument.head.appendChild(meta);
  // Failed attempt to force browser to treat file as HTML

  // FIXME
  // Add #top-navigation-button
  let navigateTop = newDocument.createElement("a");
  navigateTop.textContent = "^"; // ^ is better than ⬆️⥣⇧⇪➦
  navigateTop.href = "#";
  navigateTop.id = "top-navigation-button";
  newDocument.body.append(navigateTop);

  let title = newDocument.querySelector("#title");
  if (!title.textContent) {
    title.textContent = location.hostname; // defaultTitle
  }

  let subtitle = newDocument.querySelector("#subtitle");
  if (!subtitle.textContent) {
    subtitle.textContent = defaultSubtitle;
  }

  let infoSquare = newDocument.createElement("div");
  infoSquare.id = "info-square";
  let loadMode = "🗞";
  if (indirect) {loadMode = "📰"}
  infoSquare.textContent = loadMode + " Enjoy syndicated content with StreamBurner for Greasemonkey. Yours truly, The Syndication Task Force.";
  newDocument.body.append(infoSquare);

}

async function postProcess(feed) {

  if (gmSetValue) {
    let motdButton = document.querySelector("#urgent-message button");
    if (motdButton) {
      motdButton.addEventListener ("click", async function() {
        await GM.setValue("motd", false);
        document.querySelector("#urgent-message").remove();
      });
    }
  }

  // NOTE feeds.rssboard.org/rssboard
  for (element of document.querySelectorAll("div.content.html, div.summary.html")) {
    if (element.children.length < 1) {
      let plainContent, processedContent;
      plainContent = element.textContent;
      processedContent = domParser.parseFromString(plainContent, "text/html");
      try {
        element.innerHTML = processedContent.body.innerHTML;
      } catch (e) {
        console.error(e);
      }
    }
  }

  //let styleInline;

// NOTE
// Consider https://openuserjs.org/libs/BigTSDMB/setStyle
//function setNonceUponCSP() {
  window.addEventListener("securitypolicyviolation", (e) => {
    // TODO Extract or forge hash if possible
    let nonceValue = e.originalPolicy.match(/"nonce-(.*?)"/);
    console.log(nonceValue);
    if (nonceValue && nonceValue.length > 0) {
      nonceValue = nonceValue[1];
      //let message = e.originalPolicy;
      //messageTruncated = message.substring(message.indexOf(""nonce-") + 7);
      //let nonceValue = messageTruncated.substring(0, messageTruncated.indexOf("""));
      cssStylesheet = document.getElementById(namespace);
      cssStylesheet.setAttribute("nonce", nonceValue);
      //let hashValue = e.originalPolicy.match(/sha256-[A-Za-z0-9+/=]+/)[0];
      //cssStylesheet.setAttribute("unsafe-inline", hashValue);

      // Reload stylesheet
      textContent = cssStylesheet.textContent;
      cssStylesheet.textContent = null;
      cssStylesheet.textContent = textContent;
    } else {
      if (rtlLocales.includes(document.documentElement.getAttribute("lang"))) {
        cssFileBase = cssFileLTR + cssFileRTL;
      } else {
        cssFileBase = cssFileLTR;
      }
      //await GM.addStyle(cssFileBase);
      GM_addStyle(cssFileBase);
      /* NOTE unsafeWindow.
      let cssStylesheet = document.createElement("style");
      unsafeWindow.document.head.append(cssStylesheet);
      cssStylesheet.type = "text/css";
      cssStylesheet.id = namespace;
      if (rtlLocales.includes(document.documentElement.getAttribute("lang"))) {
        cssFileBase = cssFileLTR + cssFileRTL;
      } else {
        cssFileBase = cssFileLTR;
      }
      cssStylesheet.textContent = cssFileBase;
      */

      /* NOTE Iterate CSS properties to apply inline.
      // FIXME 12bytes.org
      // TODO Set a sidebar, instead of a top bar.
      //alert("Some features might not work due to CORS constrains.");
      let messageCorse = "Some features might not work due to CORS constrains.";
      let spanElement = document.querySelector("#feature-limited");
      if (spanElement) {
        spanElement.textContent = messageCorse;
      } else {
        let spanElement = document.createElement("div");
        spanElement.textContent = messageCorse;
        spanElement.style.background = "indianred";
        spanElement.style.color = "white";
        spanElement.style.direction = "ltr";
        spanElement.style.display = "block";
        spanElement.style.fontFamily = "system-ui";
        spanElement.style.lineHeight = "50px";
        spanElement.style.textAlign = "center";
        spanElement.style.userSelect = "none";
        let targetElement = document.getElementById("you-are-not-supposed-to-be-here");
        targetElement.insertAdjacentElement("afterend", spanElement);
      }
      //styleInline = true;
      const cssStyles = {};

      // Determine whether to include RTL stylesheet
      if (rtlLocales.includes(document.documentElement.getAttribute("lang"))) {
          cssFileBase = [cssFileLTR, cssFileRTL];
      } else {
          cssFileBase = [cssFileLTR];
      }

      // Iterate through all stylesheets in the document
      for (let sheet of cssFileBase) { //cssFileRTL
          
          // Remove comments from the CSS string
          let sheetClean = sheet.replace(/\/\*[\s\S]*?\*\//g, "");
          
          // Split the CSS string into rules based on the closing brace
          const rules = sheetClean.split("}");

          // Iterate through each rule
          rules.forEach(rule => {
              // Split the rule into selector and declaration block
              const [selector, declarations] = rule.split("{").map(part => part.trim());

              if (selector && declarations) {
                  // Create an object for the properties
                  const properties = {};

                  // Split declarations into individual properties
                  declarations.split(";").forEach(declaration => {
                      const [property, value] = declaration.split(":").map(part => part.trim());

                      if (property && value) {
                          properties[property] = value;
                      }
                  });

                  // Add to the main cssStyles object
                  cssStyles[selector] = properties;
              }
          });
      }
      // Apply style inline
      for (const selector in cssStyles) {
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
              const styles = cssStyles[selector];
              for (const property in styles) {
                  element.style[property] = styles[property];
              }
          });
      }
      */

    }
  }, { passive : true, once: true});
//}

// Write element #top-navigation-button as HTML or create it at preProcess
// instead of creatnig it with ECMA, so it would work with XML.
  let navigateTop = document.querySelector("#top-navigation-button");
  navigateTop.onmouseover = () => {
    navigateTop.removeAttribute("href");
  };
  navigateTop.onclick = () => {
    window.scrollTo({ top: 0 });
  };

  // Add loading trigger;
  for (let titleToc of document.querySelectorAll(".expand")) {
    titleToc.onclick = () => {
      titleToc.textContent = "Loading all of the items. Please wait…";
      ignoreMinimumItemNumber = true;
      //checkContentType();
      retrieveContent(true);
      init;
    };
  }

  // Add focus.
  for (i of document.querySelectorAll("#toc li a")) {
    //let identifier = i.getAttribute("href").replace("#", "");
    let identifier = i.getAttribute("href");
    i.removeAttribute("href");
    i.onclick = () => {
      //document.getElementById(identifier).scrollIntoView();
      document.querySelector(identifier).scrollIntoView();
    }
  }

  if (feed.base) {
    let elementBase = document.head.querySelector("base");
    elementBase.href = feed.base;
    //elementBase.setAttribute("href", base);
  }

  for (selector of ["#source-link", "#xslt-message"]) {
    let element = document.querySelector(selector);
    if (element) {
      element.addEventListener ("click", async function() {
        try {
          sessionStorage.setItem("loadRawDocument", "true");
          location.reload();
        } catch {
          let url = new URL(location.href);
          url.searchParams.set("streamburner","0");
          location.href = url.href;
        }
      });
    }
  }

/*
//function scrollDown(document) {
  let urlA;
  // Create toolbar and a button when scrolling down
  document.addEventListener ("scroll", function() {
    if (location.href == urlA || window.pageYOffset < 300) {
    //function floatBar() {
      const cssStylesheet = document.getElementById(namespace);
      if (document.querySelector("#links-bar")) {
        document.querySelector("#links-bar").style.display = "auto";
      }
      if (window.pageYOffset > 300) { // TODO when first entry is focused
        cssStylesheet.textContent = cssFileBase + cssFileBar;
      } else {
        cssStylesheet.textContent = cssFileBase;
        document.querySelector("#links-bar").removeAttribute("style");
      }
    }
    if (location.href != urlA) {
      urlA = location.href;
    }
  });
//  return document;
//}
*/

  if (feed.next) {
    let link = document.querySelector("#ace-link-next");
    link.title = feed.next.title;
    link.href = feed.next.href;
  }

  if (feed.prev) {
    let link = document.querySelector("#ace-link-prev");
    link.title = feed.prev.title;
    link.href = feed.prev.href;
  }

//function homePage(document) {
  if (feed.link) {
    for (const element of document.querySelectorAll(".homepage-link")) {
      element.href = feed.link.href;
    }
  }
  /*
  if (!link && document.location.hostname) {
    link = document.location.hostname;
  } else
  if (!link) { // Local file (i.e. file://)
    link = document.location.href.slice(0, location.href.lastIndexOf("/"));
  }
  document.querySelector("#homepage").href = link;
  */
//  return document;
//}

// Issue with header indication of XML
//function modeChange(document){
  let mode = document.querySelector("#mode");
  mode.addEventListener ("click", async function() {
    await toggleMode();
  });
//  return document;
//}

// TODO Change variable "currentEntry" upon scrolling
//function navigation(document) {
  let entriesCount = document.querySelectorAll(".entry").length - 1,
      currentEntry = -1;
  document.querySelector("#nav-top")
  .addEventListener ("click", function() {
    if (document.querySelector("#toc")) {
      document.querySelector("#toc").scrollIntoView();
    } else {
      document.body.scrollIntoView();
    }
  });
  /*
  document.addEventListener("keydown", function(e) {
    if (e.ctrlKey && e.shiftKey && e.which == 38) {
      document.body.scrollIntoView();
    }
  });
  */
  document.querySelector("#nav-next")
  .addEventListener ("click", function() {
    if (currentEntry < entriesCount) {currentEntry += 1;}
    navigateToItem(currentEntry, entriesCount);
  });
  document.addEventListener("keydown", function(e) {
    if (e.ctrlKey && e.shiftKey && e.which == 40) {
      if (currentEntry < entriesCount) {currentEntry += 1;}
      navigateToItem(currentEntry, entriesCount);
    }
  });
  document.querySelector("#nav-previous")
  .addEventListener ("click", function() {
    if (currentEntry > 0) {currentEntry -= 1;}
    navigateToItem(currentEntry);
  });
  document.addEventListener("keydown", function(e) {
    if (e.ctrlKey && e.shiftKey && e.which == 38) {
      if (currentEntry > 0) {currentEntry -= 1;}
      navigateToItem(currentEntry);
    }
  });
  // FIXME Naviate to item without adding #newspaper-oujs-1 to URL.
  //for (const element of document.querySelectorAll("#toc > li > a")) {
  //  element.addEventListener ("click", function() {
  //    let href = element.href;
  //    let id = href.split("#").pop();
  //    //element.removeAttribute("href");
  //    currentEntry = id.split("-").pop()
  //    document.querySelector(`.entry#${id}`).scrollIntoView();
  //  });
  //}
//  return document;
//}

// /questions/38627822/increase-the-font-size-with-a-click-of-a-button-using-only-javascript
//function fontSizeControl(document) {
  document.querySelector("#increase")
  .addEventListener ("click", async function() {
    let txt = document.getElementById("articles");
    let style = window.getComputedStyle(txt, null).getPropertyValue("font-size");
    currentSize = parseFloat(style);
    if (currentSize < 35) {
      txt.style.fontSize = (currentSize + 5) + "px";
      infoSquare("Text size: " + txt.style.fontSize);
    }
    if (gmSetValue) {
      await GM.setValue("font-size", currentSize + 5);
    }
    //navigateToItem(currentEntry);
  });
  document.querySelector("#decrease")
  .addEventListener ("click", async function() {
    let txt = document.getElementById("articles");
    let style = window.getComputedStyle(txt, null).getPropertyValue("font-size");
    currentSize = parseFloat(style);
    if (currentSize > 20) {
      txt.style.fontSize = (currentSize - 5) + "px";
      infoSquare("Text size: " + txt.style.fontSize);
    }
    if (gmSetValue) {
      await GM.setValue("font-size", currentSize - 5);
    }
    //navigateToItem(currentEntry);
  });
//  return document;
//}

//function direction(document) {
  let dire = document.querySelector("#direction");
  dire.addEventListener ("click", function() {
    if (document.dir == "ltr" || !document.dir) {
      document.dir = "rtl";
      dire.textContent = "RTL"; // ❰
      dire.title = "Switch to Left-to-right direction";
      infoSquare("Right to left");
    } else {
      document.dir = "ltr";
      dire.textContent = "LTR"; // ❱
      dire.title = "Switch to Right-to-left direction";
      infoSquare("Left to right");
    }
  });
//  return document;
//}

  let aboutMuc = document.querySelector("#about-muc");
  document.querySelector("#about-muc")
  .addEventListener ("click", function() {
    location.href = "xmpp:syndication@conference.movim.eu?join";
  });

//function supportPage(document) {
  document.body.insertAdjacentHTML("beforeend", htmlSupport);
  let pageSupport = document.querySelector("#page-support");
  document.querySelector("#about-support")
  .addEventListener ("click", function() {
    pageSupport.style.display = "block";
  });
  // freedos at sourceforge does not allow inline ondblclick
  // ondblclick="this.style.display = &quot;none&quot;"
  document.querySelector("#page-support .return-to-feed")
  .addEventListener ("click", function() {
      pageSupport.style.display = "none";
    });
//  return document;
//}

//function helpPage(document) {
  document.body.insertAdjacentHTML("beforeend", htmlAbout);
  for (const element of document.querySelectorAll(".about-help")) {
    element.addEventListener ("click", function() {
      document.querySelector("#page-about").style.display = "block";
    });
  }
  // let pageAbout = document.querySelector("#about-help");
  // pageAbout.addEventListener ("click", function() {
  //   document.querySelector("#page-about").style.display = "block";
  // });
  // freedos at sourceforge does not allow inline ondblclick
  // ondblclick="this.style.display = &quot;none&quot;"
  /*
  let pageSupport = document.querySelector("#page-about");
  pageSupport.addEventListener ("dblclick", function() {
    document
    .querySelector("#page-about")
    .style
    .display = "none";
  });
  */
//  return document;
//}
 
//function instructions() {
  let gecko = isGecko();
  if (gecko) {
    //let software = gecko[0].toUpperCase() + gecko.substring(1);
    document.querySelector("#page-about .document")
    .insertAdjacentHTML("afterbegin", helpGecko);
    document.querySelector("#open-in-browser-rules")
    .addEventListener ("click", function() {
      savePage(
        ruleSetOpenInBrowser,
        "streamburner-open-in-browser-ruleset",
        "application/json",
        "json"
      );
    });
  }

  // Header Editor
  /* softwares = ["waterfox", "librewolf", "seamonkey", "firefox", "chrome", "edge"];
  for (let i = 0; i < softwares.length; i++) {
    if (navigator.userAgent.toLowerCase().includes(softwares[i])) {
      let software = softwares[i][0].toUpperCase() + softwares[i].substring(1);
      document
      .querySelector("#page-about")
      .insertAdjacentHTML("beforeend", helpHeaderEditor);
      document
      .querySelector("#header-editor-install")
      .href = (function () {
        let link;
        switch (softwares[i]) {
          case "chrome":
            link = "https://chrome.google.com/webstore/detail/header-editor/eningockdidmgiojffjmkdblpjocbhgh";
            break;
          case "edge":
            link = "https://microsoftedge.microsoft.com/addons/detail/header-editor/afopnekiinpekooejpchnkgfffaeceko";
            break;
          default:
            link = "https://addons.mozilla.org/firefox/addon/header-editor/";
        }
        return link;
      }());
      document
      .querySelector("#about-toc")
      .insertAdjacentHTML(
        "beforeend",
        `<li><a href="#header-editor">${software} Help: Enable syndication feeds with Header Editor</a></li>`);
      document
      .querySelector("#header-editor-rules")
      .addEventListener ("click", function() {
        savePage(
          ruleSetHeaderEditor,
          "streamburner-header-editor-ruleset"
          "application/json",
          "json"
        )
      });
    }
  } */
//}
  if (gmGetValue || gmSetValue) {
  //  function settingsPage(document) {
    document.body.insertAdjacentHTML("beforeend", htmlSettings);
    let buttonSettings = document.querySelector("#about-settings");
    let pageSettings = document.querySelector("#page-settings");
    buttonSettings.addEventListener ("click", function() {
      pageSettings.style.display = "block";
    });
  
    // TODO Save setting upon click on button "Save" (does not exist yet)
    //async function settings(document) {
    for (const controller of document.querySelectorAll("#page-settings input, #page-settings select")) {
      let value = await GM.getValue(controller.name);
      switch (controller.type) {

  //          case ("select-one"):
  //            controller.querySelector(`[value=${value}`).setAttribute("selected", null);
  //            break;
  
        case ("number"):
          controller.setAttribute("value", value);
          break;

        case ("checkbox"):
          if (value == true) {
            controller.setAttribute("checked", null);
          }
          break;

        case ("radio"):
          if (value == controller.id) {
            controller.setAttribute("checked", null);
          }
          break;
      }

      controller.addEventListener ("focusout", async function() {
        let value, key = this.name;
        //console.log(this.type);
        switch (this.type) {
          case "checkbox":
            value = this.checked;
            //console.log("this.checked");
            break;
          case "radio":
            value = this.id;
            //console.log("this.id");
            break;
          default:
            value = this.value;
            //console.log("this.value");
        }
        await GM.setValue(key, value);
        //console.log(key,":", value);
        //console.log(await GM.listValues());
      });
    }

    document.querySelector("#page-settings #close-page-settings")
    .addEventListener ("click", function() {
      document.querySelector("#page-settings")
      .style.display = "none";
    });
  
    document.querySelector("#page-settings #reload-document")
    .addEventListener ("click", function() {
      //window.location.reload(true);
      //window.location.reload();
      location.reload();
    });
  //      return document;
  //    }
  //    return document;
  //  }
  }

  // Set values
  let pageSettings = document.querySelector("#page-settings");

  pageSettings.querySelector("#content-mode").value = contentMode;
  pageSettings.querySelector("#detection-notification").value = detectionNotification;
  pageSettings.querySelector("#detection-scan").value = detectionScan;
  pageSettings.querySelector("#enclosure-view").value = enclosureView;
  pageSettings.querySelector("#filter-whitelist").value = filterWhitelist;
  pageSettings.querySelector("#filter-blacklist").value = filterBlacklist;
  pageSettings.querySelector("#font-size").value = fontSize;
  pageSettings.querySelector("#font-type").value = fontType;
  pageSettings.querySelector("#handler").value = subscriptionHandler;
  pageSettings.querySelector("#handler-url").textContent = handlerUrl;
  pageSettings.querySelector("#instance").value = handlerInstance;
  pageSettings.querySelector("#item-number").value = minimumItemNumber + 1;
  pageSettings.querySelector("#play-enclosure").value = playEnclosure;
  pageSettings.querySelector("#show-icon").value = enableIcon;
  pageSettings.querySelector("#view-mode").value = viewMode;

  let keywordsBlacklistSorted = keywordsBlacklist.split(",").sort();
  pageSettings.querySelector("#keywords-blacklist").value = keywordsBlacklistSorted.toString();

  let currentBlacklistKeywords = pageSettings.querySelector("#keywords-blacklist-current");
  for (let keyword of keywordsBlacklistSorted) {
    let currentKeyword = document.createElement("span");
    currentKeyword.textContent = keyword;
    currentBlacklistKeywords.append(currentKeyword);
  }

  let keywordsWhitelistSorted = keywordsWhitelist.split(",").sort();
  pageSettings.querySelector("#keywords-whitelist").value = keywordsWhitelistSorted.toString();

  let currentWhitelistKeywords = pageSettings.querySelector("#keywords-whitelist-current");
  for (let keyword of keywordsWhitelistSorted) {
    let currentKeyword = document.createElement("span");
    currentKeyword.textContent = keyword;
    currentWhitelistKeywords.append(currentKeyword);
  }

//function compactHelpPage(document) {

// NOTE Consider for slideshow mode.

/*
  for (const element of document.querySelectorAll(".about-newspaper .decor")) {
    element.classList.add("hide");
  }

  for (const element of document.querySelectorAll(".about-newspaper .segment")) {
    if (element.id != "table-of-contents") {
      element.classList.add("hide");
    }
  }

  for (const element of document.querySelectorAll("#about-toc a, a.link")) {
    element.addEventListener ("click", function() {
      document.querySelector(`${element.href.slice(element.href.indexOf("#"))}`).classList.remove("hide");
      document.querySelector(".about-newspaper .return-to-menu").classList.remove("hide");
      document.querySelector(`.about-newspaper #table-of-contents`).classList.add("hide");
    });
    //element.removeAttribute("href");
  }

  let button = document.querySelector(".about-newspaper .return-to-menu");
  button.classList.add("hide");
  button.addEventListener ("click", function() {
    for (const element of document.querySelectorAll(".segment")) {
      if (element.id != "table-of-contents") {
        element.classList.add("hide");
      }
    }
    //button.classList.add("hide");
    document.querySelector("#page-about .return-to-menu").classList.add("hide");
    document.querySelector(`#table-of-contents`).classList.remove("hide");
  });
*/

  document.querySelector("#page-about .return-to-feed")
  .addEventListener ("click", function() {
    document.querySelector("#page-about").style.display = "none";
  });
//  return document;
//}

//function pickRandomFeed(document) {
  //let feeds = document.querySelectorAll("#feeds .content .category a");
  let sections = document.querySelectorAll("#feeds .content .category");
  let section = sections[Math.floor(Math.random()*sections.length)];
  let category = section.querySelector("h5");
  let subscriptions = section.querySelectorAll("a");
  let subscription = subscriptions[Math.floor(Math.random()*subscriptions.length)];
  for (const a of document.querySelectorAll("#feeds a.feed-category")) {
    a.textContent = category.outerText;
    a.href = "#" + section.id;
  }
  for (const a of document.querySelectorAll("#feeds a.feed-url")) {
    a.textContent = subscription.outerText;
    a.href = subscription.href;
  }
//  return document;
//}

//function generateOPML(document) {
/*
<?xml version="1.0" encoding="utf-8"?>
<opml version="1.0">
  <head>
    <title>Liferea Feed List Export</title>
  </head>
  <body>
    <outline title="TITLE" text="TITLE" description="TITLE" type="folder">
      <outline title="TITLE" text="TITLE" description="TITLE" type="rss" xmlUrl="URL"/>
    </outline>
  </body>
</opml>
*/

  document.querySelector("#opml-selection")
  .addEventListener ("click", function() {
    let opmlData = document.implementation.createDocument(null, "opml", null);
    opmlData.getElementsByTagName("opml")[0].setAttribute("version", "1.0");
    let text = opmlData.createTextNode("Newspaper Feed Selection");
    let name = opmlData.createElement("title");
    let head = opmlData.createElement("head");
    let body = opmlData.createElement("body");
    let sections = document.querySelectorAll("#feeds .content .category");
    for (const section of sections) {
      let title = section.querySelector("h3").outerText;
      let category = opmlData.createElement("outline");
      category.setAttribute("title", title);
      category.setAttribute("text", title); // Why twice?
      category.setAttribute("text", title); // Why twice?
      category.setAttribute("type", "folder");
      // TODO Handle subcategories
      let links = section.querySelectorAll("a");
      for (const link of links) {
        let outline = opmlData.createElement("outline");
        let title = link.outerText;
        let url = link.href;
        outline.setAttribute("title", title);
        outline.setAttribute("text", title); // Why twice?
        outline.setAttribute("text", title); // Why twice?
        // NOTE This value (rss) is arbitrary.
        // TODO Add type to class.
        //outline.setAttribute("type", "rss");
        outline.setAttribute("xmlUrl", url);
        category.appendChild(outline);
      }
      body.appendChild(category);
    }
    head.appendChild(name);
    name.appendChild(text);
    opmlData.getElementsByTagName("opml")[0].appendChild(head);
    opmlData.getElementsByTagName("opml")[0].appendChild(body);
    let opmlFile = xmlSerializer.serializeToString(opmlData);
    savePage(
      opmlFile,
      "i2p-schimon-newspaper",
      "text/x-opml+xml",
      "opml"
    );
  });

  document.querySelector("#opml-selection-even-they")
  .addEventListener ("click", function() {
    let opmlData = document.implementation.createDocument(null, "opml", null);
    opmlData.getElementsByTagName("opml")[0].setAttribute("version", "1.0");
    let text = opmlData.createTextNode("Newspaper Newsreel Selection");
    let name = opmlData.createElement("title");
    let head = opmlData.createElement("head");
    let body = opmlData.createElement("body");
    let sections = document.querySelectorAll("#page-about #even h3");
    for (const section of sections) {
      let title = section.outerText;
      let category = opmlData.createElement("outline");
      category.setAttribute("title", title);
      category.setAttribute("text", title);
      category.setAttribute("type", "folder");
      list = section.nextElementSibling; // #page-about #even h3 + ul a:not(.not-an-xml)
      let lines = list.querySelectorAll("li");
      for (const line of lines) {
        link = line.querySelector("a:not(.not-an-xml)");
        if (link) {
          let outline = opmlData.createElement("outline");
          let title = link.outerText;
          let desc = line.outerText;
          let url = link.href;
          outline.setAttribute("title", title);
          outline.setAttribute("text", desc);
          // NOTE This value (rss) is arbitrary.
          // TODO Add type to class.
          //outline.setAttribute("type", "rss");
          outline.setAttribute("xmlUrl", url);
          category.appendChild(outline);
        }
      }
      body.appendChild(category);
    }
    head.appendChild(name);
    name.appendChild(text);
    opmlData.getElementsByTagName("opml")[0].appendChild(head);
    opmlData.getElementsByTagName("opml")[0].appendChild(body);
    let opmlFile = xmlSerializer.serializeToString(opmlData);
    savePage(
      opmlFile,
      "i2p-schimon-newspaper-even-they",
      "text/x-opml+xml",
      "opml"
    );
  });
//  return document;
//}

//function settleFilters(document) {
  // Hide all links to software that are not of news
  for (const element of document.querySelectorAll("#page-about #software div.content a")) {
    //if (element.className != "news") {
    if (!element.className.includes("news")) {
      element.classList.add("hide");
    }
  }

  // Create toggle mechanism
  for (const element of document.querySelectorAll("#page-about #software #filter .filter")) { // #filter > span
    if (element.id != "news") {
      element.classList.toggle("grey");
    }
    element.addEventListener ("click", function() {
      element.classList.toggle("grey");
      for (const span of document.querySelectorAll(`.${element.id}`)) {
        span.classList.toggle("hide");
      }
    });
  }

  // TODO set class="background" to system by navigator.platform
  // TODO switch () { case }
  if (navigator.platform.toLowerCase().includes("ubuntu"))  {
        document.querySelector("#ubports").classList.add("background");
  } else
  if (navigator.platform.toLowerCase().includes("tizen"))  {
        document.querySelector("#tizen").classList.add("background");
  } else
  if (navigator.platform.toLowerCase().includes("sailfish"))  {
        document.querySelector("#sailfish-os").classList.add("background");
  } else
  if (navigator.platform.toLowerCase().includes("kai"))  {
        document.querySelector("#gerda-os").classList.add("background");
  } else
  if (navigator.platform.toLowerCase().includes("android"))  {
        document.querySelector("#android-os").classList.add("background");
  } else
  if (navigator.platform.toLowerCase().includes("linux") ||
      navigator.platform.toLowerCase().includes("bsd")) {
        document.querySelector("#unix").classList.add("background");
  } else
  if (navigator.platform.toLowerCase().includes("mac"))  {
        document.querySelector("#mac-os").classList.add("background");
  } else
  if (navigator.platform.toLowerCase().includes("windows") ||
      navigator.platform.toLowerCase().includes("react"))  {
        document.querySelector("#react-os").classList.add("background");
  } else
  if (navigator.platform.toLowerCase().includes("ipad") ||
      navigator.platform.toLowerCase().includes("iphone"))  {
        document.querySelector("#ios").classList.add("background");
  }
//  return document;
//}

//function statusBar(document) {

  // Display entry title in status bar
  for (const element of document.querySelectorAll(".entry")) {
    element.addEventListener ("mouseover", function() {
      let title = this.querySelector(".title > a").textContent;
      if (this.querySelector(".author")) {
        let author = this.querySelector(".author").textContent;
        infoSquare(`${title} (${author})`);
      } else {
        infoSquare(`${title}`);
      }
    });
  }

  // Prepare links to be used with status bar
  for (const element of document.querySelectorAll("#control-bar *, #articles > a, #toc a, footer *")) {
    element.addEventListener ("mouseover", function() {
      //infoSquare(this.title);
      if (this.title) {
        this.setAttribute("info", this.title);
        // NOTE Consider to replace CSS rules by event listeners that would do the same tasks.
        // Reference: #toc a:hover
        //this.removeAttribute("title");
      }
      //infoSquare(`<b>Info:&nbsp</b> ${this.getAttribute("info")}`);
      infoSquare(`${this.getAttribute("info")}`);
    });
  }

/*
  // Remove status bar
  for (const element of document.querySelectorAll("#links-bar, footer")) {
  //for (const element of document.querySelectorAll("#links-bar a")) {
    element.addEventListener ("mouseleave", function() { // mouseout
      if (document.querySelector("#info-square")) {
        document.querySelector("#info-square").remove();
      }
    });
  }
//  return document;
//}
*/

//function bittorrent(document) {
  document
  //.querySelector(".category:has(#torrents)")
  //.parentElement
  .querySelector("#torrents")
  .addEventListener ("mouseover", function() {
    document
  .querySelector("#torrents h3")
  //.innerHTML = `<span class="text-icon orange">RSS</span> &amp; BitTorrent. It Is A Neverending Love Story…`;
  .innerHTML = `<span class="text-icon orange">Feeds</span> &amp; BitTorrent. The NeverEnding Story.`;
  // TODO Add animated effect which will be activated upon each event mouseover
  });
//  return document;
//}

//function noReferrer(document) {
  for (const element of document.querySelectorAll("a[href]")) {
    element.rel = "noreferrer";
  }
//  return document;
//}

}

// TODO
// The following events do not work on some pages: https://momi.ca/feed.xml
// Perhaps, confine them to some type of window.onload = (event) => { CODE }
// /questions/381744/is-there-anyway-to-change-the-content-type-of-an-xml-document-in-the-xml-docume
// /questions/23034283/is-it-possible-to-use-htmls-queryselector-to-select-by-xlink-attribute-in-an

function truncateToc(newDocument) {
  for (const titleToc of newDocument.querySelectorAll("#toc > li > a")) {
    if (titleToc.textContent.length > 70) {
      titleToc.title = titleToc.textContent.trim();
      titleToc.textContent =
        titleToc
        .textContent
        .substring(0, 70) + " […]";
    }
  }
  return newDocument;
}

function isGecko() {
  // Gecko
  let softwares = ["waterfox", "librewolf", "seamonkey", "thunderbird", "firefox"];
  for (let i = 0; i < softwares.length; i++) {
    if (navigator.userAgent.toLowerCase().includes(softwares[i])) {
      return softwares[i];
    }
  }
}

function isMoz() {
  let softwares = ["seamonkey", "thunderbird", "firefox"];
  for (let i = 0; i < softwares.length; i++) {
    if (navigator.userAgent.toLowerCase().includes(softwares[i])) {
      return softwares[i];
    }
  }
}

function setBanner(newDocument) {
  let aElement = newDocument.createElement("a");
  aElement.href = "https://falkon.org/?ref=newspaper";
  aElement.id = "feed-banner";
  newDocument.body.append(aElement);
  aElement.insertAdjacentHTML("beforeend", banner);
  return newDocument;
}

function setQuote(newDocument) {
  let divElement = newDocument.createElement("div");
  divElement.id = "feed-quote";
  newDocument.body.append(divElement);
  divElement.insertAdjacentHTML("beforeend", quote);
  return newDocument;
}

// TODO Write this function in a sensible manner
function getHomeLink(xmlFile, xmlRules) {
  let url = null;
  //console.log(xmlFile.querySelectorAll(xmlRules.feedLink))
  let links = xmlFile.querySelectorAll(xmlRules.feedLink);
  //links.forEach(link => {
  //  if (link.getAttribute("rel") == "alternate") {
  //    url = link.getAttribute("href");
  //  }
  //})
  for (let link of links) {
    if (link.getAttribute("rel") == "alternate") {
      url = link.getAttribute("href");
      break;
    }
  }
  for (let link of links) {
    if (url) { break; }
    let rel = link.getAttribute("rel");
    if (rel && rel != "alternate") { continue; }
    if (link.getAttribute("href")) {
      url = link.getAttribute("href");
      break;
    }
  }
  for (let link of links) {
    if (url) { break; }
    let rel = link.getAttribute("rel");
    if (rel && rel != "alternate") { continue; }
    if (link.textContent.length > 0) {
      url = link.textContent;
      break;
    }
  }

  // let links = xmlFile.querySelectorAll(xmlRules.feedLink), url = null;
  // 
  // for (let link of links) {
  //   if (url) break; // if url is already assigned, break the loop

  //   let rel = link.getAttribute("rel");
  //   if (["hub", "self", "search"].includes(rel)) {
  //     break;
  //   }
  //   if (link.getAttribute("rel") == "alternate") {
  //     url = link.getAttribute("href");
  //   } else if (link.textContent.length > 0) {
  //     url = link.textContent;
  //   }
  // }

  // SMF
  if (xmlFile.getElementsByTagName("smf:xml-feed")[0] &&
      xmlFile.getElementsByTagName("smf:xml-feed")[0].getAttribute("forum-url")) {
    url = xmlFile
          .getElementsByTagName("smf:xml-feed")[0]
          .getAttribute("forum-url");
          //.getAttribute("source");
  }

  if (url) {
    //if (url == document.baseURI) {
    // TODO https://aur.archlinux.org/rss/ and https://aur.archlinux.org/rss
    urlNow = document.baseURI.substring(document.baseURI.indexOf(":"));
    urlNew = url.substring(url.indexOf(":"));
    if (urlNew == urlNow ||             // Case HTTP and HTTPS
        urlNew.slice(0,-1) == urlNow || // Case rss and rss/
        urlNew == urlNow.slice(0,-1)) { // Case rss/ and rss
      url = document.location.protocol + "//" + document.location.hostname;
    }
    return url;
//} else {
//  return location.protocol + "//" + location.hostname;
  }
}

// FIXME https://lw1.at/en/postfeed.xml
function getDateXML(xmlFile, xmlRules) {
  let date;
  //if (xmlFile.getElementsByTagName("smf:xml-feed")[0]) {
  //  date = xmlFile.getElementsByTagName("smf:xml-feed")[0].getAttribute("generated-date-UTC");
  //} else
  if (xmlFile.querySelector(xmlRules.feedDate)) {
    date = xmlFile.querySelector(xmlRules.feedDate).textContent;
  } else
  if (xmlFile.querySelector(xmlRules.feedItemDate)) {
    date = xmlFile.querySelector(xmlRules.feedItemDate).textContent;
  } else
  if (xmlFile.querySelector(xmlRules.feedItemPublished)) {
    date = xmlFile.querySelector(xmlRules.feedItemPublished).textContent;
  } else {
    return null;
  }
  return date;
}

function motdAnnouncements(newDocument) {
  let eDetails = newDocument.createElement("details");
  eDetails.id = "urgent-message";
  eDetails.style.background = "#e5e3b3";
  eDetails.style.borderRadius = "10px";
  eDetails.style.color = "#000";
  eDetails.style.fontSize = "90%";
  eDetails.style.margin = "auto";
  eDetails.style.marginTop = "5em";
  eDetails.style.marginBottom = "5em";
  eDetails.style.padding = "1em";
  eDetails.style.width = "60%";
  newDocument.body.append(eDetails);
  let eSummary = newDocument.createElement("summary");
  eSummary.style.lineHeight = "2em";
  eSummary.innerHTML = "<b>MOTD and urgent announcements</b><p>These are urgent announcements, including of life danger, that concern to Atom, RSS, XSLT, The RSS Task Force, and our families.</p>"
  eDetails.append(eSummary)
  // Child Predatory Service
  let cpsDiv = newDocument.createElement("details");
  cpsDiv.style.margin = "1em";
  let cpsS = newDocument.createElement("summary");
  cpsS.innerHTML = "<b>Child Predatory Service</b><p>Our daughter has been kidnapped by Germany. This is a <u>life danger</u>.<p>";
  cpsDiv.append(cpsS);
  let cpsP = newDocument.createElement("p");
  cpsP.innerHTML = `
<p>We do not know whether she receives her anemia medicine since they claim that we "invented the anemia".</p>
<p>Please help us by downloading and sharing these resources.</p>
<ol>
<li><a href="https://metalhead.club/@error">@error@metalhead.club</a>
<li><a href="https://metalhead.club/@error.rss">@error@metalhead.club (RSS feed)</a>
<li><a href="https://youtube.com/@kidmafiaComedy">@kidmafiaComedy (Channel)</a></li>
<li><a href="https://youtube.com/@kidmafiaComedy/videos">@kidmafiaComedy (Videos)</a></li>
<li><a href="https://youtube.com/@kidmafiaComedy/shorts">@kidmafiaComedy (Short videos)</a></li>
</ol>
<p>Last updated at October 26, 2025</p>
`;
  cpsDiv.append(cpsP);
  eDetails.append(cpsDiv);
  // Attempt on XSLT
  let xsltDiv = newDocument.createElement("details");
  xsltDiv.style.margin = "1em";
  let xsltS = newDocument.createElement("summary");
  xsltS.innerHTML = "<b>RSS and XSLT</b><p>Six organizations conspire against RSS and XSLT.</p>";
  xsltDiv.append(xsltS);
  let xsltP = newDocument.createElement("p");
  xsltP.innerHTML = `
<p>Several organizations attempt on XSLT again, including W3C.</p>
<p>Please inform your family and friends at the Dinner Table.</p>
<ol>
<li><a href="http://wok.oblomov.eu/tecnologia/google-killing-open-web-2/">Inform yourself of the "proxy war" to try to suppress XSLT 2.0 and XSLT 3.0; and, by that, to destroy our financial systems.</a></li>
<li><a href="http://xslt.rip">XSLT.RIP - Join to the campaign!</a></li>
<li><a href="https://camendesign.com/blog/rss_is_dying">An article from January 3rd, 2011 which has predicted this occurrence.</a></li>
</ol>
<p>Last updated at November 19, 2025</p>
`;
  xsltDiv.append(xsltP);
  eDetails.append(xsltDiv);
  let button = newDocument.createElement("button");
  button.textContent = "Dismiss";
  eDetails.append(button);
}

function feedInfo(newDocument, feed) {
  // metadata
  let keys =   [
        "language",
        "description",
        "uri",
        "generator",
        "update-frequency",
        "update-period",
        "updated",
        "type"],
      values = [
        feed.language,
        feed.subtitle,
        feed.link, //getHomeLink(xmlFile, xmlRules),
        feed.generator.name,
        feed.update.frequency,
        feed.update.period,
        feed.date, //getDateXML(xmlFile, xmlRules),
        feed.type];
  for (let i = 0; i < keys.length; i++) {
    let elementMeta = newDocument.createElement("meta");
    let name = keys[i];
    let content;
    if (values[i]) {
      content = values[i].trim();
    }
    if (content) {
      elementMeta.setAttribute("name", name);
      elementMeta.setAttribute("content", content);
      newDocument.head.appendChild(elementMeta);
    }
  }
  if (feed.base) {
    let elementBase = newDocument.createElement("base");
    // Set href in function postProcess().
    //elementBase.href = feed.base;
    elementBase.href = "";
    newDocument.head.appendChild(elementBase);
  }
  /*
  let icon;
  if (feed.icon) {
    icon = feed.icon;
  } else {
    icon = GM.getResourceURL("atom.svg");
  }
  */
  if (feed.icon) {
    let elementLink = newDocument.createElement("link");
    elementLink.href = feed.icon;
    elementLink.rel = "icon";
    let filename = feed.icon.split("/").pop();
    if (filename.includes(".")) {
      let extension = filename.split(".").pop();
      elementLink.type = "image/" + extension;
    }
    newDocument.head.appendChild(elementLink);
  }

  let divElement = newDocument.createElement("div");
  divElement.id = "feed-info";
  let spanElement = newDocument.createElement("span");
  spanElement.textContent = feed.type;
  divElement.append(spanElement);
  if (feed.generator.name) {
    // NOTE Adding colons should probably be done by CSS.
    spanElement.textContent = `${feed.type} : `;
    let text = feed.generator.name;
    let uri = feed.generator.uri;
    let version = feed.generator.version;
    if (uri) {
      let elementGenerator = newDocument.createElement("a");
      elementGenerator.href = uri;
      elementGenerator.style.color = "unset";
      elementGenerator.style.fontWeight = "bold";
      elementGenerator.style.textDecoration = "none";
      elementGenerator.textContent = text;
      elementGenerator.title = `Version: ${version}`;
      divElement.append(elementGenerator);
    } else if (text) {
      let elementGenerator = newDocument.createElement("span");
      elementGenerator.style.fontWeight = "bold";
      elementGenerator.textContent = text;
      divElement.append(elementGenerator);
    }
  }
  if (feed.date) {
    // FIXME No date for https://parlament.mt/en/rss/?t=calendar
    let spanElement = newDocument.createElement("span");
    spanElement.innerHTML = ` : Updated at <span class="published">${feed.date}</span>`;
    divElement.append(spanElement);
  }
  newDocument.body.append(divElement);
}

// FIXME Falkon
// Blocked due to server policy
// https://archlinux.org/feeds/packages/
// https://openstreetmap.org/traces/rss
// https://artemislena.eu/feed.json
// https://pypi.org/rss/updates.xml

function hideQuote(newDocument) {
  newDocument
  .querySelector(".quote.content")
  .addEventListener ("dblclick", function() {
    newDocument
  .querySelector(".quote.content")
  .style
  .display = "none";
  });
  return newDocument;
}

function _subToMe(instance) {
  for (const element of document.querySelectorAll(".subscribe-link")) {
    element.href = `https://${instance}/#/subscribe?feeds=${location.href}`;
  }
}

// NOTE Is this "for" loop required?
function subToMe(instance) {
  for (const service of document.querySelectorAll(".subscribe-link")) {
    if (document.contentType.endsWith("xml")) {
      service.href = `https://${instance}/#/subscribe?feeds=${location.href}`;
    } else {
      service.removeAttribute("href");
      service.addEventListener ("click", function() {
      (function(btn){
        let z = document.createElement("script");
        document.subtomeBtn = btn;
        z.src = `https://${instance}/load.js`;
        document.body.appendChild(z);
      })(service);
        return false;
      });
    }
  }
}

async function toggleMode() {
  let mode = document.querySelector("#mode");
  cssSelectors = [
    "a", "body", "code", ".enclosures", ".resources", "#control-bar-container",
    "#empty-feed", "#info-square"];
    if (gmGetValue && gmSetValue) {
      //GM.unregisterMenuCommand(menuView);
      if (await GM.getValue("view-mode") == "dark") {
        await GM.setValue("view-mode", "bright");
        //mode.textContent = "Light View";
        //mode.textContent = "💡";
        //mode.textContent = "◐";
        mode.style.filter = "saturate(7)"; // revert
        mode.title = "Switch to dark mode";
        infoSquare("Bright mode");
        for (let cssSelector of cssSelectors) {
          for (let element of document.querySelectorAll(cssSelector)) {
            element.classList.remove("dark");
          }
        }
        //menuView = await GM.registerMenuCommand(
        //  "🌙 Dark mode, () => toggleMode(),
        //  "T");
      } else {
        await GM.setValue("view-mode", "dark");
        //mode.textContent = "Dark View";
        //mode.textContent = "🌙";
        //mode.textContent = "●";
        mode.style.filter = "hue-rotate(300deg)"; // invert
        mode.title = "Switch to bright mode";
        infoSquare("Dark mode");
        for (let cssSelector of cssSelectors) {
          for (let element of document.querySelectorAll(cssSelector)) {
            element.classList.add("dark");
          }
        }
        //menuView = await GM.registerMenuCommand(
        //  "☀ Bright mode, () => toggleMode(),
        //  "T");
      }
    } else {
      if (document.querySelector("#feed .dark")) {
        mode.style.filter = "saturate(7)"; // revert
        mode.title = "Switch to bright mode";
        infoSquare("Dark mode");
        for (let cssSelector of cssSelectors) {
          for (let element of document.querySelectorAll(cssSelector)) {
            element.classList.remove("dark");
          }
        }
      } else {
        mode.style.filter = "hue-rotate(300deg)"; // invert
        mode.title = "Switch to dark mode";
        infoSquare("Bright mode");
        for (let cssSelector of cssSelectors) {
          for (let element of document.querySelectorAll(cssSelector)) {
            element.classList.add("dark");
          }
        }
      }
    }
}

/*
function toggleMode() {
  let mode = document.querySelector("#mode");
  mode.addEventListener ("click", function() {
    cssSelectors = [
      "body", "code", "a", ".enclosures", ".resources", "#empty-feed"];
    for (let cssSelector of cssSelectors) {
      for (let element of document.querySelectorAll(cssSelector)) {
        //element.style.color = "#f5f5f5";
        element.classList.toggle("dark");
      }
    }
    if (document.querySelector("body.dark")) {
      mode.textContent = "Light View";
      mode.title = "Switch to bright mode";
    } else {
      mode.textContent = "Dark View";
      mode.title = "Switch to dark mode";
    }
    //document.querySelector("#links-bar > a:nth-child(1)").style.color = "#333";
    //document.body.style.background = "#333";
  });
}
*/

function navigateToItem(currentEntry) {
  document.querySelectorAll(".entry")[currentEntry].scrollIntoView();
}

  /*
  window.addEventListener ("hashchange", function() {
    document.querySelector("#links-bar").style.display = "none";
  });
  */

  /*
  window.addEventListener ("scroll", function() {
    const elementTitle = document.querySelector("#title");
    const elementStyle = document.getElementById(namespace);
    if (isInViewport(elementTitle)) {
      elementStyle.textContent = stylesheetBase;
    } else {
      elementStyle.textContent = stylesheetBase + stylesheetBar;
    }
  });
  */

  /*
  // FIXME This is a safer fashion to do this task,
  //       specifically against server policy.
  // NOTE Element is created, albeit without type="text/css",
  //      but no change applied, not even with !important
  window.addEventListener ("scroll", function() {
    const elementTitle = document.querySelector("#subtitle");
    let elementStyle = document.querySelector("#bar");
    if (isInViewport(elementTitle) && elementStyle) {
      if (elementStyle) {
        elementStyle.remove();
      }
    } else if (!elementStyle) {
      elementStyle = document.createElement("style");
      document.head.append(elementStyle);
      elementStyle.textContent = stylesheetBar;
      elementStyle.type = "text/css";
      elementStyle.id = "bar";
    }
  });
  */

function imageData() {
  /* TODO handle loading of images by saving bandwidth
  document.body.addEventListener ("mouseover", function(e) {
    if (e.target && e.target.nodeName == "IMG" && !e.target.src) {
      console.log("DELEGATED");
      source = e.target.getAttribute("src-data");
      e.target.removeAttribute("src-data");
      e.target.src = source;
    }
  });

  for (const image of document.querySelectorAll("img")) {
    image.addEventListener("mouseover", loadImage(image));
    //image.onmouseover = () => {
    //  image.removeEventListener("mouseover",loadImage(image));
    //}
  }
  */

  /*
  for (const image of document.querySelectorAll("img")) {
    image.addEventListener("focus",event => {
    //image.addEventListener("mouseover",event => {
      if (image.getAttribute("src-data")) {
        //toggleAttribute(image);
        source = image.getAttribute("src-data");
        image.removeAttribute("src-data");
        image.src = source;
      }
    }, {passive: true});
    image.onmouseover = () => {
      if (image.getAttribute("src-data")) {
        //toggleAttribute(image);
        source = image.getAttribute("src-data");
        image.removeAttribute("src-data");
        image.src = source;
      }
    };
  }
  */
}

// Create status bar
function infoSquare(text) {
  document.querySelector("#info-square").textContent = text;
  /*
  if (document.querySelector("#info-square")) {
    document.querySelector("#info-square").remove();
  }
  */
  //let divElement = document.querySelector("#info-square");
  //divElement.innerHTML = text; // codeberg feeds
  // TODO Sanitize titles from HTML tags and re-place them.
  // NOTE divElement.innerHTML raises error for some title
  // of https://events.ccc.de/feed
  //divElement.textContent = text;
}

// /questions/123999/how-can-i-tell-if-a-dom-element-is-visible-in-the-current-viewport
// https://javascripttutorial.net/dom/css/check-if-an-element-is-visible-in-the-viewport/
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function loadImage(image) {
  //image.removeEventListener("mouseover",loadImage(image));
  console.log("onmouseover");
  let source = image.getAttribute("src-data");
  image.removeAttribute("src-data");
  image.src = source;
}

/* TODO handle loading of images by saving bandwidth
function toggleAttribute(image) {
    source = image.getAttribute("src-data");
    image.removeAttribute("src-data");
    image.src = source;
}
*/

/* TODO handle loading of images by saving bandwidth
for (const image of document.querySelectorAll("img")) {
  //source = image.src;
  //image.removeAttribute("src");
  //image.setAttribute("src-data", source);
  image.setAttribute("src-data", image.src);
  image.removeAttribute("src");
}
*/

/* TODO remove or parse <aside> or refer to XSLT to parse it as HTML
// https://web.dev/feed.xml
// /questions/9848465/js-remove-a-tag-without-deleting-content
for (const aside of document.querySelectorAll("aside")) {
  aside.remove();
}
*/

function pageLoader(message, type) {

  let newDocument, insertDocument, removeDocument, loading, please;

  if (type == "error") {
    loading = "An error has occured during attempt to parse this document.";
    please = "Please report of this concern to the developer.";
  } else {
    loading = "Loading syndication feed document.";
    please = "Please wait…";
  }
  // /questions/6464592/how-to-align-entire-html-body-to-the-center
  const loadPage = `
<html>
  <head>
    <title>Newspaper</title>
    <style>
      html, body {
        height: 100%; }

      html {
        display: table;
        margin: auto; }

      body {
        display: table-cell;
        vertical-align: middle;
        background-color: #f1f1f1;
        font-family: system-ui;
        cursor: default;
        /* user-select: none; */
        max-height: 100%;
        max-width: 100%; }

      dl {
        font-size: 4vw;
        /* font-style: italic; */
        /* text-align: center; */
        text-align: left; }

      #title {
        font-size: 5vw;
        font-style: unset;
        font-weight: bold; }

      body.dark {
        background: #333;
        color: #f5f5f5; }
    </style>
  </head>
  <body>
    <dl>
      <dt>📰 <b>Newspaper</b></dt>
      <dd>${loading}</dd>
      <dd>${message}. ${please}</dd>
    </dl>
  </body>
</html>`;

  newDocument = domParser.parseFromString(loadPage, "text/html");
  if (viewMode == "dark") {
    newDocument.querySelector("body").classList.add("dark");
  }
  insertDocument = document.importNode(newDocument.documentElement, true);
  removeDocument = document.documentElement;
  document.replaceChild(insertDocument, removeDocument);
}

// export file
// /questions/4545311/download-a-file-by-jquery-ajax
// /questions/43135852/javascript-export-to-text-file
var savePage = (function () {
  let a = document.createElement("a");
  // document.body.appendChild(a);
  // a.style = "display: none";
  return function (fileData, fileName, fileType, fileExtension) {
    let blob = new Blob([fileData], {type: fileType}),
        url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName + "." + fileExtension;
    a.click();
    window.URL.revokeObjectURL(url);
  };
}());

(async function registerMenuCommand(){
  if (gmRegisterMenuCommand) {
//    contentMode = await getContentMode();
//    enableIcon = await getIconMode();
//    enableEnclosure = await getEnclosureMode();
//    fontType = await getFontType();
//    filterBlacklist = await getFilterBlacklist();
//    filterWhitelist = await getFilterWhitelist();
//    handlerInstance = await getHandlerInstance();
//    handlerUrl = await getHandlerUrl();
//    keywordsBlacklist = await getKeywordsBlacklist();
//    keywordsWhitelist = await getKeywordsWhitelist();
//    minimumItemNumber = await getMinimumItemNumber() -1;
//    playEnclosure = await getAudioEnclosureMode();
//    subscriptionHandler = await getSubscriptionHandler();
    await GM.registerMenuCommand(
      "📡 Detect subscriptions",
      () => scanDocument(),
      "S");
    await GM.registerMenuCommand(
      "🎛 Display preferences",
      () => displayPreferences(),
      "P");
  }
})();

async function displayPreferences() {
  await GM.registerMenuCommand(
    "📶 Detection (Automated)",
    () => togglePreference("Automatic detection", "detection-scan"),
    "A");
  await GM.registerMenuCommand(
    "🎫 Detection (Notification)",
    () => togglePreference("Detection notification", "detection-notification"),
    "N");
  await GM.registerMenuCommand(
    "🎹 Document (Audio playback)",
    () => togglePreference("Playback", "play-enclosure"),
    "K");
  await GM.registerMenuCommand(
    "🖼 Document (Display of graphics)",
    () => togglePreference("Graphic", "show-icon"),
    "G");
  await GM.registerMenuCommand(
    "📝 Document (Routine number of items)",
    () => setSettingValue("Routine number of items", "Set a routine number of items to display.", "item-number"),
    "I");
//  await GM.registerMenuCommand(
//    "💡 Document (Mode)",
//    () => togglePreference("view-mode", "dark", "bright"),
//    "M");
  await GM.registerMenuCommand(
    "📢 Document (MOTD)",
    () => togglePreference("MOTD", "motd"),
    "T");
  await GM.registerMenuCommand(
    "📈 Filtering of contents (Allow)",
    () => togglePreference("Filter (Allow)", "filter-whitelist"),
    "W");
  await GM.registerMenuCommand(
    "📉 Filtering of contents (Deny)",
    () => togglePreference("Filter (Deny)", "filter-blacklist"),
    "D");
  await GM.registerMenuCommand(
    "🖊 Font (Size)",
    () => setSettingValue("Font size", "Set font size (pixel).", "font-size"),
    "F");
//await GM.registerMenuCommand(
//  "Font type",
//  () => setSettingValue("Font type", "Set font type (e.g. arial, sans, serif).", "font-type"),
//  "T");
  notification("Preferences items are now loaded into the menu", "🎛");
}

async function togglePreference(title, key) {
  if (await GM.getValue(key)) {
    message = `${title} is disabled.`;
    value = false;
  } else {
    message = `${title} is enabled.`;
    value = true;
  }
  await GM.setValue(key, value);
  notification(message, "🎛");
}

function isListed(content, keywords) {
  for (let keyword of keywords.split(",")) {
    for (let character of [" ", "’", "'", "-", '"', ":", ";", ",", "."]) {
      if (keyword.length && content.includes(" " + keyword + character)) {
        return true;
      }
    }
  }
}

function possibleAtomDocument(xmlFile, feed) {
  let nodeRss = xmlFile.queryPath(null, "rss");
  //if (feed.type.toLowerCase().includes("rss") &&
  if (feed.type == "RSS 2.0" &&
      !location.pathname.endsWith(".atom") &&
      !location.pathname.endsWith(".rss") &&
      !location.pathname.endsWith(".xml") &&
      (
        (location.pathname.endsWith("/feed") ||
         location.pathname.endsWith("/feed/") ||
         location.pathname.endsWith("/comments/feed/")) &&
        (feed.generator &&
         feed.generator.name &&
         (feed.generator.name.includes(".org/?v=") ||
          feed.generator.name.includes(".com/"))
        ) ||
        //xmlFile.getElementsByTagNameNS(xmlns.atom,"rss").length &&
        (!nodeRss.getAttribute("xmlns:podcast") &&
         !nodeRss.getAttribute("xmlns:rawvoice") &&
         nodeRss.getAttribute("xmlns:atom") == xmlns.atom &&
         //nodeRss.getAttribute("xmlns:wfw") == xmlns.wfw &&
         nodeRss.getAttribute("xmlns:content") == xmlns.content &&
         nodeRss.getAttribute("xmlns:dc") == xmlns.dc &&
         //nodeRss.getAttribute("xmlns:slash") == xmlns.slash &&
         nodeRss.getAttribute("xmlns:sy") == xmlns.sy)
       )
     ) {
    return true;
  } else {
    return false;
  }
}

// Remove "style" attribute from all elements recursively
function removeStyleAttribute(element) {
  // Remove style attribute from the current element
  element.removeAttribute("style");

  // Recursively call this function for each child element
  Array.from(element.children).forEach(child => {
    removeStyleAttribute(child);
  });
}

function extractEnclosureFilename(enclosureUrl) {
  for (let protocol of ["ftp", "gemini", "gopher", "http"]) {
    if (enclosureUrl.startsWith(protocol)) {
      return enclosureUrl.split("/").pop();
    }
  }
  if (enclosureUrl.startsWith("magnet")) {
    let url = new URL(enclosureUrl);
    return url.searchParams.get("dn");
  } else
  if (enclosureUrl.startsWith("ed2k")) {
    let sections = enclosureUrl.split("|");
    let isSectionFile = false;
    for (let section of sections) {
      if (!isSectionFile) {
        if (section.toLowerCase() == "file") {
          isSectionFile = true;
        }
      } else {
        return section.replaceAll("%20"," ");
      }
    }
  } else {
    return enclosureUrl.split("/").pop();
  }
}

function delay(milliseconds) {
  let anchorDate = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - anchorDate < milliseconds);
}

function scanDocument() {
  console.info("📰 Greasemonkey Newspaper: Scanning for syndicated documents…");
  if (detectionNotification) {
    notification("Scanning for syndicated documents…", "📡");
  }
  let subscriptions = 0,
      mimeTypes = [
        "application/activity+xml",
        "application/activitystream+xml",
        "application/atom+xml",
        "application/feed+json",
        "application/gemini+text",
        "application/pubsub+xml",
        "application/rdf+xml",
        "application/rss+json",
        "application/rss+xml",
        "application/smf+xml",
        "application/stream+xml",
        "application/twtxt+text",
        "text/gemini",
        "text/twtxt",
        "text/twtxt+plain"
      ];
  for (let mimeType of mimeTypes) {
    let results = document.head.querySelectorAll(`link[type="${mimeType}"`);
    /*
    results = document.head.queryPathAll(
      null,
      //`link[@rel="alternate" and contains(@type, "${mimeType}")]`);
      `link[@rel="alternate" and @type="${mimeType}"]`);
    */
    for (let result of results) {
      let a = document.createElement("a");
      if (result.href.startsWith("feed:")) {
        result.href = result.href.replace("feed:", "http:");
      } else
      if (result.href.startsWith("itpc:")) {
        result.href = result.href.replace("itpc:", "http:");
      } else {
      }
      a.href = result.href;
      a.title = mimeType;
      a.textContent = result.title || result.href;
      a.style.color = "#eee";
      for (let i = 0; i < a.style.length; i++) {
        a.style.setProperty(
          a.style[i],
          a.style.getPropertyValue(a.style[i]),
          "important"
        );
      }
      subscriptions += 1;
      console.info(`📰 Greasemonkey Newspaper: Subscription #${subscriptions} ${result.title}`);
      console.info(`📰 Greasemonkey Newspaper: Subscription #${subscriptions} ${result.href}`);
      if (gmRegisterMenuCommand) {
        GM.registerMenuCommand(
          `📰 ${result.title}`,
          //() => window.open(result.href, "_blank"));
          () => window.open(result.href, "_self")
        );
      }
    }
  }
  if (subscriptions) {
    console.info(`📰 Greasemonkey Newspaper: This site offers ${subscriptions} subscriptions.`);
    if (detectionNotification) {
      if (detectionNotification) {
        notification(`This site offers ${subscriptions} subscriptions.`, "🎫");
      }
    }
  }
}

function getNodeByXPath(node, query) { // FIXME
  res = document.evaluate(
    query, node, null,
    XPathResult.ANY_UNORDERED_NODE_TYPE);
  nRes = result.singleNodeValue;
  return nRes;
}

function queryByXPath(node, queries) {
  let result, i = 0;
  do {
    result = document.evaluate(
      queries[i], document,
      null, XPathResult.STRING_TYPE);
    i = i + 1;
    result = result.stringValue;
  } while (!result && i < queries.length);
  return result;
}

/*
function queryPathAll(data, node, xmlns, expression) {
  nodes = data.evaluate(
    expression, node, () => xmlns, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
  let results = [];
  if (nodes) {
    let node = nodes.iterateNext();
    while (node) {
      // Add the link to the array
      results.push(nodes.nodeValue);
      // Get the next node
      node = nodes.iterateNext();
    }
  }
  return results;
}

function queryPath(data, node, xmlns, expression) {
  return data.evaluate(
    expression, node, () => xmlns, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
    .singleNodeValue;
}
*/

Node.prototype.queryPathAll = function (xmlns, expression) {
  let data = this.ownerDocument || this;
  let nodes = data.evaluate(
    expression,
    this,
    () => xmlns,
    XPathResult.ORDERED_NODE_ITERATOR_TYPE,
    null);
  let results = [];
  let node = nodes.iterateNext();
  while (node) {
    // Add the link to the array
    results.push(node);
    // Get the next node
    node = nodes.iterateNext();
  }
  return results;
};

Node.prototype.queryPath = function (xmlns, expression) {
  let data = this.ownerDocument || this;
  return data.evaluate(
    expression,
    this,
    () => xmlns,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null)
    .singleNodeValue;
};

function characterAsSvgDataUri(character) {
  // An SVG string with a character.
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <text y=".9em" font-size="90">${character}</text>
    </svg>
  `;
  // Encode the SVG string to base64.
  const base64Svg = btoa(unescape(encodeURIComponent(svgString)));
  // Return a data URL.
  return `data:image/svg+xml;base64,${base64Svg}`;
}

function notification(message, graphics) {
  if (gmNotification) {
    GM.notification(message, "📰 Greasemonkey Newspaper", characterAsSvgDataUri(graphics));
  }
}
