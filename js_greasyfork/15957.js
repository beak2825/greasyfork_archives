// ==UserScript==
// @name            TW-Collections
// @description     TW-Collections - see history
// @include     http*://*.the-west.*/game.php*
// @author Dun, Azbestka
// @version     1.4.6.6
// @history 	1.4.6.3  Correct bugs & graphic change and add rewards and groups of collections
// @history 	1.4.6.2  rev. TW 2.26
// @history 	1.4.6.1  rev. TW 2.24
// @history 	1.4.6  add Ro translation
// @history 	1.4.5  correcting a bug on current market bid
// @history 	1.4.4  Correct  bugs & update 2.23 & add upgradeables search in inventory
// @history 	1.4.3  Correct refresh bug
// @history 	1.4.2  update for TW 2.21
// @history 	1.4.1  correct bugs and add include for beta
// @history 	1.4.0.2   remove personnal frienset from sets list
// @history 	1.4.0   add Set Window and crafting items icons
// @history 	1.3.9   correct for es translation
// @history 	1.3.8   miscelaneous changes - update link to patebin (thanks to Tom Robert )
// @history 	1.3.7   correct bug for double item wearing - reactivate update
// @history 	1.3.6   correct translations links
// @history 	1.3.5   correct bugs save & trader icons
// @history 	1.3.4   correct bugs save settings
// @history 	1.3.3.9 correct bugs for 2.1, deactivate update since userscript is dead
// @history 	1.3.3.8 update TW version 2.1
// @history 	1.3.3.7 maj for 2.09
// @history 	1.3.3.6 correcting tips in mobile trader
// @history 	1.3.3.5 add vertical scrollbar in set & collection selectboxs
// @history 	1.3.3.4 maj 2.08 & optimisation chargement items de collections
// @history 	1.3.3.3 Fix ended bids
// @history 	1.3.3.2 correct End bids on collector list, add setting for deactivate menu mouse hover
// @history 	1.3.3 Mod. listcolector: recherche dans le marché   add direct link to market / mobile trader, add filters
// @history     1.3.2.1 Fix inventory bug
// @history     1.3.2  fix for the the mobile trader link, add the new TW items of the achieved collections, add pictures on collections list
// @history     1.3.1.3  fix for the shop display
// @history     1.3.1.2  corrections
// @history     1.3.1.1  corrections
// @history     1.3.1 correction pour le nouveau marchand ambulant + patch TWDB new
// @history     1.3.0 correction trad en + ajout lien forum
// @history     1.2.9 correction trad en et logout sans confirmation + ajout trad Slovak
// @history     1.2.7 correction trad en et logout sans confirmation
// @history     1.2.7 ajout filtres inventaires, correction
// @history     1.2.7 modification du systeme de langue et de l'updater, simplification suppression rapport, etc...
// @history     1.2.6.1 correction affichage TW api
// @history     1.2.6 correction lang et changement de nom
// @history     1.2.5 corrections ... or not :)
// @history     1.2.4 Création d'une barre d'outils dans l'inventaire (recettes, sets, consommables,doublons)
// @history     1.2.3 ajout d'un bouton doublon dans l'inventaire et correction bug lang
// @history     1.2.2 passage 2.0.6
// @history     1.2.1 passage 2.0.5
// @history     1.2.0 correction bugs maj + Traduction italienne (grazie tw81)
// @history     1.1.9 correction attente TWDB....
// @nocompat Chrome
// @grant       none
// @namespace https://greasyfork.org/users/26244
// @downloadURL https://update.greasyfork.org/scripts/15957/TW-Collections.user.js
// @updateURL https://update.greasyfork.org/scripts/15957/TW-Collections.meta.js
// ==/UserScript==
//
(function(e) {
	var t = document.createElement("script");
	t.type = "application/javascript";
	t.textContent = "(" + e + ")();";
	document.body.appendChild(t);
	t.parentNode.removeChild(t);
})
		(function() {
			if (/.+\.the-west\..*\/game\.php.*/.test(window.location.href)) {
				TWT = {
					DEBUG : false,
					LANG : {},
					info : {
						lang : 'en',
						version : '1.4.6.3',
						min_gameversion : '2.0',
						max_gameversion : '2.29',
						idscript : '15957'
					},
					languages : [ {
						short_name : 'fr',
						name : 'Francais',
						translator : 'Dun',
						version : '1.4.0'
					}, {
						short_name : 'en',
						name : 'English',
						translator : 'Dun',
						version : '1.4.0'
					} ],
					images : {
						cup : "/images/icons/achv_points.png",
						logout : "data:image/jpg;base64,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",
						twdb_iconNew : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAC/tJREFUeNp0WAlUFFcWvVXdTTc0NIuogLiAgsYtJm4kGk3UqMkYM3GiUXN0TDJGj6NRo7gko+JuTGLiEhN3x2VwGz1x1MQxQeNKiGCjAm4IAooI0ghN02vVvP+7quk2mTqnqKLr1//vv3vfe/eV8GKfvmgeHY7pk8bC6XRDEABRFMEOj0fiV1EUINNVliR+L7BBfocke5+x3/XBRpjzC6MijdrquJhm3uc0QJYbT7aISGdQkA6bdh5Cwa27SE1NhTYrKwvduyShT/f2qLPWQ6MRodVqwFZ3ujzMBPpNQxNKcHs8CNJq+RhmHP8jyHC7ZXru4b+bYhJ6lRYVr/ktJ/u1d5fMqrPZHXxT7GSGqBthl5BgA1asfgCz2YyKigqIQUFBfDEPLcZ2wE6Ph071XmKLecgQ5TlN6FYmV99hV5fLBV14tFCVlbs66UxGn7KHjyf9mpMHnU7Hx7B32OmiudR1yDSItLbX+yI4HmwyWfK6j/7wh95dKDgI4Dt6Gh7vOO8bQYZgmtg45dbqL/pbfsjA8NimqVsOHG/BFlHnYie7lxS4JAVa9RDZVBxLzglZ8b2ykDpI8E7o98g7XhaUCcnlMW2SS3fsXll15izcBGXSjZvNtA5H2uETpxFqDPHuXFC4SO+oG+fz+tYRoLhNUrAUfGawe3WsAK9nBHh/Y6ckk+sJHkOTWK01t2Bb4RdrwrTBIRAMelhy8/F2SNB7h06eHVhR+RgaMoaNVwNEUHjjf4jqjepCQXG9vw/UKGCTyWj0osxIGxJGTBdXXJ01p6+rzgrotDyyJOKKmHFe81p88/VfbT8YrqfI8QIqQKsROVSM8P7uFhvvGZn8/mUekPwGiizKtD6icPppdAiNbjXqxpLlqTXmqxBDCA56R2TQkVG1VdXompP7THSQbuPOf/8IU5gxcLMyfBz1GiP4k1H2EpLBo5ilhiPPNbLkcyMbERLT6tniLdu3lO1JhyY0lBtRTc/qTCYIzKBQIx5mX8Wrt26NleobtqUfzwhmaYNTQQ6wIxAm1VxfYvJ5RCB3ChxGrcY7ETkZwdHNYh+f+uVQwbKVJjEkGAKNk5wu2N9+A1Gj34RktUGgvMSelf98Ds+fPvt+eFVNxr6T57uXlj/iCc8boX7GyAp2Ag9B+IGkklkI5BB5RxceabLmFR/OnZHaTqK8IRB8DJ46um97PR9RKd1Rn9gKMiU8vghF06Mr12DauiulS+Hd8zlXbiw5ffm6yU7Gq9ne5xlRsVA9/agb6ElmiCki2FHy+IB58kcpbksN5Rc9NA4nbDRp2fhRyHVLKN99CM3nT4ccF0vkdnKva4KDYautQ83OdEPbo8cWGG4XZf18wTyu+olVCDDGW1vkgFCGIASkb58h5bUHciZ9NKS+pARagsBCu8t7rgtE4sKA5ASMSN+I+1GRqKeFwwf15d4ReZQSsSnCZCK55VoBsPbb9oknTu565/WBmSHG4I4eBqkvrP2znBJJ3BBOfw90EVEme0nVkZzxE4dZ7xYhyGgE7HbYB7yMQWuWoG7YYFz+8juguAwjp05El5d6o8WYt1AbHweJFlIjUKb7UKKFnbz2ZW6Ba+naLQ8abHZekjQ6qk0xzZpg3DvDeGYU0Fi1eXalSQzRzeOs+fe+z54w6RVbcTH0pjBYyRCLqEECXQ1lD9B1ynuoahmH/MxsSJWVEC5mo+Xg/vB06gTb6fNMAkCgBGkk/uQnJmD5I0veuZLy2TpRXNxgdzwcOnQotP6JjS0uKt6QPG5otEEIaR7/XNWps/tyZ8xJdlZXI5iwryFoyocMRnSXDniycy/qdu/Ho6t5eGHxfGDIK5Cp9p15byYsldWIpIyMmhpoqXZ5SFIciGzi2pR5dXeXdq1XXPjP1sLln2/G9z+ceSq0fdFDhrjJkOAwhMUljb6/Y3+GeeKUZHftE+gJmidkSPHgAejVNgEdb99Bsxd6UxYOhvNuMbJHf4Cyucugr65FyjdfwnLZjMJN20DJBXVJiVgqaR58dyFn2sz3R07+5ejWwp49usJO5FcPLfxCmMNCXjLGttHBISwzT5895/7edIikO0hrQCJIPB2S8caH76LmTiFOfLMZho4d0Ilgc9RayZNalP9wCvW2BkTGtwTu36cMHYWCpLZYfrv0V4Ijdf/mFedGDBsEG41x1Nt+n/Q4RyU3gvQGmFo907HhZsnPmSNGzrm391/QUhbV0SK1lEMamkUj6l4JKmenIS6xNVJ2rUffMSMhmyJQOqg/ZOJeUFgobJevoCx9P4zhJmQkt8P0y3n745pHjzp3dOu5P78+AI+ra7j+eVqS8KTnoFxgiIqBsWnC1HubdlwkQ16yXL0ObXg4tLLMhZT1r6M5H2yWJ7AW3Ebe/JVI6dwBTqMWDym6WuiDEEnweRrs3N2hFEVH4uI8y8/lrHl7cL+J/z30bUlC6xZcTQZSw88Yg0Gv7dk75QX3nYqffhszbv21BYvCOWfII7zWEEcK9Xq0KbqHzn8ahOqhA9FAiU7Ov4lLw8chqX0iolYvREP7jhBLyqkmURogD+1s0tSx4dzlRbMnjZ2357sVdSxCbWSoSgv/zOszJqFNq+iE5lEbz3w6b2D9+QvQEVSSluoGhS2TifXvjEDn7V+htE1LXNyyF8l/GwPt2BEkH92wF5Xg2tRP0KPbc+hAxlp+yoChVTy2RzZp+OeF7PlL5k5e8VnadJfd4SDp6g6AxSPJT0kVQGO3O63HTp0+ni1qPRFdO3Zua9AbBIJCUopBC8K2U9+eSJkwCrr4eOiowLXu1wt5+behvVcKkRapOHYSTy5dQmiLWOyJbmbfdT77k1WLpn89Z9oE1FLBZBleoo0xgcUMYoHC9IyBoN13+EfcKSoFyzOikxbr06tb2aqF0+ccs9T1/4fdc+hR7+4IJfIJxKW66wXImjwXxZlXEErG6c0FaBlmwisbVgDTJvPMKVOSM1EOIY64d5zPXrJywbS1c2d+4OWHKgsFf3EgeA2DEKhnZKWnGTa4H35KX5c7/M1XRy6+UTzm+8TEYmNyIpcNblJwxbMXw1lVCXNhIY6O+hC6i2Z0cLhJKlhhJH5ltGqFdWey1qb+ffzn82ZNlOsp1NWFmbzwCX14xbkkyb+PJtUwK+2C3c6eMg5HtqzcZ7bZ+39jNB0P6dkNVN7QUFiE4rlL0WnAS4gYPRLmGfNQtHUbDBT2+RS+yzNz08e+NSSNOOJmhkgKIRgkslr4BPjE2x8SWC2OTM+wELZYapHYJh6HN68qiW3b+i+7TBGHTBTCAhU3J3GpcsN26I6egExV2kBRVkOZdVlB0aUenZJSN3+90Npgd/LeCIGK0gcL106Bzc4fyE5FLjCXOihFs+7x67SZDmNM0w8uJbW7ZmoSBYGysD3HjCfXqTmjaJPjYvBFje0+jf94z7fL7+tI97J3GQ5q06fKV05apQNhB5uftywBGlj1IFN6ijDljCfjbJT+F06bUHvdLU229unlElxuUv86LkUNVH0PmyJcl/JuL9y5YXEm8ybLI4KiuEW16ZPh68vYe0y3qJ5SZW6gMbxQy0pP5GW/RvDuhin68W8NuXhSp18f/mxHqk8OBNOObya0xqZM845PZry/642hL6O2rt77/lPwcMEmeY3jHQhr5vwMeaqjVHbCc0Bjjva+IMBa34B+vbqhaXzcssIOSSVGgsIZH4t1RQ+uPd8pedmnsya6a0nVqS2wr0NVvONROk4Z/kJfaXGV6HrKM4KiZ1TpqQzkTRt4mR87fJDlioRF4a/2x0GIjpslD5ZsXD2/lLUeqijjHaOfY9iGJCXT8tZWUGHxNnIaMZDMWrU7MFK1lSmbuogXPJH5tbhu+i0xuQ1efrHHnoMXsj7eX3Dmxmf/mHqkd//ekAmeCJIQXqi9XFM9zaKTkZp9iWCphvNSUvIMjWEaWqN8heDGuFxOFNy4gwVL13KtqhjOB6vtCjNQr9fR1eNet/PgBHuD01lRUelZMH+Vb5xiTSMUsncOxju2oOD7WOCFj5UInU6D3Gs3+HAuKdLS0kgVkixQhM4ffPXw8YBFg5F2w3bNxqtftv7f4Z1LaGSG3Cj+1TaXzce8N3z4cPxPgAEA6JcjmcJQzpoAAAAASUVORK5CYII=",
						traderImg : "/images/window/shop/shop_categories_sprite.png",
                        //"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAAUABQDASIAAhEBAxEB/8QAGAABAQEBAQAAAAAAAAAAAAAAAAgGBAf/xAAoEAACAQMEAgEDBQAAAAAAAAABAgMEBQYABxESEyIhCBRBMTIzQkP/xAAXAQEBAQEAAAAAAAAAAAAAAAAFAwQH/8QAJREBAAIBAwQBBQEAAAAAAAAAAQIRAwAEURITITFhIjJBkaGx/9oADAMBAAIRAxEAPwCzsr3ZqcwrZ446eojpYzykVNTuY2JcIZZCrKSo/cQG9V9jyCNZbNZd1dvJhd7NFEQ0qSwLJP4lVPcPCrop5Kle3aRf7AN0AZxg9uMvXHN0qy03ZJqWakeOZZJPGfNG0aq0kRZgU6NCyOAOP4jyew45MUxHJtsIb/kWZbwPlEF9t1PLRQxUJhWCKPvKKmY9zxKxk95OVAABJYk64jk3O7nMg3RJtFOktDgugWxG3jzty5p9yeVmEgOmKfcvsvzVfCJ/lGbOfUfie5O3tBmFROszVSc+V06s3Hx7KRyrA8gr+CCNNTz9PuN33IcBlym3xVTU94vVdcKX7qDxyeGadpI2dQB1ZkZXK8AgvwfkHTT+HsyxRcmSpUWeqdIY9/vSAGDqOb9/PrXoO82DYxJFBf5rYGqFk7xOsjRtFIVA7o6FXRuPUlWHK/B5HxrB2/aDF83ySltuZVtzutGKtpoqGuuLyQRuSf8AM+sgHYhVkDhQfUDTTRnZwu5hLpLTjhK1XeqbiUT19P8ATz+/zzqobJYLVZLelut1KEiT9Ofkk/kk/knTTTV4gxF0urFo8Gv/2Q==", //
                        miniMapIcon : "/images/icons/compass.png"
					},
					menu_callback : {
						goHome : "TaskQueue.add(new TaskWalk(Character.homeTown.town_id,'town'))",
						goToDaily1 : 'Map.center(1920, 2176);',
						goToDaily2 : 'Map.center(28288,16768);',
						ownSaloon : 'SaloonWindow.open(Character.homeTown.town_id);',
						openMarket : 'MarketWindow.open(Character.homeTown.town_id);',
						mobileTrader : "west.window.shop.open().showCategory('trader');",
						forum : "ForumWindow.open();",
						listNeeded : 'TWT.WindowCollection.open();',
						openOptions : "TWT.Options.open('setting')"
					},
					css : {
						style         : "position: relative; top:   0px; left:  0px; width: 12px; height: 12px; padding: 0; border: 0; margin: 0;",
						styleT        : "position: absolute; top:   4px; left:  3px; width: 15px; height: 15px; padding: 0; border: 0; margin: 0;",
						styleN        : "position: absolute; top: 120px; left: 25px; padding: 0; border: 0; margin: 0;",
						styleDB       : "position: absolute; top:   0px; left:  0px; padding: 0; border: 0; margin: 0;",
                        clear         : "clear: both; height: 0; width: 0; font-size: 0;",
                        frameHead     : "background-image: none;",
                        thead         : "height: 18px; line-height: 18px; font-size: 14px; text-transform: uppercase; text-align: left; background-image: none; margin: 3px;",
                        h3            : "color: #000000; font-size: 14px; text-align: center; margin: 0; padding: 6px; background: transparent url('/images/window/achievements/achv_meta.png') no-repeat scroll center -2px;",
                        hr            : "background: transparent url('/images/tw2gui/table/table_border.png') -20px -5px no-repeat; width: 467px; height: 5px;",
                        hr2           : "background: transparent url('/images/window/help/help_sprite.png') -30px -10px no-repeat; width: 195px; height: 10px; margin-left: 136px; margin-right: 136px;",
                        group         : "width: 462px; padding: 3px;",
                        img           : "cursor: auto;",
                        item          : "cursor: auto; width: 60px; height: 60px; margin: 3px; background-repeat: no-repeat;",
                        icons         : "float: left; cursor: auto; display: block; width: 20px; height: 60px;",
                        market        : "position: absolute; bottom: 3px; right: 3px; cursor: pointer; width: 17px; height: 16px; display: block; border-radius: 2px 0 2px 0; background: rgba(177, 161, 135, 0.7); " +
                                        "box-shadow: -1px -1px 2px #000000; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; opacity: 1;",
                        imsell        : "position: absolute; width: 17px; height: 16px; display: block; background: url('/images/icons/icon_search.png') no-repeat center center;",
                        thFetch       : "position: absolute; width: 17px; height: 16px; display: block; background: url('/images/market/fetch.png') no-repeat center center;",
                        thEncours     : "position: absolute; width: 17px; height: 16px; display: block; background: url('/images/window/market/market_icons2.png') no-repeat -15px 2px;",
                        divTrader     : "position: absolute; bottom: 3px; left:  1px; cursor: pointer; width: 22px; height: 24px; background-image: url('/images/window/shop/shop_categories_sprite.png'); background-position: -134px -152px; display: block;",
                        frameBg       : "width: 100%; height: 100%;",
                        checkbox      : "width: 100%; height: 18px; line-height: 18px; font-size: 14px; text-transform: uppercase; margin: 3px; background: url('/images/window/achievements/achv_expand.png?2') no-repeat bottom left;",
                        checked       : "width: 100%; height: 18px; line-height: 18px; font-size: 14px; text-transform: uppercase; margin: 3px; background: url('/images/window/achievements/achv_expand.png?2') no-repeat top left;",
                        reward        : "cursor: pointer; position: absolute; top: 11px; right: 13px; height: 18px; line-height: 18px; padding: 5px; color: #783927;",
                        bg0_thead     : "height: 33px; background: url('/images/tw2gui/table/table_thead.jpg?3') center bottom;",
                        closeTop      : "top: 0px; min-height: 25px; height: 5%;",
                        closeLeft     : "position: absolute !important; background: url('/images/tw2gui/table/table_border_lr.png') repeat-y top left; height: 90%; width: 50%; left: 0; top: 5%;",
                        closeRight    : "position: absolute !important; background: url('/images/tw2gui/table/table_border_lr.png') repeat-y top right; height: 90%; width: 50%; right: 0; top: 5%;",
                        closeBottom   : "min-height: 25px; height: 5%;",
                        marketBuyLink : "cursor: pointer; display: inline-block; position: absolute; top: 4px; left: 3px; width: 15px; height: 15px; padding: 0; border: 0; margin: 0; background: url('/images/window/market/market_icons2.png') repeat-x scroll -17px 0 transparent;",
                        miniMapIcon   : "cursor: pointer; display: inline-block; position: absolute; top: 20px; left: 3px; width: 15px; height: 15px; padding: 0; border: 0; margin: 0;",
                        majBtn        : "cursor: pointer; position: absolute; height: 25px; width: 25px; margin: 4px; background: url(./images/interface/character/menuicons.jpg) scroll 0px -250px transparent; background-clip: border-box;"
//span.tw2gui_combobox_text {
//background: url('/images/tw2gui/combobox.png') left top; height: 29px; width: 125px; min-width: 30px; max-width: 185px; overflow: hidden; line-height: 29px; padding-left: 8px; padding-right: 8px; vertical-align: middle;  } 
					},
					langPatchs : {
						cs : {
							link : "https://greasyfork.org/cs/scripts/7260",
							texte : "Czech - čeština",
							author : "Dr.Keeper"
						},
						es : {
							link : "https://greasyfork.org/es/scripts/7313",
							texte : "Spanish - Español",
							author : "pepe100"
						},
						de : {
							link : "https://greasyfork.org/de/scripts/1672",
							texte : "German - Deutsch",
							author : "Hanya"
						},
						it : {
							link : "https://greasyfork.org/it/scripts/1675",
							texte : "Italian - Italiano",
							author : "tw81"
						},
						hu : {
							link : "https://greasyfork.org/scripts/7261",
							texte : "Hungarian - Magyar",
							author : "Zoltan80"
						},
						sl : {
							link : "https://greasyfork.org/scripts/7259",
							texte : "Slovak - Slovenčina",
							author : "Surge"
						},
						pl : {
							link : "https://greasyfork.org/pl/scripts/15958",
							texte : "Polish - Polski",
							author : "Dun from Darius II mod & Azbestka mod"
						},
						pt : {
							link : "https://greasyfork.org/pt-BR/scripts/7312",
							texte : "Portuguese - Português",
							author : "VSaantiago"
						},
						ru : {
							link : "https://greasyfork.org/ru/scripts/7271",
							texte : "Russian - Pу́сский",
							author : "Anch665"
						},
						ro : {
							link : "https://greasyfork.org/scripts/9037",
							texte : "Romana",
							author : "Peta"
						}
					},
					langs : {
						en : {
							title : 'TW-Collections',
                            description : "<center><b>TW-Collections contains:</b>" +
                                        "<ul style=\"text-align: left; width: 300px;\">" +
                                        "  <li>Tips and reporting missing items collections</li>" +
                                        "  <li>List of collection needed items</li>" +
                                        "  <li>Bank fees on mouseover</li>" +
                                        "  <li>Various shortcuts</li>" +
                                        "  <li>All reports deletion</li>" +
                                        "  <li>Additional buttons in inventory (duplicates, useables, recipes, sets)</li>" +
                                        "  <li>etc...</li>" +
                                        "</ul></center>",
                            translation : {
                                title : 'Translations for TW Collections',
                                desc : '<div style="width:650px;margin-left:15px;margin-top:20px;height:250px;font-size:16px;text-align:justify;padding-bottom:50px;">' +
                                       '<h4 style="margin-bottom:20px;"><center>The translation\'s system of the TW Collections script has changed</center></h4>' +
                                       "TW Collections script contains just the french and english languages, if you need a different translation you must install one of the script below and reload the TW page.<BR><BR>" +
                                       "<div style='text-align: center;overflow: auto; height: 165px;font-size:15px;'>%1</div><br>" +
                                       "If you want to create your own translation, you can go to <a target=\'_blanck\' href=\'https://greasyfork.org/pl/scripts/15957\'> the home page of the script</a> for more explanations.</div>"
                            },
							Options : {
								tab : {
									setting : 'Settings',
                                    settingDesc : "Open the Settings page",
                                    translation : 'Translations',
                                    translationDesc : "Open the Translation tips page"
								},
								checkbox_text : {
									box : {
										title : 'Features / Menus',
										options : {
											goHome : 'Travel to town',
											goToDaily1 : 'Ghost Town',
											goToDaily2 : 'Waupee Indian Camp ',
											ownSaloon : 'Open saloon',
											openMarket : 'Open Market',
											mobileTrader : 'Open Mobile Trader',
											forum : 'Open forum',
											listNeeded : 'Collector\'s items needed'
										}
									},
									collection : {
										title : 'Collections',
										options : {
											gereNewItems : 'Manage the new items added on succeeded achievements',
											patchsell : 'Signal missing items in inventory',
											patchtrader : 'Signal missing items on Traders',
											patchmarket : 'Signal missing items on Market',
											showmiss : 'List for missing items on tip',
											filterMarket : 'Market filter: show only missing items (collections)'
										}
									},
									inventory : {
										title : 'Buttons in inventory',
										options : {
											doublons : 'Add button for duplicates search',
											useables : 'Add button for useables search',
											recipe : 'Add button for recipes search',
											sets : 'Add button for sets list',
											sum : 'Show sell sum on search based on merchant prices'
										}
									},
									miscellaneous : {
										title : 'Miscellaneous',
										options : {
											lang : 'Language',
											logout : 'Add Logout button',
											deleteAllReports : 'Add suppress all reports action',
											showFees : 'Add Bank Fees on Mouseover',
											popupTWT : 'Open menu of TW Collections on mouse hover'
										}
									},
									craft : {
										title : 'Craft',
										options : {
											filterMarket : 'Icon for searching craft item in the market'
									//		filterMiniMap : 'Icon for searching craft item job in the minimap'
										}
									},
									twdbadds : {
										title : 'Clothcalc Add-on',
										options : {
											filterBuyMarket : 'Market filter: show only marked missing items <a target=\'_blanck\' href="http://tw-db.info/?strana=userscript">(twdb add)</a>'
										}
									}
								},
								message : {
									title : 'Information',
									message : 'Preferences have been applied.',
									reloadButton : 'Reload this page',
									gameButton : 'Return to the game',
									indispo : 'Setting unavailable (Collections completed or script not available)',
									more : 'More ?',
									moreTip : 'Open the translations tips page'
								},
								update : {
									title : 'Update',
									upddaily : 'Every day',
									updweek : 'Every week',
									updnever : 'Never',
									checknow : 'Check update now ?',
									updok : "The TW Collection's script is up to date",
									updlangmaj : 'An update is available for one or more languages of the TW Collections script.<BR>Clic on the links bellow to upgrade.',
									updscript : 'An update is available for the script TW Collections<br/>Upgrade ?',
									upderror : 'Unable to upgrade, you should install the script or language manually.'
								},
								saveButton : 'Save'
							},
							Craft : {
								titleMarket : 'Search this item in the market',
								titleMinimap : 'Find corresponding job in the minimap'
							},
							ToolBox : {
								title : 'Features',
								list : {
									openOptions : 'Settings'
								}
							},
							Doublons : {
								tip : 'Show only duplicates',
								current : 'Current search',
								upgradeable:'Upgradeables',
								noset : 'Without set items',
								sellable : 'Sellables',
								auctionable : 'Auctionables',
								tipuse : 'Show only useables',
								tiprecipe : 'Show only recipes',
								tipsets : 'Show only set items',
								sellGain : '$ from the merchant'
							},
							Logout : {
								title : 'Logout'
							},
							AllReportsDelete : {
								button : 'Suppress all',
								title : 'Suppress all reports',
								work : 'Job',
								progress : 'Progress',
								userConfirm : 'User Confirm',
								loadPage : 'Load Page',
								deleteReports : 'Delete reports',
								confirmText : 'Delete all reports - Are you sure?',
								deleteYes : 'Yes, delete',
								deleteNo : 'No, don\'t delete',
								status : {
									title : 'Status',
									wait : 'Wait',
									successful : 'R&eacute;ussi',
									fail : 'Error',
									error : 'Error'
								}
							},
							fees : {
								tipText : '%1% Fees: $%2'
							},
							twdbadds : {
								buyFilterTip : 'Show only missing items',
								buyFilterLabel : 'Missing items'
							},
							collection : {
								miss : "Missing : ",
								colTabTitle : "Collections",
								setTabTitle : "Sets",
                                setType : {
                                    body : "Clothes Sets",
                                    guns : "Weapon Sets",
                                    animal : "Riding Sets"
                                },
								thText : '%1 missing item%2',
								thEncours : 'You have a bid for this item',
								thFetch : 'You may retrieve this item at the market of %1',
								allOpt : 'All',
                                listText : 'Collector\'s items needed',
								listSetText : 'Set\'s items needed',
								collectionFilterTip : 'Show only collections items',
								collectionFilterLabel : 'Collections only',
								select : 'Select ...',
								filters : 'Filters',
								atTrader : 'Sold by mobile trader',
								atBid : 'Current bids',
								atCurBid : 'Ended bids',
								searchMarket : 'Search in the market',
								atTraderTitle : 'Show items on sale at the mobile trader',
								atBidTitle : 'Show currents bids',
								atCurBidTitle : 'Show items retrievable at market',
								patchsell : {
									title : "Items needed to complete collections"
								}
							},
                            errors : {
                                init : 'Initialisation des Collections impossible',
                                item : 'Erreur sur %1 %2',
                                identify : 'Impossible de recenser les items manquants pour ',
                                injId : 'Erreur injection ',
                                retauration : 'Erreur retauration ',
                                injMarket : 'Erreur inject market',
                                upCat : 'Erreur update category',
                                injUpBag : 'Injection Bag updater error',
                                injThCraft : 'Erreur Injection des meacute;thodes craft',
                                injTh : 'Erreur Injection des meacute;thodes ',
                                injThCol : 'Erreur Injection des meacute;thodes collections ',
                                injCol : 'TWT : Erreur injection collections',
                                up : 'Update error',
                                debug : 'Debug d\'affichage des mises a jour'
                            }
						}
					},
					getLanguage : function() {
						var detected_lang;
						try {
							detected_lang = TWT.scriptStorage.getItem('TWT.Cache.miscellaneous.lang');
							if (!isDefined(detected_lang)) {
								detected_lang = Game.locale.match(/(\S*)_/)[1]; // basé sur la langue du serveur
							}
							if (!isDefined(detected_lang)) {
								detected_lang = TWT.info.lang; // Nouveau
							}
						} catch (ex) {
							detected_lang = TWT.info.lang; // béta (w1/w2) ...
						} finally {
							var langue = TWT.langs[detected_lang];
							if (!isDefined(langue)) { // langue non connue ou chargement des patchs lang non fait
								langue = TWT.langs[TWT.info.lang];
								var saved_descr = localStorage.getItem('TWT.Cache.description');
								if (isDefined(saved_descr)) {
									langue.description = saved_descr; // permet d'initialiser l'api avec la traductin
								}
								EventHandler.listen('twt_lang_started_' + detected_lang, function() {
									TWT.getLanguage();
									return EventHandler.ONE_TIME_EVENT; // Unique
								});
							} else {
								TWT.info.lang = detected_lang;
							}
							return langue;
						}
					},
					addMissedTrad : function(enTrObj, langTrObj) {
						if (!isDefined(langTrObj)) {
							langTrObj = {};
						}
						$.each(enTrObj,
										function(ind, item) {
											if (jQuery.type(item) == "object") {
												langTrObj[ind] = TWT.addMissedTrad(item,langTrObj[ind]);
											} else {
												if (jQuery.type(langTrObj[ind]) == "undefined") {
													langTrObj[ind] = enTrObj[ind];
												}
											}
										});
						return langTrObj;
					},
					isGreasyLang : function(lang) {
						var oldIdLangs = [ "179395", "179358", "179298", "178773", "180784", "182959", "179302" ];
						if ($.inArray(lang.idscript, oldIdLangs) > -1) {
							// old script lang
							var dlg = new west.gui.Dialog(
									"Unmaintained language script for TW Collection",
									"<div><b>You are using an obsolete version of '" + lang.name + "' language script for TW Collection.</b>" +
                                    "<br /><br />You should manually uninstall this script and " +
                                    "<br /><a target='_blanck' href='" + TWT.langPatchs[lang.short_name].link + "'>" + "Install the correct version  of " + lang.name + " script.</a>" + "</div>",
									west.gui.Dialog.SYS_WARNING).setModal(true,
									false, {
										bg : "../images/curtain_bg.png",
										opacity : 0.4
									}).addButton(west.gui.Dialog.SYS_OK).show();
							return false;
						} else {
							return true;
						}
					},
					addPatchLang : function(lang) {
						try {
							if (TWT.isGreasyLang(lang)) {
								TWT.langs[lang.short_name] = lang.translation;
								TWT.languages.push( {
									'short_name' : lang.short_name,
									'name' : lang.name,
									'translator' : lang.translator,
									'version' : lang.version,
									'script' : lang.idscript
								});
								TWT.langs[lang.short_name] = TWT.addMissedTrad(TWT.langs["en"],TWT.langs[lang.short_name]);
								EventHandler.signal('twt_lang_started_' + lang.short_name);
							}
						} catch (e) {
							ErrorLog.log(e);
						}
					},
					checkIsValidLang : function() {
						var selLang = TWT.langs[TWT.Settings.checked.miscellaneous.lang] || undefined;
						if (!isDefined(selLang)) {
							TWT.Options.open('translate');
							TWT.Settings.checked.miscellaneous.lang = TWT.info.lang;
							TWT.scriptStorage.setItem('TWT.Cache.miscellaneous.lang',TWT.info.lang);
						}
					},
					init : function() {
						try {
							EventHandler.signal("twt.init"); // Signalement pour les patchs de langues
							var that = this;
							var timeout = 0;
							this.interval = setInterval(
									function() {
										var loading = false;
										if (isDefined(Character.playerId) && Character.playerId == 0) {
											loading = false;
										} else if (!isDefined(ItemManager)) {
											loading = false;
										} else if (isDefined(ItemManager.initialized) && !ItemManager.initialized) {
											loading = false;
										} else if (isDefined(window.TWDB)) {
											if (!window.TWDB.ClothCalc.ready) { // Attente des injections TWDB
												loading = false;
												// si TWDB se plante on arrete au bout de 20 secondes
												timeout++;
												if (timeout > 20) {
													ErrorLog.log('Stop interval, chargement de TWDB non possible?');
													TWT.isTWDBHere=true; //(pas forcement pret mais présent)
													loading = true;
												}
											} else {
												TWT.isTWDBHere=true;
												loading = true;
											}
										} else {
											loading = true;
										}
										if (loading) {
											clearInterval(that.interval);
											if (TWT.scriptStorage == null) {
												TWT.scriptStorage = new Storage("local","Storage." + TWT.info.idscript);
											}
											TWT.LANG = TWT.getLanguage();
											TWT.Settings.init();
											TWT.checkIsValidLang();
											if (!TWT.DEBUG) {
												ScriptUpdater.check(
														TWT.info.idscript,
														TWT.info.version);
												TWT.api();
											} else {
												window.DEBUG = true;
											}
											TWT.ready = true;
											EventHandler.signal('twt.ready');
										}
									}, 500);
						} catch (e) {
							ErrorLog.log("Erreur d'initialisation", e);
							ErrorLog.showLog();
							TWT.ready = false;
						}
					},
					Commons : {
						searchMarket : function(id) {
							if (!isNaN(id)) {
								var objS = ItemManager.get(id);
								id = objS.name;
							}
							MarketWindow.open(Character.homeTown.town_id);
							MarketWindow.showTab('buy');
							$("div.market-buy .iSearchbox input", MarketWindow.DOM).val(id);
							$('span.iconBut_mpb_refresh', MarketWindow.DOM).click();
						},
						searchMiniMap : function(id) {
							var objS = ItemManager.get(id);
							MinimapWindow.clickQuicklink(objS.name, "task-finish-job");
						},
						addMarketBuyLink : function(itemId) {
							var imgMrket = $('<img class="TWTcraftitem opmarket" id="' + itemId +
                                             '" style="' + TWT.css.marketBuyLink + '" ' +
                                             'title="' + TWT.LANG.Craft.titleMarket + '" />')
                                           .click(
                                               function(e) {
                                                   TWT.Commons.searchMarket(e.target.attributes['id'].value);
                                               });
							return imgMrket;
						},
						addMiniMapIcon : function(itemId) {
							var imgMiniMap = $('<img class="TWTcraftitem opmap" id="' + itemId +
                                               '" style="' + TWT.css.miniMapIcon + '" ' +
                                               'src="' + TWT.images.miniMapIcon + '"' +
                                               'title="' + TWT.LANG.Craft.titleMinimap + '" />')
									         .click(
                                                 function(e) {
                                                     TWT.Commons.searchMiniMap(e.target.attributes['id'].value);
                                                 });
							return imgMiniMap;
						}
					},
					Settings : {
						checked : {},
						shouldRefresh : {},
						init : function() {
							if (!isDefined(TWT.scriptStorage.getItem('TWT.Cache.Metacol.finished'))) {
							} else {
								TWT.MetaCol.finished = TWT.scriptStorage.getItem('TWT.Cache.Metacol.finished');
							}
							$.each(TWT.LANG.Options.checkbox_text,
											function(ind1, val) {
												TWT.Settings.checked[ind1] = [];
												$.each(TWT.LANG.Options.checkbox_text[ind1]['options'],
																function(ind2,detail) {
																	var attended;
																	attended = TWT.scriptStorage.getItem('TWT.Cache.' + ind1 + '.' + ind2);
																	if (!isDefined(attended)) {
																		if (ind2 == 'lang') {
																			attended = TWT.info.lang;
																		} else {
																			attended = '1';
																		}
																		TWT.scriptStorage.setItem('TWT.Cache.' + ind1 + '.' + ind2, attended);
																	}
																	TWT.Settings.checked[ind1][ind2] = attended;
																});
											});
							TWT.Settings.apply();
						},
						getValue : function(what) {
							return eval('TWT.Settings.checked.' + what);
						},
						isChecked : function(what) {
							return TWT.Settings.getValue(what) == "1";
						},
						refresh : function(tabOpt) {
							var refreshed = false;
							try {
								for ( var key in tabOpt) {
									if (tabOpt.hasOwnProperty(key)) {
										var val = tabOpt[key];
										if (val != TWT.Settings.getValue(key)) {
											TWT.scriptStorage.setItem('TWT.Cache.' + key, val);
											var det = key.split('.');
											TWT.Settings.checked[det[0]][det[1]] = val;
											EventHandler.signal(key);
											refreshed = true;
										}
									}
								}
								TWT.LANG = TWT.langs[TWT.Settings.getValue('miscellaneous.lang')] || TWT.langs["en"];
								EventHandler.signal('collection.bagupdate');
							} catch (e) {
								ErrorLog.log('Erreur refresh ', e);
							}
							return refreshed;
						},
						apply : function() {
							TWT.LANG = TWT.langs[TWT.Settings.getValue('miscellaneous.lang')] || TWT.langs[TWT.info.lang];
							TWT.MenuBox.initListener();
							TWT.MenuBox.create();
							TWT.Injecteur.startListen();
							TWT.Logout.initListener();
                            if        (TWT.Settings.isChecked('inventory.doublons') ||
									   TWT.Settings.isChecked('inventory.useables') ||
									   TWT.Settings.isChecked('inventory.recipe') ||
									   TWT.Settings.isChecked('inventory.sets')) {
								TWT.Inventaire.create();
							} else {
								TWT.Inventaire.detach();
							}
							TWT.CraftHandler.initListener();
							TWT.BankFees.initListener();
							TWT.AllReportsDelete.initListener();
							if (TWT.Settings.isChecked('craft.filterMarket') || TWT.Settings.isChecked('craft.filterMiniMap')) {
								TWT.CraftHandler.init();
								TWT.CraftHandler.inject();
							}
							if (TWT.Settings.isChecked('miscellaneous.logout'))
								TWT.Logout.create();
							if ((!TWT.MetaCol.finished) || TWT.isTWDBHere) {
								TWT.Market.initListener();
								if (TWT.Settings.isChecked("twdbadds.filterBuyMarket") || TWT.Settings.isChecked('collection.filterMarket')) {
									TWT.Market.init();
									TWT.Market.inject();
								}
							}
							if (!TWT.MetaCol.finished) {
								TWT.CollectionsHandler.initListener();
								if (TWT.Settings.isChecked('collection.patchsell') ||
                                    TWT.Settings.isChecked('collection.patchmarket') ||
                                    TWT.Settings.isChecked('collection.showmiss')) {
									// EventHandler.signal('collection.bagupdate');
									TWT.CollectionsHandler.init();
									TWT.CollectionsHandler.inject();
									TWT.CollectionsHandler.attachFilter();
								}
							}
							if (TWT.Settings.isChecked('miscellaneous.showFees')) {
								TWT.BankFees.attach();
							}
							if (TWT.Settings.isChecked('miscellaneous.deleteAllReports')) {
								TWT.AllReportsDelete.addStyle();
								TWT.AllReportsDelete.attach();
							}
						}
					},
					Options : {
						open : function(window) {
							TWT.Options.Windows = wman.open('TWTToolWindow')
									.addClass('noreload').setMiniTitle(TWT.LANG.Options.tab.setting)
									.addTab(TWT.LANG.Options.tab.setting,'TabSetting',TWT.Options.setting.open)
                                    .addTab(TWT.LANG.Options.tab.translation,'TabTranslate',TWT.Options.translate.open);
							$('<div></div>')
									.attr( {'id' : 'ToolWindowBody'})
									.css( {
										'margin-left' : '20px',
										'margin-right' : '20px'
									})
									.appendTo('.TWTToolWindow .tw2gui_window_content_pane');
							if (window == 'setting') {
								TWT.Options.setting.open();
							} else {
								TWT.Options.translate.open();
							}
						},
						translate : {
							open : function() {
								var txtArea = "";
								var langPatchs = TWT.langPatchs;
								$.each(langPatchs, function(lang) {
									txtArea += "<a target='_blanck' href='" + langPatchs[lang].link + "'>" + langPatchs[lang].texte + " by " + langPatchs[lang].author + "</a><br>";
								});
                                txtArea = TWT.LANG.translation.desc.replace("%1",txtArea);
								TWT.Options.Windows.activateTab('TabTranslate')
										.$("div.tw2gui_window_content_pane")
										.empty();
								TWT.Options.Windows.setTitle(TWT.LANG.translation.title);
								TWT.Options.Windows.appendToContentPane(txtArea);
								TWT.Options.Windows.appendToContentPane(TWT.getDunMp());
							}
						},
						setting : {
							open : function() {
								TWT.Options.Windows.activateTab('TabSetting').$("div.tw2gui_window_content_pane").empty();
								TWT.Options.Windows.setTitle(TWT.LANG.Options.tab.setting);
								var save_button = new west.gui.Button(TWT.LANG.Options.saveButton,TWT.Options.save);
								var l0 = TWT.Options.createLanguage();
								var l01 = TWT.Options.createMAJ();
								var l1 = TWT.Options.getContent();
								var l2 = $('<div style="text-align:center;"/>').append(save_button.getMainDiv());
								TWT.Options.Windows
										.appendToContentPane($('<div class="daily_activity-list" id="divopts" style="font-weight: bolder;width: 683px;left:10px;"/>')
										.append(l0).append(l01).append(l1).append(l2));
								$("#divopts", TWT.Options.Windows.getMainDiv()).css("width: 674px;");
								TWT.Options.Windows.appendToContentPane(TWT.getDunMp());
								$(".fancytable div.trows div.tbody").css( {
									"min-height" : "30px"
								});
							}
						},
						getContent : function() {
							var scrollbar = new west.gui.Scrollpane;
							$.each(TWT.LANG.Options.checkbox_text,
											function(key) {
												var table = new west.gui.Table(true)
														       .setId('paramtwt_table_' + key)
														       .createEmptyMessage('! No Parameters !')
														       .addColumn("settings_" + key)
														       .appendToThCell("head",
																"settings_" + key,
																TWT.LANG.Options.checkbox_text[key]['title'],
																"<span style='font-size:12pt;padding-left:25px;'>" + TWT.LANG.Options.checkbox_text[key]['title'] + "</span>");
												$.each(TWT.LANG.Options.checkbox_text[key]['options'],
																function(i) {
																	if (i != 'lang') {
																		var checkB;
																		if ((TWT.MetaCol.finished && (key == 'collection' || i == 'listNeeded')) || ((key == 'twdbadds') && !TWT.isTWDBHere)) {
																			checkB = $("<span title='" + TWT.LANG.Options.message.indispo + "' style='color: #808080;font-style: italic;font-size:11pt;padding-left:10px;' />")
																					.append(TWT.LANG.Options.checkbox_text[key]['options'][i]);
																		} else {
																			checkB = new west.gui.Checkbox()
																					.setTitle(TWT.LANG.Options.checkbox_text[key]['options'][i])
																					.setLabel("<span style='font-size:11pt;padding-left:10px;'>" + TWT.LANG.Options.checkbox_text[key]['options'][i] + "</span>")
																					.setSelected(TWT.Settings.isChecked(key + '.' + i))
																					.setId('setting_' + key + '_' + i)
																					.getMainDiv();
																		}
																		table.appendRow(checkB,'');
																	}
																});
												scrollbar.appendContent(table.getMainDiv());
											});
							$(scrollbar.getMainDiv()).css( {
								"height" : "300px",
								"margin-top" : "5px;",
								"font-weight" : "normal"
							});
							return $(scrollbar.getMainDiv());
						},
						createLanguage : function() {
							TWT.Options.lang_box = new west.gui.Combobox;
							for ( var i = 0; i < TWT.languages.length; i++) {
								TWT.Options.lang_box.addItem(TWT.languages[i].short_name,TWT.languages[i].name);
							}
							TWT.Options.lang_box.select(TWT.Settings.getValue('miscellaneous.lang'));
							var more_button = new west.gui.Button(
									TWT.LANG.Options.message.more,
									TWT.Options.translate.open, this, this,
									TWT.LANG.Options.message.moreTip);
							return $("<span />")
									.append(TWT.LANG.Options.checkbox_text.miscellaneous.options.lang + " : ")
                                    .append(TWT.Options.lang_box.getMainDiv())
									.append(more_button.getMainDiv());
						},
						createMAJ : function() {
							TWT.Options.maj_box = new west.gui.Combobox;
							TWT.Options.maj_box.addItem(0,TWT.LANG.Options.update.updnever);
							// TWT.Options.maj_box.addItem(3600000,"every hour");
							// TWT.Options.maj_box.addItem(21600000,"every 6 hours");
							TWT.Options.maj_box.addItem(86400000,TWT.LANG.Options.update.upddaily);
							TWT.Options.maj_box.addItem(604800000,TWT.LANG.Options.update.updweek);
							TWT.Options.maj_box.select(ScriptUpdater.getInterval());
							var maj_button = $('<span title="' + TWT.LANG.Options.update.checknow +
                                               '" style="' + TWT.css.majBtn + '" />');
							maj_button.click(function(e) {
								TWT.Options.Windows.showLoader();
								EventHandler.listen("scriptmaj.ok", function() {
									new UserMessage(TWT.LANG.Options.update.updok, UserMessage.TYPE_SUCCESS).show();
									return EventHandler.ONE_TIME_EVENT;
								});
								ScriptUpdater.forceCheck(TWT.info.idscript,TWT.info.version);
								TWT.Options.Windows.hideLoader();
							});
							TWT.Options.maj_box.select(ScriptUpdater.getInterval());
							return $("<span style='text-align:left;'/>")
									.append("&nbsp;" + TWT.LANG.Options.update.title + " :  ")
                                    .append(TWT.Options.maj_box.getMainDiv())
									.append(maj_button);
						},
						save : function() {
							TWT.Options.Windows.showLoader();
							var tblSave = new Array();
							$.each(TWT.LANG.Options.checkbox_text,
                                   function(key) {
                                       $.each(TWT.LANG.Options.checkbox_text[key]['options'],
                                              function(i) {
                                                  if (i != 'lang') {
                                                      tblSave[key + '.' + i] = $('#setting_' + key + '_' + i) .hasClass( "tw2gui_checkbox_checked");
                                                  }
                                              });
                                   });
							tblSave['miscellaneous.lang'] = TWT.Options.lang_box.getValue();
							ScriptUpdater.setInterval(TWT.Options.maj_box.getValue());
							TWT.Settings.refresh(tblSave);
							TWT.Options.Windows.hideLoader();
							new UserMessage(TWT.LANG.Options.message.message,UserMessage.TYPE_SUCCESS).show();
							wman.close('TWTToolWindow');
						}
					},
					MenuBox : {
						selectbox : null,
						initListener : function() {
							EventHandler.listen('miscellaneous.popupTWT',
									function() {
										$('#TWT_Icon').remove();
										TWT.MenuBox.create();
									});
						},
						create : function() {
							$('#TWT_Icon').remove();
							var a = $('<div></div>').attr( {
								'class' : 'menulink',
								'title' : TWT.LANG.ToolBox.title
							}).css( {
								'background-position' : '0px -100px'
							}).mouseleave(
									function() {
										$(this).css("background-position","0px -100px");
									}).click(function(e) {
								TWT.MenuBox.open(e);
							});
							if (TWT.Settings.isChecked('miscellaneous.popupTWT')) {
								a.mouseenter(function(e) {
									$(this).css("background-position","-25px -100px");
									TWT.MenuBox.open(e);
								});
							}
							var b = $('<div></div>').attr( { 'class' : 'menucontainer_bottom' });
							$('#ui_menubar .ui_menucontainer :first').after(
									$('<div></div>').attr( { 'class' : 'ui_menucontainer', 'id' : 'TWT_Icon' }).append(a).append(b));
						},
						open : function(e) {
							if (isDefined(this.selectbox)) {
								this.selectbox.items = [];
							} else {
								this.selectbox = new west.gui.Selectbox(true);
								this.selectbox.setWidth(150).addListener(
								function(key) {
									if (key == 99) {
										eval(TWT.menu_callback['openOptions']);
									} else {
										eval(TWT.menu_callback[key]);
									}
								});
							}
							var that = this;
							$.each(TWT.LANG.Options.checkbox_text.box.options,function(indexB, keyB) {
                                if (TWT.Settings.isChecked('box.' + indexB))
                                    that.selectbox.addItem(indexB, keyB);
                            });
							this.selectbox.addItem(99,TWT.LANG.ToolBox.list.openOptions);
							this.selectbox.show(e);
							this.selectbox.setPosition(e.clientX,e.clientY - 25);
							$(this.selectbox.elContent).mouseleave(function() {
								that.selectbox.hide();
							});
						}
					},
					MetaCol : {
						group : [],
                        type : "",
                        rewards : [],
                        groupTypes : [],
                        groupType : [],
						groupSorted : [],
						marketEC : {},
                        itemsAll : {},
						all : {},
						inProgress : {},
						erreur : false,
						ready : false,
						dirty : true,
						getMarketEC : function() {
							$.ajax( {   url : 'game.php?window=building_market&action=fetch_bids&h=' + Player.h,
										type : 'POST',
										data : {},
										dataType : 'json',
										async : false,
										success : function(json) {
											if (json.error)
												return new UserMessage(json.msg,UserMessage.TYPE_ERROR).show();
											var result = json.msg.search_result;
											TWT.MetaCol.marketEC = [];
											for ( var i = 0; i < result.length; i++) {
												var item = ItemManager.get(result[i].item_id);
												if(isDefined(item)){
													TWT.MetaCol.marketEC[$.trim(item.name)] = result[i];
												}
											}

										}
									});
						},
                        setRewards : function() {
                            TWT.MetaCol.rewards = { "10250" : "264000",   "10251" : "575000",   
                                                    "10252" : "140000",   "10253" : "863000",
                                                    "10254" : "40002000", "10255" : "439000",
                                                    "10256" : "11139000", "10257" : "10150000",
                                                    "10270" : "58000",    "10271" : "611000" };
                        },
                        setGroupType : function() {
                            TWT.MetaCol.setRewards();
                            $.ajax( { url     : 'game.php?window=achievement&action=get_list&h=' + Player.h,
                                     type     : 'POST',
                                     data     : {'folder'   : 'items',
                                                 'playerid' : Character.playerId},
                                     dataType : 'json',
                                     async    : false,
                                     success  : function(data_return) {
                                         var all = eval(data_return);
                                         if (all["achievements"]["progress"].length > 0 || TWT.Settings.isChecked('collection.gereNewItems')) {
                                             try {
                                                 var tmpArr = all["achievements"]["progress"];
                                                 if (TWT.Settings.isChecked('collection.gereNewItems')) {
                                                     $.merge(tmpArr, all["achievements"]["finished"]);
                                                 }
                                                 $.each(tmpArr,
                                                        function(index, value) {
                                                            var id = $.trim(value.id);
                                                            var rewards = ($.trim(value.rewards) == '[object Object]') ? TWT.MetaCol.rewards[id] : null;
                                                            var title = $.trim(value.title);
                                                            if ((id >= 10000) && ((title != "each") && (title != "rar") && (title != "shuffle") && (title != "unique")) && ((rewards) || TWT.Settings.isChecked('collection.gereNewItems'))) {
                                                                //id = id.toString();
                                                                TWT.MetaCol.groupTypes.push(id);
                                                                var rex = /[<]li([\s\S]*?)\/li[>]/gm;
                                                                var match;
                                                                while (match = rex.exec(value.meta)) {
                                                                    var val = match[0];
                                                                    var subid = /achv-id="(.*?)"/.exec(val)[1];
                                                                    //subid = subid.toString();
                                                                    var shouldBuy = (val.indexOf("locked") > -1);
                                                                    if (shouldBuy) {
                                                                        if (!isDefined(TWT.MetaCol.groupType[id]))
                                                                            TWT.MetaCol.groupType[id] = [];
                                                                        
                                                                        if (!isDefined(TWT.MetaCol.groupType[id].title))
                                                                            TWT.MetaCol.groupType[id].title = title;
                                                                        if (!isDefined(TWT.MetaCol.groupType[id].rewards))
                                                                            TWT.MetaCol.groupType[id].rewards = rewards;
                                                                        TWT.MetaCol.groupType[id].push(subid);
                                                                    }
                                                                }
                                                                var rex2 = /<span.*?([\s\S]*?)<\/span>/gm;
                                                                var match2;
                                                                while (match2 = rex2.exec(value.meta)) {
                                                                    var val2 = match2[1];
                                                                    var srcI = /<img.*?src="(.*?)"/.exec(val2)[1];
                                                                    var name = /<img.*?alt="(.*?)"/.exec(val2)[1];
                                                                    var shoudBuy2 = (val2.indexOf("locked") > -1);
                                                                    TWT.MetaCol.inProgress[name] = {
                                                                        shouldBuy : shoudBuy2,
                                                                        src : srcI,
                                                                        img : srcI.match(/\S*.\/(\S*png)/)[1],
                                                                        group : title,
                                                                        id : 0
                                                                    };
                                                                    if (shoudBuy2) {
                                                                        if (!isDefined(TWT.MetaCol.groupType[id]))
                                                                            TWT.MetaCol.groupType[id] = [];
                                                                        TWT.MetaCol.groupType[id].push(id);
                                                                        if (!isDefined(TWT.MetaCol.groupType[id].title))
                                                                            TWT.MetaCol.groupType[id].title = title;
                                                                        if (!isDefined(TWT.MetaCol.groupType[id].rewards))
                                                                            TWT.MetaCol.groupType[id].rewards = rewards;
                                                                        if (!isDefined(TWT.MetaCol.group[title]))
                                                                            TWT.MetaCol.group[title] = [];
                                                                        TWT.MetaCol.group[title].push(name);
                                                                        if (!isDefined(TWT.MetaCol.group[title].type))
                                                                            TWT.MetaCol.group[title].type = id;
                                                                        if (!isDefined(TWT.MetaCol.group[title].id))
                                                                            TWT.MetaCol.group[title].id = id;
                                                                    }
                                                                }
                                                            }
                                                        });
                                                 var sortable = [];
                                                 for (var key in TWT.MetaCol.groupTypes) {
                                                     if ((key != "each") && (key != "rar") && (key != "shuffle") && (key != "unique") && (TWT.MetaCol.groupType[TWT.MetaCol.groupTypes[key]] != undefined))
                                                         sortable.push(TWT.MetaCol.groupTypes[key]);
                                                 }
                                                 sortable.sort(function(a, b) {
                                                     return a - b;
                                                 });
                                                 TWT.MetaCol.groupTypes = sortable;
                                             } catch (e) {
                                                 this.erreur = TWT.LANG.errors.init;
                                                 ErrorLog.log(e, this.erreur);
                                                 ErrorLog.showLog();
                                             }
                                         } else {
                                             EventHandler.signal('collections_finished');
                                             TWT.MetaCol.finished = true;
                                             TWT.scriptStorage.setItem('TWT.Cache.Metacol.finished',true);
                                         }
                                     }
                                    });
                        },
                        getGroupType : function(group) {
                            TWT.MetaCol.type = 0;
                            for (var i = 0; i < TWT.MetaCol.groupTypes.length; i++) {
                                if (TWT.MetaCol.groupType[TWT.MetaCol.groupTypes[i]].indexOf(group) > -1) {
                                    TWT.MetaCol.type = TWT.MetaCol.groupTypes[i];
                                    break;
                                }
                            }
                        },
						populateInProgress : function(all) {
                            try {
								var tmpArr = all["achievements"]["progress"];
                                if (TWT.Settings.isChecked('collection.gereNewItems')) {
									$.merge(tmpArr,all["achievements"]["finished"]);
								}
                                $.each(tmpArr, function(index, value) {
													var rex = /<span.*?([\s\S]*?)<\/span>/gm;
													var match;
													while (match = rex.exec(value.meta)) {
														var val = match[1];
														var srcI = /<img.*?src="(.*?)"/.exec(val)[1];
                                                        var id = $.trim(value.id);
                                                        //id = id.toString();
                                                        
														var ident = $.trim(value.title);
														var name = /<img.*?alt="(.*?)"/.exec(val)[1];
														var shoudBuy = (val.indexOf("locked") > -1);
                                                        TWT.MetaCol.inProgress[name] = {
															shouldBuy : (val.indexOf("locked") > -1),
															src : srcI,
															img : srcI.match(/\S*.\/(\S*png)/)[1],
															group : ident,
                                                            id : 0
														};
														if (shoudBuy) {
															if (!isDefined(TWT.MetaCol.group[ident]))
																TWT.MetaCol.group[ident] = [];
                                                            TWT.MetaCol.group[ident].push(name);
                                                            TWT.MetaCol.getGroupType(id);
                                                            if (!isDefined(TWT.MetaCol.group[ident].type))
																TWT.MetaCol.group[ident].type = TWT.MetaCol.type;
                                                            if (!isDefined(TWT.MetaCol.group[ident].id))
																TWT.MetaCol.group[ident].id = id;
														}

													}
                                                });
								var sortable = [];
								for ( var group in TWT.MetaCol.group) {
                                    if ((group != "each") && (group != "rar") && (group != "shuffle") && (group != "unique")) {
                                        sortable.push( [ group, TWT.MetaCol.group[group] ]);
                                    }
								}
                                
                                /*
                                sortable.sort(function(a, b) {
									var x = a[0];
									var y = b[0];
									if (typeof x === 'string' && typeof y === 'string') {
										return x.localeCompare(y);
									}
									return ((x < y) ? -1 : ((x > y) ? 1 : 0));
								});
                                */
								TWT.MetaCol.groupSorted = sortable;
								TWT.MetaCol.dirty = false;
							} catch (e) {
								this.erreur = TWT.LANG.errors.init;
								ErrorLog.log(e, this.erreur);
								ErrorLog.showLog();
							}
						},
						sort : function(array, key) {
							return array.sort(function(a, b) {
								var x = a[key];
								var y = b[key];
								return ((x < y) ? -1 : ((x > y) ? 1 : 0));
							});
						},
                        getId : function () {
                            for (var i = 1; i <= 2147483; i++) {
                                var item = ItemManager.get(i*1000);
                                if ((item != undefined) && (isDefined(TWT.MetaCol.inProgress[item.name])) && (TWT.MetaCol.inProgress[item.name].id == 0)) {
                                    TWT.MetaCol.inProgress[item.name].id = i*1000;
                                }
                            }
                        },
						init : function() {
							if (this.ready == false) {
								TWT.MetaCol.setCol = [];
								TWT.MetaCol.setsProgress = [];
								TWT.MetaCol.groupSet = [];
								TWT.MetaCol.all = [];
								TWT.MetaCol.group = [];
								TWT.MetaCol.inProgress = [];
                                TWT.MetaCol.setType = ['body','guns','animal'];
                                var that = this;
                                $.ajax( {   url : 'game.php?window=achievement&action=get_list&h=' + Player.h,
											type : 'POST',
											data : {'folder' : 'collections',
                                                    'playerid' : Character.playerId},
											dataType : 'json',
											async : false,
											success : function(data_return) {
                                                var all = eval(data_return);
                                                if (all["achievements"]["progress"].length > 0 || TWT.Settings.isChecked('collection.gereNewItems')) {
													TWT.MetaCol.all = all;
													TWT.MetaCol.getMarketEC();
                                                    TWT.MetaCol.setRewards();
                                                    TWT.MetaCol.setGroupType();
                                                    //TWT.MetaCol.setGroupTypeTest();
													TWT.MetaCol.populateInProgress(eval(data_return));
                                                    TWT.MetaCol.getId();
													TWT.MetaCol.ready = true;
												} else {
													EventHandler.signal('collections_finished');
													TWT.MetaCol.finished = true;
													TWT.scriptStorage.setItem('TWT.Cache.Metacol.finished',true);
												}
											}
										});
								// init des items de sets manquants
                                var test = 'SETY\n';
								var sets = west.storage.ItemSetManager.getAll();
                                sets = TWT.MetaCol.sort(sets, "name");
								for ( var jj = 0; jj < sets.length; jj++) {
									var set = sets[jj];
                                    var items = set.getItems();
									var detSet = [];
									var isFriend = false;
                                    var body = false, guns = false, animal = false, mix = false;
									for ( var zz = 0; zz < items.length; zz++) {
										var item = ItemManager.getByBaseId(items[zz]);
										if (!isDefined(item)) {
											ErrorLog.log(TWT.LANG.errors.item.replace('%1',items[zz]).replace('%2',set.name));
										} else {
											if (item.short.indexOf("friendset_") == -1) {
												var weared = Wear.carries(item.item_base_id);
												var bagItem = Bag.getItemByItemId(item.item_id);
												if (!weared && !(isDefined(bagItem))) {
                                                    var slots = item.type;                                  //*
                                                    switch (slots) {
                                                        case 'head':
                                                        case 'neck':
                                                        case 'body':
                                                        case 'belt':
                                                        case 'pants':
                                                        case 'foot':
                                                            body = true;
                                                            break;
                                                        case 'left_arm':
                                                        case 'right_arm':
                                                            guns = true;
                                                            break;
                                                        case 'animal':
                                                        case 'yield':
                                                            animal = true;
                                                            break;
                                                        default:
                                                            break;
                                                    }                                                             //*/
													detSet.push(item.name);
                                                    TWT.MetaCol.setsProgress[item.name] = {
                                                        image : item.image,
                                                        id : item.item_id,
                                                        body : body,
                                                        guns : guns,
                                                        animal : animal
                                                    };
												}
											} else {
												isFriend = true;
												break;
											}
										}
									}
									if (detSet.length > 0 && !isFriend) {
										TWT.MetaCol.setCol.push( [ set.name, detSet ]);
										TWT.MetaCol.groupSet[set.name] = detSet;
                                        TWT.MetaCol.setCol[set.name] = {
                                            body : body,
                                            guns : guns,
                                            animal : animal
                                        };

									}
								}
                                //alert(test);
							}
						},
						isFinished : function(name) {
							if (TWT.MetaCol.finished)
								return true;
							var item = TWT.MetaCol.inProgress[$.trim(name)];
							if (!isDefined(item)) {
								return true;
							} else if (isDefined(TWT.MetaCol.group[item.group]) && TWT.MetaCol.group[item.group][0] == true) {
								return true;
							} else if (!isDefined(TWT.MetaCol.group[item.group])) {
								return true;
							} else
								return false;
						},
						shouldBuy : function(name) {
							var item = TWT.MetaCol.inProgress[$.trim(name)];
							var marketed = TWT.MetaCol.marketEC[$.trim(name)];
							if (isDefined(item) && !isDefined(marketed)) {
								return item.shouldBuy;
							} else {
								return false;
							}
						},
						getBuyItems : function(name, withbr) {
							try {
								if (TWT.Settings.isChecked('collection.showmiss')) {
									var br = (withbr) ? "<BR>" : " - ";
									var item = TWT.MetaCol.inProgress[$.trim(name)];
									if (isDefined(item)) {
										var manquants = TWT.MetaCol.group[item.group];
										if (isDefined(manquants) && manquants.length > 0) {
											var strManq = br;
											$.each(manquants,
													function(inD, val) {
														strManq += "[ " + val + " ]" + br;
													});
											return strManq += " ";
										} else {
											return "";
										}
									}
								}
							} catch (e) {
								this.erreur = TWT.LANG.errors.identify + name;
								ErrorLog.log(e, this.erreur);
							}
							return "";
						},
						remove : function(arr, name) {
							name = $.trim(name);
							var x, _i, _len, _results;
							_results = [];
							for (_i = 0, _len = arr.length; _i < _len; _i++) {
								x = arr[_i];
								if (x != name) {
									_results.push(x);
								}
							}
							return _results;
						}
					},
					WindowCollection : {
						scrollbar : null,
						totalGroup : 0,
						cbTrader : null,
						cbBid : null,
						cbCurBid : null,
                        cbType : [],
                        repeatMain : 0,
						getAllAnchors : function(what, group) {
							var that = this;
							if (!isDefined(what)) {
								what = TWT.MetaCol.groupSorted;
								group = TWT.MetaCol.group;
							}
							var textinput = new west.gui.Textfield().maxlength(12).setPlaceholder(TWT.LANG.collection.select).setWidth(165);
							var anchors = new west.gui.Selectbox();
							anchors.setWidth(200);
							$(anchors.elContent).css( {"max-height" : "320px",
                                                       "width" : "250px",
                                                       "overflow-y" : 'auto'});
                            anchors.addItem(TWT.LANG.collection.allOpt,TWT.LANG.collection.allOpt);
                            if (what == TWT.MetaCol.groupSorted) {
                                for (var i = 0; i < TWT.MetaCol.groupTypes.length; i++) {
                                    var idType = TWT.MetaCol.groupTypes[i];
                                    if (isDefined(TWT.MetaCol.groupType[idType])) {
                                        var nameType = TWT.MetaCol.groupType[idType].title;
                                        nameType = '&nbsp; ' + nameType.toUpperCase();
                                        anchors.addItem(idType,nameType);
                                        $.each(what, function(ind2, val) {
                                            if ((val[0] != "each") && (val[0] != "rar") && (val[0] != "shuffle") && (val[0] != "unique")  && (idType == TWT.MetaCol.group[val[0]].type)) {
                                                anchors.addItem(val[0],val[0]);
                                            }
                                        });
                                    }
                                }
                            } else {
                                $.each(what, function(ind2, val) {
                                    if ((val[0] != "each") && (val[0] != "rar") && (val[0] != "shuffle") && (val[0] != "unique")) {
                                        anchors.addItem(val[0],val[0]);
                                    }
                                });
                            }
							anchors.addItem("99999", " ");
							anchors.addListener(function(e) {
								var arrtmp = {};
								if (e == TWT.LANG.collection.allOpt) {
                                    textinput.setValue(e);
									arrtmp = what;
                                } else if (isDefined(TWT.MetaCol.groupType[e])){
                                    textinput.setValue(TWT.MetaCol.groupType[e].title);
									var ind = 0;
                                    $.each(what, function(ind8, valGr) {
                                        if ((valGr[0] != "each") && (valGr[0] != "rar") && (valGr[0] != "shuffle") && (valGr[0] != "unique") && (e == TWT.MetaCol.group[valGr[0]].type)) {
                                            arrtmp[ind] = [ valGr[0], group[valGr[0]] ];
                                            ind++;
                                        }
                                    });
                                } else {
                                    textinput.setValue(e);
									arrtmp[0] = [ e, group[e] ];
								}
								that.scrollbar.scrollToTop();
								var opt = that.getDiv(arrtmp,that.getFiltresType());
								$('#showbox').html(opt);
								that.switchOff();
                                that.switchOffType();
								return true;
							});
							textinput.click(function(e) {
								anchors.show(e);
							});
							return textinput.getMainDiv();
						},
						initTrader : function() {
							var check = -1;
							var model = west.window.shop.model.getCategory('trader');
                            var traderInv;
							if (isDefined(model)) {
								var timeTrader = model.getRefreshTimeout();
								check = timeTrader - Math.round(new Date() / 1000);
								traderInv = west.window.shop.model._data.inventory.trader;
								west.window.shop.model._data.trader_timeout = timeTrader;
							}
							if (check < 0) {
								$.ajax( {   url : 'game.php?window=shop_trader&mode=index',
											type : 'POST',
											dataType : 'json',
											async : false,
											success : function(data_return) {
												var all = eval(data_return);
												traderInv = all["inventory"]["trader"];
												west.window.shop.model._data.inventory.trader = all["inventory"]["trader"];
												west.window.shop.model._data.trader_timeout = all["traderTime"];
											}
										});
							}
							var traderItems = [];
							$.each(traderInv, function(i, item) {
								var obj = item.item_data;
								if (!isDefined(obj)) {
									obj = ItemManager.get(item.item_id);
								}
								traderItems[obj.name.trim()] = item;
							});
							return traderItems;
						},
                        getDiv : function(what,filters) {
                            var traderItems = this.initTrader();
                            var that = this;
                            var total = 0;
                            var divMain = $("<div />");
                            var clear = '<div style="' + TWT.css.clear + '"></div>';
                            var types;
                            var cols = (what == TWT.MetaCol.groupSorted);
                            if (cols) {
                                types = TWT.MetaCol.groupTypes;
                            } else {
                                types = TWT.MetaCol.setType;
                            }
                            for (var i = 0; i < types.length; i++) {
                                var totalType = 0;
                                var idType = types[i];
                                var typeGroupFrame = $('<div />').attr('class','fancytable off').attr('id','type_' + idType);
                                var frameHead = $('<div />').attr('class',"thead");
                                var frame = $('<div />').attr('class', 'tw2gui_groupframe_content_pane trows');
                                var frameContent = $('<div />').attr('id','frame_content');
                                if (cols) {
                                    frameHead.attr('style', TWT.css.frameHead).append(filters[i]);
                                    var reward = TWT.MetaCol.groupType[idType].rewards;
                                    if (reward != null) {
                                        reward = ItemManager.get(reward);
                                        frameHead.append($('<div />').attr('class','reward').append('[' + reward.name + ']').addMousePopup(new ItemPopup(reward).popup));
                                    }
                                    frameHead.append($(clear));
                                } else {
                                    frameHead.attr('style', TWT.css.thead).append(TWT.LANG.collection.setType[idType]);
                                }
                                $.each(what,
                                       function(ind2, valGroup) {
                                           if ((cols && (valGroup[0] != "each") && (valGroup[0] != "rar") && (valGroup[0] != "shuffle") && (valGroup[0] != "unique") && (idType == TWT.MetaCol.group[$.trim(valGroup[0])].type)) || 
                                               (!cols && (TWT.MetaCol.setCol[valGroup[0]][idType] == true))) {
                                               var imod = 0;
                                               var h3 = $('<h3 />').attr('style', TWT.css.h3).append($.trim(valGroup[0]));
                                               var title = $("<div />").attr('class',"off").append($('<hr>').attr('style',TWT.css.hr)).append(h3).append($('<hr>').attr('style',TWT.css.hr2));
                                               var group = $("<div />").attr('class','off').attr('style',TWT.css.group);
                                               $.each(valGroup[1],
                                                      function(ind3,val) {
                                                          var item = $('<div />').attr('class',"item item_inventory off").attr('style',TWT.css.item);
                                                          var img = $("<img />").attr('class',"tw_item item_inventory_img dnd_draggable").attr('style', TWT.css.img);
                                                          if (cols) {
                                                              img.attr('src',TWT.MetaCol.inProgress[val].src).addMousePopup(new ItemPopup(ItemManager.get(TWT.MetaCol.inProgress[val].id)).popup);
                                                          } else {
                                                              if (isDefined(TWT.MetaCol.setsProgress[val])) {
                                                                  img.attr('src',TWT.MetaCol.setsProgress[val].image).addMousePopup(new ItemPopup(ItemManager.get(TWT.MetaCol.setsProgress[val].id)).popup);
                                                              }
                                                          }
                                                          var itemMarket = TWT.MetaCol.marketEC[$.trim(val)];
                                                          var imsell = $('<div />').attr('style',TWT.css.market);
                                                          if (isDefined(itemMarket)) {
                                                              if ((itemMarket.auction_ends_in <= 0) || (!isNaN(parseInt(itemMarket.max_price)) && itemMarket.current_bid == parseInt(itemMarket.max_price))) {
                                                                  item.addClass('hasCurrentBid');
                                                                  group.addClass('hasCurrentBid');
                                                                  title.addClass('hasCurrentBid');
                                                                  typeGroupFrame.addClass('hasCurrentBid');
                                                                  imsell.append($('<div />').attr('title',TWT.LANG.collection.thFetch.replace('%1',itemMarket.market_town_name)).attr('style',TWT.css.thFetch));
                                                                  itemMarket.isFinished = true;
                                                              } else {
                                                                  item.addClass('hasBid');
                                                                  group.addClass('hasBid');
                                                                  title.addClass('hasBid');
                                                                  typeGroupFrame.addClass('hasBid');
                                                                  imsell.append($('<div />').attr('title',TWT.LANG.collection.thEncours).attr('style',TWT.css.thEncours));
                                                              }
                                                              imsell.click(function() {
                                                                  MarketWindow.open(Character.homeTown.town_id,'offer');
                                                                  MarketWindow.showTab('offer');
                                                              });
                                                          } else {
                                                              imsell.append($('<div />').attr('title',TWT.LANG.collection.searchMarket).attr('style',TWT.css.imsell))
                                                              .click(function() {
                                                                  TWT.Commons.searchMarket(val);
                                                              });
                                                          }
                                                          item.append(imsell);
                                                          if (isDefined(traderItems[val.trim()])) {
                                                              item.addClass('hasTrader');
                                                              group.addClass('hasTrader');
                                                              title.addClass('hasTrader');
                                                              typeGroupFrame.addClass('hasTrader');
                                                              var divTrader = $('<div />').attr('style',TWT.css.divTrader).attr('title',TWT.LANG.collection.atTrader);  //src="' + TWT.images.traderImg + '"
                                                              divTrader.click(function() {
                                                                  west.window.shop.open().showCategory("trader");
                                                              });
                                                              item.append(divTrader);
                                                          }
                                                          item.append(img).append($(clear));
                                                          item.appendTo(group);
                                                          imod++;
                                                      });
                                               group.append($(clear));
                                               total += imod;
                                               frameContent.append(title).append(group);
                                               totalType++;
                                           }
                                       });  
                                var frameBg = $('<div />').attr('style',TWT.css.frameBg);
                                frameBg.append($('<div />').attr('class', 'tw2gui_groupframe_background bg0').append($('<div />').attr('style',TWT.css.bg0_thead)))
                                       .append($('<div />').attr('class', '_bg tw2gui_bg_tl open').attr('style',TWT.css.closeTop))
                                       .append($('<div />').attr('class', '_bg tw2gui_bg_tr open').attr('style',TWT.css.closeTop))
                                       .append($('<div />').attr('class', '_bg tw2gui_bg_l open').attr('style',TWT.css.closeLeft))
                                       .append($('<div />').attr('class', '_bg tw2gui_bg_r open').attr('style',TWT.css.closeRight))
                                       .append($('<div />').attr('class', '_bg tw2gui_bg_bl open').attr('style',TWT.css.closeBottom))
                                       .append($('<div />').attr('class', '_bg tw2gui_bg_br open').attr('style',TWT.css.closeBottom));
                                if (cols) {
                                    frameBg.append($('<div />').attr('class', '_bg tw2gui_bg_tl close').attr('style','height: 50%; top 0;'))
                                           .append($('<div />').attr('class', '_bg tw2gui_bg_tr close').attr('style','height: 50%; top 0;'))
                                           .append($('<div />').attr('class', '_bg tw2gui_bg_bl close').attr('style','height: 50%; top 0;'))
                                           .append($('<div />').attr('class', '_bg tw2gui_bg_br close').attr('style','height: 50%; top 0;'));
                                }
                                frame.append(frameHead).append(frameContent);
                                typeGroupFrame.append(frameBg).append(frame);
                                if (totalType > 0) divMain.append(typeGroupFrame);
                            }
                            var s = (total > 1) ? 's' : '';
                            $('#thliste').text(TWT.LANG.collection.thText.replace('%2', s).replace('%3', s).replace('%1',total));
                            return divMain;
                            
						},
						switchOff : function() {
							var that = TWT.WindowCollection;
							if (that.cbTrader.isSelected() || that.cbBid.isSelected() || that.cbCurBid.isSelected()) {
								$('.off', $('#rightPane')).css('display', 'none');
								if (that.cbTrader.isSelected())
									$('.hasTrader', $('#rightPane')).css('display', '');
								if (that.cbBid.isSelected())
									$('.hasBid', $('#rightPane')).css('display', '');
								if (that.cbCurBid.isSelected())
									$('.hasCurrentBid', $('#rightPane')).css('display', '');
							} else {
								$('.off', $('#rightPane')).css('display', '');
							}
						},
                        switchOffType : function() {
							var that = TWT.WindowCollection;
                            for (var i = 0; i < TWT.MetaCol.groupTypes.length; i++) {
                                var id = TWT.MetaCol.groupTypes[i];
                                if (isDefined(TWT.MetaCol.groupType[id])) {
									$('#frame_content',$('#type_' + id)).css('display', 'none');
                                    $('.tw2gui_checkbox', $('#type_' + id)).attr('style',TWT.css.checkbox);
                                    $('.tw2gui_checkbox_checked', $('#type_' + id)).attr('style', TWT.css.checked);
                                    $('.reward', $('#rightPane')).attr('style',TWT.css.reward);
                                    if (that.cbType[i].isSelected()) {
                                        $('#frame_content',$('#type_' + id)).css('display', '');
                                        $('.open', $('#type_' + id)).css('display', '');
                                        $('.close', $('#type_' + id)).css('display', 'none');
                                    } else {
                                        $('#frame_content',$('#type_' + id)).css('display', 'none');
                                        $('.open', $('#type_' + id)).css('display', 'none');
                                        $('.close', $('#type_' + id)).css('display', '');
                                    }
                                }
                            }
						},
                        getFiltres : function() {
							this.cbTrader = new west.gui.Checkbox( TWT.LANG.collection.atTrader, '', this.switchOff).setTitle(TWT.LANG.collection.atTraderTitle);
							this.cbBid =    new west.gui.Checkbox( TWT.LANG.collection.atBid,    '', this.switchOff).setTitle(TWT.LANG.collection.atBidTitle);
							this.cbCurBid = new west.gui.Checkbox( TWT.LANG.collection.atCurBid, '', this.switchOff).setTitle(TWT.LANG.collection.atCurBidTitle);
							var cbox = $('<div class="jobs_basisbox"><h3>' + TWT.LANG.collection.filters + '</h3></div>');
							cbox.append(this.cbTrader.getMainDiv(), '<br />', '<div class="jobs_divider_checkbox" />');
							cbox.append(this.cbBid.getMainDiv(),    '<br />', '<div class="jobs_divider_checkbox" />');
							cbox.append(this.cbCurBid.getMainDiv(), '<br />');
							return cbox;
						},
                        getFiltresType : function() {
                            var boxes = [];
                            //for ( var id in TWT.MetaCol.groupType && typeof(TWT.MetaCol.groupType[id]) !== 'undefined') { // WITH
                            for (var i = 0; i < TWT.MetaCol.groupTypes.length; i++) {
                                var id = TWT.MetaCol.groupTypes[i];
                                if (isDefined(TWT.MetaCol.groupType[id])) {
									var title = TWT.MetaCol.groupType[id].title;
                                    TWT.WindowCollection.cbType[i] = new west.gui.Checkbox(title, '', this.switchOffType);
                                    boxes.push(TWT.WindowCollection.cbType[i].getMainDiv());
                                }
                            }
                            return boxes;
						},
						open : function() {
							if (!TWT.MetaCol.ready) {
								TWT.MetaCol.init();
								this.interval = setInterval(function() {
									if (TWT.MetaCol.ready)
										clearInterval(this.interval);
								}, 200);
							}
							this.Window = wman.open('WindowCollection  forum', TWT.LANG.collection.listText).setMiniTitle(TWT.LANG.collection.listText).setResizeable(true).setMinSize(750, 480).setMaxSize(750, 830).setSize(750, 480);
							this.Window.addTab(TWT.LANG.collection.colTabTitle, "TabCols", this.openCols);
							this.Window.addTab(TWT.LANG.collection.setTabTitle, "TabSets", this.openSets);
							if (window == 'sets') {
								this.openSets();
							} else {
								this.openCols();
							}
						},
						openSets : function() {
							TWT.WindowCollection.Window.activateTab('TabSets').$("div.tw2gui_window_content_pane").empty();
							TWT.WindowCollection.Window.setTitle(TWT.LANG.collection.listSetText);
							var leftPane = $('<div id="leftPane" />').css( {'position' : 'absolute', 'top' : '15px', 'height' : '100%', 'width' : '190px'});
                            var divide = $('<div class="jobs_divider" />').css( { 'position' : 'absolute', 'top' : '4px', 'height' : '100%', 'background-position' : 'top left', 'bottom' : '0px'});
							var rightPane = $('<div id="rightPane"/>').css( {'height' : '100%', 'left' : '199px', 'position' : 'absolute', 'top' : '5px', 'width' : '500px', 'bottom' : '0px'});
							$('<div id="WindowSetsBody" />').append(leftPane).append(divide).append(rightPane).appendTo('.WindowCollection .tw2gui_window_content_pane');
							TWT.WindowCollection.Window.showLoader();
							TWT.MetaCol.getMarketEC();
							var showbox = $('<div style="height: 100%; bottom : 0px;"></div>');
							this.scrollbar = new west.gui.Scrollpane();
							this.scrollbar.scrollToTop();
							$(this.scrollbar.getMainDiv()).css({'height' : '100%', 'top' : '0px', 'left' : '5px', 'bottom' : '0px'});
							this.scrollbar.appendContent($('<div id="showbox" align="center"></div>'));
							showbox.append(this.scrollbar.getMainDiv());
							var th = $('<div id="thliste" />').css( {'text-align' : 'left', 'font-weight' : 'bolder'});
							$('#leftPane').append(th).append(TWT.WindowCollection.getAllAnchors(TWT.MetaCol.setCol,TWT.MetaCol.groupSet));
							$('#rightPane').append(showbox);
							var divMain = TWT.WindowCollection.getDiv(TWT.MetaCol.setCol,'');
							$('#showbox').html(divMain);
							TWT.WindowCollection.Window.hideLoader();
						},
						openCols : function() {
							TWT.WindowCollection.Window.activateTab('TabCols').$("div.tw2gui_window_content_pane").empty();
							TWT.WindowCollection.Window.setTitle(TWT.LANG.collection.listText);
							var leftPane = $('<div id="leftPane" />').css( {'position' : 'absolute', 'top' : '15px', 'height' : '100%', 'width' : '190px'});
                            var divide = $('<div class="jobs_divider" />').css( { 'position' : 'absolute', 'top' : '4px', 'height' : '100%', 'background-position' : 'top left', 'bottom' : '0px'});
							var rightPane = $('<div id="rightPane"/>').css( {'height' : '100%', 'left' : '199px', 'position' : 'absolute', 'top' : '5px', 'width' : '500px', 'bottom' : '0px'});
							$('<div id="WindowCollectionBody" />').append(leftPane).append(divide).append(rightPane).appendTo('.WindowCollection .tw2gui_window_content_pane');
							TWT.WindowCollection.Window.showLoader();
							TWT.MetaCol.getMarketEC();
							var showbox = $('<div style="height: 100%; bottom : 0px;"></div>');
							this.scrollbar = new west.gui.Scrollpane();
							this.scrollbar.scrollToTop();
							$(this.scrollbar.getMainDiv()).css({'height' : '100%', 'top' : '0px', 'left' : '5px', 'bottom' : '0px'});
							this.scrollbar.appendContent($('<div id="showbox" class="content interface"></div>'));
							showbox.append(this.scrollbar.getMainDiv());
							var th = $('<div id="thliste" />').css({'text-align' : 'center', 'font-weight' : 'bolder'});
							$('#leftPane').append(th).append(TWT.WindowCollection.getAllAnchors()).append(TWT.WindowCollection.getFiltres());
                            $('#rightPane').append(showbox);
							var divMain = TWT.WindowCollection.getDiv(TWT.MetaCol.groupSorted,TWT.WindowCollection.getFiltresType());
                            $('#showbox').html(divMain);
                            this.switchOffType();
							TWT.WindowCollection.Window.hideLoader();
						}
					},
					Injecteur : {
						divsnif : [],
						methodes : [],
						winTabInjected : [],
						init : function(id, name, callback) {
							if (!isDefined(this.methodes[id])) {
								this.methodes[id] = {
									attached : false,
									id : id,
									name : name,
									callback : callback,
									original : eval(name)
								};
							}
						},
						addWinTabListen : function(who, callback, tab) {
							if (!isDefined(TWT.Injecteur.winTabInjected[who + '_' + tab])) {
								TWT.Injecteur.winTabInjected[who] = {
									who : who,
									tab : tab,
									callback : callback
								};
							}
						},
                        startListen : function() {
                            EventHandler.listen('WINDOW_OPENED',function(e) {
                                if (isDefined(TWT.Injecteur.winTabInjected[e])) {
                                    var inj = TWT.Injecteur.winTabInjected[e];
                                    TWT.Injecteur.detecteWin(
                                        inj.who,
                                        inj.callback,
                                        inj.tab);
                                }
                            });
                        },
                        detecteWin : function(who, callback, tab) {
                            var u = wman.getById(who);
                            if (isDefined(u)) {
                                u.addEventListener(TWE('WINDOW_CLOSE'),
                                                   function(e) {
                                                       u.removeEventListener(TWE('WINDOW_TAB_CLICK'),callback(u));
                                                       u.removeEventListener(TWE('WINDOW_CLOSE'),callback);
                                                   }, u, who);
                                if (isDefined(tab)) {
                                    u.addEventListener(TWE('WINDOW_TAB_CLICK'),function(e) {
                                        if (u.currentActiveTabId == tab) {
                                            callback(u);
                                        }
                                    }, u, who);
                                } else {
                                    callback(u);
                                }
                            }
                        },
						detecteWinOff : function(who) {
							TWT.Injecteur.winTabInjected[who] = null;
						},
						divsniffer : function(who, callback) {
							if (isDefined(TWT.Injecteur.divsnif[who])) {
								return false;
							} else {
                                $('#windows').on('DOMNodeInserted','.' + who,
                                                 function(e) {
                                                     try {
                                                         var opendiv = e.currentTarget;
                                                         if (opendiv.attributes['class'].nodeValue.indexOf(who) > -1) {
                                                             var divBuy = $('div[class="' + who + '"]') .contents();
                                                             callback($(opendiv));
                                                         }
                                                     } catch (e) {
                                                         ErrorLog.log(e);
                                                     }
                                                 });
                                TWT.Injecteur.divsnif[who] = 'true';
							}
						},
						divsnifferoff : function(who) {
							$('#windows').off('DOMNodeInserted', '.' + who);
							// console.log('div sniffer off');
							TWT.Injecteur.divsnif[who] = undefined;
						},
						inject : function(id) {
							try {
								if (isDefined(this.methodes[id]) && !this.methodes[id].attached) {
									this.methodes[id].attached = true;
									return this.methodes[id].callback();
								}
							} catch (e) {
								ErrorLog.log(e, TWT.LANG.errors.injId + id);
								this.restore(id);
							}
						},
						restore : function(id) {
							try {
								this.methodes[id].attached = false;
								eval("(function ($) {" + this.methodes[id].name + '=' + this.methodes[id].original + "})($);");
								return this.methodes[id].original;
							} catch (e) {
								ErrorLog.log(e, TWT.LANG.errors.retauration + id);
							}
						},
						injectedMethods : {
							injectItemTrader : function() {
								west.game.shop.item.view.prototype.injectTWTips = function(item) {
									if (TWT.MetaCol.dirty) {
										TWT.CollectionsHandler.refresh();
									}
									var obj = this.getModel();
									var name = $.trim(obj.getName());
									var divMain = "<p/>"; // itemTraderFunction.bind(this)();
									item.find(".TWTSuccess").remove();
									if (TWT.MetaCol.shouldBuy(name)) {
										var titre = TWT.MetaCol.getBuyItems(name, true);
										divMain = '<img class="TWTSuccess"' +
                                                  'style="' + TWT.css.styleN + '" ' +
                                                  'title="' + TWT.LANG.collection.patchsell.title + titre + '" ' +
                                                  'src="' + TWT.images.cup + '" />';
									}
									return divMain;
								};
								var modifiedFunc = west.game.shop.item.view.prototype.render.toString();
								modifiedFunc = modifiedFunc.toString().replace('return $item;',"$item.append(that.injectTWTips($item)); return $item;");
								eval("west.game.shop.item.view.prototype.render=" + modifiedFunc);
							},
							injectSell : function() {
								tw2widget["InventoryItem"].prototype.injectSell = function(that) {
									if (TWT.MetaCol.dirty) {
										TWT.CollectionsHandler.refresh();
									}
									var name = $.trim(that.obj.name);
									that.divMain.find('.TWTSuccessSell').remove();
									if (!TWT.MetaCol.isFinished(name)) {
										that.divMain.append('<img  class="TWTSuccessSell"' +
                                                            'style="' + TWT.css.styleT + '" ' +
                                                            'title="' + TWT.LANG.collection.patchsell.title + TWT.MetaCol.getBuyItems(name,true) + '" ' +
                                                            'src="'+ TWT.images.cup + '" />');
									}
									if (TWT.MetaCol.dirty) {
										TWT.CollectionsHandler.refresh();
									}
									return that.divMain;
								};
								var modifiedFunc = tw2widget["InventoryItem"].prototype.getMainDiv.toString();
								modifiedFunc = modifiedFunc.replace('return this.divMain;', "; this.injectSell(this); return this.divMain;");
								eval("tw2widget['InventoryItem'].prototype.getMainDiv = " + modifiedFunc);
							},
							injectMarket : function() {
								try {
									  MarketWindow.injectTWTTips = function (obj) {
									    if (TWT.MetaCol.dirty) {
									      TWT.CollectionsHandler.refresh();
									    }
									    var divMain = '';
									    if (TWT.MetaCol.shouldBuy($.trim(obj.name))) {
									      divMain = '<img class="TWTSuccess" ' +
                                              'style="' + TWT.css.style + '" ' +
                                              'title="' + TWT.LANG.collection.patchsell.title + ' ' + TWT.MetaCol.getBuyItems(obj.name, false) + '" ' +
                                              'src="' + TWT.images.cup + '" />';
									    }
									    return divMain;
									  };
									  var modifiedFunc = MarketWindow.getClearName.toString();
									  modifiedFunc = modifiedFunc.replace(/return/g, 'return this.injectTWTTips(obj)+');
									  eval('MarketWindow.getClearName=' + modifiedFunc);
								} catch (e) {
									ErrorLog.log(e, TWT.LANG.errors.injMarket);
									throw (e);
								}
							},
							injectFilterMarket : function() {
								MarketWindow.Buy.updateCategory = function(category, data) {
									// searchbox
									var marketUpdFunc = MarketWindow.Buy.updateCategory;
									return function(category, data) {
										try {
											marketUpdFunc.bind(this)(category,data);
											if (!TWT.MetaCol.finished) {
												if ($('#buyFilterIsCollect.tw2gui_checkbox_checked',MarketWindow.DOM).length > 0) {
													$('p.accordion_contentRow:not(:has(.TWTSuccess))',MarketWindow.DOM).css('display','none');
												}
											}
											// TWDB add
											if (TWT.isTWDBHere && TWT.Settings.isChecked("twdbadds.filterBuyMarket")) {
												if ($('#buyFilterIsCollect2.tw2gui_checkbox_checked',MarketWindow.DOM).length > 0) {
													$('p.accordion_contentRow:not(:has(.TWDBcollector)):not(:has(.TWDBbuyTip))',MarketWindow.DOM).css('display','none');
												}
											}
										} catch (e) {
											ErrorLog.log(e,TWT.LANG.errors.upCat);
											marketUpdFunc.bind(this)(category,data);
										}
									};
								}();
							},
							injectBagUpdate : function() {
								try {
									Bag.updateChanges = function(changes, from) {
										var bagFunction = Bag.updateChanges;
										return function(changes, from) {
											bagFunction.bind(this)(changes,from);
											EventHandler.signal('inventory_dun_changed');
										};
									}();
								} catch (e) {
									ErrorLog.log(TWT.LANG.errors.injUpBag,e);
									ErrorLog.show();
								}
							},
							injectTrader : function() {
								tw2widget["TraderItem"].prototype.injectTWTips = function() {
									if (TWT.MetaCol.dirty) {
										TWT.CollectionsHandler.refresh();
									}
									var name = $.trim(this.obj.name);
									this.divMain.find(".TWTSuccess").remove();
									if (TWT.MetaCol.shouldBuy(name)) {
										this.divMain.append('<img  class="TWTSuccess"' +
                                                            'style="' + TWT.css.styleT + '" ' +
                                                            'title="' + TWT.LANG.collection.patchsell.title + TWT.MetaCol.getBuyItems(name,true) + '" ' +
                                                            'src="' + TWT.images.cup + '" />');
                                    }
									return this.divMain;
								};
								var modifiedFunc = tw2widget["TraderItem"].prototype.getMainDiv.toString();
								modifiedFunc = modifiedFunc.replace('return this.divMain;',"this.divMain = this.injectTWTips(); return this.divMain;");
								eval("tw2widget['TraderItem'].prototype.getMainDiv ="+ modifiedFunc);
							},
							injectCraftFilterUpdate : function() {
								Crafting.updateResources = function() {
									var craftUpdFunc = Crafting.updateResources;
									return function() {
										var d = $(".TWTcraftitem");
										var tbl = {};
										$.each(d,
                                               function(int, im) {
                                                   var path = im.parentElement.parentElement.id;
                                                   var chem = "#" + path + " .item_crafting";
                                                   if (!isDefined(tbl[path])) {
                                                       tbl[path] = { 'csspath' : chem, 'insert' : im.id };
                                                   }
                                               });
										craftUpdFunc.bind(this)();
										$.each(tbl,
                                               function(oi, obj) {
                                                   $(obj.csspath).append( TWT.Commons.addMarketBuyLink(obj.insert));
//																	.append(TWT.Commons.addMiniMapIcon(obj.insert));
                                               });
									};
								}();
							},
							injectCraftFilterMarket : function() {
								Crafting.addRecipe = function(recipe) {
									var craftFunction = Crafting.addRecipe;
									return function(recipe) {
										craftFunction.bind(this)(recipe);
										var recipeObj = ItemManager.get(recipe.item_id);
										$.each(recipeObj.resources,
                                               function(ind, obj) {
                                                   if (TWT.Settings.isChecked("craft.filterMarket")) {
                                                       $("#resources_" + recipeObj.item_id + "_" + obj.item + " .item").append(TWT.Commons.addMarketBuyLink(obj.item));
                                                   }
//													if (TWT.Settings .isChecked("craft.filterMiniMap")) {
//														$("#resources_" + recipeObj.item_id + "_" + obj.item + " .item").append(TWT.Commons.addMiniMapIcon(obj.item));
//													}
                                               });
                                    };
								}();
							}
						}
					},
					CraftHandler : {
						initListener : function() {
//							EventHandler.listen('craft.filterMiniMap',
//											function() {
//												if (TWT.Settings.isChecked('craft.filterMiniMap')) {
//													TWT.CraftHandler.init();
//													TWT.Injecteur.inject('craft.filterMarket');
//													TWT.Injecteur.inject('craft.filterUpdate');
//												} else {
//													if (!TWT.Settings.isChecked('craft.filterMarket')) {
//														Crafting.addRecipe = TWT.Injecteur.restore('craft.filterMarket');
//														Crafting.updateResources = TWT.Injecteur.restore('craft.filterUpdate');
//													}
//												}
//											});
							EventHandler.listen('craft.filterMarket',
											function() {
												if (TWT.Settings.isChecked('craft.filterMarket')) {
													TWT.CraftHandler.init();
													TWT.Injecteur.inject('craft.filterMarket');
													TWT.Injecteur.inject('craft.filterUpdate');
												} else {
//													if (!TWT.Settings.isChecked('craft.filterMiniMap')) {
														Crafting.addRecipe = TWT.Injecteur.restore('craft.filterMarket');
														Crafting.updateResources = TWT.Injecteur.restore('craft.filterUpdate');
//													}
												}
											});
						},
						init : function() {
							TWT.Injecteur.init('craft.filterMarket',
                                               'Crafting.addRecipe',
                                               TWT.Injecteur.injectedMethods.injectCraftFilterMarket);
							TWT.Injecteur.init('craft.filterUpdate',
                                               'Crafting.updateResources',
                                               TWT.Injecteur.injectedMethods.injectCraftFilterUpdate);
						},
						inject : function() {
							try {
								if (TWT.Settings.isChecked('craft.filterMarket')
//										|| TWT.Settings.isChecked('craft.filterMiniMap')
												) {
									TWT.Injecteur.inject('craft.filterMarket');
									TWT.Injecteur.inject('craft.filterUpdate');
								}
								return true;
							} catch (e) {
								ErrorLog.log(TWT.LANG.errors.injThCraft,e);
								this.erreur = e;
							}
						}
					},
					Market : {
						inject : function() {
							try {
								if (TWT.Settings.isChecked('collection.filterMarket') || TWT.Settings.isChecked('twdbadds.filterBuyMarket')) {
									TWT.Injecteur.addWinTabListen('marketplace',TWT.Market.addCheckBoxMarket,'buy');
									TWT.Injecteur.inject('collection.filterMarket');
								}
								return true;
							} catch (e) {
								ErrorLog.log(TWT.LANG.errors.injTh,e);
								this.erreur = e;
							}
						},
						initListener : function() {
							EventHandler.listen('collection.filterMarket',
											function() {
												if (TWT.Settings.isChecked('collection.filterMarket') || TWT.Settings.isChecked('twdbadds.filterBuyMarket')) {
													TWT.Injecteur.addWinTabListen('marketplace',TWT.Market.addCheckBoxMarket,'buy'); // TWT.Injecteur.divsniffer('marketplace-buy',
													// TWT.Market.addCheckBoxMarket);
													TWT.Injecteur.inject('collection.filterMarket');
												} else {
													MarketWindow.Buy.updateCategory = TWT.Injecteur.restore('collection.filterMarket');
													// '
													// TWT.Injecteur.divsnifferoff('marketplace-buy');'
													// TWT.Injecteur.detecteWinOff('marketplace');
												}
											});
							EventHandler.listen('twdbadds.filterBuyMarket',
											function() {
												if (TWT.Settings.isChecked('collection.filterMarket') || TWT.Settings.isChecked('twdbadds.filterBuyMarket')) {
													TWT.Injecteur.addWinTabListen('marketplace',TWT.Market.addCheckBoxMarket,'buy');
													// TWT.Injecteur.divsniffer('marketplace-buy',
													// TWT.Market.addCheckBoxMarket);
													TWT.Injecteur.inject('collection.filterMarket');
												} else {
													MarketWindow.Buy.updateCategory = TWT.Injecteur.restore('collection.filterMarket');
													// TWT.Injecteur.divsnifferoff('marketplace-buy');
												}
											});
						},
						init : function() {
							TWT.Injecteur.init('collection.filterMarket','MarketWindow.Buy.updateCategory',TWT.Injecteur.injectedMethods.injectFilterMarket);
						},
						addCheckBoxMarket : function(div) {
							if ($('#buyFilterIsCollect').length == 0) {
								if ((!TWT.MetaCol.finished) && TWT.Settings.isChecked("collection.filterMarket")) {
									$('.searchbox').css('margin-top', '-5px');
									TWT.Market.insertedCB = new west.gui.Checkbox('<img src="' + TWT.images.cup + '" /> ' + TWT.LANG.collection.collectionFilterLabel,false,
											function() {
												if (this.isSelected()) {
													if (isDefined(TWT.Market.insertedCB2))
														TWT.Market.insertedCB2.setSelected(false);
													$('p.accordion_contentRow:not(:has(.TWTSuccess))',MarketWindow.DOM).css('display','none');
												} else {
													$('p.accordion_contentRow:not(:has(.TWTSuccess))',MarketWindow.DOM).css('display', '');
												}
											});
									TWT.Market.insertedCB.setSelected(false);
									TWT.Market.insertedCB.setId('buyFilterIsCollect');
									TWT.Market.insertedCB.setTooltip(TWT.LANG.collection.collectionFilterTip);
									$('.searchbox').append(TWT.Market.insertedCB.getMainDiv());
								}
							}
							if (TWT.isTWDBHere && TWT.Settings.isChecked("twdbadds.filterBuyMarket")) { // TWDB
								// add
								if ($('#buyFilterIsCollect2').length == 0) {
									$('.searchbox').css('margin-bottom', '5px');
									TWT.Market.insertedCB2 = new west.gui.Checkbox('<img src="data:image/png;base64,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"' +
                                                                                   ' style="width:18px;height:18px"/>' +
                                                                                   TWT.LANG.twdbadds.buyFilterLabel,
											false,
											function() {
												if (this.isSelected()) {
													if (isDefined(TWT.Market.insertedCB))
														TWT.Market.insertedCB.setSelected(false);
													$('p.accordion_contentRow:not(:has(.TWDBcollector)):not(:has(.TWDBbuyTip))',MarketWindow.DOM).css('display','none');
												} else {
													$('p.accordion_contentRow:not(:has(.TWDBcollector)):not(:has(.TWDBbuyTip))',MarketWindow.DOM).css('display', '');
												}
											});
									TWT.Market.insertedCB2.setSelected(false);
									TWT.Market.insertedCB2.setId('buyFilterIsCollect2');
									TWT.Market.insertedCB2.setTooltip(TWT.LANG.twdbadds.buyFilterTip);
									$('.searchbox').append(TWT.Market.insertedCB2.getMainDiv());
								}
							}
							$('.searchbox').css('margin-bottom', '10px');
						}
					},
					CollectionsHandler : {
						interval : 0,
						erreur : false,
						ready : false,
						saveFunction : {},
						attachFilter : function() {
							// this.detachFilter();
							TWT.CollectionsHandler.init();
						},
						callRefresh : function(e) {
							TWT.MetaCol.dirty = true;
							window.setTimeout(function() {
								TWT.CollectionsHandler.refresh();
							}, 500);
						},
						hasOneChecked : function() {
							var boolC = TWT.Settings.isChecked('collection.filterMarket') ||
									    TWT.Settings.isChecked('collection.patchtrader') ||
									    TWT.Settings.isChecked('collection.patchsell') ||
									    TWT.Settings.isChecked('collection.patchmarket') ||
									    TWT.Settings.isChecked('collection.showmiss') ||
									    TWT.Settings.isChecked('collection.listNeeded');
							return boolC;
						},
						initListener : function() {
							try {
								EventHandler.listen('collection.bagupdate',
												function() {
													if (TWT.CollectionsHandler.hasOneChecked()) {
														TWT.Injecteur.init('collection.patchtbagupdate',
																		   'Bag.updateChanges',
																		   TWT.Injecteur.injectedMethods.injectBagUpdate);
														TWT.Injecteur.inject('collection.patchtbagupdate');
													} else {
														Bag.updateChanges = TWT.Injecteur.restore('collection.patchtbagupdate');
														EventHandler.unlisten('inventory_dun_changed',
																		      TWT.CollectionsHandler.callRefresh);
													}
												});
								EventHandler.listen('collection.gereNewItems',
												function() {
													TWT.MetaCol.ready = false;
													TWT.MetaCol.init();
													this.interval = setInterval(
															function() {
																if (TWT.MetaCol.ready)
																	clearInterval(this.interval);
															}, 200);
												});
								EventHandler.listen('collection.patchtrader',
												function() {
													if (TWT.Settings.isChecked('collection.patchtrader')) {
														if (!TWT.MetaCol.ready)
															TWT.MetaCol.init();
														TWT.Injecteur.inject('collection.patchitemtrader');
														TWT.Injecteur.inject('collection.patchtrader');
													} else {
														TWT.Injecteur.restore('collection.patchitemtrader');
														TWT.Injecteur.restore('collection.patchtrader');
													}
												});
								EventHandler.listen('collection.patchsell',
												function() {
													if (TWT.Settings.isChecked('collection.patchsell')) {
														if (!TWT.MetaCol.ready)
															TWT.MetaCol.init();
														document.styleSheets[0].deleteRule(999);
														TWT.Injecteur.inject('collection.patchsell');
													} else {
														TWT.Injecteur.restore('collection.patchsell');
														$('.TWTSuccessSell').css('display','none');
														document.styleSheets[0].insertRule(".TWTSuccessSell { display:none; }",999);
													}
												});
								EventHandler.listen('collection.patchmarket',
												function() {
													if (TWT.Settings.isChecked('collection.patchmarket')) {
														if (!TWT.MetaCol.ready)
															TWT.MetaCol.init();
														TWT.Injecteur.inject('collection.patchmarket');
													} else {
														TWT.Injecteur.restore('collection.patchmarket');
													}
												});
							} catch (e) {
								ErrorLog.log('Erreur listener CollectionHandler', e);
								throw e;
							}
						},
						init : function() {
							EventHandler.listen('inventory_dun_changed',TWT.CollectionsHandler.callRefresh);
							// if (ItemManager.isLoaded()) {
							// TWT.CollectionsHandler.initInject();
							// }else{
							// EventHandler.listen('itemmanager_loaded',
							// function(){
							// TWT.CollectionsHandler.initInject();
							// TWT.CollectionsHandler.inject();
							// });
							// }
							// },
							// initInject : function(){
							TWT.Injecteur.init('collection.patchmarket',
                                               'MarketWindow.getClearName',
                                               TWT.Injecteur.injectedMethods.injectMarket);
							TWT.Injecteur.init('collection.patchsell',
											   'tw2widget["InventoryItem"].prototype.getMainDiv',
											   TWT.Injecteur.injectedMethods.injectSell);
							TWT.Injecteur.init('collection.patchtbagupdate',
											   'Bag.updateChanges',
											   TWT.Injecteur.injectedMethods.injectBagUpdate);
							TWT.Injecteur.inject('collection.patchtbagupdate');
							TWT.Injecteur.init('collection.patchitemtrader',
											   'west.game.shop.item.view.prototype.render',
											   TWT.Injecteur.injectedMethods.injectItemTrader);
							TWT.Injecteur.init('collection.patchtrader',
											   'tw2widget["TraderItem"].prototype.getMainDiv',
										   	   TWT.Injecteur.injectedMethods.injectTrader);
							// }
						},
						refresh : function() {
							var items = Bag.items_by_id;
							$.each(items,
                                   function(ind, val) {
                                       $.each(val,
                                              function(ind2,val2) {
                                                  if (val2) {
                                                      var name = $.trim(val2.name);
                                                      var item = TWT.MetaCol.inProgress[name];
                                                      if (isDefined(item)) {
                                                          item.shouldBuy = false;
                                                          var manquants = TWT.MetaCol.group[item.group];
                                                          if (isDefined(manquants)) {
                                                              TWT.MetaCol.group[item.group] = TWT.MetaCol.remove(manquants,name);
                                                              if (TWT.MetaCol.group[item.group].length == 0) {
                                                                  TWT.MetaCol.group[item.group][0] = true;
                                                              }
                                                          }
                                                      }
                                                  }
                                              });
                                   });
							TWT.MetaCol.dirty = false;
						},
						inject : function() {
							try {
								TWT.MetaCol.init();
								if (!TWT.MetaCol.finished) {
									if (TWT.MetaCol.ready) {
										if (TWT.Settings.isChecked('collection.patchtrader')) {
											TWT.Injecteur.inject('collection.patchtrader');
											TWT.Injecteur.inject('collection.patchitemtrader');
										}
										if (TWT.Settings.isChecked('collection.patchsell')) {
											TWT.Injecteur.inject('collection.patchsell');
										}
										if (TWT.Settings.isChecked('collection.patchmarket')) {
											TWT.Injecteur.inject('collection.patchmarket');
										}
									}
								}
								return true;
							} catch (e) {
								ErrorLog.log(TWT.LANG.errors.injThCol,e);
								this.erreur = e;
								console.log(TWT.LANG.errors.injCol);
								console.log(e);
							}
						}
					},
					Inventaire : {
						create : function() {
							TWT.Inventaire.attach();
						},
						attach : function() {
							EventHandler.listen("inventory_ready",TWT.Inventaire.addCheckBoxBag, "dblbag");
						},
						detach : function() {
							EventHandler.unlisten("inventory_ready",TWT.Inventaire.addCheckBoxBag, "dblbag");
							$('#bagFilterIsCollect', Inventory.DOM).remove();
						},
						searchDoublons : function(filtre) {
							var searchTxt = "";
							var searchVal = $('#inventory_search',Inventory.DOM).val();
							if (searchVal.lenght == 0 || Inventory.category != 'set') {
								searchVal = ".*";
							} else {
								searchTxt = (searchVal.lenght == 0) ? "" : " (" + searchVal + ")";
							}
							var res = Bag.search(searchVal);
							$('#inventory_search', Inventory.DOM).val("");
							var doubles = [];
							var sell = 0;
							$.each(res,
                                   function(ind1, item) {
                                       if (item.obj.type != 'yield' &&
                                           ($.inArray(item.getType(),Inventory.getCategoryTypes(Inventory.category)) > -1 ||
                                            Inventory.category == 'set' ||
                                            Inventory.category == 'new')) {
                                           var count = item.getCount();
                                           // Si porté -> doublon donc on ajoute 1 item
                                           var weared = Wear.carries(item.obj.item_base_id);
                                           if (weared) {
                                               count += 1;
                                           }
                                           if (count > 1) {
                                               switch (filtre) {
                                                   case 'upgradeable':
                                                       if (count<3 || !item.obj.upgradeable ) {
                                                           item = null;
                                                       }
                                                       break;
                                                   case 'nosets':
                                                       if (item.obj.set != null) {
                                                           item = null;
                                                       }
                                                       break;
                                                   case 'sellable':
                                                       if (!item.obj.sellable) {
                                                           item = null;
                                                       }
                                                       break;
                                                   case 'auctionable':
                                                       if (!item.obj.auctionable) {
                                                           item = null;
                                                       }
                                                       break;
                                                   default:
                                                       break;
                                               }
                                               if (isDefined(item)) {
                                                   doubles.push(item);
                                                   sell += (item.getSellPrice()) * (count - 1);
                                               }
                                           }
                                       } else {}
                                   });
							var lastCat = Inventory.category;
							Inventory.showSearchResult(doubles || []);
							if (TWT.Settings.isChecked('inventory.sum')) {
								$('#sumsearch', Inventory.DOM).remove();
								$('#bagFilterIsCollect', Inventory.DOM).after("<div title='" + sell + TWT.LANG.Doublons.sellGain + searchTxt + "' " +
                                                                              "id='sumsearch' style='text-align: center; position: inherit; z-index: 4;" + "font-weight: bold; color: black; font-size: 11px; width:" + "100%;top:362px; '>" +
                                                                              sell + TWT.LANG.Doublons.sellGain +
                                                                              "</div>");
							}
						},
						searchSpeciales : function(what) {
							$('#inventory_search', Inventory.DOM).val(what);
							var res = Bag.search(what);
							Inventory.showSearchResult(res || []);
							return res;
						},
						getDetSearchBox : function() {
                            var selSets;
							if (isDefined(west.storage.ItemSetManager)) {
								selSets = new west.gui.Selectbox();
								selSets.setWidth(200);
								$(selSets.elContent).css( {
									"max-height" : "270px",
									"width" : "250px",
									"overflow-y" : 'auto'
								});
								TWT.selAdded = [];
								selSets.addItem('all',TWT.LANG.collection.allOpt);
								selSets.addItem('current',TWT.LANG.Doublons.current);
								selSets.addItem('upgradeable',TWT.LANG.Doublons.upgradeable);
								selSets.addItem('nosets',TWT.LANG.Doublons.noset);
								selSets.addItem('sellable',TWT.LANG.Doublons.sellable);
								selSets.addItem('auctionable',TWT.LANG.Doublons.auctionable);
								selSets.addListener(function(e) {
									switch (e) {
                                        case 'all':
                                            $('#inventory_search', Inventory.DOM).val("");
                                            break;
                                        default:
                                            break;
									}
									TWT.Inventaire.searchDoublons(e);
									return true;
								});
								return selSets;
							}
							return selSets;
						},
						getSetNamesBox : function(setsCache) {
                            var selSets;
							if (isDefined(west.storage.ItemSetManager)) {
								selSets = new west.gui.Selectbox();
								selSets.setWidth(200);
								$(selSets.elContent).css( {
									"max-height" : "270px",
									"width" : "250px",
									"overflow-y" : 'auto'
								});
								TWT.selAdded = [];
								selSets.addItem('setitems',TWT.LANG.collection.allOpt);
								$.each(setsCache,
                                       function(ind2, item) {
                                           var itemsSet = west.storage.ItemSetManager.get(item.obj.set);
                                           if (!isDefined(TWT.selAdded[itemsSet.name])) {
                                               TWT.selAdded[itemsSet.name] = true;
                                               selSets.addItem(itemsSet.name,itemsSet.name);
                                           }
                                       });
								selSets.addListener(function(e) {
									TWT.Inventaire.searchSpeciales(e);
									return true;
								});
								return selSets;
							}
							return selSets;
						},
						addCheckBoxBag : function(div) {
							if ($('#bagFilterIsCollect', Inventory.DOM).length == 0) {
								var setsCache = Bag.search('setitems');
								setsCache.sort(function(a, b) {
									var x = west.storage.ItemSetManager.get(a.obj.set).name;
									var y = west.storage.ItemSetManager.get(b.obj.set).name;
									if (typeof x === 'string' && typeof x === 'string') {
										return x.localeCompare(y);
									}
									return ((x < y) ? -1 : ((x > y) ? 1 : 0));
								});
								var selBox = TWT.Inventaire.getSetNamesBox(setsCache);
								var spanD = $('<div id="bagFilterIsCollect"  ' + 'style="display: flex; position: inherit;"/>');
								if (TWT.Settings.isChecked('inventory.doublons')) {
									var insertedCB = $("<span title='" + TWT.LANG.Doublons.tip + "' " +
                                                       "id='inventory_doublons'" + '" ' +
                                                       'style="cursor: pointer; position: relative; margin-right: 4px;" />')
											.append("<img  class='tw2gui-iconset tw2gui-icon-dollar' " + " src='./images/tw2gui/pixel-vfl3z5WfW.gif' alt='' title=''>");
									insertedCB.click(function(e) {
										$('#sumsearch').remove();
										TWT.Inventaire.getDetSearchBox().show(e);
									});
									// insertedCB.click(TWT.Inventaire.searchDoublons);
									spanD.append(insertedCB);
								}
								if (TWT.Settings.isChecked('inventory.useables')) {
									var insertedCB2 = $('<span title="' +
                                                        TWT.LANG.Doublons.tipuse +
                                                        '" id="inventory_useables"' +
                                                        '" style="cursor: pointer; position: relative; margin-right: 4px;">' +
                                                        "<img class='tw2gui-iconset tw2gui-icon-consumable' " +
                                                        " src='./images/tw2gui/pixel-vfl3z5WfW.gif' alt='' title=''></span>");
									insertedCB2.click(function() {
										$('#sumsearch').remove();
										TWT.Inventaire.searchSpeciales('useable');
									});
									spanD.append(insertedCB2);
								}
								if (TWT.Settings.isChecked('inventory.recipe')) {
									var insertedCB3 = $('<span title="' + TWT.LANG.Doublons.tiprecipe +
                                                        '" id="inventory_recipe"' +
                                                        '" style="position: relative;background-color: transparent; background-attachment: scroll; background-clip: border-box; cursor: pointer; bottom: inherit; " >' +
                                                        '<img  src="./images/items/recipe/recipe_smith.png" width="20px" height="20px" /></span>');
									insertedCB3.click(function() {
										$('#sumsearch').remove();
										TWT.Inventaire.searchSpeciales('recipe');
									});
									spanD.append(insertedCB3);
								}
								if (TWT.Settings.isChecked('inventory.sets')) {
									var insertedCB4 = $('<span title="' + TWT.LANG.Doublons.tipsets +
                                                        '" id="inventory_sets"' +
                                                        '" style="cursor: pointer; position: relative; margin-right: 4px;" >' +
                                                        "<img  style='cursor: pointer;' class='tw2gui-iconset tw2gui-icon-shirt' " +
                                                        " src='./images/tw2gui/pixel-vfl3z5WfW.gif' alt='' title=''></span>");
									insertedCB4.click(function(e) {
										$('#sumsearch').remove();
										selBox.show(e);
									});
									spanD.append(insertedCB4);
								}
								$('.filters', Inventory.DOM).before(spanD);
							}
						}
					},
					Logout : {
						initListener : function() {
							EventHandler.listen('miscellaneous.logout',
											function() {
												$('#TWTOOL_Logout').remove();
												if (TWT.Settings.isChecked('miscellaneous.logout')) {
													TWT.Logout.create();
												}
											});
						},
						create : function() {
							var a = $('<div></div>').attr( {'class' : 'menulink','title' : TWT.LANG.Logout.title})
                                                    .css( {'background-image' : 'url('+ TWT.images.logout + ')'})
                                                    .mouseenter(
                                                        function() { $(this).css("background-position","-25px 0px"); })
                                                    .mouseleave(
                                                        function() { $(this).css("background-position", "0px 0px"); })
                                                    .click(function() { TWT.Logout.logout(); });
                            var b = $('<div></div>').attr( {'class' : 'menucontainer_bottom'});
                            $('<div></div>').attr( {'class' : 'ui_menucontainer','id' : 'TWTOOL_Logout'}).append(a).append(b).appendTo('#ui_menubar');
                        },
						logout : function() {
							// Player.logout();
							$(window.location).attr('href','game.php?window=logout&action=logout&h=' + Player.h);
						}
					},
					BankFees : {
						attach : function() {
							TWT.Injecteur.divsniffer('wood-footer',TWT.BankFees.init);
							// TWT.Injecteur.addWinTabListen(/^bank-\d+/,TWT.BankFees.init,'balance');
						},
						detach : function() {
							TWT.Injecteur.divsnifferoff('wood-footer');
							// TWT.Injecteur.detecteWinOff(/^bank-\d+/);
						},
						initListener : function() {
							EventHandler.listen('miscellaneous.showFees',
                                                function() {
                                                    if (TWT.Settings.isChecked('miscellaneous.showFees')) {
                                                        TWT.BankFees.attach();
                                                    } else {
                                                        TWT.BankFees.detach();
                                                    }
                                                });
						},
						calcFrais : function(montant, taux) {
							tauxPourc = Number(taux.replace(/% ?/g, ""));
							var fraisArrondi = Math.ceil((montant * tauxPourc) / 100);
							var txtFrais = TWT.LANG.fees.tipText.replace('%1',tauxPourc).replace('%2', fraisArrondi);//
							return txtFrais;
						},
						init : function(e) {
							var depotLink = $('.wood-footer:first .deposit');
							if (depotLink && (!depotLink.attr('id'))) {
								var frais = $('div.town_data_value div.bank-fee').text();
								var numFrais = 1 + 0.01 * Number(frais.replace(/% ?/g, ""));
								depotLink.attr('id', 'depo_changed');
								var balance = $('.wood-footer:first #tb_balance_input_' + BankWindow.townid);
								var that = this;
								balance.mouseover(function() {
									var fraisArrondi = Math.ceil((balance.val() - balance.val() / numFrais));
									var txtFrais = TWT.BankFees.calcFrais(balance.val(), frais);
									balance.attr('title', txtFrais);
								});
								var amount = $('#amount');
								if (amount) {
									amount.mouseover(function() {
										var txtFrais = TWT.BankFees.calcFrais(amount.val(),BankWindow.Transfer.fee.toString());
										amount.attr('title', txtFrais);
									});
								}
							}
						}
					},
					AllReportsDelete : {
						addStyle : function() {
							var css = ".window_AllReportsDelete .window_inside { width:540px; position:absolute; left:5px; top:2px; }" +
                                ".window_AllReportsDelete .cell_what { width:170px; } " +
                                ".window_AllReportsDelete .tbody .cell_what { padding-left:6px; } .window_AllReportsDelete .tbody .row { left:0px; }" +
                                ".window_AllReportsDelete .cell_progress { text-align:center; width:330px; } " +
                                "div#ui_menubar { z-index: 100000;}";
							$('<style id="TWTOOL_CSS" type="text/css" >' + css + '</style>').appendTo('head');
						},
						saveFunction : MessagesWindow.Report._initContent,
						attachedFunction : '',
						attach : function() {
							MessagesWindow.Report._initContent = function(data) {
								var msgFunc = MessagesWindow.Report._initContent;
								return function(data) {
									msgFunc.bind(this)(data);
									$('.actionprompt',MessagesWindow.Report.DOM) .append("<a href='javascript:TWT.AllReportsDelete.init();'>" + TWT.LANG.AllReportsDelete.button + "</a>");
								};
							}();
							TWT.AllReportsDelete.attachedFunction = MessagesWindow.Report._initContent.toString();
							EventHandler.listen('report.dom.created',TWT.AllReportsDelete.addButton);
						},
						detach : function() {
							MessagesWindow.Report._initContent = TWT.AllReportsDelete.saveFunction;
							EventHandler.unlisten('report.dom.created',TWT.AllReportsDelete.addButton);
						},
						initListener : function() {
							EventHandler.listen('miscellaneous.deleteAllReports',
											function() {
												if (TWT.Settings.isChecked('miscellaneous.deleteAllReports')) {
													TWT.AllReportsDelete.attach();
												} else {
													TWT.AllReportsDelete.detach();
												}
											});
						},
						init : function() {
							new west.gui.Dialog(TWT.LANG.AllReportsDelete.userConfirm, TWT.LANG.AllReportsDelete.confirmText, "ok")
									.setModal(true, false, {
										bg : "../images/curtain_bg.png",
										opacity : 0.4
									})
									.addButton(TWT.LANG.AllReportsDelete.deleteYes,
											function() {
												TWT.AllReportsDelete.status_close = true;
												$('div.tw2gui_dialog_text').html('<p>Suppression en cours.....<br /></p><span id="sppage" />');
												$('div.tw2gui_dialog_actions').css( {'display' : 'none'});
												TWT.AllReportsDelete.delete_all();
											})
									.addButton(TWT.LANG.AllReportsDelete.deleteNo,
											function() {
												TWT.AllReportsDelete.status_close = false;
											}).show();
						},
						reports_id : [],
						progress_page : 1,
						delete_all : function() {
							var that = this;
							for ( var i = 0; i < MessagesWindow.Report.pageCount; i++) {
								$('#sppage').html('<p>Page ' + that.progress_page + '/' + MessagesWindow.Report.pageCount + '</p>');
								$.ajax( {
											url : 'game.php?window=reports&action=get_reports&h=' + Player.h,
											type : 'POST',
											data : {
												'folder' : MessagesWindow.Report.currentFolder,
												'page' : that.progress_page
											},
											dataType : 'json',
											async : false,
											success : function(data_return) {
												for ( var j = 0; j < data_return['reports'].length; j++) {
													that.reports_id.push(data_return['reports'][j]['report_id']);
												}
												that.progress_page += 1;
											}
										});
							}
							that = this;
							$.ajax( {
										url : 'game.php?window=reports&action=delete_reports&h=' + Player.h,
										type : 'POST',
										data : {
											'deleted' : 'false',
											'reports' : TWT.AllReportsDelete.reports_id.join(", ")
										},
										dataType : 'json',
										async : false,
										success : function(data_return) {
											if (data_return['error'])
												that.status_close = false;
										}
									});
							MessagesWindow.showTab('report');
						}
					},
					getDunMp : function() {
						if (Game.worldName == 'Monde 1' ||
								   Game.worldName == 'Monde 3' ||
								   Game.worldName == 'Alamogordo' ||
								   Game.worldName == 'Death Valley') {
							return "<div style='text-align:right;padding-right: 5px; padding-top: 15px;'><a href=\"javascript:MessagesWindow.open(\'telegram\', {insert_to: \'Dun\'})\">by Dun</a></div>";
						} else {
							if (Game.worldName == 'World 1') {
								return "<div style='text-align:right;padding-right: 5px; padding-top: 15px;'><a href=\"javascript:MessagesWindow.open(\'telegram\', {insert_to: \'Duncol\'})\">by Dun</a></div>";
							}
							return "";
						}
					},
					api : function() {
						var TWApi = TheWestApi.register('TW_Collections',
                                                        TWT.LANG.title,
                                                        TWT.info.min_gameversion,
                                                        TWT.info.max_gameversion,
                                                        'Dun & Azbesrka mod - v' + TWT.info.version,
                                                        'https://greasyfork.org/scripts/15957');
						var set_button = new west.gui.Button(TWT.LANG.Options.tab.setting, function() {
									TWT.Options.open('setting');
								}, this, this, TWT.LANG.Options.tab.settingDesc);
						var more_button = new west.gui.Button(TWT.LANG.Options.tab.translation,
								function() {
									TWT.Options.open('translate');
								}, this, this, TWT.LANG.Options.tab.translationDesc);
						TWApi.setGui($("<div id='twtApiContent' style=' font-family: comic sans ms;font-size: 12pt;padding-top: 10px;text-align: right;'>" + TWT.LANG.description + "</div>")
                                     .append(set_button.getMainDiv())
                                     .append(more_button.getMainDiv())
                                     .after(TWT.getDunMp()));
					}
				};
				ScriptUpdater = {
					id : null, // : TWT.info.idscript,
					version : null, // : TWT.info.version,
					scriptId : null,
					scriptCurrentVersion : null,
					scriptUpdUrl : "http://pastebin.com/raw.php?i=W4fYvHcM",
					scriptCallbackFunction : null,
					scriptStorage : null,
					initialize : function(scriptId, scriptCurrentVersion, scriptCallbackFunction, scriptUseNotice, scriptForceNotice) {
						ScriptUpdater.scriptId = scriptId;
						ScriptUpdater.scriptCurrentVersion = scriptCurrentVersion;
						if (ScriptUpdater.scriptStorage == null) {
							ScriptUpdater.scriptStorage = new Storage("local","ScriptUpdater." + scriptId);
						}
					},
					setValue : function(key, value) {
						if (ScriptUpdater.scriptStorage == null) {
							ScriptUpdater.scriptStorage = new Storage("local","ScriptUpdater." + scriptId);
						}
						ScriptUpdater.scriptStorage.setItem(key, value);
					},
					getValue : function(key, defaultValue) {
						if (ScriptUpdater.scriptStorage != null) {
							return ScriptUpdater.scriptStorage.getItem(key,defaultValue);
						} else {
							return defaultValue;
						}
					},
					checkLanguages : function() {
						// Update languages
						try {
							var strLang = "";
							$.each(TWT.languages,
											function(ind, language) {
												if (isDefined(language.script)) {
													if (TWT.isGreasyLang(language)) {
														if (language.version < ScriptUpdater.scrnv[language.script]) {
															strLang += "<br><a href='https://greasyfork.org/scripts/" + language.script + '/code.user.js\'>' + language.name + "</a>";
														}
													}
												}
											});
							if (strLang.length > 0) {
								ScriptUpdater.scrnv.isAJ = false;
								var parent = new west.gui.Dialog(TWT.LANG.Options.update.title, "<div><br>" + TWT.LANG.Options.update.updlangmaj + "<br><center>" + strLang + "</center></div>")
                                                         .setIcon( west.gui.Dialog.SYS_INFORMATION)
										                 .setModal(true, false, {
                                                             bg : "http://www.the-west.fr/images/curtain_bg.png",
                                                             opacity : 0.7
                                                         })
										                 .addButton( 'TW Collection page',
                                                                    function() {
                                                                        parent.hide();
                                                                        window.open("https://greasyfork.org/scripts/" + ScriptUpdater.scriptId,'_blanck');
                                                                    }).addButton('Close');
                                parent.show();
							} else {
								// ScriptUpdater.scrnv.isAJ=true;
							}
						} catch (e) {
							new UserMessage(TWT.LANG.Options.update.upderror,UserMessage.TYPE_ERROR).show();
							ErrorLog.log(TWT.LANG.errors.up, e);
						}
					},
					checkRemoteScript : function() {
						// Update
						try {
							if (TWT.DEBUG) {
								ScriptUpdater.scrnv = {
									7258 : '1.3.9', // twt
									7260 : '1.3.5', // cz
									3405 : '1.0.8', // es
									1672 : '1.0.8', // de
									1675 : '1.0.8', // it
									7261 : '1.3.5', // hu
									7259 : '1.3.5', // sk
									1674 : '1.0.8', // pl
									7312 : '1.0.2', // br
									7271 : '1.3.5', // ru
									news : '<h4 style="margin-bottom:20px;">News : </h4>' + TWT.LANG.errors.debug + "<BR><BR>"
								};
							}
							var gocheck = function() {
								ScriptUpdater.scrnv.isAJ = false;
								if (ScriptUpdater.scriptCurrentVersion < ScriptUpdater.scrnv[ScriptUpdater.scriptId]) {
									// ScriptUpdater.scrnv.isAJ=false;
									var strNew = ScriptUpdater.scrnv['news'] || '';
									var parent = new west.gui.Dialog(TWT.LANG.Options.update.title,
                                                                     "<div style='" + ((strNew.length > 0) ? "width:650px;height:250px;" : "") + "font-size:16px;text-align:justify;'><BR>" +
                                                                     TWT.LANG.Options.update.updscript +
                                                                     //ScriptUpdater.scrnv[ScriptUpdater.scriptId] +
                                                                     "<div id='boxnews' style='margin-top:20px;font-size:14px;font-style: italic;'>" + strNew + "</div></div>")
											.setIcon(west.gui.Dialog.SYS_QUESTION)
											.setModal(true, false, {
														bg : "http://www.the-west.fr/images/curtain_bg.png",
														opacity : 0.7
													})
											.addButton('yes',
													function() {
														parent.hide();
														window.open("https://greasyfork.org/scripts/15957/code/TW-Collections.user.js",'_self');
													})
											.addButton('no', function() {
												parent.hide();
											})
											.addButton('Script page',
													function() {
														parent.hide();
														window.open("https://greasyfork.org/scripts/" + ScriptUpdater.scriptId,'_blanck');
													});
									parent.show();
								} else {
									ScriptUpdater.scrnv.isAJ = true;
								}
								ScriptUpdater.checkLanguages();
								var date = new Date();
								ScriptUpdater.setValue("lastCheck",parseInt(date.getTime()));
								if (ScriptUpdater.scrnv.isAJ) {
									EventHandler.signal("scriptmaj.ok");
								}
							};
							if (TWT.DEBUG) {
								gocheck();
							} else {
								ScriptUpdater.scrnv = [];
								$.getScript(ScriptUpdater.scriptUpdUrl,gocheck);
							}
						} catch (e) {
							new UserMessage(TWT.LANG.Options.update.upderror,UserMessage.TYPE_ERROR).show();
							ErrorLog.log('Update error', e);
						}
					},
					getLastCheck : function() {
						return ScriptUpdater.getValue("lastCheck", 0);
					},
					getInterval : function() {
						var interval = ScriptUpdater.getValue("interval", 0);
						return (typeof (interval) == "undefined" || !interval.toString().match(/^\d+$/)) ? 0
								: parseInt(interval.toString());
					},
					setInterval : function(interval) {
						ScriptUpdater.setValue("interval", parseInt(interval));
					},
					check : function(scriptId, scriptVersion,scriptCallbackFunction) {
						ScriptUpdater.initialize(scriptId, scriptVersion, scriptCallbackFunction, true, false);
						var date = new Date();
						if (ScriptUpdater.getInterval() > 1) {
							if ((date.getTime() - ScriptUpdater.getLastCheck()) > ScriptUpdater.getInterval()) {
								ScriptUpdater.checkRemoteScript();
							}
						}
					},
					forceCheck : function(scriptId, scriptVersion,
							scriptCallbackFunction) {
						ScriptUpdater.initialize(scriptId, scriptVersion,scriptCallbackFunction, true, false);
						ScriptUpdater.checkRemoteScript();
					}
				};
				/***************************************************************
				 * DOM Storage Wrapper Class
				 *
				 * Public members: ctor({"session"|"local"}[, <namespace>])
				 * setItem(<key>, <value>) getItem(<key>, <default value>)
				 * removeItem(<key>) keys()
				 **************************************************************/
				function Storage(type, namespace) {
					var object = this;
					if (typeof (type) != "string")
						type = "session";
					switch (type) {
					case "local": {
						object.storage = localStorage;
					}
						break;
					case "session": {
						object.storage = sessionStorage;
					}
						break;
					default: {
						object.storage = sessionStorage;
					}
						break;
					}
					if (!namespace || (typeof (namespace) != "string" && typeof (namespace) != "number"))
						namespace = "ScriptStorage";
					object.namespace = [ namespace, "." ].join("");
					object.setItem = function(key, value) {
						try {
							object.storage.setItem(escape( [ object.namespace,key ].join("")), JSON.stringify(value));
						} catch (e) {}
					};
					object.getItem = function(key, defaultValue) {
						try {
							var value = object.storage.getItem(escape( [object.namespace, key].join("")));
							if (value)
								return eval(value);
							else
								return defaultValue;
						} catch (e) {
							return defaultValue;
						}
					};
					object.removeItem = function(key) {
						try {
							object.storage.removeItem(escape(
                                collection.craftfilterMarket[ object.namespace,key ].join("")));
						} catch (e) {}
					};
					object.keys = function() {
						var array = [];
						var indDun = 0;
						do {
							try {
								var key = unescape(object.storage.key(indDun++));
								if (key.indexOf(object.namespace) == 0 && object.storage.getItem(key))
									array.push(key.slice(object.namespace.length));
							} catch (e) {
								break;
							}
						} while (true);
						return array;
					};
				};
				TWT.init();
			}
		});