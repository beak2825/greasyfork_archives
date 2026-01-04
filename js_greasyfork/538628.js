window.parseGeminiStream = async function(reader, onChunk) { //Processes the Gemini API stream
  for (let buffer = '', partialMarkdown = '';;) { //Loop indefinitely to process the stream
    const { value, done } = await reader.read(); //Read the next chunk from the stream
    if (done) break; //Exit the loop if the stream is finished
    buffer += new TextDecoder().decode(value, { stream: true }); //Decode binary chunk to string and append to buffer
    for (var startIdx = 0, openBrace, balance, closeBrace, item, inString; (openBrace = buffer.indexOf('{', startIdx)) !== -1;) { //Find the start of a JSON object
      for (balance = 1, closeBrace = openBrace + 1, inString = false; balance && closeBrace < buffer.length; closeBrace++) { //Find the corresponding end of the JSON object
        if (buffer[closeBrace] === '"' && buffer[closeBrace - 1] !== '\\') inString = !inString; //Toggle string state on unescaped quotes to handle code blocks with {} symbols in JSON
        if (!inString) balance += (buffer[closeBrace] === '{') - (buffer[closeBrace] === '}'); //Count braces only outside strings to avoid breaking on code symbols like {}
      }
      if (balance) break; //If the object is incomplete, wait for more chunks
      item = JSON.parse(buffer.substring(openBrace, closeBrace)); //Parse the complete JSON object
      partialMarkdown += item.candidates?.[0]?.content?.parts?.[0]?.text || ''; //Append the text from the current chunk
      onChunk(item, partialMarkdown); //Execute the callback with the parsed data and accumulated text
      startIdx = closeBrace; //Move the starting position for the next search
    }
    buffer = buffer.substring(startIdx); //Discard the processed part of the buffer
  }
}