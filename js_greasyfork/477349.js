var loader = {
	baseUrl: "",
	css(path) {
		if (!path) {
			throw new Error("loader css argument " + path + " is required !")
		}
		var arr = typeof path == "string" ? [path] : path,
			head = document.getElementsByTagName("head")[0]
		for (var i = 0; i < arr.length; i++) {
			path = this.baseUrl + arr[i]
			if (!path) continue
			var link = document.createElement("link")
			link.rel = "stylesheet"
			link.type = "text/css"
			link.href = path
			head.appendChild(link)
		}
	},
	js(path, charset) {
		if (!path) {
			throw new Error('loader js argument "path" is required !')
		}
		var arr = typeof path == "string" ? [path] : path,
			head = document.getElementsByTagName("head")[0]
		for (var i = 0; i < arr.length; i++) {
			path = this.baseUrl + arr[i]
			if (!path) continue
			var script = document.createElement("script")
			script.type = "text/javascript"
			script.src = path
			if (charset) {
				script.charset = charset
			}
			head.appendChild(script)
		}
	},
}
