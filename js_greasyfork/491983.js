// ==UserScript==
// @name			IdlePixel+ Plugin Paneller
// @namespace		lbtechnology.info
// @version			1.1.0
// @description		Library which creates a modal for opening plugin panels.
// @author			Lux-Ferre
// @license			MIT
// @match			*://idle-pixel.com/login/play*
// @grant			none
// ==/UserScript==

(function() {
	if(window.Paneller) {
		// already loaded
		return;
	}

	class Paneller {
		constructor() {
			this.registered_panels = []
			this.uit_found = 0
			
			this.addStyles()
			this.createModal()
			this.registerPanel("varviewer", "Var Viewer")
			
			const onlineCount = $(".game-top-bar .gold:not(#top-bar-admin-link)");
			onlineCount.before(`<a href="#" class="hover float-end link-no-decoration" id="panellerLink">Panel Selector</a>`);
			
			$("#panellerLink").attr("onclick", "event.preventDefault(); Paneller.showModal()")
		}
	
		addStyles(){
			$("head").append(`
				<style id="styles-paneller">
					#panellerLink {
						margin: 0 20px;
					}
					.panellerModalInner {
						background-color: white;
						color: black;
					}

					#panellerModalHeader {
						padding: calc(var(--bs-modal-padding) - var(--bs-modal-header-gap) * .5);
						background-color: var(--bs-modal-header-bg);
						border-bottom: var(--bs-modal-header-border-width) solid var(--bs-modal-header-border-color);
						border-top-right-radius: var(--bs-modal-inner-border-radius);
						border-top-left-radius: var(--bs-modal-inner-border-radius);
					}

					#panellerModal .modal-body {
						overflow-y: auto;
					}
															 
					.panellerModalButton {
						background-color: RGBA(1, 150, 150, 0.5);
						margin-bottom: 2px;
						cursor: pointer;
					}
			
					.panellerModalText {
						margin-left: 20px;
					}
					#panellerModalDialogue {
					    margin-top: 20vh;
					}
				</style>
			`)
		}
	
		registerPanel(panelName, displayName, target="panel"){
			this.registered_panels.push({
				name: panelName,
				display: displayName,
				target: target
			})
		}
	
		createModal(){
				const modalString = `
					<div id="panellerModal" class="modal fade" role="dialog" tabindex="-1"">
						<div id="panellerModalDialogue" class="modal-dialog" role="document">
							<div id="panellerModalInner" class="modal-content panellerModalInner">
								<div id="panellerModalHeader" class="modal-header text-center">
									<h3 class="modal-title w-100"><u>Panel Selector</u></h3>
								</div>
								<div class="modal-body">
									<div id="panellerModalList" class="overflow-auto"></div>
								</div>
							</div>
						</div>
					</div>
				`
	
			const modalElement = $.parseHTML(modalString)
			$(document.body).append(modalElement)
		}
	
		populateModal(){
			const panellerModalList = $("#panellerModalList")
			panellerModalList.empty()
			
			this.registered_panels.forEach(panel => {
				const newItemString = `<div class="d-flex justify-content-between rounded-pill panellerModalButton" data-panelName="${panel.name}"><span class="panellerModalText">${panel.display}</span></div>`
				const newItemElement = $.parseHTML(newItemString)
				panellerModalList.append(newItemElement)
			})

			$(".panellerModalButton").attr("onclick", "Paneller.switchPanel(this.getAttribute('data-panelName'))")
		}
	
		showModal(){
			if (this.uit_found === 0){
				if ("ui-tweaks" in IdlePixelPlus.plugins){
					this.uit_found = 1
					const backgroundColour = IdlePixelPlus.plugins["ui-tweaks"].config["color-chat-area"]
					const textColour = IdlePixelPlus.plugins["ui-tweaks"].config["font-color-chat-area"]
					$("head").append(`
						<style id="styles-paneller-annex">
							.panellerModalInnerUIT {
								background-color: ${backgroundColour};
								color: ${textColour};
							}
						</style>
					`)
					$("#panellerModalInner").removeClass("panellerModalInner").addClass("panellerModalInnerUIT")
				} else {
					this.uit_found = -1
				}
			}
			this.populateModal()
			
			document.body.scrollTop = document.documentElement.scrollTop = 0;
			$('#panellerModal').modal('show')			
		}
	
		switchPanel(panelName){
			this.registered_panels.forEach(panel=>{
				if(panel.name===panelName){
					if(panel.target==="panel"){
						IdlePixelPlus.setPanel(panelName)
					} else {
						panel.target.apply()
					}
				}
			})

			$('#panellerModal').modal('hide')
		}
	}

	// Add to window and init
	window.Paneller = new Paneller();
})();