const storage = {
	//封装操作localstorage本地存储的方法
	//存储
	set(key, value) {
		localStorage.setItem(key, JSON.stringify(value))
	},
	//取出数据
	get(key) {
		const value = localStorage.getItem(key)
		if(value == null || value == '""' || value == undefined) {
			return null
		} else {
			return JSON.parse(value)
		}
	},
	// 删除数据
	remove(key) {
		localStorage.removeItem(key)
	},
	//清除所有存储
	clear() {
		localStorage.clear()
	},
}
