const c = document.createElement("canvas");
const ctx = c.getContext("2d");

const imageToBlob = (imageURL) => {
	const img = new Image;
	img.crossOrigin = "";
	img.src = imageURL;
	return new Promise(resolve => {
		img.onload = function () {
			c.width = this.naturalWidth;
			c.height = this.naturalHeight;
			ctx.drawImage(this, 0, 0);
			c.toBlob((blob) => {
				resolve(blob)
			}, "image/png", 0.75);
		};
	})
}

const toggleAttribute = (elem, attr, val) => {
	const tgattr = (elem, attr, val) => {
		if (elem.hasAttribute(attr)) {
			let atrval = elem.getAttribute(attr);
			if (atrval.includes(val)) {
				let rep = atrval.replace(val, '');
				!rep.length ? elem.removeAttribute(attr) : elem.setAttribute(attr, rep);
			} else elem.setAttribute(attr, elem.getAttribute(attr) + val);
		} else elem.setAttribute(attr, val);
	}

	if (elem instanceof Array) {
		for (let key in elem) {
			tgattr(elem[key], attr, val);
		}
	} else tgattr(elem, attr, val);
}

const awaitSelector = (selector) => {
	return new Promise((resolve) => {
		const nodes = [];
		setInterval(() => {
			if (nodes.length !== 0) {
				clearInterval(tm);
				resolve(nodes);
			}
			nodes.splice(nodes.length, 0, ...document.querySelectorAll(selector));
		}, 100);
	});
}