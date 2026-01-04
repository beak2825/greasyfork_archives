// ==UserScript==
// @name         NF_NoPreviewAndMusicXML
// @namespace    http://halleonard.com/
// @version      1.0
// @description  Sets'preview=false' on halleonard note flight viewer and adds a DL button for music.XML
// @author       cw2k
// @match        *://*.halleonard.com/nf/*
// @match        *://sheetmusicdirect.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39133/NF_NoPreviewAndMusicXML.user.js
// @updateURL https://update.greasyfork.org/scripts/39133/NF_NoPreviewAndMusicXML.meta.js
// ==/UserScript==
//
// Quickens the way to get stuff from http://sheetmusicdirect.com
// ... and saves money - since now
// -> The preview will contain ALL pages !
// -> you'll get the music.XML that's the key for your creativity
//    the 'source code' that'll enable you to much more than
//    just print out the sheet
//
//
//  So what can you do with the music.XML?
//    -> load it in Muscore, Finale, Capella, Sibelius Guitar Pro or what
//      even you do or will do your compositions or music sheet layouts.
//
//      If you don't know any of these yet I promote 'Musecore' 
//      it's the only one that is free & open source.
//      And to me that's open source is the only 'thing' that can really 'live'
//      everybody can take part in it and contributes its little part.
//      Just look how powerfull Wikipedia and Linux have became!

(function() {
    'use strict';

 // Get Noteflight Viewer Iframe	
	var nf = $('iframe#noteflight-viewer');
	
 // parse .src params
	var url = new URL(nf[0].src);
	var params = url.searchParams;

						debugger;
 // query preview
	if ( params.has('preview') ) {
		try {
			console.info('Wow!');

		 // set preview to false
			params.set('preview','false');
			//params.set('hidePlaybackControls','false');

		 // set copy .src string back into DOM 
			nf[0].src=url.toString();

			var musicXML = params.get('url');
			console.info( musicXML );
			console.info('^- Es la curacao.');
		} catch(e) 	{
			console.error("NF_NoPreviewAndMusicXML::setPreviewFalse " + e);
		}
		
		setMusicXML( musicXML );
		
	}
	
	// https://haldms.halleonard.com/nfviewer-20170313/?url=%2F%2Fhalleonard-musicxml.s3.amazonaws.com...
	//...
	//            C.isPreview = function() {
    //               return C.scoreEditor.viewer() && 
	//				   "true" == 
	//				  	     C.scoreEditor.viewerParams.preview || 
	//				   	 C.score().editor_configuration.preview()
    //        }

	console.info('Chao.');

	
	function setMusicXML( musicXML ) {

		if (musicXML.length) {

			try {
				//debugger;

				var btnGrp_DL = $('.btn-group--download');
				var btn_DL = $("button",btnGrp_DL);
	//var b=a.a;
				var btnGrp_DLxml = btnGrp_DL.clone(true);
				var btn_DLxml = $("button",btnGrp_DLxml);

				btn_DLxml.attr( "data-tooltip", "Download MusicXML" ) ;
				btn_DLxml.attr( "data-action", "" ) ;
				btn_DLxml.children().text( " xml" ) ;
				
				btn_DLxml.bind( "click", function(a) {
					debugger;
					//scoreView = new NFClient.ScoreView(NF_ID,"",options)
					//document.write(  scoreView.getMusicXML().toString() ) ;
					window.open( musicXML, "_blank" );
				});
				btn_DLxml.attr( "title", "Bugfix/ Workaround (Press ctrl + s to finally save the xml)");

				btnGrp_DL.append( btnGrp_DLxml );

			} catch(e){
				console.error(e);
				setMusicXML_fallback ( musicXML );
			}

		}

	}
	function setMusicXML_fallback ( musicXML ) {
		try {
			
 			var newLink = document.createElement('a');
			newLink.text = "Download MusicXML";
			newLink.href = musicXML;
			newLink.setAttribute(  'target',		"_blank");
			newLink.title = "Bugfix/ Workaround (Press ctrl + s to finally save the xml)";
			
			newLink.setAttribute(  
				'style',
				"position: absolute; \
				left: 50%; \
				z-index: 1;"
			);
			
			newLink.setAttribute(  'download' );//, "Music.XML" );

			document.body.prepend(newLink);
			
		} catch(e){
				console.error(e);
				alert("Error in NF_NoPreviewAndMusicXML::setMusicXML()" + e );
		}
	}

	
	
}
)();

// Louis Armstrong: St. Louis Blues (https://www.sheetmusicdirect.com/se/ID_No/71657/Product.aspx)
// 	P R E V I E W: 	  https://haldms.halleonard.com/nf/preview/146/134671
//	
// 	P E R F O R M:	  https://haldms.halleonard.com/nf/viewer/1B413CC80CB84DC5A50F2F240689F9F5/perform
// 	P R I N T    :    https://haldms.halleonard.com/nf/download/B10F82F562A342BA96F200AD50C7DADD/inline
// 	D O W N L O A D:  https://haldms.halleonard.com/nf/download/B10F82F562A342BA96F200AD50C7DADD
// 	https://www.sheetmusicdirect.com/de-DE/Account/PrintScore.aspx?ID_No=71657
// 	^- At this level not attackable.
//	
//P R I N T 
//	https://haldms.halleonard.com/nf/download/87B64E64EA9B4B6C9938862194057A1B/inline
//		direct server redirect via Respond - 'Location:' to
//		https://halleonard-pdf-restricted.s3.amazonaws.com/personalized/87B64E64EA9B4B6C9938862194057A1B.pdf?response-content-disposition=attachment%3B%20filename%3D%22st-louis-blues.pdf%22&response-content-type=application%2Fpdf&AWSAccessKeyId=AKIAJZU27QVNIHBBIOIQ&Expires=1522703840&Signature=1DRgozvCHWBzRJlGDgfBky3rotU%3D
//			
// P E R F O R M
//	https://haldms.halleonard.com/nf/viewer/505565DA200642DA8EAA5C7DD0837730/perform
//		https://halleonard-musicxml-restricted.s3.amazonaws.com/sheetmusic-full-gz/HL_DDS_0000000000520893.xml.gz?AWSAccessKeyId=AKIAJZU27QVNIHBBIOIQ&Expires=1522699324&Signature=mfJt8EddKmDtjB3eP4vqB0kdaN0%3D
//			GET /sheetmusic-full-gz/HL_DDS_0000000000520893.xml.gz?AWSAccessKeyId=AKIAJZU27QVNIHBBIOIQ&Expires=1522699324&Signature=mfJt8EddKmDtjB3eP4vqB0kdaN0%3D
//			Host: halleonard-musicxml-restricted.s3.amazonaws.com
//
// AWSAccessKeyId	= Amazon Web Services AccessKeyId
// Expires 		= seconds since epoch (1970-01-01T00:00:00Z)
// Signature 		= HMAC SHA256 
// ToCreate: we need
// 1. the message:    Known it's
//GET/x0a/x0a/x0a[Expires]/x0a/halleonard-musicxml-restricted/sheetmusic-full-gz/HL_DDS_0000000000520893.xml.gz
// 2. The Algo - kinda known look at the 'Amazon Web Services Docu'
// 3. the secret key - PROBLEM since it is unknown
