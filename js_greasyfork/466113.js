// ==UserScript== 
// @name        HTTP Unplugged
// @author      Schimon Jehudah, Adv.
// @namespace   i2p.schimon.blackbelt
// @homepageURL https://greasyfork.org/scripts/466113-http-unplugged
// @supportURL  https://greasyfork.org/scripts/466113-http-unplugged/feedback
// @copyright   2023 - 2025, Schimon Jehudah (http://schimon.i2p)
// @license     MIT; https://opensource.org/licenses/MIT
// @description Find and display links inside a bar; Type of links: chat, contact, email, geo, magnet, media documents, metalinks, podcasts, syndication feeds, torrents and userscripts and wallets.
// @match       file:///*
// @match       *://*/*
// @version     25.10.07
// @grant       GM.registerMenuCommand
// @run-at      document-end
// @noframes
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB5PSIuOWVtIiBmb250LXNpemU9IjkwIj7wn5SMPC90ZXh0Pjwvc3ZnPgo=
// @downloadURL https://update.greasyfork.org/scripts/466113/HTTP%20Unplugged.user.js
// @updateURL https://update.greasyfork.org/scripts/466113/HTTP%20Unplugged.meta.js
// ==/UserScript==

// NOTE
// Robe icons (Sauna pack) created by Freepik
// https://www.flaticon.com/free-icon/robe_2520932
// https://www.flaticon.com/authors/freepik
// https://www.freepik.com/

// TODO
//
// 0) Bar like https://www.croxyproxy.com/
//             /articles/2012/09/07/skateboarding_in_kabul
//
// 0) Decode string for magnet links
//    https://btdig.com/9fe6281eaf39f8bee656f27cacf48713c0608c3e/20-birds-&-animals-books-collection-pack-4
//
// 0) Tooltip
//    https://www.w3schools.com/howto/howto_css_tooltip.asp
//    or DIV on the middle or center of screen
//    https://web.archive.org/web/20050423235409/http://karmatics.com/aardvark/
//    https://css-tricks.com/quick-css-trick-how-to-center-an-object-exactly-in-the-center/
//
// 1) Brand: Access Bar, Alt Bar, Black Bar, Black Belt, Black Robe, Distribar, Distributed Bar, Distribution Bar, Easy Access Bar, Free Bar, Freenet Bar, Handler Bar, Harvest Bar, IETF Bar, IETF Black Bar, IETF ToolBar, Instant Media Bar, Media Bar, Power Bar, Power Download Bar, Reaping Bar, Simple Access Bar, Simple Bar, Super Bar,

// NEW BRANDS: 🔌 Unplug // 🐟 Protocols // 🔌 HTTP Unplugged
// http://unplug.mozdev.org/

// 2) Recognize btih of 32 and convert it to 40
//
// 3) Check cache links for none 200 code
//    https://bookshelf.theanarchistlibrary.org/library/librarian-previous-announcements-en
//
// 4) FIXME feedx
//    http://freebase.be/db/software.rss.xml
//
// 5) Case insensitive (XPath)
//    String.prototype.toLowerCase()
//    See 'Magnet:' heperlink at https://ddosecrets.com/wiki/Rosatom
//    See getPathTo()
//
// 6) Fetch button (guess on demand) instead of auto-guess
//    Find file by Hash or ID (Hint: find duplicate chars/strings)
//
// 7) Display software for IPFS, GPS, Monero, RSS, SIP, Tribler, XMPP
//
// 8) Market diaspora*, Linux, Mastodon, ownCloud, RetroShare
//
// 9) TODO cancel *:after "open in new tab" https://cookidoo.thermomix.com/foundation/en-US

// blackberry appworld.blackberry.com
// nokia store.ovi.com
// palm
// weixin://dl/chat?
// VK vkontakt

// 'pge,✉️,contact,Contact'
const types = {
  "feed" : {
    "name" : "📰 Follow", // 🗞️ 🔔 索 參
    "description" : "Subscribe to syndication news feeds.",
    "reference" : "Install <a href='https://otter-browser.org' style='color:#eee'>Otter Browser</a>, <a href='https://lzone.de/liferea/' style='color:#eee'>Liferea</a>, <a href='https://ravenreader.app' style='color:#eee'>Raven Reader</a>, or <a href='https://netnewswire.com' style='color:#eee'>NetNewsWire</a>.",
    "alternate" : [
     "atom", "rss", "rdf", "stream",
     "feed", "feed+json"], // json
    "extension" : [
     "atom", "atom.php", "atom.xml",
     "rss", "rss.php", "rss.xml",
     "rdf", "rdf.php", "rdf.xml",
     "feed.xml", "feed.json", "rss.json"],
    "path" : ["/feed/atom", "/feed/atom/",
    "/feed", "/feed/", "app.php/feed"],
    // http://blogs.openaether.org/?p=108
    // "uri" : ["feed", "news"]
  },
  "microsummary" : {
    "name" : "📢 Microsummary",
    "description" : "Subscribe to notifications.",
    "rel" : ["microsummary"]
  },
  "opml" : {
    "name" : "⭕ OPML",
    "description" : "Import subscriptions collections.",
    "reference" : "Install <a href='https://lzone.de/liferea/' style='color:#eee'>Liferea</a>, or <a href='https://ravenreader.app' style='color:#eee'>Raven Reader</a>.",
    "alternate" : ["opml"],
    "extension" : ["opml"]
  },
  "podcast" : {
    "name" : "📡 Stream",
    "description" : "Listen to multimedia streams.",
    "reference" : "Install <a href='https://mpv.io' style='color:#eee'>MPV</a>, or <a href='http://videolan.org' style='color:#eee'>VLC</a>.",
    "uri" : ["mms"]
  },
  "podcast" : {
    "name" : "🎙️ Podcast", // 🎧
    // http://blogs.openaether.org/?p=108
    "description" : "Subscribe to podcast channels.",
    "reference" : "Install <a href='https://lzone.de/liferea/' style='color:#eee'>Liferea</a>, or <a href='https://ravenreader.app' style='color:#eee'>Raven Reader</a>.",
    "uri" : ["itpc"],
    "extension" : ["podcast.xml"]
  },
  "asc" : {
    "name" : "🗝️ Encryption Keys", // 🔐
    "description" : "Additional Sense Code.",
    "extension" : ["asc", "asc.txt"]
  },
  "cso" : {
    "name" : "🔍 CCSO",
    "description" : "Search over CCSO.",
    "uri" : ["cso"]
  },
  "deltachat" : {
    "name" : "𝛿 DeltaChat",
    "description" : "Chat over DeltaChat.",
    "reference" : "Install <a href='https://delta.chat' style='color:#eee'>Delta Chat</a>.",
    "uri" : ["dcaccount", "openpgp4fpr"]
  },
  "gpg" : {
    "name" : "🗝️ Encryption keys", // 🔐
    "description" : "OpenPGP.",
    "extension" : ["gpg", "gpg.txt"]
  },
  "pgp" : {
    "name" : "🗝️ Encryption Keys", // 🔐
    "description" : "Pretty Good Privacy.",
    "extension" : ["pgp", "pgp.txt"]
  },
  "mail" : {
    "name" : "✉️ Email", // 📮
    "description" : "Send Email messages.",
    "reference" : "Install <a href='https://claws-mail.org' style='color:#eee'>Claws Mail</a>.",
    "uri" : ["mailto"],
    "rejects" : ["mailto:?"]
  },
  "ftp" : {
    "name" : "📂 FTP",
    "description" : "File Transfer Protocol.",
    "reference" : "Install <a href='https://gftp.org' style='color:#eee'>gFTP</a>, or <a href='https://filezilla-project.org' style='color:#eee'>FileZilla</a>.",
    "uri" : ["ftp", "ftps", "ftpsi", "fsp"]
  },
  "nostr" : {
    "name" : "🦜 Nostr",
    "description" : "The timeless network.",
    "uri" : ["damus", "freefrom", "intent", "nos", "nostr", "primal", "yakihhone"],
    "address" : ["damus.io", "primal.net", "snort.social"]
  },
  "telnet" : {
    "name" : "🖥 Telnet",
    "description" : "Telnet.",
    "uri" : ["telnet"]
  },
  "ssh" : {
    "name" : "🖥 SSH",
    "description" : "OpenBSD Secure SHell.",
    "reference" : "Install <a href='https://gftp.org' style='color:#eee'>gFTP</a>.",
    "uri" : ["ssh", "ssh1"]
  },
  "twtxt" : {
    "name" : "📄 Twtxt",
    "description" : "Twtxt publishing format.",
    "extension" : ["tw.txt", "twtxt.txt"],
    "path" : ["/feed/twtxt", "/feed/twtxt/"],
    "address" : [
      "yarn.social/external",
      "txt.sour.is/external"]
  },
  "bunker" : {
    "name" : "🗝️ Encryption key",
    "description" : "Nostr bunker codes.",
    "uri" : ["bunker"]
  },
  "card" : {
    "name" : "🪪 Card", // 📇
    "description" : "Virtual contact files.",
    "extension" : ["vcard", "vcf"]
  },
  "webdav" : {
    "name" : "🗃️ WebDAV",
    "description" : "Web Distributed Authoring and Versioning.",
    "uri" : ["dav", "davs"]
  },
  "geo" : {
    "name" : "📍️ Location", // 🗺️
    "description" : "Geographic coordinations.",
    "extension" : [
     "gpx", "geojson", "kml", "kmx"],
    "uri" : ["geo", "waze"]
  },
  "gemini" : {
    "name" : "💎️ Gemini", // 🔮
    "description" : "Gemini realm.",
    "reference" : "Install <a href='https://gmi.skyjake.fi/lagrange/' style='color:#eee'>Lagrange</a>, or <a href='https://www.marmaladefoo.com/pages/geminaut' style='color:#eee'>GemiNaut</a>.",
    "uri" : ["gemini"]
  },
  "gopher" : {
    "name" : "🦦 Gopher",
    "description" : "Gopher realm.",
    "reference" : "Install <a href='https://gmi.skyjake.fi/lagrange/' style='color:#eee'>Lagrange</a>, or <a href='https://www.marmaladefoo.com/pages/geminaut' style='color:#eee'>GemiNaut</a>.",
    "uri" : ["gopher"]
  },
  "finger" : {
    "name" : "☝ Finger",
    "description" : "Finger realm.",
    "reference" : "Install <a href='https://gmi.skyjake.fi/lagrange/' style='color:#eee'>Lagrange</a>, or <a href='https://kristall.random-projects.net' style='color:#eee'>Kristall</a>.",
    "uri" : ["nex"]
  },
  "nex" : {
    "name" : ":// Nex",
    "description" : "Nex realm.",
    "reference" : "Install <a href='https://gmi.skyjake.fi/lagrange/' style='color:#eee'>Lagrange</a>.",
    "uri" : ["nex"]
  },
  "telephone" : {
    "name" : "☎️ Telephone", // 📞️
    "description" : "Call telephone numbers.",
    "reference" : "Install <a href='https://postmarketos.org' style='color:#eee'>postmarketOS</a>, or <a href='https://mobian-project.org' style='color:#eee'>Mobian</a>.",
    "uri" : ["callto", "tel"]
  },
  "sms" : {
    "name" : "💬️ SMS",
    "description" : "Message telephone numbers.",
    "uri" : ["sms"]
  },
  "voip" : {
    "name" : "📞️ VoIP",
    "description" : "Call via SIP (Session Initiation Protocol).",
    "uri" : ["sip"]
  },
  "chat-cabal" : {
    "name" : "🔽 Cabal", // ︾ // 🔽 // ⧩ // ➤
    "description" : "Cabal chat network",
    "uri" : ["cabal"]
  },
  "chat-xmpp" : {
    "name" : "💡️ XMPP",
    "description" : "The private and decentralized chat network of <span title='Extensible Messaging and Presence Protocol'>XMPP</span>.",
    "reference" : "Install <a href='https://gajim.org' style='color:#eee'>Gajim</a>, or <a href='https://psi-im.org' style='color:#eee'>Psi</a>.",
    "address" : [
      // /i/#
      // #converse/room?jid=
      "i.kaidan.im",
      "join.jabber.network/#",
      "anonymous.cheogram.com",
      "magicbroccoli.de/i/",
      "webchat.disroot.org/#converse/room?jid=",
      "xmpp.org/chat#converse/room?jid=",
      "yaxim.org/chat/#converse/room?jid=",
      "yax.im/i/"],
    // TODO handle ?join, ?message, ?node
    "uri" : ["xmpp"],
    //"urn" : ["xmpp"]
  },
  "chat-irc" : {
    "name" : "🗨️ IRC",
    "description" : "Internet Relay Chat.",
    "uri" : ["irc", "ircs"],
    "address" : ["kiwiirc.com/nextclient/"]
  },
  "chat-briar" : {
    "name" : "👁 Briar",
    "description" : "Briar chat network.",
    "warning" : "This is a messaging system of which its developers have received grants from the CIA.",
    "origin" : "🇺🇸 USA Federation",
    "uri" : ["briar"]
  },
  "chat-di" : {
    "name" : "👁 Discord",
    "description" : "Centralized messaging platform.",
    "warning" : "This chat service logs your activities and conversations to its records and discloses them to governments unconditionally.",
    "origin" : "🇺🇸 USA Federation",
    "address" : ["discord.com/", "discord.gg/"]
  },
  "chat-fa" : {
    "name" : "👁 Facebook",
    "description" : "Centralized publishing platform.",
    "warning" : "This publishing service logs your activities and conversations to its records and discloses them to governments unconditionally.",
    "origin" : "🇺🇸 USA Federation",
    "address" : ["m.me/"]
  },
  "chat-matrix" : {
    "name" : "👁 matrix", // #️⃣️ // ＃ // ⌗ // 濫 // #️ // 🔯
    //"description" : "Matrix Chat Network (<a href='https://lukesmith.xyz/articles/matrix-vs-xmpp/' style='color:#000' title='Metadata Disaster'>Read This Warning</a>)",
    "description" : "Pseudo-private, pseudo-decentralized messaging platform.",
    "warning" : "This is a <u><a href='https://lukesmith.xyz/articles/matrix-vs-xmpp/' style='color:#fff'>compromised</a></u> messaging system which exposes private metadata to everyone and is connected to middle eastern intelligence agencies.",
    "origin" : "✡ Occupied Palestine",
    "uri" : ["element", "matrix"],
    "address" : ["matrix.to/"]
  },
  "chat-sk" : {
    "name" : "👁 Skype",
    "description" : "Centralized messaging platform.",
    "warning" : "This chat service logs your activities and conversations to its records and discloses them to governments unconditionally.",
    "origin" : "🇺🇸 USA Federation",
    "uri" : ["skype"]
  },
  "chat-tg" : {
    "name" : "👁 Telegram", // 🇶🇦
    "description" : "Centralized messaging platform.",
    "warning" : "This chat service logs your activities and conversations to its records and discloses them to governments unconditionally.",
    "origin" : "🇷🇺 Russia Federation 🇦🇪 UAE",
    "address" : ["t.me/", "telegram.me"],
    "rejects" : ["tg://msg_url?", "/send?", "://telegram.me/share", "://t.me/share"],
    "uri" : ["tg"]
  },
  "chat-te" : {
    "name" : "👁 Tencent",
    "description" : "Centralized messaging platform.",
    "warning" : "This chat service logs your activities and conversations to its records and discloses them to governments unconditionally.",
    "origin" : "🇨🇳 China Republic",
    "uri" : ["tencent"]
  },
  "chat-vi" : {
    "name" : "👁 Viber",
    "description" : "Centralized messaging platform.",
    "warning" : "This chat service logs your activities and conversations to its records and discloses them to governments unconditionally.",
    "origin" : "🇯🇵 Japan Kingdom",
    "uri" : ["viber"]
  },
  "chat-we" : {
    "name" : "👁 WeChat",
    "description" : "Centralized messaging platform.",
    "warning" : "This chat service logs your activities and conversations to its records and discloses them to governments unconditionally.",
    "origin" : "🇨🇳 China Republic",
    "uri" : ["weixin"]
  },
  "chat-wh" : {
    "name" : "👁 Whatsapp",
    "description" : "Centralized messaging platform.",
    "warning" : "This chat service logs your activities and conversations to its records and discloses them to governments unconditionally.",
    "origin" : "🇺🇸 USA Federation",
    "address" : [
      "chat.whatsapp.com",
      "wa.me",
      "api.whatsapp.com/send?phone=",
      "web.whatsapp.com/send?phone="],
    "rejects" : ["://wa.me/?text"],
    "uri" : ["whatsapp"]
  },
  "tracker" : {
    "name" : "📶 Tracker",
    "description" : "BitTorrent trackers.",
    "uri" : ["udp"]
  },
  "adc" : {
    "name" : "🫐️ DC", // Advanced Direct Connect
    "description" : "DC magnet links.",
    "reference" : "Install <a href='https://dcpp.wordpress.com' style='color:#eee'>DC++</a>.",
    "urn" : ['tree:tiger'],
    "uri" : ["adc", "adcs", "dchub"]
  },
  "bitprint" : {
    "name" : "🪩 Gnutella2",
    "description" : "Gnutella2 magnet links.",
    "reference" : "Install <a href='https://gtk-gnutella.sourceforge.io' style='color:#eee'>GTK-GNUTELLA</a>, <a href='https://shareaza.sourceforge.net' style='color:#eee'>Shareaza</a>, or <a href='http://www.phex.org/mambo/' style='color:#eee'>Phex</a>.",
    "urn" : ["bitprint"]
  },
  "bittorrent" : {
    "name" : "🌊️ BitTorrent", //💧️ ⛲️
    "description" : "BitTorrent magnet links.",
    "reference" : "Install <a href='https://qbittorrent.org' style='color:#eee'>qBittorrent</a>, <a href='https://deluge-torrent.org' style='color:#eee'>Deluge</a>, <a href='https://transmissionbt.com' style='color:#eee'>Transmission</a>, <a href='https://apps.kde.org/ktorrent/' style='color:#eee'>KTorrent</a>, or <a href='https://shareaza.sourceforge.net' style='color:#eee'>Shareaza</a>.",
    "urn" : ["btih", "btmh"]
  },
  "rsync" : {
    "name" : "🔄 RSYNC",
    "description" : "Rsync data synchronization links.",
    "reference" : "Install <a href='http://opbyte.it/grsync/' style='color:#eee'>Grsync</a>, or <a href='http://samba.anu.edu.au/rsync/' style='color:#eee'>Rsync</a>.",
    "uri" : ["rsync"]
  },
  "torrent" : {
    "name" : "📦️ Torrent", // ⛲️ 🧧️
    "description" : "BitTorrent metadata files.",
    "extension" : ["torrent"],
    "reference" : "Install <a href='https://qbittorrent.org' style='color:#eee'>qBittorrent</a>, <a href='https://deluge-torrent.org' style='color:#eee'>Deluge</a>, <a href='https://transmissionbt.com' style='color:#eee'>Transmission</a>, <a href='https://apps.kde.org/ktorrent/' style='color:#eee'>KTorrent</a>, or <a href='https://shareaza.sourceforge.net' style='color:#eee'>Shareaza</a>.",
  },
  "torrent-cache" : {
    "name" : "🎁️ Torrent", // ⛲️
    "description" : "BitTorrent metadata files.",
    "reference" : "Install <a href='https://qbittorrent.org' style='color:#eee'>qBittorrent</a>, <a href='https://deluge-torrent.org' style='color:#eee'>Deluge</a>, <a href='https://transmissionbt.com' style='color:#eee'>Transmission</a>, <a href='https://apps.kde.org/ktorrent/' style='color:#eee'>KTorrent</a>, or <a href='https://shareaza.sourceforge.net' style='color:#eee'>Shareaza</a>.",
  },
  "ed2k" : {
    "name" : "🐴 eDonkey2000", /* ♈ eDonkey */
    "description" : "eDonkey magnet links.",
    "uri" : ["ed2k"],
    "urn" : ["aich", "ed2k", "ed2khash", "md4"],
    "reference" : "Install <a href='https://emule-project.com' style='color:#eee'>eMule</a>, <a href='https://shareaza.sourceforge.net' style='color:#eee'>Shareaza</a>, <a href='https://mldonkey.sourceforge.net' style='color:#eee'>MLDonkey</a>, or <a href='http://amule.org' style='color:#eee'>aMule</a>."
  },
  "limewire" : {
    "name" : "🍋‍ Limewire", // ❄️ Frostwire
    "description" : "Limewire magnet links.",
    "urn" : ["sha1"],
    "reference" : "Install <a href='https://gtk-gnutella.sourceforge.io' style='color:#eee'>GTK-GNUTELLA</a>, <a href='https://shareaza.sourceforge.net' style='color:#eee'>Shareaza</a>, or <a href='http://www.phex.org/mambo/' style='color:#eee'>Phex</a>.",
  },
  "kazzaa" : {
    "name" : "⏭️ Fasttrack",
    "description" : "Fasttrack magnet links.",
    "urn" : ["kzhash"],
    "reference" : "Install <a href='https://mldonkey.sourceforge.net' style='color:#eee'>MLDonkey</a>."
  },
  "metalink" : {
    "name" : "♾️ Metalink",
    "description" : "Metalink framework files.",
    "reference" : "Install <a href='http://www.phex.org/mambo/' style='color:#eee'>Phex</a>, <a href='https://downthemall.org' style='color:#eee'>DownThemAll!</a>, <a href='https://apps.kde.org/kget/' style='color:#eee'>KGet</a>, <a href='https://jdownloader.org' style='color:#eee'>JDownloader</a>, or <a href='https://aria2.sourceforge.net' style='color:#eee'>aria2</a>.",
    "extension" : ["meta4", "metalink"]
  },
  "shareaza" : {
    "name" : "❤️‍🔥️ Shareaza",
    "description" : "Shareaza magnet links.",
    "urn" : ["md5"],
    "reference" : "Install <a href='https://shareaza.sourceforge.net' style='color:#eee'>Shareaza</a>."
  },
  "wallet-monero" : {
    "name" : "🪙️ Monero", // 👛
    "description" : "Cryptocurrency wallets.",
    "uri" : ["monero"]
  },
  "wallet-litecoin" : {
    "name" : "🪙️ Litecoin",
    "description" : "Cryptocurrency wallets.",
    "uri" : ["litecoin"]
  },
  "wallet-ethereum" : {
    "name" : "🪙️ Ethereum",
    "description" : "Cryptocurrency wallets.",
    "uri" : ["ethereum"]
  },
  "wallet-bitcoin" : {
    "name" : "🪙️ Bitcoin",
    "description" : "Cryptocurrency wallets.",
    "uri" : ["bitcoin"]
  },
  "pkg-apk" : {
    "name" : "💿 Packages", // 📦️
    "description" : "Android packages.",
    "condition" : ["android"],
    "extension" : ["apk"],
    "address" : [
      "f-droid.org/packages/",
      "apt.izzysoft.de/fdroid/index/apk/",
      "mysu.dev/fdroid/",
      "acruexirfkgcqhwxyu75v7dtahr3a44hmbfygngsvubmkrbd6axa.b32.i2p/fdroid/",
      "cookiejarapps.com/fdroid/repo/",
      "fdroid.pabloferreiro.es/repo/",
      "appgallery.cloud.huawei.com/ag/n/app/",
      "appgallery.huawei.com/app/",
      "apkpure.com/",
      "play.google.com/store/apps/details?id="],
    "rejects" : ["com.github.android"]
  },
  "pkg-appstream" : {
    "name" : "💿 Packages", // 🛍️
    "description" : "AppStream packages.",
    "condition" : ["linux"],
    "uri" : ["appstream"]
  },
  "pkg-debian" : {
    "name" : "💿 Packages", // 🐧️
    "description" : "Debian packages.",
    "condition" : ["debian", "ubuntu"],
    "extension" : ["deb"]
  },
  "pkg-fedora" : {
    "name" : "💿 Packages", // 🐧️
    "description" : "Linux packages.",
    "condition" : ["fedora", "redhat"],
    "extension" : ["rpm"]
  },
  "pkg-flatpak" : {
    "name" : "💿 Packages", // 🧊
    "description" : "Flatpak packages.",
    "condition" : ["linux"],
    "extension" : ["flatpakref"],
    "address" : ["flathub.org/apps/details/"]
  },
  "ios-pkg" : {
    "name" : "💿 Packages", // 📦️
    "description" : "iOS packages.",
    "condition" : ["ios", "iphone", "ipad"],
    "address" : [
      "apps.apple.com/app/",
      "apps.apple.com/us/app/",
      "fnd.io"],
    "rejects" : ["1477376905"]
  },
  "pkg-kaios" : {
    "name" : "💿 Package", // 💠
    "description" : "<a href='https://gerda.tech' style='color:#000'>Gerda</a> (Kai OS) package.",
    "condition" : ["kai"],
    "address" : [
      "store.bananahackers.net/",
      "www.kaiostech.com/store/apps/"]
  },
  "pkg-kde" : {
    "name" : "💿 Package", // 🐲️
    "description" : "KDE Linux package.",
    "condition" : ["linux", "react", "windows"],
    "address" : ["store.kde.org/p/"]
  },
  "pkg-mac" : {
    "name" : "💿 Packages", // 🍎️
    "description" : "Macintosh packages.",
    "condition" : ["mac"],
    "extension" : ["dmg", "pkg"]
  },
  // NOTE WineHQ
  "pkg-reactos" : {
    "name" : "💿 Packages", // ⚛
    "description" : "<a href='https://reactos.org' style='color:#000'>React OS</a> (Windows) packages.",
    "condition" : ["windows", "react"],
    "extension" : ["exe", "msi"],
    "address" : [
      "apps.microsoft.com/store/detail/",
      "www.microsoft.com/store/apps/"]
  },
  // TODO ask snapcraft for path /app/
  // TODO Dismiss path root /
  "pkg-snapcraft" : {
    "name" : "💿 Packages", // 📥️ 🛍️ 🪶️
    "description" : "Snapcraft packages.",
    "uri" : ["snap"],
    "address" : ["snapcraft.io/"]
  },
  "pkg-ubports" : {
    "name" : "💿 Packages", // 📦️
    "description" : "Ubuntu Touch packages.",
    "condition" : ["ubuntu"],
    "uri" : ["openstore"],
    "address" : ["open-store.io/app/"],
    "reference" : "Install <a href='https://ubports.com' style='color:#eee'>Ubports</a>."
  },
  "ext-userjs" : {
    "name" : "🐵 Userscripts", // 🐒 📜
    "description" : "User.JS scripts.",
    "extension" : ["user.js"],
    "reference" : "Install <a href='https://falkon.org' style='color:#eee'>Falkon</a>."
  },
  "ext-usercss" : {
    "name" : "🎨 Userstyles", // 📃
    "description" : "User.CSS stylesheets.",
    "extension" : ["user.css"]
  },
  "ext-blink" : {
    "name" : "🧩 Extension",
    "description" : "Extensions.",
    "condition" : ["brave", "chrome", "chromium", "crios", "sleipnir", "vivaldi"],
    "extension" : ["crx", "chromium.zip", "chrome.zip"],
    "address" : ["chrome.google.com/webstore/detail/"]
  },
  "ext-edge" : {
    "name" : "🧩 Extension",
    "description" : "Extensions.",
    "condition" : ["edge"],
    "address" : ["microsoftedge.microsoft.com/addons/detail/"]
  },
  "ext-falkon" : {
    "name" : "🧩 Extension", // 🦅️
    "description" : "Extensions.",
    "condition" : ["falkon"],
    "address" : ["store.falkon.org/p/"]
  },
  "ext-maxthon" : {
    "name" : "🧩 Extension",
    "description" : "Extensions.",
    "condition" : ["maxthon"],
    "address" : ["extension.maxthon.com/detail/"]
  },
  "ext-xpi" : {
    "name" : "🧩 Extension", // 🐺️ // 🦊️ // 🦎️
    "description" : "Extensions.",
    "condition" : ["firefox", "fxios", "librewolf", "waterfox"],
    "extension" : ["xpi", "firefox.zip"],
    "address" : ["addons.mozilla.org"],
    "reference" : "Install <a href='https://palemoon.org' style='color:#eee'>Palemoon</a>, or <a href='https://librewolf.net' style='color:#eee'>LibreWolf</a>."
  },
  "ext-xul" : {
    "name" : "🧩 Extension", // 🌕
    "description" : "Extensions.",
    "condition" : ["basilisk", "goanna", "palemoon"],
    "extension" : ["xpi"],
    "address" : [
      "addons.palemoon.org",
      "realityripple.com/Software/XUL/",
      "realityripple.com/Software/Mozilla-Extensions/",
      "addons.basilisk-browser.org"],
    "reference" : "Install <a href='https://palemoon.org' style='color:#eee'>Palemoon</a>, or <a href='https://basilisk-browser.org' style='color:#eee'>Basilisk</a>."
  },
  "hypercore" : {
    "name" : "⚡ Hypercore",
    "description" : "Hypercore realm.",
    "uri" : ["hyper"],
    "reference" : "Install <a href='https://agregore.mauve.moe' style='color:#eee'>Agregore</a>, or <a href='https://peersky.p2plabs.xyz' style='color:#eee'>Peersky</a>."
  },
  "ipfs" : {
    "name" : "💠 IPFS", // 🔮 📁 📂 ⚛️ 🕸️
    "description" : "Interplanetary File System.",
    "uri" : ["ipfs", "ipns", "dweb"],
    "address" : ["4everland.io/ipns/",
             "cloudflare-ipfs.com/ipfs/",
             "cloudflare-ipfs.com/ipns/",
             "gateway.pinata.cloud/ipfs/",
             "gateway.pinata.cloud/ipns/",
             "ipfs.io/ipfs/",
             "ipfs.io/ipns/"],
    "reference" : "Install <a href='https://agregore.mauve.moe' style='color:#eee'>Agregore</a>, or <a href='https://peersky.p2plabs.xyz' style='color:#eee'>Peersky</a>."
  },
  "tor" : {
    "name" : "🧅️ Tor", // 🔮
    "description" : "Tor realm.",
    "tld" : ["onion"]
  },
  "i2p" : {
    "name" : "㊙️ I2P", //㊣ 🔮
    "description" : "I2P realm.", //⚛️
    "tld" : ["i2p"]
  }
};

const namespace = "i2p-schimon-blackbelt";
const objectKeys = Object.keys(types);

// Check whether HTML; otherwise, exit.
//if (!document.contentType == "text/html")
// if (!document.doctype) return;
// if (document.doctype == null) return; // Uncaught SyntaxError: Illegal return statement

// Initial action
(function() {
  let links = [], accept;
  for (let i = 0; i < objectKeys.length; i++) {
    let agent = types[objectKeys[i]].condition, accept = true;
    if (agent) {
      accept = false;
      for (let j = 0; j < agent.length; j++) {
        if (navigator.userAgent.toLowerCase().includes(agent[j])) {
          accept = true;
        }
      }
    }
    //if (reject) continue;
    let
      results = [],
      name = types[objectKeys[i]].name,
      info = types[objectKeys[i]].description,
      warn = types[objectKeys[i]].warning,
      array = types[objectKeys[i]];
    if (array.rel) {
      let results_set = extractRel(array)
      if (results_set) {
        for (let result of results_set) {
          if (results.indexOf(result) == -1) {results.push(result)}
        }
      }
    }
    if (array.alternate) {
      let results_set = extractAlternate(array)
      if (results_set) {
        for (let result of results_set) {
          if (results.indexOf(result) == -1) {results.push(result)}
        }
      }
    }
    if (array.extension) {
      let results_set = extractFile(array)
      if (results_set) {
        for (let result of results_set) {
          if (results.indexOf(result) == -1) {results.push(result)}
        }
      }
    }
    if (array.uri) {
      let results_set = extractURI(array)
      if (results_set) {
        for (let result of results_set) {
          if (results.indexOf(result) == -1) {results.push(result)}
        }
      }
    }
    if (array.tld) {
      let results_set = extractTLD(array)
      if (results_set) {
        for (let result of results_set) {
          if (results.indexOf(result) == -1) {results.push(result)}
        }
      }
    }
    if (array.urn) {
      let results_set = extractURN(array)
      if (results_set) {
        for (let result of results_set) {
          if (results.indexOf(result) == -1) {results.push(result)}
        }
      }
    }
    if (array.address) {
      let results_set = extractAddress(array)
      if (results_set) {
        for (let result of results_set) {
          if (results.indexOf(result) == -1) {results.push(result)}
        }
      }
    }
    if (accept && results && results.length) {
      for (result of results) {
        links.push(createLink(result, objectKeys[i]));
        try {
          GM.registerMenuCommand(name, () => openUrl(result));
        } catch (err) {
          console.warn("Please check that your Userscript manager has GM.registerMenuCommand API.")
          console.error(err)
        }
      }
    }
  }
  if (links.length) {
    let barElement = buildBar();
    //barElement.append(closeButton(barElement));
//    links.forEach(link => barElement.append(link));
    //console.log("eles.forEach(ele => barElement.append(ele));")
    //console.log(eles)
    let mainElement, list, names = [];
    let infoElement = document.createElement("div");
    let titlesElement = document.createElement("div");
    let referenceElement = document.createElement("div");
    let warnElement = document.createElement("div");
    let listsElement = document.createElement("div");
    infoElement.id = "info";
    infoElement.textContent = "HTTP Unplugged (Black Belt)";
    titlesElement.id = "titles";
    titlesElement.style.padding = "9px 0px";
    referenceElement.id = "reference";
    referenceElement.style.background = "#39ab39";
    referenceElement.style.borderRadius = "5px";
    referenceElement.style.display = "none";
    referenceElement.style.marginBottom = "9px";
    referenceElement.style.padding = "1em";
    referenceElement.style.marginTop = "0.5em";
    warnElement.id = "warn";
    warnElement.style.background = "#e16969";
    warnElement.style.borderRadius = "5px";
    warnElement.style.display = "none";
    warnElement.style.marginBottom = "9px";
    warnElement.style.padding = "1em";
    warnElement.style.marginTop = "0.5em";
    listsElement.id = "lists";
    listsElement.style.maxHeight = "50vh";
    listsElement.style.overflowY = "scroll";
    listsElement.style.width = "inherit";
    barElement.append(infoElement);
    barElement.append(titlesElement);
    barElement.append(referenceElement);
    barElement.append(warnElement);
    barElement.append(listsElement);
    for (link of links) {
      let identifier, listElement, titleElement;
      identifier = link.className;
      if (names.includes(identifier)) {
        listElement = listsElement.querySelector(`span.${identifier}`);
        listElement.append(link);
      } else {
        names.push(identifier);
        titleElement = document.createElement("span");
        listElement = document.createElement("span");
        listElement.style.whiteSpace = "nowrap";
        titleElement.textContent = types[identifier].name;
        titleElement.className = `${identifier} title`;
        titleElement.style.margin = "0px 9px 0px 0px";
        titleElement.onmouseover = () => {
          listsElement.style.display = "inline-block";
          listElement.style.display = "unset";
          let currentList = listsElement.querySelector(`span.${list}`);
          if (currentList && currentList.className != `${identifier} list`) {
            currentList.style.display = "none";
          }
            list = identifier;
            infoElement.innerHTML = types[identifier].description;
            if (types[identifier].reference) {
              referenceElement.innerHTML = types[identifier].reference;
              referenceElement.style.display = "block";
            } else {
              referenceElement.textContent = "";
              referenceElement.style.display = "none";
            }
            if (types[identifier].warning) {
              warnElement.innerHTML = "<color='red'>WARNING!</color> " + types[identifier].warning + " // " + types[identifier].origin;
              warnElement.style.display = "block";
            } else {
              warnElement.textContent = "";
              warnElement.style.display = "none";
            }
            //infoElement.innerHTML = "<b>WARNING</b></br>" + types[identifier].warning + "<br/><br/><b>Get XMPP</b></br>Communicate with <u><a href='https://xmpp.org/software/clients/' style='color:#fff'>XMPP</a></u> (aka Jabber) for private and secure chat.";
          }
        barElement.onmouseleave = () => {
          referenceElement.style.display = "none";
          warnElement.style.display = "none";
          listsElement.style.display = "none";
          infoElement.textContent = "HTTP Unplugged (Black Belt)";
        }
        listElement.append(link);
        listElement.className = `${identifier} list`;
        listElement.style.display = "none";
        listsElement.append(listElement);
        titlesElement.append(titleElement);
      }
    }
    /*
    if (
      // NOTE Not working "#i2p.schimon.blackbelt.bittorrent"
      barElement.querySelector("*[id$=bittorrent]") &&
      !barElement.querySelector("*[id$=-torrent]")
      ) {
      // TODO Add after BitTorrent
      listsElement = barElement.querySelector("#lists");
      listElement = listsElement.querySelector("span.torrent");
      listsElement.prepend(listElement);
      link = createLink(generateTorrentUrl(barElement), "torrent-cache")
      listElement.append(link);
      titleElement.textContent = "🎁️ Torrent";
      titleElement.onmouseover = () => {
        infoElement.innerHTML = "⛲️ Bittorrent metadata file";
      }
      titlesElement = barElement.querySelector("#titles");
      titlesElement.append(titleElement);
    }
    */
  }
  // https://henrik.nyh.se
  // https://postmarketos.org
  /* document.addEventListener ("scroll", function() {
    if (window.pageYOffset > 10) { // TODO when first bar is out of focus
      document
      .querySelector("#" + namespace + "-bar")
      .style.setProperty("position", "fixed", "important");
    } else {
      document
      .querySelector("#" + namespace + "-bar")
      .style.setProperty("position", "absolute", "important");
    }
  }) */
})();

function openUrl(url) {
  //window.open(url, "_blank");
  window.open(url, "_self");
}

function buildBar() {
  let barElement = document.createElement(namespace);
  document.body.prepend(barElement);
  barElement.id = namespace + "-bar";
  //barElement.style.all = "unset";
  barElement.style.width = "100%";
  //barElement.style.opacity = 0.5; // 0.75
  barElement.style.backgroundColor = "#000"; //"#2c3e50";
  barElement.style.color = "#eee";
  //barElement.style.fontSize = "1.5em";
  //barElement.style.setProperty("color", "#eee", "!important")
  //barElement.style.fontVariant = "small-caps";
  barElement.style.left = 0;
  barElement.style.right = 0;
  barElement.style.top = 0;
  barElement.style.zIndex = 2147483647;
  barElement.style.maxHeight = "fit-content";
  //barElement.style.maxWidth = "100vw";
  barElement.style.fontFamily = "system-ui";
  //barElement.style.fontSize = "170%";
  barElement.style.fontWeight = "bolder";
  barElement.style.padding = "3px 10px 3px 12px";
  barElement.style.position = "fixed";
  barElement.style.display = "block";
  barElement.style.textAlign = "left";
  barElement.style.direction = "ltr";
  barElement.style.userSelect = "none";
  //barElement.style.overflow = "hidden";
  //barElement.style.transition = "all 1s ease 0.1s";
  barElement.onclick = () => { barElement.remove(); }

  /*
  barElement.onmouseover = () => { barElement.style.opacity = 0.9; }
  barElement.onmouseleave = () => {
    var secs = 5;
    function timeOut() {
      secs -= 1;
      if (secs > 0) {
        setTimeout(timeOut, 1000);
      }
      if (secs == 0) {
        barElement.querySelector("#" + namespace + "-info-square") &&
        barElement.querySelector("#" + namespace + "-info-square").remove();
        barElement.querySelector("#" + namespace + "-warn-square") &&
        barElement.querySelector("#" + namespace + "-warn-square").remove();
      }
    } timeOut();
  }

  barElement.onmouseout = () => {
    var secs = 20;
    function timeOut() {
      barElement.onmouseout = () => { secs = 20; }
      secs -= 1;
      if (secs == 15) {
        // FIXME Not working due to !important we have set below
        //barElement.style.setProperty("opacity", "unset", "important");
        barElement.style.opacity = 0.3;
        setTimeout(timeOut, 1000);
      } else if (secs == 5) {
        //barElement.style.setProperty("opacity", "unset", "important");
        barElement.style.opacity = 0;
        setTimeout(timeOut, 1000);
      } else if (secs == 0) {
        barElement.remove();
        return;
      } else {
        setTimeout(timeOut, 1000);
      }
    } timeOut();
  }
  */

  // Set !important
  for (let i = 0; i < barElement.style.length; i++) {
    barElement.style.setProperty(
      barElement.style[i],
      barElement.style.getPropertyValue(barElement.style[i]),
      "important"
    );
  }

  // Timer from https://stackoverflow.com/questions/27406765/hide-div-after-x-amount-of-seconds

  /*
  var secs = 33;
  function timeOut() {
    secs -= 1;
    if (secs == 0) {
      //barElement.style.display = "none";
      barElement.style.opacity = 0.2;
      return;
    }
    else {
      setTimeout(timeOut, 1000);
    }
  }
  timeOut();
  */

  return barElement
}

// NOTE TODO semi-recursive callback
// NOTE TODO typeof
function extractFile(array) {
  let i = 0, links = [];
  for (let i = 0; i < array.extension.length; i++) {
    // FIXME Mainstream to support ends-with
    // fn:ends-with appears to be missing in some engines
    query = [
      `//a[contains(@href, ".${array.extension[i]}")]/@href`,
      `//a[contains(@download, ".${array.extension[i]}")]/@download`];
//      `//a[ends-with(@href, ".${array.extension[i]}")]/@href`
//      `//a[ends-with(text(), ".${array.extension[i]}")]/@href`
    results = executeQuery(query, "xpath");
    if (results.length) {
      let protocol = location.protocol
      let hostname = location.hostname
      for (result of results) {
      //console.log(result)
        switch (true) {
          case (result.startsWith("/")):
            result = protocol + "//" + hostname + result;
            break;
          case (!result.includes(":")):
            result = protocol + "//" + hostname + "/" + result;
            break;
          //case (result.startsWith("http")):
          //break;
        }
        //console.log(result)
        let url = new URL(result);
        let bol = url.pathname.endsWith(array.extension[i]);
        if (bol) {
          links.push(result);
        }
      }
    }
  }
  if (array.rejects && links) {
      links = removeRejectedLinks(links, array.rejects);
  }
  if (links.length) { return links; };
}


function extractAlternate(array) {
  let i = 0, links = [];
  for (let i = 0; i < array.alternate.length; i++) {
    query = [
     // Also rel="feed". See https://miranda-ng.org/
      `//link[@rel="alternate"\
       and contains(@type, "${array.alternate[i]}")\
       ]/@href`];
    results = executeQuery(query, "xpath");
    if (results.length) {
      for (result of results) {
        links.push(result);
      }
    }
  }
  if (array.rejects && links) {
      links = removeRejectedLinks(links, array.rejects);
  }
  if (links.length) { return links; };
}

function extractRel(array) {
  let i = 0, links = [];
  for (let i = 0; i < array.rel.length; i++) {
    query = [`//link[@rel="${array.rel[i]}"]/@href`];
    results = executeQuery(query, "xpath");
    if (results.length) {
      for (result of results) {
        links.push(result);
      }
    }
  }
  if (array.rejects && links) {
      links = removeRejectedLinks(links, array.rejects);
  }
  if (links.length) { return links; };
}

function extractURI(array) {
  let i = 0, links = [];
  for (i of array.uri) {
    query = [`//a[starts-with(@href, "${i}:")]/@href`];
    results = executeQuery(query, "xpath");
    if (results.length) {
      for (result of results) {
        let url = new URL(result);
        let bol = url.protocol.match(i);
        if (bol) { 
          links.push(result);
        }
      }
    }
  }
  if (array.rejects && links) {
      links = removeRejectedLinks(links, array.rejects);
  }
  if (links.length) { return links; };
}

// FIXME Queries.
function extractTLD(array) {
  let i = 0, links = [];
  for (let i = 0; i < array.tld.length; i++) {
    query = [
      `//a[contains(@href, ".${array.tld[i]}/")]/@href`,
      `//a[contains(@href, ".${array.tld[i]}:")]/@href`,
      `//a[substring(@href, string-length(@href) - string-length(".${array.tld[i]}") + 1)  = ".${array.tld[i]}"]/@href`,
      `//a[string-length(.) > string-length(".${array.tld[i]}") and substring(., string-length(.) - string-length(".${array.tld[i]}") + 1) = ".${array.tld[i]}"/@href`];
      // FIXME mainstream
      //"//a[starts-with(@href, "http") and ends-with(@href, ".${array.tld[i]}")]/@href"
    results = executeQuery(query, "xpath");
    if (results.length) {
      for (result of results) {
        let url = new URL(result);
        let bol = url.hostname.endsWith(array.tld[i-1]);
        if (bol) { 
          links.push(result);
        }
      }
    }
  }
  if (array.rejects && links) {
      links = removeRejectedLinks(links, array.rejects);
  }
  if (links.length) { return links; };
}

function extractURN(array) {
  let i = 0, links = [];
  for (let i = 0; i < array.urn.length; i++) {
    query = [
      `//a[starts-with(@href, "magnet")\
       and contains(@href, "${array.urn[i]}")\
       ]/@href`];
    results = executeQuery(query, "xpath");
    if (results.length) {
      for (result of results) {
        let url = new URL(result);
        url.searchParams.delete("tr");
        result = url.protocol + url.search;
        result = decodeURIComponent(result);
        links.push(result);
      }
    }
  }
  if (array.rejects && links) {
      links = removeRejectedLinks(links, array.rejects);
  }
  if (links.length) { return links; };
}

function extractAddress(array) {
  let i = 0, links = [];
  for (let i = 0; i < array.address.length; i++) {
    query = [
      `//a[starts-with(@href, "http")\
       and contains(@href, "://${array.address[i]}")]/@href`];
    results = executeQuery(query, "xpath");
    if (results.length) {
      for (result of results) {
        links.push(result);
      }
    }
  }
  if (array.rejects && links) {
      links = removeRejectedLinks(links, array.rejects);
  }
  if (links.length) { return links; };
}

// TODO
// String.prototype.toLowerCase()
// href Magnet: (magnet:) is not detected, or
// Set document MIMEType to plain/text
function executeQuery(queries, method) {
  let i = 0, links = [], nodes;
  for (query of queries) {
    switch (method) {
      case "css":
        result = document.querySelector(queries[i]);
        //if (result) {result = result.href};
        if (result) {return result.href};
        break;
      case "xpath":
        // NOTE This may cause 404 error.
        // Use getPathTo()
        // https://stackoverflow.com/questions/2631820/how-do-i-ensure-saved-click-coordinates-can-be-reload-to-the-same-place-even-if/2631931#2631931
        /*
        xhtmlFile = new XMLSerializer().serializeToString(document).toLowerCase()
        //xhtmlFile = "<html>"+document.documentElement.innerHTML.toLowerCase()+"</html>"
        domParser = new DOMParser();
        xhtmlFile = domParser.parseFromString(xhtmlFile, "text/html");
        result = document.evaluate(
          queries[i], xhtmlFile, null, XPathResult.STRING_TYPE);
        */

        /*
        result = document.evaluate(
          queries[i], document, null, XPathResult.STRING_TYPE);
        //if (result) {result = result.stringValue};
        if (result) {return result.stringValue};
        */

        nodes = document.evaluate(
          query, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE);
        if (nodes) {
          let node = nodes.iterateNext();
          while (node) {
            // Add the link to the array
            links.push(node.nodeValue);
            // Get the next node
            node = nodes.iterateNext();
          }
        }
        return links
    }
  }
}

function createLink(uri, id) {
  //if (type[4]) { 
  //let tip = document.createElement("spna");
  //tip.class = "tooltip";
  //tip.append("type[4]");
  //}

  //type = type.split(" ");
  //sym = getUrnProperty(uri, "sym");
  //net = getUrnProperty(uri, "net");

  let aElement = document.createElement("a");
  aElement.className = id;
  aElement.href = uri;
  aElement.textContent = aElement.href;
  aElement.style.all = "unset";
  aElement.style.color = "#eee";
  aElement.style.display = "block";
  aElement.style.font = "caption";
  aElement.style.fontFamily = "system-ui";
  aElement.style.fontSize = "20px"; // 13px
  //aElement.style.fontVariantCaps = "all-small-caps";
  aElement.style.textDecoration = "none";
  aElement.style.cursor = "default";
  aElement.style.margin = "0.5em 0";

  //aElement.style.fontWeight = "bold";
  //aElement.style.fontSize = "200%";
  //aElement.style.padding = "3px 9px 3px 9px";
  //aElement.style.margin = "2% 9px 2% 9px";
  //aElement.style.background = "black";
  //aElement.style.borderBottomLeftRadius = "9px";
  //aElement.style.borderBottomRightRadius = "9px";

  //aElement.style.forEach (style => style + "!important");
  for (let i = 0; i < aElement.style.length; i++) {
    aElement.style.setProperty(
      aElement.style[i],
      aElement.style.getPropertyValue(aElement.style[i]),
      "important"
    );
  }

  //aElement.append(tip);

  //console.log(aElement)
  //console.log(aElements)
  return aElement;
}

function generateTorrentUrl(node) {
// TODO generate link else-if onclick
// 404 https://bookshelf.theanarchistlibrary.org/library/librarian-previous-announcements-en#toc1
  href = node.querySelector("*[id*=bittorrent]").href;
  let url = new URL(href);
  name = url.searchParams.get("dn");
  if (!name) {name = document.title};
  //xt = url.searchParams.get("xt");
  let hash = url.searchParams.get("xt").slice(9);
  //if (ha.length === 40 && xt.startsWith("urn:btih"))
  if (hash.length === 40 || hash.length === 32) {
    if (hash.length === 32) {
      hash = convertBase32IntoHashSHA1Sum(hash);
    }
    let links = [
      "https://watercache.libertycorp.org/get/" + hash + "/" + name,
      "https://itorrents.org/torrent/" + hash + ".torrent?title=" + name,
      "https://firecache.libertycorp.org/get/" + hash + "/" + name,
      "http://fcache63sakpihd44kxdduy6kgpdhgejgp323wci435zwy6kiylcnfad.onion/get/" + hash + "/" + name,
      ];
    return links[1];
    //return links[Math.floor(Math.random()*links.length)];
  }
}

// Torrent V1
// TODO handle compressed sha1 http://www.debath.co.uk/MakeAKey.html
// TODO convert base32 to hash
// 32/40 https://linuxtracker.org/?page=torrent-details&id=173a0f61ef92b158547937fa0c01e9dc704779f9
function convertBase32IntoHashSHA1Sum(hash) {
  // Input your Base32 hash
  let base32_hash = hash;

  // Add missing padding
  base32_hash = base32_hash + "=".repeat((8 - base32_hash.length % 8) % 8);

  // Lowercase and convert to binary
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  for(let i = 0; i < base32_hash.length; i++) {
    const value = alphabet.indexOf(base32_hash[i]);
    bits += value.toString(2).padStart(5, "0");
  }

  // Convert bits to bytes
  const byteCount = bits.length / 8;
  const byteArray = new Uint8Array(byteCount);
  for(let i = 0; i < byteCount; i++) {
    byteArray[i] = parseInt(bits.substr(i * 8, 8), 2);
  }

  // Convert binary hash into a hexadecimal string
  let hex_hash = "";
  for(let i = 0; i < byteArray.byteLength; i++) {
    hex_hash += ("0" + byteArray[i].toString(16)).substr(-2);
  }

  return hex_hash;
}

function closeButton(barElement) {
  let spanElement = document.createElement("span");
  spanElement.textContent = "X";
  spanElement.style.all = "unset";
  spanElement.style.color = "#eee";
  spanElement.style.font = "caption";
  spanElement.style.fontFamily = "system-ui";
  spanElement.style.fontSize = "15px"; // 13px
  spanElement.style.fontVariantCaps = "all-small-caps";
  spanElement.style.textDecoration = "none";
  spanElement.style.fontWeight = "bold";
  spanElement.style.padding = "3px 9px 3px 9px";
  //spanElement.style.margin = "0 9px 0 9px";
  spanElement.style.background = "black";
  spanElement.style.borderBottomLeftRadius = "9px";
  spanElement.style.borderBottomRightRadius = "9px";
  //spanElement.style.forEach (style => style + "!important");
  for (let i = 0; i < spanElement.style.length; i++) {
    spanElement.style.setProperty(
      spanElement.style[i],
      spanElement.style.getPropertyValue(spanElement.style[i]),
      "important"
    );
  }
  spanElement.onclick = () => { barElement.remove(); }
  return spanElement;
}

function removeRejectedLinks(links, rejects) {
//function removeRejectedLinks(links, reject) {
  /*
  let i = 0;
  while (i < links.length) {
    if (links[i] === reject) {
      links.splice(i, 1);
    } else {
      ++i;
    }
  }
  */
  for (reject of rejects) {
    for (link of links) {
      if (link.includes(reject)) {
        index = links.indexOf(link);
        links.splice(index, 1);
      }
    }
  }
  return links;
}
