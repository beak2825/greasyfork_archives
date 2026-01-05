// ==UserScript==
// @name        youtubewall
// @description Fancy Youtube Fullscreen Graphic Demo
// @namespace   youtubewall
// @include     https://www.youtube.com/*
// @include     http://www.youtube.com/*
// @version     1.1
// @grant       none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/11080/youtubewall.user.js
// @updateURL https://update.greasyfork.org/scripts/11080/youtubewall.meta.js
// ==/UserScript==

var SHADER_FRAGMENT = "precision mediump float;\n" +
	"\n" +
	"varying vec2  vTextureCoord;\n" +
	"varying vec2  vTextureCoord2;\n" +
	"varying vec2  vOther;\n" +
	"varying float si1;\n" +
	"varying float si4;\n" +
	"\n" +
	"uniform sampler2D diffuseTextureSampler;\n" +
	"uniform sampler2D normalTextureSampler;\n" +
	"\n" +
	"vec3 texArc(float wi, float r) {\n" +
	"	vec2 c = vec2(0.5 * r * sin(wi) + 0.5, 0.5 * r * cos(wi) + 0.5);\n" +
	"	return vec3(texture2D(diffuseTextureSampler, c)) ;\n" +
	"	//return (vec3(c, 0.0));\n" +
	"}\n" +
	"\n" +
	"void main(void) {\n" +
	"	vec3 bcol = vec3(texture2D(diffuseTextureSampler, vTextureCoord));\n" +
	"	vec3 wcol = vec3(texture2D(normalTextureSampler,  vTextureCoord2));\n" +
	"\n" +
	"	float ax = 0.0;\n" +
	"	float ay = 0.0;\n" +
	"	float dx = 0.0;\n" +
	"	float dy = 0.0;\n" +
	"	float ux = si4 + vTextureCoord.x * (1.0 - 2.0 * si4);\n" +
	"	float uy = si4 + vTextureCoord.y * (1.0 - 2.0 * si4);\n" +
	"	\n" +
	"	if (vTextureCoord.x > 1.0) { ax = vTextureCoord.x - 1.0; ux = 1.0 - si4;  dx = -1.0; }\n" +
	"	if (vTextureCoord.y > 1.0) { ay = vTextureCoord.y - 1.0; uy = 1.0 - si4;  dy = -1.0; }\n" +
	"	if (vTextureCoord.x < 0.0) { ax = vTextureCoord.x;       ux = si4;  dx = 1.0; }\n" +
	"	if (vTextureCoord.y < 0.0) { ay = vTextureCoord.y;       uy = si4;  dy = 1.0; }\n" +
	"\n" +
	"	\n" +
	"		vec4 a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17;\n" +
	"		\n" +
	"		float dst = sqrt(ax * ax + ay * ay) * 2.0;\n" +
	"		\n" +
	"		float myx = vTextureCoord.x - 0.5;\n" +
	"		float myy = vTextureCoord.y - 0.5;\n" +
	"		float s1 = si1 + dst * 0.02;\n" +
	"		float r  = 0.95 + 0.05 * sqrt(myy * myy + myx * myx);\n" +
	"		float wi = atan(myx, myy);\n" +
	"				\n" +
	"		bcol = (texArc(wi, 1.0) + \n" +
	"		0.5 * texArc(wi - 0.015, r) + \n" +
	"		0.5 * texArc(wi + 0.015, r) + \n" +
	"		0.25 * texArc(wi - 0.04, r) + \n" +
	"		0.25 * texArc(wi + 0.04, r)) / 2.5;\n" +
	"		\n" +
	"		//a9  = texture2D(diffuseTextureSampler, vec2(ux           , uy));\n" +
	"	\n" +
	"		gl_FragColor = vec4(0.2 * wcol + 0.8 * wcol * bcol * 1.0 / sqrt(1.0 + dst * dst), 1.0);\n" +
	"//		gl_FragColor = vec4(bcol * 1.0 / sqrt(1.0 + dst * dst), 1.0);\n" +
	"}\n";
	
var SHADER_VERTEX = "precision mediump float;\n" +
	"\n" +
	"attribute vec3 vPosition;\n" +
	"\n" +
	"#define imagesize 0.5\n" +
	"\n" +
	"varying vec2  vTextureCoord2;\n" +
	"varying vec2  vTextureCoord;\n" +
	"varying vec2  vOther;\n" +
	"\n" +
	"#define d 0.005\n" +
	"\n" +
	"varying float si1;\n" +
	"varying float si4;\n" +
	"\n" +
	"void main(void) {\n" +
	"	gl_Position    = vec4(vPosition, 1.0);\n" +
	"	vTextureCoord2 = vec2((vPosition.x + 1.0), 2.0 - (vPosition.y + 1.0)) * 0.5;\n" +
	"	vTextureCoord  = 0.5 + (vTextureCoord2 - 0.5) / imagesize;\n" +
	"	\n" +
	"	si1 = d / imagesize;\n" +
	"	si4 = 8.0 * si1;\n" +
	"}\n";

/* RENDER.JS */

function Event() {

	this.ctor = function() {
		this.handlers = [];
	};
	
	this.add = function(handler) {
		this.handlers.push(handler);
	};
	
	this.remove = function(handler) {
		this.handlers.removeValue(handler);
	};
	
	this.invoke = function(a, b, c, d, e, f, g, h, i) {
		for (var i = 0; i < this.handlers.length; i++) {
			try {
				this.handlers[i](a, b, c, d, e, f, g, h, i);
			}
			catch (e) {
				// whatup?!
			}
		}
	}
	
	this.ctor();
}

function pglRender(gl) {
	this.gl           = gl;
	this.drawable     = null;

	this.frames       = 0;
	this.beforeRender = new Event();
	this.afterRender  = new Event();
	this.beforeInit   = new Event();
	this.myLoop       = null;
	
	this.init = function() {
		this.beforeInit.invoke(this);
		this.drawable.init(gl);
	};
	
	this.startLoop = function() {
		var self = this;
		this.myLoop = window.setInterval(function() { self.draw(); }, 25);
	};
	
	this.stop = function() {
		window.clearInterval(this.myLoop);
	};
	
	this.draw = function() {
		this.beforeRender.invoke(this.gl, this);
		this.drawable.draw(this.gl, this);
		this.afterRender.invoke(this.gl, this);
		this.frames++;
	};

}

/* VIDEO.JS */

function pglVideo(gl, videoParam) {

	if (typeof videoParam === 'string') {
		this.videoUrl = videoParam;
		this.videoElement = null;
	} else {
		this.videoUrl = "";
		this.videoElement = videoParam;
	}
	
	//@Override
	this.texture = null;
	this.gl = gl;
	
	this.init = function() {
		var self = this;
		if (this.videoElement == null)
			this.createVideoElement();
		this.createTexture();
//		this.render.beforeRender.add(function() { self.loadTexture(); });
	};
	
	this.createVideoElement = function() {
		this.videoElement = document.createElement('video');
		this.videoElement.src = this.videoUrl;
		this.videoElement.autoplay = true;
		this.videoElement.preload = 'auto';
		this.videoElement.loop = true;
//		this.videoElement.style.display = 'none';
//		document.body.appendChild(this.videoElement);
	};
	
	this.createTexture = function() {
		this.texture = this.gl.createTexture();
	};

	this.updateTexture = function() {
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
		this.gl.texImage2D(this.gl.TEXTURE_2D, 0,this. gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.videoElement);
//		this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.imageElement, true);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
//		this.gl.generateMipmap(this.gl.TEXTURE_2D);
		this.gl.bindTexture(this.gl.TEXTURE_2D, null);
	};
	
	this.init();
	
}

/* IMAGE.JS */

function pglImage(gl, imageParam) {
	
	if (typeof imageParam === 'string') {
		this.imageUrl = imageParam;
		this.imageElement = null;
	} else {
		this.imageUrl = "";
		this.imageElement = imageParam;
	}
	
	//@Override
	this.texture = null;
	this.gl = gl;
	
	this.init = function() {
		var self = this;
		this.createImageElement();
		this.createTexture();
	};
	
	this.createImageElement = function() {
		var self = this;
		if (this.imageElement == null) {
			this.imageElement        = new Image();
			this.imageElement.src    = this.imageUrl;
			this.imageElement.addEventListener('load', function() { self.loadTexture(); }, false);
		} else {
			window.setTimeout(function() { self.loadTexture(); }, 500);
		}
	};
	
	this.createTexture = function() {
		console.log('ctex');
		
		this.texture = this.gl.createTexture();
	};

	this.loadTexture = function() {
		
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
		this.gl.texImage2D(this.gl.TEXTURE_2D, 0,this. gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.imageElement);
//		this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.imageElement, true);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
//		this.gl.generateMipmap(this.gl.TEXTURE_2D);
		this.gl.bindTexture(this.gl.TEXTURE_2D, null);
	};
	
	this.init();
	
}

/* SCENE.JS */

function pglDemoScene() {

	this.cube = new pglDemoCube();
	this.shdr = new pglShader();
	
	this.init = function(gl) {
		this.cube.init(gl);
	};

	this.draw = function(gl) {
		gl.clearColor(0, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		this.shdr.use(gl);
		this.cube.draw(gl, this);
	};

}

/* DEMOCUBE.JS */

var pglDemoTriangleVertices = [
-1.0, -1.0, 0.0,
1.0, -1.0, 0.0,
1.0,  1.0, 0.0,

-1.0, -1.0, 0.0,
-1.0, 1.0, 0.0,
1.0,  1.0, 0.0];

var pglDemoCubeVertices = [
// Front face
-1.0, -1.0,  1.0,
 1.0, -1.0,  1.0,
 1.0,  1.0,  1.0,
-1.0,  1.0,  1.0,

// Back face
-1.0, -1.0, -1.0,
-1.0,  1.0, -1.0,
 1.0,  1.0, -1.0,
 1.0, -1.0, -1.0,

// Top face
-1.0,  1.0, -1.0,
-1.0,  1.0,  1.0,
 1.0,  1.0,  1.0,
 1.0,  1.0, -1.0,

// Bottom face
-1.0, -1.0, -1.0,
 1.0, -1.0, -1.0,
 1.0, -1.0,  1.0,
-1.0, -1.0,  1.0,

// Right face
 1.0, -1.0, -1.0,
 1.0,  1.0, -1.0,
 1.0,  1.0,  1.0,
 1.0, -1.0,  1.0,

// Left face
-1.0, -1.0, -1.0,
-1.0, -1.0,  1.0,
-1.0,  1.0,  1.0,
-1.0,  1.0, -1.0
];

var pglDemoCubeVertexNormals = [
// Front
 0.0,  0.0,  1.0,
 0.0,  0.0,  1.0,
 0.0,  0.0,  1.0,
 0.0,  0.0,  1.0,

// Back
 0.0,  0.0, -1.0,
 0.0,  0.0, -1.0,
 0.0,  0.0, -1.0,
 0.0,  0.0, -1.0,

// Top
 0.0,  1.0,  0.0,
 0.0,  1.0,  0.0,
 0.0,  1.0,  0.0,
 0.0,  1.0,  0.0,

// Bottom
 0.0, -1.0,  0.0,
 0.0, -1.0,  0.0,
 0.0, -1.0,  0.0,
 0.0, -1.0,  0.0,

// Right
 1.0,  0.0,  0.0,
 1.0,  0.0,  0.0,
 1.0,  0.0,  0.0,
 1.0,  0.0,  0.0,

// Left
-1.0,  0.0,  0.0,
-1.0,  0.0,  0.0,
-1.0,  0.0,  0.0,
-1.0,  0.0,  0.0
];

var pglDemoCubeTextureCoordinates = [
// Front
0.0,  0.0,
1.0,  0.0,
1.0,  1.0,
0.0,  1.0,
// Back
0.0,  0.0,
1.0,  0.0,
1.0,  1.0,
0.0,  1.0,
// Top
0.0,  0.0,
1.0,  0.0,
1.0,  1.0,
0.0,  1.0,
// Bottom
0.0,  0.0,
1.0,  0.0,
1.0,  1.0,
0.0,  1.0,
// Right
0.0,  0.0,
1.0,  0.0,
1.0,  1.0,
0.0,  1.0,
// Left
0.0,  0.0,
1.0,  0.0,
1.0,  1.0,
0.0,  1.0
];

var pglDemoCubeVertexIndices = [
0,  1,  2,      0,  2,  3,    // front
4,  5,  6,      4,  6,  7,    // back
8,  9,  10,     8,  10, 11,   // top
12, 13, 14,     12, 14, 15,   // bottom
16, 17, 18,     16, 18, 19,   // right
20, 21, 22,     20, 22, 23    // left
];

function pglDemoCube() {

	this.tex = null;

	this.vertices = null;
	this.normals = null;
	this.texcoords = null;
	this.indices = null;

	this.init = function(gl) {
		this.tex2      = new pglImage(gl, GLOBAL_IMAGE_PARAM);
		this.tex       = new pglVideo(gl, GLOBAL_VIDEO_PARAM);
	
		this.vertices  = gl.createBuffer();
		this.normals   = gl.createBuffer();
		this.texcoords = gl.createBuffer();
		this.indices   = gl.createBuffer();
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pglDemoTriangleVertices), gl.STATIC_DRAW);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normals);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pglDemoCubeVertexNormals), gl.STATIC_DRAW);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoords);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pglDemoCubeTextureCoordinates), gl.STATIC_DRAW);
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(pglDemoCubeVertexIndices), gl.STATIC_DRAW);
	};

	this.draw = function(gl, scene) {
		this.tex.updateTexture(gl);
	
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.tex.texture);
		gl.uniform1i(scene.shdr.diffuseTexture, 0);
		
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this.tex2.texture);
		gl.uniform1i(scene.shdr.normalTexture, 1);
	
		gl.enableVertexAttribArray(0);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices);
		gl.vertexAttribPointer(
		   0,                  // attribute 0. No particular reason for 0, but must match the layout in the shader.
		   3,                  // size
		   gl.FLOAT,           // type
		   gl.FALSE,           // normalized?
		   0,                  // stride
		   0                   // array buffer offset
		);
		 
		// Draw the triangle !
		gl.drawArrays(gl.TRIANGLES, 0, 6); // Starting from vertex 0; 3 vertices total -> 1 triangle
		gl.disableVertexAttribArray(0);
	};

}

/* SHADER.JS */

function pglShader() {

	this.shaderProc     = null;
	this.vertexShader   = null;
	this.fragmentShader = null;
	
	this.diffuseTexture = null;
	this.normalTexture  = null;
	
	this.compileShaders = function(gl, vCode, fCode) {
		this.shaderProc = gl.createProgram();
		this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
		this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		
		gl.shaderSource(this.vertexShader,   vCode);
		gl.shaderSource(this.fragmentShader, fCode);
		gl.compileShader(this.vertexShader);
		gl.compileShader(this.fragmentShader);
		
		gl.attachShader(this.shaderProc, this.vertexShader);
		gl.attachShader(this.shaderProc, this.fragmentShader);
		
		gl.bindAttribLocation(this.shaderProc, 0, "vPosition");
		gl.linkProgram(this.shaderProc);
		
		this.diffuseTexture = gl.getUniformLocation(this.shaderProc, "diffuseTextureSampler");
		this.normalTexture  = gl.getUniformLocation(this.shaderProc, "normalTextureSampler");
	}
	
	this.use = function(gl) {
		gl.useProgram(this.shaderProc);
	}

}

var GLOBAL_BUTTON_ID   = 'sdf8sdoa7ubhsdv9o8h';
var GLOBAL_VIDEO_PARAM = 'big-buck-bunny_trailer.webm';
var GLOBAL_IMAGE_PARAM = 'data:image/png;base64,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';
var GLOBAL_IMAGE_TILE  = GLOBAL_IMAGE_PARAM;

var s;
var r;
var gl;
var c;

var video;
var video_parent;
var video_style;
var box;

function inject_btn() {
	
	if (document.getElementById(GLOBAL_BUTTON_ID)) {
		
	} else {
	
		var header = document.getElementById('watch-header');
		var btn    = document.createElement('button');
		btn.id     = GLOBAL_BUTTON_ID;
		btn.innerHTML = "CUSTOM FULLSCREEN";
		header.insertBefore(btn, header.firstChild);
		btn.onclick = main;
	}
}

function exit() {
	if (document.mozFullScreenElement == null) {
		r.stop();
		
		box.remove();
		video_parent.insertBefore(video, video_parent.firstChild);
		video.style = video_style;
		video.controls = false;
		
		video.play();
	}
}

function genbg(w, h, cb) {
	
	var si = new Image();
	si.src = GLOBAL_IMAGE_TILE;
	
	var ca  = document.createElement('canvas');
	
	ca.width  = w;
	ca.height = h;
	
	si.addEventListener('load', function() {
	
	var tw = Math.min(si.width, 64.0);
	var th = Math.min(si.height, 64.0);
	
	var cg = ca.getContext('2d');
	
	for (x = 0; x < w; x += tw) {
		for (y = 0; y < h; y += th) {
			cg.drawImage(si, x, y);
		}
	}
	
	cb();
	
	}, true);
	
	GLOBAL_IMAGE_PARAM = ca;
}

function main()
{
	
	c = document.createElement('canvas');
	video        = document.getElementsByTagName('video')[0];
	video_parent = video.parentElement;
	video_style  = video.style;
	video.remove();
	
	box = document.createElement('div');
	vbox = document.createElement('div');
	box.appendChild(c);
	box.appendChild(vbox);
	vbox.appendChild(video);
	
	video.controls = true;
	
	box.style   = "position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%;";
	c.style     = "position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 19999999999;";
	vbox.style  = "position: fixed; top: 10%; left: 10%; right: 10%; bottom: 10%; z-index: 199999999999;";

	var w = screen.width;
	var h = screen.height;

	if (w / h > 16 / 9) {
		w = h * (16 / 9);
	} else {
		h = w / (16 / 9);
	}

	c.width = w;
	c.height = h;
	
	document.body.appendChild(box);
	box.mozRequestFullScreen();
	document.addEventListener("mozfullscreenchange", exit, true);
	
	GLOBAL_VIDEO_PARAM = video;
	genbg(w, h, function() {
		gl = c.getContext('webgl');

		r = new pglRender(gl);
		s = new pglDemoScene(gl);
		s.shdr.compileShaders(gl, SHADER_VERTEX, SHADER_FRAGMENT);
		s.init(gl);
		r.drawable = s;
		r.startLoop();
		
		video.play();
		video.style = "";
	});
}

inject_btn();
window.setInterval(inject_btn, 2000);