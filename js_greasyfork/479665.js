// ==UserScript==
// @name        Interesting Wikipedia userscript
// @namespace   roxwize
// @match       *://*.wikipedia.org/*
// @grant       none
// @version     1.5.6
// @author      roxwize
// @description Does evil things to wikipedia articles
// @license     GPL-3.0-or-later
// @homepageURL https://greasyfork.org/en/scripts/479665-interesting-wikipedia-userscript
// @downloadURL https://update.greasyfork.org/scripts/479665/Interesting%20Wikipedia%20userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/479665/Interesting%20Wikipedia%20userscript.meta.js
// ==/UserScript==

class Keymap {
	constructor(displayName, keys) {
		this._name = displayName;
		this.keys = keys.split(" ").map((e) => e.split(""));
		this.repeated = false;
	}

	next() {
		if (this.x != undefined && this.y != undefined) {
			if (Math.random() >= 0.5) this.x = this.x === this.keys[this.y].length - 1 ? 0 : this.x + 1;
			else {
				this.y = this.y === this.keys.length - 1 ? 0 : this.y + 1;
				if (this.x >= this.keys[this.y].length) this.x = this.keys[this.y].length - 1;
			}
			// chance to repeat
			if (Math.random() <= 0.2 && !this.repeated) {
				this.repeated = true;
				return this.next();
			} else this.repeated = false;
		} else {
			this.y ??= Math.floor(Math.random() * this.keys.length);
			this.x ??= Math.floor(Math.random() * this.keys[this.y].length);
		}
		return this.keys[this.y][this.x];
	}
}

const keymaps = [
	new Keymap("QWERTY",  "qwertyuiop asdfghjkl zxcvbnm"),
	new Keymap("AZERTY",  "azertyuiop qsdfghjklm wxcvbn"),
	new Keymap("Dvorak",  "pyfgcrl aoeuidhtns qjkxbmwvz"),
	new Keymap("Colemak", "qwfpgjluy arstdhneio zxcvbkm"),
	new Keymap("Workman", "qdrwbjfup ashtgyneoi zxmcvkl")
];

const images = [
	"https://media.tenor.com/MBkt9DXPaUYAAAAd/ddostumka%C3%A7.gif",
	"https://media.tenor.com/C8aEDgYC1y4AAAAd/aphex-twin-come-to-daddy.gif",
	"https://media.tenor.com/4i00_7OrisUAAAAC/sandoz-canu-sandoz.gif",
	"https://media.tenor.com/hrNDlz8yD3UAAAAC/harley-quinn-margot-robbie.gif",
	"https://media.tenor.com/s1w-Sc5ahpEAAAAd/paz-pazzin.gif",
	"https://media.tenor.com/dWS427mpAZAAAAAd/secu-rity-meme.gif",
	"https://media.tenor.com/XUFDsSt48GYAAAAd/eminem.gif",
	"https://media.tenor.com/QgphpoWrjaAAAAAd/retro-retro-dev.gif",
	"https://media.tenor.com/uSo4lQu9dVgAAAAC/homer-smile.gif",
	"https://media.tenor.com/QMpyBmPBlhoAAAAC/wtf-roblox.gif",
	"https://media.tenor.com/47hdAGX-uAwAAAAC/charjabug-weegee.gif",
	"https://media.tenor.com/HcQ44DFmPccAAAAC/video-gaming.gif",
	"https://media.tenor.com/79djON9nNhMAAAAC/0001.gif",
	"https://media.tenor.com/U2ilbVQ-DAwAAAAC/jameis-winston-crab.gif",
	"https://c.tenor.com/jZlLTydic2UAAAAd/tenor.gif",
	"https://c.tenor.com/KE0dcwJ1VS4AAAAC/tenor.gif",
	"https://media1.tenor.com/m/cmiHJgTxV5AAAAAd/minccino-poketoon.gif",
	"https://media1.tenor.com/m/klfhGWhyzzYAAAAd/praise-allah.gif",
	"https://media1.tenor.com/m/TiJaOnPTFTsAAAAC/williams-evil.gif",
	"https://media1.tenor.com/m/sUey3ekTfDoAAAAC/slugcat-rain-world-artificer-dance.gif",
	"https://media1.tenor.com/m/gfZaN-s9gm0AAAAd/tsg-hoffenheim-fussball.gif",
	"https://media1.tenor.com/m/8fkcv1WDDM0AAAAC/robot-hello.gif",
	"https://media1.tenor.com/m/mMhU45-pZGsAAAAd/autechre-sean-booth.gif",
	"https://media1.tenor.com/m/I3wc0IZXfqYAAAAC/benedict-cumberbatch-doctor-strange.gif",
	"https://media1.tenor.com/m/D8GSu_9yYmAAAAAC/urkel-steve-urkel.gif",
	"https://media1.tenor.com/m/E2xaet0TtYsAAAAd/south-park-block13.gif",
	"https://media1.tenor.com/m/i9Ge9uKBVAcAAAAC/exorcist-prank.gif",
	"https://media1.tenor.com/m/1_JQdzkUcqQAAAAd/pepto-drink.gif",
	"https://media1.tenor.com/m/aRaj8_BOr4IAAAAC/philip-wikipedia.gif",
	"https://media1.tenor.com/m/jIEjhVJPlrsAAAAd/hitman-hitman2.gif",
	"https://media1.tenor.com/m/Vw16aqm7wiEAAAAd/rhythm-heaven-fail.gif",
	"https://media1.tenor.com/m/IQcO08GxscoAAAAd/smooth-criminal-cat.gif",
	"https://media1.tenor.com/m/BuXXCcVsbmcAAAAd/bogdan-moment-hl.gif",
	"https://media1.tenor.com/m/BImhqpdSqUUAAAAd/evil-villain.gif",
	"https://media1.tenor.com/m/iDbMu5kjwrkAAAAd/man-runnin.gif",
	"https://media1.tenor.com/m/hHwMQpLGCcQAAAAd/kermit-gay-kermit-potion.gif",
	"https://media1.tenor.com/m/T850EkA3rgMAAAAC/112hageland-leuven2.gif",
	"https://media1.tenor.com/m/rp8l7QTPjbMAAAAd/coca-cola-coke.gif",
	"https://media1.tenor.com/m/HL5dPXaDcgYAAAAC/din-barbaad.gif",
	"https://media1.tenor.com/m/wpaGL3wIw4kAAAAC/caprisun.gif",
	"https://media1.tenor.com/m/XBrPEFm-_14AAAAC/cat-lightning.gif",
	"https://media1.tenor.com/m/PsgKlEP-1PgAAAAd/creepy-minecraft.gif",
	"https://media1.tenor.com/m/LsGpcwpSsmoAAAAC/googliness-the-internship.gif",
	"https://media1.tenor.com/m/J7-lKCV1jjQAAAAd/fat-guy.gif",
	"https://media1.tenor.com/m/0rc0l8Qqx-kAAAAd/penguin.gif",
	"https://media1.tenor.com/m/ggtuNDdcGO0AAAAC/object-fool-eucerin.gif",
	"https://media1.tenor.com/m/cG7XQuWtkekAAAAC/link-counsciousness.gif",
	"https://media1.tenor.com/m/ZvPv7jkHXd8AAAAC/object-fool-eucerin.gif",
	"https://media1.tenor.com/m/m4Fy2lQd5j0AAAAC/trisha-tamil.gif",
	"https://media1.tenor.com/m/53ff8yADDDcAAAAC/arthritis-inflammation.gif",
	"https://media1.tenor.com/m/TxTQBaxnGwgAAAAC/bird-brain-mechanical.gif",
	"https://media1.tenor.com/m/rYscw0R2NqEAAAAC/mario-retro.gif",
	"https://media1.tenor.com/m/821Jm-bIScoAAAAd/dance-robot.gif",
	"https://media1.tenor.com/m/u_J8-0ocXfMAAAAC/homer-homer-simpson.gif",
	"https://media1.tenor.com/m/d7RH_KsFTWQAAAAd/five-nights-at-freddy%27s-fnaf.gif",
	"https://media1.tenor.com/m/6tJ8-Vu_CWQAAAAC/patapon-patapon3.gif",
	"https://media1.tenor.com/m/vRxgL6nyzK0AAAAd/dancing-3d.gif",
	"https://media1.tenor.com/m/s8mYduoNxQAAAAAC/home-alone-december.gif",
	"https://media1.tenor.com/m/H0TP37zS6j4AAAAC/pizza-tower-the-noise.gif",
	"https://media1.tenor.com/m/nnQsqX9g_YYAAAAd/tang916-happy-easter.gif",
	"https://media1.tenor.com/m/uCZPKgq0jDYAAAAC/ljarius-sneed-ljarius.gif",
	"https://media1.tenor.com/m/I-hb4OExuugAAAAC/bfdi-mouth.gif",
	"https://media1.tenor.com/m/s-7ru8cGJU0AAAAd/caveira-skull.gif",
	"https://media1.tenor.com/m/8NRi6VMAbR8AAAAC/bunny-maloney-jean-francois.gif",
	"https://media1.tenor.com/m/kBCP0yD9sVYAAAAd/thom-yorke-walking.gif",
	"https://media1.tenor.com/m/iNoVG4ZlXwUAAAAC/gta.gif",
	"https://media1.tenor.com/m/4H_vBUFCuEgAAAAd/skate-glitch.gif",
	"https://media1.tenor.com/m/MnKaoweSL7YAAAAd/sneed-bop.gif",
	"https://media1.tenor.com/m/e71nId8Yj4kAAAAd/shenmue-shenmue-forklift.gif",
	"https://media1.tenor.com/m/3-w0dE_SL7UAAAAC/o2-o2robot.gif",
	"https://media1.tenor.com/m/TPSxhmp-6lkAAAAC/roblox.gif",
	"https://media1.tenor.com/m/A4bTak1BWbgAAAAd/scolex-fish.gif",
	"https://media1.tenor.com/m/k0pf_TDz1DsAAAAd/aphextwin-idm.gif",
	"https://media1.tenor.com/m/ZetHEGNctWcAAAAd/click-here-to-upload-to-tenor-upload-your-own-gifs.gif",
	"https://media1.tenor.com/m/-7EhZTjdRQ8AAAAC/android-running-android.gif",
	"https://media1.tenor.com/m/CtgzUsEujTsAAAAC/sistersmoi-siss.gif",
	"https://media1.tenor.com/m/mMhU45-pZGsAAAAd/autechre-sean-booth.gif",
	"https://media1.tenor.com/m/wY95uJQ4DYoAAAAC/popsticky-popcorn-ab.gif",
	// thankyou to ellis for the gifs
	"https://64.media.tumblr.com/1a35ba4b9cc154ea6a1f7b323a817e9d/57edb24c0e90f3d4-92/s1280x1920/a2e0cf8398860a0e401e24d7560925f78be40d61.gif",
	"https://media1.tenor.com/m/LzikZYfpDwAAAAAC/sewing-sewing-machine.gif",
	"https://media1.tenor.com/m/hweQnVtO6UMAAAAC/spongebob-wall.gif",
	"https://media1.tenor.com/m/TVeq1AOlHQAAAAAC/bubsy-explode.gif",
	// thankyou to me for the gifs
	"https://media1.tenor.com/m/a0aS96FfutgAAAAd/radiohead-thom-yorke.gif",
	"https://media1.tenor.com/m/RCntpOKN4bQAAAAd/erm-what-the-sigma-sigma.gif",
	"https://media1.tenor.com/m/6CIKiVAesy0AAAAC/pubie-fulptube.gif",
	"https://media1.tenor.com/m/7peLhQT7GrcAAAAC/wacky-silly.gif",
	"https://media1.tenor.com/m/kw-zE0H3lSgAAAAC/wooper-roller-skates.gif",
	"https://media1.tenor.com/m/1BlDMUTDCZ4AAAAC/sackboy-little-big-planet.gif",
	"https://media1.tenor.com/m/y0Yub_nVmNYAAAAd/jerma-jerma985.gif",
	"https://media1.tenor.com/m/GnrqZuKrwzcAAAAC/snoop-dogg.gif",
	"https://media1.tenor.com/m/YyjJWH0YMxoAAAAd/william-shakespeare-shakespeare.gif",
	"https://media1.tenor.com/m/PBz8WbWestUAAAAC/dive-toilet.gif",
	"https://media1.tenor.com/m/bV6ObqR_dREAAAAC/rage-3kliksphilip.gif",
	"https://media1.tenor.com/m/sO8QSSzBXhkAAAAC/radiohead-bear.gif",
	"https://media1.tenor.com/m/ivG0cBBNSdMAAAAC/evil-bfdi.gif",
	"https://media1.tenor.com/m/dXAnXprr_h4AAAAC/morgana-persona-5.gif",
	"https://media1.tenor.com/m/SNKFpcrFWWAAAAAC/persona-5-morgana.gif",
	"https://media1.tenor.com/m/qFaVryk8_64AAAAC/morgana-dance-morgana.gif",
	"https://media1.tenor.com/m/a3gIxxiyctMAAAAC/persona5-morgana.gif",
	// thankyou to jack for the gifs
	"https://media1.tenor.com/m/cjefIM5Y6KsAAAAd/the-orville-36-hours.gif",
	"https://media1.tenor.com/m/V3MyGNQiaEIAAAAC/dancing-twerk.gif",
	"https://media1.tenor.com/m/fwoJNI_CpjQAAAAC/skeleton-shocked.gif",
	"https://media1.tenor.com/m/SiJels-VZLkAAAAC/terminator-arnold-schwarzenegger.gif",
	"https://media1.tenor.com/m/XuT_ifWR91wAAAAC/rage-mad.gif",
	"https://media.tenor.com/qzA2L1B7nP0AAAAM/cali007.gif",
	"https://media1.tenor.com/m/8vQY3QJX_soAAAAC/andy-exhausted.gif",
	"https://media1.tenor.com/m/JHCBI26vkJIAAAAC/alien-alien-dance.gif",
	"https://media1.tenor.com/m/G2Hgohh0P-8AAAAC/jay-z-shot.gif",
	"https://media1.tenor.com/m/OFl-Kxj_D_8AAAAd/smart-iptv-iptv.gif",
	"https://media1.tenor.com/m/aqNxzTht6IAAAAAC/cat-fire.gif",
	"https://media1.tenor.com/m/HtFYNC0gUIEAAAAC/cave-story-sue-sakamoto.gif",
	"https://media1.tenor.com/m/AqG3VVVxwYMAAAAC/arvinguy.gif",
	"https://media1.tenor.com/m/ZBSAJsozOmwAAAAC/chinese-restaurant-in-the-future-never-let-you-finish-your-sentence.gif",
	// thankyou to me again for the gifs
	"https://media1.tenor.com/m/VzUF8tPiOP8AAAAd/shadow-the-hedgehog-when-the-guac.gif",
	"https://media1.tenor.com/m/zB7XHltTJGYAAAAd/void-memes-cat.gif",
	"https://media1.tenor.com/m/h7wPjGdxX1wAAAAd/cat-wait-waiting-cat.gif",
	"https://media1.tenor.com/m/xZFs_YFnNZEAAAAC/king-zelda.gif",
	"https://media1.tenor.com/m/6IpjSDigaOYAAAAd/joker-ishowspeed.gif",
	"https://media1.tenor.com/m/gHOYxcCsJ00AAAAd/apple-apple-iphone.gif",
	// thank you to BLEUUUEUGUHGHHH
	"https://media1.tenor.com/m/Rc9DsQjIHZAAAAAd/what-the-heck-was-that-creeper.gif",
	"https://media1.tenor.com/m/o5i5uiIge3gAAAAd/catch-goku.gif",
	"https://media1.tenor.com/m/8yBPpNVR0CMAAAAd/fred-figglehorn-mp3-player.gif",
	"https://media1.tenor.com/m/NpyBsaAUbPoAAAAd/ikea-blahaj.gif"
];
const imageWhitelist = new Array(images.length).fill(-1).map((_, i) => i);
const style = `
	#god{position:fixed;bottom:1em;left:1em;background:rgba(50,40,80,0.8);padding:1em;color:white;}
	#gantzgraf{position:fixed;bottom:1em;right:1em;background:rgba(50,40,80,0.8);padding:1em;color:white;text-align:right;}
	#gantzgraf .option{display:flex;align-items:center;gap:1em;}
	#gantzgraf .option label{flex-grow:1;text-align:right;}
	#giflist-root{position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(245,248,242,0.85);padding:1rem;overflow-y:auto;box-sizing:border-box;}
	#giflist-root-header{height:10%;border-bottom:1px solid rgba(0,0,0,0.2);overflow-x:hidden;margin-bottom:1rem;}
	#giflist-root-header h1{font-size:300%;border-bottom:0;margin:0;font-weight:bold;}
	#giflist-root-list{display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr 1fr;grid-auto-rows:minmax(120px,1fr);gap:2%;}
	#giflist-root-list div{display:flex;align-items:center;justify-content:center;background-color:rgba(255,255,255,0.7);border:1px solid rgba(0,0,0,0.25);border-radius:10px;padding:6px;}
	#giflist-root-list div:hover{background-color:rgba(180,180,180,0.7);cursor:pointer;}
	#giflist-root-list div img{width:80%;max-height:80%;}
	#giflist-root-list div:hover img{filter:grayscale(1);}
	span.small{display:block;font-size:smaller;}
	span.sub{display:block;color:rgba(0,0,0,0.7);font-style:italic;}
	.iwusbox a{color:white;font-weight:bold;text-decoration:underline;}
`;
let words = [];

const config = {
	styleModifications: {
		label: "Modify page style",
		current: false
	},
	linkModifications: {
		label: "Modify links",
		current: true
	},
	figCaptions: {
		label: "Modify image captions",
		current: false
	},
	imageModifications: {
		label: "Modify images",
		current: true
	},
	textualModifications: {
		label: "Screw up text nodes",
		current: true
	},
	excessive: {
		label: "<b>Overdrive</b>",
		current: true
	},
	randomLinks: {
		label: "Change links to be random",
		current: false
	},
	keymap: {
		label: "Keysmash layout",
		current: 0,
		vals: keymaps
	}
};

function modify(e, f) {
	const n = e.childNodes;
	for (let d of n) {
		if (d.nodeType === Node.TEXT_NODE) f(d);
		else modify(d, f);
	}
}

const chance = () => Math.random() * 100;
const rand = (a) => a[Math.floor(Math.random() * a.length)];
const screwup = (str) => {
	const s = str.split("");
	let o = "";
	let i = 0;
	for (let l of s) {
		if (chance() > 60) continue;
		if (chance() < 20 && s[i+1]) o += s[i+1];
		if (chance() > 80 && s[i-1]) o += s[i-1];
		if (chance() < 80) o += l;
		if (chance() > 90) o += l;
		i++;
	}
	return o;
}
const applyRandomTransformation = (node, transformation, chance = 0.2) => {
	const chars = [];
	for (let i = 0; i < node.textContent.length; i++) {
		let c = node.textContent[i];
		if (Math.random() < chance) {
			c = transformation(c);
		}
		chars.push(c);
	}
	return chars.join("");
}
const applyRandomWordTransformation = (node, transformation, chance = 0.2) => {
	const words = node.textContent.split(" ");
	for (let i in words) {
		if (Math.random() < chance) words[i] = transformation(words[i]);
	}
	return words.join(" ");
}

(function() {
	// Add userscript styles
	const stylesheet = document.createElement("style");
	stylesheet.innerHTML = style;
	document.head.appendChild(stylesheet);
	// Root element.
	const rootEl = document.createElement("div");
	rootEl.id = "god";
	rootEl.classList.add("iwusbox");
	rootEl.innerHTML = `<span class="small">iwus v${GM.info.script.version} | <a href="https://greasyfork.org/en/scripts/479665-interesting-wikipedia-userscript" data-immune="true">greasyfork</a></span><input type="text" id="bregex" placeholder="regex" /><br/><input type="text" id="breplacement" placeholder="replacement" /><br/><button id="bok" style="cursor:pointer;">ok</button>`;
	document.body.appendChild(rootEl);
	document.getElementById("bok").addEventListener("click", () => {
		// Begin
		words = [];
		const regexp = new RegExp(document.getElementById("bregex").value, "g");
		const replce = document.getElementById("breplacement").value;
		const chchrs = ["桤","酒","垄","耐","撑","澉","颎","苦","耗","檎","霰","嗲","扩","京","柩","辨","蒿","蠓","湟","药","更","哇","迕","烬","陪","坭","摘","罹","徙","脖","溶","佬","岣","桅","看","缎"];
		const puncts = [" ? ", " ! ", " ?? ", " !! ", " ?! ", " !? ", "... "]
		const phrase = ["Chinese restaurant in the future never let you finish your sentence", "Chinese restaurant in the future", "never let you finish your sentence", "Lego Island"];
		// new Array(93).fill("").map((e, i) => String.fromCharCode(i + 33));
		const asciic = ["!","\"","#","$","%","&","'","(",")","*","+",",","-",".","/","0","1","2","3","4","5","6","7","8","9",":",";","<","=",">","?","@","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","[","\\","]","^","_","`","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","{","|","}"];
		const keylyt = keymaps[config.keymap.current];
		document.querySelectorAll(`p, ${config.figCaptions.current ? "figcaption," : ""} th, td, li, h1, h2, h3, h4, h5, h6, dd`).forEach((e) => {
			modify(e, (node) => {
				node.textContent = node.textContent.replaceAll(regexp, replce);
				if (node.textContent.length > 2 && node.textContent !== ".") words.push(node.textContent);
				// == TEXTUAL MODIFICATIONS == //
				if (config.textualModifications.current) {
					if (config.excessive.current) {
						if (chance() > 90) {
							// 10% chance to remove all vowels and scramble
							node.textContent = screwup(node.textContent.replaceAll(/[aeiou]/g, ""));
						} else if (chance() > 90) {
							// 10% chance to scramble normally otherwise
							node.textContent = screwup(node.textContent);
						}
						// replace all punctuation with random in list or append to a given character with 20% chance
						node.textContent = applyRandomTransformation(node, (c) => {
							if (["!", "?", "."].includes(c) || Math.random() > 0.8) {
								return rand(puncts);
							} else return c;
						});
					}
					// 10% chance to repeat a letter 2 to 10 times
					node.textContent = applyRandomTransformation(node, (c) => {
						if (Math.random() <= 0.1) {
							let s = "";
							for (let i = 0; i < Math.floor(Math.random() * 8) + 2; i++) {
								s += c
							}
							return s;
						} else return c;
					});
					// [jack idea no.1] 50% chance for commas to repeat 5 to 10 times
					node.textContent = applyRandomTransformation(node, (c) => {
						if (c === ',' && Math.random() >= 0.5) {
							return new Array(Math.floor(Math.random() * 5) + 5).fill(",").join("");
						}
					});
					// [jack idea no.2] 5% chance for the computer to mash its keyboard 5 to 35 times
					if (Math.random() <= 0.05 && config.excessive.current) {
						let s = "";
						for (let i = 0; i < Math.floor(Math.random() * 5) + 30; i++)
							s += keylyt.next();
						node.textContent = s + node.textContent;
					}
					// 1% chance to add a random word
					node.textContent = applyRandomWordTransformation(node, (w) => rand(phrase), 0.01);
					// 90% chance to just get cut off after ten letters at a random point
					if (node.textContent.length > 10 && Math.random() > 0.1 && config.excessive.current) {
						node.textContent = node.textContent.substring(0, Math.floor(Math.random() * (node.textContent.length - 10)) + 10)
					}
					// 60% chance to make random letters uppercase with a 20% chance for each
					if (chance() > 60) {
						node.textContent = applyRandomTransformation(node, (c) => c.toUpperCase());
					}
					// 10% chance to add anywhere from 5 to 85 random chinese characters after a word
					if (Math.random() > 0.9 && config.excessive.current) {
						for (let i = 0; i < Math.floor(Math.random() * 80) + 5; i++) {
							node.textContent += rand(chchrs);
						}
					}
				}
			});
			// == STYLE MODIFICATIONS == //
			if (config.styleModifications.current) {
				e.style.color = `hsl(${Math.round(Math.random()*360)} 50% 50%)`;
				if (chance() > 75) e.style.backgroundColor = `hsl(${Math.round(Math.random()*360)} 50% 50%)`;
				e.style.textDecoration = chance() > 70 ? "underline" : "normal";
				e.style.fontStyle = chance() > 70 ? "italic" : "normal";
				if (chance() > 30) {
					e.style.transform = `translate(${Math.random()*25}px, ${Math.random()*50}px)`;
				} else {
					e.style.transform = `rotate(${Math.random()*5-2.5}deg)`;
					if (chance() > 45) {
						e.style.transform += ` scale(${Math.random()*2+0.5})`;
					}
				}
				e.style.fontSize = `${9 + Math.floor(Math.random()*10)}pt`;
			}
		});
		if (config.imageModifications.current) {
			document.querySelectorAll("img").forEach((e) => {
				e.src = images[rand(imageWhitelist)];
			});
		}
		// == LINK MODIFICATIONS == //
		if (config.linkModifications.current) {
			document.querySelectorAll("a").forEach((e) => {
				if (e.dataset.immune === "true") return;

				if (config.randomLinks.current) {
					e.setAttribute("href", "https://en.wikipedia.org/wiki/Special:Random");
				}
				modify(e, (node) => {
					node.textContent = rand(words);
				});
			});
		}
	});
	// Config options
	const configEl = document.createElement("div");
	configEl.id = "gantzgraf";
	configEl.classList.add("iwusbox");
	for (let [k, v] of Object.entries(config)) {
		const e = document.createElement("div");
		e.classList.add("option");
		e.innerHTML = `<label for="bo-${k}">${v.label}</label>`;
		let o;
		if (typeof v.current === "number" && v.vals != undefined) {
			// o = document.createElement("div");
			// o.style = "display:block;"
			// v.vals.forEach((el, i) => {
			//   const vO = document.createElement("input");
			//   vO.type = "radio";
			//   vO.name = `bo-${k}`;
			//   vO.id = `ro-${k}-${i}`;
			//   vO.value = i.toString();
			//   o.appendChild(vO);
			//   const vL = document.createElement("label");
			//   vL.setAttribute("for", vO.id);
			//   vL.innerHTML = el;
			//   vL.style.display = "block";
			//   o.appendChild(vL);
			// });
			o = document.createElement("select");
			v.vals.forEach((e, i) => {
				const vO = document.createElement("option");
				vO.value = i;
				vO.innerHTML = typeof e === "object" ? e._name : e;
				o.appendChild(vO);
			});
			o.addEventListener("input", () => {
				config[k].current = Number(o.value);
			})
		} else {
			o = document.createElement("input");
			o.type = "checkbox";
			o.checked = config[k].current;
			o.addEventListener("input", () => {
				config[k].current = o.checked;
			});
		}
		o.name = `bo-${k}`;
		o.id = o.name;
		e.appendChild(o);
		configEl.appendChild(e);
	}
	// Giflist opener
	const openGifListLink = document.createElement("a");
	openGifListLink.innerHTML = "open the gif list";
	openGifListLink.href = "javascript:void(0);"
	openGifListLink.onclick = renderGifList;
	openGifListLink.dataset.immune = true;
	configEl.appendChild(openGifListLink);
	document.body.appendChild(configEl);
})();

// Maybe run automatically on page load
function renderGifList() {
	// Root div
	const rootDiv = document.createElement("div");
	rootDiv.id = "giflist-root";
	rootDiv.innerHTML = `
		<div id="giflist-root-header">
			<h1>Giflist</h1><span class="sub">Click on a gif to remove it | <a href="javascript:document.getElementById('giflist-root').remove()" data-immune="true">close</a></span>
		</div>
	`;
	const rootList = document.createElement("div");
	rootList.id = "giflist-root-list";
	// Individual gif elements
	let i = 0;
	for (let gif of images) {
		const gifDiv = document.createElement("div");
		gifDiv.id = `iwusdiv-${i}`;
		gifDiv.dataset.index = i;
		gifDiv.innerHTML = `<img src="${gif}" alt="no.${i}">`;
		gifDiv.addEventListener("click", () => {
			if (imageWhitelist.length === 1) {
				alert("No");
				return;
			}
			imageWhitelist.splice(imageWhitelist.indexOf(parseInt(gifDiv.dataset.index)), 1);
			gifDiv.remove();
		});
		rootList.appendChild(gifDiv);
		i++;
	}
	rootDiv.appendChild(rootList);
	document.body.appendChild(rootDiv);
}
