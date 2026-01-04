// ==UserScript==
// @name			Satisfactory Collectable Tracker
// @namespace		luxferre.dev
// @version 		1.0.0
// @description		Plugin for the satisfactory map
// @author			Lux-Ferre
// @license			MIT
// @match			*://satisfactory-calculator.com/en/interactive-map*
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/510460/Satisfactory%20Collectable%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/510460/Satisfactory%20Collectable%20Tracker.meta.js
// ==/UserScript==

class CollectableTracker{
	constructor(){
		this.found_harddrives = []
		this.found_spheres = []
		this.found_sloops = []
		this.load()
		setTimeout(() => {
			ct.init()
		}, 3000)
	}
	
	init(){
		for (const [key, marker] of Object.entries(SCIM.map.availableLayers.hardDrives._layers)) {
			if (this.found_harddrives.includes(marker.options.pathName)){
				SCIM.map.leafletMap.removeLayer(marker)
			} else {
				marker.on("click", e=>{
					this.mark_found_hd(e)
					this.refresh_hd_markers()
				})
			}
		}
		for (const [key, marker] of Object.entries(SCIM.map.availableLayers.mercerSpheres._layers)) {
			if (this.found_spheres.includes(marker.options.pathName)){
				SCIM.map.leafletMap.removeLayer(marker)
			} else {
				marker.on("click", e=>{
					this.mark_found_spheres(e)
					this.refresh_sphere_markers()
				})
			}
		}
		for (const [key, marker] of Object.entries(SCIM.map.availableLayers.somersloops._layers)) {
			if (this.found_spheres.includes(marker.options.pathName)){
				SCIM.map.leafletMap.removeLayer(marker)
			} else {
				marker.on("click", e=>{
					this.mark_found_sloops(e)
					this.refresh_sloop_markers()
				})
			}
		}
		this.refresh_sloop_markers()
	}
	
	save(){
		const hd_str = JSON.stringify(this.found_harddrives)
		localStorage.setItem("plugin_hd_found", hd_str)
		const sphere_str = JSON.stringify(this.found_spheres)
		localStorage.setItem("plugin_sphere_found", sphere_str)
		const sloop_str = JSON.stringify(this.found_sloops)
		localStorage.setItem("plugin_sloop_found", sloop_str)
	}
	
	load(){
		const hd_str = localStorage.getItem("plugin_hd_found")
		if (hd_str){this.found_harddrives = JSON.parse(hd_str)}
		const sphere_str = localStorage.getItem("plugin_sphere_found")
		if (sphere_str){this.found_spheres = JSON.parse(sphere_str)}
		const sloop_str = localStorage.getItem("plugin_sloop_found")
		if (sloop_str){this.found_sloops = JSON.parse(sloop_str)}
	}
	
	mark_found_hd(e){
		this.found_harddrives.push(e.target.options.pathName)
		this.save()
	}
	
	refresh_hd_markers(){
		for (const [key, marker] of Object.entries(SCIM.map.availableLayers.hardDrives._layers)) {
			if (this.found_harddrives.includes(marker.options.pathName)){
				SCIM.map.leafletMap.removeLayer(marker)
			}
		}
	}
	
	mark_found_spheres(e){
		this.found_spheres.push(e.target.options.pathName)
		this.save()
	}
	
	refresh_sphere_markers(){
		for (const [key, marker] of Object.entries(SCIM.map.availableLayers.mercerSpheres._layers)) {
			if (this.found_spheres.includes(marker.options.pathName)){
				SCIM.map.leafletMap.removeLayer(marker)
			}
		}
	}
	
	mark_found_sloops(e){
		this.found_sloops.push(e.target.options.pathName)
		this.save()
	}
	
	refresh_sloop_markers(){
		for (const [key, marker] of Object.entries(SCIM.map.availableLayers.somersloops._layers)) {
			if (this.found_sloops.includes(marker.options.pathName)){
				SCIM.map.leafletMap.removeLayer(marker)
			}
		}
	}
}

window.ct = new CollectableTracker()