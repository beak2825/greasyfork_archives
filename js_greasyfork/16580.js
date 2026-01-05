// ==UserScript==
// @name          TagPro Texture Pack Manager
// @description   Drag and drop textures (tiles, boosts, splats, etc) & background wallpapers
//                 - Double-click the main TagPro logo to open the menu!
//                 - Drag and drop your custom textures (or URL's) from anywhere (web or local).
//                 - Mix & match from pre-made texture packs (including balls!).
//                 - Optional: Ball Spin, Ball Transparency, Ball Overlays & Centre Flair.
//                 - Optional: Different In-Game Wallpaper
//                 - Optional: Different Ball Textures
//                 - Optional: Fading Splats
// @include       http://tagpro-*.koalabeast.com*
// @include       http://tangent.jukejuice.com*
// @include       http://*.newcompte.fr*
// @author        Dr.Holmes & ballparts & nabby
// @version       1.7.2
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_deleteValue
// @grant         GM_addStyle
// @run-at        document-end
// @namespace https://greasyfork.org/users/28618
// @downloadURL https://update.greasyfork.org/scripts/16580/TagPro%20Texture%20Pack%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/16580/TagPro%20Texture%20Pack%20Manager.meta.js
// ==/UserScript==

console.log('START: ' + GM_info.script.name + ' (v' + GM_info.script.version + ' by ' + GM_info.script.author + ')');

var TPTPR_Overlays = {};
var TPTPR_Packs = {};
setObjects();

var getTexture = function() {
	var textureDefault = {
		"balls": "/images/tiles.png",
		"tiles": "/images/tiles.png",
		"speedpad": "/images/speedpad.png",
		"speedpadred": "/images/speedpadred.png",
		"speedpadblue": "/images/speedpadblue.png",
		"portal": "/images/portal.png",
		"splats": "/images/splats.png",
		"wallpaper": "/images/background.jpg",
		"wallpaperingame": "/images/background.jpg"
	};
	return $.extend(true, {}, textureDefault, GM_getValue('texturePack', textureDefault));
};
var Texture_Pack = getTexture();

//Set the game tiles/textures...
if (tagpro.loadAssets) {
	tagpro.loadAssets({
		"tiles": Texture_Pack.tiles || '/images/tiles.png',
		"speedpad": Texture_Pack.speedpad || '/images/speedpad.png',
		"speedpadRed": Texture_Pack.speedpadred || '/images/speedpadred.png',
		"speedpadBlue": Texture_Pack.speedpadblue || '/images/speedpadblue.png',
		"portal": Texture_Pack.portal || '/images/portal.png',
		"splats": Texture_Pack.splats || '/images/splats.png'
	});
}


tagpro.ready(function() {
	if (window.location.port) { //we're in a game...
		var tr = tagpro.renderer;
		var spinBall = !!(GM_getValue('TPTPR_Spin', false));
		var spinOverlay = !!(GM_getValue('TPTPR_ShowBallOverlaysMenu', false) && GM_getValue('TPTPR_SpinOverlay', false) && GM_getValue('TPTPR_Overlay', false));
        var differentBalls = !!(GM_getValue('TPTPR_DifferentBallTexture', false) && Texture_Pack.balls);
		
		//Set the wallpaper...
		var wallpaperType = 'wallpaper';
		if (GM_getValue('TPTPR_UseInGameWallpaper', false)) wallpaperType = 'wallpaperingame';
		if (Texture_Pack[wallpaperType].indexOf('#') === 0) { //just a color
			$('html').css('background', Texture_Pack[wallpaperType]);
		} else {
			$('html').css('background', '#000 url("'+Texture_Pack[wallpaperType]+'") no-repeat fixed center').css('background-size', (GM_getValue('TPTPR_StretchWallpaper', true) ? 'cover' : 'contain'));
		}

		//Game Background Transparency...
		if (GM_getValue('TPTPR_TransparentBackground', false)) {
			var oldCanvas = $(tr.canvas);
			var newCanvas = $('<canvas id="viewport" width="1280" height="800"></canvas>');
			oldCanvas.after(newCanvas);
			oldCanvas.remove();
			tr.canvas = newCanvas.get(0);
			tr.options.transparent = true;
			tr.renderer = tr.createRenderer();
			tr.resizeAndCenterView();
			newCanvas.show();
		}

		//Faded Splats...
		if (GM_getValue('TPTPR_FadingSplats', false)) {
			tr.drawSplat = function (x, y, team, showDeath, fadeAway) {
				console.log('drawSplat()');
 				/* Draws a splat onto the splat layer.
                 * @param x {Number} The x-coordinate
                 * @param y {Number} The y-coordinate
                 * @param team {Number} The team number
                 * @param showDeath {boolean} Whether to show the death animation. */
				var startColor, stopColor;
				if (team === 1) {
					startColor = "ff0000";
				} else {
					startColor = "0000ff";
				}
				stopColor = "ffffff";

				if (showDeath) {
					if (tr.options.disableParticles) {
						tr.drawBallPop(x + 19, y + 19, team);
					} else {
						tr.startDeathEmitter(startColor, stopColor, x + 19, y + 19);
					}
				}

				fadeAway = true;
				tr.addSplat(team, x, y, fadeAway);
			};
		}

		//Ball Overlay...
		if (GM_getValue('TPTPR_ShowBallOverlaysMenu', false) && GM_getValue('TPTPR_Overlay', false) && TPTPR_Overlays.hasOwnProperty(GM_getValue('TPTPR_Overlay')) ) {
			var overlay = GM_getValue('TPTPR_Overlay');
			var overlayTexture = PIXI.Texture.fromImage(TPTPR_Overlays[overlay].url);
			tr.TPTPR_CreateOverlay = function(player) {
				if (!player.sprites.overlay) {
					player.sprites.overlay = new PIXI.Sprite(overlayTexture);
					player.sprites.overlay.anchor.x = 0.5;
					player.sprites.overlay.anchor.y = 0.5;
					player.sprites.overlay.x = 20;
					player.sprites.overlay.y = 20;
					if (overlay === 'sombrero') { //this one just looks better a bit bigger...
						player.sprites.overlay.width = 50;
						player.sprites.overlay.height = 50;
					}
					player.sprites.ball.addChild(player.sprites.overlay);
				}
			};
		}

        //Different Balls, Ball Transparency & Overlay...
		if (GM_getValue('TPTPR_TransparentBall', 1) < 1 || spinBall || spinOverlay || differentBalls) {
            if (differentBalls) {
                var loadDifferentBalls = new PIXI.AssetLoader([Texture_Pack.balls]);
                
                var setupDifferentBalls = function() {
                    var texture = PIXI.Texture.fromImage([Texture_Pack.balls]); //will be taken from cache if available
                    var redTexture = new PIXI.Texture(texture, new PIXI.Rectangle(texture.width-80, 0, 40, 40));
                    var blueTexture = new PIXI.Texture(texture, new PIXI.Rectangle(texture.width-40, 0, 40, 40));

                    tr.updatePlayerColor = function(player) {
                        var color = player.team == 1 ? "red" : "blue";
                        var tileId = color + "ball";
                        if (player.sprites.actualBall.tileId !== tileId) {
                            var teamTexture = player.team === 1 ? redTexture : blueTexture;
                            var baseTexture = tagpro.tiles.getTexture(tileId);
                            var texture = new PIXI.Texture(baseTexture);
                            player.sprites.actualBall.setTexture(texture);
                            player.sprites.actualBall.tileId = tileId;
                            player.sprites.newBall.setTexture(teamTexture);
                        }
                    };

                    tr.createNewBall = function(player) {
                        if (!player.sprites.newBall) {
                            var teamTexture = player.team === 1 ? redTexture : blueTexture;
                            player.sprites.newBall = new PIXI.Sprite(teamTexture);
                            player.sprites.newBall.anchor.x = 0.5;
                            player.sprites.newBall.anchor.y = 0.5;
                            player.sprites.newBall.x = 20;
                            player.sprites.newBall.y = 20;
                            player.sprites.ball.addChild(player.sprites.newBall);
                        }
                    };
                    
                    tr.createBallSprite = function(player) {
                        var texture = player.team == 1 ? "redball" : "blueball";
                        player.sprites.actualBall = tagpro.tiles.draw(player.sprites.ball, texture, {x: 0, y: 0}, null, null, 0.01);
                        player.sprites.actualBall.tileId = texture;
                        
                        tr.createNewBall(player);

                        player.sprites.newBall.alpha = GM_getValue('TPTPR_TransparentBall', 1);

                        player.sprites.newBall.anchor.x = 0.5;
                        player.sprites.newBall.anchor.y = 0.5;
                        player.sprites.newBall.x = 20;
                        player.sprites.newBall.y = 20;

                        if (GM_getValue('TPTPR_ShowBallOverlaysMenu', false) && GM_getValue('TPTPR_Overlay', false) && TPTPR_Overlays.hasOwnProperty(GM_getValue('TPTPR_Overlay')) ) tr.TPTPR_CreateOverlay(player);
                    };
                };
                
                loadDifferentBalls.onComplete = setupDifferentBalls;
                loadDifferentBalls.load();
                

            } else {
                tr.createBallSprite = function(player) {
                    var texture = player.team == 1 ? "redball" : "blueball";
                    player.sprites.actualBall = tagpro.tiles.draw(player.sprites.ball, texture, {x: 0, y: 0}, null, null, 0.01);
                    player.sprites.actualBall.tileId = texture;

                    player.sprites.actualBall.alpha = GM_getValue('TPTPR_TransparentBall', 1);

                    player.sprites.actualBall.anchor.x = 0.5;
                    player.sprites.actualBall.anchor.y = 0.5;
                    player.sprites.actualBall.x = 20;
                    player.sprites.actualBall.y = 20;

                    if (GM_getValue('TPTPR_ShowBallOverlaysMenu', false) && GM_getValue('TPTPR_Overlay', false) && TPTPR_Overlays.hasOwnProperty(GM_getValue('TPTPR_Overlay')) ) tr.TPTPR_CreateOverlay(player);
                };
            }
        }

		//Center/Spin Flair (from Browncoat's Mod)...
		if (GM_getValue('TPTPR_ShowBallOverlaysMenu', false) && GM_getValue('TPTPR_CenterFlair', false)) {
			tr.drawFlair = function (player) {
				if (player.flair) {
					if (!player.sprites.flair) {
						var cacheKey = "flair-" + player.flair.x + "," + player.flair.y;
						var flairTexture = tr.getFlairTexture(cacheKey, player.flair);
						player.sprites.flair = new PIXI.Sprite(flairTexture);
						player.sprites.flair.x = 20;
						player.sprites.flair.y = 20;
						//player.sprites.flair.width = 20; //normal size is 16x16
						//player.sprites.flair.height = 20;
						player.sprites.flair.anchor.x = 0.5;
						player.sprites.flair.anchor.y = 0.5;
						player.sprites.info.addChild(player.sprites.flair);
					}
					if (GM_getValue('TPTPR_SpinFlair', false)) {
						player.sprites.flair.rotation = player.angle;
					}
				}
				if (!player.flair && player.sprites.flair) {
					player.sprites.info.removeChild(player.sprites.flair);
				}
			};
		}

		//Spin...
		if ( spinBall || spinOverlay ) {
			var uPSP = tr.updatePlayerSpritePosition;
			tr.updatePlayerSpritePosition = function(player) {
                var whichBall = 'actualBall';
                if (GM_getValue('TPTPR_DifferentBallTexture', false) && player.sprites.newBall) whichBall = 'newBall';
				if (spinBall) player.sprites[whichBall].rotation = player.angle;
				if (spinOverlay && player.sprites.overlay) player.sprites.overlay.rotation = player.angle;
				uPSP(player);
			};
		}

		if (GM_getValue('TPTPR_MoveChatToLeft', false)) {
			setTimeout(function() {
				$('#chatHistory').css('left', '10px');
				$('#chat').css('left', '10px');
			}, 1200);
		} else {
			setTimeout(function() {
				$('#chatHistory').css('left', $('#viewport').position().left + 10);
				$('#chat').css('left', $('#viewport').position().left + 10);
			}, 1200);
		}


	} else if ($('a#play').length) { //we're on the server homepage
		var texturePack = getTexture();
		var customTexturePack = GM_getValue('customTexturePack', TPTPR_Packs.mydnd.url);
		var savedTextures = JSON.parse(GM_getValue('savedTextures','{}'));
		var	image = 'tiles', imageFriendly = 'Tiles';
		var randomPup = Math.floor(Math.random()*3);

		/*-------------------------------------------------------------------------------*/
		// Functions...
		/*-------------------------------------------------------------------------------*/
		var handleDrop = function(e) {
			var data = e.originalEvent.dataTransfer;
			var URL;

			if (data.files[0]){ // Handle as a file...
				var file = data.files[0];
				var reader = new FileReader();
				reader.onload = function(f){
					URL = f.target.result;
					setTexture(image, URL);
					saveToCustomTexturePack(image, URL);
					setTimeout(confirmText('Success - File Saved!', imageFriendly), 100);
				};
				reader.readAsDataURL(file);

			} else { // Handle as a URL...
				data.items[0].getAsString(function(u){
					if (u.indexOf('http') !== 0) u = 'http://' + u;
					setTexture(image, u);
					saveToCustomTexturePack(image, u);
					URL = u;
					setTimeout(confirmText('Success - URL Saved!', imageFriendly), 100);
				});
			}
		};

        /*-------------------------------------------------------------------------------*/
		var saveToCustomTexturePack = function(image, url) {
			customTexturePack[image] = url;
			GM_setValue('customTexturePack', customTexturePack);
		};

        /*-------------------------------------------------------------------------------*/
		var setTexture = function(image, url) {
			texturePack[image] = url;
			GM_setValue('texturePack', texturePack);

			if (image === 'wallpaper') {
				if (url.indexOf('#') === 0) { //color
					$('html').css('background', url);
				} else {
					$('html').css('background', '#000 url("'+texturePack[image]+'") no-repeat fixed center').css('background-size', (GM_getValue('TPTPR_StretchWallpaper', true) ? 'cover' : 'contain'));
				}
			}
		};

        /*-------------------------------------------------------------------------------*/
        var img = new Image(); //we're using this to get .width & .height of texture
		var confirmText = function(header, message) {
			if (header === undefined) header = 'Done!';
			if (message === undefined) message = '';

			$('#TPTPR_Messages').stop().animate({"opacity":0}, 0);
			if (header || message) {
				$('#TPTPR_Messages').html('<span style="font-size:12px; color:yellow">'+header+'</span><br><span style="font-size:11px; color:white">'+message+'</span>');
				$('#TPTPR_Messages').stop().animate({"opacity":1}, 200, "swing", function(){
					$('#TPTPR_Messages').stop().animate({"null":1}, 3000, function(){
						$('#TPTPR_Messages').stop().animate({"opacity":0}, 2000, "swing", function(){
						});
					});
				});
			}

			if (texturePack[image]) {
				var dropZoneWidth = '100%';
                var dropZoneHeight = '40px';
				if ((image === 'tiles') || (image === 'splats') || (image === 'wallpaper') || (image === 'wallpaperingame')) dropZoneHeight = '220px';
                if (image === 'balls') dropZoneWidth = '80px';
                
				if (texturePack[image].indexOf('#') === 0) { //color
					$('#TPTPR_DropZone').html('').css({ 'background':texturePack[image], 'height':dropZoneHeight });
				} else { //image
                    if (image === 'balls') {
                        img.src = texturePack[image];
                        var texturePosition = (img.width || 640) - 80;
                        $('#TPTPR_DropZone').html('').css({ 'margin':"0 auto", 'background':"url('"+texturePack[image]+"') center no-repeat", 'background-position':"-"+texturePosition+"px 0px", 'width':dropZoneWidth, 'height':dropZoneHeight });
                    } else {
                        $('#TPTPR_DropZone').html('').css({ 'margin':"0 auto", 'background':"url('"+texturePack[image]+"') center no-repeat", 'background-size':"contain", 'width':dropZoneWidth, 'height':dropZoneHeight });
                    }
				}
			} else {
                if (image === 'balls') {
                    $('#TPTPR_DropZone').css({'height':'220px', 'width':'100%', 'background':'#a00'}).html('<div style="margin:40px">No File Loaded!<br>(Balls from "Tiles" will be used)</div>');
                } else {
                    $('#TPTPR_DropZone').css({'height':'220px', 'width':'100%', 'background':'#a00'}).html('<div style="margin:40px">No File Loaded!<br>(Vanilla defaults will be used)</div>');
                }
			}
		};

        /*-------------------------------------------------------------------------------*/
		var createPreview = function(name, type, elementToAppendTo, addNamePlate) {
			if (type === undefined) type = 'saved';
			if (elementToAppendTo === undefined) elementToAppendTo = $('#TPTPR_SavedPacks');
			if (addNamePlate === undefined) addNamePlate = true;

			var textureUrl;
			var boostTextureUrl;
			if (type === 'saved') {
				textureUrl = savedTextures[name].tiles;
				boostTextureUrl = savedTextures[name].speedpad;
			} else if (type === 'author') {
				if (name === 'mydnd') {
					textureUrl = customTexturePack.tiles;
					boostTextureUrl = customTexturePack.speedpad;
				} else {
					textureUrl = TPTPR_Packs[name].url.tiles;
					boostTextureUrl = TPTPR_Packs[name].url.speedpad;
				}
			} else {
				textureUrl = texturePack.tiles;
				boostTextureUrl = texturePack.speedpad;
			}

			var $preview = $('<div class="preview" value="'+name+'" title="Load This Texture Pack...">').css({
				'position': 'relative',
				'display': 'inline-block',
				'margin': '0px',
				'transform': 'scale(0.8, 0.8)',
				'border-spacing': '0',
				'cursor': 'pointer'
			});

			// Create actual preview
			var previewOutline = {
				1: {
					1:'',
					2:'',
					3:'',
					4:''
				},
				2: {
					1:'wall1',
					2:'',
					3:'',
					4:''
				},
				3: {
					1:'wall2',
					2:'wallA',
					3:'pup',
					4:''
				}
			};

			var tile = {x:-520, y:-160},
				wall1 = {x:-280, y:-120},
				wallA = {x:-80, y:-360},
				wall2 = {x:-280, y:-400},
				spad = {x:'0px', y:'0px'},
				pup = (function(){
					var yPosition = -160 - 40 * randomPup;
					return {x:-480, y: yPosition};
				})(),
				fc = {x:'-560px', y:'0px'},
				flag = {x:'-600px', y:'-40px'};

			for (var i in previewOutline){
				var row = $('<div/>');
				if (i == 1 || i == 3) row.css('height','30px');
				else row.css('height','40px');

				for (var j in previewOutline[i]){
					var tilePos = JSON.parse(JSON.stringify(tile));
					if (i == 1) tilePos.y += -10;
					if (j == 1) tilePos.x += -10;

					tilePos = tilePos.x+'px '+tilePos.y+'px';
					var $tile = $('<div></div>').css({
						'backgroundImage': 'url('+textureUrl+')',
						'backgroundPosition': tilePos,
						'height': 'inherit',
						'width': '40px',
						'display': 'table-cell'
					});

					if (i == 1 || i == 3) row.find('.tile').css('backgroundPosition',tilePos.x +' '+ tilePos.y);

					var $tileImage = $('<div/>').css({
						'backgroundImage': 'url('+textureUrl+')',
						'height': 'inherit',
						'width': 'inherit'
					});
					var position;
					switch(previewOutline[i][j]){
						case 'wall1':
							position = JSON.parse(JSON.stringify(wall1));
							break;
						case 'wall2':
							position = JSON.parse(JSON.stringify(wall2));
							break;
						case 'wallA':
							position = JSON.parse(JSON.stringify(wallA));
							break;
						case 'pup':
							position = JSON.parse(JSON.stringify(pup));
							break;
						default:
							position = {x:40, y:40};
							break;
					}

					if (j == 1) {
						position.x += -10;
						$tile.css('width','30px');
					}
					else if (j == 4) {
						$tile.css('width','40px');
					}
					position = position.x+'px '+position.y+'px';
					$tileImage.css('backgroundPosition', position);
					if (((i == 2) && (j == 1)) || ((i == 3) && (j == 1)) || ((i == 3) && (j == 2)) || ((i == 3) && (j == 3))) {
						$tile.append($tileImage);
					}
					row.append($tile);
				}
				$preview.append(row);
			}
			$preview.append($('<div class="flag-carrier"></div>').css({
				'backgroundPosition': fc.x +' '+ fc.y,
				'backgroundImage': 'url('+textureUrl+')',
				top: '37px',
				left: '35px'
			}));
			$preview.find('.flag-carrier').append($('<div class="flag-carrier"></div>').css({
				'backgroundPosition': flag.x +' '+ flag.y,
				'backgroundImage': 'url('+textureUrl+')',
				top: '-33px'
			}));
			$preview.append($('<div id="TPTR_Preview_Boost"></div>').css({
				'backgroundPosition': spad.x +' '+ spad.y,
				'backgroundImage': 'url('+boostTextureUrl+')',
				position: 'absolute',
				top: '30px',
				left: '110px',
				width: '40px',
				height: '40px'
			}));

			// Create name plate
			if (addNamePlate) {
				var nameplateCSS = {
					position: 'absolute',
					width: '100%',
					zIndex: '3',
					backgroundColor: '#000000',
					bottom: '-14px',
					fontSize: '11px',
					padding: '1px 0px'
				};
				var $nameplate = $('<div class="nameplate"></div>').css(nameplateCSS);

				$nameplate.append($('<span/>').css('margin','0px 10px').text(name));
				$preview.append($nameplate);
			}

			// Delete button
			var deleteCSS = {
				position: 'absolute',
				color: '#ffffff',
				top: '4px',
				right: '4px',
				fontWeight: 'bold',
				fontSize: '12px',
				opacity: '0.3',
				cursor: 'pointer',
				textDecoration: 'none',
				zIndex: '2',
				backgroundColor:'red',
				borderRadius: '50%',
				textAlign: 'center',
				width: '15px',
				height: '15px'
			};
			var $delete = $('<div class="delete-preview" title="Delete This Saved Pack"></div>').css(deleteCSS).text('x');
			$delete.hover(function(){
				$(this).css('opacity', '1');
			}, function(){
				$(this).css('opacity', '0.3');
			});
			$preview.prepend($delete);

			// Append
			$(elementToAppendTo).prepend($preview);
		};


		/*-------------------------------------------------------------------------------*/
		// Build the menu...
		/*-------------------------------------------------------------------------------*/
		// Append components
		$('h1').after('<div id="TPTPR_Container" style="display:flex; flex-flow: row wrap; position:relative; margin:15px auto; padding:3px; text-align:center; width:540px; line-height:1.1; background-color:#DADFE1; border-radius:5px; -webkit-user-select:none; z-index:100"></div>');
		var $TPTPR_Container = $('#TPTPR_Container');
		$TPTPR_Container.append('<div id="TPTPR_Heading" style="width:100%; color:goldenrod; background:rebeccapurple; font-size:16px; padding:3px; margin:-3px -3px 3px -3px; border-radius:5px 5px 0 0; font-weight:bold; text-shadow:1px 1px 1px #000;">' + GM_info.script.name + ' <span style="color:#ccc; font-size:10px; font-style:italic; font-weight:normal;">v'+GM_info.script.version+'</span></div>');
		$TPTPR_Container.append('<div id="TPTPR_Left" style="width:200px"></div>');
		$TPTPR_Container.append('<div id="TPTPR_Right" style="margin:0px 10px 10px; width:320px"></div>');
		var $TPTPR_Right = $('#TPTPR_Right');
		$TPTPR_Container.append('<div id="TPTPR_ExitX" style="position:absolute; top:2px; right:2px; color:black; background:white; font-weight:bold; font-size:16px; width:19px; border:1px solid black; opacity:0.4; cursor:pointer; z-index:2">x</div>');

		$('#TPTPR_Left').append('<table id="TPTPR_Left_Inner" style="width:100%; background:#444; font-size:13px; border:1px solid black; border-spacing:1px; border-radius:7px"></table>');
		var $TPTPR_Left_Inner = $('#TPTPR_Left_Inner');
		$TPTPR_Left_Inner.append('<tr><th id="TPTPR_TextureButton_tiles" class="TPTPR_TextureButton" value="tiles"><span>Tiles</span></th></tr>');
		$TPTPR_Left_Inner.append('<tr><th id="TPTPR_TextureButton_speedpad" class="TPTPR_TextureButton" value="speedpad"><span>Speedpad</span></th></tr>');
		$TPTPR_Left_Inner.append('<tr><th id="TPTPR_TextureButton_speedpadred" class="TPTPR_TextureButton" value="speedpadred"><span>Speedpad Red</span></th></tr>');
		$TPTPR_Left_Inner.append('<tr><th id="TPTPR_TextureButton_speedpadblue" class="TPTPR_TextureButton" value="speedpadblue"><span>Speedpad Blue</span></th></tr>');
		$TPTPR_Left_Inner.append('<tr><th id="TPTPR_TextureButton_portal" class="TPTPR_TextureButton" value="portal"><span>Portal</span></th></tr>');
		$TPTPR_Left_Inner.append('<tr><th id="TPTPR_TextureButton_splats" class="TPTPR_TextureButton" value="splats"><span>Splats</span></th></tr>');
		$TPTPR_Left_Inner.append('<tr><td class="TPTPR_Spacer" style="background:#fff"></td></tr>');
		$TPTPR_Left_Inner.append('<tr><td style="background:#666"><div id="TPTPR_HideShowPacks" class="TPTPR_MenuSliderButton" title="Show/Hide">⇩ Texture Packs ⇩</div><div id="TPTPR_TexturePacks" style="display:flex; flex-wrap:wrap; justify-content:center; font-size:11px; overflow:hidden"></div></td></tr>');
		var $TPTPR_TexturePacks = $('#TPTPR_TexturePacks');
		$TPTPR_Left_Inner.append('<tr><td class="TPTPR_Spacer" style="background:#fff"></td></tr>');
		$TPTPR_Left_Inner.append('<tr><td id="TPTPR_Options" style="background:#888; font-size:11px">' +
								 '<label><input type="checkbox"'+(GM_getValue('TPTPR_Spin', false) ? ' checked' : '')+' id="TPTPR_Spin">Ball Spin</label><br>' +
								 '<label><input type="range" id="TPTPR_TransparentBall" value="'+(GM_getValue('TPTPR_TransparentBall', 1)*100)+'" min="0" max="100"></label><div style="color:#ddd">Ball Transparency: <span id="TPTPR_TransparentBallValue">'+(GM_getValue('TPTPR_TransparentBall', 1))+'</span></div>' +
								 '<label><input type="checkbox"'+(GM_getValue('TPTPR_DifferentBallTexture', false) ? ' checked' : '')+' id="TPTPR_DifferentBallTexture">Use Different Ball Texture</label><br>' +
								 '<label><input type="checkbox"'+(GM_getValue('TPTPR_FadingSplats', false) ? ' checked' : '')+' id="TPTPR_FadingSplats">Use Fading Splats</label><br>' +
								 '<label><input type="checkbox"'+(GM_getValue('TPTPR_TransparentBackground', false) ? ' checked' : '')+' id="TPTPR_TransparentBackground">Transparent Game Background</label><br>' +
								 '<label><input type="checkbox"'+(GM_getValue('TPTPR_UseInGameWallpaper', false) ? ' checked' : '')+' id="TPTPR_UseInGameWallpaper">Use Different In-Game Wallpaper</label><br>' +
								 '<label><input type="checkbox"'+(GM_getValue('TPTPR_StretchWallpaper', true) ? ' checked' : '')+' id="TPTPR_StretchWallpaper">Stretch Wallpaper to Fit</label><br>' +
								 '<label title="Default position is inside game window"><input type="checkbox"'+(GM_getValue('TPTPR_MoveChatToLeft', false) ? ' checked' : '')+' id="TPTPR_MoveChatToLeft">Force Chat to Left of Screen</label><br>' +
								 '<label><input type="checkbox"'+(GM_getValue('TPTPR_ShowBallOverlaysMenu', false) ? ' checked' : '')+' id="TPTPR_ShowBallOverlaysMenu">Enable Ball Overlays</label><br>' +
								 '</td></tr>');
        GM_addStyle('#TPTPR_Options label:hover { color:chartreuse; }');
		$TPTPR_Left_Inner.append('<tr class="TPTPR_BallOverlaysMenu" style="display:none"><td class="TPTPR_Spacer" style="background:#fff"></td></tr>');
		$TPTPR_Left_Inner.append('<tr class="TPTPR_BallOverlaysMenu" style="display:none"><td style="background:#aaa"><div id="TPTPR_HideShowBallOverlays" class="TPTPR_MenuSliderButton" title="Show/Hide">⇩ Ball Overlays ⇩</div><div id="TPTPR_BallOverlays" style="display:flex; flex-wrap:wrap; justify-content:center; font-size:11px; color:#444; overflow:hidden"></div></td></tr>');
		$TPTPR_Left_Inner.append('<tr><td class="TPTPR_Spacer" style="background:#fff"></td></tr>');
		$TPTPR_Left_Inner.append('<tr><th id="TPTPR_TextureButton_balls" class="TPTPR_TextureButton" value="balls" style="cursor:pointer'+(GM_getValue('TPTPR_DifferentBallTexture', false) ? '' : '; display:none')+'"><span>Balls</span></th></tr>');
		$TPTPR_Left_Inner.append('<tr><th id="TPTPR_TextureButton_wallpaper" value="wallpaper"><span>Wallpaper</span></th></tr>');
		$TPTPR_Left_Inner.append('<tr><th id="TPTPR_TextureButton_wallpaperingame" value="wallpaperingame" style="cursor:pointer'+(GM_getValue('TPTPR_UseInGameWallpaper', false) ? '' : '; display:none')+'"><span>Game Wallpaper</span></th></tr>');
        GM_addStyle('#TPTPR_Container th { cursor:pointer; background:#444 }');
        GM_addStyle('#TPTPR_Container th:hover { cursor:pointer; background:#999 }');

		$TPTPR_Right.append('<div style="font-size:13px; color:black; font-weight:bold">In-Game Texture</div><div style="font-size:10px; color:black; font-style:italic">(this texture will always be used for games)</div>');
		$TPTPR_Right.append('<div id="TPTPR_DropZone_Outer" style="display:flex; align-items:center; height:220px; border:2px dotted silver;"><div id="TPTPR_DropZone" style="width:100%"></div></div>');
		$TPTPR_Right.append('<div id="TPTPR_Messages" style="display:inline-block; margin:5px auto; padding:0 10px; font-weight:bold; background:#c00; border-radius:8px;">&nbsp;</div>');
		$TPTPR_Right.append('<div><div id="TPTPR_PacksHeading" class="TPTPR_MenuSliderButton" title="Show/Hide">⇩ My Saved Texture Packs ⇩</div></div>');
		$('#TPTPR_PacksHeading').after('<div id="TPTPR_SavedPacks" style="position:relative; display:'+(Object.keys(savedTextures).length <= 2 ? 'inline-block' : 'none')+'; background-color:#ccc; height:auto; width:320px; border-bottom:3px solid gray; border-radius:0px 0px 5px 5px"></div>');
		$('#TPTPR_SavedPacks').append('<div id="TPTR_addNewPack" title="Save Current Texture Set" style="margin:10px auto; width:80px; opacity:0.5; font-size:40px; color:#7f8c8d; background:#ccc; border: 1px dashed black; border-radius:10px; cursor:pointer">+</div>');
        GM_addStyle('.TPTPR_MenuSliderButton { font-size:12px; color:lightgrey; background:rebeccapurple; padding:1px 5px; border-radius:5px; cursor:pointer; }');
        GM_addStyle('.TPTPR_MenuSliderButton:hover { color:chartreuse }');

		$('#TPTPR_Container').hide(0);

		//Pre-made texture packs...
		$.each(TPTPR_Packs, function(key, value) {
			$TPTPR_TexturePacks.append('<span id="'+key+'" class="TPTPR_TexturePacksItem" title="By '+value.author+'">'+value.displayname+'</span>');
			if (key === 'vanilla') {
				$('#'+key).addClass('TPTPR_SpecialPack');
			} else if (key === 'mydnd') {
				$('#'+key).addClass('TPTPR_SpecialPack');
				$TPTPR_TexturePacks.append('<div style="width:100%"></div>');
			}
		});
		$TPTPR_TexturePacks.append('<div style="width:100%"></div>');
		$TPTPR_TexturePacks.append('<label title="Uncheck to only load individual textures (like speedpad, splats, etc)" style="color:chartreuse"><input type="checkbox"'+(GM_getValue('TPTPR_CompletePack', true) ? ' checked' : '') + ' id="TPTPR_CompletePack">Load Complete Pack?</label>');
		GM_addStyle('.TPTPR_TexturePacksItem { margin:1px 4px; padding:0 3px; background:#fff; color:#777; border-radius:6px; cursor:default }');
		GM_addStyle('.TPTPR_TexturePacksItem:hover { background:firebrick; color:#eee }');
		GM_addStyle('.TPTPR_SpecialPack { font-style:italic; }');

		//Ball Overlays...
		$.each(TPTPR_Overlays, function(key, value) {
			$('#TPTPR_BallOverlays').append('<label class="TPTPR_BallOverlaysItem" id="'+key+'"><input type="radio" class="TPTPR_BallOverlaysItem" name="TPTPR_BallOverlaysItem"'+(key===GM_getValue('TPTPR_Overlay', false)?' checked':'')+'>'+value.displayname+'</input></label>');
		});
		$('#TPTPR_BallOverlays').append('<br><label style="width:100%; color:darkslategray"><input type="checkbox"' + (GM_getValue('TPTPR_SpinOverlay', false) ? ' checked' : '') + ' id="TPTPR_SpinOverlay">Spin Overlay</label>');
		$('#TPTPR_BallOverlays').append('<br><label style="width:100%; color:darkslategray"><input type="checkbox"' + (GM_getValue('TPTPR_CenterFlair', false) ? ' checked' : '') + ' id="TPTPR_CenterFlair">Center Flair in Ball</label>');
		$('#TPTPR_BallOverlays').append('<br><label style="width:100%; color:darkslategray"><input type="checkbox"' + (GM_getValue('TPTPR_SpinFlair', false) ? ' checked' : '') + (GM_getValue('TPTPR_CenterFlair', false) ? '' : ' disabled') + ' id="TPTPR_SpinFlair">Spin Flair with Ball</label>');
		$('#TPTPR_BallOverlays').hide(0);
		if (GM_getValue('TPTPR_ShowBallOverlaysMenu', false)) $('.TPTPR_BallOverlaysMenu').show(0);
		GM_addStyle('input.TPTPR_BallOverlaysItem { margin:0 0 0 4px }');

		// Add saved texture previews...
		$.each(savedTextures, function(key, value) {
			createPreview(key);
		});

		//Set the wallpaper...
		if (Texture_Pack.wallpaper.indexOf('#') === 0) { //just a color
			$('html').css('background', Texture_Pack.wallpaper);
		} else {
			$('html').css('background', '#000 url("'+Texture_Pack.wallpaper+'") no-repeat fixed center').css('background-size', (GM_getValue('TPTPR_StretchWallpaper', true) ? 'cover' : 'contain'));
		}


		/*-------------------------------------------------------------------------------*/
		// Bind events...
		/*-------------------------------------------------------------------------------*/
		$('h1').on('dblclick', function() {
			$('#TPTPR_Container').slideToggle(400);
		});

		$('#TPTPR_Container').find('table th').click(function(){
			$('#TPTPR_Left_Inner th').css('color', '#fff');
			$(this).css('color', '#7e0');
			image = $(this).attr('value');
			imageFriendly = $(this).text();
			if ((image === 'wallpaper') || (image === 'wallpaperingame')) $('#TPTPR_DropZone').prop('title', 'Double-click to reset');
			else $('#TPTPR_DropZone').prop('title', '');
			setTimeout(confirmText(imageFriendly), 50);
		});

        //Exit 'X'...
		$('#TPTPR_ExitX').hover(function(){
			$(this).css('opacity', '0.8');
		}, function(){
			$(this).css('opacity', '0.4');
		}).click(function(){
			$(this).parent().slideUp();
		});


		//My Saved Packs...
		$('#TPTPR_PacksHeading').click(function(){
			if ($('#TPTPR_SavedPacks').is(':visible')) {
				$('#TPTPR_SavedPacks').slideUp(400, function() {
                    $('#TPTPR_PacksHeading').text('⇩ My Saved Texture Packs ⇩');
                });
				
			} else {
				if ((image === 'wallpaper') || (image === 'wallpaperingame')) {
					image = 'tiles';
					$('#TPTPR_Left_Inner').find('th').css('color', '#fff');
					$('#TPTPR_Container').find('table th:eq(0)').css('color', '#7e0');
					confirmText('');
				}
				$('#TPTPR_SavedPacks').slideDown(400, function() {
                    $('#TPTPR_PacksHeading').text('⇧ My Saved Texture Packs ⇧');
                });
			}
		});

		$('#TPTPR_SavedPacks').on('click', '.preview', function(){
			var textureName = $(this).attr('value');
			var pack = savedTextures[textureName];
			for (var i in pack){
				texturePack[i] = pack[i];
				setTexture(i, pack[i]);
				$('#TPTPR_TextureButton_'+i).children('span').fadeOut(200).fadeIn(600);
			}
			confirmText('Saved Texture Pack Loaded', '"'+textureName+'"');
		});
		$('#TPTPR_SavedPacks').on('mouseenter', '.preview', function(){
			$(this).css('opacity', '0.7');
		}).on('mouseleave', '.preview', function(){
			$(this).css('opacity', '1');
		});

		$('#TPTPR_SavedPacks').on('click', '.delete-preview', function(e){
			e.stopPropagation();
			e.preventDefault();
			var confirmDelete = confirm('Delete saved texture pack?');
			if (confirmDelete) {
				var preview = $(this).parent();
				preview.fadeOut(function(){
					delete savedTextures[preview.attr('value')];
					preview.remove();
					GM_setValue('savedTextures', JSON.stringify(savedTextures));
				});
			}
		});

		$('#TPTR_addNewPack').click(function(){
			var name = prompt('Texture pack name:');
			if (name){
				var texturePackTemp = JSON.parse(JSON.stringify(texturePack));
				delete texturePackTemp.wallpaper;
				delete texturePackTemp.wallpaperingame;
				savedTextures[name] = texturePackTemp;
				if ((JSON.stringify(savedTextures)*2/1024)/1024 > 30) {
					alert('Storage limit exceeded.');
					delete savedTextures[name];
				}
				else {
					GM_setValue('savedTextures', JSON.stringify(savedTextures));
					createPreview(name);
				}
			}
		}).hover(function(){
			$(this).css('opacity', '0.8');
		}, function(){
			$(this).css('opacity', '0.5');
		});


		//Options...
		$('#TPTPR_Spin').on('click', function() {
			GM_setValue('TPTPR_Spin', $(this).is(':checked'));
			confirmText('Ball Spin: ' + ($(this).is(':checked') ? 'Enabled' : 'Disabled'));
		});
		$('#TPTPR_TransparentBall').on('input', function() {
			$('#TPTPR_TransparentBallValue').text( (this.value / 100).toFixed(2) );
		});
		$('#TPTPR_TransparentBall').on('change', function() {
			GM_setValue('TPTPR_TransparentBall', (this.value / 100).toFixed(2));
		});
		$('#TPTPR_DifferentBallTexture').on('click', function() {
            GM_setValue('TPTPR_DifferentBallTexture', $(this).is(':checked'));
			if ($(this).is(':checked')) {
				$('#TPTPR_TextureButton_balls').fadeIn(400);
                $('#TPTPR_TextureButton_balls').trigger('click');
			} else {
				$('#TPTPR_TextureButton_balls').fadeOut(400);
                if (image === 'balls') $('#TPTPR_TextureButton_tiles').trigger('click');
			}
		});
		$('#TPTPR_FadingSplats').on('click', function() {
			GM_setValue('TPTPR_FadingSplats', $(this).is(':checked'));
			confirmText('Fading Splats: ' + ($(this).is(':checked') ? 'Enabled' : 'Disabled'));
		});
		$('#TPTPR_TransparentBackground').on('click', function() {
			GM_setValue('TPTPR_TransparentBackground', $(this).is(':checked'));
			confirmText('Game Background Transparency: ' + ($(this).is(':checked') ? 'Enabled' : 'Disabled'));
		});
		$('#TPTPR_UseInGameWallpaper').on('click', function() {
			GM_setValue('TPTPR_UseInGameWallpaper', $(this).is(':checked'));
			$('#TPTPR_TextureButton_wallpaperingame').fadeToggle(400);
			confirmText('Different Wallpaper In Game: ' + ($(this).is(':checked') ? 'Enabled' : 'Disabled'));
		});
		$('#TPTPR_StretchWallpaper').on('click', function() {
			GM_setValue('TPTPR_StretchWallpaper', $(this).is(':checked'));
			$('html').css('background', '#000 url("'+texturePack.wallpaper+'") no-repeat fixed center').css('background-size', (GM_getValue('TPTPR_StretchWallpaper') ? 'cover' : 'contain'));
			confirmText('Stretch Wallpaper: ' + ($(this).is(':checked') ? 'Enabled' : 'Disabled'));
		});
		$('#TPTPR_MoveChatToLeft').on('click', function() {
			GM_setValue('TPTPR_MoveChatToLeft', $(this).is(':checked'));
			confirmText('Move Chat to Left: ' + ($(this).is(':checked') ? 'Enabled' : 'Disabled'));
		});
		$('#TPTPR_ShowBallOverlaysMenu').on('click', function() {
			GM_setValue('TPTPR_ShowBallOverlaysMenu', $(this).is(':checked'));
			$('.TPTPR_BallOverlaysMenu').fadeToggle(600);
			confirmText('Ball Overlays: ' + ($(this).is(':checked') ? 'Enabled' : 'Disabled'));
		});
		$('#TPTPR_CenterFlair').on('click', function() {
			GM_setValue('TPTPR_CenterFlair', $(this).is(':checked'));
			if ($(this).is(':checked')) {
				$('#TPTPR_SpinFlair').prop('disabled', false);
			} else {
				$('#TPTPR_SpinFlair').prop('disabled', true);
			}
			confirmText('Center Flair: ' + ($(this).is(':checked') ? 'Enabled' : 'Disabled'));
		});
		$('#TPTPR_SpinFlair').on('click', function() {
			GM_setValue('TPTPR_SpinFlair', $(this).is(':checked'));
			confirmText('Spin Flair: ' + ($(this).is(':checked') ? 'Enabled' : 'Disabled'));
		});



		// Get Texture Packs...
		$TPTPR_TexturePacks.hide(0);
		$('#TPTPR_HideShowPacks').on('click', function() {
			if ($TPTPR_TexturePacks.is(':visible')) {
                $TPTPR_TexturePacks.slideUp(400, function() {
                    $('#TPTPR_HideShowPacks').text('⇩ Texture Packs ⇩');
                });
			} else {
                $TPTPR_TexturePacks.slideDown(400, function() {
                    $('#TPTPR_HideShowPacks').text('⇧ Texture Packs ⇧');
                });
				if ((image === 'wallpaper') || (image === 'wallpaperingame')) {
					image = 'tiles';
					$('#TPTPR_Container table th').css('color', '#fff');
					$('#TPTPR_Container').find('table th:eq(0)').css('color', '#7e0');
					confirmText('');
				}
			}
		});

		$('#TPTPR_TexturePacks').find('.TPTPR_TexturePacksItem').hover(function() {
			$('#TPTPR_PackPreview').remove();

			if ((image !== 'wallpaper') && (image !== 'wallpaperingame')) {
				var width = '300px', height = '40px';
				if ((image === 'tiles') || (image === 'splats')) height = '200px';
                if (image === 'balls') width = '80px';

				if (GM_getValue('TPTPR_CompletePack', true)) {
					$('#'+this.id).after('<div id="TPTPR_PackPreview" style="position:absolute; padding:5px 10px; background:white; border:2px dashed purple; border-radius:5px; z-index:9999;"></div>');
					createPreview(this.id, 'author', '#TPTPR_PackPreview', false);
				} else {
                    if (this.id === 'mydnd') {
                        if (image === 'balls') {
                            img.src = customTexturePack.balls;
                            var texturePosition = (img.width || 640) - 80;
                            $('#'+this.id).after('<div id="TPTPR_PackPreview" style="position:absolute; width:300px; z-index:9999; width:'+width+'; height:'+height+'; border:2px solid black; border-radius:5px; background:#fff url(\''+customTexturePack.balls+'\') center no-repeat; background-position:-'+texturePosition+'px 0;"></div>');
                        } else {
                            $('#'+this.id).after('<div id="TPTPR_PackPreview" style="position:absolute; width:300px; z-index:9999; width:'+width+'; height:'+height+'; border:2px solid black; border-radius:5px; background:#fff url(\''+customTexturePack[image]+'\') center no-repeat; background-size:contain;"></div>');
                        }
                    } else {
                        if (image === 'balls') {
                            img.src = TPTPR_Packs[this.id].url.tiles;
                            var texturePosition = (img.width || 640) - 80;
                            $('#'+this.id).after('<div id="TPTPR_PackPreview" style="position:absolute; width:300px; z-index:9999; width:'+width+'; height:'+height+'; border:2px solid black; border-radius:5px; background:#fff url(\''+TPTPR_Packs[this.id].url.tiles+'\') center no-repeat; background-position:-'+texturePosition+'px 0;"></div>');
                        } else {
                            $('#'+this.id).after('<div id="TPTPR_PackPreview" style="position:absolute; width:300px; z-index:9999; width:'+width+'; height:'+height+'; border:2px solid black; border-radius:5px; background:#fff url(\''+TPTPR_Packs[this.id].url[image]+'\') center no-repeat; background-size:contain;"></div>');
                        }
                    }
				}
			}
		}, function() {
			$('#TPTPR_PackPreview').remove();
		});

		$('#TPTPR_CompletePack').on('click', function() {
			GM_setValue('TPTPR_CompletePack', $(this).is(':checked'));
		});

		$('#TPTPR_TexturePacks').find('.TPTPR_TexturePacksItem').on('click', function() {
			$('#TPTPR_PackPreview').remove();
			if (this.id === 'vanilla') {
				if (GM_getValue('TPTPR_CompletePack', true)) {
					$.each(texturePack, function(key, value) {
						if ((key !== 'wallpaper') && (image !== 'wallpaperingame')) {
							setTexture(key, "/images/"+key+".png");
							$('#TPTPR_TextureButton_'+key).children('span').fadeOut(200).fadeIn(600);
						}
					});
					confirmText('Texture Pack Loaded', TPTPR_Packs[this.id].displayname);
				} else {
					setTexture(image, "/images/"+image+".png");
					$('#TPTPR_TextureButton_'+image).children('span').fadeOut(200).fadeIn(600);
					confirmText('Single Texture Loaded: ' + imageFriendly, TPTPR_Packs[this.id].displayname);
				}

			} else if (this.id === 'mydnd') { //drag and dropped
				if (GM_getValue('TPTPR_CompletePack', true)) {
					$.each(texturePack, function(key, value) {
						if ((key !== 'wallpaper') && (image !== 'wallpaperingame')) {
							setTexture(key, customTexturePack[key]);
							$('#TPTPR_TextureButton_'+key).children('span').fadeOut(200).fadeIn(600);
						}
					});
					confirmText('Texture Pack Loaded', TPTPR_Packs[this.id].displayname);
				} else {
					setTexture(image, customTexturePack[image]);
					$('#TPTPR_TextureButton_'+image).children('span').fadeOut(200).fadeIn(600);
					confirmText('Single Texture Loaded: ' + imageFriendly, TPTPR_Packs[this.id].displayname);
				}

			} else {
				if (GM_getValue('TPTPR_CompletePack', true)) {
					var packId = this.id;
					$.each(texturePack, function(key, value) {
						if ((key !== 'wallpaper') && (image !== 'wallpaperingame')) {
							setTexture(key, TPTPR_Packs[packId].url[key]);
							$('#TPTPR_TextureButton_'+key).children('span').fadeOut(200).fadeIn(600);
						}
					});
					confirmText('Texture Pack Loaded', TPTPR_Packs[this.id].displayname);
				} else {
                    if (image === 'balls') {
                        setTexture(image, TPTPR_Packs[this.id].url.tiles);
                    } else {
                        setTexture(image, TPTPR_Packs[this.id].url[image]);
                    }
					$('#TPTPR_TextureButton_'+image).children('span').fadeOut(200).fadeIn(600);
					setTimeout(confirmText('Single Texture Loaded: ' + imageFriendly, TPTPR_Packs[this.id].displayname), 50);
				}
			}
		});


		//Overlays...
		$('#TPTPR_HideShowBallOverlays').on('click', function() {
			if ($('#TPTPR_BallOverlays').is(':visible')) {
				$('#TPTPR_BallOverlays').slideUp(400, function() {
                    $('#TPTPR_HideShowBallOverlays').text('⇩ Ball Overlays ⇩');
                });
			} else {
				$('#TPTPR_BallOverlays').slideDown(400, function() {
                    $('#TPTPR_HideShowBallOverlays').text('⇧ Ball Overlays ⇧');
                });
			}
		});

		$('#TPTPR_BallOverlays').find('label.TPTPR_BallOverlaysItem').on('click', function() {
			if (this.id === 'none') {
				GM_setValue('TPTPR_Overlay', false);
			} else {
				GM_setValue('TPTPR_Overlay', this.id);
			}
		});

		$('#TPTPR_BallOverlays').find('label.TPTPR_BallOverlaysItem').hover(function() {
			$('#TPTPR_OverlayPreview').remove();
            if (GM_getValue('TPTPR_DifferentBallTexture', false) && texturePack.balls) {
                img.src = texturePack.balls;
                var texturePosition = (img.width || 640) - 80;
                $('#'+this.id).children('input').after('<div id="TPTPR_OverlayPreview" style="position:absolute; margin-top:2px; width:80px; height:40px; z-index:9999; border:2px solid black; border-radius:10px; background-color:white; background-image:url(\''+TPTPR_Overlays[this.id].url+'\'), url(\''+texturePack.balls+'\'); background-position:0px 0px, -'+texturePosition+'px 0"></div>');
            } else {
                $('#'+this.id).children('input').after('<div id="TPTPR_OverlayPreview" style="position:absolute; margin-top:2px; width:80px; height:40px; z-index:9999; border:2px solid black; border-radius:10px; background-color:white; background-image:url(\''+TPTPR_Overlays[this.id].url+'\'), url(\''+texturePack.tiles+'\'); background-position:0px 0px, -560px 0"></div>');
            }
			$('#'+this.id).css('color', 'firebrick');
		}, function() {
			$('#TPTPR_OverlayPreview').remove();
			$('#'+this.id).css('color', '');
		});

		$('#TPTPR_SpinOverlay').on('click', function() {
			GM_setValue('TPTPR_SpinOverlay', $(this).is(':checked'));
			confirmText('Spin Overlay: ' + ($(this).is(':checked') ? 'Enabled' : 'Disabled'));
		});


		// Drag/Drop events...
		$(document).on('dragover', function(e) {
			e.stopPropagation();
			e.preventDefault();
			$('#TPTPR_DropZone_Outer').css({border:'2px dotted red'});
		}).on('dragleave', function(e) {
			e.stopPropagation();
			e.preventDefault();
			$('#TPTPR_DropZone_Outer').css({border:'2px dotted silver'});
		});

		var timeoutHandle=0, lastEnter;
		$('#TPTPR_Left_Inner .TPTPR_TextureButton, #TPTPR_TextureButton_wallpaper, #TPTPR_TextureButton_wallpaperingame').on('dragover', function(e) {
			e.stopPropagation();
			e.preventDefault();
			$(this).css({background:'darkolivegreen'});
			$('#TPTPR_DropZone_Outer').css({border:'2px dotted red'});
			var that = this;
			if (lastEnter !== e.target) {
				lastEnter = e.target;
				clearTimeout(timeoutHandle);
				timeoutHandle = setTimeout(function() {
					$(that).trigger('click');
				}, 600);
			}
		}).on('dragleave', function(e) {
			e.stopPropagation();
			e.preventDefault();
			$(this).css({background:'#444'});
		}).on('drop', function(e) {
			e.stopPropagation();
			e.preventDefault();
			$(this).css({background:'#444'});
			$('#TPTPR_DropZone_Outer').css({border:'2px dotted silver'});
			$(this).trigger('click');
			handleDrop(e);
		});

		$('#TPTPR_DropZone_Outer').on('dragover', function(e) {
			e.stopPropagation();
			e.preventDefault();
			if (lastEnter !== e.target) {
				lastEnter = e.target;
				clearTimeout(timeoutHandle);
			}
			$(this).css({background:'green', opacity:0.3});
		}).on('dragleave', function(e) {
			e.stopPropagation();
			e.preventDefault();
			$(this).css({background:'', opacity:1});
		}).on('drop', function(e) {
			e.stopPropagation();
			e.preventDefault();
			$(this).css({border:'2px dotted silver', background:'', opacity:1});
			handleDrop(e);
		}).on('dblclick', function(e) {
			e.stopPropagation();
			e.preventDefault();
			var confirmVanilla = confirm('Reset ' + imageFriendly + ' to Vanilla/Defaults?');
			if (confirmVanilla) {
				if ((image === 'wallpaper') || (image === 'wallpaperingame')) {
					var confirmImageOrGray = confirm("OK - Tagpro Image Background\n\nCancel - Black");
					if (confirmImageOrGray) {
						setTexture(image, "/images/background.jpg");
						//$('html').css('background', "url('/images/background.jpg') no-repeat fixed center").css('background-size', (GM_getValue('TPTPR_StretchWallpaper', true) ? 'cover' : 'contain'));
						confirmText(imageFriendly + ' Set To Default');
					} else {
						setTexture(image, "#000000");
						//$('html').css('background', "#000000");
						confirmText(imageFriendly + ' Set To Black');
					}
				} else {
					setTexture(image, "/images/"+image+".png");
					confirmText('Texture Set To Default', imageFriendly);
				}
			}
		});

		// Select the tiles button...
        $('#TPTPR_TextureButton_tiles').trigger('click');
	}
});


/*==================================================================================================================================================================*/
function setObjects() {
    TPTPR_Packs = {
        'vanilla':              { displayname:'Vanilla',                          author:'TagPro Defaults',          url:{tiles:'/images/tiles.png',
                                                                                                                          speedpad:'/images/speedpad.png', 
                                                                                                                          speedpadred:'/images/speedpadred.png', 
                                                                                                                          speedpadblue:'/images/speedpadblue.png', 
                                                                                                                          splats:'/images/splats.png', 
                                                                                                                          portal:'/images/portal.png'} },
        'mydnd':                { displayname:'My Drag and Dropped',              author:'Me!',                      url:{tiles:'', 
                                                                                                                          speedpad:'', 
                                                                                                                          speedpadred:'', 
                                                                                                                          speedpadblue:'', 
                                                                                                                          splats:'', 
                                                                                                                          portal:''} },

        'aaron215':             { displayname:'Aaron215',                         author:'Aaron215',                 url:{tiles:'http://i.imgur.com/pHTyBeO.png', 
                                                                                                                          speedpad:'http://i.imgur.com/p7yauSo.png', 
                                                                                                                          speedpadred:'http://i.imgur.com/1pq6LLP.png', 
                                                                                                                          speedpadblue:'http://i.imgur.com/KbRQdOb.png', 
                                                                                                                          splats:'http://i.imgur.com/tDsbgPv.png', 
                                                                                                                          portal:'http://i.imgur.com/K0PQHJ6.png'} },        
        'briochelight':         { displayname:'Brioche Light',                    author:'brioche',                  url:{tiles:'http://i.imgur.com/WDLyCrr.png', 
                                                                                                                          speedpad:'http://i.imgur.com/wtpkZWw.png', 
                                                                                                                          speedpadred:'http://i.imgur.com/l6OMel5.png', 
                                                                                                                          speedpadblue:'http://i.imgur.com/IAAOkQz.png', 
                                                                                                                          splats:'http://i.imgur.com/kbkOC6x.png', 
                                                                                                                          portal:'http://i.imgur.com/CXgNNTs.png'} },
        'camspp_lh':            { displayname:'Cam\'sPP Light',                   author:'StrayCam',                 url:{tiles:'http://i.imgur.com/22NGRaG.png', 
                                                                                                                          speedpad:'http://i.imgur.com/4N7Moqk.png', 
                                                                                                                          speedpadred:'http://i.imgur.com/z4H9yVL.png', 
                                                                                                                          speedpadblue:'http://i.imgur.com/L9AvmXe.png', 
                                                                                                                          splats:'http://i.imgur.com/pJ3HlcS.png', 
                                                                                                                          portal:'http://i.imgur.com/a0JUw8q.png'} },
        'camspp_dsh':           { displayname:'Cam\'sPP Dark Sniper Horizontal',  author:'StrayCam',                 url:{tiles:'http://i.imgur.com/2B8Vaux.png', 
                                                                                                                          speedpad:'http://i.imgur.com/lVixtut.png', 
                                                                                                                          speedpadred:'http://i.imgur.com/7Fe8iFB.png', 
                                                                                                                          speedpadblue:'http://i.imgur.com/kU7LnOW.png', 
                                                                                                                          splats:'http://i.imgur.com/pJ3HlcS.png', 
                                                                                                                          portal:'http://i.imgur.com/mp79U9E.png'} },
        'camspp_lsd':           { displayname:'Cam\'sPP Light Sniper Diagonal',   author:'StrayCam',                 url:{tiles:'http://i.imgur.com/bhFWbNW.png', 
                                                                                                                          speedpad:'http://i.imgur.com/22eydBT.png', 
                                                                                                                          speedpadred:'http://i.imgur.com/mdS1Ex7.png', 
                                                                                                                          speedpadblue:'http://i.imgur.com/oWxNfsx.png', 
                                                                                                                          splats:'http://i.imgur.com/pJ3HlcS.png', 
                                                                                                                          portal:'http://i.imgur.com/mp79U9E.png'} },
        'cmyk':                 { displayname:'cMYK',                             author:'MagicPigeon',              url:{tiles:'http://i.imgur.com/v9VK5Oq.png', 
                                                                                                                          speedpad:'http://i.imgur.com/5SFGnrT.png', 
                                                                                                                          speedpadred:'http://i.imgur.com/qcgBVls.png', 
                                                                                                                          speedpadblue:'http://i.imgur.com/nKExBLD.png', 
                                                                                                                          splats:'http://i.imgur.com/7yhZMNT.png', 
                                                                                                                          portal:'http://i.imgur.com/DTGpCj1.png'} },
        'crystal':              { displayname:'Crystal',                          author:'MagicPigeon',              url:{tiles:'http://i.imgur.com/ixFW9oE.png', 
                                                                                                                          speedpad:'http://i.imgur.com/VZKNMH1.png', 
                                                                                                                          speedpadred:'http://i.imgur.com/VsGp8i1.png', 
                                                                                                                          speedpadblue:'http://i.imgur.com/EQn1E5s.png', 
                                                                                                                          splats:'http://i.imgur.com/mtH38yR.png', 
                                                                                                                          portal:'http://i.imgur.com/70X2UY4.png'} },
        'derezzed':             { displayname:'Derezzed',                          author:'-salt-',                  url:{tiles:'http://i.imgur.com/H9qQUAW.png', 
                                                                                                                          speedpad:'http://i.imgur.com/BXtUHQG.png', 
                                                                                                                          speedpadred:'http://i.imgur.com/G92Af0J.png', 
                                                                                                                          speedpadblue:'http://i.imgur.com/R9FAvpp.png', 
                                                                                                                          splats:'http://i.imgur.com/WXHAA3I.png', 
                                                                                                                          portal:'http://i.imgur.com/vJDZam9.png'} },
        'electric':             { displayname:'Electric',                         author:'Bug',                      url:{tiles:'http://i.imgur.com/iFeKuuV.png', 
                                                                                                                          speedpad:'http://i.imgur.com/XrVvThx.png', 
                                                                                                                          speedpadred:'http://i.imgur.com/GLHA3R8.png', 
                                                                                                                          speedpadblue:'http://i.imgur.com/UcFhoVC.png', 
                                                                                                                          splats:'http://i.imgur.com/wxJ2ImS.png', 
                                                                                                                          portal:'http://i.imgur.com/GqZyi5s.png'} },
        'elementplus':          { displayname:'Element+',                         author:'MagicPigeon',              url:{tiles:'http://i.imgur.com/GAGacLn.png', 
                                                                                                                          speedpad:'http://i.imgur.com/KkQKHLo.png', 
                                                                                                                          speedpadred:'http://i.imgur.com/we2eBpa.png', 
                                                                                                                          speedpadblue:'http://i.imgur.com/TKaRnU8.png', 
                                                                                                                          splats:'http://i.imgur.com/Lzg8j80.png', 
                                                                                                                          portal:'http://i.imgur.com/FlPW49l.png'} },
        'flat':                 { displayname:'Flat',                             author:'Bug',                      url:{tiles:'http://i.imgur.com/YC4vQM4.png', 
                                                                                                                          speedpad:'http://i.imgur.com/UoHGwMS.png', 
                                                                                                                          speedpadred:'http://i.imgur.com/CWrsplK.png', 
                                                                                                                          speedpadblue:'http://i.imgur.com/8WrsT4f.png', 
                                                                                                                          splats:'http://i.imgur.com/AYO8rbQ.png', 
                                                                                                                          portal:'http://i.imgur.com/TYWr2Pu.png'} },
        'funhouse':             { displayname:'Funhouse',                         author:'Sunna',                    url:{tiles:'http://i.imgur.com/eJebHd6.png', 
                                                                                                                          speedpad:'http://i.imgur.com/pv0jGMF.png', 
                                                                                                                          speedpadred:'http://i.imgur.com/7DibrCL.png', 
                                                                                                                          speedpadblue:'http://i.imgur.com/syjTZuf.png', 
                                                                                                                          splats:'http://i.imgur.com/KJ8hdEc.png', 
                                                                                                                          portal:'http://i.imgur.com/4lmhtGF.png'} },
        'kindergarten':         { displayname:'Kindergarten',                     author:'Clydas',                   url:{tiles:'http://i.imgur.com/y3tbmOS.png', 
                                                                                                                          speedpad:'http://i.imgur.com/UEpX1wb.png', 
                                                                                                                          speedpadred:'http://i.imgur.com/tUC9CMG.png', 
                                                                                                                          speedpadblue:'http://i.imgur.com/5yA3IOx.png', 
                                                                                                                          splats:'http://i.imgur.com/ZGSTp2s.png', 
                                                                                                                          portal:'http://i.imgur.com/6Lbd9Aw.png'} },
        'minima':               { displayname:'Minima',                           author:'Canvas',                   url:{tiles:'http://i.imgur.com/jGAtqcr.png', 
                                                                                                                          speedpad:'http://i.imgur.com/pJEZKnh.png', 
                                                                                                                          speedpadred:'http://i.imgur.com/OlDPpdM.png', 
                                                                                                                          speedpadblue:'http://i.imgur.com/HgmJ9yg.png', 
                                                                                                                          splats:'http://i.imgur.com/ytIIuQS.png', 
                                                                                                                          portal:'http://i.imgur.com/DeevRGe.png'} },
        'modern':               { displayname:'Modern',                           author:'Mitzimoto',                url:{tiles:'http://i.imgur.com/stGySx9.png', 
                                                                                                                          speedpad:'http://i.imgur.com/aCHBxVO.png', 
                                                                                                                          speedpadred:'http://i.imgur.com/xKupyqI.png', 
                                                                                                                          speedpadblue:'http://i.imgur.com/4dybmaE.png', 
                                                                                                                          splats:'http://i.imgur.com/gXpvWEE.png', 
                                                                                                                          portal:'http://i.imgur.com/KAo7jkl.png'} },
        'mtbad':                { displayname:'MTBad',                            author:'mtbkr24',                  url:{tiles:'http://i.imgur.com/YnJ9THs.png', 
                                                                                                                          speedpad:'http://i.imgur.com/Lgiwb5Q.png', 
                                                                                                                          speedpadred:'http://i.imgur.com/XuN3NbB.png', 
                                                                                                                          speedpadblue:'http://i.imgur.com/5JKeYSQ.png', 
                                                                                                                          splats:'http://i.imgur.com/yL2TZJS.png', 
                                                                                                                          portal:'http://i.imgur.com/xJe0hBy.png'} },
        'musclecups':           { displayname:'Muscle\'s Cup',                    author:'Muscle Cups',              url:{tiles:'http://i.imgur.com/Px8cdyU.png', 
                                                                                                                          speedpad:'http://i.imgur.com/FjdVdQG.png', 
                                                                                                                          speedpadred:'http://i.imgur.com/MtTupDg.png', 
                                                                                                                          speedpadblue:'http://i.imgur.com/FZNnJZf.png', 
                                                                                                                          splats:'http://i.imgur.com/3m8yX7z.png', 
                                                                                                                          portal:'http://i.imgur.com/RQXDv00.png'} },
        'nilla':                { displayname:'Nilla',                            author:'Dotsarecool',              url:{tiles:'http://i.imgur.com/Tdwjnkn.png', 
                                                                                                                          speedpad:'http://i.imgur.com/bawbyQm.png', 
                                                                                                                          speedpadred:'http://i.imgur.com/tDxnPWm.png', 
                                                                                                                          speedpadblue:'http://i.imgur.com/NQaEKB0.png', 
                                                                                                                          splats:'http://i.imgur.com/kHUlTwP.png', 
                                                                                                                          portal:'http://i.imgur.com/v8aO03S.png'} },
        'pastelpro':            { displayname:'Pastel Pro',                       author:'BMO',                      url:{tiles:'http://i.imgur.com/22ehddn.png', 
                                                                                                                          speedpad:'http://i.imgur.com/r7beMZp.png', 
                                                                                                                          speedpadred:'http://i.imgur.com/xAHMOOV.png', 
                                                                                                                          speedpadblue:'http://i.imgur.com/R1TGL5x.png', 
                                                                                                                          splats:'http://i.imgur.com/NKBd7nE.png', 
                                                                                                                          portal:'http://i.imgur.com/GbdQNJJ.png'} },
        'seaweedrb':            { displayname:'Seaweed Red/Blue',                 author:'Borgen',                   url:{tiles:'http://i.imgur.com/e4UjsQs.png', 
                                                                                                                          speedpad:'http://i.imgur.com/ONxlcFL.png', 
                                                                                                                          speedpadred:'http://i.imgur.com/DwUHM2I.png', 
                                                                                                                          speedpadblue:'http://i.imgur.com/DpJS96w.png', 
                                                                                                                          splats:'http://i.imgur.com/ZrimG2x.png', 
                                                                                                                          portal:'http://i.imgur.com/44fPSBq.png'} },
        'sleek':                { displayname:'Sleek',                            author:'DaEvil1',                  url:{tiles:'http://i.imgur.com/1zgobTs.png', 
                                                                                                                          speedpad:'http://i.imgur.com/zI4SzAE.png', 
                                                                                                                          speedpadred:'http://i.imgur.com/8Ucws0m.png', 
                                                                                                                          speedpadblue:'http://i.imgur.com/VDIrsng.png', 
                                                                                                                          splats:'http://i.imgur.com/AlkZRug.png', 
                                                                                                                          portal:'http://i.imgur.com/1RRAMHe.png'} },
        'starwars':             { displayname:'Star Wars',                        author:'Moosen',                   url:{tiles:'http://i.imgur.com/lxV0cnH.png', 
                                                                                                                          speedpad:'http://i.imgur.com/WgeuDEz.png', 
                                                                                                                          speedpadred:'http://i.imgur.com/cqY1LTe.png', 
                                                                                                                          speedpadblue:'http://i.imgur.com/bCUoqXq.png', 
                                                                                                                          splats:'http://i.imgur.com/XIndyGS.png', 
                                                                                                                          portal:'http://i.imgur.com/FtLHfuz.png'} },
        'suave':                { displayname:'Suave',                            author:'fxu',                      url:{tiles:'http://i.imgur.com/Lz0Kbua.png', 
                                                                                                                          speedpad:'http://i.imgur.com/Hh2PIwl.png', 
                                                                                                                          speedpadred:'http://i.imgur.com/Ps5E70J.png', 
                                                                                                                          speedpadblue:'http://i.imgur.com/OsjYgED.png', 
                                                                                                                          splats:'http://i.imgur.com/BTjNBz3.png', 
                                                                                                                          portal:'http://i.imgur.com/siMVwoM.png'} },
        'tranquilitydark':      { displayname:'Tranquility Dark',                 author:'R e t r o',                url:{tiles:'http://i.imgur.com/WyfRfld.png', 
                                                                                                                          speedpad:'http://i.imgur.com/tZE7l6b.png', 
                                                                                                                          speedpadred:'http://i.imgur.com/AGMgt6S.png', 
                                                                                                                          speedpadblue:'http://i.imgur.com/nokGBIr.png', 
                                                                                                                          splats:'http://i.imgur.com/tDsbgPv.png', 
                                                                                                                          portal:'http://i.imgur.com/gFC1dUu.png'} },
        'tranquilitylight':     { displayname:'Tranquility Light',                author:'R e t r o',                url:{tiles:'http://i.imgur.com/cM7dUPy.png', 
                                                                                                                          speedpad:'http://i.imgur.com/qhr6Z6b.png', 
                                                                                                                          speedpadred:'http://i.imgur.com/cVyjSvA.png', 
                                                                                                                          speedpadblue:'http://i.imgur.com/ZqlxWI5.png', 
                                                                                                                          splats:'http://i.imgur.com/ay5FAXS.png', 
                                                                                                                          portal:'http://i.imgur.com/ZvBGaJF.png'} },
        'ultrasmooth':          { displayname:'Ultra Smooth',                     author:'Professor Tag',            url:{tiles:'http://i.imgur.com/zltfpGb.png', 
                                                                                                                          speedpad:'http://i.imgur.com/zxubWbQ.png', 
                                                                                                                          speedpadred:'http://i.imgur.com/yJGhLPt.png', 
                                                                                                                          speedpadblue:'http://i.imgur.com/K02G9jE.png', 
                                                                                                                          splats:'http://i.imgur.com/tDsbgPv.png', 
                                                                                                                          portal:'http://i.imgur.com/hffUZ2J.png'} },
        'vortex':               { displayname:'Vortex',                           author:'MagicPigeon',              url:{tiles:'http://i.imgur.com/jlbr0Gr.png', 
                                                                                                                          speedpad:'http://i.imgur.com/hL1YlFu.png', 
                                                                                                                          speedpadred:'http://i.imgur.com/gxQeYTw.png', 
                                                                                                                          speedpadblue:'http://i.imgur.com/pbXh4b1.png', 
                                                                                                                          splats:'http://i.imgur.com/36fUJG2.png', 
                                                                                                                          portal:'http://i.imgur.com/H1cHH5w.png'} },
    };
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    TPTPR_Overlays = {
        'none':                 { displayname:'None',                url:false                            },
        'poker':                { displayname:'Poker Chip',          url:'http://i.imgur.com/SRTdwMB.png' },
        'quads':                { displayname:'Quads',               url:'http://i.imgur.com/Y4VyHp3.png' },
        'marble':               { displayname:'Marble',              url:'http://i.imgur.com/yT42PHy.png' }, //Professor Tag
        'whitedot':             { displayname:'White Dot',           url:'http://i.imgur.com/YOo6Zkx.png' },
        'crosshair':            { displayname:'Crosshair',           url:'http://i.imgur.com/WO4hzVF.png' },
        'darkring':             { displayname:'Dark Ring',           url:'http://i.imgur.com/A746foc.png' },
        'innerstar':            { displayname:'Inner Star',          url:'http://i.imgur.com/Xs1lsOH.png' },
        'sombrero':             { displayname:'Sombrero',            url:'http://i.imgur.com/LqcPOIr.png' },
        'sunglasses':           { displayname:'Shades',              url:'http://i.imgur.com/xbGNFU7.png' },
    };
    /*==================================================================================================================================================================*/
}