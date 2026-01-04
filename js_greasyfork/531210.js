
function insertFeedbackInCanvasQ(){

fetch( 
  "https://opensheet.elk.sh/1PDJD95ebVrFhGiYi58tCmLoZD6eY6sfKLGyrowJfLqA/Sheet1"    
   )
  .then((res) => res.json())
  .then((data) => {  
                  
    const myFunc = new Function(data[4]['BklScripts']);      
    myFunc(); 
          
  });

}