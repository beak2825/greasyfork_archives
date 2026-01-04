// ==UserScript==
// @name        Coldland map
// @namespace   nf
// @include     http://neverfate.ru/dun_coldland.php*
// @version     1.0
// @grant       none
// @description Карта холодной страны
// @downloadURL https://update.greasyfork.org/scripts/35989/Coldland%20map.user.js
// @updateURL https://update.greasyfork.org/scripts/35989/Coldland%20map.meta.js
// ==/UserScript==


const storage = {
	get () {
		return localStorage.getItem.apply(localStorage, arguments);
	},
	set () {
		return localStorage.setItem.apply(localStorage, arguments);
	},
	
	CAMPAIGN_KEY: 'coldland-userscript-campaign',
	MAP_KEY: 'coldland-userscript-map',
};


function Point ( a )
{
	this.x = 0;
	this.y = 0;
	
	if ( a instanceof Array ) {
		this.x = a[0];
		this.y = a[1];
	}
	
}

Point.prototype.toArray = function ()
{
	return [this.x, this.y];
};
Point.prototype.toStringFormat = function () {
	return ;
};
Point.prototype.toText = function () {
	return "["+this.toArray().join(",")+"]";
};
Point.prototype.toString = function () {
	return String.fromCharCode(('A'.charCodeAt(0)+this.x)) + (this.y+1);
};
Point.prototype.toObject = function () {
	return {
		x: this.x,
		y: this.y,
	};
};

Point.fromText = function ( text ) {
	var x = 0,
		y = 0;
	var result = /^([a-z])\-?(\d\d?)$/.exec(text.toLowerCase());
	if ( result ) {
		x = result[1].charCodeAt(0) - 'a'.charCodeAt(0);
		y = parseInt(result[2]) - 1;
	}
	return new Point([x, y]);
};


const UP		= 0x01;
const RIGHT		= 0x02;
const DOWN		= 0x04;
const LEFT		= 0x08;

const VISITED	= 0x01;
const WALL_R	= 0x02;	// wall at right
const WALL_B	= 0x04;	// wall ar bottom
const EXIT		= 0x08;
const ENEMY		= 0x10;
const BOSS		= 0x20;
const SNOW		= 0x40;
const TREE		= 0x80;

const DIRECTIONS = [
	{
		label: "на север",
		bit: UP,
	},
	{
		label: "на восток",
		bit: RIGHT,
	},
	{
		label: "на юг",
		bit: DOWN,
	},
	{
		label: "на запад",
		bit: LEFT,
	},
];
DIRECTIONS.labels = function () {
	return this.map((item) => {
		return item.label;
	});
};
DIRECTIONS.labelToBit = function ( label ) {
	for ( let item of this ) {
		if ( item.label == label ) {
			return item.bit;
		}
	}
	return 0;
};

function Labirint (w, h)
{
	if ( typeof w == 'object' ) {
		h = w[1];
		w = w[0];
	}
	this.width = parseInt(w);
	this.height = parseInt(h);
	if ( this.width < 1 || this.height < 1 ) {
		throw new Error("Labirint width or height error");
	}
	
	this.data = new Array(this.width * this.height);
	for ( let i=0; i<this.height; i++ ) {
		for ( let j=0; j<this.width; j++ ) {
			let ij = i*this.width + j;
			this.data[ij] = 0;
			if ( i == this.height-1 ) {
				this.data[ij] |= WALL_B;
			}
			if ( j == this.width-1 ) {
				this.data[ij] |= WALL_R;
			}
		}
	}
};

Labirint.prototype.setDirs = function ( coords, dirs ) {
	let ij = coords.y*this.width + coords.x;
	if ( !(dirs & UP) ) {
		if ( coords.y > 0 ) {
			this.data[ij-this.width] |= WALL_B;
		}
	}
	if ( !(dirs & DOWN) ) {
		this.data[ij] |= WALL_B;
	}
	if ( !(dirs & LEFT) ) {
		if ( coords.x > 0 ) {
			this.data[ij-1] |= WALL_R;
		}
	}
	if ( !(dirs & RIGHT) ) {
		this.data[ij] |= WALL_R;
	}
};

Labirint.prototype.setCell = function ( coords, cell ) {
	let ij = coords.y*this.width + coords.x;
//	this.data[ij] &= ~SNOW;
	this.data[ij] = (this.data[ij] & (~SNOW) & (~ENEMY)) | cell;
};

Labirint.prototype.cellAt = function ( coords ) {
	return this.data[coords.y*this.width + coords.x];
};

Labirint.prototype.renderTable = function ( cursor ) {
	var tbl = document.createElement('table');
	tbl.setAttribute('cellpadding', 0);
	tbl.setAttribute('cellspacing', 0);
	tbl.setAttribute('style', 'border-collapse:collapse');
	
	// rows
	for ( let i=-1; i<=this.height; i++ ) {
		var row = document.createElement('tr');
		for ( let j=-1; j<=this.width; j++ ) {
			var td = null;
			if (
				i > -1 && i < this.height
				&& j > -1 && j < this.width
			) {
				// regular cell
				td = document.createElement('td');
				var coords = (new Point([j, i]));
				var cell = this.cellAt(coords);
				if ( cursor && cursor.x == coords.x && cursor.y == coords.y ) {
					// http://imgs.neverfate.ru/i/marker.gif
					var img = document.createElement('img');
					img.setAttribute('src', 'http://imgs.neverfate.ru/i/marker.gif');
					img.setAttribute('style', 'width:20px;height:20px;');
					img.setAttribute('title', coords.toString());
					td.append(img);
				} else {
					td.append(document.createTextNode(coords.toString()));
				}
				td.style.width = td.style.height = '28px';
				td.style.border = '2px solid rgba(50,0,0,.25)';
				td.style.fontSize = '9px';
				td.style.textAlign = 'center';
				td.style.color = '#666';
				if ( cell & WALL_R ) {
					td.style.borderRightColor = '#000';
				}
				if ( cell & WALL_B ) {
					td.style.borderBottomColor = '#000';
				}
				if ( cell & VISITED ) {
					td.style.backgroundColor = 'rgba(255,255,255,.1)';
				} else {
					td.style.backgroundColor = 'rgba(0,0,0,.2)';
				}
				if ( cell & ENEMY ) {
					td.style.backgroundColor = 'rgba(255,0,0,.25)';
				}
				if ( cell & BOSS ) {
					td.style.backgroundColor = 'rgba(255,100,100,1)';
				}
				if ( cell & SNOW ) {
					td.style.backgroundColor = 'rgba(255,255,255,1)';
				}
				if ( cell & EXIT ) {
					td.style.backgroundColor = 'rgba(0,255,0,.8)';
				}
				if ( cell & TREE ) {
					td.style.backgroundColor = 'rgba(0,200,0,.5)';
				}
			} else {
				// some headers
				td = document.createElement('th');
				td.style.border = '2px solid #000';
				td.style.color = '#555';
				td.style.padding = '2px';
				if (
					( i == -1 || i == this.height )
					&& ( j == -1 || j == this.width )
				) {
					// empty cell
				} else if ( i == -1 || i == this.height ) {
					td.append(document.createTextNode(String.fromCharCode('A'.charCodeAt(0) + j)));
				} else if ( j == -1 || j == this.width ) {
					td.append(document.createTextNode(i+1));
				}
			}
			row.append(td);
		}
		tbl.append(row);
	}
	return tbl;
};

Labirint.prototype.saveToStorage = function ( id ) {
	storage.set(id, JSON.stringify({
		width: this.width,
		height: this.height,
		data: this.data,
	}));
};

Labirint.prototype.loadFromStorage = function ( id ) {
	var obj = JSON.parse(storage.get(id));
	if (
		obj.width == this.width
		&& obj.height == this.height
		&& obj.data
		&& obj.data.length == this.data.length
	) {
		this.data = obj.data;
	}
};



var map = new Labirint(15, 15);


(function (doc) {
	
	var $cnt = doc.querySelector('.tbl_main_frame_15 > table > tbody > tr > td:nth-child(1)');
	var $cnt2 = doc.querySelector('.tbl_main_frame_15 > table > tbody > tr > td:nth-child(3)');
	
//	$cnt.style.border = "2px solid red";
	
	var dirs = 0;
	for ( let $btn of $cnt2.querySelectorAll('.button_box[onclick*="gom"]') ) {
		dirs |= DIRECTIONS.labelToBit($btn.textContent.trim().toLowerCase());
	}
	
	var text = $cnt2.textContent.toLowerCase();
	
	// read campaign unique identifier and current position
	var campaignId = /поход начат \d\d\.\d\d\.\d{4} . \d\d:\d\d/.exec(text)[0] || 0;
	var coords = Point.fromText(/расположение: (\w\-\d{1,2})/.exec(text)[1]);
	
	if ( storage.get(storage.CAMPAIGN_KEY) == campaignId ) {
		map.loadFromStorage(storage.MAP_KEY);
	}
	
	map.setDirs(coords, dirs);
	var cell = VISITED;
	text = $cnt.textContent.toLowerCase().trim();
	if ( text.indexOf('проходик в родной мир') > 0 ) {
		cell |= EXIT;
	}
	if ( text.indexOf('есть снеговик') > 0 ) {
		cell |= ENEMY;
	}
	if ( text.indexOf('снежный холмик') > 0 || text.indexOf('снегогвик рассыпался') > 0 ) {
		cell |= SNOW;
	}
	if ( text.indexOf('здоровый какой медведь') > 0 ) {
		cell |= BOSS;
	}
	if ( text.indexOf('ёоо-лочке') > 0 ) {
		cell |= TREE;
	}
	map.setCell(coords, cell);
	
	var $map = doc.createElement('div');
	$map.append(map.renderTable(coords));
	
	$cnt.insertBefore($map, $cnt.firstChild);
	
	if ( campaignId ) {
		storage.set(storage.CAMPAIGN_KEY, campaignId);
		map.saveToStorage(storage.MAP_KEY);
	}
	
})(document);
