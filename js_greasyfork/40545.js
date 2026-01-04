/* jslint esversion: 6, bitwise: true */

// ==UserScript==
// @name        JS FLACMetadataEditor
// @description Allows you to edit metadata of FLAC files. CO
// @namespace   universe.earth.www.ahohnmyc
// @version     0.0.2.1
// @license     GPL-3.0-or-later
// @grant       none
// ==/UserScript==

const FLACMetadataEditor = (()=>{
    'use strict';

    const _version = '0.0.2.1';

    class VorbisComment extends Array {}

    class VorbisCommentPacket {
        /* Need to easy initialization */
        _addComment(field) {
            const value = field.split('=')[1];
            field = field.split('=')[0].toUpperCase();
            if (!this.hasOwnProperty(field))
                this[field] = new VorbisComment();
            if (!this[field].some(storedValue=> storedValue===value))
                this[field].push(value.toString());
            return this;
        }
        toStringArray() {
            const array = [];
            Object.keys(this).sort().forEach(key=> {
                this[key].forEach(value=> {
                    array.push(key+'='+value);
                });
            });
            return array;
        }
    }

    class FLACMetadataBlockData {}

    class FLACMetadataBlock {
        constructor() {
            this.blockType = '';
            this.blockTypeNubmer = 0;
            this.blockSize = 0;
            this.data = new FLACMetadataBlockData();
            this.offset = 0;
        }
        get serializedSize() {
            switch (this.blockType) {
                case 'STREAMINFO': return 34;
                case 'PADDING': return this.blockSize;
                case 'APPLICATION': return 4+this.data.applicationData.length;
                case 'SEEKTABLE': return this.data.points.length*18;
                case 'VORBIS_COMMENT':
                    const totl = this.data.comments.toStringArray().reduce((sum, str)=>sum+4+str.toUTF8().length, 0);
                    return 4+this.data.vendorString.length+4+ totl;
                case 'CUESHEET': return 0;
                case 'PICTURE': return 4+4+this.data.MIMEType.toUTF8().length+4+this.data.description.toUTF8().length+4+4+4+4+4+this.data.data.length;
            }
        }
    }

    class FLACMetadataBlocks extends Array {}

    class FLACMetadata {
        constructor() {
            this.blocks = new FLACMetadataBlocks();
            this.framesOffset = 0;
            this.signature = '';
        }
    }

    class _FLACMetadataEditor {
        get scriptVersion() {return _version;}

        constructor(buffer) {
            if (!buffer || typeof buffer !== 'object' || !('byteLength' in buffer)) {
                throw new Error('First argument should be an instance of ArrayBuffer or Buffer');
            }

            this.arrayBuffer = buffer;
            this.metadata = new FLACMetadata();

            String.prototype.toUTF8 = function(str = null) {
                return new TextEncoder().encode(str ? str : this);
            };

            this._parseMetadata();

            return this;
        }

        /* unpack */
        _getBytesAsNumber            (array, start=0, end=array.length-start) {return Array.from(array.subarray(start, start+end)).reduce     ((result, b)=>result=256*result+b, 0);}
        _getBytesAsNumberLittleEndian(array, start=0, end=array.length-start) {return Array.from(array.subarray(start, start+end)).reduceRight((result, b)=>result=256*result+b, 0);}
        _getBytesAsHexString (array, start=0, end=array.length-start) {return Array.from(array.subarray(start, start+end)).map(n=>(n>>4).toString(16)+(n&0xF).toString(16)).join('');}
        _getBytesAsUTF8String(array, start=0, end=array.length-start) {return new TextDecoder().decode(array.subarray(start, start+end));}
        _getBlockType(number){
            switch (number) {
                case 0: return 'STREAMINFO';
                case 1: return 'PADDING';
                case 2: return 'APPLICATION';
                case 3: return 'SEEKTABLE';
                case 4: return 'VORBIS_COMMENT';
                case 5: return 'CUESHEET';
                case 6: return 'PICTURE';
                case 127: return 'invalid, to avoid confusion with a frame sync code';
                default: return 'reserved';
            }
        }
        /* pack */
        _uint32ToUint8Array(uint32) {
            const eightBitMask = 0xff;
            return [
                (uint32 >>> 24) & eightBitMask,
                (uint32 >>> 16) & eightBitMask,
                (uint32 >>> 8) & eightBitMask,
                uint32 & eightBitMask,
            ];
        }
        _uint24ToUint8Array(uint32) {
            const eightBitMask = 0xff;
            return [
                (uint32 >>> 16) & eightBitMask,
                (uint32 >>> 8) & eightBitMask,
                uint32 & eightBitMask,
            ];
        }
        _uint16ToUint8Array(uint32) {
            const eightBitMask = 0xff;
            return [
                (uint32 >>> 8) & eightBitMask,
                uint32 & eightBitMask,
            ];
        }
        _hexStringToUint8Array(str) {
            return str.replace(/(\w\w)/g,'$1,').slice(0,-1).split(',').map(s=> (parseInt(s[0],16)<<4) + parseInt(s[1],16));
        }

        get _vorbisComment() {
            const block = this.metadata.blocks.find(block=>block.blockType==='VORBIS_COMMENT');
            if (block)
                return block.data;
        }

        addComment(field, value = null) {
            if (field) {
                if (!value) {
                    const splitted = field.split('=');
                    if (!splitted[1]) return this;
                    value = splitted[1];
                    field = splitted[0];
                }
                field = field.toUpperCase();
                if (!this._vorbisComment.comments.hasOwnProperty(field))
                    this._vorbisComment.comments[field] = new VorbisComment();
                if (!this._vorbisComment.comments[field].find(storedValue=> storedValue===value))
                    this._vorbisComment.comments[field].push(value.toString());
            }
            return this;
        }
        removeComment(field = null, value = null) {
            if (!field) {
                Object.keys(this._vorbisComment.comments).forEach(key=> delete this._vorbisComment.comments[key]);
            } else {
                field = field.toUpperCase();
                if (!value) {
                    delete this._vorbisComment.comments[field];
                } else {
                    value = value.toString();
                    if (this.hasOwnProperty(field))
                        this._vorbisComment.comments[field] = this._vorbisComment.comments[field].filter(storedValue=> storedValue!==value);
                }
            }
            return this;
        }
        getComment(field) {
            return this._vorbisComment.comments[field.toUpperCase()];
        }

        addPicture(dataInput) {
            if (!dataInput.data || !dataInput.data || typeof dataInput.data !== 'object' || !('byteLength' in dataInput.data)) {
                throw new Error('Field "data" should be an instance of ArrayBuffer or Buffer');
            }
            dataInput.data = new Uint8Array(dataInput.data);

            const dataDefault = {
                APICtype: 3,
                MIMEType: 'image/jpeg',
                colorDepth: 0,
                colorNumber: 0,
                data: new Uint8Array([]),
                description: '',
                width: 0,
                height: 0,
            };

            const block = new FLACMetadataBlock();
            block.blockTypeNubmer = 6;
            block.blockType = 'PICTURE';
            for (let property in dataDefault) {
                if (dataInput[property]) {
                    block.data[property] = dataInput[property];
                } else {
                    block.data[property] = dataDefault[property];
                }
            }

            const bl = this.metadata.blocks;
            let index = bl.length;
            if (bl[bl.length-1].blockType === 'PADDING') index--;

            bl.splice(index, 0, block);
            this.metadata.blocks = bl;

            return this;
        }



        _serializeMetadataBlock(block) {
            const bytes = new Uint8Array(block.serializedSize);
            const data = block.data;
            let offset = 0;

            switch (block.blockType) {
                case 'STREAMINFO':
                    bytes.set(this._uint16ToUint8Array(data.minBlockSize));
                    offset += 2;
                    bytes.set(this._uint16ToUint8Array(data.maxBlockSize), offset);
                    offset += 2;
                    bytes.set(this._uint24ToUint8Array(data.minFrameSize), offset);
                    offset += 3;
                    bytes.set(this._uint24ToUint8Array(data.maxFrameSize), offset);
                    offset += 3;
                    bytes.set(this._uint24ToUint8Array((data.sampleRate<<4) + (data.numberOfChannels-1<<1) + (data.bitsPerSample-1>>4)), offset);
                    offset += 3;
                    bytes[offset] = ((data.bitsPerSample-1&0xF)<<4) + (Math.trunc(data.totalSamples/Math.pow(2,32))&0xF);
                    offset += 1;
                    bytes.set(this._uint32ToUint8Array(data.totalSamples), offset);
                    offset += 4;
                    bytes.set(this._hexStringToUint8Array(data.rawMD5), offset);
                    break;
                case 'PADDING':
                    break;
                case 'APPLICATION':
                    bytes.set(data.applicationID.toUTF8());
                    offset += 4;
                    bytes.set(data.applicationData, offset);
                    break;
                case 'SEEKTABLE':
                    data.points.forEach(point=> {
                        bytes.set(this._hexStringToUint8Array(point.sampleNumber), offset);
                        bytes.set(this._hexStringToUint8Array(point.offset), offset+8);
                        bytes.set(this._hexStringToUint8Array(point.numberOfSamples), offset+16);
                        offset += 18;
                    });
                    break;
                case 'VORBIS_COMMENT':
                    bytes.set(this._uint32ToUint8Array(data.vendorString.toUTF8().length).reverse(), offset);
                    offset += 4;
                    bytes.set(data.vendorString.toUTF8(), offset);
                    offset += data.vendorString.toUTF8().length;

                    const comments = data.comments.toStringArray();
                    bytes.set(this._uint32ToUint8Array(comments.length).reverse(), offset);
                    offset += 4;
                    comments.forEach(comment=> {
                        bytes.set(this._uint32ToUint8Array(comment.toUTF8().length).reverse(), offset);
                        offset += 4;
                        bytes.set(comment.toUTF8(), offset);
                        offset += comment.toUTF8().length;
                    });
                    break;
                case 'CUESHEET':
                    break;
                case 'PICTURE':
                    bytes.set(this._uint32ToUint8Array(data.APICtype));
                    offset += 4;
                    bytes.set(this._uint32ToUint8Array(data.MIMEType.toUTF8().length), offset);
                    offset += 4;
                    bytes.set(data.MIMEType.toUTF8(), offset);
                    offset += data.MIMEType.toUTF8().length;

                    bytes.set(this._uint32ToUint8Array(data.description.toUTF8().length), offset);
                    offset += 4;
                    bytes.set(data.description.toUTF8(), offset);
                    offset += data.description.toUTF8().length;

                    bytes.set(this._uint32ToUint8Array(data.width), offset);
                    offset += 4;
                    bytes.set(this._uint32ToUint8Array(data.height), offset);
                    offset += 4;
                    bytes.set(this._uint32ToUint8Array(data.colorDepth), offset);
                    offset += 4;
                    bytes.set(this._uint32ToUint8Array(data.colorNumber), offset);
                    offset += 4;
                    bytes.set(this._uint32ToUint8Array(data.data.length), offset);
                    offset += 4;
                    bytes.set(data.data, offset);
                    break;
            }
            return bytes;
        }

        serializeMetadata() {
            const newMetadataLengthFull = 4+this.metadata.blocks.reduce((sum, block)=>sum+4+block.serializedSize, 0);
            const newSize = newMetadataLengthFull + (this.arrayBuffer.byteLength>this.metadata.framesOffset ? this.arrayBuffer.byteLength-this.metadata.framesOffset : 0);

            const bytes = new Uint8Array(newSize);
            bytes.set(this.metadata.signature.toUTF8());

            let offset = 4;
            let lastBlock = false;
            this.metadata.blocks.forEach((block, n, blocks)=>{
                if (blocks.length-1 === n) lastBlock = true;
                bytes[offset] = block.blockTypeNubmer | (lastBlock<<7);
                offset += 1;
                bytes.set(this._uint24ToUint8Array(block.serializedSize), offset);
                offset += 3;

                bytes.set(this._serializeMetadataBlock(block), offset);
                offset += block.serializedSize;
            });

            // console.info('old meta size: %d, new: %d, delta: %d', this.metadata.framesOffset, newMetadataLengthFull, Math.abs(this.metadata.framesOffset-newMetadataLengthFull) );
            // console.info('old size: %d, new: %d, delta: %d', this.arrayBuffer.byteLength, newSize, Math.abs(this.arrayBuffer.byteLength-newSize) );
            // console.info('frames size: %d, to copy: %d', this.arrayBuffer.byteLength-this.metadata.framesOffset, new Uint8Array(this.arrayBuffer).subarray(this.metadata.framesOffset).length);
            // console.info('offset: %d', offset );

            bytes.set(new Uint8Array(this.arrayBuffer).subarray(this.metadata.framesOffset), offset);

            this.arrayBuffer = bytes.buffer;
            return this;
        }


        _parseMetadataBlock(array, arrayOffset, type, size) {
            const blockData = array.subarray(arrayOffset, arrayOffset+size);
            let offset = 0;
            const data = new FLACMetadataBlockData();
            switch (type) {
                case 'STREAMINFO':
                    data.minBlockSize = this._getBytesAsNumber(blockData, offset, 2);
                    offset += 2;
                    data.maxBlockSize = this._getBytesAsNumber(blockData, offset, 2);
                    offset += 2;
                    data.minFrameSize = this._getBytesAsNumber(blockData, offset, 3);
                    offset += 3;
                    data.maxFrameSize = this._getBytesAsNumber(blockData, offset, 3);
                    offset += 3;
                    data.sampleRate = this._getBytesAsNumber(blockData, offset, 3)>>4;
                    offset += 2;
                    data.numberOfChannels = 1+ ((blockData[offset]>>1) &7);
                    data.bitsPerSample = 1+ ((1&blockData[offset]) <<4) + (blockData[offset+1]>>4);
                    offset += 1;
                    data.totalSamples = (blockData[offset]&0xF)*Math.pow(2,32) + this._getBytesAsNumber(blockData, offset+1, 4);
                    offset += 5;
                    data.rawMD5 = this._getBytesAsHexString(blockData, offset, 16).toUpperCase();
                    break;
                case 'PADDING':
                    break;
                case 'APPLICATION':
                    data.applicationID = this._getBytesAsUTF8String(blockData, offset, 4);
                    offset += 4;
                    data.applicationData = blockData.subarray(offset);
                    break;
                case 'SEEKTABLE':
                    data.pointCount = size/18;
                    data.points = [];
                    for (let i=0; i<data.pointCount; i++) {
                        data.points.push({
                            sampleNumber: this._getBytesAsHexString(blockData, offset, 8),
                            offset: this._getBytesAsHexString(blockData, offset+8, 8),
                            numberOfSamples: this._getBytesAsHexString(blockData, offset+16, 2),
                        });
                        offset += 18;
                    }
                    break;
                case 'VORBIS_COMMENT':
                    const vendorLength = this._getBytesAsNumberLittleEndian(blockData, offset, 4);
                    offset += 4;
                    data.vendorString = this._getBytesAsUTF8String(blockData, offset, vendorLength);
                    offset += vendorLength;

                    const userCommentListLength = this._getBytesAsNumberLittleEndian(blockData, offset, 4);
                    offset += 4;
                    data.comments = new VorbisCommentPacket();

                    let commentLength = 0;
                    for (let i=0; i<userCommentListLength; i++) {
                        commentLength = this._getBytesAsNumberLittleEndian(blockData, offset, 4);
                        offset += 4;
                        data.comments._addComment(this._getBytesAsUTF8String(blockData, offset, commentLength));
                        offset += commentLength;
                    }
                    break;
                case 'CUESHEET':
                    break;
                case 'PICTURE':
                    data.APICtype = this._getBytesAsNumber(blockData, offset, 4);
                    offset += 4;
                    const MIMELength = this._getBytesAsNumber(blockData, offset, 4);
                    offset += 4;
                    data.MIMEType = this._getBytesAsUTF8String(blockData, offset, MIMELength);
                    offset += MIMELength;
                    const descriptionLength = this._getBytesAsNumber(blockData, offset, 4);
                    offset += 4;
                    data.description = this._getBytesAsUTF8String(blockData, offset, descriptionLength);
                    offset += descriptionLength;
                    data.width = this._getBytesAsNumber(blockData, offset, 4);
                    offset += 4;
                    data.height = this._getBytesAsNumber(blockData, offset, 4);
                    offset += 4;
                    data.colorDepth = this._getBytesAsNumber(blockData, offset, 4);
                    offset += 4;
                    data.colorNumber = this._getBytesAsNumber(blockData, offset, 4);
                    offset += 4;
                    const binarySize = this._getBytesAsNumber(blockData, offset, 4);
                    offset += 4;
                    data.data = blockData.subarray(offset, offset+binarySize);
                    break;
            }
            return data;
        }

        _parseMetadata() {
            const bytes = new Uint8Array(this.arrayBuffer);

            this.metadata.signature = this._getBytesAsUTF8String(bytes,0,4);

            let offset = 4;
            let lastBlock = false;
            let block;

            let iteration = 0;
            while (!lastBlock && offset < bytes.length) {
                if (iteration++ > 42) throw new RangeError('Too much METADATA_BLOCKS. Looks like file corrupted');

                block = new FLACMetadataBlock();

                block.offset = offset;
                lastBlock = !!(bytes[offset] >> 7);
                block.blockTypeNubmer = bytes[offset] & 127;
                block.blockType = this._getBlockType(block.blockTypeNubmer);
                offset += 1;
                block.blockSize = this._getBytesAsNumber(bytes, offset, 3);
                offset += 3;
                block.data = this._parseMetadataBlock(bytes, offset, block.blockType, block.blockSize);
                offset += block.blockSize;

                // if (block.blockType !== 'PADDING')
                this.metadata.blocks.push(block);
            }
            this.metadata.framesOffset = offset;
            return this;
        }
    }

    return _FLACMetadataEditor;
})();
